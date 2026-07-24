'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useDigitalHumanEngine } from './DigitalHumanContext'

export function OrganInformationPanel() {
  const { activeOrganObject, setSelectedOrganId, openComparison, setIsAiSidebarOpen } = useDigitalHumanEngine()
  const [activeTab, setActiveTab] = useState<'overview' | 'pathology' | 'simulations' | 'quiz'>('overview')

  if (!activeOrganObject) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-2xl text-center text-slate-400 max-w-md">
        <span className="text-3xl mb-2 block">🫀</span>
        <h4 className="text-sm font-semibold text-slate-200">No Organ Selected</h4>
        <p className="text-xs text-slate-400 mt-1">
          Click any 3D organ or structure in the viewer to view detailed diagnostic telemetry, physiology data, connected diseases, and simulations.
        </p>
      </div>
    )
  }

  const {
    name,
    scientificName,
    subcategory,
    accentColor,
    description,
    summary,
    clinicalImportance,
    relatedDiseaseIds,
    quiz,
    simulationUrl,
    virtualLabUrl,
    relatedTopicIds,
    importantTerms,
  } = activeOrganObject

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-2xl text-white w-full max-w-md max-h-[85vh] overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
            <h3 className="text-lg font-bold tracking-tight text-white">{name}</h3>
          </div>
          {scientificName && <p className="text-xs text-slate-400 italic mt-0.5">{scientificName}</p>}
          <span className="inline-block mt-1.5 text-[10px] font-semibold bg-slate-800 text-cyan-300 px-2 py-0.5 rounded-full border border-slate-700">
            {subcategory}
          </span>
        </div>

        <button
          onClick={() => setSelectedOrganId(null)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 mb-4 gap-2">
        {(['overview', 'pathology', 'simulations', 'quiz'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-2 text-xs font-medium capitalize transition border-b-2 ${
              activeTab === tab
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-4"
          >
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{description}</p>
            </div>

            {importantTerms && importantTerms.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Anatomical Terms</h4>
                <div className="space-y-1.5">
                  {importantTerms.map((t, idx) => (
                    <div key={idx} className="p-2 bg-slate-800/50 rounded-xl border border-slate-800">
                      <span className="text-xs font-bold text-cyan-300">{t.term}: </span>
                      <span className="text-xs text-slate-300">{t.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'pathology' && (
          <motion.div
            key="pathology"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-4"
          >
            <div>
              <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">Clinical Significance</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl">
                {clinicalImportance || 'Essential anatomical structure with critical physiological role.'}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Connected Pathologies</h4>
              <div className="space-y-1.5">
                {relatedDiseaseIds && relatedDiseaseIds.length > 0 ? (
                  relatedDiseaseIds.map((dis, idx) => (
                    <div key={idx} className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center justify-between text-xs">
                      <span className="capitalize text-slate-200 font-medium">{dis.replace('-', ' ')}</span>
                      <Link href="/disease-explorer" className="text-cyan-400 hover:underline text-[10px]">
                        Diagnose →
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No associated pathologies logged.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'simulations' && (
          <motion.div
            key="simulations"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-3"
          >
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Connected Engines</h4>
            {simulationUrl && (
              <Link
                href={simulationUrl}
                className="block p-3 bg-cyan-950/40 border border-cyan-500/50 rounded-xl hover:border-cyan-400 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300">⚡ Process Simulation Engine</span>
                  <span className="text-xs text-cyan-400">Launch →</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Interactive physiology & dynamic cycle simulation</p>
              </Link>
            )}

            {virtualLabUrl && (
              <Link
                href={virtualLabUrl}
                className="block p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl hover:border-emerald-400 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300">🧪 Virtual Laboratory Engine</span>
                  <span className="text-xs text-emerald-400">Enter Lab →</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Experimental medical lab protocols & tissue tests</p>
              </Link>
            )}

            <Link
              href="/research-hub"
              className="block p-3 bg-purple-950/40 border border-purple-500/50 rounded-xl hover:border-purple-400 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300">📚 Biosphere Research Hub</span>
                <span className="text-xs text-purple-400">Read Research →</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Peer-reviewed literature & clinical studies</p>
            </Link>
          </motion.div>
        )}

        {activeTab === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="space-y-3"
          >
            {quiz ? (
              <div>
                <h4 className="text-xs font-bold text-cyan-300 mb-2">{quiz.title}</h4>
                <div className="space-y-2">
                  {quiz.questions.map((q, idx) => (
                    <div key={idx} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                      <p className="text-xs font-semibold text-slate-200 mb-2">{q.text}</p>
                      <div className="space-y-1">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-1.5 rounded-lg text-xs border ${
                              oIdx === q.answerIndex
                                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 font-medium'
                                : 'bg-slate-900/60 border-slate-800 text-slate-400'
                            }`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No quiz module attached to this specimen.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Footer */}
      <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={() => setIsAiSidebarOpen(true)}
          className="flex-1 py-2 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition text-center shadow-lg shadow-cyan-500/20"
        >
          🤖 Ask AI Mentor
        </button>

        <button
          onClick={() => openComparison(name.toLowerCase())}
          className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition border border-slate-700"
        >
          ⚖️ Compare
        </button>
      </div>
    </div>
  )
}
