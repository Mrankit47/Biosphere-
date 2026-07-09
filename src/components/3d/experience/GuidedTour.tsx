"use client";

import React from "react";
import { useExperience } from "./ExperienceContext";

export const GuidedTour: React.FC = () => {
  const {
    mode,
    tourSteps,
    tourIndex,
    isTourPlaying,
    setIsTourPlaying,
    startTour,
    stopTour,
    nextTourStep,
    prevTourStep,
    activeTourStep,
    speakText,
    isSpeaking
  } = useExperience();

  if (mode !== "learn" || tourSteps.length === 0) return null;

  const total = tourSteps.length;
  const currentNum = tourIndex + 1;

  const handleSpeechToggle = () => {
    if (activeTourStep) {
      speakText(activeTourStep.voiceText);
    }
  };

  return (
    <div className="guided-tour-root glassmorphic">
      <div className="tour-header-row">
        <div className="tour-title-wrap">
          <span className="tour-icon">🧭</span>
          <h4 className="tour-hdr-title">GUIDED EXPLORATION</h4>
        </div>
        <button onClick={stopTour} className="tour-close-btn" title="Exit Tour">
          ✕
        </button>
      </div>

      {!isTourPlaying ? (
        <div className="tour-start-panel">
          <p className="tour-intro-text">
            Start a guided structural scan. The scanner will automatically navigate components with voice narration descriptions.
          </p>
          <button onClick={startTour} className="tour-action-btn start">
            🚀 Begin Guided Tour
          </button>
        </div>
      ) : (
        <div className="tour-content-panel">
          <div className="tour-progress-bar">
            <div className="tour-progress-fill" style={{ width: `${(currentNum / total) * 100}%` }} />
          </div>

          <div className="tour-step-card">
            <div className="tour-step-meta">
              <span className="tour-step-count">STEP {currentNum} OF {total}</span>
              <button
                onClick={handleSpeechToggle}
                className={`tour-voice-btn ${isSpeaking ? "speaking" : ""}`}
                title="Speak narration text"
              >
                {isSpeaking ? "🔊 Speaking..." : "🔈 Read Aloud"}
              </button>
            </div>
            <h5 className="tour-step-title">{activeTourStep?.title}</h5>
            <p className="tour-step-desc">{activeTourStep?.description}</p>
          </div>

          <div className="tour-nav-controls">
            <button
              onClick={prevTourStep}
              className="tour-nav-btn"
              disabled={tourIndex === 0}
            >
              ◀ Back
            </button>

            <button
              onClick={() => setIsTourPlaying(!isTourPlaying)}
              className="tour-nav-btn play-pause"
            >
              {isTourPlaying ? "⏸ Pause" : "▶ Resume"}
            </button>

            <button
              onClick={nextTourStep}
              className="tour-nav-btn next"
            >
              {tourIndex === total - 1 ? "Finish 🏁" : "Next ▶"}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .guided-tour-root {
          padding: 16px 20px;
          border-radius: 16px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          box-sizing: border-box;
          width: 100%;
        }

        .tour-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .tour-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tour-icon {
          font-size: 1.15rem;
        }

        .tour-hdr-title {
          font-size: 0.68rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.1em;
          margin: 0;
        }

        .tour-close-btn {
          background: none;
          border: none;
          color: var(--ds-fg-subtle);
          font-size: 0.85rem;
          cursor: pointer;
        }

        .tour-close-btn:hover {
          color: #fff;
        }

        .tour-start-panel {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
          text-align: center;
        }

        .tour-intro-text {
          font-size: 0.72rem;
          color: var(--ds-fg-subtle);
          line-height: 1.55;
          margin: 0;
        }

        .tour-action-btn {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .tour-action-btn.start {
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          border: 1.5px solid var(--ds-accent);
          box-shadow: var(--ds-glow-sm);
        }

        .tour-action-btn.start:hover {
          background: var(--ds-accent-subtle);
          box-shadow: var(--ds-glow-md);
        }

        .tour-content-panel {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .tour-progress-bar {
          width: 100%;
          height: 3px;
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
          overflow: hidden;
        }

        .tour-progress-fill {
          height: 100%;
          background: var(--ds-accent);
          transition: width 0.3s ease;
        }

        .tour-step-card {
          padding: 14px;
          background: rgba(0,0,0,0.25);
          border: 1px solid var(--ds-glass-border);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .tour-step-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .tour-step-count {
          font-size: 0.52rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.08em;
        }

        .tour-voice-btn {
          background: none;
          border: none;
          color: var(--ds-accent);
          font-size: 0.58rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          padding: 2px 6px;
          border-radius: 4px;
          background: var(--ds-accent-faint);
        }

        .tour-voice-btn.speaking {
          animation: text-pulse 1.5s infinite alternate;
        }

        .tour-step-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
        }

        .tour-step-desc {
          font-size: 0.72rem;
          color: var(--ds-fg-muted);
          line-height: 1.5;
          margin: 0;
        }

        .tour-nav-controls {
          display: flex;
          gap: 8px;
        }

        .tour-nav-btn {
          flex: 1;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid var(--ds-glass-border);
          background: none;
          color: var(--ds-fg-muted);
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .tour-nav-btn:hover:not(:disabled) {
          border-color: rgba(255,255,255,0.15);
          color: #fff;
        }

        .tour-nav-btn:disabled {
          opacity: 0.35;
          cursor: default;
        }

        .tour-nav-btn.play-pause {
          border-color: rgba(255, 255, 255, 0.08);
        }

        .tour-nav-btn.next {
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          border-color: var(--ds-border-accent);
        }

        .tour-nav-btn.next:hover {
          background: var(--ds-accent-subtle);
        }

        @keyframes text-pulse {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
