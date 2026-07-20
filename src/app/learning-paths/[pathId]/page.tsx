"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BackLink } from "@/components/ds";
import { BioIcon } from "@/components/ui/navigation/BioIcon";
import { getJourneyById } from "@/data/learningPaths";
import { getUserProgress, getOrCreateUserId, UserProgressData } from "@/utils/supabase";

export default function JourneyPage() {
  const params = useParams();
  const pathId = params?.pathId as string;
  const journey = getJourneyById(pathId);

  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<UserProgressData | null>(null);
  const [loading, setLoading] = useState(true);

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
  }, [pathId]);

  if (!journey) {
    return (
      <div style={S.errorContainer}>
        <h1 style={{ color: "#E24B4A", fontSize: "1.5rem" }}>Journey Not Found</h1>
        <p style={{ color: "rgba(200,245,200,0.5)", marginTop: 8 }}>The journey path ID "{pathId}" does not exist.</p>
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
        <span style={{ color: "rgba(200,245,200,0.5)", marginTop: 12 }}>Loading curriculum...</span>
      </div>
    );
  }

  // Calculate Journey Progress
  const totalLessons = journey.lessons.length;
  const totalQuizzes = journey.quizzes.length;
  const totalItems = totalLessons + totalQuizzes;

  const completedLessons = journey.lessons.filter(l => progress?.completed_lessons?.includes(l.id)).length;
  const completedQuizzes = journey.quizzes.filter(q => progress?.quiz_scores && progress.quiz_scores[q.id] !== undefined).length;
  const totalCompleted = completedLessons + completedQuizzes;

  const percent = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

  return (
    <div style={S.root}>
      {/* Glow Bg */}
      <div style={{ ...S.glowBg, background: `radial-gradient(circle, ${journey.color}07 0%, transparent 70%)` }} />

      <div style={S.container}>
        <BackLink href="/learning-paths" label="Journeys" />

        {/* Journey Hero Header */}
        <header style={{ ...S.header, borderColor: `${journey.color}15` }}>
          <div style={{ ...S.iconBox, background: `${journey.color}10`, color: journey.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BioIcon name={journey.icon} size={28} />
          </div>
          <div style={S.headerContent}>
            <h1 style={S.title}>{journey.title}</h1>
            <p style={S.desc}>{journey.description}</p>
            <div style={S.headerMeta}>
              <span style={S.metaPill}>📚 {totalLessons} Lessons</span>
              <span style={S.metaPill}>📝 {totalQuizzes} Quizzes</span>
              <Link href={journey.exploreUrl} style={{ ...S.exploreLink, color: journey.color, borderColor: `${journey.color}40` }}>
                🎮 Open 3D Playground
              </Link>
            </div>
          </div>
        </header>

        {/* Progress Summary */}
        <div style={S.progressBox}>
          <div style={S.progressStats}>
            <div>
              <span style={S.progressLabel}>JOURNEY PROGRESS</span>
              <h2 style={S.progressValue}>{totalCompleted} / {totalItems} completed</h2>
            </div>
            <span style={{ ...S.progressPercentage, color: journey.color }}>{percent}%</span>
          </div>
          <div style={S.progressBarTrack}>
            <div style={{ ...S.progressBarFill, width: `${percent}%`, background: `linear-gradient(90deg, ${journey.color}aa, ${journey.color})`, boxShadow: `0 0 10px ${journey.color}30` }} />
          </div>
        </div>

        {/* Modules Section */}
        <section style={{ marginTop: 40 }}>
          <h2 style={S.sectionTitle}>Curriculum Path</h2>

          {/* Lessons List */}
          <div style={S.moduleList}>
            <h3 style={S.subSectionTitle}>Lessons</h3>
            {journey.lessons.map((lesson, idx) => {
              const isCompleted = progress?.completed_lessons?.includes(lesson.id);
              
              return (
                <div key={lesson.id} style={{ ...S.moduleCard, borderColor: isCompleted ? `${journey.color}25` : "rgba(255,255,255,0.03)" }}>
                  <div style={S.moduleLeft}>
                    <div style={{ ...S.indexCircle, color: isCompleted ? "#000" : journey.color, background: isCompleted ? journey.color : "transparent", borderColor: journey.color }}>
                      {isCompleted ? "✓" : idx + 1}
                    </div>
                    <div>
                      <h4 style={S.moduleTitle}>{lesson.title}</h4>
                      <p style={S.moduleSummary}>{lesson.summary}</p>
                      <span style={S.moduleMeta}>⏱️ {lesson.readingTime}</span>
                    </div>
                  </div>
                  
                  <Link href={`/learning-paths/${journey.id}/lessons/${lesson.id}`} style={{ ...S.actionBtn, background: isCompleted ? "rgba(255,255,255,0.04)" : `${journey.color}15`, color: isCompleted ? "#fff" : journey.color, borderColor: isCompleted ? "rgba(255,255,255,0.1)" : `${journey.color}30` }}>
                    {isCompleted ? "Review Lesson" : "Start Lesson"}
                  </Link>
                </div>
              );
            })}

            {/* Quizzes List */}
            {journey.quizzes.length > 0 && (
              <>
                <h3 style={{ ...S.subSectionTitle, marginTop: 32 }}>Quizzes</h3>
                {journey.quizzes.map((quiz) => {
                  const score = progress?.quiz_scores?.[quiz.id];
                  const isCompleted = score !== undefined;

                  return (
                    <div key={quiz.id} style={{ ...S.moduleCard, borderColor: isCompleted ? `${journey.color}25` : "rgba(255,255,255,0.03)" }}>
                      <div style={S.moduleLeft}>
                        <div style={{ ...S.indexCircle, color: isCompleted ? "#000" : journey.color, background: isCompleted ? journey.color : "transparent", borderColor: journey.color }}>
                          {isCompleted ? "✓" : "📝"}
                        </div>
                        <div>
                          <h4 style={S.moduleTitle}>{quiz.title}</h4>
                          <p style={S.moduleSummary}>Test your understanding of the materials in this journey.</p>
                          <span style={S.moduleMeta}>❓ {quiz.questions.length} Questions</span>
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        {isCompleted && (
                          <div style={S.scoreDisplay}>
                            Score: <strong style={{ color: journey.color }}>{score}%</strong>
                          </div>
                        )}
                        <Link href={`/learning-paths/${journey.id}/quizzes/${quiz.id}`} style={{ ...S.actionBtn, background: isCompleted ? "rgba(255,255,255,0.04)" : `${journey.color}15`, color: isCompleted ? "#fff" : journey.color, borderColor: isCompleted ? "rgba(255,255,255,0.1)" : `${journey.color}30` }}>
                          {isCompleted ? "Retake Quiz" : "Take Quiz"}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  root: {
    background: "var(--ds-bg-primary)",
    minHeight: "100vh",
    color: "var(--ds-fg)",
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
    maxWidth: 900,
    margin: "0 auto",
    padding: "0 24px 80px",
    position: "relative",
    zIndex: 1,
  },
  breadcrumb: {
    display: "inline-block",
    color: "var(--ds-fg-subtle)",
    fontSize: "0.85rem",
    marginBottom: 28,
    transition: "color 0.2s",
  },
  header: {
    display: "flex",
    gap: 28,
    alignItems: "flex-start",
    borderBottom: "1px solid var(--ds-border-muted)",
    paddingBottom: 32,
    marginBottom: 32,
    flexWrap: "wrap",
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.6rem",
    flexShrink: 0,
    boxShadow: "0 0 30px rgba(0,0,0,0.2)",
  },
  headerContent: {
    flex: 1,
    minWidth: 280,
  },
  title: {
    fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
    fontWeight: 800,
    color: "#fff",
    margin: 0,
  },
  desc: {
    fontSize: "0.95rem",
    color: "var(--ds-fg-muted)",
    margin: "10px 0 20px",
    lineHeight: 1.6,
  },
  headerMeta: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  metaPill: {
    background: "var(--ds-surface-subtle)",
    border: "1px solid var(--ds-border-muted)",
    borderRadius: 999,
    padding: "6px 14px",
    fontSize: "0.78rem",
    color: "var(--ds-fg-muted)",
  },
  exploreLink: {
    borderRadius: 999,
    border: "1.5px solid",
    padding: "5px 14px",
    fontSize: "0.78rem",
    fontWeight: 600,
    background: "rgba(0,0,0,0.2)",
    textDecoration: "none",
  },
  progressBox: {
    background: "var(--ds-surface-overlay)",
    border: "1px solid var(--ds-border-muted)",
    borderRadius: 16,
    padding: 24,
    backdropFilter: "blur(8px)",
  },
  progressStats: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: "0.65rem",
    letterSpacing: "0.15em",
    color: "var(--ds-fg-subtle)",
    display: "block",
    marginBottom: 2,
    fontWeight: 600,
  },
  progressValue: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#fff",
    margin: 0,
  },
  progressPercentage: {
    fontSize: "1.6rem",
    fontWeight: 850,
    textShadow: "0 0 10px rgba(0,0,0,0.4)",
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    background: "var(--ds-surface-subtle)",
    width: "100%",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
    transition: "width 0.5s ease",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "#fff",
    marginBottom: 24,
  },
  subSectionTitle: {
    fontSize: "0.95rem",
    color: "var(--ds-fg-subtle)",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    fontWeight: 700,
    marginBottom: 16,
    borderBottom: "1px solid var(--ds-border-muted)",
    paddingBottom: 8,
  },
  moduleList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  moduleCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "var(--ds-surface-subtle)",
    border: "1px solid var(--ds-border-muted)",
    borderRadius: 16,
    padding: "20px 24px",
    flexWrap: "wrap",
    gap: 16,
  },
  moduleLeft: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    flex: 1,
    minWidth: 260,
  },
  indexCircle: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "1.5px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "0.85rem",
    flexShrink: 0,
  },
  moduleTitle: {
    fontSize: "1rem",
    fontWeight: 750,
    color: "#fff",
    margin: "0 0 2px",
  },
  moduleSummary: {
    fontSize: "0.82rem",
    color: "var(--ds-fg-muted)",
    margin: "0 0 6px",
    lineHeight: 1.4,
  },
  moduleMeta: {
    fontSize: "0.72rem",
    color: "var(--ds-fg-subtle)",
  },
  actionBtn: {
    padding: "10px 18px",
    borderRadius: 10,
    fontSize: "0.8rem",
    fontWeight: 700,
    cursor: "pointer",
    border: "1px solid",
    transition: "all 0.25s ease",
  },
  scoreDisplay: {
    fontSize: "0.82rem",
    color: "var(--ds-fg-muted)",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "var(--ds-bg-primary)",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "var(--ds-bg-primary)",
    padding: 24,
    textAlign: "center",
  },
  backBtn: {
    marginTop: 20,
    padding: "10px 20px",
    borderRadius: 8,
    background: "var(--ds-accent)",
    color: "#000",
    fontWeight: 600,
    fontSize: "0.85rem",
  }
};
