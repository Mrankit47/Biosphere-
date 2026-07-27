"use client";

import React, { useState } from "react";
import { analyzeMutationImpact } from "../services/mutationEngine";
import type { MutationType } from "../types";

export const MutationPanel: React.FC = () => {
  const [selectedType, setSelectedType] = useState<MutationType>("missense");

  const mutationPresets: Record<MutationType, { wt: string; mut: string; name: string }> = {
    missense: {
      wt: "ATGGTGCACTCTACTCCTGAGGAGAAG",
      mut: "ATGGTGCACTCTACTCCTGTGGAGAAG",
      name: "Missense Point Mutation (Sickle Cell HbS: Glu6Val)"
    },
    silent: {
      wt: "ATGGTGCACTCTACTCCTGAGGAGAAG",
      mut: "ATGGTGCACTCTACTCCUGAGGAGAAG",
      name: "Silent Mutation (Synonymous Codon Change)"
    },
    nonsense: {
      wt: "ATGGTGCACTCTACTCCTGAGGAGAAG",
      mut: "ATGGTGCACTCTACTTAAGAGGAGAAG",
      name: "Nonsense Mutation (Premature UAA Stop Codon)"
    },
    frameshift: {
      wt: "ATGGTGCACTCTACTCCTGAGGAGAAG",
      mut: "ATGGTGCACTCTACTACCTGAGGAGAAG",
      name: "Frameshift Insertion (Single Base Insertion)"
    },
    insertion: {
      wt: "ATGGTGCACTCTACTCCTGAGGAGAAG",
      mut: "ATGGTGCACTCTACTACCTGAGGAGAAG",
      name: "Nucleotide Insertion"
    },
    deletion: {
      wt: "ATGGTGCACTCTACTCCTGAGGAGAAG",
      mut: "ATGGTGCACTCTACTGAGGAGAAG",
      name: "Codon Deletion (CFTR ΔF508 style)"
    },
    duplication: {
      wt: "ATGGTGCACTCTACTCCTGAGGAGAAG",
      mut: "ATGGTGCACTCTACTACTCCTGAGGAGAAG",
      name: "Nucleotide Duplication"
    }
  };

  const currentPreset = mutationPresets[selectedType] || mutationPresets.missense;
  const impact = analyzeMutationImpact(currentPreset.wt, currentPreset.mut, selectedType);

  return (
    <div className="mutation-panel-card glassmorphic">
      <div className="card-header">
        <div>
          <span className="card-eyebrow">MUTATION IMPACT SIMULATOR</span>
          <h3 className="card-title">Mutational Consequence Engine</h3>
        </div>
      </div>

      {/* Mutation Type Selector Pills */}
      <div className="mutation-types-strip">
        {(["missense", "silent", "nonsense", "frameshift", "deletion"] as MutationType[]).map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`type-pill-btn ${selectedType === t ? "active" : ""}`}
          >
            {t.toUpperCase()} MUTATION
          </button>
        ))}
      </div>

      {/* Preset Title */}
      <div className="preset-name-bar">
        <span className="p-icon">⚡</span>
        <h4 className="p-title">{currentPreset.name}</h4>
      </div>

      {/* Wildtype vs Mutant Comparison Grid */}
      <div className="comparison-grid-2col">
        {/* Wildtype Column */}
        <div className="col-card wildtype">
          <span className="col-tag">WILDTYPE (NORMAL)</span>
          <div className="seq-block">
            <span className="lbl">DNA Sequence:</span>
            <code className="code-seq">{impact.wildtypeSequence}</code>
          </div>
          <div className="seq-block">
            <span className="lbl">Protein Product:</span>
            <code className="code-seq prot">{impact.wildtypeProtein}</code>
          </div>
        </div>

        {/* Mutant Column */}
        <div className="col-card mutant">
          <span className="col-tag mut-tag">MUTANT (PATHOLOGICAL)</span>
          <div className="seq-block">
            <span className="lbl">Mutant DNA Sequence:</span>
            <code className="code-seq mut">{impact.mutantSequence}</code>
          </div>
          <div className="seq-block">
            <span className="lbl">Mutant Protein Product:</span>
            <code className="code-seq mut-prot">{impact.mutantProtein}</code>
          </div>
        </div>
      </div>

      {/* Functional Consequence Banner */}
      <div className="consequence-banner">
        <span className="banner-lbl">FUNCTIONAL & CLINICAL IMPACT</span>
        <p className="banner-desc">{impact.functionalEffect}</p>
        {impact.associatedDisease && (
          <span className="disease-link-pill">
            Associated Condition: <strong>{impact.associatedDisease}</strong>
          </span>
        )}
      </div>

      <style>{`
        .mutation-panel-card {
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

        .mutation-types-strip {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .type-pill-btn {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          color: var(--ds-fg-muted);
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .type-pill-btn:hover {
          border-color: var(--ds-border-accent);
        }
        .type-pill-btn.active {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
        }

        .preset-name-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          padding: 10px 14px;
        }

        .p-icon { font-size: 1.2rem; }
        .p-title { margin: 0; font-size: 0.95rem; font-weight: 800; color: #fff; }

        .comparison-grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .col-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          border-radius: 14px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .col-tag {
          font-size: 0.62rem;
          font-weight: 900;
          color: var(--ds-accent);
          letter-spacing: 0.08em;
        }
        .mut-tag { color: #ef4444; }

        .seq-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .lbl { font-size: 0.68rem; color: var(--ds-fg-subtle); }

        .code-seq {
          background: rgba(0, 0, 0, 0.5);
          padding: 6px 10px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 0.8rem;
          color: var(--ds-accent);
          word-break: break-all;
        }
        .code-seq.prot { color: #60a5fa; }
        .code-seq.mut { color: #fca5a5; border: 1px solid #ef4444; }
        .code-seq.mut-prot { color: #facc15; border: 1px solid #f59e0b; }

        .consequence-banner {
          background: rgba(245, 158, 11, 0.08);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 14px;
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .banner-lbl {
          font-size: 0.62rem;
          font-weight: 900;
          color: #f59e0b;
          letter-spacing: 0.08em;
        }

        .banner-desc {
          margin: 0;
          font-size: 0.88rem;
          color: #fff;
          line-height: 1.5;
        }

        .disease-link-pill {
          font-size: 0.75rem;
          color: #ef4444;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};
