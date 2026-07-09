"use client";

import React from "react";
import { type EngineLesson, type Program, type Module } from "@/data/learningEngine";

interface LessonHeaderProps {
  lesson: EngineLesson;
  program: Program;
  module: Module;
  currentIndex: number;
  totalLessons: number;
  isComplete: boolean;
  isBookmarked: boolean;
  onBookmark: () => void;
  onComplete: () => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  lesson,
  program,
  module,
  currentIndex,
  totalLessons,
  isComplete,
  isBookmarked,
  onBookmark,
  onComplete,
}) => {
  const progressPct = totalLessons > 0 ? Math.round(((currentIndex + 1) / totalLessons) * 100) : 0;

  return (
    <div className="lesson-header-root">
      {/* Breadcrumb */}
      <nav className="lesson-breadcrumb">
        <a href="/learning-paths" className="bc-link">Programs</a>
        <span className="bc-sep">›</span>
        <a href={program.exploreUrl} className="bc-link">{program.title}</a>
        <span className="bc-sep">›</span>
        <span className="bc-current">{module.title}</span>
        <span className="bc-sep">›</span>
        <span className="bc-current bc-lesson">{lesson.title}</span>
      </nav>

      {/* Progress Bar */}
      <div className="lesson-progress-row">
        <div className="lesson-progress-track">
          <div className="lesson-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <span className="lesson-progress-label">
          Lesson {currentIndex + 1} of {totalLessons} · {progressPct}%
        </span>
      </div>

      {/* Title & Meta */}
      <div className="lesson-title-section">
        <div className="lesson-title-left">
          <span className="lesson-program-icon">{program.icon}</span>
          <div>
            <h1 className="lesson-title">{lesson.title}</h1>
            <div className="lesson-meta-chips">
              <span className={`lesson-difficulty-badge ${lesson.difficulty}`}>
                {lesson.difficulty}
              </span>
              <span className="lesson-time-chip">⏱ {lesson.estimatedMinutes} min</span>
              {lesson.prerequisites.length > 0 && (
                <span className="lesson-prereq-chip">🔗 {lesson.prerequisites.length} prerequisite{lesson.prerequisites.length > 1 ? "s" : ""}</span>
              )}
            </div>
          </div>
        </div>

        <div className="lesson-actions-right">
          <button
            onClick={onBookmark}
            className={`lesson-action-btn ${isBookmarked ? "active" : ""}`}
            title={isBookmarked ? "Remove bookmark" : "Bookmark this lesson"}
          >
            {isBookmarked ? "⭐" : "☆"}
          </button>
          <button
            onClick={onComplete}
            className={`lesson-action-btn complete-btn ${isComplete ? "completed" : ""}`}
            title={isComplete ? "Completed" : "Mark as complete"}
          >
            {isComplete ? "✓ Done" : "Mark Complete"}
          </button>
        </div>
      </div>

      {/* Objectives */}
      <div className="lesson-objectives-card">
        <h3 className="objectives-header">🎯 LEARNING OBJECTIVES</h3>
        <ul className="objectives-list">
          {lesson.objectives.map((obj, i) => (
            <li key={i} className="objective-item">
              <span className="objective-icon">{obj.icon}</span>
              <span className="objective-text">{obj.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .lesson-header-root {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        .lesson-breadcrumb {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          font-size: 0.68rem;
        }
        .bc-link {
          color: var(--ds-fg-muted);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .bc-link:hover { color: var(--ds-accent); }
        .bc-sep { color: var(--ds-fg-subtle); font-size: 0.6rem; }
        .bc-current { color: var(--ds-fg-subtle); font-weight: 600; }
        .bc-lesson { color: var(--ds-fg); font-weight: 700; }

        .lesson-progress-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .lesson-progress-track {
          flex: 1;
          height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
        }
        .lesson-progress-fill {
          height: 100%;
          background: var(--ds-accent);
          border-radius: 2px;
          transition: width 0.4s ease;
          box-shadow: var(--ds-glow-sm);
        }
        .lesson-progress-label {
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--ds-fg-subtle);
          white-space: nowrap;
        }

        .lesson-title-section {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .lesson-title-left {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .lesson-program-icon {
          font-size: 2rem;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .lesson-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #fff;
          margin: 0 0 6px 0;
          line-height: 1.2;
        }
        .lesson-meta-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }
        .lesson-difficulty-badge {
          font-size: 0.55rem;
          font-weight: 900;
          padding: 2px 8px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .lesson-difficulty-badge.beginner {
          color: #4ade80;
          background: rgba(74,222,128,0.08);
          border: 1px solid rgba(74,222,128,0.2);
        }
        .lesson-difficulty-badge.intermediate {
          color: #facc15;
          background: rgba(250,204,21,0.08);
          border: 1px solid rgba(250,204,21,0.2);
        }
        .lesson-difficulty-badge.advanced {
          color: #f87171;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
        }
        .lesson-time-chip,
        .lesson-prereq-chip {
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--ds-fg-muted);
        }

        .lesson-actions-right {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-shrink: 0;
        }
        .lesson-action-btn {
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(255,255,255,0.03);
          color: var(--ds-fg-muted);
          font-size: 0.75rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s;
        }
        .lesson-action-btn:hover {
          border-color: var(--ds-border-accent);
          color: var(--ds-accent);
        }
        .lesson-action-btn.active {
          color: #facc15;
          border-color: rgba(250,204,21,0.3);
          background: rgba(250,204,21,0.05);
        }
        .complete-btn.completed {
          color: var(--ds-accent);
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
        }

        .lesson-objectives-card {
          border-radius: 12px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          padding: 16px 20px;
        }
        .objectives-header {
          font-size: 0.62rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.12em;
          margin: 0 0 10px 0;
        }
        .objectives-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .objective-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.78rem;
          color: var(--ds-fg);
          font-weight: 600;
        }
        .objective-icon { font-size: 1rem; flex-shrink: 0; }

        @media (max-width: 640px) {
          .lesson-title { font-size: 1.15rem; }
          .lesson-title-section { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};
