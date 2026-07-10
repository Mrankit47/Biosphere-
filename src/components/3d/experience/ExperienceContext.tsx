"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  type ExperienceMode,
  type ObjectMetadata,
  type TourStep,
  type QuizQuestion,
  type TeacherConsoleInfo,
  type ModelAnimation
} from "./types";

interface CameraCommand {
  position: [number, number, number];
  target: [number, number, number];
  duration: number;
}

interface ExperienceContextType {
  // Modes & Selection
  mode: ExperienceMode;
  setMode: (m: ExperienceMode) => void;
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;
  hoveredObjectId: string | null;
  setHoveredObjectId: (id: string | null) => void;

  // Metadata Registry
  metadata: Record<string, ObjectMetadata>;
  activeMetadata: ObjectMetadata | null;

  // Guided Tour
  tourSteps: TourStep[];
  tourIndex: number;
  isTourPlaying: boolean;
  setTourIndex: (idx: number) => void;
  setIsTourPlaying: (playing: boolean) => void;
  startTour: () => void;
  stopTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  activeTourStep: TourStep | null;

  // Animation System
  animations: ModelAnimation[];
  setAnimations: React.Dispatch<React.SetStateAction<ModelAnimation[]>>;
  toggleAnimation: (name: string) => void;
  setAnimationSpeed: (name: string, speed: number) => void;

  // Visibility & Cross Sections
  layerOpacities: Record<string, number>;
  setLayerOpacity: (layer: string, val: number) => void;
  explodeFactor: number;
  setExplodeFactor: (val: number) => void;
  focusMode: boolean;
  setFocusMode: (val: boolean) => void;

  // Quiz Engine
  quizzes: QuizQuestion[];
  quizIndex: number;
  quizScore: number;
  quizFinished: boolean;
  activeQuizQuestion: QuizQuestion | null;
  submitAnswer: (ans: any) => boolean; // returns isCorrect
  resetQuiz: () => void;

  // Bookmarks & Notes
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  notes: Record<string, string>;
  saveNote: (id: string, text: string) => void;

  // Camera Dispatcher
  cameraCommand: CameraCommand | null;
  dispatchCameraMove: (position: [number, number, number], target: [number, number, number], duration?: number) => void;
  clearCameraCommand: () => void;

  // Voice Narration
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;

  // Teacher Console
  teacherInfo?: TeacherConsoleInfo;
}

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export const ExperienceProvider: React.FC<{
  children: React.ReactNode;
  metadata: Record<string, ObjectMetadata>;
  tourSteps: TourStep[];
  quizzes: QuizQuestion[];
  animations: ModelAnimation[];
  teacherInfo?: TeacherConsoleInfo;
}> = ({ children, metadata, tourSteps, quizzes, animations: initialAnimations, teacherInfo }) => {
  const [mode, setMode] = useState<ExperienceMode>("explore");
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [hoveredObjectId, setHoveredObjectId] = useState<string | null>(null);

  // Guided Tour
  const [tourIndex, setTourIndex] = useState(0);
  const [isTourPlaying, setIsTourPlaying] = useState(false);

  // Animation controls
  const [animations, setAnimations] = useState<ModelAnimation[]>(initialAnimations);

  // Cross section & layer values
  const [layerOpacities, setLayerOpacities] = useState<Record<string, number>>({
    skin: 0.15,
    skeleton: 1.0,
    muscles: 1.0,
    organs: 1.0,
    vascular: 1.0,
    nervous: 1.0,
    endocrine: 1.0,
    lymphatic: 1.0,
    reproductive: 1.0
  });
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [focusMode, setFocusMode] = useState(false);

  // Quiz values
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Bookmarks & Notes
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Camera commands
  const [cameraCommand, setCameraCommand] = useState<CameraCommand | null>(null);

  // Audio Voice Narration state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Load bookmarks & notes from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedBookmarks = localStorage.getItem("bio_3d_bookmarks");
      if (storedBookmarks) setBookmarks(JSON.parse(storedBookmarks));
      const storedNotes = localStorage.getItem("bio_3d_notes");
      if (storedNotes) setNotes(JSON.parse(storedNotes));
    } catch {}
  }, []);

  const activeMetadata = selectedObjectId ? metadata[selectedObjectId] || null : null;
  const activeTourStep = tourSteps[tourIndex] || null;
  const activeQuizQuestion = quizzes[quizIndex] || null;

  // Speak Narration Text (Text-to-Speech)
  const speakText = useCallback((text: string) => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // Mode effects
  useEffect(() => {
    stopSpeaking();
    setIsTourPlaying(false);
    if (mode === "quiz") {
      setQuizIndex(0);
      setQuizScore(0);
      setQuizFinished(false);
    }
  }, [mode, stopSpeaking]);

  // Guided Tour transition effects
  useEffect(() => {
    if (mode === "learn" && isTourPlaying && activeTourStep) {
      // Direct camera move Command
      setCameraCommand({
        position: activeTourStep.cameraPosition,
        target: activeTourStep.cameraTarget,
        duration: activeTourStep.duration || 1.2
      });

      if (activeTourStep.highlightedObjectId) {
        setSelectedObjectId(activeTourStep.highlightedObjectId);
      }

      speakText(activeTourStep.voiceText);
    }
  }, [tourIndex, isTourPlaying, mode, activeTourStep, speakText]);

  // Quiz Camera Sync
  useEffect(() => {
    if (mode === "quiz" && activeQuizQuestion?.targetObjectId && metadata[activeQuizQuestion.targetObjectId]) {
      // Auto zoom to target organ during quiz question
      setSelectedObjectId(activeQuizQuestion.targetObjectId);
    }
  }, [quizIndex, mode, activeQuizQuestion, metadata]);

  // Camera Command Handlers
  const dispatchCameraMove = useCallback((position: [number, number, number], target: [number, number, number], duration = 1.2) => {
    setCameraCommand({ position, target, duration });
  }, []);

  const clearCameraCommand = useCallback(() => {
    setCameraCommand(null);
  }, []);

  // Guided Tour Navigation
  const startTour = useCallback(() => {
    setTourIndex(0);
    setIsTourPlaying(true);
  }, []);

  const stopTour = useCallback(() => {
    setIsTourPlaying(false);
    stopSpeaking();
  }, [stopSpeaking]);

  const nextTourStep = useCallback(() => {
    if (tourIndex < tourSteps.length - 1) {
      setTourIndex((prev) => prev + 1);
    } else {
      setIsTourPlaying(false);
      stopSpeaking();
    }
  }, [tourIndex, tourSteps.length, stopSpeaking]);

  const prevTourStep = useCallback(() => {
    if (tourIndex > 0) {
      setTourIndex((prev) => prev - 1);
    }
  }, [tourIndex]);

  // Animations controls
  const toggleAnimation = useCallback((name: string) => {
    setAnimations((prev) =>
      prev.map((anim) => (anim.name === name ? { ...anim, isPlaying: !anim.isPlaying } : anim))
    );
  }, []);

  const setAnimationSpeed = useCallback((name: string, speed: number) => {
    setAnimations((prev) =>
      prev.map((anim) => (anim.name === name ? { ...anim, speed } : anim))
    );
  }, []);

  // Visibility controls
  const setLayerOpacity = useCallback((layer: string, val: number) => {
    setLayerOpacities((prev) => ({ ...prev, [layer]: val }));
  }, []);

  // Quiz Matching / Submission
  const submitAnswer = useCallback((ans: any): boolean => {
    if (!activeQuizQuestion) return false;
    let isCorrect = false;

    if (activeQuizQuestion.type === "truefalse") {
      isCorrect = ans === activeQuizQuestion.correctAnswer;
    } else if (activeQuizQuestion.type === "identify") {
      isCorrect = String(ans).toLowerCase().trim() === String(activeQuizQuestion.correctAnswer).toLowerCase().trim();
    } else if (activeQuizQuestion.type === "sequence") {
      isCorrect = JSON.stringify(ans) === JSON.stringify(activeQuizQuestion.correctAnswer);
    }

    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }

    // Go to next question or complete
    if (quizIndex < quizzes.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }

    return isCorrect;
  }, [activeQuizQuestion, quizIndex, quizzes.length]);

  const resetQuiz = useCallback(() => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setSelectedObjectId(null);
  }, []);

  // Bookmark actions
  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      localStorage.setItem("bio_3d_bookmarks", JSON.stringify(next));
      return next;
    });
  }, []);

  // Notes actions
  const saveNote = useCallback((id: string, text: string) => {
    setNotes((prev) => {
      const next = { ...prev, [id]: text };
      localStorage.setItem("bio_3d_notes", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <ExperienceContext.Provider
      value={{
        mode,
        setMode,
        selectedObjectId,
        setSelectedObjectId,
        hoveredObjectId,
        setHoveredObjectId,
        metadata,
        activeMetadata,

        // Guided Tour
        tourSteps,
        tourIndex,
        isTourPlaying,
        setTourIndex,
        setIsTourPlaying,
        startTour,
        stopTour,
        nextTourStep,
        prevTourStep,
        activeTourStep,

        // Animations
        animations,
        setAnimations,
        toggleAnimation,
        setAnimationSpeed,

        // Layer opacities
        layerOpacities,
        setLayerOpacity,
        explodeFactor,
        setExplodeFactor,
        focusMode,
        setFocusMode,

        // Quiz
        quizzes,
        quizIndex,
        quizScore,
        quizFinished,
        activeQuizQuestion,
        submitAnswer,
        resetQuiz,

        // Bookmarks & Notes
        bookmarks,
        toggleBookmark,
        notes,
        saveNote,

        // Camera commands
        cameraCommand,
        dispatchCameraMove,
        clearCameraCommand,

        // Speech
        speakText,
        stopSpeaking,
        isSpeaking,

        // Teacher
        teacherInfo
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
};

export const useExperience = () => {
  const context = useContext(ExperienceContext);
  if (!context) throw new Error("useExperience must be used within an ExperienceProvider");
  return context;
};
