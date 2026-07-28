// ═══════════════════════════════════════════════════════════════
// Biosphere — Evolution & Genetics Engine
// Allele frequency dynamics, natural selection, speciation & phylogenetic cladograms
// ═══════════════════════════════════════════════════════════════

import {
  Ecosystem,
  EvolutionTimeline,
  PhylogeneticNode,
  SpeciationEvent,
  NaturalSelectionType,
  Species,
} from "../types";
import { EcologyRegistry } from "../registry/EcologyRegistry";

export class EvolutionEngine {
  /**
   * Initializes default phylogenetic cladogram tree for the initial species pool
   */
  public static createInitialTimeline(): EvolutionTimeline {
    const registry = EcologyRegistry.getInstance();
    const speciesList = registry.getAllSpecies();

    // Create root ancestor node
    const rootNode: PhylogeneticNode = {
      id: "phylo_root",
      name: "LUCA (Last Universal Common Ancestor)",
      scientificName: "Primordial Ancestor",
      trophicRole: "producer",
      divergenceGeneration: 0,
      extinct: false,
      childrenIds: speciesList.map((s) => s.id),
    };

    const speciesNodes: PhylogeneticNode[] = speciesList.map((s) => ({
      id: s.id,
      name: s.name,
      scientificName: s.scientificName,
      trophicRole: s.trophicRole,
      divergenceGeneration: 1,
      extinct: false,
      parentId: "phylo_root",
      childrenIds: [],
      keyAdaptation: s.adaptiveTraits[0]?.name || "Base metabolic adaptation",
    }));

    return {
      nodes: [rootNode, ...speciesNodes],
      speciationEvents: [],
      extinctionEvents: [],
    };
  }

  /**
   * Evaluates natural selection and genetic shifts across generations
   */
  public static processEvolutionStep(
    ecosystem: Ecosystem,
    timeline: EvolutionTimeline,
    selectionType: NaturalSelectionType = "directional"
  ): { updatedEcosystem: Ecosystem; updatedTimeline: EvolutionTimeline } {
    const registry = EcologyRegistry.getInstance();
    const currentGen = ecosystem.generation;

    const nextPopulations = { ...ecosystem.populations };
    const speciationEvents: SpeciationEvent[] = [...timeline.speciationEvents];
    const extinctionEvents = [...timeline.extinctionEvents];
    const nodes = [...timeline.nodes];

    Object.keys(nextPopulations).forEach((specId) => {
      const pop = nextPopulations[specId];
      const spec = registry.getSpecies(specId);
      if (!spec) return;

      // 1. Check for Extinction event
      if (pop.count <= 0) {
        const existingExtinction = extinctionEvents.find((e) => e.speciesId === specId);
        if (!existingExtinction) {
          extinctionEvents.push({
            speciesId: specId,
            speciesName: spec.name,
            generation: currentGen,
          });

          // Mark node as extinct in phylogenetic tree
          const nodeIdx = nodes.findIndex((n) => n.id === specId);
          if (nodeIdx !== -1) {
            nodes[nodeIdx] = {
              ...nodes[nodeIdx],
              extinct: true,
              extinctionGeneration: currentGen,
            };
          }
        }
        return;
      }

      // 2. Allele Frequency Shift under Environmental Fitness Pressure
      const currentAlleles = { ...pop.alleleFrequencies };
      const climate = ecosystem.climate;

      // Calculate selection coefficient s based on temperature & selection mode
      let s = 0.01;
      if (selectionType === "directional") {
        s = Math.min(0.1, Math.abs(climate.temperature - spec.idealTemperature) * 0.005);
      } else if (selectionType === "disruptive") {
        s = 0.08;
      } else {
        // Stabilizing selection preserves current mean
        s = -0.02;
      }

      // Hardy-Weinberg mutation & selection shift
      let p = currentAlleles["P1"] ?? 0.8;
      p = Math.min(0.99, Math.max(0.01, p + s * p * (1 - p)));
      currentAlleles["P1"] = Number(p.toFixed(3));
      currentAlleles["P2"] = Number((1 - p).toFixed(3));

      // Calculate updated average fitness score
      const newFitness = Math.min(1.0, Math.max(0.2, pop.averageFitness + s * 0.5));

      nextPopulations[specId] = {
        ...pop,
        averageFitness: Number(newFitness.toFixed(3)),
        alleleFrequencies: currentAlleles,
      };

      // 3. Speciation Trigger: when population stays high & fitness diverges for 50+ generations
      if (
        currentGen % 50 === 0 &&
        pop.count > 150 &&
        p > 0.9 &&
        !speciationEvents.some((e) => e.ancestorSpeciesId === specId && e.generation === currentGen)
      ) {
        const newSpecId = `spec_${specId}_sub_${currentGen}`;
        const newSpecName = `Adapted ${spec.name} Variant`;

        const newSpeciation: SpeciationEvent = {
          generation: currentGen,
          ancestorSpeciesId: specId,
          newSpeciesId: newSpecId,
          newSpeciesName: newSpecName,
          driver: `Thermal trait divergence under ${selectionType} selection`,
        };
        speciationEvents.push(newSpeciation);

        // Add to phylogenetic cladogram
        const parentNodeIdx = nodes.findIndex((n) => n.id === specId);
        if (parentNodeIdx !== -1) {
          nodes[parentNodeIdx].childrenIds.push(newSpecId);
        }

        nodes.push({
          id: newSpecId,
          name: newSpecName,
          scientificName: `${spec.scientificName} var. nova`,
          trophicRole: spec.trophicRole,
          divergenceGeneration: currentGen,
          extinct: false,
          parentId: specId,
          childrenIds: [],
          keyAdaptation: "Enhanced Thermal & Metabolic Resilience",
        });

        // Register new derived species in Registry
        const derivedSpecies: Species = {
          ...spec,
          id: newSpecId,
          name: newSpecName,
          idealTemperature: spec.idealTemperature + 4,
          baseBirthRate: spec.baseBirthRate * 1.15,
        };
        registry.registerSpecies(derivedSpecies);

        // Inject initial population of the new speciation variant
        nextPopulations[newSpecId] = {
          speciesId: newSpecId,
          count: 35,
          health: 98,
          averageFitness: 1.0,
          alleleFrequencies: { P1: 0.95, P2: 0.05 },
          ageDistribution: { juvenile: 0.4, adult: 0.5, senior: 0.1 },
          positions: Array.from({ length: 35 }, () => ({
            x: Math.random() * 800,
            y: Math.random() * 500,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
          })),
        };
      }
    });

    return {
      updatedEcosystem: {
        ...ecosystem,
        populations: nextPopulations,
      },
      updatedTimeline: {
        nodes,
        speciationEvents,
        extinctionEvents,
      },
    };
  }
}
