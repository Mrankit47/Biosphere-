"use client";

import React, { useState, useEffect } from "react";
import { type Analytics } from "@/utils/progressEngine";
import { getAnalytics } from "@/utils/progressEngine";
import { ProgressRing } from "./ProgressRing";

export const AnalyticsPanel: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    setAnalytics(getAnalytics());
  }, []);

  if (!analytics) return null;

  const level = Math.floor(analytics.totalXp / 500) + 1;

  const statCards = [
    { label: "Daily Study", value: `${analytics.dailyStudyMinutes}m`, icon: "📖", color: "#39FF14" },
    { label: "Weekly Study", value: `${analytics.weeklyStudyMinutes}m`, icon: "📅", color: "#818CF8" },
    { label: "Current Streak", value: `${analytics.currentStreak}d`, icon: "🔥", color: "#F59E0B" },
    { label: "Total XP", value: analytics.totalXp.toLocaleString(), icon: "⚡", color: "#39FF14" },
    { label: "Level", value: level.toString(), icon: "🏆", color: "#FBBF24" },
    { label: "Lessons Done", value: `${analytics.lessonsCompleted}/${analytics.totalLessons}`, icon: "📚", color: "#60A5FA" },
    { label: "Programs Done", value: `${analytics.programsCompleted}/${analytics.totalPrograms}`, icon: "🎓", color: "#34D399" },
    { label: "Quiz Avg", value: `${analytics.averageQuizScore}%`, icon: "📝", color: "#A78BFA" },
    { label: "AI Sessions", value: analytics.aiInteractions.toString(), icon: "🤖", color: "#06B6D4" },
    { label: "Simulations", value: analytics.simulationsCompleted.toString(), icon: "🧪", color: "#EC4899" },
    { label: "Labs", value: analytics.labsCompleted.toString(), icon: "🔬", color: "#F97316" },
    { label: "Flashcards", value: analytics.flashcardsReviewed.toString(), icon: "🃏", color: "#8B5CF6" },
  ];

  return (
    <div className="analytics-root">
      <h3 className="analytics-title">📊 LEARNING ANALYTICS</h3>

      {/* Top row: Overall Progress + Level */}
      <div className="analytics-hero-row">
        <div className="analytics-hero-ring">
          <ProgressRing percent={analytics.completionPercentage} size={100} strokeWidth={7} label="Complete" />
        </div>
        <div className="analytics-hero-info">
          <div className="hero-level-badge">
            <span className="hero-level-label">LEVEL</span>
            <span className="hero-level-num">{level}</span>
          </div>
          <span className="hero-xp-text">{analytics.totalXp} XP earned</span>
          <span className="hero-streak-text">
            {analytics.currentStreak > 0
              ? `🔥 ${analytics.currentStreak}-day streak!`
              : "Start your streak today!"}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="analytics-stats-grid">
        {statCards.map((stat, i) => (
          <div key={i} className="analytics-stat-card" style={{ "--stat-color": stat.color } as React.CSSProperties}>
            <span className="stat-icon">{stat.icon}</span>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Weak & Favorite Topics */}
      {(analytics.weakTopics.length > 0 || analytics.favoriteTopics.length > 0) && (
        <div className="analytics-topics-row">
          {analytics.weakTopics.length > 0 && (
            <div className="topics-section weak">
              <h4 className="topics-hdr">⚠️ Weak Topics</h4>
              <div className="topics-pills">
                {analytics.weakTopics.map((t, i) => (
                  <span key={i} className="topic-pill weak">{t}</span>
                ))}
              </div>
            </div>
          )}
          {analytics.favoriteTopics.length > 0 && (
            <div className="topics-section fav">
              <h4 className="topics-hdr">⭐ Favorite Topics</h4>
              <div className="topics-pills">
                {analytics.favoriteTopics.map((t, i) => (
                  <span key={i} className="topic-pill fav">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .analytics-root {
          border-radius: 16px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          padding: 24px;
          box-sizing: border-box;
        }
        .analytics-title {
          font-size: 0.72rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.12em;
          margin: 0 0 20px 0;
        }

        .analytics-hero-row {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--ds-glass-border);
        }
        .analytics-hero-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .hero-level-badge {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }
        .hero-level-label {
          font-size: 0.52rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.1em;
        }
        .hero-level-num {
          font-size: 2rem;
          font-weight: 900;
          color: var(--ds-accent);
          line-height: 1;
        }
        .hero-xp-text {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--ds-fg-muted);
        }
        .hero-streak-text {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--ds-fg-subtle);
        }

        .analytics-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 8px;
          margin-bottom: 20px;
        }
        .analytics-stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 12px 8px;
          border-radius: 10px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0,0,0,0.12);
          transition: all 0.2s;
        }
        .analytics-stat-card:hover {
          border-color: var(--stat-color, var(--ds-border-accent));
          background: rgba(255,255,255,0.015);
        }
        .stat-icon { font-size: 1.1rem; }
        .stat-value {
          font-size: 0.95rem;
          font-weight: 900;
          color: #fff;
        }
        .stat-label {
          font-size: 0.52rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          text-align: center;
        }

        .analytics-topics-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .topics-section {
          padding: 12px;
          border-radius: 10px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0,0,0,0.1);
        }
        .topics-hdr {
          font-size: 0.58rem;
          font-weight: 900;
          color: var(--ds-fg-muted);
          letter-spacing: 0.08em;
          margin: 0 0 8px 0;
        }
        .topics-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .topic-pill {
          font-size: 0.58rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 100px;
        }
        .topic-pill.weak {
          color: #F87171;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.15);
        }
        .topic-pill.fav {
          color: #FBBF24;
          background: rgba(251,191,36,0.08);
          border: 1px solid rgba(251,191,36,0.15);
        }

        @media (max-width: 640px) {
          .analytics-stats-grid { grid-template-columns: repeat(3, 1fr); }
          .analytics-topics-row { grid-template-columns: 1fr; }
          .analytics-hero-row { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
};
