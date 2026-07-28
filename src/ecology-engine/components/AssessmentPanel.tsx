"use client";

import React, { useState } from "react";
import { Ecosystem, BiodiversityMetrics, EcosystemChallenge } from "../types";
import { EcologyAssessmentEngine } from "../assessment/ecologyAssessmentEngine";

interface AssessmentPanelProps {
  ecosystem: Ecosystem;
  metrics: BiodiversityMetrics;
  onAwardXP: (xp: number) => void;
  onLoadChallenge: (challenge: EcosystemChallenge) => void;
}

export const AssessmentPanel: React.FC<AssessmentPanelProps> = ({
  ecosystem,
  metrics,
  onAwardXP,
  onLoadChallenge,
}) => {
  const challenges = EcologyAssessmentEngine.getChallenges();
  const quizzes = EcologyAssessmentEngine.getQuizzes();

  const [activeTab, setActiveTab] = useState<"challenges" | "quiz">("challenges");
  const [selectedQuizIdx, setSelectedQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [userScore, setUserScore] = useState(0);

  const currentQuiz = quizzes[selectedQuizIdx];

  const handleQuizSubmit = () => {
    if (selectedAnswer === null) return;
    setQuizSubmitted(true);
    if (selectedAnswer === currentQuiz.correctAnswerIndex) {
      setUserScore((prev) => prev + 100);
      onAwardXP(100);
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    if (selectedQuizIdx < quizzes.length - 1) {
      setSelectedQuizIdx((prev) => prev + 1);
    } else {
      setSelectedQuizIdx(0);
    }
  };

  return (
    <div className="assessment-panel flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-2">
          <span>🏆 Ecosystem Challenges & Knowledge Assessment</span>
        </h3>

        <div className="flex gap-1 rounded-lg bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab("challenges")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "challenges"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Challenges ({challenges.length})
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "quiz"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Food Web Quiz
          </button>
        </div>
      </div>

      {/* Tab 1: Ecosystem Challenges */}
      {activeTab === "challenges" && (
        <div className="space-y-3">
          {challenges.map((chal) => {
            const isCompleted = chal.winCondition(ecosystem, metrics);

            return (
              <div
                key={chal.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 hover:border-emerald-500/40 transition-all"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-200">{chal.title}</h4>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                      +{chal.xpReward} XP
                    </span>
                    {isCompleted && (
                      <span className="rounded bg-emerald-500 px-2 py-0.5 text-[9px] font-bold text-slate-950">
                        COMPLETED ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{chal.description}</p>
                </div>

                <button
                  onClick={() => onLoadChallenge(chal)}
                  className="rounded-lg bg-emerald-500/20 px-3.5 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 transition-all flex-shrink-0"
                >
                  🚀 Launch Scenario
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Food Web Quiz */}
      {activeTab === "quiz" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Question {selectedQuizIdx + 1} of {quizzes.length} — Concept: {currentQuiz.concept}
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              Score: {userScore} XP
            </span>
          </div>

          <h4 className="text-xs font-bold text-slate-200 leading-relaxed">
            {currentQuiz.question}
          </h4>

          <div className="space-y-2">
            {currentQuiz.options.map((opt, idx) => {
              let btnStyle = "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700";
              if (selectedAnswer === idx) {
                btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-400";
              }
              if (quizSubmitted) {
                if (idx === currentQuiz.correctAnswerIndex) {
                  btnStyle = "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold";
                } else if (selectedAnswer === idx) {
                  btnStyle = "border-red-500 bg-red-500/20 text-red-300";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={quizSubmitted}
                  onClick={() => setSelectedAnswer(idx)}
                  className={`w-full text-left rounded-xl border p-3 text-xs transition-all ${btnStyle}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {quizSubmitted ? (
            <div className="space-y-3 pt-2">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 leading-relaxed">
                <strong>Explanation:</strong> {currentQuiz.explanation}
              </div>

              <button
                onClick={handleNextQuiz}
                className="w-full rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md"
              >
                Next Question ➔
              </button>
            </div>
          ) : (
            <button
              disabled={selectedAnswer === null}
              onClick={handleQuizSubmit}
              className="w-full rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-40 transition-all shadow-md"
            >
              Submit Answer
            </button>
          )}
        </div>
      )}
    </div>
  );
};
