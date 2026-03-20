/**
 * Parse Claude's response to extract structured JSON.
 * Falls back gracefully if JSON extraction fails.
 */

import type { StructuredReport } from "../shared/report-types";

/**
 * Extract JSON from Claude's response text.
 * Looks for ```json code fence first, then tries raw JSON parse.
 */
export function parseStructuredReport(responseText: string): StructuredReport | null {
  // Try to extract from ```json code fence
  const fenceMatch = responseText.match(/```json\s*\n?([\s\S]*?)\n?\s*```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1]) as StructuredReport;
    } catch (e) {
      console.error("[Parser] JSON in code fence is invalid:", (e as Error).message);
    }
  }

  // Try raw JSON parse (maybe Claude returned just JSON)
  const trimmed = responseText.trim();
  if (trimmed.startsWith("{")) {
    try {
      return JSON.parse(trimmed) as StructuredReport;
    } catch {
      // Not valid JSON
    }
  }

  // Try to find any JSON object in the response
  const jsonStart = responseText.indexOf("{");
  const jsonEnd = responseText.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd > jsonStart) {
    try {
      return JSON.parse(responseText.substring(jsonStart, jsonEnd + 1)) as StructuredReport;
    } catch {
      // Not valid JSON
    }
  }

  console.error("[Parser] Could not extract structured JSON from Claude response");
  return null;
}

/**
 * Extract key metrics from structured report for Airtable storage.
 */
export function extractAirtableMetrics(report: StructuredReport) {
  const d = report.dashboard;
  return {
    totalRevenue: `$${d.totalRevenue.toLocaleString()}`,
    realRevenue: `$${d.realRevenue.toLocaleString()}`,
    stage: d.stage,
    force4Score: d.force4Score,
    topBottleneck: report.coachFlow.bottlenecks.items[0]?.title || "See report",
  };
}

/**
 * Extract key metrics from raw text report (V1 fallback).
 */
export function extractMetricsFromText(reportText: string) {
  const revenueMatch = reportText.match(/Total Revenue[^\n]*?\$?([\d,]+\.?\d*)/i);
  const realRevenueMatch = reportText.match(/Real Revenue[^\n]*?\$?([\d,]+\.?\d*)/i);
  const stageMatch = reportText.match(/\b(SURVIVAL|STABILITY|GROWTH|SCALE|Survival|Stability|Growth|Scale)\b/);
  const normalizedStage = stageMatch
    ? stageMatch[1].charAt(0).toUpperCase() + stageMatch[1].slice(1).toLowerCase()
    : "See report";
  const bottleneckMatch = reportText.match(/Bottleneck\s*#?1[:\s*]+\*?\*?:?\s*([^\n|]{10,80})/i);
  const bottleneckText = bottleneckMatch
    ? bottleneckMatch[1].trim().replace(/\*+$/, "").trim()
    : "See report";

  return {
    totalRevenue: revenueMatch ? `$${revenueMatch[1]}` : "See report",
    realRevenue: realRevenueMatch ? `$${realRevenueMatch[1]}` : "See report",
    stage: normalizedStage,
    topBottleneck: bottleneckText,
  };
}
