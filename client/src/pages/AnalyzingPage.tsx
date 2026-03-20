import React from "react";

const NAVY = "#1b365d";
const GOLD = "#c5a572";

interface AnalyzingPageProps {
  progress: number;
}

export default function AnalyzingPage({ progress }: AnalyzingPageProps) {
  const clampedProgress = Math.min(progress, 100);

  return (
    <div
      className="max-w-md mx-auto"
      style={{ textAlign: "center", paddingTop: "4rem" }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          backgroundColor: NAVY,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.5rem",
        }}
      >
        <svg width="32" height="32" fill={GOLD} viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
        </svg>
      </div>
      <h2
        style={{
          color: NAVY,
          fontSize: "1.4rem",
          fontWeight: 800,
          marginBottom: "0.5rem",
        }}
      >
        Analyzing Your Numbers
      </h2>
      <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "2rem" }}>
        The AI Accountant is reviewing your reports and building your Profit
        First analysis. This takes 30-60 seconds.
      </p>
      <div
        style={{
          backgroundColor: "#e5e7eb",
          borderRadius: "100px",
          height: "8px",
          overflow: "hidden",
          marginBottom: "0.75rem",
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: GOLD,
            borderRadius: "100px",
            width: `${clampedProgress}%`,
            transition: "width 0.5s ease",
          }}
        />
      </div>
      <p style={{ color: "#999", fontSize: "0.8rem" }}>
        {Math.round(clampedProgress)}% complete
      </p>
    </div>
  );
}
