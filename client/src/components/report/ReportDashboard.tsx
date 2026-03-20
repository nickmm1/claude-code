import React from "react";
import type { DashboardData } from "../../../../shared/report-types";
import Force4Gauge from "../charts/Force4Gauge";
import AllocationDonut from "../charts/AllocationDonut";
import TrendArrow from "./TrendArrow";

interface ReportDashboardProps {
  dashboard: DashboardData;
}

const NAVY = "#1b365d";

function formatDollar(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface SummaryCardProps {
  label: string;
  value: string;
  trend?: DashboardData["trendArrows"] extends { [k: string]: infer T } ? T : never;
}

function SummaryCard({ label, value, trend }: SummaryCardProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        padding: "16px 20px",
      }}
    >
      <p
        style={{
          fontSize: "12px",
          color: "#6b7280",
          margin: "0 0 4px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontWeight: 600,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "22px",
          fontWeight: 700,
          color: NAVY,
          margin: 0,
        }}
      >
        {value}
      </p>
      {trend && (
        <div style={{ marginTop: "6px" }}>
          <TrendArrow trend={trend} />
        </div>
      )}
    </div>
  );
}

export default function ReportDashboard({ dashboard }: ReportDashboardProps) {
  const trends = dashboard.trendArrows;

  return (
    <div style={{ marginBottom: "24px" }}>
      {/* Charts row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {/* Force 4 Gauge */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 600,
              margin: "0 0 8px",
            }}
          >
            Force 4 Score
          </p>
          <Force4Gauge score={dashboard.force4Score} status={dashboard.force4Status} />
          {trends?.force4 && (
            <div style={{ marginTop: "8px" }}>
              <TrendArrow trend={trends.force4} />
            </div>
          )}
        </div>

        {/* Allocation Donut */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 600,
              margin: "0 0 8px",
            }}
          >
            Money Allocation
          </p>
          <AllocationDonut allocations={dashboard.allocations} />
        </div>

        {/* Stage progress */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 600,
              margin: "0 0 8px",
            }}
          >
            Profit First Stage
          </p>
          <p
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: NAVY,
              margin: "8px 0 4px",
            }}
          >
            {dashboard.stage}
          </p>
          <div
            style={{
              width: "100%",
              maxWidth: "200px",
              height: "8px",
              background: "#e5e7eb",
              borderRadius: "4px",
              overflow: "hidden",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(
                  (dashboard.stageProgress / dashboard.nextStageThreshold) * 100,
                  100
                )}%`,
                background: NAVY,
                borderRadius: "4px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <p style={{ fontSize: "12px", color: "#9ca3af", margin: "6px 0 0" }}>
            {dashboard.stageProgress}% toward {dashboard.nextStageThreshold}% threshold
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <SummaryCard
          label="Total Revenue"
          value={formatDollar(dashboard.totalRevenue)}
          trend={trends?.totalRevenue}
        />
        <SummaryCard
          label="Real Revenue"
          value={formatDollar(dashboard.realRevenue)}
          trend={trends?.realRevenue}
        />
        <SummaryCard
          label="Real Revenue %"
          value={`${dashboard.realRevenuePct}%`}
        />
      </div>
    </div>
  );
}
