// ═══════════════════════════════════════════════════════════════
// Biosphere — Scientific Discovery Timeline Service
// ═══════════════════════════════════════════════════════════════

import { ScientificDiscovery, ResearchFieldId } from '@/research-objects/types';
import { researchRegistry } from '@/research-objects/registry';

export interface TimelineFilterOptions {
  fieldId?: ResearchFieldId | 'all';
  scientistId?: string;
  yearMin?: number;
  yearMax?: number;
}

export class TimelineService {
  /**
   * Fetches discovery milestones sorted chronologically
   */
  public getMilestones(options: TimelineFilterOptions = {}): ScientificDiscovery[] {
    let discoveries = researchRegistry.getAllDiscoveries();

    if (options.fieldId && options.fieldId !== 'all') {
      discoveries = discoveries.filter((d) => d.fieldId === options.fieldId);
    }

    if (options.scientistId) {
      discoveries = discoveries.filter((d) => d.leadScientistIds.includes(options.scientistId!));
    }

    if (options.yearMin !== undefined) {
      discoveries = discoveries.filter((d) => d.year >= options.yearMin!);
    }

    if (options.yearMax !== undefined) {
      discoveries = discoveries.filter((d) => d.year <= options.yearMax!);
    }

    return discoveries.sort((a, b) => a.year - b.year);
  }

  /**
   * Groups discoveries by decade for clean visual rendering
   */
  public getMilestonesByDecade(options: TimelineFilterOptions = {}): Record<string, ScientificDiscovery[]> {
    const milestones = this.getMilestones(options);
    const grouped: Record<string, ScientificDiscovery[]> = {};

    for (const d of milestones) {
      const decade = `${Math.floor(d.year / 10) * 10}s`;
      if (!grouped[decade]) {
        grouped[decade] = [];
      }
      grouped[decade].push(d);
    }

    return grouped;
  }
}

export const timelineService = new TimelineService();
