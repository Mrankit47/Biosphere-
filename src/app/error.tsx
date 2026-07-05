"use client";

import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[RootError] Unhandled error:", error);
  }, [error]);

  return (
    <div style={containerStyle}>
      <div style={decorLineLeft} />
      <div style={decorLineRight} />

      <div style={cardStyle}>
        <div style={iconStyle}>🧬</div>
        <h2 style={headingStyle}>Oops! Something went wrong</h2>
        <p style={descStyle}>
          An unexpected error occurred in the application. Please try reloading or resetting the view.
        </p>

        {error.message && (
          <code style={codeStyle}>{error.message}</code>
        )}

        <div style={btnRow}>
          <button
            onClick={reset}
            style={primaryBtn}
            aria-label="Retry loading this page"
          >
            ↻ Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            style={secondaryBtn}
            aria-label="Reload page"
          >
            🔄 Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ──────────────────────────────────────────────── */

const containerStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#050A05",
  overflow: "hidden",
  padding: "80px 20px",
  boxSizing: "border-box",
};

const cardStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  maxWidth: 520,
  width: "100%",
  padding: "48px 36px",
  borderRadius: 20,
  background: "rgba(10, 20, 10, 0.85)",
  border: "1px solid rgba(57, 255, 20, 0.12)",
  backdropFilter: "blur(16px)",
  textAlign: "center",
  boxShadow: "0 0 80px rgba(57,255,20,0.06)",
};

const iconStyle: React.CSSProperties = {
  fontSize: "3rem",
  marginBottom: 16,
  filter: "drop-shadow(0 0 12px rgba(57,255,20,0.5))",
};

const headingStyle: React.CSSProperties = {
  fontSize: "1.35rem",
  fontWeight: 700,
  color: "#C8F5C8",
  margin: "0 0 12px",
  lineHeight: 1.4,
  fontFamily: "inherit",
};

const descStyle: React.CSSProperties = {
  fontSize: "0.95rem",
  color: "rgba(200,245,200,0.6)",
  lineHeight: 1.7,
  margin: "0 0 20px",
};

const codeStyle: React.CSSProperties = {
  display: "block",
  padding: "10px 16px",
  borderRadius: 8,
  background: "rgba(57,255,20,0.06)",
  border: "1px solid rgba(57,255,20,0.1)",
  color: "rgba(57,255,20,0.7)",
  fontSize: "0.78rem",
  marginBottom: 24,
  overflowX: "auto",
  wordBreak: "break-all",
  fontFamily: "monospace",
};

const btnRow: React.CSSProperties = {
  display: "flex",
  gap: 12,
  justifyContent: "center",
  flexWrap: "wrap",
};

const primaryBtn: React.CSSProperties = {
  padding: "12px 28px",
  borderRadius: 999,
  border: "1.5px solid #39FF14",
  background: "rgba(57,255,20,0.1)",
  color: "#39FF14",
  fontSize: "0.95rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.3s ease",
  minHeight: 44,
};

const secondaryBtn: React.CSSProperties = {
  ...primaryBtn,
  background: "transparent",
  borderColor: "rgba(57,255,20,0.25)",
  color: "rgba(200,245,200,0.7)",
};

const decorLineLeft: React.CSSProperties = {
  position: "absolute",
  left: "15%",
  top: "10%",
  width: 2,
  height: "80%",
  background:
    "linear-gradient(to bottom, transparent, rgba(57,255,20,0.15), transparent)",
  borderRadius: 1,
};

const decorLineRight: React.CSSProperties = {
  position: "absolute",
  right: "15%",
  top: "10%",
  width: 2,
  height: "80%",
  background:
    "linear-gradient(to bottom, transparent, rgba(57,255,20,0.15), transparent)",
  borderRadius: 1,
};
