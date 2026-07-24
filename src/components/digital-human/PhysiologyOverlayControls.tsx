'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useDigitalHumanEngine } from './DigitalHumanContext'
import type { PhysiologyOverlay } from './types'

const OVERLAYS_META: { id: PhysiologyOverlay; name: string; icon: string; color: string }[] = [
  { id: 'blood-flow', name: 'Blood Flow', icon: '🩸', color: '#ef4444' },
  { id: 'neural-signals', name: 'Neural Signals', icon: '⚡', color: '#e879f9' },
  { id: 'lymph-flow', name: 'Lymph Flow', icon: '💧', color: '#38bdf8' },
  { id: 'hormone-flow', name: 'Hormone Transport', icon: '🧪', color: '#a855f7' },
  { id: 'respiration', name: 'Respiration Cycle', icon: '🌬️', color: '#f472b6' },
  { id: 'digestion', name: 'Peristalsis & Motility', icon: '🔄', color: '#10b981' },
  { id: 'temperature-reg', name: 'Thermal Gradient', icon: '🌡️', color: '#f59e0b' },
]

export function PhysiologyOverlayControls() {
  const { state, togglePhysiologyOverlay } = useDigitalHumanEngine()
  const { activeOverlays } = state

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 shadow-2xl text-white">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1 flex items-center justify-between">
        <span>Physiology Flow Overlays (7)</span>
        <span className="text-cyan-400 font-mono text-[10px]">
          {Object.values(activeOverlays).filter(Boolean).length} Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {OVERLAYS_META.map((ov) => {
          const isActive = activeOverlays[ov.id]
          return (
            <motion.button
              key={ov.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => togglePhysiologyOverlay(ov.id)}
              className={`p-2 rounded-xl text-left flex items-center gap-2 transition border ${
                isActive
                  ? 'bg-slate-800 border-cyan-400 shadow-md'
                  : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <span className="text-base">{ov.icon}</span>
              <div>
                <div
                  className="text-xs font-semibold"
                  style={{ color: isActive ? ov.color : undefined }}
                >
                  {ov.name}
                </div>
                <div className="text-[9px] text-slate-500 font-mono">
                  {isActive ? '● VISUALIZING' : '○ OFF'}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
