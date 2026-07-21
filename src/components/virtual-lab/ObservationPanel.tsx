"use client";

import React from "react";

interface ObservationQuestion {
  id: string;
  question: string;
  placeholder: string;
  sampleAnswer: string;
}

interface RunLog {
  timestamp: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
}

interface ObservationPanelProps {
  questions: ObservationQuestion[];
  userObservations: Record<string, string>;
  onChangeObservation: (questionId: string, answer: string) => void;
  runHistory: RunLog[];
  currentOutputs: Record<string, any>;
  controlsConfig: any[];
}

export default function ObservationPanel({
  questions,
  userObservations,
  onChangeObservation,
  runHistory,
  currentOutputs,
  controlsConfig
}: ObservationPanelProps) {
  // Utility to format control values nicely (e.g. "pH 7" or "35 cm")
  const formatInputVal = (key: string, val: any) => {
    const config = controlsConfig.find((c) => c.id === key);
    if (config) {
      if (config.type === "select") {
        return config.options?.find((o: any) => o.value === val)?.label || val;
      }
      return `${val} ${config.unit || ""}`;
    }
    return String(val);
  };

  return (
    <div className="panel-card glassmorphic flex flex-col h-full min-h-[300px]">
      <h3 className="panel-section-title">📊 OBSERVATIONS & DATA LOG</h3>

      {/* Section 1: Live Diagnostic Metrics readout */}
      <div className="mb-4 bg-black/40 border border-[var(--ds-border-muted)] rounded p-2 text-[10px]">
        <h4 className="font-bold text-[var(--ds-accent)] mb-1 uppercase tracking-wider">
          Live Sensor Readouts
        </h4>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {Object.entries(currentOutputs).map(([key, val]) => {
            if (key === "bubbleSpeed" || key === "frothHeight" || key === "blur" || key === "focusScore") return null;
            return (
              <div key={key} className="flex flex-col">
                <span className="text-[var(--ds-fg-subtle)] text-[8px] uppercase">
                  {key === "rate" ? "Reaction Speed / Rate" : key}
                </span>
                <span className="font-bold text-[var(--ds-fg-bright)] truncate">
                  {key === "rate" ? `${val}%` : String(val)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Trial Log Table */}
      <div className="flex-1 mb-4 flex flex-col min-h-[120px]">
        <h4 className="text-[11px] font-bold text-[var(--ds-accent)] uppercase mb-2 tracking-wider">
          Trial Logs History
        </h4>
        {runHistory.length === 0 ? (
          <div className="flex-1 border border-dashed border-[var(--ds-border-muted)] rounded flex items-center justify-center text-[10px] text-[var(--ds-fg-subtle)]">
            No active trials logged yet. Click simulation action keys.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto max-h-[140px] border border-[var(--ds-border-muted)] rounded">
            <table className="w-full text-left text-[9px] border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-[var(--ds-border-muted)] text-[var(--ds-fg-muted)]">
                  <th className="p-1.5 font-bold">Time</th>
                  <th className="p-1.5 font-bold">Adjustments</th>
                  <th className="p-1.5 font-bold text-right">Result</th>
                </tr>
              </thead>
              <tbody>
                {runHistory.map((log, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[var(--ds-border-muted)]/40 text-[var(--ds-fg-muted)] hover:bg-white/2"
                  >
                    <td className="p-1.5 text-[var(--ds-fg-subtle)]">{log.timestamp}</td>
                    <td className="p-1.5">
                      <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                        {Object.entries(log.inputs).map(([key, val]) => {
                          if (key === "reactionRun") return null;
                          return (
                            <span key={key} className="bg-white/5 px-1 rounded text-[8px]">
                              {key}: {formatInputVal(key, val)}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-1.5 text-right font-bold text-[var(--ds-accent)]">
                      {log.outputs.rate !== undefined ? `${log.outputs.rate}%` : "Success"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 3: Observation Questions */}
      <div className="space-y-3 border-t border-[var(--ds-border-muted)] pt-3">
        <h4 className="text-[11px] font-bold text-[var(--ds-accent)] uppercase tracking-wider">
          Student Observation Analysis
        </h4>
        {questions.map((q) => (
          <div key={q.id} className="flex flex-col gap-1.5">
            <label className="text-[10px] text-[var(--ds-fg-muted)] leading-relaxed">
              {q.question}
            </label>
            <textarea
              value={userObservations[q.id] || ""}
              onChange={(e) => onChangeObservation(q.id, e.target.value)}
              placeholder={q.placeholder}
              rows={2}
              className="w-full bg-black/40 border border-[var(--ds-border-muted)] rounded p-2 text-[10px] text-[var(--ds-fg)] placeholder-[var(--ds-fg-subtle)] outline-none focus:border-[var(--ds-accent-muted)] transition-all resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
