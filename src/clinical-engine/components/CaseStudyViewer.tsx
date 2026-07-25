"use client";

import React, { useState } from "react";
import { BioIcon } from "@/components/ui/navigation/BioIcon";
import type { PatientCaseStudy } from "../types";

interface CaseStudyViewerProps {
  cases: PatientCaseStudy[];
}

export const CaseStudyViewer: React.FC<CaseStudyViewerProps> = ({ cases }) => {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  if (!cases || cases.length === 0) return null;

  const currentCase = cases[selectedCaseIdx] || cases[0];

  const handleSelectOption = (qId: string, optIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optIdx }));
    setShowExplanation((prev) => ({ ...prev, [qId]: true }));
  };

  return (
    <div className="case-study-card glassmorphic">
      <div className="case-header-row">
        <div>
          <span className="case-eyebrow">CLINICAL SIMULATION</span>
          <h3 className="case-heading">Patient Case Studies & Differential Diagnosis</h3>
        </div>

        {/* Case selector tabs if multiple */}
        {cases.length > 1 && (
          <div className="case-tabs-strip">
            {cases.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setSelectedCaseIdx(i)}
                className={`case-tab-btn ${selectedCaseIdx === i ? "active" : ""}`}
              >
                Case {i + 1}: {c.patient.name} ({c.patient.age}yo)
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Patient Vitals & Demographics Card */}
      <div className="patient-demographics-banner">
        <div className="patient-profile-header">
          <span className="patient-avatar">👤</span>
          <div>
            <h4 className="patient-name">{currentCase.patient.name} ({currentCase.patient.age} Y/O {currentCase.patient.gender})</h4>
            <span className="patient-occ">Occupation: {currentCase.patient.occupation}</span>
          </div>
        </div>

        <div className="vitals-strip">
          <div className="vital-item"><span className="v-lbl">BP</span><strong>{currentCase.patient.vitals.bloodPressure}</strong></div>
          <div className="vital-item"><span className="v-lbl">HR</span><strong>{currentCase.patient.vitals.heartRate}</strong></div>
          <div className="vital-item"><span className="v-lbl">RR</span><strong>{currentCase.patient.vitals.respiratoryRate}</strong></div>
          <div className="vital-item"><span className="v-lbl">TEMP</span><strong>{currentCase.patient.vitals.temperature}</strong></div>
          <div className="vital-item"><span className="v-lbl">SpO2</span><strong>{currentCase.patient.vitals.oxygenSaturation}</strong></div>
        </div>
      </div>

      {/* Chief Complaint & Presentation */}
      <div className="case-section-block">
        <span className="case-sec-title">🗣️ CHIEF COMPLAINT & PRESENTATION</span>
        <p className="cc-text">"{currentCase.patient.chiefComplaint}"</p>
        <p className="presentation-desc">{currentCase.symptomPresentation}</p>
      </div>

      {/* Medical History & Physical Exam */}
      <div className="history-exam-2col">
        <div className="he-block">
          <span className="case-sec-title">📋 MEDICAL HISTORY</span>
          <ul className="he-list">
            {currentCase.medicalHistory.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>

        <div className="he-block">
          <span className="case-sec-title">🩺 PHYSICAL EXAMINATION</span>
          <ul className="he-list">
            {currentCase.physicalExamination.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Diagnostic Labs & Imaging */}
      <div className="case-section-block">
        <span className="case-sec-title">🔬 DIAGNOSTIC RESULTS</span>
        <div className="case-labs-grid">
          {currentCase.diagnosticResults.labs.map((l, i) => (
            <div key={i} className="case-lab-item">
              <span className="lab-title">{l.testName}</span>
              <span className="lab-val">{l.diseaseValue}</span>
              <span className="lab-sig">{l.clinicalSignificance}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmed Diagnosis & Outcome */}
      <div className="confirmed-dx-banner">
        <div>
          <span className="dx-label">CONFIRMED CLINICAL DIAGNOSIS</span>
          <h4 className="dx-title">{currentCase.confirmedDiagnosis}</h4>
        </div>
        <div className="outcome-text">
          <strong>Outcome:</strong> {currentCase.patientOutcome}
        </div>
      </div>

      {/* Reflection Quiz Questions */}
      {currentCase.reflectionQuestions && currentCase.reflectionQuestions.length > 0 && (
        <div className="reflection-section">
          <span className="case-sec-title">❓ CLINICAL REASONING REFLECTION</span>
          <div className="reflection-questions-list">
            {currentCase.reflectionQuestions.map((q) => {
              const selectedOpt = userAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctAnswerIndex;

              return (
                <div key={q.id} className="quiz-q-card">
                  <h5 className="quiz-q-text">{q.question}</h5>
                  <div className="quiz-opts-grid">
                    {q.options.map((opt, oIdx) => {
                      let btnClass = "quiz-opt-btn";
                      if (isAnswered) {
                        if (oIdx === q.correctAnswerIndex) btnClass += " correct";
                        else if (oIdx === selectedOpt) btnClass += " incorrect";
                      }
                      return (
                        <button
                          key={oIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(q.id, oIdx)}
                          className={btnClass}
                        >
                          <span className="opt-letter">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                        </button>
                      );
                    })}
                  </div>

                  {showExplanation[q.id] && (
                    <div className={`explanation-box ${isCorrect ? "correct" : "incorrect"}`}>
                      <strong>{isCorrect ? "✅ Correct!" : "❌ Incorrect"}</strong>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .case-study-card {
          padding: 1.5rem;
          border-radius: 20px;
          background: rgba(12, 22, 32, 0.85);
          border: 1px solid var(--ds-border-muted);
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .case-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .case-eyebrow {
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-accent);
          letter-spacing: 0.12em;
        }

        .case-heading {
          margin: 2px 0 0 0;
          font-size: 1.2rem;
          font-weight: 900;
          color: #fff;
        }

        .case-tabs-strip {
          display: flex;
          gap: 6px;
        }

        .case-tab-btn {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          color: var(--ds-fg-muted);
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .case-tab-btn.active {
          border-color: var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
        }

        .patient-demographics-banner {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--ds-border-muted);
          border-radius: 14px;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .patient-profile-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .patient-avatar {
          font-size: 1.8rem;
        }

        .patient-name {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 900;
          color: #fff;
        }

        .patient-occ {
          font-size: 0.75rem;
          color: var(--ds-fg-subtle);
        }

        .vitals-strip {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .vital-item {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--ds-border-muted);
          padding: 4px 10px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .v-lbl {
          font-size: 0.55rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
        }
        .vital-item strong {
          font-size: 0.78rem;
          color: var(--ds-accent);
        }

        .case-section-block {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--ds-border-muted);
          border-radius: 14px;
          padding: 1rem;
        }

        .case-sec-title {
          font-size: 0.65rem;
          font-weight: 900;
          color: var(--ds-accent);
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 8px;
        }

        .cc-text {
          margin: 0 0 6px 0;
          font-size: 0.95rem;
          font-weight: 700;
          color: #facc15;
          font-style: italic;
        }

        .presentation-desc {
          margin: 0;
          font-size: 0.85rem;
          color: #cbd5e1;
          line-height: 1.5;
        }

        .history-exam-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .he-block {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--ds-border-muted);
          border-radius: 14px;
          padding: 1rem;
        }

        .he-list {
          margin: 0;
          padding-left: 1.2rem;
          font-size: 0.8rem;
          color: #cbd5e1;
          line-height: 1.5;
        }

        .case-labs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }

        .case-lab-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--ds-border-muted);
          padding: 8px 10px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .lab-title { font-size: 0.7rem; color: var(--ds-fg-subtle); }
        .lab-val { font-size: 0.88rem; font-weight: 800; color: #ef4444; }
        .lab-sig { font-size: 0.7rem; color: #cbd5e1; }

        .confirmed-dx-banner {
          background: rgba(57, 255, 20, 0.08);
          border: 1px solid rgba(57, 255, 20, 0.3);
          border-radius: 14px;
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .dx-label {
          font-size: 0.62rem;
          font-weight: 900;
          color: var(--ds-accent);
          letter-spacing: 0.08em;
        }

        .dx-title {
          margin: 2px 0 0 0;
          font-size: 1.1rem;
          font-weight: 900;
          color: #fff;
        }

        .outcome-text {
          font-size: 0.8rem;
          color: #e2e8f0;
          max-width: 400px;
        }

        .reflection-questions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 10px;
        }

        .quiz-q-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--ds-border-muted);
          border-radius: 12px;
          padding: 1rem;
        }

        .quiz-q-text {
          margin: 0 0 10px 0;
          font-size: 0.9rem;
          font-weight: 800;
          color: #fff;
        }

        .quiz-opts-grid {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .quiz-opt-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--ds-border-muted);
          color: #cbd5e1;
          padding: 8px 12px;
          border-radius: 8px;
          text-align: left;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .quiz-opt-btn:hover:not(:disabled) {
          border-color: var(--ds-border-accent);
          color: #fff;
        }
        .quiz-opt-btn.correct {
          background: rgba(57, 255, 20, 0.15);
          border-color: var(--ds-accent);
          color: var(--ds-accent);
          font-weight: 700;
        }
        .quiz-opt-btn.incorrect {
          background: rgba(239, 68, 68, 0.15);
          border-color: #ef4444;
          color: #fca5a5;
        }

        .opt-letter {
          font-weight: 800;
          margin-right: 6px;
        }

        .explanation-box {
          margin-top: 10px;
          padding: 10px;
          border-radius: 8px;
          font-size: 0.78rem;
          line-height: 1.45;
        }
        .explanation-box.correct {
          background: rgba(57, 255, 20, 0.08);
          border: 1px solid rgba(57, 255, 20, 0.2);
          color: #fff;
        }
        .explanation-box.incorrect {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #fff;
        }
      `}</style>
    </div>
  );
};
