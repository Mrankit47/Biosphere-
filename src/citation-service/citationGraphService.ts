// ═══════════════════════════════════════════════════════════════
// Biosphere — Citation Graph Service & Co-Citation Analytics
// ═══════════════════════════════════════════════════════════════

import { ResearchPaper } from '@/research-objects/types';
import { researchRegistry } from '@/research-objects/registry';

export interface GraphNode {
  id: string;
  label: string;
  type: 'paper' | 'author' | 'journal';
  citationCount: number;
  year?: number;
  fieldId?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: 'cites' | 'authored_by' | 'published_in';
}

export interface NetworkGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export class CitationGraphService {
  /**
   * Builds an interactive citation network graph starting from a root paper ID
   */
  public buildCitationGraph(rootPaperId: string, depth: number = 2): NetworkGraphData {
    const rootPaper = researchRegistry.getPaper(rootPaperId);
    if (!rootPaper) {
      return { nodes: [], edges: [] };
    }

    const nodesMap = new Map<string, GraphNode>();
    const edgesMap = new Map<string, GraphEdge>();

    // Add root paper
    nodesMap.set(rootPaper.id, {
      id: rootPaper.id,
      label: rootPaper.title,
      type: 'paper',
      citationCount: rootPaper.citationCount,
      year: rootPaper.year,
      fieldId: rootPaper.fieldId,
    });

    // Process references (Outgoing citations)
    for (const ref of rootPaper.references) {
      if (ref.paperId) {
        const citedPaper = researchRegistry.getPaper(ref.paperId);
        if (citedPaper) {
          nodesMap.set(citedPaper.id, {
            id: citedPaper.id,
            label: citedPaper.title,
            type: 'paper',
            citationCount: citedPaper.citationCount,
            year: citedPaper.year,
            fieldId: citedPaper.fieldId,
          });

          const edgeKey = `${rootPaper.id}->${citedPaper.id}`;
          edgesMap.set(edgeKey, {
            source: rootPaper.id,
            target: citedPaper.id,
            relationship: 'cites',
          });
        }
      }
    }

    // Process citedBy (Incoming citations)
    for (const citingId of rootPaper.citedByPaperIds) {
      const citingPaper = researchRegistry.getPaper(citingId);
      if (citingPaper) {
        nodesMap.set(citingPaper.id, {
          id: citingPaper.id,
          label: citingPaper.title,
          type: 'paper',
          citationCount: citingPaper.citationCount,
          year: citingPaper.year,
          fieldId: citingPaper.fieldId,
        });

        const edgeKey = `${citingPaper.id}->${rootPaper.id}`;
        edgesMap.set(edgeKey, {
          source: citingPaper.id,
          target: rootPaper.id,
          relationship: 'cites',
        });
      }
    }

    return {
      nodes: Array.from(nodesMap.values()),
      edges: Array.from(edgesMap.values()),
    };
  }

  /**
   * Generates global graph representation of top cited papers
   */
  public getGlobalCitationGraph(): NetworkGraphData {
    const papers = researchRegistry.getAllPapers();
    const nodes: GraphNode[] = papers.map((p) => ({
      id: p.id,
      label: p.title,
      type: 'paper',
      citationCount: p.citationCount,
      year: p.year,
      fieldId: p.fieldId,
    }));

    const edges: GraphEdge[] = [];
    for (const p of papers) {
      for (const ref of p.references) {
        if (ref.paperId && researchRegistry.getPaper(ref.paperId)) {
          edges.push({
            source: p.id,
            target: ref.paperId,
            relationship: 'cites',
          });
        }
      }
    }

    return { nodes, edges };
  }
}

export const citationGraphService = new CitationGraphService();
