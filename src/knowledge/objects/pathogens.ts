// ═══════════════════════════════════════════════════════════════
// Biosphere — Pathogen Knowledge Objects
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeObject } from "@/knowledge-types/object";

export const PATHOGEN_OBJECTS: KnowledgeObject[] = [
  {
    id: "sars-cov-2",
    name: "SARS-CoV-2",
    scientificName: "Severe Acute Respiratory Syndrome Coronavirus 2",
    category: "virology",
    subcategory: "Coronaviruses",
    icon: "viruses",
    accentColor: "#E24B4A",
    description: "SARS-CoV-2 is the RNA virus responsible for the COVID-19 pandemic. It belongs to the betacoronavirus genus and is characterized by spike proteins that bind to ACE2 receptors on human cells. Its genome (~30,000 nucleotides) is one of the largest among RNA viruses.",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    prerequisites: [],
    learningObjectives: [
      { text: "Describe the structural components of SARS-CoV-2", icon: "viruses" },
      { text: "Explain how the spike protein enables cell entry via ACE2", icon: "cell-explorer" },
      { text: "Understand mRNA vaccine mechanism of action", icon: "virtual-lab" },
    ],
    importantTerms: [
      { term: "Spike Protein (S)", definition: "Crown-like glycoprotein that binds ACE2 receptors on host cells to enable viral entry." },
      { term: "ACE2 Receptor", definition: "Angiotensin-converting enzyme 2 — the host cell surface protein exploited by SARS-CoV-2." },
      { term: "RNA Genome", definition: "The ~30,000-nucleotide positive-sense single-stranded RNA encoding the viral proteins." },
      { term: "Lipid Envelope", definition: "The fatty outer membrane that makes the virus susceptible to soap and disinfectants." },
    ],
    summary: "SARS-CoV-2 is a betacoronavirus with a lipid envelope, spike proteins, and a large RNA genome. The spike protein binds ACE2 receptors to enter human cells. mRNA vaccines work by training the immune system to recognize the spike protein.",
    quickRevision: [
      "Spike protein binds ACE2 → membrane fusion → RNA release into cell.",
      "Genome: ~30,000 nt positive-sense ssRNA — one of the largest RNA virus genomes.",
      "Lipid envelope makes it vulnerable to soap and alcohol-based sanitizers.",
      "Variants arise from mutations in the spike protein gene.",
    ],
    interestingFacts: [
      "The name 'corona' comes from Latin for 'crown' — the spike proteins resemble a solar corona under electron microscopy!",
      "SARS-CoV-2 was sequenced within weeks of its discovery, enabling rapid mRNA vaccine development.",
      "The virus can remain viable on surfaces for hours to days depending on the material.",
    ],
    commonMisconceptions: [
      "Misconception: mRNA vaccines alter your DNA. Reality: mRNA never enters the nucleus and is degraded after translation — it cannot integrate into DNA.",
      "Misconception: Antibiotics can treat COVID-19. Reality: Antibiotics target bacteria, not viruses.",
    ],
    scientists: [
      { name: "Zhang Yongzhen", contribution: "Led the team that first sequenced the SARS-CoV-2 genome", year: "2020" },
      { name: "Katalin Karikó", contribution: "Pioneered mRNA modifications enabling mRNA vaccines", year: "2023 Nobel" },
    ],
    timeline: [
      { year: "Dec 2019", title: "Outbreak", description: "First cases of unexplained pneumonia reported in Wuhan, China." },
      { year: "Jan 2020", title: "Genome Published", description: "Full viral genome published, enabling global research." },
      { year: "Dec 2020", title: "Vaccines Authorized", description: "Pfizer-BioNTech and Moderna mRNA vaccines receive emergency authorization." },
    ],
    images: [],
    infographics: [],
    model3D: { url: "/viruses", accentColor: "#E24B4A" },
    askAiPrompt: "Explain the structure of SARS-CoV-2, how the spike protein enables cell entry via ACE2, and how mRNA vaccines work against it.",
    parentTopicId: undefined,
    childTopicIds: [],
    relatedTopicIds: ["cell-membrane", "ribosome"],
    prerequisiteIds: [],
    nextTopicIds: [],
    relatedDiseaseIds: [],
    relatedSpeciesIds: [],
    relatedOrganIds: ["heart"],
    relatedCellIds: [],
    relatedSimulationIds: [],
    relatedResearchIds: [],
    clinicalImportance: "COVID-19 affects the respiratory system primarily but can cause multi-organ damage including cardiac, neurological, and vascular complications. Long COVID remains a significant clinical challenge.",
    realWorldApplications: [
      "mRNA vaccine technology developed for COVID-19 is now being adapted for cancer immunotherapy and other infectious diseases.",
      "Rapid genome sequencing enabled variant tracking and global surveillance.",
    ],
    quiz: {
      id: "sars-quiz",
      title: "SARS-CoV-2 Quiz",
      questions: [
        { text: "What host receptor does the SARS-CoV-2 spike protein bind to?", options: ["CD4", "ACE2", "EGFR", "Insulin Receptor"], answerIndex: 1, explanation: "The spike protein binds to ACE2 (angiotensin-converting enzyme 2) receptors on human cells." },
        { text: "What type of genome does SARS-CoV-2 have?", options: ["Double-stranded DNA", "Positive-sense ssRNA", "Negative-sense ssRNA", "Retroviral RNA"], answerIndex: 1, explanation: "SARS-CoV-2 has a positive-sense single-stranded RNA genome of ~30,000 nucleotides." },
      ],
    },
    flashcards: [
      { id: "sarscov2-fc-1", front: "What receptor does SARS-CoV-2 use to enter cells?", back: "ACE2 (angiotensin-converting enzyme 2) — the spike protein binds to ACE2 on the host cell surface.", category: "Virology" },
      { id: "sarscov2-fc-2", front: "Why is SARS-CoV-2 killed by soap?", back: "Soap dissolves the lipid envelope, destroying the virus structure.", category: "Prevention" },
    ],
    revisionNotes: {
      importantPoints: [
        "Spike protein + ACE2 receptor = cell entry mechanism.",
        "Positive-sense ssRNA genome (~30,000 nt).",
        "Lipid envelope → vulnerable to soap/sanitizer.",
        "mRNA vaccines encode the spike protein for immune training.",
      ],
      keyTerms: [
        { term: "ACE2", definition: "Host receptor exploited by the spike protein for cell entry." },
        { term: "Spike Protein", definition: "Crown-like projections enabling viral attachment and fusion." },
      ],
      summary: "SARS-CoV-2 uses its spike protein to bind ACE2 receptors and enter human cells. Its lipid envelope is its weakness — soap destroys it. mRNA vaccines teach the immune system to recognize the spike.",
    },
    xpPoints: 180,
    verification: { status: "published", version: "1.0.0" },
    references: ["Walls AC et al. (2020) Cell 181:281-292", "Polack FP et al. (2020) NEJM — Pfizer-BioNTech vaccine trial"],
    furtherReading: ["Karikó K, Weissman D — mRNA therapeutics research"],
    existingRoute: "/viruses",
  },
];
