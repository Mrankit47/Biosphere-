"use client";

import React, { useMemo } from "react";

interface ProteinProps {
  timeline: number;
  controls: Record<string, any>;
}

export default function ProteinSynthesisVisual({ timeline, controls }: ProteinProps) {
  const isRicin = controls.inhibitorActive === true;

  // Transcription bubble X offset (moves right from X=30 to X=170 during timeline 0-35)
  const transcriptX = useMemo(() => {
    return Math.min(170, 30 + (Math.min(35, timeline) / 35) * 140);
  }, [timeline]);

  return (
    <svg className="w-full h-full min-h-[220px] max-h-[260px] bg-black/40 rounded-lg p-2" viewBox="0 0 200 200">
      {/* ── ZONE 1: NUCLEUS (TRANSCRIPTION, 0 to 35%) ── */}
      <rect x="5" y="5" width="190" height="75" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" />
      <text x="12" y="18" fill="rgba(255,255,255,0.3)" fontSize="5" fontFamily="monospace">NUCLEUS ZONE</text>

      {/* DNA double-stranded track */}
      <path d="M 15 35 Q 40 25 100 35 T 185 35" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <path d="M 15 45 Q 40 55 100 45 T 185 45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

      {/* RNA Polymerase bubble */}
      {timeline <= 35 && (
        <g>
          {/* Polymerase box */}
          <rect x={transcriptX - 15} y="25" width="30" height="30" rx="4" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="1" />
          <text x={transcriptX - 12} y="21" fill="#ef4444" fontSize="4" fontWeight="bold">RNA POLYMERASE</text>
          
          {/* Growing mRNA transcript (single green line) */}
          <path d={`M 30 55 L ${transcriptX} 55`} fill="none" stroke="#10b981" strokeWidth="2" />
          <circle cx={transcriptX} cy="55" r="1.5" fill="#10b981" />
        </g>
      )}

      {/* Translocation (t=35 to 60): mRNA moves from nucleus to ribosome */}
      {timeline > 35 && timeline < 60 && (
        <g>
          <path d="M 100 55 C 100 70 80 120 100 135" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="100" cy="115" r="2.5" fill="#10b981" className="animate-bounce" />
          <text x="75" y="85" fill="#10b981" fontSize="4.5">TRANSLOCATING mRNA</text>
        </g>
      )}

      {/* ── ZONE 2: CYTOPLASM (TRANSLATION, >= 50%) ── */}
      {timeline >= 50 && (
        <g>
          <text x="12" y="98" fill="rgba(255,255,255,0.3)" fontSize="5" fontFamily="monospace">CYTOPLASM (TRANSLATION)</text>
          
          {/* Ribbon mRNA chain loaded in Ribosome */}
          <path d="M 20 140 L 180 140" fill="none" stroke="#10b981" strokeWidth="2.5" />
          {/* Codons splits */}
          {[40, 60, 80, 100, 120, 140, 160].map((x) => (
            <line key={x} x1={x} y1="138" x2={x} y2="142" stroke="#047857" strokeWidth="1" />
          ))}

          {/* Ribosome Structure (P, A, E sites) */}
          {/* Large Subunit (top dome) */}
          <path d="M 70 138 C 70 105 130 105 130 138 Z" fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="1.2" />
          {/* Small Subunit (bottom cap) */}
          <rect x="70" y="142" width="60" height="12" rx="3" fill="rgba(168,85,247,0.3)" stroke="#a855f7" strokeWidth="1" />
          <text x="82" y="151" fill="#c084fc" fontSize="4.5" fontWeight="bold">RIBOSOME SUBUNIT</text>

          {/* Inhibitor Ricin Toxin Alert */}
          {isRicin && (
            <g>
              <rect x="68" y="105" width="64" height="52" fill="rgba(220,38,38,0.2)" stroke="#dc2626" strokeWidth="1.5" />
              <text x="74" y="128" fill="#f87171" fontSize="5" fontWeight="bold" className="animate-pulse">⚠️ RIBOSOME INHIBITED</text>
            </g>
          )}

          {/* tRNA delivery action (t >= 60) */}
          {timeline >= 60 && !isRicin && (
            <g>
              {/* tRNA 1 in P pocket (at X=90) */}
              <g transform="translate(90, 115)">
                {/* tRNA visual adapter */}
                <path d="M -5 -5 L 5 -5 L 5 20 L -5 20 Z" fill="rgba(59,130,246,0.3)" stroke="#3b82f6" />
                <text x="-4" y="10" fill="#3b82f6" fontSize="4" fontFamily="monospace">tRNA</text>
                {/* Amino acid peptide circle */}
                <circle cx="0" cy="-12" r="5" fill="#f43f5e" />
                <text x="-2" y="-10" fill="#fff" fontSize="5">Met</text>
              </g>

              {/* tRNA 2 in A pocket (at X=110) arriving */}
              {timeline >= 75 && (
                <g transform="translate(110, 115)">
                  <path d="M -5 -5 L 5 -5 L 5 20 L -5 20 Z" fill="rgba(59,130,246,0.3)" stroke="#3b82f6" />
                  <circle cx="0" cy="-12" r="5" fill="#eab308" />
                  <text x="-2" y="-10" fill="#fff" fontSize="5">Leu</text>
                </g>
              )}

              {/* Peptide bond line joining them (t >= 85) */}
              {timeline >= 85 && (
                <line x1="90" y1="103" x2="110" y2="103" stroke="#f43f5e" strokeWidth="2" strokeDasharray="1 1" />
              )}
            </g>
          )}
        </g>
      )}
    </svg>
  );
}
