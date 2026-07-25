"use client";

import React from "react";
import type { DiseaseObject } from "../types";

interface SymptomsPanelProps {
  symptoms: DiseaseObject["symptoms"];
}

export const SymptomsPanel: React.FC<SymptomsPanelProps> = ({ symptoms }) => {
  if (!symptoms || symptoms.length === 0) return null;

  return (
    <div className="symptoms-panel-card glassmorphic">
      <div className="panel-title-bar">
        <span className="panel-eyebrow">CLINICAL PRESENTATION</span>
        <h3 className="panel-heading">Symptom Spectrum & Severity</h3>
      </div>

      <div className="symptoms-grid">
        {symptoms.map((s, i) => (
          <div key={i} className="symptom-card">
            <div className="symptom-card-header">
              <span className={`severity-tag ${s.severity}`}>
                {s.severity.toUpperCase()}
              </span>
              <span className="frequency-tag">{s.frequency}</span>
            </div>

            <h4 className="symptom-name">{s.name}</h4>
            <p className="symptom-desc">{s.description}</p>

            <span className="organ-system-pill">System: {s.organSystem}</span>
          </div>
        ))}
      </div>

      <style>{`
        .symptoms-panel-card {
          padding: 1.5rem;
          border-radius: 20px;
          background: rgba(12, 22, 32, 0.85);
          border: 1px solid var(--ds-border-muted);
          margin-bottom: 2rem;
        }

        .panel-title-bar {
          margin-bottom: 1.25rem;
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

        .symptoms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 12px;
        }

        .symptom-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          border-radius: 14px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: border-color 0.2s;
        }
        .symptom-card:hover {
          border-color: rgba(255, 255, 255, 0.25);
        }

        .symptom-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .severity-tag {
          font-size: 0.58rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .severity-tag.mild { background: rgba(57, 255, 20, 0.1); color: var(--ds-accent); }
        .severity-tag.moderate { background: rgba(250, 204, 21, 0.1); color: #facc15; }
        .severity-tag.severe { background: rgba(239, 68, 68, 0.1); color: #fca5a5; }
        .severity-tag.critical { background: rgba(220, 38, 38, 0.2); color: #ef4444; border: 1px solid #ef4444; }

        .frequency-tag {
          font-size: 0.62rem;
          color: var(--ds-fg-subtle);
          font-weight: 600;
        }

        .symptom-name {
          margin: 0;
          font-size: 0.92rem;
          font-weight: 800;
          color: #fff;
        }

        .symptom-desc {
          margin: 0;
          font-size: 0.78rem;
          color: var(--ds-fg-muted);
          line-height: 1.45;
        }

        .organ-system-pill {
          font-size: 0.62rem;
          color: var(--ds-accent);
          font-weight: 700;
          margin-top: auto;
        }
      `}</style>
    </div>
  );
};
