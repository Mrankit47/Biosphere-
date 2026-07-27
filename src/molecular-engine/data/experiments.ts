// ═══════════════════════════════════════════════════════════════
// Biosphere — Molecular Interactive Experiments Database
// ═══════════════════════════════════════════════════════════════

import type { MolecularExperiment } from "../types";

export const MOLECULAR_EXPERIMENTS: MolecularExperiment[] = [
  {
    id: "exp-build-dna",
    type: "build-dna",
    title: "DNA Base Pairing Sandbox",
    instructions: "Given the 5' → 3' template DNA strand below, build the complementary 3' → 5' strand by selecting matching nucleotides (A-T, G-C).",
    templateSequence: "ATGCGATCGATC",
    targetSequence: "TACGCTAGCTAG",
    hint: "Adenine (A) pairs with Thymine (T) via 2 hydrogen bonds. Guanine (G) pairs with Cytosine (C) via 3 hydrogen bonds.",
    xpReward: 150
  },
  {
    id: "exp-match-base-pairs",
    type: "match-base-pairs",
    title: "Hydrogen Bond Matching",
    instructions: "Match the correct nitrogenous base and identify whether it forms 2 or 3 hydrogen bonds.",
    templateSequence: "GCATGCAT",
    targetSequence: "CGTACGTA",
    hint: "G-C base pairs are stronger because they share 3 hydrogen bonds!",
    xpReward: 120
  },
  {
    id: "exp-repair-dna",
    type: "repair-dna",
    title: "DNA Mismatch Repair Lab",
    instructions: "Inspect the mutated DNA strand below, locate the mismatched base pair, and repair it using DNA Polymerase proofreading.",
    templateSequence: "ATGCTATCGATC",
    targetSequence: "TACGATAGCTAG",
    hint: "Look for a C-T or A-G mismatch in the double helix!",
    xpReward: 180
  },
  {
    id: "exp-transcribe-rna",
    type: "transcribe-rna",
    title: "RNA Transcription Simulator",
    instructions: "Transcribe the DNA template strand into complementary mRNA. Remember: Uracil (U) replaces Thymine (T) in RNA!",
    templateSequence: "TACTACGGCACT",
    targetSequence: "AUGUGCCGUGAU",
    hint: "DNA T → RNA A | DNA A → RNA U | DNA C → RNA G | DNA G → RNA C",
    xpReward: 200
  },
  {
    id: "exp-assemble-protein",
    type: "assemble-protein",
    title: "Ribosome Translation Assembly",
    instructions: "Read the mRNA codons 5' → 3' and match each codon to its corresponding amino acid to synthesize the protein peptide.",
    templateSequence: "AUG-UUU-GUC-UAA",
    targetSequence: "Met-Phe-Val-STOP",
    hint: "AUG = Methionine (Start). UUU = Phenylalanine. GUC = Valine. UAA = Stop.",
    xpReward: 220
  },
  {
    id: "exp-identify-mutation",
    type: "identify-mutation",
    title: "Mutation Type Identifier",
    instructions: "Compare the wildtype HBB sequence with the mutant sequence and identify whether it is a Silent, Missense, Nonsense, or Frameshift mutation.",
    templateSequence: "GAG-CTC-ACC-TCC",
    targetSequence: "GTG-CTC-ACC-TCC",
    hint: "GAG (Glu) → GTG (Val) is the single nucleotide substitution causing Sickle Cell Anemia (Missense mutation).",
    xpReward: 200
  },
  {
    id: "exp-predict-protein-changes",
    type: "predict-protein-changes",
    title: "Protein Folding Predictor",
    instructions: "Predict how replacing a hydrophilic Glutamic Acid (-) with hydrophobic Valine affects the hemoglobin tertiary protein fold.",
    templateSequence: "VAL-HIS-LEU-THR-PRO-GLU-GLU",
    targetSequence: "VAL-HIS-LEU-THR-PRO-VAL-GLU",
    hint: "Hydrophobic Valine creates a sticky patch on the protein surface causing protein aggregation under deoxygenation.",
    xpReward: 250
  },
  {
    id: "exp-punnett-square",
    type: "punnett-square",
    title: "Punnett Square Inheritance Simulator",
    instructions: "Cross two heterozygous carriers of the Sickle Cell Trait (Bb x Bb) and calculate the probability of producing an affected child (bb).",
    templateSequence: "Bb x Bb",
    targetSequence: "25% BB, 50% Bb, 25% bb (25% Affected)",
    hint: "Autosomal recessive inheritance requires two copies of the mutant allele (bb).",
    xpReward: 180
  }
];

export function getExperimentById(id: string): MolecularExperiment | undefined {
  return MOLECULAR_EXPERIMENTS.find((e) => e.id === id);
}
