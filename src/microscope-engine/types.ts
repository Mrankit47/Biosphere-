export type ObjectiveLens = '4x' | '10x' | '40x' | '100x';

export type OpticalFilter = 'normal' | 'he_stain' | 'fluorescent' | 'darkfield' | 'phase_contrast' | 'polarized';

export type SlideCategory = 
  | 'animal_tissue'
  | 'plant_tissue'
  | 'blood_smear'
  | 'histology_organs'
  | 'bacteria'
  | 'virus'
  | 'fungi'
  | 'protozoa'
  | 'algae'
  | 'pathology_comparison';

export type SpecimenType = 'healthy' | 'diseased' | 'educational_model';

export interface CellStructure {
  id: string;
  name: string;
  scientificTerm: string;
  description: string;
  x: number; // Normalized coordinate 0.0 - 1.0
  y: number; // Normalized coordinate 0.0 - 1.0
  radius: number; // Normalized radius
  minMagnificationRequired: number; // e.g. 10 or 40 or 100
  optimalDepthLayer: number; // 0.0 to 1.0 for fine focus matching
  color: string;
  category: 'organelle' | 'cell_wall' | 'nucleus' | 'membrane' | 'inclusion' | 'tissue_layer' | 'pathogen_feature';
  function: string;
  clinicalSignificance?: string;
}

export interface MicroscopeSlide {
  id: string;
  title: string;
  scientificName: string;
  category: SlideCategory;
  subcategory: string;
  description: string;
  specimenType: SpecimenType;
  stainType: string;
  defaultObjective: ObjectiveLens;
  baseFOVMicrons: number; // FOV width in micrometers at 4x (e.g. 4500µm)
  cellularStructures: CellStructure[];
  diseasedPairId?: string;
  diseaseExplorerPath?: string;
  diseaseNotes?: string;
  histologyDetails: {
    tissueOrigin: string;
    keyIdentificationFeatures: string[];
    prepMethod: string;
    clinicalRelevance: string;
  };
  proceduralConfig: {
    primaryColor: string;
    secondaryColor: string;
    patternType: 'cellular_network' | 'striated_fibers' | 'bacterial_colony' | 'blood_cells' | 'plant_stomata' | 'viral_capsids' | 'osteon_rings' | 'alveoli_mesh';
    density: number;
    roughness: number;
    bgGlowColor?: string;
  };
}

export interface MicroscopeState {
  slideId: string;
  objective: ObjectiveLens;
  digitalZoom: number; // 1.0 to 4.0
  coarseFocus: number; // 0 to 100
  fineFocus: number; // 0 to 100
  stageX: number; // -100 to 100
  stageY: number; // -100 to 100
  rotation: number; // 0 to 360 degrees
  brightness: number; // 50 to 150 (percentage)
  contrast: number; // 50 to 150 (percentage)
  opticalFilter: OpticalFilter;
  oilImmersionApplied: boolean;
  showLabels: boolean;
  showAnnotations: boolean;
  activeTool: 'navigate' | 'measure' | 'annotate';
  isCompareMode: boolean;
  comparedSlideId: string | null;
  selectedStructureId: string | null;
}

export interface MeasurementCaliper {
  active: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  distanceMicrons: number;
}

export interface AnnotationPin {
  id: string;
  slideId: string;
  x: number;
  y: number;
  label: string;
  note: string;
  color: string;
  createdAt: string;
}

export interface NotebookEntry {
  id: string;
  slideId: string;
  slideTitle: string;
  objective: ObjectiveLens;
  effectiveMagnification: number;
  timestamp: string;
  notes: string;
  findings: string[];
  conclusions: string;
  snapshotDataUrl?: string;
  measurements?: Array<{ label: string; valueMicrons: number }>;
}

export interface AssessmentTask {
  id: string;
  title: string;
  instruction: string;
  targetSlideId: string;
  requiredObjective: ObjectiveLens;
  targetStructureId?: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  xpReward: number;
}
