// ═══════════════════════════════════════════════════════════════
// Biosphere — Universal Scientific Research Object Definitions
// ═══════════════════════════════════════════════════════════════

export type ResearchObjectType =
  | 'paper'
  | 'discovery'
  | 'experiment'
  | 'dataset'
  | 'scientist'
  | 'institution'
  | 'journal'
  | 'conference'
  | 'citation'
  | 'field'
  | 'topic';

export type ResearchFieldId =
  | 'genetics'
  | 'cell-biology'
  | 'microbiology'
  | 'ecology'
  | 'neuroscience'
  | 'biochemistry'
  | 'immunology'
  | 'evolution'
  | 'botany'
  | 'zoology'
  | 'medicine'
  | 'pathology';

export interface ResearchField {
  id: ResearchFieldId;
  name: string;
  description: string;
  icon: string;
  color: string;
  parentFieldId?: ResearchFieldId;
  topicIds: string[];
}

export interface ResearchTopic {
  id: string;
  fieldId: ResearchFieldId;
  name: string;
  description: string;
  keywords: string[];
  relatedTopicIds: string[];
}

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  country: string;
  city: string;
  type: 'university' | 'research-institute' | 'laboratory' | 'foundation';
  logoUrl?: string;
  website?: string;
}

export interface Journal {
  id: string;
  name: string;
  shortName: string;
  publisher: string;
  impactFactor: number;
  issn: string;
  website?: string;
}

export interface Conference {
  id: string;
  name: string;
  acronym: string;
  organizer: string;
  year: number;
  location: string;
}

export interface Scientist {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
  institutionId: string;
  fieldIds: ResearchFieldId[];
  biography: string;
  bornYear: number;
  diedYear?: number;
  awards: string[];
  hIndex: number;
  totalCitations: number;
  majorContributions: string[];
  discoveryIds: string[];
  paperIds: string[];
  experimentIds: string[];
  timeline: {
    year: number;
    title: string;
    description: string;
  }[];
}

export interface ResearchFigure {
  id: string;
  title: string;
  caption: string;
  imageUrl?: string;
  legend?: string;
  dataPoints?: { x: number | string; y: number; label?: string }[];
}

export interface ResearchTable {
  id: string;
  title: string;
  caption: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface Citation {
  id: string;
  sourcePaperId: string;
  targetPaperId: string;
  citationText: string;
  context: 'supports' | 'refutes' | 'mentions' | 'extends' | 'uses-method';
  year: number;
}

export interface CitationNetworkNode {
  id: string;
  title: string;
  authors: string[];
  year: number;
  citationCount: number;
  citations: string[];
  citedBy: string[];
}

export interface Dataset {
  id: string;
  title: string;
  description: string;
  doi?: string;
  format: 'CSV' | 'JSON' | 'FASTA' | 'PDB' | 'HDF5' | 'GEO';
  fileSize: string;
  sampleCount: number;
  headers: string[];
  rowsPreview: Record<string, string | number>[];
  downloadUrl?: string;
  relatedPaperId?: string;
  keywords: string[];
}

export interface ScientificDiscovery {
  id: string;
  title: string;
  year: number;
  dateString: string;
  fieldId: ResearchFieldId;
  topicIds: string[];
  leadScientistIds: string[];
  institutionId: string;
  summary: string;
  simplifiedExplanation: string;
  scientificExplanation: string;
  impactScore: number;
  milestoneOrder: number;
  previousDiscoveryIds: string[];
  nextDiscoveryIds: string[];
  paperIds: string[];
  knowledgeGraphNodeIds: string[];
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  simplifiedExplanation: string;
  scientificExplanation: string;
  publicationDate: string;
  year: number;
  fieldId: ResearchFieldId;
  topicIds: string[];
  authorIds: string[];
  institutionIds: string[];
  journalId?: string;
  conferenceId?: string;
  doi: string;
  pmid?: string;
  keywords: string[];
  readTimeMinutes: number;
  citationCount: number;
  isTrending?: boolean;
  isFeatured?: boolean;
  figures: ResearchFigure[];
  tables: ResearchTable[];
  references: {
    paperId?: string;
    citationText: string;
  }[];
  citedByPaperIds: string[];

  // Biosphere Knowledge Cross-Links
  relatedTopicIds: string[];
  relatedDiseaseIds: string[];
  relatedAnatomyIds: string[];
  relatedSimulationIds: string[];
  relatedLabIds: string[];
  relatedLessonIds: string[];
  knowledgeGraphNodeIds: string[];
}

export interface ExperimentVariable {
  id: string;
  name: string;
  type: 'independent' | 'dependent' | 'controlled';
  unit?: string;
  defaultValue?: string | number;
  description: string;
}

export interface ExperimentControl {
  id: string;
  name: string;
  type: 'positive' | 'negative';
  description: string;
}

export interface ExperimentProcedureStep {
  stepNumber: number;
  title: string;
  instruction: string;
  durationMinutes?: number;
  safetyNotes?: string;
}

export interface Experiment {
  id: string;
  title: string;
  objective: string;
  fieldId: ResearchFieldId;
  hypothesisTemplate: string;
  variables: ExperimentVariable[];
  controls: ExperimentControl[];
  procedureSteps: ExperimentProcedureStep[];
  expectedOutcome: string;
  relatedPaperId?: string;
  relatedLabId?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface UserExperimentSubmission {
  id: string;
  title: string;
  experimentId: string;
  hypothesis: string;
  independentVariable: string;
  dependentVariable: string;
  controlledVariables: string[];
  positiveControl: string;
  negativeControl: string;
  customProcedure: string[];
  predictedOutcome: string;
  createdAt: string;
  matchingPublishedPaperId?: string;
  aiFeedback?: string;
}

export interface UserResearchCollection {
  id: string;
  name: string;
  description: string;
  paperIds: string[];
  discoveryIds: string[];
  scientistIds: string[];
  createdAt: string;
  updatedAt: string;
}
