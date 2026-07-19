// ═══════════════════════════════════════════════════════════════
// Biosphere — Knowledge Graph Indexer
//
// Builds and maintains a bidirectional relationship graph from
// KnowledgeObject[] data. Designed for 100k+ concept scalability
// with O(1) node lookup and O(edges) traversal.
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeObject } from "@/knowledge-types/object";
import type {
  KnowledgeEdge,
  KnowledgeGraphNode,
  RelationshipType,
  GraphStats,
} from "@/knowledge-types/graph";

// ─── Graph Index ─────────────────────────────────────────────

/** In-memory graph index backed by Maps for O(1) lookups */
export class KnowledgeGraphIndex {
  /** id → lightweight graph node */
  private nodes = new Map<string, KnowledgeGraphNode>();

  /** id → set of edge target ids (for quick adjacency checks) */
  private adjacency = new Map<string, Set<string>>();

  /** id → full KnowledgeObject (lazy-resolvable) */
  private objects = new Map<string, KnowledgeObject>();

  // ── Build ──────────────────────────────────────────────────

  /**
   * Index an array of knowledge objects, building all nodes and
   * bidirectional edges from their relationship fields.
   */
  build(objects: KnowledgeObject[]): void {
    this.clear();

    // Phase 1 — register every node
    for (const obj of objects) {
      this.objects.set(obj.id, obj);
      this.nodes.set(obj.id, this.toGraphNode(obj));
      this.adjacency.set(obj.id, new Set());
    }

    // Phase 2 — build edges from relationship fields
    for (const obj of objects) {
      this.indexRelationships(obj);
    }
  }

  /** Remove all indexed data */
  clear(): void {
    this.nodes.clear();
    this.adjacency.clear();
    this.objects.clear();
  }

  // ── Queries ────────────────────────────────────────────────

  /** Get a graph node by ID (lightweight, no full object) */
  getNode(id: string): KnowledgeGraphNode | undefined {
    return this.nodes.get(id);
  }

  /** Get the full KnowledgeObject by ID */
  getObject(id: string): KnowledgeObject | undefined {
    return this.objects.get(id);
  }

  /** Check if a node exists */
  has(id: string): boolean {
    return this.nodes.has(id);
  }

  /** Get all node IDs */
  getAllIds(): string[] {
    return Array.from(this.nodes.keys());
  }

  /** Get all graph nodes */
  getAllNodes(): KnowledgeGraphNode[] {
    return Array.from(this.nodes.values());
  }

  /** Get all full objects */
  getAllObjects(): KnowledgeObject[] {
    return Array.from(this.objects.values());
  }

  /** Get direct neighbors of a node (1-hop) */
  getNeighbors(id: string): KnowledgeGraphNode[] {
    const adj = this.adjacency.get(id);
    if (!adj) return [];
    return Array.from(adj)
      .map((nid) => this.nodes.get(nid))
      .filter(Boolean) as KnowledgeGraphNode[];
  }

  /** Get edges for a specific node */
  getEdges(id: string): KnowledgeEdge[] {
    return this.nodes.get(id)?.edges ?? [];
  }

  /** Get neighbors filtered by relationship type */
  getNeighborsByType(
    id: string,
    type: RelationshipType
  ): KnowledgeGraphNode[] {
    const node = this.nodes.get(id);
    if (!node) return [];
    return node.edges
      .filter((e) => e.type === type)
      .map((e) => this.nodes.get(e.to))
      .filter(Boolean) as KnowledgeGraphNode[];
  }

  /**
   * Breadth-first traversal from a root node up to `maxDepth` hops.
   * Returns all reachable nodes and the edges connecting them.
   */
  traverse(
    rootId: string,
    maxDepth: number = 2
  ): { nodes: KnowledgeGraphNode[]; edges: KnowledgeEdge[] } {
    const visited = new Set<string>();
    const resultNodes: KnowledgeGraphNode[] = [];
    const resultEdges: KnowledgeEdge[] = [];
    const queue: Array<{ id: string; depth: number }> = [
      { id: rootId, depth: 0 },
    ];

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      if (visited.has(id) || depth > maxDepth) continue;
      visited.add(id);

      const node = this.nodes.get(id);
      if (!node) continue;
      resultNodes.push(node);

      for (const edge of node.edges) {
        resultEdges.push(edge);
        if (!visited.has(edge.to) && depth + 1 <= maxDepth) {
          queue.push({ id: edge.to, depth: depth + 1 });
        }
      }
    }

    return { nodes: resultNodes, edges: resultEdges };
  }

  /** Find prerequisite chain for a node (recursive parent walk) */
  getPrerequisiteChain(id: string): KnowledgeGraphNode[] {
    const chain: KnowledgeGraphNode[] = [];
    const visited = new Set<string>();
    const stack = [id];

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);

      const node = this.nodes.get(current);
      if (!node) continue;

      const prereqs = node.edges
        .filter((e) => e.type === "prerequisite")
        .map((e) => e.to);

      for (const pid of prereqs) {
        const pnode = this.nodes.get(pid);
        if (pnode && !visited.has(pid)) {
          chain.push(pnode);
          stack.push(pid);
        }
      }
    }

    return chain;
  }

  /** Get aggregate graph statistics */
  getStats(): GraphStats {
    let totalEdges = 0;
    const categoryCounts: Record<string, number> = {};

    for (const node of this.nodes.values()) {
      totalEdges += node.edges.length;
      categoryCounts[node.category] =
        (categoryCounts[node.category] ?? 0) + 1;
    }

    const totalNodes = this.nodes.size;

    return {
      totalNodes,
      totalEdges,
      categoryCounts,
      averageEdgesPerNode: totalNodes > 0 ? totalEdges / totalNodes : 0,
      maxDepth: 0, // computed lazily if needed
    };
  }

  // ── Search ─────────────────────────────────────────────────

  /** Full-text search across node names and subcategories */
  search(query: string): KnowledgeGraphNode[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: KnowledgeGraphNode[] = [];
    for (const node of this.nodes.values()) {
      const haystack = `${node.name} ${node.subcategory} ${node.category}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push(node);
      }
    }
    return results;
  }

  // ── Internals ──────────────────────────────────────────────

  /** Convert a full KnowledgeObject into a lightweight graph node */
  private toGraphNode(obj: KnowledgeObject): KnowledgeGraphNode {
    return {
      id: obj.id,
      name: obj.name,
      category: obj.category,
      subcategory: obj.subcategory,
      icon: obj.icon,
      accentColor: obj.accentColor,
      difficulty: obj.difficulty,
      edges: [],
    };
  }

  /** Extract all relationship arrays from an object and create edges */
  private indexRelationships(obj: KnowledgeObject): void {
    const add = (
      targetId: string,
      type: RelationshipType,
      weight: number = 1.0
    ) => {
      if (!this.nodes.has(targetId)) return; // skip dangling refs

      // Forward edge
      const forwardEdge: KnowledgeEdge = {
        from: obj.id,
        to: targetId,
        type,
        weight,
      };
      this.nodes.get(obj.id)!.edges.push(forwardEdge);
      this.adjacency.get(obj.id)!.add(targetId);

      // Reverse edge (bidirectional graph)
      const reverseType = this.reverseRelationship(type);
      const reverseEdge: KnowledgeEdge = {
        from: targetId,
        to: obj.id,
        type: reverseType,
        weight,
      };
      this.nodes.get(targetId)!.edges.push(reverseEdge);
      this.adjacency.get(targetId)!.add(obj.id);
    };

    // Parent-child
    if (obj.parentTopicId) add(obj.parentTopicId, "parent", 1.0);
    for (const cid of obj.childTopicIds) add(cid, "child", 0.9);

    // Relationships
    for (const rid of obj.relatedTopicIds) add(rid, "related", 0.7);
    for (const pid of obj.prerequisiteIds) add(pid, "prerequisite", 0.95);
    for (const nid of obj.nextTopicIds) add(nid, "next", 0.85);

    // Domain-specific
    for (const did of obj.relatedDiseaseIds) add(did, "disease", 0.8);
    for (const sid of obj.relatedSpeciesIds) add(sid, "species", 0.6);
    for (const oid of obj.relatedOrganIds) add(oid, "organ", 0.8);
    for (const cid of obj.relatedCellIds) add(cid, "cell", 0.8);
    for (const sid of obj.relatedSimulationIds)
      add(sid, "simulation", 0.7);
    for (const rid of obj.relatedResearchIds) add(rid, "research", 0.6);
  }

  /** Map a relationship type to its semantic reverse */
  private reverseRelationship(type: RelationshipType): RelationshipType {
    switch (type) {
      case "parent":
        return "child";
      case "child":
        return "parent";
      case "prerequisite":
        return "next";
      case "next":
        return "prerequisite";
      default:
        return type; // symmetric relationships
    }
  }
}

// ─── Singleton ───────────────────────────────────────────────

/** Global graph index singleton */
export const knowledgeGraph = new KnowledgeGraphIndex();
