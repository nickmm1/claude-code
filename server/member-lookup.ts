import { Request, Response } from "express";

const SHOP = "mirabellacoaching.myshopify.com";
const AIRTABLE_BASE_ID = "appo1o8n17v0uHt5x";
const PRIMARY_CLIENT_TABLE = "tblbOzCKJez16kK4N"; // 👥 PRIMARY CLIENT RECORD
const AI_REPORTS_TABLE = "tblpdlw64wQ3pTALm";     // AI Accountant Reports
const AI_MEMBERS_TABLE = "tblChwXxMPquwACJN";      // AI Accountant Members (profiles)
const ONBOARDING_TABLE = "tblhPx1puMWCAPEhw";      // 👋 ONBOARDING FORM

interface AirtableMember {
  recordId: string;
  firstName: string;
  lastName: string;
  email: string;
  salonName: string;
  businessModel: string;
  phone: string;
  status: string;
  source: "members_table" | "primary_client" | "shopify";
}

interface PastReport {
  recordId: string;
  analysisDate: string;
  totalRevenue: string;
  realRevenue: string;
  stage: string;
  topBottleneck: string;
  fullReport: string;
}

// 1. Check AI Accountant Members table first (most accurate source)
async function findInMembersTable(email: string): Promise<AirtableMember | null> {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key) return null;

  const filterFormula = encodeURIComponent(`{Email}="${email}"`);
  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AI_MEMBERS_TABLE}?filterByFormula=${filterFormula}&maxRecords=1`,
    { headers: { Authorization: `Bearer ${key}` } }
  );

  if (!response.ok) return null;

  const data = await response.json() as {
    records: Array<{ id: string; fields: Record<string, unknown> }>;
  };

  if (data.records.length === 0) return null;

  const r = data.records[0];
  const f = r.fields;

  return {
    recordId: r.id,
    firstName: (f["First Name"] as string) || "",
    lastName: (f["Last Name"] as string) || "",
    email: (f["Email"] as string) || email,
    salonName: (f["Salon Name"] as string) || "",
    businessModel: (f["Business Model"] as string) || "",
    phone: (f["Phone"] as string) || "",
    status: "",
    source: "members_table",
  };
}

// 2. Check PRIMARY CLIENT RECORD (coaching CRM)
async function findInPrimaryClientRecord(email: string): Promise<AirtableMember | null> {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key) return null;

  const filterFormula = encodeURIComponent(`{⚡️ Email}="${email}"`);
  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${PRIMARY_CLIENT_TABLE}?filterByFormula=${filterFormula}&maxRecords=1`,
    { headers: { Authorization: `Bearer ${key}` } }
  );

  if (!response.ok) return null;

  const data = await response.json() as {
    records: Array<{ id: string; fields: Record<string, unknown> }>;
  };

  if (data.records.length === 0) return null;

  const record = data.records[0];
  const fields = record.fields;

  // Try to get salon name from onboarding form
  let salonName = "";
  let businessModel = "";

  const onboardingIds = fields["👋 Onboarding Form"] as string[] | undefined;
  if (onboardingIds && onboardingIds.length > 0) {
    const onboardingResp = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${ONBOARDING_TABLE}/${onboardingIds[0]}`,
      { headers: { Authorization: `Bearer ${key}` } }
    );
    if (onboardingResp.ok) {
      const onboardingData = await onboardingResp.json() as { fields: Record<string, unknown> };
      salonName = (onboardingData.fields["Business Name"] as string) || "";
      const modelChoice = onboardingData.fields["What type of business model do you have?"] as string | undefined;
      if (modelChoice) {
        const modelMap: Record<string, string> = {
          "Commission": "Commission-based salon",
          "Rental": "Booth rental salon",
          "Hybrid": "Hybrid (commission + booth rental)",
          "Other": "Independent stylist / solo operator",
        };
        businessModel = modelMap[modelChoice] || modelChoice;
      }
    }
  }

  return {
    recordId: record.id,
    firstName: (fields["⚡️ First Name"] as string) || "",
    lastName: (fields["⚡️ Last Name"] as string) || "",
    email: (fields["⚡️ Email"] as string) || email,
    salonName,
    businessModel,
    phone: (fields["Phone Numer"] as string) || "", // Airtable typo preserved
    status: (fields["⚡️ Status"] as string) || "",
    source: "primary_client",
  };
}

// 3. Shopify fallback
async function findInShopify(email: string): Promise<Partial<AirtableMember> | null> {
  const token = process.env.SHOPIFY_ACCESS_TOKEN;
  if (!token) return null;

  const response = await fetch(
    `https://${SHOP}/admin/api/2024-01/customers/search.json?query=email:${encodeURIComponent(email)}&limit=1`,
    {
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) return null;

  const data = await response.json() as {
    customers: Array<{
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      phone: string | null;
    }>;
  };

  if (data.customers.length === 0) return null;

  const customer = data.customers[0];
  return {
    firstName: customer.first_name || "",
    lastName: customer.last_name || "",
    email: customer.email,
    phone: customer.phone || "",
    source: "shopify",
  };
}

// Get past AI Accountant reports for a member (real reports only, not profile records)
async function getPastReports(email: string): Promise<PastReport[]> {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key) return [];

  // Filter out profile records by ensuring Total Revenue is not empty
  const filterFormula = encodeURIComponent(`AND({Email}="${email}", {Total Revenue}!="")`);
  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AI_REPORTS_TABLE}?filterByFormula=${filterFormula}&sort[0][field]=Analysis%20Date&sort[0][direction]=desc&maxRecords=20`,
    { headers: { Authorization: `Bearer ${key}` } }
  );

  if (!response.ok) return [];

  const data = await response.json() as {
    records: Array<{ id: string; fields: Record<string, unknown> }>;
  };

  return data.records.map((r) => ({
    recordId: r.id,
    analysisDate: (r.fields["Analysis Date"] as string) || "",
    totalRevenue: (r.fields["Total Revenue"] as string) || "",
    realRevenue: (r.fields["Real Revenue"] as string) || "",
    stage: (r.fields["Stage"] as string) || "",
    topBottleneck: (r.fields["Top Bottleneck"] as string) || "",
    fullReport: (r.fields["Full Report"] as string) || "",
  }));
}

// GET /api/member-lookup?email=...
export async function memberLookupHandler(req: Request, res: Response) {
  try {
    const email = ((req.query.email as string) || "").toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Priority: AI Accountant Members table → PRIMARY CLIENT RECORD → Shopify
    let member: AirtableMember | null = await findInMembersTable(email);
    
    if (!member) {
      member = await findInPrimaryClientRecord(email);
    }

    if (!member) {
      const shopifyData = await findInShopify(email);
      if (shopifyData) {
        member = {
          recordId: "",
          firstName: shopifyData.firstName || "",
          lastName: shopifyData.lastName || "",
          email,
          salonName: "",
          businessModel: "",
          phone: shopifyData.phone || "",
          status: "",
          source: "shopify",
        };
      }
    }

    const pastReports = await getPastReports(email);

    return res.json({
      found: !!member,
      source: member?.source || null,
      member: member || null,
      pastReports,
    });
  } catch (error) {
    console.error("Member lookup error:", error);
    return res.status(500).json({ error: "Lookup failed" });
  }
}

// POST /api/register - one-time registration form submission
export async function registerHandler(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, salonName, businessModel, phone } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const key = process.env.AIRTABLE_API_KEY;
    if (!key) {
      return res.status(500).json({ error: "Airtable not configured" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Step 1: Check if they already have an AI Accountant Members record
    const existingMember = await findInMembersTable(normalizedEmail);

    if (existingMember) {
      // Update existing AI Accountant Members record
      await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AI_MEMBERS_TABLE}/${existingMember.recordId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: {
              ...(firstName ? { "First Name": firstName } : {}),
              ...(lastName ? { "Last Name": lastName } : {}),
              ...(salonName ? { "Salon Name": salonName } : {}),
              ...(businessModel ? { "Business Model": businessModel } : {}),
              ...(phone ? { "Phone": phone } : {}),
            },
          }),
        }
      );
      return res.json({ success: true, action: "updated", recordId: existingMember.recordId });
    }

    // Step 2: Create new AI Accountant Members record
    const createMemberResp = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AI_MEMBERS_TABLE}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            "Email": normalizedEmail,
            "First Name": firstName || "",
            "Last Name": lastName || "",
            "Salon Name": salonName || "",
            ...(businessModel ? { "Business Model": businessModel } : {}),
            ...(phone ? { "Phone": phone } : {}),
            "Registered Date": new Date().toISOString().split("T")[0],
            "Total Analyses Run": 0,
          },
        }),
      }
    );

    if (!createMemberResp.ok) {
      const err = await createMemberResp.text();
      console.error("AI Members create failed:", err);
      return res.status(500).json({ error: "Failed to create member record" });
    }

    const createdMember = await createMemberResp.json() as { id: string };

    // Step 3: Also create/update PRIMARY CLIENT RECORD if they are not already in it
    const existingPrimary = await findInPrimaryClientRecord(normalizedEmail);
    if (!existingPrimary) {
      const createPrimaryResp = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${PRIMARY_CLIENT_TABLE}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: {
              "⚡️ First Name": firstName || "",
              "⚡️ Last Name": lastName || "",
              "⚡️ Email": normalizedEmail,
              "⚡️ Status": "New",
              "⚡️ Start Date": new Date().toISOString().split("T")[0],
              ...(phone ? { "Phone Numer": phone } : {}),
              "General Notes": `Registered via AI Accountant tool on ${new Date().toLocaleDateString("en-US")}. Salon: ${salonName || "Not provided"}. Model: ${businessModel || "Not provided"}.`,
            },
          }),
        }
      );

      if (!createPrimaryResp.ok) {
        // Non-fatal: log but don't fail the registration
        console.error("PRIMARY CLIENT RECORD create failed:", await createPrimaryResp.text());
      }
    } else {
      // Update phone if we have it and they are already in the system
      if (phone) {
        await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${PRIMARY_CLIENT_TABLE}/${existingPrimary.recordId}`,
          {
            method: "PATCH",
            headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
            body: JSON.stringify({ fields: { "Phone Numer": phone } }),
          }
        );
      }
    }

    return res.json({ success: true, action: "created", recordId: createdMember.id });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: "Registration failed" });
  }
}
