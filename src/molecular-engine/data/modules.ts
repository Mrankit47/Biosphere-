// ═══════════════════════════════════════════════════════════════
// Biosphere — Molecular Biology Learning Modules
// ═══════════════════════════════════════════════════════════════

import type { MolecularLearningModule } from "../types";

export const MOLECULAR_MODULES: MolecularLearningModule[] = [
  {
    id: "module-dna-structure",
    title: "DNA Structure & Double Helix",
    category: "dna",
    difficulty: "beginner",
    estimatedMinutes: 10,
    overview: "Explore antiparallel strands, sugar-phosphate backbones, major/minor grooves, and hydrogen base pairing rules.",
    steps: [
      { stepNumber: 1, title: "Sugar-Phosphate Backbone", description: "Deoxyribose sugars joined by 5' to 3' phosphodiester bonds form the structural side rails.", animationStateKey: "backbone", keyTakeaway: "Backbone is negatively charged due to phosphate groups." },
      { stepNumber: 2, title: "Nitrogenous Base Pairing", description: "Purines (A, G) pair with Pyrimidines (T, C) via hydrogen bonding.", animationStateKey: "base-pairing", keyTakeaway: "A pairs with T (2 H-bonds); G pairs with C (3 H-bonds)." },
      { stepNumber: 3, title: "Antiparallel Helical Geometry", description: "One strand runs 5' → 3' while the complementary strand runs 3' → 5'.", animationStateKey: "antiparallel", keyTakeaway: "Right-handed B-DNA double helix makes 1 full turn every 10.5 base pairs." }
    ],
    interactiveExperimentId: "exp-build-dna"
  },
  {
    id: "module-dna-replication",
    title: "DNA Replication Mechanism",
    category: "dna",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    overview: "Step-by-step enzymatic duplication of the genome at the replication fork.",
    steps: [
      { stepNumber: 1, title: "Unwinding by Helicase", description: "Helicase breaks hydrogen bonds to create the Y-shaped replication fork.", animationStateKey: "helicase-unwind", keyTakeaway: "SSB proteins coat single strands to prevent re-annealing." },
      { stepNumber: 2, title: "RNA Priming & Extension", description: "Primase adds RNA primer; DNA Polymerase III extends in 5' → 3' direction.", animationStateKey: "polymerase-elongation", keyTakeaway: "Leading strand is continuous; lagging strand forms Okazaki fragments." },
      { stepNumber: 3, title: "Proofreading & Ligation", description: "Exonuclease proofreads errors; Ligase seals nicked phosphodiester backbones.", animationStateKey: "ligase-seal", keyTakeaway: "Produces two identical semi-conservative daughter helices." }
    ],
    interactiveExperimentId: "exp-repair-dna"
  },
  {
    id: "module-rna-transcription",
    title: "RNA Transcription",
    category: "rna",
    difficulty: "intermediate",
    estimatedMinutes: 12,
    overview: "Synthesis of single-stranded mRNA from DNA template by RNA Polymerase II.",
    steps: [
      { stepNumber: 1, title: "Promoter Recognition & Initiation", description: "RNA Polymerase II binds TATA box promoter with transcription factors.", animationStateKey: "promoter-bind", keyTakeaway: "No primer is required for RNA polymerase initiation." },
      { stepNumber: 2, title: "Transcript Elongation", description: "RNA Polymerase reads template DNA 3' → 5' and synthesizes mRNA 5' → 3'.", animationStateKey: "mrna-synthesis", keyTakeaway: "Uracil (U) is incorporated opposite Adenine (A)." },
      { stepNumber: 3, title: "Termination & Processing", description: "5' capping, intron splicing, and poly-A tailing turn pre-mRNA into mature mRNA.", animationStateKey: "splicing-capping", keyTakeaway: "Alternative splicing allows one gene to produce multiple protein isoforms." }
    ],
    interactiveExperimentId: "exp-transcribe-rna"
  },
  {
    id: "module-protein-translation",
    title: "Protein Translation",
    category: "protein",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    overview: "Ribosomal synthesis of amino acid chains guided by mRNA codons and tRNA anticodons.",
    steps: [
      { stepNumber: 1, title: "Initiation at AUG", description: "Small ribosomal subunit binds 5' cap and locates AUG start codon with Met-tRNA.", animationStateKey: "translation-initiation", keyTakeaway: "AUG codon establishes the reading frame." },
      { stepNumber: 2, title: "Elongation & Peptide Bond", description: "tRNA enters A-site; peptidyl transferase links amino acids together.", animationStateKey: "ribosome-translocation", keyTakeaway: "Ribosome translocates codon-by-codon along mRNA." },
      { stepNumber: 3, title: "Termination at Stop Codon", description: "Release factor enters A-site at UAA/UAG/UGA, releasing completed polypeptide.", animationStateKey: "polypeptide-release", keyTakeaway: "Polypeptide folds into functional 3D protein structure." }
    ],
    interactiveExperimentId: "exp-assemble-protein"
  },
  {
    id: "module-gene-expression",
    title: "Gene Expression & Regulation",
    category: "gene",
    difficulty: "advanced",
    estimatedMinutes: 15,
    overview: "Control of gene activation via promoters, enhancers, repressors, and chromatin remodeling.",
    steps: [
      { stepNumber: 1, title: "Chromatin Remodeling", description: "Histone acetylation opens chromatin (euchromatin) allowing transcription factor access.", animationStateKey: "chromatin-open", keyTakeaway: "Epigenetic marks control gene accessibility." },
      { stepNumber: 2, title: "Enhancer Loop Activation", description: "Transcription factors bind distant enhancers and loop to promoter.", animationStateKey: "enhancer-looping", keyTakeaway: "Activators regulate precise spatial/temporal expression." }
    ]
  },
  {
    id: "module-mutation-types",
    title: "Mutation Types & Effects",
    category: "mutation",
    difficulty: "advanced",
    estimatedMinutes: 12,
    overview: "Analyze silent, missense, nonsense, and frameshift mutations and their protein consequences.",
    steps: [
      { stepNumber: 1, title: "Point Mutations", description: "Single base substitutions causing silent, missense, or nonsense changes.", animationStateKey: "point-mutation", keyTakeaway: "Missense changes 1 amino acid; nonsense creates early stop codon." },
      { stepNumber: 2, title: "Frameshift Indels", description: "Insertion or deletion of non-multiple of 3 nucleotides shifts reading frame.", animationStateKey: "frameshift-indel", keyTakeaway: "Alters every subsequent amino acid downstream." }
    ],
    interactiveExperimentId: "exp-identify-mutation"
  },
  {
    id: "module-chromosome-organization",
    title: "Chromosome Organization & Chromatin",
    category: "chromosome",
    difficulty: "advanced",
    estimatedMinutes: 12,
    overview: "Packaging of 2 meters of DNA into nucleosomes, 30nm fibers, and mitotic chromosomes.",
    steps: [
      { stepNumber: 1, title: "Nucleosomes (Beads on String)", description: "147 bp of DNA wrapped around octameric histone cores.", animationStateKey: "nucleosome-wrap", keyTakeaway: "Histone H1 stabilizes nucleosome array." }
    ]
  },
  {
    id: "module-cell-cycle",
    title: "Cell Cycle & Mitotic Checkpoints",
    category: "chromosome",
    difficulty: "intermediate",
    estimatedMinutes: 12,
    overview: "Interphase (G1, S, G2) and Mitosis regulation by Cyclin-CDK complexes.",
    steps: [
      { stepNumber: 1, title: "S Phase DNA Synthesis", description: "Entire genome is duplicated before cell division.", animationStateKey: "s-phase", keyTakeaway: "Checkpoints ensure error-free replication." }
    ]
  },
  {
    id: "module-meiosis",
    title: "Meiosis & Genetic Recombination",
    category: "chromosome",
    difficulty: "advanced",
    estimatedMinutes: 15,
    overview: "Two-stage division producing 4 haploid gametes with crossing-over genetic diversity.",
    steps: [
      { stepNumber: 1, title: "Prophase I Crossing-Over", description: "Homologous chromosomes exchange segments at chiasmata.", animationStateKey: "crossing-over", keyTakeaway: "Generates novel recombinant allele combinations." }
    ]
  },
  {
    id: "module-mitosis",
    title: "Mitosis & Nuclear Division",
    category: "chromosome",
    difficulty: "beginner",
    estimatedMinutes: 10,
    overview: "Equal separation of duplicated chromosomes into two identical daughter nuclei.",
    steps: [
      { stepNumber: 1, title: "Metaphase Alignment", description: "Chromosomes line up along metaphase plate attached to spindle fibers.", animationStateKey: "metaphase-plate", keyTakeaway: "Kinetochores check spindle tension before anaphase." }
    ]
  },
  {
    id: "module-genetic-inheritance",
    title: "Mendelian & Non-Mendelian Inheritance",
    category: "gene",
    difficulty: "beginner",
    estimatedMinutes: 15,
    overview: "Predict offspring genotypes and phenotypes using Punnett squares and pedigree charts.",
    steps: [
      { stepNumber: 1, title: "Monohybrid Cross", description: "Crossing heterozygous parents (Aa x Aa) yields 3:1 phenotypic ratio.", animationStateKey: "punnett-cross", keyTakeaway: "Dominant alleles mask recessive alleles in heterozygotes." }
    ],
    interactiveExperimentId: "exp-punnett-square"
  }
];

export function getModuleById(id: string): MolecularLearningModule | undefined {
  return MOLECULAR_MODULES.find((m) => m.id === id);
}
