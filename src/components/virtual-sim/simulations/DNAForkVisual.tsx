"use client";

import React, { useMemo } from "react";

interface DNAForkVisualProps {
  timeline: number;
  controls: Record<string, any>;
}

export default function DNAForkVisual({ timeline, controls }: DNAForkVisualProps) {
  const ssbActive = controls.ssbState !== false;

  // Fork unwinding coordinate moves from left to right as timeline progresses
  const forkX = useMemo(() => {
    return 60 + (timeline / 100) * 110;
  }, [timeline]);

  return (
    <svg className="w-full h-full min-h-[220px] max-h-[260px] bg-black/40 rounded-lg p-2" viewBox="0 0 200 200">
      {/* DNA Helicase Wedge */}
      {timeline > 0 && (
        <g>
          <polygon
            points={`${forkX - 10},90 ${forkX + 8},100 ${forkX - 10},110`}
            fill="#ef4444"
            stroke="#fff"
            strokeWidth="1"
            className="animate-pulse"
          />
          <text x={forkX - 15} y="82" fill="#ef4444" fontSize="4.5" fontFamily="monospace" fontWeight="bold">
            HELICASE
          </text>
        </g>
      )}

      {/* Parent DNA Template Strand 1 (Top) */}
      <path
        d={`M 10 100 L ${forkX} 100 Q ${forkX + 20} 100 190 40`}
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2.5"
      />
      {/* Parent DNA Template Strand 2 (Bottom) */}
      <path
        d={`M 10 100 L ${forkX} 100 Q ${forkX + 20} 100 190 160`}
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2.5"
      />

      {/* Single-Strand Binding Proteins (SSBs) if active */}
      {ssbActive && timeline > 10 && (
        <g fill="#a855f7" stroke="#fff" strokeWidth="0.5">
          <circle cx={forkX + 10} cy="85" r="2.5" />
          <circle cx={forkX + 15} cy="80" r="2.5" />
          <circle cx={forkX + 10} cy="115" r="2.5" />
          <circle cx={forkX + 15} cy="120" r="2.5" />
          <text x={forkX + 20} y="76" fill="#a855f7" fontSize="4" fontFamily="monospace">SSB</text>
        </g>
      )}

      {/* Base Pairing Hydrogen Bonds (unzipped dynamically behind the fork) */}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = 15 + i * 9;
        if (x >= forkX) return null;
        return (
          <line
            key={i}
            x1={x}
            y1="96"
            x2={x}
            y2="104"
            stroke="rgba(57, 255, 20, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="1 1"
          />
        );
      })}

      {/* RNA Primase (Anchors, timeline >= 25) */}
      {timeline >= 25 && (
        <g>
          {/* Leading Primer (top) */}
          <path d="M 60 100 L 75 100" fill="none" stroke="#10b981" strokeWidth="3" />
          <circle cx="75" cy="100" r="2" fill="#10b981" />
          <text x="56" y="94" fill="#10b981" fontSize="4">PRIMER</text>
          
          {/* Lagging Primer (bottom) */}
          {timeline >= 40 && (
            <>
              <path d="M 90 102 L 105 108" fill="none" stroke="#10b981" strokeWidth="3" />
              <circle cx="105" cy="108" r="2" fill="#10b981" />
            </>
          )}
        </g>
      )}

      {/* DNA Polymerase III (Builders, timeline >= 50) */}
      {timeline >= 50 && (
        <g>
          {/* Leading Strand synthesis (top, continuous rightward) */}
          {(() => {
            const leadEndX = Math.min(185, 75 + ((timeline - 50) / 50) * 110);
            const isAhead = leadEndX > forkX;
            const targetY = isAhead ? 100 - (leadEndX - forkX) * 0.45 : 100;
            return (
              <>
                <path
                  d={`M 75 100 L ${Math.min(forkX, leadEndX)} 100 Q ${forkX + 20} 100 ${leadEndX} ${targetY}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
                <circle cx={leadEndX} cy={targetY} r="4.5" fill="#3b82f6" stroke="#fff" />
                <text x={leadEndX - 10} y={targetY - 8} fill="#3b82f6" fontSize="4.5" fontWeight="bold">
                  POLY III
                </text>
              </>
            );
          })()}

          {/* Lagging Strand Okazaki Fragments (bottom, discontinuous) */}
          {timeline >= 65 && (
            <g>
              <path
                d={`M 105 108 L ${Math.min(forkX, 105 + ((timeline - 65) / 35) * 60)} ${
                  100 + (Math.min(forkX, 105 + ((timeline - 65) / 35) * 60) - forkX > 0
                    ? (Math.min(forkX, 105 + ((timeline - 65) / 35) * 60) - forkX) * 0.45
                    : 8)
                }`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
              />
            </g>
          )}
        </g>
      )}

      {/* DNA Ligase (Backbone sealing, timeline >= 75) */}
      {timeline >= 75 && (
        <g>
          <circle cx="110" cy="115" r="5" fill="#f59e0b" stroke="#fff" className="animate-pulse" />
          <text x="118" y="118" fill="#f59e0b" fontSize="4.5" fontWeight="bold">
            LIGASE
          </text>
        </g>
      )}
    </svg>
  );
}
