"use client";

import React, { useState } from "react";
import { Html } from "@react-three/drei";
import { useExperience } from "./ExperienceContext";

interface HotspotProps {
  position: [number, number, number];
  targetObjectId: string;
}

export const Hotspot: React.FC<HotspotProps> = ({ position, targetObjectId }) => {
  const {
    mode,
    selectedObjectId,
    setSelectedObjectId,
    hoveredObjectId,
    setHoveredObjectId,
    metadata,
    dispatchCameraMove
  } = useExperience();

  const [localHover, setLocalHover] = useState(false);
  const data = metadata[targetObjectId];

  if (!data || mode === "quiz") return null;

  const isSelected = selectedObjectId === targetObjectId;
  const isAnySelected = selectedObjectId !== null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      setSelectedObjectId(null);
    } else {
      setSelectedObjectId(targetObjectId);
      // Zoom camera in relative coordinates (move camera slightly offset from target)
      const zoomPos: [number, number, number] = [
        position[0],
        position[1] + 0.2,
        position[2] + 2.5
      ];
      dispatchCameraMove(zoomPos, position, 1.2);
    }
  };

  const handleMouseEnter = () => {
    setLocalHover(true);
    setHoveredObjectId(targetObjectId);
  };

  const handleMouseLeave = () => {
    setLocalHover(false);
    if (hoveredObjectId === targetObjectId) {
      setHoveredObjectId(null);
    }
  };

  return (
    <group position={position}>
      <Html distanceFactor={8} zIndexRange={[10, 50]}>
        <div
          className={`hotspot-marker ${isSelected ? "selected" : ""} ${isAnySelected && !isSelected ? "fade-out" : ""}`}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="hotspot-pulse" style={{ "--pulse-color": data.color } as React.CSSProperties} />
          <div className="hotspot-dot" style={{ backgroundColor: data.color }} />

          {/* Label Tooltip on hover */}
          {(localHover || isSelected) && (
            <div className="hotspot-tooltip glassmorphic">
              <span className="tooltip-emoji">{data.emoji}</span>
              <div className="tooltip-info">
                <span className="tooltip-name">{data.name}</span>
                <span className="tooltip-scientific">{data.scientificName}</span>
              </div>
            </div>
          )}
        </div>

        <style>{`
          .hotspot-marker {
            position: relative;
            width: 20px;
            height: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
          }
          .hotspot-marker.fade-out {
            opacity: 0.25;
            pointer-events: none;
          }
          .hotspot-pulse {
            position: absolute;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 2px solid var(--pulse-color, var(--ds-accent));
            opacity: 0;
            animation: hotspot-ping 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
          }
          .hotspot-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            box-shadow: 0 0 10px var(--ds-glow-color, rgba(255, 255, 255, 0.4));
            transition: transform 0.2s;
            border: 1.5px solid #fff;
          }
          .hotspot-marker:hover .hotspot-dot,
          .hotspot-marker.selected .hotspot-dot {
            transform: scale(1.4);
          }

          .hotspot-tooltip {
            position: absolute;
            bottom: 26px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            border-radius: 8px;
            border: 1px solid var(--ds-glass-border);
            white-space: nowrap;
            pointer-events: none;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(8px);
            box-shadow: var(--ds-glow-sm);
            animation: tooltip-fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .tooltip-emoji { font-size: 1.1rem; }
          .tooltip-info { display: flex; flex-direction: column; gap: 1px; }
          .tooltip-name { font-size: 0.75rem; font-weight: 800; color: #fff; }
          .tooltip-scientific { font-size: 0.58rem; color: var(--ds-fg-subtle); font-style: italic; }

          @keyframes hotspot-ping {
            0% { transform: scale(0.6); opacity: 0.8; }
            100% { transform: scale(1.6); opacity: 0; }
          }
          @keyframes tooltip-fade-in {
            0% { opacity: 0; transform: translateX(-50%) translateY(4px); }
            100% { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
        `}</style>
      </Html>
    </group>
  );
};
