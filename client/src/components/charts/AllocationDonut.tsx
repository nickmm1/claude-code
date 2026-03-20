import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface AllocationDonutProps {
  allocations: {
    cpb: number;
    profit: number;
    ownerPay: number;
    tax: number;
    opex: number;
  };
}

const SLICE_CONFIG = [
  { key: "cpb", label: "CPB", color: "#94a3b8" },
  { key: "profit", label: "Profit", color: "#16a34a" },
  { key: "ownerPay", label: "Owner Pay", color: "#1b365d" },
  { key: "tax", label: "Tax", color: "#c5a572" },
  { key: "opex", label: "OPEX", color: "#64748b" },
] as const;

const formatDollar = (value: number): string =>
  "$" + value.toLocaleString("en-US", { minimumFractionDigits: 0 });

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  const { name, value } = payload[0];
  return (
    <div
      style={{
        background: "#1e293b",
        color: "#f8fafc",
        padding: "8px 12px",
        borderRadius: 6,
        fontSize: 13,
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
      }}
    >
      <strong>{name}</strong>: {formatDollar(value)}
    </div>
  );
};

const AllocationDonut: React.FC<AllocationDonutProps> = ({ allocations }) => {
  const data = SLICE_CONFIG.map(({ key, label }) => ({
    name: label,
    value: allocations[key],
  }));

  return (
    <div style={{ width: "100%", maxWidth: 280 }}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            dataKey="value"
            nameKey="name"
            paddingAngle={2}
            stroke="none"
          >
            {SLICE_CONFIG.map(({ key, color }) => (
              <Cell key={key} fill={color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px 16px",
          marginTop: 4,
        }}
      >
        {SLICE_CONFIG.map(({ key, label, color }) => (
          <div
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#64748b",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: color,
                flexShrink: 0,
              }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllocationDonut;
