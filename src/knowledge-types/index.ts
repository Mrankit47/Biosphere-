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

// Graph types
export type {
  RelationshipType,
  KnowledgeEdge,
  KnowledgeGraphNode,
  GraphTraversalResult,
  GraphPath,
  GraphStats,
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
