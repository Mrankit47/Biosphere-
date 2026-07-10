"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BottomNavItem {
  href: string;
  label: string;
  icon: string;
}

const ITEMS: BottomNavItem[] = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/quiz", label: "Quiz", icon: "📝" },
  { href: "/tutor", label: "AI Tutor", icon: "🤖" },
  { href: "/gamification", label: "Profile", icon: "🏆" },
];

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-navbar" aria-label="Mobile navigation bar">
      <div className="bottom-nav-links-row">
        {ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bottom-nav-link-btn ${isActive ? "active" : ""}`}
            >
              <span className="bottom-nav-icon">{item.icon}</span>
              <span className="bottom-nav-label">{item.label}</span>
              {isActive && <span className="bottom-nav-active-dot" />}
            </Link>
          );
        })}
      </div>

      <style>{`
        .mobile-bottom-navbar {
          display: none;
          position: fixed;
          bottom: 12px;
          left: 12px;
          right: 12px;
          z-index: 995;
          height: 60px;
          background: var(--ds-surface-overlay);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid var(--ds-glass-border);
          box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.4), var(--ds-glow-sm);
          border-radius: 16px;
          box-sizing: border-box;
          overflow: hidden;
        }

        .bottom-nav-links-row {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 8px;
        }

        .bottom-nav-link-btn {
          flex: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--ds-fg-muted);
          text-decoration: none;
          gap: 3px;
          position: relative;
          transition: all 0.2s ease;
          border-radius: 10px;
          max-width: 72px;
        }

        .bottom-nav-icon {
          font-size: 1.15rem;
        }

        .bottom-nav-label {
          font-size: 0.58rem;
          font-weight: 750;
          letter-spacing: 0.02em;
        }

        .bottom-nav-link-btn.active {
          color: var(--ds-accent);
          text-shadow: var(--ds-glow-sm);
        }

        .bottom-nav-active-dot {
          position: absolute;
          bottom: 4px;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--ds-accent);
          box-shadow: var(--ds-glow-sm);
        }

        @media (max-width: 860px) {
          .mobile-bottom-navbar {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
};
