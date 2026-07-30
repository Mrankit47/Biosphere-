// ═══════════════════════════════════════════════════════════════
// Biosphere — Full-Text Research Search Service
// ═══════════════════════════════════════════════════════════════

import { ResearchPaper, ScientificDiscovery, Scientist, Dataset } from '@/research-objects/types';
import { researchRegistry } from '@/research-objects/registry';

export interface UnifiedSearchResults {
  papers: ResearchPaper[];
  discoveries: ScientificDiscovery[];
  scientists: Scientist[];
  datasets: Dataset[];
  totalMatches: number;
}

export class SearchService {
  public search(query: string): UnifiedSearchResults {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        papers: [],
        discoveries: [],
        scientists: [],
        datasets: [],
        totalMatches: 0,
      };
    }

    const papers = researchRegistry.getAllPapers().filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.abstract.toLowerCase().includes(q) ||
        p.keywords.some((k) => k.toLowerCase().includes(q)) ||
        p.doi.toLowerCase().includes(q)
    );

    const discoveries = researchRegistry.getAllDiscoveries().filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.simplifiedExplanation.toLowerCase().includes(q)
    );

    const scientists = researchRegistry.getAllScientists().filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.biography.toLowerCase().includes(q) ||
        s.majorContributions.some((mc) => mc.toLowerCase().includes(q))
    );

    const datasets = researchRegistry.getAllDatasets().filter(
      (ds) =>
        ds.title.toLowerCase().includes(q) ||
        ds.description.toLowerCase().includes(q) ||
        ds.keywords.some((k) => k.toLowerCase().includes(q))
    );

    return {
      papers,
      discoveries,
      scientists,
      datasets,
      totalMatches: papers.length + discoveries.length + scientists.length + datasets.length,
    };
  }
}

export const searchService = new SearchService();
