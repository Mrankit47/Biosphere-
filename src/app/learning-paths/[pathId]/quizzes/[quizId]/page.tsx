"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getJourneyById, getQuizById } from "@/data/learningPaths";
import { getUserProgress, saveUserProgress, getOrCreateUserId, UserProgressData } from "@/utils/supabase";

interface QuizPageProps {
  params: Promise<{ pathId: string; quizId: string }>;
}

export default function QuizPage({ params }: QuizPageProps) {
  const { pathId, quizId } = use(params);
  const router = useRouter();

  const journey = getJourneyById(pathId);
  const quiz = journey ? getQuizById(journey, quizId) : undefined;

  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<UserProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  // Quiz execution states
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userId = getOrCreateUserId();
    getUserProgress(userId)
      .then((data) => {
        setProgress(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load progress:", err);
        setLoading(false);
      });
  }, [pathId, quizId]);

  if (!journey || !quiz) {
    return (
      <div style={S.errorContainer}>
        <h1 style={{ color: "#E24B4A", fontSize: "1.5rem" }}>Quiz Not Found</h1>
        <p style={{ color: "rgba(200,245,200,0.5)", marginTop: 8 }}>This quiz ID does not exist.</p>
        <Link href="/learning-paths" style={S.backBtn}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!mounted || loading) {
    return (
      <div style={S.loadingContainer}>
        <div className="pulse-dot" style={{ width: 20, height: 20 }} />
        <span style={{ color: "rgba(200,245,200,0.5)", marginTop: 12 }}>Loading quiz questions...</span>
      </div>
    );
  }

  const question = quiz.questions[currentIdx];
  const isLastQuestion = currentIdx + 1 === quiz.questions.length;

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelectedOpt(idx);
  };

  const handleSubmit = () => {
    if (selectedOpt === null || submitted) return;
    setSubmitted(true);
    setUserAnswers((prev) => [...prev, selectedOpt]);
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      // Calculate score and finish
      const finalAnswers = [...userAnswers];
      let correctCount = 0;
      quiz.questions.forEach((q, idx) => {
        if (finalAnswers[idx] === q.answerIndex) {
          correctCount++;
        }
      });
      
      const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
      setSavingProgress(true);
      
      if (progress) {
        const updated: UserProgressData = {
          ...progress,
          quiz_scores: {
            ...(progress.quiz_scores || {}),
            [quizId]: finalScore,
          }
        };
        await saveUserProgress(updated);
      }
      
      setSavingProgress(false);
      setQuizFinished(true);
    } else {
      setSelectedOpt(null);
      setSubmitted(false);
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setSubmitted(false);
    setUserAnswers([]);
    setQuizFinished(false);
  };

  if (quizFinished) {
    // Calculate final stats
    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answerIndex) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = finalScore >= 70;

    return (
      <div style={S.root}>
        <div style={S.container}>
          <div style={S.quizCard}>
            <span style={{ fontSize: "3.5rem", display: "block", marginBottom: 12 }}>
              {passed ? "🏆" : "📝"}
            </span>
            <h2 style={S.finishTitle}>
              {passed ? "Quiz Completed Successfully!" : "Quiz Completed"}
            </h2>
            <p style={{ color: "rgba(200,245,200,0.6)", fontSize: "0.9rem", margin: "8px 0 24px" }}>
              {passed ? "Fantastic job! You passed the journey milestone." : "Keep practicing to improve your score!"}
            </p>

            {/* Score Ring */}
            <div style={{ ...S.scoreRing, borderColor: passed ? "#39FF14" : "#E24B4A" }}>
              <span style={{ ...S.scoreNum, color: passed ? "#39FF14" : "#E24B4A" }}>
                {finalScore}%
              </span>
              <span style={S.scoreLabel}>Final Score</span>
            </div>

            <p style={{ color: "rgba(200,245,200,0.5)", fontSize: "0.82rem", margin: "20px 0 32px" }}>
              You answered <strong>{correctCount}</strong> out of <strong>{quiz.questions.length}</strong> questions correctly.
            </p>

            <div style={S.btnRow}>
              <button onClick={handleReset} style={S.resetBtn}>
                ↻ Retake Quiz
              </button>
              <Link href={`/learning-paths/${journey.id}`} style={{ ...S.primaryBtn, background: journey.color }}>
                Go to Journey Overview
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.root}>
      {/* Background glow matching the journey theme */}
      <div style={{ ...S.glowBg, background: `radial-gradient(circle, ${journey.color}05 0%, transparent 70%)` }} />

      <div style={S.container}>
        <Link href={`/learning-paths/${journey.id}`} style={S.breadcrumb}>
          ← Quit Quiz
        </Link>

        {/* Progress Tracker */}
        <div style={S.progressTracker}>
          <span style={S.trackerText}>
            Question <strong>{currentIdx + 1}</strong> of {quiz.questions.length}
          </span>
          <div style={S.trackerBarTrack}>
            <div 
              style={{ 
                ...S.trackerBarFill, 
                width: `${((currentIdx + 1) / quiz.questions.length) * 100}%`,
                background: journey.color
              }} 
            />
          </div>
        </div>

        {/* Question Panel */}
        <div style={S.quizCard}>
          <h3 style={S.questionText}>{question.text}</h3>

          <div style={S.optionsList}>
            {question.options.map((opt, oIdx) => {
              let borderStyle = "1px solid rgba(255,255,255,0.06)";
              let bgStyle = "rgba(10, 20, 10, 0.4)";
              let checkmark = null;

              if (submitted) {
                if (oIdx === question.answerIndex) {
                  // Correct option
                  borderStyle = "1.5px solid #39FF14";
                  bgStyle = "rgba(57, 255, 20, 0.08)";
                  checkmark = "✓";
                } else if (selectedOpt === oIdx) {
                  // User chose incorrect option
                  borderStyle = "1.5px solid #E24B4A";
                  bgStyle = "rgba(226, 75, 74, 0.08)";
                  checkmark = "✕";
                } else {
                  // Unselected options during review
                  bgStyle = "rgba(10, 20, 10, 0.25)";
                  borderStyle = "1px solid rgba(255,255,255,0.02)";
                }
              } else if (selectedOpt === oIdx) {
                // User currently selecting
                borderStyle = `1.5px solid ${journey.color}`;
                bgStyle = `${journey.color}08`;
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelect(oIdx)}
                  disabled={submitted}
                  style={{ 
                    ...S.optionBtn, 
                    border: borderStyle, 
                    background: bgStyle,
                    cursor: submitted ? "default" : "pointer"
                  }}
                >
                  <div style={S.optionContent}>
                    <span style={S.optionLetter}>
                      {String.fromCharCode(65 + oIdx)}.
                    </span>
                    <span style={{ textAlign: "left" }}>{opt}</span>
                  </div>
                  {checkmark && (
                    <span style={{ 
                      fontWeight: 800, 
                      color: checkmark === "✓" ? "#39FF14" : "#E24B4A" 
                    }}>
                      {checkmark}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Explanation */}
          {submitted && (
            <div style={S.explanationCard}>
              <h4 style={S.explanationTitle}>
                {selectedOpt === question.answerIndex ? "✨ Correct!" : "❌ Incorrect"}
              </h4>
              <p style={S.explanationText}>{question.explanation}</p>
            </div>
          )}

          {/* Navigation Action */}
          <div style={S.actionsRow}>
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOpt === null}
                style={{ 
                  ...S.submitBtn, 
                  background: selectedOpt !== null ? journey.color : "rgba(255,255,255,0.04)",
                  color: selectedOpt !== null ? "#000" : "rgba(255,255,255,0.2)",
                  cursor: selectedOpt !== null ? "pointer" : "not-allowed"
                }}
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={savingProgress}
                style={{ 
                  ...S.submitBtn, 
                  background: journey.color, 
                  color: "#000",
                  cursor: "pointer"
                }}
              >
                {savingProgress ? "Saving..." : isLastQuestion ? "Finish Quiz ➔" : "Next Question ➔"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  root: {
    background: "#050A05",
    minHeight: "100vh",
    color: "#C8F5C8",
    paddingTop: 80,
    position: "relative",
    overflow: "hidden",
  },
  glowBg: {
    position: "absolute",
    top: -100,
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(900px, 90vw)",
    height: 450,
    borderRadius: "50%",
    pointerEvents: "none",
  },
  container: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "0 24px 80px",
    position: "relative",
    zIndex: 1,
  },
  breadcrumb: {
    display: "inline-block",
    color: "rgba(200,245,200,0.5)",
    fontSize: "0.85rem",
    marginBottom: 24,
  },
  progressTracker: {
    marginBottom: 28,
  },
  trackerText: {
    fontSize: "0.78rem",
    color: "rgba(200,245,200,0.5)",
    display: "block",
    marginBottom: 8,
  },
  trackerBarTrack: {
    height: 4,
    borderRadius: 2,
    background: "rgba(255,255,255,0.05)",
    width: "100%",
  },
  trackerBarFill: {
    height: "100%",
    borderRadius: 2,
    transition: "width 0.3s ease",
  },
  quizCard: {
    background: "rgba(10, 20, 10, 0.45)",
    border: "1px solid rgba(255,255,255,0.03)",
    borderRadius: 20,
    padding: "36px 32px",
    backdropFilter: "blur(12px)",
    textAlign: "center",
  },
  questionText: {
    fontSize: "1.2rem",
    fontWeight: 750,
    color: "#fff",
    lineHeight: 1.5,
    margin: "0 0 32px",
    textAlign: "left",
  },
  optionsList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 32,
  },
  optionBtn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "16px 20px",
    borderRadius: 12,
    fontSize: "0.9rem",
    color: "#C8F5C8",
    fontFamily: "inherit",
    textAlign: "left",
    transition: "all 0.2s ease",
  },
  optionContent: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  optionLetter: {
    fontWeight: 700,
    color: "rgba(200,245,200,0.4)",
  },
  explanationCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.04)",
    borderRadius: 12,
    padding: 20,
    textAlign: "left",
    marginBottom: 32,
    animation: "microFadeUp 0.3s ease-out",
  },
  explanationTitle: {
    fontSize: "0.9rem",
    fontWeight: 700,
    margin: "0 0 6px",
  },
  explanationText: {
    fontSize: "0.82rem",
    color: "rgba(200,245,200,0.6)",
    lineHeight: 1.55,
    margin: 0,
  },
  actionsRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  submitBtn: {
    padding: "12px 28px",
    borderRadius: 10,
    fontSize: "0.85rem",
    fontWeight: 750,
    border: "none",
    transition: "all 0.2s",
  },
  finishTitle: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#fff",
    margin: 0,
  },
  scoreRing: {
    width: 130,
    height: 130,
    borderRadius: "50%",
    border: "4px solid",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.01)",
    boxShadow: "0 0 30px rgba(0,0,0,0.3)",
  },
  scoreNum: {
    fontSize: "2.2rem",
    fontWeight: 900,
    lineHeight: 1,
  },
  scoreLabel: {
    fontSize: "0.58rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "rgba(200,245,200,0.4)",
    marginTop: 4,
  },
  btnRow: {
    display: "flex",
    gap: 14,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  resetBtn: {
    padding: "12px 24px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(200,245,200,0.7)",
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  primaryBtn: {
    padding: "12px 24px",
    borderRadius: 10,
    color: "#000",
    fontSize: "0.82rem",
    fontWeight: 750,
    textDecoration: "none",
    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#050A05",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#050A05",
    padding: 24,
    textAlign: "center",
  },
  backBtn: {
    marginTop: 20,
    padding: "10px 20px",
    borderRadius: 8,
    background: "#39FF14",
    color: "#000",
    fontWeight: 600,
    fontSize: "0.85rem",
  }
};
