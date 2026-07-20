// ═══════════════════════════════════════════════════════════════
// Biosphere — Relationship Resolver Service
//
// Automatically resolves bidirectional relationships, edge weights,
// and inverse mapping rules across all knowledge objects.
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeObject } from "@/knowledge-types/object";
import type {
  KnowledgeEdge,
  ExtendedRelationshipType,
  RelationshipType,
  NodeType,
} from "@/knowledge-types/graph";

// ─── Default Weights by Relationship Type ────────────────────

const RELATIONSHIP_WEIGHTS: Record<string, number> = {
  prerequisite: 0.95,
  next: 0.85,
  parent: 1.0,
  child: 0.9,
  "part-of": 0.95,
  contains: 0.9,
  "related-disease": 0.8,
  "related-organ": 0.85,
  "related-cell": 0.85,
  "related-species": 0.75,
  "related-simulation": 0.8,
  "related-virtual-lab": 0.8,
  "related-quiz": 0.7,
  "related-flashcards": 0.7,
  "related-research": 0.65,
  "related-scientist": 0.6,
  "medical-importance": 0.85,
  "environmental-importance": 0.85,
  related: 0.7,
};

// ─── Inverse Relationship Map ────────────────────────────────

const INVERSE_RELATIONSHIPS: Record<string, ExtendedRelationshipType> = {
  parent: "child",
  child: "parent",
  "part-of": "contains",
  contains: "part-of",
  prerequisite: "next",
  next: "prerequisite",
};

// ─── Category → Default NodeType Fallback ────────────────────

export function inferNodeType(obj: KnowledgeObject): NodeType {
  if (obj.nodeType) return obj.nodeType;

  switch (obj.category) {
    case "cell-biology":
      return obj.subcategory === "Cell Types" ? "cell" : "organ";
    case "human-anatomy":
      return "organ";
    case "genetics":
      return obj.id.includes("rna") ? "rna" : "dna";
    case "virology":
      return "virus";
    case "microbiology":
      return "bacteria";
    case "botany":
    case "zoology":
    case "marine-biology":
      return "species";
    case "pathology":
      return "disease";
    case "biochemistry":
    case "physiology":
      return "process";
    default:
      return "process";
  }
}

// ─── Resolver Class ──────────────────────────────────────────

export class RelationshipResolver {
  /**
   * Extract all directed edges from a KnowledgeObject.
   */
  resolveObjectEdges(obj: KnowledgeObject): KnowledgeEdge[] {
    const edges: KnowledgeEdge[] = [];

    const addEdge = (targetId: string | undefined, type: ExtendedRelationshipType | "related") => {
      if (!targetId || targetId.trim() === "") return;
      const weight = RELATIONSHIP_WEIGHTS[type] ?? 0.7;
      edges.push({
        from: obj.id,
        to: targetId,
        type,
        weight,
        label: this.getRelationshipLabel(type),
      });
    };

    // Structural & Educational
    addEdge(obj.parentTopicId, "parent");
    if (obj.childTopicIds) obj.childTopicIds.forEach((id) => addEdge(id, "child"));
    addEdge(obj.partOfId, "part-of");
    if (obj.containsIds) obj.containsIds.forEach((id) => addEdge(id, "contains"));

    // Sequential & Prerequisites
    if (obj.prerequisiteIds) obj.prerequisiteIds.forEach((id) => addEdge(id, "prerequisite"));
    if (obj.nextTopicIds) obj.nextTopicIds.forEach((id) => addEdge(id, "next"));

    // Domain Connections
    if (obj.relatedTopicIds) obj.relatedTopicIds.forEach((id) => addEdge(id, "related"));
    if (obj.relatedDiseaseIds) obj.relatedDiseaseIds.forEach((id) => addEdge(id, "related-disease"));
    if (obj.relatedSpeciesIds) obj.relatedSpeciesIds.forEach((id) => addEdge(id, "related-species"));
    if (obj.relatedOrganIds) obj.relatedOrganIds.forEach((id) => addEdge(id, "related-organ"));
    if (obj.relatedCellIds) obj.relatedCellIds.forEach((id) => addEdge(id, "related-cell"));
    if (obj.relatedSimulationIds) obj.relatedSimulationIds.forEach((id) => addEdge(id, "related-simulation"));
    if (obj.relatedVirtualLabIds) obj.relatedVirtualLabIds.forEach((id) => addEdge(id, "related-virtual-lab"));
    if (obj.relatedResearchIds) obj.relatedResearchIds.forEach((id) => addEdge(id, "related-research"));
    if (obj.relatedScientistIds) obj.relatedScientistIds.forEach((id) => addEdge(id, "related-scientist"));

    return edges;
  }

  /**
   * Get semantic inverse relationship type.
   */
  getInverseRelationship(type: RelationshipType): RelationshipType {
    return INVERSE_RELATIONSHIPS[type] ?? type;
  }

  /**
   * Get human-readable label for UI rendering.
   */
  getRelationshipLabel(type: RelationshipType): string {
    switch (type) {
      case "prerequisite":
        return "Prerequisite For";
      case "next":
        return "Recommended Next";
      case "parent":
        return "Parent Category";
      case "child":
        return "Sub-Topic";
      case "part-of":
        return "Part Of";
      case "contains":
        return "Contains";
      case "related-disease":
        return "Associated Disease";
      case "related-organ":
        return "Organ Connection";
      case "related-cell":
        return "Cellular Connection";
      case "related-species":
        return "Related Species";
      case "related-simulation":
        return "Interactive Simulation";
      case "related-virtual-lab":
        return "Virtual Lab";
      case "related-quiz":
        return "Practice Quiz";
      case "related-flashcards":
        return "Flashcard Deck";
      case "related-research":
        return "Research Article";
      case "related-scientist":
        return "Discovering Scientist";
      case "medical-importance":
        return "Medical Clinical Significance";
      case "environmental-importance":
        return "Ecological Environmental Impact";
      default:
        return "Related Concept";
    }
  }
}

export const relationshipResolver = new RelationshipResolver();
