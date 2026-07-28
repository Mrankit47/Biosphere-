// ═══════════════════════════════════════════════════════════════
// Biosphere — Ecology & Evolution Registry
// Extensible singleton registry supporting dynamic species & biomes
// ═══════════════════════════════════════════════════════════════

import { Biome, Species, AdaptiveTrait, DisturbanceEvent, DisturbanceType } from "../types";

export class EcologyRegistry {
  private static instance: EcologyRegistry;

  private biomes: Map<string, Biome> = new Map();
  private species: Map<string, Species> = new Map();
  private traits: Map<string, AdaptiveTrait> = new Map();

  private constructor() {
    this.seedDefaultRegistry();
  }

  public static getInstance(): EcologyRegistry {
    if (!EcologyRegistry.instance) {
      EcologyRegistry.instance = new EcologyRegistry();
    }
    return EcologyRegistry.instance;
  }

  // ── Registration Methods for Extensibility ─────────────────────

  public registerBiome(biome: Biome): void {
    this.biomes.set(biome.id, biome);
  }

  public registerSpecies(species: Species): void {
    this.species.set(species.id, species);
  }

  public registerTrait(trait: AdaptiveTrait): void {
    this.traits.set(trait.id, trait);
  }

  // ── Retrieval Methods ─────────────────────────────────────────

  public getBiome(id: string): Biome | undefined {
    return this.biomes.get(id);
  }

  public getAllBiomes(): Biome[] {
    return Array.from(this.biomes.values());
  }

  public getSpecies(id: string): Species | undefined {
    return this.species.get(id);
  }

  public getAllSpecies(): Species[] {
    return Array.from(this.species.values());
  }

  public getSpeciesByBiome(biomeId: string): Species[] {
    const biome = this.getBiome(biomeId);
    if (!biome) return [];
    return biome.nativeSpeciesIds
      .map((id) => this.getSpecies(id))
      .filter((s): s is Species => s !== undefined);
  }

  public getTrait(id: string): AdaptiveTrait | undefined {
    return this.traits.get(id);
  }

  // ── Helper to Create Disturbance Template ────────────────────

  public createDisturbance(type: DisturbanceType, severity = 50, durationTicks = 120): DisturbanceEvent {
    const disturbanceMap: Record<DisturbanceType, { name: string; description: string }> = {
      wildfire: {
        name: "Wildfire Surge",
        description: "Rapidly burns forest vegetation, driving producers down and heating the habitat.",
      },
      flood: {
        name: "Flash Torrent & Flood",
        description: "Excess precipitation submerges ground habitats, leaching soil nutrients.",
      },
      disease_outbreak: {
        name: "Pathogenic Epidemic",
        description: "Contagious pathogen reduces health and survival rates of vulnerable species.",
      },
      deforestation: {
        name: "Habitat Fragmentation & Logging",
        description: "Human land-clearing drops carrying capacity and destroys canopy cover.",
      },
      urbanization: {
        name: "Urban Encroachment",
        description: "Impervious surfaces reduce water infiltration and fragment migration corridors.",
      },
      overfishing: {
        name: "Overexploitation / Overharvesting",
        description: "Unstable human extraction drastically lowers marine population levels.",
      },
      pollution: {
        name: "Toxic Waste Contamination",
        description: "Chemical runoff bioaccumulates up trophic levels, impairing reproduction.",
      },
      invasive_species: {
        name: "Invasive Bio-Invasion",
        description: "Non-native species outcompetes native herbivores for primary producers.",
      },
    };

    const info = disturbanceMap[type] || {
      name: "Environmental Disturbance",
      description: "Unusual ecological disturbance affecting community balance.",
    };

    return {
      id: `dist_${type}_${Date.now()}`,
      type,
      name: info.name,
      severity,
      durationRemainingTicks: durationTicks,
      description: info.description,
    };
  }

  // ── Seed Default Biomes & Species ─────────────────────────────

  private seedDefaultRegistry(): void {
    // 1. Adaptive Traits
    const traitsList: AdaptiveTrait[] = [
      {
        id: "trait_thick_fur",
        name: "Dense Insulating Fur",
        description: "Reduces heat loss, boosting fitness in frigid temperatures.",
        icon: "❄️",
        category: "morphological",
        fitnessImpact: 0.15,
        thermalToleranceBonus: -15,
      },
      {
        id: "trait_drought_succulence",
        name: "Crassulacean Acid Metabolism (CAM)",
        description: "Stores water and minimizes transpiration during extreme heat.",
        icon: "🌵",
        category: "physiological",
        fitnessImpact: 0.25,
        droughtResistanceBonus: 0.4,
      },
      {
        id: "trait_apex_camouflage",
        name: "Ambush Camouflage Pattern",
        description: "Blends into ambient foliage, increasing hunting efficiency.",
        icon: "🐆",
        category: "behavioral",
        fitnessImpact: 0.2,
        camouflageBonus: 0.35,
      },
      {
        id: "trait_swift_sprint",
        name: "Musculoskeletal Burst Sprint",
        description: "Enables rapid escape from apex predators.",
        icon: "⚡",
        category: "morphological",
        fitnessImpact: 0.18,
        speedBonus: 0.4,
      },
    ];
    traitsList.forEach((t) => this.registerTrait(t));

    // 2. Species List
    const speciesList: Species[] = [
      // --- Producers ---
      {
        id: "spec_oak_grass",
        name: "Temperate Oak & Wild Grass",
        scientificName: "Quercus robur / Poaceae",
        trophicRole: "producer",
        icon: "🌿",
        color: "#10b981",
        accentColor: "#34d399",
        description: "Primary photosynthetic producer anchoring forest ecosystem energy.",
        baseBirthRate: 0.12,
        baseMortalityRate: 0.02,
        carryingCapacityContrib: 1.0,
        energyRequirement: 0.1,
        trophicLevel: 1,
        idealTemperature: 20,
        temperatureToleranceRange: 15,
        idealRainfall: 100,
        rainfallToleranceRange: 60,
        adaptiveTraits: [],
        genome: [
          {
            id: "loc_growth",
            name: "Photosynthetic Efficiency",
            traitAssociated: "Growth Rate",
            mutationRate: 0.002,
            alleles: [
              { symbol: "P1", name: "Standard", effect: {}, dominance: "dominant", frequency: 0.8 },
              { symbol: "P2", name: "High Yield", effect: { fitnessImpact: 0.1 }, dominance: "recessive", frequency: 0.2 },
            ],
          },
        ],
        dietSpeciesIds: [],
        predatorSpeciesIds: ["spec_forest_deer", "spec_cottontail_rabbit"],
        spriteEmoji: "🌿",
        bodySize: 3,
        movementSpeed: 0,
      },
      {
        id: "spec_coral_algae",
        name: "Zooxanthellae Symbiotic Algae",
        scientificName: "Symbiodiniaceae",
        trophicRole: "producer",
        icon: "🪸",
        color: "#f43f5e",
        accentColor: "#fb7185",
        description: "Microscopic photosynthetic dinoflagellates powering coral reef structures.",
        baseBirthRate: 0.15,
        baseMortalityRate: 0.03,
        carryingCapacityContrib: 1.2,
        energyRequirement: 0.05,
        trophicLevel: 1,
        idealTemperature: 26,
        temperatureToleranceRange: 4,
        idealRainfall: 120,
        rainfallToleranceRange: 80,
        adaptiveTraits: [],
        genome: [],
        dietSpeciesIds: [],
        predatorSpeciesIds: ["spec_parrotfish"],
        spriteEmoji: "🌱",
        bodySize: 1,
        movementSpeed: 0,
      },
      {
        id: "spec_saguaro_cactus",
        name: "Sonoran Saguaro Cactus",
        scientificName: "Carnegiea gigantea",
        trophicRole: "producer",
        icon: "🌵",
        color: "#f59e0b",
        accentColor: "#fbbf24",
        description: "Succulent desert producer specialized in moisture retention.",
        baseBirthRate: 0.06,
        baseMortalityRate: 0.01,
        carryingCapacityContrib: 0.8,
        energyRequirement: 0.05,
        trophicLevel: 1,
        idealTemperature: 32,
        temperatureToleranceRange: 18,
        idealRainfall: 25,
        rainfallToleranceRange: 20,
        adaptiveTraits: [this.getTrait("trait_drought_succulence")!].filter(Boolean),
        genome: [],
        dietSpeciesIds: [],
        predatorSpeciesIds: ["spec_kangaroo_rat"],
        spriteEmoji: "🌵",
        bodySize: 4,
        movementSpeed: 0,
      },

      // --- Herbivores ---
      {
        id: "spec_forest_deer",
        name: "White-Tailed Forest Deer",
        scientificName: "Odocoileus virginianus",
        trophicRole: "primary_consumer",
        icon: "🦌",
        color: "#3b82f6",
        accentColor: "#60a5fa",
        description: "Herbivorous browser feeding on grasses, leaves, and saplings.",
        baseBirthRate: 0.08,
        baseMortalityRate: 0.04,
        carryingCapacityContrib: 0.5,
        energyRequirement: 1.5,
        trophicLevel: 2,
        idealTemperature: 18,
        temperatureToleranceRange: 20,
        idealRainfall: 90,
        rainfallToleranceRange: 50,
        adaptiveTraits: [this.getTrait("trait_swift_sprint")!].filter(Boolean),
        genome: [],
        dietSpeciesIds: ["spec_oak_grass"],
        predatorSpeciesIds: ["spec_timber_wolf"],
        spriteEmoji: "🦌",
        bodySize: 6,
        movementSpeed: 6,
      },
      {
        id: "spec_parrotfish",
        name: "Stoplight Parrotfish",
        scientificName: "Sparisoma viride",
        trophicRole: "primary_consumer",
        icon: "🐠",
        color: "#06b6d4",
        accentColor: "#22d3ee",
        description: "Reef grazer cleaning turf algae from coral substrates.",
        baseBirthRate: 0.09,
        baseMortalityRate: 0.04,
        carryingCapacityContrib: 0.6,
        energyRequirement: 1.2,
        trophicLevel: 2,
        idealTemperature: 27,
        temperatureToleranceRange: 5,
        idealRainfall: 100,
        rainfallToleranceRange: 90,
        adaptiveTraits: [],
        genome: [],
        dietSpeciesIds: ["spec_coral_algae"],
        predatorSpeciesIds: ["spec_reef_shark"],
        spriteEmoji: "🐠",
        bodySize: 4,
        movementSpeed: 5,
      },
      {
        id: "spec_kangaroo_rat",
        name: "Merriam's Kangaroo Rat",
        scientificName: "Dipodomys merriami",
        trophicRole: "primary_consumer",
        icon: "🐭",
        color: "#d97706",
        accentColor: "#f59e0b",
        description: "Nocturnal desert herbivore harvesting seeds with ultra-concentrated urine.",
        baseBirthRate: 0.11,
        baseMortalityRate: 0.05,
        carryingCapacityContrib: 0.4,
        energyRequirement: 0.8,
        trophicLevel: 2,
        idealTemperature: 30,
        temperatureToleranceRange: 16,
        idealRainfall: 20,
        rainfallToleranceRange: 15,
        adaptiveTraits: [this.getTrait("trait_drought_succulence")!].filter(Boolean),
        genome: [],
        dietSpeciesIds: ["spec_saguaro_cactus"],
        predatorSpeciesIds: ["spec_desert_coyote"],
        spriteEmoji: "🐭",
        bodySize: 2,
        movementSpeed: 7,
      },

      // --- Carnivores / Apex Predators ---
      {
        id: "spec_timber_wolf",
        name: "Gray Timber Wolf",
        scientificName: "Canis lupus",
        trophicRole: "tertiary_consumer",
        icon: "🐺",
        color: "#8b5cf6",
        accentColor: "#a78bfa",
        description: "Keystone pack predator maintaining ungulate population equilibrium.",
        baseBirthRate: 0.04,
        baseMortalityRate: 0.03,
        carryingCapacityContrib: 0.2,
        energyRequirement: 4.5,
        trophicLevel: 4,
        idealTemperature: 15,
        temperatureToleranceRange: 22,
        idealRainfall: 85,
        rainfallToleranceRange: 60,
        adaptiveTraits: [this.getTrait("trait_thick_fur")!, this.getTrait("trait_apex_camouflage")!].filter(Boolean),
        genome: [],
        dietSpeciesIds: ["spec_forest_deer"],
        predatorSpeciesIds: [],
        spriteEmoji: "🐺",
        bodySize: 8,
        movementSpeed: 8,
      },
      {
        id: "spec_reef_shark",
        name: "Caribbean Reef Shark",
        scientificName: "Carcharhinus perezii",
        trophicRole: "tertiary_consumer",
        icon: "🦈",
        color: "#ec4899",
        accentColor: "#f472b6",
        description: "Apex marine predator regulating reef fish food webs.",
        baseBirthRate: 0.03,
        baseMortalityRate: 0.02,
        carryingCapacityContrib: 0.15,
        energyRequirement: 5.0,
        trophicLevel: 4,
        idealTemperature: 26,
        temperatureToleranceRange: 4,
        idealRainfall: 110,
        rainfallToleranceRange: 80,
        adaptiveTraits: [],
        genome: [],
        dietSpeciesIds: ["spec_parrotfish"],
        predatorSpeciesIds: [],
        spriteEmoji: "🦈",
        bodySize: 9,
        movementSpeed: 9,
      },
      {
        id: "spec_desert_coyote",
        name: "Sonoran Desert Coyote",
        scientificName: "Canis latrans",
        trophicRole: "secondary_consumer",
        icon: "🦊",
        color: "#ea580c",
        accentColor: "#fb923c",
        description: "Opportunistic desert carnivore preying on rodents and reptiles.",
        baseBirthRate: 0.05,
        baseMortalityRate: 0.03,
        carryingCapacityContrib: 0.25,
        energyRequirement: 3.2,
        trophicLevel: 3,
        idealTemperature: 28,
        temperatureToleranceRange: 18,
        idealRainfall: 30,
        rainfallToleranceRange: 25,
        adaptiveTraits: [this.getTrait("trait_apex_camouflage")!].filter(Boolean),
        genome: [],
        dietSpeciesIds: ["spec_kangaroo_rat"],
        predatorSpeciesIds: [],
        spriteEmoji: "🦊",
        bodySize: 6,
        movementSpeed: 8,
      },

      // --- Decomposers ---
      {
        id: "spec_bracket_fungi",
        name: "Forest Bracket Fungi",
        scientificName: "Ganoderma applanatum",
        trophicRole: "decomposer",
        icon: "🍄",
        color: "#a855f7",
        accentColor: "#c084fc",
        description: "Decomposer recycling dead organic matter and lignocellulose into soil nutrients.",
        baseBirthRate: 0.1,
        baseMortalityRate: 0.02,
        carryingCapacityContrib: 0.9,
        energyRequirement: 0.08,
        trophicLevel: 5,
        idealTemperature: 19,
        temperatureToleranceRange: 14,
        idealRainfall: 95,
        rainfallToleranceRange: 55,
        adaptiveTraits: [],
        genome: [],
        dietSpeciesIds: ["spec_oak_grass", "spec_forest_deer", "spec_timber_wolf"],
        predatorSpeciesIds: [],
        spriteEmoji: "🍄",
        bodySize: 2,
        movementSpeed: 0,
      },
    ];
    speciesList.forEach((s) => this.registerSpecies(s));

    // 3. Default Biomes
    const biomesList: Biome[] = [
      {
        id: "forest",
        name: "Temperate Deciduous Forest",
        emoji: "🌲",
        color: "#10b981",
        accentColor: "#34d399",
        description: "Rich canopy forest with distinct four-season climate and fertile humus soil.",
        location: "North America, Central Europe, East Asia",
        defaultClimate: {
          temperature: 18,
          rainfall: 95,
          sunlight: 75,
          co2Level: 415,
          weather: "sunny",
          pollutionLevel: 5,
          season: "summer",
        },
        habitat: {
          id: "hab_forest",
          name: "Deciduous Woodland",
          description: "Layered habitat with canopy, understory, and detritus litter.",
          canopyCover: 80,
          soilNutrients: 85,
          waterAvailability: 80,
          shelterIndex: 75,
        },
        facts: [
          "A single mature oak tree supports over 2,300 species of insects, fungi, and birds.",
          "Deciduous leaf drop every autumn builds deep, nutrient-rich topsoil layer.",
        ],
        nativeSpeciesIds: [
          "spec_oak_grass",
          "spec_forest_deer",
          "spec_timber_wolf",
          "spec_bracket_fungi",
        ],
      },
      {
        id: "reef",
        name: "Tropical Coral Reef",
        emoji: "🪸",
        color: "#f43f5e",
        accentColor: "#fb7185",
        description: "Biodiverse marine ecosystem built by symbiotic calcium carbonate corals.",
        location: "Indo-Pacific, Caribbean, Great Barrier Reef",
        defaultClimate: {
          temperature: 26,
          rainfall: 110,
          sunlight: 90,
          co2Level: 415,
          weather: "sunny",
          pollutionLevel: 10,
          season: "summer",
        },
        habitat: {
          id: "hab_reef",
          name: "Shallow Reef Slope",
          description: "Clear tropical ocean habitat with high solar penetration.",
          canopyCover: 20,
          soilNutrients: 60,
          waterAvailability: 100,
          shelterIndex: 90,
        },
        facts: [
          "Coral reefs harbor 25% of all marine life despite occupying less than 0.1% of the ocean floor.",
          "Bleaching occurs when water temperatures rise 1–2°C above summer maximums.",
        ],
        nativeSpeciesIds: ["spec_coral_algae", "spec_parrotfish", "spec_reef_shark"],
      },
      {
        id: "desert",
        name: "Sonoran Desert Scrub",
        emoji: "🏜️",
        color: "#f59e0b",
        accentColor: "#fbbf24",
        description: "Arid biome characterized by low precipitation, succulent flora, and thermal extremes.",
        location: "Southwestern United States, Northern Mexico",
        defaultClimate: {
          temperature: 32,
          rainfall: 25,
          sunlight: 95,
          co2Level: 415,
          weather: "sunny",
          pollutionLevel: 2,
          season: "summer",
        },
        habitat: {
          id: "hab_desert",
          name: "Arid Alluvial Plain",
          description: "Sparse vegetation cover with high diurnal temperature swings.",
          canopyCover: 10,
          soilNutrients: 35,
          waterAvailability: 15,
          shelterIndex: 40,
        },
        facts: [
          "Saguaro cacti can absorb up to 200 gallons of water during a single rainstorm.",
          "Desert organisms utilize nocturnal activity patterns to conserve metabolic moisture.",
        ],
        nativeSpeciesIds: ["spec_saguaro_cactus", "spec_kangaroo_rat", "spec_desert_coyote"],
      },
    ];
    biomesList.forEach((b) => this.registerBiome(b));
  }
}
