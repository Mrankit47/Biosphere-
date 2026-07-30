// ═══════════════════════════════════════════════════════════════
// Biosphere — Research Objects Registry & Relationship Resolver
// ═══════════════════════════════════════════════════════════════

import {
  ResearchField,
  ResearchTopic,
  Institution,
  Journal,
  Scientist,
  ScientificDiscovery,
  ResearchPaper,
  Dataset,
  Experiment,
  ResearchFieldId,
} from './types';
import {
  RESEARCH_FIELDS,
  RESEARCH_TOPICS,
  INSTITUTIONS,
  JOURNALS,
  SCIENTISTS,
  SCIENTIFIC_DISCOVERIES,
  RESEARCH_PAPERS,
  DATASETS,
  EXPERIMENTS,
} from './mockData';

class ResearchObjectsRegistry {
  private fields: Map<string, ResearchField> = new Map();
  private topics: Map<string, ResearchTopic> = new Map();
  private institutions: Map<string, Institution> = new Map();
  private journals: Map<string, Journal> = new Map();
  private scientists: Map<string, Scientist> = new Map();
  private discoveries: Map<string, ScientificDiscovery> = new Map();
  private papers: Map<string, ResearchPaper> = new Map();
  private datasets: Map<string, Dataset> = new Map();
  private experiments: Map<string, Experiment> = new Map();

  constructor() {
    this.init();
  }

  private init() {
    RESEARCH_FIELDS.forEach((f) => this.fields.set(f.id, f));
    RESEARCH_TOPICS.forEach((t) => this.topics.set(t.id, t));
    INSTITUTIONS.forEach((i) => this.institutions.set(i.id, i));
    JOURNALS.forEach((j) => this.journals.set(j.id, j));
    SCIENTISTS.forEach((s) => this.scientists.set(s.id, s));
    SCIENTIFIC_DISCOVERIES.forEach((d) => this.discoveries.set(d.id, d));
    RESEARCH_PAPERS.forEach((p) => this.papers.set(p.id, p));
    DATASETS.forEach((ds) => this.datasets.set(ds.id, ds));
    EXPERIMENTS.forEach((e) => this.experiments.set(e.id, e));
  }

  public getField(id: ResearchFieldId | string): ResearchField | undefined {
    return this.fields.get(id);
  }

  public getAllFields(): ResearchField[] {
    return Array.from(this.fields.values());
  }

  public getTopic(id: string): ResearchTopic | undefined {
    return this.topics.get(id);
  }

  public getAllTopics(): ResearchTopic[] {
    return Array.from(this.topics.values());
  }

  public getInstitution(id: string): Institution | undefined {
    return this.institutions.get(id);
  }

  public getAllInstitutions(): Institution[] {
    return Array.from(this.institutions.values());
  }

  public getJournal(id: string): Journal | undefined {
    return this.journals.get(id);
  }

  public getAllJournals(): Journal[] {
    return Array.from(this.journals.values());
  }

  public getScientist(id: string): Scientist | undefined {
    return this.scientists.get(id);
  }

  public getAllScientists(): Scientist[] {
    return Array.from(this.scientists.values());
  }

  public getDiscovery(id: string): ScientificDiscovery | undefined {
    return this.discoveries.get(id);
  }

  public getAllDiscoveries(): ScientificDiscovery[] {
    return Array.from(this.discoveries.values()).sort((a, b) => a.year - b.year);
  }

  public getPaper(id: string): ResearchPaper | undefined {
    return this.papers.get(id);
  }

  public getAllPapers(): ResearchPaper[] {
    return Array.from(this.papers.values());
  }

  public getDataset(id: string): Dataset | undefined {
    return this.datasets.get(id);
  }

  public getAllDatasets(): Dataset[] {
    return Array.from(this.datasets.values());
  }

  public getExperiment(id: string): Experiment | undefined {
    return this.experiments.get(id);
  }

  public getAllExperiments(): Experiment[] {
    return Array.from(this.experiments.values());
  }

  public getPapersByField(fieldId: ResearchFieldId): ResearchPaper[] {
    return this.getAllPapers().filter((p) => p.fieldId === fieldId);
  }

  public getDiscoveriesByField(fieldId: ResearchFieldId): ScientificDiscovery[] {
    return this.getAllDiscoveries().filter((d) => d.fieldId === fieldId);
  }

  public getScientistsByField(fieldId: ResearchFieldId): Scientist[] {
    return this.getAllScientists().filter((s) => s.fieldIds.includes(fieldId));
  }

  public getPapersByScientist(scientistId: string): ResearchPaper[] {
    return this.getAllPapers().filter((p) => p.authorIds.includes(scientistId));
  }

  public getDiscoveriesByScientist(scientistId: string): ScientificDiscovery[] {
    return this.getAllDiscoveries().filter((d) => d.leadScientistIds.includes(scientistId));
  }
}

export const researchRegistry = new ResearchObjectsRegistry();
