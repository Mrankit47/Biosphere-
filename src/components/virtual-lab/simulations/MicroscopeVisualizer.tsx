"use client";

import React, { useMemo } from "react";

export default function MicroscopeVisualizer({
  inputs,
  outputs
}: {
  inputs: Record<string, any>;
  outputs: Record<string, any>;
}) {
  const slideType = inputs.slideType ?? "onion";
  const coarse = inputs.coarse ?? 10;
  const fine = inputs.fine ?? 20;
  const mag = inputs.mag ?? "10x";
  const reactionRun = inputs.reactionRun ?? false;

  const blur = outputs.blur ?? 20;
  const focusScore = outputs.focusScore ?? 0;

  // Compute zoom scale factor based on selected lens
  const zoomScale = useMemo(() => {
    switch (mag) {
      case "4x":
        return 0.7;
      case "40x":
        return 2.5;
      default:
        return 1.2; // 10x
    }
  }, [mag]);

  // Specimen SVG Slide Renderers
  const renderSlideContent = () => {
    switch (slideType) {
      case "cheek":
        // Human buccal cheek cells: irregular, scattered, stained blue
        return (
          <g transform={`scale(${zoomScale})`} style={{ transformOrigin: "center" }}>
            {/* Cheek Cell 1 */}
            <g transform="translate(100, 100)">
              <path
                d="M -40,-20 C -25,-40 25,-45 40,-15 C 50,15 25,45 -10,35 C -35,30 -50,10 -40,-20 Z"
                fill="rgba(147, 197, 253, 0.45)" // stained light methylene blue
                stroke="#60a5fa"
                strokeWidth="1.5"
              />
              <circle cx="0" cy="0" r="6" fill="#1d4ed8" /> {/* nucleus */}
            </g>
            
            {/* Cheek Cell 2 */}
            <g transform="translate(220, 140)">
              <path
                d="M -30,-30 C 10,-45 45,-15 35,15 C 25,35 -25,40 -40,10 C -45,-10 -40,-20 -30,-30 Z"
                fill="rgba(147, 197, 253, 0.45)"
                stroke="#60a5fa"
                strokeWidth="1.5"
              />
              <circle cx="-5" cy="5" r="5.5" fill="#1d4ed8" />
            </g>

            {/* Cheek Cell 3 */}
            <g transform="translate(140, 200)">
              <path
                d="M -35,-10 C -15,-35 30,-35 45,-10 C 50,15 15,35 -20,25 C -40,15 -45,10 -35,-10 Z"
                fill="rgba(147, 197, 253, 0.35)"
                stroke="#60a5fa"
                strokeWidth="1"
              />
              <circle cx="5" cy="-2" r="5" fill="#1d4ed8" />
            </g>
            
            {/* Bacteria/Dust particles (buccal scrapings) */}
            <circle cx="80" cy="180" r="1.5" fill="#1e40af" />
            <circle cx="250" cy="80" r="1" fill="#1e40af" />
            <circle cx="210" cy="220" r="1.2" fill="#1e40af" />
          </g>
        );

      case "stomata":
        // Leaf epidermis: grid of cells with guard cells forming stomatal pores
        return (
          <g transform={`scale(${zoomScale})`} style={{ transformOrigin: "center" }}>
            {/* Normal epidermal cells */}
            <path
              d="M0,0 L80,10 L70,80 L10,70 Z M80,10 L160,5 L170,75 L70,80 Z M160,5 L240,15 L250,90 L170,75 Z M240,15 L320,5 L310,85 L250,90 Z"
              fill="none"
              stroke="#047857"
              strokeWidth="1"
            />
            <path
              d="M10,70 L70,80 L80,160 L0,150 Z M170,75 L250,90 L240,170 L150,160 Z"
              fill="none"
              stroke="#047857"
              strokeWidth="1"
            />
            <path
              d="M0,150 L80,160 L70,240 L10,230 Z M80,160 L150,160 L160,235 L70,240 Z M240,170 L320,165 L310,240 L250,245 Z"
              fill="none"
              stroke="#047857"
              strokeWidth="1"
            />

            {/* Stomata Guard Cell Unit 1 (kidney bean shapes) */}
            <g transform="translate(120, 110)">
              {/* Left guard cell */}
              <path
                d="M 0,-25 C -12,-20 -15,20 0,25 C -5,15 -5,-15 0,-25 Z"
                fill="#34d399"
                stroke="#065f46"
                strokeWidth="1.5"
              />
              {/* Right guard cell */}
              <path
                d="M 0,-25 C 12,-20 15,20 0,25 C 5,15 5,-15 0,-25 Z"
                fill="#34d399"
                stroke="#065f46"
                strokeWidth="1.5"
              />
              {/* Stomatal pore central opening */}
              <ellipse cx="0" cy="0" rx="3.5" ry="12" fill="#022c22" />
              {/* Chloroplast spots */}
              <circle cx="-5" cy="-8" r="1.5" fill="#047857" />
              <circle cx="-6" cy="8" r="1.5" fill="#047857" />
              <circle cx="5" cy="-8" r="1.5" fill="#047857" />
              <circle cx="6" cy="8" r="1.5" fill="#047857" />
            </g>

            {/* Stomata Guard Cell Unit 2 */}
            <g transform="translate(200, 200)">
              <path
                d="M 0,-25 C -12,-20 -15,20 0,25 C -5,15 -5,-15 0,-25 Z"
                fill="#34d399"
                stroke="#065f46"
                strokeWidth="1.5"
              />
              <path
                d="M 0,-25 C 12,-20 15,20 0,25 C 5,15 5,-15 0,-25 Z"
                fill="#34d399"
                stroke="#065f46"
                strokeWidth="1.5"
              />
              <ellipse cx="0" cy="0" rx="2" ry="10" fill="#022c22" />
              <circle cx="-5" cy="-6" r="1.5" fill="#047857" />
              <circle cx="5" cy="6" r="1.5" fill="#047857" />
            </g>
          </g>
        );

      case "onion":
      default:
        // Onion epidermal cell slide: brick-like rows, stained yellow-orange
        return (
          <g transform={`scale(${zoomScale})`} style={{ transformOrigin: "center" }}>
            {/* Grid of elongated plant cells */}
            <g fill="rgba(251, 191, 36, 0.15)" stroke="#d97706" strokeWidth="1.5">
              {/* Row 1 */}
              <rect x="10" y="30" width="90" height="45" rx="2" />
              <rect x="100" y="30" width="105" height="45" rx="2" />
              <rect x="205" y="30" width="95" height="45" rx="2" />
              
              {/* Row 2 */}
              <rect x="-10" y="75" width="80" height="45" rx="2" />
              <rect x="70" y="75" width="110" height="45" rx="2" />
              <rect x="180" y="75" width="100" height="45" rx="2" />
              <rect x="280" y="75" width="80" height="45" rx="2" />

              {/* Row 3 */}
              <rect x="5" y="120" width="95" height="45" rx="2" />
              <rect x="100" y="120" width="90" height="45" rx="2" />
              <rect x="190" y="120" width="115" height="45" rx="2" />
              
              {/* Row 4 */}
              <rect x="-20" y="165" width="90" height="45" rx="2" />
              <rect x="70" y="165" width="115" height="45" rx="2" />
              <rect x="185" y="165" width="95" height="45" rx="2" />
              <rect x="280" y="165" width="80" height="45" rx="2" />

              {/* Row 5 */}
              <rect x="15" y="210" width="95" height="45" rx="2" />
              <rect x="110" y="210" width="100" height="45" rx="2" />
              <rect x="210" y="210" width="90" height="45" rx="2" />
            </g>
            
            {/* Nuclei inside each cell (stained with Iodine, showing dark dots) */}
            <circle cx="50" cy="55" r="4.5" fill="#78350f" />
            <circle cx="160" cy="50" r="4.5" fill="#78350f" />
            <circle cx="260" cy="55" r="4" fill="#78350f" />

            <circle cx="35" cy="100" r="4" fill="#78350f" />
            <circle cx="120" cy="95" r="4.8" fill="#78350f" />
            <circle cx="230" cy="100" r="4.5" fill="#78350f" />

            <circle cx="45" cy="140" r="4.5" fill="#78350f" />
            <circle cx="145" cy="145" r="4.2" fill="#78350f" />
            <circle cx="255" cy="140" r="4.7" fill="#78350f" />

            <circle cx="30" cy="190" r="4.5" fill="#78350f" />
            <circle cx="125" cy="185" r="4" fill="#78350f" />
            <circle cx="240" cy="190" r="4.5" fill="#78350f" />
            
            {/* Cytoplasm granules / details */}
            <circle cx="140" cy="132" r="1.5" fill="#b45309" opacity="0.4" />
            <circle cx="210" cy="180" r="1" fill="#b45309" opacity="0.4" />
            <circle cx="65" cy="80" r="1" fill="#b45309" opacity="0.4" />
          </g>
        );
    }
  };

  return (
    <div className="relative w-full h-[320px] rounded-lg overflow-hidden border border-[var(--ds-glass-border)] bg-[#050a05] grid grid-cols-2 p-3 gap-3">
      {/* Left: 3D-like structural diagram representing the physical microscope */}
      <div className="flex flex-col items-center justify-center border border-[var(--ds-border-muted)] bg-black/40 rounded-lg p-2 text-center text-[var(--ds-fg-muted)]">
        <svg viewBox="0 0 100 120" width="80" height="90" className="opacity-90">
          {/* Eyepiece / Ocular tube */}
          <rect x="42" y="10" width="16" height="25" fill="#4b5563" />
          <rect x="40" y="5" width="20" height="6" fill="#111827" />
          
          {/* Microscope Arm body */}
          <path d="M 50,35 Q 25,45 35,90" fill="none" stroke="#374151" strokeWidth="10" strokeLinecap="round" />
          
          {/* Revolving Nosepiece & Objective Lenses */}
          <ellipse cx="50" cy="40" rx="12" ry="5" fill="#1f2937" />
          {/* active lens */}
          <rect x="46" y="44" width="8" height="15" fill={mag === "40x" ? "#b45309" : mag === "10x" ? "#1d4ed8" : "#047857"} />
          {/* side lenses */}
          <rect x="36" y="42" width="6" height="10" fill="#9ca3af" transform="rotate(-20 39 42)" />
          <rect x="58" y="42" width="6" height="10" fill="#9ca3af" transform="rotate(20 61 42)" />

          {/* Mechanical Stage */}
          <rect x="25" y="70" width="50" height="5" rx="1" fill="#111827" />
          {/* Stage height visual adjuster */}
          <line x1="50" y1="70" x2="50" y2="90" stroke="#4b5563" strokeWidth="2" />

          {/* Focus knobs on arm */}
          {/* Coarse knob */}
          <circle cx="34" cy="78" r="7" fill="#4b5563" stroke="#1f2937" strokeWidth="1" />
          <circle cx="34" cy="78" r="4" fill="#111827" />
          {/* Fine knob */}
          <circle cx="34" cy="78" r="2.5" fill="#9ca3af" />

          {/* Base */}
          <path d="M 25,100 L 75,100 L 80,110 L 20,110 Z" fill="#111827" />
          {/* Illuminator bulb */}
          <circle cx="50" cy="95" r="4.5" fill={reactionRun ? "#f59e0b" : "#4b5563"} />
        </svg>
        <span className="text-[9px] mt-2 block font-bold text-[var(--ds-accent)] uppercase">
          LENS ACTIVE: {mag} ({mag === "4x" ? "40x" : mag === "10x" ? "100x" : "400x"} magnification)
        </span>
        <div className="flex gap-2 mt-1 text-[8px] text-[var(--ds-fg-subtle)]">
          <span>Coarse Height: {coarse}%</span>
          <span>Fine: {fine}%</span>
        </div>
      </div>

      {/* Right: Microscope circular eyepiece viewer */}
      <div className="relative flex items-center justify-center">
        {/* Eyepiece viewport circle */}
        <div className="w-[170px] h-[170px] rounded-full border-4 border-[#1e293b] bg-black shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] overflow-hidden relative flex items-center justify-center">
          {reactionRun ? (
            <svg
              viewBox="0 0 320 320"
              className="w-full h-full block"
              style={{
                filter: `blur(${blur}px)`,
                transition: "filter 0.2s ease-out",
                // Staining tone highlights
                background:
                  slideType === "onion"
                    ? "radial-gradient(circle, rgba(253,230,138,0.7) 30%, rgba(217,119,6,0.3) 100%)" // Iodine yellow-orange tint
                    : slideType === "stomata"
                    ? "radial-gradient(circle, rgba(209,250,229,0.7) 30%, rgba(16,185,129,0.2) 100%)"  // Plant leaf green-blue tint
                    : "radial-gradient(circle, rgba(219,234,254,0.6) 30%, rgba(59,130,246,0.25) 100%)"  // Cheek cell blue tint
              }}
            >
              {renderSlideContent()}
            </svg>
          ) : (
            <div className="text-center p-3 text-[var(--ds-fg-muted)] text-[9px]">
              🔦 Light source turned off.<br />Click &apos;Observe specimen&apos; button to switch on illuminator.
            </div>
          )}

          {/* Eyepiece crosshairs indicator */}
          <div className="absolute inset-0 pointer-events-none border border-white/5 flex items-center justify-center">
            <div className="w-full h-[1px] bg-white/10 absolute" />
            <div className="h-full w-[1px] bg-white/10 absolute" />
            <div className="w-6 h-6 rounded-full border border-white/15" />
          </div>
        </div>

        {/* Focus Resolution Badge */}
        {reactionRun && (
          <div
            className={`absolute bottom-2 bg-black/80 px-2 py-0.5 border rounded text-[8px] font-bold ${
              focusScore > 90
                ? "text-[#39ff14] border-[#10b981]"
                : focusScore > 50
                ? "text-yellow-400 border-yellow-500/50"
                : "text-red-400 border-red-500/50"
            }`}
          >
            FOCUS MATCH: {focusScore}% {focusScore > 90 && "✓"}
          </div>
        )}
      </div>
    </div>
  );
}
