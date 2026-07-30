'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Database, Download, FileSpreadsheet } from 'lucide-react'
import { Dataset } from '@/research-objects/types'
import { researchRegistry } from '@/research-objects/registry'
import { GlassCard, PillBadge, GlowButton } from '@/components/ds'

export const DatasetViewer: React.FC = () => {
  const datasets = researchRegistry.getAllDatasets()
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(datasets[0]?.id || '')

  const currentDataset = researchRegistry.getDataset(selectedDatasetId) || datasets[0]

  if (!currentDataset) return null

  return (
    <div className="space-y-6">
      {/* Header Selector */}
      <GlassCard className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Open Science Datasets</span>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="dataset-select" className="text-xs text-slate-400 font-medium">Dataset:</label>
          <select
            id="dataset-select"
            value={selectedDatasetId}
            onChange={(e) => setSelectedDatasetId(e.target.value)}
            className="bg-slate-900 text-xs text-slate-200 border border-slate-700/80 rounded-lg p-2 outline-none"
          >
            {datasets.map((ds) => (
              <option key={ds.id} value={ds.id}>
                {ds.title} ({ds.format})
              </option>
            ))}
          </select>
        </div>
      </GlassCard>

      {/* Dataset Details Card */}
      <GlassCard className="p-6 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <PillBadge color="#06b6d4">{currentDataset.format}</PillBadge>
              <span className="text-xs font-mono text-slate-400">{currentDataset.fileSize}</span>
              <span className="text-xs font-mono text-slate-400">• {currentDataset.sampleCount} Samples</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">{currentDataset.title}</h3>
            <p className="text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">{currentDataset.description}</p>
          </div>

          <GlowButton
            onClick={() => alert(`Downloading dataset ${currentDataset.title}...`)}
            accentColor="#06b6d4"
            className="py-2 px-4 text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download ({currentDataset.format})
          </GlowButton>
        </div>

        {/* Interactive Data Table Preview */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-purple-400" /> Data Table Preview ({currentDataset.rowsPreview.length} rows)
          </h4>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-300 font-mono">
                  {currentDataset.headers.map((h, i) => (
                    <th key={i} className="p-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentDataset.rowsPreview.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    {currentDataset.headers.map((h, cIdx) => (
                      <td key={cIdx} className="p-3 font-mono text-slate-300">
                        {String(row[h] ?? 'N/A')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
