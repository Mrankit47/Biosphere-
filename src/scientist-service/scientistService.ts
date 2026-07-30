// ═══════════════════════════════════════════════════════════════
// Biosphere — Scientist Directory & Profile Resolver Service
// ═══════════════════════════════════════════════════════════════

import { Scientist, ScientificDiscovery, ResearchPaper } from '@/research-objects/types';
import { researchRegistry } from '@/research-objects/registry';

export interface ScientistDetailedProfile {
  scientist: Scientist;
  institutionName: string;
  discoveries: ScientificDiscovery[];
  papers: ResearchPaper[];
}

export class ScientistService {
  public getAllScientists(): Scientist[] {
    return researchRegistry.getAllScientists();
  }

  public getScientistById(id: string): Scientist | undefined {
    return researchRegistry.getScientist(id);
  }

  public getDetailedProfile(id: string): ScientistDetailedProfile | undefined {
    const scientist = researchRegistry.getScientist(id);
    if (!scientist) return undefined;

    const institution = researchRegistry.getInstitution(scientist.institutionId);
    const discoveries = researchRegistry.getDiscoveriesByScientist(id);
    const papers = researchRegistry.getPapersByScientist(id);

    return {
      scientist,
      institutionName: institution ? `${institution.name} (${institution.country})` : 'Independent Research',
      discoveries,
      papers,
    };
  }

  public searchScientists(query: string): Scientist[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAllScientists();

    return this.getAllScientists().filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.biography.toLowerCase().includes(q) ||
        s.majorContributions.some((c) => c.toLowerCase().includes(q))
    );
  }
}

export const scientistService = new ScientistService();
