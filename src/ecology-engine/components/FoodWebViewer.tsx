"use client";

import React, { useMemo } from "react";
import { Ecosystem } from "../types";
import { FoodWebEngine } from "../simulation/foodWebEngine";

interface FoodWebViewerProps {
  ecosystem: Ecosystem;
}

export const FoodWebViewer: React.FC<FoodWebViewerProps> = ({ ecosystem }) => {
  const foodWeb = useMemo(() => FoodWebEngine.buildFoodWeb(ecosystem), [ecosystem]);

  return (
    <div className="food-web-viewer flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-2">
          <span>🕸️ Interactive Food Web & Energy Flow</span>
        </h3>
        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
          Lindeman 10% Energy Rule
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Trophic Biomass Energy Pyramid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
            Trophic Level Biomass Pyramid (kcal)
          </h4>

          <div className="space-y-2">
            {foodWeb.trophicPyramid.map((tier) => {
              const maxBiomass = Math.max(1, foodWeb.trophicPyramid[0].biomassKcal);
              const fillPercent = Math.min(100, Math.max(8, (tier.biomassKcal / maxBiomass) * 100));

              return (
                <div key={tier.level} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">{tier.label}</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {tier.biomassKcal.toLocaleString()} kcal
                    </span>
                  </div>
                  <div className="h-4 w-full rounded-lg bg-slate-950 p-0.5 border border-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-md bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 shadow-sm"
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Species Node Network List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
            Trophic Interaction Linkages
          </h4>

          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {foodWeb.edges.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4 text-center">
                No active trophic linkages in current ecosystem.
              </p>
            ) : (
              foodWeb.edges.map((edge, idx) => {
                const sourceNode = foodWeb.nodes.find((n) => n.speciesId === edge.sourceId);
                const targetNode = foodWeb.nodes.find((n) => n.speciesId === edge.targetId);

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-xs"
                  >
                    <span className="font-semibold text-slate-300">
                      {sourceNode?.speciesName || edge.sourceId}
                    </span>
                    <span className="text-emerald-400 font-bold px-2">
                      ➔ {edge.type === "herbivory" ? "herbivory" : "predation"} ➔
                    </span>
                    <span className="font-semibold text-emerald-400">
                      {targetNode?.speciesName || edge.targetId}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
