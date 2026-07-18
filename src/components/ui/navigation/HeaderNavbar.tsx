"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigation, ROUTE_META } from "./NavigationContext";
import { useAuth } from "../auth";
import { BioIcon } from "./BioIcon";

export const HeaderNavbar: React.FC = () => {
  const pathname = usePathname();
  const { user, profile, setAuthModalOpen } = useAuth();
  const {
    sidebarCollapsed,
    setSidebarOpen,
    searchOpen,
    setSearchOpen,
    setShortcutsOpen,
    favorites,
    toggleFavorite,
    pinned,
    recentlyVisited,
    notifications,
    unreadCount,
    markNotificationsAsRead,
    clearNotifications,
    progressPercent,
    activeTheme,
    setActiveTheme,
  } = useNavigation();

  // Dropdown States
  const [notifOpen, setNotifOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const quickRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) {
        setQuickOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Detect OS for keyboard shortcut string (Mac has Command, others Control)
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
    }
  }, []);

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    if (pathname === "/") return [{ label: "Home", href: "/", active: true }];

    const paths = pathname.split("/").filter(Boolean);
    const crumbs = [{ label: "Home", href: "/", active: false }];

    let accumulatedPath = "";
    paths.forEach((p, idx) => {
      accumulatedPath += `/${p}`;
      const isLast = idx === paths.length - 1;

      // Translate slug to beautiful title
      let label = p;
      if (ROUTE_META[accumulatedPath]) {
        label = ROUTE_META[accumulatedPath].label;
      } else {
        // Fallback title formatting: capitalized and clean
        label = p
          .replace(/-/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      crumbs.push({
        label,
        href: accumulatedPath,
        active: isLast,
      });
    });

    return crumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  const isCurrentFavorite = favorites.includes(pathname);

  return (
    <header
      className={`header-navbar ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}
    >
      {/* Left: Mobile hamburger menu & Breadcrumbs */}
      <div className="navbar-left">
        <button
          className="mobile-hamburger-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar menu"
        >
          <BioIcon name="menu" size={20} />
        </button>

        {/* Dynamic Breadcrumbs */}
        <nav className="breadcrumbs-nav" aria-label="Breadcrumbs">
          <ol className="breadcrumbs-list">
            {breadcrumbs.map((crumb, idx) => (
              <li key={crumb.href} className="breadcrumb-item">
                {idx > 0 && <span className="breadcrumb-separator">/</span>}
                {crumb.active ? (
                  <span className="breadcrumb-link active">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="breadcrumb-link">
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Center: Global Search trigger button */}
      <div className="navbar-center">
        <button
          className="global-search-trigger-bar"
          onClick={() => setSearchOpen(true)}
          aria-label="Open search dialog"
        >
          <span className="search-bar-icon">
            <BioIcon name="search" size={15} />
          </span>
          <span className="search-bar-placeholder">Search topics...</span>
          <kbd className="search-bar-shortcut-kbd">
            {isMac ? "⌘K" : "Ctrl+K"}
          </kbd>
        </button>
      </div>

      {/* Right: Quick actions, notifications, progress and shortcuts */}
      <div className="navbar-right">
        {/* Toggle Bookmark for Current Page */}
        <button
          onClick={() => toggleFavorite(pathname)}
          className={`favorite-page-action-btn ${isCurrentFavorite ? "is-favorite" : ""}`}
          title={isCurrentFavorite ? "Remove page from favorites" : "Bookmark this page"}
        >
          <BioIcon name="star" size={16} />
        </button>

        {/* Quick Links Dropdown */}
        <div className="dropdown-container" ref={quickRef}>
          <button
            onClick={() => setQuickOpen(!quickOpen)}
            className={`quick-actions-trigger-btn ${quickOpen ? "active" : ""}`}
            title="Favorites & Pinned links"
          >
            <BioIcon name="link" size={16} />
          </button>

          {quickOpen && (
            <div className="dropdown-popover quick-actions-popover">
              <h4 className="dropdown-section-title">⭐ FAVORITES & BOOKMARKS</h4>
              {favorites.length > 0 ? (
                <ul className="dropdown-list">
                  {favorites.map((favPath) => {
                    const meta = ROUTE_META[favPath] || { label: "Details Page", icon: "dna-genetics" };
                    return (
                      <li key={favPath}>
                        <Link
                          href={favPath}
                          onClick={() => setQuickOpen(false)}
                          className="dropdown-list-link"
                        >
                          <span className="dropdown-icon">
                            <BioIcon name={meta.icon} size={16} />
                          </span>
                          <span className="dropdown-lbl">{meta.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="dropdown-empty-text">No favorites added yet. Click the star on any page to bookmark.</p>
              )}

              <div className="dropdown-divider" />

              <h4 className="dropdown-section-title">📌 PINNED TOPICS</h4>
              {pinned.length > 0 ? (
                <ul className="dropdown-list">
                  {pinned.map((pinPath) => {
                    const meta = ROUTE_META[pinPath] || { label: "Specimen", icon: "dna-genetics" };
                    return (
                      <li key={pinPath}>
                        <Link
                          href={pinPath}
                          onClick={() => setQuickOpen(false)}
                          className="dropdown-list-link"
                        >
                          <span className="dropdown-icon">
                            <BioIcon name={meta.icon} size={16} />
                          </span>
                          <span className="dropdown-lbl">{meta.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="dropdown-empty-text">No pinned items. Pin topics from the search menu for quick access.</p>
              )}
            </div>
          )}
        </div>

        {/* Notification Center */}
        <div className="dropdown-container" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              markNotificationsAsRead();
            }}
            className={`notifications-trigger-btn ${unreadCount > 0 ? "has-unread" : ""}`}
            title="Notifications"
          >
            <BioIcon name="bell" size={16} />
            {unreadCount > 0 && <span className="notification-badge-dot">{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="dropdown-popover notifications-popover">
              <div className="dropdown-header-row">
                <h4 className="dropdown-section-title">NOTIFICATIONS</h4>
                {notifications.length > 0 && (
                  <button onClick={clearNotifications} className="clear-all-notif-btn">
                    Clear all
                  </button>
                )}
              </div>
              <div className="notifications-list-container">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className="notification-card-item">
                      <span className="notif-icon">
                        <BioIcon name={notif.icon} size={18} />
                      </span>
                      <div className="notif-content">
                        <span className="notif-title">{notif.title}</span>
                        <p className="notif-message">{notif.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="dropdown-empty-text">No notifications received.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Keyboard Shortcuts guide */}
        <button
          onClick={() => setShortcutsOpen(true)}
          className="shortcuts-trigger-btn"
          title="Keyboard shortcuts guide"
        >
          <BioIcon name="keyboard" size={16} />
        </button>

        {/* Theme Cycle Switcher */}
        <button
          onClick={() => {
            const themes: ("green" | "blue" | "gold")[] = ["green", "blue", "gold"];
            const currentIdx = themes.indexOf(activeTheme);
            const nextIdx = (currentIdx + 1) % themes.length;
            setActiveTheme(themes[nextIdx]);
          }}
          className="theme-switcher-btn"
          title={`Active accent: ${activeTheme}. Click to cycle themes.`}
        >
          <BioIcon name="palette" size={16} />
        </button>

        {/* Progress Circle component */}
        <div className="progress-visual-wrapper" title={`Completed certificate tasks: ${progressPercent}%`}>
          <svg className="progress-circle-svg" viewBox="0 0 36 36">
            <path
              className="progress-bg-ring"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="progress-fill-ring"
              strokeDasharray={`${progressPercent}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className="progress-tiny-text">{progressPercent}%</span>
        </div>

        {/* User Auth Section */}
        <div className="auth-nav-indicator">
          {user ? (
            <Link href="/gamification" className="nav-profile-link-btn" title="View Profile Dashboard">
              <img
                src={profile.avatarUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"}
                className="nav-avatar-circle-img"
                alt="User Profile"
              />
            </Link>
          ) : (
            <button onClick={() => setAuthModalOpen(true)} className="nav-sign-in-action-btn">
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Styled Scoped CSS for Header Navbar */}
      <style>{`
        .header-navbar {
          position: fixed;
          top: 12px;
          right: 12px;
          z-index: 998;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          background: var(--ds-glass-bg);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid var(--ds-glass-border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
          border-radius: 14px;
          transition: left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-sizing: border-box;
        }

        .header-navbar.sidebar-collapsed {
          left: 92px;
        }

        .header-navbar.sidebar-expanded {
          left: 284px;
        }

        /* Auth Nav Styles */
        .auth-nav-indicator {
          display: flex;
          align-items: center;
          margin-left: 4px;
        }

        .nav-profile-link-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1.5px solid var(--ds-border-accent);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.3);
          box-shadow: var(--ds-glow-sm);
          transition: all 0.2s ease;
        }

        .nav-profile-link-btn:hover {
          border-color: var(--ds-accent);
          box-shadow: var(--ds-glow-md);
          transform: scale(1.05);
        }

        .nav-avatar-circle-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .nav-sign-in-action-btn {
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s ease;
          box-shadow: var(--ds-glow-sm);
        }

        .nav-sign-in-action-btn:hover {
          background: var(--ds-accent-subtle);
          box-shadow: var(--ds-glow-md);
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .mobile-hamburger-btn {
          display: none;
          background: none;
          border: none;
          color: var(--ds-accent);
          font-size: 1.25rem;
          cursor: pointer;
        }

        /* Breadcrumbs styling */
        .breadcrumbs-nav {
          display: flex;
        }

        .breadcrumbs-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .breadcrumb-separator {
          color: var(--ds-fg-subtle);
          font-size: 0.72rem;
        }

        .breadcrumb-link {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--ds-fg-subtle);
          text-decoration: none;
          transition: color 0.2s;
        }

        .breadcrumb-link:hover {
          color: var(--ds-accent);
        }

        .breadcrumb-link.active {
          color: var(--ds-fg);
          cursor: default;
        }

        /* Navbar Center: Search Pill */
        .navbar-center {
          flex: 1;
          display: flex;
          justify-content: center;
          max-width: 320px;
          margin: 0 16px;
        }

        .global-search-trigger-bar {
          width: 100%;
          display: flex;
          align-items: center;
          padding: 6px 12px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid var(--ds-glass-border);
          border-radius: 99px;
          cursor: pointer;
          color: var(--ds-fg-subtle);
          font-size: 0.78rem;
          outline: none;
          transition: all 0.2s ease;
          justify-content: space-between;
          min-height: 32px;
        }

        .global-search-trigger-bar:hover {
          border-color: var(--ds-border-accent);
          background: rgba(0, 0, 0, 0.45);
          box-shadow: 0 0 10px rgba(57, 255, 20, 0.05);
        }

        .search-bar-icon {
          font-size: 0.85rem;
          margin-right: 8px;
        }

        .search-bar-placeholder {
          margin-right: auto;
        }

        .search-bar-shortcut-kbd {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          padding: 1px 6px;
          font-size: 0.58rem;
          font-family: monospace;
          color: var(--ds-fg-muted);
          box-shadow: 0 1px 2px rgba(0,0,0,0.4);
        }

        /* Navbar Right: Action buttons */
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .favorite-page-action-btn,
        .quick-actions-trigger-btn,
        .notifications-trigger-btn,
        .shortcuts-trigger-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0, 0, 0, 0.2);
          color: var(--ds-fg-muted);
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          box-sizing: border-box;
        }

        .favorite-page-action-btn:hover,
        .quick-actions-trigger-btn:hover,
        .notifications-trigger-btn:hover,
        .shortcuts-trigger-btn:hover,
        .theme-switcher-btn:hover {
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
          box-shadow: var(--ds-glow-sm);
        }

        .theme-switcher-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.95rem;
          box-sizing: border-box;
        }

        .favorite-page-action-btn.is-favorite {
          color: #facc15;
          border-color: rgba(250, 204, 21, 0.3);
          background: rgba(250, 204, 21, 0.05);
          text-shadow: 0 0 6px rgba(250, 204, 21, 0.5);
        }

        .favorite-page-action-btn.is-favorite:hover {
          color: #fef08a;
          border-color: rgba(250, 204, 21, 0.5);
        }

        /* Dropdowns Layout */
        .dropdown-container {
          position: relative;
        }

        .dropdown-popover {
          position: absolute;
          top: 120%;
          right: 0;
          background: var(--ds-surface-overlay);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--ds-glass-border);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), var(--ds-glow-sm);
          border-radius: 12px;
          padding: 12px;
          min-width: 250px;
          max-width: 320px;
          z-index: 1010;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .dropdown-section-title {
          font-size: 0.55rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.12em;
          margin: 4px 0;
        }

        .dropdown-empty-text {
          font-size: 0.68rem;
          color: var(--ds-fg-subtle);
          margin: 2px 0 6px;
          line-height: 1.4;
        }

        .dropdown-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .dropdown-list-link {
          display: flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 8px;
          color: var(--ds-fg-muted);
          text-decoration: none;
          font-size: 0.78rem;
          transition: all 0.2s ease;
        }

        .dropdown-list-link:hover {
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
        }

        .dropdown-icon {
          font-size: 1rem;
          margin-right: 10px;
        }

        .dropdown-divider {
          height: 1px;
          background: var(--ds-glass-border);
          margin: 6px 0;
        }

        /* Notifications Popover */
        .notifications-popover {
          min-width: 280px;
        }

        .dropdown-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .clear-all-notif-btn {
          font-size: 0.58rem;
          color: var(--ds-accent);
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 700;
        }

        .notifications-list-container {
          max-height: 240px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
          scrollbar-width: thin;
        }

        .notification-card-item {
          display: flex;
          gap: 10px;
          padding: 8px;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--ds-glass-border);
        }

        .notif-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .notif-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .notif-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--ds-fg);
        }

        .notif-message {
          font-size: 0.65rem;
          color: var(--ds-fg-subtle);
          line-height: 1.3;
          margin: 0;
        }

        .notification-badge-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          min-width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--ds-danger, #ef4444);
          color: #fff;
          font-size: 0.55rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 6px var(--ds-danger, #ef4444);
        }

        /* Progress Circle Component */
        .progress-visual-wrapper {
          width: 36px;
          height: 36px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .progress-circle-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .progress-bg-ring {
          fill: none;
          stroke: var(--ds-border-muted);
          stroke-width: 3.5;
        }

        .progress-fill-ring {
          fill: none;
          stroke: var(--ds-accent);
          stroke-width: 3.5;
          stroke-linecap: round;
          transition: stroke-dasharray 0.5s ease;
        }

        .progress-tiny-text {
          position: absolute;
          font-size: 0.52rem;
          font-weight: 800;
          color: var(--ds-accent);
        }

        /* Responsive */
        @media (max-width: 860px) {
          .header-navbar {
            left: 12px !important;
            right: 12px !important;
            top: 12px;
            width: auto;
          }

          .mobile-hamburger-btn {
            display: block;
          }

          .breadcrumbs-nav {
            display: none; /* Hide breadcrumbs on small mobile to make space */
          }

          .navbar-center {
            margin: 0 8px;
            max-width: 150px;
          }

          .search-bar-shortcut-kbd {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
