"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import ErrorState from "./ds/ErrorState";

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
            <div className="flex items-center justify-center gap-3 p-[10px_20px] bg-[rgba(57,255,20,0.08)] border-b border-[rgba(57,255,20,0.15)] text-[rgba(200,245,200,0.8)] text-[0.85rem]">
              <span className="text-[1.1rem]">⚠️</span>
              <span>3D view unavailable — showing 2D fallback</span>
              <button
                onClick={this.handleRetry}
                className="px-3.5 py-1 rounded-[999px] border border-[rgba(57,255,20,0.3)] bg-transparent text-[#39FF14] text-[0.8rem] cursor-none"
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
        <div className="relative w-full min-h-[60vh] flex items-center justify-center bg-[var(--ds-bg-primary)] overflow-hidden p-[40px_20px] box-border">
          {/* DNA-ish decorative lines */}
          <div className="absolute left-[15%] top-[10%] w-[2px] h-[80%] bg-[var(--ds-gradient-fade-accent)] rounded-[1px]" />
          <div className="absolute right-[15%] top-[10%] w-[2px] h-[80%] bg-[var(--ds-gradient-fade-accent)] rounded-[1px]" />

          <ErrorState
            icon="🧬"
            title="Oops! Something went wrong with 3D rendering"
            description="Try refreshing the page or use a different browser. Chrome, Edge, or Firefox with hardware acceleration are recommended."
            errorMessage={this.state.errorMessage}
            onRetry={this.handleRetry}
            onAction={this.handleReport}
            actionLabel="📨 Report Error"
          />
        </div>
      );
    }

    return this.props.children;
  }
}
