'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Sparkles, TrendingUp, Compass, ArrowUpDown, Database } from 'lucide-react'
import { ResearchPaper, ResearchFieldId } from '@/research-objects/types'
import { researchService } from '@/research-engine/researchService'
import { searchService } from '@/research-engine/searchService'
import { recommendationService } from '@/research-engine/recommendationService'
import { referenceManager } from '@/citation-service/referenceManager'
import { researchRegistry } from '@/research-objects/registry'
import { GlassCard, GlassInput, PillBadge, TabBar } from '@/components/ds'
import { PaperCard } from './PaperCard'
import { DatasetViewer } from './DatasetViewer'

interface ResearchExplorerProps {
  onOpenViewer: (paper: ResearchPaper) => void
  onOpenAIMentor: (paper: ResearchPaper) => void
}

export const ResearchExplorer: React.FC<ResearchExplorerProps> = ({
  onOpenViewer,
  onOpenAIMentor,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedField, setSelectedField] = useState<ResearchFieldId | 'all'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'citations' | 'trending'>('trending')
  const [subTab, setSubTab] = useState<'papers' | 'datasets'>('papers')
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(referenceManager.getBookmarks())

  const fields = researchRegistry.getAllFields()

  const handleBookmarkToggle = (paperId: string) => {
    referenceManager.toggleBookmark(paperId)
    setBookmarkedIds(referenceManager.getBookmarks())
  }

  // Filtered / Searched Papers
  const papers = useMemo(() => {
    if (searchQuery.trim()) {
      const searchRes = searchService.search(searchQuery)
      let res = searchRes.papers
      if (selectedField !== 'all') {
        res = res.filter((p) => p.fieldId === selectedField)
      }
      return res
    }

    const res = researchService.getFilteredPapers({
      fieldId: selectedField,
      sortBy,
      pageSize: 50,
    })
    return res.items
  }, [searchQuery, selectedField, sortBy])

  // Recommended Papers
  const recommendations = useMemo(() => {
    return recommendationService.getPersonalizedRecommendations(bookmarkedIds, 3)
  }, [bookmarkedIds])

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search thousands of papers, keywords, authors, or DOIs..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-100 outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSubTab('papers')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                subTab === 'papers'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Research Papers
            </button>
            <button
              onClick={() => setSubTab('datasets')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                subTab === 'datasets'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" /> Open Datasets
            </button>
          </div>
        </div>

        {subTab === 'papers' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            {/* Field Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <button
                onClick={() => setSelectedField('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
                  selectedField === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                All Fields
              </button>
              {fields.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedField(f.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
                    selectedField === f.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort research papers"
                className="bg-slate-900 text-slate-200 border border-slate-700/80 rounded-lg p-1.5 outline-none cursor-pointer"
              >
                <option value="trending">Trending 🔥</option>
                <option value="recent">Most Recent</option>
                <option value="citations">Most Cited</option>
              </select>
            </div>
          </div>
        )}
      </GlassCard>

      {subTab === 'datasets' ? (
        <DatasetViewer />
      ) : (
        <>
          {/* AI Recommended Research Section */}
          {recommendations.length > 0 && !searchQuery && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-purple-300 font-bold">
                <Sparkles className="w-4 h-4 text-purple-400" /> Recommended For You
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    isBookmarked={bookmarkedIds.includes(paper.id)}
                    onBookmarkToggle={handleBookmarkToggle}
                    onOpenViewer={(p) => {
                      referenceManager.addRecentlyViewed(p.id)
                      onOpenViewer(p)
                    }}
                    onOpenAIMentor={onOpenAIMentor}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Main Papers Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Showing {papers.length} Research Papers</span>
            </div>

            {papers.length === 0 ? (
              <GlassCard className="p-12 text-center text-slate-400">
                No research papers found matching your query.
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {papers.map((paper) => (
                  <PaperCard
                    key={paper.id}
                    paper={paper}
                    isBookmarked={bookmarkedIds.includes(paper.id)}
                    onBookmarkToggle={handleBookmarkToggle}
                    onOpenViewer={(p) => {
                      referenceManager.addRecentlyViewed(p.id)
                      onOpenViewer(p)
                    }}
                    onOpenAIMentor={onOpenAIMentor}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
