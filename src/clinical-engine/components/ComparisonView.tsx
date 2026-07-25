"use client";

import React, { useState } from "react";
import { getAllDiseases, generateDiseaseComparison } from "../services/clinicalResolver";
import { BioIcon } from "@/components/ui/navigation/BioIcon";

interface ComparisonViewProps {
  initialDiseaseIds?: string[];
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  initialDiseaseIds = ["diabetes", "hypertension"]
}) => {
  const allDiseases = getAllDiseases();
  const [selectedIds, setSelectedIds] = useState<string[]>(initialDiseaseIds);

  const comparison = generateDiseaseComparison(selectedIds);

  const toggleDiseaseSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((i) => i !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  return (
    <div className="comparison-view-card glassmorphic">
      <div className="comp-header">
        <div>
          <span className="comp-eyebrow">DISEASE COMPARISON ENGINE</span>
          <h3 className="comp-heading">Side-by-Side Pathological & Therapeutic Analysis</h3>
        </div>

        {/* Multi-disease selectors */}
        <div className="selector-pills-row">
          <span className="select-lbl">Select Diseases (Max 3):</span>
          {allDiseases.map((d) => {
            const isSelected = selectedIds.includes(d.id);
            return (
              <button
                key={d.id}
                onClick={() => toggleDiseaseSelection(d.id)}
                className={`disease-selector-btn ${isSelected ? "selected" : ""}`}
              >
                {d.icon} {d.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      {comparison.diseases.length > 0 && (
        <div className="comp-matrix-wrapper">
          <table className="comp-matrix-table">
            <thead>
              <tr>
                <th className="feature-th">Clinical Feature</th>
                {comparison.diseases.map((d) => (
                  <th key={d.id} className="disease-th">
                    <span className="d-icon">{d.icon}</span>
                    <strong className="d-name">{d.name}</strong>
                    <span className="d-icd">ICD: {d.icdCode}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Category */}
              <tr>
                <td className="feature-td">Category</td>
                {comparison.diseases.map((d) => (
                  <td key={d.id}><span className="cat-pill">{d.category.toUpperCase()}</span></td>
                ))}
              </tr>

              {/* Primary Pathophysiology */}
              <tr>
                <td className="feature-td">Pathophysiology</td>
                {comparison.diseases.map((d) => (
                  <td key={d.id} className="desc-td">{d.pathophysiology}</td>
                ))}
              </tr>

              {/* Affected Organs */}
              <tr>
                <td className="feature-td">Affected Organs</td>
                {comparison.diseases.map((d) => (
                  <td key={d.id}>{d.affectedOrgans.join(", ")}</td>
                ))}
              </tr>

              {/* Key Symptoms */}
              <tr>
                <td className="feature-td">Key Symptoms</td>
                {comparison.diseases.map((d) => (
                  <td key={d.id}>
                    <ul className="comp-list">
                      {d.symptoms.slice(0, 3).map((s, i) => (
                        <li key={i}>{s.name}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Gold Standard Diagnostic */}
              <tr>
                <td className="feature-td">Gold Standard Diagnosis</td>
                {comparison.diseases.map((d) => (
                  <td key={d.id} className="desc-td">{d.diagnosticCriteria[0] || d.diagnosisOverview}</td>
                ))}
              </tr>

              {/* First-Line Medication */}
              <tr>
                <td className="feature-td">First-Line Medication</td>
                {comparison.diseases.map((d) => (
                  <td key={d.id}>
                    {d.treatment.medications[0] ? (
                      <div className="med-pill">
                        <strong>{d.treatment.medications[0].name}</strong> ({d.treatment.medications[0].class})
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .comparison-view-card {
          padding: 1.5rem;
          border-radius: 20px;
          background: rgba(12, 22, 32, 0.85);
          border: 1px solid var(--ds-border-muted);
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .comp-eyebrow {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.12em;
        }

        .comp-heading {
          margin: 2px 0 0 0;
          font-size: 1.2rem;
          font-weight: 900;
          color: #fff;
        }

        .selector-pills-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .select-lbl {
          font-size: 0.7rem;
          color: var(--ds-fg-subtle);
          font-weight: 700;
        }

        .disease-selector-btn {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          color: var(--ds-fg-muted);
          padding: 5px 10px;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .disease-selector-btn:hover {
          border-color: rgba(255, 255, 255, 0.25);
          color: #fff;
        }
        .disease-selector-btn.selected {
          border-color: var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
        }

        .comp-matrix-wrapper {
          overflow-x: auto;
          border-radius: 14px;
          border: 1px solid var(--ds-border-muted);
        }

        .comp-matrix-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.8rem;
        }

        .comp-matrix-table th {
          background: rgba(0, 0, 0, 0.4);
          padding: 12px;
          border-bottom: 1px solid var(--ds-border-muted);
        }

        .feature-th {
          width: 20%;
          color: var(--ds-fg-subtle);
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .disease-th {
          width: 40%;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .d-icon { font-size: 1.2rem; }
        .d-name { color: #fff; font-size: 0.92rem; font-weight: 900; }
        .d-icd { font-size: 0.65rem; color: var(--ds-fg-subtle); }

        .comp-matrix-table td {
          padding: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: #cbd5e1;
          vertical-align: top;
        }

        .feature-td {
          font-weight: 800;
          color: #fff;
          background: rgba(0, 0, 0, 0.2);
        }

        .desc-td {
          line-height: 1.45;
          font-size: 0.78rem;
        }

        .cat-pill {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 800;
        }

        .comp-list {
          margin: 0;
          padding-left: 1.2rem;
          font-size: 0.78rem;
        }

        .med-pill {
          background: rgba(57, 255, 20, 0.08);
          border: 1px solid rgba(57, 255, 20, 0.2);
          color: var(--ds-accent);
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
};
