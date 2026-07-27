"use client";

import React, { useState } from "react";
import { BioIcon } from "@/components/ui/navigation/BioIcon";
import type { MolecularObject } from "../types";

interface AssessmentPanelProps {
  molecularObject: MolecularObject;
}

export const AssessmentPanel: React.FC<AssessmentPanelProps> = ({ molecularObject }) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const quizQuestions = [
    {
      id: 1,
      question: `What is the primary biological function of ${molecularObject.name}?`,
      options: [
        molecularObject.primaryFunction,
        "Structural scaffolding for lipid cell membranes",
        "ATP synthesis via oxidative phosphorylation in mitochondria",
        "Degradation of cellular waste in lysosomes"
      ],
      correctIndex: 0,
      explanation: `${molecularObject.name} is primarily responsible for ${molecularObject.primaryFunction}.`
    },
    {
      id: 2,
      question: `Which cell location contains ${molecularObject.symbol}?`,
      options: [
        "Extracellular interstitial matrix only",
        molecularObject.locationInCell[0] || "Nucleus",
        "Cell membrane phospholipid head groups",
        "Golgi apparatus cisternal lumen"
      ],
      correctIndex: 1,
      explanation: `${molecularObject.symbol} is localized in the ${molecularObject.locationInCell.join(" and ")}.`
    }
  ];

  const handleOptionSelect = (qIdx: number, oIdx: number) => {
    if (showResults) return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleSubmit = () => {
    let currentScore = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        currentScore += 1;
      }
    });
    setScore(currentScore);
    setShowResults(true);
  };

  const handleReset = () => {
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  };

  return (
    <div id="assessment-suite" className="assessment-panel-card glassmorphic">
      <div className="card-header">
        <div>
          <span className="card-eyebrow">MOLECULAR ASSESSMENT & CERTIFICATION</span>
          <h3 className="card-title">{molecularObject.name} Evaluation Suite</h3>
        </div>
        <div className="xp-badge">
          <span>REWARD</span>
          <strong>+{molecularObject.xpReward} XP</strong>
        </div>
      </div>

      {/* Questions Stack */}
      <div className="questions-stack">
        {quizQuestions.map((q, qIdx) => {
          const selectedOpt = userAnswers[qIdx];
          const isAnswered = selectedOpt !== undefined;
          const isCorrect = selectedOpt === q.correctIndex;

          return (
            <div key={q.id} className="quiz-card">
              <h4 className="q-title">
                Q{qIdx + 1}: {q.question}
              </h4>

              <div className="opts-list">
                {q.options.map((opt, oIdx) => {
                  let btnClass = "opt-btn";
                  if (selectedOpt === oIdx) btnClass += " selected";
                  if (showResults) {
                    if (oIdx === q.correctIndex) btnClass += " correct";
                    else if (oIdx === selectedOpt) btnClass += " incorrect";
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={showResults}
                      onClick={() => handleOptionSelect(qIdx, oIdx)}
                      className={btnClass}
                    >
                      <span className="opt-letter">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div className={`exp-box ${isCorrect ? "correct" : "incorrect"}`}>
                  <strong>{isCorrect ? "✅ Correct!" : "❌ Incorrect"}</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons & Results */}
      {!showResults ? (
        <button
          disabled={Object.keys(userAnswers).length < quizQuestions.length}
          onClick={handleSubmit}
          className="submit-assessment-btn"
        >
          Submit Answers & Calculate XP
        </button>
      ) : (
        <div className="score-summary-banner">
          <div className="score-text">
            <span>YOUR SCORE</span>
            <strong>{score} / {quizQuestions.length} ({Math.round((score / quizQuestions.length) * 100)}%)</strong>
          </div>
          <button onClick={handleReset} className="reset-btn">
            Retake Quiz
          </button>
        </div>
      )}

      <style>{`
        .assessment-panel-card {
          padding: 1.5rem;
          border-radius: 20px;
          background: rgba(12, 22, 32, 0.85);
          border: 1px solid var(--ds-border-muted);
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .card-eyebrow {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.12em;
        }

        .card-title {
          margin: 2px 0 0 0;
          font-size: 1.2rem;
          font-weight: 900;
          color: #fff;
        }

        .xp-badge {
          background: rgba(250, 204, 21, 0.1);
          border: 1px solid rgba(250, 204, 21, 0.3);
          padding: 6px 12px;
          border-radius: 100px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .xp-badge span { font-size: 0.55rem; font-weight: 800; color: #facc15; }
        .xp-badge strong { font-size: 0.88rem; color: #fff; }

        .questions-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .quiz-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          border-radius: 14px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .q-title { margin: 0; font-size: 0.92rem; font-weight: 800; color: #fff; }

        .opts-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .opt-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--ds-border-muted);
          color: #cbd5e1;
          padding: 8px 12px;
          border-radius: 8px;
          text-align: left;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .opt-btn:hover:not(:disabled) { border-color: var(--ds-border-accent); color: #fff; }
        .opt-btn.selected { border-color: var(--ds-accent); background: var(--ds-accent-faint); color: var(--ds-accent); font-weight: 700; }
        .opt-btn.correct { background: rgba(57, 255, 20, 0.15); border-color: var(--ds-accent); color: var(--ds-accent); font-weight: 800; }
        .opt-btn.incorrect { background: rgba(239, 68, 68, 0.15); border-color: #ef4444; color: #fca5a5; }

        .opt-letter { font-weight: 800; margin-right: 6px; }

        .exp-box {
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 0.78rem;
          line-height: 1.45;
        }
        .exp-box.correct { background: rgba(57, 255, 20, 0.08); border: 1px solid rgba(57, 255, 20, 0.2); color: #fff; }
        .exp-box.incorrect { background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); color: #fff; }

        .submit-assessment-btn {
          background: var(--ds-accent);
          color: var(--ds-bg-primary);
          border: none;
          padding: 12px;
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .submit-assessment-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .submit-assessment-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .score-summary-banner {
          background: rgba(57, 255, 20, 0.08);
          border: 1px solid var(--ds-border-accent);
          border-radius: 14px;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .score-text span { font-size: 0.62rem; font-weight: 800; color: var(--ds-accent); display: block; }
        .score-text strong { font-size: 1.2rem; color: #fff; }

        .reset-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--ds-border-muted);
          color: #fff;
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
