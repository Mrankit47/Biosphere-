"use client";

import React from "react";

interface NotebookProps {
  notes: string;
  onChangeNotes: (text: string) => void;
}

export default function Notebook({ notes, onChangeNotes }: NotebookProps) {
  return (
    <div className="panel-card glassmorphic flex flex-col h-full min-h-[220px]">
      <h3 className="panel-section-title">📓 LAB NOTEBOOK JOURNAL</h3>
      <p className="text-[10px] text-[var(--ds-fg-muted)] mb-3">
        Log your experimental hypothesis, record critical observations, and draft your scientific conclusions below.
      </p>

      {/* Editor block resembling a paper sheet */}
      <div className="flex-1 relative border border-[var(--ds-border-muted)] rounded overflow-hidden bg-black/40">
        {/* Notebook grid line effect */}
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(57,255,20,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.3)_1px,transparent_1px)] bg-[size:16px_16px]" />

        <textarea
          value={notes}
          onChange={(e) => onChangeNotes(e.target.value)}
          placeholder={`RESEARCH PROTOCOL:
- HYPOTHESIS:

- RAW DATA RECORDINGS:

- CRITICAL DEDUCTIONS:`}
          className="w-full h-full min-h-[160px] p-3 text-[11px] font-mono text-[var(--ds-fg)] placeholder-[var(--ds-fg-subtle)] bg-transparent outline-none border-none resize-none z-10 relative leading-relaxed"
        />
      </div>
    </div>
  );
}
