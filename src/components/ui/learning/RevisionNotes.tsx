"use client";

import React, { useState } from "react";
import { type RevisionNote } from "@/data/learningEngine";

interface RevisionNotesProps {
  revision: RevisionNote;
  lessonTitle: string;
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onRevisionComplete?: () => void;
}

export const RevisionNotes: React.FC<RevisionNotesProps> = ({
  revision,
  lessonTitle,
  isBookmarked,
  onBookmark,
  onRevisionComplete,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showTerms, setShowTerms] = useState(true);

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    const content = `
      <html><head><title>${lessonTitle} — Revision Notes</title>
      <style>body{font-family:system-ui;padding:40px;max-width:700px;margin:0 auto}
      h1{font-size:1.4rem;border-bottom:2px solid #333;padding-bottom:8px}
      h2{font-size:1rem;color:#555;margin-top:20px}
      ul{padding-left:20px}li{margin-bottom:6px;line-height:1.5}
      .term{font-weight:bold;color:#333}.def{color:#666}
      .summary{background:#f5f5f5;padding:16px;border-radius:8px;line-height:1.6}</style></head>
      <body><h1>📝 ${lessonTitle}</h1>
      <h2>Important Points</h2><ul>${revision.importantPoints.map(p => `<li>${p}</li>`).join("")}</ul>
      <h2>Key Terms</h2><ul>${revision.keyTerms.map(t => `<li><span class="term">${t.term}:</span> <span class="def">${t.definition}</span></li>`).join("")}</ul>
      <h2>Summary</h2><div class="summary">${revision.summary}</div>
      </body></html>`;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(content);
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="revision-root">
      <div className="revision-header">
        <button
          className="revision-toggle-btn"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="revision-hdr-icon">{expanded ? "📖" : "📕"}</span>
          <h3 className="revision-hdr-text">REVISION NOTES</h3>
          <span className="revision-chevron">{expanded ? "▼" : "▶"}</span>
        </button>

        <div className="revision-actions">
          {onBookmark && (
            <button
              onClick={onBookmark}
              className={`rev-action-btn ${isBookmarked ? "active" : ""}`}
              title="Bookmark notes"
            >
              {isBookmarked ? "⭐" : "☆"}
            </button>
          )}
          <button onClick={handlePrint} className="rev-action-btn" title="Print notes">
            🖨️
          </button>
          {onRevisionComplete && (
            <button onClick={onRevisionComplete} className="rev-action-btn complete" title="Mark as revised">
              ✓ Revised
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="revision-body">
          {/* Important Points */}
          <div className="revision-section">
            <h4 className="revision-sec-hdr">⚡ Important Points</h4>
            <ul className="revision-points-list">
              {revision.importantPoints.map((point, i) => (
                <li key={i} className="revision-point">{point}</li>
              ))}
            </ul>
          </div>

          {/* Key Terms */}
          <div className="revision-section">
            <div className="revision-sec-hdr-row">
              <h4 className="revision-sec-hdr">📚 Key Terms</h4>
              <button
                className="terms-toggle-btn"
                onClick={() => setShowTerms(!showTerms)}
              >
                {showTerms ? "Hide" : "Show"}
              </button>
            </div>
            {showTerms && (
              <div className="revision-terms-grid">
                {revision.keyTerms.map((kt, i) => (
                  <div key={i} className="revision-term-card">
                    <span className="term-word">{kt.term}</span>
                    <span className="term-def">{kt.definition}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="revision-section">
            <h4 className="revision-sec-hdr">📝 Summary</h4>
            <p className="revision-summary-text">{revision.summary}</p>
          </div>
        </div>
      )}

      <style>{`
        .revision-root {
          border-radius: 16px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          overflow: hidden;
          box-sizing: border-box;
        }
        .revision-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: rgba(255,255,255,0.015);
          border-bottom: 1px solid var(--ds-glass-border);
        }
        .revision-toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .revision-hdr-icon { font-size: 1rem; }
        .revision-hdr-text {
          font-size: 0.68rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.12em;
          margin: 0;
        }
        .revision-chevron {
          font-size: 0.55rem;
          color: var(--ds-fg-subtle);
        }
        .revision-actions {
          display: flex;
          gap: 6px;
        }
        .rev-action-btn {
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid var(--ds-glass-border);
          background: none;
          color: var(--ds-fg-muted);
          font-size: 0.65rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
        }
        .rev-action-btn:hover {
          border-color: var(--ds-border-accent);
          color: var(--ds-accent);
        }
        .rev-action-btn.active {
          color: #facc15;
          border-color: rgba(250,204,21,0.3);
        }
        .rev-action-btn.complete {
          color: var(--ds-accent);
          border-color: var(--ds-border-accent);
        }

        .revision-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .revision-section {}
        .revision-sec-hdr {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--ds-fg-muted);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0 0 10px 0;
        }
        .revision-sec-hdr-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .terms-toggle-btn {
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid var(--ds-glass-border);
          background: none;
          color: var(--ds-fg-subtle);
          font-size: 0.58rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
        }

        .revision-points-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .revision-point {
          font-size: 0.78rem;
          color: var(--ds-fg);
          line-height: 1.5;
          padding-left: 16px;
          position: relative;
        }
        .revision-point::before {
          content: "•";
          position: absolute;
          left: 0;
          color: var(--ds-accent);
          font-weight: 900;
        }

        .revision-terms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 8px;
        }
        .revision-term-card {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .term-word {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--ds-accent);
        }
        .term-def {
          font-size: 0.68rem;
          color: var(--ds-fg-subtle);
          line-height: 1.4;
        }

        .revision-summary-text {
          font-size: 0.78rem;
          color: var(--ds-fg);
          line-height: 1.65;
          margin: 0;
          padding: 14px 16px;
          border-radius: 10px;
          background: rgba(57,255,20,0.02);
          border: 1px solid rgba(57,255,20,0.08);
        }
      `}</style>
    </div>
  );
};
