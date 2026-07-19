// ═══════════════════════════════════════════════════════════════
// Biosphere — Genetics Knowledge Objects
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeObject } from "@/knowledge-types/object";

export const GENETICS_OBJECTS: KnowledgeObject[] = [
  {
    id: "dna-replication",
    name: "DNA Replication",
    scientificName: "DNA Replication",
    category: "genetics",
    subcategory: "Molecular Genetics",
    icon: "dna-genetics",
    accentColor: "#3498DB",
    description: "DNA replication is the biological process by which a double-stranded DNA molecule is copied to produce two identical replicas. This is essential for cell division and is one of the most fundamental processes in all living organisms.",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    prerequisites: [],
    learningObjectives: [
      { text: "Describe the semi-conservative model of DNA replication", icon: "dna-genetics" },
      { text: "Identify key enzymes: helicase, primase, DNA polymerase, ligase", icon: "virtual-lab" },
      { text: "Explain the difference between leading and lagging strands", icon: "process-simulations" },
    ],
    importantTerms: [
      { term: "Helicase", definition: "Enzyme that unwinds the DNA double helix at the replication fork." },
      { term: "DNA Polymerase", definition: "Enzyme that synthesizes new DNA strands by adding nucleotides to a primer." },
      { term: "Okazaki Fragments", definition: "Short DNA fragments on the lagging strand that are later joined by ligase." },
      { term: "Replication Fork", definition: "Y-shaped region where the two parental DNA strands are being unwound and copied." },
      { term: "Semi-conservative", definition: "Each daughter DNA molecule consists of one original (parent) strand and one newly synthesized strand." },
    ],
    summary: "DNA replication is the process of duplicating the entire genome before cell division. The double helix unwinds at the replication fork, and DNA polymerase synthesizes complementary strands. It follows the semi-conservative model: each daughter molecule retains one original strand.",
    quickRevision: [
      "DNA replication is semi-conservative (Meselson-Stahl experiment).",
      "Helicase unwinds → Primase adds RNA primer → DNA Polymerase III extends → Ligase seals.",
      "Leading strand: continuous synthesis. Lagging strand: Okazaki fragments.",
      "Replication occurs in the 5' → 3' direction.",
    ],
    interestingFacts: [
      "Human DNA polymerase adds ~1,000 nucleotides per second and makes only 1 error per billion base pairs!",
      "The entire human genome (~3.2 billion base pairs) is replicated in about 8 hours.",
    ],
    commonMisconceptions: [
      "Misconception: DNA replication is error-free. Reality: Errors occur but are corrected by proofreading enzymes. Uncorrected errors become mutations.",
    ],
    scientists: [
      { name: "Watson & Crick", contribution: "Discovered the double helix structure of DNA", year: "1953" },
      { name: "Meselson & Stahl", contribution: "Proved DNA replication is semi-conservative", year: "1958" },
      { name: "Arthur Kornberg", contribution: "Discovered DNA polymerase I", year: "1956" },
    ],
    timeline: [
      { year: "1953", title: "Double Helix", description: "Watson and Crick published the structure of DNA." },
      { year: "1956", title: "DNA Polymerase", description: "Arthur Kornberg isolated DNA polymerase I." },
      { year: "1958", title: "Semi-conservative", description: "Meselson and Stahl proved semi-conservative replication." },
    ],
    images: [],
    infographics: [],
    model3D: { url: "/dna-genetics", accentColor: "#3498DB" },
    simulationUrl: "/process-simulations",
    askAiPrompt: "Explain DNA replication step by step, including the roles of helicase, primase, DNA polymerase III, and ligase, and the difference between leading and lagging strands.",
    parentTopicId: undefined,
    childTopicIds: [],
    relatedTopicIds: ["nucleus", "mitochondria"],
    prerequisiteIds: [],
    nextTopicIds: [],
    relatedDiseaseIds: [],
    relatedSpeciesIds: [],
    relatedOrganIds: [],
    relatedCellIds: [],
    relatedSimulationIds: [],
    relatedResearchIds: [],
    clinicalImportance: "DNA replication errors cause mutations — the basis of cancer and genetic disorders. Chemotherapy drugs like cisplatin work by damaging DNA and blocking replication in rapidly dividing cancer cells.",
    realWorldApplications: [
      "PCR (Polymerase Chain Reaction) mimics DNA replication to amplify DNA for forensics, diagnostics, and research.",
      "Antiviral drugs like acyclovir (herpes) inhibit viral DNA polymerase.",
    ],
    quiz: {
      id: "dna-replication-quiz",
      title: "DNA Replication Quiz",
      questions: [
        { text: "What type of replication model does DNA follow?", options: ["Conservative", "Semi-conservative", "Dispersive", "Random"], answerIndex: 1, explanation: "Meselson and Stahl (1958) proved that DNA replication is semi-conservative." },
        { text: "What enzyme unwinds the DNA double helix?", options: ["Ligase", "Polymerase", "Helicase", "Primase"], answerIndex: 2, explanation: "Helicase separates the two strands at the replication fork." },
        { text: "In which direction does DNA polymerase synthesize?", options: ["3' → 5'", "5' → 3'", "Both directions", "Random"], answerIndex: 1, explanation: "DNA polymerase always synthesizes in the 5' → 3' direction." },
      ],
    },
    flashcards: [
      { id: "dna-fc-1", front: "What is the semi-conservative model?", back: "Each new DNA molecule consists of one old (parent) strand and one newly synthesized strand.", category: "Replication" },
      { id: "dna-fc-2", front: "What are Okazaki fragments?", back: "Short DNA segments synthesized on the lagging strand, later joined by DNA ligase.", category: "Replication" },
      { id: "dna-fc-3", front: "What does DNA polymerase III do?", back: "It synthesizes new DNA strands by adding complementary nucleotides in the 5'→3' direction.", category: "Enzymes" },
    ],
    revisionNotes: {
      importantPoints: [
        "DNA replication is semi-conservative.",
        "Key enzymes: helicase, primase, DNA polymerase III, ligase.",
        "Leading strand = continuous; lagging strand = Okazaki fragments.",
        "Always synthesized 5' → 3'.",
      ],
      keyTerms: [
        { term: "Semi-conservative", definition: "Each daughter molecule has one old + one new strand." },
        { term: "Okazaki Fragments", definition: "Short pieces on the lagging strand joined by ligase." },
      ],
      summary: "DNA replication copies the entire genome semi-conservatively. Helicase unwinds, primase primes, polymerase extends, and ligase joins fragments.",
    },
    xpPoints: 180,
    verification: { status: "published", version: "1.0.0" },
    references: ["Campbell Biology, Chapter 16", "Meselson M, Stahl FW (1958) PNAS."],
    furtherReading: ["Watson JD (1968) The Double Helix (memoir)"],
    existingRoute: "/dna-genetics",
  },
];
