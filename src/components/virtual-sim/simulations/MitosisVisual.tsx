"use client";

import React, { useMemo } from "react";

interface MitosisVisualProps {
  timeline: number;
  controls: Record<string, any>;
}

export default function MitosisVisual({ timeline, controls }: MitosisVisualProps) {
  const isColchicine = controls.spindleState === true;
  const isPlant = controls.cellType === "plant";

  const centrioleLeftX = useMemo(() => {
    return 90 - Math.min(25, timeline) * 2.2; // Moves from 90 to 35
  }, [timeline]);

  const centrioleRightX = useMemo(() => {
    return 110 + Math.min(25, timeline) * 2.2; // Moves from 110 to 165
  }, [timeline]);

  const Y_AXIS = 100;
  // Cleavage furrow pinch depth for Cytokinesis (starting at timeline 75)
  const cellPinch = timeline >= 75 ? (timeline - 75) * 0.95 : 0;

  return (
    <svg className="w-full h-full min-h-[220px] max-h-[260px] bg-black/40 rounded-lg p-2" viewBox="0 0 200 200">
      <g>
        {/* Cell Boundary Outline */}
        {isPlant ? (
          /* Plant Cell: Rigid rectangular box that builds a Cell Plate (no cleavage furrow pinch) */
          <g>
            <rect x="25" y="25" width="150" height="150" fill="none" stroke="#10b981" strokeWidth="2.5" />
            {timeline >= 75 && (
              /* Growing Cell Plate across equator */
              <line
                x1="100"
                y1={100 - ((timeline - 75) / 25) * 65}
                x2="100"
                y2={100 + ((timeline - 75) / 25) * 65}
                stroke="#10b981"
                strokeWidth="4"
                strokeDasharray="2 2"
              />
            )}
          </g>
        ) : (
          /* Animal Cell cleavage pinch or fully divided spheres */
          timeline < 95 ? (
            <path
              d={`M 100 ${20 + cellPinch} 
                  C ${150 + cellPinch / 2} ${20 + cellPinch} 180 60 180 100 
                  C 180 140 ${150 + cellPinch / 2} ${180 - cellPinch} 100 ${180 - cellPinch} 
                  C ${50 - cellPinch / 2} ${180 - cellPinch} 20 140 20 100 
                  C 20 60 ${50 - cellPinch / 2} ${20 + cellPinch} 100 ${20 + cellPinch} Z`}
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            />
          ) : (
            <g>
              <circle cx="55" cy="100" r="36" fill="none" stroke="#fff" strokeWidth="2" />
              <circle cx="145" cy="100" r="36" fill="none" stroke="#fff" strokeWidth="2" />
            </g>
          )
        )}

        {/* Centrioles (Spindle poles, not active/visible in plant cells) */}
        {!isPlant && (
          timeline < 95 ? (
            <>
              <rect x={centrioleLeftX - 3} y={Y_AXIS - 6} width="6" height="12" fill="#3b82f6" />
              <rect x={centrioleRightX - 3} y={Y_AXIS - 6} width="6" height="12" fill="#3b82f6" />
            </>
          ) : (
            <>
              <rect x="52" y="94" width="6" height="12" fill="#3b82f6" />
              <rect x="142" y="94" width="6" height="12" fill="#3b82f6" />
            </>
          )
        )}

        {/* Nuclear envelope dissolve/reform */}
        {timeline <= 30 && (
          <circle
            cx="100"
            cy="100"
            r="32"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            style={{ opacity: 1.0 - timeline / 30 }}
          />
        )}
        {timeline >= 75 && (
          <g style={{ opacity: (timeline - 75) / 25 }}>
            <circle cx="55" cy="100" r="18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="145" cy="100" r="18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="2 2" />
          </g>
        )}

        {/* Spindle Fibers (Metaphase/Anaphase, suppressed if colchicine is active) */}
        {!isColchicine && timeline >= 25 && timeline < 75 && (
          <g opacity={(timeline - 25) / 10}>
            {/* Left Fibers */}
            <line x1={centrioleLeftX} y1={Y_AXIS} x2="100" y2="70" stroke="rgba(57, 255, 20, 0.25)" strokeWidth="1" strokeDasharray="1 1" />
            <line x1={centrioleLeftX} y1={Y_AXIS} x2="100" y2="90" stroke="rgba(57, 255, 20, 0.25)" strokeWidth="1" strokeDasharray="1 1" />
            <line x1={centrioleLeftX} y1={Y_AXIS} x2="100" y2="110" stroke="rgba(57, 255, 20, 0.25)" strokeWidth="1" strokeDasharray="1 1" />
            <line x1={centrioleLeftX} y1={Y_AXIS} x2="100" y2="130" stroke="rgba(57, 255, 20, 0.25)" strokeWidth="1" strokeDasharray="1 1" />

            {/* Right Fibers */}
            <line x1={centrioleRightX} y1={Y_AXIS} x2="100" y2="70" stroke="rgba(57, 255, 20, 0.25)" strokeWidth="1" strokeDasharray="1 1" />
            <line x1={centrioleRightX} y1={Y_AXIS} x2="100" y2="90" stroke="rgba(57, 255, 20, 0.25)" strokeWidth="1" strokeDasharray="1 1" />
            <line x1={centrioleRightX} y1={Y_AXIS} x2="100" y2="110" stroke="rgba(57, 255, 20, 0.25)" strokeWidth="1" strokeDasharray="1 1" />
            <line x1={centrioleRightX} y1={Y_AXIS} x2="100" y2="130" stroke="rgba(57, 255, 20, 0.25)" strokeWidth="1" strokeDasharray="1 1" />
          </g>
        )}

        {/* Chromosomes (packaging, alignment, division) */}
        {(() => {
          if (timeline <= 25) {
            // Prophase chromatin packing
            return (
              <g opacity={0.8}>
                <path d="M 85 90 Q 100 110 115 90" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                <path d="M 90 110 Q 100 80 110 110" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
              </g>
            );
          } else if (timeline <= 50) {
            // Metaphase equatorial alignment
            // If Colchicine is active, chromatids stay disorganized (no spindle alignment)
            const progress = (timeline - 25) / 25;
            const xPos = isColchicine ? 85 + Math.random() * 5 : 85 + progress * 15;
            return (
              <g>
                <path d={`M ${xPos - 4} 80 L ${xPos + 4} 90 M ${xPos - 4} 90 L ${xPos + 4} 80`} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                <path d={`M ${xPos - 4} 110 L ${xPos + 4} 120 M ${xPos - 4} 120 L ${xPos + 4} 110`} fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            );
          } else if (timeline <= 75) {
            // Anaphase splitting
            // If Colchicine is active, they do not split because fibers are blocked!
            if (isColchicine) {
              return (
                <g>
                  <path d="M 83 80 L 91 90 M 83 90 L 91 80" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
                  <path d="M 83 110 L 91 120 M 83 120 L 91 110" fill="none" stroke="#60a5fa" strokeWidth="2.5" />
                </g>
              );
            }
            const progress = (timeline - 50) / 25;
            const leftX = 100 - progress * 42;
            const rightX = 100 + progress * 42;
            return (
              <g>
                {/* Left chromatid poles (< shape) */}
                <path d={`M ${leftX + 3} 78 L ${leftX} 83 L ${leftX + 3} 88`} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                <path d={`M ${leftX + 3} 112 L ${leftX} 117 L ${leftX + 3} 122`} fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
                
                {/* Right chromatid poles (> shape) */}
                <path d={`M ${rightX - 3} 78 L ${rightX} 83 L ${rightX - 3} 88`} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                <path d={`M ${rightX - 3} 112 L ${rightX} 117 L ${rightX - 3} 122`} fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            );
          } else {
            // Telophase decondensation
            return (
              <g opacity={0.6}>
                <path d="M 45 95 Q 55 105 65 95" fill="none" stroke="#f43f5e" strokeWidth="1.2" />
                <path d="M 135 95 Q 145 105 155 95" fill="none" stroke="#60a5fa" strokeWidth="1.2" />
              </g>
            );
          }
        })()}
      </g>
    </svg>
  );
}
