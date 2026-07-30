'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Bookmark, Clock, Award, ChevronRight, Sparkles } from 'lucide-react'
import { ResearchPaper } from '@/research-objects/types'
import { researchRegistry } from '@/research-objects/registry'
import { GlassCard, PillBadge, GlowButton } from '@/components/ds'

interface PaperCardProps {
  paper: ResearchPaper
  isBookmarked?: boolean
  onBookmarkToggle?: (paperId: string) => void
  onOpenViewer?: (paper: ResearchPaper) => void
  onOpenAIMentor?: (paper: ResearchPaper) => void
}

export const PaperCard: React.FC<PaperCardProps> = ({
  paper,
  isBookmarked = false,
  onBookmarkToggle,
  onOpenViewer,
  onOpenAIMentor,
}) => {
  const field = researchRegistry.getField(paper.fieldId)
  const journal = paper.journalId ? researchRegistry.getJournal(paper.journalId) : undefined
  const authorNames = paper.authorIds
    .map((id) => researchRegistry.getScientist(id)?.name)
    .filter(Boolean)
    .join(', ')

  return (
    <GlassCard className="p-5 flex flex-col justify-between hover:border-cyan-500/50 transition-all duration-300 group">
      <div>
        {/* Header badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <PillBadge color="#06b6d4" className="text-xs">
              {field?.name || paper.fieldId}
            </PillBadge>
            {journal && (
              <span className="text-xs text-slate-400 font-mono bg-slate-800/60 px-2.5 py-0.5 rounded-full border border-slate-700/50">
                {journal.shortName}
              </span>
            )}
            {paper.isTrending && (
              <PillBadge color="#f97316" className="text-xs">
                Trending 🔥
              </PillBadge>
            )}
          </div>
          <button
            onClick={() => onBookmarkToggle?.(paper.id)}
            className={`p-2 rounded-lg border transition-colors ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-slate-800/40 text-slate-400 border-slate-700/50 hover:text-white hover:border-slate-600'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Paper Title */}
        <h3
          onClick={() => onOpenViewer?.(paper)}
          className="text-lg font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors cursor-pointer line-clamp-2 mb-2 leading-snug"
        >
          {paper.title}
        </h3>

        {/* Authors & Date */}
        <p className="text-xs text-slate-400 mb-3 line-clamp-1">
          <span className="text-slate-300 font-medium">
            {authorNames || 'Research Team'}
          </span>{' '}
          • {paper.year}
        </p>

        {/* Abstract snippet */}
        <p className="text-xs text-slate-300/90 line-clamp-3 mb-4 leading-relaxed font-sans">
          {paper.abstract}
        </p>
      </div>

      {/* Footer stats & actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5" title="Citations">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-slate-200">{paper.citationCount}</span>
          </span>
          <span className="flex items-center gap-1.5" title="Read time">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{paper.readTimeMinutes} min</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAIMentor && (
            <button
              onClick={() => onOpenAIMentor(paper)}
              className="p-1.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition-colors flex items-center gap-1"
              title="Ask AI Mentor"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          )}

          {onOpenViewer && (
            <GlowButton
              onClick={() => onOpenViewer(paper)}
              accentColor="#06b6d4"
              className="py-1 px-2.5 text-xs flex items-center gap-1"
            >
              Read <ChevronRight className="w-3 h-3" />
            </GlowButton>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
