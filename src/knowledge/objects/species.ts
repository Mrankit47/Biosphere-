// ═══════════════════════════════════════════════════════════════
// Biosphere — Species Knowledge Objects
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeObject } from "@/knowledge-types/object";

export const SPECIES_OBJECTS: KnowledgeObject[] = [
  {
    id: "animal-cell",
    name: "Animal Cell",
    scientificName: "Cellula animalis",
    category: "cell-biology",
    subcategory: "Cell Types",
    icon: "cell-explorer",
    accentColor: "#1ABC9C",
    description: "Animal cells are eukaryotic cells that lack a cell wall, chloroplasts, and large central vacuole — distinguishing them from plant cells. They contain a nucleus, mitochondria, endoplasmic reticulum, Golgi apparatus, lysosomes, and a cytoskeleton.",
    difficulty: "beginner",
    estimatedMinutes: 10,
    prerequisites: [],
    learningObjectives: [
      { text: "Identify the major organelles of an animal cell", icon: "cell-explorer" },
      { text: "Compare animal and plant cell structures", icon: "virtual-lab" },
      { text: "Explain the role of the cytoskeleton in cell shape and movement", icon: "process-simulations" },
    ],
    importantTerms: [
      { term: "Eukaryotic", definition: "Cell type with a membrane-bound nucleus and organelles." },
      { term: "Cytoskeleton", definition: "Network of protein filaments providing structural support and enabling cell movement." },
      { term: "Lysosome", definition: "Organelle containing digestive enzymes for breaking down waste materials." },
      { term: "Centriole", definition: "Cylindrical organelle involved in organizing cell division (absent in most plant cells)." },
    ],
    summary: "Animal cells are eukaryotic cells with a nucleus, mitochondria, ER, Golgi, and lysosomes. Unlike plant cells, they lack a cell wall, chloroplasts, and large vacuoles. The cytoskeleton gives them shape and enables movement.",
    quickRevision: [
      "Animal cells are eukaryotic (membrane-bound nucleus + organelles).",
      "No cell wall, no chloroplasts, no large central vacuole (unlike plant cells).",
      "Contain centrioles for cell division organization.",
      "Cytoskeleton: microfilaments + intermediate filaments + microtubules.",
    ],
    interestingFacts: [
      "The smallest human cell is the sperm cell (~5μm head); the largest is the egg cell (~120μm diameter)!",
      "Nerve cells (neurons) can be over 1 meter long — from the spinal cord to the tip of your toes.",
    ],
    commonMisconceptions: [
      "Misconception: All cells look the same. Reality: Animal cells are incredibly diverse — red blood cells, neurons, muscle cells, and epithelial cells all look very different.",
    ],
    scientists: [
      { name: "Robert Hooke", contribution: "Coined the term 'cell' after observing cork under a microscope", year: "1665" },
      { name: "Theodor Schwann", contribution: "Proposed that all animals are made of cells (Cell Theory)", year: "1839" },
    ],
    timeline: [
      { year: "1665", title: "First 'Cells'", description: "Robert Hooke observed and named 'cells' in cork tissue." },
      { year: "1839", title: "Cell Theory", description: "Schwann and Schleiden proposed that all living things are made of cells." },
    ],
    images: [],
    infographics: [],
    model3D: { url: "/cell-explorer", accentColor: "#1ABC9C" },
    askAiPrompt: "Compare the structure of animal and plant cells, listing all organelles and key differences.",
    parentTopicId: undefined,
    childTopicIds: ["mitochondria", "nucleus", "cell-membrane", "ribosome"],
    relatedTopicIds: ["dna-replication"],
    prerequisiteIds: [],
    nextTopicIds: ["mitochondria", "nucleus"],
    relatedDiseaseIds: [],
    relatedSpeciesIds: [],
    relatedOrganIds: ["heart"],
    relatedCellIds: [],
    relatedSimulationIds: ["photosynthesis"],
    relatedResearchIds: [],
    clinicalImportance: "Understanding animal cell biology is the foundation of cancer research, regenerative medicine, stem cell therapy, and virtually all of molecular medicine.",
    realWorldApplications: [
      "Stem cell research creates new tissues and organs from animal cell biology.",
      "Cancer treatment targets abnormalities in cell division and signaling.",
    ],
    quiz: {
      id: "animal-cell-quiz",
      title: "Animal Cell Quiz",
      questions: [
        { text: "Which organelle is absent in animal cells but present in plant cells?", options: ["Mitochondria", "Nucleus", "Chloroplast", "Ribosome"], answerIndex: 2, explanation: "Chloroplasts are found only in plant cells — they carry out photosynthesis." },
        { text: "Who coined the term 'cell'?", options: ["Schwann", "Schleiden", "Robert Hooke", "Virchow"], answerIndex: 2, explanation: "Robert Hooke coined the term 'cell' in 1665 after observing cork tissue under a microscope." },
      ],
    },
    flashcards: [
      { id: "ac-fc-1", front: "What makes animal cells different from plant cells?", back: "Animal cells lack a cell wall, chloroplasts, and large central vacuole. They have centrioles and lysosomes.", category: "Cell Biology" },
      { id: "ac-fc-2", front: "What is the cytoskeleton?", back: "A network of protein filaments (microfilaments, intermediate filaments, microtubules) that provides structural support and enables cell movement.", category: "Structure" },
    ],
    revisionNotes: {
      importantPoints: [
        "Eukaryotic cells with membrane-bound nucleus and organelles.",
        "No cell wall, chloroplasts, or large vacuole (unlike plants).",
        "Centrioles organize cell division.",
        "Cytoskeleton provides shape and movement.",
      ],
      keyTerms: [
        { term: "Eukaryotic", definition: "Having a membrane-bound nucleus." },
        { term: "Cytoskeleton", definition: "Protein filament network for structure and movement." },
      ],
      summary: "Animal cells are eukaryotic cells distinguished from plant cells by lacking a cell wall and chloroplasts. They contain a full complement of organelles including the nucleus, mitochondria, ER, Golgi, and lysosomes.",
    },
    xpPoints: 100,
    verification: { status: "published", version: "1.0.0" },
    references: ["Campbell Biology, Chapter 6", "Alberts et al., Molecular Biology of the Cell"],
    furtherReading: [],
    existingRoute: "/cell-explorer",
  },
];
