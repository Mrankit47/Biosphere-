"use client";

import React from "react";
import type { DiseaseObject } from "../types";

interface DiagnosisPanelProps {
  disease: DiseaseObject;
}

export const DiagnosisPanel: React.FC<DiagnosisPanelProps> = ({ disease }) => {
  return (
    <div className="diagnosis-panel-card glassmorphic">
      <div className="panel-title-bar">
        <span className="panel-eyebrow">DIAGNOSTIC PROTOCOL</span>
        <h3 className="panel-heading">Laboratory Tests, Imaging & Criteria</h3>
      </div>

      <p className="diagnosis-lead">{disease.diagnosisOverview}</p>

      {/* Diagnostic Criteria Box */}
      {disease.diagnosticCriteria && disease.diagnosticCriteria.length > 0 && (
        <div className="criteria-box">
          <span className="criteria-box-title">📋 FORMAL DIAGNOSTIC CRITERIA</span>
          <ul className="criteria-list">
            {disease.diagnosticCriteria.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Lab Tests Table */}
      {disease.labTests && disease.labTests.length > 0 && (
        <div className="lab-tests-section">
          <h4 className="sub-heading">🔬 Key Laboratory Markers</h4>
          <div className="table-wrapper">
            <table className="lab-table">
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Category</th>
                  <th>Normal Range</th>
                  <th>Pathological Value</th>
                  <th>Clinical Significance</th>
                </tr>
              </thead>
              <tbody>
                {disease.labTests.map((t, idx) => (
                  <tr key={idx}>
                    <td className="test-name-td">{t.testName}</td>
                    <td><span className="cat-pill">{t.category}</span></td>
                    <td className="normal-td">{t.normalRange}</td>
                    <td className="patho-td">{t.diseaseValue}</td>
                    <td className="significance-td">{t.clinicalSignificance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Imaging Findings */}
      {disease.imagingFindings && disease.imagingFindings.length > 0 && (
        <div className="imaging-section">
          <h4 className="sub-heading">🖼️ Radiological & Imaging Findings</h4>
          <div className="imaging-cards-grid">
            {disease.imagingFindings.map((img, idx) => (
              <div key={idx} className="imaging-card">
                <div className="imaging-header">
                  <span className="modality-tag">{img.modality}</span>
                  <span className="key-feature-tag">{img.keyFeature}</span>
                </div>
                <p className="imaging-desc">{img.findings}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .diagnosis-panel-card {
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

        .diagnosis-lead {
          margin: 0;
          font-size: 0.92rem;
          color: #cbd5e1;
          line-height: 1.5;
        }

        .criteria-box {
          background: rgba(59, 130, 246, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.25);
          border-radius: 14px;
          padding: 1rem 1.25rem;
        }

        .criteria-box-title {
          font-size: 0.68rem;
          font-weight: 800;
          color: #60a5fa;
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 8px;
        }

        .criteria-list {
          margin: 0;
          padding-left: 1.2rem;
          font-size: 0.84rem;
          color: #fff;
          line-height: 1.6;
        }

        .sub-heading {
          margin: 0 0 10px 0;
          font-size: 0.95rem;
          font-weight: 800;
          color: #fff;
        }

        .table-wrapper {
          overflow-x: auto;
          border-radius: 12px;
          border: 1px solid var(--ds-border-muted);
        }

        .lab-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.8rem;
        }

        .lab-table th {
          background: rgba(0, 0, 0, 0.4);
          color: var(--ds-fg-subtle);
          font-size: 0.65rem;
          font-weight: 800;
          padding: 10px 12px;
          border-bottom: 1px solid var(--ds-border-muted);
        }

        .lab-table td {
          padding: 10px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: #cbd5e1;
        }

        .test-name-td {
          font-weight: 800;
          color: #fff;
        }

        .cat-pill {
          background: rgba(255, 255, 255, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.65rem;
        }

        .normal-td {
          color: var(--ds-fg-subtle);
        }

        .patho-td {
          color: #ef4444;
          font-weight: 800;
        }

        .significance-td {
          font-size: 0.75rem;
        }

        .imaging-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
        }

        .imaging-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          padding: 1rem;
        }

        .imaging-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .modality-tag {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .key-feature-tag {
          font-size: 0.65rem;
          color: #facc15;
          font-weight: 700;
        }

        .imaging-desc {
          margin: 0;
          font-size: 0.8rem;
          color: #e2e8f0;
          line-height: 1.45;
        }
      `}</style>
    </div>
  );
};
