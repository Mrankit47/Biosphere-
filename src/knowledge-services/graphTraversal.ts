// ═══════════════════════════════════════════════════════════════
// Biosphere — Graph Traversal Algorithms
//
// Shortest path (Dijkstra), BFS depth traversal, topological sort,
// and Focus-Mode subgraph extraction for the Knowledge Graph.
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeGraphNode, KnowledgeEdge, GraphPath, GraphTraversalResult } from "@/knowledge-types/graph";
import { knowledgeGraph } from "@/knowledge-engine/graphIndexer";

// ─── Traversal Algorithms ────────────────────────────────────

export class GraphTraversalService {
  /**
   * Breadth-First Search (BFS) up to `maxDepth` hops from `rootId`.
   */
  bfsTraversal(rootId: string, maxDepth: number = 2): GraphTraversalResult {
    const visited = new Set<string>();
    const nodes: KnowledgeGraphNode[] = [];
    const edges: KnowledgeEdge[] = [];
    const queue: Array<{ id: string; depth: number }> = [{ id: rootId, depth: 0 }];

    while (queue.length > 0) {
      const { id, depth } = queue.shift()!;
      if (visited.has(id) || depth > maxDepth) continue;
      visited.add(id);

      const node = knowledgeGraph.getNode(id);
      if (!node) continue;
      nodes.push(node);

      for (const edge of node.edges) {
        edges.push(edge);
        if (!visited.has(edge.to) && depth + 1 <= maxDepth) {
          queue.push({ id: edge.to, depth: depth + 1 });
        }
      }
    }

    return { rootId, nodes, edges, depth: maxDepth };
  }

  /**
   * Dijkstra's Shortest Path algorithm to find the optimal learning
   * connection between `startId` and `endId`.
   */
  findShortestPath(startId: string, endId: string): GraphPath | null {
    if (!knowledgeGraph.has(startId) || !knowledgeGraph.has(endId)) return null;
    if (startId === endId) return { nodeIds: [startId], edges: [], totalWeight: 0 };

    const distances = new Map<string, number>();
    const previousNode = new Map<string, string>();
    const previousEdge = new Map<string, KnowledgeEdge>();
    const unvisited = new Set<string>(knowledgeGraph.getAllIds());

    distances.set(startId, 0);

    while (unvisited.size > 0) {
      // Find node with min distance in unvisited
      let currentId: string | null = null;
      let minDistance = Infinity;

      for (const id of unvisited) {
        const dist = distances.get(id) ?? Infinity;
        if (dist < minDistance) {
          minDistance = dist;
          currentId = id;
        }
      }

      if (!currentId || minDistance === Infinity) break;
      if (currentId === endId) break;

      unvisited.delete(currentId);

      const node = knowledgeGraph.getNode(currentId);
      if (!node) continue;

      for (const edge of node.edges) {
        if (!unvisited.has(edge.to)) continue;
        // Edge cost is inverted weight (higher weight = lower cost)
        const cost = 1 / (edge.weight || 0.1);
        const alt = minDistance + cost;

        if (alt < (distances.get(edge.to) ?? Infinity)) {
          distances.set(edge.to, alt);
          previousNode.set(edge.to, currentId);
          previousEdge.set(edge.to, edge);
        }
      }
    }

    if (!previousNode.has(endId)) return null;

    // Reconstruct path
    const pathNodes: string[] = [];
    const pathEdges: KnowledgeEdge[] = [];
    let curr: string | undefined = endId;

    while (curr) {
      pathNodes.unshift(curr);
      const edge = previousEdge.get(curr);
      if (edge) pathEdges.unshift(edge);
      curr = previousNode.get(curr);
    }

    return {
      nodeIds: pathNodes,
      edges: pathEdges,
      totalWeight: distances.get(endId) ?? 0,
    };
  }

  /**
   * Topological sort for prerequisite chains (resolves DAG ordering).
   */
  getPrerequisiteTopologicalOrder(targetId: string): KnowledgeGraphNode[] {
    const visited = new Set<string>();
    const result: KnowledgeGraphNode[] = [];
    const tempVisited = new Set<string>(); // cycle detection

    const visit = (id: string) => {
      if (tempVisited.has(id)) return; // cycle safe
      if (visited.has(id)) return;

      tempVisited.add(id);
      const node = knowledgeGraph.getNode(id);
      if (node) {
        const prereqs = node.edges
          .filter((e) => e.type === "prerequisite")
          .map((e) => e.to);

        for (const pid of prereqs) {
          visit(pid);
        }
        visited.add(id);
        result.push(node);
      }
      tempVisited.delete(id);
    };

    visit(targetId);
    return result;
  }

  /**
   * Focus Mode Subgraph Extractor: Returns isolated N-hop neighborhood.
   */
  extractFocusSubgraph(
    focusNodeId: string,
    hopDepth: number = 1
  ): { nodes: KnowledgeGraphNode[]; edges: KnowledgeEdge[] } {
    return this.bfsTraversal(focusNodeId, hopDepth);
  }
}

export const graphTraversalService = new GraphTraversalService();
