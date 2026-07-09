"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, UserProgressData, getUserProgress, saveUserProgress } from "@/utils/supabase";

export type UserRole = "student" | "admin" | "teacher" | "guest";

export interface UserProfile {
  name: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: any | null;
  role: UserRole;
  profile: UserProfile;
  loading: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  signInWithEmail: (email: string, pass: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, pass: string, name: string, initialRole: UserRole) => Promise<{ error: string | null; emailConfirmRequired?: boolean }>;
  signInWithOAuth: (provider: "google" | "github") => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (name: string, avatarUrl: string) => Promise<{ error: string | null }>;
  changeRole: (newRole: UserRole) => void;
  syncProgressToCloud: () => Promise<{ success: boolean; message: string }>;
  isMockMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<UserRole>("guest");
  const [profile, setProfile] = useState<UserProfile>({ name: "", avatarUrl: "" });
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);

  // Check client existence
  useEffect(() => {
    if (!supabase) {
      setIsMockMode(true);
      // Load mock session if stored
      const storedMockUser = localStorage.getItem("bio_mock_user");
      if (storedMockUser) {
        const parsed = JSON.parse(storedMockUser);
        setUser(parsed);
        setRole(parsed.role || "student");
        setProfile({
          name: parsed.name || parsed.email.split("@")[0],
          avatarUrl: parsed.avatarUrl || "",
        });
      }
      setLoading(false);
      return;
    }

    // Initialize Supabase Auth Session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase!.auth.getSession();
        if (session?.user) {
          const u = session.user;
          setUser(u);
          const metaRole = (u.user_metadata?.role as UserRole) || "student";
          setRole(metaRole);
          setProfile({
            name: u.user_metadata?.full_name || u.email?.split("@")[0] || "Student",
            avatarUrl: u.user_metadata?.avatar_url || "",
          });
        }
      } catch (e) {
        console.error("Supabase session initialization error:", e);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for Auth changes
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser(u);
        const metaRole = (u.user_metadata?.role as UserRole) || "student";
        setRole(metaRole);
        setProfile({
          name: u.user_metadata?.full_name || u.email?.split("@")[0] || "Student",
          avatarUrl: u.user_metadata?.avatar_url || "",
        });
      } else {
        setUser(null);
        setRole("guest");
        setProfile({ name: "", avatarUrl: "" });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Email Sign In
  const signInWithEmail = async (email: string, pass: string) => {
    if (isMockMode) {
      const mockUser = {
        id: "mock_user_" + Math.random().toString(36).substr(2, 9),
        email,
        role: "student" as UserRole,
        name: email.split("@")[0],
        avatarUrl: "",
      };
      setUser(mockUser);
      setRole("student");
      setProfile({ name: mockUser.name, avatarUrl: "" });
      localStorage.setItem("bio_mock_user", JSON.stringify(mockUser));
      return { error: null };
    }

    try {
      const { data, error } = await supabase!.auth.signInWithPassword({ email, password: pass });
      if (error) return { error: error.message };
      return { error: null };
    } catch (e: any) {
      return { error: e.message || "An unexpected sign-in error occurred." };
    }
  };

  // Email Sign Up
  const signUpWithEmail = async (email: string, pass: string, name: string, initialRole: UserRole) => {
    if (isMockMode) {
      const mockUser = {
        id: "mock_user_" + Math.random().toString(36).substr(2, 9),
        email,
        role: initialRole,
        name,
        avatarUrl: "",
      };
      setUser(mockUser);
      setRole(initialRole);
      setProfile({ name, avatarUrl: "" });
      localStorage.setItem("bio_mock_user", JSON.stringify(mockUser));
      return { error: null };
    }

    try {
      const { data, error } = await supabase!.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: name,
            role: initialRole,
          },
        },
      });

      if (error) return { error: error.message };
      
      // Check if email verification is active
      const session = data.session;
      return {
        error: null,
        emailConfirmRequired: !session,
      };
    } catch (e: any) {
      return { error: e.message || "An unexpected sign-up error occurred." };
    }
  };

  // OAuth Providers
  const signInWithOAuth = async (provider: "google" | "github") => {
    if (isMockMode) {
      const mockUser = {
        id: `mock_${provider}_` + Math.random().toString(36).substr(2, 9),
        email: `${provider}_user@biosphere.org`,
        role: "student" as UserRole,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Explorer`,
        avatarUrl: "",
      };
      setUser(mockUser);
      setRole("student");
      setProfile({ name: mockUser.name, avatarUrl: "" });
      localStorage.setItem("bio_mock_user", JSON.stringify(mockUser));
      return { error: null };
    }

    try {
      const { error } = await supabase!.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (e: any) {
      return { error: e.message || `An error occurred connecting to ${provider}.` };
    }
  };

  // Sign Out
  const signOut = async () => {
    if (isMockMode) {
      setUser(null);
      setRole("guest");
      setProfile({ name: "", avatarUrl: "" });
      localStorage.removeItem("bio_mock_user");
      return;
    }

    await supabase!.auth.signOut();
  };

  // Forgot Password
  const resetPassword = async (email: string) => {
    if (isMockMode) {
      return { error: null }; // Simulated success
    }

    try {
      const { error } = await supabase!.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (e: any) {
      return { error: e.message || "An error occurred initiating password reset." };
    }
  };

  // Update Profile Metadata (Username / Avatar URL)
  const updateProfile = async (name: string, avatarUrl: string) => {
    if (isMockMode) {
      const mockUser = JSON.parse(localStorage.getItem("bio_mock_user") || "{}");
      const updated = { ...mockUser, name, avatarUrl };
      setUser(updated);
      setProfile({ name, avatarUrl });
      localStorage.setItem("bio_mock_user", JSON.stringify(updated));
      return { error: null };
    }

    try {
      const { data, error } = await supabase!.auth.updateUser({
        data: {
          full_name: name,
          avatar_url: avatarUrl,
        },
      });
      if (error) return { error: error.message };
      setProfile({ name, avatarUrl });
      return { error: null };
    } catch (e: any) {
      return { error: e.message || "Failed to update profile information." };
    }
  };

  // Shift Roles manually for testing and presentation
  const changeRole = (newRole: UserRole) => {
    setRole(newRole);
    if (isMockMode) {
      const mockUser = JSON.parse(localStorage.getItem("bio_mock_user") || "{}");
      const updated = { ...mockUser, role: newRole };
      setUser(updated);
      localStorage.setItem("bio_mock_user", JSON.stringify(updated));
    }
  };

  // Synchronize Local Progress with PostgreSQL
  const syncProgressToCloud = async (): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: "User session not active." };

    try {
      // 1. Gather all local storage progress
      let completedLessons: string[] = [];
      let quizScores: Record<string, number> = {};

      if (typeof window !== "undefined") {
        // Labs certs
        if (localStorage.getItem("biosphere_lab_cert_photosynthesis") === "true") {
          completedLessons.push("photosynthesis");
        }
        if (localStorage.getItem("biosphere_lab_cert_catalysis") === "true") {
          completedLessons.push("enzyme");
        }
        // Quiz scores
        const stats = JSON.parse(localStorage.getItem("bio_stats") || '{"best":{}}');
        quizScores = stats.best || {};
      }

      // 2. Fetch existing cloud progress to merge
      const guestId = localStorage.getItem("biosphere_user_id") || user.id;
      const localProgress = await getUserProgress(guestId);

      const mergedProgress: UserProgressData = {
        user_id: user.id,
        completed_lessons: Array.from(new Set([
          ...completedLessons,
          ...(localProgress.completed_lessons || [])
        ])),
        quiz_scores: {
          ...quizScores,
          ...(localProgress.quiz_scores || {})
        },
        last_active_path: localProgress.last_active_path || null,
        last_active_lesson: localProgress.last_active_lesson || null,
      };

      // 3. Save merged object back to PostgreSQL via supabase utility
      const success = await saveUserProgress(mergedProgress);
      if (!success) {
        return { success: false, message: "Database sync failed. Checked database status." };
      }

      // Sync guest ID key to user ID key in local storage to keep items uniform
      localStorage.setItem("biosphere_user_id", user.id);
      return { success: true, message: "Progress synchronization completed successfully!" };
    } catch (e: any) {
      return { success: false, message: e.message || "Failed to sync progress." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        profile,
        loading,
        authModalOpen,
        setAuthModalOpen,
        signInWithEmail,
        signUpWithEmail,
        signInWithOAuth,
        signOut,
        resetPassword,
        updateProfile,
        changeRole,
        syncProgressToCloud,
        isMockMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
