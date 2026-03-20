import React from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import type { Force4Status } from "../../../../shared/report-types";

interface Force4GaugeProps {
  score: number;
  status: Force4Status;
}

const STATUS_COLORS: Record<Force4Status, string> = {
  excellent: "#16a34a",
  good: "#c5a572",
  developing: "#f59e0b",
  needs_attention: "#dc2626",
};

const STATUS_LABELS: Record<Force4Status, string> = {
  excellent: "Excellent",
  good: "Good",
  developing: "Developing",
  needs_attention: "Needs Attention",
};

const Force4Gauge: React.FC<Force4GaugeProps> = ({ score, status }) => {
  const color = STATUS_COLORS[status];
  const label = STATUS_LABELS[status];

  const data = [{ value: score, fill: color }];

  return (
    <div
      style={{
        position: "relative",
        width: 200,
        height: 200,
        maxWidth: "100%",
      }}
    >
      <RadialBarChart
        width={200}
        height={200}
        cx={100}
        cy={100}
        innerRadius={70}
        outerRadius={90}
        startAngle={90}
        endAngle={-270}
        data={data}
        barSize={16}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background={{ fill: "#e5e7eb" }}
          dataKey="value"
          angleAxisId={0}
          cornerRadius={8}
        />
      </RadialBarChart>

      {/* Center text overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 200,
          height: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontSize: 36,
            fontWeight: 700,
            color,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#64748b",
            marginTop: 4,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default Force4Gauge;
