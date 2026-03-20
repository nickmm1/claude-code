import React, { useState } from "react";
import type { WinTile, WinsMode } from "../../../../shared/report-types";

interface WinCelebrationProps {
  winsMode: WinsMode;
  bannerText: string;
  winsTiles: WinTile[];
  coachPrompt: string;
}

const GOLD = "#c5a572";

export default function WinCelebration({
  winsMode,
  bannerText,
  winsTiles,
  coachPrompt,
}: WinCelebrationProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const bannerBg = winsMode === "improvement" ? "#16a34a" : "#1b365d";

  return (
    <div style={{ marginBottom: "16px" }}>
      {/* Banner */}
      <div
        style={{
          background: bannerBg,
          color: "#ffffff",
          padding: "12px 20px",
          borderRadius: "10px 10px 0 0",
          fontSize: "15px",
          fontWeight: 600,
        }}
      >
        {bannerText}
      </div>

      {/* Tiles */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "0 0 10px 10px",
          border: "1px solid #e5e7eb",
          borderTop: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1px",
            background: "#e5e7eb",
          }}
        >
          {winsTiles.slice(0, 3).map((tile, i) => {
            const isExpanded = expandedIndex === i;

            return (
              <button
                key={i}
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                style={{
                  background: isExpanded ? "#f9fafb" : "#ffffff",
                  padding: "16px",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s ease",
                }}
                aria-expanded={isExpanded}
              >
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1b365d",
                    margin: "0 0 4px",
                  }}
                >
                  {tile.title}
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    margin: 0,
                  }}
                >
                  {tile.summary}
                </p>
              </button>
            );
          })}
        </div>

        {/* Expanded detail panel */}
        {expandedIndex !== null && winsTiles[expandedIndex] && (
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid #e5e7eb",
              background: "#f9fafb",
            }}
          >
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
                Details
              </span>
              <p style={{ fontSize: "14px", color: "#374151", margin: "4px 0 0" }}>
                {winsTiles[expandedIndex].details}
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
                Next month focus
              </span>
              <p style={{ fontSize: "14px", color: "#374151", margin: "4px 0 0" }}>
                {winsTiles[expandedIndex].nextMonthPrompt}
              </p>
            </div>
          </div>
        )}

        {/* Coach prompt */}
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #e5e7eb",
            background: "rgba(197, 165, 114, 0.06)",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: GOLD,
              fontWeight: 500,
              margin: 0,
            }}
          >
            {coachPrompt}
          </p>
        </div>
      </div>
    </div>
  );
}
