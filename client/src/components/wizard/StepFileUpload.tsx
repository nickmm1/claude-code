import React, { useState, useRef } from "react";
import { WizardState } from "../../hooks/useWizardState";

const NAVY = "#1b365d";
const GOLD = "#c5a572";

const ACCEPTED = ".csv,.xlsx,.xls,.pdf,.txt";

interface StepFileUploadProps {
  wizard: WizardState;
}

function FileUploadSlot({
  label,
  description,
  files,
  maxCount,
  onAdd,
  onRemove,
}: {
  label: string;
  description: string;
  files: File[];
  maxCount: number;
  onAdd: (f: FileList | null) => void;
  onRemove: (i: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        padding: "1.25rem 1.5rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, color: NAVY, fontSize: "0.95rem" }}>{label}</div>
          <div style={{ fontSize: "0.78rem", color: "#888", marginTop: "2px" }}>{description}</div>
        </div>
        <span
          style={{
            fontSize: "0.72rem",
            color: files.length > 0 ? "#16a34a" : "#999",
            fontWeight: 600,
            whiteSpace: "nowrap",
            marginLeft: "1rem",
          }}
        >
          {files.length}/{maxCount} uploaded
        </span>
      </div>

      {files.length > 0 && (
        <div style={{ marginBottom: "0.75rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {files.map((f, fi) => (
            <div
              key={fi}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem 0.75rem",
                backgroundColor: "#f0f7f0",
                borderRadius: "5px",
                border: "1px solid #bbf7d0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg width="14" height="14" fill="#16a34a" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                <span style={{ fontSize: "0.8rem", color: "#166534", fontWeight: 500 }}>{f.name}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(fi)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#999",
                  fontSize: "1rem",
                  lineHeight: 1,
                  padding: "0 2px",
                }}
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length < maxCount && (
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 1rem",
            border: `2px dashed ${GOLD}`,
            borderRadius: "6px",
            cursor: "pointer",
            color: NAVY,
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          <svg width="16" height="16" fill={GOLD} viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          {files.length > 0
            ? `Add Another ${label.replace(/s$/, "").replace(/Reports/, "Report")}`
            : `Upload ${label}`}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            multiple
            style={{ display: "none" }}
            onChange={(e) => onAdd(e.target.files)}
          />
        </label>
      )}
    </div>
  );
}

export default function StepFileUpload({ wizard }: StepFileUploadProps) {
  const [howToOpen, setHowToOpen] = useState(false);

  const addFiles = (existing: File[], newFiles: FileList | null, max: number): File[] => {
    if (!newFiles) return existing;
    const remaining = max - existing.length;
    return [...existing, ...Array.from(newFiles).slice(0, remaining)];
  };

  const removeFile = (files: File[], index: number): File[] => files.filter((_, i) => i !== index);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ marginBottom: "0.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: NAVY, margin: 0 }}>
          Upload Your Files
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
          Upload your commission reports and bank statements. The more data you give us, the deeper the analysis. Files are optional if you entered revenue numbers in Step 1.
        </p>
      </div>

      {/* Commission / Payroll Reports */}
      <FileUploadSlot
        label="Commission / Payroll Reports"
        description="Your POS or payroll export showing stylist-level revenue and commissions."
        files={wizard.commissionFiles}
        maxCount={3}
        onAdd={(f) => wizard.setCommissionFiles(addFiles(wizard.commissionFiles, f, 3))}
        onRemove={(i) => wizard.setCommissionFiles(removeFile(wizard.commissionFiles, i))}
      />

      {/* Bank Statements */}
      <FileUploadSlot
        label="Bank Statements"
        description="Your business checking account statement for the month."
        files={wizard.bankFiles}
        maxCount={2}
        onAdd={(f) => wizard.setBankFiles(addFiles(wizard.bankFiles, f, 2))}
        onRemove={(i) => wizard.setBankFiles(removeFile(wizard.bankFiles, i))}
      />

      {/* How to get reports - collapsible */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          onClick={() => setHowToOpen(!howToOpen)}
          style={{
            width: "100%",
            padding: "0.875rem 1.25rem",
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: NAVY,
            fontWeight: 700,
            fontSize: "0.88rem",
          }}
        >
          <span>How to Get Your Reports</span>
          <svg
            width="14"
            height="14"
            fill={NAVY}
            viewBox="0 0 24 24"
            style={{
              transform: howToOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </button>

        {howToOpen && (
          <div style={{ padding: "0 1.25rem 1rem", fontSize: "0.82rem", color: "#555", lineHeight: 1.6 }}>
            <p style={{ margin: "0 0 0.5rem" }}>
              <strong>Commission Reports:</strong> Log into your POS system (Boulevard, Vagaro, Square, etc.) and export a payroll or commission summary for the month. Look for "Reports" then "Payroll" or "Commission."
            </p>
            <p style={{ margin: "0 0 0.5rem" }}>
              <strong>Bank Statements:</strong> Download your business checking account statement from your bank's website. Most banks let you export as CSV or PDF under "Statements" or "Activity."
            </p>
            <p style={{ margin: "0 0 0.5rem" }}>
              Accepted formats: CSV, Excel (.xlsx, .xls), PDF, or plain text (.txt).
            </p>
          </div>
        )}
      </div>

      {/* Pro tip */}
      <div
        style={{
          backgroundColor: "#f0f4ff",
          border: `1px solid ${NAVY}22`,
          borderRadius: "8px",
          padding: "0.75rem 1rem",
          fontSize: "0.8rem",
          color: NAVY,
        }}
      >
        <strong>Pro tip:</strong> If your report has extra pages or summary info you do not need, paste it into ChatGPT and ask it to clean it up before uploading. Cleaner data means a sharper analysis.
      </div>
    </div>
  );
}
