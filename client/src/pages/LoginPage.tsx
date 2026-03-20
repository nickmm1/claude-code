import React, { useState } from "react";

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

interface LoginPageProps {
  onLoginSuccess: (email: string, memberName?: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    const trimmedEmail = loginEmail.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setLoginError("Please enter a valid email address.");
      setLoginLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: trimmedEmail }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        email?: string;
        memberName?: string;
      };
      if (res.ok && data.success) {
        onLoginSuccess(data.email || trimmedEmail, data.memberName);
      } else {
        setLoginError(
          data.error ||
            "We could not find that email. Please use the email you signed up with."
        );
      }
    } catch {
      setLoginError("Connection error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <div style={{ backgroundColor: NAVY, padding: "2rem", textAlign: "center" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: GOLD,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
          </div>
          <h2
            style={{
              color: "white",
              fontSize: "1.3rem",
              fontWeight: 700,
              margin: "0 0 0.5rem",
            }}
          >
            Members Only Access
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.875rem",
              margin: 0,
            }}
          >
            Enter the email address you used to join The Level Up Academy
          </p>
        </div>
        <div style={{ padding: "2rem" }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Your Email Address</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="jane@yoursalon.com"
                autoComplete="email"
                autoFocus
                style={{
                  ...inputStyle,
                  borderColor: loginError ? "#dc2626" : "#e5e7eb",
                }}
                required
              />
              {loginError && (
                <div
                  style={{
                    marginTop: "0.75rem",
                    padding: "0.875rem 1rem",
                    backgroundColor: "#fef2f2",
                    borderRadius: "6px",
                    border: "1px solid #fecaca",
                  }}
                >
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "0.82rem",
                      margin: "0 0 0.5rem",
                      fontWeight: 600,
                    }}
                  >
                    We could not find that email in our member list.
                  </p>
                  <p
                    style={{
                      color: "#7f1d1d",
                      fontSize: "0.8rem",
                      margin: 0,
                      lineHeight: "1.6",
                    }}
                  >
                    Make sure you are using the same email you used to sign up.
                    If you need help, reach out to us:
                  </p>
                  <div
                    style={{
                      marginTop: "0.5rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    <a
                      href="mailto:support@nickmirabella.com"
                      style={{
                        color: NAVY,
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      support@nickmirabella.com
                    </a>
                    <a
                      href="tel:9088084849"
                      style={{
                        color: NAVY,
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      (908) 808-4849
                    </a>
                  </div>
                </div>
              )}
            </div>
            <button
              type="submit"
              style={{ ...btnPrimary, opacity: loginLoading ? 0.6 : 1 }}
              disabled={loginLoading}
            >
              {loginLoading ? "Checking membership..." : "Access The AI Accountant"}
            </button>
          </form>
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              backgroundColor: "#f5f0e8",
              borderRadius: "6px",
              borderLeft: `3px solid ${GOLD}`,
            }}
          >
            <p
              style={{
                fontSize: "0.8rem",
                color: "#555",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              This tool is exclusively for Level Up Academy members. Use the
              email address you used when you enrolled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
