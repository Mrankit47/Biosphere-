// ═══════════════════════════════════════════════════════════════
// Biosphere — Molecular Biology Objects Database
// ═══════════════════════════════════════════════════════════════

import type { MolecularObject } from "../types";

export const MOLECULAR_OBJECTS: Record<string, MolecularObject> = {
  dna: {
    id: "dna",
    name: "Deoxyribonucleic Acid",
    symbol: "DNA",
    category: "dna",
    subcategory: "Nucleic Acid Polymer",
    icon: "🧬",
    accentColor: "#3B82F6",
    difficulty: "beginner",
    estimatedStudyMinutes: 15,

    overview:
      "The fundamental hereditary molecule containing the genetic instructions for the development, functioning, growth, and reproduction of all living organisms.",
    definition:
      "A antiparallel double-helical polymer composed of repeating deoxyribonucleotide units linked by phosphodiester bonds.",
    chemicalFormula: "(C10H13N5O6P)n",
    locationInCell: ["Cell Nucleus", "Mitochondrial Matrix", "Chloroplast Stroma"],
    primaryFunction: "Long-term storage of genetic information and template for RNA transcription.",
    biologicalImportance:
      "Preserves genetic fidelity across generations through semi-conservative replication and precise base-pairing rules (A-T, G-C).",

    sequenceExample: "ATGCGATCGATCGATC",
    complementarySequence: "TACGCTAGCTAGCTAG",

    keyComponents: [
      { name: "Deoxyribose Sugar", description: "5-carbon sugar lacking a 2' hydroxyl (-OH) group." },
      { name: "Phosphate Backbone", description: "Negatively charged backbone forming 5' to 3' phosphodiester linkages." },
      { name: "Nitrogenous Bases", description: "Adenine, Thymine, Guanine, Cytosine held by hydrogen bonds." }
    ],

    clinicalRelevance:
      "DNA mutations, strand breaks, and repair failures lead to oncogenesis (cancer), hereditary genetic disorders (Sickle Cell, CF), and aging.",
    associatedDiseaseIds: ["cancer", "cystic_fibrosis", "sickle_cell"],
    associatedOrganIds: ["bone-marrow", "liver"],
    associatedCellIds: ["stem-cell", "leukocyte"],

    visualizationType: "3d-dna",
    model3DConfig: {
      strandColor1: "#3B82F6",
      strandColor2: "#10B981"
    },

    xpReward: 200,
    discoverers: [
      { name: "James Watson & Francis Crick", contribution: "Elucidated 3D double helix model", year: "1953" },
      { name: "Rosalind Franklin & Maurice Wilkins", contribution: "X-ray diffraction photograph 51 demonstrating helical diffraction pattern", year: "1952" }
    ],
    references: [
      "Watson JD, Crick FH (1953) Molecular Structure of Nucleic Acids. Nature 171:737-738.",
      "Campbell Biology, 12th Edition, Chapter 16."
    ]
  },

  rna: {
    id: "rna",
    name: "Ribonucleic Acid",
    symbol: "RNA",
    category: "rna",
    subcategory: "Single-Stranded Nucleic Acid",
    icon: "🧪",
    accentColor: "#10B981",
    difficulty: "beginner",
    estimatedStudyMinutes: 12,

    overview:
      "A versatile single-stranded nucleic acid molecule that translates genetic information encoded in DNA into functional proteins.",
    definition:
      "A polymeric molecule essential in coding, decoding, regulation, and expression of genes, containing ribose sugar and Uracil (U) in place of Thymine (T).",
    locationInCell: ["Nucleolus", "Cytoplasm", "Ribosome", "Endoplasmic Reticulum"],
    primaryFunction: "Serves as template (mRNA), adaptor (tRNA), and structural catalytic core (rRNA) during protein synthesis.",
    biologicalImportance:
      "Acts as the functional intermediary of the Central Dogma of Molecular Biology (DNA → RNA → Protein).",

    sequenceExample: "AUGCGAUCGAUCGAUC",
    complementarySequence: "UACGCUAGCUAGCUAG",

    keyComponents: [
      { name: "Ribose Sugar", description: "5-carbon sugar containing a reactive 2' hydroxyl (-OH) group." },
      { name: "Uracil Base", description: "Pyrimidine base replacing Thymine; pairs with Adenine via 2 hydrogen bonds." }
    ],

    clinicalRelevance:
      "RNA viruses (SARS-CoV-2, HIV, Influenza) utilize RNA genomes; mRNA technology powers lipid-nanoparticle vaccines.",
    associatedDiseaseIds: ["covid-19", "influenza"],
    associatedOrganIds: ["lungs"],
    associatedCellIds: ["pneumocyte", "lymphocyte"],

    visualizationType: "sequence",
    xpReward: 180,
    discoverers: [
      { name: "Severo Ochoa", contribution: "Discovered polynucleotide phosphorylase enzyme synthesizing RNA", year: "1955" }
    ],
    references: ["Nature Reviews Genetics: Functions of Non-Coding RNAs (2024)."]
  },

  mrna: {
    id: "mrna",
    name: "Messenger RNA",
    symbol: "mRNA",
    category: "rna",
    subcategory: "Coding RNA Transcript",
    icon: "📜",
    accentColor: "#F59E0B",
    difficulty: "intermediate",
    estimatedStudyMinutes: 15,

    overview:
      "The single-stranded RNA transcript transcribed from a DNA gene that carries the protein-building sequence code to the ribosome.",
    definition:
      "Processed RNA molecule featuring a 5' 7-methylguanosine cap, coding exons, 3' UTR, and poly-A tail.",
    locationInCell: ["Nucleus (splicing)", "Cytoplasm (translation)"],
    primaryFunction: "Transports genetic code from nucleus to cytoplasmic ribosomes for translation.",
    biologicalImportance:
      "Enables regulated gene expression and protein abundance tuning through mRNA half-life and splicing modulation.",

    sequenceExample: "AUG-UUU-GUC-UAA",

    keyComponents: [
      { name: "5' Cap", description: "7-methylguanosine cap shielding transcript from exonuclease degradation." },
      { name: "Coding Exons", description: "Translated nucleotide sequences specifying amino acid codons." },
      { name: "Poly-A Tail", description: "200+ adenine nucleotide tail regulating mRNA stability and export." }
    ],

    clinicalRelevance:
      "Basis of modern mRNA vaccines (COVID-19 mRNA-1273/BNT162b2) and therapeutic mRNA replacement therapies.",
    associatedDiseaseIds: ["covid-19", "cancer"],
    associatedOrganIds: ["lungs", "liver"],
    associatedCellIds: ["macrophage"],

    visualizationType: "sequence",
    xpReward: 200,
    discoverers: [
      { name: "Sydney Brenner, François Jacob & Matthew Meselson", contribution: "Discovered mRNA messenger molecules", year: "1961" },
      { name: "Katalin Karikó & Drew Weissman", contribution: "Developed nucleoside modifications enabling mRNA therapies", year: "2023" }
    ],
    references: ["Nobel Prize in Physiology or Medicine (2023)."]
  },

  trna: {
    id: "trna",
    name: "Transfer RNA",
    symbol: "tRNA",
    category: "rna",
    subcategory: "Adaptor RNA",
    icon: "🧩",
    accentColor: "#8B5CF6",
    difficulty: "intermediate",
    estimatedStudyMinutes: 12,

    overview:
      "A cloverleaf-shaped adaptor RNA molecule that matches specific mRNA codons to their corresponding amino acid residues during translation.",
    definition:
      "A small ~76-90 nucleotide folded RNA featuring a 3' CCA amino acid attachment site and a 3-base anticodon loop.",
    locationInCell: ["Cytoplasm", "Ribosome A/P/E Sites"],
    primaryFunction: "Delivers specific amino acids to the active ribosomal peptidyl transferase center.",
    biologicalImportance: "Decodes the universal genetic code with high fidelity via aminoacyl-tRNA synthetase proofreading.",

    keyComponents: [
      { name: "Anticodon Loop", description: "3-nucleotide sequence complementary to specific mRNA codon." },
      { name: "3' CCA Acceptor Stem", description: "Covalent attachment site for cognate amino acid." }
    ],

    clinicalRelevance: "Mutations in mitochondrial tRNA genes cause MELAS syndrome and MERFF encephalomyopathy.",
    associatedDiseaseIds: ["mitochondrial_encephalopathy"],
    associatedOrganIds: ["brain", "heart"],
    associatedCellIds: ["myocyte"],

    visualizationType: "sequence",
    xpReward: 180,
    discoverers: [
      { name: "Robert Holley", contribution: "Determined nucleotide sequence and cloverleaf structure of alanine tRNA", year: "1965" }
    ],
    references: ["Molecular Cell Biology, 9th Edition."]
  },

  rrna: {
    id: "rrna",
    name: "Ribosomal RNA",
    symbol: "rRNA",
    category: "rna",
    subcategory: "Ribozyme Component",
    icon: "⚙️",
    accentColor: "#EC4899",
    difficulty: "intermediate",
    estimatedStudyMinutes: 12,

    overview:
      "The primary structural and catalytic RNA component of the ribosome, responsible for peptide bond formation during translation.",
    definition:
      "Ribozyme molecules (28S, 18S, 5.8S, 5S in eukaryotes) forming the small and large ribosomal subunits.",
    locationInCell: ["Nucleolus", "Ribosome Large & Small Subunits"],
    primaryFunction: "Catalyzes peptide bond formation (peptidyl transferase activity) between adjacent amino acids.",
    biologicalImportance: "Makes up > 80% of total cellular RNA; core ribosomal catalytic site is purely RNA (ribozyme).",

    keyComponents: [
      { name: "Peptidyl Transferase Center", description: "Catalytic RNA site joining amino acids into polypeptide chains." },
      { name: "Decoding Center", description: "Small subunit site verifying tRNA anticodon and mRNA codon match." }
    ],

    clinicalRelevance: "Target of major antibacterial antibiotics (Macrolides, Aminoglycosides, Tetracyclines).",
    associatedDiseaseIds: ["tuberculosis", "bacterial_pneumonia"],
    associatedOrganIds: ["lungs"],
    associatedCellIds: ["bacterial-cell"],

    visualizationType: "sequence",
    xpReward: 180,
    discoverers: [
      { name: "Ada Yonath, Venkatraman Ramakrishnan & Thomas Steitz", contribution: "Solved atomic 3D structure of ribosome ribozyme core", year: "2009" }
    ],
    references: ["Nobel Prize in Chemistry (2009)."]
  },

  gene: {
    id: "gene",
    name: "Gene (HBB - Beta-Globin)",
    symbol: "HBB",
    category: "gene",
    subcategory: "Functional Genomic Unit",
    icon: "🧬",
    accentColor: "#EF4444",
    difficulty: "intermediate",
    estimatedStudyMinutes: 15,

    overview:
      "The basic physical and functional unit of heredity composed of DNA sequences that encode instructions for synthesizing a protein or functional RNA.",
    definition:
      "A genomic locus comprising promoter, exons, introns, and regulatory enhancer regions.",
    locationInCell: ["Chromosome 11p15.4 (HBB Gene Locus)"],
    primaryFunction: "Encodes the 147-amino acid Beta-Globin protein subunit of adult hemoglobin (HbA).",
    biologicalImportance: "Regulates tissue-specific and stage-specific gene transcription via promoter transcription factors.",

    sequenceExample: "ATG-GTG-CAC-CTG-ACT-CCT-GAG-GAG-AAG",

    keyComponents: [
      { name: "Promoter (TATA Box)", description: "RNA Polymerase binding site initiating transcription." },
      { name: "Exons & Introns", description: "Exons contain protein coding code; introns are spliced out by spliceosome." },
      { name: "Enhancer Regions", description: "Distal DNA elements binding transcription factors to boost transcription." }
    ],

    clinicalRelevance:
      "Single missense point mutation in HBB (GAG → GTG; Glu6Val) causes Sickle Cell Anemia; deletion causes Beta-Thalassemia.",
    associatedDiseaseIds: ["sickle_cell", "anemia"],
    associatedOrganIds: ["bone-marrow", "spleen"],
    associatedCellIds: ["erythrocyte"],

    visualizationType: "sequence",
    xpReward: 220,
    discoverers: [
      { name: "Gregor Mendel", contribution: "Formulated laws of particulate inheritance ('hereditary factors')", year: "1866" },
      { name: "Wilhelm Johannsen", contribution: "Coined the term 'Gene'", year: "1909" }
    ],
    references: ["NCBI Gene Database: HBB hemoglobin subunit beta (Gene ID: 3043)."]
  },

  chromosome: {
    id: "chromosome",
    name: "Chromosome 11",
    symbol: "Chr 11",
    category: "chromosome",
    subcategory: "Chromatin Packaging",
    icon: "📍",
    accentColor: "#6366F1",
    difficulty: "advanced",
    estimatedStudyMinutes: 15,

    overview:
      "A thread-like structure of nucleic acids and histone proteins found in the nucleus, carrying linear genomic information.",
    definition:
      "Highly condensed chromatin structure composed of DNA wrapped around octameric histone proteins (nucleosomes).",
    locationInCell: ["Cell Nucleus"],
    primaryFunction: "Ensures equal segregation of genomic DNA into daughter cells during mitosis and meiosis.",
    biologicalImportance: "Human somatic cells contain 23 pairs (46 total) of linear chromosomes.",

    keyComponents: [
      { name: "Centromere", description: "Constricted region holding sister chromatids together and assembling kinetochores." },
      { name: "Telomeres", description: "Repetitive (TTAGGG) protective caps preventing chromosome degradation." },
      { name: "Histone Octamer", description: "H2A, H2B, H3, H4 proteins wrapping 147 bp of DNA into nucleosomes." }
    ],

    clinicalRelevance:
      "Chromosomal non-disjunction causes trisomy (Down syndrome 21); translocations cause Philadelphia chromosome CML.",
    associatedDiseaseIds: ["cancer", "down_syndrome"],
    associatedOrganIds: ["brain", "bone-marrow"],
    associatedCellIds: ["leukocyte"],

    visualizationType: "chromosome",
    xpReward: 250,
    discoverers: [
      { name: "Walther Flemming", contribution: "Discovered chromatin and chromosome division during mitosis", year: "1879" },
      { name: "Thomas Hunt Morgan", contribution: "Proved genes reside on chromosomes (Drosophila experiments)", year: "1910" }
    ],
    references: ["Molecular Biology of the Cell, 7th Edition, Chapter 4."]
  },

  protein: {
    id: "protein",
    name: "Hemoglobin Beta Subunit",
    symbol: "HbB",
    category: "protein",
    subcategory: "Globular Transport Hemeprotein",
    icon: "🩸",
    accentColor: "#E11D48",
    difficulty: "intermediate",
    estimatedStudyMinutes: 15,

    overview:
      "A 147-amino acid globular metalloprotein subunit that forms the tetrameric Hemoglobin A (α2β2) complex carrying oxygen.",
    definition:
      "A folded polypeptide consisting of 8 alpha-helices containing a central iron-coordinating heme prosthetic group.",
    locationInCell: ["Erythrocyte Cytoplasm"],
    primaryFunction: "Binds molecular oxygen (O2) cooperatively in lungs and delivers it to systemic peripheral tissues.",
    biologicalImportance:
      "Classic paradigm of protein allosteric transition between T (Tense / Deoxy) and R (Relaxed / Oxy) states.",

    keyComponents: [
      { name: "Heme Ring", description: "Protoporphyrin IX ring coordinating a central ferrous (Fe2+) iron atom." },
      { name: "Alpha Helices", description: "8 secondary structural helices (A through H) surrounding heme pocket." }
    ],

    clinicalRelevance:
      "Glu6Val mutation causes HbS polymerization under hypoxia, sickling red blood cells and triggering vaso-occlusive crises.",
    associatedDiseaseIds: ["sickle_cell", "anemia"],
    associatedOrganIds: ["heart", "spleen"],
    associatedCellIds: ["erythrocyte"],

    visualizationType: "protein",
    xpReward: 220,
    discoverers: [
      { name: "Max Perutz", contribution: "Solved X-ray crystal structure of hemoglobin", year: "1959" }
    ],
    references: ["Perutz MF (1960) Structure of Hemoglobin. Nature 185:416."]
  },

  enzyme: {
    id: "enzyme",
    name: "DNA Polymerase III",
    symbol: "Pol III",
    category: "enzyme",
    subcategory: "Replicative Holoenzyme",
    icon: "⚙️",
    accentColor: "#0284C7",
    difficulty: "advanced",
    estimatedStudyMinutes: 15,

    overview:
      "The primary multi-subunit enzyme complex responsible for synthesizing leading and lagging DNA strands during replication.",
    definition:
      "A high-fidelity 5' → 3' DNA polymerase with intrinsic 3' → 5' exonuclease proofreading activity.",
    locationInCell: ["Replication Forks in Cell Nucleus"],
    primaryFunction: "Adds complementary dNTPs to 3' OH end of growing DNA strand with error rate < 1 in 10^9.",
    biologicalImportance: "Processivity beta-clamp keeps enzyme tethered to DNA template for thousands of base pairs.",

    keyComponents: [
      { name: "Alpha Subunit", description: "5' → 3' Polymerase catalytic domain." },
      { name: "Epsilon Subunit", description: "3' → 5' Exonuclease proofreading domain." },
      { name: "Beta Sliding Clamp", description: "Ring-shaped dimer encircling DNA for high processivity." }
    ],

    clinicalRelevance: "Bacterial DNA polymerase II/III targeting antibiotics; human POLG mutations cause Alpers syndrome.",
    associatedDiseaseIds: ["alpers_syndrome", "cancer"],
    associatedOrganIds: ["liver", "brain"],
    associatedCellIds: ["stem-cell"],

    visualizationType: "protein",
    xpReward: 240,
    discoverers: [
      { name: "Arthur Kornberg & Thomas Kornberg", contribution: "Isolated and characterized DNA polymerases", year: "1970" }
    ],
    references: ["Kornberg A (1992) DNA Replication, 2nd Edition."]
  },

  nucleotide: {
    id: "nucleotide",
    name: "Deoxyadenosine Triphosphate",
    symbol: "dATP",
    category: "nucleotide",
    subcategory: "Monomeric Building Block",
    icon: "🔹",
    accentColor: "#F472B6",
    difficulty: "beginner",
    estimatedStudyMinutes: 10,

    overview:
      "The monomeric building block substrate utilized by DNA polymerase to incorporate Adenine (A) into growing DNA strands.",
    definition:
      "A nucleoside triphosphate consisting of Adenine base, deoxyribose sugar, and three phosphate groups.",
    chemicalFormula: "C10H16N5O12P3",
    locationInCell: ["Nucleoplasm", "Cytoplasm"],
    primaryFunction: "Substrate for DNA synthesis; cleaves pyrophosphate (PPi) to drive polymerization reaction.",
    biologicalImportance: "Complementary base pairs with Thymine (T) via two hydrogen bonds.",

    keyComponents: [
      { name: "Adenine Purine Base", description: "Bicyclic purine nitrogenous ring." },
      { name: "Triphosphate Tail", description: "High-energy phosphoanhydride bonds providing energy for DNA ligation." }
    ],

    clinicalRelevance: "Nucleoside analog drugs (Acyclovir, AZT, Tenofovir) act as chain terminators.",
    associatedDiseaseIds: ["hiv", "herpes"],
    associatedOrganIds: ["liver"],
    associatedCellIds: ["leukocyte"],

    visualizationType: "sequence",
    xpReward: 150,
    discoverers: [
      { name: "Phoebus Levene", contribution: "Identified component sugars and phosphate of nucleotides", year: "1919" }
    ],
    references: ["Levene PA (1919) The Structure of Yeast Nucleic Acid."]
  },

  codon: {
    id: "codon",
    name: "Universal Genetic Codon Table",
    symbol: "Codon",
    category: "codon",
    subcategory: "Triplet Genetic Code",
    icon: "🔢",
    accentColor: "#A855F7",
    difficulty: "intermediate",
    estimatedStudyMinutes: 12,

    overview:
      "The set of 64 triplet nucleotide combinations (codons) in mRNA that specify the 20 standard amino acids and translation stops.",
    definition:
      "A non-overlapping, degenerate triplet genetic code read 5' → 3' by tRNA anticodons.",
    locationInCell: ["Ribosome Decoding Center"],
    primaryFunction: "Translates genetic nucleotide sequences into specific amino acid polypeptide sequences.",
    biologicalImportance:
      "Universal across almost all living organisms (AUG = Methionine / Start codon; UAA, UAG, UGA = Stop codons).",

    keyComponents: [
      { name: "Start Codon (AUG)", description: "Initiates translation and specifies Methionine." },
      { name: "Stop Codons (UAA, UAG, UGA)", description: "Terminates translation by binding release factors." },
      { name: "Wobble Position", description: "3rd nucleotide flexibility allowing 61 coding codons for 20 amino acids." }
    ],

    clinicalRelevance: "Nonsense mutations create premature Stop codons causing truncated non-functional proteins.",
    associatedDiseaseIds: ["cystic_fibrosis", "duchenne_dystrophy"],
    associatedOrganIds: ["muscle", "lungs"],
    associatedCellIds: ["myocyte"],

    visualizationType: "sequence",
    xpReward: 180,
    discoverers: [
      { name: "Marshall Nirenberg & Har Gobind Khorana", contribution: "Deciphered the universal genetic code codons", year: "1966" }
    ],
    references: ["Nirenberg M (1966) The Genetic Code. Cold Spring Harb Symp Quant Biol."]
  },

  genome: {
    id: "genome",
    name: "Human Genome (GRCh38)",
    symbol: "Genome",
    category: "genome",
    subcategory: "Complete DNA Blueprint",
    icon: "🌐",
    accentColor: "#14B8A6",
    difficulty: "advanced",
    estimatedStudyMinutes: 15,

    overview:
      "The complete set of nucleic acid sequences for humans, encoded as DNA within 23 chromosome pairs in the nucleus and mitochondria.",
    definition:
      "A ~3.2 billion base pair haploid genome containing ~20,000 protein-coding genes.",
    locationInCell: ["Cell Nucleus & Mitochondria"],
    primaryFunction: "Contains total genetic instructions for building and maintaining a human organism.",
    biologicalImportance: "Protein-coding exons constitute only ~1.5% of the total genome; remaining 98.5% contains regulatory DNA.",

    keyComponents: [
      { name: "Autosomes", description: "22 pairs of non-sex chromosomes." },
      { name: "Sex Chromosomes", description: "X and Y chromosomes determining biological sex." },
      { name: "Mitochondrial Genome", description: "16,569 bp circular DNA encoding 13 respiratory chain proteins." }
    ],

    clinicalRelevance: "Precision genomic medicine, GWAS disease association studies, and CRISPR gene editing.",
    associatedDiseaseIds: ["cancer", "sickle_cell", "cystic_fibrosis"],
    associatedOrganIds: ["brain", "liver", "heart"],
    associatedCellIds: ["stem-cell"],

    visualizationType: "chromosome",
    xpReward: 250,
    discoverers: [
      { name: "Human Genome Project (HGP)", contribution: "Completed initial reference sequence of human genome", year: "2003" },
      { name: "Telomere-to-Telomere (T2T) Consortium", contribution: "Sequenced complete gapless human genome", year: "2022" }
    ],
    references: ["Nature: Initial sequencing and analysis of the human genome (2001).", "Science: The complete sequence of a human genome (2022)."]
  },

  mutation: {
    id: "mutation",
    name: "Sickle Cell Point Mutation (HbS)",
    symbol: "c.20A>T",
    category: "mutation",
    subcategory: "Missense Single Nucleotide Variant",
    icon: "⚡",
    accentColor: "#F59E0B",
    difficulty: "advanced",
    estimatedStudyMinutes: 15,

    overview:
      "A single nucleotide substitution (A → T) in the HBB gene causing substitution of Valine for Glutamic Acid at position 6.",
    definition:
      "A missense point mutation changing wildtype GAG codon (Glutamic Acid) to mutant GTG codon (Valine).",
    locationInCell: ["Chromosome 11p15.4 HBB Locus"],
    primaryFunction: "Alters hydrophobic surface property of Beta-Globin protein, causing HbS polymerization under deoxygenation.",
    biologicalImportance: "Heterozygotes (Sickle Cell Trait) possess evolutionary malaria protection (balanced polymorphism).",

    sequenceExample: "Wildtype: GAG (Glu) → Mutant: GTG (Val)",

    keyComponents: [
      { name: "Single Nucleotide Polymorphism", description: "A to T transversion at codon 6 of HBB exon 1." },
      { name: "Hydrophobic Valine Patch", description: "Mutant Valine sticks to adjacent hydrophobic pocket in deoxy-HbS." }
    ],

    clinicalRelevance:
      "Homozygous (HbSS) causes Sickle Cell Anemia, characterized by painful vaso-occlusive crises and hemolytic anemia.",
    associatedDiseaseIds: ["sickle_cell", "malaria"],
    associatedOrganIds: ["spleen", "bone-marrow"],
    associatedCellIds: ["erythrocyte"],

    visualizationType: "mutation",
    xpReward: 250,
    discoverers: [
      { name: "Vernon Ingram", contribution: "Discovered single amino acid substitution in sickle cell hemoglobin", year: "1956" }
    ],
    references: ["Ingram VM (1956) A specific chemical difference between the globins of normal and sickle-cell anaemia haemoglobin. Nature 178:792."]
  }
};
