import type { StructuredReport } from "../../../shared/report-types";

/**
 * Type guard that checks whether a value has the shape of a StructuredReport.
 * Validates the four top-level keys: dashboard, coachFlow, sections, meta.
 */
export function isStructuredReport(data: unknown): data is StructuredReport {
  if (data === null || data === undefined || typeof data !== "object") {
    return false;
  }
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.dashboard === "object" &&
    obj.dashboard !== null &&
    typeof obj.coachFlow === "object" &&
    obj.coachFlow !== null &&
    typeof obj.sections === "object" &&
    obj.sections !== null &&
    typeof obj.meta === "object" &&
    obj.meta !== null
  );
}

/**
 * Parses a StructuredReport from an API response or stored JSON string.
 *
 * Accepts:
 *  - An already-parsed object (validates shape and returns it)
 *  - A JSON string (parses then validates)
 *
 * Returns null if the input is invalid or does not match the expected shape.
 */
export function parseStructuredReport(
  data: unknown
): StructuredReport | null {
  if (data === null || data === undefined) {
    return null;
  }

  // If it is a string, try to parse as JSON first
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      return isStructuredReport(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  // If it is already an object, validate the shape directly
  if (typeof data === "object") {
    return isStructuredReport(data) ? (data as StructuredReport) : null;
  }

  return null;
}
