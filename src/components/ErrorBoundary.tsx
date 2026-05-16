"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Optional 2D fallback to show instead of the error message */
  fallback2D?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  handleReport = () => {
    const subject = encodeURIComponent("BioSphere 3D Rendering Error");
    const body = encodeURIComponent(
      `Error: ${this.state.errorMessage}\nURL: ${typeof window !== "undefined" ? window.location.href : ""}\nUserAgent: ${typeof navigator !== "undefined" ? navigator.userAgent : ""}`
    );
    window.open(`mailto:support@biosphere.dev?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      // If a 2D fallback is available, render it instead
      if (this.props.fallback2D) {
        return (
          <>
            <div style={bannerStyle}>
              <span style={bannerIcon}>⚠️</span>
              <span>3D view unavailable — showing 2D fallback</span>
              <button
                onClick={this.handleRetry}
                style={bannerBtn}
                aria-label="Try loading 3D view again"
              >
                Retry 3D
              </button>
            </div>
            {this.props.fallback2D}
          </>
        );
      }

      return (
        <div style={containerStyle}>
          {/* DNA-ish decorative lines */}
          <div style={decorLineLeft} />
          <div style={decorLineRight} />

          <div style={cardStyle}>
            <div style={iconStyle}>🧬</div>
            <h2 style={headingStyle}>Oops! Something went wrong with 3D rendering</h2>
            <p style={descStyle}>
              Try refreshing the page or use a different browser.
              <br />
              Chrome, Edge, or Firefox with hardware acceleration are recommended.
            </p>

            {this.state.errorMessage && (
              <code style={codeStyle}>{this.state.errorMessage}</code>
            )}

            <div style={btnRow}>
              <button
                onClick={this.handleRetry}
                style={primaryBtn}
                aria-label="Retry rendering"
              >
                ↻ Try Again
              </button>
              <button
                onClick={this.handleReport}
                style={secondaryBtn}
                aria-label="Report this error"
              >
                📨 Report Error
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/* ─── Styles ──────────────────────────────────────────────── */

const containerStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  minHeight: "60vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#050A05",
  overflow: "hidden",
  padding: "40px 20px",
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

const bannerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  padding: "10px 20px",
  background: "rgba(57,255,20,0.08)",
  borderBottom: "1px solid rgba(57,255,20,0.15)",
  color: "rgba(200,245,200,0.8)",
  fontSize: "0.85rem",
};

const bannerIcon: React.CSSProperties = { fontSize: "1.1rem" };

const bannerBtn: React.CSSProperties = {
  padding: "4px 14px",
  borderRadius: 999,
  border: "1px solid rgba(57,255,20,0.3)",
  background: "transparent",
  color: "#39FF14",
  fontSize: "0.8rem",
  cursor: "pointer",
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
