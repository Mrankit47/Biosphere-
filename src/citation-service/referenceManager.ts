// ═══════════════════════════════════════════════════════════════
// Biosphere — Reference & Bookmark Manager (BibTeX, APA, IEEE)
// ═══════════════════════════════════════════════════════════════

import { ResearchPaper, UserResearchCollection } from '@/research-objects/types';
import { researchRegistry } from '@/research-objects/registry';

const BOOKMARKS_KEY = 'biosphere_research_bookmarks';
const RECENTLY_VIEWED_KEY = 'biosphere_research_recently_viewed';
const COLLECTIONS_KEY = 'biosphere_research_collections';

export class ReferenceManager {
  // ─── Bookmarks ──────────────────────────────────────────────

  public getBookmarks(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public toggleBookmark(paperId: string): boolean {
    if (typeof window === 'undefined') return false;
    const current = this.getBookmarks();
    const isBookmarked = current.includes(paperId);
    const updated = isBookmarked
      ? current.filter((id) => id !== paperId)
      : [...current, paperId];
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    } catch {}
    return !isBookmarked;
  }

  public isBookmarked(paperId: string): boolean {
    return this.getBookmarks().includes(paperId);
  }

  // ─── Recently Viewed ────────────────────────────────────────

  public addRecentlyViewed(paperId: string): void {
    if (typeof window === 'undefined') return;
    const current = this.getRecentlyViewed();
    const filtered = current.filter((id) => id !== paperId);
    const updated = [paperId, ...filtered].slice(0, 10);
    try {
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
    } catch {}
  }

  public getRecentlyViewed(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // ─── Collections ───────────────────────────────────────────

  public getCollections(): UserResearchCollection[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(COLLECTIONS_KEY);
      return stored
        ? JSON.parse(stored)
        : [
            {
              id: 'col_default',
              name: 'My Gene Editing Papers',
              description: 'Collection of foundational CRISPR and genomic engineering papers.',
              paperIds: ['paper_crispr_cas9_mammalian'],
              discoveryIds: ['disc_crispr_editing'],
              scientistIds: ['sci_jennifer_doudna'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
    } catch {
      return [];
    }
  }

  public createCollection(name: string, description: string): UserResearchCollection {
    const collections = this.getCollections();
    const newCol: UserResearchCollection = {
      id: `col_${Date.now()}`,
      name,
      description,
      paperIds: [],
      discoveryIds: [],
      scientistIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...collections, newCol];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updated));
      } catch {}
    }
    return newCol;
  }

  public addPaperToCollection(collectionId: string, paperId: string): void {
    const collections = this.getCollections();
    const updated = collections.map((col) => {
      if (col.id === collectionId && !col.paperIds.includes(paperId)) {
        return {
          ...col,
          paperIds: [...col.paperIds, paperId],
          updatedAt: new Date().toISOString(),
        };
      }
      return col;
    });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updated));
      } catch {}
    }
  }

  // ─── Citation Formatting ────────────────────────────────────

  public exportAPA(paper: ResearchPaper): string {
    const journal = paper.journalId ? researchRegistry.getJournal(paper.journalId)?.name : 'Journal';
    const authors = paper.authorIds
      .map((id) => researchRegistry.getScientist(id)?.name || 'Author')
      .join(', ');

    return `${authors} (${paper.year}). ${paper.title}. ${journal}. https://doi.org/${paper.doi}`;
  }

  public exportBibTeX(paper: ResearchPaper): string {
    const firstAuthor = paper.authorIds[0]
      ? researchRegistry.getScientist(paper.authorIds[0])?.name.split(' ').pop() || 'author'
      : 'author';
    const citeKey = `${firstAuthor.toLowerCase()}${paper.year}${paper.id.slice(0, 4)}`;

    const journal = paper.journalId ? researchRegistry.getJournal(paper.journalId)?.name : 'Journal';

    return `@article{${citeKey},
  title = {${paper.title}},
  author = {${paper.authorIds.map((id) => researchRegistry.getScientist(id)?.name || 'Author').join(' and ')}},
  journal = {${journal}},
  year = {${paper.year}},
  doi = {${paper.doi}}
}`;
  }
}

export const referenceManager = new ReferenceManager();
