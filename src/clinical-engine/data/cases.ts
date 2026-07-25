// ═══════════════════════════════════════════════════════════════
// Biosphere — Reusable Patient Clinical Case Studies Database
// ═══════════════════════════════════════════════════════════════

import type { PatientCaseStudy } from "../types";

export const CLINICAL_CASE_STUDIES: PatientCaseStudy[] = [
  {
    id: "case-t2d-01",
    diseaseId: "diabetes",
    title: "52-Year-Old Male with Fatigue, Polyuria, and Unexplained Weight Loss",
    difficulty: "intermediate",
    patient: {
      name: "Robert M.",
      age: 52,
      gender: "Male",
      occupation: "Software Engineer",
      chiefComplaint: "Extreme fatigue, waking up 4 times a night to urinate, and persistent thirst for 3 months.",
      vitals: {
        bloodPressure: "138/86 mmHg",
        heartRate: "78 bpm",
        respiratoryRate: "16 breaths/min",
        temperature: "36.8 °C",
        oxygenSaturation: "98% on room air"
      }
    },
    medicalHistory: [
      "Body Mass Index (BMI): 31.4 kg/m² (Class I Obesity)",
      "Essential Hypertension diagnosed 4 years ago (on Lisinopril 10mg daily)",
      "Family History: Father had Type 2 Diabetes and died of Myocardial Infarction at age 62",
      "Sedentary lifestyle; diet high in refined carbohydrates"
    ],
    symptomPresentation:
      "Patient reports gradual onset of severe lethargy, constant dry mouth requiring 3-4 liters of water daily, and unintentional 6 kg weight loss over the past 12 weeks. He notes occasional tingling sensations in both big toes.",
    physicalExamination: [
      "General: Alert, mildly overweight male in no acute distress.",
      "HEENT: Mild mucosal dryness; no acanthosis nigricans on neck.",
      "Cardiovascular: Regular rate and rhythm, normal S1/S2, no murmurs or peripheral edema.",
      "Neurological: Decreased monofilament sensation (10g) on bilateral plantar halluces; preserved deep tendon reflexes."
    ],
    diagnosticResults: {
      labs: [
        { testName: "Fasting Blood Glucose", category: "Blood", normalRange: "70 - 99 mg/dL", diseaseValue: "186 mg/dL", clinicalSignificance: "Significantly elevated fasting hyperglycemia." },
        { testName: "HbA1c", category: "Blood", normalRange: "< 5.7%", diseaseValue: "9.2%", clinicalSignificance: "Diagnostic of overt Type 2 Diabetes Mellitus." },
        { testName: "Lipid Panel (Triglycerides)", category: "Blood", normalRange: "< 150 mg/dL", diseaseValue: "245 mg/dL", clinicalSignificance: "Diabetic dyslipidemia with hypertriglyceridemia." },
        { testName: "Urine Albumin-to-Creatinine Ratio", category: "Urine", normalRange: "< 30 mg/g", diseaseValue: "58 mg/g", clinicalSignificance: "Microalbuminuria indicating early stage 1 diabetic nephropathy." }
      ],
      imaging: [
        { modality: "Ultrasound", findings: "Diffuse increase in hepatic parenchymal echogenicity consistent with Grade 1 fatty liver.", keyFeature: "Hepatic steatosis." }
      ]
    },
    differentialDiagnoses: [
      "Type 2 Diabetes Mellitus",
      "Type 1 Diabetes Mellitus (Late Onset / LADA)",
      "Diabetes Insipidus",
      "Cushing's Syndrome"
    ],
    confirmedDiagnosis: "Type 2 Diabetes Mellitus with Early Diabetic Neuropathy & Microalbuminuria",
    treatmentPlan: [
      "Initiate Metformin 500mg twice daily with meals (titrate to 1000mg BID).",
      "Add Empagliflozin (SGLT2 Inhibitor) 10mg daily for renal & cardiovascular protection.",
      "Referral to Certified Diabetes Care & Education Specialist (CDCES) for medical nutrition therapy.",
      "Target weight loss goal of 7-10% (approx. 7 kg) over 6 months with 150 min/week structured walking.",
      "Continuous Glucose Monitor (CGM) sensor placement for 14-day glycemic profiling."
    ],
    patientOutcome:
      "At 3-month follow-up, patient achieved an HbA1c drop from 9.2% to 7.1%, lost 5.2 kg of weight, and reported total resolution of nocturia and toe paresthesias.",
    reflectionQuestions: [
      {
        id: "q1",
        question: "What is the primary pathophysiological mechanism explaining Robert's polyuria and polydipsia?",
        options: [
          "Deficiency of antidiuretic hormone (ADH) secretion from posterior pituitary",
          "Glycosuria causing osmotic diuresis when blood glucose exceeds renal threshold (~180 mg/dL)",
          "Direct bacterial irritation of the urinary bladder mucosal lining",
          "Impaired renal sodium absorption in the ascending Loop of Henle"
        ],
        correctAnswerIndex: 1,
        explanation: "When blood glucose exceeds ~180 mg/dL, renal proximal tubules cannot reabsorb all filtered glucose. Unabsorbed glucose acts as an osmotic diuretic, drawing water into the urine (polyuria) and causing intracellular dehydration that triggers thirst (polydipsia)."
      },
      {
        id: "q2",
        question: "Why is an SGLT2 inhibitor (Empagliflozin) specifically indicated in this patient alongside Metformin?",
        options: [
          "It stimulates pancreatic beta cells to secrete insulin",
          "It provides proven renal protection against diabetic nephropathy and reduces cardiovascular mortality",
          "It cures peripheral diabetic neuropathy",
          "It replaces exogenous insulin injections"
        ],
        correctAnswerIndex: 1,
        explanation: "SGLT2 inhibitors like Empagliflozin block renal glucose reabsorption in the proximal convoluted tubule and have demonstrated powerful landmark clinical trial benefits in delaying diabetic kidney disease progression (reducing microalbuminuria) and reducing cardiovascular events."
      }
    ]
  },

  {
    id: "case-htn-01",
    diseaseId: "hypertension",
    title: "64-Year-Old Female with Asymptomatic High Blood Pressure at Routine Checkup",
    difficulty: "beginner",
    patient: {
      name: "Martha S.",
      age: 64,
      gender: "Female",
      occupation: "Retired School Teacher",
      chiefComplaint: "No physical complaints; presented for routine annual Medicare wellness exam.",
      vitals: {
        bloodPressure: "154/94 mmHg (repeated: 152/92 mmHg)",
        heartRate: "72 bpm",
        respiratoryRate: "14 breaths/min",
        temperature: "36.6 °C",
        oxygenSaturation: "99% on room air"
      }
    },
    medicalHistory: [
      "No prior formal diagnosis of hypertension",
      "High sodium dietary habits (frequent processed soups and frozen meals)",
      "BMI: 28.2 kg/m² (Overweight)",
      "Mother suffered stroke at age 71"
    ],
    symptomPresentation:
      "Patient reports feeling entirely well with no headaches, visual disturbances, chest pressure, or shortness of breath. She was surprised by the elevated blood pressure reading.",
    physicalExamination: [
      "General: Well-nourished female in no distress.",
      "Fundoscopic Exam: Mild arteriolar narrowing; no AV nicking or papilledema.",
      "Cardiovascular: S1/S2 present, prominent S4 gallop at apex, no carotid bruits.",
      "Extremities: No peripheral pedal edema."
    ],
    diagnosticResults: {
      labs: [
        { testName: "Serum Creatinine", category: "Blood", normalRange: "0.6 - 1.1 mg/dL", diseaseValue: "1.1 mg/dL", clinicalSignificance: "Preserved baseline renal function." },
        { testName: "Serum Potassium", category: "Blood", normalRange: "3.5 - 5.0 mEq/L", diseaseValue: "4.2 mEq/L", clinicalSignificance: "Normal potassium baseline." },
        { testName: "Fasting Lipid Panel (LDL)", category: "Blood", normalRange: "< 100 mg/dL", diseaseValue: "142 mg/dL", clinicalSignificance: "Co-existing moderate hypercholesterolemia." }
      ],
      imaging: [
        { modality: "Echocardiogram", findings: "Mild concentric left ventricular hypertrophy; ejection fraction 62%.", keyFeature: "Concentric LVH." }
      ]
    },
    differentialDiagnoses: [
      "Essential (Primary) Stage 2 Hypertension",
      "White Coat Hypertension",
      "Renovascular Hypertension (Renal Artery Stenosis)",
      "Primary Aldosteronism"
    ],
    confirmedDiagnosis: "Essential Stage 2 Hypertension with Mild Left Ventricular Hypertrophy",
    treatmentPlan: [
      "Initiate Lisinopril 10mg daily (ACE Inhibitor) + Amlodipine 5mg daily (CCB) dual therapy.",
      "Implement DASH diet (Dietary Approaches to Stop Hypertension) restricting sodium to < 1,500 mg/day.",
      "Order home 24-hour blood pressure monitor to log morning and evening readings.",
      "Re-evaluate blood pressure and serum renal panel/electrolytes in 4 weeks."
    ],
    patientOutcome:
      "At 1-month follow-up, home BP log averaged 124/78 mmHg. Repeat serum creatinine was stable at 1.05 mg/dL. Left ventricular strain resolved at 1-year follow-up echocardiogram.",
    reflectionQuestions: [
      {
        id: "q1",
        question: "Why is Hypertension frequently described as the 'Silent Killer'?",
        options: [
          "It only causes symptoms while the patient is sleeping",
          "It remains completely asymptomatic for years while insidiously damaging target organs like heart, brain, and kidneys",
          "It destroys the vocal cords and speech centers",
          "It cannot be detected by standard blood pressure cuffs"
        ],
        correctAnswerIndex: 1,
        explanation: "Essential hypertension typically produces zero symptoms until advanced target organ damage (stroke, heart failure, renal failure) occurs, earning it the name 'Silent Killer'."
      }
    ]
  },

  {
    id: "case-covid-01",
    diseaseId: "covid-19",
    title: "58-Year-Old Diabetic Male with Severe Hypoxia and Bilateral Infiltrates",
    difficulty: "advanced",
    patient: {
      name: "David K.",
      age: 58,
      gender: "Male",
      occupation: "Transit Operator",
      chiefComplaint: "Severe shortness of breath, high fever, and dry cough for 7 days.",
      vitals: {
        bloodPressure: "118/74 mmHg",
        heartRate: "112 bpm",
        respiratoryRate: "32 breaths/min",
        temperature: "39.2 °C",
        oxygenSaturation: "86% on room air (improves to 93% on 6L nasal cannula)"
      }
    },
    medicalHistory: [
      "Type 2 Diabetes Mellitus for 10 years (HbA1c 8.4%)",
      "Unvaccinated against COVID-19 for current season",
      "BMI: 34.1 kg/m²"
    ],
    symptomPresentation:
      "Patient developed fever, myalgias, and dry cough 7 days ago. Symptoms rapidly deteriorated over the last 48 hours with profound dyspnea walking to the bathroom.",
    physicalExamination: [
      "General: Tachypneic male using accessory intercostal muscles.",
      "Lungs: Bilateral fine inspiratory crackles throughout both lung bases.",
      "Cardiovascular: Tachycardic, regular rhythm, normal heart sounds."
    ],
    diagnosticResults: {
      labs: [
        { testName: "SARS-CoV-2 RT-PCR", category: "Genetic", normalRange: "Negative", diseaseValue: "Positive (Ct 18.4)", clinicalSignificance: "High viral load COVID-19 infection." },
        { testName: "D-Dimer", category: "Blood", normalRange: "< 0.50 µg/mL", diseaseValue: "3.85 µg/mL", clinicalSignificance: "Severe hypercoagulability and immunothrombosis risk." },
        { testName: "C-Reactive Protein (CRP)", category: "Biochemical", normalRange: "< 5.0 mg/L", diseaseValue: "148 mg/L", clinicalSignificance: "Marked hyperinflammatory surge / Cytokine release." }
      ],
      imaging: [
        { modality: "CT Scan", findings: "Bilateral extensive peripheral and subpleural ground-glass opacities with dense lower lobe consolidation.", keyFeature: "Severe COVID-19 Pneumonia." }
      ]
    },
    differentialDiagnoses: [
      "Severe COVID-19 Pneumonia with Acute Hypoxemic Respiratory Failure",
      "Bacterial Community-Acquired Pneumonia (Streptococcus pneumoniae)",
      "Acute Pulmonary Embolism",
      "Acute Heart Failure Exacerbation"
    ],
    confirmedDiagnosis: "Severe COVID-19 Pneumonia with ARDS and Cytokine Release Syndrome",
    treatmentPlan: [
      "Admit to Intensive Care Unit (ICU) / Stepdown unit.",
      "Initiate Dexamethasone 6mg IV daily + IV Remdesivir for 5 days.",
      "Administer Tocilizumab (Anti-IL-6 receptor antibody) 8 mg/kg IV single dose due to CRP > 75 and rising oxygen requirement.",
      "Initiate High-Flow Nasal Cannula (HFNC) at 50 L/min with FiO2 60% and protocolized awake prone positioning.",
      "Enoxaparin therapeutic anticoagulation for high D-dimer thrombosis prevention."
    ],
    patientOutcome:
      "With awake proning, Tocilizumab, and Dexamethasone, oxygen requirements decreased over 6 days avoiding endotracheal intubation. Patient was discharged on room air on hospital day 11.",
    reflectionQuestions: [
      {
        id: "q1",
        question: "Why is Tocilizumab (Anti-IL-6 Receptor monoclonal antibody) effective in severe hyperinflammatory COVID-19?",
        options: [
          "It directly kills the SARS-CoV-2 virus particle",
          "It selectively blocks Interleukin-6 signaling, arresting the hyperinflammatory cytokine storm driving lung injury",
          "It dissolves blood clots in pulmonary capillaries",
          "It stimulates surfactant production in Type II pneumocytes"
        ],
        correctAnswerIndex: 1,
        explanation: "In severe COVID-19, mortality is largely driven by a host hyperinflammatory response ('cytokine storm') mediated by IL-6. Tocilizumab blocks the IL-6 receptor, halting progressive diffuse alveolar damage."
      }
    ]
  }
];
