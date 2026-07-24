'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useDigitalHumanEngine, BODY_SYSTEMS_META } from './DigitalHumanContext'
import type { BodySystemId } from './types'

export function SystemSelector() {
  const { state, setActiveSystem, toggleSystemVisibility, setSystemOpacityValue } = useDigitalHumanEngine()
  const { activeSystem, visibleSystems, systemOpacity } = state

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl text-white w-full max-w-sm">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <span>🧬</span> Body Systems (12)
        </h3>
        <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-800/50">
          Digital Engine
        </span>
      </div>

      <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
        {BODY_SYSTEMS_META.map((sys) => {
          const isActive = activeSystem === sys.id
          const isVisible = visibleSystems[sys.id]
          const opacity = systemOpacity[sys.id] ?? 1.0

          return (
            <motion.div
              key={sys.id}
              whileHover={{ x: 2 }}
              className={`p-2 rounded-xl transition-all border ${
                isActive
                  ? 'bg-cyan-950/50 border-cyan-500/80 shadow-md'
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveSystem(isActive ? null : sys.id)}
                  className="flex items-center gap-2.5 text-left flex-1"
                >
                  <span className="text-base">{sys.icon}</span>
                  <div>
                    <div className="text-xs font-medium text-slate-200">{sys.name}</div>
                    <div className="text-[10px] text-slate-400 italic">{sys.latinName}</div>
                  </div>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSystemVisibility(sys.id)}
                    className={`p-1 rounded-lg text-xs transition ${
                      isVisible ? 'text-cyan-400 bg-cyan-950/60' : 'text-slate-600 bg-slate-800/60'
                    }`}
                    title={isVisible ? 'Hide system' : 'Show system'}
                  >
                    {isVisible ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {isVisible && (
                <div className="mt-2 flex items-center gap-2 px-1 pt-1 border-t border-slate-800/50">
                  <span className="text-[10px] text-slate-400">Opacity:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setSystemOpacityValue(sys.id, parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <span className="text-[10px] font-mono text-cyan-300 min-w-[28px] text-right">
                    {Math.round(opacity * 100)}%
                  </span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
