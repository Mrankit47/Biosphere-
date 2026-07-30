'use client'

import React from 'react'
import { Award, BookOpen, ExternalLink, Dna, Building2 } from 'lucide-react'
import { Scientist } from '@/research-objects/types'
import { researchRegistry } from '@/research-objects/registry'
import { GlassCard, PillBadge } from '@/components/ds'

interface ScientistCardProps {
  scientist: Scientist
  onSelectScientist?: (scientist: Scientist) => void
}

export const ScientistCard: React.FC<ScientistCardProps> = ({
  scientist,
  onSelectScientist,
}) => {
  const institution = researchRegistry.getInstitution(scientist.institutionId)

  return (
    <GlassCard className="p-5 flex flex-col justify-between hover:border-purple-500/50 transition-all duration-300 group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/30 border border-purple-500/40 flex items-center justify-center font-bold text-lg text-purple-200 shadow-lg">
              {scientist.name.charAt(0)}
            </div>
            <div>
              <h3
                onClick={() => onSelectScientist?.(scientist)}
                className="text-base font-semibold text-slate-100 group-hover:text-purple-300 transition-colors cursor-pointer"
              >
                {scientist.name}
              </h3>
              <p className="text-xs text-purple-300/80 line-clamp-1">{scientist.title}</p>
            </div>
          </div>
        </div>

        {institution && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 bg-slate-900/40 px-2.5 py-1 rounded-md border border-slate-800/60">
            <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{institution.name} ({institution.country})</span>
          </div>
        )}

        <p className="text-xs text-slate-300/90 line-clamp-3 mb-4 font-sans leading-relaxed">
          {scientist.biography}
        </p>

        {/* Major Contribution Badge */}
        {scientist.majorContributions[0] && (
          <div className="mb-4">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Key Discovery
            </span>
            <div className="text-xs text-cyan-300 bg-cyan-950/30 border border-cyan-800/40 p-2 rounded-lg line-clamp-2">
              {scientist.majorContributions[0]}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3 font-mono">
          <span title="h-index">h-index: <strong className="text-purple-300">{scientist.hIndex}</strong></span>
          <span>•</span>
          <span title="Total Citations">Citations: <strong className="text-amber-300">{scientist.totalCitations.toLocaleString()}</strong></span>
        </div>

        <button
          onClick={() => onSelectScientist?.(scientist)}
          className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
        >
          Profile <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </GlassCard>
  )
}
