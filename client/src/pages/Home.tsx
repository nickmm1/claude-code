import React, { useState, useRef, useEffect } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import type { PastReport, MemberProfile } from "./RegisterPage";
import AnalyzingPage from "./AnalyzingPage";
import ReportHistory, { formatReport } from "./ReportHistory";
import ReportView from "./ReportView";
import { WizardShell } from "../components/wizard/WizardShell";
import { useWizardState } from "../hooks/useWizardState";
import { parseStructuredReport } from "../lib/parseStructuredReport";
import type { StructuredReport } from "../../../shared/report-types";

type Stage = "login" | "register" | "upload" | "analyzing" | "results" | "history";

const NAVY = "#1b365d";
const GOLD = "#c5a572";
const BG = "#f8f8f8";

export default function Home() {
  const [stage, setStage] = useState<Stage>("login");
  const [memberProfile, setMemberProfile] = useState<MemberProfile | null>(null);
  const [pastReports, setPastReports] = useState<PastReport[]>([]);
  const [report, setReport] = useState("");
  const [structuredReport, setStructuredReport] = useState<StructuredReport | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);

  const wizard = useWizardState();

  // On mount, check for existing session
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then(async (data: { valid: boolean }) => {
        if (data.valid) {
          setStage("register");
          try {
            const stored = localStorage.getItem("aa_profile");
            if (stored) {
              const p = JSON.parse(stored);
              if (p.email) wizard.setEmail(p.email);
              if (p.firstName) wizard.setFirstName(p.firstName);
              if (p.lastName) wizard.setLastName(p.lastName);
              if (p.salonName) wizard.setSalonName(p.salonName);
              if (p.businessModel) wizard.setBusinessModel(p.businessModel);
              if (p.phone) wizard.setPhone(p.phone);
              if (p.email) {
                const res = await fetch(`/api/member-lookup?email=${encodeURIComponent(p.email)}`);
                const lookup = await res.json();
                if (lookup.found && lookup.member) {
                  const m = lookup.member as MemberProfile;
                  setMemberProfile(m);
                  if (m.salonName) wizard.setSalonName(m.salonName);
                  if (m.businessModel) wizard.setBusinessModel(m.businessModel);
                }
                if (lookup.pastReports) setPastReports(lookup.pastReports);
              }
            }
          } catch { /* storage unavailable */ }
        }
      })
      .catch(() => { /* stay on login */ });
  }, []);

  const handleLoginSuccess = (email: string, memberName?: string) => {
    wizard.setEmail(email);
    if (memberName) {
      const parts = memberName.trim().split(" ");
      if (parts.length >= 2) {
        wizard.setFirstName(parts[0]);
        wizard.setLastName(parts.slice(1).join(" "));
      } else if (parts.length === 1) {
        wizard.setFirstName(parts[0]);
      }
    }
    fetch(`/api/member-lookup?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.found && data.member) {
          const m = data.member as MemberProfile;
          setMemberProfile(m);
          if (m.firstName) wizard.setFirstName(m.firstName);
          if (m.lastName) wizard.setLastName(m.lastName);
          if (m.salonName) wizard.setSalonName(m.salonName);
          if (m.businessModel) wizard.setBusinessModel(m.businessModel);
          if (m.phone) wizard.setPhone(m.phone);
        }
        if (data.pastReports) setPastReports(data.pastReports);
      })
      .catch(() => {});
    setStage("register");
  };

  const handleRegisterContinue = async () => {
    try {
      await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: wizard.firstName,
          lastName: wizard.lastName,
          email: wizard.email,
          salonName: wizard.salonName,
          businessModel: wizard.businessModel,
          phone: wizard.phone,
        }),
      });
    } catch { /* non-blocking */ }
    try {
      localStorage.setItem("aa_profile", JSON.stringify({
        email: wizard.email,
        firstName: wizard.firstName,
        lastName: wizard.lastName,
        salonName: wizard.salonName,
        businessModel: wizard.businessModel,
        phone: wizard.phone,
      }));
    } catch { /* storage unavailable */ }
    setStage("upload");
  };

  const handleAnalyze = async () => {
    const hasRevenue = wizard.totalServiceRevenue.trim() !== "" || wizard.totalRetailRevenue.trim() !== "";
    const totalFiles = wizard.commissionFiles.length + wizard.bankFiles.length;
    if (!hasRevenue && totalFiles === 0) return;

    setStage("analyzing");
    setError("");
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) { clearInterval(progressInterval); return 90; }
        return p + Math.random() * 8;
      });
    }, 800);

    try {
      const formData = new FormData();
      formData.append("salonName", wizard.salonName);
      formData.append("email", wizard.email);
      formData.append("firstName", wizard.firstName);
      formData.append("lastName", wizard.lastName);
      formData.append("businessModel", wizard.businessModel);
      if (wizard.totalServiceRevenue) formData.append("totalServiceRevenue", wizard.totalServiceRevenue);
      if (wizard.totalRetailRevenue) formData.append("totalRetailRevenue", wizard.totalRetailRevenue);
      if (wizard.totalClients) formData.append("totalClients", wizard.totalClients);
      if (wizard.desiredOwnerSalary) formData.append("desiredOwnerSalary", wizard.desiredOwnerSalary);
      if (wizard.partsAndLaborEnabled && wizard.partsAndLaborAmount) formData.append("partsAndLaborAmount", wizard.partsAndLaborAmount);
      if (wizard.cashReserves) formData.append("cashReserves", wizard.cashReserves);
      if (wizard.currentProfitPct) formData.append("currentProfitPct", wizard.currentProfitPct);
      if (wizard.currentOwnerPayDollar) formData.append("currentOwnerPayDollar", wizard.currentOwnerPayDollar);
      if (wizard.currentTaxPct) formData.append("currentTaxPct", wizard.currentTaxPct);
      if (wizard.currentOpexPct) formData.append("currentOpexPct", wizard.currentOpexPct);
      if (wizard.targetProfitPct) formData.append("targetProfitPct", wizard.targetProfitPct);
      if (wizard.targetOwnerPayPct) formData.append("targetOwnerPayPct", wizard.targetOwnerPayPct);
      if (wizard.targetTaxPct) formData.append("targetTaxPct", wizard.targetTaxPct);
      if (wizard.targetOpexPct) formData.append("targetOpexPct", wizard.targetOpexPct);
      if (wizard.totalPayroll) formData.append("totalPayroll", wizard.totalPayroll);
      if (wizard.numberOfEmployees) formData.append("numberOfEmployees", wizard.numberOfEmployees);
      if (wizard.avgHourlyWage) formData.append("avgHourlyWage", wizard.avgHourlyWage);
      if (wizard.totalHoursWorked) formData.append("totalHoursWorked", wizard.totalHoursWorked);
      if (wizard.hybridBoothRentalIncome) formData.append("hybridBoothRentalIncome", wizard.hybridBoothRentalIncome);
      if (wizard.hybridEmployeeRevenue) formData.append("hybridEmployeeRevenue", wizard.hybridEmployeeRevenue);
      if (wizard.hybridNumberOfBooth) formData.append("hybridNumberOfBooth", wizard.hybridNumberOfBooth);
      if (wizard.hybridNumberOfEmployees) formData.append("hybridNumberOfEmployees", wizard.hybridNumberOfEmployees);
      for (const f of wizard.commissionFiles) formData.append("commissionReport", f);
      for (const f of wizard.bankFiles) formData.append("bankStatement", f);

      const response = await fetch("/api/analyze", { method: "POST", body: formData });
      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed. Please try again.");

      setReport(data.report);
      setStructuredReport(data.structuredReport || null);
      setStage("results");
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStage("upload");
    }
  };

  const handleStartOver = () => {
    setStage("upload");
    setReport("");
    setStructuredReport(null);
    wizard.reset();
  };

  const handleViewHistoryReport = (r: PastReport) => {
    if (r.structuredReport) {
      const parsed = parseStructuredReport(r.structuredReport);
      if (parsed) {
        setStructuredReport(parsed);
        setReport(r.fullReport);
        setStage("results");
        return;
      }
    }
    // V1 fallback: render inline in history
    setReport(r.fullReport);
    setStructuredReport(null);
    setStage("results");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      {/* Header */}
      <header style={{ backgroundColor: NAVY }} className="no-print">
        <div className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <div style={{ color: GOLD, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "2px" }}>
              The Level Up Academy
            </div>
            <h1 style={{ color: "white", fontSize: "1.4rem", fontWeight: 800, margin: 0 }}>
              The AI Accountant
            </h1>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.7rem", marginTop: "3px", letterSpacing: "0.05em" }}>
              Powered by Mirabella OS
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: GOLD, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Force 4: Profit &amp; Protection
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", marginTop: "2px" }}>
              Nick Mirabella
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "6px", justifyContent: "flex-end" }}>
              <a
                href="/glossary"
                style={{ background: "none", border: "1px solid rgba(197,165,114,0.5)", color: GOLD, fontSize: "0.65rem", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", letterSpacing: "0.05em", textDecoration: "none" }}
              >
                Glossary
              </a>
              {stage !== "login" && stage !== "register" && (
                <button
                  onClick={handleStartOver}
                  style={{ background: "none", border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.6)", fontSize: "0.65rem", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", letterSpacing: "0.05em" }}
                >
                  Start Over
                </button>
              )}
            </div>
          </div>
        </div>
        <div style={{ height: "3px", backgroundColor: GOLD }} />
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {stage === "login" && (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        )}

        {stage === "register" && (
          <RegisterPage
            email={wizard.email}
            firstName={wizard.firstName}
            lastName={wizard.lastName}
            phone={wizard.phone}
            salonName={wizard.salonName}
            businessModel={wizard.businessModel}
            memberProfile={memberProfile}
            pastReports={pastReports}
            onFieldChange={(field, value) => {
              const setterName = `set${field.charAt(0).toUpperCase() + field.slice(1)}`;
              const setter = (wizard as Record<string, unknown>)[setterName];
              if (typeof setter === "function") (setter as (v: string) => void)(value);
            }}
            onContinue={handleRegisterContinue}
            onViewHistory={() => setStage("history")}
          />
        )}

        {stage === "upload" && (
          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ color: NAVY, fontSize: "1.4rem", fontWeight: 800, margin: "0 0 0.25rem" }}>
                Profit First Analysis
              </h2>
              <p style={{ color: "#666", fontSize: "0.9rem", margin: 0 }}>
                Walk through each step below. The AI will assess your profitability and build your action plan.
              </p>
            </div>

            {pastReports.length > 0 && (
              <div style={{ marginBottom: "1.5rem", padding: "0.875rem 1rem", backgroundColor: "#f5f0e8", borderRadius: "6px", borderLeft: `3px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.85rem", color: NAVY, fontWeight: 600 }}>
                  {pastReports.length} past {pastReports.length === 1 ? "report" : "reports"} on file
                </span>
                <button onClick={() => setStage("history")} style={{ fontSize: "0.8rem", color: GOLD, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                  View history
                </button>
              </div>
            )}

            {error && (
              <div style={{ padding: "1rem", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "6px", color: "#dc2626", fontSize: "0.875rem", marginBottom: "1rem" }}>
                {error}
              </div>
            )}

            <WizardShell wizard={wizard} onSubmit={handleAnalyze} />
          </div>
        )}

        {stage === "analyzing" && (
          <AnalyzingPage progress={progress} />
        )}

        {stage === "results" && (
          <div ref={reportRef}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }} className="no-print">
              <div>
                <h2 style={{ color: NAVY, fontSize: "1.4rem", fontWeight: 800, margin: "0 0 0.25rem" }}>Your Profit First Analysis</h2>
                <p style={{ color: "#666", fontSize: "0.85rem", margin: 0 }}>
                  {wizard.salonName} &bull; {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={handleStartOver} style={{ padding: "0.625rem 1.25rem", backgroundColor: "white", color: NAVY, border: `2px solid ${NAVY}`, borderRadius: "6px", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}>
                  New Analysis
                </button>
                <button onClick={() => window.print()} style={{ padding: "0.625rem 1.25rem", backgroundColor: GOLD, color: "white", border: "none", borderRadius: "6px", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}>
                  Print / Save PDF
                </button>
              </div>
            </div>

            {structuredReport ? (
              <ReportView report={structuredReport} />
            ) : (
              <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <div className="report-content" dangerouslySetInnerHTML={{ __html: formatReport(report) }} />
              </div>
            )}

            <div style={{ marginTop: "2rem", paddingTop: "1.25rem", borderTop: "2px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
              <div style={{ fontSize: "0.8rem", color: "#888" }}>
                Powered by The Level Up Academy | nickmirabella.com
              </div>
              <a
                href="/glossary"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", fontWeight: 700, color: NAVY, textDecoration: "none", border: `1px solid ${GOLD}`, borderRadius: "5px", padding: "0.35rem 0.85rem", backgroundColor: "#fdf9f3" }}
              >
                Not sure what a term means? Visit the Glossary
              </a>
            </div>
          </div>
        )}

        {stage === "history" && (
          <ReportHistory
            salonName={wizard.salonName}
            email={wizard.email}
            pastReports={pastReports}
            onNewAnalysis={() => setStage("upload")}
            onViewReport={handleViewHistoryReport}
          />
        )}
      </main>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          header { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}
