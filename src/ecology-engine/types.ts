// ═══════════════════════════════════════════════════════════════
// Biosphere — Ecology & Evolution Engine Type Definitions
// ═══════════════════════════════════════════════════════════════

export type TrophicRole =
  | "producer"
  | "primary_consumer" // Herbivore
  | "secondary_consumer" // Carnivore / Omnivore
  | "tertiary_consumer" // Apex predator
  | "decomposer";

export type WeatherType = "sunny" | "rainy" | "stormy" | "drought" | "heatwave";

export type NaturalSelectionType = "directional" | "stabilizing" | "disruptive";

export type SymbiosisType = "mutualism" | "commensalism" | "parasitism" | "none";

export type DisturbanceType =
  | "wildfire"
  | "flood"
  | "disease_outbreak"
  | "deforestation"
  | "urbanization"
  | "overfishing"
  | "pollution"
  | "invasive_species";

export interface AdaptiveTrait {
  id: string;
  name: string;
  description: string;
  icon: string; // BioIcon or emoji
  category: "morphological" | "physiological" | "behavioral";
  fitnessImpact: number; // -1.0 to +1.0
  thermalToleranceBonus?: number; // °C shift
  droughtResistanceBonus?: number; // 0 to 1.0
  camouflageBonus?: number; // 0 to 1.0
  speedBonus?: number; // 0 to 1.0
  reproductiveCost?: number; // energy overhead
}

export interface Allele {
  symbol: string;
  name: string;
  effect: Partial<AdaptiveTrait>;
  dominance: "dominant" | "recessive" | "codominant";
  frequency: number; // 0.0 to 1.0
}

export interface GeneLocus {
  id: string;
  name: string;
  traitAssociated: string;
  alleles: Allele[];
  mutationRate: number; // e.g. 0.001 per generation
}

export interface Species {
  id: string;
  name: string;
  scientificName: string;
  trophicRole: TrophicRole;
  icon: string;
  color: string;
  accentColor: string;
  description: string;

  // Metabolic & Ecological Parameters
  baseBirthRate: number; // r
  baseMortalityRate: number; // d
  carryingCapacityContrib: number; // K impact
  energyRequirement: number; // kcal / unit / tick
  trophicLevel: number; // 1 = Producer, 2 = Herbivore, etc.

  // Environmental Preferences
  idealTemperature: number; // °C
  temperatureToleranceRange: number; // ± °C
  idealRainfall: number; // mm/year
  rainfallToleranceRange: number; // ± mm

  // Adaptive Traits & Genetics
  adaptiveTraits: AdaptiveTrait[];
  genome: GeneLocus[];

  // Inter-species Interactions
  dietSpeciesIds: string[]; // Species IDs eaten
  predatorSpeciesIds: string[]; // Species IDs that hunt this
  symbiosisPartnerId?: string;
  symbiosisType?: SymbiosisType;

  // Physical Attributes for 3D/Canvas Visuals
  spriteEmoji: string;
  bodySize: number; // 1-10
  movementSpeed: number; // 1-10
}

export interface Population {
  speciesId: string;
  count: number;
  health: number; // 0-100
  averageFitness: number; // 0-1.0
  alleleFrequencies: Record<string, number>; // allele symbol -> freq
  ageDistribution: {
    juvenile: number;
    adult: number;
    senior: number;
  };
  positions?: Array<{ x: number; y: number; vx: number; vy: number }>;
}

export interface Habitat {
  id: string;
  name: string;
  description: string;
  canopyCover: number; // 0-100%
  soilNutrients: number; // 0-100
  waterAvailability: number; // 0-100
  shelterIndex: number; // 0-100
}

export interface Climate {
  temperature: number; // °C
  rainfall: number; // mm/year
  sunlight: number; // % solar irradiance
  co2Level: number; // ppm
  weather: WeatherType;
  pollutionLevel: number; // 0-100%
  season: "spring" | "summer" | "autumn" | "winter";
}

export interface Biome {
  id: string;
  name: string;
  emoji: string;
  color: string;
  accentColor: string;
  description: string;
  location: string;
  defaultClimate: Climate;
  habitat: Habitat;
  facts: string[];
  nativeSpeciesIds: string[];
}

export interface Ecosystem {
  id: string;
  name: string;
  biomeId: string;
  climate: Climate;
  populations: Record<string, Population>; // speciesId -> Population
  activeDisturbances: DisturbanceEvent[];
  generation: number;
  timeElapsedDays: number;
  carryingCapacityMax: number;
}

export interface DisturbanceEvent {
  id: string;
  type: DisturbanceType;
  name: string;
  severity: number; // 1 - 100
  durationRemainingTicks: number; // Ticks remaining
  affectedSpeciesIds?: string[];
  description: string;
}

export interface FoodChainNode {
  speciesId: string;
  speciesName: string;
  trophicLevel: number;
  biomassKcal: number;
  energyTransferPercent: number;
}

export interface FoodWebEdge {
  sourceId: string; // Prey / Producer
  targetId: string; // Predator / Consumer
  interactionStrength: number; // 0-1.0
  type: "predation" | "herbivory" | "decomposition" | "parasitism";
}

export interface FoodWeb {
  nodes: FoodChainNode[];
  edges: FoodWebEdge[];
  trophicPyramid: Array<{ level: number; label: string; biomassKcal: number }>;
}

export interface BiodiversityMetrics {
  speciesRichness: number; // S
  shannonIndex: number; // H'
  simpsonIndex: number; // D
  evenness: number; // E = H' / ln(S)
  communityStabilityScore: number; // 0-100
}

export interface SpeciationEvent {
  generation: number;
  ancestorSpeciesId: string;
  newSpeciesId: string;
  newSpeciesName: string;
  driver: string; // e.g. "Geographic isolation & thermal trait divergence"
}

export interface PhylogeneticNode {
  id: string;
  name: string;
  scientificName: string;
  trophicRole: TrophicRole;
  divergenceGeneration: number;
  extinct: boolean;
  extinctionGeneration?: number;
  parentId?: string;
  childrenIds: string[];
  keyAdaptation?: string;
}

export interface EvolutionTimeline {
  nodes: PhylogeneticNode[];
  speciationEvents: SpeciationEvent[];
  extinctionEvents: Array<{ speciesId: string; speciesName: string; generation: number }>;
}

export interface EcosystemChallenge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetBiomeId: string;
  initialPopulations: Record<string, number>; // speciesId -> count
  initialClimate: Partial<Climate>;
  initialDisturbance?: DisturbanceType;
  goalDescription: string;
  winCondition: (ecosystem: Ecosystem, metrics: BiodiversityMetrics) => boolean;
  xpReward: number;
  badgeId?: string;
}

export interface EcologyQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  concept: string;
}
