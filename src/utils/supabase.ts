import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isUrlSecure = (url: string) => {
  return url.startsWith("https://") || url.startsWith("http://");
};

// Initialize the Supabase client safely
export const supabase = 
  supabaseUrl && supabaseAnonKey && isUrlSecure(supabaseUrl)
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null;

export interface UserProgressData {
  user_id: string;
  completed_lessons: string[];
  quiz_scores: Record<string, number>;
  last_active_path: string | null;
  last_active_lesson: string | null;
}

const LOCAL_STORAGE_KEY_PREFIX = "biosphere_progress_";
const USER_ID_KEY = "biosphere_user_id";

// Helper to get or create a unique guest ID
export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "server_placeholder";
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = "guest_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

// Fetch user progress
export async function getUserProgress(userId: string): Promise<UserProgressData> {
  const defaultProgress: UserProgressData = {
    user_id: userId,
    completed_lessons: [],
    quiz_scores: {},
    last_active_path: null,
    last_active_lesson: null,
  };

  // Try fetching from local storage first to merge or use as instant UI fallback
  let localProgress: UserProgressData | null = null;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + userId);
      if (stored) {
        localProgress = JSON.parse(stored);
      }
    } catch (err) {
      console.warn("Failed to parse local storage progress:", err);
    }
  }

  // If Supabase is configured, try syncing/fetching from DB
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("user_progress")
        .select("completed_lessons, quiz_scores, last_active_path, last_active_lesson")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") { // PGRST116 is code for "no rows returned"
        console.warn("Supabase error fetching progress:", error);
      }

      if (data) {
        const merged: UserProgressData = {
          user_id: userId,
          completed_lessons: Array.from(new Set([
            ...(localProgress?.completed_lessons || []),
            ...(data.completed_lessons || [])
          ])),
          quiz_scores: {
            ...(localProgress?.quiz_scores || {}),
            ...(data.quiz_scores || {})
          },
          last_active_path: data.last_active_path || localProgress?.last_active_path || null,
          last_active_lesson: data.last_active_lesson || localProgress?.last_active_lesson || null,
        };

        // Cache synced state locally
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + userId, JSON.stringify(merged));
        }

        return merged;
      }
    } catch (dbErr) {
      console.warn("Failed to fetch progress from Supabase DB:", dbErr);
    }
  }

  return localProgress || defaultProgress;
}

// Save user progress
export async function saveUserProgress(progress: UserProgressData): Promise<boolean> {
  const userId = progress.user_id;

  // Save to local storage immediately for robustness
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + userId, JSON.stringify(progress));
    } catch (err) {
      console.warn("Failed to save progress to local storage:", err);
    }
  }

  // If Supabase is available, sync to PostgreSQL
  if (supabase) {
    try {
      const { error } = await supabase.from("user_progress").upsert(
        {
          user_id: userId,
          completed_lessons: progress.completed_lessons,
          quiz_scores: progress.quiz_scores,
          last_active_path: progress.last_active_path,
          last_active_lesson: progress.last_active_lesson,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (error) {
        console.warn("Error syncing progress to Supabase:", error);
        return false;
      }
      return true;
    } catch (dbErr) {
      console.warn("Database connection failed during save:", dbErr);
      return false;
    }
  }

  return true;
}
