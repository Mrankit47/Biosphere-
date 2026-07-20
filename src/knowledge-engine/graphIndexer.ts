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
import { inferNodeType, relationshipResolver } from "@/knowledge-services/relationshipResolver";

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

    // Phase 2 — build edges using RelationshipResolver
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
    const nodeTypeCounts: Record<string, number> = {};

    for (const node of this.nodes.values()) {
      totalEdges += node.edges.length;
      categoryCounts[node.category] = (categoryCounts[node.category] ?? 0) + 1;
      nodeTypeCounts[node.nodeType] = (nodeTypeCounts[node.nodeType] ?? 0) + 1;
    }

    const totalNodes = this.nodes.size;

    return {
      totalNodes,
      totalEdges,
      categoryCounts,
      nodeTypeCounts,
      averageEdgesPerNode: totalNodes > 0 ? totalEdges / totalNodes : 0,
      maxDepth: 0,
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
      nodeType: inferNodeType(obj),
      category: obj.category,
      subcategory: obj.subcategory,
      icon: obj.icon,
      accentColor: obj.accentColor,
      difficulty: obj.difficulty,
      edges: [],
    };
  }

  /** Extract all relationship arrays using RelationshipResolver and create edges */
  private indexRelationships(obj: KnowledgeObject): void {
    const rawEdges = relationshipResolver.resolveObjectEdges(obj);

    for (const edge of rawEdges) {
      if (!this.nodes.has(edge.to)) continue; // skip dangling refs

      // Forward edge
      this.nodes.get(obj.id)!.edges.push(edge);
      this.adjacency.get(obj.id)!.add(edge.to);

      // Reverse edge (bidirectional graph)
      const reverseType = relationshipResolver.getInverseRelationship(edge.type);
      const reverseEdge: KnowledgeEdge = {
        from: edge.to,
        to: obj.id,
        type: reverseType,
        weight: edge.weight,
        label: relationshipResolver.getRelationshipLabel(reverseType),
      };
      this.nodes.get(edge.to)!.edges.push(reverseEdge);
      this.adjacency.get(edge.to)!.add(obj.id);
    }
  }
}

// ─── Singleton ───────────────────────────────────────────────

/** Global graph index singleton */
export const knowledgeGraph = new KnowledgeGraphIndex();
