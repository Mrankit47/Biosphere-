// ═══════════════════════════════════════════════════════════════
// Biosphere — Knowledge Query Engine
//
// High-level query API on top of the graph indexer. Provides
// filtered search, category browsing, difficulty filtering,
// and recommendation algorithms.
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeObject, KnowledgeCategory } from "@/knowledge-types/object";
import type { KnowledgeGraphNode } from "@/knowledge-types/graph";
import type { Difficulty } from "@/data/learningEngine";
import { knowledgeGraph } from "./graphIndexer";

// ─── Filter Options ──────────────────────────────────────────

export interface KnowledgeFilter {
  query?: string;
  category?: KnowledgeCategory;
  difficulty?: Difficulty;
  status?: string;
  has3D?: boolean;
  hasQuiz?: boolean;
  hasSimulation?: boolean;
  limit?: number;
  offset?: number;
}

// ─── Query Results ───────────────────────────────────────────

export interface KnowledgeQueryResult {
  objects: KnowledgeObject[];
  total: number;
  hasMore: boolean;
}

// ─── Query Functions ─────────────────────────────────────────

/**
 * Search and filter knowledge objects.
 * Applies text search, category, difficulty, and feature filters.
 */
export function queryKnowledge(filter: KnowledgeFilter): KnowledgeQueryResult {
  let results = knowledgeGraph.getAllObjects();

  // Text search
  if (filter.query) {
    const q = filter.query.toLowerCase().trim();
    results = results.filter((obj) => {
      const haystack = [
        obj.name,
        obj.scientificName ?? "",
        obj.description,
        obj.subcategory,
        obj.category,
        ...obj.importantTerms.map((t) => `${t.term} ${t.definition}`),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  // Category filter
  if (filter.category) {
    results = results.filter((obj) => obj.category === filter.category);
  }

  // Difficulty filter
  if (filter.difficulty) {
    results = results.filter((obj) => obj.difficulty === filter.difficulty);
  }

  // Content status filter
  if (filter.status) {
    results = results.filter((obj) => obj.verification.status === filter.status);
  }

  // Feature flags
  if (filter.has3D) {
    results = results.filter((obj) => obj.model3D != null);
  }
  if (filter.hasQuiz) {
    results = results.filter((obj) => obj.quiz != null);
  }
  if (filter.hasSimulation) {
    results = results.filter((obj) => obj.simulationUrl != null);
  }

  // Pagination
  const total = results.length;
  const offset = filter.offset ?? 0;
  const limit = filter.limit ?? 50;
  const paged = results.slice(offset, offset + limit);

  return {
    objects: paged,
    total,
    hasMore: offset + limit < total,
  };
}

/**
 * Get all objects in a specific category, sorted by difficulty.
 */
export function getByCategory(category: KnowledgeCategory): KnowledgeObject[] {
  const difficultyOrder: Record<string, number> = {
    beginner: 0,
    intermediate: 1,
    advanced: 2,
  };

  return knowledgeGraph
    .getAllObjects()
    .filter((obj) => obj.category === category)
    .sort(
      (a, b) =>
        (difficultyOrder[a.difficulty] ?? 0) -
        (difficultyOrder[b.difficulty] ?? 0)
    );
}

/**
 * Get recommended next topics based on a completed topic.
 * Uses graph relationships (next, related, child) weighted by edge weight.
 */
export function getRecommendedNext(objectId: string): KnowledgeGraphNode[] {
  const node = knowledgeGraph.getNode(objectId);
  if (!node) return [];

  // Collect all outgoing edges that represent forward progression
  const candidates = node.edges
    .filter((e) => ["next", "child", "related"].includes(e.type))
    .sort((a, b) => b.weight - a.weight)
    .map((e) => knowledgeGraph.getNode(e.to))
    .filter(Boolean) as KnowledgeGraphNode[];

  // Deduplicate
  const seen = new Set<string>();
  return candidates.filter((n) => {
    if (seen.has(n.id)) return false;
    seen.add(n.id);
    return true;
  });
}

/**
 * Get the learning path (prerequisite chain) for a topic.
 * Returns ordered list from first prerequisite to the target.
 */
export function getLearningPath(objectId: string): KnowledgeGraphNode[] {
  const chain = knowledgeGraph.getPrerequisiteChain(objectId);
  // Reverse so it reads first-to-last
  return chain.reverse();
}

/**
 * Get all unique categories that have at least one published object.
 */
export function getAvailableCategories(): KnowledgeCategory[] {
  const cats = new Set<KnowledgeCategory>();
  for (const obj of knowledgeGraph.getAllObjects()) {
    if (obj.verification.status === "published") {
      cats.add(obj.category);
    }
  }
  return Array.from(cats);
}
