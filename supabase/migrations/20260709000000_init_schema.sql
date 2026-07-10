-- =====================================================
-- Biosphere Production Schema Migration
-- Version: 1.0.0
-- Date: 2026-07-09
-- =====================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('guest', 'student', 'admin', 'teacher');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE notification_type AS ENUM ('achievement', 'system', 'social', 'reminder');
CREATE TYPE activity_type AS ENUM ('login', 'logout', 'lesson_start', 'lesson_complete', 'quiz_attempt', 'quiz_pass', 'bookmark_add', 'bookmark_remove', 'note_create', 'note_update', 'certificate_earned', 'achievement_unlocked', 'profile_update', 'settings_update');

-- =====================================================
-- PROFILES (extends auth.users)
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  education_level TEXT DEFAULT '',
  learning_goal TEXT DEFAULT '',
  favorite_topics TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  daily_goal_minutes INTEGER DEFAULT 30,
  timezone TEXT DEFAULT 'UTC',
  role user_role DEFAULT 'student',
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_streak_date DATE,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROLES & PERMISSIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name user_role UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (name, description) VALUES
  ('guest', 'Read-only access. Can browse, explore 3D models, read articles, and take demo quizzes.'),
  ('student', 'Full learning features. Can save progress, bookmark, earn XP, use AI, create notes, and earn certificates.'),
  ('admin', 'Complete CMS access. Can manage users, content, and view infrastructure metrics.'),
  ('teacher', 'Content creation access. Can assign lessons, monitor student progress, and create quizzes.')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  role_name user_role NOT NULL REFERENCES roles(name) ON DELETE CASCADE,
  permission_key TEXT NOT NULL,
  granted BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_name, permission_key)
);

-- Guest permissions (read-only)
INSERT INTO permissions (role_name, permission_key, granted) VALUES
  ('guest', 'browse_modules', true),
  ('guest', 'explore_3d_models', true),
  ('guest', 'read_articles', true),
  ('guest', 'use_search', true),
  ('guest', 'view_anatomy', true),
  ('guest', 'take_demo_quizzes', true),
  ('guest', 'save_progress', false),
  ('guest', 'bookmark', false),
  ('guest', 'unlimited_ai', false),
  ('guest', 'access_dashboard', false),
  ('guest', 'earn_xp', false),
  ('guest', 'create_notes', false),
  ('guest', 'receive_certificates', false)
ON CONFLICT (role_name, permission_key) DO NOTHING;

-- Student permissions
INSERT INTO permissions (role_name, permission_key, granted) VALUES
  ('student', 'browse_modules', true),
  ('student', 'explore_3d_models', true),
  ('student', 'read_articles', true),
  ('student', 'use_search', true),
  ('student', 'view_anatomy', true),
  ('student', 'take_demo_quizzes', true),
  ('student', 'save_progress', true),
  ('student', 'bookmark', true),
  ('student', 'unlimited_ai', true),
  ('student', 'access_dashboard', true),
  ('student', 'earn_xp', true),
  ('student', 'create_notes', true),
  ('student', 'receive_certificates', true)
ON CONFLICT (role_name, permission_key) DO NOTHING;

-- Admin permissions
INSERT INTO permissions (role_name, permission_key, granted) VALUES
  ('admin', 'browse_modules', true),
  ('admin', 'explore_3d_models', true),
  ('admin', 'read_articles', true),
  ('admin', 'use_search', true),
  ('admin', 'view_anatomy', true),
  ('admin', 'take_demo_quizzes', true),
  ('admin', 'save_progress', true),
  ('admin', 'bookmark', true),
  ('admin', 'unlimited_ai', true),
  ('admin', 'access_dashboard', true),
  ('admin', 'earn_xp', true),
  ('admin', 'create_notes', true),
  ('admin', 'receive_certificates', true),
  ('admin', 'manage_users', true),
  ('admin', 'manage_content', true),
  ('admin', 'view_analytics', true),
  ('admin', 'admin_console', true)
ON CONFLICT (role_name, permission_key) DO NOTHING;

-- Teacher permissions
INSERT INTO permissions (role_name, permission_key, granted) VALUES
  ('teacher', 'browse_modules', true),
  ('teacher', 'explore_3d_models', true),
  ('teacher', 'read_articles', true),
  ('teacher', 'use_search', true),
  ('teacher', 'view_anatomy', true),
  ('teacher', 'take_demo_quizzes', true),
  ('teacher', 'save_progress', true),
  ('teacher', 'bookmark', true),
  ('teacher', 'unlimited_ai', true),
  ('teacher', 'access_dashboard', true),
  ('teacher', 'earn_xp', false),
  ('teacher', 'create_notes', true),
  ('teacher', 'receive_certificates', false),
  ('teacher', 'create_content', true),
  ('teacher', 'assign_lessons', true),
  ('teacher', 'monitor_students', true)
ON CONFLICT (role_name, permission_key) DO NOTHING;

-- =====================================================
-- SETTINGS (per-user preferences)
-- =====================================================

CREATE TABLE IF NOT EXISTS settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  dark_mode BOOLEAN DEFAULT true,
  language TEXT DEFAULT 'en',
  notification_email BOOLEAN DEFAULT true,
  notification_push BOOLEAN DEFAULT true,
  notification_achievements BOOLEAN DEFAULT true,
  privacy_public_profile BOOLEAN DEFAULT true,
  privacy_show_activity BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- LEARNING CONTENT TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS learning_paths (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#39FF14',
  icon TEXT DEFAULT '🧬',
  difficulty difficulty_level DEFAULT 'medium',
  estimated_hours NUMERIC(4,1) DEFAULT 2.0,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  path_id TEXT NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id) ON DELETE SET NULL,
  path_id TEXT REFERENCES learning_paths(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  reading_time TEXT DEFAULT '5 min',
  difficulty difficulty_level DEFAULT 'medium',
  explore_url TEXT DEFAULT '',
  explore_button_text TEXT DEFAULT 'Explore in 3D',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROGRESS & TRACKING
-- =====================================================

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  path_id TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS course_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  lessons_completed INTEGER DEFAULT 0,
  lessons_total INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  is_completed BOOLEAN DEFAULT false,
  UNIQUE(user_id, course_id)
);

-- Legacy progress table (retains compatibility with existing supabase.ts)
CREATE TABLE IF NOT EXISTS user_progress (
  user_id TEXT PRIMARY KEY,
  completed_lessons TEXT[] DEFAULT '{}',
  quiz_scores JSONB DEFAULT '{}',
  last_active_path TEXT,
  last_active_lesson TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- QUIZ ATTEMPTS
-- =====================================================

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  path_id TEXT,
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  passed BOOLEAN DEFAULT false,
  answers JSONB DEFAULT '[]',
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);

-- =====================================================
-- BOOKMARKS
-- =====================================================

CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  label TEXT DEFAULT '',
  icon TEXT DEFAULT '🧬',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, path)
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);

-- =====================================================
-- AI CHAT HISTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS ai_chat_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  context_path TEXT,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_user ON ai_chat_history(user_id);
CREATE INDEX idx_chat_session ON ai_chat_history(session_id);

-- =====================================================
-- USER NOTES
-- =====================================================

CREATE TABLE IF NOT EXISTS user_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  title TEXT DEFAULT '',
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, path)
);

CREATE INDEX idx_notes_user ON user_notes(user_id);

-- =====================================================
-- CERTIFICATES
-- =====================================================

CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certificate_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  path_id TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  pdf_url TEXT
);

CREATE INDEX idx_certificates_user ON certificates(user_id);

-- =====================================================
-- ACHIEVEMENTS & BADGES
-- =====================================================

CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '🏅',
  xp_reward INTEGER DEFAULT 0,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_badges_user ON badges(user_id);

-- Seed some starter achievements
INSERT INTO achievements (id, title, description, icon, xp_reward, category) VALUES
  ('first_login', 'Welcome Explorer', 'Logged in for the first time', '🎉', 10, 'onboarding'),
  ('first_lesson', 'First Steps', 'Completed your first lesson', '📖', 25, 'learning'),
  ('first_quiz', 'Quiz Starter', 'Attempted your first quiz', '📝', 15, 'learning'),
  ('first_bookmark', 'Curator', 'Bookmarked your first topic', '⭐', 10, 'engagement'),
  ('streak_3', 'On Fire', '3-day learning streak', '🔥', 50, 'consistency'),
  ('streak_7', 'Week Warrior', '7-day learning streak', '💪', 100, 'consistency'),
  ('streak_30', 'Monthly Master', '30-day learning streak', '🏆', 500, 'consistency'),
  ('cell_explorer', 'Cell Scientist', 'Explored all cell organelles', '🔬', 100, 'mastery'),
  ('dna_decoded', 'DNA Decoder', 'Completed DNA & Genetics module', '🧬', 100, 'mastery'),
  ('anatomy_ace', 'Anatomy Ace', 'Explored the complete human body', '🫀', 100, 'mastery'),
  ('quiz_perfect', 'Perfect Score', 'Got 100% on any quiz', '💯', 150, 'excellence'),
  ('lab_certified', 'Lab Certified', 'Earned a virtual lab certificate', '🧪', 200, 'mastery'),
  ('level_5', 'Rising Scholar', 'Reached Level 5', '📈', 100, 'milestone'),
  ('level_10', 'Biology Expert', 'Reached Level 10', '🎓', 250, 'milestone')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type notification_type DEFAULT 'system',
  title TEXT NOT NULL,
  message TEXT DEFAULT '',
  icon TEXT DEFAULT '🔔',
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read) WHERE read = false;

-- =====================================================
-- ACTIVITY LOGS
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity activity_type NOT NULL,
  metadata JSONB DEFAULT '{}',
  path TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_type ON activity_logs(activity);
CREATE INDEX idx_activity_created ON activity_logs(created_at);

-- =====================================================
-- TRIGGER: Auto-create profile and settings on signup
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, username, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'student')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read public profiles, edit own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Settings: own only
CREATE POLICY "Users can view own settings" ON settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Progress: own only
CREATE POLICY "Users can manage own lesson progress" ON lesson_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own course progress" ON course_progress FOR ALL USING (auth.uid() = user_id);

-- Quiz: own only
CREATE POLICY "Users can manage own quiz attempts" ON quiz_attempts FOR ALL USING (auth.uid() = user_id);

-- Bookmarks: own only
CREATE POLICY "Users can manage own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- Chat: own only
CREATE POLICY "Users can manage own chat history" ON ai_chat_history FOR ALL USING (auth.uid() = user_id);

-- Notes: own only
CREATE POLICY "Users can manage own notes" ON user_notes FOR ALL USING (auth.uid() = user_id);

-- Certificates: own only
CREATE POLICY "Users can view own certificates" ON certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert certificates" ON certificates FOR INSERT WITH CHECK (true);

-- Badges: own read, system insert
CREATE POLICY "Users can view own badges" ON badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert badges" ON badges FOR INSERT WITH CHECK (true);

-- Notifications: own only
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Activity logs: own read, system insert
CREATE POLICY "Users can view own activity" ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert activity logs" ON activity_logs FOR INSERT WITH CHECK (true);

-- Learning content: everyone can read
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Learning paths are viewable by everyone" ON learning_paths FOR SELECT USING (true);
CREATE POLICY "Courses are viewable by everyone" ON courses FOR SELECT USING (true);
CREATE POLICY "Lessons are viewable by everyone" ON lessons FOR SELECT USING (true);
CREATE POLICY "Achievements are viewable by everyone" ON achievements FOR SELECT USING (true);

-- User progress legacy table: public read/write for guest compatibility
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User progress is accessible to all" ON user_progress FOR ALL USING (true);
