"use client";

import React, { useState } from "react";
import { CheckpointQuestion } from "@/data/simulations";

interface CheckpointPanelProps {
  quiz: CheckpointQuestion[];
  onComplete: (score: number) => void;
  earnedXp: number;
}

export default function CheckpointPanel({
  quiz,
  onComplete,
  earnedXp
}: CheckpointPanelProps) {
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectOption = (optIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [currentQIdx]: optIdx }));
  };

  const handleNext = () => {
    if (currentQIdx < quiz.length - 1) {
      setCurrentQIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIdx > 0) {
      setCurrentQIdx((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    let score = 0;
    quiz.forEach((q, idx) => {
      if (answers[idx] === q.ans) score++;
    });
    setSubmitted(true);
    onComplete(score);
  };

  const activeQuestion = quiz[currentQIdx] || null;

  return (
    <div className="panel-card glassmorphic p-4 flex flex-col gap-3 min-h-[220px] border-[var(--ds-border-muted)] bg-black/35">
      <div className="border-b border-[var(--ds-border-muted)] pb-2 mb-1 flex justify-between items-center">
        <h3 className="panel-section-title !m-0">📝 CHECKPOINT QUESTIONS</h3>
        <span className="text-[9px] text-[var(--ds-fg-subtle)]">
          Question {currentQIdx + 1} of {quiz.length}
        </span>
      </div>

      {!submitted ? (
        activeQuestion && (
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-white leading-relaxed">
                {activeQuestion.q}
              </h4>
              <div className="space-y-2">
                {activeQuestion.options.map((opt, idx) => {
                  const isSelected = answers[currentQIdx] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left px-3 py-2 rounded text-[10px] border transition-all ${
                        isSelected
                          ? "bg-[var(--ds-accent-faint)] border-[var(--ds-accent-muted)] text-[var(--ds-accent)]"
                          : "bg-white/2 border-[var(--ds-border-muted)] text-[var(--ds-fg-muted)] hover:border-[var(--ds-accent-muted)]"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}. {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nav Row */}
            <div className="flex justify-between items-center mt-4 text-[10px]">
              <button
                onClick={handlePrev}
                disabled={currentQIdx === 0}
                className="bg-white/5 border border-[var(--ds-border-muted)] px-3 py-1 rounded text-white disabled:opacity-30"
              >
                Previous
              </button>

              {currentQIdx < quiz.length - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={answers[currentQIdx] === undefined}
                  className="bg-white/5 border border-[var(--ds-border-muted)] px-3 py-1 rounded text-white disabled:opacity-30"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={answers[currentQIdx] === undefined}
                  className="bg-purple-950 border border-purple-500/50 px-4 py-1.5 rounded text-purple-300 font-bold hover:bg-purple-900 transition-all"
                >
                  Submit Checkpoint
                </button>
              )}
            </div>
          </div>
        )
      ) : (
        /* Results and Explanation Feedback */
        <div className="flex-grow flex flex-col justify-center text-center space-y-4 py-4">
          <div>
            <span className="text-[28px] block">🎉</span>
            <h4 className="text-[12px] font-black text-white uppercase mt-2">
              Checkpoint Cleared
            </h4>
            <p className="text-[10px] text-[var(--ds-fg-muted)] mt-1">
              You scored total of <strong className="text-[var(--ds-accent)]">+{earnedXp} XP</strong> points!
            </p>
          </div>

          <div className="text-left bg-white/2 border border-[var(--ds-border-muted)] rounded p-2.5 max-h-[140px] overflow-y-auto text-[10px] space-y-2">
            {quiz.map((q, idx) => (
              <div key={idx} className="border-b border-[var(--ds-border-muted)]/20 pb-2 last:border-0 last:pb-0">
                <span className="font-bold text-[var(--ds-fg-muted)]">Q{idx + 1}: {q.q}</span>
                <p className="text-[var(--ds-accent-muted)] font-mono text-[9px] mt-1">
                  Explanation: {q.explanation}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setAnswers({});
              setCurrentQIdx(0);
              setSubmitted(false);
            }}
            className="w-full bg-white/5 border border-[var(--ds-border-muted)] hover:bg-white/10 text-white font-bold py-2 rounded transition-all text-xs"
          >
            Retry Checkpoint Quiz
          </button>
        </div>
      )}
    </div>
  );
}
