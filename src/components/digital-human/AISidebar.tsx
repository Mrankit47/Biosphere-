'use client'

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDigitalHumanEngine, BODY_SYSTEMS_META } from './DigitalHumanContext'
import { useMentor } from '@/components/ui/navigation'

export function AISidebar() {
  const { state, activeOrganObject, setIsAiSidebarOpen } = useDigitalHumanEngine()
  const { isAiSidebarOpen, activeSystem, activeLayer, selectedOrganId, renderMode } = state
  const { setSidebarOpen, setPageContext } = useMentor()

  const systemMeta = useMemo(() => {
    return BODY_SYSTEMS_META.find((s) => s.id === activeSystem) || null
  }, [activeSystem])

  const generatedExplanation = useMemo(() => {
    if (activeOrganObject) {
      return `Target Specimen: ${activeOrganObject.name} (${activeOrganObject.scientificName || activeOrganObject.subcategory}). ${activeOrganObject.summary} Clinical relevance: ${activeOrganObject.clinicalImportance || 'Essential anatomical structure.'}`
    }
    if (systemMeta) {
      return `Active System: ${systemMeta.name} (${systemMeta.latinName}). ${systemMeta.description}`
    }
    return `Exploring Whole Body anatomical model in ${renderMode.toUpperCase()} mode under ${activeLayer.toUpperCase()} view.`
  }, [activeOrganObject, systemMeta, activeLayer, renderMode])

  if (!isAiSidebarOpen) return null

  const handleOpenGlobalMentor = () => {
    setPageContext({
      page: 'human-body',
      selectedOrgan: selectedOrganId || undefined,
    })
    setSidebarOpen(true)
    setIsAiSidebarOpen(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed right-4 top-20 z-50 w-full max-w-sm bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl p-5 shadow-2xl text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <div>
              <h3 className="text-sm font-bold text-cyan-300">AI Biology Mentor</h3>
              <p className="text-[10px] text-slate-400">Contextual Medical Explainer</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiSidebarOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Current Learner Context Metadata Badge */}
        <div className="bg-cyan-950/40 border border-cyan-800/60 rounded-xl p-3 mb-4 space-y-1">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">Active Exploration Context</div>
          <div className="text-xs text-slate-200 flex flex-wrap gap-1.5 pt-1">
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">
              System: <strong className="text-cyan-300">{activeSystem || 'All'}</strong>
            </span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px]">
              Layer: <strong className="text-cyan-300">{activeLayer}</strong>
            </span>
            {selectedOrganId && (
              <span className="bg-cyan-900/80 px-2 py-0.5 rounded text-[10px] text-cyan-200">
                Organ: <strong>{selectedOrganId}</strong>
              </span>
            )}
          </div>
        </div>

        {/* AI Realtime Explanation */}
        <div className="space-y-3 mb-5">
          <div className="text-xs font-semibold text-slate-300">Automated Clinical Analysis:</div>
          <div className="p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 leading-relaxed shadow-inner">
            {generatedExplanation}
          </div>
        </div>

        {/* Action Button: Connect to Global AI Mentor */}
        <button
          onClick={handleOpenGlobalMentor}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition text-center shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
        >
          <span>💬</span> Open Interactive AI Chat
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
