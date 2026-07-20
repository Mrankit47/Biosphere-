// ═══════════════════════════════════════════════════════════════
// Biosphere — Knowledge Graph & Recommendation Engine Types
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeCategory } from "./object";

// ─── Node Types ───────────────────────────────────────────────

export type NodeType =
  | "cell"
  | "dna"
  | "rna"
  | "neuron"
  | "liver"
  | "heart"
  | "organ"
  | "system"
  | "virus"
  | "bacteria"
  | "species"
  | "disease"
  | "experiment"
  | "simulation"
  | "lab"
  | "research-article"
  | "scientist"
  | "process";

// ─── Edge / Relationship Types ───────────────────────────────

export type ExtendedRelationshipType =
  | "prerequisite"
  | "next"
  | "parent"
  | "child"
  | "part-of"
  | "contains"
  | "related-disease"
  | "related-organ"
  | "related-cell"
  | "related-species"
  | "related-simulation"
  | "related-virtual-lab"
  | "related-quiz"
  | "related-flashcards"
  | "related-research"
  | "related-scientist"
  | "medical-importance"
  | "environmental-importance";

// Retro-compatibility alias
export type RelationshipType = ExtendedRelationshipType | "related";

/** A directed edge between two knowledge graph nodes */
export interface KnowledgeEdge {
  from: string;
  to: string;
  type: RelationshipType;
  weight: number; // 0.0 - 1.0 confidence/strength
  label?: string;
  metadata?: Record<string, unknown>;
}

// ─── Graph Node ──────────────────────────────────────────────

export interface KnowledgeGraphNode {
  id: string;
  name: string;
  nodeType: NodeType;
  category: KnowledgeCategory;
  subcategory: string;
  icon: string;
  accentColor: string;
  difficulty: string;
  importanceScore?: number; // 0-100 score for search & ranking
  edges: KnowledgeEdge[];
}

// ─── Traversal & Query Types ─────────────────────────────────

export interface GraphTraversalResult {
  rootId: string;
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeEdge[];
  depth: number;
}

export interface GraphPath {
  nodeIds: string[];
  edges: KnowledgeEdge[];
  totalWeight: number;
}

export interface GraphStats {
  totalNodes: number;
  totalEdges: number;
  categoryCounts: Record<string, number>;
  nodeTypeCounts: Record<string, number>;
  averageEdgesPerNode: number;
  maxDepth: number;
}

// ─── Graph Visualization Data Format ──────────────────────────

export interface VisNode {
  id: string;
  label: string;
  nodeType: NodeType;
  category: KnowledgeCategory;
  color: string;
  icon: string;
  size: number;
  clusterId?: string;
  x?: number;
  y?: number;
  z?: number;
}

export interface VisLink {
  source: string;
  target: string;
  type: RelationshipType;
  weight: number;
  label?: string;
}

export interface VisCluster {
  id: string;
  label: string;
  color: string;
  nodeIds: string[];
}

export interface GraphVisualizationData {
  nodes: VisNode[];
  links: VisLink[];
  clusters: VisCluster[];
  focusedNodeId?: string;
  metadata: {
    totalNodes: number;
    totalLinks: number;
    generatedAt: string;
  };
}

// ─── Recommendation Engine Types ─────────────────────────────

export type RecommendationCategory =
  | "continue-learning"
  | "recommended-topic"
  | "recommended-simulation"
  | "recommended-lab"
  | "recommended-quiz"
  | "recommended-flashcards"
  | "recommended-research"
  | "recommended-anatomy"
  | "ai-suggested-learning";

export interface RecommendationItem {
  id: string;
  title: string;
  subtitle: string;
  category: RecommendationCategory;
  targetUrl: string;
  icon: string;
  accentColor: string;
  score: number; // 0-100 relevance score
  reason: string; // Human-readable explanation for the recommendation
  nodeType: NodeType;
}

export interface MultiVectorRecommendations {
  continueLearning: RecommendationItem[];
  recommendedTopics: RecommendationItem[];
  recommendedSimulations: RecommendationItem[];
  recommendedLabs: RecommendationItem[];
  recommendedQuizzes: RecommendationItem[];
  recommendedFlashcards: RecommendationItem[];
  recommendedResearch: RecommendationItem[];
  recommendedAnatomy: RecommendationItem[];
  aiSuggestedPath: RecommendationItem[];
}

// ─── Dynamic Learning Path Types ─────────────────────────────

export interface DynamicPathStep {
  stepNumber: number;
  nodeId: string;
  title: string;
  subcategory: string;
  estimatedMinutes: number;
  difficulty: string;
  icon: string;
  accentColor: string;
  prerequisitesMet: boolean;
  targetUrl: string;
  keyConcepts: string[];
}

export interface DynamicLearningPath {
  id: string;
  title: string;
  description: string;
  interestTag: string;
  totalMinutes: number;
  difficulty: string;
  steps: DynamicPathStep[];
}
