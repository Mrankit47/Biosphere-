// ═══════════════════════════════════════════════════════════════
// Biosphere — Knowledge Services Barrel Export
// ═══════════════════════════════════════════════════════════════

export {
  initKnowledge,
  reindexKnowledge,
  getKnowledgeObject,
  getKnowledgeNode,
  knowledgeObjectExists,
  getAllKnowledgeIds,
  getAllKnowledgeObjects,
  resolveObjects,
  getRelatedGrouped,
} from "./knowledgeService";

export {
  validateKnowledgeObject,
  validateAll,
  isPublishReady,
} from "./verificationService";

export { relationshipResolver, inferNodeType } from "./relationshipResolver";
export { graphTraversalService } from "./graphTraversal";
export { graphSearchService } from "./graphSearch";
export { recommendationEngine } from "./recommendationEngine";
export { dynamicPathGenerator, SUPPORTED_INTERESTS } from "./dynamicPathGenerator";
export { visualizationEngine } from "./visualizationEngine";
export { knowledgeGraphService } from "./knowledgeGraphService";
