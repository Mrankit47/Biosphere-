// ═══════════════════════════════════════════════════════════════
// Biosphere — Ecosystem Physics & Mathematical Engine
// Multi-species Lotka-Volterra differential engine with abiotic & disturbance forces
// ═══════════════════════════════════════════════════════════════

import { Ecosystem, Population, Climate, DisturbanceEvent, BiodiversityMetrics } from "../types";
import { EcologyRegistry } from "../registry/EcologyRegistry";

export class EcosystemEngine {
  /**
   * Initializes a default ecosystem instance for a given biome
   */
  public static createInitialEcosystem(biomeId: string): Ecosystem {
    const registry = EcologyRegistry.getInstance();
    const biome = registry.getBiome(biomeId) || registry.getAllBiomes()[0];
    const speciesList = registry.getSpeciesByBiome(biome.id);

    const populations: Record<string, Population> = {};

    speciesList.forEach((spec) => {
      let initialCount = 100;
      if (spec.trophicRole === "producer") initialCount = 200;
      if (spec.trophicRole === "primary_consumer") initialCount = 60;
      if (spec.trophicRole === "secondary_consumer") initialCount = 20;
      if (spec.trophicRole === "tertiary_consumer") initialCount = 8;
      if (spec.trophicRole === "decomposer") initialCount = 120;

      // Generate random initial positions for visual canvas
      const positions = Array.from({ length: Math.min(initialCount, 50) }, () => ({
        x: Math.random() * 800,
        y: Math.random() * 500,
        vx: (Math.random() - 0.5) * (spec.movementSpeed * 0.4),
        vy: (Math.random() - 0.5) * (spec.movementSpeed * 0.4),
      }));

      populations[spec.id] = {
        speciesId: spec.id,
        count: initialCount,
        health: 95,
        averageFitness: 1.0,
        alleleFrequencies: { P1: 0.8, P2: 0.2 },
        ageDistribution: { juvenile: 0.3, adult: 0.5, senior: 0.2 },
        positions,
      };
    });

    return {
      id: `eco_${biomeId}_${Date.now()}`,
      name: `${biome.name} Simulation`,
      biomeId: biome.id,
      climate: { ...biome.defaultClimate },
      populations,
      activeDisturbances: [],
      generation: 1,
      timeElapsedDays: 0,
      carryingCapacityMax: 400,
    };
  }

  /**
   * Advances the ecosystem state by one time step (tick).
   * Calculates sub-step numerical integration for population dynamics.
   */
  public static tick(ecosystem: Ecosystem): Ecosystem {
    const registry = EcologyRegistry.getInstance();
    const nextPopulations: Record<string, Population> = { ...ecosystem.populations };
    const climate = ecosystem.climate;
    const disturbances = ecosystem.activeDisturbances;

    // Calculate active disturbance multipliers
    let wildfireSeverity = 0;
    let floodSeverity = 0;
    let diseaseSeverity = 0;
    let pollutionSeverity = climate.pollutionLevel;

    disturbances.forEach((d) => {
      if (d.type === "wildfire") wildfireSeverity += d.severity;
      if (d.type === "flood") floodSeverity += d.severity;
      if (d.type === "disease_outbreak") diseaseSeverity += d.severity;
      if (d.type === "pollution") pollutionSeverity += d.severity;
    });

    // 1. Calculate dynamic carrying capacity K based on climate & disturbances
    const tempDev = Math.abs(climate.temperature - 20) * 2;
    const rainDev = Math.abs(climate.rainfall - 80) * 1.5;
    const baseK = ecosystem.carryingCapacityMax;
    const K = Math.max(50, baseK - tempDev - rainDev - wildfireSeverity * 2 - pollutionSeverity * 1.5);

    // 2. Iterate species and apply modified Lotka-Volterra equations
    const speciesIds = Object.keys(nextPopulations);

    speciesIds.forEach((specId) => {
      const pop = nextPopulations[specId];
      const spec = registry.getSpecies(specId);
      if (!spec || pop.count <= 0) return;

      // Abiotic temperature & rainfall tolerance factor (0.1 to 1.2)
      const tempDiff = Math.abs(climate.temperature - spec.idealTemperature);
      const tempFactor = Math.max(0.1, 1.0 - tempDiff / (spec.temperatureToleranceRange * 2));

      const rainDiff = Math.abs(climate.rainfall - spec.idealRainfall);
      const rainFactor = Math.max(0.1, 1.0 - rainDiff / (spec.rainfallToleranceRange * 2));

      const fitnessMultiplier = pop.averageFitness * tempFactor * rainFactor;

      // Intrinsic growth rate modified by traits & abiotic fitness
      let r = spec.baseBirthRate * fitnessMultiplier;
      let d = spec.baseMortalityRate / Math.max(0.2, fitnessMultiplier);

      // Apply disturbance impacts
      if (spec.trophicRole === "producer" && wildfireSeverity > 0) {
        d += (wildfireSeverity / 100) * 0.25;
      }
      if (diseaseSeverity > 0) {
        d += (diseaseSeverity / 100) * 0.15;
      }
      if (pollutionSeverity > 0) {
        d += (pollutionSeverity / 100) * 0.1;
      }

      // Predator-prey interactions
      let predationLoss = 0;
      let preyGain = 0;

      // Predators eating this species
      spec.predatorSpeciesIds.forEach((predId) => {
        const predPop = nextPopulations[predId];
        if (predPop && predPop.count > 0) {
          const predSpec = registry.getSpecies(predId);
          const attackRate = 0.002 * (predSpec ? predSpec.movementSpeed / 5 : 1);
          predationLoss += attackRate * pop.count * predPop.count;
        }
      });

      // This species eating prey
      spec.dietSpeciesIds.forEach((preyId) => {
        const preyPop = nextPopulations[preyId];
        if (preyPop && preyPop.count > 0) {
          const conversionEfficiency = spec.trophicRole === "primary_consumer" ? 0.08 : 0.12;
          preyGain += conversionEfficiency * 0.002 * pop.count * preyPop.count;
        }
      });

      // Calculate total delta N using Logistic growth + Trophic exchange
      let deltaN = 0;

      if (spec.trophicRole === "producer") {
        // Logistic growth bounded by K
        deltaN = r * pop.count * (1 - pop.count / K) - d * pop.count - predationLoss;
      } else {
        // Consumer growth dependent on prey gain
        deltaN = preyGain * r - d * pop.count - predationLoss;
      }

      // Decomposers thrive on high overall mortality
      if (spec.trophicRole === "decomposer") {
        deltaN += 0.03 * pop.count * (1 - pop.count / (K * 0.8));
      }

      // Apply delta with soft limits
      const updatedCount = Math.max(0, Math.round(pop.count + deltaN));

      // Update positions on 2D canvas
      const updatedPositions = (pop.positions || []).map((pos) => {
        let nx = pos.x + pos.vx;
        let ny = pos.y + pos.vy;
        let nvx = pos.vx;
        let nvy = pos.vy;

        if (nx < 20 || nx > 780) nvx = -nvx;
        if (ny < 20 || ny > 480) nvy = -nvy;

        // Slight jitter
        nvx += (Math.random() - 0.5) * 0.2;
        nvy += (Math.random() - 0.5) * 0.2;

        return { x: nx, y: ny, vx: nvx, vy: nvy };
      });

      nextPopulations[specId] = {
        ...pop,
        count: updatedCount,
        positions: updatedPositions,
      };
    });

    // Tick remaining duration of active disturbances
    const nextDisturbances = disturbances
      .map((dist) => ({
        ...dist,
        durationRemainingTicks: dist.durationRemainingTicks - 1,
      }))
      .filter((dist) => dist.durationRemainingTicks > 0);

    return {
      ...ecosystem,
      populations: nextPopulations,
      activeDisturbances: nextDisturbances,
      generation: ecosystem.generation + 1,
      timeElapsedDays: ecosystem.timeElapsedDays + 5,
    };
  }

  /**
   * Calculates Shannon Diversity Index H', Simpson Index D, and species richness
   */
  public static calculateBiodiversityMetrics(ecosystem: Ecosystem): BiodiversityMetrics {
    const pops = Object.values(ecosystem.populations).filter((p) => p.count > 0);
    const totalIndividualCount = pops.reduce((sum, p) => sum + p.count, 0);

    const speciesRichness = pops.length;
    if (totalIndividualCount === 0 || speciesRichness === 0) {
      return {
        speciesRichness: 0,
        shannonIndex: 0,
        simpsonIndex: 0,
        evenness: 0,
        communityStabilityScore: 0,
      };
    }

    let shannon = 0;
    let simpsonSum = 0;

    pops.forEach((p) => {
      const pi = p.count / totalIndividualCount;
      if (pi > 0) {
        shannon -= pi * Math.log(pi);
        simpsonSum += pi * pi;
      }
    });

    const simpsonIndex = 1 - simpsonSum;
    const maxShannon = Math.log(speciesRichness) || 1;
    const evenness = shannon / maxShannon;

    // Stability score (0-100) based on evenness & richness
    const communityStabilityScore = Math.min(100, Math.round(shannon * 30 + evenness * 40));

    return {
      speciesRichness,
      shannonIndex: Number(shannon.toFixed(3)),
      simpsonIndex: Number(simpsonIndex.toFixed(3)),
      evenness: Number(evenness.toFixed(3)),
      communityStabilityScore,
    };
  }
}
