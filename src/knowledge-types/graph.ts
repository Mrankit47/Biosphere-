// ═══════════════════════════════════════════════════════════════
// Biosphere — Knowledge Graph Type Definitions
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeCategory } from "./object";

// ─── Edge / Relationship Types ───────────────────────────────

/** Semantic relationship type between two knowledge nodes */
export type RelationshipType =
  | "parent"
  | "child"
  | "related"
  | "prerequisite"
  | "next"
  | "disease"
  | "species"
  | "organ"
  | "cell"
  | "simulation"
  | "research"
  | "process"
  | "experiment";

/** A directed edge between two knowledge graph nodes */
export interface KnowledgeEdge {
  /** Source node ID */
  from: string;
  /** Target node ID */
  to: string;
  /** Semantic relationship type */
  type: RelationshipType;
  /** Relationship strength / confidence (0–1) */
  weight: number;
  /** Optional label for UI display */
  label?: string;
}

// ─── Graph Node ──────────────────────────────────────────────

/** Lightweight graph node for traversal (not the full KnowledgeObject) */
export interface KnowledgeGraphNode {
  id: string;
  name: string;
  category: KnowledgeCategory;
  subcategory: string;
  icon: string;
  accentColor: string;
  difficulty: string;
  /** Direct edges from this node */
  edges: KnowledgeEdge[];
}

// ─── Graph Query Results ─────────────────────────────────────

/** Result from a graph traversal query */
export interface GraphTraversalResult {
  /** The root node that was queried */
  rootId: string;
  /** All reachable nodes within the requested depth */
  nodes: KnowledgeGraphNode[];
  /** All edges in the traversal */
  edges: KnowledgeEdge[];
  /** Maximum depth reached */
  depth: number;
}

/** A single path between two nodes in the graph */
export interface GraphPath {
  nodeIds: string[];
  edges: KnowledgeEdge[];
  totalWeight: number;
}

// ─── Graph Statistics ────────────────────────────────────────

/** Aggregate statistics for the knowledge graph */
export interface GraphStats {
  totalNodes: number;
  totalEdges: number;
  categoryCounts: Record<string, number>;
  averageEdgesPerNode: number;
  maxDepth: number;
}
