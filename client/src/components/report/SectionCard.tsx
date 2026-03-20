import React, { useState, useRef, useEffect } from "react";
import type { Severity } from "../../../../shared/report-types";

interface SectionCardProps {
  title: string;
  severity: Severity;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SEVERITY_BORDER: Record<Severity, string> = {
  critical: "#dc2626",
  warning: "#c5a572",
  healthy: "#16a34a",
  info: "#1b365d",
};

export default function SectionCard({
  title,
  severity,
  children,
  defaultOpen = false,
}: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children, open]);

  const borderColor = SEVERITY_BORDER[severity];

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "12px",
        borderLeft: `4px solid ${borderColor}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
        marginBottom: "16px",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
        aria-expanded={open}
      >
        <span
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#1b365d",
          }}
        >
          {title}
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
            flexShrink: 0,
            marginLeft: "12px",
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
        <div ref={contentRef} style={{ padding: "0 20px 16px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
