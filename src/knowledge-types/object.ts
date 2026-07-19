// ═══════════════════════════════════════════════════════════════
// Biosphere — Universal Knowledge Object Type Definitions
// ═══════════════════════════════════════════════════════════════

import type { Difficulty } from "@/data/learningEngine";

// ─── Basic Metadata ──────────────────────────────────────────

/** Top-level biology domain categories */
export type KnowledgeCategory =
  | "cell-biology"
  | "human-anatomy"
  | "genetics"
  | "microbiology"
  | "virology"
  | "ecology"
  | "botany"
  | "zoology"
  | "biochemistry"
  | "evolution"
  | "physiology"
  | "pathology"
  | "neuroscience"
  | "immunology"
  | "marine-biology";

/** Content lifecycle status */
export type ContentStatus = "draft" | "review" | "published" | "archived";

// ─── Sub-structures ──────────────────────────────────────────

export interface LearningObjective {
  text: string;
  icon: string; // BioIcon name key
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface ScientistEntry {
  name: string;
  contribution: string;
  year?: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface MediaAsset {
  url: string;
  caption: string;
  credit?: string;
}

export interface Model3DConfig {
  /** Route to the existing 3D page or glTF/glb asset URL */
  url: string;
  /** Camera starting position for the viewer */
  cameraPosition?: [number, number, number];
  /** Accent color for lighting / glow */
  accentColor?: string;
}

export interface QuizQuestion {
  text: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

export interface RevisionNotes {
  importantPoints: string[];
  keyTerms: KeyTerm[];
  summary: string;
}

export interface ContentVerification {
  status: ContentStatus;
  version: string;
  lastReviewed?: string;    // ISO date
  reviewedBy?: string;
  citationCount?: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string; // BioIcon name key
  xpReward: number;
}

// ─── Universal Knowledge Object ──────────────────────────────

/**
 * The master interface for every biology concept in Biosphere.
 *
 * Every topic — from organelle to organ to species to biological
 * process — implements this single interface. The knowledge engine
 * indexes, graphs, caches, and renders objects using this shape.
 */
export interface KnowledgeObject {
  // ── Identity ──────────────────────────────────────────────
  id: string;
  name: string;
  scientificName?: string;
  category: KnowledgeCategory;
  subcategory: string;
  icon: string; // BioIcon name key
  accentColor: string;

  // ── Basic Information ─────────────────────────────────────
  description: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  prerequisites: string[]; // KnowledgeObject IDs
  learningObjectives: LearningObjective[];

  // ── Interactive Reading ───────────────────────────────────
  importantTerms: KeyTerm[];
  summary: string;
  quickRevision: string[];
  interestingFacts: string[];
  commonMisconceptions: string[];

  // ── History & Discovery ───────────────────────────────────
  scientists: ScientistEntry[];
  timeline: TimelineEvent[];

  // ── Media & Interactive Engine ────────────────────────────
  images: MediaAsset[];
  infographics: MediaAsset[];
  model3D?: Model3DConfig;
  animationUrl?: string;
  simulationUrl?: string;
  virtualLabUrl?: string;
  askAiPrompt: string;

  // ── Graph Relationships (KnowledgeObject IDs) ─────────────
  parentTopicId?: string;
  childTopicIds: string[];
  relatedTopicIds: string[];
  prerequisiteIds: string[];
  nextTopicIds: string[];
  relatedDiseaseIds: string[];
  relatedSpeciesIds: string[];
  relatedOrganIds: string[];
  relatedCellIds: string[];
  relatedSimulationIds: string[];
  relatedResearchIds: string[];

  // ── Clinical & Real-World ─────────────────────────────────
  clinicalImportance?: string;
  realWorldApplications: string[];

  // ── Assessment & Gamification ─────────────────────────────
  quiz?: Quiz;
  flashcards: Flashcard[];
  revisionNotes: RevisionNotes;
  xpPoints: number;
  achievementBadge?: AchievementBadge;

  // ── Content Quality ───────────────────────────────────────
  verification: ContentVerification;
  references: string[];
  furtherReading: string[];

  // ── Routing Integration ───────────────────────────────────
  /** Existing Biosphere route to the detailed 3D page (if one exists) */
  existingRoute?: string;
}
