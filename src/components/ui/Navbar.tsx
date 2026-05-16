"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

const navLinks = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/cell-explorer", label: "Cell Explorer", icon: "🔬" },
  { href: "/microorganisms", label: "Microorganisms", icon: "🦠" },
  { href: "/dna-genetics", label: "DNA & Genetics", icon: "🧬" },
  { href: "/human-body", label: "Human Body", icon: "🫀" },
  { href: "/ecosystems", label: "Ecosystems", icon: "🌿" },
  { href: "/tree-of-life", label: "Tree of Life", icon: "🌳" },
  { href: "/quiz", label: "Quiz", icon: "📝" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  /* ── Scroll: hide on down, show on up, intensify bg ──── */
  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 40);

    // Only toggle visibility after a scroll threshold to avoid jitter
    if (Math.abs(y - lastScrollY.current) < 10) return;

    setVisible(y < lastScrollY.current || y < 80);
    lastScrollY.current = y;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* ── Lock body scroll when mobile menu is open ───────── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* ── Close mobile menu on route change ────────────────── */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navTransform = visible ? "translateY(0)" : "translateY(-100%)";

  return (
    <>
      <nav
        className="bio-navbar"
        role="navigation"
        aria-label="Main navigation"
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
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          background: scrolled
            ? "rgba(5, 10, 5, 0.92)"
            : "rgba(5, 10, 5, 0.65)",
          borderBottom: "1px solid rgba(57, 255, 20, 0.08)",
          transition: "background 0.4s ease, transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)",
          transform: navTransform,
        }}
      >
        {/* ── Logo ─────────────────────────────────────── */}
        <Link href="/" style={{ textDecoration: "none" }} aria-label="BioSphere Home">
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
            🔬
            <span style={{ textShadow: "0 0 18px rgba(57,255,20,0.6)" }}>
              BIOSPHERE
            </span>
          </span>
        </Link>

        {/* ── Desktop Links ────────────────────────────── */}
        <ul className="nav-desktop-links" role="menubar">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href} role="none">
                <Link
                  href={link.href}
                  role="menuitem"
                  className={`nav-link ${isActive ? "nav-link--active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
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
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <div className={`hamburger-bar ${mobileOpen ? "open" : ""}`} />
        </button>
      </nav>

      {/* ── Mobile Full-Screen Overlay ──────────────────── */}
      <div
        className={`nav-mobile-overlay ${mobileOpen ? "visible" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile Slide-in Panel ──────────────────────── */}
      <aside
        className={`nav-mobile-panel ${mobileOpen ? "open" : ""}`}
        aria-label="Mobile navigation"
      >
        {/* Close button */}
        <button
          className="mobile-close-btn"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>

        <ul>
          {navLinks.map((link, i) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li
                key={link.href}
                style={{
                  transitionDelay: mobileOpen ? `${i * 60}ms` : "0ms",
                }}
                className={`mobile-link-item ${mobileOpen ? "show" : ""}`}
              >
                <Link
                  href={link.href}
                  className={`mobile-link ${isActive ? "mobile-link--active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="mobile-link-icon">{link.icon}</span>
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

        .nav-link:focus-visible {
          outline: 2px solid #39FF14;
          outline-offset: 2px;
          border-radius: 4px;
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
          min-height: 44px;
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
          background: rgba(0, 0, 0, 0.6);
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
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          background: rgba(2, 5, 2, 0.97);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          z-index: 1050;
          transform: translateX(100%);
          transition: transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1);
          padding: 100px 32px 40px;
          box-sizing: border-box;
          overflow-y: auto;
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

        /* ── Close Button ──────────────────────────────── */
        .mobile-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: 1px solid rgba(57, 255, 20, 0.15);
          border-radius: 10px;
          color: #39FF14;
          font-size: 1.2rem;
          cursor: pointer;
          z-index: 1100;
          transition: all 0.25s ease;
        }

        .mobile-close-btn:hover {
          background: rgba(57, 255, 20, 0.08);
          border-color: rgba(57, 255, 20, 0.3);
        }

        /* ── Mobile Link Items ─────────────────────────── */
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
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          font-size: 1.1rem;
          font-weight: 500;
          color: rgba(200, 245, 200, 0.7);
          text-decoration: none;
          border-radius: 12px;
          cursor: none;
          letter-spacing: 0.03em;
          transition: all 0.25s ease;
          border: 1px solid transparent;
          min-height: 44px;
        }

        .mobile-link:hover {
          color: #39FF14;
          background: rgba(57, 255, 20, 0.06);
          border-color: rgba(57, 255, 20, 0.12);
        }

        .mobile-link:focus-visible {
          outline: 2px solid #39FF14;
          outline-offset: 2px;
        }

        .mobile-link--active {
          color: #39FF14 !important;
          background: rgba(57, 255, 20, 0.08);
          border-color: rgba(57, 255, 20, 0.15);
        }

        .mobile-link-icon {
          font-size: 1.3rem;
          width: 32px;
          text-align: center;
          flex-shrink: 0;
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
