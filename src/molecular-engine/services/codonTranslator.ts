// ═══════════════════════════════════════════════════════════════
// Biosphere — Codon Translation & Genetic Code Service
// ═══════════════════════════════════════════════════════════════

import type { CodonMapping } from "../types";

export const GENETIC_CODE_TABLE: Record<string, { name: string; code: string }> = {
  // U
  UUU: { name: "Phenylalanine", code: "Phe" }, UUC: { name: "Phenylalanine", code: "Phe" },
  UUA: { name: "Leucine", code: "Leu" }, UUG: { name: "Leucine", code: "Leu" },
  UCU: { name: "Serine", code: "Ser" }, UCC: { name: "Serine", code: "Ser" },
  UCA: { name: "Serine", code: "Ser" }, UCG: { name: "Serine", code: "Ser" },
  UAU: { name: "Tyrosine", code: "Tyr" }, UAC: { name: "Tyrosine", code: "Tyr" },
  UAA: { name: "Stop Codon", code: "STOP" }, UAG: { name: "Stop Codon", code: "STOP" },
  UGU: { name: "Cysteine", code: "Cys" }, UGC: { name: "Cysteine", code: "Cys" },
  UGA: { name: "Stop Codon", code: "STOP" }, UGG: { name: "Tryptophan", code: "Trp" },

  // C
  CUU: { name: "Leucine", code: "Leu" }, CUC: { name: "Leucine", code: "Leu" },
  CUA: { name: "Leucine", code: "Leu" }, CUG: { name: "Leucine", code: "Leu" },
  CCU: { name: "Proline", code: "Pro" }, CCC: { name: "Proline", code: "Pro" },
  CCA: { name: "Proline", code: "Pro" }, CCG: { name: "Proline", code: "Pro" },
  CAU: { name: "Histidine", code: "His" }, CAC: { name: "Histidine", code: "His" },
  CAA: { name: "Glutamine", code: "Gln" }, CAG: { name: "Glutamine", code: "Gln" },
  CGU: { name: "Arginine", code: "Arg" }, CGC: { name: "Arginine", code: "Arg" },
  CGA: { name: "Arginine", code: "Arg" }, CGG: { name: "Arginine", code: "Arg" },

  // A
  AUU: { name: "Isoleucine", code: "Ile" }, AUC: { name: "Isoleucine", code: "Ile" },
  AUA: { name: "Isoleucine", code: "Ile" }, AUG: { name: "Methionine (Start)", code: "Met" },
  ACU: { name: "Threonine", code: "Thr" }, ACC: { name: "Threonine", code: "Thr" },
  ACA: { name: "Threonine", code: "Thr" }, ACG: { name: "Threonine", code: "Thr" },
  AAU: { name: "Asparagine", code: "Asn" }, AAC: { name: "Asparagine", code: "Asn" },
  AAA: { name: "Lysine", code: "Lys" }, AAG: { name: "Lysine", code: "Lys" },
  AGU: { name: "Serine", code: "Ser" }, AGC: { name: "Serine", code: "Ser" },
  AGA: { name: "Arginine", code: "Arg" }, AGG: { name: "Arginine", code: "Arg" },

  // G
  GUU: { name: "Valine", code: "Val" }, GUC: { name: "Valine", code: "Val" },
  GUA: { name: "Valine", code: "Val" }, GUG: { name: "Valine", code: "Val" },
  GCU: { name: "Alanine", code: "Ala" }, GCC: { name: "Alanine", code: "Ala" },
  GCA: { name: "Alanine", code: "Ala" }, GCG: { name: "Alanine", code: "Ala" },
  GAU: { name: "Aspartic Acid", code: "Asp" }, GAC: { name: "Aspartic Acid", code: "Asp" },
  GAA: { name: "Glutamic Acid", code: "Glu" }, GAG: { name: "Glutamic Acid", code: "Glu" },
  GGU: { name: "Glycine", code: "Gly" }, GGC: { name: "Glycine", code: "Gly" },
  GGA: { name: "Glycine", code: "Gly" }, GGG: { name: "Glycine", code: "Gly" }
};

/**
 * Transcribes a DNA sequence into an mRNA sequence (T -> U, complementary strand).
 */
export function transcribeDNAToRNA(dnaSequence: string): string {
  return dnaSequence
    .toUpperCase()
    .replace(/A/g, "u")
    .replace(/T/g, "a")
    .replace(/C/g, "g")
    .replace(/G/g, "c")
    .toUpperCase();
}

/**
 * Translates an mRNA sequence into amino acids array.
 */
export function translateMRNAToProtein(mrnaSequence: string): CodonMapping[] {
  const cleanSequence = mrnaSequence.toUpperCase().replace(/[^AUCG]/g, "");
  const result: CodonMapping[] = [];

  for (let i = 0; i < cleanSequence.length - 2; i += 3) {
    const triplet = cleanSequence.substring(i, i + 3);
    const aa = GENETIC_CODE_TABLE[triplet] || { name: "Unknown", code: "???" };

    result.push({
      codon: triplet,
      aminoAcidName: aa.name,
      aminoAcidCode: aa.code,
      isStart: triplet === "AUG",
      isStop: ["UAA", "UAG", "UGA"].includes(triplet)
    });

    if (["UAA", "UAG", "UGA"].includes(triplet)) {
      break;
    }
  }

  return result;
}
