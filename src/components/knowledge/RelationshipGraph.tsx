"use client";

// ═══════════════════════════════════════════════════════════════
// Biosphere — Relationship Graph & Related Topic Cards
//
// Visual card grid and graph node connections showing parent,
// child, prerequisite, next, and related knowledge topics.
// ═══════════════════════════════════════════════════════════════

import React from "react";
import Link from "next/link";
import type { KnowledgeObject } from "@/knowledge-types/object";
import type { KnowledgeGraphNode } from "@/knowledge-types/graph";
import { BioIcon } from "@/components/ui/navigation/BioIcon";

interface RelatedTopicCardsProps {
  title: string;
  icon: string;
  objects: KnowledgeObject[];
  accentColor?: string;
}

export const RelatedTopicCards: React.FC<RelatedTopicCardsProps> = ({
  title,
  icon,
  objects,
  accentColor = "#2FFFB0",
}) => {
  if (objects.length === 0) return null;

  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ds-fg-muted)] mb-3 flex items-center gap-1.5">
        <BioIcon name={icon} size={14} style={{ color: accentColor }} />
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {objects.map((obj) => (
          <Link
            key={obj.id}
            href={`/knowledge/${obj.id}`}
            className="group flex items-center gap-3 rounded-xl p-3 border border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/15 transition-all no-underline"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
              style={{
                background: `${obj.accentColor}15`,
                border: `1px solid ${obj.accentColor}25`,
              }}
            >
              <BioIcon name={obj.icon} size={18} style={{ color: obj.accentColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white group-hover:text-white/90 truncate">
                {obj.name}
              </div>
              <div className="text-[0.68rem] text-[var(--ds-fg-muted)] truncate">
                {obj.subcategory} · ~{obj.estimatedMinutes}m
              </div>
            </div>
            <BioIcon
              name="chevron-right"
              size={14}
              className="text-[var(--ds-fg-muted)] group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

interface RelationshipGraphProps {
  neighbors: KnowledgeGraphNode[];
  accentColor: string;
}

export const RelationshipGraph: React.FC<RelationshipGraphProps> = ({
  neighbors,
  accentColor,
}) => {
  if (neighbors.length === 0) return null;

  return (
    <section className="mt-8">
      <h2
        className="text-lg font-bold tracking-tight text-white mb-4"
        style={{ textShadow: `0 0 20px ${accentColor}20` }}
      >
        Knowledge Graph Network
      </h2>

      <div className="rounded-2xl p-5 border border-white/8 bg-white/3">
        <p className="text-xs text-[var(--ds-fg-muted)] mb-4">
          Connected concept nodes in the Biosphere Knowledge Graph:
        </p>

        <div className="flex flex-wrap gap-2.5">
          {neighbors.map((node) => (
            <Link
              key={node.id}
              href={`/knowledge/${node.id}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-xs font-medium text-white no-underline hover:scale-105"
            >
              <BioIcon name={node.icon} size={14} style={{ color: node.accentColor }} />
              <span>{node.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
