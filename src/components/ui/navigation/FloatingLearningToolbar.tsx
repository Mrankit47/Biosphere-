"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigation, ROUTE_META } from "./NavigationContext";

// Sibling timeline flow mapping (Step 5)
const LEARNING_FLOW = [
  { path: "/cell-explorer", label: "Cell Structure Overview", icon: "🔬" },
  { path: "/cell-explorer/membrane", label: "Plasma Membrane", icon: "🛡️" },
  { path: "/cell-explorer/nucleus", label: "Cell Nucleus Structure", icon: "📂" },
  { path: "/cell-explorer/mitochondria", label: "Mitochondria Powerhouse", icon: "⚡" },
  { path: "/dna-genetics", label: "DNA Double Helix Genetics", icon: "🧬" },
  { path: "/process-simulations", label: "Protein Synthesis Transcription", icon: "🌀" },
  { path: "/viruses/sars-cov-2", label: "Viral Structures (SARS-CoV-2)", icon: "☣️" },
  { path: "/microorganisms/amoeba", label: "Microbe Mechanics (Amoeba)", icon: "🦠" },
  { path: "/rare-species/vaquita", label: "Endangered Wildlife (Vaquita)", icon: "🐬" },
  { path: "/quiz", label: "Quiz Certification Board", icon: "📝" },
  { path: "/gamification", label: "Profile Certification Page", icon: "🏆" },
];

export const FloatingLearningToolbar: React.FC = () => {
  const pathname = usePathname();
  const { favorites, toggleFavorite, addNotification } = useNavigation();

  // Floating scratchpad note states
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesText, setNotesText] = useState("");

  // Load scratchpad note per route
  useEffect(() => {
    if (typeof window !== "undefined" && pathname) {
      const savedNote = localStorage.getItem(`bio_notes_${pathname}`) || "";
      setNotesText(savedNote);
    }
  }, [pathname]);

  const handleNotesChange = (text: string) => {
    setNotesText(text);
    if (typeof window !== "undefined" && pathname) {
      localStorage.setItem(`bio_notes_${pathname}`, text);
    }
  };

  // Only show this learning sidebar on specimen, cell, or simulation modules
  const isLessonOrSpecimen =
    pathname !== "/" &&
    pathname !== "/dashboard" &&
    pathname !== "/gamification" &&
    pathname !== "/learning-paths" &&
    pathname !== "/research-hub" &&
    pathname !== "/dictionary";

  if (!isLessonOrSpecimen) return null;

  // 1. Resolve metadata based on path segment (Step 3)
  let difficulty: "Easy" | "Medium" | "Hard" = "Medium";
  let readTime = "5 mins";

  if (pathname.includes("cell-explorer") || pathname.includes("microorganisms")) {
    difficulty = "Easy";
    readTime = "4 mins";
  } else if (pathname.includes("viruses") || pathname.includes("dna-genetics")) {
    difficulty = "Medium";
    readTime = "5 mins";
  } else if (pathname.includes("human-body") || pathname.includes("virtual-lab") || pathname.includes("ecosystem-simulator")) {
    difficulty = "Hard";
    readTime = "8 mins";
  }

  // 2. Resolve sibling timeline references (Step 5)
  const currentIdx = LEARNING_FLOW.findIndex((item) => {
    if (item.path === "/") return pathname === "/";
    return pathname?.startsWith(item.path);
  });

  const prevItem = currentIdx > 0 ? LEARNING_FLOW[currentIdx - 1] : null;
  const nextItem = currentIdx !== -1 && currentIdx + 1 < LEARNING_FLOW.length ? LEARNING_FLOW[currentIdx + 1] : null;

  // 3. Action callbacks
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      addNotification(
        "🔗 Link Copied",
        "The lesson URL has been copied to your clipboard. Share with fellow biologists!",
        "📎"
      );
    }
  };

  const isCurrentFavorite = favorites.includes(pathname);

  // Quick tutor prompt helper
  const cleanPathLabel = ROUTE_META[pathname]?.label || "this biology topic";
  const tutorPrompt = `Explain details and functions of ${cleanPathLabel} in molecular biology.`;

  return (
    <>
      <aside className="floating-learning-toolbar-root" aria-label="Learning controls toolbar">
        {/* Topic metadata (Step 3) */}
        <div className="toolbar-section metadata-section">
          <div className="meta-badge-row">
            <span className={`difficulty-indicator-badge ${difficulty.toLowerCase()}`}>
              {difficulty.toUpperCase()}
            </span>
            <span className="read-time-indicator">⏱️ {readTime}</span>
          </div>
          <span className="current-topic-lbl">CURRENT TOPIC</span>
          <h4 className="topic-header-title">{cleanPathLabel}</h4>
        </div>

        <div className="toolbar-divider" />

        {/* Quick actions row */}
        <div className="toolbar-section actions-section">
          <span className="sec-lbl">STUDY UTILITIES</span>
          <div className="actions-button-grid">
            {/* Bookmark star */}
            <button
              onClick={() => toggleFavorite(pathname)}
              className={`action-pill-btn ${isCurrentFavorite ? "active-star" : ""}`}
              title={isCurrentFavorite ? "Remove bookmark" : "Add bookmark"}
            >
              <span className="btn-icon">{isCurrentFavorite ? "★" : "☆"}</span>
              <span className="btn-lbl">Bookmark</span>
            </button>

            {/* Draggable notes trigger */}
            <button
              onClick={() => setNotesOpen(!notesOpen)}
              className={`action-pill-btn ${notesOpen ? "active-notes" : ""}`}
              title="Open scratchpad notepad"
            >
              <span className="btn-icon">📝</span>
              <span className="btn-lbl">Scratchpad</span>
            </button>

            {/* Share URL */}
            <button onClick={handleShare} className="action-pill-btn" title="Copy URL path link">
              <span className="btn-icon">🔗</span>
              <span className="btn-lbl">Share URL</span>
            </button>

            {/* Ask AI Tutor */}
            <Link href={`/tutor?q=${encodeURIComponent(tutorPrompt)}`} className="action-pill-btn text-link" title="Ask AI tutor about this">
              <span className="btn-icon">🤖</span>
              <span className="btn-lbl">Ask Tutor</span>
            </Link>
          </div>
        </div>

        <div className="toolbar-divider" />

        {/* Sibling timeline connections */}
        <div className="toolbar-section timeline-section">
          <span className="sec-lbl">LEARNING FLOW TIMELINE</span>
          <div className="timeline-flow-links">
            {prevItem ? (
              <Link href={prevItem.path} className="timeline-nav-btn prev">
                <span className="arrow-lbl">← PREVIOUS LESSON</span>
                <span className="topic-lbl">{prevItem.icon} {prevItem.label}</span>
              </Link>
            ) : (
              <div className="timeline-nav-btn disabled">
                <span className="arrow-lbl">← TIMELINE START</span>
                <span className="topic-lbl">No previous items</span>
              </div>
            )}

            {nextItem ? (
              <Link href={nextItem.path} className="timeline-nav-btn next">
                <span className="arrow-lbl">NEXT TOPIC →</span>
                <span className="topic-lbl">{nextItem.icon} {nextItem.label}</span>
              </Link>
            ) : (
              <Link href="/quiz" className="timeline-nav-btn next finish">
                <span className="arrow-lbl">NEXT TOPIC →</span>
                <span className="topic-lbl">📝 Final Quiz Board</span>
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Floating Notes Scratchpad Panel */}
      {notesOpen && (
        <div className="floating-notes-scratchpad glassmorphic">
          <div className="notes-header-row">
            <span className="notes-title">🗒️ STUDY NOTES</span>
            <button onClick={() => setNotesOpen(false)} className="notes-close-btn" aria-label="Close notes pane">
              ✕
            </button>
          </div>
          <textarea
            className="notes-textarea"
            placeholder="Write notes here... Saves automatically to this topic."
            value={notesText}
            onChange={(e) => handleNotesChange(e.target.value)}
          />
          <div className="notes-footer-info">
            Saves to local browser cache.
          </div>
        </div>
      )}

      {/* Styled Scoped CSS for Floating Toolbar */}
      <style>{`
        .floating-learning-toolbar-root {
          position: fixed;
          right: 16px;
          top: 80px;
          width: 220px;
          z-index: 990;
          background: var(--ds-surface-overlay);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid var(--ds-glass-border);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), var(--ds-glow-sm);
          border-radius: 14px;
          padding: 16px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .toolbar-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .toolbar-divider {
          height: 1px;
          background: var(--ds-glass-border);
        }

        .sec-lbl {
          font-size: 0.52rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Metadata badge styling */
        .meta-badge-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .difficulty-indicator-badge {
          font-size: 0.52rem;
          font-weight: 900;
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .difficulty-indicator-badge.easy {
          background: rgba(57, 255, 20, 0.08);
          border: 1px solid rgba(57, 255, 20, 0.2);
          color: var(--ds-accent);
        }

        .difficulty-indicator-badge.medium {
          background: rgba(250, 204, 21, 0.08);
          border: 1px solid rgba(250, 204, 21, 0.25);
          color: #facc15;
        }

        .difficulty-indicator-badge.hard {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #fca5a5;
        }

        .read-time-indicator {
          font-size: 0.65rem;
          color: var(--ds-fg-subtle);
          font-weight: 600;
        }

        .current-topic-lbl {
          font-size: 0.52rem;
          font-weight: 800;
          color: var(--ds-accent-muted);
          letter-spacing: 0.05em;
        }

        .topic-header-title {
          font-size: 0.84rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
          line-height: 1.3;
        }

        /* Action buttons grid */
        .actions-button-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .action-pill-btn {
          padding: 6px;
          border-radius: 6px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0, 0, 0, 0.2);
          color: var(--ds-fg-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
          box-sizing: border-box;
        }

        .action-pill-btn.text-link {
          text-decoration: none;
        }

        .action-pill-btn:hover {
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
        }

        .action-pill-btn.active-star {
          color: #facc15;
          border-color: rgba(250, 204, 21, 0.3);
          background: rgba(250, 204, 21, 0.05);
        }

        .action-pill-btn.active-notes {
          color: var(--ds-accent);
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-subtle);
        }

        .btn-icon {
          font-size: 0.95rem;
        }

        .btn-lbl {
          font-size: 0.52rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        /* Sibling navigation */
        .timeline-flow-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .timeline-nav-btn {
          display: flex;
          flex-direction: column;
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0, 0, 0, 0.25);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .timeline-nav-btn:hover:not(.disabled) {
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
        }

        .timeline-nav-btn.finish {
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
        }

        .timeline-nav-btn.finish:hover {
          background: var(--ds-accent-subtle);
          box-shadow: var(--ds-glow-sm);
        }

        .timeline-nav-btn.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .arrow-lbl {
          font-size: 0.5rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.05em;
        }

        .timeline-nav-btn.finish .arrow-lbl {
          color: var(--ds-accent);
        }

        .topic-lbl {
          font-size: 0.68rem;
          font-weight: 650;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Floating scratchpad note */
        .floating-notes-scratchpad {
          position: fixed;
          right: 252px;
          top: 80px;
          width: 280px;
          height: 240px;
          z-index: 991;
          background: var(--ds-surface-overlay);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--ds-glass-border);
          box-shadow: 0 12px 40px rgba(0,0,0,0.6), var(--ds-glow-sm);
          border-radius: 12px;
          padding: 12px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .notes-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }

        .notes-title {
          font-size: 0.7rem;
          font-weight: 850;
          color: var(--ds-accent);
        }

        .notes-close-btn {
          background: none;
          border: none;
          color: var(--ds-fg-subtle);
          cursor: pointer;
          font-size: 0.8rem;
        }

        .notes-close-btn:hover {
          color: #ef4444;
        }

        .notes-textarea {
          flex: 1;
          background: rgba(0,0,0,0.4);
          border: 1px solid var(--ds-glass-border);
          border-radius: 6px;
          padding: 8px;
          color: #fff;
          font-size: 0.78rem;
          font-family: inherit;
          resize: none;
          outline: none;
        }

        .notes-textarea:focus {
          border-color: var(--ds-border-accent);
        }

        .notes-footer-info {
          font-size: 0.58rem;
          color: var(--ds-fg-subtle);
          text-align: right;
          flex-shrink: 0;
        }

        /* Repositioning layout offset for main content if toolbar is visible */
        @media (min-width: 1120px) {
          /* Add some spacing on desktop screens if dynamic learning toolbar overlaps */
          body.has-toolbar .biosphere-main-content {
            padding-right: 250px;
          }
        }

        @media (max-width: 1120px) {
          .floating-learning-toolbar-root {
            position: fixed;
            bottom: 84px; /* Stack above mobile bottom navbar */
            top: auto;
            left: 12px;
            right: 12px;
            width: auto;
            flex-direction: row;
            height: auto;
            justify-content: space-between;
            align-items: center;
            padding: 10px 14px;
            gap: 12px;
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;
          }

          .toolbar-section {
            flex-direction: row;
            align-items: center;
            gap: 10px;
          }

          .meta-badge-row {
            margin-bottom: 0;
            gap: 8px;
          }

          .current-topic-lbl {
            display: none;
          }

          .actions-button-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 6px;
          }

          .action-pill-btn {
            flex-direction: row;
            padding: 4px 8px;
            align-items: center;
            gap: 4px;
          }

          .btn-lbl {
            display: none; /* Hide label text on narrow overlays */
          }

          .timeline-flow-links {
            flex-direction: row;
            gap: 6px;
          }

          .timeline-nav-btn {
            padding: 4px 8px;
          }

          .arrow-lbl {
            display: none;
          }

          .toolbar-divider {
            width: 1px;
            height: 24px;
          }

          .floating-notes-scratchpad {
            bottom: 140px;
            top: auto;
            right: 12px;
            left: 12px;
            width: auto;
          }
        }
      `}</style>
    </>
  );
};
