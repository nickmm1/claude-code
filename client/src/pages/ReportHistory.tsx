import React, { useState } from "react";
import type { PastReport } from "./RegisterPage";

const NAVY = "#1b365d";
const GOLD = "#c5a572";

interface ReportHistoryProps {
  salonName: string;
  email: string;
  pastReports: PastReport[];
  onNewAnalysis: () => void;
  onViewReport: (report: PastReport) => void;
}

/**
 * Formats a V1 plain-text report into styled HTML.
 * Exported for backward compatibility with reports that lack structuredReport.
 */
export function formatReport(text: string): string {
  const CHECKLIST = "__CHECKLIST__";

  // Step 1: protect checklist items before HTML escaping
  let processed = text.replace(/^\[\s?\]\s+(.*)$/gm, `${CHECKLIST}$1`);

  // Step 2: HTML-escape special characters
  let html = processed
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Step 3: bold text
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Step 3b: italic text
  html = html.replace(/\*((?!\*)[^*]+)\*/g, "<em>$1</em>");

  // Step 4a: SECTION N: headings (primary format)
  html = html.replace(/^SECTION (\d+):\s*(.*)$/gm, (_m, num, title) => {
    return `<div class="rc-section-heading"><span class="rc-section-num">${num}</span><span class="rc-section-title">${title.trim()}</span></div>`;
  });

  // Step 4b: Markdown ### headings (fallback if Claude uses markdown format)
  html = html.replace(/^###\s+(.+)$/gm, (_m, title) => {
    const numberedMatch = title.match(
      /^(?:Section\s*)?(\d+)[.:)\s]+(.+)$/i
    );
    if (numberedMatch) {
      return `<div class="rc-section-heading"><span class="rc-section-num">${numberedMatch[1]}</span><span class="rc-section-title">${numberedMatch[2].trim()}</span></div>`;
    }
    return `<div class="rc-section-heading"><span class="rc-section-title" style="margin-left:0">${title.trim()}</span></div>`;
  });

  // Step 4c: Markdown ## headings
  html = html.replace(/^##\s+(.+)$/gm, (_m, title) => {
    return `<div class="rc-report-title">${title.trim()}</div>`;
  });

  // Step 4d: Markdown # headings
  html = html.replace(/^#\s+(.+)$/gm, (_m, title) => {
    return `<div class="rc-report-title">${title.trim()}</div>`;
  });

  // Step 5: horizontal rules
  html = html.replace(
    /^---+$/gm,
    '<div class="rc-divider"></div>'
  );

  // Step 6: markdown table rows -> <tr><td> with status badges
  html = html.replace(/^\|(.+)\|$/gm, (_match, content) => {
    const cells = content.split("|").map((c: string) => c.trim());
    if (cells.every((c: string) => /^[-:]+$/.test(c))) return "";
    const styledCells = cells.map((c: string) => {
      if (c === "ON TRACK")
        return `<td><span class="badge badge-green">${c}</span></td>`;
      if (c === "NEEDS WORK")
        return `<td><span class="badge badge-gold">${c}</span></td>`;
      if (c === "RED FLAG")
        return `<td><span class="badge badge-red">${c}</span></td>`;
      return `<td>${c}</td>`;
    });
    return "<tr>" + styledCells.join("") + "</tr>";
  });

  // Step 7: wrap consecutive <tr> rows into a proper table with a header row
  html = html.replace(/((<tr>[\s\S]*?<\/tr>\n?)+)/g, (match) => {
    const rows = match
      .trim()
      .split("\n")
      .filter((r) => r.trim());
    if (rows.length === 0) return match;
    const firstRow = rows[0];
    const headerCells = firstRow
      .replace(/<tr>|<\/tr>/g, "")
      .split("<td>")
      .filter(Boolean)
      .map((c) => c.replace("</td>", ""));
    const headerHtml =
      "<tr>" + headerCells.map((c) => `<th>${c}</th>`).join("") + "</tr>";
    const bodyRows = rows.slice(1).join("\n");
    return `<div class="rc-table-wrap"><table><thead>${headerHtml}</thead><tbody>${bodyRows}</tbody></table></div>`;
  });

  // Step 8: checklist items
  html = html.replace(
    new RegExp(`${CHECKLIST}(.*)`, "g"),
    (_match, item) => {
      return `<div class="rc-checklist-item"><span class="rc-checkbox"></span><span class="rc-checkbox-label">${item.trim()}</span></div>`;
    }
  );

  // Step 9: numbered list items
  html = html.replace(
    /^(\d+)\.\s+(.*)$/gm,
    '<div class="rc-numbered"><span class="rc-num">$1.</span><span class="rc-num-text">$2</span></div>'
  );

  // Step 10: bullet items
  html = html.replace(
    /^[-\u2022]\s+(.*)$/gm,
    '<div class="rc-bullet"><span class="rc-bullet-dot">&#8226;</span><span class="rc-bullet-text">$1</span></div>'
  );

  // Step 11: wrap remaining plain text lines in paragraphs
  html = html
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<")) return trimmed;
      return `<p class="rc-para">${trimmed}</p>`;
    })
    .join("\n");

  return html;
}

export default function ReportHistory({
  salonName,
  email,
  pastReports,
  onNewAnalysis,
  onViewReport,
}: ReportHistoryProps) {
  const [viewingReport, setViewingReport] = useState<PastReport | null>(null);

  const handleViewReport = (report: PastReport) => {
    // V2 reports with structuredReport are handled by the parent
    if (report.structuredReport) {
      onViewReport(report);
      return;
    }
    // V1 reports render inline with formatReport
    setViewingReport(report);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h2
            style={{
              color: NAVY,
              fontSize: "1.4rem",
              fontWeight: 800,
              margin: "0 0 0.25rem",
            }}
          >
            Your Report History
          </h2>
          <p style={{ color: "#666", fontSize: "0.85rem", margin: 0 }}>
            {salonName || email}
          </p>
        </div>
        <button
          onClick={onNewAnalysis}
          style={{
            padding: "0.625rem 1.25rem",
            backgroundColor: NAVY,
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          New Analysis
        </button>
      </div>

      {viewingReport ? (
        <div>
          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <button
              onClick={() => setViewingReport(null)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: GOLD,
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              &larr; Back to history
            </button>
            <span style={{ color: "#999", fontSize: "0.85rem" }}>
              {viewingReport.analysisDate} &bull; Stage: {viewingReport.stage}
            </span>
          </div>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "2rem",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="report-content"
              dangerouslySetInnerHTML={{
                __html: formatReport(viewingReport.fullReport),
              }}
            />
          </div>
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {pastReports.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "3rem", color: "#999" }}
            >
              No past reports found.
            </div>
          ) : (
            pastReports.map((r) => (
              <div
                key={r.recordId}
                style={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "1.25rem 1.5rem",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: NAVY,
                      fontSize: "0.95rem",
                    }}
                  >
                    {r.analysisDate}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#666",
                      marginTop: "2px",
                    }}
                  >
                    Revenue: {r.totalRevenue} &bull; Stage: {r.stage}
                  </div>
                  {r.topBottleneck && (
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "#888",
                        marginTop: "2px",
                      }}
                    >
                      Top issue: {r.topBottleneck}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleViewReport(r)}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: NAVY,
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  View Report
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
