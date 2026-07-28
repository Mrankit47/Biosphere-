// ═══════════════════════════════════════════════════════════════
// Biosphere — AI Ecology & Evolution Pedagogical Mentor
// Contextual scientific explanation generator for AI Mentor integration
// ═══════════════════════════════════════════════════════════════

import { Ecosystem, BiodiversityMetrics, EvolutionTimeline } from "../types";
import { EcologyRegistry } from "../registry/EcologyRegistry";

export interface EcologyAIStateContext {
  biomeName: string;
  generation: number;
  temperature: number;
  rainfall: number;
  weather: string;
  activeDisturbances: string[];
  speciesCounts: Array<{ name: string; role: string; count: number }>;
  shannonIndex: number;
  evenness: number;
  recentSpeciations: number;
  recentExtinctions: number;
}

export class EcologyAIMentor {
  /**
   * Summarizes the numerical state into a structured AI context payload
   */
  public static buildStateContext(
    ecosystem: Ecosystem,
    metrics: BiodiversityMetrics,
    timeline?: EvolutionTimeline
  ): EcologyAIStateContext {
    const registry = EcologyRegistry.getInstance();
    const biome = registry.getBiome(ecosystem.biomeId);

    const speciesCounts = Object.keys(ecosystem.populations).map((specId) => {
      const pop = ecosystem.populations[specId];
      const spec = registry.getSpecies(specId);
      return {
        name: spec?.name || specId,
        role: spec?.trophicRole || "unknown",
        count: pop.count,
      };
    });

    const activeDisturbances = ecosystem.activeDisturbances.map((d) => `${d.name} (Severity: ${d.severity}%)`);

    return {
      biomeName: biome?.name || ecosystem.biomeId,
      generation: ecosystem.generation,
      temperature: ecosystem.climate.temperature,
      rainfall: ecosystem.climate.rainfall,
      weather: ecosystem.climate.weather,
      activeDisturbances,
      speciesCounts,
      shannonIndex: metrics.shannonIndex,
      evenness: metrics.evenness,
      recentSpeciations: timeline?.speciationEvents.length || 0,
      recentExtinctions: timeline?.extinctionEvents.length || 0,
    };
  }

  /**
   * Generates automatic scientific insights and explanations based on ecosystem trends
   */
  public static generateScientificInsights(
    ecosystem: Ecosystem,
    metrics: BiodiversityMetrics
  ): string[] {
    const insights: string[] = [];
    const pops = ecosystem.populations;
    const climate = ecosystem.climate;

    // Check carrying capacity vs total population
    const totalCount = Object.values(pops).reduce((sum, p) => sum + p.count, 0);
    if (totalCount > ecosystem.carryingCapacityMax * 0.9) {
      insights.push(
        "⚠️ **Carrying Capacity Stress**: Community population is approaching maximum ecological limits ($K$). Intraspecific resource competition is escalating."
      );
    }

    // Check trophic collapse
    const producersCount = Object.values(pops).reduce((sum, p) => {
      const spec = EcologyRegistry.getInstance().getSpecies(p.speciesId);
      return spec?.trophicRole === "producer" ? sum + p.count : sum;
    }, 0);

    if (producersCount < 30) {
      insights.push(
        "🚨 **Primary Producer Collapse**: Photosynthetic biomass has dropped critically! Trophic energy transfer up to herbivores and carnivores is severely endangered."
      );
    }

    // Abiotic climate stress
    if (climate.temperature > 38) {
      insights.push(
        "🔥 **Thermal Extreme Warning**: Temperatures exceeding 38°C induce heat shock proteins and metabolic stress in non-adapted species."
      );
    }
    if (climate.weather === "drought") {
      insights.push(
        "🌵 **Hydrological Drought**: Stomatal closure in plants limits carbon fixation, reducing ecosystem primary productivity."
      );
    }

    // Biodiversity score commentary
    if (metrics.shannonIndex > 1.2) {
      insights.push(
        `🌿 **High Biodiversity ($H' = ${metrics.shannonIndex}$)**: The ecosystem exhibits strong ecological resilience against environmental perturbations.`
      );
    } else if (metrics.shannonIndex < 0.5) {
      insights.push(
        `📉 **Low Diversity Warning ($H' = ${metrics.shannonIndex}$)**: Community monoculture increases vulnerability to trophic cascades and epidemics.`
      );
    }

    if (insights.length === 0) {
      insights.push(
        "✅ **Dynamic Equilibrium**: Predator-prey Lotka-Volterra feedback loops are currently stable. Energy flow across trophic levels is balanced."
      );
    }

    return insights;
  }
}
