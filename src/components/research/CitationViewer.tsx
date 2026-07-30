'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Network, FileCode } from 'lucide-react'
import { citationGraphService } from '@/citation-service/citationGraphService'
import { referenceManager } from '@/citation-service/referenceManager'
import { researchRegistry } from '@/research-objects/registry'
import { GlassCard, GlowButton, PillBadge } from '@/components/ds'

export const CitationViewer: React.FC = () => {
  const [selectedPaperId, setSelectedPaperId] = useState<string>('paper_crispr_cas9_mammalian')
  const [copiedBib, setCopiedBib] = useState(false)

  const papers = researchRegistry.getAllPapers()
  const currentPaper = researchRegistry.getPaper(selectedPaperId) || papers[0]
  const graph = citationGraphService.buildCitationGraph(currentPaper.id)

  const handleCopyBib = () => {
    if (!currentPaper) return
    const bib = referenceManager.exportBibTeX(currentPaper)
    navigator.clipboard.writeText(bib)
    setCopiedBib(true)
    setTimeout(() => setCopiedBib(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Paper Selector */}
      <GlassCard className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Network className="w-4 h-4 text-cyan-400" />
          <span>Citation Graph Explorer</span>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="citation-paper-select" className="text-xs text-slate-400 font-medium">Select Target Paper:</label>
          <select
            id="citation-paper-select"
            value={selectedPaperId}
            onChange={(e) => setSelectedPaperId(e.target.value)}
            className="bg-slate-900 text-xs text-slate-200 border border-slate-700/80 rounded-lg p-2 outline-none max-w-xs truncate"
          >
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.year})
              </option>
            ))}
          </select>
        </div>
      </GlassCard>

      {/* Visual Network Graph Container */}
      <GlassCard className="p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[340px]">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Target Node
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 ml-2" /> Cited Reference
        </div>

        {/* Interactive SVG Network Graph */}
        <div className="w-full max-w-lg py-8 flex flex-col items-center justify-center space-y-6 relative">
          {/* Target Node Center */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="p-4 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400 text-center max-w-sm shadow-xl z-20"
          >
            <PillBadge color="#06b6d4" className="mb-2">Target Node</PillBadge>
            <h4 className="text-sm font-bold text-slate-100 line-clamp-2">{currentPaper.title}</h4>
            <p className="text-xs text-cyan-300 font-mono mt-1">Citations: {currentPaper.citationCount}</p>
          </motion.div>

          {/* Connected Citation Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4">
            {graph.nodes
              .filter((n) => n.id !== currentPaper.id)
              .map((node) => (
                <div
                  key={node.id}
                  onClick={() => setSelectedPaperId(node.id)}
                  className="p-3 rounded-xl bg-slate-900/80 border border-purple-500/40 hover:border-purple-400 transition-colors cursor-pointer text-left space-y-1 shadow-md"
                >
                  <span className="text-[10px] text-purple-300 font-mono uppercase tracking-wider block">
                    {node.year} • {node.citationCount} Citations
                  </span>
                  <h5 className="text-xs font-semibold text-slate-200 line-clamp-2">{node.label}</h5>
                </div>
              ))}
          </div>
        </div>
      </GlassCard>

      {/* Bibliography & Citation String Export */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <FileCode className="w-4 h-4 text-purple-400" />
            <span>BibTeX & APA Export</span>
          </div>

          <GlowButton onClick={handleCopyBib} accentColor="#06b6d4" className="py-1.5 px-3 text-xs">
            {copiedBib ? 'Copied BibTeX!' : 'Export BibTeX'}
          </GlowButton>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
          <pre>{referenceManager.exportBibTeX(currentPaper)}</pre>
        </div>
      </GlassCard>
    </div>
  )
}
