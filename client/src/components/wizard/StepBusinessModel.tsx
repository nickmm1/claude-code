import React from "react";
import { WizardState } from "../../hooks/useWizardState";

const NAVY = "#1b365d";

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

const BUSINESS_MODELS = [
  "Commission W-2",
  "Rev Share",
  "Hourly W-2",
  "Booth Rental",
  "Independent / Solo",
  "Hybrid",
];

interface StepBusinessModelProps {
  wizard: WizardState;
}

export default function StepBusinessModel({ wizard }: StepBusinessModelProps) {
  const showHourly = wizard.businessModel === "Hourly W-2";
  const showHybrid = wizard.businessModel === "Hybrid";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ marginBottom: "0.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: NAVY, margin: 0 }}>
          Business Model
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
          Tell us how your salon is structured so we can run the right calculations.
        </p>
      </div>

      {/* Business Model Dropdown */}
      <div>
        <label style={labelStyle}>Business Model</label>
        <select
          value={wizard.businessModel}
          onChange={(e) => wizard.setBusinessModel(e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          {BUSINESS_MODELS.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
        <div style={helperStyle}>Select the model that best describes how you pay your team.</div>
      </div>

      {/* Hourly W-2 fields */}
      {showHourly && (
        <div
          style={{
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: NAVY }}>
            Hourly Payroll Details
          </div>

          <div>
            <label style={labelStyle}>Total Payroll</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>$</span>
              <input
                type="text"
                inputMode="decimal"
                value={wizard.totalPayroll}
                onChange={(e) => wizard.setTotalPayroll(e.target.value)}
                placeholder="0.00"
                style={dollarInputStyle}
              />
            </div>
            <div style={helperStyle}>Total payroll expense for the month, including taxes and benefits.</div>
          </div>

          <div>
            <label style={labelStyle}>Number of Employees</label>
            <input
              type="text"
              inputMode="numeric"
              value={wizard.numberOfEmployees}
              onChange={(e) => wizard.setNumberOfEmployees(e.target.value)}
              placeholder="0"
              style={inputStyle}
            />
            <div style={helperStyle}>Total W-2 employees on your payroll.</div>
          </div>

          <div>
            <label style={labelStyle}>Average Hourly Wage</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>$</span>
              <input
                type="text"
                inputMode="decimal"
                value={wizard.avgHourlyWage}
                onChange={(e) => wizard.setAvgHourlyWage(e.target.value)}
                placeholder="0.00"
                style={dollarInputStyle}
              />
            </div>
            <div style={helperStyle}>Average hourly rate across all employees.</div>
          </div>

          <div>
            <label style={labelStyle}>Total Hours Worked</label>
            <input
              type="text"
              inputMode="numeric"
              value={wizard.totalHoursWorked}
              onChange={(e) => wizard.setTotalHoursWorked(e.target.value)}
              placeholder="0"
              style={inputStyle}
            />
            <div style={helperStyle}>Combined hours worked by all employees for the month.</div>
          </div>
        </div>
      )}

      {/* Hybrid fields */}
      {showHybrid && (
        <div
          style={{
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            padding: "1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: NAVY }}>
            Hybrid Model Breakdown
          </div>

          <div>
            <label style={labelStyle}>Booth Rental Income</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>$</span>
              <input
                type="text"
                inputMode="decimal"
                value={wizard.hybridBoothRentalIncome}
                onChange={(e) => wizard.setHybridBoothRentalIncome(e.target.value)}
                placeholder="0.00"
                style={dollarInputStyle}
              />
            </div>
            <div style={helperStyle}>Total rent collected from booth renters this month.</div>
          </div>

          <div>
            <label style={labelStyle}>Employee Revenue</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#999", fontWeight: 600 }}>$</span>
              <input
                type="text"
                inputMode="decimal"
                value={wizard.hybridEmployeeRevenue}
                onChange={(e) => wizard.setHybridEmployeeRevenue(e.target.value)}
                placeholder="0.00"
                style={dollarInputStyle}
              />
            </div>
            <div style={helperStyle}>Total revenue generated by your W-2 or commission employees.</div>
          </div>

          <div>
            <label style={labelStyle}>Number of Booth Renters</label>
            <input
              type="text"
              inputMode="numeric"
              value={wizard.hybridNumberOfBooth}
              onChange={(e) => wizard.setHybridNumberOfBooth(e.target.value)}
              placeholder="0"
              style={inputStyle}
            />
            <div style={helperStyle}>How many booth renters are in your salon.</div>
          </div>

          <div>
            <label style={labelStyle}>Number of Employees</label>
            <input
              type="text"
              inputMode="numeric"
              value={wizard.hybridNumberOfEmployees}
              onChange={(e) => wizard.setHybridNumberOfEmployees(e.target.value)}
              placeholder="0"
              style={inputStyle}
            />
            <div style={helperStyle}>How many W-2 or commission employees you have alongside your renters.</div>
          </div>
        </div>
      )}
    </div>
  );
}
