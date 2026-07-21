"use client";

import React from "react";

interface ResultPanelProps {
  quizScore: number;
  vivaScore: number;
  totalXp: number;
  achievements: { title: string; desc: string; icon: string }[];
  isCompleted: boolean;
  onReset: () => void;
  onGenerateReport: () => void;
}

export default function ResultPanel({
  quizScore,
  vivaScore,
  totalXp,
  achievements,
  isCompleted,
  onReset,
  onGenerateReport
}: ResultPanelProps) {
  // Compute overall grade percentage
  const avgGrade = Math.round((quizScore / 3) * 50 + (vivaScore / 100) * 50);

  return (
    <div className="panel-card glassmorphic flex flex-col h-full items-stretch justify-center text-center p-6 space-y-4 min-h-[300px]">
      <div>
        <span className="text-[28px] animate-bounce block">🏆</span>
        <h3 className="text-[15px] font-black text-white uppercase tracking-wider">
          Practical Assessment Complete
        </h3>
        <p className="text-[10px] text-[var(--ds-fg-muted)]">
          Your grades and performance indicators have been synchronized with your profile.
        </p>
      </div>

      {/* Score Grid Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-[var(--ds-border-muted)] rounded-lg p-3 flex flex-col items-center">
          <span className="text-[8px] text-[var(--ds-fg-subtle)] uppercase">Practical Quiz</span>
          <span className="text-lg font-black text-white mt-1">{quizScore} / 3</span>
          <span className="text-[8px] text-[var(--ds-accent)] mt-0.5">MCQ Evaluation</span>
        </div>
        <div className="bg-white/5 border border-[var(--ds-border-muted)] rounded-lg p-3 flex flex-col items-center">
          <span className="text-[8px] text-[var(--ds-fg-subtle)] uppercase">Oral Lab Viva</span>
          <span className="text-lg font-black text-white mt-1">{vivaScore}%</span>
          <span className="text-[8px] text-[var(--ds-accent)] mt-0.5">AI BioTutor Oral</span>
        </div>
      </div>

      {/* Total Score Meter */}
      <div className="bg-[var(--ds-accent-faint)] border border-[var(--ds-accent-muted)] rounded-lg p-3 flex justify-between items-center px-4">
        <div className="text-left">
          <span className="text-[9px] text-[var(--ds-fg-muted)] uppercase block">Cumulative Grade</span>
          <span className="text-base font-black text-[var(--ds-accent)]">
            {avgGrade}% {avgGrade >= 85 ? "Excellent (A)" : avgGrade >= 70 ? "Pass (B)" : "Retry"}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[9px] text-[var(--ds-fg-muted)] uppercase block">XP Awarded</span>
          <span className="text-base font-black text-[#38bdf8] font-mono">+{totalXp} XP</span>
        </div>
      </div>

      {/* Unlocked Achievements list */}
      {achievements.length > 0 && (
        <div className="text-left bg-black/40 border border-[var(--ds-border-muted)] rounded-lg p-3">
          <h4 className="text-[9px] font-bold text-[var(--ds-accent)] uppercase tracking-wider mb-2">
            🏆 Unlocked Lab Badges
          </h4>
          <div className="space-y-2">
            {achievements.map((ach, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[10px]">
                <span className="text-base">{ach.icon}</span>
                <div>
                  <span className="font-bold text-white block leading-tight">{ach.title}</span>
                  <span className="text-[8px] text-[var(--ds-fg-subtle)] block leading-none">
                    {ach.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onReset}
          className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold py-2 rounded border border-[var(--ds-border-muted)] transition-all"
        >
          Reset Simulator
        </button>
        <button
          onClick={onGenerateReport}
          className="flex-1 bg-[var(--ds-accent-faint)] border border-[var(--ds-accent-muted)] hover:bg-[var(--ds-accent-subtle)] text-[var(--ds-accent)] text-[11px] font-bold py-2 rounded transition-all"
        >
          View Lab Report
        </button>
      </div>
    </div>
  );
}
