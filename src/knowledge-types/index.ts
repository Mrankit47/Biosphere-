// ═══════════════════════════════════════════════════════════════
// Biosphere — Knowledge Types Barrel Export
// ═══════════════════════════════════════════════════════════════

// Object types
export type {
  KnowledgeCategory,
  ContentStatus,
  LearningObjective,
  KeyTerm,
  ScientistEntry,
  TimelineEvent,
  MediaAsset,
  Model3DConfig,
  QuizQuestion,
  Quiz,
  Flashcard,
  RevisionNotes,
  ContentVerification,
  AchievementBadge,
  KnowledgeObject,
} from "./object";

// Graph & Recommendation types
export type {
  NodeType,
  ExtendedRelationshipType,
  RelationshipType,
  KnowledgeEdge,
  KnowledgeGraphNode,
  GraphTraversalResult,
  GraphPath,
  GraphStats,
  VisNode,
  VisLink,
  VisCluster,
  GraphVisualizationData,
  RecommendationCategory,
  RecommendationItem,
  MultiVectorRecommendations,
  DynamicPathStep,
  DynamicLearningPath,
} from "./graph";

// Validation types
export type {
  ReviewAction,
  ReviewHistory,
  ContentVersion,
  VersionHistory,
  CitationType,
  Citation,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from "./validation";
