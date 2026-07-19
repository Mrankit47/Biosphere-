// ═══════════════════════════════════════════════════════════════
// Biosphere — Biological Process Knowledge Objects
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeObject } from "@/knowledge-types/object";

export const PROCESS_OBJECTS: KnowledgeObject[] = [
  {
    id: "photosynthesis",
    name: "Photosynthesis",
    scientificName: "Photosynthesis",
    category: "botany",
    subcategory: "Plant Physiology",
    icon: "photosynthesis",
    accentColor: "#2ECC71",
    description: "Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy, carbon dioxide, and water into glucose and oxygen. It occurs in the chloroplasts and is the foundation of nearly all food chains on Earth.",
    difficulty: "intermediate",
    estimatedMinutes: 18,
    prerequisites: [],
    learningObjectives: [
      { text: "Write the balanced equation for photosynthesis", icon: "photosynthesis" },
      { text: "Distinguish light-dependent reactions from the Calvin cycle", icon: "process-simulations" },
      { text: "Explain the role of chlorophyll in capturing light energy", icon: "virtual-lab" },
    ],
    importantTerms: [
      { term: "Chlorophyll", definition: "Green pigment in chloroplasts that absorbs light energy, primarily red and blue wavelengths." },
      { term: "Light-Dependent Reactions", definition: "Reactions in the thylakoid membranes that use light to produce ATP and NADPH, releasing O₂." },
      { term: "Calvin Cycle", definition: "Light-independent reactions in the stroma that use ATP and NADPH to fix CO₂ into glucose (G3P)." },
      { term: "Carbon Fixation", definition: "The process of incorporating CO₂ into an organic molecule (catalyzed by RuBisCO)." },
      { term: "Thylakoid", definition: "Membrane-bound compartments inside chloroplasts where light reactions occur." },
    ],
    summary: "Photosynthesis converts 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Light-dependent reactions in the thylakoids produce ATP and NADPH. The Calvin cycle in the stroma uses these to fix CO₂ into glucose.",
    quickRevision: [
      "Overall: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.",
      "Light reactions: thylakoid → ATP + NADPH + O₂.",
      "Calvin cycle: stroma → uses ATP + NADPH to fix CO₂ → G3P → glucose.",
      "Chlorophyll absorbs red + blue light, reflects green.",
      "RuBisCO is the most abundant enzyme on Earth — it catalyzes carbon fixation.",
    ],
    interestingFacts: [
      "RuBisCO (the carbon-fixing enzyme) is the most abundant protein on Earth — ~700 million tons exist globally!",
      "Photosynthesis generates all the oxygen in Earth's atmosphere — without it, animal life would be impossible.",
      "Cyanobacteria performed the first photosynthesis ~2.7 billion years ago, causing the Great Oxidation Event.",
    ],
    commonMisconceptions: [
      "Misconception: Plants only photosynthesize during the day. Reality: Light reactions require light, but the Calvin cycle can continue in darkness (using stored ATP/NADPH).",
      "Misconception: Plants don't respire. Reality: Plants both photosynthesize AND respire — they consume oxygen at night.",
    ],
    scientists: [
      { name: "Jan Ingenhousz", contribution: "Discovered that plants need light to 'purify' air (produce O₂)", year: "1779" },
      { name: "Melvin Calvin", contribution: "Mapped the Calvin cycle of carbon fixation", year: "1961 Nobel" },
    ],
    timeline: [
      { year: "1779", title: "Light Requirement", description: "Ingenhousz showed plants need light to produce oxygen." },
      { year: "1845", title: "Energy Conversion", description: "Julius Robert Mayer proposed that plants convert light into chemical energy." },
      { year: "1961", title: "Calvin Cycle", description: "Melvin Calvin received the Nobel Prize for mapping the carbon fixation pathway." },
    ],
    images: [],
    infographics: [],
    model3D: { url: "/photosynthesis", accentColor: "#2ECC71" },
    simulationUrl: "/process-simulations",
    virtualLabUrl: "/virtual-lab",
    askAiPrompt: "Explain photosynthesis in detail, including the light-dependent reactions (thylakoid), Calvin cycle (stroma), the role of chlorophyll, and the balanced equation.",
    parentTopicId: undefined,
    childTopicIds: [],
    relatedTopicIds: ["mitochondria", "cell-membrane"],
    prerequisiteIds: [],
    nextTopicIds: [],
    relatedDiseaseIds: [],
    relatedSpeciesIds: [],
    relatedOrganIds: [],
    relatedCellIds: [],
    relatedSimulationIds: [],
    relatedResearchIds: [],
    clinicalImportance: "Understanding photosynthesis is critical for agriculture, biofuel research, and combating climate change through carbon sequestration. Herbicides often target photosynthetic enzymes.",
    realWorldApplications: [
      "Artificial photosynthesis research aims to create renewable fuel from sunlight and CO₂.",
      "Crop engineering optimizes photosynthetic efficiency to increase food yields.",
      "Carbon sequestration strategies leverage natural photosynthesis to combat climate change.",
    ],
    quiz: {
      id: "photosynthesis-quiz",
      title: "Photosynthesis Quiz",
      questions: [
        { text: "Where do the light-dependent reactions occur?", options: ["Stroma", "Cytoplasm", "Thylakoid membranes", "Mitochondria"], answerIndex: 2, explanation: "Light-dependent reactions take place in the thylakoid membranes of the chloroplast." },
        { text: "What is the most abundant enzyme on Earth?", options: ["ATP synthase", "Helicase", "RuBisCO", "DNA polymerase"], answerIndex: 2, explanation: "RuBisCO catalyzes carbon fixation in the Calvin cycle and is the most abundant protein globally." },
      ],
    },
    flashcards: [
      { id: "photo-fc-1", front: "What is the balanced equation for photosynthesis?", back: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂", category: "Equations" },
      { id: "photo-fc-2", front: "Where does the Calvin cycle occur?", back: "In the stroma of the chloroplast — it uses ATP and NADPH from light reactions to fix CO₂ into glucose.", category: "Processes" },
    ],
    revisionNotes: {
      importantPoints: [
        "Equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.",
        "Light reactions: thylakoid → ATP + NADPH + O₂.",
        "Calvin cycle: stroma → CO₂ fixation by RuBisCO → G3P → glucose.",
        "Chlorophyll absorbs red and blue, reflects green.",
      ],
      keyTerms: [
        { term: "Chlorophyll", definition: "Pigment capturing light energy." },
        { term: "Calvin Cycle", definition: "Carbon fixation pathway in the stroma." },
        { term: "RuBisCO", definition: "Enzyme catalyzing CO₂ fixation — most abundant protein on Earth." },
      ],
      summary: "Photosynthesis converts CO₂ + H₂O into glucose + O₂ using light energy. It occurs in two stages: light reactions (thylakoids) and the Calvin cycle (stroma).",
    },
    xpPoints: 200,
    verification: { status: "published", version: "1.0.0" },
    references: ["Campbell Biology, Chapter 10", "Blankenship RE (2014) Molecular Mechanisms of Photosynthesis, 2nd ed."],
    furtherReading: ["Barber J (2009) Photosynthetic energy conversion: natural and artificial. Chem Soc Rev."],
    existingRoute: "/photosynthesis",
  },
];
