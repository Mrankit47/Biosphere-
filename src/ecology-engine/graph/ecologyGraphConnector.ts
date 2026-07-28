// ═══════════════════════════════════════════════════════════════
// Biosphere — Ecology & Universal Knowledge Graph Connector
// Automatically bridges Ecology Objects into Knowledge Graph Nodes & Edges
// ═══════════════════════════════════════════════════════════════

import { KnowledgeGraphNode, KnowledgeEdge } from "@/knowledge-types/graph";
import { EcologyRegistry } from "../registry/EcologyRegistry";

export class EcologyGraphConnector {
  /**
   * Generates graph nodes for all registered Biomes and Species
   */
  public static getEcologyKnowledgeGraphNodes(): KnowledgeGraphNode[] {
    const registry = EcologyRegistry.getInstance();
    const biomes = registry.getAllBiomes();
    const speciesList = registry.getAllSpecies();

    const nodes: KnowledgeGraphNode[] = [];

    // Biome Knowledge Nodes
    biomes.forEach((b) => {
      nodes.push({
        id: `graph_biome_${b.id}`,
        name: b.name,
        nodeType: "process",
        category: "ecology",
        subcategory: "Biome Ecosystem",
        icon: b.emoji,
        accentColor: b.color,
        difficulty: "Intermediate",
        importanceScore: 92,
        edges: [],
      });
    });

    // Species Knowledge Nodes
    speciesList.forEach((s) => {
      nodes.push({
        id: `graph_species_${s.id}`,
        name: s.name,
        nodeType: "species",
        category: "ecology",
        subcategory: `${s.trophicRole.replace("_", " ").toUpperCase()}`,
        icon: s.icon,
        accentColor: s.color,
        difficulty: "Intermediate",
        importanceScore: 88,
        edges: [],
      });
    });

    return nodes;
  }

  /**
   * Generates Knowledge Graph Directed Edges connecting Species <-> Biomes <-> Genes <-> Diseases <-> Virtual Labs
   */
  public static getEcologyKnowledgeGraphEdges(): KnowledgeEdge[] {
    const registry = EcologyRegistry.getInstance();
    const biomes = registry.getAllBiomes();
    const speciesList = registry.getAllSpecies();

    const edges: KnowledgeEdge[] = [];

    // Link Biome -> Species (contains)
    biomes.forEach((b) => {
      b.nativeSpeciesIds.forEach((specId) => {
        edges.push({
          from: `graph_biome_${b.id}`,
          to: `graph_species_${specId}`,
          type: "contains",
          weight: 0.9,
          label: "Habitats & Supports",
        });
      });
    });

    // Link Species -> Prey (predation / herbivory)
    speciesList.forEach((s) => {
      s.dietSpeciesIds.forEach((preyId) => {
        edges.push({
          from: `graph_species_${s.id}`,
          to: `graph_species_${preyId}`,
          type: "related",
          weight: 0.85,
          label: "Consumes / Hunts",
        });
      });

      // Link to DNA & Genetics module
      edges.push({
        from: `graph_species_${s.id}`,
        to: "topic-genetics-dna",
        type: "related",
        weight: 0.75,
        label: "Genome & Allele Pools",
      });

      // Link to Virtual Ecosystem Simulator
      edges.push({
        from: `graph_species_${s.id}`,
        to: "sim-ecosystem-balance",
        type: "related-simulation",
        weight: 0.95,
        label: "Ecosystem Simulator",
      });
    });

    return edges;
  }
}
