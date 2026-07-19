"use client";

// ═══════════════════════════════════════════════════════════════
// Biosphere — Knowledge Sidebar Component
//
// Quick reference sidebar showing key terms, revision points,
// and navigation for the knowledge page.
// ═══════════════════════════════════════════════════════════════

import React, { useState } from "react";
import type { KnowledgeObject } from "@/knowledge-types/object";
import { BioIcon } from "@/components/ui/navigation/BioIcon";

interface KnowledgeSidebarProps {
  object: KnowledgeObject;
}

export const KnowledgeSidebar: React.FC<KnowledgeSidebarProps> = ({ object }) => {
  const [showAllTerms, setShowAllTerms] = useState(false);
  const displayTerms = showAllTerms
    ? object.importantTerms
    : object.importantTerms.slice(0, 4);

  return (
    <aside className="space-y-5">
      {/* Quick Revision Box */}
      <div
        className="rounded-2xl p-4 border"
        style={{
          background: `${object.accentColor}08`,
          borderColor: `${object.accentColor}20`,
        }}
      >
        <h3
          className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5"
          style={{ color: object.accentColor }}
        >
          <BioIcon name="sparkles" size={14} />
          Quick Revision
        </h3>
        <ul className="space-y-2">
          {object.quickRevision.map((point, i) => (
            <li
              key={i}
              className="flex gap-2 text-[0.78rem] text-[var(--ds-fg-muted)] leading-relaxed"
            >
              <span
                className="w-1 h-1 rounded-full mt-2 shrink-0"
                style={{ background: object.accentColor }}
              />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Key Terms */}
      <div className="rounded-2xl p-4 border border-white/8 bg-white/3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
          <BioIcon name="dictionary" size={14} />
          Key Terms
        </h3>
        <div className="space-y-3">
          {displayTerms.map((t, i) => (
            <div key={i}>
              <span
                className="text-xs font-bold tracking-wide"
                style={{ color: object.accentColor }}
              >
                {t.term}
              </span>
              <p className="text-[0.72rem] text-[var(--ds-fg-muted)] leading-relaxed mt-0.5">
                {t.definition}
              </p>
            </div>
          ))}
        </div>
        {object.importantTerms.length > 4 && (
          <button
            onClick={() => setShowAllTerms(!showAllTerms)}
            className="mt-3 text-xs font-medium uppercase tracking-wider transition-colors"
            style={{ color: object.accentColor }}
          >
            {showAllTerms
              ? "Show less"
              : `+${object.importantTerms.length - 4} more terms`}
          </button>
        )}
      </div>

      {/* Fun Facts */}
      {object.interestingFacts.length > 0 && (
        <div
          className="rounded-2xl p-4 border"
          style={{
            background: "rgba(255,217,61,0.05)",
            borderColor: "rgba(255,217,61,0.15)",
          }}
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#FFD93D] mb-3 flex items-center gap-1.5">
            <BioIcon name="star" size={14} />
            Did You Know?
          </h3>
          <ul className="space-y-2">
            {object.interestingFacts.map((fact, i) => (
              <li
                key={i}
                className="text-[0.78rem] text-[var(--ds-fg-muted)] leading-relaxed pl-4 relative"
              >
                <span className="absolute left-0 top-0 text-[#FFD93D]">★</span>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Clinical Importance */}
      {object.clinicalImportance && (
        <div className="rounded-2xl p-4 border border-[rgba(255,75,75,0.15)] bg-[rgba(255,75,75,0.05)]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#FF4B4B] mb-2 flex items-center gap-1.5">
            <BioIcon name="disease-explorer" size={14} />
            Clinical Importance
          </h3>
          <p className="text-[0.78rem] text-[var(--ds-fg-muted)] leading-relaxed">
            {object.clinicalImportance}
          </p>
        </div>
      )}
    </aside>
  );
};
