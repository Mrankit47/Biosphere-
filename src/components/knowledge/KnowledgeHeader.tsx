"use client";

// ═══════════════════════════════════════════════════════════════
// Biosphere — Knowledge Header Component
//
// Hero section for a knowledge object page: icon, name,
// scientific name, badges, and action buttons.
// ═══════════════════════════════════════════════════════════════

import React from "react";
import Link from "next/link";
import type { KnowledgeObject } from "@/knowledge-types/object";
import { BioIcon } from "@/components/ui/navigation/BioIcon";

interface KnowledgeHeaderProps {
  object: KnowledgeObject;
}

export const KnowledgeHeader: React.FC<KnowledgeHeaderProps> = ({ object }) => {
  return (
    <header className="relative mb-8">
      {/* Gradient accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        style={{
          background: `linear-gradient(90deg, ${object.accentColor}, ${object.accentColor}88, transparent)`,
        }}
      />

      {/* Back link */}
      {object.existingRoute && (
        <Link
          href={object.existingRoute}
          className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider uppercase text-[var(--ds-fg-muted)] hover:text-white transition-colors mb-4 mt-2"
        >
          <BioIcon name="chevron-left" size={14} />
          <span>View 3D Experience</span>
        </Link>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Icon glow orb */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: `${object.accentColor}18`,
            border: `1px solid ${object.accentColor}30`,
            boxShadow: `0 0 30px ${object.accentColor}15`,
          }}
        >
          <BioIcon name={object.icon} size={28} style={{ color: object.accentColor }} />
        </div>

        <div className="flex-1 min-w-0">
          <h1
            className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1"
            style={{ textShadow: `0 0 30px ${object.accentColor}30` }}
          >
            {object.name}
          </h1>
          {object.scientificName && (
            <p className="text-sm italic text-[var(--ds-fg-muted)] mb-2">{object.scientificName}</p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category pill */}
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.68rem] font-semibold uppercase tracking-wider"
              style={{
                background: `${object.accentColor}15`,
                color: object.accentColor,
                border: `1px solid ${object.accentColor}25`,
              }}
            >
              {object.category.replace("-", " ")}
            </span>
            {/* Difficulty pill */}
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.68rem] font-semibold uppercase tracking-wider"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "var(--ds-fg-muted)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {object.difficulty}
            </span>
            {/* Time estimate */}
            <span className="text-xs text-[var(--ds-fg-muted)]">
              ~{object.estimatedMinutes} min read
            </span>
            {/* XP */}
            <span
              className="inline-flex items-center gap-1 text-xs font-bold"
              style={{ color: "#FFD93D" }}
            >
              <BioIcon name="star" size={12} /> {object.xpPoints} XP
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 shrink-0">
          {object.existingRoute && (
            <Link
              href={object.existingRoute}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{
                background: `${object.accentColor}20`,
                color: object.accentColor,
                border: `1px solid ${object.accentColor}30`,
              }}
            >
              <BioIcon name="explore" size={14} />
              <span>Explore 3D</span>
            </Link>
          )}
          {object.simulationUrl && (
            <Link
              href={object.simulationUrl}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 text-[var(--ds-fg-muted)] border border-white/10 transition-all hover:bg-white/10 hover:scale-105"
            >
              <BioIcon name="simulation" size={14} />
              <span>Simulate</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
