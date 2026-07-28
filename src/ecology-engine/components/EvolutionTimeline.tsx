"use client";

import React from "react";
import { EvolutionTimeline } from "../types";

interface EvolutionTimelineProps {
  timeline: EvolutionTimeline;
}

export const EvolutionTimelineViewer: React.FC<EvolutionTimelineProps> = ({ timeline }) => {
  return (
    <div className="evolution-timeline-card flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-2">
          <span>🧬 Evolutionary Cladogram & Phylogenetic Trees</span>
        </h3>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
          Macroevolution Dynamics
        </span>
      </div>

      {/* Cladogram Branch List */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {timeline.nodes.map((node) => {
          return (
            <div
              key={node.id}
              className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition-all ${
                node.extinct
                  ? "border-red-950/60 bg-red-950/20 opacity-70"
                  : "border-slate-800 bg-slate-950/60 hover:border-emerald-500/40"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl">{node.extinct ? "💀" : "🌿"}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-200 truncate">{node.name}</h4>
                    {node.extinct && (
                      <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[9px] font-bold text-red-400 border border-red-500/30">
                        EXTINCT (Gen {node.extinctionGeneration})
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 italic truncate">{node.scientificName}</p>
                  {node.keyAdaptation && (
                    <p className="text-[10px] text-emerald-400 mt-0.5">
                      Adaptation: <span className="text-slate-300">{node.keyAdaptation}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="rounded-lg bg-slate-800 px-2 py-1 text-[10px] font-semibold text-slate-300 font-mono">
                  Divergence: Gen {node.divergenceGeneration}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Speciation Event Log */}
      {timeline.speciationEvents.length > 0 && (
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
            Recorded Speciation Events ({timeline.speciationEvents.length})
          </h4>
          <div className="space-y-1.5">
            {timeline.speciationEvents.map((event, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2 text-xs text-slate-300"
              >
                <span>
                  Gen {event.generation}: <strong className="text-emerald-400">{event.newSpeciesName}</strong>
                </span>
                <span className="text-[10px] text-slate-400 italic">{event.driver}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
