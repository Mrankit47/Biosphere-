'use client';

import React, { useState } from 'react';
import { MicroscopeSlide, MicroscopeState } from '@/microscope-engine/types';
import { SLIDE_LIBRARY } from '@/microscope-engine/slideRegistry';
import { MicroscopeViewer } from './MicroscopeViewer';
import { GitCompare, ExternalLink, ArrowRightLeft, Sparkles, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface ComparisonViewerProps {
  primarySlide: MicroscopeSlide;
  state: MicroscopeState;
  onStateChange: (updater: (prev: MicroscopeState) => MicroscopeState) => void;
}

export const ComparisonViewer: React.FC<ComparisonViewerProps> = ({
  primarySlide,
  state,
  onStateChange
}) => {
  // Find paired diseased or healthy slide
  const pairedSlide = SLIDE_LIBRARY.find((s) => s.id === primarySlide.diseasedPairId) || SLIDE_LIBRARY[1];
  const [secondarySlide, setSecondarySlide] = useState<MicroscopeSlide>(pairedSlide);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-2xl flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <GitCompare className="w-3.5 h-3.5" />
            Dual-Viewport Pathology Comparison Mode
          </span>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            Side-by-Side Histology & Tissue Analysis
          </h2>
        </div>

        {primarySlide.diseaseExplorerPath && (
          <Link
            href={primarySlide.diseaseExplorerPath}
            className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-2 transition-all self-start md:self-auto"
          >
            <span>Open in Disease Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Dual Split Screen Viewports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Primary Viewport */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Primary Specimen ({primarySlide.specimenType.toUpperCase()})
            </span>
            <span className="text-xs text-slate-400">{primarySlide.title}</span>
          </div>

          <MicroscopeViewer
            slide={primarySlide}
            state={state}
            onStateChange={onStateChange}
            caliper={null}
            onCaliperChange={() => {}}
            annotations={[]}
            onSelectStructure={() => {}}
          />
        </div>

        {/* Right Comparison Viewport */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Comparison Specimen ({secondarySlide.specimenType.toUpperCase()})
            </span>
            <span className="text-xs text-slate-400">{secondarySlide.title}</span>
          </div>

          <MicroscopeViewer
            slide={secondarySlide}
            state={state}
            onStateChange={onStateChange}
            caliper={null}
            onCaliperChange={() => {}}
            annotations={[]}
            onSelectStructure={() => {}}
          />
        </div>
      </div>

      {/* Structural Differences Analysis Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row gap-5 items-start">
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-bold text-slate-100 mb-1 flex items-center gap-2">
            Pathological Difference Breakdown
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {primarySlide.diseaseNotes ||
              'Comparing healthy tissue architecture against pathological alterations. Observe loss of cellular boundary integrity, structural degeneration, and abnormal organelle distribution.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1">
                HEALTHY HISTOLOGY
              </span>
              <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                {primarySlide.histologyDetails.keyIdentificationFeatures.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-amber-400 font-bold block mb-1">
                PATHOLOGICAL ALTERATIONS
              </span>
              <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                {secondarySlide.histologyDetails.keyIdentificationFeatures.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
