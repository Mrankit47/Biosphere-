"use client";

// ═══════════════════════════════════════════════════════════════
// Biosphere — useRecommendations Hook
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import type { MultiVectorRecommendations } from "@/knowledge-types/graph";
import { recommendationEngine, type UserContext } from "@/knowledge-services/recommendationEngine";
import { initKnowledge } from "@/knowledge-services/knowledgeService";

export interface UseRecommendationsResult {
  recommendations: MultiVectorRecommendations | null;
  loading: boolean;
  refetch: () => void;
}

export function useRecommendations(userContext: UserContext = {}): UseRecommendationsResult {
  const [recommendations, setRecommendations] = useState<MultiVectorRecommendations | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRecs = () => {
    setLoading(true);
    try {
      initKnowledge();
      const recs = recommendationEngine.generateRecommendations(userContext);
      setRecommendations(recs);
    } catch {
      setRecommendations(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userContext.currentTopicId, userContext.interestTag, JSON.stringify(userContext.completedTopicIds)]);

  return { recommendations, loading, refetch: fetchRecs };
}
