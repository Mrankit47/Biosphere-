export interface Question {
  text: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface Lesson {
  id: string;
  title: string;
  readingTime: string;
  summary: string;
  content: string;
  exploreButtonText: string;
  exploreUrl: string;
}

export interface Journey {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  exploreUrl: string;
  lessons: Lesson[];
  quizzes: Quiz[];
}

export const JOURNEYS: Journey[] = [
  {
    id: "cell-biology",
    title: "Cell Biology",
    description: "Discover the micro-universe of cell structures, organelles, and basic cellular functions.",
    icon: "🔬",
    color: "#39FF14",
    exploreUrl: "/cell-explorer",
    lessons: [
      {
        id: "cell-intro",
        title: "Introduction to cells",
        readingTime: "3 min read",
        summary: "Understand the cell as the fundamental building block of all living organisms.",
        content: `<h3>What is a Cell?</h3>
<p>Cells are the basic structural, functional, and biological units of all known living organisms. A cell is the smallest unit of life that can replicate independently, and cells are often called the "building blocks of life."</p>

<h3>Eukaryotic vs. Prokaryotic Cells</h3>
<p>All cells are divided into two major categories:</p>
<ul>
  <li><strong>Prokaryotic cells:</strong> Simple cells that lack a defined nucleus or membrane-bound organelles. Bacteria are prokaryotes.</li>
  <li><strong>Eukaryotic cells:</strong> Complex cells containing a nucleus and specialized membrane-bound compartments called organelles. Plants, animals, and fungi are eukaryotes.</li>
</ul>

<h3>The Cell Membrane</h3>
<p>Every cell is enveloped by a cell membrane (plasma membrane), which controls what enters and leaves the cell. This barrier is critical for maintaining homeostasis inside the cell.</p>`,
        exploreButtonText: "Explore Cell Membrane in 3D",
        exploreUrl: "/cell-explorer/membrane",
      },
      {
        id: "cell-organelles",
        title: "Cell Organelles: The Cellular Organs",
        readingTime: "4 min read",
        summary: "Learn about specialized organelles like the nucleus, mitochondria, ER, and Golgi.",
        content: `<h3>What are Organelles?</h3>
<p>Like the human body has organs to perform specific tasks, eukaryotic cells contain sub-compartments called organelles. Each organelle has a distinct function to keep the cell alive and healthy.</p>

<h3>Key Organelles and Their Tasks</h3>
<ul>
  <li><strong>The Nucleus:</strong> The control center of the cell. It houses the cell's DNA and coordinates activities like growth and reproduction.</li>
  <li><strong>Mitochondria:</strong> The "powerhouses" of the cell. They convert nutrients into usable energy (ATP) through cellular respiration.</li>
  <li><strong>Endoplasmic Reticulum (ER):</strong> A folded network of membranes. The Rough ER (studded with ribosomes) synthesizes proteins, while the Smooth ER synthesizes lipids and neutralizes toxins.</li>
  <li><strong>Golgi Apparatus:</strong> The shipping department. It sorts, modifies, and packages proteins received from the ER for transport.</li>
</ul>`,
        exploreButtonText: "Examine Organelles in 3D",
        exploreUrl: "/cell-explorer",
      }
    ],
    quizzes: [
      {
        id: "cell-quiz-1",
        title: "Cell Structure Basics",
        questions: [
          {
            text: "Which organelle houses the cell's genetic material (DNA)?",
            options: ["Mitochondria", "Golgi Apparatus", "Nucleus", "Ribosome"],
            answerIndex: 2,
            explanation: "The nucleus is the control center of the cell and houses the genomic DNA."
          },
          {
            text: "Which organelle is known as the powerhouse of the cell?",
            options: ["Endoplasmic Reticulum", "Mitochondria", "Lysosome", "Chloroplast"],
            answerIndex: 1,
            explanation: "Mitochondria produce energy in the form of ATP, which powers cellular processes."
          },
          {
            text: "What type of cell is a bacterium?",
            options: ["Eukaryotic", "Prokaryotic", "Animal Cell", "Plant Cell"],
            answerIndex: 1,
            explanation: "Bacteria are unicellular prokaryotes, meaning they lack a membrane-bound nucleus."
          }
        ]
      }
    ]
  },
  {
    id: "genetics",
    title: "Genetics & DNA",
    description: "Deconstruct the double helix structure, the role of genes, and replication principles.",
    icon: "🧬",
    color: "#E24B4A",
    exploreUrl: "/dna-genetics",
    lessons: [
      {
        id: "dna-structure",
        title: "The DNA Double Helix",
        readingTime: "4 min read",
        summary: "Understand the molecular structure of Deoxyribonucleic Acid (DNA).",
        content: `<h3>The Blueprint of Life</h3>
<p>DNA stands for Deoxyribonucleic Acid. It contains the instructions needed for an organism to develop, survive, and reproduce. These instructions are stored within the sequence of chemical bases along the DNA backbone.</p>

<h3>The Double Helix</h3>
<p>DNA has a double-helix shape, which resembles a twisted ladder. The sides of the ladder are made of sugar (deoxyribose) and phosphate groups. The rungs are composed of four nitrogenous bases:</p>
<ul>
  <li><strong>Adenine (A)</strong></li>
  <li><strong>Thymine (T)</strong></li>
  <li><strong>Guanine (G)</strong></li>
  <li><strong>Cytosine (C)</strong></li>
</ul>

<h3>Complementary Base Pairing</h3>
<p>The nitrogenous bases pair up specifically via hydrogen bonds: <strong>A pairs only with T</strong> (via 2 hydrogen bonds), and <strong>G pairs only with C</strong> (via 3 hydrogen bonds). This strict pairing is vital for accurate replication.</p>`,
        exploreButtonText: "Interact with DNA Helix in 3D",
        exploreUrl: "/dna-genetics",
      },
      {
        id: "genes-inheritance",
        title: "Genes, Codons, and Inheritance",
        readingTime: "3 min read",
        summary: "Explore how genetic codes translate into physical traits.",
        content: `<h3>What is a Gene?</h3>
<p>A gene is a specific segment of DNA that contains instructions for making a protein. Proteins perform most of the work in cells and determine traits like eye color, height, and blood type.</p>

<h3>The Genetic Code</h3>
<p>DNA is read in sets of three bases called <strong>codons</strong>. Each codon specifies a single amino acid. A chain of amino acids folds together to form a functioning protein.</p>

<h3>Inheritance</h3>
<p>Organisms inherit genes from their parents. Humans have two copies of each gene (one from mother, one from father). Differences in these gene variants (alleles) account for the diverse characteristics we see among individuals.</p>`,
        exploreButtonText: "Visualize Genetics Code in 3D",
        exploreUrl: "/dna-genetics",
      }
    ],
    quizzes: [
      {
        id: "genetics-quiz-1",
        title: "DNA & Traits Quiz",
        questions: [
          {
            text: "Which base always pairs with Cytosine (C) in DNA?",
            options: ["Adenine", "Thymine", "Guanine", "Uracil"],
            answerIndex: 2,
            explanation: "Guanine (G) specifically pairs with Cytosine (C) through three hydrogen bonds."
          },
          {
            text: "What are the building blocks of proteins that DNA codes for?",
            options: ["Nucleotides", "Amino Acids", "Fatty Acids", "Monosaccharides"],
            answerIndex: 1,
            explanation: "Codons in DNA code for amino acids, which link together to synthesize proteins."
          }
        ]
      }
    ]
  },
  {
    id: "human-anatomy",
    title: "Human Anatomy",
    description: "Explore skeletal landmarks, cardiac functions, and principal organ systems.",
    icon: "🫀",
    color: "#378ADD",
    exploreUrl: "/human-body",
    lessons: [
      {
        id: "skeleton-basics",
        title: "The Human Skeletal System",
        readingTime: "3 min read",
        summary: "Learn the primary functions and components of the human skeleton.",
        content: `<h3>Support and Protection</h3>
<p>The human skeletal system is the internal framework of the body. An adult human skeleton consists of 206 bones. It provides posture, allows movement via muscle attachments, and shields vital internal organs like the brain, heart, and lungs.</p>

<h3>Bones and Joints</h3>
<p>Bones are living tissues containing calcium deposits and marrow (where blood cells are created). Joints connect bones together and come in different types, such as hinge joints (elbow) and ball-and-socket joints (hip), allowing various degrees of movement.</p>`,
        exploreButtonText: "Open Skeletal Viewer in 3D",
        exploreUrl: "/human-body",
      },
      {
        id: "cardiovascular-system",
        title: "The Cardiovascular System",
        readingTime: "4 min read",
        summary: "Trace blood flow through the heart chambers, arteries, and veins.",
        content: `<h3>The Body's Transport Highway</h3>
<p>The cardiovascular system consists of the heart, blood vessels, and blood. Its role is to deliver oxygen, nutrients, and hormones to cells while removing metabolic wastes like carbon dioxide.</p>

<h3>Heart Anatomy and Circulation</h3>
<p>The heart is a muscular pump with four chambers: two upper atria and two lower ventricles. Circulation follows two loops:</p>
<ul>
  <li><strong>Pulmonary circulation:</strong> The right side of the heart pumps oxygen-depleted blood to the lungs to absorb oxygen.</li>
  <li><strong>Systemic circulation:</strong> Oxygenated blood returns to the left side of the heart, which pumps it to the rest of the body through the aorta.</li>
</ul>`,
        exploreButtonText: "Examine Human Heart in 3D",
        exploreUrl: "/human-body",
      }
    ],
    quizzes: [
      {
        id: "anatomy-quiz-1",
        title: "Anatomy & Systems Quiz",
        questions: [
          {
            text: "How many chambers does the human heart have?",
            options: ["Two", "Three", "Four", "Five"],
            answerIndex: 2,
            explanation: "The human heart consists of 4 chambers: two atria and two ventricles."
          },
          {
            text: "Where in the bones are red blood cells produced?",
            options: ["Bone Marrow", "Compact Bone", "Periosteum", "Joint Cavity"],
            answerIndex: 0,
            explanation: "Red and white blood cells are manufactured inside the soft center of bones called marrow."
          }
        ]
      }
    ]
  },
  {
    id: "microbiology",
    title: "Microbiology & Viruses",
    description: "Compare unicellular organisms (bacteria/amoebae) with viruses and capsid capsules.",
    icon: "🦠",
    color: "#EF9F27",
    exploreUrl: "/microorganisms",
    lessons: [
      {
        id: "bacteria-microbes",
        title: "Microscopic Organisms: Bacteria",
        readingTime: "3 min read",
        summary: "Understand bacterial shapes, structures, and ecological significance.",
        content: `<h3>What are Bacteria?</h3>
<p>Bacteria are microscopic, single-celled organisms that exist in huge numbers in almost every environment on Earth. They are prokaryotes, meaning their DNA float freely in a region called the nucleoid rather than inside a nucleus.</p>

<h3>Beneficial vs. Pathogenic Bacteria</h3>
<p>While some bacteria cause diseases (pathogens), the vast majority are harmless or highly beneficial. Beneficial bacteria help digest food in our gut, decompose organic waste, and capture nitrogen for plants.</p>`,
        exploreButtonText: "Inspect Bacteria in 3D",
        exploreUrl: "/microorganisms",
      },
      {
        id: "virus-capsid",
        title: "The Architecture of Viruses",
        readingTime: "4 min read",
        summary: "Examine capsid shapes, envelope spikes, and viral replication loops.",
        content: `<h3>Are Viruses Alive?</h3>
<p>Viruses are generally not considered fully 'alive' because they cannot replicate, metabolize, or survive independently. They are biological entities that must infect a living host cell to make copies of themselves.</p>

<h3>Viral Structure</h3>
<p>A virus is essentially genetic material (DNA or RNA) wrapped inside a protective protein coat called a <strong>capsid</strong>. Some viruses also possess an outer lipid membrane (envelope) with protein spikes (like the spike proteins of SARS-CoV-2) which act as keys to unlock host cells.</p>`,
        exploreButtonText: "Study Virus Structures in 3D",
        exploreUrl: "/viruses",
      }
    ],
    quizzes: [
      {
        id: "micro-quiz-1",
        title: "Microbes and Viruses Quiz",
        questions: [
          {
            text: "Why are viruses not considered fully alive?",
            options: [
              "They lack genetic material",
              "They cannot reproduce without a host cell",
              "They are too small",
              "They do not contain proteins"
            ],
            answerIndex: 1,
            explanation: "Viruses are obligate intracellular parasites and cannot metabolize or replicate without borrowing a host cell's machinery."
          },
          {
            text: "What is the protective protein shell wrapping a virus's genome called?",
            options: ["Envelope", "Capsid", "Capsule", "Cell Wall"],
            answerIndex: 1,
            explanation: "The capsid is the protein shell that shields the viral DNA or RNA."
          }
        ]
      }
    ]
  },
  {
    id: "ecology",
    title: "Ecology & Ecosystems",
    description: "Analyze food chains, energy flow in trophic pyramids, and biogeochemical cycles.",
    icon: "🌿",
    color: "#1D9E75",
    exploreUrl: "/ecosystems",
    lessons: [
      {
        id: "ecosystems-intro",
        title: "Ecosystems and Energy Flow",
        readingTime: "3 min read",
        summary: "Analyze biological interactions and energy transfers between trophic levels.",
        content: `<h3>What is an Ecosystem?</h3>
<p>An ecosystem is a community of living organisms (biotic factors) interacting with their physical, non-living environment (abiotic factors like water, air, soil, and sunlight).</p>

<h3>Trophic Levels and Food Webs</h3>
<p>Energy enters ecosystems via sunlight and is converted by <strong>producers</strong> (like plants and algae) through photosynthesis. The energy then travels up the food chain through various consumer levels: Primary consumers (herbivores), Secondary consumers (carnivores), and Tertiary consumers (apex predators).</p>`,
        exploreButtonText: "Open Ecosystems Explorer",
        exploreUrl: "/ecosystems",
      },
      {
        id: "trophic-pyramids",
        title: "Trophic Pyramids and the 10% Rule",
        readingTime: "4 min read",
        summary: "Learn how energy decreases as it transfers up the food pyramid.",
        content: `<h3>Energy Loss in Pyramids</h3>
<p>A trophic pyramid models the distribution of biomass or energy across levels. Because organisms use energy to move, grow, and release heat, only a small portion of energy is stored and passed to the next level.</p>

<h3>The 10% Rule</h3>
<p>On average, only about <strong>10% of the energy</strong> from one trophic level is successfully transferred to the next. The remaining 90% is lost as metabolic heat. This dramatic energy loss limits the height of food pyramids, which rarely exceed 4 or 5 levels.</p>`,
        exploreButtonText: "Visualize Trophic Pyramids in 3D",
        exploreUrl: "/ecosystems",
      }
    ],
    quizzes: [
      {
        id: "ecology-quiz-1",
        title: "Ecosystem Dynamics",
        questions: [
          {
            text: "According to the 10% rule in ecology, if producers capture 1,000 kJ of solar energy, how much energy is transferred to primary consumers?",
            options: ["10 kJ", "100 kJ", "500 kJ", "1,000 kJ"],
            answerIndex: 1,
            explanation: "Only 10% of energy transfers to the next level. 10% of 1,000 kJ is 100 kJ."
          },
          {
            text: "Which of the following is an abiotic factor in an ecosystem?",
            options: ["Bacteria", "Plants", "Sunlight", "Insects"],
            answerIndex: 2,
            explanation: "Abiotic factors are non-living physical components, such as sunlight, temperature, and water."
          }
        ]
      }
    ]
  }
];

export function getJourneyById(id: string): Journey | undefined {
  return JOURNEYS.find(j => j.id === id);
}

export function getLessonById(journey: Journey, lessonId: string): Lesson | undefined {
  return journey.lessons.find(l => l.id === lessonId);
}

export function getQuizById(journey: Journey, quizId: string): Quiz | undefined {
  return journey.quizzes.find(q => q.id === quizId);
}
