import React from "react";

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

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  fontWeight: 700,
  color: "#444",
  marginBottom: "0.35rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const btnPrimary: React.CSSProperties = {
  width: "100%",
  padding: "0.875rem",
  backgroundColor: NAVY,
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "1rem",
  fontWeight: 700,
  cursor: "pointer",
};

export interface PastReport {
  recordId: string;
  analysisDate: string;
  totalRevenue: string;
  realRevenue: string;
  stage: string;
  topBottleneck: string;
  fullReport: string;
  structuredReport?: string;
}

export interface MemberProfile {
  recordId: string;
  firstName: string;
  lastName: string;
  email: string;
  salonName: string;
  businessModel: string;
  phone: string;
  status: string;
}

interface RegisterPageProps {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  salonName: string;
  businessModel: string;
  memberProfile: MemberProfile | null;
  pastReports: PastReport[];
  onFieldChange: (field: string, value: string) => void;
  onContinue: () => void;
  onViewHistory: () => void;
}

export default function RegisterPage({
  email,
  firstName,
  lastName,
  phone,
  salonName,
  businessModel,
  memberProfile,
  pastReports,
  onFieldChange,
  onContinue,
  onViewHistory,
}: RegisterPageProps) {
  const [lookupLoading, setLookupLoading] = React.useState(false);

  const handleEmailBlur = async () => {
    if (!email || !email.includes("@")) return;
    setLookupLoading(true);
    try {
      const res = await fetch(
        `/api/member-lookup?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      if (data.found && data.member) {
        const m = data.member as MemberProfile;
        if (m.firstName) onFieldChange("firstName", m.firstName);
        if (m.lastName) onFieldChange("lastName", m.lastName);
        if (m.salonName) onFieldChange("salonName", m.salonName);
        if (m.businessModel) onFieldChange("businessModel", m.businessModel);
        if (m.phone) onFieldChange("phone", m.phone);
        onFieldChange("memberProfile", JSON.stringify(m));
      }
      if (data.pastReports) {
        onFieldChange("pastReports", JSON.stringify(data.pastReports));
      }
    } catch {
      /* silent */
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue();
  };

  return (
    <div className="max-w-lg mx-auto">
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <div style={{ backgroundColor: NAVY, padding: "1.5rem 2rem" }}>
          <h2
            style={{
              color: "white",
              fontSize: "1.2rem",
              fontWeight: 700,
              margin: "0 0 0.25rem",
            }}
          >
            Quick Setup
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.85rem",
              margin: 0,
            }}
          >
            Tell us about your salon so we can personalize your Profit First
            analysis. Takes 30 seconds.
          </p>
        </div>
        <div style={{ padding: "2rem" }}>
          <form onSubmit={handleSubmit}>
            {/* Email first -- triggers profile lookup */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Email Address *</label>
              <input
                style={inputStyle}
                type="email"
                value={email}
                onChange={(e) => onFieldChange("email", e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="jane@yoursalon.com"
                required
                autoFocus
              />
              {lookupLoading && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: GOLD,
                    marginTop: "0.3rem",
                  }}
                >
                  Looking up your profile...
                </p>
              )}
              {memberProfile && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.6rem 0.875rem",
                    backgroundColor: "#f0fdf4",
                    borderRadius: "5px",
                    border: "1px solid #bbf7d0",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    fill="#16a34a"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#166534",
                      fontWeight: 600,
                    }}
                  >
                    Welcome back
                    {memberProfile.firstName
                      ? `, ${memberProfile.firstName}`
                      : ""}
                    ! Your profile has been loaded.
                  </span>
                </div>
              )}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <label style={labelStyle}>First Name</label>
                <input
                  style={inputStyle}
                  value={firstName}
                  onChange={(e) => onFieldChange("firstName", e.target.value)}
                  placeholder="Jane"
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  style={inputStyle}
                  value={lastName}
                  onChange={(e) => onFieldChange("lastName", e.target.value)}
                  placeholder="Smith"
                />
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Phone Number</label>
              <input
                style={inputStyle}
                type="tel"
                value={phone}
                onChange={(e) => onFieldChange("phone", e.target.value)}
                placeholder="(555) 000-0000"
              />
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Salon / Business Name *</label>
              <input
                style={inputStyle}
                value={salonName}
                onChange={(e) => onFieldChange("salonName", e.target.value)}
                placeholder="The Style Lounge"
                required
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Business Model *</label>
              <select
                style={{ ...inputStyle, backgroundColor: "white" }}
                value={businessModel}
                onChange={(e) => onFieldChange("businessModel", e.target.value)}
              >
                <option value="Commission W-2">Commission W-2</option>
                <option value="Rev Share">Rev Share</option>
                <option value="Hourly W-2">Hourly W-2</option>
                <option value="Booth Rental">Booth Rental</option>
                <option value="Independent / Solo">Independent / Solo</option>
                <option value="Hybrid">
                  Hybrid (Booth + W-2/Rev Share Mix)
                </option>
              </select>
            </div>

            {pastReports.length > 0 && (
              <div
                style={{
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  backgroundColor: "#f5f0e8",
                  borderRadius: "6px",
                  borderLeft: `3px solid ${GOLD}`,
                }}
              >
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: NAVY,
                    fontWeight: 600,
                    margin: "0 0 0.25rem",
                  }}
                >
                  You have {pastReports.length} past{" "}
                  {pastReports.length === 1 ? "report" : "reports"} on file.
                </p>
                <button
                  type="button"
                  onClick={onViewHistory}
                  style={{
                    fontSize: "0.8rem",
                    color: GOLD,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontWeight: 600,
                  }}
                >
                  View report history &rarr;
                </button>
              </div>
            )}

            <button type="submit" style={btnPrimary}>
              Continue to Analysis
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
