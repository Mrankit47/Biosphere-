// ═══════════════════════════════════════════════════════════════
// Biosphere — Experiment Design Studio Engine & Validator
// ═══════════════════════════════════════════════════════════════

import { Experiment, UserExperimentSubmission, ResearchPaper } from '@/research-objects/types';
import { researchRegistry } from '@/research-objects/registry';

const USER_EXPERIMENTS_KEY = 'biosphere_user_designed_experiments';

export interface ValidationFeedback {
  isValid: boolean;
  score: number; // 0 - 100
  suggestions: string[];
  matchedPaper?: ResearchPaper;
}

export class ExperimentDesignService {
  public getAllTemplateExperiments(): Experiment[] {
    return researchRegistry.getAllExperiments();
  }

  public getExperimentById(id: string): Experiment | undefined {
    return researchRegistry.getExperiment(id);
  }

  public getSavedSubmissions(): UserExperimentSubmission[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(USER_EXPERIMENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public saveSubmission(submission: Omit<UserExperimentSubmission, 'id' | 'createdAt'>): UserExperimentSubmission {
    const current = this.getSavedSubmissions();
    const newSubmission: UserExperimentSubmission = {
      ...submission,
      id: `exp_sub_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newSubmission, ...current];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(USER_EXPERIMENTS_KEY, JSON.stringify(updated));
      } catch {}
    }
    return newSubmission;
  }

  /**
   * Validates student experiment design and compares it against published benchmark papers
   */
  public evaluateExperimentDesign(
    experimentId: string,
    hypothesis: string,
    independentVar: string,
    dependentVar: string,
    controls: { positive: string; negative: string }
  ): ValidationFeedback {
    const baseExp = this.getExperimentById(experimentId);
    const suggestions: string[] = [];
    let score = 70;

    // Check hypothesis format
    if (!hypothesis.toLowerCase().includes('if') || !hypothesis.toLowerCase().includes('then')) {
      suggestions.push('Format your hypothesis as an "If... then..." statement for scientific clarity.');
    } else {
      score += 10;
    }

    // Check independent variable
    if (independentVar.trim().length > 3) {
      score += 10;
    } else {
      suggestions.push('Provide a clear quantitative independent variable to test.');
    }

    // Check dependent variable
    if (dependentVar.trim().length > 3) {
      score += 10;
    } else {
      suggestions.push('Define how the dependent variable will be measured (e.g. %, ng/μL, count).');
    }

    // Match with published paper
    let matchedPaper: ResearchPaper | undefined;
    if (baseExp?.relatedPaperId) {
      matchedPaper = researchRegistry.getPaper(baseExp.relatedPaperId);
    }

    return {
      isValid: suggestions.length === 0,
      score: Math.min(100, score),
      suggestions,
      matchedPaper,
    };
  }
}

export const experimentDesignService = new ExperimentDesignService();
