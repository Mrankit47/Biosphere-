"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { BackLink } from "@/components/ds";
import { getJourneyById, getLessonById } from "@/data/learningPaths";
import { getUserProgress, saveUserProgress, getOrCreateUserId, UserProgressData } from "@/utils/supabase";

// Learning Engine Imports
import { getEngineLessonById, getNextLesson, getPrevLesson, getProgramById, getModuleById } from "@/data/learningEngine";
import {
  isLessonComplete,
  markLessonComplete,
  isBookmarked,
  toggleBookmark,
  recordRevision,
  recordAiInteraction,
  recordSimulationCompletion,
} from "@/utils/progressEngine";
import { LessonHeader, FlashcardViewer, RevisionNotes } from "@/components/ui/learning";

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const pathId = params?.pathId as string;
  const lessonId = params?.lessonId as string;

  const journey = getJourneyById(pathId);
  const lesson = journey ? getLessonById(journey, lessonId) : undefined;

  // Retrieve advanced metadata from learningEngine
  const engineData = useMemo(() => getEngineLessonById(lessonId), [lessonId]);
  const nextLesson = useMemo(() => getNextLesson(lessonId), [lessonId]);
  const prevLesson = useMemo(() => getPrevLesson(lessonId), [lessonId]);

  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<UserProgressData | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Live page states synced with progressEngine
  const [completedState, setCompletedState] = useState(false);
  const [bookmarkedState, setBookmarkedState] = useState(false);
  const [aiQuery, setAiQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    setCompletedState(isLessonComplete(lessonId));
    setBookmarkedState(isBookmarked(lessonId));

    const userId = getOrCreateUserId();
    getUserProgress(userId)
      .then((data) => {
        setProgress(data);
        setLoading(false);

        // Auto-update last active lesson in database
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

  const handleBookmarkToggle = useCallback(() => {
    const nextVal = toggleBookmark(lessonId);
    setBookmarkedState(nextVal);
  }, [lessonId]);

  const handleCompleteToggle = useCallback(async () => {
    if (saving) return;
    setSaving(true);

    // Save to local engine
    markLessonComplete(lessonId, 300); // assume 5 min study time
    setCompletedState(true);

    // Find next URL
    let nextUrl = `/learning-paths/${pathId}`;
    if (nextLesson) {
      nextUrl = `/learning-paths/${pathId}/lessons/${nextLesson.id}`;
    } else if (journey?.quizzes && journey.quizzes.length > 0) {
      nextUrl = `/learning-paths/${pathId}/quizzes/${journey.quizzes[0].id}`;
    }

    // Sync with Supabase progress
    if (progress) {
      const completedList = Array.from(new Set([...(progress.completed_lessons || []), lessonId]));
      const updated: UserProgressData = {
        ...progress,
        completed_lessons: completedList,
        last_active_path: pathId,
        last_active_lesson: nextLesson ? nextLesson.id : null,
      };
      await saveUserProgress(updated);
    }

    setSaving(false);
    router.push(nextUrl);
  }, [lessonId, nextLesson, pathId, journey, progress, router, saving]);

  const handleAiSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    recordAiInteraction();
    const query = encodeURIComponent(aiQuery);
    router.push(`/tutor?q=${query}`);
  }, [aiQuery, router]);

  const handleLaunch3D = useCallback(() => {
    recordSimulationCompletion(lessonId);
  }, [lessonId]);

  if (!journey || !lesson) {
    return (
      <div className="err-container">
        <h1>Lesson Not Found</h1>
        <p>This lesson ID does not exist in the Biosphere curriculum.</p>
        <Link href="/learning-paths" className="back-btn">
          Back to Dashboard
        </Link>
        <style>{`
          .err-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: var(--ds-bg-primary);
            color: #fff;
            padding: 24px;
            text-align: center;
          }
          .back-btn {
            margin-top: 20px;
            padding: 10px 20px;
            border-radius: 8px;
            background: var(--ds-accent);
            color: #000;
            font-weight: 700;
            text-decoration: none;
          }
        `}</style>
      </div>
    );
  }

  if (!mounted || loading) {
    return (
      <div className="loader-container">
        <div className="pulse-dot" />
        <span>Loading Lesson Content...</span>
        <style>{`
          .loader-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: var(--ds-bg-primary);
            color: var(--ds-fg-muted);
            gap: 16px;
          }
          .pulse-dot {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: var(--ds-accent);
            animation: pulse 1.5s infinite ease-in-out;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(0.6); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // Find index of current lesson in journey
  const currentIdx = journey.lessons.findIndex((l) => l.id === lessonId);
  const totalLessons = journey.lessons.length;

  return (
    <div className="lesson-page-root">
      {/* Background glow matching the journey theme */}
      <div
        className="lesson-glow-bg"
        style={{ background: `radial-gradient(circle, ${journey.color}08 0%, transparent 70%)` }}
      />

      <div className="lesson-container">
        {/* Navigation & Header */}
        <LessonHeader
          lesson={{
            id: lesson.id,
            title: lesson.title,
            estimatedMinutes: parseInt(lesson.readingTime) || 8,
            difficulty: engineData?.lesson.difficulty || "intermediate",
            prerequisites: engineData?.lesson.prerequisites || [],
            objectives: engineData?.lesson.objectives || [
              { text: lesson.summary, icon: "📖" },
              { text: "Interact with relevant modules in 3D WebGL format", icon: "🎮" },
            ],
            exploreUrl: lesson.exploreUrl,
            exploreLabel: lesson.exploreButtonText,
            askAiPrompt: engineData?.lesson.askAiPrompt || `Explain ${lesson.title} in simple terms`,
            flashcards: engineData?.lesson.flashcards || [],
            revision: engineData?.lesson.revision || {
              importantPoints: [lesson.summary],
              keyTerms: [],
              summary: lesson.summary,
            },
            relatedTopics: engineData?.lesson.relatedTopics || [],
            references: engineData?.lesson.references || [],
          }}
          program={getProgramById(pathId) || {
            id: pathId,
            title: journey.title,
            description: journey.description,
            icon: journey.icon,
            color: journey.color,
            difficulty: "intermediate",
            estimatedHours: 8,
            prerequisites: [],
            exploreUrl: journey.exploreUrl,
            modules: [],
            completionRules: "",
          }}
          module={getModuleById(pathId, engineData?.module.id || "") || {
            id: "default-mod",
            title: journey.title,
            description: journey.description,
            icon: journey.icon,
            lessons: [],
          }}
          currentIndex={currentIdx >= 0 ? currentIdx : 0}
          totalLessons={totalLessons}
          isComplete={completedState}
          isBookmarked={bookmarkedState}
          onBookmark={handleBookmarkToggle}
          onComplete={handleCompleteToggle}
        />

        {/* Content Columns */}
        <div className="lesson-grid-layout">
          {/* Main Reading / Left Column */}
          <div className="lesson-main-col">
            <article className="lesson-article-card">
              <div
                className="lesson-article-body"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </article>

            {/* Quick Revision & Key Terms */}
            {engineData?.lesson.revision && (
              <div className="lesson-addon-section">
                <RevisionNotes
                  revision={engineData.lesson.revision}
                  lessonTitle={lesson.title}
                  isBookmarked={bookmarkedState}
                  onBookmark={handleBookmarkToggle}
                  onRevisionComplete={() => recordRevision(lessonId)}
                />
              </div>
            )}

            {/* Flashcard Deck */}
            {engineData?.lesson.flashcards && engineData.lesson.flashcards.length > 0 && (
              <div className="lesson-addon-section">
                <FlashcardViewer
                  flashcards={engineData.lesson.flashcards}
                  title={`${lesson.title} Flashcards`}
                />
              </div>
            )}

            {/* Back / Next Lesson Nav Footer */}
            <div className="lesson-footer-nav">
              {prevLesson ? (
                <Link
                  href={`/learning-paths/${pathId}/lessons/${prevLesson.id}`}
                  className="lesson-nav-btn prev"
                >
                  ← Previous: {prevLesson.title}
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/learning-paths/${pathId}/lessons/${nextLesson.id}`}
                  className="lesson-nav-btn next"
                >
                  Next: {nextLesson.title} →
                </Link>
              ) : (
                journey.quizzes.length > 0 && (
                  <Link
                    href={`/learning-paths/${pathId}/quizzes/${journey.quizzes[0].id}`}
                    className="lesson-nav-btn next quiz-btn"
                  >
                    Take Topic Quiz →
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Right Column / Sidebar */}
          <aside className="lesson-sidebar-col">
            {/* 3D Explorer Launcher */}
            <div className="sidebar-premium-card 3d-card">
              <div className="sp-card-hdr">
                <span className="sp-card-icon">🎮</span>
                <h4 className="sp-card-title">3D WEBGL EXPLORER</h4>
              </div>
              <p className="sp-card-desc">
                Interact with high-fidelity structures and molecular assemblies directly in Biosphere's 3D sandbox.
              </p>
              <Link
                href={lesson.exploreUrl}
                target="_blank"
                onClick={handleLaunch3D}
                className="sp-launch-btn"
                style={{ borderColor: journey.color, color: journey.color }}
              >
                {lesson.exploreButtonText}
              </Link>
            </div>

            {/* AI Assistant Prompter */}
            <div className="sidebar-premium-card ai-card">
              <div className="sp-card-hdr">
                <span className="sp-card-icon">🤖</span>
                <h4 className="sp-card-title">ASK BIOSPHERE AI</h4>
              </div>
              <p className="sp-card-desc">
                Stuck on a concept? Query the AI biology tutor regarding this lesson's concepts.
              </p>
              <form onSubmit={handleAiSubmit} className="sp-ai-form">
                <textarea
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder={engineData?.lesson.askAiPrompt || "Ask about this lesson..."}
                  className="sp-ai-textarea"
                />
                <button type="submit" className="sp-ai-submit-btn">
                  Consult AI Tutor →
                </button>
              </form>
            </div>

            {/* References & Citations */}
            {engineData?.lesson.references && engineData.lesson.references.length > 0 && (
              <div className="sidebar-ref-card">
                <h4 className="ref-card-title">📚 REFERENCES</h4>
                <ul className="ref-list">
                  {engineData.lesson.references.map((ref, idx) => (
                    <li key={idx} className="ref-item">{ref}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Topics */}
            {engineData?.lesson.relatedTopics && engineData.lesson.relatedTopics.length > 0 && (
              <div className="sidebar-ref-card">
                <h4 className="ref-card-title">🔗 RELATED TOPICS</h4>
                <div className="related-pills">
                  {engineData.lesson.relatedTopics.map((topic, idx) => (
                    <span key={idx} className="related-pill">{topic}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <style>{`
        .lesson-page-root {
          background: var(--ds-bg-primary);
          min-height: 100vh;
          color: var(--ds-fg);
          padding: 100px clamp(16px, 4vw, 40px) 80px;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }
        .lesson-glow-bg {
          position: absolute;
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: min(900px, 90vw);
          height: 450px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }
        .lesson-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .lesson-grid-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 28px;
          align-items: start;
        }

        .lesson-main-col {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .lesson-article-card {
          background: var(--ds-surface-overlay);
          border: 1px solid var(--ds-glass-border);
          border-radius: 16px;
          padding: 32px 36px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .lesson-article-body {
          font-size: 0.95rem;
          color: var(--ds-fg-muted);
          line-height: 1.75;
        }
        .lesson-article-body h3 {
          font-size: 1.15rem;
          color: #fff;
          margin: 24px 0 10px 0;
          font-weight: 800;
        }
        .lesson-article-body p {
          margin: 0 0 16px 0;
        }
        .lesson-article-body ul {
          padding-left: 20px;
          margin: 0 0 16px 0;
        }
        .lesson-article-body li {
          margin-bottom: 6px;
        }

        .lesson-addon-section {
          width: 100%;
        }

        .lesson-footer-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid var(--ds-glass-border);
          gap: 16px;
        }
        .lesson-nav-btn {
          padding: 10px 18px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          color: var(--ds-fg-muted);
          font-size: 0.78rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }
        .lesson-nav-btn:hover {
          border-color: var(--ds-border-accent);
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
        }
        .lesson-nav-btn.quiz-btn {
          color: var(--ds-accent);
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
        }

        /* Sidebar Column */
        .lesson-sidebar-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .sidebar-premium-card {
          border-radius: 16px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          padding: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .sp-card-hdr {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .sp-card-icon { font-size: 1.2rem; }
        .sp-card-title {
          font-size: 0.72rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: 0.1em;
          margin: 0;
        }
        .sp-card-desc {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          line-height: 1.5;
          margin: 0 0 16px 0;
        }
        .sp-launch-btn {
          display: block;
          width: 100%;
          padding: 11px;
          border-radius: 8px;
          border: 1.5px solid;
          background: transparent;
          font-size: 0.78rem;
          font-weight: 800;
          text-align: center;
          text-decoration: none;
          transition: all 0.2s;
        }
        .sp-launch-btn:hover {
          background: rgba(255,255,255,0.02);
          transform: translateY(-1px);
        }

        .sp-ai-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sp-ai-textarea {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0,0,0,0.3);
          color: #fff;
          font-size: 0.75rem;
          font-family: inherit;
          resize: none;
          min-height: 54px;
          outline: none;
        }
        .sp-ai-textarea:focus {
          border-color: var(--ds-border-accent);
        }
        .sp-ai-submit-btn {
          padding: 8px;
          border-radius: 8px;
          border: 1px solid var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          font-size: 0.72rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .sp-ai-submit-btn:hover {
          background: var(--ds-accent-subtle);
        }

        .sidebar-ref-card {
          border-radius: 12px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0,0,0,0.12);
          padding: 16px;
        }
        .ref-card-title {
          font-size: 0.58rem;
          font-weight: 900;
          color: var(--ds-fg-muted);
          letter-spacing: 0.1em;
          margin: 0 0 10px 0;
        }
        .ref-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ref-item {
          font-size: 0.65rem;
          color: var(--ds-fg-subtle);
          line-height: 1.4;
        }
        .related-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .related-pill {
          font-size: 0.58rem;
          font-weight: 700;
          color: var(--ds-fg-muted);
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--ds-glass-border);
          padding: 2px 8px;
          border-radius: 100px;
        }

        @media (max-width: 900px) {
          .lesson-grid-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
