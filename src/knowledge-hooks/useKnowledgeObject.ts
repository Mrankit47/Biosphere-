"use client";

// ═══════════════════════════════════════════════════════════════
// Biosphere — useKnowledgeObject Hook
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import type { KnowledgeObject } from "@/knowledge-types/object";
import { getKnowledgeObject, initKnowledge } from "@/knowledge-services/knowledgeService";

export interface UseKnowledgeObjectResult {
  object: KnowledgeObject | null;
  loading: boolean;
  error: string | null;
}

/**
 * React hook to fetch a KnowledgeObject by ID.
 * Auto-initializes the knowledge service on first render.
 */
export function useKnowledgeObject(id: string | undefined): UseKnowledgeObjectResult {
  const [object, setObject] = useState<KnowledgeObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setObject(null);
      setLoading(false);
      setError("No object ID provided");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      initKnowledge();
      const obj = getKnowledgeObject(id);
      if (obj) {
        setObject(obj);
        setError(null);
      } else {
        setObject(null);
        setError(`Knowledge object "${id}" not found`);
      }
    } catch (e) {
      setObject(null);
      setError(e instanceof Error ? e.message : "Failed to load knowledge object");
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { object, loading, error };
}
