"use client";

import React from "react";
import { type Program, getProgramLessonCount } from "@/data/learningEngine";
import { getProgramCompletionPercent } from "@/utils/progressEngine";
import { ProgressRing } from "./ProgressRing";

interface ProgramCardProps {
  program: Program;
  onClick?: () => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program, onClick }) => {
  const percent = getProgramCompletionPercent(program.id);
  const lessonCount = getProgramLessonCount(program.id);
  const moduleCount = program.modules.length;

  return (
    <button className="program-card-root" onClick={onClick} type="button">
      <div className="program-card-header">
        <div className="program-card-icon-wrap" style={{ borderColor: program.color + "40" }}>
          <span className="program-card-icon">{program.icon}</span>
        </div>
        <ProgressRing percent={percent} size={52} strokeWidth={4} color={program.color} showLabel={true} />
      </div>

      <h3 className="program-card-title">{program.title}</h3>
      <p className="program-card-desc">{program.description}</p>

      <div className="program-card-meta-row">
        <span className={`program-card-difficulty ${program.difficulty}`}>
          {program.difficulty}
        </span>
        <span className="program-card-stat">{moduleCount} modules</span>
        <span className="program-card-stat">{lessonCount} lessons</span>
        <span className="program-card-stat">{program.estimatedHours}h</span>
      </div>

      {program.prerequisites.length > 0 && (
        <div className="program-card-prereqs">
          <span className="prereq-label">Requires:</span>
          {program.prerequisites.map((p) => (
            <span key={p} className="prereq-pill">{p}</span>
          ))}
        </div>
      )}

      <style>{`
        .program-card-root {
          display: flex;
          flex-direction: column;
          border-radius: 16px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          padding: 20px;
          cursor: pointer;
          transition: all 0.25s ease;
          text-align: left;
          font-family: inherit;
          box-sizing: border-box;
          width: 100%;
        }
        .program-card-root:hover {
          border-color: var(--ds-border-accent);
          box-shadow: 0 4px 30px rgba(0,0,0,0.3), var(--ds-glow-sm);
          transform: translateY(-2px);
        }
        .program-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .program-card-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: 1.5px solid;
          background: rgba(255,255,255,0.03);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .program-card-icon {
          font-size: 1.5rem;
        }
        .program-card-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #fff;
          margin: 0 0 6px 0;
        }
        .program-card-desc {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          line-height: 1.5;
          margin: 0 0 14px 0;
        }
        .program-card-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }
        .program-card-difficulty {
          font-size: 0.58rem;
          font-weight: 900;
          padding: 2px 8px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .program-card-difficulty.beginner {
          color: #4ade80;
          background: rgba(74,222,128,0.08);
          border: 1px solid rgba(74,222,128,0.2);
        }
        .program-card-difficulty.intermediate {
          color: #facc15;
          background: rgba(250,204,21,0.08);
          border: 1px solid rgba(250,204,21,0.2);
        }
        .program-card-difficulty.advanced {
          color: #f87171;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
        }
        .program-card-stat {
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--ds-fg-muted);
        }
        .program-card-prereqs {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
          margin-top: 10px;
        }
        .prereq-label {
          font-size: 0.55rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .prereq-pill {
          font-size: 0.55rem;
          font-weight: 700;
          color: var(--ds-fg-muted);
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--ds-glass-border);
          padding: 2px 8px;
          border-radius: 100px;
          text-transform: capitalize;
        }
      `}</style>
    </button>
  );
};
