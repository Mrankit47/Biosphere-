"use client";

import React, { useState } from "react";

export const ProteinViewer: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<number>(0);

  const proteinLevels = [
    {
      level: "Primary Structure",
      desc: "Linear sequence of amino acids joined by covalent peptide bonds.",
      features: ["Specified directly by mRNA coding sequence", "Reads N-terminus to C-terminus"],
      icon: "🧬"
    },
    {
      level: "Secondary Structure",
      desc: "Local spatial folding formed by hydrogen bonds between backbone atoms.",
      features: ["Right-handed Alpha-Helices", "Beta-Pleated Sheets", "Beta Turns"],
      icon: "🌀"
    },
    {
      level: "Tertiary Structure",
      desc: "Complete 3D globular subunit fold determined by side-chain (R-group) interactions.",
      features: ["Disulfide bridges (Cys-Cys)", "Hydrophobic core packing", "Salt bridges & H-bonds"],
      icon: "🫀"
    },
    {
      level: "Quaternary Structure",
      desc: "Assembly of multiple polypeptide subunits into a functional protein complex.",
      features: ["Hemoglobin tetramer (α2β2)", "Cooperative oxygen binding"],
      icon: "🩸"
    }
  ];

  return (
    <div className="protein-viewer-card glassmorphic">
      <div className="card-header">
        <div>
          <span className="card-eyebrow">PROTEIN CONFORMATION EXPLORER</span>
          <h3 className="card-title">4 Hierarchical Protein Structural Levels</h3>
        </div>
      </div>

      {/* Level Tabs */}
      <div className="level-tabs-grid">
        {proteinLevels.map((lvl, idx) => (
          <button
            key={idx}
            onClick={() => setActiveLevel(idx)}
            className={`level-tab-btn ${activeLevel === idx ? "active" : ""}`}
          >
            <span className="tab-icon">{lvl.icon}</span>
            <span className="tab-title">{lvl.level}</span>
          </button>
        ))}
      </div>

      {/* Active Structure Card */}
      <div className="structure-detail-card">
        <div className="detail-meta">
          <span className="level-num">LEVEL {activeLevel + 1} ARCHITECTURE</span>
          <h4 className="detail-name">{proteinLevels[activeLevel].level}</h4>
        </div>

        <p className="detail-desc">{proteinLevels[activeLevel].desc}</p>

        <div className="features-block">
          <span className="features-lbl">KEY STRUCTURAL CHARACTERISTICS:</span>
          <ul className="features-list">
            {proteinLevels[activeLevel].features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .protein-viewer-card {
          padding: 1.5rem;
          border-radius: 20px;
          background: rgba(12, 22, 32, 0.85);
          border: 1px solid var(--ds-border-muted);
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .card-eyebrow {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.12em;
        }

        .card-title {
          margin: 2px 0 0 0;
          font-size: 1.2rem;
          font-weight: 900;
          color: #fff;
        }

        .level-tabs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 8px;
        }

        .level-tab-btn {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          padding: 10px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .level-tab-btn:hover {
          border-color: var(--ds-border-accent);
        }
        .level-tab-btn.active {
          border-color: var(--ds-accent);
          background: var(--ds-accent-faint);
        }

        .tab-icon { font-size: 1.2rem; }
        .tab-title { font-size: 0.75rem; font-weight: 800; color: #fff; }

        .structure-detail-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--ds-border-muted);
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .level-num {
          font-size: 0.62rem;
          font-weight: 900;
          color: var(--ds-accent);
          letter-spacing: 0.08em;
        }

        .detail-name {
          margin: 2px 0 0 0;
          font-size: 1.1rem;
          font-weight: 900;
          color: #fff;
        }

        .detail-desc {
          margin: 0;
          font-size: 0.88rem;
          color: #cbd5e1;
          line-height: 1.5;
        }

        .features-lbl {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 6px;
        }

        .features-list {
          margin: 0;
          padding-left: 1.2rem;
          font-size: 0.82rem;
          color: #fff;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};
