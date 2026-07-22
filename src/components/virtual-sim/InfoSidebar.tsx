"use client";

import React, { useState } from "react";
import { SimMilestone } from "@/data/simulations";
import { motion, AnimatePresence } from "framer-motion";

interface InfoSidebarProps {
  objectives: string[];
  outcomes: string[];
  steps: SimMilestone[];
  activeStepIdx: number;
  onJumpToStep: (idx: number) => void;
  timeline: number;
}

export default function InfoSidebar({
  objectives,
  outcomes,
  steps,
  activeStepIdx,
  onJumpToStep,
  timeline
}: InfoSidebarProps) {
  const [activeTab, setActiveTab] = useState<"milestones" | "objectives">("milestones");
  const activeStep = steps[activeStepIdx] || null;

  return (
    <div className="panel-card glassmorphic flex flex-col h-full min-h-[380px] bg-black/35 border-[var(--ds-border-muted)]">
      {/* Tabs */}
      <div className="flex border-b border-[var(--ds-border-muted)] pb-2 mb-3 text-[10px]">
        <button
          onClick={() => setActiveTab("milestones")}
          className={`flex-1 text-center font-bold uppercase pb-1 border-b-2 transition-all ${
            activeTab === "milestones"
              ? "text-[var(--ds-accent)] border-[var(--ds-accent)]"
              : "text-[var(--ds-fg-subtle)] border-transparent hover:text-white"
          }`}
        >
          Milestones
        </button>
        <button
          onClick={() => setActiveTab("objectives")}
          className={`flex-1 text-center font-bold uppercase pb-1 border-b-2 transition-all ${
            activeTab === "objectives"
              ? "text-[var(--ds-accent)] border-[var(--ds-accent)]"
              : "text-[var(--ds-fg-subtle)] border-transparent hover:text-white"
          }`}
        >
          Objectives
        </button>
      </div>

      {activeTab === "milestones" ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Milestone checklist buttons */}
          <div className="space-y-1.5 mb-4 shrink-0">
            <h4 className="text-[9px] font-bold text-[var(--ds-accent)] uppercase mb-2">
              Timeline Milestones
            </h4>
            <div className="flex flex-col gap-1">
              {steps.map((step, idx) => {
                const isActive = idx === activeStepIdx;
                const isCompleted = timeline > step.range[1];
                return (
                  <button
                    key={idx}
                    onClick={() => onJumpToStep(idx)}
                    className={`flex items-center gap-3 text-left w-full px-2.5 py-1.5 rounded transition-all text-[11px] ${
                      isActive
                        ? "bg-[var(--ds-accent-faint)] border border-[var(--ds-accent-muted)] text-[var(--ds-fg-bright)]"
                        : "bg-white/2 border border-transparent text-[var(--ds-fg-subtle)] hover:text-white"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] font-bold ${
                        isActive
                          ? "border-[var(--ds-accent)] text-[var(--ds-accent)]"
                          : isCompleted
                          ? "border-[var(--ds-accent-muted)] text-[var(--ds-accent-muted)]"
                          : "border-[var(--ds-border-muted)]"
                      }`}
                    >
                      {isCompleted ? "✓" : idx + 1}
                    </div>
                    <span className="truncate">{step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed summary of the active step */}
          <div className="flex-1 border-t border-[var(--ds-border-muted)] pt-3 overflow-y-auto pr-1">
            <AnimatePresence mode="wait">
              {activeStep && (
                <motion.div
                  key={activeStepIdx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col text-[11px] leading-relaxed"
                >
                  <span className="text-[8px] uppercase border border-[var(--ds-border-accent)] bg-[var(--ds-accent-faint)] text-[var(--ds-accent)] px-2 py-0.5 rounded self-start mb-2 tracking-wider font-bold">
                    {activeStep.enzymeFocus}
                  </span>
                  <h3 className="text-xs font-black text-white uppercase mb-1">
                    {activeStep.title}
                  </h3>
                  <p className="text-[var(--ds-fg-muted)] mb-2 font-medium">
                    {activeStep.summary}
                  </p>
                  <div className="h-[1px] bg-[var(--ds-border-muted)] my-2" />
                  <p className="text-[var(--ds-fg-subtle)]">{activeStep.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-1 text-[11px] space-y-4">
          <div>
            <h4 className="font-bold text-[var(--ds-accent)] uppercase mb-2">
              Objectives
            </h4>
            <ul className="list-decimal pl-4 space-y-1 text-[var(--ds-fg-muted)]">
              {objectives.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </div>
          <div className="border-t border-[var(--ds-border-muted)] pt-3">
            <h4 className="font-bold text-[var(--ds-accent)] uppercase mb-2">
              Expected Learning Outcomes
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-[var(--ds-fg-muted)]">
              {outcomes.map((out, idx) => (
                <li key={idx}>{out}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
