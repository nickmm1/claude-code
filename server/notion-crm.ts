/**
 * Notion CRM integration for The AI Accountant
 * Saves analysis reports to the Mirabella Coaching Client CRM in Notion
 * and creates a row in the Force 4: Profit and Protection Reports database
 */

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_API_BASE = "https://api.notion.com/v1";
const CRM_DATABASE_ID = "e38f1d62-bd62-4c27-9f1f-a3af32695115";
const FORCE4_DB_ID = "317f94c1-52c5-815e-a3b7-ea55218c51c7";

interface NotionReportData {
  salonName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  businessModel: string;
  analysisDate: string;
  totalRevenue: string;
  realRevenue: string;
  stage: string;
  topBottleneck: string;
  fullReport: string;
  cashReserves?: string;
  totalClients?: string;
  desiredOwnerSalary?: string;
}

/**
 * Find a client record in the Notion CRM by email
 * Returns the page ID if found, null otherwise
 */
async function findClientByEmail(email: string): Promise<string | null> {
  if (!NOTION_API_KEY) return null;

  try {
    const response = await fetch(`${NOTION_API_BASE}/databases/${CRM_DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          property: "Email",
          email: { equals: email.toLowerCase().trim() },
        },
        page_size: 1,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json() as { results: Array<{ id: string }> };
    return data.results.length > 0 ? data.results[0].id : null;
  } catch {
    return null;
  }
}

/**
 * Normalize business model string to match Notion select options
 */
function normalizeBusinessModel(raw: string): string {
  const lower = (raw || "").toLowerCase();
  if (lower.includes("booth")) return "Booth Rental";
  if (lower.includes("hybrid")) return "Hybrid";
  if (lower.includes("independent")) return "Independent";
  return "Commission-based";
}

/**
 * Parse revenue string like "$25,000" to a number
 */
function parseRevenue(str: string): number | null {
  const cleaned = str.replace(/[$,]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * Create a row in the Force 4: Profit and Protection Reports database
 * and link it back to the client's CRM record
 */
async function createForce4ReportRow(data: NotionReportData, clientPageId: string | null): Promise<string | null> {
  if (!NOTION_API_KEY) return null;

  try {
    const reportTitle = `${data.salonName} — Accountant Report — ${data.analysisDate}`;
    const totalRevenueNum = parseRevenue(data.totalRevenue);
    const realRevenueNum = parseRevenue(data.realRevenue);

    const properties: Record<string, unknown> = {
      "Report Name": {
        title: [{ text: { content: reportTitle } }],
      },
      "Salon Name": {
        rich_text: [{ text: { content: data.salonName || "" } }],
      },
      "Email": { email: data.email },
      "Business Model": {
        select: { name: normalizeBusinessModel(data.businessModel) },
      },
      "Profit First Stage": {
        select: { name: data.stage || "Survival" },
      },
      "Top Bottleneck": {
        rich_text: [{ text: { content: data.topBottleneck || "" } }],
      },
      "Report Date": {
        date: { start: data.analysisDate },
      },
      "Full Report": {
        rich_text: [{ text: { content: data.fullReport.substring(0, 2000) } }], // Notion property limit is 2000 chars; full text appended as page blocks below
      },
    };

    if (totalRevenueNum !== null) {
      properties["Total Revenue"] = { number: totalRevenueNum };
    }
    if (realRevenueNum !== null) {
      properties["Real Revenue"] = { number: realRevenueNum };
    }
    if (data.cashReserves) {
      const reservesNum = parseFloat(data.cashReserves);
      if (!isNaN(reservesNum)) properties["Cash Reserves"] = { number: reservesNum };
    }
    if (data.totalClients) {
      const clientsNum = parseFloat(data.totalClients);
      if (!isNaN(clientsNum)) properties["Total Clients"] = { number: clientsNum };
    }
    if (data.desiredOwnerSalary) {
      const salaryNum = parseFloat(data.desiredOwnerSalary);
      if (!isNaN(salaryNum)) properties["Desired Owner Salary"] = { number: salaryNum };
    }

    // Link to the client CRM record if we found one
    if (clientPageId) {
      properties["Client"] = {
        relation: [{ id: clientPageId }],
      };
    }

    const response = await fetch(`${NOTION_API_BASE}/pages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: FORCE4_DB_ID },
        properties,
      }),
    });

    const result = await response.json() as { id?: string };
    if (result.id) {
      console.log(`[Notion] Force 4 report row created: ${reportTitle}`);

      // Append full report text as blocks on the Force 4 row page
      // Notion blocks have a 2000-char limit per rich_text item, so chunk the report
      const CHUNK_SIZE = 1900;
      const reportChunks: string[] = [];
      for (let i = 0; i < data.fullReport.length; i += CHUNK_SIZE) {
        reportChunks.push(data.fullReport.slice(i, i + CHUNK_SIZE));
      }
      const reportBlocks = reportChunks.map((chunk) => ({
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: chunk } }],
        },
      }));
      // Notion allows max 100 blocks per append; send in batches if needed
      for (let b = 0; b < reportBlocks.length; b += 100) {
        await fetch(`${NOTION_API_BASE}/blocks/${result.id}/children`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${NOTION_API_KEY}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ children: reportBlocks.slice(b, b + 100) }),
        });
      }
      console.log(`[Notion] Full report appended as blocks on Force 4 row (${reportChunks.length} chunks)`);


      // Also set the back-link on the CRM card so it shows in the Force 4 Reports column
      if (clientPageId) {
        try {
          // Get current Force 4 Reports relations on the CRM card first
          const crmPageRes = await fetch(`${NOTION_API_BASE}/pages/${clientPageId}`, {
            headers: {
              Authorization: `Bearer ${NOTION_API_KEY}`,
              "Notion-Version": "2022-06-28",
            },
          });
          const crmPage = await crmPageRes.json() as { properties?: Record<string, { relation?: Array<{ id: string }> }> };
          const existingLinks = crmPage.properties?.["Force 4 Reports"]?.relation || [];
          const alreadyLinked = existingLinks.some((r) => r.id === result.id);

          if (!alreadyLinked) {
            await fetch(`${NOTION_API_BASE}/pages/${clientPageId}`, {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${NOTION_API_KEY}`,
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                properties: {
                  "Force 4 Reports": {
                    relation: [...existingLinks, { id: result.id }],
                  },
                },
              }),
            });
            console.log(`[Notion] Back-link set on CRM card for ${clientPageId}`);
          }
        } catch (backLinkErr) {
          console.error("[Notion] Failed to set back-link on CRM card:", backLinkErr);
        }
      }

      return result.id;
    }
    return null;
  } catch (err) {
    console.error("[Notion] Error creating Force 4 report row:", err);
    return null;
  }
}

/**
 * Save an AI Accountant report to:
 * 1. The client's CRM page (updates Profit First Stage, Last AI Analysis Date, appends blocks)
 * 2. The Force 4: Profit and Protection Reports database (new row every time)
 */
export async function saveReportToNotion(data: NotionReportData): Promise<void> {
  if (!NOTION_API_KEY) {
    console.log("[Notion] No API key configured, skipping Notion save");
    return;
  }

  try {
    const clientPageId = await findClientByEmail(data.email);

    if (clientPageId) {
      // Update existing client CRM record: Profit First Stage + Last AI Analysis Date
      await fetch(`${NOTION_API_BASE}/pages/${clientPageId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            "Last AI Analysis Date": {
              date: { start: data.analysisDate },
            },
            "Profit First Stage": {
              select: { name: data.stage || "Survival" },
            },
          },
        }),
      });

      // Append Force 4 report summary + link as blocks on the client page
      // We build the blocks first, then after creating the Force 4 row we will add the link
      // For now append the summary -- link will be added after Force 4 row is created
      console.log(`[Notion] Updated client CRM record for ${data.email}`);
    } else {
      // Client not in CRM yet -- create a new CRM record
      const newPage = await fetch(`${NOTION_API_BASE}/pages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent: { database_id: CRM_DATABASE_ID },
          properties: {
            "Client Name": {
              title: [{ text: { content:
                (data.firstName || data.lastName)
                  ? `${data.firstName || ""} ${data.lastName || ""}`.trim()
                  : (data.salonName || data.email)
              } }],
            },
            "Email": { email: data.email },
            "Salon Name": {
              rich_text: [{ text: { content: data.salonName || "" } }],
            },
            "Business Model": {
              select: { name: normalizeBusinessModel(data.businessModel) },
            },
            "Last AI Analysis Date": {
              date: { start: data.analysisDate },
            },
            "Profit First Stage": {
              select: { name: data.stage || "Survival" },
            },
            "Program Phase": {
              select: { name: "Lead" },
            },
          },
          children: [
            {
              object: "block",
              type: "heading_2",
              heading_2: {
                rich_text: [{ type: "text", text: { content: `Force 4: Profit and Protection Report — ${data.analysisDate}` } }],
              },
            },
            {
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [
                  { type: "text", text: { content: `Stage: ${data.stage} | Revenue: ${data.totalRevenue} | Real Revenue: ${data.realRevenue}` } },
                ],
              },
            },
          ],
        }),
      });

      const newPageData = await newPage.json() as { id?: string };
      const newClientPageId = newPageData.id || null;
      console.log(`[Notion] Created new client CRM record for ${data.email}`);

      // Create the Force 4 report row linked to the new client page
      await createForce4ReportRow(data, newClientPageId);
      return;
    }

    // Always create a Force 4 report row (linked to client CRM record)
    const force4RowId = await createForce4ReportRow(data, clientPageId);

    // Append a linked summary block to the CRM card body
    if (clientPageId) {
      const force4Url = force4RowId
        ? `https://www.notion.so/${force4RowId.replace(/-/g, "")}`
        : null;

      const summaryBlocks: unknown[] = [
        {
          object: "block",
          type: "heading_3",
          heading_3: {
            rich_text: [{
              type: "text",
              text: { content: `Force 4 Report: ${data.analysisDate}` },
              annotations: { bold: true },
            }],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              { type: "text", text: { content: `Stage: ${data.stage}  |  Revenue: ${data.totalRevenue}  |  Real Revenue: ${data.realRevenue}` } },
            ],
          },
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              { type: "text", text: { content: `Top Bottleneck: ${data.topBottleneck}` } },
            ],
          },
        },
      ];

      if (force4Url) {
        summaryBlocks.push({
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{
              type: "text",
              text: { content: "View Full Report", link: { url: force4Url } },
              annotations: { bold: true, color: "blue" },
            }],
          },
        });
      }

      await fetch(`${NOTION_API_BASE}/blocks/${clientPageId}/children`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ children: summaryBlocks }),
      });
    }

  } catch (error) {
    console.error("[Notion] Error saving report:", error);
    // Non-blocking -- don't throw, just log
  }
}
