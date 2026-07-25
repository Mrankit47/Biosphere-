"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BioIcon } from "@/components/ui/navigation/BioIcon";
import type { DiseaseObject } from "../types";

interface OrganDamageVisualizerProps {
  highlights: DiseaseObject["organDamageHighlights"];
  affectedOrgans: string[];
}

export const OrganDamageVisualizer: React.FC<OrganDamageVisualizerProps> = ({
  highlights,
  affectedOrgans
}) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  if (!highlights || highlights.length === 0) return null;

  const currentHighlight = highlights[activeIdx] || highlights[0];

  return (
    <div className="organ-damage-card glassmorphic">
      <div className="card-header-row">
        <div>
          <span className="card-eyebrow">PATHOMORPHOLOGY VISUALIZER</span>
          <h3 className="card-heading">Organ Damage & Micro-Structure Pathology</h3>
        </div>

        {affectedOrgans.length > 0 && (
          <Link
            href={`/human-body?organ=${affectedOrgans[0]}`}
            className="view-3d-btn"
          >
            <BioIcon name="human-body" size={14} /> Open 3D Organ Viewer
          </Link>
        )}
      </div>

      {/* Selector Tabs */}
      <div className="organ-tabs-row">
        {highlights.map((h, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`organ-tab-pill ${activeIdx === idx ? "active" : ""}`}
            style={{
              borderColor: activeIdx === idx ? h.pathologyColor : "var(--ds-border-muted)"
            }}
          >
            <span className="organ-dot" style={{ backgroundColor: h.pathologyColor }} />
            {h.organName}
          </button>
        ))}
      </div>

      {/* Pathomorphic Highlight Box */}
      <div className="pathology-display-box">
        <div className="pathology-meta-row">
          <span className="damage-type-badge">{currentHighlight.damageType}</span>
          <span className="organ-tag">{currentHighlight.organName.toUpperCase()}</span>
        </div>

        <h4 className="pathology-title">{currentHighlight.damageType}</h4>
        <p className="pathology-desc">{currentHighlight.description}</p>

        <div className="comparison-visual-placeholder">
          <div className="side-by-side-visual">
            <div className="visual-panel healthy">
              <span className="panel-tag">NORMAL PHYSIOLOGY</span>
              <div className="cell-mock healthy-micro">
                <span className="cell-dot" /> Intact Basal Membrane & Normal Tissue Architecture
              </div>
            </div>
            <div className="visual-panel pathological">
              <span className="panel-tag pathological-tag">PATHOLOGICAL DAMAGE</span>
              <div
                className="cell-mock pathological-micro"
                style={{ borderColor: currentHighlight.pathologyColor }}
              >
                <span className="damage-icon">⚡</span> {currentHighlight.damageType}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .organ-damage-card {
          padding: 1.5rem;
          border-radius: 20px;
          background: rgba(12, 22, 32, 0.85);
          border: 1px solid var(--ds-border-muted);
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .card-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .card-eyebrow {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.12em;
        }

        .card-heading {
          margin: 2px 0 0 0;
          font-size: 1.2rem;
          font-weight: 900;
          color: #fff;
        }

        .view-3d-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--ds-border-muted);
          color: var(--ds-accent);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 800;
          text-decoration: none;
          transition: all 0.2s;
        }
        .view-3d-btn:hover {
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
        }

        .organ-tabs-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .organ-tab-pill {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          color: var(--ds-fg-muted);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .organ-tab-pill.active {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
        }

        .organ-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .pathology-display-box {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--ds-border-muted);
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .pathology-meta-row {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .damage-type-badge {
          font-size: 0.62rem;
          font-weight: 900;
          color: #fca5a5;
          background: rgba(239, 68, 68, 0.15);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .organ-tag {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
        }

        .pathology-title {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 900;
          color: #fff;
        }

        .pathology-desc {
          margin: 0;
          font-size: 0.85rem;
          color: #cbd5e1;
          line-height: 1.5;
        }

        .side-by-side-visual {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 8px;
        }

        .visual-panel {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .panel-tag {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.08em;
        }
        .pathological-tag {
          color: #ef4444;
        }

        .cell-mock {
          padding: 1rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .healthy-micro {
          background: rgba(57, 255, 20, 0.05);
          border: 1px dashed rgba(57, 255, 20, 0.3);
          color: var(--ds-accent);
        }

        .pathological-micro {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid #ef4444;
          color: #fca5a5;
        }

        .cell-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--ds-accent);
        }
      `}</style>
    </div>
  );
};
