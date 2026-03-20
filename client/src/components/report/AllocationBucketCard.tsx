import React from "react";
import type { AllocationBucket, Severity } from "../../../../shared/report-types";

interface AllocationBucketCardProps {
  bucket: AllocationBucket;
}

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: "#dc2626",
  warning: "#c5a572",
  healthy: "#16a34a",
  info: "#1b365d",
};

const SEVERITY_LABELS: Record<Severity, string> = {
  critical: "Critical",
  warning: "Warning",
  healthy: "Healthy",
  info: "Info",
};

function formatDollar(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AllocationBucketCard({ bucket }: AllocationBucketCardProps) {
  const barColor = SEVERITY_COLORS[bucket.severity];
  const navyLight = "rgba(27, 54, 93, 0.15)";
  const maxPct = Math.max(bucket.currentPct, bucket.targetPct, 1);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
        padding: "16px",
        marginBottom: "12px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div>
          <span style={{ fontWeight: 600, fontSize: "15px", color: "#1b365d" }}>
            {bucket.name}
          </span>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0" }}>
            {bucket.description}
          </p>
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "9999px",
            background:
              bucket.severity === "critical"
                ? "#fef2f2"
                : bucket.severity === "warning"
                ? "#fffbeb"
                : bucket.severity === "healthy"
                ? "#f0fdf4"
                : "#eff6ff",
            color: barColor,
          }}
        >
          {SEVERITY_LABELS[bucket.severity]}
        </span>
      </div>

      {/* Current bar */}
      <div style={{ marginBottom: "8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#6b7280",
            marginBottom: "4px",
          }}
        >
          <span>Current: {bucket.currentPct}%</span>
          <span>{formatDollar(bucket.currentDollar)}</span>
        </div>
        <div
          style={{
            height: "10px",
            background: "#f3f4f6",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(bucket.currentPct / maxPct) * 100}%`,
              background: barColor,
              borderRadius: "5px",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Target bar */}
      <div style={{ marginBottom: "8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#6b7280",
            marginBottom: "4px",
          }}
        >
          <span>Target: {bucket.targetPct}%</span>
          <span>{formatDollar(bucket.targetDollar)}</span>
        </div>
        <div
          style={{
            height: "10px",
            background: "#f3f4f6",
            borderRadius: "5px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(bucket.targetPct / maxPct) * 100}%`,
              background: navyLight,
              borderRadius: "5px",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Benchmark */}
      <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
        Benchmark range: {bucket.benchmarkRange}
      </p>
    </div>
  );
}
