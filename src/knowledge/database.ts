// ═══════════════════════════════════════════════════════════════
// Biosphere — Master Knowledge Object Database
//
// Central registry that aggregates all seed data from domain
// modules into a single flat array for the graph indexer.
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeObject } from "@/knowledge-types/object";
import { CELL_ORGANELLE_OBJECTS } from "./objects/cellOrganelles";
import { HUMAN_ANATOMY_OBJECTS } from "./objects/humanAnatomy";
import { GENETICS_OBJECTS } from "./objects/genetics";
import { PATHOGEN_OBJECTS } from "./objects/pathogens";
import { PROCESS_OBJECTS } from "./objects/processes";
import { SPECIES_OBJECTS } from "./objects/species";

/**
 * Master flat array of ALL knowledge objects in the system.
 * The graph indexer builds its index from this array.
 *
 * To add new objects:
 * 1. Create a new file in `src/knowledge/objects/`
 * 2. Export an array of KnowledgeObject[]
 * 3. Import and spread it into ALL_KNOWLEDGE_OBJECTS below
 */
export const ALL_KNOWLEDGE_OBJECTS: KnowledgeObject[] = [
  ...CELL_ORGANELLE_OBJECTS,
  ...HUMAN_ANATOMY_OBJECTS,
  ...GENETICS_OBJECTS,
  ...PATHOGEN_OBJECTS,
  ...PROCESS_OBJECTS,
  ...SPECIES_OBJECTS,
];

/**
 * Quick lookup map: id → KnowledgeObject
 * Useful for O(1) lookups without initializing the graph.
 */
export const KNOWLEDGE_MAP: Map<string, KnowledgeObject> = new Map(
  ALL_KNOWLEDGE_OBJECTS.map((obj) => [obj.id, obj])
);
