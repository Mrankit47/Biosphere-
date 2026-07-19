// ═══════════════════════════════════════════════════════════════
// Biosphere — Knowledge Service
//
// Central data-access layer for knowledge objects. Handles
// initialization, caching, and object resolution.
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeObject } from "@/knowledge-types/object";
import type { KnowledgeGraphNode } from "@/knowledge-types/graph";
import { knowledgeGraph } from "@/knowledge-engine/graphIndexer";
import { ALL_KNOWLEDGE_OBJECTS } from "@/knowledge/database";

// ─── State ───────────────────────────────────────────────────

let initialized = false;

// ─── Initialization ──────────────────────────────────────────

/**
 * Initialize the knowledge service by loading all seed objects
 * into the graph indexer. Safe to call multiple times (idempotent).
 */
export function initKnowledge(): void {
  if (initialized) return;
  knowledgeGraph.build(ALL_KNOWLEDGE_OBJECTS);
  initialized = true;
}

/**
 * Force re-index (e.g. after adding new objects at runtime).
 */
export function reindexKnowledge(objects?: KnowledgeObject[]): void {
  knowledgeGraph.build(objects ?? ALL_KNOWLEDGE_OBJECTS);
  initialized = true;
}

// ─── Object Resolution ──────────────────────────────────────

/**
 * Resolve a KnowledgeObject by its ID.
 * Auto-initializes the service on first call.
 */
export function getKnowledgeObject(id: string): KnowledgeObject | undefined {
  initKnowledge();
  return knowledgeGraph.getObject(id);
}

/**
 * Get a lightweight graph node by ID.
 */
export function getKnowledgeNode(id: string): KnowledgeGraphNode | undefined {
  initKnowledge();
  return knowledgeGraph.getNode(id);
}

/**
 * Check if a knowledge object exists.
 */
export function knowledgeObjectExists(id: string): boolean {
  initKnowledge();
  return knowledgeGraph.has(id);
}

/**
 * Get all knowledge object IDs in the system.
 */
export function getAllKnowledgeIds(): string[] {
  initKnowledge();
  return knowledgeGraph.getAllIds();
}

/**
 * Get all knowledge objects.
 */
export function getAllKnowledgeObjects(): KnowledgeObject[] {
  initKnowledge();
  return knowledgeGraph.getAllObjects();
}

// ─── Relationship Resolution ─────────────────────────────────

/**
 * Resolve an array of KnowledgeObject IDs into full objects.
 * Skips IDs that don't exist.
 */
export function resolveObjects(ids: string[]): KnowledgeObject[] {
  initKnowledge();
  return ids
    .map((id) => knowledgeGraph.getObject(id))
    .filter(Boolean) as KnowledgeObject[];
}

/**
 * Get all related objects for a given knowledge object,
 * grouped by relationship type.
 */
export function getRelatedGrouped(id: string): Record<string, KnowledgeObject[]> {
  initKnowledge();
  const node = knowledgeGraph.getNode(id);
  if (!node) return {};

  const groups: Record<string, KnowledgeObject[]> = {};

  for (const edge of node.edges) {
    const obj = knowledgeGraph.getObject(edge.to);
    if (!obj) continue;

    if (!groups[edge.type]) {
      groups[edge.type] = [];
    }
    // Avoid duplicates within a group
    if (!groups[edge.type].some((o) => o.id === obj.id)) {
      groups[edge.type].push(obj);
    }
  }

  return groups;
}
