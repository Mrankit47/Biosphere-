"use client";

// ═══════════════════════════════════════════════════════════════
// Biosphere — useLearningPath Hook
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import type { DynamicLearningPath } from "@/knowledge-types/graph";
import { dynamicPathGenerator } from "@/knowledge-services/dynamicPathGenerator";
import { initKnowledge } from "@/knowledge-services/knowledgeService";

export interface UseLearningPathResult {
  path: DynamicLearningPath | null;
  loading: boolean;
}

export function useLearningPath(
  interestTag: string = "pre-med",
  completedTopicIds: string[] = []
): UseLearningPathResult {
  const [path, setPath] = useState<DynamicLearningPath | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      initKnowledge();
      const generated = dynamicPathGenerator.generatePath(interestTag, completedTopicIds);
      setPath(generated);
    } catch {
      setPath(null);
    } finally {
      setLoading(false);
    }
  }, [interestTag, JSON.stringify(completedTopicIds)]);

  return { path, loading };
}
