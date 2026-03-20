import React from "react";
import type { TrendDelta } from "../../../../shared/report-types";

interface TrendArrowProps {
  trend: TrendDelta;
}

export default function TrendArrow({ trend }: TrendArrowProps) {
  const isUp = trend.direction === "up";
  const isDown = trend.direction === "down";
  const color = isUp ? "#16a34a" : isDown ? "#dc2626" : "#6b7280";

  const arrow = isUp ? "\u2191" : isDown ? "\u2193" : "\u2192";

  const sign = isUp ? "+" : isDown ? "-" : "";
  const absAmount = Math.abs(trend.amount);
  const absPct = Math.abs(trend.pctChange);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "13px",
        color,
        fontWeight: 500,
      }}
    >
      <span style={{ fontSize: "15px" }}>{arrow}</span>
      <span>
        {sign}
        {absAmount.toLocaleString("en-US")}
      </span>
      <span style={{ fontSize: "11px", opacity: 0.8 }}>
        ({sign}
        {absPct}%)
      </span>
      {trend.label && (
        <span style={{ fontSize: "11px", color: "#9ca3af", marginLeft: "2px" }}>
          {trend.label}
        </span>
      )}
    </span>
  );
}
