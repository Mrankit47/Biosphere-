"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigation } from "./NavigationContext";
import { BioIcon } from "./BioIcon";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface NavCategory {
  title: string;
  items: NavItem[];
}

const CATEGORIES: NavCategory[] = [
  {
    title: "Core",
    items: [
      { href: "/", label: "Home", icon: "home" },
      { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
      { href: "/learning-paths", label: "Learning Paths", icon: "learning-paths" },
      { href: "/tutor", label: "AI Tutor", icon: "tutor" },
      { href: "/gamification", label: "Profile Hub", icon: "gamification" },
    ],
  },
  {
    title: "3D Modules",
    items: [
      { href: "/cell-explorer", label: "Cell Explorer", icon: "cell-explorer" },
      { href: "/human-body", label: "Human Body", icon: "human-body" },
      { href: "/tree-of-life", label: "Tree of Life", icon: "tree-of-life" },
      { href: "/photosynthesis", label: "Photosynthesis", icon: "photosynthesis" },
      { href: "/food-chain", label: "Food Chain", icon: "food-chain" },
    ],
  },
  {
    title: "Labs & Sims",
    items: [
      { href: "/virtual-lab", label: "Virtual Lab", icon: "virtual-lab" },
      { href: "/ecosystem-simulator", label: "Ecosystem Sim", icon: "ecosystem-simulator" },
      { href: "/process-simulations", label: "Process Sims", icon: "process-simulations" },
    ],
  },
  {
    title: "Research",
    items: [
      { href: "/microorganisms", label: "Microorganisms", icon: "microorganisms" },
      { href: "/viruses", label: "Viruses", icon: "viruses" },
      { href: "/disease-explorer", label: "Disease Explorer", icon: "disease-explorer" },
      { href: "/rare-species", label: "Rare Species", icon: "rare-species" },
      { href: "/dna-genetics", label: "DNA & Genetics", icon: "dna-genetics" },
      { href: "/ecosystems", label: "Ecosystems", icon: "ecosystems" },
      { href: "/dictionary", label: "Dictionary", icon: "dictionary" },
      { href: "/quiz", label: "Quiz", icon: "quiz" },
      { href: "/research-hub", label: "Research Hub", icon: "research-hub" },
    ],
  },
];

export const ResponsiveSidebar: React.FC = () => {
  const pathname = usePathname();
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    progressPercent,
  } = useNavigation();
  const [isHovered, setIsHovered] = useState(false);

  // Determine actual display state: expanded if explicitly toggled OR currently hovered
  const isExpanded = !sidebarCollapsed || isHovered;

  const handleSidebarClickToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="mobile-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Wrapper */}
      <aside
        className={`navigation-sidebar ${isExpanded ? "expanded" : "collapsed"} ${
          sidebarOpen ? "mobile-open" : ""
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Sidebar navigation"
      >
        {/* Mobile Close Button */}
        <button
          className="mobile-sidebar-close"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation sidebar"
        >
          <BioIcon name="close" size={18} />
        </button>

        {/* Sidebar Brand Header */}
        <div className="sidebar-brand">
          <Link href="/" onClick={() => setSidebarOpen(false)} className="brand-logo-link">
            <span className="brand-icon">
              <BioIcon name="cell-explorer" size={24} />
            </span>
            <span className={`brand-text ${isExpanded ? "visible" : "hidden"}`}>
              BIOSPHERE
            </span>
          </Link>
        </div>

        {/* Navigation Categories */}
        <nav className="sidebar-nav-scroller" data-lenis-prevent>
          {CATEGORIES.map((category) => (
            <div key={category.title} className="sidebar-category">
              <span className={`category-title ${isExpanded ? "visible" : "hidden"}`}>
                {category.title.toUpperCase()}
              </span>
              <ul className="category-items">
                {category.items.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname?.startsWith(item.href);

                  return (
                    <li key={item.href} className="nav-item-wrapper">
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`sidebar-nav-link ${isActive ? "active" : ""}`}
                        title={!isExpanded ? item.label : undefined}
                      >
                        <span className="nav-item-icon">
                          <BioIcon name={item.icon} size={18} />
                        </span>
                        <span className={`nav-item-label ${isExpanded ? "visible" : "hidden"}`}>
                          {item.label}
                        </span>
                        {isActive && <span className="active-dot-indicator" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer Info */}
        <div className="sidebar-footer">
          {/* Collapse Toggle Button (Desktop only) */}
          <button
            className="sidebar-collapse-toggle-btn"
            onClick={handleSidebarClickToggle}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="toggle-chevron-icon">
              <BioIcon name={sidebarCollapsed ? "chevron-right" : "chevron-left"} size={14} />
            </span>
            <span className={`toggle-btn-label ${isExpanded ? "visible" : "hidden"}`}>
              Collapse Sidebar
            </span>
          </button>

          {/* Progress summary inside Sidebar */}
          <div className={`sidebar-progress-summary ${isExpanded ? "visible" : "collapsed"}`}>
            {isExpanded ? (
              <div className="progress-details">
                <div className="progress-header-row">
                  <span className="progress-lbl">LEARNING ENGINE</span>
                  <span className="progress-val">{progressPercent}%</span>
                </div>
                <div className="progress-track-bar">
                  <div className="progress-fill-bar" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            ) : (
              <div className="progress-tiny-circle" title={`Progress: ${progressPercent}%`}>
                {progressPercent}%
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Styled Scoped CSS for Sidebar */}
      <style>{`
        .navigation-sidebar {
          position: fixed;
          left: 12px;
          top: 12px;
          bottom: 12px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          background: var(--ds-surface-overlay);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--ds-glass-border);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4), var(--ds-glow-sm);
          border-radius: 16px;
          transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.3s ease;
          overflow: hidden;
          box-sizing: border-box;
        }

        .navigation-sidebar.collapsed {
          width: 68px;
        }

        .navigation-sidebar.collapsed .sidebar-category {
          margin-right: 0;
        }

        .navigation-sidebar.collapsed .sidebar-nav-link {
          padding: 10px 0;
          justify-content: center;
        }

        .navigation-sidebar.collapsed .active-dot-indicator {
          display: none;
        }

        .navigation-sidebar.expanded {
          width: 260px;
        }

        .brand-logo-link {
          text-decoration: none;
          cursor: pointer;
        }

        /* Branding */
        .sidebar-brand {
          padding: 20px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid var(--ds-glass-border);
          flex-shrink: 0;
        }

        .brand-icon {
          font-size: 1.45rem;
          text-shadow: 0 0 10px rgba(57,255,20,0.5);
        }

        .brand-text {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.08em;
          margin-left: 12px;
          text-shadow: 0 0 15px rgba(57,255,20,0.65);
          transition: opacity 0.2s ease;
        }

        .brand-text.hidden {
          display: none;
          opacity: 0;
        }

        .brand-text.visible {
          display: inline;
          opacity: 1;
        }

        /* Scroller */
        .sidebar-nav-scroller {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 16px 8px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          scrollbar-width: thin;
          scrollbar-color: rgba(57, 255, 20, 0.15) rgba(0, 0, 0, 0.05);
        }

        .sidebar-nav-scroller::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-nav-scroller::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
        }

        .sidebar-nav-scroller::-webkit-scrollbar-thumb {
          background: rgba(57, 255, 20, 0.35);
          border-radius: 99px;
        }

        .sidebar-nav-scroller::-webkit-scrollbar-thumb:hover {
          background: rgba(57, 255, 20, 0.7);
        }

        .sidebar-category {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-right: 8px; /* Safe gap to prevent clicks on scrollbar from hitting links */
        }

        .category-title {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.15em;
          padding-left: 14px;
          transition: opacity 0.2s ease;
        }

        .category-title.hidden {
          display: none;
          opacity: 0;
        }

        .category-title.visible {
          display: block;
          opacity: 1;
        }

        .category-items {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item-wrapper {
          position: relative;
        }

        /* Navigation Links */
        .sidebar-nav-link {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          border-radius: 10px;
          color: var(--ds-fg-muted);
          text-decoration: none;
          font-size: 0.84rem;
          font-weight: 550;
          transition: all 0.2s ease;
          position: relative;
          box-sizing: border-box;
          min-height: 40px;
        }

        .sidebar-nav-link:hover {
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
        }

        .sidebar-nav-link.active {
          color: var(--ds-accent);
          background: var(--ds-accent-subtle);
          border: 1px solid var(--ds-border-accent);
        }

        .nav-item-icon {
          font-size: 1.15rem;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-item-label {
          margin-left: 12px;
          white-space: nowrap;
          transition: opacity 0.2s ease;
        }

        .nav-item-label.hidden {
          display: none;
          opacity: 0;
        }

        .nav-item-label.visible {
          display: block;
          opacity: 1;
        }

        /* Active dot line indicator */
        .active-dot-indicator {
          position: absolute;
          right: 8px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--ds-accent);
          box-shadow: 0 0 6px var(--ds-accent);
        }

        /* Sidebar Footer */
        .sidebar-footer {
          padding: 12px 8px;
          border-top: 1px solid var(--ds-glass-border);
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(1, 4, 1, 0.4);
          flex-shrink: 0;
        }

        /* Desktop Collapse Button */
        .sidebar-collapse-toggle-btn {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 8px 12px;
          background: none;
          border: 1px solid var(--ds-glass-border);
          border-radius: 8px;
          color: var(--ds-fg-subtle);
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .sidebar-collapse-toggle-btn:hover {
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
        }

        .toggle-chevron-icon {
          width: 16px;
          text-align: center;
          font-weight: bold;
        }

        .toggle-btn-label {
          margin-left: 8px;
          white-space: nowrap;
        }

        .toggle-btn-label.hidden {
          display: none;
        }

        .toggle-btn-label.visible {
          display: block;
        }

        /* Progress Card */
        .sidebar-progress-summary {
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--ds-glass-border);
          transition: all 0.2s ease;
        }

        .sidebar-progress-summary.collapsed {
          padding: 6px 0;
          display: flex;
          justify-content: center;
        }

        .sidebar-progress-summary.visible {
          padding: 10px 12px;
        }

        .progress-header-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.1em;
          margin-bottom: 6px;
        }

        .progress-val {
          color: var(--ds-accent);
        }

        .progress-track-bar {
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: var(--ds-border-muted);
          overflow: hidden;
        }

        .progress-fill-bar {
          height: 100%;
          background: var(--ds-accent);
          box-shadow: 0 0 6px var(--ds-accent);
          border-radius: 2px;
          transition: width 0.4s ease;
        }

        .progress-tiny-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--ds-border-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          font-size: 0.6rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--ds-glow-sm);
        }

        /* Mobile Close Button */
        .mobile-sidebar-close {
          display: none;
        }

        /* Responsive Breakpoints */
        @media (max-width: 860px) {
          .navigation-sidebar {
            left: 0;
            top: 0;
            bottom: 0;
            height: 100vh;
            border-radius: 0;
            border-left: none;
            width: 260px !important;
            transform: translateX(-100%);
            box-shadow: none;
          }

          .navigation-sidebar.mobile-open {
            transform: translateX(0);
            box-shadow: 10px 0 40px rgba(0, 0, 0, 0.8);
          }

          .sidebar-collapse-toggle-btn {
            display: none; /* Hide collapse btn on mobile drawer */
          }

          .category-title.hidden,
          .brand-text.hidden,
          .nav-item-label.hidden,
          .toggle-btn-label.hidden {
            display: block !important;
            opacity: 1 !important;
          }

          .sidebar-progress-summary.collapsed {
            display: none !important;
          }

          .mobile-sidebar-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(4px);
            z-index: 999;
          }

          .mobile-sidebar-close {
            display: flex;
            position: absolute;
            top: 16px;
            right: 16px;
            width: 32px;
            height: 32px;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--ds-glass-border);
            border-radius: 8px;
            background: none;
            color: var(--ds-fg-muted);
            cursor: pointer;
            font-size: 0.9rem;
          }

          .mobile-sidebar-close:hover {
            color: #fff;
            background: rgba(255,255,255,0.05);
          }
        }
      `}</style>
    </>
  );
};
