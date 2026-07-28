"use client";

import React from "react";
import { Ecosystem, BiodiversityMetrics } from "../types";
import { EcologyAIMentor } from "../ai/ecologyAIMentor";

interface ObservationNotebookProps {
  ecosystem: Ecosystem;
  metrics: BiodiversityMetrics;
}

export const ObservationNotebook: React.FC<ObservationNotebookProps> = ({ ecosystem, metrics }) => {
  const aiInsights = EcologyAIMentor.generateScientificInsights(ecosystem, metrics);

  return (
    <div className="observation-notebook-card flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-2">
          <span>📓 Field Notebook & Biodiversity Metrics</span>
        </h3>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
          Stability Score: {metrics.communityStabilityScore}/100
        </span>
      </div>

      {/* Numerical Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Species Richness (S)
          </span>
          <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">
            {metrics.speciesRichness}
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Shannon Index (H')
          </span>
          <span className="text-xl font-bold text-sky-400 font-mono mt-1 block">
            {metrics.shannonIndex}
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Simpson Index (D)
          </span>
          <span className="text-xl font-bold text-amber-400 font-mono mt-1 block">
            {metrics.simpsonIndex}
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Evenness (E)
          </span>
          <span className="text-xl font-bold text-teal-400 font-mono mt-1 block">
            {metrics.evenness}
          </span>
        </div>
      </div>

      {/* AI Pedagogical Field Observations */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
          <span>🤖 AI Biology Mentor — Ecological Commentary</span>
        </h4>
        <div className="space-y-2">
          {aiInsights.map((insight, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-200 leading-relaxed shadow-sm"
              dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
