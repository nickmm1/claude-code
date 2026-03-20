import React from "react";
import type { ActionItem } from "../../../../shared/report-types";

interface ActionPlanCardProps {
  items: ActionItem[];
  closeNudge: string;
}

const GOLD = "#c5a572";

export default function ActionPlanCard({ items, closeNudge }: ActionPlanCardProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        padding: "20px",
        marginBottom: "16px",
      }}
    >
      <h3
        style={{
          fontSize: "16px",
          fontWeight: 600,
          color: "#1b365d",
          margin: "0 0 16px",
        }}
      >
        Your Action Plan
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
            }}
          >
            {/* Visual checkbox */}
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "4px",
                border: "2px solid #d1d5db",
                flexShrink: 0,
                marginTop: "2px",
              }}
            />

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: "14px", color: "#1f2937" }}>
                  {item.step}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    background: "#eff6ff",
                    color: "#1b365d",
                  }}
                >
                  {item.when}
                </span>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  margin: "4px 0 0",
                }}
              >
                How measured: {item.howMeasured}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Close nudge callout */}
      <div
        style={{
          marginTop: "20px",
          padding: "12px 16px",
          borderRadius: "8px",
          border: `1px solid ${GOLD}`,
          background: "rgba(197, 165, 114, 0.06)",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "#1b365d",
            margin: 0,
            fontWeight: 500,
          }}
        >
          {closeNudge}
        </p>
      </div>
    </div>
  );
}
