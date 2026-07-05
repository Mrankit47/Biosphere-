"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

const navLinks = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/cell-explorer", label: "Cell Explorer", icon: "🔬" },
  { href: "/microorganisms", label: "Microorganisms", icon: "🦠" },
  { href: "/viruses", label: "Viruses", icon: "☣️" },
  { href: "/disease-explorer", label: "Disease Explorer", icon: "🏥" },
  { href: "/rare-species", label: "Rare Species", icon: "🦁" },
  { href: "/dna-genetics", label: "DNA & Genetics", icon: "🧬" },
  { href: "/human-body", label: "Human Body", icon: "🫀" },
  { href: "/ecosystems", label: "Ecosystems", icon: "🌿" },
  { href: "/ecosystem-simulator", label: "Ecosystem Sim", icon: "🌐" },
  { href: "/tree-of-life", label: "Tree of Life", icon: "🌳" },
  { href: "/learning-paths", label: "Learning Paths", icon: "🎓" },
  { href: "/gamification", label: "Profile Hub", icon: "🏆" },
  { href: "/virtual-lab", label: "Virtual Lab", icon: "🧪" },
  { href: "/process-simulations", label: "Process Sims", icon: "🌀" },
  { href: "/research-hub", label: "Research Hub", icon: "📚" },
  { href: "/tutor", label: "AI Tutor", icon: "🤖" },
  { href: "/dictionary", label: "Dictionary", icon: "📖" },
  { href: "/quiz", label: "Quiz", icon: "📝" },
];

const threeDLinks = [
  { href: "/cell-explorer", label: "Cell Explorer", icon: "🔬" },
  { href: "/human-body", label: "Human Body", icon: "🫀" },
  { href: "/tree-of-life", label: "Tree of Life", icon: "🌳" },
];

const researchLinks = [
  { href: "/microorganisms", label: "Microorganisms", icon: "🦠" },
  { href: "/viruses", label: "Viruses", icon: "☣️" },
  { href: "/disease-explorer", label: "Disease Explorer", icon: "🏥" },
  { href: "/rare-species", label: "Rare Species", icon: "🦁" },
  { href: "/dna-genetics", label: "DNA & Genetics", icon: "🧬" },
  { href: "/ecosystems", label: "Ecosystems", icon: "🌿" },
  { href: "/ecosystem-simulator", label: "Ecosystem Sim", icon: "🌐" },
  { href: "/virtual-lab", label: "Virtual Lab", icon: "🧪" },
  { href: "/process-simulations", label: "Process Sims", icon: "🌀" },
  { href: "/research-hub", label: "Research Hub", icon: "📚" },
  { href: "/dictionary", label: "Dictionary", icon: "📖" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    Promise.resolve().then(() => {
      setMobileOpen(false);
    });
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
          {/* Home */}
          <li role="none">
            <Link
              href="/"
              role="menuitem"
              className={`nav-link ${mounted && pathname === "/" ? "nav-link--active" : ""}`}
            >
              Home
            </Link>
          </li>

          {/* Learning Paths */}
          <li role="none">
            <Link
              href="/learning-paths"
              role="menuitem"
              className={`nav-link ${mounted && pathname?.startsWith("/learning-paths") ? "nav-link--active" : ""}`}
            >
              Learning Paths
            </Link>
          </li>

          {/* Profile Hub */}
          <li role="none">
            <Link
              href="/gamification"
              role="menuitem"
              className={`nav-link ${mounted && pathname?.startsWith("/gamification") ? "nav-link--active" : ""}`}
            >
              Profile Hub
            </Link>
          </li>

          {/* 3D Modules Dropdown */}
          <li role="none" className="nav-dropdown-wrapper">
            <button className={`nav-link nav-dropdown-trigger ${mounted && (pathname?.startsWith("/cell-explorer") || pathname?.startsWith("/human-body") || pathname?.startsWith("/tree-of-life")) ? "nav-link--active" : ""}`}>
              3D Modules <span className="dropdown-chevron">▼</span>
            </button>
            <ul className="nav-dropdown-menu">
              {threeDLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="dropdown-item">
                    <span className="dropdown-icon">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Research Labs Dropdown */}
          <li role="none" className="nav-dropdown-wrapper">
            <button className={`nav-link nav-dropdown-trigger ${mounted && (pathname?.startsWith("/microorganisms") || pathname?.startsWith("/viruses") || pathname?.startsWith("/disease-explorer") || pathname?.startsWith("/rare-species") || pathname?.startsWith("/dna-genetics") || pathname?.startsWith("/ecosystems") || pathname?.startsWith("/ecosystem-simulator") || pathname?.startsWith("/research-hub") || pathname?.startsWith("/virtual-lab") || pathname?.startsWith("/process-simulations") || pathname?.startsWith("/dictionary")) ? "nav-link--active" : ""}`}>
              Research Labs <span className="dropdown-chevron">▼</span>
            </button>
            <ul className="nav-dropdown-menu double-column">
              {researchLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="dropdown-item">
                    <span className="dropdown-icon">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* AI Tutor */}
          <li role="none">
            <Link
              href="/tutor"
              role="menuitem"
              className={`nav-link ${mounted && pathname?.startsWith("/tutor") ? "nav-link--active" : ""}`}
            >
              AI Tutor
            </Link>
          </li>

          {/* Quiz */}
          <li role="none">
            <Link
              href="/quiz"
              role="menuitem"
              className={`nav-link ${mounted && pathname?.startsWith("/quiz") ? "nav-link--active" : ""}`}
            >
              Quiz
            </Link>
          </li>
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
              mounted && pathname
                ? link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href)
                : false;
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
        /* ── Dropdowns ─────────────────────────────────── */
        .nav-dropdown-wrapper {
          position: relative;
          display: inline-block;
        }

        .nav-dropdown-trigger {
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          gap: 6px;
          outline: none;
          color: rgba(200, 245, 200, 0.7);
          font-family: inherit;
          cursor: none;
        }

        .dropdown-chevron {
          font-size: 0.55rem;
          transition: transform 0.3s;
          color: rgba(57, 255, 20, 0.4);
        }

        .nav-dropdown-wrapper:hover .dropdown-chevron {
          transform: rotate(180deg);
          color: #39FF14;
        }

        .nav-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          opacity: 0;
          visibility: hidden;
          background: rgba(5, 10, 5, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(57, 255, 20, 0.12);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 15px rgba(57, 255, 20, 0.05);
          border-radius: 12px;
          padding: 8px;
          list-style: none;
          margin: 0;
          min-width: 200px;
          z-index: 1010;
          transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s, visibility 0.3s;
        }

        .nav-dropdown-menu.double-column {
          display: grid;
          grid-template-columns: 180px 180px;
          gap: 4px;
          min-width: 370px;
        }

        .nav-dropdown-wrapper:hover .nav-dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(2px);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          color: rgba(200, 245, 200, 0.7);
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 500;
          border-radius: 8px;
          cursor: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .dropdown-item:hover {
          color: #39FF14;
          background: rgba(57, 255, 20, 0.06);
          box-shadow: inset 0 0 8px rgba(57, 255, 20, 0.04);
        }

        .dropdown-icon {
          font-size: 1.05rem;
          width: 24px;
          text-align: center;
        }

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
