"use client";

// ═══════════════════════════════════════════════════════════════
// Biosphere — Knowledge Platform Directory & Search Page
//
// Browse concepts by category or search across all knowledge objects.
// ═══════════════════════════════════════════════════════════════

import React, { useState } from "react";
import Link from "next/link";
import { useKnowledgeSearch } from "@/knowledge-hooks/useKnowledgeSearch";
import { getAvailableCategories } from "@/knowledge-engine/queryEngine";
import type { KnowledgeCategory } from "@/knowledge-types/object";
import { BioIcon } from "@/components/ui/navigation/BioIcon";
import { GlassInput } from "@/components/ds";

export default function KnowledgeDirectoryPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | undefined>(undefined);

  const { results, total, loading } = useKnowledgeSearch(query, {
    category: selectedCategory,
    limit: 50,
  });

  const categories = getAvailableCategories();

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8 text-white font-sans">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
          Biology Knowledge Graph
        </h1>
        <p className="text-sm text-[var(--ds-fg-muted)] max-w-xl mx-auto">
          Explore interconnected biological concepts, 3D interactive exhibits, clinical notes, and assessment modules.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="max-w-2xl mx-auto mb-8 space-y-4">
        <GlassInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search organelles, organs, processes, pathogens..."
        />

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
              selectedCategory === undefined
                ? "bg-[#2FFFB0] text-black border-[#2FFFB0]"
                : "bg-white/5 text-[var(--ds-fg-muted)] border-white/10 hover:bg-white/10"
            }`}
          >
            All ({total})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                selectedCategory === cat
                  ? "bg-[#2FFFB0] text-black border-[#2FFFB0]"
                  : "bg-white/5 text-[var(--ds-fg-muted)] border-white/10 hover:bg-white/10"
              }`}
            >
              {cat.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="text-center py-12 text-sm text-[var(--ds-fg-muted)] animate-pulse">
          Searching Knowledge Base...
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12 text-sm text-[var(--ds-fg-muted)]">
          No biology concepts found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((obj) => (
            <Link
              key={obj.id}
              href={`/knowledge/${obj.id}`}
              className="group flex flex-col justify-between rounded-2xl p-5 border border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/15 transition-all no-underline hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: `${obj.accentColor}18`,
                      border: `1px solid ${obj.accentColor}30`,
                    }}
                  >
                    <BioIcon name={obj.icon} size={20} style={{ color: obj.accentColor }} />
                  </div>
                  <span
                    className="text-[0.65rem] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border"
                    style={{
                      borderColor: `${obj.accentColor}30`,
                      color: obj.accentColor,
                    }}
                  >
                    {obj.difficulty}
                  </span>
                </div>

                <h2 className="text-base font-bold text-white group-hover:text-white/90 mb-1">
                  {obj.name}
                </h2>
                {obj.scientificName && (
                  <p className="text-xs italic text-[var(--ds-fg-muted)] mb-2">
                    {obj.scientificName}
                  </p>
                )}
                <p className="text-xs text-[var(--ds-fg-muted)] line-clamp-2 leading-relaxed mb-4">
                  {obj.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[0.7rem] text-[var(--ds-fg-muted)]">
                <span>{obj.subcategory}</span>
                <span className="group-hover:translate-x-1 transition-transform text-white font-medium flex items-center gap-1">
                  Explore <BioIcon name="chevron-right" size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
