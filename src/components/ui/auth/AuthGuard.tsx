"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";
import { AuthenticatedProfile } from "./AuthenticatedProfile";

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { user, setAuthModalOpen } = useAuth();
  const [guestBypass, setGuestBypass] = useState(false);

  // Reset guest bypass on path change
  useEffect(() => {
    setGuestBypass(false);
  }, [pathname]);

  const isProfilePage = pathname === "/gamification";

  // Lock personalized profile features behind auth
  if (isProfilePage) {
    if (user) {
      // If logged in, render the premium profile hub dashboard instead of default guest page
      return <AuthenticatedProfile />;
    }

    if (!guestBypass) {
      // Show the lock screen overlay
      return (
        <div className="auth-guard-root">
          <div className="auth-guard-card glassmorphic">
            <span className="auth-guard-lock-icon">🔒</span>
            <span className="auth-guard-badge">CORE SECURITY SHIELD</span>
            <h2 className="auth-guard-title">AUTHORIZATION REQUIRED</h2>
            <p className="auth-guard-desc">
              To customize your avatar, save bookmarks, synchronize your learning history to the cloud, and log tutor chats, please authenticate your session.
            </p>

            <div className="auth-guard-restriction-list">
              <span className="restriction-hdr">GUEST USERS CANNOT:</span>
              <ul className="restriction-items">
                <li>💾 Save learning progress</li>
                <li>⭐ Bookmark topics</li>
                <li>🤖 Use unlimited AI tutoring</li>
                <li>📊 Access the Dashboard</li>
                <li>⚡ Earn XP or level up</li>
                <li>📝 Create study notes</li>
                <li>🏆 Receive certificates</li>
              </ul>
            </div>

            <div className="auth-guard-buttons-row">
              <button onClick={() => setAuthModalOpen(true)} className="auth-guard-login-btn">
                Sign In or Register
              </button>
              <button onClick={() => setGuestBypass(true)} className="auth-guard-guest-btn">
                Explore as Guest →
              </button>
            </div>
          </div>

          <style>{`
            .auth-guard-root {
              width: 100%;
              min-height: calc(100vh - 144px);
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 40px 20px;
              background: var(--ds-bg-primary);
              box-sizing: border-box;
            }

            .auth-guard-card {
              width: 100%;
              max-width: 480px;
              border-radius: 20px;
              border: 1px solid var(--ds-glass-border);
              background: var(--ds-surface-overlay);
              padding: 40px 24px;
              text-align: center;
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), var(--ds-glow-sm);
              display: flex;
              flex-direction: column;
              align-items: center;
              box-sizing: border-box;
            }

            .auth-guard-lock-icon {
              font-size: 3.5rem;
              margin-bottom: 20px;
              filter: drop-shadow(0 0 10px rgba(57, 255, 20, 0.2));
              animation: pulse-lock 2s infinite alternate;
            }

            @keyframes pulse-lock {
              0% { transform: scale(1); }
              100% { transform: scale(1.08); }
            }

            .auth-guard-badge {
              font-size: 0.6rem;
              font-weight: 900;
              color: var(--ds-accent-muted);
              letter-spacing: 0.25em;
              margin-bottom: 8px;
            }

            .auth-guard-title {
              font-size: 1.45rem;
              font-weight: 900;
              color: #fff;
              letter-spacing: 0.05em;
              margin: 0 0 14px 0;
            }

            .auth-guard-desc {
              font-size: 0.8rem;
              color: var(--ds-fg-subtle);
              line-height: 1.6;
              margin: 0 0 20px 0;
            }

            .auth-guard-restriction-list {
              width: 100%;
              text-align: left;
              margin-bottom: 24px;
              padding: 14px 16px;
              border-radius: 10px;
              border: 1px solid rgba(239, 68, 68, 0.15);
              background: rgba(239, 68, 68, 0.03);
              box-sizing: border-box;
            }

            .restriction-hdr {
              font-size: 0.58rem;
              font-weight: 900;
              color: #fca5a5;
              letter-spacing: 0.15em;
              display: block;
              margin-bottom: 8px;
            }

            .restriction-items {
              list-style: none;
              padding: 0;
              margin: 0;
              display: flex;
              flex-direction: column;
              gap: 4px;
            }

            .restriction-items li {
              font-size: 0.72rem;
              color: var(--ds-fg-muted);
              line-height: 1.5;
            }

            .auth-guard-buttons-row {
              width: 100%;
              display: flex;
              flex-direction: column;
              gap: 12px;
            }

            .auth-guard-login-btn {
              width: 100%;
              padding: 14px;
              border-radius: 10px;
              border: 1.5px solid var(--ds-accent);
              background: var(--ds-accent-faint);
              color: var(--ds-accent);
              font-weight: 800;
              font-size: 0.9rem;
              cursor: pointer;
              font-family: inherit;
              transition: all 0.2s;
              box-shadow: var(--ds-glow-sm);
            }

            .auth-guard-login-btn:hover {
              background: var(--ds-accent-subtle);
              box-shadow: var(--ds-glow-md);
              transform: translateY(-1px);
            }

            .auth-guard-guest-btn {
              width: 100%;
              padding: 12px;
              border-radius: 10px;
              border: 1px solid var(--ds-glass-border);
              background: rgba(255, 255, 255, 0.02);
              color: var(--ds-fg-muted);
              font-weight: 700;
              font-size: 0.85rem;
              cursor: pointer;
              font-family: inherit;
              transition: all 0.2s;
            }

            .auth-guard-guest-btn:hover {
              background: var(--ds-glass-border-hover);
              color: #fff;
            }
          `}</style>
        </div>
      );
    }
  }

  // Render normal children for exploration
  return <>{children}</>;
};
