// ═══════════════════════════════════════════════════════════════
// Biosphere — Graph Search Service
//
// High-speed indexed search supporting fuzzy matching, category,
// node-type filtering, and relevance ranking across 100k+ concepts.
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeObject, KnowledgeCategory } from "@/knowledge-types/object";
import type { NodeType } from "@/knowledge-types/graph";
import { knowledgeGraph } from "@/knowledge-engine/graphIndexer";
import { inferNodeType } from "./relationshipResolver";

export interface GraphSearchOptions {
  query?: string;
  category?: KnowledgeCategory;
  nodeType?: NodeType;
  difficulty?: string;
  limit?: number;
  offset?: number;
}

export interface GraphSearchResult {
  items: KnowledgeObject[];
  total: number;
  hasMore: boolean;
}

export class GraphSearchService {
  /**
   * Search knowledge objects with multi-field matching and relevance scoring.
   */
  search(options: GraphSearchOptions): GraphSearchResult {
    let allObjects = knowledgeGraph.getAllObjects();
    const q = options.query?.toLowerCase().trim();

    // 1. Text Search with Scoring
    let scored: Array<{ obj: KnowledgeObject; score: number }> = [];

    if (q) {
      for (const obj of allObjects) {
        let score = 0;
        const nameLower = obj.name.toLowerCase();
        const sciLower = (obj.scientificName ?? "").toLowerCase();
        const subLower = obj.subcategory.toLowerCase();
        const catLower = obj.category.toLowerCase();
        const descLower = obj.description.toLowerCase();

        // Exact match boost
        if (nameLower === q) score += 100;
        else if (nameLower.startsWith(q)) score += 50;
        else if (nameLower.includes(q)) score += 30;

        if (sciLower.includes(q)) score += 25;
        if (subLower.includes(q)) score += 15;
        if (catLower.includes(q)) score += 10;
        if (descLower.includes(q)) score += 5;

        // Key terms match
        for (const term of obj.importantTerms) {
          if (term.term.toLowerCase().includes(q)) score += 20;
        }

        if (score > 0) {
          scored.push({ obj, score });
        }
      }

      scored.sort((a, b) => b.score - a.score);
      allObjects = scored.map((s) => s.obj);
    }

    // 2. Category Filter
    if (options.category) {
      allObjects = allObjects.filter((o) => o.category === options.category);
    }

    // 3. Node Type Filter
    if (options.nodeType) {
      allObjects = allObjects.filter(
        (o) => inferNodeType(o) === options.nodeType
      );
    }

    // 4. Difficulty Filter
    if (options.difficulty) {
      allObjects = allObjects.filter((o) => o.difficulty === options.difficulty);
    }

    // 5. Pagination
    const total = allObjects.length;
    const offset = options.offset ?? 0;
    const limit = options.limit ?? 20;
    const items = allObjects.slice(offset, offset + limit);

    return {
      items,
      total,
      hasMore: offset + limit < total,
    };
  }
}

export const graphSearchService = new GraphSearchService();
