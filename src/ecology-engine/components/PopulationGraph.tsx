"use client";

import React from "react";
import { Ecosystem } from "../types";
import { EcologyRegistry } from "../registry/EcologyRegistry";

interface PopulationGraphProps {
  ecosystem: Ecosystem;
  history: Array<{ generation: number; counts: Record<string, number> }>;
}

export const PopulationGraph: React.FC<PopulationGraphProps> = ({ ecosystem, history }) => {
  const registry = EcologyRegistry.getInstance();
  const activeSpeciesIds = Object.keys(ecosystem.populations);

  // SVG Chart Dimensions
  const svgWidth = 600;
  const svgHeight = 220;
  const padding = 35;

  const maxVal = Math.max(
    200,
    ...history.flatMap((h) => Object.values(h.counts))
  );

  return (
    <div className="population-graph-card flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <h3 className="text-sm font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-2">
          <span>📈 Real-time Population Dynamics & Carrying Capacity ($K$)</span>
        </h3>
        <span className="text-xs font-mono text-slate-400">
          Max K: <span className="text-white font-bold">{ecosystem.carryingCapacityMax}</span>
        </span>
      </div>

      {/* SVG Multi-Series Trajectory Plot */}
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto block">
          {/* Gridlines */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={svgHeight - padding}
            stroke="#334155"
            strokeWidth="1"
          />
          <line
            x1={padding}
            y1={svgHeight - padding}
            x2={svgWidth - padding}
            y2={svgHeight - padding}
            stroke="#334155"
            strokeWidth="1"
          />

          {/* Carrying Capacity Baseline K */}
          {(() => {
            const kY =
              svgHeight -
              padding -
              (ecosystem.carryingCapacityMax / maxVal) * (svgHeight - 2 * padding);
            return (
              <line
                x1={padding}
                y1={kY}
                x2={svgWidth - padding}
                y2={kY}
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
            );
          })()}

          {/* Render lines for each species */}
          {activeSpeciesIds.map((specId) => {
            const spec = registry.getSpecies(specId);
            if (!spec || history.length < 2) return null;

            const points = history
              .map((h, idx) => {
                const x =
                  padding + (idx / Math.max(1, history.length - 1)) * (svgWidth - 2 * padding);
                const count = h.counts[specId] || 0;
                const y = svgHeight - padding - (count / maxVal) * (svgHeight - 2 * padding);
                return `${x},${y}`;
              })
              .join(" ");

            return (
              <polyline
                key={specId}
                fill="none"
                stroke={spec.color}
                strokeWidth="2.5"
                points={points}
              />
            );
          })}
        </svg>
      </div>

      {/* Species Legend Bar */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800">
        {activeSpeciesIds.map((specId) => {
          const spec = registry.getSpecies(specId);
          const currentCount = ecosystem.populations[specId]?.count || 0;
          if (!spec) return null;

          return (
            <div key={specId} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-3 h-3 rounded-full inline-block shadow-sm"
                style={{ backgroundColor: spec.color }}
              />
              <span className="font-semibold text-slate-300">{spec.name}:</span>
              <span className="font-mono text-emerald-400 font-bold">{currentCount}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
