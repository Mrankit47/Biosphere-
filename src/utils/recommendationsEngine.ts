// =====================================================
// Biosphere Recommendations Engine
// Intelligent learning suggestions based on progress
// =====================================================

import { PROGRAMS, getAllLessonsFlat, getEngineLessonById, type EngineLesson, type Program } from "@/data/learningEngine";
import {
  getFullProgress,
  isLessonComplete,
  getProgramCompletionPercent,
  getAverageQuizScore,
  getLastActiveLessonId,
} from "@/utils/progressEngine";

// ─── Types ───────────────────────────────────────────

export interface Recommendation {
  type: "continue" | "recommended" | "weak" | "review" | "simulation" | "quiz" | "ai" | "recent";
  title: string;
  description: string;
  icon: string;
  actionUrl: string;
  actionLabel: string;
  priority: number; // lower = higher priority
  lessonId?: string;
  programId?: string;
}

// ─── Main Recommendation Generator ───────────────────

export function getRecommendations(maxCount: number = 8): Recommendation[] {
  const all: Recommendation[] = [];

  all.push(...getContinueLearning());
  all.push(...getRecommendedLessons());
  all.push(...getWeakTopicRecommendations());
  all.push(...getReviewRecommendations());
  all.push(...getSuggestedSimulations());
  all.push(...getSuggestedQuizzes());
  all.push(...getAiRecommendedTopics());
  all.push(...getRecentlyViewed());

  // Sort by priority, then deduplicate by title
  all.sort((a, b) => a.priority - b.priority);
  const seen = new Set<string>();
  const deduped: Recommendation[] = [];
  for (const rec of all) {
    if (!seen.has(rec.title)) {
      seen.add(rec.title);
      deduped.push(rec);
    }
  }

  return deduped.slice(0, maxCount);
}

// ─── Continue Learning ───────────────────────────────

function getContinueLearning(): Recommendation[] {
  const lastLessonId = getLastActiveLessonId();
  if (!lastLessonId) return [];

  const found = getEngineLessonById(lastLessonId);
  if (!found) return [];

  const { program, lesson } = found;

  // If last lesson is complete, suggest the next one
  if (isLessonComplete(lastLessonId)) {
    const allFlat = getAllLessonsFlat();
    const idx = allFlat.findIndex((e) => e.lesson.id === lastLessonId);
    if (idx >= 0 && idx < allFlat.length - 1) {
      const next = allFlat[idx + 1];
      return [{
        type: "continue",
        title: `Continue: ${next.lesson.title}`,
        description: `Next lesson in ${program.title}`,
        icon: "▶️",
        actionUrl: next.lesson.exploreUrl,
        actionLabel: "Continue Learning",
        priority: 1,
        lessonId: next.lesson.id,
        programId: next.programId,
      }];
    }
  }

  // If not complete, suggest resuming
  return [{
    type: "continue",
    title: `Resume: ${lesson.title}`,
    description: `Continue where you left off in ${program.title}`,
    icon: "▶️",
    actionUrl: lesson.exploreUrl,
    actionLabel: "Resume Lesson",
    priority: 1,
    lessonId: lesson.id,
    programId: program.id,
  }];
}

// ─── Recommended Lessons ─────────────────────────────

function getRecommendedLessons(): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const allFlat = getAllLessonsFlat();

  // Find incomplete lessons with met prerequisites
  for (const entry of allFlat) {
    if (isLessonComplete(entry.lesson.id)) continue;

    const prereqsMet = entry.lesson.prerequisites.every((pid) => isLessonComplete(pid));
    if (!prereqsMet) continue;

    const program = PROGRAMS.find((p) => p.id === entry.programId);
    if (!program) continue;

    recommendations.push({
      type: "recommended",
      title: entry.lesson.title,
      description: `${program.title} · ${entry.lesson.estimatedMinutes} min`,
      icon: program.icon,
      actionUrl: entry.lesson.exploreUrl,
      actionLabel: "Start Lesson",
      priority: 3,
      lessonId: entry.lesson.id,
      programId: entry.programId,
    });

    if (recommendations.length >= 3) break;
  }

  return recommendations;
}

// ─── Weak Topic Recommendations ──────────────────────

function getWeakTopicRecommendations(): Recommendation[] {
  const progress = getFullProgress();
  const weakQuizzes = progress.quizResults.filter((r) => r.score < 60);
  const recommendations: Recommendation[] = [];

  for (const wq of weakQuizzes) {
    for (const program of PROGRAMS) {
      for (const mod of program.modules) {
        if (mod.quizId === wq.quizId) {
          // Find an incomplete lesson in this module to review
          const incomplete = mod.lessons.find((l) => !isLessonComplete(l.id));
          const target = incomplete || mod.lessons[0];

          recommendations.push({
            type: "weak",
            title: `Review: ${mod.title}`,
            description: `Score was ${wq.score}% — revisit this topic`,
            icon: "⚠️",
            actionUrl: target.exploreUrl,
            actionLabel: "Review Topic",
            priority: 2,
            lessonId: target.id,
            programId: program.id,
          });
        }
      }
    }
  }

  return recommendations.slice(0, 2);
}

// ─── Review Recommendations ──────────────────────────

function getReviewRecommendations(): Recommendation[] {
  const progress = getFullProgress();
  const recommendations: Recommendation[] = [];
  const now = Date.now();
  const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

  // Find completed lessons that haven't been revised recently
  for (const cl of progress.completedLessons) {
    const lastRevision = progress.revisionHistory
      .filter((r) => r.lessonId === cl.lessonId)
      .sort((a, b) => new Date(b.revisedAt).getTime() - new Date(a.revisedAt).getTime())[0];

    const timeSinceAction = lastRevision
      ? now - new Date(lastRevision.revisedAt).getTime()
      : now - new Date(cl.completedAt).getTime();

    if (timeSinceAction > THREE_DAYS) {
      const found = getEngineLessonById(cl.lessonId);
      if (!found) continue;

      recommendations.push({
        type: "review",
        title: `Review: ${found.lesson.title}`,
        description: "Spaced repetition — revisit for better retention",
        icon: "🔄",
        actionUrl: found.lesson.exploreUrl,
        actionLabel: "Review Again",
        priority: 5,
        lessonId: cl.lessonId,
        programId: found.program.id,
      });
    }
  }

  return recommendations.slice(0, 2);
}

// ─── Suggested Simulations ───────────────────────────

function getSuggestedSimulations(): Recommendation[] {
  const progress = getFullProgress();
  const sims = [
    { id: "ecosystem-sim", title: "Ecosystem Simulator", url: "/ecosystem-simulator", icon: "🌍", programId: "ecology" },
    { id: "process-sim", title: "Process Simulations", url: "/process-simulations", icon: "⚗️", programId: "cell-biology" },
  ];

  return sims
    .filter((s) => !progress.simulationsCompleted.includes(s.id))
    .map((s) => ({
      type: "simulation" as const,
      title: s.title,
      description: "Interactive simulation to deepen understanding",
      icon: s.icon,
      actionUrl: s.url,
      actionLabel: "Launch Simulation",
      priority: 6,
      programId: s.programId,
    }));
}

// ─── Suggested Quizzes ───────────────────────────────

function getSuggestedQuizzes(): Recommendation[] {
  const progress = getFullProgress();
  const recommendations: Recommendation[] = [];

  for (const program of PROGRAMS) {
    const completion = getProgramCompletionPercent(program.id);
    if (completion < 50) continue; // Only suggest quizzes for programs with progress

    for (const mod of program.modules) {
      if (!mod.quizId) continue;
      const attempted = progress.quizResults.some((r) => r.quizId === mod.quizId);
      if (!attempted) {
        recommendations.push({
          type: "quiz",
          title: `Quiz: ${mod.title}`,
          description: `Test your knowledge of ${program.title}`,
          icon: "📝",
          actionUrl: `/learning-paths/${program.id}/quizzes/${mod.quizId}`,
          actionLabel: "Take Quiz",
          priority: 4,
          programId: program.id,
        });
      }
    }
  }

  return recommendations.slice(0, 2);
}

// ─── AI Recommended Topics ───────────────────────────

function getAiRecommendedTopics(): Recommendation[] {
  // Recommend programs with lowest completion that have prerequisites met
  const scored: { program: Program; completion: number }[] = [];

  for (const program of PROGRAMS) {
    const completion = getProgramCompletionPercent(program.id);
    if (completion === 100) continue;

    // Check if prerequisites are complete
    const prereqsMet = program.prerequisites.every((pid) => getProgramCompletionPercent(pid) >= 50);
    if (!prereqsMet && program.prerequisites.length > 0) continue;

    scored.push({ program, completion });
  }

  scored.sort((a, b) => a.completion - b.completion);

  return scored.slice(0, 1).map((s) => ({
    type: "ai" as const,
    title: `Explore: ${s.program.title}`,
    description: `AI suggests starting this program (${s.completion}% complete)`,
    icon: "🤖",
    actionUrl: s.program.exploreUrl,
    actionLabel: "Explore Topic",
    priority: 7,
    programId: s.program.id,
  }));
}

// ─── Recently Viewed ─────────────────────────────────

function getRecentlyViewed(): Recommendation[] {
  const progress = getFullProgress();
  const recommendations: Recommendation[] = [];

  // Get last 3 completed lessons that are different from continue learning
  const lastLessonId = getLastActiveLessonId();
  const recent = progress.completedLessons
    .filter((c) => c.lessonId !== lastLessonId)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 2);

  for (const cl of recent) {
    const found = getEngineLessonById(cl.lessonId);
    if (!found) continue;

    recommendations.push({
      type: "recent",
      title: found.lesson.title,
      description: `Completed in ${found.program.title}`,
      icon: "🕐",
      actionUrl: found.lesson.exploreUrl,
      actionLabel: "Revisit",
      priority: 8,
      lessonId: cl.lessonId,
      programId: found.program.id,
    });
  }

  return recommendations;
}

// ─── Export typed recommendation list by type ─────────

export function getRecommendationsByType(type: Recommendation["type"]): Recommendation[] {
  return getRecommendations(20).filter((r) => r.type === type);
}
