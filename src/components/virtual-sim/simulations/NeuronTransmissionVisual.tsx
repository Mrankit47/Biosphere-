"use client";

import React, { useMemo } from "react";

interface NeuronProps {
  timeline: number;
  controls: Record<string, any>;
}

export default function NeuronTransmissionVisual({ timeline, controls }: NeuronProps) {
  const isMyelinated = controls.myelinSheath !== false;
  const extNa = controls.externalNa ?? 140;

  // Signal propagation X position (moves from left X=15 to right X=180 during timeline 0-80)
  const signalX = useMemo(() => {
    return 15 + (Math.min(80, timeline) / 80) * 165;
  }, [timeline]);

  return (
    <svg className="w-full h-full min-h-[220px] max-h-[260px] bg-black/40 rounded-lg p-2" viewBox="0 0 200 200">
      {/* Axon Membrane sheath (horizontal boundaries) */}
      <line x1="10" y1="80" x2="160" y2="80" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
      <line x1="10" y1="120" x2="160" y2="120" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
      <text x="12" y="74" fill="rgba(255,255,255,0.3)" fontSize="5" fontFamily="monospace">AXON MEMBRANE</text>

      {/* Myelin Sheath wraps if active (creates segments) */}
      {isMyelinated && (
        <g fill="#facc15" opacity="0.35">
          {/* Segment 1 */}
          <rect x="25" y="72" width="30" height="6" rx="2" />
          <rect x="25" y="122" width="30" height="6" rx="2" />
          {/* Segment 2 */}
          <rect x="75" y="72" width="35" height="6" rx="2" />
          <rect x="75" y="122" width="35" height="6" rx="2" />
          {/* Segment 3 */}
          <rect x="125" y="72" width="25" height="6" rx="2" />
          <rect x="125" y="122" width="25" height="6" rx="2" />
          <text x="76" y="68" fill="#facc15" fontSize="4.5">MYELIN SHEATH</text>
        </g>
      )}

      {/* Resting charge signs (+ outside, - inside) */}
      {Array.from({ length: 9 }).map((_, i) => {
        const x = 18 + i * 16;
        // Shift charges to represent depolarization (sodium entry) as signal passes
        const isDepolarized = Math.abs(x - signalX) < 18 && timeline > 10;
        
        return (
          <g key={i} fontSize="6" fontFamily="sans-serif" fontWeight="bold">
            {/* Extracellular charges */}
            <text x={x} y="68" fill={isDepolarized ? "#3b82f6" : "#ef4444"}>
              {isDepolarized ? "–" : "+"}
            </text>
            
            {/* Intracellular charges */}
            <text x={x} y="94" fill={isDepolarized ? "#ef4444" : "#3b82f6"}>
              {isDepolarized ? "+" : "–"}
            </text>
          </g>
        );
      })}

      {/* Sodium (Na+) ion concentration dots based on slider control */}
      {Array.from({ length: Math.ceil(extNa / 10) }).map((_, i) => {
        const x = 12 + (i * 12) % 150;
        const y = 50 + (i * 7) % 20;
        return <circle key={i} cx={x} cy={y} r="1.2" fill="#ef4444" opacity="0.6" />;
      })}

      {/* Propagating signal pulse line */}
      {timeline > 0 && (
        <g>
          {/* Glowing pulse ring */}
          <circle cx={signalX} cy="100" r="10" fill="rgba(57, 255, 20, 0.15)" stroke="#39ff14" strokeWidth="1.5" />
          <line x1={signalX} y1="80" x2={signalX} y2="120" stroke="#39ff14" strokeWidth="2.5" />
          <text x={signalX - 18} y="112" fill="#39ff14" fontSize="4.5" fontWeight="bold" fontFamily="monospace">
            +40mV
          </text>
        </g>
      )}

      {/* Synaptic Terminal and Receptor Cleft (t >= 80) */}
      <g>
        {/* Terminal bulb */}
        <path d="M 160 80 C 175 80 180 60 180 100 C 180 140 175 120 160 120 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" />
        
        {/* Post-synaptic target membrane boundary */}
        <path d="M 195 60 C 190 75 190 125 195 140" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />

        {/* Synaptic vesicles */}
        {timeline < 80 ? (
          <g fill="#10b981" opacity="0.7">
            <circle cx="168" cy="92" r="2.5" />
            <circle cx="172" cy="100" r="2.5" />
            <circle cx="168" cy="108" r="2.5" />
          </g>
        ) : (
          /* Vesicle fusion and Neurotransmitter exit (t >= 80) */
          <g>
            {/* Vesicle fused outlines */}
            <circle cx="178" cy="90" r="1" fill="none" stroke="#10b981" />
            
            {/* Released Neurotransmitter particles diffusing */}
            <circle cx="183" cy="85" r="1.5" fill="#10b981" className="animate-ping" />
            <circle cx="186" cy="95" r="1.5" fill="#10b981" />
            <circle cx="184" cy="105" r="1.5" fill="#10b981" />
            <circle cx="188" cy="115" r="1.5" fill="#10b981" />
            
            <text x="162" y="152" fill="#10b981" fontSize="4.5" fontWeight="bold">SYNAPSE RELEASE</text>
          </g>
        )}
      </g>
    </svg>
  );
}
