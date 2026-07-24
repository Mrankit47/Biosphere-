// ═══════════════════════════════════════════════════════════════
// Biosphere — Digital Human Engine Types
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeObject } from "@/knowledge-types/object";

export type BodySystemId =
  | "skeletal"
  | "muscular"
  | "nervous"
  | "cardiovascular"
  | "respiratory"
  | "digestive"
  | "endocrine"
  | "urinary"
  | "immune"
  | "reproductive"
  | "lymphatic"
  | "integumentary";

export interface BodySystemMeta {
  id: BodySystemId;
  name: string;
  latinName: string;
  icon: string;
  color: string;
  description: string;
  organs: string[];
}

export type ExplorationLayer =
  | "whole-body"
  | "system-view"
  | "organ-view"
  | "tissue-view"
  | "cell-view"
  | "cross-section"
  | "exploded-view"
  | "transparent-mode"
  | "isolation-mode";

export type PhysiologyOverlay =
  | "blood-flow"
  | "neural-signals"
  | "lymph-flow"
  | "hormone-flow"
  | "respiration"
  | "digestion"
  | "temperature-reg";

export interface MeasurementPoint {
  id: string;
  position: [number, number, number];
  label?: string;
}

export interface BookmarkEntry {
  id: string;
  title: string;
  timestamp: number;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  activeSystem: BodySystemId | null;
  selectedOrgan: string | null;
  activeLayer: ExplorationLayer;
  activeOverlays: PhysiologyOverlay[];
  notes?: string;
}

export interface ConnectedDiseaseData {
  id: string;
  name: string;
  icdCode?: string;
  severity: "mild" | "moderate" | "severe" | "critical";
  description: string;
  symptoms: string[];
  diagnosticTests: string[];
  clinicalTreatments: string[];
  relatedSimulations: { id: string; title: string; route: string }[];
  relatedVirtualLabs: { id: string; title: string; route: string }[];
  relatedResearch: { id: string; title: string; doi?: string }[];
}

export interface OrganComparisonData {
  organA: KnowledgeObject | null;
  organB: KnowledgeObject | null;
  isActive: boolean;
}

export interface DigitalHumanState {
  gender: "male" | "female";
  renderMode: "realistic" | "xray" | "hologram";
  activeSystem: BodySystemId | null;
  visibleSystems: Record<BodySystemId, boolean>;
  systemOpacity: Record<BodySystemId, number>;
  selectedOrganId: string | null;
  hoveredOrganId: string | null;
  isolatedOrganId: string | null;
  activeLayer: ExplorationLayer;
  explodeLevel: number;
  clippingAxis: "x" | "y" | "z";
  clippingPosition: number;
  activeOverlays: Record<PhysiologyOverlay, boolean>;
  measurementPoints: MeasurementPoint[];
  isMeasuring: boolean;
  comparison: OrganComparisonData;
  bookmarks: BookmarkEntry[];
  searchQuery: string;
  isAiSidebarOpen: boolean;
  isSearchOpen: boolean;
  isTissueCellModalOpen: boolean;
}
