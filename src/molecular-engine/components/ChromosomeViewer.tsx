"use client";

import React, { useState } from "react";

export const ChromosomeViewer: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<number>(0);

  const packagingLevels = [
    { name: "1. DNA Double Helix", scale: "2 nm diameter", desc: "Double-stranded antiparallel DNA polymer." },
    { name: "2. Nucleosome 'Beads'", scale: "11 nm diameter", desc: "147 bp DNA wrapped 1.65 turns around histone octamer." },
    { name: "3. Chromatin Fiber", scale: "30 nm diameter", desc: "Histone H1 stabilizes nucleosome array into solenoid fiber." },
    { name: "4. Looped Domains", scale: "300 nm diameter", desc: "Chromatin loops anchored to nuclear matrix scaffolding." },
    { name: "5. Metaphase Chromosome", scale: "1,400 nm diameter", desc: "Maximal compaction during cell division." }
  ];

  return (
    <div className="chromosome-viewer-card glassmorphic">
      <div className="card-header">
        <div>
          <span className="card-eyebrow">GENOMIC PACKAGING EXPLORER</span>
          <h3 className="card-title">Chromatin Hierarchy & Karyotype Anatomy</h3>
        </div>
      </div>

      {/* Chromosome Anatomy Visual Bar */}
      <div className="chromosome-anatomy-box">
        <div className="chromosome-arm p-arm">
          <span className="arm-lbl">p-arm (Short Arm)</span>
          <span className="telomere-top">TELOMERE (TTAGGG)</span>
          <div className="band band-1">11p15.4 (HBB Gene)</div>
          <div className="band band-2">11p13</div>
        </div>

        <div className="centromere-node">
          <span>CENTROMERE</span>
        </div>

        <div className="chromosome-arm q-arm">
          <div className="band band-3">11q13</div>
          <div className="band band-4">11q23</div>
          <span className="telomere-bottom">TELOMERE (TTAGGG)</span>
          <span className="arm-lbl">q-arm (Long Arm)</span>
        </div>
      </div>

      {/* Packaging Hierarchy Selector */}
      <div className="packaging-selector-grid">
        {packagingLevels.map((lvl, idx) => (
          <button
            key={idx}
            onClick={() => setActiveLevel(idx)}
            className={`lvl-pill-btn ${activeLevel === idx ? "active" : ""}`}
          >
            <span className="lvl-name">{lvl.name}</span>
            <span className="lvl-scale">{lvl.scale}</span>
          </button>
        ))}
      </div>

      {/* Active Level Detail Box */}
      <div className="lvl-detail-box">
        <div className="lvl-meta">
          <span className="lvl-tag">SCALE: {packagingLevels[activeLevel].scale}</span>
          <h4 className="lvl-title">{packagingLevels[activeLevel].name}</h4>
        </div>
        <p className="lvl-desc">{packagingLevels[activeLevel].desc}</p>
      </div>

      <style>{`
        .chromosome-viewer-card {
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

        .chromosome-anatomy-box {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--ds-border-muted);
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .chromosome-arm {
          width: 140px;
          background: rgba(99, 102, 241, 0.15);
          border: 2px solid #6366f1;
          border-radius: 20px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          position: relative;
        }

        .arm-lbl {
          font-size: 0.65rem;
          font-weight: 800;
          color: #a5b4fc;
        }

        .telomere-top, .telomere-bottom {
          font-size: 0.55rem;
          font-weight: 900;
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
          padding: 2px 6px;
          border-radius: 4px;
        }

        .band {
          width: 90%;
          padding: 4px;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 800;
          text-align: center;
        }
        .band-1 { background: #ef4444; color: #fff; }
        .band-2 { background: rgba(255, 255, 255, 0.1); color: #cbd5e1; }
        .band-3 { background: rgba(255, 255, 255, 0.2); color: #fff; }
        .band-4 { background: #3b82f6; color: #fff; }

        .centromere-node {
          width: 60px;
          height: 24px;
          border-radius: 12px;
          background: #f59e0b;
          color: #000;
          font-size: 0.6rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.05em;
          box-shadow: 0 0 12px rgba(245, 158, 11, 0.5);
        }

        .packaging-selector-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 8px;
        }

        .lvl-pill-btn {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          padding: 8px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          cursor: pointer;
          transition: all 0.2s;
        }
        .lvl-pill-btn:hover {
          border-color: var(--ds-border-accent);
        }
        .lvl-pill-btn.active {
          border-color: var(--ds-accent);
          background: var(--ds-accent-faint);
        }

        .lvl-name {
          font-size: 0.72rem;
          font-weight: 800;
          color: #fff;
        }
        .lvl-scale {
          font-size: 0.62rem;
          color: var(--ds-fg-subtle);
        }

        .lvl-detail-box {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          padding: 1rem;
        }

        .lvl-tag {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.08em;
        }

        .lvl-title {
          margin: 2px 0 4px 0;
          font-size: 1rem;
          font-weight: 900;
          color: #fff;
        }

        .lvl-desc {
          margin: 0;
          font-size: 0.82rem;
          color: #cbd5e1;
        }
      `}</style>
    </div>
  );
};
