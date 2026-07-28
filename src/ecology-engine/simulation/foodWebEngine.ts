// ═══════════════════════════════════════════════════════════════
// Biosphere — Food Web & Trophic Network Engine
// Trophic energy pyramids, 10% energy transfer rule & bioaccumulation solver
// ═══════════════════════════════════════════════════════════════

import { Ecosystem, FoodWeb, FoodChainNode, FoodWebEdge } from "../types";
import { EcologyRegistry } from "../registry/EcologyRegistry";

export class FoodWebEngine {
  /**
   * Constructs the full interactive Food Web and Trophic Pyramid for an ecosystem state
   */
  public static buildFoodWeb(ecosystem: Ecosystem): FoodWeb {
    const registry = EcologyRegistry.getInstance();
    const pops = ecosystem.populations;
    const pollutionLevel = ecosystem.climate.pollutionLevel;

    const nodes: FoodChainNode[] = [];
    const edges: FoodWebEdge[] = [];

    const trophicLevelsMap: Record<number, number> = {
      1: 0, // Producer kcal
      2: 0, // Primary Consumer
      3: 0, // Secondary Consumer
      4: 0, // Apex Predator
      5: 0, // Decomposer
    };

    Object.keys(pops).forEach((specId) => {
      const pop = pops[specId];
      const spec = registry.getSpecies(specId);
      if (!spec || pop.count <= 0) return;

      // Calculate approximate biomass in kcal (1 unit ~ 100 kcal * bodySize)
      const baseBiomass = pop.count * spec.bodySize * 100;
      // Bioaccumulation multiplier: increases exponentially up trophic levels
      const bioaccumFactor = Math.pow(1.5, spec.trophicLevel - 1);
      const bioaccumToxinKcal = Math.round(baseBiomass * (pollutionLevel / 100) * bioaccumFactor);

      nodes.push({
        speciesId: spec.id,
        speciesName: spec.name,
        trophicLevel: spec.trophicLevel,
        biomassKcal: baseBiomass,
        energyTransferPercent: spec.trophicLevel === 1 ? 100 : 10,
      });

      trophicLevelsMap[spec.trophicLevel] = (trophicLevelsMap[spec.trophicLevel] || 0) + baseBiomass;

      // Construct predation/herbivory edges
      spec.dietSpeciesIds.forEach((preyId) => {
        if (pops[preyId] && pops[preyId].count > 0) {
          edges.push({
            sourceId: preyId,
            targetId: spec.id,
            interactionStrength: 0.8,
            type: spec.trophicRole === "primary_consumer" ? "herbivory" : "predation",
          });
        }
      });
    });

    const trophicPyramid = [
      { level: 1, label: "Producers (Primary Energy)", biomassKcal: trophicLevelsMap[1] || 0 },
      { level: 2, label: "Primary Consumers (Herbivores)", biomassKcal: trophicLevelsMap[2] || 0 },
      { level: 3, label: "Secondary Consumers (Carnivores)", biomassKcal: trophicLevelsMap[3] || 0 },
      { level: 4, label: "Tertiary Consumers (Apex Predators)", biomassKcal: trophicLevelsMap[4] || 0 },
      { level: 5, label: "Decomposers (Nutrient Recyclers)", biomassKcal: trophicLevelsMap[5] || 0 },
    ];

    return {
      nodes,
      edges,
      trophicPyramid,
    };
  }
}
