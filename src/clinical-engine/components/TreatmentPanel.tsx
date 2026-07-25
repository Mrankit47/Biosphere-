"use client";

import React from "react";
import type { TreatmentOverview } from "../types";

interface TreatmentPanelProps {
  treatment: TreatmentOverview;
  complications?: string[];
  prevention?: string[];
  prognosis?: string;
}

export const TreatmentPanel: React.FC<TreatmentPanelProps> = ({
  treatment,
  complications,
  prevention,
  prognosis
}) => {
  if (!treatment) return null;

  return (
    <div className="treatment-panel-card glassmorphic">
      <div className="panel-title-bar">
        <span className="panel-eyebrow">THERAPEUTICS & MANAGEMENT</span>
        <h3 className="panel-heading">Pharmacotherapy, Surgery & Prevention</h3>
      </div>

      {/* Primary Goal Banner */}
      <div className="primary-goal-banner">
        <span className="banner-title">🎯 PRIMARY THERAPEUTIC GOAL</span>
        <p className="banner-text">{treatment.primaryGoal}</p>
      </div>

      {/* Pharmacotherapy Section */}
      {treatment.medications && treatment.medications.length > 0 && (
        <div className="meds-section">
          <h4 className="sub-heading">💊 First-Line Pharmacotherapy</h4>
          <div className="meds-grid">
            {treatment.medications.map((m, idx) => (
              <div key={idx} className="med-card">
                <div className="med-header">
                  <h5 className="med-name">{m.name}</h5>
                  <span className="med-class-tag">{m.class}</span>
                </div>
                <p className="moa-text">
                  <strong>Mechanism of Action:</strong> {m.mechanismOfAction}
                </p>
                <div className="med-meta">
                  <span className="dosage-pill">Dosage: {m.commonDosage}</span>
                </div>
                {m.sideEffects && (
                  <div className="side-effects-list">
                    <span>Side Effects:</span> {m.sideEffects.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Surgical & Lifestyle Grid */}
      <div className="treatment-grid-2col">
        {/* Lifestyle & Monitoring */}
        <div className="t-block">
          <h4 className="sub-heading">🥗 Lifestyle & Monitoring</h4>
          <ul className="t-list">
            {treatment.lifestyleManagement.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
          <div className="monitoring-box">
            <strong>Monitoring Protocol:</strong> {treatment.monitoringProtocol}
          </div>
        </div>

        {/* Complications & Prognosis */}
        <div className="t-block">
          <h4 className="sub-heading">⚠️ Complications & Prognosis</h4>
          {complications && complications.length > 0 && (
            <ul className="t-list comp-list">
              {complications.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          )}
          {prognosis && (
            <div className="prognosis-box">
              <strong>Clinical Prognosis:</strong> {prognosis}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .treatment-panel-card {
          padding: 1.5rem;
          border-radius: 20px;
          background: rgba(12, 22, 32, 0.85);
          border: 1px solid var(--ds-border-muted);
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .panel-eyebrow {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.12em;
        }

        .panel-heading {
          margin: 2px 0 0 0;
          font-size: 1.2rem;
          font-weight: 900;
          color: #fff;
        }

        .primary-goal-banner {
          background: rgba(57, 255, 20, 0.08);
          border: 1px solid rgba(57, 255, 20, 0.25);
          border-radius: 14px;
          padding: 1rem 1.25rem;
        }

        .banner-title {
          font-size: 0.65rem;
          font-weight: 900;
          color: var(--ds-accent);
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 4px;
        }

        .banner-text {
          margin: 0;
          font-size: 0.92rem;
          font-weight: 700;
          color: #fff;
        }

        .sub-heading {
          margin: 0 0 10px 0;
          font-size: 0.95rem;
          font-weight: 800;
          color: #fff;
        }

        .meds-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 12px;
        }

        .med-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          border-radius: 14px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .med-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }

        .med-name {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 900;
          color: #fff;
        }

        .med-class-tag {
          font-size: 0.62rem;
          font-weight: 800;
          color: #60a5fa;
          background: rgba(59, 130, 246, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .moa-text {
          margin: 0;
          font-size: 0.78rem;
          color: #cbd5e1;
          line-height: 1.45;
        }

        .med-meta {
          margin-top: 4px;
        }

        .dosage-pill {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
          padding: 2px 8px;
          border-radius: 100px;
        }

        .side-effects-list {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          margin-top: 4px;
        }
        .side-effects-list span {
          color: #fca5a5;
          font-weight: 700;
        }

        .treatment-grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .t-block {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--ds-border-muted);
          border-radius: 14px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .t-list {
          margin: 0;
          padding-left: 1.2rem;
          font-size: 0.8rem;
          color: #cbd5e1;
          line-height: 1.5;
        }
        .t-list.comp-list li {
          color: #fca5a5;
        }

        .monitoring-box, .prognosis-box {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--ds-border-muted);
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 0.78rem;
          color: #e2e8f0;
        }
      `}</style>
    </div>
  );
};
