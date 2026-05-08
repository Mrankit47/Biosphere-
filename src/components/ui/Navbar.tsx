"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cell-explorer", label: "Cell Explorer" },
  { href: "/microorganisms", label: "Microbes" },
  { href: "/dna-genetics", label: "DNA" },
  { href: "/tree-of-life", label: "Tree of Life" },
  { href: "/quiz", label: "Quiz" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Track scroll to intensify backdrop on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className="bio-navbar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(16px, 4vw, 48px)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          background: scrolled
            ? "rgba(5, 10, 5, 0.85)"
            : "rgba(5, 10, 5, 0.7)",
          borderBottom: "1px solid rgba(57, 255, 20, 0.08)",
          transition: "background 0.4s ease",
        }}
      >
        {/* ── Logo ─────────────────────────────────────── */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "#39FF14",
              letterSpacing: "0.04em",
              textShadow: "0 0 14px rgba(57,255,20,0.45)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "none",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 8px rgba(57,255,20,0.6))" }}
            >
              <path d="M6 18h8" />
              <path d="M3 22h18" />
              <path d="M14 22a7 7 0 1 0 0-14h-1" />
              <path d="M9 14h2" />
              <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
              <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
            </svg>
            BioSphere
          </span>
        </Link>

        {/* ── Desktop Links ────────────────────────────── */}
        <ul className="nav-desktop-links">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link ${isActive ? "nav-link--active" : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Hamburger Button (mobile) ────────────────── */}
        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <div className={`hamburger-bar ${mobileOpen ? "open" : ""}`} />
        </button>
      </nav>

      {/* ── Mobile Slide-in Panel ──────────────────────── */}
      <div
        className={`nav-mobile-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={() => setMobileOpen(false)}
      />
      <aside className={`nav-mobile-panel ${mobileOpen ? "open" : ""}`}>
        <ul>
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <li
                key={link.href}
                style={{ transitionDelay: mobileOpen ? `${i * 60}ms` : "0ms" }}
                className={`mobile-link-item ${mobileOpen ? "show" : ""}`}
              >
                <Link
                  href={link.href}
                  className={`mobile-link ${isActive ? "mobile-link--active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* ── Scoped Styles ──────────────────────────────── */}
      <style>{`
        /* ── Desktop Links ─────────────────────────────── */
        .nav-desktop-links {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 4px;
          align-items: center;
        }

        .nav-link {
          position: relative;
          padding: 8px 16px;
          font-size: 0.88rem;
          font-weight: 500;
          color: rgba(200, 245, 200, 0.7);
          text-decoration: none;
          cursor: none;
          letter-spacing: 0.03em;
          transition: color 0.3s ease;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          bottom: 2px;
          left: 16px;
          right: 16px;
          height: 2px;
          background: #39FF14;
          border-radius: 1px;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 0 8px rgba(57, 255, 20, 0.5);
        }

        .nav-link:hover {
          color: #39FF14;
        }

        .nav-link:hover::after {
          transform: scaleX(1);
        }

        .nav-link--active {
          color: #39FF14 !important;
        }

        .nav-link--active::after {
          transform: scaleX(1);
        }

        /* ── Hamburger ─────────────────────────────────── */
        .nav-hamburger {
          display: none;
          background: none;
          border: none;
          padding: 8px;
          cursor: none;
          position: relative;
          width: 32px;
          height: 32px;
          z-index: 1100;
        }

        .hamburger-bar,
        .hamburger-bar::before,
        .hamburger-bar::after {
          content: "";
          position: absolute;
          left: 4px;
          width: 24px;
          height: 2px;
          background: #39FF14;
          border-radius: 2px;
          transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .hamburger-bar {
          top: 50%;
          transform: translateY(-50%);
        }

        .hamburger-bar::before {
          top: -7px;
          left: 0;
        }

        .hamburger-bar::after {
          top: 7px;
          left: 0;
        }

        .hamburger-bar.open {
          background: transparent;
        }

        .hamburger-bar.open::before {
          top: 0;
          transform: rotate(45deg);
        }

        .hamburger-bar.open::after {
          top: 0;
          transform: rotate(-45deg);
        }

        /* ── Mobile Overlay ────────────────────────────── */
        .nav-mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.4s ease, visibility 0.4s ease;
        }

        .nav-mobile-overlay.visible {
          opacity: 1;
          visibility: visible;
        }

        /* ── Mobile Panel ──────────────────────────────── */
        .nav-mobile-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: min(320px, 80vw);
          height: 100vh;
          background: rgba(5, 10, 5, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-left: 1px solid rgba(57, 255, 20, 0.1);
          z-index: 1050;
          transform: translateX(100%);
          transition: transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1);
          padding: 100px 32px 40px;
          box-sizing: border-box;
        }

        .nav-mobile-panel.open {
          transform: translateX(0);
        }

        .nav-mobile-panel ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .mobile-link-item {
          opacity: 0;
          transform: translateX(20px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }

        .mobile-link-item.show {
          opacity: 1;
          transform: translateX(0);
        }

        .mobile-link {
          display: block;
          padding: 14px 16px;
          font-size: 1.05rem;
          font-weight: 500;
          color: rgba(200, 245, 200, 0.7);
          text-decoration: none;
          border-radius: 10px;
          cursor: none;
          letter-spacing: 0.03em;
          transition: all 0.25s ease;
          border: 1px solid transparent;
        }

        .mobile-link:hover {
          color: #39FF14;
          background: rgba(57, 255, 20, 0.06);
          border-color: rgba(57, 255, 20, 0.12);
        }

        .mobile-link--active {
          color: #39FF14 !important;
          background: rgba(57, 255, 20, 0.08);
          border-color: rgba(57, 255, 20, 0.15);
        }

        /* ── Responsive ────────────────────────────────── */
        @media (max-width: 860px) {
          .nav-desktop-links {
            display: none !important;
          }
          .nav-hamburger {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
