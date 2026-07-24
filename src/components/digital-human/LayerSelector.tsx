'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useDigitalHumanEngine } from './DigitalHumanContext'
import type { ExplorationLayer } from './types'

const LAYERS_CONFIG: { id: ExplorationLayer; label: string; icon: string; desc: string }[] = [
  { id: 'whole-body', label: 'Whole Body', icon: '🧍', desc: 'Complete 3D human assembly' },
  { id: 'system-view', label: 'System View', icon: '🧬', desc: 'Isolate anatomical body system' },
  { id: 'organ-view', label: 'Organ View', icon: '🫀', desc: 'Focus target visceral organ' },
  { id: 'tissue-view', label: 'Tissue View', icon: '🔬', desc: 'Histology micro-structure' },
  { id: 'cell-view', label: 'Cell View', icon: '⚛️', desc: 'Cellular organelles link' },
  { id: 'cross-section', label: 'Cross Section', icon: '🔪', desc: '3D clipping slice plane' },
  { id: 'exploded-view', label: 'Exploded View', icon: '💥', desc: 'Radial component separation' },
  { id: 'transparent-mode', label: 'Transparent', icon: '💎', desc: 'Glassmorphic translucency' },
  { id: 'isolation-mode', label: 'Isolation', icon: '🎯', desc: 'Dim non-focused structures' },
]

export function LayerSelector() {
  const { state, setActiveLayer, setExplodeLevel, setClippingPosition, setRenderMode } = useDigitalHumanEngine()
  const { activeLayer, explodeLevel, clippingPosition, renderMode } = state

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 shadow-2xl text-white">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center justify-between">
        <span>Exploration Layer</span>
        <span className="text-cyan-400 font-mono">{activeLayer}</span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-9">
        {LAYERS_CONFIG.map((layer) => {
          const isActive = activeLayer === layer.id
          return (
            <motion.button
              key={layer.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveLayer(layer.id)}
              className={`p-2 rounded-xl text-center flex flex-col items-center justify-center transition border ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20 font-bold'
                  : 'bg-slate-800/50 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white'
              }`}
              title={layer.desc}
            >
              <span className="text-base mb-0.5">{layer.icon}</span>
              <span className="text-[10px] whitespace-nowrap leading-tight">{layer.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Layer-specific Sub-controls */}
      {activeLayer === 'exploded-view' && (
        <div className="mt-3 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center gap-3">
          <span className="text-xs text-cyan-300 font-medium whitespace-nowrap">💥 Explode Factor:</span>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={explodeLevel}
            onChange={(e) => setExplodeLevel(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-xs font-mono text-cyan-400 min-w-[36px]">{explodeLevel.toFixed(1)}x</span>
        </div>
      )}

      {activeLayer === 'cross-section' && (
        <div className="mt-3 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center gap-3">
          <span className="text-xs text-cyan-300 font-medium whitespace-nowrap">🔪 Cut Offset:</span>
          <input
            type="range"
            min="-5"
            max="12"
            step="0.2"
            value={clippingPosition}
            onChange={(e) => setClippingPosition(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-xs font-mono text-cyan-400 min-w-[36px]">{clippingPosition.toFixed(1)}m</span>
        </div>
      )}

      {activeLayer === 'transparent-mode' && (
        <div className="mt-3 p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center justify-between gap-2">
          <span className="text-xs text-cyan-300 font-medium">Shader Render Mode:</span>
          <div className="flex gap-1.5">
            {(['realistic', 'xray', 'hologram'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setRenderMode(mode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase transition ${
                  renderMode === mode
                    ? 'bg-cyan-400 text-slate-950 shadow'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
