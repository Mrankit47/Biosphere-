"use client";

import React, { useState } from "react";
import { MOLECULAR_EXPERIMENTS } from "../data/experiments";
import type { MolecularExperiment, BasePair } from "../types";

interface ExperimentWorkspaceProps {
  experimentId?: string;
}

export const ExperimentWorkspace: React.FC<ExperimentWorkspaceProps> = ({
  experimentId = "exp-build-dna"
}) => {
  const [selectedExpIdx, setSelectedExpIdx] = useState<number>(0);
  const currentExp: MolecularExperiment =
    MOLECULAR_EXPERIMENTS.find((e) => e.id === experimentId) ||
    MOLECULAR_EXPERIMENTS[selectedExpIdx] ||
    MOLECULAR_EXPERIMENTS[0];

  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleAddBase = (base: BasePair) => {
    if (isCompleted) return;
    const nextSeq = [...userSequence, base];
    setUserSequence(nextSeq);

    const userStr = nextSeq.join("");
    if (currentExp.targetSequence && userStr === currentExp.targetSequence) {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setUserSequence([]);
    setIsCompleted(false);
    setShowHint(false);
  };

  return (
    <div id="interactive-experiment" className="experiment-workspace-card glassmorphic">
      <div className="exp-header">
        <div>
          <span className="exp-eyebrow">INTERACTIVE MOLECULAR LAB & SANDBOX</span>
          <h3 className="exp-title">{currentExp.title}</h3>
        </div>

        {/* Multi-Experiment Selectors */}
        <div className="exp-tabs-strip">
          {MOLECULAR_EXPERIMENTS.slice(0, 5).map((e, idx) => (
            <button
              key={e.id}
              onClick={() => {
                setSelectedExpIdx(idx);
                setUserSequence([]);
                setIsCompleted(false);
              }}
              className={`exp-tab-btn ${selectedExpIdx === idx ? "active" : ""}`}
            >
              Lab {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Instructions Box */}
      <div className="instructions-box">
        <p className="exp-instructions">{currentExp.instructions}</p>
        <button onClick={() => setShowHint(!showHint)} className="hint-toggle-btn">
          💡 {showHint ? "Hide Hint" : "Show Hint"}
        </button>
      </div>

      {showHint && (
        <div className="hint-box">
          <strong>Lab Hint:</strong> {currentExp.hint}
        </div>
      )}

      {/* Lab Workspace Display */}
      <div className="sandbox-area">
        {/* Template Strand */}
        <div className="strand-row template-row">
          <span className="row-label">Template Strand:</span>
          <div className="bases-flex">
            {currentExp.templateSequence.split("").map((b, i) => (
              <span key={i} className={`base-slot ${b}`}>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* User Interactive Complementary Strand */}
        <div className="strand-row user-row">
          <span className="row-label">Your Strand:</span>
          <div className="bases-flex">
            {userSequence.map((b, i) => (
              <span key={i} className={`base-slot user-base ${b}`}>
                {b}
              </span>
            ))}
            {!isCompleted && userSequence.length < (currentExp.targetSequence?.length || 12) && (
              <span className="base-slot empty-slot">?</span>
            )}
          </div>
        </div>
      </div>

      {/* Controls / Nucleotide Selector Buttons */}
      {!isCompleted && (
        <div className="nucleotide-picker-row">
          <span className="picker-lbl">Select Nucleotide to Add:</span>
          <div className="picker-btns">
            {(["A", "T", "C", "G", "U"] as BasePair[]).map((base) => (
              <button
                key={base}
                onClick={() => handleAddBase(base)}
                className={`picker-btn ${base}`}
              >
                + {base}
              </button>
            ))}
            <button onClick={handleReset} className="clear-btn">
              🔄 Clear
            </button>
          </div>
        </div>
      )}

      {/* Completion Banner */}
      {isCompleted && (
        <div className="completion-banner">
          <span className="comp-icon">🎉</span>
          <div>
            <h4 className="comp-title">Experiment Completed Successfully!</h4>
            <p className="comp-sub">
              You matched the sequence perfectly! Earned <strong>+{currentExp.xpReward} XP</strong>
            </p>
          </div>
          <button onClick={handleReset} className="reset-btn">
            Try Again
          </button>
        </div>
      )}

      <style>{`
        .experiment-workspace-card {
          padding: 1.5rem;
          border-radius: 20px;
          background: rgba(12, 22, 32, 0.85);
          border: 1px solid var(--ds-border-muted);
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .exp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .exp-eyebrow {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.12em;
        }

        .exp-title {
          margin: 2px 0 0 0;
          font-size: 1.2rem;
          font-weight: 900;
          color: #fff;
        }

        .exp-tabs-strip {
          display: flex;
          gap: 6px;
        }

        .exp-tab-btn {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          color: var(--ds-fg-muted);
          padding: 5px 10px;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
        }
        .exp-tab-btn.active {
          border-color: var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
        }

        .instructions-box {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .exp-instructions {
          margin: 0;
          font-size: 0.88rem;
          color: #cbd5e1;
          line-height: 1.5;
        }

        .hint-toggle-btn {
          background: rgba(250, 204, 21, 0.1);
          border: 1px solid rgba(250, 204, 21, 0.25);
          color: #facc15;
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }

        .hint-box {
          background: rgba(250, 204, 21, 0.08);
          border: 1px solid rgba(250, 204, 21, 0.2);
          border-radius: 10px;
          padding: 10px;
          font-size: 0.8rem;
          color: #fff;
        }

        .sandbox-area {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid var(--ds-border-muted);
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .strand-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .row-label {
          width: 120px;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.05em;
        }

        .bases-flex {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .base-slot {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          font-weight: 900;
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }
        .base-slot.A { background: #3b82f6; }
        .base-slot.T { background: #ef4444; }
        .base-slot.G { background: #10b981; }
        .base-slot.C { background: #f59e0b; }
        .base-slot.U { background: #8b5cf6; }

        .base-slot.empty-slot {
          border: 1px dashed var(--ds-border-accent);
          background: transparent;
          color: var(--ds-accent);
          animation: pulse 1.5s infinite;
        }

        .nucleotide-picker-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .picker-lbl {
          font-size: 0.75rem;
          font-weight: 800;
          color: #fff;
        }

        .picker-btns {
          display: flex;
          gap: 8px;
        }

        .picker-btn {
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid transparent;
          color: #fff;
          font-size: 0.84rem;
          font-weight: 900;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .picker-btn:hover { transform: translateY(-2px); }
        .picker-btn.A { background: #3b82f6; }
        .picker-btn.T { background: #ef4444; }
        .picker-btn.G { background: #10b981; }
        .picker-btn.C { background: #f59e0b; }
        .picker-btn.U { background: #8b5cf6; }

        .clear-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--ds-border-muted);
          color: #fff;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        .completion-banner {
          background: rgba(57, 255, 20, 0.1);
          border: 1px solid var(--ds-border-accent);
          border-radius: 14px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .comp-icon { font-size: 2rem; }
        .comp-title { margin: 0; font-size: 1.05rem; font-weight: 900; color: #fff; }
        .comp-sub { margin: 2px 0 0 0; font-size: 0.8rem; color: #cbd5e1; }
        .reset-btn {
          margin-left: auto;
          background: var(--ds-accent);
          color: var(--ds-bg-primary);
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 800;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
