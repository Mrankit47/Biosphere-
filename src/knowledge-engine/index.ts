// ═══════════════════════════════════════════════════════════════
// Biosphere — Knowledge Engine Barrel Export
// ═══════════════════════════════════════════════════════════════

export { KnowledgeGraphIndex, knowledgeGraph } from "./graphIndexer";

export {
  queryKnowledge,
  getByCategory,
  getRecommendedNext,
  getLearningPath,
  getAvailableCategories,
} from "./queryEngine";

export type { KnowledgeFilter, KnowledgeQueryResult } from "./queryEngine";
