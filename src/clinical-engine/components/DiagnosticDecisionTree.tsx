"use client";

import React, { useState } from "react";
import { SAMPLE_DECISION_TREES } from "../services/decisionTreeEngine";
import type { DiagnosticDecisionTree as DiagnosticDecisionTreeType } from "../types";

export const DiagnosticDecisionTree: React.FC = () => {
  const [selectedTreeIdx, setSelectedTreeIdx] = useState<number>(0);
  const currentTree = SAMPLE_DECISION_TREES[selectedTreeIdx] || SAMPLE_DECISION_TREES[0];

  const [currentNodeId, setCurrentNodeId] = useState<string>(currentTree.initialNodeId);
  const [history, setHistory] = useState<string[]>([]);
  const [finalDiagnosis, setFinalDiagnosis] = useState<string | null>(null);

  const currentNode = currentTree.nodes[currentNodeId];

  const handleSelectOption = (opt: any) => {
    if (opt.diagnosisResult) {
      setFinalDiagnosis(opt.diagnosisResult);
    } else if (opt.nextStepId) {
      setHistory((prev) => [...prev, currentNodeId]);
      setCurrentNodeId(opt.nextStepId);
    }
  };

  const handleReset = () => {
    setCurrentNodeId(currentTree.initialNodeId);
    setHistory([]);
    setFinalDiagnosis(null);
  };

  return (
    <div className="decision-tree-card glassmorphic">
      <div className="tree-header-row">
        <div>
          <span className="tree-eyebrow">DIAGNOSTIC ALGORITHM</span>
          <h3 className="tree-heading">{currentTree.title}</h3>
        </div>

        {SAMPLE_DECISION_TREES.length > 1 && (
          <div className="tree-tabs">
            {SAMPLE_DECISION_TREES.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTreeIdx(idx);
                  setCurrentNodeId(t.initialNodeId);
                  setHistory([]);
                  setFinalDiagnosis(null);
                }}
                className={`tree-tab-btn ${selectedTreeIdx === idx ? "active" : ""}`}
              >
                Algorithm {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Algorithm Step Box */}
      <div className="tree-step-box">
        {finalDiagnosis ? (
          <div className="final-diagnosis-box">
            <span className="dx-eyebrow">DIAGNOSTIC ALGORITHM CONCLUSION</span>
            <h4 className="final-dx-title">{finalDiagnosis}</h4>
            <button onClick={handleReset} className="reset-tree-btn">
              🔄 Restart Diagnostic Algorithm
            </button>
          </div>
        ) : currentNode ? (
          <div className="node-content-box">
            <span className="node-cat-badge">STEP CATEGORY: {currentNode.category}</span>
            <h4 className="node-question-text">{currentNode.question}</h4>

            <div className="options-stack">
              {currentNode.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt)}
                  className="tree-opt-btn"
                >
                  <span className="opt-label-text">{opt.label}</span>
                  <span className="opt-reasoning">{opt.reasoning}</span>
                </button>
              ))}
            </div>

            {history.length > 0 && (
              <button onClick={handleReset} className="reset-tree-btn small">
                ↩️ Reset to Start
              </button>
            )}
          </div>
        ) : null}
      </div>

      <style>{`
        .decision-tree-card {
          padding: 1.5rem;
          border-radius: 20px;
          background: rgba(12, 22, 32, 0.85);
          border: 1px solid var(--ds-border-muted);
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .tree-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .tree-eyebrow {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.12em;
        }

        .tree-heading {
          margin: 2px 0 0 0;
          font-size: 1.2rem;
          font-weight: 900;
          color: #fff;
        }

        .tree-tabs {
          display: flex;
          gap: 6px;
        }

        .tree-tab-btn {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          color: var(--ds-fg-muted);
          padding: 5px 10px;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
        }
        .tree-tab-btn.active {
          border-color: var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
        }

        .tree-step-box {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--ds-border-muted);
          border-radius: 16px;
          padding: 1.25rem;
        }

        .node-content-box {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .node-cat-badge {
          font-size: 0.62rem;
          font-weight: 800;
          color: #60a5fa;
          letter-spacing: 0.08em;
        }

        .node-question-text {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 900;
          color: #fff;
        }

        .options-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 6px;
        }

        .tree-opt-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          padding: 12px 14px;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
          transition: all 0.25s;
        }
        .tree-opt-btn:hover {
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
        }

        .opt-label-text {
          font-size: 0.88rem;
          font-weight: 800;
          color: #fff;
        }

        .opt-reasoning {
          font-size: 0.75rem;
          color: var(--ds-fg-subtle);
        }

        .final-diagnosis-box {
          background: rgba(57, 255, 20, 0.08);
          border: 1px solid rgba(57, 255, 20, 0.3);
          border-radius: 14px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-align: center;
        }

        .dx-eyebrow {
          font-size: 0.62rem;
          font-weight: 900;
          color: var(--ds-accent);
          letter-spacing: 0.1em;
        }

        .final-dx-title {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 900;
          color: #fff;
        }

        .reset-tree-btn {
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          color: #fff;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
        }
        .reset-tree-btn.small {
          align-self: flex-start;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
};
