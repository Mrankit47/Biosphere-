'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Award, ArrowRight, User } from 'lucide-react'
import { ScientificDiscovery, ResearchFieldId } from '@/research-objects/types'
import { timelineService } from '@/research-engine/timelineService'
import { researchRegistry } from '@/research-objects/registry'
import { GlassCard, PillBadge } from '@/components/ds'

interface TimelineViewerProps {
  onSelectDiscovery?: (discovery: ScientificDiscovery) => void
}

export const TimelineViewer: React.FC<TimelineViewerProps> = ({
  onSelectDiscovery,
}) => {
  const [selectedField, setSelectedField] = useState<ResearchFieldId | 'all'>('all')
  const [selectedScientist, setSelectedScientist] = useState<string>('all')
  const [selectedDiscovery, setSelectedDiscovery] = useState<ScientificDiscovery | null>(null)

  const fields = researchRegistry.getAllFields()
  const scientists = researchRegistry.getAllScientists()

  const milestones = useMemo(() => {
    return timelineService.getMilestones({
      fieldId: selectedField,
      scientistId: selectedScientist === 'all' ? undefined : selectedScientist,
    })
  }, [selectedField, selectedScientist])

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <GlassCard className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span>Timeline Filters</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Field Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-medium px-1">Field:</span>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value as any)}
              aria-label="Filter timeline by field"
              className="bg-transparent text-slate-200 outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Fields</option>
              {fields.map((f) => (
                <option key={f.id} value={f.id} className="bg-slate-900">{f.name}</option>
              ))}
            </select>
          </div>

          {/* Scientist Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-medium px-1">Scientist:</span>
            <select
              value={selectedScientist}
              onChange={(e) => setSelectedScientist(e.target.value)}
              aria-label="Filter timeline by scientist"
              className="bg-transparent text-slate-200 outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Scientists</option>
              {scientists.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Discovery Timeline Graphic */}
      <div className="relative pl-6 sm:pl-10 border-l-2 border-slate-800 space-y-8 my-6">
        {milestones.map((d, index) => {
          const field = researchRegistry.getField(d.fieldId)
          const leads = d.leadScientistIds
            .map((id) => researchRegistry.getScientist(id)?.name)
            .filter(Boolean)
            .join(', ')

          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative group"
            >
              {/* Timeline Connector Dot */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-5 h-5 rounded-full bg-slate-900 border-2 border-cyan-500 group-hover:border-cyan-300 group-hover:scale-125 transition-all duration-300 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>

              {/* Discovery Card */}
              <GlassCard
                onClick={() => setSelectedDiscovery(d)}
                className="p-5 cursor-pointer hover:border-cyan-500/50 transition-all duration-300 group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400 text-sm bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-800/50">
                      {d.year}
                    </span>
                    <PillBadge color="#a855f7" className="text-xs">
                      {field?.name || d.fieldId}
                    </PillBadge>
                  </div>

                  <span className="text-xs text-amber-400 font-mono flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Impact: {d.impactScore}/100
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mb-2">
                  {d.title}
                </h3>

                {leads && (
                  <p className="text-xs text-slate-400 mb-3 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{leads}</span>
                  </p>
                )}

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                  {d.simplifiedExplanation}
                </p>

                <div className="flex items-center justify-end text-xs text-cyan-400 font-medium group-hover:translate-x-1 transition-transform">
                  Explore Milestone <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>

      {/* Discovery Detail Modal */}
      <AnimatePresence>
        {selectedDiscovery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 space-y-4 text-slate-100 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedDiscovery(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-400 font-bold bg-cyan-950/60 px-3 py-1 rounded-md border border-cyan-800">
                  Year {selectedDiscovery.year}
                </span>
                <PillBadge color="#06b6d4">{selectedDiscovery.fieldId}</PillBadge>
              </div>

              <h2 className="text-xl font-bold text-slate-100">{selectedDiscovery.title}</h2>

              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
                <h4 className="text-xs font-semibold text-cyan-300 uppercase">Simplified Core Discovery</h4>
                <p className="text-sm text-slate-200 leading-relaxed">{selectedDiscovery.simplifiedExplanation}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <h4 className="text-xs font-semibold text-purple-400 uppercase">Scientific Mechanism</h4>
                <p className="text-xs font-mono text-slate-300 leading-relaxed">{selectedDiscovery.scientificExplanation}</p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedDiscovery(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-200 text-xs rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Close Milestone
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
