// ═══════════════════════════════════════════════════════════════
// Biosphere — Visualization Data Engine
//
// Generates standardized 2D/3D graph visualization datasets for D3,
// Three-ForceGraph, and React Flow engines.
// ═══════════════════════════════════════════════════════════════

import type {
  GraphVisualizationData,
  VisNode,
  VisLink,
  VisCluster,
  RelationshipType,
  NodeType,
} from "@/knowledge-types/graph";
import { knowledgeGraph } from "@/knowledge-engine/graphIndexer";
import { graphTraversalService } from "./graphTraversal";
import { inferNodeType } from "./relationshipResolver";

export interface VisualizationOptions {
  focusNodeId?: string;
  maxHopDepth?: number;
  allowedRelationshipTypes?: RelationshipType[];
  allowedNodeTypes?: NodeType[];
}

export class VisualizationEngine {
  /**
   * Build a complete or focused graph visualization dataset.
   */
  generateVisualizationData(options: VisualizationOptions = {}): GraphVisualizationData {
    let nodes = knowledgeGraph.getAllNodes();
    let edges = knowledgeGraph.getAllObjects().flatMap((o) => knowledgeGraph.getEdges(o.id));

    // Focus Mode Subgraph filter
    if (options.focusNodeId) {
      const traversal = graphTraversalService.extractFocusSubgraph(
        options.focusNodeId,
        options.maxHopDepth ?? 2
      );
      nodes = traversal.nodes;
      edges = traversal.edges;
    }

    // Filter by allowed relationship types
    if (options.allowedRelationshipTypes && options.allowedRelationshipTypes.length > 0) {
      const allowedSet = new Set(options.allowedRelationshipTypes);
      edges = edges.filter((e) => allowedSet.has(e.type));
    }

    // Filter by allowed node types
    if (options.allowedNodeTypes && options.allowedNodeTypes.length > 0) {
      const allowedNodeSet = new Set(options.allowedNodeTypes);
      nodes = nodes.filter((n) => allowedNodeSet.has(n.nodeType));
    }

    // Node ID set for dangling edge check
    const nodeIdSet = new Set(nodes.map((n) => n.id));
    edges = edges.filter((e) => nodeIdSet.has(e.from) && nodeIdSet.has(e.to));

    // Build VisNodes
    const visNodes: VisNode[] = nodes.map((node) => {
      const fullObj = knowledgeGraph.getObject(node.id);
      return {
        id: node.id,
        label: node.name,
        nodeType: node.nodeType,
        category: node.category,
        color: node.accentColor,
        icon: node.icon,
        size: this.getNodeSize(node.nodeType),
        clusterId: node.category,
      };
    });

    // Build VisLinks (deduplicated)
    const linkSeen = new Set<string>();
    const visLinks: VisLink[] = [];

    for (const edge of edges) {
      const linkKey = `${edge.from}->${edge.to}:${edge.type}`;
      if (!linkSeen.has(linkKey)) {
        linkSeen.add(linkKey);
        visLinks.push({
          source: edge.from,
          target: edge.to,
          type: edge.type,
          weight: edge.weight,
          label: edge.label,
        });
      }
    }

    // Build Clusters by Category
    const clusterMap = new Map<string, VisCluster>();
    for (const node of visNodes) {
      if (!clusterMap.has(node.category)) {
        clusterMap.set(node.category, {
          id: node.category,
          label: node.category.replace("-", " ").toUpperCase(),
          color: node.color,
          nodeIds: [],
        });
      }
      clusterMap.get(node.category)!.nodeIds.push(node.id);
    }

    return {
      nodes: visNodes,
      links: visLinks,
      clusters: Array.from(clusterMap.values()),
      focusedNodeId: options.focusNodeId,
      metadata: {
        totalNodes: visNodes.length,
        totalLinks: visLinks.length,
        generatedAt: new Date().toISOString(),
      },
    };
  }

  private getNodeSize(nodeType: NodeType): number {
    switch (nodeType) {
      case "organ":
      case "system":
        return 24;
      case "cell":
      case "virus":
      case "bacteria":
        return 20;
      case "dna":
      case "rna":
        return 18;
      default:
        return 16;
    }
  }
}

export const visualizationEngine = new VisualizationEngine();
