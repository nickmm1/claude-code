import Anthropic from "@anthropic-ai/sdk";
import { Request, Response } from "express";
import multer from "multer";
import { preprocessAllFiles } from "./file-preprocessor";
import { checkEmailRateLimit } from "./access-auth";
import { saveReportToNotion } from "./notion-crm";
import { getSystemPrompt, buildUserMessage } from "./analyze-prompt";
import type { AnalyzeFormData, PreviousReportData } from "./analyze-prompt";
import { parseStructuredReport, extractAirtableMetrics, extractMetricsFromText } from "./analyze-parser";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/pdf",
      "text/plain",
    ];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(csv|xlsx|xls|pdf|txt)$/i)) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV, Excel, PDF, and TXT files are accepted."));
    }
  },
});

async function findPrimaryClientRecordId(email: string): Promise<string | null> {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key) return null;
  const filterFormula = encodeURIComponent(`{⚡️ Email}="${email}"`);
  const response = await fetch(
    `https://api.airtable.com/v0/appo1o8n17v0uHt5x/tblbOzCKJez16kK4N?filterByFormula=${filterFormula}&maxRecords=1`,
    { headers: { Authorization: `Bearer ${key}` } }
  );
  if (!response.ok) return null;
  const data = (await response.json()) as { records: Array<{ id: string }> };
  return data.records.length > 0 ? data.records[0].id : null;
}

async function saveToAirtable(data: {
  salonName: string;
  email: string;
  businessModel: string;
  analysisDate: string;
  totalRevenue: string;
  realRevenue: string;
  stage: string;
  topBottleneck: string;
  fullReport: string;
  structuredJson?: string;
  cashReserves?: string;
  totalClients?: string;
  desiredOwnerSalary?: string;
  totalPayroll?: string;
  numberOfEmployees?: string;
  avgHourlyWage?: string;
  totalHoursWorked?: string;
}) {
  try {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    if (!AIRTABLE_API_KEY) return;

    const BASE_ID = "appo1o8n17v0uHt5x";
    const TABLE_NAME = "AI%20Accountant%20Reports";

    const primaryRecordId = await findPrimaryClientRecordId(data.email);

    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          "Salon Name": data.salonName,
          Email: data.email,
          "Analysis Date": data.analysisDate,
          "Business Model": data.businessModel,
          "Total Revenue": data.totalRevenue,
          "Real Revenue": data.realRevenue,
          Stage: data.stage,
          "Top Bottleneck": data.topBottleneck,
          "Full Report": data.fullReport,
          ...(data.structuredJson ? { "Structured JSON": data.structuredJson } : {}),
          ...(data.cashReserves ? { "Cash Reserves": parseFloat(data.cashReserves) } : {}),
          ...(data.totalClients ? { "Total Clients": parseFloat(data.totalClients) } : {}),
          ...(data.desiredOwnerSalary ? { "Desired Owner Salary": parseFloat(data.desiredOwnerSalary) } : {}),
          ...(data.totalPayroll ? { "Total Payroll": parseFloat(data.totalPayroll) } : {}),
          ...(data.numberOfEmployees ? { "Number of Employees": parseFloat(data.numberOfEmployees) } : {}),
          ...(data.avgHourlyWage ? { "Average Hourly Wage": parseFloat(data.avgHourlyWage) } : {}),
          ...(data.totalHoursWorked ? { "Total Hours Worked": parseFloat(data.totalHoursWorked) } : {}),
          ...(primaryRecordId ? { "Primary Client Record": [primaryRecordId] } : {}),
        },
      }),
    });

    if (!response.ok) {
      console.error("Airtable save failed:", await response.text());
    }
  } catch (err) {
    console.error("Airtable error:", err);
  }
}

/**
 * Fetch the most recent past report for month-over-month comparison.
 */
async function fetchPreviousReport(email: string): Promise<PreviousReportData | undefined> {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key || !email) return undefined;

  try {
    const filterFormula = encodeURIComponent(`AND({Email}="${email}", {Total Revenue}!="")`);
    const response = await fetch(
      `https://api.airtable.com/v0/appo1o8n17v0uHt5x/AI%20Accountant%20Reports?filterByFormula=${filterFormula}&sort[0][field]=Analysis%20Date&sort[0][direction]=desc&maxRecords=1`,
      { headers: { Authorization: `Bearer ${key}` } }
    );
    if (!response.ok) return undefined;

    const data = (await response.json()) as {
      records: Array<{ fields: Record<string, unknown> }>;
    };
    if (data.records.length === 0) return undefined;

    const fields = data.records[0].fields;
    const totalRevStr = (fields["Total Revenue"] as string) || "";
    const realRevStr = (fields["Real Revenue"] as string) || "";

    const parseDollar = (s: string) => parseFloat(s.replace(/[$,]/g, "")) || 0;

    let force4Score: number | undefined;
    const structuredJson = fields["Structured JSON"] as string | undefined;
    if (structuredJson) {
      try {
        const parsed = JSON.parse(structuredJson);
        force4Score = parsed?.dashboard?.force4Score;
      } catch { /* ignore */ }
    }

    return {
      totalRevenue: parseDollar(totalRevStr),
      realRevenue: parseDollar(realRevStr),
      force4Score,
      stage: (fields["Stage"] as string) || "See report",
      analysisDate: (fields["Analysis Date"] as string) || "",
    };
  } catch {
    return undefined;
  }
}

export const analyzeHandler = [
  upload.fields([
    { name: "commissionReport", maxCount: 3 },
    { name: "bankStatement", maxCount: 2 },
  ]),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const {
        salonName, email, businessModel,
        firstName, lastName,
        totalServiceRevenue, totalRetailRevenue,
        totalClients, desiredOwnerSalary, cashReserves,
        partsAndLaborAmount,
        currentProfitPct, currentOwnerPayDollar, currentTaxPct, currentOpexPct,
        targetProfitPct, targetOwnerPayPct, targetTaxPct, targetOpexPct,
        totalPayroll, numberOfEmployees, avgHourlyWage, totalHoursWorked,
        hybridBoothRentalIncome, hybridEmployeeRevenue, hybridNumberOfBooth, hybridNumberOfEmployees,
      } = req.body;

      const hasFiles = files && Object.keys(files).length > 0;
      const hasRevenue = totalServiceRevenue || totalRetailRevenue;

      if (!hasFiles && !hasRevenue) {
        return res.status(400).json({
          error: "Please enter your revenue numbers or upload at least one file to analyze.",
        });
      }

      if (email) {
        const rateCheck = await checkEmailRateLimit(email);
        if (!rateCheck.allowed) {
          return res.status(429).json({
            error: `You already ran an analysis recently. Please wait ${rateCheck.waitMinutes} more minute${rateCheck.waitMinutes === 1 ? "" : "s"} before running another one.`,
          });
        }
      }

      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const { markdown: fileMarkdown, warnings } = hasFiles
        ? await preprocessAllFiles(files)
        : { markdown: "", warnings: [] };

      if (warnings.length > 0) {
        console.log("File preprocessing warnings:", warnings);
      }

      // Fetch previous report for month-over-month comparison
      const previousReport = await fetchPreviousReport(email);

      const formData: AnalyzeFormData = {
        salonName, email, firstName, lastName, businessModel,
        totalServiceRevenue, totalRetailRevenue,
        totalClients, desiredOwnerSalary, cashReserves,
        partsAndLaborAmount,
        currentProfitPct, currentOwnerPayDollar, currentTaxPct, currentOpexPct,
        targetProfitPct, targetOwnerPayPct, targetTaxPct, targetOpexPct,
        totalPayroll, numberOfEmployees, avgHourlyWage, totalHoursWorked,
        hybridBoothRentalIncome, hybridEmployeeRevenue, hybridNumberOfBooth, hybridNumberOfEmployees,
      };

      const userMessage = buildUserMessage(formData, fileMarkdown, warnings, previousReport);

      const message = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 16384,
        system: getSystemPrompt(),
        messages: [{ role: "user", content: userMessage }],
      });

      const reportText =
        message.content[0].type === "text" ? message.content[0].text : "Analysis could not be completed.";

      // Try to parse structured JSON from Claude's response
      const structuredReport = parseStructuredReport(reportText);

      // Extract metrics for Airtable
      let metrics;
      if (structuredReport) {
        metrics = extractAirtableMetrics(structuredReport);
      } else {
        metrics = extractMetricsFromText(reportText);
      }

      // Save to Airtable (non-blocking)
      if (email) {
        const reportPayload = {
          salonName: salonName || "Unknown Salon",
          firstName: firstName || "",
          lastName: lastName || "",
          email,
          businessModel: businessModel || "",
          analysisDate: new Date().toISOString().split("T")[0],
          totalRevenue: metrics.totalRevenue,
          realRevenue: metrics.realRevenue,
          stage: metrics.stage,
          topBottleneck: metrics.topBottleneck,
          fullReport: reportText,
          structuredJson: structuredReport ? JSON.stringify(structuredReport) : undefined,
          cashReserves: cashReserves || undefined,
          totalClients: totalClients || undefined,
          desiredOwnerSalary: desiredOwnerSalary || undefined,
          totalPayroll: totalPayroll || undefined,
          numberOfEmployees: numberOfEmployees || undefined,
          avgHourlyWage: avgHourlyWage || undefined,
          totalHoursWorked: totalHoursWorked || undefined,
        };
        saveToAirtable(reportPayload);
        saveReportToNotion(reportPayload).catch((err) =>
          console.error("[Notion] Non-blocking sync error:", err)
        );
      }

      return res.json({
        success: true,
        report: reportText,
        structuredReport: structuredReport || null,
      });
    } catch (error: unknown) {
      console.error("Analysis error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      return res.status(500).json({ error: `Analysis failed: ${message}` });
    }
  },
];
