'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Award, BookOpen, Search, Building2, X, ExternalLink, Dna } from 'lucide-react'
import { Scientist } from '@/research-objects/types'
import { scientistService } from '@/scientist-service/scientistService'
import { researchRegistry } from '@/research-objects/registry'
import { GlassCard, PillBadge, GlowButton } from '@/components/ds'
import { ScientistCard } from './ScientistCard'

export const ScientistExplorer: React.FC = () => {
  const [query, setQuery] = useState('')
  const [selectedScientist, setSelectedScientist] = useState<Scientist | null>(null)

  const scientists = scientistService.searchScientists(query)

  const profile = selectedScientist
    ? scientistService.getDetailedProfile(selectedScientist.id)
    : null

  return (
    <div className="space-y-6">
      {/* Top Search Bar */}
      <GlassCard className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <User className="w-4 h-4 text-purple-400" />
          <span>Scientist Directory</span>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by scientist name, contribution, or awards..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-100 outline-none focus:border-purple-500"
          />
        </div>
      </GlassCard>

      {/* Grid of Scientists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scientists.map((s) => (
          <ScientistCard
            key={s.id}
            scientist={s}
            onSelectScientist={(sci) => setSelectedScientist(sci)}
          />
        ))}
      </div>

      {/* Scientist Detail Profile Modal */}
      <AnimatePresence>
        {selectedScientist && profile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl p-6 space-y-6 text-slate-100 shadow-2xl overflow-y-auto relative"
            >
              <button
                onClick={() => setSelectedScientist(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/40 to-cyan-500/40 border border-purple-500/50 flex items-center justify-center font-bold text-2xl text-purple-200">
                  {selectedScientist.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">{selectedScientist.name}</h2>
                  <p className="text-xs text-purple-300 font-medium">{selectedScientist.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{profile.institutionName}</p>
                </div>
              </div>

              {/* Awards */}
              {selectedScientist.awards.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" /> Honors & Awards
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedScientist.awards.map((a, i) => (
                      <span key={i} className="text-xs bg-amber-950/40 text-amber-300 border border-amber-800/50 px-2.5 py-1 rounded-lg">
                        🏆 {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Biography */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Biography</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800 font-sans">
                  {selectedScientist.biography}
                </p>
              </div>

              {/* Major Discoveries */}
              {profile.discoveries.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Linked Discoveries</h4>
                  <div className="space-y-2">
                    {profile.discoveries.map((d) => (
                      <div key={d.id} className="p-3 bg-slate-950/60 rounded-xl border border-cyan-800/50 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-cyan-300">{d.title}</span>
                          <span className="font-mono text-cyan-400 font-bold">{d.year}</span>
                        </div>
                        <p className="text-slate-300">{d.simplifiedExplanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
