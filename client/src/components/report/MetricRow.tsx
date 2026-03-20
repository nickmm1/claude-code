import React from "react";
import type { Severity } from "../../../../shared/report-types";

interface MetricRowProps {
  label: string;
  value: string;
  note?: string;
  severity?: Severity;
  index?: number;
}

const SEVERITY_COLORS: Record<Severity, { bg: string; text: string }> = {
  critical: { bg: "#fef2f2", text: "#dc2626" },
  warning: { bg: "#fffbeb", text: "#b45309" },
  healthy: { bg: "#f0fdf4", text: "#16a34a" },
  info: { bg: "#eff6ff", text: "#1b365d" },
};

const SEVERITY_LABELS: Record<Severity, string> = {
  critical: "Critical",
  warning: "Warning",
  healthy: "Healthy",
  info: "Info",
};

export default function MetricRow({
  label,
  value,
  note,
  severity,
  index = 0,
}: MetricRowProps) {
  const isAlt = index % 2 === 1;

  return (
    <div
      style={{
        padding: "10px 12px",
        background: isAlt ? "#f9fafb" : "transparent",
        borderRadius: "6px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <span style={{ fontSize: "14px", color: "#374151" }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {severity && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "9999px",
                background: SEVERITY_COLORS[severity].bg,
                color: SEVERITY_COLORS[severity].text,
              }}
            >
              {SEVERITY_LABELS[severity]}
            </span>
          )}
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#1b365d",
            }}
          >
            {value}
          </span>
        </div>
      </div>
      {note && (
        <p
          style={{
            fontSize: "12px",
            color: "#6b7280",
            marginTop: "4px",
            marginBottom: 0,
          }}
        >
          {note}
        </p>
      )}
    </div>
  );
}
