import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here

// Tracks per-email analysis rate limiting (one analysis per 10 minutes per email)
export const rateLimits = mysqlTable("rate_limits", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  lastAnalysisAt: timestamp("lastAnalysisAt").defaultNow().notNull(),
  analysisCount: int("analysisCount").default(1).notNull(),
});

export type RateLimit = typeof rateLimits.$inferSelect;
export type InsertRateLimit = typeof rateLimits.$inferInsert;

// Stores server-side access sessions (replaces client-side password check)
export const accessSessions = mysqlTable("access_sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionToken: varchar("sessionToken", { length: 128 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});

export type AccessSession = typeof accessSessions.$inferSelect;
export type InsertAccessSession = typeof accessSessions.$inferInsert;