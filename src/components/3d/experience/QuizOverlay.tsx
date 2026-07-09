"use client";

import React, { useState, useEffect } from "react";
import { useExperience } from "./ExperienceContext";

export const QuizOverlay: React.FC = () => {
  const {
    mode,
    quizzes,
    quizIndex,
    quizScore,
    quizFinished,
    activeQuizQuestion,
    submitAnswer,
    resetQuiz
  } = useExperience();

  const [selectedAns, setSelectedAns] = useState<any>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  // Clear choices when question changes
  useEffect(() => {
    setSelectedAns(null);
    setFeedback(null);
  }, [quizIndex]);

  if (mode !== "quiz" || quizzes.length === 0) return null;

  const total = quizzes.length;

  const handleSelectOption = (opt: string) => {
    if (feedback) return;
    setSelectedAns(opt);
  };

  const handleSelectTrueFalse = (val: boolean) => {
    if (feedback) return;
    setSelectedAns(val);
  };

  const handleCheckAnswer = () => {
    if (selectedAns === null || feedback) return;
    const isCorrect = submitAnswer(selectedAns);
    setFeedback(isCorrect ? "correct" : "incorrect");
  };

  return (
    <div className="quiz-overlay-root glassmorphic">
      {/* Quiz Header */}
      <div className="quiz-header">
        <span className="quiz-icon">📝</span>
        <h4 className="quiz-title">ANATOMY CHALLENGE</h4>
        <span className="quiz-score-badge">
          Score: {quizScore} / {total}
        </span>
      </div>

      {quizFinished ? (
        <div className="quiz-result-panel">
          <span className="medal-emoji">{quizScore === total ? "🏆" : quizScore >= total / 2 ? "🥈" : "🌱"}</span>
          <h5 className="result-title">Challenge Complete!</h5>
          <p className="result-desc">
            You scored {quizScore} out of {total} questions correctly. Keep reviewing the model structures to lock in the information.
          </p>
          <button onClick={resetQuiz} className="quiz-action-btn submit">
            🔄 Retry Challenge
          </button>
        </div>
      ) : (
        <div className="quiz-question-panel">
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${((quizIndex + 1) / total) * 100}%` }} />
          </div>

          <div className="question-card">
            <span className="question-count">QUESTION {quizIndex + 1} OF {total}</span>
            <p className="question-text">{activeQuizQuestion?.question}</p>
          </div>

          {/* Option templates */}
          <div className="answers-container">
            {activeQuizQuestion?.type === "identify" && activeQuizQuestion.options && (
              <div className="identify-options-grid">
                {activeQuizQuestion.options.map((opt) => {
                  const isSelected = selectedAns === opt;
                  let cardClass = "";
                  if (feedback) {
                    if (opt === activeQuizQuestion.correctAnswer) cardClass = "correct";
                    else if (isSelected) cardClass = "incorrect";
                    else cardClass = "disabled";
                  } else if (isSelected) {
                    cardClass = "selected";
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(opt)}
                      disabled={!!feedback}
                      className={`option-card ${cardClass}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}

            {activeQuizQuestion?.type === "truefalse" && (
              <div className="true-false-row">
                {[true, false].map((val) => {
                  const isSelected = selectedAns === val;
                  let cardClass = "";
                  if (feedback) {
                    if (val === activeQuizQuestion.correctAnswer) cardClass = "correct";
                    else if (isSelected) cardClass = "incorrect";
                    else cardClass = "disabled";
                  } else if (isSelected) {
                    cardClass = "selected";
                  }

                  return (
                    <button
                      key={val ? "true" : "false"}
                      onClick={() => handleSelectTrueFalse(val)}
                      disabled={!!feedback}
                      className={`tf-btn ${val ? "true-btn" : "false-btn"} ${cardClass}`}
                    >
                      {val ? "✅ TRUE" : "❌ FALSE"}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Row */}
          {!feedback ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedAns === null}
              className="quiz-action-btn submit"
            >
              Verify Answer →
            </button>
          ) : (
            <div className="feedback-card">
              <span className={`feedback-badge ${feedback}`}>
                {feedback === "correct" ? "✓ Correct!" : "✗ Incorrect"}
              </span>
              <p className="feedback-explanation">{activeQuizQuestion?.explanation}</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        .quiz-overlay-root {
          padding: 20px;
          border-radius: 16px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          box-sizing: border-box;
          width: 100%;
        }

        .quiz-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--ds-glass-border);
          padding-bottom: 10px;
          margin-bottom: 12px;
        }

        .quiz-icon { font-size: 1.1rem; }
        .quiz-title {
          font-size: 0.68rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.12em;
          margin: 0;
          flex: 1;
          margin-left: 8px;
        }

        .quiz-score-badge {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .quiz-result-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          padding: 10px 0;
        }

        .medal-emoji { font-size: 2.2rem; }
        .result-title {
          font-size: 1rem;
          font-weight: 850;
          color: #fff;
          margin: 0;
        }

        .result-desc {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          line-height: 1.55;
          margin: 0 0 10px;
        }

        .quiz-question-panel {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .quiz-progress-bar {
          width: 100%;
          height: 3px;
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
          overflow: hidden;
        }

        .quiz-progress-fill {
          height: 100%;
          background: var(--ds-accent);
          transition: width 0.3s ease;
        }

        .question-card {
          padding: 14px;
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--ds-glass-border);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .question-count {
          font-size: 0.52rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.08em;
        }

        .question-text {
          font-size: 0.78rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.45;
          margin: 0;
        }

        .answers-container {
          min-height: 80px;
        }

        .identify-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .option-card {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(255,255,255,0.02);
          color: var(--ds-fg-muted);
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .option-card:hover:not(:disabled) {
          border-color: rgba(255,255,255,0.15);
          color: #fff;
        }

        .option-card.selected {
          border-color: var(--ds-border-accent);
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
        }

        .option-card.correct {
          border-color: #10b981;
          color: #10b981;
          background: rgba(16,185,129,0.08);
        }

        .option-card.incorrect {
          border-color: #ef4444;
          color: #ef4444;
          background: rgba(239,68,68,0.08);
        }

        .option-card.disabled {
          opacity: 0.4;
          cursor: default;
        }

        .true-false-row {
          display: flex;
          gap: 8px;
        }

        .tf-btn {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(255,255,255,0.02);
          color: var(--ds-fg-muted);
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .tf-btn.selected {
          border-color: var(--ds-border-accent);
          color: var(--ds-accent);
        }

        .tf-btn.correct {
          border-color: #10b981;
          color: #10b981;
          background: rgba(16,185,129,0.08);
        }

        .tf-btn.incorrect {
          border-color: #ef4444;
          color: #ef4444;
          background: rgba(239,68,68,0.08);
        }

        .quiz-action-btn {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .quiz-action-btn.submit {
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          border: 1.5px solid var(--ds-accent);
        }

        .quiz-action-btn.submit:hover:not(:disabled) {
          background: var(--ds-accent-subtle);
        }

        .quiz-action-btn:disabled {
          opacity: 0.4;
          cursor: default;
        }

        .feedback-card {
          padding: 12px;
          background: rgba(0,0,0,0.15);
          border-radius: 8px;
          border: 1.5px dashed var(--ds-glass-border);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .feedback-badge {
          font-size: 0.58rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .feedback-badge.correct { color: #10b981; }
        .feedback-badge.incorrect { color: #ef4444; }

        .feedback-explanation {
          font-size: 0.68rem;
          color: var(--ds-fg-muted);
          line-height: 1.45;
          margin: 0;
        }
      `}</style>
    </div>
  );
};
