import { Request, Response } from "express";
import { randomBytes } from "crypto";
import { eq, and, gt } from "drizzle-orm";
import { getDb } from "./db";
import { accessSessions, rateLimits } from "../drizzle/schema";

// Airtable member verification (Primary Client Record -- populated by Shopify webhook)
const AIRTABLE_BASE_ID = "appo1o8n17v0uHt5x";
const PRIMARY_CLIENT_TABLE = "tblbOzCKJez16kK4N";

// Session cookie name
export const ACCESS_COOKIE = "aa_session";

// Session duration: 30 days
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// Rate limit: one analysis per email per 10 minutes
const RATE_LIMIT_MS = 10 * 60 * 1000;

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateToken(): string {
  return randomBytes(48).toString("hex");
}

function getCookieOptions(req: Request) {
  const isSecure =
    req.protocol === "https" ||
    (req.headers["x-forwarded-proto"] as string)?.includes("https");
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none" as const,
    secure: isSecure,
    maxAge: SESSION_TTL_MS,
  };
}

// ─── Turnstile CAPTCHA Verification ─────────────────────────────────────────

async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // If no secret configured, skip verification (dev mode)
  try {
    const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const data = await resp.json() as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

// ─── Check Airtable for member email ─────────────────────────────────────────

async function checkEmailInAirtable(email: string): Promise<{ found: boolean; memberName?: string }> {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key) {
    // No Airtable key -- fail open so dev/staging still works
    return { found: true };
  }
  try {
    const filterFormula = encodeURIComponent(`{⚡️ Email}="${email.toLowerCase().trim()}"`);
    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${PRIMARY_CLIENT_TABLE}?filterByFormula=${filterFormula}&maxRecords=1&fields%5B%5D=%E2%9A%A1%EF%B8%8F%20First%20Name&fields%5B%5D=%E2%9A%A1%EF%B8%8F%20Last%20Name`,
      { headers: { Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) return { found: false };
    const data = await res.json() as { records: Array<{ fields: Record<string, string> }> };
    if (data.records.length === 0) return { found: false };
    const fields = data.records[0].fields;
    const firstName = fields["⚡️ First Name"] || "";
    const lastName = fields["⚡️ Last Name"] || "";
    const memberName = [firstName, lastName].filter(Boolean).join(" ") || undefined;
    return { found: true, memberName };
  } catch {
    // Network error -- fail open to avoid locking out members during Airtable outage
    return { found: true };
  }
}

// ─── Verify Member Email & Issue Session Cookie ───────────────────────────────

export async function verifyAccessCodeHandler(req: Request, res: Response) {
  const { email: rawEmail, cfTurnstileResponse } = req.body as { email?: string; cfTurnstileResponse?: string };

  const email = (rawEmail || "").toLowerCase().trim();
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  // Verify Turnstile CAPTCHA first (if configured)
  if (cfTurnstileResponse) {
    const ip = (req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"] || req.ip || "") as string;
    const captchaOk = await verifyTurnstileToken(cfTurnstileResponse, ip);
    if (!captchaOk) {
      return res.status(400).json({ error: "Security check failed. Please refresh and try again." });
    }
  }

  // Check Notion CRM for this email
  const { found, memberName } = await checkEmailInAirtable(email);
  if (!found) {
    return res.status(401).json({
      error: "We could not find that email address in our member list. Please use the email you signed up with, or contact us at support@nickmirabella.com or (908) 808-4849.",
      notFound: true,
    });
  }

  const db = await getDb();
  if (!db) {
    const token = generateToken();
    res.cookie(ACCESS_COOKIE, token, getCookieOptions(req));
    return res.json({ success: true, email, memberName });
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(accessSessions).values({ sessionToken: token, expiresAt });
  res.cookie(ACCESS_COOKIE, token, getCookieOptions(req));
  return res.json({ success: true, email, memberName });
}

// ─── Check Session Middleware ─────────────────────────────────────────────────

export async function requireAccessSession(req: Request, res: Response, next: () => void) {
  const token = req.cookies?.[ACCESS_COOKIE];

  if (!token) {
    return res.status(401).json({ error: "Access required. Please enter your member access code." });
  }

  const db = await getDb();
  if (!db) {
    // If DB is unavailable, trust the cookie value exists (degraded mode)
    return next();
  }

  const now = new Date();
  const sessions = await db
    .select()
    .from(accessSessions)
    .where(and(eq(accessSessions.sessionToken, token), gt(accessSessions.expiresAt, now)))
    .limit(1);

  if (sessions.length === 0) {
    res.clearCookie(ACCESS_COOKIE, { path: "/" });
    return res.status(401).json({ error: "Session expired. Please enter your access code again." });
  }

  return next();
}

// ─── Check Session Status (for frontend to restore state on refresh) ──────────

export async function checkSessionHandler(req: Request, res: Response) {
  const token = req.cookies?.[ACCESS_COOKIE];

  if (!token) {
    return res.json({ valid: false });
  }

  const db = await getDb();
  if (!db) {
    // Degraded mode: trust cookie presence
    return res.json({ valid: true });
  }

  const now = new Date();
  const sessions = await db
    .select()
    .from(accessSessions)
    .where(and(eq(accessSessions.sessionToken, token), gt(accessSessions.expiresAt, now)))
    .limit(1);

  if (sessions.length === 0) {
    res.clearCookie(ACCESS_COOKIE, { path: "/" });
    return res.json({ valid: false });
  }

  return res.json({ valid: true });
}

// ─── Logout: Delete Session from DB ─────────────────────────────────────────

export async function logoutHandler(req: Request, res: Response) {
  const token = req.cookies?.[ACCESS_COOKIE];

  if (token) {
    const db = await getDb();
    if (db) {
      await db.delete(accessSessions).where(eq(accessSessions.sessionToken, token));
    }
  }

  // Clear the cookie regardless of whether DB delete succeeded
  res.clearCookie(ACCESS_COOKIE, { path: "/", sameSite: "none", secure: true });
  return res.json({ success: true });
}

// ─── Per-Email Rate Limiting ──────────────────────────────────────────────────

export async function checkEmailRateLimit(email: string): Promise<{ allowed: boolean; waitMinutes?: number }> {
  const db = await getDb();
  if (!db) {
    // If DB unavailable, allow through (fail open)
    return { allowed: true };
  }

  const existing = await db
    .select()
    .from(rateLimits)
    .where(eq(rateLimits.email, email.toLowerCase().trim()))
    .limit(1);

  if (existing.length === 0) {
    // First time this email has run an analysis -- insert and allow
    await db.insert(rateLimits).values({
      email: email.toLowerCase().trim(),
      lastAnalysisAt: new Date(),
      analysisCount: 1,
    });
    return { allowed: true };
  }

  const record = existing[0];
  const elapsed = Date.now() - record.lastAnalysisAt.getTime();

  if (elapsed < RATE_LIMIT_MS) {
    const waitMs = RATE_LIMIT_MS - elapsed;
    const waitMinutes = Math.ceil(waitMs / 60000);
    return { allowed: false, waitMinutes };
  }

  // Cooldown passed -- update the timestamp and allow
  await db
    .update(rateLimits)
    .set({
      lastAnalysisAt: new Date(),
      analysisCount: record.analysisCount + 1,
    })
    .where(eq(rateLimits.email, email.toLowerCase().trim()));

  return { allowed: true };
}
