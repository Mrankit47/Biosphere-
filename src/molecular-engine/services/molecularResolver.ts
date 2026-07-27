// ═══════════════════════════════════════════════════════════════
// Biosphere — Molecular Engine Relationship Resolver
// ═══════════════════════════════════════════════════════════════

import { MOLECULAR_OBJECTS } from "../data/objects";
import { MOLECULAR_MODULES } from "../data/modules";
import { MOLECULAR_EXPERIMENTS } from "../data/experiments";
import type { MolecularObject, MolecularLearningModule, MolecularExperiment } from "../types";

/**
 * Retrieves a single molecular object by ID.
 */
export function getMolecularObjectById(id: string): MolecularObject | undefined {
  return MOLECULAR_OBJECTS[id.toLowerCase()];
}

/**
 * Retrieves all registered molecular objects.
 */
export function getAllMolecularObjects(): MolecularObject[] {
  return Object.values(MOLECULAR_OBJECTS);
}

/**
 * Filters molecular objects by category (dna, rna, gene, protein, etc.).
 */
export function getMolecularObjectsByCategory(category: string): MolecularObject[] {
  return Object.values(MOLECULAR_OBJECTS).filter(
    (o) => o.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Searches molecular objects by keyword.
 */
export function searchMolecularObjects(query: string): MolecularObject[] {
  const q = query.toLowerCase().trim();
  if (!q) return getAllMolecularObjects();

  return Object.values(MOLECULAR_OBJECTS).filter(
    (o) =>
      o.name.toLowerCase().includes(q) ||
      o.symbol.toLowerCase().includes(q) ||
      o.overview.toLowerCase().includes(q) ||
      o.primaryFunction.toLowerCase().includes(q)
  );
}

/**
 * Retrieves all learning modules.
 */
export function getAllMolecularModules(): MolecularLearningModule[] {
  return MOLECULAR_MODULES;
}

/**
 * Retrieves all interactive experiments.
 */
export function getAllMolecularExperiments(): MolecularExperiment[] {
  return MOLECULAR_EXPERIMENTS;
}
