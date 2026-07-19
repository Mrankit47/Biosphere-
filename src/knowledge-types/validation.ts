// ═══════════════════════════════════════════════════════════════
// Biosphere — Content Validation & Versioning Types
// ═══════════════════════════════════════════════════════════════

import type { ContentStatus } from "./object";

// ─── Review Workflow ─────────────────────────────────────────

/** A single review action on a knowledge object */
export interface ReviewAction {
  reviewerId: string;
  reviewerName: string;
  action: "approve" | "request-changes" | "reject";
  comment: string;
  timestamp: string; // ISO date
}

/** Full review history for a knowledge object */
export interface ReviewHistory {
  objectId: string;
  currentStatus: ContentStatus;
  actions: ReviewAction[];
}

// ─── Versioning ──────────────────────────────────────────────

/** A snapshot of a knowledge object at a point in time */
export interface ContentVersion {
  version: string;      // semver e.g. "1.2.0"
  timestamp: string;    // ISO date
  changedBy: string;
  changeDescription: string;
  status: ContentStatus;
}

/** Version history for a knowledge object */
export interface VersionHistory {
  objectId: string;
  versions: ContentVersion[];
  currentVersion: string;
}

// ─── Citation Support ────────────────────────────────────────

export type CitationType =
  | "textbook"
  | "journal"
  | "website"
  | "database"
  | "review-article"
  | "clinical-guideline";

/** A structured academic citation */
export interface Citation {
  id: string;
  type: CitationType;
  title: string;
  authors: string[];
  year: string;
  source: string;        // journal name, website, etc.
  url?: string;
  doi?: string;
  accessedDate?: string;
}

// ─── Validation Rules ────────────────────────────────────────

/** Result of running content validation on a knowledge object */
export interface ValidationResult {
  objectId: string;
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number; // 0-100 quality score
}

export interface ValidationError {
  field: string;
  message: string;
  severity: "critical" | "major";
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}
