"use client";

// ═══════════════════════════════════════════════════════════════
// Biosphere — useKnowledgeSearch Hook
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from "react";
import type { KnowledgeObject, KnowledgeCategory } from "@/knowledge-types/object";
import type { Difficulty } from "@/data/learningEngine";
import { queryKnowledge } from "@/knowledge-engine/queryEngine";
import { initKnowledge } from "@/knowledge-services/knowledgeService";

export interface UseKnowledgeSearchOptions {
  category?: KnowledgeCategory;
  difficulty?: Difficulty;
  has3D?: boolean;
  hasQuiz?: boolean;
  limit?: number;
  /** Debounce delay in ms for text search (default: 200) */
  debounceMs?: number;
}

export interface UseKnowledgeSearchResult {
  results: KnowledgeObject[];
  total: number;
  hasMore: boolean;
  loading: boolean;
}

/**
 * React hook for searching and filtering knowledge objects.
 * Supports text search with debouncing and category/difficulty filters.
 */
export function useKnowledgeSearch(
  query: string,
  options: UseKnowledgeSearchOptions = {}
): UseKnowledgeSearchResult {
  const [results, setResults] = useState<KnowledgeObject[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const debounceMs = options.debounceMs ?? 200;

  // Stable serialized options for effect dependency
  const optionsKey = useMemo(
    () =>
      JSON.stringify({
        category: options.category,
        difficulty: options.difficulty,
        has3D: options.has3D,
        hasQuiz: options.hasQuiz,
        limit: options.limit,
      }),
    [options.category, options.difficulty, options.has3D, options.hasQuiz, options.limit]
  );

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      try {
        initKnowledge();
        const result = queryKnowledge({
          query: query || undefined,
          category: options.category,
          difficulty: options.difficulty,
          has3D: options.has3D,
          hasQuiz: options.hasQuiz,
          limit: options.limit,
        });

        setResults(result.objects);
        setTotal(result.total);
        setHasMore(result.hasMore);
      } catch {
        setResults([]);
        setTotal(0);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, optionsKey, debounceMs]);

  return { results, total, hasMore, loading };
}
