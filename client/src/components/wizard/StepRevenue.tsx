import React from "react";
import { WizardState } from "../../hooks/useWizardState";

const NAVY = "#1b365d";
const GOLD = "#c5a572";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  border: "2px solid #e5e7eb",
  borderRadius: "6px",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: "white",
  color: "#1a1a1a",
};

const dollarInputStyle: React.CSSProperties = {
  ...inputStyle,
  paddingLeft: "2rem",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 700,
  color: "#444",
  marginBottom: "0.35rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const helperStyle: React.CSSProperties = {
  fontSize: "0.72rem",
  color: "#999",
  marginTop: "0.25rem",
};

interface StepRevenueProps {
  wizard: WizardState;
}

export default function StepRevenue({ wizard }: StepRevenueProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ marginBottom: "0.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: NAVY, margin: 0 }}>
          Revenue Numbers
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
          Enter your last full month of revenue. The more accurate these numbers, the better your analysis.
        </p>
      </div>

      {/* Total Service Revenue */}
      <div>
        <label style={labelStyle}>Total Service Revenue</label>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>$</span>
          <input
            type="text"
            inputMode="decimal"
            value={wizard.totalServiceRevenue}
            onChange={(e) => wizard.setTotalServiceRevenue(e.target.value)}
            placeholder="0.00"
            style={dollarInputStyle}
          />
        </div>
        <div style={helperStyle}>All service revenue for the month before any deductions.</div>
      </div>

      {/* Total Retail Revenue */}
      <div>
        <label style={labelStyle}>Total Retail / Product Sales</label>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>$</span>
          <input
            type="text"
            inputMode="decimal"
            value={wizard.totalRetailRevenue}
            onChange={(e) => wizard.setTotalRetailRevenue(e.target.value)}
            placeholder="0.00"
            style={dollarInputStyle}
          />
        </div>
        <div style={helperStyle}>Product sales, retail, and any non-service income. Enter 0 if none.</div>
      </div>

      {/* Parts and Labor Toggle */}
      <div style={{ backgroundColor: "#f9fafb", borderRadius: "8px", padding: "1rem 1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={() => wizard.setPartsAndLaborEnabled(!wizard.partsAndLaborEnabled)}
            style={{
              width: "44px",
              height: "24px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: wizard.partsAndLaborEnabled ? GOLD : "#d1d5db",
              cursor: "pointer",
              position: "relative",
              transition: "background-color 0.2s",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "2px",
                left: wizard.partsAndLaborEnabled ? "22px" : "2px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "white",
                transition: "left 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              }}
            />
          </button>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
            Do you charge Parts and Labor separately?
          </span>
        </div>
        {wizard.partsAndLaborEnabled && (
          <div style={{ marginTop: "0.75rem" }}>
            <label style={labelStyle}>Parts and Labor Amount</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>$</span>
              <input
                type="text"
                inputMode="decimal"
                value={wizard.partsAndLaborAmount}
                onChange={(e) => wizard.setPartsAndLaborAmount(e.target.value)}
                placeholder="0.00"
                style={dollarInputStyle}
              />
            </div>
            <div style={helperStyle}>Total parts and labor fees collected this month.</div>
          </div>
        )}
      </div>

      {/* Total Clients */}
      <div>
        <label style={labelStyle}>Total Clients Seen</label>
        <input
          type="text"
          inputMode="numeric"
          value={wizard.totalClients}
          onChange={(e) => wizard.setTotalClients(e.target.value)}
          placeholder="0"
          style={inputStyle}
        />
        <div style={helperStyle}>Total number of client visits for the month across all stylists.</div>
      </div>

      {/* Cash Reserves */}
      <div>
        <label style={labelStyle}>Cash Reserves</label>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>$</span>
          <input
            type="text"
            inputMode="decimal"
            value={wizard.cashReserves}
            onChange={(e) => wizard.setCashReserves(e.target.value)}
            placeholder="0.00"
            style={dollarInputStyle}
          />
        </div>
        <div style={helperStyle}>How much cash do you have in the bank right now? This helps us assess your safety net.</div>
      </div>

      {/* Desired Owner Salary */}
      <div>
        <label style={labelStyle}>Desired Owner Salary</label>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>$</span>
          <input
            type="text"
            inputMode="decimal"
            value={wizard.desiredOwnerSalary}
            onChange={(e) => wizard.setDesiredOwnerSalary(e.target.value)}
            placeholder="0.00"
            style={dollarInputStyle}
          />
        </div>
        <div style={helperStyle}>What do you want to take home per month? We will show you how to get there.</div>
      </div>
    </div>
  );
}
