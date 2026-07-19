"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/components/ui/auth";
import { useNavigation, ROUTE_META } from "@/components/ui/navigation/NavigationContext";
import { JOURNEYS } from "@/data/learningPaths";
import { PROGRAMS } from "@/data/learningEngine";
import { getAnalytics } from "@/utils/progressEngine";
import { getRecommendations } from "@/utils/recommendationsEngine";
import { AnalyticsPanel, RecommendationCard, ProgramCard, ProgressRing } from "@/components/ui/learning";
import { BioIcon } from "@/components/ui/navigation/BioIcon";

// Type definitions
interface CalendarEvent {
  day: number;
  title: string;
  type: "quiz" | "lab" | "webinar";
  desc: string;
}

const CALENDAR_EVENTS: Record<number, CalendarEvent[]> = {
  8: [{ day: 8, title: "Mitosis Quiz Due", type: "quiz", desc: "Complete the process simulation quiz by midnight." }],
  12: [{ day: 12, title: "Virtual Lab Run", type: "lab", desc: "Scheduled photosynthesis rate verification session." }],
  19: [{ day: 19, title: "Evolution Webinar", type: "webinar", desc: "Live stream on Carl Woese tree of life mapping." }],
  25: [{ day: 25, title: "Final Exam Prep", type: "quiz", desc: "Verify weak topics list with the AI Biology tutor." }],
};

export default function BiologyDashboard() {
  const { user, profile, role } = useAuth();
  const { favorites, progressPercent } = useNavigation();

  // Local component states
  const [mounted, setMounted] = useState(false);
  const [labPhotosynthesis, setLabPhotosynthesis] = useState(false);
  const [labCatalysis, setLabCatalysis] = useState(false);
  const [quizPoints, setQuizPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // Interactive Daily Challenge States
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [challengeAnswered, setChallengeAnswered] = useState(false);
  const [challengeCorrect, setChallengeCorrect] = useState(false);

  // Calendar detailed popover
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Load client stats
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setLabPhotosynthesis(localStorage.getItem("biosphere_lab_cert_photosynthesis") === "true");
      setLabCatalysis(localStorage.getItem("biosphere_lab_cert_catalysis") === "true");
      setChallengeAnswered(localStorage.getItem("biosphere_daily_challenge_answered") === "true");
      setChallengeCorrect(localStorage.getItem("biosphere_daily_challenge_correct") === "true");
      try {
        const stats = JSON.parse(localStorage.getItem("bio_stats") || '{"points":0,"best":{}}');
        setQuizPoints(stats.points || 0);
        // Streak logic
        const completedCount = (labPhotosynthesis ? 1 : 0) + (labCatalysis ? 1 : 0) + Object.keys(stats.best || {}).length;
        setStreak(completedCount > 0 ? 3 + (completedCount % 4) : 0);
      } catch {}
    }
  }, [labPhotosynthesis, labCatalysis]);

  // Level & XP values
  const calculatedXp = useMemo(() => {
    const lessonsCount = (labPhotosynthesis ? 1 : 0) + (labCatalysis ? 1 : 0);
    const lessonXp = lessonsCount * 150;
    const quizXp = quizPoints * 2;
    const challengeBonus = challengeCorrect ? 20 : 0;
    return lessonXp + quizXp + challengeBonus;
  }, [labPhotosynthesis, labCatalysis, quizPoints, challengeCorrect]);

  const currentLevel = Math.floor(calculatedXp / 500) + 1;
  const levelXpProgress = calculatedXp % 500;
  const levelPercent = Math.min(100, Math.round((levelXpProgress / 500) * 100));

  // Daily Challenge config
  const dailyQuestion = {
    q: "Which organelle is responsible for ATP synthesis and cellular respiration?",
    options: ["Ribosome", "Golgi Apparatus", "Mitochondria", "Lysosome"],
    correct: "Mitochondria",
  };

  const handleChallengeSubmit = (ans: string) => {
    if (challengeAnswered) return;
    const isCorrect = ans === dailyQuestion.correct;
    setSelectedAnswer(ans);
    setChallengeCorrect(isCorrect);
    setChallengeAnswered(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("biosphere_daily_challenge_answered", "true");
      localStorage.setItem("biosphere_daily_challenge_correct", isCorrect ? "true" : "false");
      if (isCorrect) {
        // add bonus XP points locally
        try {
          const stats = JSON.parse(localStorage.getItem("bio_stats") || '{"points":0}');
          stats.points = (stats.points || 0) + 10; // +10 points = +20 XP
          localStorage.setItem("bio_stats", JSON.stringify(stats));
        } catch {}
      }
    }
  };

  // Weak Topics calculations based on quiz logs
  const weakTopics = useMemo(() => {
    const list = [];
    if (!labPhotosynthesis) {
      list.push({
        title: "Photosynthesis Rates",
        score: "Not Attempted",
        desc: "Requires completing the simulated Chromatography or Elodea bubble count.",
        prompt: "Explain limiting factors in photosynthesis light dependent reactions",
      });
    }
    if (!labCatalysis) {
      list.push({
        title: "Enzyme Catalysis",
        score: "Not Attempted",
        desc: "Requires testing foam heights under temperature and pH variances.",
        prompt: "Explain how pH and temperature alter catalase active sites",
      });
    }
    if (quizPoints < 10) {
      list.push({
        title: "Eukaryotic Cell Organelles",
        score: "Low Score",
        desc: "Struggling with nuclear chromatin envelope structure.",
        prompt: "Explain the structure and functions of nuclear pore complexes",
      });
    }
    return list.slice(0, 2);
  }, [labPhotosynthesis, labCatalysis, quizPoints]);

  if (!mounted) {
    return (
      <div className="dashboard-loading">
        <span className="loading-spinner">
          <BioIcon name="cell-explorer" size={36} />
        </span>
        <p>Initializing Biosphere Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-root-container">
      {/* Welcome banner */}
      <section className="dashboard-hero-banner glassmorphic">
        <div className="banner-greeting-col">
          <span className="greeting-pill">{role ? role.toUpperCase() : "GUEST EXPLORER"}</span>
          <h1 className="greeting-name-hdr">
            Welcome back, {user ? profile.name || "Biology Student" : "Guest Explorer"}!
          </h1>
          <p className="greeting-desc">
            Your Biosphere learning engine is active. Dive back into simulations or resume your pathway modules.
          </p>
        </div>

        <div className="banner-stats-trackers">
          {/* Streak Flame */}
          <div className="stat-flame-card">
            <span className="stat-card-icon">
              <BioIcon name="mitochondria" size={24} />
            </span>
            <div className="stat-card-info">
              <span className="stat-card-val">{streak} Days</span>
              <span className="stat-card-lbl">Learning Streak</span>
            </div>
          </div>

          {/* Level Tracker */}
          <div className="stat-flame-card">
            <span className="stat-card-icon">
              <BioIcon name="gamification" size={24} />
            </span>
            <div className="stat-card-info">
              <span className="stat-card-val">Level {currentLevel}</span>
              <span className="stat-card-lbl">{calculatedXp} Total XP</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Panels */}
      <div className="dashboard-grid-layout">
        {/* Left Column: Learning flow, challenges, weak points */}
        <div className="dashboard-col-left">
          {/* Continue Learning card */}
          <div className="dashboard-card glassmorphic continue-learning-card">
            <div className="card-header-action-row">
              <h3 className="dashboard-card-hdr" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <BioIcon name="mitochondria" size={14} /> CONTINUE LEARNING
              </h3>
              <span className="journey-track-lbl">CELL BIOLOGY</span>
            </div>
            
            <p className="continue-lesson-title">
              {labPhotosynthesis ? "Enzyme Catalysis (Catalase) Simulation" : "Photosynthesis Rate Limiting Factors Lab"}
            </p>
            <div className="continue-progress-row">
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <span className="progress-percent-lbl">{progressPercent}% Path Done</span>
            </div>

            <Link
              href={labPhotosynthesis ? "/virtual-lab" : "/learning-paths/cell-biology/lessons/cell-intro"}
              className="dashboard-primary-action-btn"
            >
              Resume Study Session →
            </Link>
          </div>

          {/* Today's Challenge */}
          <div className="dashboard-card glassmorphic challenge-card">
            <h3 className="dashboard-card-hdr">TODAY'S CHALLENGE (+20 XP)</h3>
            <p className="challenge-question">{dailyQuestion.q}</p>

            <div className="challenge-options-grid">
              {dailyQuestion.options.map((opt) => {
                const isSelected = selectedAnswer === opt;
                let btnClass = "";
                if (challengeAnswered) {
                  if (opt === dailyQuestion.correct) btnClass = "correct";
                  else if (isSelected) btnClass = "incorrect";
                  else btnClass = "disabled";
                } else if (isSelected) {
                  btnClass = "selected";
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleChallengeSubmit(opt)}
                    disabled={challengeAnswered}
                    className={`challenge-option-btn ${btnClass}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {challengeAnswered && (
              <div className={`challenge-feedback-alert ${challengeCorrect ? "success" : "error"}`}>
                {challengeCorrect
                  ? "✓ Correct! You answered correctly and earned +20 XP bonus!"
                  : `✕ Incorrect. The correct answer is ${dailyQuestion.correct}.`}
              </div>
            )}
          </div>

          {/* Weak Topics & AI Recommendations */}
          <div className="dashboard-card glassmorphic weak-topics-card">
            <h3 className="dashboard-card-hdr">WEAK TOPICS & AI RECOMMENDATIONS</h3>
            {weakTopics.length > 0 ? (
              <div className="weak-topics-list">
                {weakTopics.map((topic, idx) => (
                  <div key={idx} className="weak-topic-row-card">
                    <div className="topic-header-row">
                      <span className="topic-title">{topic.title}</span>
                      <span className="topic-status-badge">{topic.score}</span>
                    </div>
                    <p className="topic-desc">{topic.desc}</p>
                    <div className="ai-recommendation-block">
                      <span className="ai-badge" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <BioIcon name="tutor" size={14} /> AI RECOMMENDATION
                      </span>
                      <p className="ai-tip">
                        "Your lab profiles show incomplete metrics here. Ask the tutor to review active-site configurations to bolster quiz scores."
                      </p>
                      <Link
                        href={`/tutor?q=Review ${encodeURIComponent(topic.prompt)}`}
                        className="ai-chat-suggest-link"
                      >
                        Ask AI Tutor to Explain →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="dashboard-empty-text">No weak topics recorded! Keep maintaining high scores across quizzes.</p>
            )}
          </div>
        </div>

        {/* Right Column: Streaks, Calendar, Bookmarks */}
        <div className="dashboard-col-right">
          {/* Level Gauge Progress */}
          <div className="dashboard-card glassmorphic xp-gauge-card">
            <h3 className="dashboard-card-hdr">LEARNING ENGINE LEVEL</h3>
            <div className="level-gauge-info">
              <div className="gauge-text-row">
                <span className="gauge-level-title">LEVEL {currentLevel}</span>
                <span className="gauge-xp-ratio">{levelXpProgress} / 500 XP</span>
              </div>
              <div className="progress-bar-track gauge-track">
                <div className="progress-bar-fill" style={{ width: `${levelPercent}%` }} />
              </div>
              <p className="gauge-tip-txt">
                Gain {500 - levelXpProgress} XP to reach Level {currentLevel + 1}!
              </p>
            </div>
          </div>

          {/* Upcoming Events & Learning Calendar */}
          <div className="dashboard-card glassmorphic calendar-card">
            <h3 className="dashboard-card-hdr">LEARNING CALENDAR</h3>
            
            {/* Simple calendar grid */}
            <div className="calendar-grid-wrapper">
              <div className="calendar-grid-header">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
              <div className="calendar-days-grid">
                {Array.from({ length: 28 }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const hasEvents = CALENDAR_EVENTS[dayNum];

                  return (
                    <button
                      key={idx}
                      onClick={() => hasEvents && setSelectedEvent(hasEvents[0])}
                      className={`calendar-day-tile ${hasEvents ? "has-event" : ""}`}
                    >
                      {dayNum}
                      {hasEvents && <span className="calendar-event-dot" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event detail popover */}
            {selectedEvent ? (
              <div className={`calendar-event-popup-card ${selectedEvent.type}`}>
                <div className="event-popup-header">
                  <span className="event-title-badge">{selectedEvent.type.toUpperCase()}</span>
                  <button onClick={() => setSelectedEvent(null)} className="close-popup-btn">
                    <BioIcon name="close" size={14} />
                  </button>
                </div>
                <h4 className="event-popup-title">{selectedEvent.title}</h4>
                <p className="event-popup-desc">{selectedEvent.desc}</p>
              </div>
            ) : (
              <p className="calendar-prompt-txt">Click highlighted dates to inspect scheduled live labs or exams.</p>
            )}
          </div>

          {/* Bookmarked Lessons */}
          <div className="dashboard-card glassmorphic bookmarks-card">
            <h3 className="dashboard-card-hdr">BOOKMARKED EXHIBITS</h3>
            {favorites.length > 0 ? (
              <div className="dashboard-bookmarks-list">
                {favorites.map((favPath) => {
                  const meta = ROUTE_META[favPath] || { label: "Details Page", icon: "dna-genetics" };
                  return (
                    <a href={favPath} key={favPath} className="dashboard-bookmark-pill">
                      <span className="bookmark-icon">
                        <BioIcon name={meta.icon} size={16} />
                      </span>
                      <span className="bookmark-name">{meta.label}</span>
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="dashboard-empty-text">No bookmarked exhibits. Click the star icon on any page to bookmark.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Topics & 3D Specimens Row */}
      <section className="recommended-topics-row-section">
        <h2 className="section-title">RECOMMENDED MODULES TO EXPLORE</h2>
        <div className="recommendations-deck-grid">
          <div className="recommended-card glassmorphic">
            <span className="rec-icon">
              <BioIcon name="human-body" size={24} />
            </span>
            <div className="rec-details">
              <h4>Anatomical Systems</h4>
              <p>Explore X-Ray skeletal maps and cardiac valve animations in the 3D Anatomy Visualizer.</p>
              <Link href="/human-body" className="rec-link">Launch Module →</Link>
            </div>
          </div>

          <div className="recommended-card glassmorphic">
            <span className="rec-icon">
              <BioIcon name="cell-explorer" size={24} />
            </span>
            <div className="rec-details">
              <h4>Cell Organelles</h4>
              <p>Inspect double-membrane layers of Mitochondria and protein routing ribosomes.</p>
              <Link href="/cell-explorer" className="rec-link">Launch Module →</Link>
            </div>
          </div>

          <div className="recommended-card glassmorphic">
            <span className="rec-icon">
              <BioIcon name="microorganisms" size={24} />
            </span>
            <div className="rec-details">
              <h4>Microorganisms Zoo</h4>
              <p>Compare swimming flagella of Euglena and colonial sphere rotation of Volvox.</p>
              <Link href="/microorganisms" className="rec-link">Launch Module →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Horizontal Carousel */}
      <section className="recommended-topics-row-section">
        <h2 className="section-title">ACHIEVEMENTS & PATH BADGES</h2>
        <div className="achievements-carousel-list">
          <div className={`achievement-badge-card glassmorphic ${labPhotosynthesis ? "unlocked" : ""}`}>
            <span className="badge-medal-icon">
              <BioIcon name="virtual-lab" size={24} />
            </span>
            <h4>Lab Pioneer</h4>
            <p>Complete Photosynthesis Elodea certified chromatography.</p>
            <span className="badge-xp-val">+150 XP</span>
          </div>

          <div className={`achievement-badge-card glassmorphic ${quizPoints >= 20 ? "unlocked" : ""}`}>
            <span className="badge-medal-icon">
              <BioIcon name="quiz" size={24} />
            </span>
            <h4>Quiz Whiz</h4>
            <p>Score 20+ points across quick-fire biology quizzes.</p>
            <span className="badge-xp-val">+200 XP</span>
          </div>

          <div className="achievement-badge-card glassmorphic unlocked">
            <span className="badge-medal-icon">
              <BioIcon name="sprout" size={24} />
            </span>
            <h4>Biosphere Novice</h4>
            <p>Created an active study profile inside the ecosystem.</p>
            <span className="badge-xp-val">Unlocked</span>
          </div>
        </div>
      </section>

      {/* ═══ LEARNING ENGINE SECTION ═══ */}
      <section className="learning-engine-section">
        <div className="le-section-hdr">
          <h2 className="le-section-title">🧬 LEARNING ENGINE</h2>
          <p className="le-section-desc">Your personalized biology learning ecosystem — powered by progress tracking, AI recommendations, and spaced repetition.</p>
        </div>

        <div className="le-two-col-layout">
          <div className="le-col-main">
            <AnalyticsPanel />
          </div>
          <div className="le-col-side">
            <RecommendationCard recommendations={getRecommendations(6)} title="Smart Recommendations" />
          </div>
        </div>

        {/* Programs Grid */}
        <div className="le-programs-header">
          <h3 className="le-programs-title">📚 ALL PROGRAMS</h3>
          <span className="le-programs-count">{PROGRAMS.length} programs available</span>
        </div>
        <div className="le-programs-grid">
          {PROGRAMS.map((prog) => (
            <ProgramCard
              key={prog.id}
              program={prog}
              onClick={() => window.location.href = prog.exploreUrl}
            />
          ))}
        </div>
      </section>

      <style>{`
        .dashboard-root-container {
          width: 100%;
          padding: 24px clamp(16px, 4vw, 40px) 60px;
          background: var(--ds-bg-primary);
          color: var(--ds-fg);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .dashboard-loading {
          width: 100%;
          min-height: calc(100vh - 144px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--ds-accent);
          gap: 12px;
        }

        .loading-spinner {
          font-size: 2.5rem;
          animation: spin-logo 2.5s infinite linear;
        }

        @keyframes spin-logo {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Hero Banner */
        .dashboard-hero-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 32px;
          border-radius: 20px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), var(--ds-glow-sm);
          gap: 24px;
          flex-wrap: wrap;
        }

        .banner-greeting-col {
          flex: 1;
          min-width: 280px;
        }

        .greeting-pill {
          display: inline-block;
          font-size: 0.58rem;
          font-weight: 900;
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
          border: 1px solid var(--ds-border-accent);
          padding: 3px 10px;
          border-radius: 100px;
          letter-spacing: 0.15em;
          margin-bottom: 12px;
        }

        .greeting-name-hdr {
          font-size: 1.8rem;
          font-weight: 900;
          color: #fff;
          margin: 0 0 6px 0;
          letter-spacing: -0.02em;
        }

        .greeting-desc {
          font-size: 0.85rem;
          color: var(--ds-fg-subtle);
          margin: 0;
          line-height: 1.5;
        }

        .banner-stats-trackers {
          display: flex;
          gap: 16px;
        }

        .stat-flame-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 12px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0, 0, 0, 0.35);
        }

        .stat-card-icon {
          font-size: 1.8rem;
          filter: drop-shadow(0 0 8px rgba(57,255,20,0.25));
        }

        .stat-card-info {
          display: flex;
          flex-direction: column;
        }

        .stat-card-val {
          font-size: 1.1rem;
          font-weight: 850;
          color: #fff;
        }

        .stat-card-lbl {
          font-size: 0.65rem;
          color: var(--ds-fg-subtle);
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        /* Grid */
        .dashboard-grid-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }

        .dashboard-col-left,
        .dashboard-col-right {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .dashboard-card {
          border-radius: 16px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
          box-sizing: border-box;
          position: relative;
        }

        .dashboard-card-hdr {
          font-size: 0.72rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.12em;
          margin: 0 0 16px 0;
          text-transform: uppercase;
        }

        /* Continue Learning */
        .card-header-action-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .journey-track-lbl {
          font-size: 0.58rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--ds-glass-border);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .continue-lesson-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #fff;
          margin: 0 0 16px 0;
        }

        .continue-progress-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .progress-percent-lbl {
          font-size: 0.72rem;
          color: var(--ds-fg-muted);
          white-space: nowrap;
          font-weight: 600;
        }

        .dashboard-primary-action-btn {
          display: inline-block;
          text-align: center;
          padding: 12px 20px;
          border-radius: 8px;
          border: 1.5px solid var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          font-weight: 800;
          font-size: 0.85rem;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: var(--ds-glow-sm);
        }

        .dashboard-primary-action-btn:hover {
          background: var(--ds-accent-subtle);
          box-shadow: var(--ds-glow-md);
          transform: translateY(-1px);
        }

        /* Daily Challenge */
        .challenge-question {
          font-size: 0.9rem;
          font-weight: 650;
          line-height: 1.5;
          margin: 0 0 20px 0;
          color: #fff;
        }

        .challenge-options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .challenge-option-btn {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(255,255,255,0.02);
          color: var(--ds-fg-muted);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .challenge-option-btn:hover:not(:disabled) {
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
        }

        .challenge-option-btn.selected {
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-subtle);
          color: var(--ds-accent);
        }

        .challenge-option-btn.correct {
          border-color: rgba(57, 255, 20, 0.4);
          background: rgba(57, 255, 20, 0.1);
          color: var(--ds-accent);
          box-shadow: var(--ds-glow-sm);
        }

        .challenge-option-btn.incorrect {
          border-color: rgba(239, 68, 68, 0.4);
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
        }

        .challenge-option-btn.disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .challenge-feedback-alert {
          margin-top: 16px;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 0.75rem;
          line-height: 1.4;
        }

        .challenge-feedback-alert.success {
          background: rgba(57, 255, 20, 0.08);
          border: 1px solid rgba(57, 255, 20, 0.2);
          color: var(--ds-accent);
        }

        .challenge-feedback-alert.error {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }

        /* Weak Topics */
        .weak-topics-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .weak-topic-row-card {
          border-radius: 10px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0, 0, 0, 0.25);
          padding: 16px;
        }

        .topic-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .topic-title {
          font-size: 0.88rem;
          font-weight: 750;
          color: #fff;
        }

        .topic-status-badge {
          font-size: 0.58rem;
          font-weight: 900;
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.25);
          background: rgba(239, 68, 68, 0.06);
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .topic-desc {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .ai-recommendation-block {
          border-left: 2px solid var(--ds-accent);
          padding-left: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 10px;
        }

        .ai-badge {
          font-size: 0.58rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.05em;
        }

        .ai-tip {
          font-size: 0.72rem;
          font-style: italic;
          color: var(--ds-fg-muted);
          margin: 0;
          line-height: 1.4;
        }

        .ai-chat-suggest-link {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--ds-accent);
          text-decoration: none;
        }

        .ai-chat-suggest-link:hover {
          text-decoration: underline;
        }

        /* XP Level gauge */
        .level-gauge-info {
          display: flex;
          flex-direction: column;
        }

        .gauge-text-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .gauge-level-title {
          color: #fff;
          letter-spacing: 0.05em;
        }

        .gauge-xp-ratio {
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

        .gauge-tip-txt {
          font-size: 0.68rem;
          color: var(--ds-fg-subtle);
          margin: 0;
        }

        /* Calendar */
        .calendar-grid-wrapper {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }

        .calendar-grid-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          padding-bottom: 4px;
          border-bottom: 1px solid var(--ds-glass-border);
        }

        .calendar-days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .calendar-day-tile {
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 600;
          background: rgba(255,255,255,0.01);
          border: 1px solid transparent;
          border-radius: 4px;
          color: var(--ds-fg-muted);
          cursor: pointer;
          position: relative;
        }

        .calendar-day-tile:hover {
          background: rgba(255,255,255,0.05);
          color: #fff;
        }

        .calendar-day-tile.has-event {
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          font-weight: bold;
        }

        .calendar-event-dot {
          position: absolute;
          bottom: 2px;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: var(--ds-accent);
          box-shadow: var(--ds-glow-sm);
        }

        .calendar-prompt-txt {
          font-size: 0.65rem;
          color: var(--ds-fg-subtle);
          margin: 0;
          text-align: center;
        }

        .calendar-event-popup-card {
          margin-top: 12px;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
        }

        .calendar-event-popup-card.quiz {
          background: rgba(239, 68, 68, 0.05);
          border-color: rgba(239, 68, 68, 0.2);
        }

        .calendar-event-popup-card.lab {
          background: rgba(57, 255, 20, 0.05);
          border-color: rgba(57, 255, 20, 0.2);
        }

        .calendar-event-popup-card.webinar {
          background: rgba(59, 130, 246, 0.05);
          border-color: rgba(59, 130, 246, 0.2);
        }

        .event-popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .event-title-badge {
          font-size: 0.52rem;
          font-weight: 900;
          letter-spacing: 0.05em;
        }

        .calendar-event-popup-card.quiz .event-title-badge { color: #fca5a5; }
        .calendar-event-popup-card.lab .event-title-badge { color: var(--ds-accent); }
        .calendar-event-popup-card.webinar .event-title-badge { color: #93c5fd; }

        .close-popup-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.65rem;
          color: var(--ds-fg-subtle);
        }

        .event-popup-title {
          font-size: 0.76rem;
          font-weight: 850;
          margin: 0 0 2px 0;
          color: #fff;
        }

        .event-popup-desc {
          font-size: 0.68rem;
          color: var(--ds-fg-subtle);
          margin: 0;
          line-height: 1.3;
        }

        /* Bookmarks list */
        .dashboard-bookmarks-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .dashboard-bookmark-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0, 0, 0, 0.2);
          text-decoration: none;
          color: var(--ds-fg-muted);
          font-size: 0.76rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .dashboard-bookmark-pill:hover {
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
        }

        .bookmark-icon {
          font-size: 0.95rem;
        }

        .dashboard-empty-text {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          margin: 0;
          text-align: center;
        }

        /* Recommended Row Section */
        .recommended-topics-row-section {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 12px;
        }

        .section-title {
          font-size: 0.76rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin: 0;
        }

        .recommendations-deck-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }

        .recommended-card {
          display: flex;
          gap: 16px;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
        }

        .rec-icon {
          font-size: 1.8rem;
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background: rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rec-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .rec-details h4 {
          font-size: 0.88rem;
          font-weight: 750;
          color: #fff;
          margin: 0;
        }

        .rec-details p {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          margin: 0 0 10px 0;
          line-height: 1.4;
        }

        .rec-link {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--ds-accent);
          text-decoration: none;
        }

        .rec-link:hover {
          text-decoration: underline;
        }

        /* Achievements list */
        .achievements-carousel-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .achievement-badge-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          opacity: 0.55;
          transition: all 0.3s;
        }

        .achievement-badge-card.unlocked {
          opacity: 1;
          border-color: var(--ds-border-accent);
          box-shadow: var(--ds-glow-sm);
        }

        .badge-medal-icon {
          font-size: 1.8rem;
          margin-bottom: 10px;
        }

        .achievement-badge-card h4 {
          font-size: 0.82rem;
          font-weight: 800;
          color: #fff;
          margin: 0 0 4px 0;
        }

        .achievement-badge-card p {
          font-size: 0.68rem;
          color: var(--ds-fg-subtle);
          margin: 0 0 10px 0;
          line-height: 1.3;
        }

        .badge-xp-val {
          font-size: 0.58rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          border: 1.5px solid var(--ds-glass-border);
          background: rgba(0, 0, 0, 0.2);
          padding: 2px 8px;
          border-radius: 100px;
          text-transform: uppercase;
        }

        .achievement-badge-card.unlocked .badge-xp-val {
          border-color: var(--ds-border-accent);
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
        }

        @media (max-width: 860px) {
          .dashboard-grid-layout {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }

        /* Learning Engine Section Styles */
        .learning-engine-section {
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .le-section-hdr {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .le-section-title {
          font-size: 1.4rem;
          font-weight: 900;
          color: #fff;
          margin: 0;
          letter-spacing: -0.02em;
          text-shadow: var(--ds-glow-sm);
        }

        .le-section-desc {
          font-size: 0.85rem;
          color: var(--ds-fg-subtle);
          margin: 0;
          line-height: 1.5;
        }

        .le-two-col-layout {
          display: grid;
          grid-template-columns: 1.8fr 1.2fr;
          gap: 24px;
          align-items: start;
        }

        .le-programs-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-top: 16px;
          border-bottom: 1px solid var(--ds-glass-border);
          padding-bottom: 10px;
        }

        .le-programs-title {
          font-size: 0.72rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.12em;
          margin: 0;
        }

        .le-programs-count {
          font-size: 0.65rem;
          color: var(--ds-fg-subtle);
          font-weight: 600;
        }

        .le-programs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        @media (max-width: 960px) {
          .le-two-col-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
