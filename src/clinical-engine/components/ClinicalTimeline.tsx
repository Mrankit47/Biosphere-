"use client";

import React, { useState } from "react";
import { BioIcon } from "@/components/ui/navigation/BioIcon";
import type { ClinicalTimelineStage } from "../types";

interface ClinicalTimelineProps {
  timeline: ClinicalTimelineStage[];
  accentColor?: string;
}

export const ClinicalTimeline: React.FC<ClinicalTimelineProps> = ({
  timeline,
  accentColor = "#3B82F6"
}) => {
  const [activeStageId, setActiveStageId] = useState<string>(
    timeline[0]?.id || "healthy"
  );

  const activeStage = timeline.find((s) => s.id === activeStageId) || timeline[0];

  if (!timeline || timeline.length === 0) return null;

  return (
    <section id="clinical-timeline" className="clinical-timeline-container glassmorphic">
      <div className="section-title-bar">
        <div>
          <span className="section-eyebrow">DISEASE PROGRESSION ENGINE</span>
          <h2 className="section-heading">Clinical Stage Timeline & Pathogenesis</h2>
        </div>
        <div className="damage-meter-pill">
          <span>ORGAN DAMAGE IMPACT</span>
          <strong>{activeStage?.damagePercentage || 0}%</strong>
        </div>
      </div>

      {/* Timeline Steps Track */}
      <div className="timeline-track-nav">
        {timeline.map((stage, idx) => {
          const isActive = stage.id === activeStageId;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStageId(stage.id)}
              className={`timeline-step-btn ${isActive ? "active" : ""}`}
            >
              <div className="step-number-dot">{idx + 1}</div>
              <div className="step-text-wrap">
                <span className="step-title">{stage.title}</span>
                <span className="step-duration">{stage.duration}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Breakdown */}
      {activeStage && (
        <div className="stage-detail-card">
          <div className="stage-header-row">
            <div>
              <span className="stage-badge-duration">TIMEFRAME: {activeStage.duration}</span>
              <h3 className="stage-active-title">{activeStage.title}</h3>
              <p className="stage-subtitle">{activeStage.subtitle}</p>
            </div>
            <div className="damage-progress-bar-wrap">
              <div className="bar-meta">
                <span>Parenchymal Damage</span>
                <span>{activeStage.damagePercentage}%</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${activeStage.damagePercentage}%`,
                    backgroundColor:
                      activeStage.damagePercentage > 70
                        ? "#EF4444"
                        : activeStage.damagePercentage > 35
                        ? "#F59E0B"
                        : accentColor
                  }}
                />
              </div>
            </div>
          </div>

          <div className="stage-content-grid">
            {/* Cellular & Microscopic Changes */}
            <div className="stage-block">
              <span className="block-label">🔬 CELLULAR & HISTOLOGICAL CHANGES</span>
              <ul className="stage-list">
                {activeStage.cellularChanges.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
              <p className="tissue-desc">
                <strong>Tissue Impact:</strong> {activeStage.tissueDamageDescription}
              </p>
            </div>

            {/* Clinical Presentation & Biomarkers */}
            <div className="stage-block">
              <span className="block-label">🩺 CLINICAL SIGNS & BIOMARKERS</span>
              <div className="sub-block">
                <span className="sub-label">Signs & Symptoms:</span>
                <ul className="stage-list">
                  {activeStage.clinicalSigns.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className="sub-block">
                <span className="sub-label">Diagnostic Biomarkers:</span>
                <ul className="stage-list">
                  {activeStage.biomarkers.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Clinical Intervention Points */}
            <div className="stage-block full-width">
              <span className="block-label">💊 CLINICAL INTERVENTION POINTS</span>
              <div className="intervention-pills-row">
                {activeStage.interventionPoints.map((item, i) => (
                  <div key={i} className="intervention-pill">
                    <BioIcon name="sparkles" size={14} /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .clinical-timeline-container {
          padding: 1.5rem;
          border-radius: 20px;
          background: rgba(12, 22, 32, 0.85);
          border: 1px solid var(--ds-border-muted);
          margin-bottom: 2rem;
        }

        .section-title-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .section-eyebrow {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.12em;
        }

        .section-heading {
          margin: 2px 0 0 0;
          font-size: 1.3rem;
          font-weight: 900;
          color: #fff;
        }

        .damage-meter-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--ds-border-muted);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
        }
        .damage-meter-pill strong {
          color: #ef4444;
          font-size: 0.95rem;
        }

        .timeline-track-nav {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 1.25rem;
        }

        .timeline-step-btn {
          flex: 1;
          min-width: 140px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.25s;
          text-align: left;
        }
        .timeline-step-btn:hover {
          border-color: rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.05);
        }
        .timeline-step-btn.active {
          border-color: var(--ds-accent);
          background: var(--ds-accent-faint);
          box-shadow: var(--ds-glow-sm);
        }

        .step-number-dot {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .timeline-step-btn.active .step-number-dot {
          background: var(--ds-accent);
          color: var(--ds-bg-primary);
        }

        .step-text-wrap {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .step-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .step-duration {
          font-size: 0.62rem;
          color: var(--ds-fg-subtle);
        }

        .stage-detail-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--ds-border-muted);
          border-radius: 16px;
          padding: 1.25rem;
        }

        .stage-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
          border-bottom: 1px solid var(--ds-border-muted);
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }

        .stage-badge-duration {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.08em;
        }

        .stage-active-title {
          margin: 2px 0;
          font-size: 1.2rem;
          font-weight: 900;
          color: #fff;
        }

        .stage-subtitle {
          margin: 0;
          font-size: 0.8rem;
          color: var(--ds-fg-subtle);
        }

        .damage-progress-bar-wrap {
          width: 220px;
        }
        .bar-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--ds-fg-muted);
          margin-bottom: 4px;
        }
        .bar-track {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          transition: width 0.4s ease;
          border-radius: 100px;
        }

        .stage-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .stage-block {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .stage-block.full-width {
          grid-column: 1 / -1;
        }

        .block-label {
          font-size: 0.65rem;
          font-weight: 900;
          color: var(--ds-accent);
          letter-spacing: 0.08em;
        }

        .stage-list {
          margin: 0;
          padding-left: 1.2rem;
          font-size: 0.8rem;
          color: #cbd5e1;
          line-height: 1.5;
        }

        .tissue-desc {
          margin: 4px 0 0 0;
          font-size: 0.78rem;
          color: var(--ds-fg-muted);
          line-height: 1.4;
        }

        .sub-block {
          margin-top: 4px;
        }
        .sub-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #fff;
          display: block;
          margin-bottom: 2px;
        }

        .intervention-pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .intervention-pill {
          background: var(--ds-accent-faint);
          border: 1px solid var(--ds-border-accent);
          color: var(--ds-accent);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 100px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>
    </section>
  );
};
