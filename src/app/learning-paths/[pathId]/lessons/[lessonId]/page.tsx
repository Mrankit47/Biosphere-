"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BackLink } from "@/components/ds";
import { getJourneyById, getLessonById } from "@/data/learningPaths";
import { getUserProgress, saveUserProgress, getOrCreateUserId, UserProgressData } from "@/utils/supabase";

interface LessonPageProps {
  params: Promise<{ pathId: string; lessonId: string }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const { pathId, lessonId } = use(params);
  const router = useRouter();

  const journey = getJourneyById(pathId);
  const lesson = journey ? getLessonById(journey, lessonId) : undefined;

  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<UserProgressData | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const userId = getOrCreateUserId();
    getUserProgress(userId)
      .then((data) => {
        setProgress(data);
        setLoading(false);
        
        // Auto-update last active lesson
        const updated = {
          ...data,
          last_active_path: pathId,
          last_active_lesson: lessonId,
        };
        saveUserProgress(updated);
      })
      .catch((err) => {
        console.error("Failed to load progress:", err);
        setLoading(false);
      });
  }, [pathId, lessonId]);

  if (!journey || !lesson) {
    return (
      <div style={S.errorContainer}>
        <h1 style={{ color: "#E24B4A", fontSize: "1.5rem" }}>Lesson Not Found</h1>
        <p style={{ color: "rgba(200,245,200,0.5)", marginTop: 8 }}>This lesson ID does not exist.</p>
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
        <span style={{ color: "rgba(200,245,200,0.5)", marginTop: 12 }}>Loading lesson...</span>
      </div>
    );
  }

  const isCompleted = progress?.completed_lessons?.includes(lessonId) || false;

  const handleComplete = async () => {
    if (!progress || saving) return;
    setSaving(true);

    const completed = Array.from(new Set([...(progress.completed_lessons || []), lessonId]));
    
    // Find next module
    const currentIdx = journey.lessons.findIndex(l => l.id === lessonId);
    let nextUrl = `/learning-paths/${journey.id}`;
    let nextActiveLesson: string | null = lessonId;

    if (currentIdx !== -1 && currentIdx + 1 < journey.lessons.length) {
      const nextLesson = journey.lessons[currentIdx + 1];
      nextActiveLesson = nextLesson.id;
      nextUrl = `/learning-paths/${journey.id}/lessons/${nextLesson.id}`;
    } else if (journey.quizzes.length > 0) {
      // Direct them to the first quiz of the journey once they complete all lessons
      nextUrl = `/learning-paths/${journey.id}/quizzes/${journey.quizzes[0].id}`;
      nextActiveLesson = null; // No next active lesson as we complete the track
    }

    const updated: UserProgressData = {
      ...progress,
      completed_lessons: completed,
      last_active_path: journey.id,
      last_active_lesson: nextActiveLesson,
    };

    await saveUserProgress(updated);
    setSaving(false);
    router.push(nextUrl);
  };

  return (
    <div style={S.root}>
      {/* Background glow matching the journey theme */}
      <div style={{ ...S.glowBg, background: `radial-gradient(circle, ${journey.color}05 0%, transparent 70%)` }} />

      <div style={S.container}>
        {/* Navigation header */}
        <div style={S.navRow}>
          <BackLink href={`/learning-paths/${journey.id}`} label={journey.title} />
          <span style={S.readingTime}>⏱️ {lesson.readingTime}</span>
        </div>

        {/* Content Layout */}
        <div style={S.layout}>
          {/* Main Reading Panel */}
          <article style={S.article}>
            <header style={S.articleHeader}>
              <h1 style={S.title}>{lesson.title}</h1>
              <div style={{ ...S.accentLine, background: journey.color }} />
            </header>
            
            <div 
              style={S.articleBody} 
              dangerouslySetInnerHTML={{ __html: lesson.content }} 
            />

            {/* Complete Lesson Button */}
            <div style={S.footerRow}>
              <button
                onClick={handleComplete}
                disabled={saving}
                style={{ ...S.completeBtn, background: journey.color, boxShadow: `0 0 25px ${journey.color}35` }}
              >
                {saving ? "Saving..." : isCompleted ? "Next Topic →" : "✓ Mark Complete & Continue"}
              </button>
            </div>
          </article>

          {/* Interactive 3D Callout Sidebar */}
          <aside style={S.sidebar}>
            <div style={{ ...S.playgroundCard, borderColor: `${journey.color}15` }}>
              <div style={S.cardHeader}>
                <span style={{ fontSize: "1.4rem" }}>🎮</span>
                <h3 style={S.playgroundTitle}>3D EXPLORER</h3>
              </div>
              <p style={S.playgroundDesc}>
                Take what you've learned and explore it in real-time inside Biosphere's premium interactive WebGL sandbox.
              </p>
              <Link href={lesson.exploreUrl} target="_blank" style={{ ...S.playgroundBtn, borderColor: journey.color, color: journey.color }}>
                {lesson.exploreButtonText}
              </Link>
            </div>
          </aside>
        </div>
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
    maxWidth: 1000,
    margin: "0 auto",
    padding: "0 24px 80px",
    position: "relative",
    zIndex: 1,
  },
  navRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  breadcrumb: {
    color: "var(--ds-fg-subtle)",
    fontSize: "0.85rem",
    transition: "color 0.2s",
  },
  readingTime: {
    fontSize: "0.8rem",
    color: "var(--ds-fg-subtle)",
    background: "var(--ds-surface-subtle)",
    padding: "4px 10px",
    borderRadius: 6,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 280px",
    gap: 32,
    alignItems: "start",
    flexWrap: "wrap",
  },
  article: {
    background: "var(--ds-surface-overlay)",
    border: "1px solid var(--ds-border-muted)",
    borderRadius: 20,
    padding: "36px 40px",
    backdropFilter: "blur(12px)",
  },
  articleHeader: {
    marginBottom: 28,
  },
  title: {
    fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
    fontWeight: 800,
    color: "#fff",
    margin: "0 0 12px",
    lineHeight: 1.3,
  },
  accentLine: {
    width: 60,
    height: 3,
    borderRadius: 2,
  },
  articleBody: {
    fontSize: "0.95rem",
    color: "var(--ds-fg-muted)",
    lineHeight: 1.75,
    fontFamily: "inherit",
  },
  footerRow: {
    marginTop: 40,
    paddingTop: 24,
    borderTop: "1px solid var(--ds-border-muted)",
    display: "flex",
    justifyContent: "flex-end",
  },
  completeBtn: {
    padding: "14px 28px",
    borderRadius: 12,
    color: "#000",
    fontWeight: 750,
    fontSize: "0.9rem",
    cursor: "pointer",
    border: "none",
    transition: "transform 0.2s",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
  },
  playgroundCard: {
    background: "var(--ds-surface-overlay)",
    border: "1px solid var(--ds-border-muted)",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  playgroundTitle: {
    fontSize: "0.85rem",
    fontWeight: 800,
    letterSpacing: "0.15em",
    color: "#fff",
    margin: 0,
  },
  playgroundDesc: {
    fontSize: "0.78rem",
    color: "var(--ds-fg-muted)",
    lineHeight: 1.5,
    margin: "0 0 20px",
  },
  playgroundBtn: {
    display: "block",
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1.5px solid",
    background: "transparent",
    fontSize: "0.8rem",
    fontWeight: 700,
    textAlign: "center",
    transition: "all 0.25s ease",
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
