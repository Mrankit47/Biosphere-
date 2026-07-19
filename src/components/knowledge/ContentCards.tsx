"use client";

// ═══════════════════════════════════════════════════════════════
// Biosphere — FactCard, ScientificCard, ResearchCard, ReferenceCard
//
// Reusable content cards for the knowledge page.
// ═══════════════════════════════════════════════════════════════

import React, { useState } from "react";
import type { Flashcard, Quiz } from "@/knowledge-types/object";
import { BioIcon } from "@/components/ui/navigation/BioIcon";

// ─── Flashcard Stack ─────────────────────────────────────────

interface FlashcardStackProps {
  flashcards: Flashcard[];
  accentColor: string;
}

export const FlashcardStack: React.FC<FlashcardStackProps> = ({
  flashcards,
  accentColor,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (flashcards.length === 0) return null;

  const card = flashcards[currentIndex];
  const nextCard = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };
  const prevCard = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <section className="mt-8">
      <h2
        className="text-lg font-bold tracking-tight text-white mb-4"
        style={{ textShadow: `0 0 20px ${accentColor}20` }}
      >
        Flashcards
      </h2>

      <div
        className="relative rounded-2xl p-6 min-h-[140px] cursor-pointer transition-all border"
        style={{
          background: flipped ? `${accentColor}10` : "rgba(255,255,255,0.03)",
          borderColor: flipped ? `${accentColor}30` : "rgba(255,255,255,0.08)",
        }}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[0.65rem] font-semibold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            {card.category}
          </span>
          <span className="text-[0.65rem] text-[var(--ds-fg-muted)]">
            {currentIndex + 1} / {flashcards.length}
          </span>
        </div>
        <p className="text-sm text-white/90 leading-relaxed">
          {flipped ? card.back : card.front}
        </p>
        <div className="mt-3 text-[0.65rem] text-[var(--ds-fg-muted)] tracking-wider">
          {flipped ? "Tap to see question" : "Tap to reveal answer"}
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-3">
        <button
          onClick={prevCard}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
        >
          <BioIcon name="chevron-left" size={16} />
        </button>
        <button
          onClick={nextCard}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
        >
          <BioIcon name="chevron-right" size={16} />
        </button>
      </div>
    </section>
  );
};

// ─── Interactive Quiz ────────────────────────────────────────

interface InteractiveQuizProps {
  quiz: Quiz;
  accentColor: string;
}

export const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ quiz, accentColor }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = quiz.questions[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return; // already answered
    setSelected(idx);
    setShowExplanation(true);
    if (idx === question.answerIndex) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (current + 1 >= quiz.questions.length) {
      setCompleted(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    const pct = Math.round((score / quiz.questions.length) * 100);
    return (
      <section className="mt-8">
        <h2
          className="text-lg font-bold tracking-tight text-white mb-4"
          style={{ textShadow: `0 0 20px ${accentColor}20` }}
        >
          {quiz.title}
        </h2>
        <div className="rounded-2xl p-6 border border-white/8 bg-white/3 text-center">
          <div className="text-4xl font-bold mb-2" style={{ color: accentColor }}>
            {pct}%
          </div>
          <p className="text-sm text-[var(--ds-fg-muted)] mb-1">
            You got {score} out of {quiz.questions.length} correct!
          </p>
          <p className="text-xs text-[var(--ds-fg-muted)] mb-4">
            {pct >= 80 ? "Excellent work! 🎉" : pct >= 50 ? "Good effort! Review and try again." : "Keep studying — you'll get there!"}
          </p>
          <button
            onClick={restart}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: `${accentColor}20`,
              color: accentColor,
              border: `1px solid ${accentColor}30`,
            }}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h2
        className="text-lg font-bold tracking-tight text-white mb-4"
        style={{ textShadow: `0 0 20px ${accentColor}20` }}
      >
        {quiz.title}
      </h2>

      <div className="rounded-2xl p-5 border border-white/8 bg-white/3">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[0.65rem] font-semibold uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            Question {current + 1} of {quiz.questions.length}
          </span>
          <span className="text-xs text-[var(--ds-fg-muted)]">
            Score: {score}/{quiz.questions.length}
          </span>
        </div>

        <p className="text-sm font-medium text-white mb-4">{question.text}</p>

        <div className="space-y-2">
          {question.options.map((opt, idx) => {
            const isCorrect = idx === question.answerIndex;
            const isSelected = idx === selected;
            let borderColor = "rgba(255,255,255,0.08)";
            let bg = "rgba(255,255,255,0.02)";

            if (selected !== null) {
              if (isCorrect) {
                borderColor = "#2ECC71";
                bg = "rgba(46,204,113,0.1)";
              } else if (isSelected && !isCorrect) {
                borderColor = "#E74C3C";
                bg = "rgba(231,76,60,0.1)";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selected !== null}
                className="w-full text-left rounded-xl p-3 text-sm transition-all border"
                style={{
                  background: bg,
                  borderColor,
                  color: isSelected || (selected !== null && isCorrect) ? "white" : "var(--ds-fg-muted)",
                }}
              >
                <span className="font-mono mr-2" style={{ color: accentColor }}>
                  {String.fromCharCode(65 + idx)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-4 rounded-xl p-3 bg-white/3 border border-white/8">
            <p className="text-[0.78rem] text-[var(--ds-fg-muted)] leading-relaxed">
              <strong className="text-white">Explanation:</strong> {question.explanation}
            </p>
          </div>
        )}

        {selected !== null && (
          <button
            onClick={nextQuestion}
            className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: `${accentColor}20`,
              color: accentColor,
              border: `1px solid ${accentColor}30`,
            }}
          >
            {current + 1 >= quiz.questions.length ? "See Results" : "Next Question"}
          </button>
        )}
      </div>
    </section>
  );
};

// ─── Misconceptions Card ─────────────────────────────────────

interface MisconceptionsProps {
  misconceptions: string[];
  accentColor: string;
}

export const MisconceptionsCard: React.FC<MisconceptionsProps> = ({
  misconceptions,
  accentColor,
}) => {
  if (misconceptions.length === 0) return null;

  return (
    <section className="mt-8">
      <h2
        className="text-lg font-bold tracking-tight text-white mb-4"
        style={{ textShadow: `0 0 20px ${accentColor}20` }}
      >
        Common Misconceptions
      </h2>
      <div className="space-y-3">
        {misconceptions.map((m, i) => (
          <div
            key={i}
            className="rounded-xl p-4 border border-[rgba(255,165,0,0.15)] bg-[rgba(255,165,0,0.04)]"
          >
            <p className="text-[0.82rem] text-[var(--ds-fg-muted)] leading-relaxed">{m}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── References & Further Reading ────────────────────────────

interface ReferencesCardProps {
  references: string[];
  furtherReading: string[];
  accentColor: string;
}

export const ReferencesCard: React.FC<ReferencesCardProps> = ({
  references,
  furtherReading,
  accentColor,
}) => {
  if (references.length === 0 && furtherReading.length === 0) return null;

  return (
    <section className="mt-8">
      <h2
        className="text-lg font-bold tracking-tight text-white mb-4"
        style={{ textShadow: `0 0 20px ${accentColor}20` }}
      >
        References & Further Reading
      </h2>

      {references.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ds-fg-muted)] mb-2">
            Academic References
          </h3>
          <ul className="space-y-1.5">
            {references.map((ref, i) => (
              <li key={i} className="flex gap-2 text-[0.78rem] text-[var(--ds-fg-muted)]">
                <span className="text-xs font-mono shrink-0" style={{ color: accentColor }}>
                  [{i + 1}]
                </span>
                {ref}
              </li>
            ))}
          </ul>
        </div>
      )}

      {furtherReading.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ds-fg-muted)] mb-2">
            Further Reading
          </h3>
          <ul className="space-y-1.5">
            {furtherReading.map((ref, i) => (
              <li key={i} className="flex gap-2 text-[0.78rem] text-[var(--ds-fg-muted)]">
                <BioIcon name="dictionary" size={12} className="mt-0.5 shrink-0" />
                {ref}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

// ─── Real-World Applications ─────────────────────────────────

interface RealWorldCardProps {
  applications: string[];
  accentColor: string;
}

export const RealWorldCard: React.FC<RealWorldCardProps> = ({
  applications,
  accentColor,
}) => {
  if (applications.length === 0) return null;

  return (
    <section className="mt-8">
      <h2
        className="text-lg font-bold tracking-tight text-white mb-4"
        style={{ textShadow: `0 0 20px ${accentColor}20` }}
      >
        Real-World Applications
      </h2>
      <div className="space-y-2">
        {applications.map((app, i) => (
          <div
            key={i}
            className="flex gap-3 items-start rounded-xl p-3 border border-white/8 bg-white/3 transition-all hover:bg-white/5"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${accentColor}15` }}
            >
              <BioIcon name="explore" size={14} style={{ color: accentColor }} />
            </div>
            <p className="text-[0.82rem] text-[var(--ds-fg-muted)] leading-relaxed pt-0.5">
              {app}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
