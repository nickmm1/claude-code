import React from "react";
import type { StructuredReport } from "../../../shared/report-types";
import ReportDashboard from "../components/report/ReportDashboard";
import SectionCard from "../components/report/SectionCard";
import MetricRow from "../components/report/MetricRow";
import AllocationBucketCard from "../components/report/AllocationBucketCard";
import BottleneckCard from "../components/report/BottleneckCard";
import ActionPlanCard from "../components/report/ActionPlanCard";
import WinCelebration from "../components/report/WinCelebration";

interface ReportViewProps {
  report: StructuredReport;
}

const NAVY = "#1b365d";
const GOLD = "#c5a572";

function formatDollar(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ReportView({ report }: ReportViewProps) {
  const { dashboard, coachFlow, sections, meta } = report;

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "24px 16px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Report header */}
      <div style={{ marginBottom: "24px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: NAVY,
            margin: "0 0 4px",
          }}
        >
          {meta.salonName}
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
          {meta.businessModel} &middot; Analysis: {meta.analysisDate}
        </p>
      </div>

      {/* 1. Dashboard (always visible) */}
      <ReportDashboard dashboard={dashboard} />

      {/* 2. Coach Opener */}
      <div
        style={{
          background: "rgba(27, 54, 93, 0.04)",
          border: `1px solid rgba(27, 54, 93, 0.12)`,
          borderRadius: "10px",
          padding: "16px 20px",
          marginBottom: "16px",
        }}
      >
        <p style={{ fontSize: "15px", color: "#374151", margin: 0, lineHeight: 1.6 }}>
          {coachFlow.coachOpener.text}
        </p>
      </div>

      {/* 3. Win Celebration */}
      <WinCelebration
        winsMode={coachFlow.winsSection.winsMode}
        bannerText={coachFlow.winsSection.bannerText}
        winsTiles={coachFlow.winsSection.winsTiles}
        coachPrompt={coachFlow.winsSection.coachPrompt}
      />

      {/* 4. Stage Meaning */}
      <SectionCard title="What Your Stage Means" severity="info" defaultOpen>
        <ul
          style={{
            margin: 0,
            paddingLeft: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {coachFlow.stageMeaning.bullets.map((bullet, i) => (
            <li key={i} style={{ fontSize: "14px", color: "#374151", lineHeight: 1.5 }}>
              {bullet}
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* 5. Action Plan (always visible) */}
      <ActionPlanCard
        items={coachFlow.actionPlan.items}
        closeNudge={coachFlow.actionPlan.closeNudge}
      />

      {/* 6. Foundation Section */}
      <SectionCard
        title={sections.foundation.title}
        severity={sections.foundation.severity}
      >
        <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 12px" }}>
          {sections.foundation.summary}
        </p>
        {sections.foundation.metrics?.map((m, i) => (
          <MetricRow
            key={i}
            label={m.label}
            value={m.value}
            note={m.note}
            severity={m.severity}
            index={i}
          />
        ))}
      </SectionCard>

      {/* 7. Financial Dashboard Section */}
      <SectionCard
        title={sections.financialDashboard.title}
        severity={sections.financialDashboard.severity}
      >
        <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 12px" }}>
          {sections.financialDashboard.summary}
        </p>
        {sections.financialDashboard.metrics?.map((m, i) => (
          <MetricRow
            key={i}
            label={m.label}
            value={m.value}
            note={m.note}
            severity={m.severity}
            index={i}
          />
        ))}
      </SectionCard>

      {/* 8. Profit First Stage Section */}
      <SectionCard
        title={sections.profitFirstStage.title}
        severity={sections.profitFirstStage.severity}
      >
        <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 12px" }}>
          {sections.profitFirstStage.summary}
        </p>
        {sections.profitFirstStage.metrics?.map((m, i) => (
          <MetricRow
            key={i}
            label={m.label}
            value={m.value}
            note={m.note}
            severity={m.severity}
            index={i}
          />
        ))}
      </SectionCard>

      {/* 9. Money Buckets */}
      <SectionCard
        title={sections.moneyBuckets.section.title}
        severity={sections.moneyBuckets.section.severity}
      >
        <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 12px" }}>
          {sections.moneyBuckets.section.summary}
        </p>
        {sections.moneyBuckets.buckets.map((bucket, i) => (
          <AllocationBucketCard key={i} bucket={bucket} />
        ))}
      </SectionCard>

      {/* 10. Expense Breakdown (if present) */}
      {sections.expenseBreakdown && (
        <SectionCard
          title={sections.expenseBreakdown.section.title}
          severity={sections.expenseBreakdown.section.severity}
        >
          <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 12px" }}>
            {sections.expenseBreakdown.section.summary}
          </p>
          <p style={{ fontSize: "13px", color: "#9ca3af", margin: "0 0 12px" }}>
            Total OpEx: {sections.expenseBreakdown.totalOpexPct}% of revenue
          </p>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px", color: "#6b7280", fontWeight: 600 }}>
                    Vendor
                  </th>
                  <th style={{ textAlign: "left", padding: "8px 10px", color: "#6b7280", fontWeight: 600 }}>
                    Category
                  </th>
                  <th style={{ textAlign: "right", padding: "8px 10px", color: "#6b7280", fontWeight: 600 }}>
                    Monthly
                  </th>
                  <th style={{ textAlign: "right", padding: "8px 10px", color: "#6b7280", fontWeight: 600 }}>
                    Annual Est.
                  </th>
                  <th style={{ textAlign: "center", padding: "8px 10px", color: "#6b7280", fontWeight: 600 }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {sections.expenseBreakdown.expenses.map((exp, i) => {
                  const sevColor =
                    exp.severity === "critical"
                      ? "#dc2626"
                      : exp.severity === "warning"
                      ? "#b45309"
                      : exp.severity === "healthy"
                      ? "#16a34a"
                      : "#1b365d";
                  const sevBg =
                    exp.severity === "critical"
                      ? "#fef2f2"
                      : exp.severity === "warning"
                      ? "#fffbeb"
                      : exp.severity === "healthy"
                      ? "#f0fdf4"
                      : "#eff6ff";

                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid #f3f4f6",
                        background: i % 2 === 1 ? "#f9fafb" : "transparent",
                      }}
                    >
                      <td style={{ padding: "8px 10px", color: "#1f2937" }}>
                        {exp.vendor}
                        {exp.flag && (
                          <span
                            style={{
                              marginLeft: "6px",
                              fontSize: "11px",
                              color: "#dc2626",
                              fontWeight: 600,
                            }}
                          >
                            {exp.flag}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "8px 10px", color: "#6b7280" }}>
                        {exp.category}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: "#1f2937" }}>
                        {formatDollar(exp.monthlyAmount)}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "right", color: "#1f2937" }}>
                        {formatDollar(exp.annualEstimate)}
                      </td>
                      <td style={{ padding: "8px 10px", textAlign: "center" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: "9999px",
                            background: sevBg,
                            color: sevColor,
                          }}
                        >
                          {exp.severity === "critical"
                            ? "Critical"
                            : exp.severity === "warning"
                            ? "Warning"
                            : exp.severity === "healthy"
                            ? "Healthy"
                            : "Info"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* 11. Bottlenecks */}
      <SectionCard title="Top Bottlenecks" severity="warning" defaultOpen>
        {coachFlow.bottlenecks.items.map((bn, i) => (
          <BottleneckCard key={i} bottleneck={bn} index={i} />
        ))}
      </SectionCard>

      {/* 12. Coach Close */}
      <div
        style={{
          background: `linear-gradient(135deg, ${NAVY}, #2d4a7a)`,
          borderRadius: "10px",
          padding: "20px 24px",
          marginBottom: "16px",
        }}
      >
        <p
          style={{
            fontSize: "15px",
            color: "#ffffff",
            margin: 0,
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          {coachFlow.coachClose.text}
        </p>
      </div>

      {/* 13. Progress Disclosure */}
      {coachFlow.progressDisclosure.hasPreviousMonth && (
        <SectionCard title="Month-over-Month Progress" severity="info">
          <p style={{ fontSize: "14px", color: "#374151", margin: 0, lineHeight: 1.6 }}>
            {coachFlow.progressDisclosure.comparisonSummary}
          </p>
        </SectionCard>
      )}
    </div>
  );
}
