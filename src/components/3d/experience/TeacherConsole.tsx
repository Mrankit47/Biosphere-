"use client";

import React from "react";
import { useExperience } from "./ExperienceContext";

export const TeacherConsole: React.FC = () => {
  const { mode, teacherInfo, metadata } = useExperience();

  if (mode !== "teacher" || !teacherInfo) return null;

  const handlePrintGuide = () => {
    if (typeof window === "undefined") return;
    const content = `
      <html><head><title>Teacher Guide — 3D Structural Anatomy</title>
      <style>body{font-family:system-ui;padding:40px;max-width:700px;margin:0 auto}
      h1{font-size:1.4rem;border-bottom:2px solid #333;padding-bottom:8px}
      h2{font-size:1rem;color:#555;margin-top:20px}
      ul{padding-left:20px}li{margin-bottom:6px;line-height:1.5}
      .summary{background:#f5f5f5;padding:16px;border-radius:8px;line-height:1.6}</style></head>
      <body><h1>🎓 Teacher Lesson Plan Guide</h1>
      <h2>Guide & Slide Notes</h2><ul>${teacherInfo.guideNotes.map(n => `<li>${n}</li>`).join("")}</ul>
      <h2>Suggested Classroom Activities</h2><ul>${teacherInfo.suggestedActivities.map(a => `<li>${a}</li>`).join("")}</ul>
      <h2>Discussion Prompts</h2><ul>${teacherInfo.discussionPrompts.map(p => `<li>${p}</li>`).join("")}</ul>
      <h2>Syllabus Summary</h2><div class="summary">${teacherInfo.printableSummary}</div>
      </body></html>`;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(content);
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="teacher-console-root glassmorphic">
      <div className="tc-header">
        <span className="tc-icon">🎓</span>
        <h4 className="tc-title">TEACHER CONSOLE</h4>
        <button onClick={handlePrintGuide} className="tc-print-btn" title="Print Lesson Guide">
          🖨️ Print Lesson Guide
        </button>
      </div>

      <div className="tc-body">
        {/* Guide Notes */}
        <div className="tc-section">
          <span className="tc-sec-label">📌 LESSON / SLIDE NOTES:</span>
          <ul className="tc-list">
            {teacherInfo.guideNotes.map((note, idx) => (
              <li key={idx} className="tc-item">{note}</li>
            ))}
          </ul>
        </div>

        {/* Suggested Activities */}
        <div className="tc-section">
          <span className="tc-sec-label">🎒 CLASSROOM ACTIVITIES:</span>
          <ul className="tc-list">
            {teacherInfo.suggestedActivities.map((act, idx) => (
              <li key={idx} className="tc-item">{act}</li>
            ))}
          </ul>
        </div>

        {/* Discussion Starters */}
        <div className="tc-section">
          <span className="tc-sec-label">💬 DISCUSSION PROMPTS:</span>
          <ul className="tc-list">
            {teacherInfo.discussionPrompts.map((p, idx) => (
              <li key={idx} className="tc-item">{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .teacher-console-root {
          padding: 16px 20px;
          border-radius: 16px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          box-sizing: border-box;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 480px;
          overflow-y: auto;
        }

        .tc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--ds-glass-border);
          padding-bottom: 8px;
        }

        .tc-icon { font-size: 1.15rem; }
        .tc-title {
          font-size: 0.68rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.12em;
          margin: 0;
          flex: 1;
          margin-left: 8px;
        }

        .tc-print-btn {
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          font-size: 0.58rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
        }

        .tc-body {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .tc-section {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .tc-sec-label {
          font-size: 0.55rem;
          font-weight: 900;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.08em;
        }

        .tc-list {
          padding-left: 14px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .tc-item {
          font-size: 0.68rem;
          color: var(--ds-fg-muted);
          line-height: 1.45;
        }
      `}</style>
    </div>
  );
};
