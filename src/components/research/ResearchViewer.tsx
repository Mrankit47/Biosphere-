'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Sparkles,
  Image as ImageIcon,
  Table as TableIcon,
  Bookmark,
} from 'lucide-react'
import { ResearchPaper } from '@/research-objects/types'
import { researchRegistry } from '@/research-objects/registry'
import { referenceManager } from '@/citation-service/referenceManager'
import { PillBadge, GlowButton, TabBar } from '@/components/ds'

interface ResearchViewerProps {
  paper: ResearchPaper | null
  onClose: () => void
  onOpenAIMentor?: (paper: ResearchPaper) => void
}

export const ResearchViewer: React.FC<ResearchViewerProps> = ({
  paper,
  onClose,
  onOpenAIMentor,
}) => {
  const [activeTab, setActiveTab] = useState<'simplified' | 'scientific' | 'figures' | 'citations' | 'knowledge'>('simplified')
  const [copiedCite, setCopiedCite] = useState(false)

  if (!paper) return null

  const field = researchRegistry.getField(paper.fieldId)
  const journal = paper.journalId ? researchRegistry.getJournal(paper.journalId) : undefined
  const authors = paper.authorIds
    .map((id) => researchRegistry.getScientist(id))
    .filter(Boolean)

  const isBookmarked = referenceManager.isBookmarked(paper.id)

  const handleCopyBibtex = () => {
    const bibtex = referenceManager.exportBibTeX(paper)
    navigator.clipboard.writeText(bibtex)
    setCopiedCite(true)
    setTimeout(() => setCopiedCite(false), 2000)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        >
          {/* Top Bar */}
          <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/90">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <PillBadge color="#06b6d4">{field?.name || paper.fieldId}</PillBadge>
                {journal && (
                  <span className="text-xs font-mono text-cyan-300 bg-cyan-950/40 px-2.5 py-0.5 rounded-full border border-cyan-800/50">
                    {journal.name} ({paper.year})
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">DOI: {paper.doi}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 leading-snug">{paper.title}</h2>
              <p className="text-xs text-slate-400 mt-1">
                By{' '}
                <span className="text-slate-200 font-medium">
                  {authors.length > 0
                    ? authors.map((a) => a?.name).join(', ')
                    : 'Research Authors'}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  referenceManager.toggleBookmark(paper.id)
                }}
                className={`p-2 rounded-lg border transition-colors ${
                  isBookmarked
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Bookmark Paper"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-5 border-b border-slate-800 bg-slate-950/40">
            <TabBar
              options={[
                { id: 'simplified', label: 'Simplified View' },
                { id: 'scientific', label: 'Scientific Depth' },
                { id: 'figures', label: `Figures & Tables (${paper.figures.length + paper.tables.length})` },
                { id: 'citations', label: `Citations (${paper.citationCount})` },
                { id: 'knowledge', label: 'Knowledge Graph' },
              ]}
              activeTab={activeTab}
              onChange={(tab) => setActiveTab(tab as any)}
            />
          </div>

          {/* Scrollable Content Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-900/50 text-sm leading-relaxed font-sans">
            {activeTab === 'simplified' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> Simplified Core Concept
                  </div>
                  <p className="text-slate-200 text-base font-normal">
                    {paper.simplifiedExplanation}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    Abstract
                  </h4>
                  <p className="text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                    {paper.abstract}
                  </p>
                </div>

                {/* Keywords */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    Keywords
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {paper.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700/50"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'scientific' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-purple-400 font-semibold">
                    Detailed Methodology & Empirical Results
                  </h4>
                  <p className="text-slate-200 font-mono text-xs leading-relaxed">
                    {paper.scientificExplanation}
                  </p>
                </div>

                {/* Citation Exporter */}
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-300">APA Citation</h4>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      {referenceManager.exportAPA(paper)}
                    </p>
                  </div>
                  <GlowButton
                    onClick={handleCopyBibtex}
                    accentColor="#06b6d4"
                    className="py-1.5 px-3 text-xs shrink-0"
                  >
                    {copiedCite ? 'Copied BibTeX!' : 'Copy BibTeX'}
                  </GlowButton>
                </div>
              </div>
            )}

            {activeTab === 'figures' && (
              <div className="space-y-6">
                {paper.figures.length === 0 && paper.tables.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">
                    No figures or tabular data provided for this paper.
                  </p>
                ) : (
                  <>
                    {paper.figures.map((fig) => (
                      <div key={fig.id} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
                        <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                          <ImageIcon className="w-4 h-4" /> {fig.title}
                        </div>
                        <p className="text-xs text-slate-300">{fig.caption}</p>

                        {/* Render Chart Mock if data points exist */}
                        {fig.dataPoints && (
                          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                            <span className="text-[10px] text-slate-400 font-mono">Data Distribution</span>
                            <div className="space-y-1.5">
                              {fig.dataPoints.map((dp, i) => (
                                <div key={i} className="flex items-center text-xs gap-3">
                                  <span className="w-24 truncate text-slate-400">{dp.x}</span>
                                  <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                                    <div
                                      className="bg-cyan-500 h-full rounded-full"
                                      style={{ width: `${dp.y}%` }}
                                    />
                                  </div>
                                  <span className="font-mono text-cyan-300 w-10 text-right">{dp.y}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {paper.tables.map((tbl) => (
                      <div key={tbl.id} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
                        <div className="flex items-center gap-2 text-purple-300 font-semibold">
                          <TableIcon className="w-4 h-4" /> {tbl.title}
                        </div>
                        <p className="text-xs text-slate-300">{tbl.caption}</p>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
                                {tbl.headers.map((h, idx) => (
                                  <th key={idx} className="p-2 font-medium">{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {tbl.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="border-b border-slate-800/60 hover:bg-slate-800/30">
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="p-2 font-mono text-slate-300">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {activeTab === 'citations' && (
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  References & Cited Works
                </h4>
                <div className="space-y-2">
                  {paper.references.map((ref, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs text-slate-300 font-mono flex items-start gap-2"
                    >
                      <span className="text-cyan-400 font-bold">[{idx + 1}]</span>
                      <span>{ref.citationText}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'knowledge' && (
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Biosphere Knowledge Graph Connections
                </h4>
                <p className="text-xs text-slate-400">
                  This research paper is indexed into Biosphere's Universal Knowledge Graph and cross-linked across engines.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Knowledge Nodes</span>
                    <div className="flex flex-wrap gap-1.5">
                      {paper.knowledgeGraphNodeIds.map((node, i) => (
                        <span key={i} className="text-xs bg-cyan-950/40 text-cyan-300 border border-cyan-800/50 px-2 py-0.5 rounded">
                          {node}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Related Virtual Labs</span>
                    <div className="flex flex-wrap gap-1.5">
                      {paper.relatedLabIds.map((lab, i) => (
                        <span key={i} className="text-xs bg-purple-950/40 text-purple-300 border border-purple-800/50 px-2 py-0.5 rounded">
                          {lab}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
            {onOpenAIMentor && (
              <GlowButton
                onClick={() => {
                  onClose()
                  onOpenAIMentor(paper)
                }}
                accentColor="#a855f7"
                className="py-1.5 px-4 text-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Discuss with AI Research Mentor
              </GlowButton>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition-colors"
            >
              Close Viewer
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
