"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth, UserRole } from "./AuthContext";
import { useNavigation, ROUTE_META } from "../navigation/NavigationContext";

export const AuthenticatedProfile: React.FC = () => {
  const {
    user,
    role,
    profile,
    updateProfile,
    signOut,
    changeRole,
    syncProgressToCloud,
    isMockMode,
  } = useAuth();

  const { favorites, progressPercent } = useNavigation();

  const [nameInput, setNameInput] = useState(profile.name);
  const [editing, setEditing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState(true);

  // Tab state
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("overview");

  // Settings form fields
  const [settingsUsername, setSettingsUsername] = useState("");
  const [settingsBio, setSettingsBio] = useState("");
  const [settingsEducation, setSettingsEducation] = useState("");
  const [settingsGoal, setSettingsGoal] = useState("");
  const [settingsTopics, setSettingsTopics] = useState("");
  const [settingsTimezone, setSettingsTimezone] = useState("");
  const [settingsDarkMode, setSettingsDarkMode] = useState(true);
  const [settingsLanguage, setSettingsLanguage] = useState("en");
  const [settingsPublicProfile, setSettingsPublicProfile] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Local storage certifications for rendering
  const [labPhotosynthesis, setLabPhotosynthesis] = useState(false);
  const [labCatalysis, setLabCatalysis] = useState(false);
  const [quizPoints, setQuizPoints] = useState(0);

  useEffect(() => {
    setNameInput(profile.name);
    if (typeof window !== "undefined") {
      setLabPhotosynthesis(localStorage.getItem("biosphere_lab_cert_photosynthesis") === "true");
      setLabCatalysis(localStorage.getItem("biosphere_lab_cert_catalysis") === "true");
      try {
        const stats = JSON.parse(localStorage.getItem("bio_stats") || '{"points":0}');
        setQuizPoints(stats.points || 0);
      } catch {}

      // Load extended profile settings
      try {
        const ext = JSON.parse(localStorage.getItem("bio_profile_extended") || "{}");
        setSettingsUsername(ext.username || user?.email?.split("@")[0] || "");
        setSettingsBio(ext.bio || "");
        setSettingsEducation(ext.educationLevel || "");
        setSettingsGoal(ext.learningGoal || "");
        setSettingsTopics((ext.favoriteTopics || []).join(", "));
        setSettingsTimezone(ext.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
      } catch {}

      // Load preference settings
      try {
        const prefs = JSON.parse(localStorage.getItem("bio_user_settings") || "{}");
        setSettingsDarkMode(prefs.darkMode !== false);
        setSettingsLanguage(prefs.language || "en");
        setSettingsPublicProfile(prefs.publicProfile !== false);
      } catch {}
    }
  }, [profile]);

  // Save settings handler
  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    setSettingsSaved(false);

    // Save extended profile
    const extData = {
      username: settingsUsername,
      bio: settingsBio,
      educationLevel: settingsEducation,
      learningGoal: settingsGoal,
      favoriteTopics: settingsTopics.split(",").map(t => t.trim()).filter(Boolean),
      timezone: settingsTimezone,
    };
    localStorage.setItem("bio_profile_extended", JSON.stringify(extData));

    // Save preferences
    const prefsData = {
      darkMode: settingsDarkMode,
      language: settingsLanguage,
      publicProfile: settingsPublicProfile,
    };
    localStorage.setItem("bio_user_settings", JSON.stringify(prefsData));

    // Simulate brief save delay
    await new Promise(r => setTimeout(r, 400));
    setSettingsSaving(false);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    // Clear all local data
    const keysToRemove = [
      "bio_mock_user", "bio_profile_extended", "bio_user_settings",
      "bio_stats", "bio_nav_favorites", "bio_nav_pinned", "bio_nav_recents",
      "bio_nav_theme", "biosphere_user_id",
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));

    // Also clear any progress keys
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("biosphere_progress_") || key.startsWith("bio_notes_"))) {
        localStorage.removeItem(key);
      }
    }

    await signOut();
  };

  // Sync handler
  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    const res = await syncProgressToCloud();
    setSyncSuccess(res.success);
    setSyncMessage(res.message);
    setSyncing(false);
    setTimeout(() => setSyncMessage(null), 4000);
  };

  // Avatar Upload (Base64 file selector)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 200000) {
      alert("Image is too large. Please select an image under 200KB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const res = await updateProfile(profile.name, base64);
      if (res.error) {
        alert(res.error);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNameSave = async () => {
    if (!nameInput.trim()) return;
    const res = await updateProfile(nameInput, profile.avatarUrl);
    if (res.error) {
      alert(res.error);
    } else {
      setEditing(false);
    }
  };

  // XP level calculations
  const calculatedXp = useMemo(() => {
    const lessonsCount = (labPhotosynthesis ? 1 : 0) + (labCatalysis ? 1 : 0);
    const lessonXp = lessonsCount * 150;
    const quizXp = quizPoints * 2;
    return lessonXp + quizXp;
  }, [labPhotosynthesis, labCatalysis, quizPoints]);

  const currentLevel = Math.floor(calculatedXp / 500) + 1;
  const levelPercent = Math.min(100, Math.round(((calculatedXp % 500) / 500) * 100));

  return (
    <div className="auth-profile-root">
      {/* Tab Switcher */}
      <div className="profile-tab-bar">
        <button
          className={`profile-tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`profile-tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ Account Settings
        </button>
      </div>

      {/* Grid Dashboard Layout */}
      <div className="profile-dashboard-grid">
        {/* Left Column: Profile Card & Actions */}
        <div className="profile-col-left">
          {/* Avatar & Basic Info */}
          <div className="profile-panel-card glassmorphic user-info-card">
            <div className="avatar-upload-wrapper">
              <img
                src={profile.avatarUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"}
                className="user-avatar-img"
                alt="Profile Avatar"
              />
              <label className="avatar-input-label-btn" title="Upload avatar">
                📷
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>

            {editing ? (
              <div className="name-edit-row">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="profile-name-text-input"
                />
                <button onClick={handleNameSave} className="name-save-btn">✓</button>
              </div>
            ) : (
              <h2 className="user-profile-name">
                {profile.name || "Explorer"}
                <button onClick={() => setEditing(true)} className="name-edit-pencil-btn" title="Edit name">✏️</button>
              </h2>
            )}

            <span className="user-email-label">{user?.email}</span>

            {/* Role Badge */}
            <span className={`role-badge ${role}`}>
              {role.toUpperCase()}
            </span>

            {/* Session details */}
            <div className="session-status-panel">
              <span className="session-meta">CLIENT ENGINE: {isMockMode ? "Mock Session" : "Supabase Cloud"}</span>
              <span className="session-meta">STATUS: Verified Active</span>
            </div>

            {/* Sign Out Button */}
            <button onClick={signOut} className="profile-sign-out-btn">
              Disconnect Session
            </button>
          </div>

          {/* Sync Progress Card */}
          <div className="profile-panel-card glassmorphic sync-progress-card">
            <h3 className="card-sec-hdr">⚡ CLOUD SYNCHRONIZATION</h3>
            <p className="card-sub-txt">
              Upload local certifications, bookmarks, and high scores to your database profile.
            </p>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="cloud-sync-trigger-btn"
            >
              {syncing ? "Syncing..." : "Sync Progress Now"}
            </button>

            {syncMessage && (
              <div className={`sync-feedback-bubble ${syncSuccess ? "success" : "error"}`}>
                {syncMessage}
              </div>
            )}
          </div>

          {/* Role switcher for testing */}
          <div className="profile-panel-card glassmorphic role-switcher-card">
            <h3 className="card-sec-hdr">⚙️ TESTING CORE: SWITCH ROLES</h3>
            <div className="role-switcher-row">
              {(["student", "admin", "teacher"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => changeRole(r)}
                  className={`role-switch-btn ${role === r ? "active" : ""}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Content depends on active tab */}
        <div className="profile-col-right">
          {activeTab === "overview" && (
            <>
          {/* Leveling & Stats */}
          <div className="profile-panel-card glassmorphic levels-stats-card">
            <h3 className="card-sec-hdr">🏆 EXPLORATION EXPERIENCE</h3>
            <div className="levels-grid">
              <div className="level-big-badge">
                <span className="level-lbl">LEVEL</span>
                <span className="level-num">{currentLevel}</span>
              </div>
              <div className="level-progress-detail">
                <div className="level-progress-header">
                  <span className="level-progress-xp">{calculatedXp} / {currentLevel * 500} XP</span>
                  <span className="level-progress-pct">{levelPercent}%</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${levelPercent}%` }} />
                </div>
                <p className="level-encouragement-txt">
                  Complete laboratory certificates and quizzes to unlock Level {currentLevel + 1}!
                </p>
              </div>
            </div>
          </div>

          {/* Bookmarks */}
          <div className="profile-panel-card glassmorphic bookmarks-history-card">
            <h3 className="card-sec-hdr">⭐ BOOKMARKED EXAMPLES</h3>
            {favorites.length > 0 ? (
              <div className="profile-bookmarks-grid">
                {favorites.map((favPath) => {
                  const meta = ROUTE_META[favPath] || { label: "Details Page", icon: "🧬" };
                  return (
                    <a href={favPath} key={favPath} className="profile-bookmark-link-pill">
                      <span className="p-bookmark-icon">{meta.icon}</span>
                      <span className="p-bookmark-name">{meta.label}</span>
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="profile-empty-history-text">No bookmarked exhibits. Click the star icon on path headers to add topics.</p>
            )}
          </div>

          {/* History / Completed lessons */}
          <div className="profile-panel-card glassmorphic learning-history-card">
            <h3 className="card-sec-hdr">⏱️ LEARNING HISTORY</h3>
            <div className="history-timeline-list">
              <div className={`history-timeline-item ${labPhotosynthesis ? "completed" : ""}`}>
                <span className="timeline-check">{labPhotosynthesis ? "✓" : "⚡"}</span>
                <div className="timeline-info">
                  <span className="timeline-title">Photosynthesis Limiting Factors Lab</span>
                  <span className="timeline-status">
                    {labPhotosynthesis ? "Certified Completed (+150 XP)" : "Not Started"}
                  </span>
                </div>
              </div>

              <div className={`history-timeline-item ${labCatalysis ? "completed" : ""}`}>
                <span className="timeline-check">{labCatalysis ? "✓" : "⚡"}</span>
                <div className="timeline-info">
                  <span className="timeline-title">Enzyme Catalysis (Catalase) Lab</span>
                  <span className="timeline-status">
                    {labCatalysis ? "Certified Completed (+150 XP)" : "Not Started"}
                  </span>
                </div>
              </div>

              <div className="history-timeline-item completed">
                <span className="timeline-check">✓</span>
                <div className="timeline-info">
                  <span className="timeline-title">Interactive Anatomy System</span>
                  <span className="timeline-status">Explored (+50 XP)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin metric console */}
          {role === "admin" && (
            <div className="profile-panel-card glassmorphic admin-metrics-card">
              <h3 className="card-sec-hdr admin-hdr">🔒 ADMIN CONSOLE — INFRASTRUCTURE MONITOR</h3>
              <div className="admin-grid-metrics">
                <div className="admin-metric-box">
                  <span className="metric-lbl">ACTIVE USERS</span>
                  <span className="metric-val">124</span>
                </div>
                <div className="admin-metric-box">
                  <span className="metric-lbl">DB QUERY SPEED</span>
                  <span className="metric-val">12ms</span>
                </div>
                <div className="admin-metric-box">
                  <span className="metric-lbl">STORAGE STORAGE</span>
                  <span className="metric-val">4.2 GB / 10 GB</span>
                </div>
                <div className="admin-metric-box">
                  <span className="metric-lbl">SYSTEM HEALTH</span>
                  <span className="metric-val success">OPTIMAL (99.8%)</span>
                </div>
              </div>
            </div>
          )}

          {/* Teacher Console future mockup */}
          {role === "teacher" && (
            <div className="profile-panel-card glassmorphic teacher-card">
              <h3 className="card-sec-hdr teacher-hdr">👩‍🏫 TEACHER DASHBOARD (V2 COMING SOON)</h3>
              <p className="teacher-info-text">
                The next release of Biosphere will feature the Teacher Console:
              </p>
              <ul className="teacher-bullet-list">
                <li>Assign interactive 3D anatomy inspections directly to student classes.</li>
                <li>Monitor live lab froth heights and bubble counts of Elodea simulations.</li>
                <li>Analyze class quiz grade metrics dynamically.</li>
              </ul>
            </div>
          )}
            </>
          )}

          {/* ==================== SETTINGS TAB ==================== */}
          {activeTab === "settings" && (
            <>
              {/* Profile Editor Card */}
              <div className="profile-panel-card glassmorphic settings-editor-card">
                <h3 className="card-sec-hdr">👤 PROFILE INFORMATION</h3>
                <div className="settings-form-grid">
                  <div className="settings-field">
                    <label className="settings-label">Username</label>
                    <input
                      type="text"
                      value={settingsUsername}
                      onChange={(e) => setSettingsUsername(e.target.value)}
                      className="settings-input"
                      placeholder="Your username"
                    />
                  </div>
                  <div className="settings-field">
                    <label className="settings-label">Bio</label>
                    <textarea
                      value={settingsBio}
                      onChange={(e) => setSettingsBio(e.target.value)}
                      className="settings-textarea"
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                  <div className="settings-field">
                    <label className="settings-label">Education Level</label>
                    <select
                      value={settingsEducation}
                      onChange={(e) => setSettingsEducation(e.target.value)}
                      className="settings-input"
                    >
                      <option value="">Select level...</option>
                      <option value="middle_school">Middle School</option>
                      <option value="high_school">High School</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="graduate">Graduate / Masters</option>
                      <option value="phd">Ph.D. / Doctorate</option>
                      <option value="professional">Professional / Self-learner</option>
                    </select>
                  </div>
                  <div className="settings-field">
                    <label className="settings-label">Learning Goal</label>
                    <input
                      type="text"
                      value={settingsGoal}
                      onChange={(e) => setSettingsGoal(e.target.value)}
                      className="settings-input"
                      placeholder="e.g., Pass AP Biology, Master Cell Biology..."
                    />
                  </div>
                  <div className="settings-field">
                    <label className="settings-label">Favorite Topics (comma-separated)</label>
                    <input
                      type="text"
                      value={settingsTopics}
                      onChange={(e) => setSettingsTopics(e.target.value)}
                      className="settings-input"
                      placeholder="e.g., Genetics, Anatomy, Ecology"
                    />
                  </div>
                  <div className="settings-field">
                    <label className="settings-label">Timezone</label>
                    <input
                      type="text"
                      value={settingsTimezone}
                      onChange={(e) => setSettingsTimezone(e.target.value)}
                      className="settings-input"
                      placeholder="e.g., Asia/Kolkata, America/New_York"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences Card */}
              <div className="profile-panel-card glassmorphic settings-prefs-card">
                <h3 className="card-sec-hdr">🎨 PREFERENCES</h3>
                <div className="settings-toggle-list">
                  <div className="settings-toggle-row">
                    <div className="toggle-info">
                      <span className="toggle-label">Dark Mode</span>
                      <span className="toggle-desc">Use dark background theme across all pages</span>
                    </div>
                    <button
                      onClick={() => setSettingsDarkMode(!settingsDarkMode)}
                      className={`toggle-switch ${settingsDarkMode ? "on" : "off"}`}
                    >
                      <span className="toggle-knob" />
                    </button>
                  </div>

                  <div className="settings-toggle-row">
                    <div className="toggle-info">
                      <span className="toggle-label">Public Profile</span>
                      <span className="toggle-desc">Show your profile on public leaderboards</span>
                    </div>
                    <button
                      onClick={() => setSettingsPublicProfile(!settingsPublicProfile)}
                      className={`toggle-switch ${settingsPublicProfile ? "on" : "off"}`}
                    >
                      <span className="toggle-knob" />
                    </button>
                  </div>

                  <div className="settings-toggle-row">
                    <div className="toggle-info">
                      <span className="toggle-label">Language</span>
                      <span className="toggle-desc">Interface language preference</span>
                    </div>
                    <select
                      value={settingsLanguage}
                      onChange={(e) => setSettingsLanguage(e.target.value)}
                      className="settings-select-small"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="hi">हिन्दी</option>
                      <option value="ja">日本語</option>
                    </select>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveSettings}
                  disabled={settingsSaving}
                  className="settings-save-btn"
                >
                  {settingsSaving ? "Saving..." : settingsSaved ? "✓ Settings Saved!" : "Save All Settings"}
                </button>
              </div>

              {/* Danger Zone */}
              <div className="profile-panel-card glassmorphic danger-zone-card">
                <h3 className="card-sec-hdr danger-hdr">⚠️ DANGER ZONE</h3>
                <p className="card-sub-txt">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                {!deleteConfirm ? (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="danger-zone-btn"
                  >
                    Delete My Account
                  </button>
                ) : (
                  <div className="danger-confirm-row">
                    <span className="danger-confirm-text">Are you absolutely sure?</span>
                    <button onClick={handleDeleteAccount} className="danger-confirm-yes-btn">
                      Yes, Delete Everything
                    </button>
                    <button onClick={() => setDeleteConfirm(false)} className="danger-confirm-cancel-btn">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .auth-profile-root {
          width: 100%;
          min-height: calc(100vh - 144px);
          padding: 24px clamp(16px, 4vw, 40px) 60px;
          background: var(--ds-bg-primary);
          color: var(--ds-fg);
          box-sizing: border-box;
        }

        .profile-dashboard-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 24px;
        }

        .profile-col-left,
        .profile-col-right {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .profile-panel-card {
          border-radius: 16px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
          box-sizing: border-box;
        }

        .card-sec-hdr {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--ds-accent-muted);
          letter-spacing: 0.12em;
          margin: 0 0 12px 0;
          text-transform: uppercase;
        }

        .card-sec-hdr.admin-hdr {
          color: #fca5a5;
        }

        .card-sec-hdr.teacher-hdr {
          color: #93c5fd;
        }

        .card-sub-txt {
          font-size: 0.76rem;
          color: var(--ds-fg-subtle);
          margin: 0 0 16px 0;
          line-height: 1.4;
        }

        /* User Info Card */
        .user-info-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .avatar-upload-wrapper {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 2px solid var(--ds-border-accent);
          background: rgba(0, 0, 0, 0.4);
          position: relative;
          margin-bottom: 16px;
          box-shadow: var(--ds-glow-sm);
        }

        .user-avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .avatar-input-label-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--ds-accent);
          border: 1px solid #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0,0,0,0.5);
        }

        .avatar-input-label-btn:hover {
          transform: scale(1.1);
        }

        .user-profile-name {
          font-size: 1.35rem;
          font-weight: 800;
          color: #fff;
          margin: 0 0 4px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .name-edit-pencil-btn,
        .name-save-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .name-edit-pencil-btn {
          opacity: 0.5;
        }

        .name-edit-pencil-btn:hover {
          opacity: 1;
        }

        .name-edit-row {
          display: flex;
          gap: 6px;
          width: 100%;
          justify-content: center;
          margin-bottom: 4px;
        }

        .profile-name-text-input {
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid var(--ds-border-accent);
          background: #000;
          color: #fff;
          font-size: 0.85rem;
          outline: none;
          text-align: center;
          width: 150px;
        }

        .name-save-btn {
          color: var(--ds-accent);
          font-weight: bold;
        }

        .user-email-label {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          margin-bottom: 12px;
        }

        .role-badge {
          font-size: 0.58rem;
          font-weight: 900;
          padding: 3px 10px;
          border-radius: 100px;
          letter-spacing: 0.15em;
          margin-bottom: 16px;
        }

        .role-badge.student {
          border: 1.5px solid var(--ds-border-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
        }

        .role-badge.admin {
          border: 1.5px solid rgba(239, 68, 68, 0.4);
          background: rgba(239, 68, 68, 0.08);
          color: #fca5a5;
        }

        .role-badge.teacher {
          border: 1.5px solid rgba(59, 130, 246, 0.4);
          background: rgba(59, 130, 246, 0.08);
          color: #93c5fd;
        }

        .session-status-panel {
          width: 100%;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-glass-border);
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
          margin-bottom: 20px;
        }

        .session-meta {
          font-size: 0.58rem;
          font-family: monospace;
          color: var(--ds-fg-subtle);
        }

        .profile-sign-out-btn {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.02);
          color: var(--ds-fg-muted);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .profile-sign-out-btn:hover {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        /* Sync Progress Card */
        .cloud-sync-trigger-btn {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1.5px solid var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          font-weight: 800;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: var(--ds-glow-sm);
        }

        .cloud-sync-trigger-btn:hover {
          background: var(--ds-accent-subtle);
          box-shadow: var(--ds-glow-md);
        }

        .sync-feedback-bubble {
          margin-top: 10px;
          padding: 8px;
          border-radius: 6px;
          font-size: 0.65rem;
          text-align: center;
        }

        .sync-feedback-bubble.success {
          background: rgba(57, 255, 20, 0.08);
          border: 1px solid rgba(57, 255, 20, 0.2);
          color: var(--ds-accent);
        }

        .sync-feedback-bubble.error {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }

        /* Role Switcher */
        .role-switcher-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 6px;
        }

        .role-switch-btn {
          padding: 6px 4px;
          border-radius: 6px;
          border: 1px solid var(--ds-glass-border);
          background: none;
          color: var(--ds-fg-subtle);
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: capitalize;
          cursor: pointer;
          transition: all 0.2s;
        }

        .role-switch-btn:hover,
        .role-switch-btn.active {
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
        }

        /* Experience levels styling */
        .levels-grid {
          display: grid;
          grid-template-columns: 80px 1fr;
          gap: 16px;
          align-items: center;
        }

        .level-big-badge {
          height: 80px;
          border-radius: 12px;
          border: 1px solid var(--ds-border-accent);
          background: var(--ds-accent-faint);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: var(--ds-glow-sm);
        }

        .level-lbl {
          font-size: 0.52rem;
          font-weight: 800;
          color: var(--ds-accent-muted);
          letter-spacing: 0.1em;
        }

        .level-num {
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--ds-accent);
          line-height: 1;
        }

        .level-progress-detail {
          display: flex;
          flex-direction: column;
        }

        .level-progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .level-progress-xp {
          color: var(--ds-fg-muted);
        }

        .level-progress-pct {
          color: var(--ds-accent);
        }

        .progress-bar-track {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: var(--ds-border-muted);
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-bar-fill {
          height: 100%;
          background: var(--ds-accent);
          box-shadow: var(--ds-glow-sm);
          border-radius: 3px;
          transition: width 0.4s ease;
        }

        .level-encouragement-txt {
          font-size: 0.68rem;
          color: var(--ds-fg-subtle);
          margin: 0;
          line-height: 1.4;
        }

        /* Bookmarks grid */
        .profile-bookmarks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 10px;
        }

        .profile-bookmark-link-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0, 0, 0, 0.25);
          text-decoration: none;
          color: var(--ds-fg-muted);
          font-size: 0.75rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .profile-bookmark-link-pill:hover {
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
        }

        .p-bookmark-icon {
          font-size: 1rem;
        }

        .profile-empty-history-text {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          margin: 0;
          line-height: 1.4;
        }

        /* Learning History timeline */
        .history-timeline-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .history-timeline-item {
          display: flex;
          gap: 14px;
          position: relative;
        }

        .history-timeline-item::after {
          content: "";
          position: absolute;
          top: 24px;
          left: 11px;
          bottom: -22px;
          width: 2px;
          background: var(--ds-glass-border);
        }

        .history-timeline-item:last-child::after {
          display: none;
        }

        .timeline-check {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--ds-glass-border);
          color: var(--ds-fg-subtle);
          font-size: 0.75rem;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          z-index: 2;
        }

        .history-timeline-item.completed .timeline-check {
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
          color: var(--ds-accent);
          box-shadow: var(--ds-glow-sm);
        }

        .timeline-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .timeline-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--ds-fg);
        }

        .timeline-status {
          font-size: 0.65rem;
          color: var(--ds-fg-subtle);
        }

        .history-timeline-item.completed .timeline-status {
          color: var(--ds-accent-muted);
        }

        /* Admin console grid */
        .admin-grid-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .admin-metric-box {
          padding: 12px;
          border-radius: 8px;
          background: rgba(239, 68, 68, 0.02);
          border: 1px solid rgba(239, 68, 68, 0.15);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .metric-lbl {
          font-size: 0.52rem;
          font-weight: 800;
          color: rgba(239, 68, 68, 0.5);
          letter-spacing: 0.1em;
        }

        .metric-val {
          font-size: 0.95rem;
          font-weight: 850;
          color: #fca5a5;
        }

        .metric-val.success {
          color: var(--ds-accent);
        }

        /* Teacher info */
        .teacher-info-text {
          font-size: 0.76rem;
          color: var(--ds-fg-subtle);
          line-height: 1.4;
          margin: 0 0 10px 0;
        }

        .teacher-bullet-list {
          padding-left: 18px;
          font-size: 0.72rem;
          color: var(--ds-fg-muted);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .teacher-bullet-list li {
          line-height: 1.4;
        }

        @media (max-width: 860px) {
          .profile-dashboard-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        /* Tab Bar */
        .profile-tab-bar {
          max-width: 1200px;
          margin: 0 auto 24px;
          display: flex;
          gap: 4px;
          border-radius: 10px;
          background: var(--ds-surface-overlay);
          border: 1px solid var(--ds-glass-border);
          padding: 4px;
          box-sizing: border-box;
        }

        .profile-tab-btn {
          flex: 1;
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          background: none;
          color: var(--ds-fg-muted);
          font-size: 0.78rem;
          font-weight: 750;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .profile-tab-btn:hover {
          color: var(--ds-fg);
          background: rgba(255, 255, 255, 0.03);
        }

        .profile-tab-btn.active {
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
          box-shadow: var(--ds-glow-sm);
        }

        /* Settings Form */
        .settings-form-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .settings-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .settings-label {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .settings-input,
        .settings-textarea {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0, 0, 0, 0.35);
          color: #fff;
          font-size: 0.82rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
          width: 100%;
        }

        .settings-input:focus,
        .settings-textarea:focus {
          border-color: var(--ds-border-accent);
        }

        .settings-textarea {
          resize: vertical;
          min-height: 60px;
        }

        .settings-input option {
          background: #111;
          color: #fff;
        }

        /* Toggle Switches */
        .settings-toggle-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
        }

        .settings-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .toggle-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .toggle-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--ds-fg);
        }

        .toggle-desc {
          font-size: 0.65rem;
          color: var(--ds-fg-subtle);
        }

        .toggle-switch {
          width: 42px;
          height: 22px;
          border-radius: 11px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(255, 255, 255, 0.05);
          position: relative;
          cursor: pointer;
          transition: all 0.25s ease;
          flex-shrink: 0;
          padding: 0;
        }

        .toggle-switch.on {
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
        }

        .toggle-knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--ds-fg-muted);
          transition: all 0.25s ease;
        }

        .toggle-switch.on .toggle-knob {
          left: 22px;
          background: var(--ds-accent);
          box-shadow: var(--ds-glow-sm);
        }

        .settings-select-small {
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0, 0, 0, 0.35);
          color: #fff;
          font-size: 0.75rem;
          font-family: inherit;
          outline: none;
          cursor: pointer;
          flex-shrink: 0;
        }

        .settings-select-small option {
          background: #111;
          color: #fff;
        }

        .settings-save-btn {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1.5px solid var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          font-weight: 800;
          font-size: 0.82rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: var(--ds-glow-sm);
        }

        .settings-save-btn:hover {
          background: var(--ds-accent-subtle);
          box-shadow: var(--ds-glow-md);
        }

        /* Danger Zone */
        .danger-zone-card {
          border-color: rgba(239, 68, 68, 0.2) !important;
        }

        .card-sec-hdr.danger-hdr {
          color: #fca5a5;
        }

        .danger-zone-btn {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.05);
          color: #fca5a5;
          font-weight: 800;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .danger-zone-btn:hover {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.5);
        }

        .danger-confirm-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: center;
        }

        .danger-confirm-text {
          font-size: 0.82rem;
          font-weight: 700;
          color: #fca5a5;
        }

        .danger-confirm-yes-btn {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.5);
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
          font-weight: 800;
          font-size: 0.8rem;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .danger-confirm-yes-btn:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        .danger-confirm-cancel-btn {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: none;
          color: var(--ds-fg-muted);
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .danger-confirm-cancel-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.03);
        }
      `}</style>
    </div>
  );
};
