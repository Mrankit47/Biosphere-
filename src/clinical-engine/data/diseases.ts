// ═══════════════════════════════════════════════════════════════
// Biosphere — Clinical Learning Engine Pathology Database
// ═══════════════════════════════════════════════════════════════

import type { DiseaseObject } from "../types";

export const CLINICAL_DISEASES: Record<string, DiseaseObject> = {
  diabetes: {
    id: "diabetes",
    name: "Diabetes Mellitus",
    icdCode: "E11.9",
    scientificName: "Diabetes Mellitus Type 2 & Type 1",
    category: "endocrine",
    subcategory: "Metabolic Disorders",
    icon: "🩸",
    accentColor: "#EF4444",
    difficulty: "intermediate",
    estimatedStudyTimeMinutes: 12,

    overview:
      "A chronic metabolic disease characterized by elevated levels of blood glucose, leading over time to serious damage to the heart, blood vessels, eyes, kidneys, and nerves.",
    definition:
      "Hyperglycemia resulting from defects in insulin secretion, insulin action, or both, disrupting carbohydrate, fat, and protein metabolism.",
    classification: [
      "Type 1 Diabetes Mellitus (Autoimmune beta-cell destruction)",
      "Type 2 Diabetes Mellitus (Progressive insulin secretory defect & insulin resistance)",
      "Gestational Diabetes Mellitus (Onset during pregnancy)",
      "Maturity-Onset Diabetes of the Young (MODY - Genetic mutation)"
    ],
    causes: [
      "Pancreatic beta-cell autoimmune destruction (Type 1)",
      "Peripheral insulin resistance combined with inadequate pancreatic insulin secretion (Type 2)",
      "Genetic susceptibility & GLUT4 receptor signaling impairment"
    ],
    riskFactors: [
      "Obesity and high body mass index (BMI > 25)",
      "Sedentary lifestyle and physical inactivity",
      "Family history of type 2 diabetes",
      "Hypertension and dyslipidemia",
      "Polycystic ovary syndrome (PCOS)"
    ],
    pathophysiology:
      "Insulin resistance in skeletal muscle, liver, and adipose tissue decreases glucose uptake. In response, pancreatic beta cells hypersecrete insulin until exhaustion occurs. Hyperglycemia damages endothelial cell walls through advanced glycation end-products (AGEs) and oxidative stress.",

    affectedOrgans: ["pancreas", "kidneys", "eyes", "heart", "brain", "nerves"],
    affectedSystems: ["Endocrine", "Cardiovascular", "Renal", "Nervous"],

    symptoms: [
      { name: "Polyuria (Frequent Urination)", severity: "moderate", frequency: "Common", description: "Osmotic diuresis caused by glucose filtering into urine", organSystem: "Renal" },
      { name: "Polydipsia (Excessive Thirst)", severity: "moderate", frequency: "Common", description: "Dehydration triggered by intracellular fluid loss", organSystem: "Endocrine" },
      { name: "Polyphagia (Excessive Hunger)", severity: "mild", frequency: "Common", description: "Cellular starvation despite hyper-glycemic serum levels", organSystem: "Metabolic" },
      { name: "Unexplained Weight Loss", severity: "severe", frequency: "Occasional", description: "Catabolism of muscle tissue and triglycerides for ATP synthesis", organSystem: "Metabolic" },
      { name: "Peripheral Neuropathy", severity: "severe", frequency: "Common", description: "Nerve fiber paresthesia and numbness due to microvascular ischemia", organSystem: "Nervous" },
      { name: "Diabetic Retinopathy", severity: "critical", frequency: "Occasional", description: "Retinal microvascular leakage and neovascularization leading to vision impairment", organSystem: "Ocular" }
    ],

    clinicalTimeline: [
      {
        id: "healthy",
        title: "Normal Homeostasis",
        subtitle: "Normoglycemic State",
        duration: "Baseline",
        cellularChanges: ["Normal GLUT4 translocation", "Intact pancreatic beta-cell insulin pulse"],
        tissueDamageDescription: "Unimpaired vascular endothelium and normal glomerular filtration.",
        symptomSeverity: "mild",
        clinicalSigns: ["Fasting blood glucose < 100 mg/dL", "HbA1c < 5.7%"],
        biomarkers: ["Normal fasting C-peptide", "Normal serum insulin"],
        interventionPoints: ["Routine health screening", "Balanced nutrition & exercise"],
        damagePercentage: 0
      },
      {
        id: "early",
        title: "Insulin Resistance & Prediabetes",
        subtitle: "Subclinical Metabolic Shift",
        duration: "2 - 5 Years",
        cellularChanges: ["Impaired insulin receptor substrate (IRS-1) signaling", "Compensatory beta-cell hypertrophy"],
        tissueDamageDescription: "Subtle endothelial dysfunction and mild hepatic steatosis.",
        symptomSeverity: "mild",
        clinicalSigns: ["Fasting glucose 100-125 mg/dL", "HbA1c 5.7% - 6.4%"],
        biomarkers: ["Elevated fasting insulin", "Elevated HOMA-IR score"],
        interventionPoints: ["Intensive lifestyle modification", "Metformin therapy initiation"],
        damagePercentage: 15
      },
      {
        id: "progression",
        title: "Overt Type 2 Diabetes Onset",
        subtitle: "Pancreatic Beta-Cell Decompensation",
        duration: "1 - 3 Years",
        cellularChanges: ["Beta-cell apoptosis and amyloid polypeptide deposition", "Impaired hepatic glucose suppression"],
        tissueDamageDescription: "Microvascular basement membrane thickening.",
        symptomSeverity: "moderate",
        clinicalSigns: ["Fasting glucose ≥ 126 mg/dL", "HbA1c ≥ 6.5%", "Classic triad: Polyuria, Polydipsia, Polyphagia"],
        biomarkers: ["Glycosuria", "Reduced C-peptide clearance"],
        interventionPoints: ["Dual oral hypoglycemic agents", "Continuous glucose monitoring (CGM)"],
        damagePercentage: 40
      },
      {
        id: "advanced",
        title: "Micro & Macrovascular Complications",
        subtitle: "Organ System Pathology",
        duration: "5 - 10+ Years",
        cellularChanges: ["Pericyte loss in retinal capillaries", "Glomerular podocyte effacement"],
        tissueDamageDescription: "Diabetic nephropathy (Kimmelstiel-Wilson nodules), peripheral arterial disease.",
        symptomSeverity: "severe",
        clinicalSigns: ["Microalbuminuria", "Peripheral sensory loss", "Coronary artery disease"],
        biomarkers: ["eGFR drop < 60 mL/min", "Urine albumin-to-creatinine ratio > 300 mg/g"],
        interventionPoints: ["Exogenous insulin regimen", "ACE inhibitors for nephroprotection", "Statin lipid control"],
        damagePercentage: 75
      },
      {
        id: "recovery",
        title: "Glycemic Control & Remission",
        subtitle: "Metabolic Stabilization",
        duration: "Ongoing",
        cellularChanges: ["Partial restoration of insulin sensitivity", "Reduced oxidative mitochondrial stress"],
        tissueDamageDescription: "Halted microvascular damage progression.",
        symptomSeverity: "mild",
        clinicalSigns: ["HbA1c maintained < 6.5% for > 3 months without pharmacotherapy (Remission)"],
        biomarkers: ["Normalized lipid profile", "Controlled urine albumin"],
        interventionPoints: ["Strict glycemic monitoring", "Caloric restriction / bariatric surgery"],
        damagePercentage: 35
      },
      {
        id: "long-term",
        title: "End-Stage Organ Pathology",
        subtitle: "Chronic Sequelae",
        duration: "Lifelong",
        cellularChanges: ["Irreversible glomerulosclerosis", "Widespread arterial calcification"],
        tissueDamageDescription: "End-stage renal disease (ESRD), diabetic foot ulceration / amputation, stroke.",
        symptomSeverity: "critical",
        clinicalSigns: ["Renal failure requiring dialysis", "Charcot neuroarthropathy"],
        biomarkers: ["Serum creatinine > 3.0 mg/dL", "Severe proteinuria"],
        interventionPoints: ["Renal replacement therapy", "Revascularization / amputation management"],
        damagePercentage: 95
      }
    ],

    diagnosisOverview:
      "Diagnosis is confirmed through laboratory measurements of fasting plasma glucose, oral glucose tolerance test (OGTT), or glycated hemoglobin (HbA1c).",
    labTests: [
      { testName: "HbA1c (Glycated Hemoglobin)", category: "Blood", normalRange: "< 5.7%", diseaseValue: "≥ 6.5%", clinicalSignificance: "Measures average blood sugar control over the past 2-3 months." },
      { testName: "Fasting Plasma Glucose (FPG)", category: "Blood", normalRange: "70 - 99 mg/dL", diseaseValue: "≥ 126 mg/dL", clinicalSignificance: "Evaluates basal hepatic glucose production after 8h fast." },
      { testName: "Oral Glucose Tolerance Test (2h OGTT)", category: "Blood", normalRange: "< 140 mg/dL", diseaseValue: "≥ 200 mg/dL", clinicalSignificance: "Assesses postprandial glucose clearance dynamic." },
      { testName: "Urine Microalbumin", category: "Urine", normalRange: "< 30 mg/24h", diseaseValue: "> 300 mg/24h", clinicalSignificance: "Early indicator of diabetic nephropathy and glomerular damage." }
    ],
    imagingFindings: [
      { modality: "Ultrasound", findings: "Diffuse increase in hepatic echogenicity.", keyFeature: "Non-alcoholic fatty liver disease (NAFLD)." },
      { modality: "MRI", findings: "Subcortical ischemic microvascular white matter lesions.", keyFeature: "Cerebral microangiopathy." }
    ],
    diagnosticCriteria: [
      "Fasting plasma glucose ≥ 126 mg/dL (7.0 mmol/L) on two separate occasions.",
      "HbA1c ≥ 6.5% (48 mmol/mol) measured in a certified laboratory.",
      "2-hour plasma glucose ≥ 200 mg/dL (11.1 mmol/L) during 75g OGTT.",
      "Random plasma glucose ≥ 200 mg/dL with classic hyperglycemic symptoms."
    ],

    treatment: {
      primaryGoal: "Achieve glycemic control (HbA1c < 7.0%) to prevent microvascular and macrovascular complications.",
      medications: [
        { name: "Metformin", class: "Biguanide", mechanismOfAction: "Decreases hepatic gluconeogenesis and increases peripheral insulin sensitivity.", commonDosage: "500mg - 2000mg daily", sideEffects: ["Gastrointestinal upset", "Lactic acidosis (rare)", "Vitamin B12 deficiency"], contraindications: ["Severe renal impairment (eGFR < 30)"] },
        { name: "Empagliflozin", class: "SGLT2 Inhibitor", mechanismOfAction: "Blocks renal glucose reabsorption in proximal convoluted tubule.", commonDosage: "10mg - 25mg daily", sideEffects: ["Mycotic genital infections", "Volume depletion", "Euglycemic DKA"], contraindications: ["Dialysis / ESRD"] },
        { name: "Insulin Glargine", class: "Long-acting Insulin Analog", mechanismOfAction: "Binds insulin receptor to regulate basal glucose uptake.", commonDosage: "Individualized sub-Q injection daily", sideEffects: ["Hypoglycemia", "Weight gain", "Injection site lipodystrophy"], contraindications: ["Acute hypoglycemia"] }
      ],
      surgicalOptions: ["Bariatric surgery (Roux-en-Y gastric bypass for refractory T2D obesity)", "Pancreatic islet cell transplantation (Type 1)"],
      lifestyleManagement: ["Low-glycemic index mediterranean dietary pattern", "150 minutes/week moderate aerobic exercise", "Weight loss goal of 7-10% body mass"],
      monitoringProtocol: "Continuous Glucose Monitoring (CGM) or self-monitoring blood glucose (SMBG) 3-4 times daily; HbA1c every 3 months."
    },
    complications: [
      "Diabetic Ketoacidosis (DKA) & Hyperosmolar Hyperglycemic State (HHS)",
      "Diabetic Nephropathy & End-Stage Renal Disease",
      "Diabetic Retinopathy & Blindness",
      "Diabetic Peripheral Neuropathy & Foot Ulceration",
      "Coronary Artery Disease & Myocardial Infarction"
    ],
    prevention: [
      "Screening adults over 35 or with elevated BMI",
      "Intensive lifestyle modification program (DPP protocol)",
      "Daily physical activity and reduction of refined sugar intake"
    ],
    prognosis: "With optimal glycemic control, lifestyle intervention, and cardiovascular risk reduction, life expectancy approaches normal parameters.",

    organDamageHighlights: [
      { organName: "Pancreas", damageType: "Beta-Cell Exhaustion & Amyloidosis", description: "Fibrosis and insulin secretion failure.", pathologyColor: "#EF4444" },
      { organName: "Kidney", damageType: "Glomerulosclerosis & Nodular Lesions", description: "Kimmelstiel-Wilson lesions causing proteinuria.", pathologyColor: "#F59E0B" },
      { organName: "Eye Retina", damageType: "Microaneurysms & Neovascularization", description: "Capillary breakdown leading to retinal hemorrhages.", pathologyColor: "#10B981" }
    ],

    recentResearch: [
      { title: "GLP-1 Receptor Agonists and Cardiovascular Outcomes in Type 2 Diabetes", summary: "Multi-center clinical trial demonstrating 14% reduction in major adverse cardiovascular events (MACE).", journal: "New England Journal of Medicine", year: "2024" },
      { title: "Closed-Loop Automated Insulin Delivery in Type 1 Diabetes", summary: "Evaluation of AI-driven closed-loop artificial pancreas systems achieving 82% time-in-range.", journal: "The Lancet Diabetes & Endocrinology", year: "2025" }
    ],
    references: [
      "American Diabetes Association (ADA) Standards of Care in Diabetes (2025).",
      "Harrison's Principles of Internal Medicine, 21st Edition, Chapter 396: Diabetes Mellitus."
    ],

    relatedAnatomyIds: ["pancreas", "kidneys", "heart", "brain"],
    relatedCellIds: ["beta-cell", "endothelial-cell", "podocyte"],
    relatedGeneIds: ["INS", "TCF7L2", "KCNJ11"],
    relatedSimulationUrls: ["/process-simulations"],
    relatedVirtualLabUrls: ["/virtual-lab"],
    relatedQuizIds: ["quiz-diabetes-1"],
    relatedResearchIds: ["res-diabetes-1"],
    relatedScientistNames: ["Frederick Banting", "Charles Best", "Frederick Sanger"]
  },

  hypertension: {
    id: "hypertension",
    name: "Essential Hypertension",
    icdCode: "I10",
    scientificName: "Systemic Arterial Hypertension",
    category: "cardiovascular",
    subcategory: "Vascular Pathology",
    icon: "🫀",
    accentColor: "#3B82F6",
    difficulty: "beginner",
    estimatedStudyTimeMinutes: 10,

    overview:
      "A silent cardiovascular condition marked by persistently elevated arterial blood pressure, increasing systemic vascular resistance and cardiac workload.",
    definition:
      "Systolic blood pressure ≥ 130 mmHg or diastolic blood pressure ≥ 80 mmHg measured on two or more clinical encounters.",
    classification: [
      "Normal BP: < 120 / < 80 mmHg",
      "Elevated BP: 120-129 / < 80 mmHg",
      "Stage 1 Hypertension: 130-139 / 80-89 mmHg",
      "Stage 2 Hypertension: ≥ 140 / ≥ 90 mmHg",
      "Hypertensive Crisis: > 180 / > 120 mmHg"
    ],
    causes: [
      "Essential / Primary (90-95% of cases): Idiopathic polygenic & environmental interplay",
      "Secondary (5-10%): Renal artery stenosis, Cushing's syndrome, pheochromocytoma, coarctation of aorta"
    ],
    riskFactors: [
      "High dietary sodium intake (> 2,300 mg/day)",
      "Chronic stress and elevated sympathetic tone",
      "Tobacco use and excessive alcohol consumption",
      "Age > 65 and male gender",
      "Obesity and insulin resistance"
    ],
    pathophysiology:
      "Increased vascular smooth muscle tone elevates total peripheral resistance (TPR). Renin-angiotensin-aldosterone system (RAAS) overactivation leads to renal sodium and water retention, driving left ventricular hypertrophy and arteriolosclerosis.",

    affectedOrgans: ["heart", "brain", "kidneys", "eyes"],
    affectedSystems: ["Cardiovascular", "Renal", "Nervous"],

    symptoms: [
      { name: "Asymptomatic ('Silent Killer')", severity: "mild", frequency: "Common", description: "No symptoms present until end-organ pathology develops", organSystem: "Cardiovascular" },
      { name: "Occipital Morning Headache", severity: "moderate", frequency: "Occasional", description: "Elevated intracranial arterial pressure during morning peak", organSystem: "Nervous" },
      { name: "Epistaxis (Nosebleeds)", severity: "moderate", frequency: "Rare", description: "Rupture of fragile nasal septal capillaries under high pressure", organSystem: "Vascular" },
      { name: "Exertional Dyspnea", severity: "severe", frequency: "Occasional", description: "Elevated left ventricular end-diastolic pressure transmitting to pulmonary veins", organSystem: "Respiratory" }
    ],

    clinicalTimeline: [
      {
        id: "healthy",
        title: "Normal Blood Pressure",
        subtitle: "Physiological Vascular Tone",
        duration: "Baseline",
        cellularChanges: ["Normal endothelial nitric oxide (NO) production", "Elastic vascular arterial extracellular matrix"],
        tissueDamageDescription: "Healthy arteriolar lumen and normal cardiac muscle thickness.",
        symptomSeverity: "mild",
        clinicalSigns: ["BP < 120/80 mmHg"],
        biomarkers: ["Normal plasma renin activity", "Normal serum aldosterone"],
        interventionPoints: ["Low-sodium diet", "Regular physical activity"],
        damagePercentage: 0
      },
      {
        id: "early",
        title: "Elevated BP / Stage 1 HTN",
        subtitle: "Early Vascular Stiffness",
        duration: "1 - 4 Years",
        cellularChanges: ["Decreased endothelial NO bioavailability", "Mild smooth muscle cell hypertrophy"],
        tissueDamageDescription: "Subtle arterial wall stiffening.",
        symptomSeverity: "mild",
        clinicalSigns: ["BP 130-139 / 80-89 mmHg"],
        biomarkers: ["Borderline high serum uric acid"],
        interventionPoints: ["DASH diet implementation", "First-line monotherapy if ASCVD risk > 10%"],
        damagePercentage: 20
      },
      {
        id: "progression",
        title: "Stage 2 Hypertension",
        subtitle: "Established Resistance",
        duration: "3 - 7 Years",
        cellularChanges: ["Hyaline arteriolosclerosis", "Concentric left ventricular cardiomyocyte hypertrophy"],
        tissueDamageDescription: "Increased carotid intima-media thickness.",
        symptomSeverity: "moderate",
        clinicalSigns: ["BP ≥ 140/90 mmHg", "S4 gallop heart sound"],
        biomarkers: ["Microalbuminuria", "Elevated serum creatinine"],
        interventionPoints: ["Combination antihypertensive therapy (CCB + ACEi/ARB)"],
        damagePercentage: 50
      },
      {
        id: "advanced",
        title: "Hypertensive Target Organ Damage",
        subtitle: "End-Organ Pathology",
        duration: "5 - 12+ Years",
        cellularChanges: ["Hyperplastic arteriolosclerosis (onion-skinning)", "Myocyte fibrosis"],
        tissueDamageDescription: "Left ventricular failure, hypertensive nephrosclerosis, lacunar brain infarcts.",
        symptomSeverity: "severe",
        clinicalSigns: ["LVH on ECG", "Hypertensive retinopathy (Grade III/IV)"],
        biomarkers: ["Elevated BNP", "Proteinuria"],
        interventionPoints: ["Triple-drug pharmacotherapy", "Strict BP target < 130/80 mmHg"],
        damagePercentage: 80
      },
      {
        id: "recovery",
        title: "Controlled Hypertensive State",
        subtitle: "Therapeutic BP Stabilization",
        duration: "Ongoing",
        cellularChanges: ["Regression of left ventricular hypertrophy", "Restored vascular endothelial compliance"],
        tissueDamageDescription: "Stabilized renal filtration rate.",
        symptomSeverity: "mild",
        clinicalSigns: ["BP sustained < 130/80 mmHg"],
        biomarkers: ["Normalized spot urine protein"],
        interventionPoints: ["Medication adherence monitoring", "Home BP log review"],
        damagePercentage: 30
      },
      {
        id: "long-term",
        title: "Hypertensive Crisis & Sequelae",
        subtitle: "Emergency Vascular Breakdown",
        duration: "Acute / Lifelong",
        cellularChanges: ["Fibrinoid necrosis of arterioles", "Acute ischemic tissue damage"],
        tissueDamageDescription: "Aortic dissection, acute intracranial hemorrhage, hypertensive encephalopathy.",
        symptomSeverity: "critical",
        clinicalSigns: ["BP > 180/120 mmHg with acute papilledema or chest pain"],
        biomarkers: ["Troponin elevation", "Acute serum creatinine spike"],
        interventionPoints: ["IV nicardipine / labetalol in ICU setting"],
        damagePercentage: 95
      }
    ],

    diagnosisOverview:
      "Diagnosis relies on repeated, standardized resting blood pressure measurements, 24-hour ambulatory blood pressure monitoring (ABPM), and screening for target organ damage.",
    labTests: [
      { testName: "Serum Creatinine & eGFR", category: "Blood", normalRange: "0.7 - 1.3 mg/dL", diseaseValue: "> 1.5 mg/dL", clinicalSignificance: "Screens for hypertensive nephrosclerosis." },
      { testName: "Serum Electrolytes (Na+, K+)", category: "Blood", normalRange: "K+: 3.5 - 5.0 mEq/L", diseaseValue: "< 3.5 mEq/L", clinicalSignificance: "Evaluates secondary cause (hyperaldosteronism)." }
    ],
    imagingFindings: [
      { modality: "Echocardiogram", findings: "Concentric left ventricular hypertrophy with diastolic dysfunction.", keyFeature: "LV Wall Thickness > 1.1 cm." },
      { modality: "Chest X-Ray", findings: "Cardiomegaly and aortic knuckle calcification.", keyFeature: "Increased Cardiothoracic Ratio (> 0.5)." }
    ],
    diagnosticCriteria: [
      "In-office SBP ≥ 130 mmHg or DBP ≥ 80 mmHg on ≥ 2 visits.",
      "Out-of-office 24-hour ABPM average ≥ 125/75 mmHg."
    ],

    treatment: {
      primaryGoal: "Reduce BP to < 130/80 mmHg to reduce risk of stroke, myocardial infarction, and renal failure.",
      medications: [
        { name: "Lisinopril", class: "ACE Inhibitor", mechanismOfAction: "Inhibits Angiotensin Converting Enzyme, suppressing Angiotensin II and aldosterone.", commonDosage: "10mg - 40mg daily", sideEffects: ["Dry cough", "Hyperkalemia", "Angioedema"], contraindications: ["Pregnancy", "Bilateral renal artery stenosis"] },
        { name: "Amlodipine", class: "Dihydropyridine Calcium Channel Blocker", mechanismOfAction: "Blocks L-type calcium channels, dilating vascular smooth muscle.", commonDosage: "5mg - 10mg daily", sideEffects: ["Peripheral edema", "Flushing", "Dizziness"], contraindications: ["Severe hypotension"] },
        { name: "Hydrochlorothiazide", class: "Thiazide Diuretic", mechanismOfAction: "Inhibits Na+/Cl- cotransporter in distal convoluted tubule.", commonDosage: "12.5mg - 25mg daily", sideEffects: ["Hypokalemia", "Hyperuricemia", "Hyperglycemia"], contraindications: ["Anuria", "Sulfa allergy"] }
      ],
      surgicalOptions: ["Renal denervation (catheter ablation of renal sympathetic nerves)", "Renal artery stenting for secondary renovascular HTN"],
      lifestyleManagement: ["DASH (Dietary Approaches to Stop Hypertension) diet", "Sodium restriction < 1,500 mg/day", "Weight reduction (1 mmHg BP drop per kg lost)"],
      monitoringProtocol: "Weekly home BP log; 24-hour ambulatory monitoring; annual ECG and renal function check."
    },
    complications: [
      "Left Ventricular Failure & Dilated Cardiomyopathy",
      "Hemorrhagic & Ischemic Stroke",
      "Hypertensive Nephrosclerosis & Renal Failure",
      "Aortic Aneurysm & Dissection",
      "Hypertensive Retinopathy"
    ],
    prevention: [
      "Population-level salt reduction",
      "Regular cardiovascular aerobic exercise",
      "Limiting alcohol intake to ≤ 1 drink/day"
    ],
    prognosis: "Excellent with early pharmacological control and lifestyle compliance; uncontrolled HTN reduces life expectancy by 10-20 years.",

    organDamageHighlights: [
      { organName: "Heart", damageType: "Left Ventricular Hypertrophy", description: "Thickened cardiac septum reducing chamber volume.", pathologyColor: "#3B82F6" },
      { organName: "Brain", damageType: "Lacunar Stroke & Microhemorrhages", description: "Ischemic cell death in penetrating lenticulostriate arteries.", pathologyColor: "#8B5CF6" }
    ],

    recentResearch: [
      { title: "SPRINT Trial 10-Year Follow Up: Intensive BP Control Below 120 mmHg", summary: "Demonstrates 27% all-cause mortality reduction with intensive blood pressure lowering target.", journal: "Circulation", year: "2024" }
    ],
    references: [
      "ACC/AHA Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure (2024 update)."
    ],

    relatedAnatomyIds: ["heart", "kidneys", "brain"],
    relatedCellIds: ["smooth-muscle-cell", "endothelial-cell"],
    relatedGeneIds: ["ACE", "AGT", "REN"],
    relatedSimulationUrls: ["/process-simulations"],
    relatedVirtualLabUrls: ["/virtual-lab"],
    relatedQuizIds: ["quiz-hypertension-1"],
    relatedResearchIds: ["res-htn-1"],
    relatedScientistNames: ["Stephen Hales", "Willem Einthoven"]
  },

  asthma: {
    id: "asthma",
    name: "Bronchial Asthma",
    icdCode: "J45.909",
    scientificName: "Chronic Inflammatory Airway Disease",
    category: "respiratory",
    subcategory: "Obstructive Lung Disease",
    icon: "🫁",
    accentColor: "#F472B6",
    difficulty: "intermediate",
    estimatedStudyTimeMinutes: 10,

    overview:
      "A heterogeneous respiratory disease characterized by chronic airway inflammation, bronchial hyperreactivity, and reversible airway obstruction.",
    definition:
      "Paroxysmal airway narrowing caused by bronchial smooth muscle constriction, mucosal edema, and excessive hyperviscous mucus production.",
    classification: [
      "Allergic / Atopic Asthma (IgE-mediated, Type 2 helper T-cell driven)",
      "Non-Allergic Asthma (Triggered by viral infections, cold air, stress)",
      "Exercise-Induced Bronchoconstriction (EIB)",
      "Occupational Asthma (Chemical dust / workplace allergen exposure)"
    ],
    causes: [
      "Inhaled aeroallergens (dust mites, pollen, pet dander, mold spores)",
      "Respiratory viral infections (Rhinovirus, RSV)",
      "Air pollution, tobacco smoke, and ozone exposure"
    ],
    riskFactors: [
      "Personal or family history of atopy (eczema, allergic rhinitis)",
      "Childhood viral lower respiratory infections",
      "Exposure to environmental secondhand smoke",
      "Obesity and GERD"
    ],
    pathophysiology:
      "Allergen exposure cross-links IgE on mast cells, triggering histamine, leukotriene (LTC4, LTD4), and prostaglandin release. Th2 cytokines (IL-4, IL-5, IL-13) recruit eosinophils, leading to airway remodeling, goblet cell hyperplasia, and smooth muscle hypertrophy.",

    affectedOrgans: ["lungs"],
    affectedSystems: ["Respiratory"],

    symptoms: [
      { name: "Expiratory Wheezing", severity: "moderate", frequency: "Common", description: "High-pitched musical sound during expiration caused by turbulent airflow in narrowed bronchi", organSystem: "Respiratory" },
      { name: "Dyspnea (Shortness of Breath)", severity: "severe", frequency: "Common", description: "Air trapping and pulmonary hyperinflation creating sensation of breathlessness", organSystem: "Respiratory" },
      { name: "Dry / Productive Cough", severity: "mild", frequency: "Common", description: "Nocturnal or early morning cough triggered by bronchial mucosal irritation", organSystem: "Respiratory" },
      { name: "Chest Tightness", severity: "moderate", frequency: "Common", description: "Constrictive sensation in chest wall from intercostal muscle strain and bronchospasm", organSystem: "Respiratory" }
    ],

    clinicalTimeline: [
      {
        id: "healthy",
        title: "Normal Bronchial Tree",
        subtitle: "Patent Airway Architecture",
        duration: "Baseline",
        cellularChanges: ["Normal ciliated columnar epithelium", "Baseline thin mucus layer"],
        tissueDamageDescription: "Wide bronchial lumen without smooth muscle hyperreactivity.",
        symptomSeverity: "mild",
        clinicalSigns: ["FEV1/FVC ratio > 80%"],
        biomarkers: ["Normal blood eosinophil count (< 300 cells/µL)"],
        interventionPoints: ["Avoid allergen exposure"],
        damagePercentage: 0
      },
      {
        id: "early",
        title: "Sensitization & Acute Trigger",
        subtitle: "Early Phase Response",
        duration: "0 - 30 Minutes",
        cellularChanges: ["Mast cell degranulation releasing histamine and LTC4", "Bronchial smooth muscle contraction"],
        tissueDamageDescription: "Acute airway lumen narrowing.",
        symptomSeverity: "moderate",
        clinicalSigns: ["Mild wheezing", "FEV1 drop by 15-20%"],
        biomarkers: ["Elevated serum IgE"],
        interventionPoints: ["Inhaled short-acting beta2-agonist (SABA - Albuterol)"],
        damagePercentage: 25
      },
      {
        id: "progression",
        title: "Late-Phase Inflammatory Cascade",
        subtitle: "Eosinophilic Infiltration",
        duration: "4 - 12 Hours",
        cellularChanges: ["IL-5 driven eosinophil recruitment", "Goblet cell hypersecretion"],
        tissueDamageDescription: "Mucosal edema and thick mucus plugging of small airways.",
        symptomSeverity: "severe",
        clinicalSigns: ["Bilateral expiratory wheezing", "Tachypnea (RR > 24)"],
        biomarkers: ["Elevated Fractional Exhaled Nitric Oxide (FeNO > 50 ppb)"],
        interventionPoints: ["Inhaled Corticosteroid (ICS) + Formoterol maintenance"],
        damagePercentage: 55
      },
      {
        id: "advanced",
        title: "Status Asthmaticus",
        subtitle: "Severe Refractory Exacerbation",
        duration: "Hours - Days",
        cellularChanges: ["Extensive epithelial desquamation", "Severe hypercapnic respiratory failure"],
        tissueDamageDescription: "Complete mucus occlusion of lobar bronchi, alveolar hypoventilation.",
        symptomSeverity: "critical",
        clinicalSigns: ["Silent chest (no air movement)", "Pulsus paradoxus > 12 mmHg", "Use of accessory neck muscles"],
        biomarkers: ["Arterial Blood Gas (ABG): PaCO2 normalization/elevation indicating exhaustion"],
        interventionPoints: ["IV Magnesium Sulfate", "Systemic Corticosteroids", "Mechanical Ventilation"],
        damagePercentage: 90
      },
      {
        id: "recovery",
        title: "Post-Exacerbation Resolution",
        subtitle: "Bronchodilation & Repair",
        duration: "1 - 2 Weeks",
        cellularChanges: ["Epithelial regeneration", "Clearance of airway mucus plugs"],
        tissueDamageDescription: "Gradual restoration of baseline airway diameter.",
        symptomSeverity: "mild",
        clinicalSigns: ["FEV1 returns to within 10% of personal best"],
        biomarkers: ["FeNO reduction"],
        interventionPoints: ["Step-up ICS dosage adjustment", "Asthma Action Plan review"],
        damagePercentage: 20
      },
      {
        id: "long-term",
        title: "Airway Remodeling",
        subtitle: "Fixed Obstructive Pathology",
        duration: "Years",
        cellularChanges: ["Subepithelial basement membrane fibrosis", "Smooth muscle mass hypertrophy 2-3x"],
        tissueDamageDescription: "Irreversible loss of lung elastic recoil and fixed airflow limitation.",
        symptomSeverity: "severe",
        clinicalSigns: ["Persistent dyspnea unresponsive to bronchodilators"],
        biomarkers: ["Irreversible FEV1/FVC < 70%"],
        interventionPoints: ["Biologic therapy (Anti-IL5: Mepolizumab, Anti-IgE: Omalizumab)"],
        damagePercentage: 70
      }
    ],

    diagnosisOverview:
      "Spirometry showing reversible airway obstruction (≥ 12% and 200 mL increase in FEV1 post-bronchodilator) establishes diagnosis.",
    labTests: [
      { testName: "Spirometry (FEV1 & FVC)", category: "Blood", normalRange: "FEV1/FVC > 75-80%", diseaseValue: "FEV1/FVC < 70% (Reversible)", clinicalSignificance: "Gold standard test for obstructive lung physiology." },
      { testName: "FeNO (Fractional Exhaled Nitric Oxide)", category: "Biochemical", normalRange: "< 25 ppb", diseaseValue: "> 50 ppb", clinicalSignificance: "Marker of eosinophilic airway inflammation." }
    ],
    imagingFindings: [
      { modality: "Chest X-Ray", findings: "Bilateral lung hyperinflation, flattened diaphragms, increased retrosternal clear space.", keyFeature: "Pulmonary air trapping." }
    ],
    diagnosticCriteria: [
      "History of variable respiratory symptoms (wheeze, shortness of breath, cough, chest tightness).",
      "Confirmed variable expiratory airflow limitation: FEV1 increase > 12% and > 200 mL after SABA inhalation."
    ],

    treatment: {
      primaryGoal: "Achieve symptom control, maintain normal activity levels, and minimize future exacerbation risk.",
      medications: [
        { name: "Budesonide / Formoterol", class: "ICS / LABA Combination", mechanismOfAction: "Anti-inflammatory corticosteroid combined with rapid, long-acting beta2-agonist.", commonDosage: "1-2 puffs daily & PRN reliever", sideEffects: ["Oral candidiasis (thrush)", "Dysphonia"], contraindications: ["Monotherapy LABA without ICS"] },
        { name: "Albuterol (Salbutamol)", class: "Short-acting Beta2-Agonist (SABA)", mechanismOfAction: "Relaxes bronchial smooth muscle via Gs-protein adenylate cyclase pathway.", commonDosage: "2 puffs every 4-6h PRN", sideEffects: ["Tremor", "Tachycardia", "Hypokalemia"], contraindications: ["Hypersensitivity"] },
        { name: "Montelukast", class: "Leukotriene Receptor Antagonist (LTRA)", mechanismOfAction: "Blocks CysLT1 receptor, inhibiting leukotriene-mediated bronchoconstriction.", commonDosage: "10mg daily at bedtime", sideEffects: ["Neuropsychiatric events (mood changes)", "Headache"], contraindications: ["Severe hepatic impairment"] }
      ],
      surgicalOptions: ["Bronchial Thermoplasty (Thermal radiofrequency ablation of airway smooth muscle)"],
      lifestyleManagement: ["HEPA air filtration & dust mite mattress covers", "Pre-exercise warm-up & prophylactic SABA", "Annual influenza and pneumococcal vaccination"],
      monitoringProtocol: "Peak Expiratory Flow (PEF) meter tracking; Asthma Control Test (ACT) score every 3 months."
    },
    complications: [
      "Status Asthmaticus & Severe Acute Hypoxemia",
      "Pneumothorax & Pneumomediastinum",
      "Fixed Airway Remodeling",
      "Respiratory Arrest & Cardiac Failure"
    ],
    prevention: [
      "Identification and complete avoidance of allergen triggers",
      "Adherence to daily anti-inflammatory controller inhaler",
      "Early management of viral upper respiratory tract infections"
    ],
    prognosis: "Excellent with modern ICS-based MART (Maintenance and Reliever Therapy); most patients live active, symptom-free lives.",

    organDamageHighlights: [
      { organName: "Lungs", damageType: "Airway Remodeling & Mucus Plugging", description: "Thickened basement membrane and lumen occlusion.", pathologyColor: "#F472B6" }
    ],

    recentResearch: [
      { title: "Dupilumab (Anti-IL4Rα) in Biologic-Refractory Severe Eosinophilic Asthma", summary: "Demonstrates 56% reduction in annualized severe exacerbations.", journal: "Lancet Respiratory Medicine", year: "2024" }
    ],
    references: [
      "Global Initiative for Asthma (GINA) Global Strategy for Asthma Management and Prevention (2025 Report)."
    ],

    relatedAnatomyIds: ["lungs"],
    relatedCellIds: ["mast-cell", "eosinophil", "goblet-cell"],
    relatedGeneIds: ["IL4", "IL13", "ADAM33"],
    relatedSimulationUrls: ["/process-simulations"],
    relatedVirtualLabUrls: ["/virtual-lab"],
    relatedQuizIds: ["quiz-asthma-1"],
    relatedResearchIds: ["res-asthma-1"],
    relatedScientistNames: ["Maimonides", "Paul Ehrlich"]
  },

  tuberculosis: {
    id: "tuberculosis",
    name: "Pulmonary Tuberculosis",
    icdCode: "A15.0",
    scientificName: "Mycobacterium tuberculosis Infection",
    category: "infectious",
    subcategory: "Bacterial Pathogen",
    icon: "🦠",
    accentColor: "#EAB308",
    difficulty: "advanced",
    estimatedStudyTimeMinutes: 15,

    overview:
      "A contagious airborne infectious disease caused by Mycobacterium tuberculosis, primarily affecting the lungs and forming necrotizing granulomas.",
    definition:
      "Intracellular bacterial infection triggering cell-mediated Ghon complex formation and caseous necrosis.",
    classification: [
      "Latent TB Infection (LTBI - Asymptomatic, non-contagious)",
      "Active Pulmonary TB (Contagious, symptomatic lung parenchyma destruction)",
      "Extrapulmonary TB (Miliary, Meningitis, Pott's disease of spine, Lymphadenitis)",
      "Multidrug-Resistant TB (MDR-TB - Resistant to Isoniazid & Rifampin)"
    ],
    causes: [
      "Inhalation of airborne droplet nuclei containing Mycobacterium tuberculosis (acid-fast bacillus)"
    ],
    riskFactors: [
      "Immunosuppression (HIV/AIDS co-infection - 18x higher risk)",
      "Living in crowded, poorly ventilated environments",
      "Malnutrition and chronic alcoholism",
      "Silicosis and chronic renal failure"
    ],
    pathophysiology:
      "Inhaled bacilli are phagocytosed by alveolar macrophages. Bacterial cord factor inhibits phagolysosome fusion. CD4+ T-cells release IFN-gamma, activating macrophages into epithelioid cells and Langhans giant cells to form caseous granulomas (Ghon focus).",

    affectedOrgans: ["lungs", "brain", "skeleton", "kidneys"],
    affectedSystems: ["Respiratory", "Immunology", "Nervous", "Renal"],

    symptoms: [
      { name: "Persistent Productive Cough (> 2-3 Weeks)", severity: "moderate", frequency: "Common", description: "Cough progressing from dry to mucoid or purulent sputum", organSystem: "Respiratory" },
      { name: "Hemoptysis (Coughing Blood)", severity: "critical", frequency: "Occasional", description: "Erosion of cavity wall blood vessels (Rasmussen aneurysm rupture)", organSystem: "Respiratory" },
      { name: "Night Sweats & Drenching Fever", severity: "moderate", frequency: "Common", description: "Diurnal TNF-alpha and cytokine surge causing nocturnal diaphoresis", organSystem: "Systemic" },
      { name: "Unintentional Weight Loss ('Consumption')", severity: "severe", frequency: "Common", description: "Severe cachexia driven by chronic systemic inflammatory cytokines", organSystem: "Metabolic" }
    ],

    clinicalTimeline: [
      {
        id: "healthy",
        title: "Uninfected Host",
        subtitle: "Intact Respiratory Mucosa",
        duration: "Baseline",
        cellularChanges: ["Normal alveolar macrophage surveillance"],
        tissueDamageDescription: "Clear lung parenchyma without granulomatous inflammation.",
        symptomSeverity: "mild",
        clinicalSigns: ["TST / T-SPOT negative"],
        biomarkers: ["Normal ESR and CRP"],
        interventionPoints: ["BCG Vaccination in endemic areas"],
        damagePercentage: 0
      },
      {
        id: "early",
        title: "Primary Infection & Ghon Focus",
        subtitle: "Phagolysosome Evasion",
        duration: "2 - 8 Weeks",
        cellularChanges: ["Intracellular bacterial replication within alveolar macrophages"],
        tissueDamageDescription: "Formation of Ghon focus in subpleural mid/lower lung zone.",
        symptomSeverity: "mild",
        clinicalSigns: ["Conversion to TST positive", "Mild flu-like illness"],
        biomarkers: ["Positive IGRA (QuantiFERON-TB Gold)"],
        interventionPoints: ["Screening high-risk contacts"],
        damagePercentage: 15
      },
      {
        id: "progression",
        title: "Latent TB vs Active Progression",
        subtitle: "Granuloma Encapsulation",
        duration: "Months - Years",
        cellularChanges: ["Caseous necrosis at center of epithelioid granuloma"],
        tissueDamageDescription: "Ghon complex (Ghon focus + hilar lymph node calcification).",
        symptomSeverity: "moderate",
        clinicalSigns: ["Latent: Asymptomatic", "Active: Low-grade evening fever, persistent cough"],
        biomarkers: ["Elevated ESR > 50 mm/h"],
        interventionPoints: ["Latent TB treatment (Rifampin for 4 months)"],
        damagePercentage: 35
      },
      {
        id: "advanced",
        title: "Cavitary Pulmonary TB",
        subtitle: "Parenchymal Liquefaction",
        duration: "6 - 12 Months",
        cellularChanges: ["Liquefactive rupture of caseous core into bronchial tree"],
        tissueDamageDescription: "Large apical lung cavities, destruction of parenchymal architecture.",
        symptomSeverity: "severe",
        clinicalSigns: ["Productive purulent cough, hemoptysis, severe wasting"],
        biomarkers: ["Sputum Acid-Fast Bacilli (AFB) smear positive (3+)"],
        interventionPoints: ["Standard RIPE therapy (Rifampin, Isoniazid, Pyrazinamide, Ethambutol)"],
        damagePercentage: 75
      },
      {
        id: "recovery",
        title: "Microbiological Cure",
        subtitle: "Bacterial Clearance",
        duration: "6 Months Therapy",
        cellularChanges: ["Sterilization of active bacilli", "Fibrotic scarring of necrotic zones"],
        tissueDamageDescription: "Apical fibronodular scars and volume loss.",
        symptomSeverity: "mild",
        clinicalSigns: ["Sputum culture conversion to negative at 2 months"],
        biomarkers: ["Negative AFB smear & GeneXpert"],
        interventionPoints: ["Directly Observed Therapy (DOTS) compliance tracking"],
        damagePercentage: 30
      },
      {
        id: "long-term",
        title: "Miliary & Extrapulmonary Dissemination",
        subtitle: "Hematogenous Spread",
        duration: "Chronic",
        cellularChanges: ["Hematogenous seeding across microvasculature"],
        tissueDamageDescription: "Millet-seed nodular lesions across liver, spleen, meninges, and vertebral bodies (Pott's disease).",
        symptomSeverity: "critical",
        clinicalSigns: ["TB Meningitis (stiff neck, confusion), paraplegia, renal failure"],
        biomarkers: ["CSF lymphocytic pleocytosis, high protein, low glucose"],
        interventionPoints: ["Extended 9-12 month regimen + adjunctive Dexamethasone"],
        damagePercentage: 90
      }
    ],

    diagnosisOverview:
      "Confirmed via sputum acid-fast staining, GeneXpert MTB/RIF nucleic acid amplification, and mycobacterial culture.",
    labTests: [
      { testName: "GeneXpert MTB/RIF Assay", category: "Genetic", normalRange: "Negative", diseaseValue: "MTB Detected (Rifampin resistance status)", clinicalSignificance: "Rapid automated PCR result within 2 hours." },
      { testName: "Sputum AFB Smear (Ziehl-Neelsen)", category: "Biochemical", normalRange: "No AFB seen", diseaseValue: "Acid-Fast Bacilli positive", clinicalSignificance: "Evaluates immediate patient contagiousness." },
      { testName: "Interferon-Gamma Release Assay (IGRA)", category: "Immunological", normalRange: "Negative", diseaseValue: "Positive", clinicalSignificance: "Measures T-cell memory response to M. tuberculosis antigens." }
    ],
    imagingFindings: [
      { modality: "Chest X-Ray", findings: "Apical/subapical infiltrates with cavitary lesions and hilar lymphadenopathy.", keyFeature: "Apical Cavitation." },
      { modality: "CT Scan", findings: "Tree-in-bud sign indicating endobronchial spread of infection.", keyFeature: "Tree-in-bud opacities." }
    ],
    diagnosticCriteria: [
      "Positive sputum culture for M. tuberculosis (Gold Standard).",
      "Positive GeneXpert PCR assay with compatible clinical & radiological findings."
    ],

    treatment: {
      primaryGoal: "Eradicate M. tuberculosis bacilli, prevent transmission, and prevent emergence of drug resistance.",
      medications: [
        { name: "Rifampin (RIF)", class: "Rifamycin Antibiotic", mechanismOfAction: "Inhibits bacterial DNA-dependent RNA polymerase.", commonDosage: "10mg/kg daily (max 600mg)", sideEffects: ["Orange discoloration of bodily fluids", "Hepatotoxicity", "CYP450 induction"], contraindications: ["Severe liver disease"] },
        { name: "Isoniazid (INH)", class: "Mycolic Acid Synthesis Inhibitor", mechanismOfAction: "Inhibits InhA enzyme in mycolic acid cell wall synthesis.", commonDosage: "5mg/kg daily (max 300mg)", sideEffects: ["Peripheral neuropathy (prevent with B6/Pyridoxine)", "Hepatotoxicity"], contraindications: ["Acute liver failure"] },
        { name: "Pyrazinamide (PZA)", class: "Sterilizing Antimycobacterial", mechanismOfAction: "Disrupts bacterial membrane energetics at acidic pH.", commonDosage: "15-30mg/kg daily", sideEffects: ["Hyperuricemia / Gout", "Hepatotoxicity"], contraindications: ["Severe gout"] },
        { name: "Ethambutol (EMB)", class: "Arabinosyl Transferase Inhibitor", mechanismOfAction: "Inhibits arabinogalactan cell wall synthesis.", commonDosage: "15-25mg/kg daily", sideEffects: ["Optic neuritis (red-green color blindness)"], contraindications: ["Optic neuritis"] }
      ],
      surgicalOptions: ["Pulmonary lobectomy / resection for localized drug-resistant cavitary lesions"],
      lifestyleManagement: ["Negative-pressure isolation during initial contagious phase (2-3 weeks)", "High-protein nutritional supplementation", "N95 respirator use by healthcare personnel"],
      monitoringProtocol: "Monthly sputum AFB smear and culture until two consecutive monthly cultures are negative; baseline liver function tests (LFTs)."
    },
    complications: [
      "Massive Hemoptysis (Rasmussen Aneurysm Rupture)",
      "Miliary Tuberculosis & Tuberculous Meningitis",
      "Pott's Disease (Spinal Tuberculosis & Cord Compression)",
      "Bronchiectasis & Fibrothorax",
      "Multidrug Resistance (MDR-TB & XDR-TB)"
    ],
    prevention: [
      "BCG (Bacille Calmette-Guérin) vaccine administration at birth in endemic areas",
      "Airborne isolation precautions in clinical facilities",
      "Preventive treatment for latent TB infection (LTBI)"
    ],
    prognosis: "Cure rate > 95% with adherent 6-month first-line RIPE therapy; MDR-TB carries higher mortality (20-30%).",

    organDamageHighlights: [
      { organName: "Lungs", damageType: "Caseous Cavitary Necrosis", description: "Liquefied lung tissue forming hollow cavities.", pathologyColor: "#EAB308" }
    ],

    recentResearch: [
      { title: "BPaLM Regimen (Bedaquiline, Pretomanid, Linezolid, Moxifloxacin) for MDR-TB", summary: "Shortens multidrug-resistant TB treatment from 18 months to 6 months with 89% cure rate.", journal: "New England Journal of Medicine", year: "2024" }
    ],
    references: [
      "WHO Consolidated Guidelines on Tuberculosis (2025 Module 4: Treatment)."
    ],

    relatedAnatomyIds: ["lungs", "brain", "skeleton"],
    relatedCellIds: ["macrophage", "t-cell"],
    relatedGeneIds: ["rpoB", "katG", "inhA"],
    relatedSimulationUrls: ["/process-simulations"],
    relatedVirtualLabUrls: ["/virtual-lab"],
    relatedQuizIds: ["quiz-tb-1"],
    relatedResearchIds: ["res-tb-1"],
    relatedScientistNames: ["Robert Koch", "Albert Calmette", "Camille Guérin"]
  },

  malaria: {
    id: "malaria",
    name: "Malaria",
    icdCode: "B50.9",
    scientificName: "Plasmodium falciparum Parasitemia",
    category: "infectious",
    subcategory: "Protozoan Vector-Borne Disease",
    icon: "🦟",
    accentColor: "#10B981",
    difficulty: "intermediate",
    estimatedStudyTimeMinutes: 12,

    overview:
      "A life-threatening mosquito-borne infectious disease caused by Plasmodium parasites, characterized by febrile paroxysms, anemia, and microvascular sequestration.",
    definition:
      "Intraerythrocytic protozoan infection transmitted by female Anopheles mosquitoes causing cyclic red blood cell lysis.",
    classification: [
      "Plasmodium falciparum (Most severe, causes cerebral malaria & high mortality)",
      "Plasmodium vivax (Hypnozoite dormant liver stage causing relapses)",
      "Plasmodium ovale (Dormant liver hypnozoites)",
      "Plasmodium malariae (72h quartan fever cycle)",
      "Plasmodium knowlesi (Zoonotic simian malaria)"
    ],
    causes: [
      "Bite of an infected female Anopheles mosquito injecting Plasmodium sporozoites"
    ],
    riskFactors: [
      "Travel to or residence in tropical sub-Saharan Africa, South Asia, or Amazon region",
      "Lack of immunity (young children < 5 years, pregnant women, travelers)",
      "Absence of bed net protection or vector control"
    ],
    pathophysiology:
      "Injected sporozoites invade hepatocytes (exoerythrocytic cycle). Merozoites emerge to infect red blood cells (erythrocytic cycle). PfEMP1 surface proteins on P. falciparum infected RBCs bind ICAM-1 and CD36, causing cytoadherence, rosetting, and microvascular occlusion in the brain and placenta.",

    affectedOrgans: ["liver", "spleen", "brain", "kidneys"],
    affectedSystems: ["Hematology", "Immunology", "Neurological", "Renal"],

    symptoms: [
      { name: "Paroxysmal High Fever & Chills", severity: "severe", frequency: "Common", description: "Cyclic fever spikes occurring every 48 hours corresponding to synchronized RBC rupture", organSystem: "Systemic" },
      { name: "Profuse Diaphoresis (Sweating)", severity: "moderate", frequency: "Common", description: "Defervescence phase following severe febrile paroxysm", organSystem: "Systemic" },
      { name: "Severe Hemolytic Anemia & Jaundice", severity: "severe", frequency: "Common", description: "Massive intraerythrocytic destruction releasing unconjugated bilirubin", organSystem: "Hematology" },
      { name: "Splenomegaly", severity: "moderate", frequency: "Common", description: "Enlargement of spleen from macrophage clearance of parasitized red blood cells", organSystem: "Lymphatic" }
    ],

    clinicalTimeline: [
      {
        id: "healthy",
        title: "Uninfected Host",
        subtitle: "Normal Parasite-Free Serum",
        duration: "Baseline",
        cellularChanges: ["Normal erythrocyte membrane elasticity"],
        tissueDamageDescription: "Unobstructed microvascular blood flow.",
        symptomSeverity: "mild",
        clinicalSigns: ["Normal body temperature (37°C)"],
        biomarkers: ["Normal hemoglobin & hematocrit"],
        interventionPoints: ["Insecticide-treated bed nets (ITNs)", "Chemoprophylaxis"],
        damagePercentage: 0
      },
      {
        id: "early",
        title: "Exoerythrocytic Hepatic Stage",
        subtitle: "Asymptomatic Incubation",
        duration: "7 - 14 Days",
        cellularChanges: ["Sporozoite invasion of hepatocytes", "Schizont maturation"],
        tissueDamageDescription: "Asymptomatic hepatic schizogony.",
        symptomSeverity: "mild",
        clinicalSigns: ["No overt clinical symptoms"],
        biomarkers: ["PCR positive for Plasmodium DNA"],
        interventionPoints: ["Early diagnostic RDT testing"],
        damagePercentage: 10
      },
      {
        id: "progression",
        title: "Erythrocytic Cycle & Paroxysms",
        subtitle: "Synchronized RBC Lysis",
        duration: "2 - 5 Days",
        cellularChanges: ["Trophozoite ring-form growth in RBCs", "Hemozoin pigment accumulation"],
        tissueDamageDescription: "Systemic cytokine release (TNF-alpha, IL-1).",
        symptomSeverity: "moderate",
        clinicalSigns: ["Cold stage (rigors) → Hot stage (fever 40°C) → Sweating stage"],
        biomarkers: ["Thick & thin blood smear positive for ring forms", "Rapid Diagnostic Test (RDT) PfHRP2 positive"],
        interventionPoints: ["Artemisinin-based Combination Therapy (ACT - Artemether/Lumefantrine)"],
        damagePercentage: 45
      },
      {
        id: "advanced",
        title: "Severe Falciparum Malaria",
        subtitle: "Microvascular Sequestration",
        duration: "1 - 3 Days",
        cellularChanges: ["PfEMP1 cytoadherence to cerebral vascular endothelium", "Severe metabolic acidosis"],
        tissueDamageDescription: "Cerebral edema, petechial hemorrhages, renal tubular necrosis (Blackwater fever).",
        symptomSeverity: "critical",
        clinicalSigns: ["Cerebral malaria (coma, seizures)", "Kussmaul breathing", "Hemoglobinuria"],
        biomarkers: ["Severe anemia (Hb < 5 g/dL)", "Parasitemia > 10%", "Lactate > 5 mmol/L"],
        interventionPoints: ["IV Artesunate immediately", "Blood transfusion", "Hemodialysis"],
        damagePercentage: 85
      },
      {
        id: "recovery",
        title: "Parasite Clearance & Hematologic Recovery",
        subtitle: "Convalescence Phase",
        duration: "2 - 4 Weeks",
        cellularChanges: ["Reticulocytosis and red cell regeneration"],
        tissueDamageDescription: "Resolution of cerebral microvascular congestion.",
        symptomSeverity: "mild",
        clinicalSigns: ["Resolution of fever", "Clearance of asexual blood-stage parasites"],
        biomarkers: ["Negative blood smear at 48 hours post-treatment"],
        interventionPoints: ["Primaquine for P. vivax liver hypnozoite radical cure (G6PD screen required)"],
        damagePercentage: 20
      },
      {
        id: "long-term",
        title: "Post-Malaria Complications",
        subtitle: "Chronic Remnants",
        duration: "Months",
        cellularChanges: ["Persistent reticuloendothelial pigment clearance"],
        tissueDamageDescription: "Hyper-reactive malarial splenomegaly syndrome (HMS).",
        symptomSeverity: "moderate",
        clinicalSigns: ["Massive splenomegaly, elevated IgM"],
        biomarkers: ["High anti-malarial antibody titers"],
        interventionPoints: ["Long-term antimalarial prophylaxis"],
        damagePercentage: 35
      }
    ],

    diagnosisOverview:
      "Diagnosed by microscopic examination of Giemsa-stained thick and thin blood films or Rapid Diagnostic Tests (RDTs) detecting PfHRP2 antigen.",
    labTests: [
      { testName: "Thin & Thick Blood Smear Microscopy", category: "Blood", normalRange: "No parasites seen", diseaseValue: "Plasmodium ring forms & gametocytes present", clinicalSignificance: "Gold standard for species identification and parasitemia quantification." },
      { testName: "Malaria Rapid Diagnostic Test (RDT)", category: "Immunological", normalRange: "Negative", diseaseValue: "Positive (PfHRP2 / pLDH)", clinicalSignificance: "Point-of-care antigen test." },
      { testName: "G6PD Activity Screen", category: "Biochemical", normalRange: "> 7.0 U/g Hb", diseaseValue: "< 30% normal activity", clinicalSignificance: "Required before administering Primaquine/Tafenoquine to prevent hemolysis." }
    ],
    imagingFindings: [
      { modality: "Ultrasound", findings: "Hepatosplenomegaly with homogeneous hypoechoic parenchyma.", keyFeature: "Splenomegaly." }
    ],
    diagnosticCriteria: [
      "Demonstration of asexual Plasmodium forms on blood film OR positive RDT in a febrile patient."
    ],

    treatment: {
      primaryGoal: "Rapidly eliminate asexual blood-stage parasites to prevent severe malaria progression and death.",
      medications: [
        { name: "Artemether / Lumefantrine", class: "Artemisinin-based Combination Therapy (ACT)", mechanismOfAction: "Artemether generates endoperoxide free radicals; Lumefantrine inhibits hemozoin polymerization.", commonDosage: "4-tablet regimen over 3 days", sideEffects: ["Headache", "Dizziness", "Anorexia"], contraindications: ["First trimester pregnancy (relative)"] },
        { name: "IV Artesunate", class: "Parenteral Artemisinin Derivative", mechanismOfAction: "Rapid cleavage of endoperoxide bridge causing alkylation of malarial proteins.", commonDosage: "2.4 mg/kg IV at 0h, 12h, 24h, then daily", sideEffects: ["Post-artesunate delayed hemolysis"], contraindications: ["Hypersensitivity"] },
        { name: "Primaquine", class: "8-Aminoquinoline", mechanismOfAction: "Eliminates dormant liver hypnozoites of P. vivax / P. ovale.", commonDosage: "0.25-0.5 mg/kg daily for 14 days", sideEffects: ["Severe intravascular hemolysis in G6PD deficiency"], contraindications: ["G6PD deficiency", "Pregnancy"] }
      ],
      surgicalOptions: ["Splenectomy (Rare - reserved for traumatic splenic rupture)"],
      lifestyleManagement: ["Use of indoor residual spraying (IRS)", "Insect repellent containing 20-30% DEET"],
      monitoringProtocol: "Repeat blood smear microscopy at 24, 48, and 72 hours post-treatment until parasite clearance."
    },
    complications: [
      "Cerebral Malaria & Permanent Neurological Deficits",
      "Severe Malarial Anemia (Hb < 5 g/dL)",
      "Acute Respiratory Distress Syndrome (ARDS)",
      "Blackwater Fever (Massive Intravascular Hemolysis & Acute Kidney Injury)",
      "Hypoglycemia & Lactic Acidosis"
    ],
    prevention: [
      "RTS,S/AS01 & R21/Matrix-M Malaria Vaccines for children in endemic regions",
      "Seasonal Malaria Chemoprevention (SMC)",
      "Chemoprophylaxis for travelers (Atovaquone-Proguanil or Doxycycline)"
    ],
    prognosis: "Uncomplicated malaria has > 99% cure rate with prompt ACT; severe cerebral malaria carries 15-20% mortality despite IV artesunate.",

    organDamageHighlights: [
      { organName: "Brain", damageType: "Cerebral Microvascular Sequestration", description: "Intraerythrocytic cytoadherence blocking microcapillaries.", pathologyColor: "#10B981" },
      { organName: "Spleen", damageType: "Massive Congestive Splenomegaly", description: "Reticuloendothelial hyperactivation clearing parasitized RBCs.", pathologyColor: "#059669" }
    ],

    recentResearch: [
      { title: "R21/Matrix-M Malaria Vaccine Phase 3 Efficacy Trial", summary: "Demonstrates 75% efficacy in reducing clinical malaria episodes in African young children.", journal: "The Lancet", year: "2024" }
    ],
    references: [
      "WHO Guidelines for Malaria (2025 Update)."
    ],

    relatedAnatomyIds: ["liver", "spleen", "brain"],
    relatedCellIds: ["erythrocyte", "hepatocyte"],
    relatedGeneIds: ["HBB", "G6PD", "PfEMP1"],
    relatedSimulationUrls: ["/process-simulations"],
    relatedVirtualLabUrls: ["/virtual-lab"],
    relatedQuizIds: ["quiz-malaria-1"],
    relatedResearchIds: ["res-malaria-1"],
    relatedScientistNames: ["Ronald Ross", "Alphonse Laveran", "Tu Youyou"]
  },

  "covid-19": {
    id: "covid-19",
    name: "COVID-19",
    icdCode: "U07.1",
    scientificName: "Severe Acute Respiratory Syndrome Coronavirus 2",
    category: "virology" as any,
    subcategory: "Coronaviral Respiratory Disease",
    icon: "☣️",
    accentColor: "#8B5CF6",
    difficulty: "intermediate",
    estimatedStudyTimeMinutes: 12,

    overview:
      "A multisystem viral pandemic illness caused by SARS-CoV-2, ranging from mild upper respiratory catarrh to fatal acute respiratory distress syndrome (ARDS) and thromboembolism.",
    definition:
      "Enveloped positive-sense single-stranded RNA viral infection targeting ACE2-expressing respiratory and vascular endothelial cells.",
    classification: [
      "Asymptomatic / Mild COVID-19 (Upper respiratory tract infection without hypoxia)",
      "Moderate COVID-19 (Pneumonia without severe desaturation, SpO2 ≥ 94%)",
      "Severe COVID-19 (Pneumonia with respiratory frequency > 30, SpO2 < 94%)",
      "Critical COVID-19 (ARDS, Septic Shock, Multisystem Organ Dysfunction)",
      "Post-Acute Sequelae of COVID-19 (PASC / Long COVID)"
    ],
    causes: [
      "Infection by SARS-CoV-2 virus binding ACE2 receptor via Spike (S) protein glycoprotein"
    ],
    riskFactors: [
      "Advanced age (> 65 years)",
      "Pre-existing comorbidities (Obesity, Diabetes, COPD, Hypertension)",
      "Immunocompromised status and organ transplantation"
    ],
    pathophysiology:
      "Spike protein binds ACE2 and is cleaved by TMPRSS2. Viral replication in Type II pneumocytes triggers diffuse alveolar damage, loss of surfactant, and massive IL-6/IL-1beta cytokine release ('Cytokine Storm'). Endothelial injury induces immunothrombosis.",

    affectedOrgans: ["lungs", "heart", "brain", "kidneys"],
    affectedSystems: ["Respiratory", "Cardiovascular", "Immunology", "Nervous"],

    symptoms: [
      { name: "Fever & Dry Cough", severity: "moderate", frequency: "Common", description: "Systemic pyrexia and non-productive viral cough", organSystem: "Respiratory" },
      { name: "Anosmia & Ageusia (Loss of Smell & Taste)", severity: "mild", frequency: "Occasional", description: "Infection of olfactory sustentacular cells in nasal mucosa", organSystem: "Nervous" },
      { name: "Progressive Dyspnea & Hypoxia", severity: "critical", frequency: "Common", description: "Alveolar membrane thickening causing ventilation-perfusion mismatch", organSystem: "Respiratory" },
      { name: "Fatigue & Brain Fog (Long COVID)", severity: "moderate", frequency: "Occasional", description: "Neuroinflammation and microvascular neuro-thrombosis", organSystem: "Nervous" }
    ],

    clinicalTimeline: [
      {
        id: "healthy",
        title: "Uninfected Host",
        subtitle: "Intact ACE2 Epithelium",
        duration: "Baseline",
        cellularChanges: ["Normal ACE2 receptor surface density"],
        tissueDamageDescription: "Healthy pulmonary alveolar membrane.",
        symptomSeverity: "mild",
        clinicalSigns: ["SpO2 98-99%"],
        biomarkers: ["Normal D-Dimer, Ferritin, CRP"],
        interventionPoints: ["mRNA / Viral Vector COVID-19 Vaccination"],
        damagePercentage: 0
      },
      {
        id: "early",
        title: "Viral Entry & Nasopharyngeal Phase",
        subtitle: "Incubation & Early Replication",
        duration: "2 - 5 Days",
        cellularChanges: ["TMPRSS2 priming of Spike protein", "Viral replication in nasal epithelial cells"],
        tissueDamageDescription: "Localized upper respiratory inflammation.",
        symptomSeverity: "mild",
        clinicalSigns: ["Anosmia, low-grade fever, sore throat"],
        biomarkers: ["RT-PCR positive for SARS-CoV-2 N/ORF1ab genes"],
        interventionPoints: ["Oral Nirmatrelvir/Ritonavir (Paxlovid) within 5 days"],
        damagePercentage: 15
      },
      {
        id: "progression",
        title: "Pulmonary Phase & Pneumonia",
        subtitle: "Alveolar Cytokine Cascade",
        duration: "5 - 10 Days",
        cellularChanges: ["Type II pneumocyte apoptosis", "Inflammatory macrophage activation"],
        tissueDamageDescription: "Bilateral ground-glass opacities, alveolar edema.",
        symptomSeverity: "moderate",
        clinicalSigns: ["SpO2 90-94%, exertional dyspnea, tachypnea"],
        biomarkers: ["Elevated CRP > 50 mg/L, Ferritin > 500 ng/mL"],
        interventionPoints: ["Supplemental oxygen", "Remdesivir + Dexamethasone 6mg daily"],
        damagePercentage: 50
      },
      {
        id: "advanced",
        title: "Hyperinflammatory ARDS & Thrombosis",
        subtitle: "Cytokine Storm Phase",
        duration: "10 - 21 Days",
        cellularChanges: ["Endothelial immunothrombosis", "Hyaline membrane formation"],
        tissueDamageDescription: "Diffuse Alveolar Damage (DAD), pulmonary arterial microthrombi.",
        symptomSeverity: "critical",
        clinicalSigns: ["SpO2 < 88%, PaO2/FiO2 ratio < 200, severe ARDS"],
        biomarkers: ["D-Dimer > 2.0 µg/mL, IL-6 > 100 pg/mL"],
        interventionPoints: ["High-flow nasal cannula / Mechanical ventilation", "Tocilizumab (Anti-IL6R)", "Therapeutic Anticoagulation"],
        damagePercentage: 85
      },
      {
        id: "recovery",
        title: "Convalescence & Resolution",
        subtitle: "Viral Clearance",
        duration: "3 - 6 Weeks",
        cellularChanges: ["Alveolar re-epithelialization by Type II pneumocytes"],
        tissueDamageDescription: "Resolution of pulmonary infiltrates.",
        symptomSeverity: "mild",
        clinicalSigns: ["Normalizing SpO2 on room air"],
        biomarkers: ["Declining Inflammatory markers"],
        interventionPoints: ["Pulmonary rehabilitation", "Gradual physical reconditioning"],
        damagePercentage: 25
      },
      {
        id: "long-term",
        title: "Post-Acute Sequelae (Long COVID)",
        subtitle: "Chronic Autoimmunity & Dysautonomia",
        duration: "Months - Years",
        cellularChanges: ["Persistent viral antigen reservoirs", "Microvascular endothelial dysfunction"],
        tissueDamageDescription: "Post-covid pulmonary fibrosis, POTS dysautonomia.",
        symptomSeverity: "moderate",
        clinicalSigns: ["Post-exertional malaise (PEM), cognitive impairment, orthostatic tachycardia"],
        biomarkers: ["Autoantibody presence", "Persistent microclots"],
        interventionPoints: ["Multidisciplinary Long COVID clinic management"],
        damagePercentage: 40
      }
    ],

    diagnosisOverview:
      "Diagnosed via real-time reverse transcription-polymerase chain reaction (RT-PCR) or rapid antigen testing from nasopharyngeal swabs.",
    labTests: [
      { testName: "SARS-CoV-2 RT-PCR", category: "Genetic", normalRange: "Negative", diseaseValue: "Positive (Ct value < 35)", clinicalSignificance: "Gold standard diagnostic test." },
      { testName: "D-Dimer", category: "Blood", normalRange: "< 0.50 µg/mL", diseaseValue: "> 2.0 µg/mL", clinicalSignificance: "Predictor of microvascular thrombosis and pulmonary embolism risk." },
      { testName: "Interleukin-6 (IL-6)", category: "Biochemical", normalRange: "< 7 pg/mL", diseaseValue: "> 80 pg/mL", clinicalSignificance: "Marker of cytokine release syndrome." }
    ],
    imagingFindings: [
      { modality: "CT Scan", findings: "Bilateral peripheral, subpleural ground-glass opacities with consolidation.", keyFeature: "Ground-glass opacities." }
    ],
    diagnosticCriteria: [
      "Positive SARS-CoV-2 molecular RT-PCR or antigen test.",
      "Compatible clinical presentation (fever, cough, dyspnea, anosmia)."
    ],

    treatment: {
      primaryGoal: "Inhibit viral replication in early phase and suppress hyperinflammatory cytokine cascade in severe phase.",
      medications: [
        { name: "Nirmatrelvir / Ritonavir (Paxlovid)", class: "SARS-CoV-2 Main Protease (Mpro) Inhibitor", mechanismOfAction: "Inhibits 3CL protease, halting viral polypeptide cleavage.", commonDosage: "300mg/100mg twice daily for 5 days", sideEffects: ["Dysgeusia (metallic taste)", "Diarrhea", "Drug interactions via CYP3A4"], contraindications: ["Severe renal/hepatic impairment"] },
        { name: "Dexamethasone", class: "Glucocorticoid", mechanismOfAction: "Suppresses pro-inflammatory cytokine transcription in severe COVID-19.", commonDosage: "6mg orally or IV daily for up to 10 days", sideEffects: ["Hyperglycemia", "Secondary infections"], contraindications: ["Mild non-hypoxic disease"] },
        { name: "Remdesivir", class: "Viral RNA-dependent RNA Polymerase Inhibitor", mechanismOfAction: "Causes premature viral RNA chain termination.", commonDosage: "200mg IV day 1, then 100mg IV daily for 5 days", sideEffects: ["Transaminase elevation", "Bradycardia"], contraindications: ["eGFR < 30 mL/min"] }
      ],
      surgicalOptions: ["ECMO (Veno-Venous Extracorporeal Membrane Oxygenation) for refractory respiratory failure"],
      lifestyleManagement: ["Prone positioning (awake proning) for hypoxic patients", "Gradual post-viral activity pacing"],
      monitoringProtocol: "Pulse oximetry monitoring (SpO2 target 92-96%); daily inflammatory marker panel in hospitalized patients."
    },
    complications: [
      "ARDS & Mechanical Ventilation Dependence",
      "Pulmonary Embolism & Deep Vein Thrombosis (DVT)",
      "Acute Myocardial Injury & Myocarditis",
      "Cytokine Release Syndrome & Septic Shock",
      "Long COVID / Post-Acute Sequelae"
    ],
    prevention: [
      "Updated XBB/JN.1 bivalent booster vaccination",
      "High-efficiency particulate air (HEPA) filtration in indoor spaces",
      "Masking with N95/KN95 respirators in high-transmission settings"
    ],
    prognosis: "Overall acute survival > 98.5%; mortality reaches 20-30% in ICU patients requiring invasive mechanical ventilation.",

    organDamageHighlights: [
      { organName: "Lungs", damageType: "Diffuse Alveolar Damage & Microthrombi", description: "Hyaline membrane formation and vascular thrombosis.", pathologyColor: "#8B5CF6" }
    ],

    recentResearch: [
      { title: "Long COVID Pathophysiology: Persistent Spike Protein & Microvascular Clots", summary: "Identifies circulating SARS-CoV-2 S1 protein in long-covid patients 12 months post-infection.", journal: "Nature Medicine", year: "2024" }
    ],
    references: [
      "NIH COVID-19 Treatment Guidelines (2025 Edition)."
    ],

    relatedAnatomyIds: ["lungs", "heart", "brain"],
    relatedCellIds: ["pneumocyte", "endothelial-cell"],
    relatedGeneIds: ["ACE2", "TMPRSS2", "IL6"],
    relatedSimulationUrls: ["/process-simulations"],
    relatedVirtualLabUrls: ["/virtual-lab"],
    relatedQuizIds: ["quiz-covid-1"],
    relatedResearchIds: ["res-covid-1"],
    relatedScientistNames: ["Katalin Karikó", "Drew Weissman"]
  },

  cancer: {
    id: "cancer",
    name: "Malignant Neoplasm (Cancer)",
    icdCode: "C80.1",
    scientificName: "Malignant Cellular Neoplasia",
    category: "oncology",
    subcategory: "Cellular Proliferative Pathology",
    icon: "🎗️",
    accentColor: "#EC4899",
    difficulty: "advanced",
    estimatedStudyTimeMinutes: 15,

    overview:
      "A vast group of diseases characterized by uncontrolled cellular proliferation, evasion of apoptosis, tissue invasion, and distant metastatic spread.",
    definition:
      "Malignant transformation of somatic cells caused by accumulated genetic and epigenetic mutations in oncogenes and tumor suppressor genes.",
    classification: [
      "Carcinoma (Epithelial tissue origin - 85% of cancers)",
      "Sarcoma (Mesenchymal origin - bone, cartilage, fat, muscle)",
      "Leukemia & Lymphoma (Hematopoietic & lymphoid cell malignancies)",
      "Neuroectodermal Tumors (Glioma, Melanoma)"
    ],
    causes: [
      "Carcinogen exposure (tobacco smoke, benzene, asbestos, UV radiation)",
      "Oncogenic viral infection (HPV, Hepatitis B/C, EBV, HTLV-1)",
      "Inherited germline mutations (BRCA1/2, TP53, Lynch syndrome)"
    ],
    riskFactors: [
      "Tobacco use (responsible for 30% of all cancer deaths)",
      "Chronic inflammation and oxidative tissue damage",
      "Radiation exposure (ionizing and ultraviolet)",
      "Advanced age (accumulation of somatic mutations)"
    ],
    pathophysiology:
      "Cancer cells exhibit the 10 Hallmarks of Cancer: sustaining proliferative signaling, evading growth suppressors, resisting cell death, enabling replicative immortality (telomerase reactivation), inducing angiogenesis (VEGF), and activating invasion and metastasis.",

    affectedOrgans: ["lungs", "brain", "liver", "skeleton"],
    affectedSystems: ["Oncology", "Immunology", "Hematology"],

    symptoms: [
      { name: "Unexplained Weight Loss & Anorexia", severity: "severe", frequency: "Common", description: "Tumor necrosis factor-alpha (cachectin) mediated metabolic wasting", organSystem: "Systemic" },
      { name: "Palpable Tumor Mass or Induration", severity: "moderate", frequency: "Common", description: "Uncontrolled localized tissue expansion and stromal reaction", organSystem: "Systemic" },
      { name: "Chronic Fatigue & Anemia", severity: "moderate", frequency: "Common", description: "Bone marrow infiltration or tumor-induced inflammatory anemia", organSystem: "Hematology" },
      { name: "Persistent Pain or Organ Dysfunction", severity: "severe", frequency: "Occasional", description: "Nerve compression or visceral capsule distension by primary/metastatic tumor", organSystem: "Systemic" }
    ],

    clinicalTimeline: [
      {
        id: "healthy",
        title: "Normal Cell Homeostasis",
        subtitle: "Regulated Cell Cycle",
        duration: "Baseline",
        cellularChanges: ["Intact DNA repair mechanisms (BRCA/ATM)", "Functional TP53 tumor suppressor checkpoint"],
        tissueDamageDescription: "Normal tissue architecture and contact inhibition.",
        symptomSeverity: "mild",
        clinicalSigns: ["No neoplastic lesions"],
        biomarkers: ["Normal carcinoembryonic antigen (CEA)"],
        interventionPoints: ["Cancer screening (Mammography, Colonoscopy, Pap smear)"],
        damagePercentage: 0
      },
      {
        id: "early",
        title: "Dysplasia & Carcinoma in Situ",
        subtitle: "Pre-Invasive Stage 0",
        duration: "1 - 5 Years",
        cellularChanges: ["Somatic mutation in oncogenes (KRAS, EGFR)", "Loss of heterozygosity in tumor suppressors"],
        tissueDamageDescription: "Atypical cellular proliferation confined within basement membrane.",
        symptomSeverity: "mild",
        clinicalSigns: ["Asymptomatic or localized mucosal dysplasia"],
        biomarkers: ["Elevated localized tissue markers"],
        interventionPoints: ["Local surgical resection / Endoscopic mucosal resection"],
        damagePercentage: 15
      },
      {
        id: "progression",
        title: "Local Invasive Carcinoma",
        subtitle: "Stage I & II Neoplasm",
        duration: "1 - 3 Years",
        cellularChanges: ["Basement membrane degradation by matrix metalloproteinases (MMPs)", "Tumor angiogenesis (VEGF release)"],
        tissueDamageDescription: "Invasion into surrounding parenchymal stroma and muscularis layer.",
        symptomSeverity: "moderate",
        clinicalSigns: ["Palpable mass, localized bleeding, pain"],
        biomarkers: ["Elevated circulating tumor markers (PSA, CA-125, CEA)"],
        interventionPoints: ["Surgical resection + Adjuvant Chemotherapy / Radiotherapy"],
        damagePercentage: 45
      },
      {
        id: "advanced",
        title: "Regional Nodal & Metastatic Spread",
        subtitle: "Stage III & IV Malignancy",
        duration: "Months - Years",
        cellularChanges: ["Epithelial-to-Mesenchymal Transition (EMT)", "Intravasation into lymphatics and bloodstream"],
        tissueDamageDescription: "Regional lymph node metastases and distant organ lesions (liver, lung, bone, brain).",
        symptomSeverity: "critical",
        clinicalSigns: ["Severe cancer cachexia, pathological fractures, jaundice, neurological deficits"],
        biomarkers: ["High circulating tumor DNA (ctDNA)", "Marked LDH elevation"],
        interventionPoints: ["Systemic Targeted Therapy", "Immune Checkpoint Inhibitors (Anti-PD1/PD-L1)", "Palliative Care"],
        damagePercentage: 85
      },
      {
        id: "recovery",
        title: "Complete Remission",
        subtitle: "No Evidence of Disease (NED)",
        duration: "5+ Years",
        cellularChanges: ["Eradication of clonogenic malignant cells"],
        tissueDamageDescription: "Fibrotic scar tissue at surgical site.",
        symptomSeverity: "mild",
        clinicalSigns: ["Absence of detectable tumor on PET-CT imaging"],
        biomarkers: ["Undetectable liquid biopsy ctDNA"],
        interventionPoints: ["Surveillance scans every 6-12 months"],
        damagePercentage: 20
      },
      {
        id: "long-term",
        title: "Terminal Stage & Refractory Relapse",
        subtitle: "End-Stage Cancer",
        duration: "Terminal",
        cellularChanges: ["Clonal evolution driven by therapy resistance (T790M, ESR1 mutations)"],
        tissueDamageDescription: "Multisystem organ failure, carcinomatous meningitis, intractable malignant ascites.",
        symptomSeverity: "critical",
        clinicalSigns: ["End-stage hepatic/pulmonary failure, severe intractable pain"],
        biomarkers: ["Pancytopenia, severe hypercalcemia of malignancy"],
        interventionPoints: ["Hospice & Palliative Symptom Management"],
        damagePercentage: 98
      }
    ],

    diagnosisOverview:
      "Definitive diagnosis requires histopathological examination of biopsy tissue; staged using the TNM (Tumor, Node, Metastasis) classification system.",
    labTests: [
      { testName: "Tissue Biopsy Histopathology", category: "Biochemical", normalRange: "Normal histology", diseaseValue: "Malignant dysplastic cells with hyperchromatic nuclei", clinicalSignificance: "Gold standard diagnostic test." },
      { testName: "Circulating Tumor DNA (ctDNA Liquid Biopsy)", category: "Genetic", normalRange: "Undetectable", diseaseValue: "Specific driver mutation detected", clinicalSignificance: "Non-invasive tracking of somatic tumor mutations." }
    ],
    imagingFindings: [
      { modality: "PET-CT Scan", findings: "Hypermetabolic 18F-FDG avid nodular masses with high SUVmax values.", keyFeature: "18F-FDG Hypermetabolism." },
      { modality: "MRI", findings: "Ring-enhancing cerebral soft tissue mass with vasogenic edema.", keyFeature: "Brain metastasis." }
    ],
    diagnosticCriteria: [
      "Histological confirmation of malignancy on core needle biopsy or surgical specimen.",
      "Pathological grading (Grade 1-4) and molecular profiling (HER2, EGFR, ALK, PD-L1)."
    ],

    treatment: {
      primaryGoal: "Eradicate malignant clonal cells or achieve durable disease control while maintaining quality of life.",
      medications: [
        { name: "Pembrolizumab", class: "Anti-PD-1 Immune Checkpoint Inhibitor", mechanismOfAction: "Blocks PD-1 on T-cells, restoring anti-tumor cytotoxic T-cell immune response.", commonDosage: "200mg IV every 3 weeks", sideEffects: ["Immune-related adverse events (Colitis, Pneumonitis, Thyroiditis)"], contraindications: ["Severe active autoimmune disease"] },
        { name: "Paclitaxel", class: "Taxane Antimicrotubule Agent", mechanismOfAction: "Stabilizes microtubule polymers, preventing mitotic spindle disassembly and arresting cell cycle.", commonDosage: "175 mg/m² IV every 3 weeks", sideEffects: ["Peripheral neuropathy", "Myelosuppression", "Alopecia"], contraindications: ["Baseline neutrophils < 1,500/mm³"] },
        { name: "Osimertinib", class: "3rd Gen EGFR Tyrosine Kinase Inhibitor", mechanismOfAction: "Selectively inhibits EGFR T790M resistance mutation in non-small cell lung cancer.", commonDosage: "80mg orally daily", sideEffects: ["QT prolongation", "Diarrhea", "Interstitial lung disease"], contraindications: ["Severe QTc prolongation"] }
      ],
      surgicalOptions: ["Curative wide local surgical resection", "Debulking surgery (Cytoreduction)", "Sentinel lymph node dissection"],
      lifestyleManagement: ["Smoking cessation and total alcohol avoidance", "High-protein anti-cachexia nutritional support", "Supervised exercise oncology program"],
      monitoringProtocol: "PET-CT or Contrast CT every 3-6 months; serial tumor marker titers (CEA, CA19-9, PSA)."
    },
    complications: [
      "Metastatic Spread to Brain, Bone, Liver, and Lungs",
      "Superior Vena Cava (SVC) Syndrome",
      "Spinal Cord Compression",
      "Hypercalcemia of Malignancy & Tumor Lysis Syndrome",
      "Severe Cancer Cachexia & Thrombosis"
    ],
    prevention: [
      "HPV vaccination (Gardasil-9) for cervical/head & neck cancer prevention",
      "Hepatitis B vaccination to prevent hepatocellular carcinoma",
      "Routine screening: Colonoscopy (age 45+), Mammography (age 40+), Low-dose CT for smokers"
    ],
    prognosis: "Stage I 5-year survival > 90%; Stage IV metastatic 5-year survival ranges from 10% to 35% depending on molecular targeted therapy options.",

    organDamageHighlights: [
      { organName: "Primary Tissue", damageType: "Invasive Stromal Destruction", description: "Disruption of normal organ architecture and basement membrane.", pathologyColor: "#EC4899" }
    ],

    recentResearch: [
      { title: "CAR-T Cell Therapy in Solid Tumors Using Claudin-18.2 Targeted Constructs", summary: "Demonstrates 48% objective response rate in refractory gastric carcinomas.", journal: "Nature Medicine", year: "2025" }
    ],
    references: [
      "NCCN Clinical Practice Guidelines in Oncology (2025 Edition)."
    ],

    relatedAnatomyIds: ["lungs", "brain", "liver"],
    relatedCellIds: ["t-cell", "endothelial-cell"],
    relatedGeneIds: ["TP53", "EGFR", "BRCA1", "KRAS"],
    relatedSimulationUrls: ["/process-simulations"],
    relatedVirtualLabUrls: ["/virtual-lab"],
    relatedQuizIds: ["quiz-cancer-1"],
    relatedResearchIds: ["res-cancer-1"],
    relatedScientistNames: ["Sidney Farber", "James Allison", "Tasuku Honjo"]
  },

  anemia: {
    id: "anemia",
    name: "Iron Deficiency & Hemolytic Anemia",
    icdCode: "D50.9",
    scientificName: "Microcytic & Hemolytic Anemia Syndrome",
    category: "hematology",
    subcategory: "Erythrocyte Pathology",
    icon: "🩸",
    accentColor: "#F59E0B",
    difficulty: "beginner",
    estimatedStudyTimeMinutes: 10,

    overview:
      "A common hematological disorder marked by a reduction in hemoglobin concentration or circulating red blood cell mass, impairing systemic oxygen delivery.",
    definition:
      "Hemoglobin concentration < 13.0 g/dL in men or < 12.0 g/dL in non-pregnant women.",
    classification: [
      "Microcytic Hypochromic (Iron deficiency, Thalassemia, Anemia of chronic disease)",
      "Normocytic Normochromic (Acute blood loss, Hemolysis, Chronic kidney disease)",
      "Macrocytic Normochromic (Vitamin B12 deficiency, Folate deficiency, Alcoholism)"
    ],
    causes: [
      "Chronic occult blood loss (gastrointestinal ulcer, menorrhagia)",
      "Inadequate dietary iron intake or impaired intestinal absorption (Celiac disease)",
      "Autoimmune erythrocyte destruction (AIHA) or genetic hemoglobinopathy (Sickle Cell)"
    ],
    riskFactors: [
      "Heavy menstrual bleeding (menorrhagia)",
      "Pregnancy and lactation",
      "Strict vegan diet without supplementation",
      "Frequent blood donation or chronic GI bleeding"
    ],
    pathophysiology:
      "Iron depletion impairs heme synthesis, resulting in microcytic (low MCV) and hypochromic (low MCH) erythrocytes. Inadequate hemoglobin reduces arterial oxygen content, triggering compensatory sinus tachycardia and increased cardiac output.",

    affectedOrgans: ["heart", "bone-marrow", "spleen"],
    affectedSystems: ["Hematology", "Cardiovascular"],

    symptoms: [
      { name: "Generalized Fatigue & Lethargy", severity: "moderate", frequency: "Common", description: "Impaired cellular oxidative phosphorylation due to reduced tissue oxygenation", organSystem: "Systemic" },
      { name: "Pallor (Skin & Conjunctival)", severity: "mild", frequency: "Common", description: "Paleness of cutaneous microvasculature and palpebral conjunctiva", organSystem: "Vascular" },
      { name: "Exertional Dyspnea & Tachycardia", severity: "moderate", frequency: "Common", description: "Compensatory cardiac stroke volume and heart rate increase to maintain oxygen delivery", organSystem: "Cardiovascular" },
      { name: "Pica (Craving Ice / Dirt)", severity: "mild", frequency: "Occasional", description: "Specific neuro-behavioral symptom characteristic of severe iron depletion", organSystem: "Nervous" }
    ],

    clinicalTimeline: [
      {
        id: "healthy",
        title: "Normal Erythropoiesis",
        subtitle: "Balanced Iron Stores",
        duration: "Baseline",
        cellularChanges: ["Normal biconcave disk red blood cells (MCV 80-100 fL)", "Adequate bone marrow erythroblasts"],
        tissueDamageDescription: "Normal oxygen delivery to peripheral tissues.",
        symptomSeverity: "mild",
        clinicalSigns: ["Hb 14.0 g/dL, Ferritin > 50 ng/mL"],
        biomarkers: ["Normal serum iron and total iron binding capacity (TIBC)"],
        interventionPoints: ["Dietary iron intake"],
        damagePercentage: 0
      },
      {
        id: "early",
        title: "Iron Depletion Stage",
        subtitle: "Depleted Storage Pools",
        duration: "1 - 3 Months",
        cellularChanges: ["Exhaustion of macrophage hemosiderin and ferritin stores"],
        tissueDamageDescription: "Unimpaired circulating hemoglobin levels.",
        symptomSeverity: "mild",
        clinicalSigns: ["Asymptomatic, Hb still within normal range"],
        biomarkers: ["Serum Ferritin < 30 ng/mL, Elevated TIBC"],
        interventionPoints: ["Oral Ferrous Sulfate supplementation"],
        damagePercentage: 15
      },
      {
        id: "progression",
        title: "Overt Microcytic Anemia",
        subtitle: "Impaired Heme Synthesis",
        duration: "3 - 6 Months",
        cellularChanges: ["Microcytic (MCV < 80 fL) hypochromic RBC production by bone marrow"],
        tissueDamageDescription: "Reduced tissue oxygen delivery.",
        symptomSeverity: "moderate",
        clinicalSigns: ["Pallor, fatigue, exertional palpitations, dyspnea"],
        biomarkers: ["Hb < 10 g/dL, Low Transferrin Saturation (< 15%)"],
        interventionPoints: ["Oral Ferrous Fumarate + Vitamin C (enhances absorption)"],
        damagePercentage: 45
      },
      {
        id: "advanced",
        title: "Severe Anemia & High-Output State",
        subtitle: "Cardiovascular Compensation",
        duration: "Months",
        cellularChanges: ["Severe microcytosis, anisocytosis, and poikilocytosis"],
        tissueDamageDescription: "Hyperdynamic circulation, flow murmurs, myocardial ischemia.",
        symptomSeverity: "severe",
        clinicalSigns: ["Hb < 6.0 g/dL, Systolic ejection murmur, resting tachycardia"],
        biomarkers: ["Serum Ferritin < 10 ng/mL"],
        interventionPoints: ["Intravenous Ferric Carboxymaltose", "Packed Red Blood Cell (PRBC) transfusion if symptomatic"],
        damagePercentage: 75
      },
      {
        id: "recovery",
        title: "Reticulocyte Surge & Hb Recovery",
        subtitle: "Therapeutic Hematopoiesis",
        duration: "2 - 4 Weeks",
        cellularChanges: ["Reticulocytosis (peak at 7-10 days post-iron therapy)"],
        tissueDamageDescription: "Restoration of tissue oxygenation.",
        symptomSeverity: "mild",
        clinicalSigns: ["Hemoglobin increase by 1.0 g/dL per week"],
        biomarkers: ["Reticulocyte count > 3%"],
        interventionPoints: ["Continue oral iron for 3-6 months post-Hb normalization to rebuild ferritin"],
        damagePercentage: 15
      },
      {
        id: "long-term",
        title: "High-Output Cardiac Failure",
        subtitle: "End-Stage Decompensation",
        duration: "Chronic Severe",
        cellularChanges: ["Chronic tissue hypoxia and myocardial cell strain"],
        tissueDamageDescription: "Biventricular enlargement and pulmonary congestion.",
        symptomSeverity: "critical",
        clinicalSigns: ["Peripheral edema, orthopnea, elevated JVP"],
        biomarkers: ["Elevated BNP"],
        interventionPoints: ["Emergency transfusion & cardiovascular support"],
        damagePercentage: 90
      }
    ],

    diagnosisOverview:
      "Evaluated via Complete Blood Count (CBC) with RBC indices, serum ferritin, total iron binding capacity (TIBC), and peripheral blood smear.",
    labTests: [
      { testName: "Complete Blood Count (Hb & MCV)", category: "Blood", normalRange: "Hb: 12-16 g/dL, MCV: 80-100 fL", diseaseValue: "Hb < 10 g/dL, MCV < 75 fL", clinicalSignificance: "Identifies microcytic anemia." },
      { testName: "Serum Ferritin", category: "Blood", normalRange: "30 - 300 ng/mL", diseaseValue: "< 15 ng/mL", clinicalSignificance: "Most specific marker for iron deficiency." }
    ],
    imagingFindings: [
      { modality: "Ultrasound", findings: "Splenomegaly in hemolytic anemia.", keyFeature: "Splenic enlargement." }
    ],
    diagnosticCriteria: [
      "Hb < 12.0 g/dL (female) or < 13.0 g/dL (male) with low serum ferritin (< 30 ng/mL)."
    ],

    treatment: {
      primaryGoal: "Replenish iron stores, restore normal hemoglobin levels, and identify/treat underlying source of blood loss.",
      medications: [
        { name: "Ferrous Sulfate", class: "Oral Iron Supplement", mechanismOfAction: "Provides elemental iron essential for hemoglobin heme synthesis.", commonDosage: "325mg (65mg elemental iron) daily", sideEffects: ["Constipation", "Dark stools", "Nausea"], contraindications: ["Hemochromatosis"] },
        { name: "Ferric Carboxymaltose", class: "Intravenous Iron Complex", mechanismOfAction: "Rapid parenteral replenishment of iron stores without oral absorption barrier.", commonDosage: "750mg - 1000mg single IV infusion", sideEffects: ["Hypophosphatemia", "Transient flushing"], contraindications: ["First trimester pregnancy"] }
      ],
      surgicalOptions: ["Endoscopy / Colonoscopy to cauterize GI bleeding lesions"],
      lifestyleManagement: ["Increased consumption of heme iron (red meat, poultry)", "Co-ingestion of Vitamin C (ascorbic acid) with iron"],
      monitoringProtocol: "CBC and Reticulocyte count at 2 weeks; repeat Ferritin at 3 months."
    },
    complications: [
      "High-Output Heart Failure",
      "Impaired Cognitive Development in Children",
      "Preterm Labor & Low Birth Weight in Pregnancy"
    ],
    prevention: [
      "Routine screening during pregnancy",
      "Dietary fortification with elemental iron"
    ],
    prognosis: "Excellent prognosis; complete recovery expected within 2-3 months of appropriate iron therapy.",

    organDamageHighlights: [
      { organName: "Blood Vessels", damageType: "Microcytic Hypochromic Erythrocytes", description: "Pale, small red blood cells unable to carry sufficient oxygen.", pathologyColor: "#F59E0B" }
    ],

    recentResearch: [
      { title: "Hepcidin Antagonists in Anemia of Chronic Kidney Disease", summary: "Restores duodenal iron absorption by downregulating membrane ferroportin degradation.", journal: "Blood", year: "2024" }
    ],
    references: [
      "ASH (American Society of Hematology) Guidelines on Iron Deficiency Anemia."
    ],

    relatedAnatomyIds: ["heart", "spleen"],
    relatedCellIds: ["erythrocyte", "macrophage"],
    relatedGeneIds: ["HBA1", "HBB", "HAMP"],
    relatedSimulationUrls: ["/process-simulations"],
    relatedVirtualLabUrls: ["/virtual-lab"],
    relatedQuizIds: ["quiz-anemia-1"],
    relatedResearchIds: ["res-anemia-1"],
    relatedScientistNames: ["Thomas Addison", "George Whipple"]
  },

  alzheimers: {
    id: "alzheimers",
    name: "Alzheimer's Disease",
    icdCode: "G30.9",
    scientificName: "Neurodegenerative Cerebral Amyloidosis",
    category: "neurological",
    subcategory: "Neurodegenerative Pathology",
    icon: "🧠",
    accentColor: "#E879F9",
    difficulty: "advanced",
    estimatedStudyTimeMinutes: 15,

    overview:
      "A progressive neurodegenerative disorder leading to cognitive decline, memory loss, executive dysfunction, and brain atrophy.",
    definition:
      "Deposition of extracellular amyloid-beta plaques and intracellular hyperphosphorylated tau neurofibrillary tangles causing synaptic loss.",
    classification: [
      "Sporadic Late-Onset Alzheimer's (> 95% of cases, onset age > 65)",
      "Familial Early-Onset Alzheimer's (< 5% of cases, mutations in APP, PSEN1, PSEN2)"
    ],
    causes: [
      "Accumulation of neurotoxic Amyloid-beta 42 (Aβ42) oligomers",
      "Hyperphosphorylation of microtubule-associated protein tau",
      "APOE ε4 allele risk inheritance"
    ],
    riskFactors: [
      "Advanced age (single strongest risk factor)",
      "APOE ε4 allele carriage (1 copy = 3x risk, 2 copies = 12x risk)",
      "Traumatic brain injury (TBI) and cardiovascular disease"
    ],
    pathophysiology:
      "Cleavage of APP by beta and gamma secretases forms insoluble Aβ42 plaques. Microglial inflammatory activation leads to neuroinflammation. Hyperphosphorylated tau detaches from microtubules, aggregating into neurofibrillary tangles (NFTs) that cause cholinergic neuronal death in the hippocampus and cerebral cortex.",

    affectedOrgans: ["brain"],
    affectedSystems: ["Nervous"],

    symptoms: [
      { name: "Short-Term Memory Loss (Anterograde Amnesia)", severity: "moderate", frequency: "Common", description: "Inability to consolidate new episodic memories due to hippocampal atrophy", organSystem: "Nervous" },
      { name: "Aphasia & Word-Finding Difficulty", severity: "moderate", frequency: "Common", description: "Impaired language expression and comprehension", organSystem: "Nervous" },
      { name: "Disorientation & Wandering", severity: "severe", frequency: "Common", description: "Loss of spatial navigation and temporal orientation", organSystem: "Nervous" },
      { name: "Apraxia & Loss of ADL Autonomy", severity: "critical", frequency: "Occasional", description: "Inability to perform purposeful motor tasks like dressing or eating", organSystem: "Nervous" }
    ],

    clinicalTimeline: [
      {
        id: "healthy",
        title: "Normal Cognitive Function",
        subtitle: "Intact Cholinergic Pathways",
        duration: "Baseline",
        cellularChanges: ["Normal APP processing via alpha-secretase", "Intact microtubule transport in axons"],
        tissueDamageDescription: "Normal hippocampal volume and cortical thickness.",
        symptomSeverity: "mild",
        clinicalSigns: ["MMSE 29-30, MoCA 26-30"],
        biomarkers: ["Normal CSF Aβ42 and p-tau181"],
        interventionPoints: ["Cognitive reserve building & physical exercise"],
        damagePercentage: 0
      },
      {
        id: "early",
        title: "Preclinical / Mild Cognitive Impairment (MCI)",
        subtitle: "Silent Amyloid Accumulation",
        duration: "10 - 20 Years",
        cellularChanges: ["Asymptomatic Aβ plaque seeding in transentorhinal cortex"],
        tissueDamageDescription: "Subtle entorhinal cortex synaptic loss.",
        symptomSeverity: "mild",
        clinicalSigns: ["Subjective memory complaints, MoCA 22-25"],
        biomarkers: ["Decreased CSF Aβ42, Amyloid PET positive"],
        interventionPoints: ["Anti-amyloid monoclonal antibody therapy (Lecanemab)"],
        damagePercentage: 20
      },
      {
        id: "progression",
        title: "Mild-to-Moderate Alzheimer's",
        subtitle: "Hippocampal Atrophy & Tangles",
        duration: "2 - 6 Years",
        cellularChanges: ["Spread of tau tangles into hippocampus and neocortex", "Cholinergic deficit"],
        tissueDamageDescription: "Moderate hippocampal atrophy, widened cerebral sulci.",
        symptomSeverity: "moderate",
        clinicalSigns: ["Short-term memory loss, disorientation, MMSE 15-21"],
        biomarkers: ["Elevated plasma p-tau217 & NfL"],
        interventionPoints: ["Cholinesterase Inhibitors (Donepezil, Rivastigmine) + Memantine"],
        damagePercentage: 55
      },
      {
        id: "advanced",
        title: "Severe AD & Neocortical Failure",
        subtitle: "Widespread Degeneration",
        duration: "2 - 4 Years",
        cellularChanges: ["Massive loss of cortical cholinergic and glutamatergic neurons"],
        tissueDamageDescription: "Severe diffuse cerebral cortical atrophy, ventricular enlargement (hydrocephalus ex vacuo).",
        symptomSeverity: "critical",
        clinicalSigns: ["Loss of speech, bedbound state, severe dysphagia, MMSE < 10"],
        biomarkers: ["Marked elevation in CSF neurofilament light chain"],
        interventionPoints: ["Palliative care & total nursing care support"],
        damagePercentage: 90
      },
      {
        id: "recovery",
        title: "Disease Stabilization Phase",
        subtitle: "Therapeutic Slowing",
        duration: "Ongoing",
        cellularChanges: ["Clearance of parenchymal amyloid plaques via microglial phagocytosis"],
        tissueDamageDescription: "Slowing of cognitive decline rate by 27-35%.",
        symptomSeverity: "moderate",
        clinicalSigns: ["Sustained MoCA score maintenance"],
        biomarkers: ["Reduced amyloid plaque load on PET scan"],
        interventionPoints: ["Continued anti-amyloid therapy & cognitive stimulation"],
        damagePercentage: 40
      },
      {
        id: "long-term",
        title: "End-Stage Neurological Complications",
        subtitle: "Terminal Sequelae",
        duration: "Terminal",
        cellularChanges: ["Total destruction of limbic and association neocortex"],
        tissueDamageDescription: "Aspiration pneumonia, sepsis, malnutrition, complete vegetative state.",
        symptomSeverity: "critical",
        clinicalSigns: ["Reflex swallowing loss, coma"],
        biomarkers: ["End-stage neurodegeneration"],
        interventionPoints: ["End-of-life hospice care"],
        damagePercentage: 99
      }
    ],

    diagnosisOverview:
      "Diagnosis involves clinical neurocognitive testing (MMSE/MoCA), MRI volumetric brain imaging, CSF biomarkers, and Amyloid/Tau PET scans.",
    labTests: [
      { testName: "CSF Amyloid-Beta 42 / Tau Ratio", category: "CSF", normalRange: "High Aβ42, Low p-tau", diseaseValue: "Low Aβ42, High p-tau181", clinicalSignificance: "Biomarker confirmation of AD pathology." },
      { testName: "Plasma p-tau217 Assay", category: "Blood", normalRange: "< 0.5 pg/mL", diseaseValue: "> 2.0 pg/mL", clinicalSignificance: "High-accuracy non-invasive blood test for Alzheimer's plaques." }
    ],
    imagingFindings: [
      { modality: "MRI", findings: "Medial temporal lobe atrophy involving hippocampus and entorhinal cortex.", keyFeature: "Hippocampal Atrophy (MTA score ≥ 2)." },
      { modality: "PET Scan", findings: "Amyloid-PET tracer binding throughout cerebral cortex.", keyFeature: "Cortical Amyloid Deposition." }
    ],
    diagnosticCriteria: [
      "NIA-AA Criteria: Insidious onset of cognitive impairment with biomarker evidence of amyloid & tau pathology."
    ],

    treatment: {
      primaryGoal: "Clear amyloid plaque burden, slow cognitive decline, and preserve functional independence.",
      medications: [
        { name: "Lecanemab", class: "Anti-Amyloid Monoclonal Antibody", mechanismOfAction: "Binds soluble amyloid-beta protofibrils, promoting immune clearance.", commonDosage: "10 mg/kg IV biweekly", sideEffects: ["Amyloid-Related Imaging Abnormalities (ARIA-E / ARIA-H)"], contraindications: ["Severe cerebral microhemorrhages", "Anticoagulant use"] },
        { name: "Donepezil", class: "Acetylcholinesterase Inhibitor", mechanismOfAction: "Inhibits AChE enzyme, increasing acetylcholine availability at synapses.", commonDosage: "5mg - 10mg orally daily at bedtime", sideEffects: ["Nausea", "Bradycardia", "Vivid dreams"], contraindications: ["Sick sinus syndrome"] },
        { name: "Memantine", class: "NMDA Receptor Antagonist", mechanismOfAction: "Uncompetitive NMDA antagonist protecting neurons from glutamate excitotoxicity.", commonDosage: "10mg twice daily", sideEffects: ["Dizziness", "Confusion", "Headache"], contraindications: ["Severe renal impairment"] }
      ],
      surgicalOptions: ["Ventriculoperitoneal shunt (only if secondary Normal Pressure Hydrocephalus present)"],
      lifestyleManagement: ["Physical exercise (150 min/week aerobic)", "Cognitive stimulation & social engagement", "Mediterranean-DASH Diet (MIND diet)"],
      monitoringProtocol: "Bi-annual MoCA/MMSE testing; MRI at 2, 7, and 14 months during lecanemab therapy to monitor for ARIA."
    },
    complications: [
      "Aspiration Pneumonia (Leading Cause of Death)",
      "Severe Malnutrition & Dysphagia",
      "Fall-Related Fractures",
      "Behavioral Disturbances & Psychosis"
    ],
    prevention: [
      "Cardiovascular risk factor control (HTN, Diabetes, Hyperlipidemia)",
      "Prevention of traumatic brain injury",
      "Lifelong educational attainment & cognitive engagement"
    ],
    prognosis: "Average survival is 8-10 years post-diagnosis; disease-modifying therapies slow progression by ~30%.",

    organDamageHighlights: [
      { organName: "Brain", damageType: "Hippocampal Atrophy & Tau Tangles", description: "Loss of memory center volume and cholinergic neurons.", pathologyColor: "#E879F9" }
    ],

    recentResearch: [
      { title: "Donanemab Phase 3 Trial Results in Early Symptomatic Alzheimer's", summary: "Demonstrates 35% slowing of clinical decline over 18 months.", journal: "JAMA", year: "2024" }
    ],
    references: [
      "Alzheimer's Association Diagnostic Guidelines (2024 update)."
    ],

    relatedAnatomyIds: ["brain"],
    relatedCellIds: ["neuron", "astrocyte", "microglia"],
    relatedGeneIds: ["APP", "PSEN1", "PSEN2", "APOE"],
    relatedSimulationUrls: ["/process-simulations"],
    relatedVirtualLabUrls: ["/virtual-lab"],
    relatedQuizIds: ["quiz-alzheimers-1"],
    relatedResearchIds: ["res-ad-1"],
    relatedScientistNames: ["Alois Alzheimer", "Dale Schenk"]
  },

  parkinsons: {
    id: "parkinsons",
    name: "Parkinson's Disease",
    icdCode: "G20",
    scientificName: "Idiopathic Parkinsonism",
    category: "neurological",
    subcategory: "Basal Ganglia Movement Disorder",
    icon: "⚡",
    accentColor: "#6366F1",
    difficulty: "advanced",
    estimatedStudyTimeMinutes: 12,

    overview:
      "A progressive neurodegenerative movement disorder resulting from loss of dopaminergic neurons in the substantia nigra pars compacta.",
    definition:
      "Synucleinopathy marked by intracellular Lewy body inclusions causing resting tremor, bradykinesia, rigidity, and postural instability.",
    classification: [
      "Idiopathic Parkinson's Disease (90% of cases)",
      "Familial Parkinson's Disease (Mutations in LRRK2, SNCA, PRKN, PINK1)",
      "Parkinson-Plus Syndromes (MSA, PSP, CBD)"
    ],
    causes: [
      "Loss of dopaminergic neurons in substantia nigra",
      "Alpha-synuclein misfolding and Lewy body aggregation"
    ],
    riskFactors: [
      "Advanced age (> 60 years)",
      "Pesticide exposure (Paraquat, Rotenone)",
      "Male gender (1.5x higher prevalence)",
      "Head trauma history"
    ],
    pathophysiology:
      "Loss of nigrostriatal dopamine reduces inhibition of the indirect pathway and excitement of the direct pathway in the basal ganglia. This leads to excessive globus pallidus interna / substantia nigra reticulata firing, inhibiting thalamocortical motor output.",

    affectedOrgans: ["brain"],
    affectedSystems: ["Nervous"],

    symptoms: [
      { name: "Resting Tremor ('Pill-Rolling')", severity: "moderate", frequency: "Common", description: "4-6 Hz asymmetric resting tremor of digits, disappearing during voluntary movement", organSystem: "Nervous" },
      { name: "Bradykinesia (Slowness of Movement)", severity: "severe", frequency: "Common", description: "Slowness in initiation and execution of motor activity (micrographia, reduced arm swing)", organSystem: "Nervous" },
      { name: "Cogwheel Muscle Rigidity", severity: "severe", frequency: "Common", description: "Increased passive muscle tone with ratchet-like resistance", organSystem: "Nervous" },
      { name: "Postural Instability & Festinating Gait", severity: "critical", frequency: "Common", description: "Impaired postural reflexes leading to frequent falls and short shuffling steps", organSystem: "Nervous" }
    ],

    clinicalTimeline: [
      {
        id: "healthy",
        title: "Normal Nigrostriatal Pathway",
        subtitle: "Intact Dopaminergic Tone",
        duration: "Baseline",
        cellularChanges: ["Normal dopamine synthesis via tyrosine hydroxylase in substantia nigra"],
        tissueDamageDescription: "Pigmented midbrain substantia nigra.",
        symptomSeverity: "mild",
        clinicalSigns: ["Normal motor initiation and posture"],
        biomarkers: ["Normal DaTscan uptake"],
        interventionPoints: ["Regular physical exercise"],
        damagePercentage: 0
      },
      {
        id: "early",
        title: "Premotor / Prodromal Phase",
        subtitle: "Lower Brainstem & Olfactory Bulb Synucleinopathy",
        duration: "5 - 15 Years",
        cellularChanges: ["Braak Stage 1-2: Alpha-synuclein Lewy bodies in vagus nerve and olfactory bulb"],
        tissueDamageDescription: "Loss of olfactory bulb neurons.",
        symptomSeverity: "mild",
        clinicalSigns: ["Hyposmia (loss of smell), REM sleep behavior disorder (RBD), chronic constipation"],
        biomarkers: ["Alpha-synuclein seed amplification assay (SAA) positive"],
        interventionPoints: ["Neuroprotective clinical trial enrollment"],
        damagePercentage: 25
      },
      {
        id: "progression",
        title: "Motor Onset (Hoehn & Yahr Stage 1-2)",
        subtitle: "Nigral Cell Threshold Loss (> 60%)",
        duration: "2 - 5 Years",
        cellularChanges: ["Braak Stage 3-4: Substantia nigra dopaminergic cell loss > 60%"],
        tissueDamageDescription: "Depigmentation of midbrain substantia nigra pars compacta.",
        symptomSeverity: "moderate",
        clinicalSigns: ["Unilateral resting tremor, mild bradykinesia, mask-like facies"],
        biomarkers: ["Reduced striatal dopamine transporter binding on DaTscan"],
        interventionPoints: ["Levodopa/Carbidopa or Dopamine Agonist (Pramipexole) initiation"],
        damagePercentage: 60
      },
      {
        id: "advanced",
        title: "Moderate-Severe PD (Hoehn & Yahr Stage 3-4)",
        subtitle: "Bilateral Involvement & Motor Fluctuations",
        duration: "5 - 10 Years",
        cellularChanges: ["Loss of presynaptic reuptake capability causing dyskinesias"],
        tissueDamageDescription: "Widespread striatal dopamine denervation.",
        symptomSeverity: "severe",
        clinicalSigns: ["Bilateral motor signs, postural instability, 'On-Off' motor fluctuations, peak-dose dyskinesias"],
        biomarkers: ["Marked loss of DaTscan caudate & putamen signal"],
        interventionPoints: ["Deep Brain Stimulation (DBS) of STN or GPi", "Continuous LCIG intestinal gel infusion"],
        damagePercentage: 85
      },
      {
        id: "recovery",
        title: "DBS / Therapeutic Motor Optimization",
        subtitle: "Symptomatic Motor Control",
        duration: "Ongoing",
        cellularChanges: ["Electrical modulation of subthalamic nucleus hyperactivity"],
        tissueDamageDescription: "Suppression of abnormal beta-band neural oscillations.",
        symptomSeverity: "moderate",
        clinicalSigns: ["60% reduction in tremor and dyskinesia, decreased levodopa requirement"],
        biomarkers: ["Optimized motor UPDRS III score"],
        interventionPoints: ["Programming DBS neurostimulator & physical therapy"],
        damagePercentage: 50
      },
      {
        id: "long-term",
        title: "End-Stage PD (Hoehn & Yahr Stage 5)",
        subtitle: "Neocortical Spread & Dementia",
        duration: "Chronic",
        cellularChanges: ["Braak Stage 5-6: Widespread neocortical Lewy body pathology"],
        tissueDamageDescription: "Severe diffuse cerebral and basal ganglia degeneration.",
        symptomSeverity: "critical",
        clinicalSigns: ["Wheelchair/bedbound state, Parkinson's disease dementia (PDD), severe dysphagia"],
        biomarkers: ["Severe multi-neurotransmitter deficiency"],
        interventionPoints: ["Palliative & end-of-life supportive care"],
        damagePercentage: 95
      }
    ],

    diagnosisOverview:
      "Diagnosed clinically via MDS-PD criteria (bradykinesia plus tremor or rigidity) and responsiveness to Levodopa; supported by DaTscan imaging.",
    labTests: [
      { testName: "Alpha-Synuclein Seed Amplification Assay (SAA)", category: "CSF", normalRange: "Negative", diseaseValue: "Positive for misfolded α-synuclein seeds", clinicalSignificance: "High-sensitivity biomarker for synucleinopathy." }
    ],
    imagingFindings: [
      { modality: "PET Scan", findings: "123I-Ioflupane SPECT (DaTscan) shows reduced dopamine transporter signal in putamen.", keyFeature: "Comet-tail to dot-like striatal loss." }
    ],
    diagnosticCriteria: [
      "Bradykinesia PLUS at least one of: Resting Tremor or Rigidity.",
      "Absence of red-flag symptoms suggesting atypical parkinsonism.",
      "Clear positive response to Levodopa challenge."
    ],

    treatment: {
      primaryGoal: "Restore striatal dopamine tone, control motor fluctuations, and maintain ambulatory function.",
      medications: [
        { name: "Levodopa / Carbidopa", class: "Dopamine Precursor / Peripheral Decarboxylase Inhibitor", mechanismOfAction: "Levodopa crosses BBB and converts to dopamine; Carbidopa prevents peripheral breakdown.", commonDosage: "100/25mg 3-4 times daily", sideEffects: ["Nausea", "Orthostatic hypotension", "Dyskinesias (long-term)"], contraindications: ["Narrow-angle glaucoma"] },
        { name: "Pramipexole", class: "D2/D3 Dopamine Agonist", mechanismOfAction: "Directly stimulates striatal dopamine receptors.", commonDosage: "0.125mg - 1.5mg three times daily", sideEffects: ["Impulse control disorders (gambling, hypersexuality)", "Somnolence"], contraindications: ["Severe cardiac disease"] },
        { name: "Rasagiline", class: "MAO-B Inhibitor", mechanismOfAction: "Inhibits monoamine oxidase B, blocking central dopamine degradation.", commonDosage: "1mg orally daily", sideEffects: ["Headache", "Nausea"], contraindications: ["Concurrent meperidine or SSRI use"] }
      ],
      surgicalOptions: ["Deep Brain Stimulation (DBS) targeting Subthalamic Nucleus (STN) or Globus Pallidus (GPi)", "Focused Ultrasound Thalamotomy"],
      lifestyleManagement: ["LSVT BIG physical therapy movement training", "High-fiber diet & hydration for constipation", "Gait cadence auditory cueing"],
      monitoringProtocol: "UPDRS (Unified Parkinson's Disease Rating Scale) evaluation every 6 months; screen for impulse control disorders."
    },
    complications: [
      "Severe Freezing of Gait & Recurrent Falls / Fractures",
      "Levodopa-Induced Dyskinesias & Motor Fluctuations",
      "Parkinson's Disease Dementia & Visual Hallucinations",
      "Severe Dysphagia & Aspiration Pneumonia",
      "Autonomic Dysfunction (Orthostatic Hypotension)"
    ],
    prevention: [
      "Avoidance of occupational pesticide exposure",
      "Regular vigorous aerobic physical activity in midlife"
    ],
    prognosis: "Levodopa provides effective motor control for 10-15+ years; DBS extends functional independence.",

    organDamageHighlights: [
      { organName: "Brain", damageType: "Substantia Nigra Depigmentation & Lewy Bodies", description: "Loss of dopaminergic neurons and intracellular synuclein inclusions.", pathologyColor: "#6366F1" }
    ],

    recentResearch: [
      { title: "Alpha-Synuclein Seed Amplification Assay in Clinical Diagnosis of Parkinson's", summary: "Demonstrates 87.7% sensitivity in identifying prodromal and early Parkinson's disease.", journal: "The Lancet Neurology", year: "2024" }
    ],
    references: [
      "Movement Disorder Society (MDS) Clinical Diagnostic Criteria for Parkinson's Disease."
    ],

    relatedAnatomyIds: ["brain"],
    relatedCellIds: ["neuron", "microglia"],
    relatedGeneIds: ["SNCA", "LRRK2", "PRKN", "PINK1"],
    relatedSimulationUrls: ["/process-simulations"],
    relatedVirtualLabUrls: ["/virtual-lab"],
    relatedQuizIds: ["quiz-parkinsons-1"],
    relatedResearchIds: ["res-pd-1"],
    relatedScientistNames: ["James Parkinson", "Arvid Carlsson", "Oleh Hornykiewicz"]
  }
};
