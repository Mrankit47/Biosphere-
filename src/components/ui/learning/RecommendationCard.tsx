"use client";

import React from "react";
import { type Recommendation } from "@/utils/recommendationsEngine";

interface RecommendationCardProps {
  recommendations: Recommendation[];
  title?: string;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendations,
  title = "Recommendations",
}) => {
  if (recommendations.length === 0) return null;

  const typeColors: Record<string, string> = {
    continue: "#39FF14",
    recommended: "#818CF8",
    weak: "#F87171",
    review: "#FBBF24",
    simulation: "#06B6D4",
    quiz: "#A78BFA",
    ai: "#34D399",
    recent: "#9CA3AF",
  };

  return (
    <div className="rec-card-root">
      <h3 className="rec-card-title">💡 {title.toUpperCase()}</h3>

      <div className="rec-list">
        {recommendations.map((rec, i) => (
          <a
            key={i}
            href={rec.actionUrl}
            className="rec-item"
            style={{ "--rec-color": typeColors[rec.type] || "#39FF14" } as React.CSSProperties}
          >
            <div className="rec-item-icon-wrap">
              <span className="rec-item-icon">{rec.icon}</span>
            </div>
            <div className="rec-item-info">
              <span className="rec-item-title">{rec.title}</span>
              <span className="rec-item-desc">{rec.description}</span>
            </div>
            <span className="rec-item-action">{rec.actionLabel} →</span>
          </a>
        ))}
      </div>

      <style>{`
        .rec-card-root {
          border-radius: 16px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          padding: 20px;
          box-sizing: border-box;
        }
        .rec-card-title {
          font-size: 0.68rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.12em;
          margin: 0 0 14px 0;
        }
        .rec-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .rec-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(0,0,0,0.1);
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .rec-item:hover {
          border-color: var(--rec-color, var(--ds-border-accent));
          background: rgba(255,255,255,0.02);
          transform: translateX(4px);
        }
        .rec-item-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .rec-item-icon { font-size: 1.1rem; }
        .rec-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .rec-item-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .rec-item-desc {
          font-size: 0.62rem;
          color: var(--ds-fg-subtle);
        }
        .rec-item-action {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--rec-color, var(--ds-accent));
          white-space: nowrap;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .rec-item-action { display: none; }
        }
      `}</style>
    </div>
  );
};
