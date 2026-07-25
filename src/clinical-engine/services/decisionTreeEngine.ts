// ═══════════════════════════════════════════════════════════════
// Biosphere — Diagnostic Decision Tree Engine
// ═══════════════════════════════════════════════════════════════

import type { DiagnosticDecisionTree } from "../types";

export const SAMPLE_DECISION_TREES: DiagnosticDecisionTree[] = [
  {
    id: "tree-hyperglycemia",
    diseaseCategory: "endocrine",
    title: "Differential Diagnostic Algorithm for Hyperglycemia & Polyuria",
    initialNodeId: "node-1",
    nodes: {
      "node-1": {
        id: "node-1",
        question: "Is Fasting Blood Glucose ≥ 126 mg/dL or HbA1c ≥ 6.5%?",
        category: "Laboratory Screening",
        options: [
          {
            label: "Yes — Fasting Glucose ≥ 126 mg/dL",
            nextStepId: "node-2",
            reasoning: "Meets laboratory threshold for Diabetes Mellitus diagnosis."
          },
          {
            label: "No — Fasting Glucose < 126 mg/dL (100-125 mg/dL)",
            nextStepId: "node-prediabetes",
            reasoning: "Falls into impaired fasting glucose / prediabetes range."
          }
        ]
      },
      "node-2": {
        id: "node-2",
        question: "Is patient presenting with acute ketoacidosis (DKA) or anti-GAD / IA-2 autoantibodies?",
        category: "Immunological / Acute Signs",
        options: [
          {
            label: "Yes — Autoantibodies positive or DKA present",
            diagnosisResult: "Type 1 Diabetes Mellitus (Autoimmune Beta-Cell Destruction)",
            reasoning: "Confirms autoimmune etiology requiring lifelong basal-bolus insulin therapy."
          },
          {
            label: "No — Autoantibodies negative, insidious onset with obesity",
            diagnosisResult: "Type 2 Diabetes Mellitus (Insulin Resistance & Beta-Cell Decompensation)",
            reasoning: "Classic presentation of Type 2 Diabetes; manageable with lifestyle & Metformin/SGLT2i."
          }
        ]
      },
      "node-prediabetes": {
        id: "node-prediabetes",
        question: "Does 2-hour Oral Glucose Tolerance Test (OGTT) exceed 140 mg/dL?",
        category: "Confirmatory OGTT",
        options: [
          {
            label: "Yes — OGTT 140-199 mg/dL",
            diagnosisResult: "Impaired Glucose Tolerance (Prediabetes)",
            reasoning: "High progression risk to overt T2D; indicate lifestyle intervention."
          },
          {
            label: "No — OGTT < 140 mg/dL",
            diagnosisResult: "Normal Glucose Homeostasis",
            reasoning: "Re-evaluate annually."
          }
        ]
      }
    }
  },

  {
    id: "tree-acute-dyspnea",
    diseaseCategory: "respiratory",
    title: "Differential Diagnosis for Acute Dyspnea & Hypoxia",
    initialNodeId: "node-dyspnea-1",
    nodes: {
      "node-dyspnea-1": {
        id: "node-dyspnea-1",
        question: "Are chest X-ray opacities present with D-Dimer elevation and bilateral crackles?",
        category: "Pulmonary Evaluation",
        options: [
          {
            label: "Bilateral ground-glass opacities on CT & positive RT-PCR",
            diagnosisResult: "COVID-19 Severe Pneumonia with Cytokine Storm",
            reasoning: "Presents viral bilateral infiltrates requiring Dexamethasone & supplemental oxygen."
          },
          {
            label: "Reversible expiratory wheezing with normal chest X-ray hyperinflation",
            diagnosisResult: "Acute Asthma Exacerbation (Bronchospasm)",
            reasoning: "Obstructive respiratory pattern responding to SABA bronchodilators."
          },
          {
            label: "Apical cavitary infiltrates with night sweats and fever",
            diagnosisResult: "Active Pulmonary Tuberculosis",
            reasoning: "Acid-fast bacillus granulomatous lung destruction requiring RIPE therapy."
          }
        ]
      }
    }
  }
];

export function getDecisionTreeById(id: string): DiagnosticDecisionTree | undefined {
  return SAMPLE_DECISION_TREES.find((t) => t.id === id);
}
