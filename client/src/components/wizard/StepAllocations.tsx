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

const pctInputStyle: React.CSSProperties = {
  ...inputStyle,
  paddingRight: "2rem",
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

const hintStyle: React.CSSProperties = {
  fontSize: "0.68rem",
  color: GOLD,
  fontWeight: 600,
  marginTop: "0.2rem",
};

interface StepAllocationsProps {
  wizard: WizardState;
}

export default function StepAllocations({ wizard }: StepAllocationsProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ marginBottom: "0.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: NAVY, margin: 0 }}>
          Profit First Allocations
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
          If you already run Profit First, enter your current and target percentages. If not, skip this step and we will use industry benchmarks.
        </p>
      </div>

      {/* Skip banner */}
      <div
        style={{
          backgroundColor: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: "8px",
          padding: "0.75rem 1rem",
          fontSize: "0.82rem",
          color: "#92400e",
          fontWeight: 500,
        }}
      >
        Optional. If you have not set up Profit First yet, skip this step. We will use standard salon benchmarks instead.
      </div>

      {/* Current Allocations */}
      <div
        style={{
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          padding: "1.25rem",
          border: "1px solid #e5e7eb",
        }}
      >
        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: NAVY, marginBottom: "1rem" }}>
          Current Allocations (What You Run Today)
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Profit %</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                inputMode="decimal"
                value={wizard.currentProfitPct}
                onChange={(e) => wizard.setCurrentProfitPct(e.target.value)}
                placeholder="0"
                style={pctInputStyle}
              />
              <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>%</span>
            </div>
            <div style={hintStyle}>Ideal: 5-15%</div>
          </div>

          <div>
            <label style={labelStyle}>Owner Pay $</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>$</span>
              <input
                type="text"
                inputMode="decimal"
                value={wizard.currentOwnerPayDollar}
                onChange={(e) => wizard.setCurrentOwnerPayDollar(e.target.value)}
                placeholder="0.00"
                style={dollarInputStyle}
              />
            </div>
            <div style={hintStyle}>What you actually pay yourself today</div>
          </div>

          <div>
            <label style={labelStyle}>Tax %</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                inputMode="decimal"
                value={wizard.currentTaxPct}
                onChange={(e) => wizard.setCurrentTaxPct(e.target.value)}
                placeholder="0"
                style={pctInputStyle}
              />
              <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>%</span>
            </div>
            <div style={hintStyle}>Ideal: 15-20%</div>
          </div>

          <div>
            <label style={labelStyle}>Op. Expenses %</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                inputMode="decimal"
                value={wizard.currentOpexPct}
                onChange={(e) => wizard.setCurrentOpexPct(e.target.value)}
                placeholder="0"
                style={pctInputStyle}
              />
              <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>%</span>
            </div>
            <div style={hintStyle}>Ideal: 30-50%</div>
          </div>
        </div>
      </div>

      {/* Target Allocations */}
      <div
        style={{
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          padding: "1.25rem",
          border: "1px solid #e5e7eb",
        }}
      >
        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: NAVY, marginBottom: "1rem" }}>
          Target Allocations (Where You Want to Be)
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Profit %</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                inputMode="decimal"
                value={wizard.targetProfitPct}
                onChange={(e) => wizard.setTargetProfitPct(e.target.value)}
                placeholder="0"
                style={pctInputStyle}
              />
              <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>%</span>
            </div>
            <div style={hintStyle}>Ideal: 10-20%</div>
          </div>

          <div>
            <label style={labelStyle}>Owner Pay %</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                inputMode="decimal"
                value={wizard.targetOwnerPayPct}
                onChange={(e) => wizard.setTargetOwnerPayPct(e.target.value)}
                placeholder="0"
                style={pctInputStyle}
              />
              <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>%</span>
            </div>
            <div style={hintStyle}>Ideal: 10-20%</div>
          </div>

          <div>
            <label style={labelStyle}>Tax %</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                inputMode="decimal"
                value={wizard.targetTaxPct}
                onChange={(e) => wizard.setTargetTaxPct(e.target.value)}
                placeholder="0"
                style={pctInputStyle}
              />
              <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>%</span>
            </div>
            <div style={hintStyle}>Ideal: 15-20%</div>
          </div>

          <div>
            <label style={labelStyle}>Op. Expenses %</label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                inputMode="decimal"
                value={wizard.targetOpexPct}
                onChange={(e) => wizard.setTargetOpexPct(e.target.value)}
                placeholder="0"
                style={pctInputStyle}
              />
              <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>%</span>
            </div>
            <div style={hintStyle}>Ideal: 30-40%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
