// ═══════════════════════════════════════════════════════════════
// Biosphere — Content Verification Service
//
// Validates knowledge objects for completeness, quality, and
// readiness for publication.
// ═══════════════════════════════════════════════════════════════

import type { KnowledgeObject } from "@/knowledge-types/object";
import type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from "@/knowledge-types/validation";

// ─── Validation ──────────────────────────────────────────────

/**
 * Validate a KnowledgeObject for content completeness and quality.
 * Returns errors, warnings, and a quality score (0-100).
 */
export function validateKnowledgeObject(
  obj: KnowledgeObject
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // ── Required field checks ──────────────────────────────────

  if (!obj.id) {
    errors.push({ field: "id", message: "Missing object ID", severity: "critical" });
  }
  if (!obj.name || obj.name.length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters", severity: "critical" });
  }
  if (!obj.description || obj.description.length < 20) {
    errors.push({ field: "description", message: "Description must be at least 20 characters", severity: "major" });
  }
  if (!obj.summary || obj.summary.length < 10) {
    errors.push({ field: "summary", message: "Summary is too short", severity: "major" });
  }
  if (obj.learningObjectives.length === 0) {
    errors.push({ field: "learningObjectives", message: "At least one learning objective required", severity: "major" });
  }
  if (obj.importantTerms.length === 0) {
    errors.push({ field: "importantTerms", message: "At least one key term required", severity: "major" });
  }

  // ── Quality warnings ──────────────────────────────────────

  if (obj.interestingFacts.length === 0) {
    warnings.push({ field: "interestingFacts", message: "No interesting facts provided", suggestion: "Add 2-3 engaging facts to improve learner engagement." });
  }
  if (obj.flashcards.length < 3) {
    warnings.push({ field: "flashcards", message: "Fewer than 3 flashcards", suggestion: "Aim for 4-6 flashcards per topic for effective spaced repetition." });
  }
  if (!obj.quiz) {
    warnings.push({ field: "quiz", message: "No quiz attached", suggestion: "Add a quiz with 3-5 questions for assessment." });
  }
  if (!obj.model3D) {
    warnings.push({ field: "model3D", message: "No 3D model linked", suggestion: "Link an existing 3D view or glTF asset." });
  }
  if (obj.references.length === 0) {
    warnings.push({ field: "references", message: "No academic references", suggestion: "Add textbook or journal references for credibility." });
  }
  if (obj.commonMisconceptions.length === 0) {
    warnings.push({ field: "commonMisconceptions", message: "No common misconceptions listed", suggestion: "Addressing misconceptions significantly improves learning outcomes." });
  }
  if (!obj.clinicalImportance) {
    warnings.push({ field: "clinicalImportance", message: "No clinical importance noted", suggestion: "Explain real-world medical or clinical relevance." });
  }
  if (obj.scientists.length === 0) {
    warnings.push({ field: "scientists", message: "No scientists or discoverers listed", suggestion: "Add the key researchers who contributed to this topic." });
  }

  // ── Score calculation ──────────────────────────────────────

  const maxScore = 100;
  const errorPenalty = errors.length * 15;
  const warningPenalty = warnings.length * 5;
  const score = Math.max(0, maxScore - errorPenalty - warningPenalty);

  return {
    objectId: obj.id,
    isValid: errors.length === 0,
    errors,
    warnings,
    score,
  };
}

/**
 * Batch validate an array of knowledge objects.
 */
export function validateAll(
  objects: KnowledgeObject[]
): ValidationResult[] {
  return objects.map(validateKnowledgeObject);
}

/**
 * Check if an object is ready for publication.
 */
export function isPublishReady(obj: KnowledgeObject): boolean {
  const result = validateKnowledgeObject(obj);
  return result.isValid && result.score >= 60;
}
