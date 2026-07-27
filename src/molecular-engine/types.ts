// ═══════════════════════════════════════════════════════════════
// Biosphere — Molecular Biology & Genetics Engine Types
// ═══════════════════════════════════════════════════════════════

import type { Difficulty } from "@/data/learningEngine";

export type MolecularCategory =
  | "dna"
  | "rna"
  | "gene"
  | "chromosome"
  | "protein"
  | "enzyme"
  | "nucleotide"
  | "codon"
  | "genome"
  | "mutation";

export type BasePair = "A" | "T" | "C" | "G" | "U";

export type MutationType =
  | "silent"
  | "missense"
  | "nonsense"
  | "insertion"
  | "deletion"
  | "frameshift"
  | "duplication";

export interface NucleotideDetail {
  base: BasePair;
  name: string;
  chemicalType: "Purine" | "Pyrimidine";
  complement: BasePair;
  hydrogenBonds: number;
  color: string;
}

export interface CodonMapping {
  codon: string;
  aminoAcidName: string;
  aminoAcidCode: string;
  isStart?: boolean;
  isStop?: boolean;
}

export interface MolecularStructureLevel {
  level: "Primary" | "Secondary" | "Tertiary" | "Quaternary";
  name: string;
  description: string;
  keyFeatures: string[];
}

export interface MutationImpact {
  type: MutationType;
  wildtypeSequence: string;
  mutantSequence: string;
  wildtypeProtein: string;
  mutantProtein: string;
  functionalEffect: string;
  associatedDisease?: string;
}

// ─── Universal Molecular Object ─────────────────────────────

export interface MolecularObject {
  id: string;
  name: string;
  symbol: string;
  category: MolecularCategory;
  subcategory: string;
  icon: string; // BioIcon key
  accentColor: string;
  difficulty: Difficulty;
  estimatedStudyMinutes: number;

  // Overview & Biological Role
  overview: string;
  definition: string;
  chemicalFormula?: string;
  locationInCell: string[];
  primaryFunction: string;
  biologicalImportance: string;

  // Sequence & Structural Properties
  sequenceExample?: string;
  complementarySequence?: string;
  structuralLevels?: MolecularStructureLevel[];
  keyComponents: {
    name: string;
    description: string;
  }[];

  // Clinical & Disease Associations
  clinicalRelevance: string;
  associatedDiseaseIds: string[];
  associatedOrganIds: string[];
  associatedCellIds: string[];

  // Interactive 3D / Visualization Config
  visualizationType: "3d-dna" | "chromosome" | "sequence" | "mutation" | "protein";
  model3DConfig?: {
    cameraPosition?: [number, number, number];
    strandColor1?: string;
    strandColor2?: string;
  };

  // Assessment & Quizzes
  quizId?: string;
  flashcardIds?: string[];
  xpReward: number;

  // Historical Discovery
  discoverers: {
    name: string;
    contribution: string;
    year: string;
  }[];
  references: string[];
}

// ─── Interactive Learning Module ──────────────────────────────

export interface LearningModuleStep {
  stepNumber: number;
  title: string;
  description: string;
  animationStateKey: string;
  keyTakeaway: string;
}

export interface MolecularLearningModule {
  id: string;
  title: string;
  category: MolecularCategory;
  difficulty: Difficulty;
  estimatedMinutes: number;
  overview: string;
  steps: LearningModuleStep[];
  interactiveExperimentId?: string;
}

// ─── Interactive Sandbox Experiment ──────────────────────────

export type ExperimentType =
  | "build-dna"
  | "match-base-pairs"
  | "repair-dna"
  | "transcribe-rna"
  | "assemble-protein"
  | "identify-mutation"
  | "predict-protein-changes"
  | "punnett-square";

export interface MolecularExperiment {
  id: string;
  type: ExperimentType;
  title: string;
  instructions: string;
  templateSequence: string;
  targetSequence?: string;
  hint: string;
  xpReward: number;
}
