// ═══════════════════════════════════════════════════════════════
// Biosphere — Clinical Engine Knowledge & Relationship Resolver
// ═══════════════════════════════════════════════════════════════

import { CLINICAL_DISEASES } from "../data/diseases";
import { CLINICAL_CASE_STUDIES } from "../data/cases";
import type { DiseaseObject, PatientCaseStudy, DiseaseComparisonData } from "../types";

/**
 * Retrieves a single disease object by ID.
 */
export function getDiseaseById(id: string): DiseaseObject | undefined {
  return CLINICAL_DISEASES[id.toLowerCase()];
}

/**
 * Retrieves all registered diseases.
 */
export function getAllDiseases(): DiseaseObject[] {
  return Object.values(CLINICAL_DISEASES);
}

/**
 * Filters diseases by category.
 */
export function getDiseasesByCategory(category: string): DiseaseObject[] {
  return Object.values(CLINICAL_DISEASES).filter(
    (d) => d.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Searches diseases by keyword across name, symptoms, and pathology.
 */
export function searchDiseases(query: string): DiseaseObject[] {
  const q = query.toLowerCase().trim();
  if (!q) return getAllDiseases();

  return Object.values(CLINICAL_DISEASES).filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.scientificName.toLowerCase().includes(q) ||
      d.overview.toLowerCase().includes(q) ||
      d.pathophysiology.toLowerCase().includes(q) ||
      d.symptoms.some((s) => s.name.toLowerCase().includes(q))
  );
}

/**
 * Retrieves patient case studies for a specific disease ID.
 */
export function getCaseStudiesByDiseaseId(diseaseId: string): PatientCaseStudy[] {
  return CLINICAL_CASE_STUDIES.filter(
    (c) => c.diseaseId.toLowerCase() === diseaseId.toLowerCase()
  );
}

/**
 * Retrieves all case studies across the clinical engine.
 */
export function getAllCaseStudies(): PatientCaseStudy[] {
  return CLINICAL_CASE_STUDIES;
}

/**
 * Generates a side-by-side comparison matrix for selected disease IDs.
 */
export function generateDiseaseComparison(diseaseIds: string[]): DiseaseComparisonData {
  const diseases = diseaseIds
    .map((id) => getDiseaseById(id))
    .filter((d): d is DiseaseObject => d !== undefined);

  if (diseases.length === 0) {
    return { diseases: [], commonSymptoms: [], differentiatingFeatures: [] };
  }

  // Find symptoms shared across diseases
  const symptomSets = diseases.map((d) => new Set(d.symptoms.map((s) => s.name)));
  const commonSymptoms = Array.from(symptomSets[0]).filter((symptom) =>
    symptomSets.every((set) => set.has(symptom))
  );

  // Key differentiating features
  const featuresList = [
    { key: "category", label: "Disease Category" },
    { key: "icdCode", label: "ICD-10 Code" },
    { key: "pathophysiology", label: "Primary Pathophysiology" },
    { key: "diagnosisOverview", label: "Diagnostic Gold Standard" },
    { key: "treatment", label: "First-Line Medication" }
  ];

  const differentiatingFeatures = featuresList.map((f) => {
    const values: Record<string, string> = {};
    diseases.forEach((d) => {
      if (f.key === "treatment") {
        values[d.id] = d.treatment.medications[0]?.name || "N/A";
      } else {
        values[d.id] = String((d as any)[f.key] || "N/A");
      }
    });
    return { feature: f.label, values };
  });

  return { diseases, commonSymptoms, differentiatingFeatures };
}
