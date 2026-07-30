// ═══════════════════════════════════════════════════════════════
// Biosphere — Content-Based Recommendation Engine
// ═══════════════════════════════════════════════════════════════

import { ResearchPaper } from '@/research-objects/types';
import { researchRegistry } from '@/research-objects/registry';

export class RecommendationService {
  /**
   * Calculates similarity score between target paper and candidate paper
   */
  private calculateSimilarity(paperA: ResearchPaper, paperB: ResearchPaper): number {
    if (paperA.id === paperB.id) return 0;

    let score = 0;

    // Field match
    if (paperA.fieldId === paperB.fieldId) score += 30;

    // Shared topics
    const sharedTopics = paperA.topicIds.filter((t) => paperB.topicIds.includes(t));
    score += sharedTopics.length * 20;

    // Shared keywords
    const keywordsA = new Set(paperA.keywords.map((k) => k.toLowerCase()));
    const sharedKeywords = paperB.keywords.filter((k) => keywordsA.has(k.toLowerCase()));
    score += sharedKeywords.length * 10;

    // Shared authors
    const sharedAuthors = paperA.authorIds.filter((a) => paperB.authorIds.includes(a));
    score += sharedAuthors.length * 25;

    // Shared Knowledge Graph nodes
    const sharedKG = paperA.knowledgeGraphNodeIds.filter((kg) => paperB.knowledgeGraphNodeIds.includes(kg));
    score += sharedKG.length * 15;

    return score;
  }

  /**
   * Returns recommended papers for a target paper
   */
  public getRelatedPapers(targetPaperId: string, limit: number = 4): ResearchPaper[] {
    const target = researchRegistry.getPaper(targetPaperId);
    if (!target) return [];

    const allPapers = researchRegistry.getAllPapers();
    const scored = allPapers
      .filter((p) => p.id !== targetPaperId)
      .map((paper) => ({
        paper,
        score: this.calculateSimilarity(target, paper),
      }))
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map((s) => s.paper);
  }

  /**
   * Returns recommendations based on user's bookmarked paper IDs
   */
  public getPersonalizedRecommendations(bookmarkedPaperIds: string[], limit: number = 4): ResearchPaper[] {
    if (bookmarkedPaperIds.length === 0) {
      return researchRegistry.getAllPapers().slice(0, limit);
    }

    const bookmarks = bookmarkedPaperIds
      .map((id) => researchRegistry.getPaper(id))
      .filter((p): p is ResearchPaper => p !== undefined);

    const scoresMap = new Map<string, number>();

    const allPapers = researchRegistry.getAllPapers();
    for (const paper of allPapers) {
      if (bookmarkedPaperIds.includes(paper.id)) continue;

      let maxScore = 0;
      for (const bm of bookmarks) {
        const sim = this.calculateSimilarity(bm, paper);
        if (sim > maxScore) maxScore = sim;
      }
      scoresMap.set(paper.id, maxScore);
    }

    return allPapers
      .filter((p) => !bookmarkedPaperIds.includes(p.id))
      .sort((a, b) => (scoresMap.get(b.id) || 0) - (scoresMap.get(a.id) || 0))
      .slice(0, limit);
  }
}

export const recommendationService = new RecommendationService();
