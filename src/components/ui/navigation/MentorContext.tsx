"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced" | "medical" | "teacher";

export interface PageContextData {
  page: string;
  lesson?: string | null;
  program?: string | null;
  selectedOrgan?: string | null;
  selectedCell?: string | null;
  selectedDisease?: string | null;
  selectedSpecies?: string | null;
  simulation?: string | null;
  quiz?: string | null;
}

interface MentorContextType {
  pageContext: PageContextData;
  setPageContext: (ctx: Partial<PageContextData>) => void;
  clearPageContext: () => void;
  difficulty: DifficultyLevel;
  setDifficulty: (level: DifficultyLevel) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  registerActionListener: (listener: (action: any) => void) => () => void;
  triggerMentorAction: (action: any) => void;
}

const MentorContext = createContext<MentorContextType | undefined>(undefined);

export const MentorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pageContext, setPageContextState] = useState<PageContextData>({
    page: "home",
    lesson: null,
    program: null,
    selectedOrgan: null,
    selectedCell: null,
    selectedDisease: null,
    selectedSpecies: null,
    simulation: null,
    quiz: null
  });

  const [difficulty, setDifficultyState] = useState<DifficultyLevel>("intermediate");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const actionListenersRef = useRef<((action: any) => void)[]>([]);

  // Load initial difficulty preference from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("biosphere_mentor_difficulty");
      if (saved) {
        setDifficultyState(saved as DifficultyLevel);
      }
    }
  }, []);

  const setDifficulty = useCallback((level: DifficultyLevel) => {
    setDifficultyState(level);
    if (typeof window !== "undefined") {
      localStorage.setItem("biosphere_mentor_difficulty", level);
    }
  }, []);

  const setPageContext = useCallback((ctx: Partial<PageContextData>) => {
    setPageContextState((prev) => ({
      ...prev,
      ...ctx
    }));
  }, []);

  const clearPageContext = useCallback(() => {
    setPageContextState({
      page: "home",
      lesson: null,
      program: null,
      selectedOrgan: null,
      selectedCell: null,
      selectedDisease: null,
      selectedSpecies: null,
      simulation: null,
      quiz: null
    });
  }, []);

  const registerActionListener = useCallback((listener: (action: any) => void) => {
    actionListenersRef.current.push(listener);
    return () => {
      actionListenersRef.current = actionListenersRef.current.filter((l) => l !== listener);
    };
  }, []);

  const triggerMentorAction = useCallback((action: any) => {
    actionListenersRef.current.forEach((listener) => {
      try {
        listener(action);
      } catch (err) {
        console.warn("Failed to dispatch action to listener:", err);
      }
    });
  }, []);

  return (
    <MentorContext.Provider
      value={{
        pageContext,
        setPageContext,
        clearPageContext,
        difficulty,
        setDifficulty,
        sidebarOpen,
        setSidebarOpen,
        registerActionListener,
        triggerMentorAction
      }}
    >
      {children}
    </MentorContext.Provider>
  );
};

export const useMentor = () => {
  const context = useContext(MentorContext);
  if (!context) {
    throw new Error("useMentor must be used within a MentorProvider");
  }
  return context;
};
