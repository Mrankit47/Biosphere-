"use client";

// ═══════════════════════════════════════════════════════════════
// Biosphere — useRelatedTopics Hook
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import type { KnowledgeObject } from "@/knowledge-types/object";
import type { RelationshipType } from "@/knowledge-types/graph";
import { knowledgeGraph } from "@/knowledge-engine/graphIndexer";
import { initKnowledge } from "@/knowledge-services/knowledgeService";

export interface UseRelatedTopicsResult {
  relatedObjects: KnowledgeObject[];
  loading: boolean;
}

export function useRelatedTopics(
  nodeId: string | undefined,
  relationshipType?: RelationshipType
): UseRelatedTopicsResult {
  const [relatedObjects, setRelatedObjects] = useState<KnowledgeObject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!nodeId) {
      setRelatedObjects([]);
      setLoading(false);
      return;
    }

    try {
      initKnowledge();
      const node = knowledgeGraph.getNode(nodeId);
      if (!node) {
        setRelatedObjects([]);
        setLoading(false);
        return;
      }

      let edges = node.edges;
      if (relationshipType) {
        edges = edges.filter((e) => e.type === relationshipType);
      }

      const objects: KnowledgeObject[] = [];
      const seen = new Set<string>();

      for (const edge of edges) {
        if (!seen.has(edge.to)) {
          seen.add(edge.to);
          const obj = knowledgeGraph.getObject(edge.to);
          if (obj) objects.push(obj);
        }
      }

      setRelatedObjects(objects);
    } catch {
      setRelatedObjects([]);
    } finally {
      setLoading(false);
    }
  }, [nodeId, relationshipType]);

  return { relatedObjects, loading };
}
