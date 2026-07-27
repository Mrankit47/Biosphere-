"use client";

import React from "react";
import Link from "next/link";
import { BioIcon } from "@/components/ui/navigation/BioIcon";
import type { MolecularObject } from "../types";

interface MolecularHeaderProps {
  molecularObject: MolecularObject;
}

export const MolecularHeader: React.FC<MolecularHeaderProps> = ({ molecularObject }) => {
  return (
    <header className="molecular-header-card glassmorphic">
      <div className="molecular-header-top">
        <div className="molecular-header-identity">
          <Link href="/dna-genetics" className="back-link-btn">
            <BioIcon name="chevron-left" size={14} /> Back to Genetics Engine
          </Link>
          <div className="molecular-title-row">
            <span
              className="molecular-icon-badge"
              style={{
                backgroundColor: `${molecularObject.accentColor}20`,
                borderColor: molecularObject.accentColor
              }}
            >
              {molecularObject.icon}
            </span>
            <div>
              <div className="molecular-badge-strip">
                <span className="symbol-badge">{molecularObject.symbol}</span>
                <span className="category-badge">{molecularObject.category.toUpperCase()}</span>
                <span className={`difficulty-badge ${molecularObject.difficulty}`}>
                  {molecularObject.difficulty.toUpperCase()}
                </span>
              </div>
              <h1 className="molecular-main-title">{molecularObject.name}</h1>
              <p className="molecular-subcategory">{molecularObject.subcategory}</p>
            </div>
          </div>
        </div>

        <div className="molecular-header-actions">
          <a href="#interactive-experiment" className="action-btn-primary">
            <BioIcon name="virtual-lab" size={16} /> Interactive Lab
          </a>
          <a href="#assessment-suite" className="action-btn-secondary">
            <BioIcon name="quiz" size={16} /> Assessment & Quiz
          </a>
        </div>
      </div>

      <p className="molecular-overview-lead">{molecularObject.overview}</p>

      {/* Quick Stats Grid */}
      <div className="molecular-stats-grid">
        <div className="stat-pill">
          <span className="stat-label">PRIMARY FUNCTION</span>
          <span className="stat-value">{molecularObject.primaryFunction}</span>
        </div>
        <div className="stat-pill">
          <span className="stat-label">LOCATION IN CELL</span>
          <span className="stat-value">{molecularObject.locationInCell.join(", ")}</span>
        </div>
        <div className="stat-pill">
          <span className="stat-label">ESTIMATED STUDY TIME</span>
          <span className="stat-value">⏱️ {molecularObject.estimatedStudyMinutes} Mins</span>
        </div>
      </div>

      <style>{`
        .molecular-header-card {
          padding: 1.75rem;
          border-radius: 20px;
          background: rgba(12, 22, 32, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid var(--ds-border-muted);
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .molecular-header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .back-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--ds-accent);
          text-decoration: none;
          font-size: 0.78rem;
          font-weight: 700;
          margin-bottom: 12px;
          transition: color 0.2s;
        }
        .back-link-btn:hover {
          color: #fff;
        }

        .molecular-title-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .molecular-icon-badge {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          border: 1px solid transparent;
          flex-shrink: 0;
        }

        .molecular-badge-strip {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .symbol-badge {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #e2e8f0;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 6px;
          letter-spacing: 0.05em;
        }

        .category-badge {
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60a5fa;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .difficulty-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 6px;
        }
        .difficulty-badge.beginner { background: rgba(57, 255, 20, 0.1); color: var(--ds-accent); }
        .difficulty-badge.intermediate { background: rgba(250, 204, 21, 0.1); color: #facc15; }
        .difficulty-badge.advanced { background: rgba(239, 68, 68, 0.1); color: #fca5a5; }

        .molecular-main-title {
          margin: 0;
          font-size: 1.85rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .molecular-subcategory {
          margin: 2px 0 0 0;
          font-size: 0.88rem;
          color: var(--ds-fg-subtle);
          font-style: italic;
        }

        .molecular-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .action-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--ds-accent);
          color: var(--ds-bg-primary);
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 0.82rem;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.25s;
          box-shadow: var(--ds-glow-sm);
        }
        .action-btn-primary:hover {
          transform: translateY(-2px);
          background: #45ff24;
        }

        .action-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          color: #fff;
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s;
        }
        .action-btn-secondary:hover {
          border-color: rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.08);
        }

        .molecular-overview-lead {
          margin: 0;
          font-size: 1rem;
          line-height: 1.6;
          color: #cbd5e1;
        }

        .molecular-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 6px;
        }

        .stat-pill {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          padding: 10px 14px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.1em;
        }

        .stat-value {
          font-size: 0.84rem;
          font-weight: 700;
          color: #fff;
        }
      `}</style>
    </header>
  );
};
