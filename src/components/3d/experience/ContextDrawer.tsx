"use client";

import React, { useState, useEffect } from "react";
import { useExperience } from "./ExperienceContext";

export const ContextDrawer: React.FC = () => {
  const {
    mode,
    selectedObjectId,
    setSelectedObjectId,
    activeMetadata,
    bookmarks,
    toggleBookmark,
    notes,
    saveNote,
    speakText,
    isSpeaking,
    stopSpeaking
  } = useExperience();

  const [activeTab, setActiveTab] = useState<"info" | "clinical" | "facts" | "notes">("info");
  const [localNote, setLocalNote] = useState("");

  // Update local note when selected object changes
  useEffect(() => {
    if (selectedObjectId) {
      setLocalNote(notes[selectedObjectId] || "");
      setActiveTab("info");
    }
  }, [selectedObjectId, notes]);

  if (!selectedObjectId || !activeMetadata) return null;

  const isBookmarked = bookmarks.includes(selectedObjectId);

  const handleNoteSave = () => {
    saveNote(selectedObjectId, localNote);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(`${activeMetadata.name}. Scientific name: ${activeMetadata.scientificName}. ${activeMetadata.description}`);
    }
  };

  const tabsList = [
    { id: "info", label: "Function" },
    { id: "clinical", label: "Diseases" },
    { id: "facts", label: "Facts" },
    { id: "notes", label: "Notes" }
  ];

  return (
    <div className="context-drawer-root glassmorphic">
      {/* Drawer Header */}
      <div className="drawer-header">
        <div className="header-meta-wrap">
          <span className="drawer-emoji">{activeMetadata.emoji}</span>
          <div className="drawer-titles">
            <h4 className="drawer-name">{activeMetadata.name}</h4>
            <span className="drawer-scientific">{activeMetadata.scientificName}</span>
          </div>
        </div>

        <div className="drawer-header-actions">
          <button
            onClick={() => toggleBookmark(selectedObjectId)}
            className={`header-action-btn fav ${isBookmarked ? "active" : ""}`}
            title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
          >
            {isBookmarked ? "⭐" : "☆"}
          </button>
          <button
            onClick={handleSpeak}
            className={`header-action-btn voice ${isSpeaking ? "active" : ""}`}
            title="Read text"
          >
            {isSpeaking ? "🔊" : "🔈"}
          </button>
          <button
            onClick={() => setSelectedObjectId(null)}
            className="header-action-btn close"
            title="Deselect"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Basic Stats row */}
      <div className="drawer-stats-row">
        <span className="stat-pill difficulty">
          Difficulty: <b>{activeMetadata.difficulty}</b>
        </span>
        <span className="stat-pill study-time">
          Study: <b>{activeMetadata.estimatedStudyTime}</b>
        </span>
      </div>

      {/* Tabs list */}
      <div className="drawer-tabs-row">
        {tabsList.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`drawer-tab-btn ${activeTab === t.id ? "active" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab body content */}
      <div className="drawer-tab-body">
        {activeTab === "info" && (
          <div className="tab-pane info">
            <div className="pane-section">
              <span className="section-label">📜 DESCRIPTION:</span>
              <p className="pane-desc-text">{activeMetadata.description}</p>
            </div>
            <div className="pane-section">
              <span className="section-label">🔬 PRIMARY FUNCTION:</span>
              <p className="pane-desc-text">{activeMetadata.function}</p>
            </div>
            <div className="pane-section">
              <span className="section-label">🏥 REAL-WORLD IMPORTANCE:</span>
              <p className="pane-desc-text">{activeMetadata.realWorldImportance}</p>
            </div>
          </div>
        )}

        {activeTab === "clinical" && (
          <div className="tab-pane clinical">
            <span className="section-label">🏥 ASSOCIATED DISEASES & PATHOLOGIES:</span>
            {activeMetadata.diseases.length > 0 ? (
              <ul className="diseases-list">
                {activeMetadata.diseases.map((d, i) => (
                  <li key={i} className="disease-item">
                    {d}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data-text">No major associated clinical diseases logged.</p>
            )}
          </div>
        )}

        {activeTab === "facts" && (
          <div className="tab-pane facts">
            <span className="section-label">💡 INTERESTING BIOLOGY FACTS:</span>
            <ul className="facts-list">
              {activeMetadata.facts.map((f, i) => (
                <li key={i} className="fact-item">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="tab-pane notes">
            <span className="section-label">📝 PERSONAL STUDY NOTES:</span>
            <p className="notes-desc">Add annotations which sync with your learning dashboard profile.</p>
            <textarea
              value={localNote}
              onChange={(e) => setLocalNote(e.target.value)}
              placeholder="Enter details, research findings or lecture notes..."
              className="notes-textarea"
            />
            <button onClick={handleNoteSave} className="save-notes-btn">
              💾 Save Notes
            </button>
          </div>
        )}
      </div>

      {/* Footer Ask AI and Related Lessons */}
      <div className="drawer-footer-sec">
        {activeMetadata.relatedLessons.length > 0 && (
          <div className="related-lessons-box">
            <span className="section-label">📚 RELATED SYLLABUS LESSONS:</span>
            <div className="lessons-grid">
              {activeMetadata.relatedLessons.map((l, i) => (
                <a key={i} href={l.url} className="lesson-link-card">
                  {l.title} →
                </a>
              ))}
            </div>
          </div>
        )}

        <a
          href={`/tutor?q=${encodeURIComponent(`Explain the biology and function of the human ${activeMetadata.name} in simple terms`)}`}
          className="ask-ai-drawer-btn"
        >
          🤖 Consult AI Tutor regarding {activeMetadata.name} →
        </a>
      </div>

      <style>{`
        .context-drawer-root {
          width: 320px;
          height: 100%;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-sizing: border-box;
          overflow-y: auto;
          z-index: 110;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--ds-glass-border);
          padding-bottom: 12px;
        }

        .header-meta-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .drawer-emoji {
          font-size: 1.8rem;
        }

        .drawer-titles {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .drawer-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
        }

        .drawer-scientific {
          font-size: 0.65rem;
          color: var(--ds-fg-subtle);
          font-style: italic;
        }

        .drawer-header-actions {
          display: flex;
          gap: 6px;
        }

        .header-action-btn {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          border: 1px solid var(--ds-glass-border);
          background: none;
          color: var(--ds-fg-subtle);
          font-size: 0.72rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-action-btn:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.15);
        }

        .header-action-btn.active.fav {
          color: #facc15;
          border-color: rgba(250,204,21,0.3);
          background: rgba(250,204,21,0.05);
        }

        .header-action-btn.active.voice {
          color: var(--ds-accent);
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
        }

        .drawer-stats-row {
          display: flex;
          gap: 8px;
        }

        .stat-pill {
          font-size: 0.58rem;
          padding: 3px 8px;
          border-radius: 100px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(255,255,255,0.02);
          color: var(--ds-fg-muted);
        }

        .stat-pill b {
          color: #fff;
        }

        .drawer-tabs-row {
          display: flex;
          border-bottom: 1px solid var(--ds-glass-border);
          gap: 4px;
        }

        .drawer-tab-btn {
          flex: 1;
          padding: 6px 4px;
          border: none;
          background: none;
          color: var(--ds-fg-subtle);
          font-size: 0.68rem;
          font-weight: 750;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .drawer-tab-btn:hover {
          color: #fff;
        }

        .drawer-tab-btn.active {
          color: var(--ds-accent);
          border-bottom: 1.5px solid var(--ds-accent);
        }

        .drawer-tab-body {
          flex: 1;
          min-height: 150px;
        }

        .tab-pane {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pane-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .section-label {
          font-size: 0.55rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.08em;
        }

        .pane-desc-text {
          font-size: 0.72rem;
          color: var(--ds-fg-muted);
          line-height: 1.5;
          margin: 0;
        }

        .diseases-list,
        .facts-list {
          padding-left: 14px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .disease-item,
        .fact-item {
          font-size: 0.72rem;
          color: var(--ds-fg-muted);
          line-height: 1.45;
        }

        .no-data-text {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          margin: 0;
        }

        .notes-desc {
          font-size: 0.58rem;
          color: var(--ds-fg-subtle);
          margin: 0;
        }

        .notes-textarea {
          width: 100%;
          min-height: 80px;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0,0,0,0.3);
          color: #fff;
          font-size: 0.72rem;
          font-family: inherit;
          resize: vertical;
          outline: none;
          box-sizing: border-box;
        }

        .notes-textarea:focus {
          border-color: var(--ds-border-accent);
        }

        .save-notes-btn {
          width: 100%;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          font-size: 0.72rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .save-notes-btn:hover {
          background: var(--ds-accent-subtle);
        }

        .drawer-footer-sec {
          display: flex;
          flex-direction: column;
          gap: 14px;
          border-top: 1px solid var(--ds-glass-border);
          padding-top: 14px;
        }

        .related-lessons-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .lessons-grid {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .lesson-link-card {
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(255,255,255,0.015);
          color: var(--ds-fg-muted);
          font-size: 0.65rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }

        .lesson-link-card:hover {
          color: var(--ds-accent);
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
        }

        .ask-ai-drawer-btn {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          font-size: 0.72rem;
          font-weight: 800;
          text-align: center;
          text-decoration: none;
          transition: all 0.2s;
        }

        .ask-ai-drawer-btn:hover {
          background: var(--ds-accent-subtle);
        }
      `}</style>
    </div>
  );
};
