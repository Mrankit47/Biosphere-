// ═══════════════════════════════════════════════════════════════
// Biosphere — Clinical Learning Engine Core Type Definitions
// ═══════════════════════════════════════════════════════════════

import type { Difficulty } from "@/data/learningEngine";

export type DiseaseCategory =
  | "cardiovascular"
  | "respiratory"
  | "endocrine"
  | "neurological"
  | "infectious"
  | "oncology"
  | "hematology"
  | "gastrointestinal"
  | "immunology"
  | "renal";

export type SeverityLevel = "mild" | "moderate" | "severe" | "critical";

// ─── Timeline & Progression ──────────────────────────────────

export type ProgressionStageId =
  | "healthy"
  | "early"
  | "progression"
  | "advanced"
  | "recovery"
  | "long-term";

export interface ClinicalTimelineStage {
  id: ProgressionStageId;
  title: string;
  subtitle: string;
  duration: string;
  cellularChanges: string[];
  tissueDamageDescription: string;
  symptomSeverity: SeverityLevel;
  clinicalSigns: string[];
  biomarkers: string[];
  interventionPoints: string[];
  damagePercentage: number; // 0 to 100
}

// ─── Diagnostic Tests & Imaging ──────────────────────────────

export interface LabTestResult {
  testName: string;
  category: "Blood" | "Urine" | "CSF" | "Biochemical" | "Genetic" | "Immunological";
  normalRange: string;
  diseaseValue: string;
  clinicalSignificance: string;
}

export interface ImagingFinding {
  modality: "X-Ray" | "Chest X-Ray" | "CT Scan" | "MRI" | "Ultrasound" | "PET Scan" | "PET-CT Scan" | "Echocardiogram";
  findings: string;
  keyFeature: string;
}

// ─── Treatment & Therapeutics ────────────────────────────────

export interface Medication {
  name: string;
  class: string;
  mechanismOfAction: string;
  commonDosage: string;
  sideEffects: string[];
  contraindications: string[];
}

export interface TreatmentOverview {
  primaryGoal: string;
  medications: Medication[];
  surgicalOptions: string[];
  lifestyleManagement: string[];
  monitoringProtocol: string;
}

// ─── Case Studies & Patient Profiles ──────────────────────────

export interface PatientProfile {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  occupation: string;
  chiefComplaint: string;
  vitals: {
    bloodPressure: string;
    heartRate: string;
    respiratoryRate: string;
    temperature: string;
    oxygenSaturation: string;
  };
}

export interface ReflectionQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface PatientCaseStudy {
  id: string;
  diseaseId: string;
  title: string;
  difficulty: Difficulty;
  patient: PatientProfile;
  medicalHistory: string[];
  symptomPresentation: string;
  physicalExamination: string[];
  diagnosticResults: {
    labs: LabTestResult[];
    imaging: ImagingFinding[];
  };
  differentialDiagnoses: string[];
  confirmedDiagnosis: string;
  treatmentPlan: string[];
  patientOutcome: string;
  reflectionQuestions: ReflectionQuestion[];
}

// ─── Diagnostic Decision Tree ────────────────────────────────

export interface DecisionTreeNode {
  id: string;
  question: string;
  category: string;
  options: {
    label: string;
    nextStepId?: string;
    diagnosisResult?: string;
    reasoning: string;
  }[];
}

export interface DiagnosticDecisionTree {
  id: string;
  diseaseCategory: DiseaseCategory;
  title: string;
  initialNodeId: string;
  nodes: Record<string, DecisionTreeNode>;
}

// ─── Disease Object Interface ────────────────────────────────

export interface DiseaseObject {
  id: string;
  name: string;
  icdCode: string;
  scientificName: string;
  category: DiseaseCategory;
  subcategory: string;
  icon: string; // BioIcon key
  accentColor: string;
  difficulty: Difficulty;
  estimatedStudyTimeMinutes: number;

  // Overview & Classification
  overview: string;
  definition: string;
  classification: string[];
  causes: string[];
  riskFactors: string[];
  pathophysiology: string;

  // Affected Organ & Systems Mapping
  affectedOrgans: string[]; // Organ IDs (e.g. 'heart', 'lungs', 'pancreas')
  affectedSystems: string[]; // System names (e.g. 'Cardiovascular', 'Endocrine')

  // Symptoms & Severity
  symptoms: {
    name: string;
    severity: SeverityLevel;
    frequency: "Common" | "Occasional" | "Rare";
    description: string;
    organSystem: string;
  }[];

  // Clinical Timeline (6 Stages)
  clinicalTimeline: ClinicalTimelineStage[];

  // Diagnosis
  diagnosisOverview: string;
  labTests: LabTestResult[];
  imagingFindings: ImagingFinding[];
  diagnosticCriteria: string[];

  // Management & Treatment
  treatment: TreatmentOverview;
  complications: string[];
  prevention: string[];
  prognosis: string;

  // Pathomorphology & Visualizer
  organDamageHighlights: {
    organName: string;
    damageType: string;
    description: string;
    pathologyColor: string;
  }[];

  // Research & References
  recentResearch: {
    title: string;
    summary: string;
    journal: string;
    year: string;
    url?: string;
  }[];
  references: string[];

  // Biosphere Relationships (Object & Simulation IDs)
  relatedAnatomyIds: string[];
  relatedCellIds: string[];
  relatedGeneIds: string[];
  relatedSimulationUrls: string[];
  relatedVirtualLabUrls: string[];
  relatedQuizIds: string[];
  relatedResearchIds: string[];
  relatedScientistNames: string[];
}

// ─── Comparison Matrix Interface ──────────────────────────────

export interface DiseaseComparisonData {
  diseases: DiseaseObject[];
  commonSymptoms: string[];
  differentiatingFeatures: {
    feature: string;
    values: Record<string, string>; // diseaseId -> description
  }[];
}
