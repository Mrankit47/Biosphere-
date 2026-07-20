// ═══════════════════════════════════════════════════════════════
// Biosphere — Multi-Vector Recommendation Engine
//
// Generates personalized, graph-driven recommendations across
// 9 distinct learning vectors.
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeObject } from "@/knowledge-types/object";
import type {
  MultiVectorRecommendations,
  RecommendationItem,
  RecommendationCategory,
} from "@/knowledge-types/graph";
import { knowledgeGraph } from "@/knowledge-engine/graphIndexer";
import { inferNodeType } from "./relationshipResolver";

export interface UserContext {
  completedTopicIds?: string[];
  currentTopicId?: string;
  interestTag?: string; // e.g. "medicine", "genetics", "botany", "virology", "microbiology"
}

export class RecommendationEngine {
  /**
   * Generate multi-vector recommendations tailored to the user's progress and interests.
   */
  generateRecommendations(userContext: UserContext = {}): MultiVectorRecommendations {
    const allObjects = knowledgeGraph.getAllObjects();
    const currentObj = userContext.currentTopicId
      ? knowledgeGraph.getObject(userContext.currentTopicId)
      : undefined;

    const completedSet = new Set(userContext.completedTopicIds ?? []);

    // 1. Continue Learning (In-progress or next direct prerequisites)
    const continueLearning = this.getContinueLearning(currentObj, completedSet, allObjects);

    // 2. Recommended Topics (Graph neighbors & next topics)
    const recommendedTopics = this.getRecommendedTopics(currentObj, completedSet, allObjects);

    // 3. Recommended Simulations
    const recommendedSimulations = this.getRecommendedSimulations(currentObj, allObjects);

    // 4. Recommended Labs
    const recommendedLabs = this.getRecommendedLabs(currentObj, allObjects);

    // 5. Recommended Quizzes
    const recommendedQuizzes = this.getRecommendedQuizzes(allObjects, completedSet);

    // 6. Recommended Flashcards
    const recommendedFlashcards = this.getRecommendedFlashcards(allObjects);

    // 7. Recommended Research
    const recommendedResearch = this.getRecommendedResearch(allObjects);

    // 8. Recommended Anatomy
    const recommendedAnatomy = this.getRecommendedAnatomy(allObjects);

    // 9. AI Suggested Personalized Path
    const aiSuggestedPath = this.getAiSuggestedPath(userContext, allObjects);

    return {
      continueLearning,
      recommendedTopics,
      recommendedSimulations,
      recommendedLabs,
      recommendedQuizzes,
      recommendedFlashcards,
      recommendedResearch,
      recommendedAnatomy,
      aiSuggestedPath,
    };
  }

  // ── Vector Builders ────────────────────────────────────────

  private getContinueLearning(
    current?: KnowledgeObject,
    completed?: Set<string>,
    allObjects?: KnowledgeObject[]
  ): RecommendationItem[] {
    const items: RecommendationItem[] = [];

    if (current) {
      for (const nextId of current.nextTopicIds) {
        const obj = knowledgeGraph.getObject(nextId);
        if (obj && !completed?.has(obj.id)) {
          items.push(this.toRecItem(obj, "continue-learning", 95, `Next step after ${current.name}`));
        }
      }
    }

    if (items.length === 0 && allObjects) {
      // Fallback: uncompleted beginner topics
      const beginner = allObjects.filter((o) => o.difficulty === "beginner" && !completed?.has(o.id));
      beginner.slice(0, 3).forEach((obj) => {
        items.push(this.toRecItem(obj, "continue-learning", 85, "Essential foundation concept"));
      });
    }

    return items;
  }

  private getRecommendedTopics(
    current?: KnowledgeObject,
    completed?: Set<string>,
    allObjects?: KnowledgeObject[]
  ): RecommendationItem[] {
    const items: RecommendationItem[] = [];

    if (current) {
      const neighbors = knowledgeGraph.getNeighbors(current.id);
      for (const node of neighbors) {
        const obj = knowledgeGraph.getObject(node.id);
        if (obj && obj.id !== current.id && !completed?.has(obj.id)) {
          items.push(this.toRecItem(obj, "recommended-topic", 88, `Connected to ${current.name}`));
        }
      }
    }

    if (items.length < 3 && allObjects) {
      allObjects.slice(0, 5).forEach((obj) => {
        if (!items.some((i) => i.id === obj.id)) {
          items.push(this.toRecItem(obj, "recommended-topic", 75, "Popular topic in Biosphere"));
        }
      });
    }

    return items.slice(0, 6);
  }

  private getRecommendedSimulations(
    current?: KnowledgeObject,
    allObjects?: KnowledgeObject[]
  ): RecommendationItem[] {
    const simObjects = (allObjects ?? []).filter((o) => o.simulationUrl != null);
    return simObjects.map((obj) =>
      this.toRecItem(
        obj,
        "recommended-simulation",
        90,
        `Interactive 3D process simulation: ${obj.name}`,
        obj.simulationUrl
      )
    );
  }

  private getRecommendedLabs(
    current?: KnowledgeObject,
    allObjects?: KnowledgeObject[]
  ): RecommendationItem[] {
    const labObjects = (allObjects ?? []).filter((o) => o.virtualLabUrl != null);
    return labObjects.map((obj) =>
      this.toRecItem(
        obj,
        "recommended-lab",
        85,
        `Virtual Biology Experiment: ${obj.name}`,
        obj.virtualLabUrl
      )
    );
  }

  private getRecommendedQuizzes(
    allObjects?: KnowledgeObject[],
    completed?: Set<string>
  ): RecommendationItem[] {
    const quizObjects = (allObjects ?? []).filter((o) => o.quiz != null);
    return quizObjects.map((obj) =>
      this.toRecItem(
        obj,
        "recommended-quiz",
        80,
        `Test your knowledge on ${obj.name}`,
        `/knowledge/${obj.id}#quiz`
      )
    );
  }

  private getRecommendedFlashcards(allObjects?: KnowledgeObject[]): RecommendationItem[] {
    const fcObjects = (allObjects ?? []).filter((o) => o.flashcards.length > 0);
    return fcObjects.map((obj) =>
      this.toRecItem(
        obj,
        "recommended-flashcards",
        82,
        `${obj.flashcards.length} Flashcards on ${obj.name}`,
        `/knowledge/${obj.id}#flashcards`
      )
    );
  }

  private getRecommendedResearch(allObjects?: KnowledgeObject[]): RecommendationItem[] {
    const resObjects = (allObjects ?? []).filter((o) => o.references.length > 0);
    return resObjects.map((obj) =>
      this.toRecItem(
        obj,
        "recommended-research",
        78,
        `Academic citations & research for ${obj.name}`,
        `/knowledge/${obj.id}#research`
      )
    );
  }

  private getRecommendedAnatomy(allObjects?: KnowledgeObject[]): RecommendationItem[] {
    const anatObjects = (allObjects ?? []).filter(
      (o) => o.category === "human-anatomy" || o.category === "cell-biology"
    );
    return anatObjects.map((obj) =>
      this.toRecItem(
        obj,
        "recommended-anatomy",
        88,
        `Anatomical exhibit: ${obj.name}`,
        obj.existingRoute ?? `/knowledge/${obj.id}`
      )
    );
  }

  private getAiSuggestedPath(
    userContext: UserContext,
    allObjects: KnowledgeObject[]
  ): RecommendationItem[] {
    const interest = userContext.interestTag?.toLowerCase();

    let filtered = allObjects;
    if (interest) {
      filtered = allObjects.filter(
        (o) =>
          o.category.toLowerCase().includes(interest) ||
          o.subcategory.toLowerCase().includes(interest) ||
          o.description.toLowerCase().includes(interest)
      );
    }

    if (filtered.length === 0) filtered = allObjects;

    return filtered.slice(0, 5).map((obj, i) =>
      this.toRecItem(
        obj,
        "ai-suggested-learning",
        95 - i * 5,
        `AI Curator: Matched with your interest in ${interest ?? "biology"}`
      )
    );
  }

  // ── Helper ──────────────────────────────────────────────────

  private toRecItem(
    obj: KnowledgeObject,
    category: RecommendationCategory,
    score: number,
    reason: string,
    overrideUrl?: string
  ): RecommendationItem {
    return {
      id: obj.id,
      title: obj.name,
      subtitle: obj.subcategory,
      category,
      targetUrl: overrideUrl ?? `/knowledge/${obj.id}`,
      icon: obj.icon,
      accentColor: obj.accentColor,
      score,
      reason,
      nodeType: inferNodeType(obj),
    };
  }
}

export const recommendationEngine = new RecommendationEngine();
