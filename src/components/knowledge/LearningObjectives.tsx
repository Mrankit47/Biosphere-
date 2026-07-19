"use client";

// ═══════════════════════════════════════════════════════════════
// Biosphere — Learning Objectives Component
// ═══════════════════════════════════════════════════════════════

import React from "react";
import type { LearningObjective } from "@/knowledge-types/object";
import { BioIcon } from "@/components/ui/navigation/BioIcon";

interface LearningObjectivesProps {
  objectives: LearningObjective[];
  accentColor: string;
}

export const LearningObjectives: React.FC<LearningObjectivesProps> = ({
  objectives,
  accentColor,
}) => {
  if (objectives.length === 0) return null;

  return (
    <section className="mb-6">
      <h2
        className="text-base font-bold uppercase tracking-wider mb-3"
        style={{ color: accentColor }}
      >
        Learning Objectives
      </h2>
      <div className="space-y-2">
        {objectives.map((obj, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl p-3 border transition-all hover:bg-white/3"
            style={{
              background: `${accentColor}05`,
              borderColor: `${accentColor}12`,
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${accentColor}15` }}
            >
              <BioIcon name={obj.icon} size={16} style={{ color: accentColor }} />
            </div>
            <span className="text-sm text-[var(--ds-fg-muted)] leading-relaxed pt-1">
              {obj.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
