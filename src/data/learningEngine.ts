// =====================================================
// Biosphere Production Learning Engine — Data Layer
// 10 Programs · Modules · Lessons · Flashcards · Revision
// =====================================================

// ─── Types ───────────────────────────────────────────

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface RevisionNote {
  importantPoints: string[];
  keyTerms: KeyTerm[];
  summary: string;
}

export interface LearningObjective {
  text: string;
  icon: string;
}

export interface EngineLesson {
  id: string;
  title: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  prerequisites: string[];
  objectives: LearningObjective[];
  exploreUrl: string;
  exploreLabel: string;
  simulationUrl?: string;
  askAiPrompt: string;
  flashcards: Flashcard[];
  revision: RevisionNote;
  relatedTopics: string[];
  references: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: EngineLesson[];
  quizId?: string;
  challengeDescription?: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: Difficulty;
  estimatedHours: number;
  prerequisites: string[];
  exploreUrl: string;
  modules: Module[];
  completionRules: string;
}

// ─── Programs ────────────────────────────────────────

export const PROGRAMS: Program[] = [
  // ════════════════════════════════════════════════════
  // 1. CELL BIOLOGY
  // ════════════════════════════════════════════════════
  {
    id: "cell-biology",
    title: "Cell Biology",
    description: "Master the micro-universe of cellular structures, organelle functions, and cell processes.",
    icon: "cell-explorer",
    color: "#39FF14",
    difficulty: "beginner",
    estimatedHours: 8,
    prerequisites: [],
    exploreUrl: "/cell-explorer",
    completionRules: "Complete all modules and pass the Cell Biology quiz with 70%+.",
    modules: [
      {
        id: "cb-foundations",
        title: "Cell Foundations",
        description: "Introduction to cells, cell theory, and types of cells.",
        icon: "🧫",
        quizId: "cell-quiz-1",
        lessons: [
          {
            id: "cell-intro",
            title: "What is a Cell?",
            estimatedMinutes: 8,
            difficulty: "beginner",
            prerequisites: [],
            objectives: [
              { text: "Define cells as the fundamental unit of life", icon: "🎯" },
              { text: "Distinguish between prokaryotic and eukaryotic cells", icon: "🔍" },
              { text: "Explain the cell membrane's role in homeostasis", icon: "🧠" },
            ],
            exploreUrl: "/cell-explorer/membrane",
            exploreLabel: "Explore Cell Membrane in 3D",
            simulationUrl: "/process-simulations",
            askAiPrompt: "Explain the difference between prokaryotic and eukaryotic cells with examples",
            flashcards: [
              { id: "cb-fc-1", front: "What is the basic unit of life?", back: "The cell — it is the smallest unit that can independently carry out all functions of life.", category: "Cell Basics" },
              { id: "cb-fc-2", front: "What type of cell lacks a nucleus?", back: "Prokaryotic cells (e.g., bacteria) have no membrane-bound nucleus.", category: "Cell Types" },
              { id: "cb-fc-3", front: "What is the cell membrane's primary function?", back: "It controls what enters and leaves the cell, maintaining internal homeostasis.", category: "Cell Structure" },
              { id: "cb-fc-4", front: "Name three differences between prokaryotic and eukaryotic cells.", back: "1) Nucleus (absent vs present), 2) Size (smaller vs larger), 3) Organelles (absent vs membrane-bound organelles)", category: "Cell Types" },
            ],
            revision: {
              importantPoints: [
                "Cells are the building blocks of all living organisms.",
                "Prokaryotic cells lack a membrane-bound nucleus; eukaryotic cells have one.",
                "The cell membrane is a selectively permeable lipid bilayer.",
                "All cells arise from pre-existing cells (Cell Theory).",
              ],
              keyTerms: [
                { term: "Cell", definition: "The smallest structural and functional unit of living organisms." },
                { term: "Prokaryote", definition: "An organism with cells that lack a membrane-bound nucleus." },
                { term: "Eukaryote", definition: "An organism with cells containing a membrane-bound nucleus." },
                { term: "Cell Membrane", definition: "A selectively permeable lipid bilayer enclosing the cell." },
                { term: "Homeostasis", definition: "Maintenance of a stable internal environment." },
              ],
              summary: "Cells are the fundamental building blocks of life. They come in two major types: prokaryotic (no nucleus, e.g., bacteria) and eukaryotic (nucleus present, e.g., animal/plant cells). Every cell is bounded by a cell membrane that controls substance exchange.",
            },
            relatedTopics: ["Cell Organelles", "Cell Division", "Membrane Transport"],
            references: ["Campbell Biology, Chapter 6", "Molecular Biology of the Cell, Alberts et al."],
          },
          {
            id: "cell-organelles",
            title: "Cell Organelles",
            estimatedMinutes: 12,
            difficulty: "beginner",
            prerequisites: ["cell-intro"],
            objectives: [
              { text: "Identify major cell organelles and their functions", icon: "🎯" },
              { text: "Compare rough and smooth ER", icon: "🔍" },
              { text: "Explain the role of mitochondria in energy production", icon: "⚡" },
            ],
            exploreUrl: "/cell-explorer",
            exploreLabel: "Examine Organelles in 3D",
            askAiPrompt: "Explain the function of each major cell organelle",
            flashcards: [
              { id: "cb-fc-5", front: "What is the 'powerhouse of the cell'?", back: "Mitochondria — they produce ATP through cellular respiration.", category: "Organelles" },
              { id: "cb-fc-6", front: "What does the Golgi apparatus do?", back: "It modifies, sorts, and packages proteins for secretion or use within the cell.", category: "Organelles" },
              { id: "cb-fc-7", front: "What is the difference between rough and smooth ER?", back: "Rough ER has ribosomes (protein synthesis); Smooth ER lacks ribosomes (lipid synthesis, detox).", category: "Organelles" },
              { id: "cb-fc-8", front: "What does the nucleus contain?", back: "DNA (genetic material), nucleolus, and nuclear pore complexes for transport.", category: "Organelles" },
            ],
            revision: {
              importantPoints: [
                "The nucleus is the control center housing DNA.",
                "Mitochondria generate ATP via cellular respiration.",
                "Rough ER synthesizes proteins; Smooth ER synthesizes lipids.",
                "Golgi apparatus packages and ships proteins.",
                "Lysosomes break down cellular waste.",
              ],
              keyTerms: [
                { term: "Mitochondria", definition: "Organelles that produce ATP through cellular respiration." },
                { term: "Endoplasmic Reticulum", definition: "A network of membranes involved in protein and lipid synthesis." },
                { term: "Golgi Apparatus", definition: "Organelle that modifies, sorts, and packages macromolecules." },
                { term: "Lysosome", definition: "Membrane-bound organelle containing digestive enzymes." },
                { term: "Ribosome", definition: "Molecular machine that synthesizes proteins from mRNA." },
              ],
              summary: "Eukaryotic cells contain specialized organelles. The nucleus stores DNA, mitochondria produce energy (ATP), the ER manufactures proteins and lipids, the Golgi packages them, and lysosomes handle waste recycling.",
            },
            relatedTopics: ["ATP Production", "Protein Synthesis", "Cell Membrane"],
            references: ["Campbell Biology, Chapter 6", "Alberts, Molecular Biology of the Cell"],
          },
          {
            id: "cb-membrane-transport",
            title: "Membrane Transport",
            estimatedMinutes: 10,
            difficulty: "intermediate",
            prerequisites: ["cell-organelles"],
            objectives: [
              { text: "Differentiate passive and active transport", icon: "🎯" },
              { text: "Explain osmosis, diffusion, and facilitated diffusion", icon: "💧" },
              { text: "Describe endocytosis and exocytosis", icon: "📦" },
            ],
            exploreUrl: "/cell-explorer/membrane",
            exploreLabel: "Visualize Membrane Transport",
            simulationUrl: "/process-simulations",
            askAiPrompt: "Explain the different types of membrane transport with real-life analogies",
            flashcards: [
              { id: "cb-fc-9", front: "What is osmosis?", back: "The movement of water molecules across a selectively permeable membrane from low to high solute concentration.", category: "Transport" },
              { id: "cb-fc-10", front: "What is the difference between active and passive transport?", back: "Active transport requires ATP energy; passive transport does not (moves down the concentration gradient).", category: "Transport" },
              { id: "cb-fc-11", front: "What is endocytosis?", back: "The process by which cells engulf substances by folding the membrane inward to form a vesicle.", category: "Transport" },
            ],
            revision: {
              importantPoints: [
                "Passive transport moves molecules down the concentration gradient (no ATP).",
                "Active transport moves molecules against the gradient (requires ATP).",
                "Osmosis is the passive diffusion of water across a semipermeable membrane.",
                "Endocytosis brings material in; exocytosis pushes material out.",
              ],
              keyTerms: [
                { term: "Osmosis", definition: "Diffusion of water across a selectively permeable membrane." },
                { term: "Active Transport", definition: "Energy-dependent movement of molecules against their concentration gradient." },
                { term: "Diffusion", definition: "Net movement of molecules from high to low concentration." },
                { term: "Endocytosis", definition: "Cell uptake of materials by enveloping them in a membrane vesicle." },
              ],
              summary: "Cells move substances across their membranes via passive transport (diffusion, osmosis — no energy) and active transport (requires ATP). Bulk transport methods include endocytosis (in) and exocytosis (out).",
            },
            relatedTopics: ["Cell Membrane Structure", "ATP", "Cellular Respiration"],
            references: ["Campbell Biology, Chapter 7"],
          },
        ],
      },
      {
        id: "cb-division",
        title: "Cell Division",
        description: "Mitosis, meiosis, and the cell cycle.",
        icon: "process-simulations",
        lessons: [
          {
            id: "cb-cell-cycle",
            title: "The Cell Cycle & Mitosis",
            estimatedMinutes: 15,
            difficulty: "intermediate",
            prerequisites: ["cell-organelles"],
            objectives: [
              { text: "Describe the phases of the cell cycle", icon: "🔄" },
              { text: "Explain the stages of mitosis", icon: "🎯" },
              { text: "Understand the importance of cell division for growth and repair", icon: "🧠" },
            ],
            exploreUrl: "/cell-explorer",
            exploreLabel: "Watch Cell Division",
            simulationUrl: "/process-simulations",
            askAiPrompt: "Walk me through each phase of mitosis with diagrams",
            flashcards: [
              { id: "cb-fc-12", front: "What are the four stages of mitosis?", back: "Prophase, Metaphase, Anaphase, Telophase (PMAT).", category: "Cell Division" },
              { id: "cb-fc-13", front: "What is cytokinesis?", back: "The physical division of the cell cytoplasm into two daughter cells after mitosis.", category: "Cell Division" },
              { id: "cb-fc-14", front: "What happens during S phase?", back: "DNA replication occurs — each chromosome is duplicated.", category: "Cell Cycle" },
            ],
            revision: {
              importantPoints: [
                "The cell cycle has three main phases: Interphase (G1, S, G2), Mitosis (PMAT), and Cytokinesis.",
                "DNA replicates during S (synthesis) phase.",
                "Mitosis produces two genetically identical daughter cells.",
                "Checkpoints ensure accurate division.",
              ],
              keyTerms: [
                { term: "Mitosis", definition: "Nuclear division producing two genetically identical daughter nuclei." },
                { term: "Interphase", definition: "The phase between cell divisions where the cell grows and replicates DNA." },
                { term: "Cytokinesis", definition: "Division of the cytoplasm following mitosis." },
                { term: "Chromosome", definition: "A structure of DNA and protein carrying genetic information." },
              ],
              summary: "The cell cycle governs cell growth and division. Interphase prepares the cell by growing and replicating DNA. Mitosis divides the nucleus into two identical copies (Prophase → Metaphase → Anaphase → Telophase), and cytokinesis splits the cytoplasm.",
            },
            relatedTopics: ["Meiosis", "Cancer Biology", "DNA Replication"],
            references: ["Campbell Biology, Chapter 12"],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════
  // 2. HUMAN ANATOMY
  // ════════════════════════════════════════════════════
  {
    id: "human-anatomy",
    title: "Human Anatomy",
    description: "Explore human body systems, organ structures, and physiological processes.",
    icon: "human-body",
    color: "#378ADD",
    difficulty: "intermediate",
    estimatedHours: 12,
    prerequisites: ["cell-biology"],
    exploreUrl: "/human-body",
    completionRules: "Complete all modules and pass the Anatomy quiz with 70%+.",
    modules: [
      {
        id: "ha-skeletal",
        title: "Skeletal System",
        description: "Bones, joints, and the structural framework.",
        icon: "🦴",
        quizId: "anatomy-quiz-1",
        lessons: [
          {
            id: "skeleton-basics",
            title: "The Human Skeleton",
            estimatedMinutes: 10,
            difficulty: "beginner",
            prerequisites: [],
            objectives: [
              { text: "Identify the 206 bones of the adult skeleton", icon: "🦴" },
              { text: "Classify bone types and joint types", icon: "🔍" },
              { text: "Explain how bones protect vital organs", icon: "🛡️" },
            ],
            exploreUrl: "/human-body",
            exploreLabel: "Open 3D Skeletal Viewer",
            askAiPrompt: "Explain the human skeletal system and types of joints",
            flashcards: [
              { id: "ha-fc-1", front: "How many bones are in the adult human skeleton?", back: "206 bones.", category: "Skeletal" },
              { id: "ha-fc-2", front: "What is a ball-and-socket joint?", back: "A joint allowing movement in all directions (e.g., hip and shoulder).", category: "Joints" },
              { id: "ha-fc-3", front: "Where are red blood cells produced?", back: "In the red bone marrow inside bones.", category: "Skeletal" },
            ],
            revision: {
              importantPoints: [
                "The adult skeleton has 206 bones.",
                "Bones provide support, protection, movement, mineral storage, and blood cell production.",
                "Joint types include hinge, ball-and-socket, pivot, and gliding.",
              ],
              keyTerms: [
                { term: "Bone Marrow", definition: "Soft tissue inside bones that produces blood cells." },
                { term: "Cartilage", definition: "Flexible connective tissue found in joints and structures like the ear." },
                { term: "Ligament", definition: "Connective tissue connecting bone to bone." },
              ],
              summary: "The human skeleton is the internal framework of 206 bones providing structure, protection, and enabling movement. Bone marrow produces blood cells, and joints connect bones to allow various ranges of motion.",
            },
            relatedTopics: ["Muscular System", "Cardiovascular System"],
            references: ["Gray's Anatomy, 42nd Edition"],
          },
          {
            id: "cardiovascular-system",
            title: "The Cardiovascular System",
            estimatedMinutes: 12,
            difficulty: "intermediate",
            prerequisites: ["skeleton-basics"],
            objectives: [
              { text: "Trace blood flow through the four heart chambers", icon: "❤️" },
              { text: "Differentiate arteries, veins, and capillaries", icon: "🔍" },
              { text: "Explain pulmonary vs systemic circulation", icon: "🫁" },
            ],
            exploreUrl: "/human-body",
            exploreLabel: "Examine Human Heart in 3D",
            askAiPrompt: "Explain the cardiovascular system and how blood circulates through the body",
            flashcards: [
              { id: "ha-fc-4", front: "How many chambers does the human heart have?", back: "Four: two atria (upper) and two ventricles (lower).", category: "Heart" },
              { id: "ha-fc-5", front: "What is the difference between arteries and veins?", back: "Arteries carry blood away from the heart; veins carry blood toward the heart.", category: "Blood Vessels" },
              { id: "ha-fc-6", front: "What is pulmonary circulation?", back: "The circuit between the heart and lungs for gas exchange (CO₂ → O₂).", category: "Circulation" },
            ],
            revision: {
              importantPoints: [
                "The heart has 4 chambers: 2 atria and 2 ventricles.",
                "Pulmonary circulation: heart ↔ lungs. Systemic circulation: heart ↔ body.",
                "Arteries carry oxygenated blood away; veins return deoxygenated blood.",
              ],
              keyTerms: [
                { term: "Atrium", definition: "Upper chamber of the heart that receives blood." },
                { term: "Ventricle", definition: "Lower chamber of the heart that pumps blood out." },
                { term: "Aorta", definition: "The largest artery, carrying oxygenated blood from the left ventricle." },
              ],
              summary: "The cardiovascular system consists of the heart, blood vessels, and blood. It circulates oxygen and nutrients via two loops: pulmonary (heart ↔ lungs) and systemic (heart ↔ body).",
            },
            relatedTopics: ["Respiratory System", "Blood Composition", "Exercise Physiology"],
            references: ["Guyton's Textbook of Medical Physiology"],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════
  // 3. GENETICS
  // ════════════════════════════════════════════════════
  {
    id: "genetics",
    title: "Genetics & DNA",
    description: "Unravel molecular genetics, DNA replication, inheritance, and gene editing.",
    icon: "dna-genetics",
    color: "#E24B4A",
    difficulty: "intermediate",
    estimatedHours: 10,
    prerequisites: ["cell-biology"],
    exploreUrl: "/dna-genetics",
    completionRules: "Complete all modules and pass the Genetics quiz with 70%+.",
    modules: [
      {
        id: "gen-dna",
        title: "DNA Structure & Replication",
        description: "The molecular architecture of heredity.",
        icon: "🧬",
        quizId: "genetics-quiz-1",
        lessons: [
          {
            id: "dna-structure",
            title: "The DNA Double Helix",
            estimatedMinutes: 12,
            difficulty: "intermediate",
            prerequisites: [],
            objectives: [
              { text: "Describe the structure of the DNA double helix", icon: "🧬" },
              { text: "Explain complementary base pairing rules", icon: "🔗" },
              { text: "Understand the significance of DNA replication", icon: "🔄" },
            ],
            exploreUrl: "/dna-genetics",
            exploreLabel: "Interact with DNA Helix in 3D",
            askAiPrompt: "Explain DNA structure and base pairing with visual analogies",
            flashcards: [
              { id: "gen-fc-1", front: "What bases pair together in DNA?", back: "Adenine pairs with Thymine (A-T), Guanine pairs with Cytosine (G-C).", category: "DNA" },
              { id: "gen-fc-2", front: "What sugar is found in DNA's backbone?", back: "Deoxyribose sugar.", category: "DNA Structure" },
              { id: "gen-fc-3", front: "How many hydrogen bonds connect G and C?", back: "Three hydrogen bonds (vs two for A-T).", category: "Base Pairing" },
            ],
            revision: {
              importantPoints: [
                "DNA is a double helix of two antiparallel strands.",
                "A always pairs with T (2 H-bonds); G always pairs with C (3 H-bonds).",
                "The backbone is made of deoxyribose sugar and phosphate groups.",
                "DNA replication is semi-conservative.",
              ],
              keyTerms: [
                { term: "Nucleotide", definition: "The monomer of DNA: a phosphate group, deoxyribose sugar, and nitrogenous base." },
                { term: "Complementary Base Pairing", definition: "The specific pairing of A-T and G-C in DNA." },
                { term: "Helicase", definition: "Enzyme that unwinds the DNA double helix during replication." },
              ],
              summary: "DNA is a double-stranded helix composed of nucleotides. The two strands are held together by complementary base pairs (A-T, G-C). DNA replication is semi-conservative, producing two identical copies.",
            },
            relatedTopics: ["Gene Expression", "Mutations", "RNA"],
            references: ["Watson & Crick, 1953", "Molecular Biology of the Gene, Watson et al."],
          },
          {
            id: "genes-inheritance",
            title: "Genes & Inheritance",
            estimatedMinutes: 10,
            difficulty: "intermediate",
            prerequisites: ["dna-structure"],
            objectives: [
              { text: "Define genes, alleles, and genotypes", icon: "🧬" },
              { text: "Solve basic Punnett square problems", icon: "📊" },
              { text: "Distinguish dominant from recessive traits", icon: "🔍" },
            ],
            exploreUrl: "/dna-genetics",
            exploreLabel: "Explore Genetic Inheritance",
            askAiPrompt: "Explain Mendelian inheritance with Punnett square examples",
            flashcards: [
              { id: "gen-fc-4", front: "What is an allele?", back: "A variant form of a gene (e.g., brown vs blue eye color gene).", category: "Inheritance" },
              { id: "gen-fc-5", front: "What is a Punnett square used for?", back: "Predicting the genotype and phenotype ratios of offspring.", category: "Inheritance" },
              { id: "gen-fc-6", front: "What does 'heterozygous' mean?", back: "Having two different alleles for a trait (e.g., Bb).", category: "Genetics" },
            ],
            revision: {
              importantPoints: [
                "Genes are segments of DNA coding for proteins/traits.",
                "Alleles are variant forms of a gene.",
                "Dominant alleles mask recessive alleles in heterozygotes.",
                "Punnett squares predict offspring genotype ratios.",
              ],
              keyTerms: [
                { term: "Gene", definition: "A segment of DNA that codes for a specific protein or trait." },
                { term: "Allele", definition: "One of two or more versions of a gene." },
                { term: "Phenotype", definition: "The observable physical characteristics of an organism." },
                { term: "Genotype", definition: "The genetic makeup of an organism (e.g., BB, Bb, bb)." },
              ],
              summary: "Genes are DNA segments coding for traits. Each organism has two alleles per gene (one from each parent). Dominant alleles mask recessive ones. Punnett squares help predict offspring trait ratios.",
            },
            relatedTopics: ["Mutations", "Genetic Disorders", "Epigenetics"],
            references: ["Griffiths et al., Introduction to Genetic Analysis"],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════
  // 4. MICROBIOLOGY
  // ════════════════════════════════════════════════════
  {
    id: "microbiology",
    title: "Microbiology & Viruses",
    description: "Explore bacteria, viruses, single-celled protists, and immune defenses.",
    icon: "microorganisms",
    color: "#EF9F27",
    difficulty: "intermediate",
    estimatedHours: 9,
    prerequisites: ["cell-biology"],
    exploreUrl: "/microorganisms",
    completionRules: "Complete all modules and pass the Microbiology quiz with 70%+.",
    modules: [
      {
        id: "micro-bacteria",
        title: "Bacteria & Archaea",
        description: "Prokaryotic diversity and ecological roles.",
        icon: "cell-explorer",
        quizId: "micro-quiz-1",
        lessons: [
          {
            id: "bacteria-microbes",
            title: "The World of Bacteria",
            estimatedMinutes: 10,
            difficulty: "beginner",
            prerequisites: [],
            objectives: [
              { text: "Classify bacteria by shape and arrangement", icon: "🔍" },
              { text: "Distinguish beneficial from pathogenic bacteria", icon: "⚖️" },
              { text: "Explain bacterial reproduction (binary fission)", icon: "🔄" },
            ],
            exploreUrl: "/microorganisms",
            exploreLabel: "Inspect Bacteria in 3D",
            askAiPrompt: "Explain bacterial classification, shapes, and their role in ecosystems",
            flashcards: [
              { id: "micro-fc-1", front: "What are the three main bacterial shapes?", back: "Cocci (spherical), Bacilli (rod-shaped), Spirilla (spiral).", category: "Bacteria" },
              { id: "micro-fc-2", front: "How do bacteria reproduce?", back: "Binary fission — one cell divides into two identical daughter cells.", category: "Reproduction" },
              { id: "micro-fc-3", front: "Name a beneficial role of bacteria.", back: "Gut bacteria aid digestion; soil bacteria fix nitrogen for plants.", category: "Ecology" },
            ],
            revision: {
              importantPoints: [
                "Bacteria are unicellular prokaryotes found in virtually every habitat.",
                "Shapes: cocci, bacilli, spirilla.",
                "Binary fission is rapid asexual reproduction.",
                "Most bacteria are beneficial; only a fraction are pathogenic.",
              ],
              keyTerms: [
                { term: "Binary Fission", definition: "Asexual reproduction in which a cell divides into two identical cells." },
                { term: "Pathogen", definition: "A microorganism that causes disease." },
                { term: "Nitrogen Fixation", definition: "Conversion of atmospheric N₂ into usable ammonia by bacteria." },
              ],
              summary: "Bacteria are diverse prokaryotes classified by shape. They reproduce via binary fission and play crucial ecological roles. While some cause disease, the vast majority are essential for nutrient cycling and human health.",
            },
            relatedTopics: ["Viruses", "Immune System", "Antibiotic Resistance"],
            references: ["Prescott's Microbiology, 11th Edition"],
          },
          {
            id: "virus-capsid",
            title: "Viruses & Viral Replication",
            estimatedMinutes: 12,
            difficulty: "intermediate",
            prerequisites: ["bacteria-microbes"],
            objectives: [
              { text: "Describe viral structure (capsid, envelope, genome)", icon: "🦠" },
              { text: "Explain the lytic and lysogenic cycles", icon: "🔄" },
              { text: "Debate whether viruses are 'alive'", icon: "💭" },
            ],
            exploreUrl: "/viruses",
            exploreLabel: "Study Virus Structures in 3D",
            askAiPrompt: "Explain viral structure and replication cycles with examples like SARS-CoV-2",
            flashcards: [
              { id: "micro-fc-4", front: "What is a viral capsid?", back: "A protein shell enclosing the viral genome (DNA or RNA).", category: "Virology" },
              { id: "micro-fc-5", front: "What is the lytic cycle?", back: "A viral replication cycle that ends with cell lysis (burst) releasing new viruses.", category: "Replication" },
              { id: "micro-fc-6", front: "Why are viruses not considered 'alive'?", back: "They cannot reproduce, metabolize, or maintain homeostasis without a host cell.", category: "Virology" },
            ],
            revision: {
              importantPoints: [
                "Viruses are acellular and obligate intracellular parasites.",
                "Structure: nucleic acid core + capsid ± envelope.",
                "Lytic cycle: attachment → injection → replication → lysis.",
                "Lysogenic cycle: viral DNA integrates into host genome.",
              ],
              keyTerms: [
                { term: "Capsid", definition: "Protein coat surrounding a virus's genetic material." },
                { term: "Lytic Cycle", definition: "Viral replication ending in host cell destruction." },
                { term: "Lysogenic Cycle", definition: "Viral DNA integrates into host DNA, replicating passively." },
              ],
              summary: "Viruses are non-living entities composed of genetic material wrapped in a protein capsid. They hijack host cells to replicate via lytic (destructive) or lysogenic (dormant integration) cycles.",
            },
            relatedTopics: ["Immune Response", "Vaccines", "Pandemic Biology"],
            references: ["Fields Virology, 7th Edition"],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════
  // 5. BOTANY
  // ════════════════════════════════════════════════════
  {
    id: "botany",
    title: "Botany & Plant Science",
    description: "Discover plant structures, photosynthesis, vascular transport, and adaptations.",
    icon: "photosynthesis",
    color: "#22C55E",
    difficulty: "beginner",
    estimatedHours: 8,
    prerequisites: ["cell-biology"],
    exploreUrl: "/virtual-lab",
    completionRules: "Complete all modules and the Photosynthesis lab.",
    modules: [
      {
        id: "bot-structure",
        title: "Plant Structure & Function",
        description: "Roots, stems, leaves, and vascular tissue.",
        icon: "🌿",
        lessons: [
          {
            id: "bot-plant-cells",
            title: "Plant Cells & Tissues",
            estimatedMinutes: 10,
            difficulty: "beginner",
            prerequisites: [],
            objectives: [
              { text: "Identify structures unique to plant cells", icon: "🌿" },
              { text: "Explain the role of chloroplasts and cell walls", icon: "🔬" },
              { text: "Compare plant and animal cells", icon: "⚖️" },
            ],
            exploreUrl: "/cell-explorer",
            exploreLabel: "Compare Cell Types in 3D",
            simulationUrl: "/virtual-lab",
            askAiPrompt: "Compare plant and animal cells, highlighting unique plant cell structures",
            flashcards: [
              { id: "bot-fc-1", front: "What structures do plant cells have that animal cells lack?", back: "Cell wall, chloroplasts, central vacuole, and plasmodesmata.", category: "Plant Cells" },
              { id: "bot-fc-2", front: "What is the function of chloroplasts?", back: "Site of photosynthesis — converts light energy into glucose.", category: "Photosynthesis" },
              { id: "bot-fc-3", front: "What is the cell wall made of?", back: "Primarily cellulose, providing structural support and protection.", category: "Structure" },
            ],
            revision: {
              importantPoints: [
                "Plant cells have cell walls, chloroplasts, and a large central vacuole.",
                "Chloroplasts contain chlorophyll for photosynthesis.",
                "The cell wall is made of cellulose and provides rigidity.",
              ],
              keyTerms: [
                { term: "Chloroplast", definition: "Organelle where photosynthesis occurs in plant cells." },
                { term: "Cell Wall", definition: "Rigid cellulose layer outside the cell membrane in plants." },
                { term: "Central Vacuole", definition: "Large water-filled organelle maintaining turgor pressure." },
              ],
              summary: "Plant cells differ from animal cells by having cell walls (cellulose), chloroplasts (photosynthesis), and a large central vacuole (water storage and turgor pressure).",
            },
            relatedTopics: ["Photosynthesis", "Plant Reproduction", "Ecology"],
            references: ["Raven Biology of Plants, 8th Edition"],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════
  // 6. ZOOLOGY
  // ════════════════════════════════════════════════════
  {
    id: "zoology",
    title: "Zoology",
    description: "Survey the animal kingdom from invertebrates to complex vertebrate systems.",
    icon: "🦁",
    color: "#F59E0B",
    difficulty: "intermediate",
    estimatedHours: 10,
    prerequisites: ["cell-biology"],
    exploreUrl: "/rare-species",
    completionRules: "Complete all modules and the species identification challenge.",
    modules: [
      {
        id: "zoo-classification",
        title: "Animal Classification",
        description: "Taxonomy and major animal phyla.",
        icon: "🐾",
        lessons: [
          {
            id: "zoo-taxonomy",
            title: "Animal Taxonomy & Phyla",
            estimatedMinutes: 12,
            difficulty: "intermediate",
            prerequisites: [],
            objectives: [
              { text: "Use Linnaean classification hierarchy", icon: "📋" },
              { text: "Identify major animal phyla", icon: "🔍" },
              { text: "Distinguish vertebrates from invertebrates", icon: "🦴" },
            ],
            exploreUrl: "/tree-of-life",
            exploreLabel: "Explore the Tree of Life",
            askAiPrompt: "Explain the Linnaean classification system with animal examples",
            flashcards: [
              { id: "zoo-fc-1", front: "What is the Linnaean hierarchy?", back: "Kingdom → Phylum → Class → Order → Family → Genus → Species (King Philip Came Over For Good Spaghetti).", category: "Taxonomy" },
              { id: "zoo-fc-2", front: "What defines a vertebrate?", back: "An animal with a backbone (spinal column), e.g., mammals, birds, reptiles.", category: "Classification" },
              { id: "zoo-fc-3", front: "What is the largest animal phylum?", back: "Arthropoda (insects, crustaceans, arachnids) — over 1 million species.", category: "Diversity" },
            ],
            revision: {
              importantPoints: [
                "Taxonomy classifies organisms: Kingdom → Phylum → Class → Order → Family → Genus → Species.",
                "Vertebrates have a backbone; invertebrates do not.",
                "Arthropoda is the most species-rich phylum.",
              ],
              keyTerms: [
                { term: "Taxonomy", definition: "The science of classifying organisms." },
                { term: "Phylum", definition: "A major taxonomic rank between kingdom and class." },
                { term: "Vertebrate", definition: "An animal possessing a spinal column." },
              ],
              summary: "Animals are classified using Linnaean taxonomy. The animal kingdom is divided into major phyla. Vertebrates (with backbones) and invertebrates (without) represent a fundamental division in zoology.",
            },
            relatedTopics: ["Evolution", "Biodiversity", "Endangered Species"],
            references: ["Hickman's Integrated Principles of Zoology"],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════
  // 7. ECOLOGY
  // ════════════════════════════════════════════════════
  {
    id: "ecology",
    title: "Ecology & Environment",
    description: "Study food webs, biomes, biogeochemical cycles, and ecosystem dynamics.",
    icon: "ecosystems",
    color: "#1D9E75",
    difficulty: "intermediate",
    estimatedHours: 9,
    prerequisites: ["cell-biology", "botany"],
    exploreUrl: "/ecosystems",
    completionRules: "Complete all modules and the ecosystem simulation.",
    modules: [
      {
        id: "eco-foundations",
        title: "Ecosystem Foundations",
        description: "Energy flow, trophic levels, and food webs.",
        icon: "🌍",
        quizId: "ecology-quiz-1",
        lessons: [
          {
            id: "ecosystems-intro",
            title: "Ecosystems & Energy Flow",
            estimatedMinutes: 10,
            difficulty: "beginner",
            prerequisites: [],
            objectives: [
              { text: "Define ecosystem, biotic, and abiotic factors", icon: "🌍" },
              { text: "Trace energy flow through trophic levels", icon: "⚡" },
              { text: "Apply the 10% rule to energy pyramids", icon: "📐" },
            ],
            exploreUrl: "/ecosystems",
            exploreLabel: "Open Ecosystem Explorer",
            simulationUrl: "/ecosystem-simulator",
            askAiPrompt: "Explain trophic levels and the 10% energy rule with a food chain example",
            flashcards: [
              { id: "eco-fc-1", front: "What is the 10% rule in ecology?", back: "Only ~10% of energy is transferred from one trophic level to the next; 90% is lost as heat.", category: "Energy" },
              { id: "eco-fc-2", front: "What is an abiotic factor?", back: "A non-living physical component of an ecosystem (sunlight, water, temperature, soil).", category: "Ecology" },
              { id: "eco-fc-3", front: "What are producers?", back: "Organisms that make their own food via photosynthesis (plants, algae).", category: "Trophic Levels" },
            ],
            revision: {
              importantPoints: [
                "Ecosystems = biotic (living) + abiotic (non-living) components.",
                "Energy enters via producers (photosynthesis) and flows up trophic levels.",
                "Only ~10% of energy transfers between levels.",
                "Food webs show interconnected feeding relationships.",
              ],
              keyTerms: [
                { term: "Trophic Level", definition: "A feeding level in a food chain (producers, primary consumers, etc.)." },
                { term: "Producers", definition: "Autotrophs that convert sunlight to chemical energy." },
                { term: "Decomposers", definition: "Organisms that break down dead matter, recycling nutrients." },
              ],
              summary: "Ecosystems are communities of organisms interacting with their physical environment. Energy flows from producers through consumers, losing ~90% at each trophic level. Food webs model these complex feeding relationships.",
            },
            relatedTopics: ["Carbon Cycle", "Biodiversity", "Conservation"],
            references: ["Odum's Fundamentals of Ecology"],
          },
          {
            id: "trophic-pyramids",
            title: "Trophic Pyramids and the 10% Rule",
            estimatedMinutes: 12,
            difficulty: "intermediate",
            prerequisites: ["ecosystems-intro"],
            objectives: [
              { text: "Understand energy flow and limitation in food pyramids", icon: "📐" },
              { text: "Calculate energy transfers using the 10% rule", icon: "⚡" },
              { text: "Differentiate biomass and numbers pyramids", icon: "🔍" },
            ],
            exploreUrl: "/ecosystems",
            exploreLabel: "Visualize Trophic Pyramids in 3D",
            simulationUrl: "/ecosystem-simulator",
            askAiPrompt: "Explain the difference between energy, biomass, and numbers pyramids in ecology",
            flashcards: [
              { id: "eco-fc-4", front: "Why are trophic levels in a food chain limited?", back: "Due to energy loss (90% per level); there isn't enough energy at the top to support higher levels.", category: "Trophic Levels" },
              { id: "eco-fc-5", front: "What does an energy pyramid represent?", back: "The total amount of energy present at each trophic level in an ecosystem.", category: "Pyramids" },
            ],
            revision: {
              importantPoints: [
                "Only 10% of energy transfers to the next level.",
                "Trophic levels rarely exceed 4 or 5 levels.",
                "Pyramids of energy are always upright, whereas pyramids of numbers/biomass can be inverted.",
              ],
              keyTerms: [
                { term: "Trophic Pyramid", definition: "A graphical representation of the distribution of biomass or energy across trophic levels." },
                { term: "10% Rule", definition: "The rule stating that only 10% of energy is passed to the next level." },
              ],
              summary: "Trophic pyramids show energy distribution. Due to the 10% rule, energy diminishes exponentially as we go up, which limits food chains to 4-5 levels.",
            },
            relatedTopics: ["Food Webs", "Biogeochemical Cycles", "Ecosystem Conservation"],
            references: ["Campbell Biology, Chapter 55"],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════
  // 8. BIOTECHNOLOGY
  // ════════════════════════════════════════════════════
  {
    id: "biotechnology",
    title: "Biotechnology",
    description: "Explore genetic engineering, CRISPR, cloning, and real-world biotech applications.",
    icon: "🧪",
    color: "#A855F7",
    difficulty: "advanced",
    estimatedHours: 8,
    prerequisites: ["genetics", "microbiology"],
    exploreUrl: "/virtual-lab",
    completionRules: "Complete all modules and the CRISPR simulation challenge.",
    modules: [
      {
        id: "biotech-gene-eng",
        title: "Genetic Engineering",
        description: "Recombinant DNA, cloning, and gene therapy.",
        icon: "✂️",
        lessons: [
          {
            id: "biotech-crispr",
            title: "CRISPR & Gene Editing",
            estimatedMinutes: 15,
            difficulty: "advanced",
            prerequisites: ["gen-double-helix"],
            objectives: [
              { text: "Explain the CRISPR-Cas9 mechanism", icon: "✂️" },
              { text: "Discuss ethical implications of gene editing", icon: "⚖️" },
              { text: "Identify real-world applications of CRISPR", icon: "🌍" },
            ],
            exploreUrl: "/virtual-lab",
            exploreLabel: "Try the Gene Editing Simulation",
            simulationUrl: "/virtual-lab",
            askAiPrompt: "Explain how CRISPR-Cas9 works and its applications in medicine and agriculture",
            flashcards: [
              { id: "biotech-fc-1", front: "What does CRISPR stand for?", back: "Clustered Regularly Interspaced Short Palindromic Repeats.", category: "CRISPR" },
              { id: "biotech-fc-2", front: "What is the role of Cas9 in CRISPR?", back: "Cas9 is the 'molecular scissors' enzyme that cuts DNA at the target site.", category: "CRISPR" },
              { id: "biotech-fc-3", front: "Name a medical application of CRISPR.", back: "Treating sickle cell disease by editing the hemoglobin gene.", category: "Applications" },
            ],
            revision: {
              importantPoints: [
                "CRISPR-Cas9 allows precise editing of DNA sequences.",
                "Guide RNA directs Cas9 to the target location.",
                "Applications: disease treatment, crop improvement, research.",
                "Ethical debates center on germline editing in humans.",
              ],
              keyTerms: [
                { term: "CRISPR", definition: "A gene-editing system using guide RNA and Cas9 enzyme." },
                { term: "Guide RNA", definition: "A short RNA sequence that directs Cas9 to the target DNA." },
                { term: "Gene Therapy", definition: "Treating disease by modifying a patient's genes." },
              ],
              summary: "CRISPR-Cas9 is a revolutionary gene-editing technology using guide RNA to direct the Cas9 enzyme to cut DNA at precise locations. It has transformative applications in medicine, agriculture, and research, but raises significant ethical questions.",
            },
            relatedTopics: ["Gene Therapy", "GMOs", "Bioethics"],
            references: ["Doudna & Charpentier, 2012", "Nature Reviews Genetics"],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════
  // 9. EVOLUTION
  // ════════════════════════════════════════════════════
  {
    id: "evolution",
    title: "Evolution",
    description: "Trace the history of life through natural selection, speciation, and phylogenetics.",
    icon: "🌳",
    color: "#06B6D4",
    difficulty: "intermediate",
    estimatedHours: 9,
    prerequisites: ["genetics"],
    exploreUrl: "/tree-of-life",
    completionRules: "Complete all modules and the phylogenetic tree challenge.",
    modules: [
      {
        id: "evo-natural-selection",
        title: "Natural Selection",
        description: "Darwin's theory and mechanisms of evolution.",
        icon: "🐦",
        lessons: [
          {
            id: "evo-darwin",
            title: "Darwin & Natural Selection",
            estimatedMinutes: 12,
            difficulty: "intermediate",
            prerequisites: [],
            objectives: [
              { text: "Explain Darwin's theory of natural selection", icon: "🐦" },
              { text: "Identify the four conditions for natural selection", icon: "📋" },
              { text: "Provide examples of adaptation", icon: "🦎" },
            ],
            exploreUrl: "/tree-of-life",
            exploreLabel: "Explore Evolutionary Tree",
            askAiPrompt: "Explain Darwin's theory of natural selection with the finch beak example",
            flashcards: [
              { id: "evo-fc-1", front: "What are the four conditions for natural selection?", back: "1) Variation, 2) Heritability, 3) Differential reproduction, 4) Overproduction of offspring.", category: "Evolution" },
              { id: "evo-fc-2", front: "What is adaptation?", back: "A trait that increases an organism's fitness in its environment.", category: "Natural Selection" },
              { id: "evo-fc-3", front: "What is 'survival of the fittest'?", back: "Organisms best adapted to their environment are more likely to survive and reproduce.", category: "Evolution" },
            ],
            revision: {
              importantPoints: [
                "Natural selection acts on heritable variation in populations.",
                "Fitness = reproductive success, not physical strength.",
                "Adaptations evolve over many generations.",
                "Evidence: fossils, homologous structures, DNA comparisons.",
              ],
              keyTerms: [
                { term: "Natural Selection", definition: "Differential survival and reproduction based on traits." },
                { term: "Adaptation", definition: "A heritable trait that improves survival or reproduction." },
                { term: "Fitness", definition: "An organism's ability to survive and reproduce in its environment." },
              ],
              summary: "Natural selection is the mechanism of evolution. Organisms with heritable traits better suited to their environment survive and reproduce more successfully. Over generations, this leads to adaptation and speciation.",
            },
            relatedTopics: ["Speciation", "Fossil Record", "Comparative Anatomy"],
            references: ["On the Origin of Species, Darwin 1859", "Futuyma's Evolutionary Biology"],
          },
        ],
      },
    ],
  },

  // ════════════════════════════════════════════════════
  // 10. HUMAN PHYSIOLOGY
  // ════════════════════════════════════════════════════
  {
    id: "human-physiology",
    title: "Human Physiology",
    description: "Understand how organ systems function together to maintain life.",
    icon: "🫁",
    color: "#EC4899",
    difficulty: "advanced",
    estimatedHours: 14,
    prerequisites: ["human-anatomy", "cell-biology"],
    exploreUrl: "/human-body",
    completionRules: "Complete all modules and pass the Physiology assessment with 75%+.",
    modules: [
      {
        id: "phys-nervous",
        title: "Nervous System",
        description: "Neurons, synapses, and the brain.",
        icon: "🧠",
        lessons: [
          {
            id: "phys-neurons",
            title: "Neurons & Signal Transmission",
            estimatedMinutes: 14,
            difficulty: "advanced",
            prerequisites: ["ha-bones"],
            objectives: [
              { text: "Describe the structure of a neuron", icon: "🧠" },
              { text: "Explain how action potentials propagate", icon: "⚡" },
              { text: "Differentiate sensory, motor, and interneurons", icon: "🔍" },
            ],
            exploreUrl: "/human-body",
            exploreLabel: "Explore the Nervous System in 3D",
            askAiPrompt: "Explain how neurons transmit signals using action potentials",
            flashcards: [
              { id: "phys-fc-1", front: "What are the three types of neurons?", back: "Sensory (afferent), Motor (efferent), and Interneurons (relay).", category: "Neuroscience" },
              { id: "phys-fc-2", front: "What is an action potential?", back: "A rapid change in membrane potential that propagates along a neuron's axon.", category: "Signals" },
              { id: "phys-fc-3", front: "What is the synapse?", back: "The junction between two neurons where neurotransmitters transmit signals.", category: "Neuroscience" },
            ],
            revision: {
              importantPoints: [
                "Neurons have a cell body, dendrites (input), and axon (output).",
                "Action potentials are all-or-nothing electrical signals.",
                "Synapses use neurotransmitters for chemical signal transmission.",
                "The nervous system coordinates all body functions.",
              ],
              keyTerms: [
                { term: "Neuron", definition: "A nerve cell that transmits electrical and chemical signals." },
                { term: "Synapse", definition: "The gap between neurons where neurotransmitters are released." },
                { term: "Action Potential", definition: "An electrical impulse traveling along a neuron's axon." },
                { term: "Neurotransmitter", definition: "Chemical messenger released at synapses (e.g., dopamine, serotonin)." },
              ],
              summary: "Neurons are the signaling units of the nervous system. They transmit information via electrical action potentials along axons and chemical neurotransmitters across synapses. Three types — sensory, motor, and interneurons — coordinate all body functions.",
            },
            relatedTopics: ["Brain Anatomy", "Reflex Arcs", "Endocrine System"],
            references: ["Guyton's Medical Physiology", "Purves Neuroscience, 6th Ed"],
          },
        ],
      },
    ],
  },
];

// ─── Helper Functions ────────────────────────────────

export function getProgramById(id: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}

export function getModuleById(programId: string, moduleId: string): Module | undefined {
  const program = getProgramById(programId);
  return program?.modules.find((m) => m.id === moduleId);
}

export function getEngineLessonById(lessonId: string): { program: Program; module: Module; lesson: EngineLesson } | undefined {
  for (const program of PROGRAMS) {
    for (const mod of program.modules) {
      const lesson = mod.lessons.find((l) => l.id === lessonId);
      if (lesson) return { program, module: mod, lesson };
    }
  }
  return undefined;
}

export function getAllLessonsFlat(): { programId: string; moduleId: string; lesson: EngineLesson }[] {
  const result: { programId: string; moduleId: string; lesson: EngineLesson }[] = [];
  for (const program of PROGRAMS) {
    for (const mod of program.modules) {
      for (const lesson of mod.lessons) {
        result.push({ programId: program.id, moduleId: mod.id, lesson });
      }
    }
  }
  return result;
}

export function getNextLesson(currentLessonId: string): EngineLesson | null {
  const all = getAllLessonsFlat();
  const idx = all.findIndex((e) => e.lesson.id === currentLessonId);
  return idx >= 0 && idx < all.length - 1 ? all[idx + 1].lesson : null;
}

export function getPrevLesson(currentLessonId: string): EngineLesson | null {
  const all = getAllLessonsFlat();
  const idx = all.findIndex((e) => e.lesson.id === currentLessonId);
  return idx > 0 ? all[idx - 1].lesson : null;
}

export function getLessonFlashcards(lessonId: string): Flashcard[] {
  const found = getEngineLessonById(lessonId);
  return found?.lesson.flashcards || [];
}

export function getLessonRevision(lessonId: string): RevisionNote | null {
  const found = getEngineLessonById(lessonId);
  return found?.lesson.revision || null;
}

export function getProgramLessonCount(programId: string): number {
  const program = getProgramById(programId);
  if (!program) return 0;
  return program.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
}

export function getProgramFlashcardCount(programId: string): number {
  const program = getProgramById(programId);
  if (!program) return 0;
  return program.modules.reduce(
    (sum, mod) => sum + mod.lessons.reduce((s, l) => s + l.flashcards.length, 0),
    0
  );
}
