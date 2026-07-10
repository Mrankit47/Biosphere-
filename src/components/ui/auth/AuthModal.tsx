"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth, UserRole } from "./AuthContext";

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    signInWithEmail,
    signUpWithEmail,
    signInWithOAuth,
    resetPassword,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  
  // Feedback states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Focus and resets on state change
  useEffect(() => {
    if (authModalOpen) {
      setErrorMsg(null);
      setSuccessMsg(null);
      setPassword("");
    }
  }, [authModalOpen, activeTab]);

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setAuthModalOpen(false);
      }
    };
    if (authModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [authModalOpen, setAuthModalOpen]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(true);

    if (activeTab === "login") {
      const res = await signInWithEmail(email, password);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg("Logged in successfully!");
        setTimeout(() => setAuthModalOpen(false), 800);
      }
    } else if (activeTab === "register") {
      const res = await signUpWithEmail(email, password, name, role);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.emailConfirmRequired) {
        setSuccessMsg("Verification email sent! Check your inbox to activate your profile.");
      } else {
        setSuccessMsg("Account created and logged in!");
        setTimeout(() => setAuthModalOpen(false), 800);
      }
    } else if (activeTab === "forgot") {
      const res = await resetPassword(email);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg("If this email exists, a password reset link has been dispatched.");
      }
    }

    setSubmitting(false);
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const res = await signInWithOAuth(provider);
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setSuccessMsg(`Initiated ${provider} authentication...`);
      // OAuth redirects the page, so no need to close modal
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-card glassmorphic" ref={modalRef}>
        {/* Header and Close */}
        <div className="auth-header-row">
          <div className="auth-tabs-row">
            <button
              onClick={() => setActiveTab("login")}
              className={`auth-tab-btn ${activeTab === "login" ? "active" : ""}`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`auth-tab-btn ${activeTab === "register" ? "active" : ""}`}
            >
              REGISTER
            </button>
            {activeTab === "forgot" && (
              <button className="auth-tab-btn active">RECOVER</button>
            )}
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="auth-close-btn"
            aria-label="Close authentication screen"
          >
            ✕
          </button>
        </div>

        <div className="auth-modal-body">
          {/* Messages */}
          {errorMsg && <div className="auth-feedback-box error">⚠️ {errorMsg}</div>}
          {successMsg && <div className="auth-feedback-box success">✓ {successMsg}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form-fields">
            {activeTab === "register" && (
              <div className="auth-field-row">
                <label className="auth-input-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marie Curie"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-text-input"
                />
              </div>
            )}

            <div className="auth-field-row">
              <label className="auth-input-label">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@biosphere.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-text-input"
              />
            </div>

            {activeTab !== "forgot" && (
              <div className="auth-field-row">
                <div className="auth-label-forgot-row">
                  <label className="auth-input-label">Password</label>
                  {activeTab === "login" && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("forgot")}
                      className="auth-forgot-pass-btn"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-text-input"
                />
              </div>
            )}

            {activeTab === "register" && (
              <div className="auth-field-row">
                <label className="auth-input-label">Select Core Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="auth-select-input"
                >
                  <option value="student">Student Explorer</option>
                  <option value="admin">Site Administrator</option>
                  <option value="teacher">Biology Teacher (Future)</option>
                </select>
              </div>
            )}

            <button type="submit" disabled={submitting} className="auth-submit-glow-btn">
              {submitting ? "Processing..." : activeTab === "login" ? "Access Hub" : activeTab === "register" ? "Create Profile" : "Send Recovery Mail"}
            </button>
          </form>

          {/* Social Logins */}
          {activeTab !== "forgot" && (
            <div className="auth-social-logins-section">
              <div className="social-divider-row">
                <span className="social-divider-line" />
                <span className="social-divider-text">OR CONNECT WITH</span>
                <span className="social-divider-line" />
              </div>
              <div className="social-buttons-row">
                <button onClick={() => handleSocialLogin("google")} className="social-btn google-btn">
                  <span className="social-icon">Google</span>
                </button>
                <button onClick={() => handleSocialLogin("github")} className="social-btn github-btn">
                  <span className="social-icon">GitHub</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "forgot" && (
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className="auth-return-login-link-btn"
            >
              ← Back to Sign In
            </button>
          )}
        </div>
      </div>

      <style>{`
        .auth-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2100;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .auth-modal-card {
          width: 100%;
          max-width: 440px;
          border-radius: 20px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), var(--ds-glow-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .auth-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid var(--ds-glass-border);
        }

        .auth-tabs-row {
          display: flex;
          gap: 16px;
        }

        .auth-tab-btn {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          background: none;
          border: none;
          cursor: pointer;
          letter-spacing: 0.05em;
          padding: 4px 0;
          position: relative;
          transition: color 0.2s;
        }

        .auth-tab-btn:hover {
          color: var(--ds-fg);
        }

        .auth-tab-btn.active {
          color: var(--ds-accent);
          text-shadow: var(--ds-glow-sm);
        }

        .auth-tab-btn.active::after {
          content: "";
          position: absolute;
          bottom: -17px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--ds-accent);
          box-shadow: var(--ds-glow-sm);
        }

        .auth-close-btn {
          background: none;
          border: none;
          color: var(--ds-fg-subtle);
          font-size: 1rem;
          cursor: pointer;
        }

        .auth-close-btn:hover {
          color: var(--ds-accent);
        }

        .auth-modal-body {
          padding: 24px;
        }

        .auth-feedback-box {
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.76rem;
          margin-bottom: 16px;
          line-height: 1.4;
        }

        .auth-feedback-box.error {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .auth-feedback-box.success {
          background: rgba(57, 255, 20, 0.08);
          border: 1px solid rgba(57, 255, 20, 0.3);
          color: var(--ds-accent);
        }

        .auth-form-fields {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .auth-field-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .auth-input-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .auth-label-forgot-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .auth-forgot-pass-btn {
          background: none;
          border: none;
          color: var(--ds-accent-muted);
          font-size: 0.65rem;
          font-weight: 700;
          cursor: pointer;
        }

        .auth-forgot-pass-btn:hover {
          color: var(--ds-accent);
        }

        .auth-text-input,
        .auth-select-input {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0, 0, 0, 0.3);
          color: var(--ds-fg);
          font-size: 0.88rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
        }

        .auth-select-input {
          cursor: pointer;
        }

        .auth-text-input:focus,
        .auth-select-input:focus {
          border-color: var(--ds-border-accent);
        }

        .auth-select-input option {
          background: #020402;
          color: #fff;
        }

        .auth-submit-glow-btn {
          margin-top: 6px;
          padding: 12px;
          border-radius: 8px;
          border: 1.5px solid var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          font-weight: 800;
          font-size: 0.88rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: var(--ds-glow-sm);
        }

        .auth-submit-glow-btn:hover {
          background: var(--ds-accent-subtle);
          box-shadow: var(--ds-glow-md);
          transform: translateY(-1px);
        }

        .auth-submit-glow-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Social connections */
        .auth-social-logins-section {
          margin-top: 24px;
        }

        .social-divider-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .social-divider-line {
          flex: 1;
          height: 1px;
          background: var(--ds-glass-border);
        }

        .social-divider-text {
          font-size: 0.55rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.1em;
        }

        .social-buttons-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .social-btn {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(255, 255, 255, 0.02);
          color: var(--ds-fg-muted);
          font-size: 0.78rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .social-btn:hover {
          background: var(--ds-glass-border-hover);
          color: #fff;
          border-color: rgba(255, 255, 255, 0.25);
        }

        .auth-return-login-link-btn {
          display: block;
          margin: 16px auto 0;
          background: none;
          border: none;
          color: var(--ds-fg-subtle);
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
        }

        .auth-return-login-link-btn:hover {
          color: var(--ds-accent);
        }
      `}</style>
    </div>
  );
};
