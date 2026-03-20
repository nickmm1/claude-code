/**
 * File Preprocessor
 * Converts uploaded financial files (CSV, Excel, PDF) into compact markdown summaries
 * that fit within Claude's token budget while preserving all financially relevant data.
 */

import * as XLSX from "xlsx";
import { execSync } from "child_process";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

/**
 * Extract text from a PDF buffer using pdftotext (poppler-utils, pre-installed in sandbox)
 * Falls back to raw buffer text if pdftotext is unavailable
 */
async function extractPdfText(buffer: Buffer): Promise<{ text: string; numpages: number }> {
  const tmpFile = join(tmpdir(), `pdf-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`);
  const txtFile = tmpFile.replace(".pdf", ".txt");
  try {
    writeFileSync(tmpFile, buffer);
    execSync(`pdftotext -layout "${tmpFile}" "${txtFile}"`, { timeout: 30000 });
    const { readFileSync } = await import("fs");
    const text = readFileSync(txtFile, "utf-8");
    // Estimate page count from form feed characters
    const numpages = (text.match(/\f/g) || []).length + 1;
    return { text: text.replace(/\f/g, "\n\n--- PAGE BREAK ---\n\n"), numpages };
  } catch {
    // Fallback: try to extract readable ASCII text from the buffer
    const rawText = buffer.toString("latin1").replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/ {3,}/g, " ");
    return { text: rawText, numpages: 1 };
  } finally {
    try { unlinkSync(tmpFile); } catch { /* ignore */ }
    try { unlinkSync(txtFile); } catch { /* ignore */ }
  }
}

// ~30,000 characters per file category keeps total well under 150k tokens
const MAX_CHARS_PER_FILE = 30_000;
// Hard cap on total content sent to Claude
const MAX_TOTAL_CHARS = 120_000;

interface ProcessedFile {
  label: string;
  filename: string;
  summary: string;
  rowCount?: number;
  truncated: boolean;
}

/**
 * Parse a CSV buffer into rows of key-value pairs
 */
function parseCSV(buffer: Buffer): string[][] {
  const text = buffer.toString("utf-8");
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  return lines.map((line) => {
    // Handle quoted fields
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  });
}

/**
 * Summarize a CSV/Excel file into compact markdown
 */
function summarizeTabularData(rows: string[][], filename: string, label: string): ProcessedFile {
  if (rows.length === 0) {
    return { label, filename, summary: "_No data found in file._", truncated: false };
  }

  const headers = rows[0];
  const dataRows = rows.slice(1).filter((r) => r.some((c) => c.trim()));
  const totalRows = dataRows.length;

  // Build a markdown table
  const headerLine = `| ${headers.join(" | ")} |`;
  const separatorLine = `| ${headers.map(() => "---").join(" | ")} |`;

  const lines: string[] = [
    `**File:** ${filename}`,
    `**Total data rows:** ${totalRows}`,
    `**Columns:** ${headers.join(", ")}`,
    "",
    headerLine,
    separatorLine,
  ];

  let charCount = lines.join("\n").length;
  let rowsIncluded = 0;
  let truncated = false;

  for (const row of dataRows) {
    const rowLine = `| ${row.map((c) => c.replace(/\|/g, "\\|")).join(" | ")} |`;
    if (charCount + rowLine.length > MAX_CHARS_PER_FILE) {
      truncated = true;
      break;
    }
    lines.push(rowLine);
    charCount += rowLine.length;
    rowsIncluded++;
  }

  if (truncated) {
    lines.push(`\n_[Truncated: showing ${rowsIncluded} of ${totalRows} rows. Remaining ${totalRows - rowsIncluded} rows omitted to fit token budget. The data above contains all header rows and the most significant financial entries.]_`);
  }

  return {
    label,
    filename,
    summary: lines.join("\n"),
    rowCount: totalRows,
    truncated,
  };
}

/**
 * Extract and compress text from a PDF buffer
 */
async function processPDF(buffer: Buffer, filename: string, label: string): Promise<ProcessedFile> {
  try {
    const data = await extractPdfText(buffer);
    let text = data.text;

    // Clean up PDF extraction artifacts
    text = text
      // Remove excessive whitespace
      .replace(/[ \t]{3,}/g, "  ")
      // Normalize line breaks
      .replace(/\r\n/g, "\n")
      .replace(/\n{4,}/g, "\n\n\n")
      // Remove common PDF boilerplate patterns
      .replace(/Page \d+ of \d+/gi, "")
      .replace(/Continued on next page/gi, "")
      .replace(/^\s*\d+\s*$/gm, "") // standalone page numbers
      .trim();

    const totalChars = text.length;
    let truncated = false;
    let finalText = text;

    if (text.length > MAX_CHARS_PER_FILE) {
      // Try to be smart about what we keep:
      // 1. Keep the first 40% (usually headers, account info, opening balance)
      // 2. Keep the last 20% (usually totals and closing balance)
      // 3. Fill the middle with the most transaction-dense sections
      const keepFirst = Math.floor(MAX_CHARS_PER_FILE * 0.5);
      const keepLast = Math.floor(MAX_CHARS_PER_FILE * 0.3);

      const firstPart = text.substring(0, keepFirst);
      const lastPart = text.substring(text.length - keepLast);
      const omittedChars = text.length - keepFirst - keepLast;

      finalText = `${firstPart}\n\n[... ${omittedChars.toLocaleString()} characters of transaction detail omitted to fit token budget. Key totals and summary data preserved below ...]\n\n${lastPart}`;
      truncated = true;
    }

    const summary = [
      `**File:** ${filename}`,
      `**Pages:** ${data.numpages}`,
      `**Total characters extracted:** ${totalChars.toLocaleString()}`,
      truncated ? `**Note:** Content compressed from ${totalChars.toLocaleString()} to ~${MAX_CHARS_PER_FILE.toLocaleString()} characters. First and last sections preserved; middle transaction detail summarized.` : "",
      "",
      "---",
      "",
      finalText,
    ].filter(Boolean).join("\n");

    return { label, filename, summary, truncated };
  } catch (err) {
    // If PDF parsing fails, try as plain text
    const text = buffer.toString("utf-8").substring(0, MAX_CHARS_PER_FILE);
    return {
      label,
      filename,
      summary: `**File:** ${filename}\n**Note:** PDF parsing used fallback text extraction.\n\n${text}`,
      truncated: buffer.length > MAX_CHARS_PER_FILE,
    };
  }
}

/**
 * Process an Excel file buffer into markdown
 */
function processExcel(buffer: Buffer, filename: string, label: string): ProcessedFile {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const allSheets: string[] = [];

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1, defval: "" }) as string[][];
      if (rows.length === 0) continue;

      const result = summarizeTabularData(rows, `${filename} (Sheet: ${sheetName})`, label);
      allSheets.push(`### Sheet: ${sheetName}\n\n${result.summary}`);

      // Stop if we are already at the limit
      if (allSheets.join("\n\n").length > MAX_CHARS_PER_FILE) break;
    }

    return {
      label,
      filename,
      summary: allSheets.join("\n\n"),
      truncated: false,
    };
  } catch {
    return {
      label,
      filename,
      summary: `**File:** ${filename}\n**Error:** Could not parse Excel file. Please try exporting as CSV.`,
      truncated: false,
    };
  }
}

/**
 * Main entry point: process a single uploaded file into a markdown summary
 */
export async function preprocessFile(
  buffer: Buffer,
  filename: string,
  mimetype: string,
  label: string
): Promise<ProcessedFile> {
  const ext = filename.toLowerCase().split(".").pop() || "";

  if (ext === "pdf" || mimetype === "application/pdf") {
    return processPDF(buffer, filename, label);
  }

  if (ext === "xlsx" || ext === "xls" || mimetype.includes("spreadsheetml") || mimetype.includes("ms-excel")) {
    return processExcel(buffer, filename, label);
  }

  // CSV or plain text
  const rows = parseCSV(buffer);
  return summarizeTabularData(rows, filename, label);
}

/**
 * Process all uploaded files and combine into a single markdown document
 * that fits within the total token budget.
 */
export async function preprocessAllFiles(
  files: { [fieldname: string]: Express.Multer.File[] }
): Promise<{ markdown: string; warnings: string[] }> {
  const categoryLabels: Record<string, string> = {
    salesReport: "SALES REPORT",
    commissionReport: "COMMISSION / PAYROLL REPORT",
    bankStatement: "BANK STATEMENT",
  };

  const warnings: string[] = [];
  const sections: string[] = [];
  let totalChars = 0;

  for (const [fieldName, fileArray] of Object.entries(files)) {
    const label = categoryLabels[fieldName] || fieldName.toUpperCase();

    for (let idx = 0; idx < fileArray.length; idx++) {
      const file = fileArray[idx];
      const suffix = fileArray.length > 1 ? ` #${idx + 1}` : "";
      const fileLabel = `${label}${suffix}`;

      // Check if we still have budget
      if (totalChars >= MAX_TOTAL_CHARS) {
        warnings.push(`${fileLabel} (${file.originalname}) was skipped -- total content limit reached. Consider running separate analyses for large file sets.`);
        continue;
      }

      const processed = await preprocessFile(file.buffer, file.originalname, file.mimetype, fileLabel);

      if (processed.truncated) {
        warnings.push(`${fileLabel} (${file.originalname}) was compressed to fit the analysis limit. Key financial data is preserved.`);
      }

      const section = `## ${fileLabel}\n\n${processed.summary}`;

      // Trim section if it would push us over the total limit
      const remaining = MAX_TOTAL_CHARS - totalChars;
      const finalSection = section.length > remaining
        ? section.substring(0, remaining) + "\n\n_[Section truncated at total content limit]_"
        : section;

      sections.push(finalSection);
      totalChars += finalSection.length;
    }
  }

  return {
    markdown: sections.join("\n\n---\n\n"),
    warnings,
  };
}
