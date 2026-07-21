"use client";

import React, { useRef } from "react";

interface LabReportGeneratorProps {
  experimentName: string;
  subject: string;
  difficulty: string;
  objectives: string[];
  materials: string[];
  runHistory: any[];
  userObservations: Record<string, string>;
  observationQuestions: any[];
  quizScore: number;
  vivaScore: number;
  notes: string;
  onClose: () => void;
}

export default function LabReportGenerator({
  experimentName,
  subject,
  difficulty,
  objectives,
  materials,
  runHistory,
  userObservations,
  observationQuestions,
  quizScore,
  vivaScore,
  notes,
  onClose
}: LabReportGeneratorProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const studentName = "BioSphere Researcher";
  const timestamp = new Date().toLocaleString();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-4 md:p-8 flex flex-col items-center">
      {/* Utility action headers */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-4 no-print text-[11px]">
        <button
          onClick={onClose}
          className="bg-white/5 border border-[var(--ds-border-muted)] hover:bg-white/10 text-white font-bold py-1.5 px-3 rounded transition-all"
        >
          ← Return to Workspace
        </button>
        <button
          onClick={handlePrint}
          className="bg-[var(--ds-accent-faint)] border border-[var(--ds-border-accent)] hover:bg-[var(--ds-accent-subtle)] text-[var(--ds-accent)] font-bold py-1.5 px-4 rounded transition-all"
        >
          🖨️ Print / Export to PDF
        </button>
      </div>

      {/* Printable Report Document */}
      <div
        ref={reportRef}
        className="w-full max-w-3xl bg-[#090f09] border border-[var(--ds-border-muted)] rounded-2xl p-6 md:p-8 text-[var(--ds-fg)] print-layout shadow-2xl relative"
        id="lab-report-sheet"
      >
        {/* Decorative laboratory watermark stamp */}
        <div className="absolute top-8 right-8 border-4 border-dashed border-[var(--ds-accent-muted)]/20 text-[var(--ds-accent-muted)]/20 font-black px-4 py-2 rounded-lg text-lg rotate-12 select-none pointer-events-none text-center">
          BIOSPHERE ACADEMY<br />✓ PASSED
        </div>

        {/* Report Header */}
        <header className="border-b border-[var(--ds-border-muted)] pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-lg md:text-xl font-black text-white uppercase tracking-wider">
                Official Laboratory Report
              </h1>
              <p className="text-[10px] text-[var(--ds-accent)] font-mono uppercase tracking-widest mt-1">
                BioSphere Virtual Lab Engine v1.0
              </p>
            </div>
            <div className="text-right text-[9px] text-[var(--ds-fg-subtle)] font-mono">
              <div>Date: {timestamp}</div>
              <div>Course: Advanced Biology</div>
            </div>
          </div>

          {/* Student details panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-[10px] bg-white/2 border border-[var(--ds-border-muted)]/60 rounded-lg p-3">
            <div>
              <span className="text-[8px] text-[var(--ds-fg-subtle)] block uppercase">Student Name</span>
              <strong className="text-white">{studentName}</strong>
            </div>
            <div>
              <span className="text-[8px] text-[var(--ds-fg-subtle)] block uppercase">Experiment Title</span>
              <strong className="text-white">{experimentName}</strong>
            </div>
            <div>
              <span className="text-[8px] text-[var(--ds-fg-subtle)] block uppercase">Scientific Domain</span>
              <strong className="text-white">{subject}</strong>
            </div>
            <div>
              <span className="text-[8px] text-[var(--ds-fg-subtle)] block uppercase">Academic Difficulty</span>
              <strong className="text-white">{difficulty}</strong>
            </div>
          </div>
        </header>

        {/* Section 1: Objectives & Materials */}
        <section className="space-y-4 mb-6 text-[11px]">
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider border-b border-[var(--ds-border-muted)]/40 pb-1 mb-2">
              1. Project Objectives
            </h3>
            <ul className="list-decimal pl-5 space-y-1 text-[var(--ds-fg-muted)]">
              {objectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white uppercase tracking-wider border-b border-[var(--ds-border-muted)]/40 pb-1 mb-2">
              2. Required Equipment & Reagents
            </h3>
            <div className="flex flex-wrap gap-2 text-[10px] text-[var(--ds-fg-muted)]">
              {materials.map((mat, i) => (
                <span key={i} className="bg-white/5 border border-[var(--ds-border-muted)]/40 px-2 py-0.5 rounded">
                  {mat}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Observations logs & results */}
        <section className="space-y-4 mb-6 text-[11px]">
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider border-b border-[var(--ds-border-muted)]/40 pb-1 mb-2">
              3. Recorded Trial Runs Log
            </h3>
            {runHistory.length === 0 ? (
              <p className="text-[var(--ds-fg-subtle)] italic">No experimental trials recorded.</p>
            ) : (
              <table className="w-full text-left text-[10px] border-collapse border border-[var(--ds-border-muted)]/60 rounded">
                <thead>
                  <tr className="bg-white/5 border-b border-[var(--ds-border-muted)]/60 text-[var(--ds-fg-muted)]">
                    <th className="p-2 font-bold">Trial #</th>
                    <th className="p-2 font-bold">Input Variables</th>
                    <th className="p-2 font-bold text-right">Reaction Speed / Yield</th>
                  </tr>
                </thead>
                <tbody>
                  {runHistory.map((log, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-[var(--ds-border-muted)]/40 text-[var(--ds-fg-muted)]"
                    >
                      <td className="p-2">Trial {idx + 1}</td>
                      <td className="p-2">
                        {Object.entries(log.inputs)
                          .filter(([key]) => key !== "reactionRun")
                          .map(([key, val]) => `${key}: ${val}`)
                          .join(", ")}
                      </td>
                      <td className="p-2 text-right font-bold text-[var(--ds-accent)]">
                        {log.outputs.rate !== undefined ? `${log.outputs.rate}%` : "Success"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div>
            <h3 className="font-bold text-white uppercase tracking-wider border-b border-[var(--ds-border-muted)]/40 pb-1 mb-2">
              4. Analytical Questionnaire Responses
            </h3>
            <div className="space-y-3">
              {observationQuestions.map((q) => (
                <div key={q.id} className="bg-white/2 p-2.5 rounded border border-[var(--ds-border-muted)]/40">
                  <p className="font-bold text-[var(--ds-fg-muted)] text-[10px]">{q.question}</p>
                  <p className="text-[var(--ds-fg)] italic mt-1 pl-2 border-l-2 border-[var(--ds-accent-muted)] font-mono text-[10px]">
                    &quot;{userObservations[q.id] || "No answer submitted."}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Assessment Grades & Notebook */}
        <section className="space-y-4 mb-6 text-[11px]">
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider border-b border(--ds-border-muted)/40 pb-1 mb-2">
              5. Final Performance Grades
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/2 border border-[var(--ds-border-muted)]/60 rounded p-2">
                <span className="text-[8px] text-[var(--ds-fg-subtle)] uppercase block">Practical Quiz</span>
                <strong className="text-white text-sm">{quizScore} / 3 Correct</strong>
              </div>
              <div className="bg-white/2 border border-[var(--ds-border-muted)]/60 rounded p-2">
                <span className="text-[8px] text-[var(--ds-fg-subtle)] uppercase block">Lab Viva Voce</span>
                <strong className="text-white text-sm">{vivaScore}% Score</strong>
              </div>
              <div className="bg-white/2 border border-[var(--ds-border-muted)]/60 rounded p-2">
                <span className="text-[8px] text-[var(--ds-fg-subtle)] uppercase block">Cumulative Grade</span>
                <strong className="text-[var(--ds-accent)] text-sm">
                  {Math.round((quizScore / 3) * 50 + (vivaScore / 100) * 50)}%
                </strong>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white uppercase tracking-wider border-b border-[var(--ds-border-muted)]/40 pb-1 mb-2">
              6. Student Research Log Notebook
            </h3>
            <div className="bg-white/2 border border-[var(--ds-border-muted)]/40 rounded p-3 font-mono text-[10px] leading-relaxed whitespace-pre-wrap text-[var(--ds-fg-muted)]">
              {notes || "No extra research notes taken."}
            </div>
          </div>
        </section>

        {/* Signatures Footer */}
        <footer className="border-t border-[var(--ds-border-muted)] pt-8 mt-8 grid grid-cols-2 gap-8 text-[10px]">
          <div className="flex flex-col items-start border-t border-[var(--ds-fg-subtle)]/40 pt-1.5 w-[80%] mx-auto text-center">
            <span className="font-bold text-[var(--ds-fg-muted)]">Student Signature</span>
            <span className="text-[8px] text-[var(--ds-fg-subtle)] mt-0.5">Assigned via BioSphere Authenticator</span>
          </div>
          <div className="flex flex-col items-start border-t border-[var(--ds-fg-subtle)]/40 pt-1.5 w-[80%] mx-auto text-center">
            <span className="font-bold text-[var(--ds-fg-muted)]">Instructor Signature</span>
            <span className="text-[8px] text-[var(--ds-fg-subtle)] mt-0.5">Professor BioTutor AI Mentor</span>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @media print {
          /* Hide non-printable screen items */
          .no-print,
          header,
          footer:not(.print-layout footer),
          nav,
          .responsive-sidebar {
            display: none !important;
          }
          
          body,
          .lab-root,
          .lab-workspace-layout,
          #lab-report-sheet {
            background: #ffffff !important;
            color: #111111 !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
            position: static !important;
          }
          
          #lab-report-sheet * {
            color: #111111 !important;
            border-color: #cccccc !important;
            background: transparent !important;
          }
          
          #lab-report-sheet .text-[var(--ds-accent)],
          #lab-report-sheet .text-[#39ff14] {
            color: #047857 !important; /* Printable dark green */
            font-weight: bold !important;
          }
        }
      `}</style>
    </div>
  );
}
