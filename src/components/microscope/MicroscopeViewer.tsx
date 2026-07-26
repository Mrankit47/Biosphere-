'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MicroscopeSlide, MicroscopeState, MeasurementCaliper, AnnotationPin } from '@/microscope-engine/types';
import { drawMicroscopeViewport, calculateScaleBar, calculateEffectiveMagnification } from '@/microscope-engine/renderer';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCw, Eye, EyeOff, Compass, RefreshCw } from 'lucide-react';

interface MicroscopeViewerProps {
  slide: MicroscopeSlide;
  state: MicroscopeState;
  onStateChange: (updater: (prev: MicroscopeState) => MicroscopeState) => void;
  caliper: MeasurementCaliper | null;
  onCaliperChange: (caliper: MeasurementCaliper | null) => void;
  annotations: AnnotationPin[];
  onSelectStructure: (structureId: string | null) => void;
}

export const MicroscopeViewer: React.FC<MicroscopeViewerProps> = ({
  slide,
  state,
  onStateChange,
  caliper,
  onCaliperChange,
  annotations,
  onSelectStructure
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle Resize & Canvas Redraw
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    drawMicroscopeViewport(ctx, width, height, slide, state, caliper, annotations);
  }, [slide, state, caliper, annotations]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      renderCanvas();
    };

    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [renderCanvas]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Stage Drag Panning Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (state.activeTool === 'measure') {
      onCaliperChange({
        active: true,
        startX: x,
        startY: y,
        endX: x,
        endY: y,
        distanceMicrons: 0
      });
      return;
    }

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (state.activeTool === 'measure' && caliper && caliper.active) {
      const rect = canvas.getBoundingClientRect();
      onCaliperChange({
        ...caliper,
        endX: e.clientX - rect.left,
        endY: e.clientY - rect.top
      });
      return;
    }

    if (!isDragging) return;

    const deltaX = (e.clientX - dragStart.x) * 0.2;
    const deltaY = (e.clientY - dragStart.y) * 0.2;

    onStateChange((prev) => ({
      ...prev,
      stageX: Math.max(-100, Math.min(100, prev.stageX + deltaX)),
      stageY: Math.max(-100, Math.min(100, prev.stageY + deltaY))
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel Digital Zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.15 : -0.15;
    onStateChange((prev) => ({
      ...prev,
      digitalZoom: Math.max(1.0, Math.min(4.0, prev.digitalZoom + zoomDelta))
    }));
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const effectiveMag = calculateEffectiveMagnification(state.objective, state.digitalZoom);
  const scaleBar = calculateScaleBar(state.objective, state.digitalZoom, canvasRef.current?.width || 800);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[520px] lg:h-[620px] bg-slate-950 rounded-2xl border border-emerald-500/20 overflow-hidden shadow-2xl flex flex-col justify-between ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen rounded-none' : ''
      }`}
    >
      {/* Top Overlay Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 pointer-events-auto">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              {slide.title}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                {slide.stainType}
              </span>
            </h3>
            <p className="text-xs text-slate-400 italic">{slide.scientificName}</p>
          </div>
        </div>

        {/* Action Quick Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => onStateChange((prev) => ({ ...prev, showLabels: !prev.showLabels }))}
            className={`p-2 rounded-lg border transition-all ${
              state.showLabels
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Labels"
          >
            {state.showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() =>
              onStateChange((prev) => ({
                ...prev,
                stageX: 0,
                stageY: 0,
                rotation: 0,
                coarseFocus: 50,
                fineFocus: 50,
                digitalZoom: 1.0,
                selectedStructureId: null
              }))
            }
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all"
            title="Reset Stage & Focus"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Bottom Overlay Telemetry & Scale Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-end pointer-events-none">
        {/* Effective Magnification Indicator */}
        <div className="bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 flex items-center gap-4 text-xs font-mono text-slate-300 pointer-events-auto">
          <div>
            <span className="text-slate-500 uppercase block text-[10px]">Objective</span>
            <span className="font-bold text-emerald-400 text-sm">{state.objective}</span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <span className="text-slate-500 uppercase block text-[10px]">Digital</span>
            <span className="font-bold text-slate-200 text-sm">{state.digitalZoom.toFixed(1)}x</span>
          </div>
          <div className="w-px h-6 bg-slate-800" />
          <div>
            <span className="text-slate-500 uppercase block text-[10px]">Total Mag</span>
            <span className="font-bold text-amber-400 text-sm">{effectiveMag}x</span>
          </div>
        </div>

        {/* Scale Bar Indicator */}
        <div className="bg-slate-900/85 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 flex flex-col items-center pointer-events-auto">
          <div
            className="h-1.5 bg-emerald-400 rounded-full mb-1 shadow-[0_0_8px_rgba(52,211,153,0.8)] transition-all"
            style={{ width: `${Math.min(180, scaleBar.widthPx)}px` }}
          />
          <span className="text-[11px] font-mono font-bold text-emerald-300">{scaleBar.label}</span>
        </div>
      </div>
    </div>
  );
};
