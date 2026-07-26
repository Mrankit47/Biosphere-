'use client';

import React from 'react';
import { MicroscopeState, ObjectiveLens, OpticalFilter } from '@/microscope-engine/types';
import { Sliders, Sun, Contrast, Filter, Droplet, Move, Compass, Ruler, Pin } from 'lucide-react';

interface MicroscopeControlPanelProps {
  state: MicroscopeState;
  onStateChange: (updater: (prev: MicroscopeState) => MicroscopeState) => void;
}

export const MicroscopeControlPanel: React.FC<MicroscopeControlPanelProps> = ({ state, onStateChange }) => {
  const objectives: Array<{ id: ObjectiveLens; label: string; desc: string; color: string }> = [
    { id: '4x', label: '4×', desc: 'Scanning (40x)', color: 'border-red-500/40 text-red-400' },
    { id: '10x', label: '10×', desc: 'Low Power (100x)', color: 'border-yellow-500/40 text-yellow-400' },
    { id: '40x', label: '40×', desc: 'High Power (400x)', color: 'border-blue-500/40 text-blue-400' },
    { id: '100x', label: '100×', desc: 'Oil Immersion (1000x)', color: 'border-emerald-500/40 text-emerald-400' }
  ];

  const opticalFilters: Array<{ id: OpticalFilter; label: string; icon: string }> = [
    { id: 'normal', label: 'Brightfield', icon: '☀️' },
    { id: 'he_stain', label: 'H&E Contrast', icon: '🌸' },
    { id: 'fluorescent', label: 'GFP Fluorescent', icon: '🧪' },
    { id: 'darkfield', label: 'Darkfield', icon: '🌙' },
    { id: 'phase_contrast', label: 'Phase Contrast', icon: '🔍' },
    { id: 'polarized', label: 'Polarized', icon: '💎' }
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          Microscope Controls
        </h3>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
          Hardware Console
        </span>
      </div>

      {/* 1. Objective Lens Turret Switcher */}
      <div>
        <label className="text-xs font-semibold text-slate-300 block mb-2 flex items-center justify-between">
          <span>Objective Turret</span>
          {state.objective === '100x' && (
            <button
              onClick={() =>
                onStateChange((prev) => ({ ...prev, oilImmersionApplied: !prev.oilImmersionApplied }))
              }
              className={`text-[10px] px-2 py-0.5 rounded-md border flex items-center gap-1 font-mono transition-all ${
                state.oilImmersionApplied
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse'
              }`}
            >
              <Droplet className="w-3 h-3" />
              {state.oilImmersionApplied ? 'Oil Applied' : 'Apply Oil'}
            </button>
          )}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {objectives.map((obj) => (
            <button
              key={obj.id}
              onClick={() =>
                onStateChange((prev) => ({
                  ...prev,
                  objective: obj.id,
                  oilImmersionApplied: obj.id === '100x' ? prev.oilImmersionApplied : false
                }))
              }
              className={`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                state.objective === obj.id
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="text-base font-extrabold font-mono">{obj.label}</span>
              <span className="text-[9px] text-slate-400 font-sans mt-0.5">{obj.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Coarse & Fine Focus Controls */}
      <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-slate-300">Coarse Focus</span>
            <span className="text-xs font-mono text-emerald-400">{state.coarseFocus}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={state.coarseFocus}
            onChange={(e) =>
              onStateChange((prev) => ({ ...prev, coarseFocus: Number(e.target.value) }))
            }
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-slate-300">Fine Focus</span>
            <span className="text-xs font-mono text-emerald-400">{state.fineFocus}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={state.fineFocus}
            onChange={(e) =>
              onStateChange((prev) => ({ ...prev, fineFocus: Number(e.target.value) }))
            }
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>
      </div>

      {/* 3. Stage Movement & Rotation */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Move className="w-3.5 h-3.5 text-emerald-400" />
            Stage Movement (X / Y)
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            X:{Math.round(state.stageX)} Y:{Math.round(state.stageY)}
          </span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Stage X (Lateral)</span>
            <input
              type="range"
              min="-100"
              max="100"
              value={state.stageX}
              onChange={(e) =>
                onStateChange((prev) => ({ ...prev, stageX: Number(e.target.value) }))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Stage Y (Vertical)</span>
            <input
              type="range"
              min="-100"
              max="100"
              value={state.stageY}
              onChange={(e) =>
                onStateChange((prev) => ({ ...prev, stageY: Number(e.target.value) }))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* 4. Illumination, Contrast & Optical Filters */}
      <div className="flex flex-col gap-3 border-t border-slate-800/80 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              LED Light
            </label>
            <input
              type="range"
              min="50"
              max="150"
              value={state.brightness}
              onChange={(e) =>
                onStateChange((prev) => ({ ...prev, brightness: Number(e.target.value) }))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Contrast className="w-3.5 h-3.5 text-purple-400" />
              Contrast
            </label>
            <input
              type="range"
              min="50"
              max="150"
              value={state.contrast}
              onChange={(e) =>
                onStateChange((prev) => ({ ...prev, contrast: Number(e.target.value) }))
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>
        </div>

        {/* Optical Filters Picker */}
        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            Optical Filters
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {opticalFilters.map((flt) => (
              <button
                key={flt.id}
                onClick={() =>
                  onStateChange((prev) => ({ ...prev, opticalFilter: flt.id }))
                }
                className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 transition-all ${
                  state.opticalFilter === flt.id
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{flt.icon}</span>
                <span className="truncate">{flt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Tool Selection */}
      <div className="border-t border-slate-800/80 pt-4">
        <label className="text-xs font-semibold text-slate-300 block mb-2">Interactive Tool Mode</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onStateChange((prev) => ({ ...prev, activeTool: 'navigate' }))}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              state.activeTool === 'navigate'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            Pan / Stage
          </button>

          <button
            onClick={() => onStateChange((prev) => ({ ...prev, activeTool: 'measure' }))}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              state.activeTool === 'measure'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            Caliper µm
          </button>

          <button
            onClick={() => onStateChange((prev) => ({ ...prev, activeTool: 'annotate' }))}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              state.activeTool === 'annotate'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Pin className="w-3.5 h-3.5" />
            Annotate
          </button>
        </div>
      </div>
    </div>
  );
};
