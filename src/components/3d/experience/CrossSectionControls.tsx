"use client";

import React from "react";
import { useExperience } from "./ExperienceContext";

export const CrossSectionControls: React.FC = () => {
  const {
    mode,
    layerOpacities,
    setLayerOpacity,
    explodeFactor,
    setExplodeFactor,
    focusMode,
    setFocusMode
  } = useExperience();

  if (mode !== "simulation") return null;

  const layersList = [
    { id: "skin", label: "Skin Layer (Integumentary)", emoji: "👤" },
    { id: "skeleton", label: "Skeleton Bones", emoji: "🦴" },
    { id: "muscles", label: "Muscle Fibers", emoji: "💪" },
    { id: "organs", label: "Visceral Organs", emoji: "🫁" },
    { id: "vascular", label: "Vascular Vessels", emoji: "🩸" },
    { id: "nervous", label: "Nerve Network", emoji: "⚡" },
    { id: "endocrine", label: "Endocrine Glands", emoji: "🧪" },
    { id: "lymphatic", label: "Lymph Nodes", emoji: "🟢" },
    { id: "reproductive", label: "Reproductive System", emoji: "🧬" },
  ];

  return (
    <div className="cross-section-root glassmorphic">
      <div className="cs-header">
        <span className="cs-icon">🩻</span>
        <h4 className="cs-title">CROSS SECTION CONTROLS</h4>
      </div>

      {/* Exploded View Control */}
      <div className="cs-control-group slider-group">
        <div className="cs-slider-header">
          <span className="cs-slider-label">💥 EXPLODED VIEW FACTOR:</span>
          <span className="cs-slider-val">{Math.round(explodeFactor * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={explodeFactor * 100}
          onChange={(e) => setExplodeFactor(parseFloat(e.target.value) / 100)}
          className="cs-slider"
        />
      </div>

      {/* Isolation Focus Mode */}
      <div className="cs-control-group check-row">
        <div className="check-info">
          <span className="check-label">🔍 ISOLATION FOCUS MODE</span>
          <p className="check-desc">Hide all non-selected elements automatically</p>
        </div>
        <button
          onClick={() => setFocusMode(!focusMode)}
          className={`cs-toggle-btn ${focusMode ? "on" : ""}`}
        >
          <div className="toggle-dot" />
        </button>
      </div>

      {/* Layer Opacities Sliders */}
      <div className="cs-layers-section">
        <h5 className="cs-section-subtitle">LAYER TRANSPARENCY:</h5>
        <div className="cs-layers-list">
          {layersList.map((layer) => {
            const currentVal = layerOpacities[layer.id] !== undefined ? layerOpacities[layer.id] : 1.0;
            return (
              <div key={layer.id} className="layer-opacity-row">
                <div className="layer-info-header">
                  <span className="layer-name">
                    {layer.emoji} {layer.label}
                  </span>
                  <span className="layer-val-text">{Math.round(currentVal * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentVal * 100}
                  onChange={(e) => setLayerOpacity(layer.id, parseFloat(e.target.value) / 100)}
                  className="cs-mini-slider"
                />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .cross-section-root {
          padding: 16px 20px;
          border-radius: 16px;
          border: 1px solid var(--ds-glass-border);
          background: var(--ds-surface-overlay);
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          box-sizing: border-box;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cs-header {
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--ds-glass-border);
          padding-bottom: 8px;
        }

        .cs-icon { font-size: 1.1rem; }
        .cs-title {
          font-size: 0.68rem;
          font-weight: 900;
          color: var(--ds-accent-muted);
          letter-spacing: 0.12em;
          margin: 0;
        }

        .cs-control-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cs-slider-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.58rem;
          font-weight: 800;
          color: var(--ds-fg-muted);
        }

        .cs-slider-val {
          color: var(--ds-accent);
          font-weight: 900;
        }

        .cs-slider {
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.06);
          outline: none;
          -webkit-appearance: none;
          cursor: pointer;
        }

        .cs-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--ds-accent);
          box-shadow: var(--ds-glow-sm);
        }

        /* Checkbox toggle row */
        .cs-control-group.check-row {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
          background: rgba(0,0,0,0.15);
          border: 1px solid var(--ds-glass-border);
          border-radius: 10px;
        }

        .check-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .check-label {
          font-size: 0.72rem;
          font-weight: 800;
          color: #fff;
        }

        .check-desc {
          font-size: 0.58rem;
          color: var(--ds-fg-subtle);
          margin: 0;
        }

        .cs-toggle-btn {
          width: 34px;
          height: 18px;
          border-radius: 9px;
          border: 1px solid var(--ds-glass-border);
          background: rgba(255,255,255,0.05);
          position: relative;
          cursor: pointer;
          transition: all 0.25s;
          padding: 0;
        }

        .cs-toggle-btn.on {
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
        }

        .toggle-dot {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--ds-fg-muted);
          transition: all 0.25s ease;
        }

        .cs-toggle-btn.on .toggle-dot {
          left: 18px;
          background: var(--ds-accent);
        }

        /* Transparency list */
        .cs-layers-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cs-section-subtitle {
          font-size: 0.58rem;
          font-weight: 850;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.08em;
          margin: 0;
        }

        .cs-layers-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 250px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .layer-opacity-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .layer-info-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .layer-name {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--ds-fg-muted);
        }

        .layer-val-text {
          font-size: 0.62rem;
          color: var(--ds-fg-subtle);
          font-weight: 700;
        }

        .cs-mini-slider {
          width: 100%;
          height: 3px;
          border-radius: 2px;
          background: rgba(255,255,255,0.05);
          outline: none;
          -webkit-appearance: none;
          cursor: pointer;
        }

        .cs-mini-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--ds-accent);
        }
      `}</style>
    </div>
  );
};
