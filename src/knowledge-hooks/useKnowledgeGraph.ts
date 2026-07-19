"use client";

// ═══════════════════════════════════════════════════════════════
// Biosphere — useKnowledgeGraph Hook
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import type { KnowledgeGraphNode, KnowledgeEdge } from "@/knowledge-types/graph";
import type { KnowledgeObject } from "@/knowledge-types/object";
import { knowledgeGraph } from "@/knowledge-engine/graphIndexer";
import { initKnowledge, getRelatedGrouped } from "@/knowledge-services/knowledgeService";

export interface UseKnowledgeGraphResult {
  /** Direct neighbor nodes (1-hop) */
  neighbors: KnowledgeGraphNode[];
  /** All edges from the queried node */
  edges: KnowledgeEdge[];
  /** Related objects grouped by relationship type */
  relatedGroups: Record<string, KnowledgeObject[]>;
  /** BFS traversal result (nodes within depth) */
  traversal: { nodes: KnowledgeGraphNode[]; edges: KnowledgeEdge[] };
  loading: boolean;
}

/**
 * React hook for graph traversal and relationship queries.
 * Returns neighbors, edges, grouped relations, and BFS traversal.
 */
export function useKnowledgeGraph(
  id: string | undefined,
  depth: number = 2
): UseKnowledgeGraphResult {
  const [result, setResult] = useState<UseKnowledgeGraphResult>({
    neighbors: [],
    edges: [],
    relatedGroups: {},
    traversal: { nodes: [], edges: [] },
    loading: true,
  });

  useEffect(() => {
    if (!id) {
      setResult({
        neighbors: [],
        edges: [],
        relatedGroups: {},
        traversal: { nodes: [], edges: [] },
        loading: false,
      });
      return;
    }

    try {
      initKnowledge();

      const neighbors = knowledgeGraph.getNeighbors(id);
      const edges = knowledgeGraph.getEdges(id);
      const relatedGroups = getRelatedGrouped(id);
      const traversal = knowledgeGraph.traverse(id, depth);

      setResult({
        neighbors,
        edges,
        relatedGroups,
        traversal,
        loading: false,
      });
    } catch {
      setResult({
        neighbors: [],
        edges: [],
        relatedGroups: {},
        traversal: { nodes: [], edges: [] },
        loading: false,
      });
    }
  }, [id, depth]);

  return result;
}
