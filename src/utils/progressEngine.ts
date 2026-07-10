// =====================================================
// Biosphere Progress Engine
// Tracks completions, streaks, XP, study time, analytics
// Persists to localStorage with Supabase sync readiness
// =====================================================

import { PROGRAMS, getAllLessonsFlat } from "@/data/learningEngine";

// ─── Types ───────────────────────────────────────────

export interface LessonCompletion {
  lessonId: string;
  completedAt: string; // ISO date string
  timeSpentSeconds: number;
}

export interface QuizResult {
  quizId: string;
  score: number;         // 0-100
  totalQuestions: number;
  correctAnswers: number;
  attemptedAt: string;
}

export interface StudySession {
  date: string;           // YYYY-MM-DD
  totalSeconds: number;
}

export interface ProgressData {
  completedLessons: LessonCompletion[];
  quizResults: QuizResult[];
  studySessions: StudySession[];
  bookmarkedLessons: string[];
  favoriteFlashcards: string[];
  lastActiveLessonId: string | null;
  lastActiveAt: string | null;
  revisionHistory: { lessonId: string; revisedAt: string }[];
  simulationsCompleted: string[];
  labsCompleted: string[];
  aiInteractions: number;
  totalXp: number;
}

export interface Analytics {
  dailyStudyMinutes: number;
  weeklyStudyMinutes: number;
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  lessonsCompleted: number;
  totalLessons: number;
  programsCompleted: number;
  totalPrograms: number;
  averageQuizScore: number;
  weakTopics: string[];
  favoriteTopics: string[];
  completionPercentage: number;
  aiInteractions: number;
  flashcardsReviewed: number;
  simulationsCompleted: number;
  labsCompleted: number;
}

// ─── Storage Keys ────────────────────────────────────

const PROGRESS_KEY = "bio_learning_progress";
const SESSION_START_KEY = "bio_session_start";

// ─── Core Functions ──────────────────────────────────

function getProgress(): ProgressData {
  if (typeof window === "undefined") return getDefaultProgress();
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return getDefaultProgress();
}

function saveProgress(data: ProgressData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  } catch {}
}

function getDefaultProgress(): ProgressData {
  return {
    completedLessons: [],
    quizResults: [],
    studySessions: [],
    bookmarkedLessons: [],
    favoriteFlashcards: [],
    lastActiveLessonId: null,
    lastActiveAt: null,
    revisionHistory: [],
    simulationsCompleted: [],
    labsCompleted: [],
    aiInteractions: 0,
    totalXp: 0,
  };
}

// ─── Lesson Progress ─────────────────────────────────

export function markLessonComplete(lessonId: string, timeSpentSeconds: number = 0): void {
  const data = getProgress();
  const existing = data.completedLessons.find((c) => c.lessonId === lessonId);
  if (!existing) {
    data.completedLessons.push({
      lessonId,
      completedAt: new Date().toISOString(),
      timeSpentSeconds,
    });
    data.totalXp += 50; // 50 XP per lesson
  }
  data.lastActiveLessonId = lessonId;
  data.lastActiveAt = new Date().toISOString();
  saveProgress(data);
}

export function isLessonComplete(lessonId: string): boolean {
  return getProgress().completedLessons.some((c) => c.lessonId === lessonId);
}

export function getLessonCompletionCount(): number {
  return getProgress().completedLessons.length;
}

// ─── Module & Program Completion ─────────────────────

export function getModuleCompletionPercent(programId: string, moduleId: string): number {
  const program = PROGRAMS.find((p) => p.id === programId);
  if (!program) return 0;
  const mod = program.modules.find((m) => m.id === moduleId);
  if (!mod || mod.lessons.length === 0) return 0;

  const completed = getProgress().completedLessons;
  const done = mod.lessons.filter((l) => completed.some((c) => c.lessonId === l.id)).length;
  return Math.round((done / mod.lessons.length) * 100);
}

export function getProgramCompletionPercent(programId: string): number {
  const program = PROGRAMS.find((p) => p.id === programId);
  if (!program) return 0;

  let totalLessons = 0;
  let completedCount = 0;
  const completed = getProgress().completedLessons;

  for (const mod of program.modules) {
    totalLessons += mod.lessons.length;
    completedCount += mod.lessons.filter((l) => completed.some((c) => c.lessonId === l.id)).length;
  }

  return totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
}

export function isProgramComplete(programId: string): boolean {
  return getProgramCompletionPercent(programId) === 100;
}

export function getCompletedProgramsCount(): number {
  return PROGRAMS.filter((p) => isProgramComplete(p.id)).length;
}

// ─── Quiz Results ────────────────────────────────────

export function recordQuizResult(quizId: string, score: number, total: number, correct: number): void {
  const data = getProgress();
  data.quizResults.push({
    quizId,
    score,
    totalQuestions: total,
    correctAnswers: correct,
    attemptedAt: new Date().toISOString(),
  });
  data.totalXp += Math.round(score * 2); // Up to 200 XP for perfect quiz
  saveProgress(data);
}

export function getAverageQuizScore(): number {
  const results = getProgress().quizResults;
  if (results.length === 0) return 0;
  const total = results.reduce((sum, r) => sum + r.score, 0);
  return Math.round(total / results.length);
}

export function getWeakTopics(): string[] {
  const data = getProgress();
  const weakQuizzes = data.quizResults.filter((r) => r.score < 60);
  // Map quiz IDs back to program names
  const weakProgramIds = new Set<string>();
  for (const wq of weakQuizzes) {
    for (const program of PROGRAMS) {
      for (const mod of program.modules) {
        if (mod.quizId === wq.quizId) {
          weakProgramIds.add(program.title);
        }
      }
    }
  }
  return Array.from(weakProgramIds);
}

// ─── Study Time ──────────────────────────────────────

export function startStudySession(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_START_KEY, new Date().toISOString());
}

export function endStudySession(): void {
  if (typeof window === "undefined") return;
  const startStr = localStorage.getItem(SESSION_START_KEY);
  if (!startStr) return;

  const start = new Date(startStr).getTime();
  const elapsed = Math.round((Date.now() - start) / 1000);
  if (elapsed < 10) return; // Ignore very short sessions

  const data = getProgress();
  const today = new Date().toISOString().split("T")[0];
  const existing = data.studySessions.find((s) => s.date === today);
  if (existing) {
    existing.totalSeconds += elapsed;
  } else {
    data.studySessions.push({ date: today, totalSeconds: elapsed });
  }
  saveProgress(data);
  localStorage.removeItem(SESSION_START_KEY);
}

export function getDailyStudyMinutes(): number {
  const today = new Date().toISOString().split("T")[0];
  const session = getProgress().studySessions.find((s) => s.date === today);
  return session ? Math.round(session.totalSeconds / 60) : 0;
}

export function getWeeklyStudyMinutes(): number {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const sessions = getProgress().studySessions.filter((s) => s.date >= weekAgo);
  const totalSec = sessions.reduce((sum, s) => sum + s.totalSeconds, 0);
  return Math.round(totalSec / 60);
}

// ─── Streaks ─────────────────────────────────────────

export function getCurrentStreak(): number {
  const sessions = getProgress().studySessions
    .map((s) => s.date)
    .sort()
    .reverse();

  if (sessions.length === 0) return 0;

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  // Check if today or yesterday is in sessions
  if (sessions[0] !== today && sessions[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 0; i < sessions.length - 1; i++) {
    const current = new Date(sessions[i]).getTime();
    const prev = new Date(sessions[i + 1]).getTime();
    const diff = (current - prev) / 86400000;
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ─── Bookmarks ───────────────────────────────────────

export function toggleBookmark(lessonId: string): boolean {
  const data = getProgress();
  const idx = data.bookmarkedLessons.indexOf(lessonId);
  if (idx >= 0) {
    data.bookmarkedLessons.splice(idx, 1);
    saveProgress(data);
    return false;
  } else {
    data.bookmarkedLessons.push(lessonId);
    saveProgress(data);
    return true;
  }
}

export function isBookmarked(lessonId: string): boolean {
  return getProgress().bookmarkedLessons.includes(lessonId);
}

export function getBookmarkedLessons(): string[] {
  return getProgress().bookmarkedLessons;
}

// ─── Flashcard Favorites ─────────────────────────────

export function toggleFlashcardFavorite(flashcardId: string): boolean {
  const data = getProgress();
  const idx = data.favoriteFlashcards.indexOf(flashcardId);
  if (idx >= 0) {
    data.favoriteFlashcards.splice(idx, 1);
    saveProgress(data);
    return false;
  } else {
    data.favoriteFlashcards.push(flashcardId);
    saveProgress(data);
    return true;
  }
}

export function isFlashcardFavorite(flashcardId: string): boolean {
  return getProgress().favoriteFlashcards.includes(flashcardId);
}

// ─── Revision Tracking ──────────────────────────────

export function recordRevision(lessonId: string): void {
  const data = getProgress();
  data.revisionHistory.push({
    lessonId,
    revisedAt: new Date().toISOString(),
  });
  data.totalXp += 10;
  saveProgress(data);
}

export function getRevisionCount(lessonId: string): number {
  return getProgress().revisionHistory.filter((r) => r.lessonId === lessonId).length;
}

// ─── AI & Simulations ────────────────────────────────

export function recordAiInteraction(): void {
  const data = getProgress();
  data.aiInteractions += 1;
  data.totalXp += 5;
  saveProgress(data);
}

export function recordSimulationCompletion(simId: string): void {
  const data = getProgress();
  if (!data.simulationsCompleted.includes(simId)) {
    data.simulationsCompleted.push(simId);
    data.totalXp += 100;
  }
  saveProgress(data);
}

export function recordLabCompletion(labId: string): void {
  const data = getProgress();
  if (!data.labsCompleted.includes(labId)) {
    data.labsCompleted.push(labId);
    data.totalXp += 150;
  }
  saveProgress(data);
}

// ─── Analytics Aggregation ───────────────────────────

export function getAnalytics(): Analytics {
  const data = getProgress();
  const allLessons = getAllLessonsFlat();
  const totalLessons = allLessons.length;

  // Find favorite topics based on completed lessons
  const topicCounts: Record<string, number> = {};
  for (const cl of data.completedLessons) {
    for (const program of PROGRAMS) {
      for (const mod of program.modules) {
        if (mod.lessons.some((l) => l.id === cl.lessonId)) {
          topicCounts[program.title] = (topicCounts[program.title] || 0) + 1;
        }
      }
    }
  }
  const favoriteTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([topic]) => topic);

  return {
    dailyStudyMinutes: getDailyStudyMinutes(),
    weeklyStudyMinutes: getWeeklyStudyMinutes(),
    currentStreak: getCurrentStreak(),
    longestStreak: getCurrentStreak(), // Simplified; a full implementation would track historical max
    totalXp: data.totalXp,
    lessonsCompleted: data.completedLessons.length,
    totalLessons,
    programsCompleted: getCompletedProgramsCount(),
    totalPrograms: PROGRAMS.length,
    averageQuizScore: getAverageQuizScore(),
    weakTopics: getWeakTopics(),
    favoriteTopics,
    completionPercentage: totalLessons > 0
      ? Math.round((data.completedLessons.length / totalLessons) * 100)
      : 0,
    aiInteractions: data.aiInteractions,
    flashcardsReviewed: data.favoriteFlashcards.length,
    simulationsCompleted: data.simulationsCompleted.length,
    labsCompleted: data.labsCompleted.length,
  };
}

// ─── Get Full Progress (for export / sync) ───────────

export function getFullProgress(): ProgressData {
  return getProgress();
}

export function getTotalXp(): number {
  return getProgress().totalXp;
}

export function getLastActiveLessonId(): string | null {
  return getProgress().lastActiveLessonId;
}
