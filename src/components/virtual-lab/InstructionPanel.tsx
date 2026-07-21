"use client";

import React, { useState } from "react";

interface InstructionPanelProps {
  objectives: string[];
  outcomes: string[];
  theory: string;
  background: string;
  safety: string[];
  cleanup: string[];
  references: string[];
}

type TabId = "goals" | "theory" | "safety" | "cleanup";

export default function InstructionPanel({
  objectives,
  outcomes,
  theory,
  background,
  safety,
  cleanup,
  references
}: InstructionPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("goals");

  const renderTabContent = () => {
    switch (activeTab) {
      case "theory":
        return (
          <div className="flex-1 overflow-y-auto pr-1 text-[11px] leading-relaxed space-y-3">
            <div>
              <h4 className="text-[11px] font-bold text-[var(--ds-accent)] uppercase mb-1">
                Background Context
              </h4>
              <p className="text-[var(--ds-fg-muted)]">{background}</p>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-[var(--ds-accent)] uppercase mb-1">
                Scientific Theory
              </h4>
              <p className="text-[var(--ds-fg-muted)] whitespace-pre-line">{theory}</p>
            </div>
          </div>
        );

      case "safety":
        return (
          <div className="flex-1 overflow-y-auto pr-1 text-[11px] space-y-3">
            <div>
              <h4 className="text-[11px] font-bold text-[var(--ds-danger)] uppercase mb-2">
                ⚠️ Critical Safety Instructions
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-[var(--ds-fg-muted)]">
                {safety.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "cleanup":
        return (
          <div className="flex-1 overflow-y-auto pr-1 text-[11px] space-y-3">
            <div>
              <h4 className="text-[11px] font-bold text-[var(--ds-accent)] uppercase mb-2">
                Workstation Cleanup
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-[var(--ds-fg-muted)]">
                {cleanup.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-[var(--ds-accent)] uppercase mb-2">
                References & Citations
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-[var(--ds-fg-subtle)]">
                {references.map((ref, idx) => (
                  <li key={idx}>{ref}</li>
                ))}
              </ul>
            </div>
          </div>
        );

      case "goals":
      default:
        return (
          <div className="flex-1 overflow-y-auto pr-1 text-[11px] space-y-3">
            <div>
              <h4 className="text-[11px] font-bold text-[var(--ds-accent)] uppercase mb-2">
                Experiment Objectives
              </h4>
              <ul className="list-decimal pl-4 space-y-1 text-[var(--ds-fg-muted)]">
                {objectives.map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-[var(--ds-accent)] uppercase mb-2">
                Learning Outcomes
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-[var(--ds-fg-muted)]">
                {outcomes.map((out, idx) => (
                  <li key={idx}>{out}</li>
                ))}
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="panel-card glassmorphic flex flex-col h-full min-h-[220px]">
      {/* Tab Navigation header */}
      <div className="flex border-b border-[var(--ds-border-muted)] mb-3 text-[10px]">
        <button
          onClick={() => setActiveTab("goals")}
          className={`flex-1 pb-2 font-bold uppercase text-center border-b-2 transition-all ${
            activeTab === "goals"
              ? "text-[var(--ds-accent)] border-[var(--ds-accent)]"
              : "text-[var(--ds-fg-muted)] border-transparent hover:text-[var(--ds-fg-bright)]"
          }`}
        >
          Goals
        </button>
        <button
          onClick={() => setActiveTab("theory")}
          className={`flex-1 pb-2 font-bold uppercase text-center border-b-2 transition-all ${
            activeTab === "theory"
              ? "text-[var(--ds-accent)] border-[var(--ds-accent)]"
              : "text-[var(--ds-fg-muted)] border-transparent hover:text-[var(--ds-fg-bright)]"
          }`}
        >
          Theory
        </button>
        <button
          onClick={() => setActiveTab("safety")}
          className={`flex-1 pb-2 font-bold uppercase text-center border-b-2 transition-all ${
            activeTab === "safety"
              ? "text-[var(--ds-accent)] border-[var(--ds-accent)]"
              : "text-[var(--ds-fg-muted)] border-transparent hover:text-[var(--ds-fg-bright)]"
          }`}
        >
          Safety
        </button>
        <button
          onClick={() => setActiveTab("cleanup")}
          className={`flex-1 pb-2 font-bold uppercase text-center border-b-2 transition-all ${
            activeTab === "cleanup"
              ? "text-[var(--ds-accent)] border-[var(--ds-accent)]"
              : "text-[var(--ds-fg-muted)] border-transparent hover:text-[var(--ds-fg-bright)]"
          }`}
        >
          Cleanup
        </button>
      </div>

      {/* Dynamic Tab Body */}
      {renderTabContent()}
    </div>
  );
}
