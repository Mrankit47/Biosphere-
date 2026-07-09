"use client";

import React, { useState } from "react";
import { useExperience } from "./ExperienceContext";

export const ModelToolbar: React.FC = () => {
  const {
    mode,
    setMode,
    animations,
    toggleAnimation,
    setAnimationSpeed
  } = useExperience();

  const [speedDropdown, setSpeedDropdown] = useState<string | null>(null);

  const modesList = [
    { id: "explore", label: "Explore Mode", icon: "🌐", desc: "Free interactive viewing" },
    { id: "learn", label: "Guided Learn", icon: "📖", desc: "Visual tour & voice narration" },
    { id: "quiz", label: "Challenge Quiz", icon: "📝", desc: "Structure matching & quizzes" },
    { id: "simulation", label: "Simulation Lab", icon: "🧪", desc: "Cross section & animations" },
    { id: "teacher", label: "Teacher Console", icon: "🎓", desc: "Classroom slides & prompts" },
  ];

  return (
    <div className="model-toolbar-root glassmorphic">
      {/* Modes list */}
      <div className="toolbar-modes-row">
        {modesList.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as any)}
            className={`toolbar-mode-btn ${mode === m.id ? "active" : ""}`}
            title={m.desc}
          >
            <span className="mode-btn-icon">{m.icon}</span>
            <span className="mode-btn-label">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Animation system controls (only shown in simulation/explore modes if animations exist) */}
      {animations.length > 0 && (mode === "simulation" || mode === "explore") && (
        <div className="toolbar-animations-row">
          <span className="anim-row-title">⚙️ ANIMATIONS:</span>
          <div className="animations-grid">
            {animations.map((anim) => (
              <div key={anim.name} className="anim-control-card">
                <button
                  onClick={() => toggleAnimation(anim.name)}
                  className={`anim-play-btn ${anim.isPlaying ? "playing" : ""}`}
                >
                  <span className="anim-icon">{anim.icon}</span>
                  <span className="anim-label">{anim.label}</span>
                  <span className="anim-state-indicator">{anim.isPlaying ? "⏸" : "▶"}</span>
                </button>

                {/* Speed Controls */}
                <div className="anim-speed-selector">
                  <button
                    onClick={() => setSpeedDropdown(speedDropdown === anim.name ? null : anim.name)}
                    className="speed-dropdown-toggle"
                  >
                    {anim.speed}x ▾
                  </button>

                  {speedDropdown === anim.name && (
                    <div className="speed-dropdown-menu glassmorphic">
                      {[0.25, 0.5, 1.0, 1.5, 2.0].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setAnimationSpeed(anim.name, s);
                            setSpeedDropdown(null);
                          }}
                          className={`speed-option-btn ${anim.speed === s ? "active" : ""}`}
                        >
                          {s === 1.0 ? "Normal" : s === 0.25 ? "Slow-Mo" : `${s}x`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .model-toolbar-root {
          padding: 12px 16px;
          border-radius: 16px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
          z-index: 100;
          box-sizing: border-box;
          width: 100%;
        }

        .toolbar-modes-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .toolbar-mode-btn {
          flex: 1;
          min-width: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(255,255,255,0.02);
          color: var(--ds-fg-muted);
          font-size: 0.75rem;
          font-weight: 750;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: inherit;
        }

        .toolbar-mode-btn:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.15);
        }

        .toolbar-mode-btn.active {
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
          box-shadow: var(--ds-glow-sm);
        }

        .mode-btn-icon {
          font-size: 1.05rem;
        }

        /* Animation timeline row */
        .toolbar-animations-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 10px;
          border-top: 1px solid var(--ds-glass-border);
        }

        .anim-row-title {
          font-size: 0.58rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.08em;
          flex-shrink: 0;
        }

        .animations-grid {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          flex: 1;
        }

        .anim-control-card {
          display: flex;
          align-items: center;
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--ds-glass-border);
          border-radius: 8px;
          overflow: visible;
          position: relative;
        }

        .anim-play-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: none;
          border: none;
          color: var(--ds-fg-muted);
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .anim-play-btn.playing {
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
        }

        .anim-state-indicator {
          font-size: 0.65rem;
          opacity: 0.8;
          margin-left: 2px;
        }

        .anim-speed-selector {
          position: relative;
          border-left: 1px solid var(--ds-glass-border);
        }

        .speed-dropdown-toggle {
          padding: 6px 10px;
          background: none;
          border: none;
          color: var(--ds-fg-subtle);
          font-size: 0.65rem;
          font-weight: 750;
          cursor: pointer;
          font-family: inherit;
        }

        .speed-dropdown-menu {
          position: absolute;
          bottom: 34px;
          right: 0;
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid var(--ds-glass-border);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          padding: 4px;
          min-width: 90px;
          box-shadow: var(--ds-glow-sm);
        }

        .speed-option-btn {
          padding: 6px 10px;
          border-radius: 6px;
          border: none;
          background: none;
          color: var(--ds-fg-muted);
          font-size: 0.68rem;
          font-weight: 700;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
        }

        .speed-option-btn:hover,
        .speed-option-btn.active {
          color: var(--ds-accent);
          background: var(--ds-accent-faint);
        }

        @media (max-width: 760px) {
          .toolbar-modes-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
          }
          .toolbar-animations-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};
