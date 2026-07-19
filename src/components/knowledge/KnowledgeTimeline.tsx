"use client";

// ═══════════════════════════════════════════════════════════════
// Biosphere — Knowledge Timeline Component
//
// Vertical timeline showing discovery history and milestones.
// ═══════════════════════════════════════════════════════════════

import React from "react";
import type { TimelineEvent, ScientistEntry } from "@/knowledge-types/object";

interface KnowledgeTimelineProps {
  events: TimelineEvent[];
  scientists: ScientistEntry[];
  accentColor: string;
}

export const KnowledgeTimeline: React.FC<KnowledgeTimelineProps> = ({
  events,
  scientists,
  accentColor,
}) => {
  if (events.length === 0 && scientists.length === 0) return null;

  return (
    <section className="mt-8">
      <h2
        className="text-lg font-bold tracking-tight text-white mb-5"
        style={{ textShadow: `0 0 20px ${accentColor}20` }}
      >
        Discovery Timeline
      </h2>

      <div className="relative pl-6 border-l-2" style={{ borderColor: `${accentColor}30` }}>
        {events.map((event, i) => (
          <div key={i} className="relative mb-6 last:mb-0">
            {/* Dot */}
            <div
              className="absolute -left-[calc(0.75rem+1.5px)] top-1 w-3 h-3 rounded-full"
              style={{
                background: accentColor,
                boxShadow: `0 0 10px ${accentColor}50`,
              }}
            />
            <div
              className="text-[0.7rem] font-mono font-bold uppercase tracking-wider mb-1"
              style={{ color: accentColor }}
            >
              {event.year}
            </div>
            <div className="text-sm font-semibold text-white mb-0.5">{event.title}</div>
            <p className="text-[0.78rem] text-[var(--ds-fg-muted)] leading-relaxed">
              {event.description}
            </p>
          </div>
        ))}
      </div>

      {/* Scientists */}
      {scientists.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--ds-fg-muted)] mb-3">
            Key Scientists
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scientists.map((s, i) => (
              <div
                key={i}
                className="rounded-xl p-3 border border-white/8 bg-white/3 transition-all hover:bg-white/5"
              >
                <div className="text-sm font-semibold text-white">{s.name}</div>
                {s.year && (
                  <div
                    className="text-[0.65rem] font-mono tracking-wider mb-1"
                    style={{ color: accentColor }}
                  >
                    {s.year}
                  </div>
                )}
                <p className="text-[0.72rem] text-[var(--ds-fg-muted)] leading-relaxed">
                  {s.contribution}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
