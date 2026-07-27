// ═══════════════════════════════════════════════════════════════
// Biosphere — Mutation Simulator Service
// ═══════════════════════════════════════════════════════════════

import { translateMRNAToProtein } from "./codonTranslator";
import type { MutationImpact, MutationType } from "../types";

/**
 * Analyzes the protein consequence of a nucleotide mutation.
 */
export function analyzeMutationImpact(
  wildtypeDNA: string,
  mutantDNA: string,
  mutationType: MutationType
): MutationImpact {
  const wildtypeRNA = wildtypeDNA.replace(/T/g, "U");
  const mutantRNA = mutantDNA.replace(/T/g, "U");

  const wildtypeAA = translateMRNAToProtein(wildtypeRNA);
  const mutantAA = translateMRNAToProtein(mutantRNA);

  const wildtypeProtStr = wildtypeAA.map((a) => a.aminoAcidCode).join("-");
  const mutantProtStr = mutantAA.map((a) => a.aminoAcidCode).join("-");

  let functionalEffect = "No functional change in primary protein sequence.";
  let associatedDisease: string | undefined = undefined;

  if (wildtypeDNA === "ATGGTGCACTCTACTCCTGAGGAGAAG" && mutantDNA === "ATGGTGCACTCTACTCCTGTGGAGAAG") {
    functionalEffect = "Missense substitution (Glu6Val). Hydrophobic Valine patch causes HbS polymerization under hypoxia, sickling red blood cells.";
    associatedDisease = "Sickle Cell Anemia";
  } else if (mutationType === "silent") {
    functionalEffect = "Synonymous codon change. Same amino acid incorporated; normal protein folding.";
  } else if (mutationType === "missense") {
    functionalEffect = "Single amino acid replacement. May alter protein active site or tertiary folding stability.";
  } else if (mutationType === "nonsense") {
    functionalEffect = "Premature STOP codon introduced. Truncates polypeptide chain, leading to non-functional protein.";
  } else if (mutationType === "frameshift") {
    functionalEffect = "Reading frame shifted downstream. Completely alters all subsequent amino acids, terminating early.";
  }

  return {
    type: mutationType,
    wildtypeSequence: wildtypeDNA,
    mutantSequence: mutantDNA,
    wildtypeProtein: wildtypeProtStr,
    mutantProtein: mutantProtStr,
    functionalEffect,
    associatedDisease
  };
}
