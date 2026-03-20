import { Request, Response } from "express";
import crypto from "crypto";

const SHOP = "mirabellacoaching.myshopify.com";
const COACHING_PRODUCT_IDS = ["8389644943526"]; // The Level Up Academy - The Core Program

// Airtable constants
const AIRTABLE_BASE_ID = "appo1o8n17v0uHt5x";
const PRIMARY_CLIENT_TABLE = "tblbOzCKJez16kK4N"; // 👥 PRIMARY CLIENT RECORD

interface ShopifyOrder {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  created_at: string;
  line_items: Array<{
    product_id: number;
    title: string;
    variant_title: string | null;
  }>;
  customer: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    orders_count: number;
  } | null;
}

// Verify the webhook came from Shopify
function verifyShopifyWebhook(body: Buffer, hmacHeader: string): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return false;
  const hash = crypto.createHmac("sha256", secret).update(body).digest("base64");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmacHeader));
}

// Find existing record in PRIMARY CLIENT RECORD by email
async function findAirtableRecordByEmail(email: string): Promise<string | null> {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key) return null;

  const filterFormula = encodeURIComponent(`{⚡️ Email}="${email}"`);
  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${PRIMARY_CLIENT_TABLE}?filterByFormula=${filterFormula}&maxRecords=1`,
    { headers: { Authorization: `Bearer ${key}` } }
  );

  if (!response.ok) return null;
  const data = await response.json() as { records: Array<{ id: string }> };
  return data.records.length > 0 ? data.records[0].id : null;
}

// Create a new PRIMARY CLIENT RECORD in Airtable
async function createAirtableRecord(order: ShopifyOrder): Promise<string | null> {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key) return null;

  const customer = order.customer;
  const firstName = customer?.first_name || order.first_name || "";
  const lastName = customer?.last_name || order.last_name || "";
  const phone = customer?.phone || order.phone || "";

  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${PRIMARY_CLIENT_TABLE}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          "⚡️ First Name": firstName,
          "⚡️ Last Name": lastName,
          "⚡️ Email": order.email,
          "⚡️ Status": "New",
          "⚡️ Start Date": new Date().toISOString().split("T")[0],
          ...(phone ? { "Phone Numer": phone } : {}), // Note: field has typo in Airtable
          "General Notes": `Auto-enrolled via Shopify purchase of "${order.line_items[0]?.title}" on ${new Date(order.created_at).toLocaleDateString("en-US")}`,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    console.error("Airtable create record failed:", err);
    return null;
  }

  const data = await response.json() as { id: string };
  console.log(`Created Airtable record for ${order.email}: ${data.id}`);
  return data.id;
}

// Check if this customer already has a previous order for this product (skip renewals)
async function isFirstTimeCustomer(email: string): Promise<boolean> {
  const token = process.env.SHOPIFY_ACCESS_TOKEN;
  if (!token) return true;

  const productIds = COACHING_PRODUCT_IDS.join(",");
  const response = await fetch(
    `https://${SHOP}/admin/api/2024-01/orders.json?email=${encodeURIComponent(email)}&status=any&limit=50`,
    {
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) return true; // If we can't check, assume first time

  const data = await response.json() as { orders: ShopifyOrder[] };
  const coachingOrders = data.orders.filter((o) =>
    o.line_items.some((item) => productIds.includes(String(item.product_id)))
  );

  // If only 1 coaching order exists, this IS the first time
  return coachingOrders.length <= 1;
}

export async function shopifyWebhookHandler(req: Request, res: Response) {
  try {
    // Verify webhook signature
    const hmacHeader = req.headers["x-shopify-hmac-sha256"] as string;
    if (!hmacHeader) {
      return res.status(401).json({ error: "Missing HMAC header" });
    }

    const rawBody = req.body as Buffer;
    if (!verifyShopifyWebhook(rawBody, hmacHeader)) {
      console.warn("Shopify webhook HMAC verification failed");
      return res.status(401).json({ error: "Invalid HMAC signature" });
    }

    const order: ShopifyOrder = JSON.parse(rawBody.toString());

    // Check if this order contains a coaching program product
    const hasCoachingProduct = order.line_items.some((item) =>
      COACHING_PRODUCT_IDS.includes(String(item.product_id))
    );

    if (!hasCoachingProduct) {
      console.log(`Order ${order.id} skipped - no coaching product`);
      return res.status(200).json({ skipped: true, reason: "No coaching product in order" });
    }

    if (!order.email) {
      console.warn(`Order ${order.id} has no email, skipping`);
      return res.status(200).json({ skipped: true, reason: "No email on order" });
    }

    const email = order.email.toLowerCase().trim();

    // Check if record already exists in Airtable
    const existingRecordId = await findAirtableRecordByEmail(email);

    if (existingRecordId) {
      console.log(`Airtable record already exists for ${email} (${existingRecordId}) - skipping creation`);
      return res.status(200).json({ success: true, action: "skipped_existing", recordId: existingRecordId });
    }

    // Verify this is a first-time coaching purchase (not a renewal)
    const firstTime = await isFirstTimeCustomer(email);
    if (!firstTime) {
      console.log(`${email} is a returning coaching customer - skipping record creation`);
      return res.status(200).json({ success: true, action: "skipped_renewal" });
    }

    // Create the Airtable record
    const recordId = await createAirtableRecord(order);

    if (recordId) {
      console.log(`Auto-enrolled new member: ${email} -> Airtable record ${recordId}`);
      return res.status(200).json({ success: true, action: "created", recordId });
    } else {
      return res.status(500).json({ error: "Failed to create Airtable record" });
    }
  } catch (error) {
    console.error("Shopify webhook error:", error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}
