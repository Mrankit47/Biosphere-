"use client";

// ═══════════════════════════════════════════════════════════════
// Biosphere — useKnowledgeGraph Hook
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import type {
  KnowledgeGraphNode,
  KnowledgeEdge,
  GraphVisualizationData,
  GraphPath,
} from "@/knowledge-types/graph";
import type { KnowledgeObject } from "@/knowledge-types/object";
import { knowledgeGraph } from "@/knowledge-engine/graphIndexer";
import { initKnowledge, getRelatedGrouped } from "@/knowledge-services/knowledgeService";
import { visualizationEngine } from "@/knowledge-services/visualizationEngine";
import { graphTraversalService } from "@/knowledge-services/graphTraversal";

export interface UseKnowledgeGraphOptions {
  depth?: number;
  focusMode?: boolean;
}

export interface UseKnowledgeGraphResult {
  node: KnowledgeGraphNode | null;
  neighbors: KnowledgeGraphNode[];
  edges: KnowledgeEdge[];
  relatedGroups: Record<string, KnowledgeObject[]>;
  visData: GraphVisualizationData | null;
  loading: boolean;
  findPathTo: (targetId: string) => GraphPath | null;
}

export function useKnowledgeGraph(
  id: string | undefined,
  options: UseKnowledgeGraphOptions = {}
): UseKnowledgeGraphResult {
  const [result, setResult] = useState<Omit<UseKnowledgeGraphResult, "findPathTo">>({
    node: null,
    neighbors: [],
    edges: [],
    relatedGroups: {},
    visData: null,
    loading: true,
  });

  const depth = options.depth ?? 2;

  useEffect(() => {
    if (!id) {
      initKnowledge();
      const visData = visualizationEngine.generateVisualizationData();
      setResult({
        node: null,
        neighbors: [],
        edges: [],
        relatedGroups: {},
        visData,
        loading: false,
      });
      return;
    }

    try {
      initKnowledge();
      const node = knowledgeGraph.getNode(id) ?? null;
      const neighbors = knowledgeGraph.getNeighbors(id);
      const edges = knowledgeGraph.getEdges(id);
      const relatedGroups = getRelatedGrouped(id);
      const visData = visualizationEngine.generateVisualizationData({
        focusNodeId: id,
        maxHopDepth: depth,
      });

      setResult({
        node,
        neighbors,
        edges,
        relatedGroups,
        visData,
        loading: false,
      });
    } catch {
      setResult({
        node: null,
        neighbors: [],
        edges: [],
        relatedGroups: {},
        visData: null,
        loading: false,
      });
    }
  }, [id, depth, options.focusMode]);

  const findPathTo = (targetId: string): GraphPath | null => {
    if (!id) return null;
    return graphTraversalService.findShortestPath(id, targetId);
  };

  return { ...result, findPathTo };
}
