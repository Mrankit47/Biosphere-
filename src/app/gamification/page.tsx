'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { JOURNEYS } from '@/data/learningPaths'
import { getUserProgress, getOrCreateUserId, UserProgressData } from '@/utils/supabase'
import { BackLink } from '@/components/ds'

interface AchievementConfig {
  id: string
  name: string
  desc: string
  icon: string
  xp: number
  check: boolean
  progress: string
}

interface LeaderboardUser {
  rank: number
  name: string
  level: number
  xp: number
  isSelf: boolean
  avatar: string
}

export default function GamificationDashboard() {
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState<UserProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  // Local storage flags loaded on client
  const [labPhotosynthesisCert, setLabPhotosynthesisCert] = useState(false)
  const [labCatalysisCert, setLabCatalysisCert] = useState(false)
  const [bookmarksCount, setBookmarksCount] = useState(0)
  const [tutorTalked, setTutorTalked] = useState(false)

  useEffect(() => {
    setMounted(true)
    const userId = getOrCreateUserId()
    
    // Fetch progress from database
    getUserProgress(userId)
      .then(data => {
        setProgress(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load progress:', err)
        setLoading(false)
      })

    // Load local storage states
    if (typeof window !== 'undefined') {
      setLabPhotosynthesisCert(localStorage.getItem('biosphere_lab_cert_photosynthesis') === 'true')
      setLabCatalysisCert(localStorage.getItem('biosphere_lab_cert_catalysis') === 'true')
      setTutorTalked(localStorage.getItem('biosphere_tutor_talked') === 'true')
      try {
        const bms = JSON.parse(localStorage.getItem('biosphere_bookmarks') || '[]')
        setBookmarksCount(bms.length)
      } catch {}
    }
  }, [])

  // Calculate dynamic XP and Leveling
  const stats = useMemo(() => {
    const completedLessonsCount = progress?.completed_lessons?.length || 0
    const completedQuizzesCount = Object.keys(progress?.quiz_scores || {}).length
    const labCertsCount = (labPhotosynthesisCert ? 1 : 0) + (labCatalysisCert ? 1 : 0)

    // Base XP rules
    const lessonXp = completedLessonsCount * 100
    const quizXp = completedQuizzesCount * 200
    const labXp = labCertsCount * 150
    const bookmarkXp = bookmarksCount * 30
    const tutorXp = tutorTalked ? 50 : 0

    const totalXp = lessonXp + quizXp + labXp + bookmarkXp + tutorXp
    
    // 500 XP per level
    const level = Math.floor(totalXp / 500) + 1
    const nextLevelXp = level * 500
    const currentLevelBaseXp = (level - 1) * 500
    const levelXpProgress = totalXp - currentLevelBaseXp
    const levelProgressPercent = Math.round((levelXpProgress / 500) * 100)

    // Streak logic (baseline mock streak of 3 if they have completed anything, otherwise 0)
    const hasActivity = completedLessonsCount > 0 || bookmarksCount > 0 || labCertsCount > 0
    const streak = hasActivity ? 3 + (completedLessonsCount % 3) : 0

    return {
      totalXp,
      level,
      nextLevelXp,
      levelXpProgress,
      levelProgressPercent,
      streak,
      completedLessonsCount,
      completedQuizzesCount,
      labCertsCount
    }
  }, [progress, labPhotosynthesisCert, labCatalysisCert, bookmarksCount, tutorTalked])

  // Achievements calculations
  const achievements = useMemo<AchievementConfig[]>(() => {
    return [
      {
        id: 'first_step',
        name: 'First Milestone',
        desc: 'Read and completed your first guided curriculum lesson.',
        icon: '🎬',
        xp: 100,
        check: stats.completedLessonsCount > 0,
        progress: `${stats.completedLessonsCount > 0 ? 1 : 0}/1`
      },
      {
        id: 'cell_expert',
        name: 'Cellular Expert',
        desc: 'Complete all cell biology lessons inside the guided paths.',
        icon: '🔬',
        xp: 250,
        check: !!(progress?.completed_lessons?.includes('cell-intro') && progress?.completed_lessons?.includes('cell-organelles')),
        progress: `${(progress?.completed_lessons?.includes('cell-intro') ? 1 : 0) + (progress?.completed_lessons?.includes('cell-organelles') ? 1 : 0)}/2`
      },
      {
        id: 'dna_master',
        name: 'DNA Master',
        desc: 'Score a perfect 3/3 on the Genetics double helix quiz.',
        icon: '🧬',
        xp: 300,
        check: progress?.quiz_scores?.['genetics-quiz-1'] === 3,
        progress: `${progress?.quiz_scores?.['genetics-quiz-1'] || 0}/3`
      },
      {
        id: 'lab_cert',
        name: 'Lab Practitioner',
        desc: 'Rerun and certify on a Virtual Lab experiment.',
        icon: '🧪',
        xp: 200,
        check: stats.labCertsCount > 0,
        progress: `${stats.labCertsCount > 0 ? 1 : 0}/1`
      },
      {
        id: 'lexicon_schol',
        name: 'Lexicon Scholar',
        desc: 'Bookmark at least 3 terms in the Biology Dictionary.',
        icon: '📖',
        xp: 150,
        check: bookmarksCount >= 3,
        progress: `${Math.min(3, bookmarksCount)}/3`
      },
      {
        id: 'grad',
        name: 'Curriculum Graduate',
        desc: 'Complete all 4 lessons across the syllabus.',
        icon: '🎓',
        xp: 500,
        check: stats.completedLessonsCount >= 4,
        progress: `${stats.completedLessonsCount}/4`
      }
    ]
  }, [progress, stats, bookmarksCount])

  // Daily Challenges status
  const dailyChallenges = useMemo(() => {
    return [
      {
        id: 'bookmark_word',
        title: 'Dictionary Scholar',
        desc: 'Save any vocabulary term in the dictionary.',
        xp: 50,
        check: bookmarksCount > 0,
        progress: bookmarksCount > 0 ? '1/1' : '0/1',
        actionUrl: '/dictionary',
        actionLabel: 'Open Dictionary'
      },
      {
        id: 'lab_trial',
        title: 'Virtual Lab Experiment',
        desc: 'Rerun a photosynthesis or catalysis beaker simulation.',
        xp: 100,
        check: stats.labCertsCount > 0,
        progress: stats.labCertsCount > 0 ? '1/1' : '0/1',
        actionUrl: '/virtual-lab',
        actionLabel: 'Run Sim'
      },
      {
        id: 'tutor_talk',
        title: 'Tutor Consult',
        desc: 'Ask our AI tutor a question about cellular structures.',
        xp: 80,
        check: tutorTalked,
        progress: tutorTalked ? '1/1' : '0/1',
        actionUrl: '/tutor',
        actionLabel: 'Ask Tutor'
      }
    ]
  }, [bookmarksCount, stats.labCertsCount, tutorTalked])

  // Simulated Multiplayer Leaderboard
  const leaderboard = useMemo<LeaderboardUser[]>(() => {
    const list: LeaderboardUser[] = [
      { rank: 1, name: 'BioMaster99', level: 6, xp: 2840, isSelf: false, avatar: '🧬' },
      { rank: 2, name: 'HelixCoder', level: 5, xp: 2150, isSelf: false, avatar: '🌿' },
      { rank: 3, name: 'OrganelleQueen', level: 3, xp: 1240, isSelf: false, avatar: '🔬' },
      { rank: 4, name: 'EcosystemPro', level: 1, xp: 320, isSelf: false, avatar: '🌳' }
    ]

    // Push self into the list dynamically
    const self: LeaderboardUser = {
      rank: 0,
      name: 'Guest Student (You)',
      level: stats.level,
      xp: stats.totalXp,
      isSelf: true,
      avatar: '🏆'
    }

    const merged = [...list, self].sort((a, b) => b.xp - a.xp)
    
    // Assign sorted ranks
    return merged.map((user, idx) => ({
      ...user,
      rank: idx + 1
    }))
  }, [stats.totalXp, stats.level])

  if (!mounted || loading) {
    return (
      <div className="sim-loading-container">
        <div className="pulse-dot" />
        <span className="loading-text">Loading academy scorecard...</span>
      </div>
    )
  }

  return (
    <div className="game-root">
      <div className="game-grid-bg" />
      <div className="game-glow-effect" />

      {/* HEADER */}
      <header className="game-header">
        <div className="header-left">
          <BackLink href="/" label="Home" />
          <div>
            <h1 className="header-title">ACADEMY PROFILE HUB</h1>
            <p className="header-subtitle">XP, STREAKS, AND LEVEL ACHIEVEMENTS</p>
          </div>
        </div>
      </header>

      {/* DASHBOARD LAYOUT */}
      <main className="game-dashboard-layout">
        {/* ROW 1: XP Progress circular gauge & Streak tracker */}
        <section className="dashboard-row-top">
          {/* Level Widget */}
          <div className="panel-card glassmorphic progress-widget">
            <div className="gauge-outer">
              <div className="gauge-inner">
                <span className="level-lbl">LEVEL</span>
                <span className="level-val">{stats.level}</span>
              </div>
            </div>
            <div className="progress-details">
              <div className="progress-bar-row">
                <span className="progress-metric">{stats.totalXp} XP Total</span>
                <span className="progress-metric">{stats.levelXpProgress} / 500 XP</span>
              </div>
              <div className="gauge-bar-track">
                <div className="gauge-bar-fill" style={{ width: `${stats.levelProgressPercent}%` }} />
              </div>
              <p className="gauge-sub-notes">Earn {500 - stats.levelXpProgress} XP to reach Level {stats.level + 1}</p>
            </div>
          </div>

          {/* Streak Widget */}
          <div className="panel-card glassmorphic streak-widget">
            <div className="streak-badge-box">
              <span className="streak-flame">🔥</span>
              <div className="streak-meta">
                <span className="streak-count">{stats.streak} Day Streak</span>
                <span className="streak-label">Keep up the daily study!</span>
              </div>
            </div>

            <div className="streak-week-grid">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                // Mock active check boxes: highlight today (Sunday mock) and a few weekdays if streak exists
                const isActive = stats.streak > 0 && (idx === 0 || idx === 2 || idx === 3 || idx === 6)
                return (
                  <div key={idx} className={`week-box ${isActive ? 'active' : ''}`}>
                    <span className="box-day">{day}</span>
                    <div className="box-circle">{isActive ? '✓' : ''}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ROW 2: Daily Challenges & Achievements wall */}
        <section className="dashboard-row-middle">
          {/* Daily Challenges Checklist */}
          <div className="panel-card glassmorphic challenges-card">
            <h3 className="panel-section-title">🎯 Daily Challenges</h3>
            <div className="challenges-list">
              {dailyChallenges.map((challenge, idx) => (
                <div key={challenge.id} className={`challenge-row-item ${challenge.check ? 'done' : ''}`}>
                  <div className="chk-col">
                    <div className="chk-box">{challenge.check ? '✓' : ''}</div>
                  </div>
                  <div className="info-col">
                    <span className="chk-title">{challenge.title}</span>
                    <p className="chk-desc">{challenge.desc}</p>
                    <span className="chk-xp">Reward: +{challenge.xp} XP</span>
                  </div>
                  <div className="action-col">
                    {!challenge.check ? (
                      <Link href={challenge.actionUrl} className="challenge-action-link">
                        {challenge.actionLabel}
                      </Link>
                    ) : (
                      <span className="claimed-badge">Completed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Wall Grid */}
          <div className="panel-card glassmorphic achievements-wall-card">
            <h3 className="panel-section-title">🏆 Academy Badges Wall</h3>
            <div className="achievements-wall-grid">
              {achievements.map(ach => (
                <div key={ach.id} className={`wall-badge-card ${ach.check ? 'unlocked' : 'locked'}`} title={ach.desc}>
                  <div className="badge-icon-box">
                    <span className="badge-icon-face">{ach.icon}</span>
                  </div>
                  <div className="badge-meta-wrap">
                    <span className="badge-name">{ach.name}</span>
                    <span className="badge-progress-str">Tasks: {ach.progress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROW 3: Multiplayer Leaderboard Ladder */}
        <section className="dashboard-row-bottom">
          <div className="panel-card glassmorphic leaderboard-card">
            <h3 className="panel-section-title">⚡ Academy Leaderboard Ladder</h3>
            <p className="leaderboard-subtitle-text">Compete against other students in the Biosphere curriculum paths.</p>

            <div className="leaderboard-list">
              {leaderboard.map(user => (
                <div key={user.rank} className={`leaderboard-row-item ${user.isSelf ? 'self-row' : ''}`}>
                  <span className="user-rank">#{user.rank}</span>
                  <span className="user-avatar">{user.avatar}</span>
                  <span className="user-name">{user.name}</span>
                  <div className="user-score-box">
                    <span className="user-lvl">Lvl {user.level}</span>
                    <span className="user-xp">{user.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .game-root {
          background: var(--ds-bg-primary);
          min-height: calc(100vh - 64px);
          color: var(--ds-fg);
          position: relative;
          overflow-x: hidden;
          font-family: inherit;
        }

        .game-grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(57, 255, 20, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57, 255, 20, 0.015) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
          z-index: 0;
        }

        .game-glow-effect {
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: min(850px, 90vw);
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(57, 255, 20, 0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .game-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 2rem 0.5rem;
          border-bottom: 1px solid var(--ds-border-muted);
          position: relative;
          z-index: 2;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-btn {
          color: var(--ds-accent);
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 6px 14px;
          border-radius: 8px;
          background: var(--ds-accent-faint);
          border: 1px solid var(--ds-border-accent);
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: rgba(57, 255, 20, 0.12);
          box-shadow: var(--ds-glow-sm);
        }

        .divider-line {
          width: 1px;
          height: 32px;
          background: var(--ds-border-muted);
        }

        .header-title {
          font-size: 1.25rem;
          font-weight: 900;
          color: #fff;
          margin: 0;
          letter-spacing: 0.03em;
        }

        .header-subtitle {
          font-size: 0.6rem;
          color: var(--ds-accent);
          margin: 0;
          letter-spacing: 0.25em;
          font-weight: 700;
        }

        /* DASHBOARD LAYOUT */
        .game-dashboard-layout {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 960px;
          margin: 0 auto;
          padding: 2rem 24px 60px;
          position: relative;
          z-index: 2;
        }

        .panel-card {
          border-radius: 16px;
          border: 1px solid var(--ds-border-muted);
          background: var(--ds-surface-overlay);
          backdrop-filter: blur(12px);
          box-sizing: border-box;
          padding: 1.5rem;
        }

        .glassmorphic {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }

        .panel-section-title {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0 1rem 0;
          border-bottom: 1px solid var(--ds-border-muted);
          padding-bottom: 8px;
        }

        /* ROW 1: TOP PROGRESS & STREAK */
        .dashboard-row-top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .progress-widget {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .gauge-outer {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 4px solid var(--ds-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--ds-accent-faint);
          box-shadow: var(--ds-glow-sm);
          flex-shrink: 0;
        }

        .gauge-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .level-lbl {
          font-size: 0.5rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.08em;
        }

        .level-val {
          font-size: 2rem;
          font-weight: 900;
          color: #fff;
          line-height: 1;
        }

        .progress-details {
          flex: 1;
        }

        .progress-bar-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          margin-bottom: 6px;
        }

        .progress-metric {
          font-weight: 700;
          color: #fff;
        }

        .gauge-bar-track {
          height: 6px;
          border-radius: 3px;
          background: var(--ds-surface-subtle);
          width: 100%;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .gauge-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--ds-accent), var(--ds-accent-muted));
          border-radius: 3px;
          box-shadow: var(--ds-glow-sm);
        }

        .gauge-sub-notes {
          margin: 0;
          font-size: 0.68rem;
          color: var(--ds-fg-subtle);
        }

        .streak-widget {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 16px;
        }

        .streak-badge-box {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .streak-flame {
          font-size: 2.2rem;
          text-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
          animation: pulse-flame 1s infinite alternate;
        }

        @keyframes pulse-flame {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.08); }
        }

        .streak-meta {
          display: flex;
          flex-direction: column;
        }

        .streak-count {
          font-size: 1.15rem;
          font-weight: 800;
          color: #fff;
        }

        .streak-label {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
        }

        .streak-week-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }

        .week-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          border-radius: 6px;
          padding: 6px 4px;
          opacity: 0.45;
        }

        .week-box.active {
          opacity: 1.0;
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
        }

        .box-day {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
        }

        .box-circle {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--ds-surface-raised);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.58rem;
          color: var(--ds-accent);
          font-weight: 800;
        }

        .week-box.active .box-circle {
          background: var(--ds-accent-faint);
        }

        /* ROW 2: CHALLENGES & BADGES */
        .dashboard-row-middle {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 1.5rem;
        }

        .challenges-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .challenge-row-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          padding: 12px;
          transition: all 0.2s;
        }

        .challenge-row-item.done {
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
        }

        .chk-box {
          width: 18px;
          height: 18px;
          border: 1px solid var(--ds-border-muted);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--ds-accent);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .challenge-row-item.done .chk-box {
          border-color: var(--ds-accent);
          background: var(--ds-accent-faint);
        }

        .info-col {
          flex: 1;
        }

        .chk-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #fff;
          display: block;
        }

        .challenge-row-item.done .chk-title {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: line-through;
        }

        .chk-desc {
          margin: 0;
          font-size: 0.68rem;
          color: var(--ds-fg-subtle);
          line-height: 1.35;
        }

        .chk-xp {
          font-size: 0.6rem;
          color: var(--ds-accent);
          font-family: monospace;
          margin-top: 2px;
          display: block;
        }

        .challenge-action-link {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--ds-accent);
          text-decoration: none;
          padding: 4px 10px;
          border-radius: 4px;
          background: var(--ds-accent-faint);
          border: 1px solid var(--ds-border-accent);
          white-space: nowrap;
        }

        .challenge-action-link:hover {
          background: var(--ds-accent-subtle);
        }

        .claimed-badge {
          font-size: 0.6rem;
          text-transform: uppercase;
          background: var(--ds-surface-subtle);
          color: var(--ds-fg-subtle);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
        }

        .achievements-wall-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .wall-badge-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 6px;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          transition: all 0.25s ease;
          text-align: center;
        }

        .wall-badge-card.unlocked {
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
          box-shadow: var(--ds-glow-sm);
        }

        .wall-badge-card.locked {
          opacity: 0.35;
        }

        .badge-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid var(--ds-border-muted);
          background: var(--ds-surface-raised);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 6px;
        }

        .wall-badge-card.unlocked .badge-icon-box {
          border-color: var(--ds-accent);
          background: var(--ds-accent-faint);
          box-shadow: var(--ds-glow-sm);
        }

        .badge-icon-face {
          font-size: 1.25rem;
        }

        .badge-name {
          font-size: 0.72rem;
          font-weight: 700;
          color: #fff;
          display: block;
        }

        .wall-badge-card.unlocked .badge-name {
          color: var(--ds-accent);
        }

        .badge-progress-str {
          font-size: 0.58rem;
          color: var(--ds-fg-subtle);
          font-family: monospace;
          margin-top: 2px;
          display: block;
        }

        /* ROW 3: LEADERBOARD LADDER */
        .leaderboard-subtitle-text {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          margin: -8px 0 16px 0;
        }

        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .leaderboard-row-item {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          border-radius: 8px;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
        }

        .leaderboard-row-item.self-row {
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
          box-shadow: var(--ds-glow-sm);
        }

        .user-rank {
          font-family: monospace;
          font-size: 0.78rem;
          font-weight: 800;
          width: 32px;
          color: var(--ds-fg-subtle);
        }

        .leaderboard-row-item.self-row .user-rank {
          color: var(--ds-accent);
        }

        .user-avatar {
          font-size: 1.1rem;
          width: 24px;
          text-align: center;
          margin-right: 12px;
        }

        .user-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: #fff;
          flex: 1;
        }

        .leaderboard-row-item.self-row .user-name {
          color: var(--ds-accent);
          font-weight: 700;
        }

        .user-score-box {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-lvl {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--ds-fg-subtle);
          background: var(--ds-surface-raised);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .user-xp {
          font-size: 0.78rem;
          font-family: monospace;
          font-weight: 700;
          color: var(--ds-accent);
          width: 60px;
          text-align: right;
        }

        /* LOADING ASSIST */
        .sim-loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: var(--ds-bg-primary);
        }

        .pulse-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--ds-accent);
          box-shadow: var(--ds-glow-sm);
          animation: pulse-dot-key 1.5s infinite ease-in-out;
        }

        @keyframes pulse-dot-key {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1.0; }
        }

        .loading-text {
          color: var(--ds-fg-subtle);
          font-size: 0.9rem;
          margin-top: 12px;
        }

        /* RESPONSIVE */
        @media (max-width: 860px) {
          .dashboard-row-top {
            grid-template-columns: 1fr;
          }
          .dashboard-row-middle {
            grid-template-columns: 1fr;
          }
          .achievements-wall-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .game-dashboard-layout {
            padding: 1rem;
            gap: 1rem;
          }
          .game-header {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
