"use client";

import { useAuth, UserRole } from "./AuthContext";

// =====================================================
// useProfile() — Profile metadata access & update hooks
// =====================================================

export interface ProfileData {
  name: string;
  avatarUrl: string;
  bio: string;
  username: string;
  educationLevel: string;
  learningGoal: string;
  favoriteTopics: string[];
  interests: string[];
  dailyGoalMinutes: number;
  timezone: string;
}

export function useProfile() {
  const { user, profile, updateProfile, isMockMode } = useAuth();

  const isAuthenticated = !!user;

  // Extended profile fields from localStorage (mock) or user_metadata (Supabase)
  const getExtendedProfile = (): ProfileData => {
    if (typeof window === "undefined") {
      return {
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        bio: "",
        username: "",
        educationLevel: "",
        learningGoal: "",
        favoriteTopics: [],
        interests: [],
        dailyGoalMinutes: 30,
        timezone: "UTC",
      };
    }

    const stored = localStorage.getItem("bio_profile_extended");
    const ext = stored ? JSON.parse(stored) : {};

    return {
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      bio: ext.bio || "",
      username: ext.username || user?.email?.split("@")[0] || "",
      educationLevel: ext.educationLevel || "",
      learningGoal: ext.learningGoal || "",
      favoriteTopics: ext.favoriteTopics || [],
      interests: ext.interests || [],
      dailyGoalMinutes: ext.dailyGoalMinutes || 30,
      timezone: ext.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    };
  };

  const updateExtendedProfile = async (data: Partial<ProfileData>) => {
    // Update name and avatar through AuthContext for core fields
    if (data.name !== undefined || data.avatarUrl !== undefined) {
      await updateProfile(
        data.name ?? profile.name,
        data.avatarUrl ?? profile.avatarUrl
      );
    }

    // Store extended fields in localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bio_profile_extended");
      const ext = stored ? JSON.parse(stored) : {};
      const merged = { ...ext, ...data };
      localStorage.setItem("bio_profile_extended", JSON.stringify(merged));
    }
  };

  return {
    isAuthenticated,
    profile: getExtendedProfile(),
    updateProfile: updateExtendedProfile,
  };
}

// =====================================================
// useRole() — Active role accessor
// =====================================================

export function useRole() {
  const { role, changeRole, user } = useAuth();

  return {
    role,
    isGuest: !user || role === "guest",
    isStudent: role === "student",
    isAdmin: role === "admin",
    isTeacher: role === "teacher",
    setRole: changeRole,
  };
}

// =====================================================
// usePermissions() — Role-based permission checks
// =====================================================

const PERMISSION_MAP: Record<UserRole, Record<string, boolean>> = {
  guest: {
    browse_modules: true,
    explore_3d_models: true,
    read_articles: true,
    use_search: true,
    view_anatomy: true,
    take_demo_quizzes: true,
    save_progress: false,
    bookmark: false,
    unlimited_ai: false,
    access_dashboard: false,
    earn_xp: false,
    create_notes: false,
    receive_certificates: false,
    manage_users: false,
    manage_content: false,
    view_analytics: false,
    admin_console: false,
    create_content: false,
    assign_lessons: false,
    monitor_students: false,
  },
  student: {
    browse_modules: true,
    explore_3d_models: true,
    read_articles: true,
    use_search: true,
    view_anatomy: true,
    take_demo_quizzes: true,
    save_progress: true,
    bookmark: true,
    unlimited_ai: true,
    access_dashboard: true,
    earn_xp: true,
    create_notes: true,
    receive_certificates: true,
    manage_users: false,
    manage_content: false,
    view_analytics: false,
    admin_console: false,
    create_content: false,
    assign_lessons: false,
    monitor_students: false,
  },
  admin: {
    browse_modules: true,
    explore_3d_models: true,
    read_articles: true,
    use_search: true,
    view_anatomy: true,
    take_demo_quizzes: true,
    save_progress: true,
    bookmark: true,
    unlimited_ai: true,
    access_dashboard: true,
    earn_xp: true,
    create_notes: true,
    receive_certificates: true,
    manage_users: true,
    manage_content: true,
    view_analytics: true,
    admin_console: true,
    create_content: true,
    assign_lessons: true,
    monitor_students: true,
  },
  teacher: {
    browse_modules: true,
    explore_3d_models: true,
    read_articles: true,
    use_search: true,
    view_anatomy: true,
    take_demo_quizzes: true,
    save_progress: true,
    bookmark: true,
    unlimited_ai: true,
    access_dashboard: true,
    earn_xp: false,
    create_notes: true,
    receive_certificates: false,
    manage_users: false,
    manage_content: false,
    view_analytics: false,
    admin_console: false,
    create_content: true,
    assign_lessons: true,
    monitor_students: true,
  },
};

export function usePermissions() {
  const { role, user } = useAuth();
  const effectiveRole: UserRole = user ? role : "guest";
  const perms = PERMISSION_MAP[effectiveRole];

  return {
    can: (key: string): boolean => perms[key] ?? false,
    canSaveProgress: () => perms.save_progress,
    canBookmark: () => perms.bookmark,
    canUseUnlimitedAI: () => perms.unlimited_ai,
    canAccessDashboard: () => perms.access_dashboard,
    canEarnXP: () => perms.earn_xp,
    canCreateNotes: () => perms.create_notes,
    canReceiveCertificates: () => perms.receive_certificates,
    canManageUsers: () => perms.manage_users,
    canManageContent: () => perms.manage_content,
    canViewAnalytics: () => perms.view_analytics,
    canAccessAdmin: () => perms.admin_console,
    canCreateContent: () => perms.create_content,
    canAssignLessons: () => perms.assign_lessons,
    canMonitorStudents: () => perms.monitor_students,
    allPermissions: perms,
  };
}

// =====================================================
// useSession() — Raw session access
// =====================================================

export function useSession() {
  const { user, loading, isMockMode } = useAuth();

  return {
    session: user ? { user, isMockMode } : null,
    isLoading: loading,
    isAuthenticated: !!user,
    isMockMode,
    userId: user?.id || null,
    email: user?.email || null,
  };
}
