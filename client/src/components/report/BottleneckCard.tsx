import React, { useState, useRef, useEffect } from "react";
import type { Bottleneck, Severity } from "../../../../shared/report-types";

interface BottleneckCardProps {
  bottleneck: Bottleneck;
  index: number;
}

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: "#dc2626",
  warning: "#c5a572",
  healthy: "#16a34a",
  info: "#1b365d",
};

const SEVERITY_BG: Record<Severity, string> = {
  critical: "#fef2f2",
  warning: "#fffbeb",
  healthy: "#f0fdf4",
  info: "#eff6ff",
};

const SEVERITY_LABELS: Record<Severity, string> = {
  critical: "Critical",
  warning: "Warning",
  healthy: "Healthy",
  info: "Info",
};

export default function BottleneckCard({ bottleneck, index }: BottleneckCardProps) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const color = SEVERITY_COLORS[bottleneck.severity];

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [open]);

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "10px",
        border: `1px solid #e5e7eb`,
        borderLeft: `4px solid ${color}`,
        marginBottom: "12px",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
        aria-expanded={open}
      >
        {/* Number badge */}
        <span
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: color,
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          #{index + 1}
        </span>

        <span
          style={{
            flex: 1,
            fontSize: "15px",
            fontWeight: 600,
            color: "#1b365d",
          }}
        >
          {bottleneck.title}
        </span>

        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "9999px",
            background: SEVERITY_BG[bottleneck.severity],
            color,
            flexShrink: 0,
          }}
        >
          {SEVERITY_LABELS[bottleneck.severity]}
        </span>

        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
            flexShrink: 0,
          }}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="#6b7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        style={{
          maxHeight: open ? `${contentHeight}px` : "0px",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <div ref={contentRef} style={{ padding: "0 16px 16px" }}>
          <div style={{ marginBottom: "12px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#9ca3af",
              }}
            >
              What it is
            </span>
            <p style={{ fontSize: "14px", color: "#374151", margin: "4px 0 0" }}>
              {bottleneck.whatItIs}
            </p>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#9ca3af",
              }}
            >
              Why it matters
            </span>
            <p style={{ fontSize: "14px", color: "#374151", margin: "4px 0 0" }}>
              {bottleneck.whyItMatters}
            </p>
          </div>

          <div>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#9ca3af",
              }}
            >
              What to do next
            </span>
            <p style={{ fontSize: "14px", color: "#374151", margin: "4px 0 0" }}>
              {bottleneck.whatToDoNext}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
