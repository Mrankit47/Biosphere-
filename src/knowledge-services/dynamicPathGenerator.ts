// ═══════════════════════════════════════════════════════════════
// Biosphere — Dynamic Learning Path Generator
//
// Dynamically constructs interest-tailored learning paths without
// hardcoding static sequences. Uses graph topological sorting.
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeObject } from "@/knowledge-types/object";
import type { DynamicLearningPath, DynamicPathStep } from "@/knowledge-types/graph";
import { knowledgeGraph } from "@/knowledge-engine/graphIndexer";
import { graphTraversalService } from "./graphTraversal";

export interface InterestConfig {
  tag: string;
  title: string;
  description: string;
  filterKeywords: string[];
}

export const SUPPORTED_INTERESTS: InterestConfig[] = [
  {
    tag: "pre-med",
    title: "Pre-Med & Human Physiology",
    description: "Master human anatomy, cellular function, organ systems, and disease mechanisms for medical studies.",
    filterKeywords: ["human-anatomy", "heart", "organ", "pathology", "cell-biology", "disease"],
  },
  {
    tag: "virology",
    title: "Virology & Infectious Diseases",
    description: "Explore viral structures, cell entry mechanisms, host immune responses, and vaccines.",
    filterKeywords: ["virology", "microbiology", "viruses", "pathogens", "disease"],
  },
  {
    tag: "genomics",
    title: "Genomics & Biotechnology",
    description: "Understand DNA replication, gene expression, protein synthesis, and genetic engineering.",
    filterKeywords: ["genetics", "dna", "rna", "ribosome", "nucleus"],
  },
  {
    tag: "botany",
    title: "Botany & Plant Biochemistry",
    description: "Study plant cellular structures, photosynthesis, carbon fixation, and plant physiology.",
    filterKeywords: ["botany", "photosynthesis", "chloroplast", "ecology"],
  },
  {
    tag: "cell-mastery",
    title: "Cellular Biology Mastery",
    description: "Deep dive into organelle structures, membrane transport, cellular energy, and cell division.",
    filterKeywords: ["cell-biology", "mitochondria", "nucleus", "membrane", "ribosome"],
  },
];

export class DynamicPathGenerator {
  /**
   * Dynamically generate a learning path tailored to a student's interest and progress.
   */
  generatePath(
    interestTag: string = "pre-med",
    completedTopicIds: string[] = []
  ): DynamicLearningPath {
    const config =
      SUPPORTED_INTERESTS.find((i) => i.tag === interestTag) ?? SUPPORTED_INTERESTS[0];

    const completedSet = new Set(completedTopicIds);
    const allObjects = knowledgeGraph.getAllObjects();

    // 1. Filter nodes matching interest keywords
    const matchingObjects = allObjects.filter((obj) => {
      const haystack = `${obj.category} ${obj.subcategory} ${obj.name} ${obj.description}`.toLowerCase();
      return config.filterKeywords.some((kw) => haystack.includes(kw.toLowerCase()));
    });

    // Fallback if sparse
    const targetSet = matchingObjects.length >= 3 ? matchingObjects : allObjects;

    // 2. Select terminal target concept (most advanced or uncompleted)
    const targetObj =
      targetSet.find((o) => o.difficulty === "advanced" && !completedSet.has(o.id)) ??
      targetSet.find((o) => o.difficulty === "intermediate" && !completedSet.has(o.id)) ??
      targetSet[0];

    // 3. Perform Topological Sort on Prerequisites using GraphTraversal
    const sortedNodes = graphTraversalService.getPrerequisiteTopologicalOrder(targetObj.id);

    // 4. Build Path Steps
    let totalMinutes = 0;
    const steps: DynamicPathStep[] = sortedNodes.map((node, index) => {
      const obj = knowledgeGraph.getObject(node.id);
      const estMin = obj?.estimatedMinutes ?? 10;
      totalMinutes += estMin;

      // Check if prerequisites are met
      const prereqsMet = (obj?.prerequisiteIds ?? []).every((pid) => completedSet.has(pid));

      return {
        stepNumber: index + 1,
        nodeId: node.id,
        title: node.name,
        subcategory: node.subcategory,
        estimatedMinutes: estMin,
        difficulty: node.difficulty,
        icon: node.icon,
        accentColor: node.accentColor,
        prerequisitesMet: prereqsMet || index === 0,
        targetUrl: `/knowledge/${node.id}`,
        keyConcepts: obj?.importantTerms.map((t) => t.term) ?? [],
      };
    });

    return {
      id: `path-${config.tag}-${Date.now()}`,
      title: config.title,
      description: config.description,
      interestTag: config.tag,
      totalMinutes,
      difficulty: targetObj.difficulty,
      steps,
    };
  }
}

export const dynamicPathGenerator = new DynamicPathGenerator();
