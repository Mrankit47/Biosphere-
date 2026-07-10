"use client";

import React from "react";
import { useExperience } from "./ExperienceContext";
import { ModelToolbar } from "./ModelToolbar";
import { GuidedTour } from "./GuidedTour";
import { CrossSectionControls } from "./CrossSectionControls";
import { ContextDrawer } from "./ContextDrawer";
import { QuizOverlay } from "./QuizOverlay";
import { TeacherConsole } from "./TeacherConsole";

export const LearningOverlay: React.FC = () => {
  const { mode, selectedObjectId } = useExperience();

  return (
    <div className="learning-overlay-root">
      {/* Sidebar Details Panel (rendered left/right depending on window space) */}
      {selectedObjectId && (
        <div className="overlay-drawer-panel">
          <ContextDrawer />
        </div>
      )}

      {/* Floating panels container on the right side */}
      <div className="overlay-floating-panels">
        {mode === "learn" && <GuidedTour />}
        {mode === "simulation" && <CrossSectionControls />}
        {mode === "quiz" && <QuizOverlay />}
        {mode === "teacher" && <TeacherConsole />}
      </div>

      {/* Bottom Modes Control Bar */}
      <div className="overlay-bottom-bar">
        <ModelToolbar />
      </div>

      <style>{`
        .learning-overlay-root {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
          display: grid;
          grid-template-columns: 320px 1fr 340px;
          grid-template-rows: 1fr auto;
          gap: 20px;
          padding: 24px;
          box-sizing: border-box;
          font-family: inherit;
        }

        .overlay-drawer-panel {
          grid-column: 1;
          grid-row: 1;
          pointer-events: auto;
          display: flex;
          align-items: stretch;
          height: 100%;
        }

        .overlay-floating-panels {
          grid-column: 3;
          grid-row: 1;
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          justify-content: flex-start;
          align-items: stretch;
          height: 100%;
        }

        .overlay-bottom-bar {
          grid-column: 1 / span 3;
          grid-row: 2;
          pointer-events: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          width: min(800px, 100%);
        }

        @media (max-width: 900px) {
          .learning-overlay-root {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
            overflow-y: auto;
            gap: 16px;
          }

          .overlay-drawer-panel {
            grid-column: 1;
            grid-row: 1;
            width: 100%;
            height: auto;
          }

          .overlay-floating-panels {
            grid-column: 1;
            grid-row: 2;
            width: 100%;
            height: auto;
          }

          .overlay-bottom-bar {
            grid-column: 1;
            grid-row: 3;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
