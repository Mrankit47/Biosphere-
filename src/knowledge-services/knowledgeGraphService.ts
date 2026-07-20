// ═══════════════════════════════════════════════════════════════
// Biosphere — Master Knowledge Graph Service Facade
//
// Unified singleton facade exposing graph indexing, recommendations,
// dynamic learning paths, graph traversal, and visualization APIs.
// ═══════════════════════════════════════════════════════════════

import { knowledgeGraph } from "@/knowledge-engine/graphIndexer";
import { initKnowledge } from "./knowledgeService";
import { relationshipResolver } from "./relationshipResolver";
import { graphTraversalService } from "./graphTraversal";
import { graphSearchService } from "./graphSearch";
import { recommendationEngine, type UserContext } from "./recommendationEngine";
import { dynamicPathGenerator } from "./dynamicPathGenerator";
import { visualizationEngine, type VisualizationOptions } from "./visualizationEngine";

export class KnowledgeGraphServiceFacade {
  constructor() {
    initKnowledge();
  }

  // ── Engine Access ──────────────────────────────────────────

  get graph() {
    initKnowledge();
    return knowledgeGraph;
  }

  // ── Services ───────────────────────────────────────────────

  get resolver() {
    return relationshipResolver;
  }

  get traversal() {
    initKnowledge();
    return graphTraversalService;
  }

  get search() {
    initKnowledge();
    return graphSearchService;
  }

  get recommendations() {
    initKnowledge();
    return recommendationEngine;
  }

  get pathGenerator() {
    initKnowledge();
    return dynamicPathGenerator;
  }

  get visualization() {
    initKnowledge();
    return visualizationEngine;
  }

  // ── Convenience Methods ────────────────────────────────────

  getRecommendations(userContext: UserContext = {}) {
    initKnowledge();
    return recommendationEngine.generateRecommendations(userContext);
  }

  getDynamicLearningPath(interestTag: string = "pre-med", completedTopicIds: string[] = []) {
    initKnowledge();
    return dynamicPathGenerator.generatePath(interestTag, completedTopicIds);
  }

  getVisualizationData(options: VisualizationOptions = {}) {
    initKnowledge();
    return visualizationEngine.generateVisualizationData(options);
  }
}

export const knowledgeGraphService = new KnowledgeGraphServiceFacade();
