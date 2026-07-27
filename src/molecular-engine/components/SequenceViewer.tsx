"use client";

import React, { useState } from "react";
import { translateMRNAToProtein, transcribeDNAToRNA } from "../services/codonTranslator";

interface SequenceViewerProps {
  initialDNA?: string;
}

export const SequenceViewer: React.FC<SequenceViewerProps> = ({
  initialDNA = "ATGGTGCACTCTACTCCTGAGGAGAAG"
}) => {
  const [dnaInput, setDnaInput] = useState<string>(initialDNA);

  const cleanDNA = dnaInput.toUpperCase().replace(/[^ATCG]/g, "");
  const mrnaSequence = transcribeDNAToRNA(cleanDNA);
  const aminoAcids = translateMRNAToProtein(mrnaSequence);

  return (
    <div className="sequence-viewer-card glassmorphic">
      <div className="card-header">
        <div>
          <span className="card-eyebrow">SEQUENCE & CODON TRANSLATOR</span>
          <h3 className="card-title">Central Dogma Sequence Inspector</h3>
        </div>
      </div>

      {/* Interactive DNA Input Field */}
      <div className="input-field-wrap">
        <label className="input-lbl">5' → 3' DNA TEMPLATE STRAND:</label>
        <input
          type="text"
          value={dnaInput}
          onChange={(e) => setDnaInput(e.target.value)}
          className="sequence-input"
          placeholder="Enter DNA sequence (e.g. ATGCGATCG...)"
        />
      </div>

      {/* Dynamic 3-Strand Visualization */}
      <div className="strands-display-grid">
        {/* 1. DNA Template */}
        <div className="strand-box dna-strand">
          <span className="strand-tag">5' → 3' DNA TEMPLATE</span>
          <div className="letters-row">
            {cleanDNA.split("").map((b, i) => (
              <span key={i} className={`base-badge ${b}`}>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* 2. mRNA Transcript */}
        <div className="strand-box mrna-strand">
          <span className="strand-tag">5' → 3' mRNA TRANSCRIPT</span>
          <div className="letters-row">
            {mrnaSequence.split("").map((b, i) => (
              <span key={i} className={`base-badge rna ${b}`}>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Translated Polypeptide */}
        <div className="strand-box protein-strand">
          <span className="strand-tag">TRANSLATED POLYPEPTIDE CHAIN</span>
          <div className="codons-row">
            {aminoAcids.map((aa, i) => (
              <div
                key={i}
                className={`aa-card ${aa.isStart ? "start" : ""} ${aa.isStop ? "stop" : ""}`}
              >
                <span className="codon-str">{aa.codon}</span>
                <strong className="aa-code">{aa.aminoAcidCode}</strong>
                <span className="aa-name">{aa.aminoAcidName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .sequence-viewer-card {
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

        .input-field-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .input-lbl {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.08em;
        }

        .sequence-input {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--ds-border-muted);
          border-radius: 10px;
          padding: 10px 14px;
          color: var(--ds-accent);
          font-family: monospace;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          outline: none;
        }
        .sequence-input:focus {
          border-color: var(--ds-accent);
        }

        .strands-display-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .strand-box {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .strand-tag {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.08em;
        }

        .letters-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          font-family: monospace;
        }

        .base-badge {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.88rem;
          font-weight: 900;
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }
        .base-badge.A { background: #3b82f6; }
        .base-badge.T { background: #ef4444; }
        .base-badge.G { background: #10b981; }
        .base-badge.C { background: #f59e0b; }
        .base-badge.U { background: #8b5cf6; }

        .codons-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .aa-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--ds-border-muted);
          border-radius: 10px;
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 70px;
        }
        .aa-card.start {
          background: rgba(57, 255, 20, 0.1);
          border-color: var(--ds-accent);
        }
        .aa-card.stop {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
        }

        .codon-str {
          font-size: 0.62rem;
          font-family: monospace;
          color: var(--ds-fg-subtle);
        }

        .aa-code {
          font-size: 1rem;
          color: #fff;
        }

        .aa-name {
          font-size: 0.62rem;
          color: #cbd5e1;
        }
      `}</style>
    </div>
  );
};
