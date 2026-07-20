'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { JOURNEYS } from '@/data/learningPaths'
import { getUserProgress, getOrCreateUserId, UserProgressData } from '@/utils/supabase'
import { BackLink } from '@/components/ds'
import { BioIcon } from '@/components/ui/navigation/BioIcon'

export default function LearningPathsDashboard() {
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState<UserProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'journey' | 'engine'>('journey')

  // Load progress
  useEffect(() => {
    setMounted(true)
    const userId = getOrCreateUserId()
    getUserProgress(userId)
      .then(data => {
        setProgress(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load progress:', err)
        setLoading(false)
      })
  }, [])

  // Calculate statistics
  const totalLessons = useMemo(() => JOURNEYS.reduce((acc, j) => acc + j.lessons.length, 0), [])
  const totalQuizzes = useMemo(() => JOURNEYS.reduce((acc, j) => acc + j.quizzes.length, 0), [])
  const completedLessonsCount = progress?.completed_lessons?.length || 0
  const completedQuizzesCount = Object.keys(progress?.quiz_scores || {}).length

  const totalMilestones = totalLessons + totalQuizzes
  const completedMilestones = completedLessonsCount + completedQuizzesCount
  const overallPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

  // Continue Learning URL helper
  const continueUrlInfo = useMemo(() => {
    let url = '/learning-paths/cell-biology/lessons/cell-intro'
    let label = 'Start Learning'
    
    if (progress?.last_active_path && progress?.last_active_lesson) {
      url = `/learning-paths/${progress.last_active_path}/lessons/${progress.last_active_lesson}`
      const activeJourney = JOURNEYS.find(j => j.id === progress.last_active_path)
      const activeLesson = activeJourney?.lessons.find(l => l.id === progress.last_active_lesson)
      label = activeLesson ? `Continue: ${activeLesson.title}` : 'Continue Learning'
    } else if (completedLessonsCount > 0) {
      let found = false
      for (const j of JOURNEYS) {
        for (const l of j.lessons) {
          if (progress && !progress.completed_lessons.includes(l.id)) {
            url = `/learning-paths/${j.id}/lessons/${l.id}`
            label = `Next: ${l.title}`
            found = true
            break
          }
        }
        if (found) break
      }
    }
    return { url, label }
  }, [progress, completedLessonsCount])

  // Recommendations Logic
  const recommendations = useMemo(() => {
    const recs = []
    
    // Check cell biology
    const cellBio = JOURNEYS.find(j => j.id === 'cell-biology')
    if (cellBio) {
      const cellIntroDone = progress?.completed_lessons?.includes('cell-intro')
      const cellOrgDone = progress?.completed_lessons?.includes('cell-organelles')
      const cellQuizDone = progress?.quiz_scores && progress.quiz_scores['cell-quiz-1'] !== undefined

      if (!cellIntroDone) {
        recs.push({
          title: 'Master Cell Basics',
          desc: 'Get introduced to prokaryotic and eukaryotic cellular structures.',
          url: '/learning-paths/cell-biology/lessons/cell-intro',
          tag: 'Beginner Recommendation',
          icon: '🔬'
        })
      } else if (!cellOrgDone) {
        recs.push({
          title: 'Examine Cell Organelles',
          desc: 'Study the mitochondria, nucleus, ER, and Golgi under the scanner.',
          url: '/learning-paths/cell-biology/lessons/cell-organelles',
          tag: 'Next Lesson',
          icon: '📦'
        })
      } else if (!cellQuizDone) {
        recs.push({
          title: 'Challenge Cell Structure Basics',
          desc: 'Take the cell quiz to earn your cell biology milestone.',
          url: '/learning-paths/cell-biology/quizzes/cell-quiz-1',
          tag: 'Pending Evaluation',
          icon: '📝'
        })
      }
    }

    // Check genetics
    const genetics = JOURNEYS.find(j => j.id === 'genetics')
    if (genetics) {
      const dnaStrDone = progress?.completed_lessons?.includes('dna-structure')
      const geneInheritDone = progress?.completed_lessons?.includes('genes-inheritance')
      const geneticsQuizDone = progress?.quiz_scores && progress.quiz_scores['genetics-quiz-1'] !== undefined

      if (progress?.completed_lessons?.includes('cell-organelles')) {
        if (!dnaStrDone) {
          recs.push({
            title: 'Deconstruct DNA Helix',
            desc: 'Learn about base-pairing (A-T, G-C) and phosphate backbones.',
            url: '/learning-paths/genetics/lessons/dna-structure',
            tag: 'Highly Recommended',
            icon: '🧬'
          })
        } else if (!geneInheritDone) {
          recs.push({
            title: 'Analyze Gene Inheritance',
            desc: 'Understand codons, inheritance, and protein translations.',
            url: '/learning-paths/genetics/lessons/genes-inheritance',
            tag: 'Next Lesson',
            icon: '🌱'
          })
        } else if (!geneticsQuizDone) {
          recs.push({
            title: 'Genetics Milestone Evaluation',
            desc: 'Test your base-pairing knowledge and earn the Genetics badge.',
            url: '/learning-paths/genetics/quizzes/genetics-quiz-1',
            tag: 'Pending Evaluation',
            icon: '📝'
          })
        }
      }
    }

    // Fallback recommendation
    if (recs.length === 0) {
      recs.push({
        title: 'Review Disease Specimens',
        desc: 'Explore micro-pathologies and anatomical affected maps.',
        url: '/disease-explorer',
        tag: 'Research Extension',
        icon: '🏥'
      })
    }

    return recs
  }, [progress])

  // Weak Topics Analysis (auditing quiz failures/low scores)
  const weakTopics = useMemo(() => {
    const list = []

    // Audit Cell Quiz (cell-quiz-1)
    const cellScore = progress?.quiz_scores?.['cell-quiz-1']
    if (cellScore !== undefined && cellScore < 3) {
      list.push({
        topic: 'Organelle Functions & Cell Classifications',
        score: `${cellScore}/3`,
        reviewUrl: '/learning-paths/cell-biology/lessons/cell-organelles',
        reviewLabel: 'Review Organelles',
        reason: 'Low score on Cell Basics evaluation.'
      })
    }

    // Audit Genetics Quiz (genetics-quiz-1)
    const geneticsScore = progress?.quiz_scores?.['genetics-quiz-1']
    if (geneticsScore !== undefined && geneticsScore < 3) {
      list.push({
        topic: 'Complementary Base Pairing & DNA Backbones',
        score: `${geneticsScore}/3`,
        reviewUrl: '/learning-paths/genetics/lessons/dna-structure',
        reviewLabel: 'Review DNA Helix',
        reason: 'Base pairing questions answered incorrectly.'
      })
    }

    return list
  }, [progress])

  // Achievements Board Linked to Local Storage & Database progress
  const achievements = useMemo(() => {
    if (typeof window === 'undefined') return []

    // 1. Lab cert check
    const labDone = localStorage.getItem('biosphere_lab_cert_photosynthesis') === 'true' ||
                    localStorage.getItem('biosphere_lab_cert_catalysis') === 'true'
    
    // 2. Bookmarks check
    let dictionaryDone = false
    try {
      dictionaryDone = JSON.parse(localStorage.getItem('biosphere_bookmarks') || '[]').length > 0
    } catch {}

    return [
      {
        id: 'first_step',
        name: 'First Milestone',
        desc: 'Complete your first lesson.',
        check: completedLessonsCount > 0,
        progress: `${completedLessonsCount > 0 ? 1 : 0}/1`,
        icon: '🎬'
      },
      {
        id: 'cell_expert',
        name: 'Cellular Expert',
        desc: 'Complete all cell biology lessons.',
        check: progress?.completed_lessons?.includes('cell-intro') && progress?.completed_lessons?.includes('cell-organelles'),
        progress: `${(progress?.completed_lessons?.includes('cell-intro') ? 1 : 0) + (progress?.completed_lessons?.includes('cell-organelles') ? 1 : 0)}/2`,
        icon: '🔬'
      },
      {
        id: 'dna_master',
        name: 'DNA Master',
        desc: 'Score a perfect 3/3 on the Genetics Quiz.',
        check: progress?.quiz_scores?.['genetics-quiz-1'] === 3,
        progress: `${progress?.quiz_scores?.['genetics-quiz-1'] || 0}/3`,
        icon: '🧬'
      },
      {
        id: 'lab_cert',
        name: 'Lab Practitioner',
        desc: 'Complete a Virtual Lab Simulation quiz.',
        check: labDone,
        progress: labDone ? '1/1' : '0/1',
        icon: '🧪'
      },
      {
        id: 'lexicon_schol',
        name: 'Lexicon Scholar',
        desc: 'Bookmark a term in the Biology Dictionary.',
        check: dictionaryDone,
        progress: dictionaryDone ? '1/1' : '0/1',
        icon: '📖'
      },
      {
        id: 'grad',
        name: 'Curriculum Graduate',
        desc: 'Complete all 4 lessons across the syllabus.',
        check: completedLessonsCount >= 4,
        progress: `${completedLessonsCount}/4`,
        icon: '🎓'
      }
    ]
  }, [progress, completedLessonsCount])

  if (!mounted || loading) {
    return (
      <div className="sim-loading-container">
        <div className="pulse-dot" />
        <span className="loading-text">Loading learning journeys...</span>
      </div>
    )
  }

  return (
    <div className="lp-root">
      <div className="lp-grid-bg" />
      <div className="lp-glow-effect" />

      <div className="lp-container">
        <BackLink href="/" label="Home" />
        {/* HEADER */}
        <header className="lp-header">
          <span className="lp-sup-title">Interactive Guided Curriculum</span>
          <h1 className="lp-title">LEARNING JOURNEYS</h1>
          <p className="lp-sub-title">Explore biology step-by-step with guided lessons, interactive 3D playgrounds, and quizzes.</p>
        </header>

        {/* STATS DASHBOARD SUMMARY CARD */}
        <section className="lp-stats-box glassmorphic">
          <div className="stats-main">
            <div className="progress-circle-wrap">
              <span className="pct-val">{overallPercentage}%</span>
              <span className="pct-lbl">Progress</span>
            </div>
            <div className="stats-summary-meta">
              <h2>BIOSPHERE SCORECARD</h2>
              <p>Complete lessons and pass quizzes to unlock milestones across journeys.</p>
              
              <div className="scorecard-grid">
                <div className="scorecard-item">
                  <span className="item-val">{completedLessonsCount} / {totalLessons}</span>
                  <span className="item-lbl">Lessons Completed</span>
                </div>
                <div className="scorecard-item">
                  <span className="item-val">{completedQuizzesCount} / {totalQuizzes}</span>
                  <span className="item-lbl">Quizzes Passed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-cta">
            <span className="cta-subtitle">Ready to jump back in?</span>
            <h3 className="cta-title">Resume last module</h3>
            <Link href={continueUrlInfo.url} className="cta-btn">
              ⚡ {continueUrlInfo.label}
            </Link>
          </div>
        </section>

        {/* NAVIGATION TAB CONTROLLER */}
        <div className="lp-tab-bar">
          <button
            onClick={() => setActiveTab('journey')}
            className={`tab-btn ${activeTab === 'journey' ? 'active' : ''}`}
          >
            🗺️ Curriculum Journeys
          </button>
          <button
            onClick={() => setActiveTab('engine')}
            className={`tab-btn ${activeTab === 'engine' ? 'active' : ''}`}
          >
            ⚡ Personalized Analysis Hub
          </button>
        </div>

        {activeTab === 'journey' ? (
          /* CURRICULUM JOURNEY SELECTION */
          <section className="journeys-section">
            <h2 className="section-title">Select a Learning Journey</h2>
            <div className="journeys-grid">
              {JOURNEYS.map(j => {
                const journeyLessons = j.lessons.length
                const journeyQuizzes = j.quizzes.length
                const journeyTotal = journeyLessons + journeyQuizzes
                
                const completedLessonsInJourney = j.lessons.filter(l => progress?.completed_lessons?.includes(l.id)).length
                const completedQuizzesInJourney = j.quizzes.filter(q => progress?.quiz_scores && progress.quiz_scores[q.id] !== undefined).length
                const completedInJourney = completedLessonsInJourney + completedQuizzesInJourney
                
                const journeyPercent = journeyTotal > 0 ? Math.round((completedInJourney / journeyTotal) * 100) : 0

                return (
                  <Link
                    key={j.id}
                    href={`/learning-paths/${j.id}`}
                    className="journey-card glassmorphic"
                    style={{ borderColor: `${j.color}15` }}
                  >
                    <div className="card-icon-box flex items-center justify-center" style={{ background: `${j.color}10`, color: j.color }}>
                      <BioIcon name={j.icon} size={26} />
                    </div>
                    
                    <div className="card-body">
                      <h3 className="card-title">{j.title}</h3>
                      <p className="card-desc">{j.description}</p>
                      
                      <div className="card-progress-wrap">
                        <div className="progress-text-row">
                          <span className="count-lbl">{completedInJourney} of {journeyTotal} modules</span>
                          <span className="percent-lbl" style={{ color: j.color }}>{journeyPercent}%</span>
                        </div>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${journeyPercent}%`, background: `linear-gradient(90deg, ${j.color}aa, ${j.color})`, boxShadow: `0 0 10px ${j.color}40` }} />
                        </div>
                      </div>
                    </div>

                    <div className="card-arrow" style={{ color: j.color }}>➔</div>
                  </Link>
                )
              })}
            </div>
          </section>
        ) : (
          /* PERSONALIZED INTELLIGENCE HUB */
          <section className="engine-section">
            <div className="engine-grid">
              {/* LEFT COLUMN: Recommendations & Weak Topics Widgets */}
              <div className="engine-left-col">
                {/* Recommendations Widget */}
                <div className="engine-card glassmorphic">
                  <h3 className="card-section-title">🎯 Recommendations</h3>
                  <div className="recs-list">
                    {recommendations.map((rec, idx) => (
                      <div key={idx} className="rec-row">
                        <span className="rec-icon">{rec.icon}</span>
                        <div className="rec-body">
                          <span className="rec-tag">{rec.tag}</span>
                          <h4 className="rec-title">{rec.title}</h4>
                          <p className="rec-desc">{rec.desc}</p>
                        </div>
                        <Link href={rec.url} className="rec-action-btn">
                          Go →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weak Topics Analysis Widget */}
                <div className="engine-card glassmorphic">
                  <h3 className="card-section-title">⚠️ Weak Topics Analysis</h3>
                  {weakTopics.length > 0 ? (
                    <div className="weak-topics-list">
                      {weakTopics.map((topic, idx) => (
                        <div key={idx} className="weak-row">
                          <div className="weak-head">
                            <span className="weak-title">{topic.topic}</span>
                            <span className="weak-score">Score: {topic.score}</span>
                          </div>
                          <p className="weak-reason">{topic.reason}</p>
                          <Link href={topic.reviewUrl} className="weak-review-btn">
                            📖 {topic.reviewLabel}
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-analysis-box">
                      <span className="check-shield-icon">🛡️</span>
                      <p className="empty-analysis-text">All checked milestones scoring perfectly. No critical weaknesses identified in your profile.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Achievements & Activity Heatmap Widgets */}
              <div className="engine-right-col">
                {/* Achievements board */}
                <div className="engine-card glassmorphic">
                  <h3 className="card-section-title">🏆 Achievements & Badges</h3>
                  <div className="achievements-grid-box">
                    {achievements.map(ach => (
                      <div key={ach.id} className={`ach-card ${ach.check ? 'unlocked' : 'locked'}`}>
                        <span className="ach-icon">{ach.icon}</span>
                        <div className="ach-info">
                          <span className="ach-name">{ach.name}</span>
                          <p className="ach-desc">{ach.desc}</p>
                          <span className="ach-progress-count">Progress: {ach.progress}</span>
                        </div>
                        <span className="ach-badge-status">{ach.check ? 'UNLOCKED' : 'LOCKED'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GitHub-style Activity Heatmap Widget */}
                <div className="engine-card glassmorphic">
                  <h3 className="card-section-title">📊 Active Learning Commit Heatmap</h3>
                  <p className="heatmap-sub-desc">Active study commitment tracking over the past 28-day cycle.</p>
                  
                  <div className="heatmap-container">
                    <div className="heatmap-grid">
                      {Array.from({ length: 28 }).map((_, idx) => {
                        // Highlight mock active days based on user completed count
                        const isActive = idx % 5 === 0 || (idx === 27 && completedLessonsCount > 0)
                        const level = isActive ? (idx % 2 === 0 ? 'medium' : 'high') : 'empty'
                        return (
                          <div
                            key={idx}
                            className={`heatmap-box ${level}`}
                            title={`Day ${idx + 1}: ${isActive ? 'Study completed' : 'No commits logged'}`}
                          />
                        )
                      })}
                    </div>
                    <div className="heatmap-labels-row">
                      <span>4 Weeks Ago</span>
                      <span>Today</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <style jsx global>{`
        .lp-root {
          background: var(--ds-bg-primary);
          min-height: calc(100vh - 64px);
          color: var(--ds-fg);
          position: relative;
          overflow-x: hidden;
          font-family: inherit;
          padding-top: 80px;
        }

        .lp-grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(57, 255, 20, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57, 255, 20, 0.015) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
          z-index: 0;
        }

        .lp-glow-effect {
          position: absolute;
          top: -150px;
          left: 50%;
          transform: translateX(-50%);
          width: min(800px, 90vw);
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(57, 255, 20, 0.05) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .lp-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px 80px;
          position: relative;
          z-index: 1;
        }

        .lp-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .lp-sup-title {
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ds-accent);
          fontWeight: 700;
          display: block;
          margin-bottom: 8px;
        }

        .lp-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          color: #fff;
          margin: 0;
          letter-spacing: 0.05em;
          text-shadow: var(--ds-glow-sm);
        }

        .lp-sub-title {
          font-size: 0.95rem;
          color: var(--ds-fg-muted);
          max-width: 600px;
          margin: 12px auto 0;
          line-height: 1.6;
        }

        /* SCORECARD CARD */
        .lp-stats-box {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 24px;
          background: var(--ds-surface-overlay);
          border: 1px solid var(--ds-border-muted);
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 40px;
        }

        .stats-main {
          display: flex;
          align-items: center;
          gap: 28px;
          flex-wrap: wrap;
        }

        .progress-circle-wrap {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          border: 4px solid var(--ds-border-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--ds-accent-faint);
          box-shadow: var(--ds-glow-sm);
          flex-shrink: 0;
        }

        .pct-val {
          font-size: 1.7rem;
          font-weight: 800;
          color: var(--ds-accent);
          text-shadow: var(--ds-glow-sm);
        }

        .pct-lbl {
          font-size: 0.55rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--ds-fg-subtle);
          margin-top: 2px;
        }

        .stats-summary-meta h2 {
          color: #fff;
          font-size: 1.15rem;
          margin: 0 0 4px 0;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .stats-summary-meta p {
          color: var(--ds-fg-muted);
          font-size: 0.8rem;
          margin: 0 0 16px 0;
        }

        .scorecard-grid {
          display: flex;
          gap: 24px;
        }

        .scorecard-item {
          display: flex;
          flex-direction: column;
        }

        .item-val {
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
        }

        .item-lbl {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          margin-top: 2px;
        }

        .stats-cta {
          border-left: 1px solid var(--ds-border-muted);
          padding-left: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .cta-subtitle {
          font-size: 0.72rem;
          color: var(--ds-accent);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-weight: 600;
        }

        .cta-title {
          color: #fff;
          font-size: 1.05rem;
          margin: 4px 0 16px 0;
          font-weight: 700;
        }

        .cta-btn {
          padding: 12px 20px;
          border-radius: 10px;
          background: linear-gradient(90deg, var(--ds-accent), var(--ds-accent-muted));
          color: #000;
          font-weight: 700;
          font-size: 0.85rem;
          text-align: center;
          text-decoration: none;
          box-shadow: var(--ds-glow-sm);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: var(--ds-glow-md);
        }

        /* TAB COONTROLLER */
        .lp-tab-bar {
          display: flex;
          gap: 12px;
          border-bottom: 1px solid var(--ds-border-muted);
          margin-bottom: 30px;
          padding-bottom: 8px;
        }

        .tab-btn {
          background: transparent;
          border: none;
          color: var(--ds-fg-muted);
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          padding: 8px 16px;
          position: relative;
          transition: color 0.2s;
        }

        .tab-btn:hover {
          color: #fff;
        }

        .tab-btn.active {
          color: var(--ds-accent);
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -9px;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--ds-accent);
        }

        /* JOURNEYS VIEW */
        .journeys-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .journey-card {
          display: flex;
          align-items: center;
          gap: 20px;
          background: var(--ds-surface-overlay);
          border: 1px solid var(--ds-border-muted);
          border-radius: 16px;
          padding: 20px 24px;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .journey-card:hover {
          border-color: var(--ds-accent) !important;
          background: var(--ds-surface-raised);
          transform: translateY(-1px);
        }

        .card-icon-box {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          flex-shrink: 0;
        }

        .card-body {
          flex: 1;
        }

        .card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 4px 0;
        }

        .card-desc {
          font-size: 0.82rem;
          color: var(--ds-fg-muted);
          margin: 0 0 14px 0;
          line-height: 1.5;
        }

        .card-progress-wrap {
          max-width: 350px;
        }

        .progress-text-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          margin-bottom: 4px;
        }

        .count-lbl {
          color: var(--ds-fg-subtle);
        }

        .percent-lbl {
          font-weight: 700;
        }

        .bar-track {
          height: 4px;
          border-radius: 2px;
          background: var(--ds-surface-subtle);
          width: 100%;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 2px;
        }

        .card-arrow {
          font-size: 1.2rem;
          opacity: 0.6;
          transition: transform 0.2s;
        }

        .journey-card:hover .card-arrow {
          transform: translateX(4px);
        }

        /* PERSONALIZED ENGINE VIEW */
        .engine-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .engine-left-col,
        .engine-right-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .engine-card {
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid var(--ds-border-muted);
          background: var(--ds-surface-overlay);
        }

        .card-section-title {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0 1.25rem 0;
          border-bottom: 1px solid var(--ds-border-muted);
          padding-bottom: 8px;
        }

        .recs-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .rec-row {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          padding: 12px;
          border-radius: 10px;
        }

        .rec-icon {
          font-size: 1.5rem;
          padding-top: 2px;
        }

        .rec-body {
          flex: 1;
        }

        .rec-tag {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          display: block;
          margin-bottom: 2px;
        }

        .rec-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 2px 0;
        }

        .rec-desc {
          margin: 0;
          font-size: 0.72rem;
          color: var(--ds-fg-muted);
          line-height: 1.4;
        }

        .rec-action-btn {
          align-self: center;
          padding: 6px 12px;
          border-radius: 6px;
          background: var(--ds-accent-faint);
          border: 1px solid var(--ds-border-accent);
          color: var(--ds-accent);
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }

        .rec-action-btn:hover {
          background: var(--ds-accent-subtle);
          box-shadow: var(--ds-glow-sm);
        }

        /* WEAK TOPICS WIDGET */
        .weak-topics-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .weak-row {
          background: rgba(239, 68, 68, 0.02);
          border: 1px solid rgba(239, 68, 68, 0.15);
          border-radius: 10px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }

        .weak-head {
          display: flex;
          justify-content: space-between;
          width: 100%;
          align-items: center;
        }

        .weak-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #fff;
        }

        .weak-score {
          font-size: 0.65rem;
          font-family: monospace;
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .weak-reason {
          margin: 0;
          font-size: 0.72rem;
          color: var(--ds-fg-muted);
          line-height: 1.4;
        }

        .weak-review-btn {
          font-size: 0.75rem;
          font-weight: 700;
          color: #39FF14;
          text-decoration: none;
          margin-top: 4px;
        }

        .weak-review-btn:hover {
          text-decoration: underline;
        }

        .empty-analysis-box {
          text-align: center;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .check-shield-icon {
          font-size: 2.2rem;
        }

        .empty-analysis-text {
          font-size: 0.75rem;
          color: rgba(200, 245, 200, 0.45);
          margin: 0;
          line-height: 1.5;
        }

        /* ACHIEVEMENTS LIST */
        .achievements-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .ach-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 1rem;
          border-radius: 12px;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          position: relative;
        }

        .ach-card.unlocked {
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
        }

        .ach-icon {
          font-size: 1.75rem;
          flex-shrink: 0;
        }

        .ach-info {
          flex: 1;
        }

        .ach-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: #fff;
          display: block;
        }

        .ach-card.unlocked .ach-name {
          color: var(--ds-accent);
        }

        .ach-desc {
          margin: 4px 0 0 0;
          font-size: 0.72rem;
          color: var(--ds-fg-muted);
          line-height: 1.4;
        }

        .ach-progress-count {
          font-size: 0.65rem;
          color: var(--ds-fg-subtle);
          font-family: monospace;
          display: block;
          margin-top: 4px;
        }

        .ach-badge-status {
          font-size: 0.55rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 2px 6px;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .ach-card.unlocked .ach-badge-status {
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
        }

        .ach-card.locked .ach-badge-status {
          background: var(--ds-surface-subtle);
          color: var(--ds-fg-subtle);
        }

        /* MOCK HEATMAP WIDGET */
        .heatmap-sub-desc {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          margin: -8px 0 16px 0;
        }

        .heatmap-container {
          background: var(--ds-surface-raised);
          border: 1px solid var(--ds-border-muted);
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .heatmap-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }

        .heatmap-box {
          aspect-ratio: 1;
          border-radius: 3px;
          transition: all 0.2s;
        }

        .heatmap-box.empty {
          background: var(--ds-surface-subtle);
        }

        .heatmap-box.medium {
          background: var(--ds-accent-muted);
          box-shadow: 0 0 6px rgba(57, 255, 20, 0.05);
        }

        .heatmap-box.high {
          background: var(--ds-accent);
          box-shadow: var(--ds-glow-sm);
        }

        .heatmap-labels-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.6rem;
          color: var(--ds-fg-subtle);
          font-family: monospace;
          margin-top: 4px;
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
          .lp-stats-box {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .stats-cta {
            border-left: none;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            padding-left: 0;
            padding-top: 16px;
          }
          .engine-grid {
            grid-template-columns: 1fr;
          }
          .lp-root {
            padding-top: 40px;
          }
        }
      `}</style>
    </div>
  )
}
