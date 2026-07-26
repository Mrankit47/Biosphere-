'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MicroscopeSlide, MicroscopeState, MeasurementCaliper, AnnotationPin } from '@/microscope-engine/types';
import { SLIDE_LIBRARY } from '@/microscope-engine/slideRegistry';
import { MicroscopeViewer } from '@/components/microscope/MicroscopeViewer';
import { MicroscopeControlPanel } from '@/components/microscope/MicroscopeControlPanel';
import { SlideLibraryModal } from '@/components/microscope/SlideLibraryModal';
import { ComparisonViewer } from '@/components/microscope/ComparisonViewer';
import { MicroscopeAISidebar } from '@/components/microscope/MicroscopeAISidebar';
import { ObservationNotebook } from '@/components/microscope/ObservationNotebook';
import { AssessmentModal } from '@/components/microscope/AssessmentModal';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  GitCompare,
  Trophy,
  Layers,
  HelpCircle,
  Eye,
  Sliders,
  CheckCircle
} from 'lucide-react';

export default function VirtualMicroscopePage() {
  const [activeSlide, setActiveSlide] = useState<MicroscopeSlide>(SLIDE_LIBRARY[0]);
  const [viewMode, setViewMode] = useState<'single' | 'compare' | 'notebook'>('single');
  const [isSlideLibraryOpen, setIsSlideLibraryOpen] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  const [microscopeState, setMicroscopeState] = useState<MicroscopeState>({
    slideId: SLIDE_LIBRARY[0].id,
    objective: SLIDE_LIBRARY[0].defaultObjective,
    digitalZoom: 1.0,
    coarseFocus: 50,
    fineFocus: 50,
    stageX: 0,
    stageY: 0,
    rotation: 0,
    brightness: 100,
    contrast: 100,
    opticalFilter: 'normal',
    oilImmersionApplied: false,
    showLabels: true,
    showAnnotations: true,
    activeTool: 'navigate',
    isCompareMode: false,
    comparedSlideId: null,
    selectedStructureId: null
  });

  const [caliper, setCaliper] = useState<MeasurementCaliper | null>(null);
  const [annotations, setAnnotations] = useState<AnnotationPin[]>([]);

  const handleSelectSlide = (slide: MicroscopeSlide) => {
    setActiveSlide(slide);
    setMicroscopeState((prev) => ({
      ...prev,
      slideId: slide.id,
      objective: slide.defaultObjective,
      digitalZoom: 1.0,
      coarseFocus: 50,
      fineFocus: 50,
      stageX: 0,
      stageY: 0,
      oilImmersionApplied: false,
      selectedStructureId: null
    }));
  };

  const selectedStructure =
    activeSlide.cellularStructures.find((s) => s.id === microscopeState.selectedStructureId) || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* Background Decorative Grid */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0f172a15_1px,transparent_1px),linear-gradient(to_bottom,#0f172a15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Header Container */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Digital Pathology & Histology
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                Intelligent Virtual Microscope Engine
              </h1>
            </div>
          </div>

          {/* Nav Action Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setIsSlideLibraryOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <Layers className="w-4 h-4" />
              Slide Vault
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'compare' ? 'single' : 'compare')}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                viewMode === 'compare'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              Healthy vs Diseased Mode
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'notebook' ? 'single' : 'notebook')}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                viewMode === 'notebook'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Notebook
            </button>

            <button
              onClick={() => setIsAssessmentOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 hover:border-amber-500/50 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              Lab Quiz
            </button>
          </div>
        </div>
      </header>

      {/* Main App Body */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* VIEW MODE 1: SINGLE MICROSCOPE ENGINE */}
        {viewMode === 'single' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Viewer & Hardware Console */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <MicroscopeViewer
                slide={activeSlide}
                state={microscopeState}
                onStateChange={setMicroscopeState}
                caliper={caliper}
                onCaliperChange={setCaliper}
                annotations={annotations}
                onSelectStructure={(id) =>
                  setMicroscopeState((prev) => ({ ...prev, selectedStructureId: id }))
                }
              />

              <MicroscopeControlPanel
                state={microscopeState}
                onStateChange={setMicroscopeState}
              />
            </div>

            {/* Right 4 Cols: AI Mentor Sidebar & Histology Notes */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <MicroscopeAISidebar
                slide={activeSlide}
                state={microscopeState}
                selectedStructure={selectedStructure}
              />
            </div>
          </div>
        )}

        {/* VIEW MODE 2: HEALTHY VS DISEASED DUAL COMPARE */}
        {viewMode === 'compare' && (
          <ComparisonViewer
            primarySlide={activeSlide}
            state={microscopeState}
            onStateChange={setMicroscopeState}
          />
        )}

        {/* VIEW MODE 3: OBSERVATION NOTEBOOK */}
        {viewMode === 'notebook' && (
          <ObservationNotebook
            slide={activeSlide}
            objective={microscopeState.objective}
            effectiveMagnification={
              microscopeState.objective === '4x'
                ? 40
                : microscopeState.objective === '10x'
                ? 100
                : microscopeState.objective === '40x'
                ? 400
                : 1000
            }
          />
        )}
      </main>

      {/* Slide Library Picker Modal */}
      <SlideLibraryModal
        isOpen={isSlideLibraryOpen}
        onClose={() => setIsSlideLibraryOpen(false)}
        onSelectSlide={handleSelectSlide}
        activeSlideId={activeSlide.id}
      />

      {/* Assessment Quiz Modal */}
      <AssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        onSelectTaskSlide={(slideId) => {
          const target = SLIDE_LIBRARY.find((s) => s.id === slideId);
          if (target) handleSelectSlide(target);
        }}
      />
    </div>
  );
}
