'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useDigitalHumanEngine } from './DigitalHumanContext'
import { HUMAN_ANATOMY_OBJECTS } from '@/knowledge/objects/humanAnatomy'

export function ComparisonPanel() {
  const { state, closeComparison, openComparison } = useDigitalHumanEngine()
  const { comparison } = state
  const { organA, organB, isActive } = comparison

  if (!isActive) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚖️</span>
            <div>
              <h2 className="text-lg font-bold text-cyan-300">Anatomical Specimen Comparison Matrix</h2>
              <p className="text-xs text-slate-400">Side-by-side comparative physiology & telemetry</p>
            </div>
          </div>
          <button
            onClick={closeComparison}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            ✕ Close
          </button>
        </div>

        {/* Organ Selector Dropdowns */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
            <label className="text-xs font-semibold text-cyan-400 block mb-1">Specimen A</label>
            <select
              value={organA?.id || ''}
              onChange={(e) => openComparison(e.target.value, organB?.id)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              {HUMAN_ANATOMY_OBJECTS.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.name} ({obj.subcategory})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
            <label className="text-xs font-semibold text-cyan-400 block mb-1">Specimen B</label>
            <select
              value={organB?.id || ''}
              onChange={(e) => openComparison(organA?.id, e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              {HUMAN_ANATOMY_OBJECTS.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.name} ({obj.subcategory})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparative Side-by-Side Table */}
        <div className="grid grid-cols-2 gap-6">
          {/* Specimen A Card */}
          {organA ? (
            <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: organA.accentColor }} />
                <div>
                  <h3 className="text-base font-bold text-white">{organA.name}</h3>
                  <p className="text-xs text-slate-400 italic">{organA.scientificName || organA.subcategory}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">System:</span>
                <p className="text-xs font-medium text-cyan-300">{organA.subcategory}</p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Primary Function:</span>
                <p className="text-xs text-slate-300 mt-0.5">{organA.summary}</p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Clinical Significance:</span>
                <p className="text-xs text-slate-300 mt-0.5">{organA.clinicalImportance || 'Essential organ'}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 text-xs">Select Specimen A</div>
          )}

          {/* Specimen B Card */}
          {organB ? (
            <div className="bg-slate-800/50 border border-slate-700/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: organB.accentColor }} />
                <div>
                  <h3 className="text-base font-bold text-white">{organB.name}</h3>
                  <p className="text-xs text-slate-400 italic">{organB.scientificName || organB.subcategory}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">System:</span>
                <p className="text-xs font-medium text-cyan-300">{organB.subcategory}</p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Primary Function:</span>
                <p className="text-xs text-slate-300 mt-0.5">{organB.summary}</p>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Clinical Significance:</span>
                <p className="text-xs text-slate-300 mt-0.5">{organB.clinicalImportance || 'Essential organ'}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 text-xs">Select Specimen B</div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
