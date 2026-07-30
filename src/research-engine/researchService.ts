// ═══════════════════════════════════════════════════════════════
// Biosphere — Research Service (Filtering, Sorting, Caching)
// ═══════════════════════════════════════════════════════════════

import { ResearchPaper, ScientificDiscovery, Dataset, ResearchFieldId } from '@/research-objects/types';
import { researchRegistry } from '@/research-objects/registry';

export interface ResearchQueryOptions {
  fieldId?: ResearchFieldId | 'all';
  topicId?: string;
  journalId?: string;
  yearMin?: number;
  yearMax?: number;
  sortBy?: 'recent' | 'citations' | 'trending' | 'title';
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class ResearchService {
  private cache: Map<string, any> = new Map();

  public getFilteredPapers(options: ResearchQueryOptions = {}): PaginatedResult<ResearchPaper> {
    const cacheKey = JSON.stringify({ type: 'papers', ...options });
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let papers = researchRegistry.getAllPapers();

    if (options.fieldId && options.fieldId !== 'all') {
      papers = papers.filter((p) => p.fieldId === options.fieldId);
    }

    if (options.topicId) {
      papers = papers.filter((p) => p.topicIds.includes(options.topicId!));
    }

    if (options.journalId) {
      papers = papers.filter((p) => p.journalId === options.journalId);
    }

    if (options.yearMin !== undefined) {
      papers = papers.filter((p) => p.year >= options.yearMin!);
    }

    if (options.yearMax !== undefined) {
      papers = papers.filter((p) => p.year <= options.yearMax!);
    }

    // Sort
    const sortBy = options.sortBy || 'recent';
    papers.sort((a, b) => {
      if (sortBy === 'citations') {
        return b.citationCount - a.citationCount;
      }
      if (sortBy === 'trending') {
        return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || b.citationCount - a.citationCount;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      // 'recent'
      return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
    });

    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const total = papers.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const paginatedItems = papers.slice((page - 1) * pageSize, page * pageSize);

    const result: PaginatedResult<ResearchPaper> = {
      items: paginatedItems,
      total,
      page,
      pageSize,
      totalPages,
    };

    this.cache.set(cacheKey, result);
    return result;
  }

  public getTrendingPapers(limit: number = 5): ResearchPaper[] {
    return researchRegistry
      .getAllPapers()
      .filter((p) => p.isTrending || p.citationCount > 200)
      .slice(0, limit);
  }

  public getFeaturedPapers(limit: number = 3): ResearchPaper[] {
    return researchRegistry.getAllPapers().filter((p) => p.isFeatured).slice(0, limit);
  }

  public getDiscoveries(fieldId?: ResearchFieldId | 'all'): ScientificDiscovery[] {
    const all = researchRegistry.getAllDiscoveries();
    if (!fieldId || fieldId === 'all') return all;
    return all.filter((d) => d.fieldId === fieldId);
  }

  public getDatasets(): Dataset[] {
    return researchRegistry.getAllDatasets();
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export const researchService = new ResearchService();
