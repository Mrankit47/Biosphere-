'use client'

import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useDigitalHumanEngine } from './DigitalHumanContext'

export function TissueCellModal() {
  const { state, activeOrganObject, setIsTissueCellModalOpen } = useDigitalHumanEngine()
  const { isTissueCellModalOpen, activeLayer } = state

  if (!isTissueCellModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white w-full max-w-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{activeLayer === 'tissue-view' ? '🔬' : '⚛️'}</span>
            <div>
              <h3 className="text-base font-bold text-cyan-300">
                {activeLayer === 'tissue-view' ? 'Microscopic Tissue Histology' : 'Cellular Organelle Infrastructure'}
              </h3>
              <p className="text-xs text-slate-400">
                {activeOrganObject
                  ? `Micro-architecture of ${activeOrganObject.name}`
                  : 'Systemic cellular micro-environment'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTissueCellModalOpen(false)}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-cyan-950/30 border border-cyan-500/40 rounded-2xl">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1">
              Histology & Cellular Bridge
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeOrganObject
                ? `${activeOrganObject.name} tissue is composed of specialized cellular populations operating in homeostatic synchrony. Explore organelle mechanics and genetic expression in Biosphere domain engines.`
                : 'Microscopic inspection links gross anatomical structures with cellular organelles and DNA genetics.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/cell-explorer"
              className="p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-2xl transition group"
            >
              <span className="text-2xl mb-1 block">🔬</span>
              <h5 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">Cell Explorer Engine</h5>
              <p className="text-[10px] text-slate-400 mt-1">3D organelle structure, mitochondria, ribosomes, & membranes</p>
            </Link>

            <Link
              href="/dna-genetics"
              className="p-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-2xl transition group"
            >
              <span className="text-2xl mb-1 block">🧬</span>
              <h5 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">DNA & Genetics Hub</h5>
              <p className="text-[10px] text-slate-400 mt-1">Gene expression, transcription, & molecular genetics</p>
            </Link>
          </div>
        </div>

        <div className="text-right border-t border-slate-800 pt-3">
          <button
            onClick={() => setIsTissueCellModalOpen(false)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition"
          >
            Return to 3D Viewer
          </button>
        </div>
      </motion.div>
    </div>
  )
}
