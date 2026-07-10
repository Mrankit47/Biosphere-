// =====================================================
// Biosphere 3D Experience Engine — Types Definition
// =====================================================

export type ExperienceMode = "explore" | "learn" | "quiz" | "simulation" | "teacher";

export interface ObjectMetadata {
  id: string;
  name: string;
  scientificName: string;
  emoji: string;
  color: string;
  description: string;
  location: string;
  function: string;
  diseases: string[];
  facts: string[];
  realWorldImportance: string;
  relatedLessons: { title: string; url: string }[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedStudyTime: string; // e.g. "5 mins"
}

export interface TourStep {
  id: string;
  title: string;
  description: string;
  voiceText: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  highlightedObjectId?: string;
  duration?: number; // transition duration in seconds
}

export type QuizType = "identify" | "truefalse" | "sequence" | "matching";

export interface QuizQuestion {
  id: string;
  type: QuizType;
  question: string;
  options?: string[]; // for identify/multiple-choice
  correctAnswer: string | boolean | string[]; // string for identify, boolean for true/false, ordered array for sequence, matching pairs
  // For matching type, correct answer can be formatted as "Key1:Value1,Key2:Value2"
  explanation: string;
  targetObjectId?: string; // object to highlight/zoom during this question
}

export interface TeacherConsoleInfo {
  guideNotes: string[];
  suggestedActivities: string[];
  discussionPrompts: string[];
  printableSummary: string;
}

export interface ModelAnimation {
  name: string;
  label: string;
  icon: string;
  isPlaying: boolean;
  speed: number;
}
