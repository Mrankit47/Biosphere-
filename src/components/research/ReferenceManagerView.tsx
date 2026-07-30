'use client'

import React, { useState } from 'react'
import { Bookmark, FolderPlus, Clock } from 'lucide-react'
import { ResearchPaper } from '@/research-objects/types'
import { referenceManager } from '@/citation-service/referenceManager'
import { researchRegistry } from '@/research-objects/registry'
import { GlassCard, PillBadge } from '@/components/ds'
import { PaperCard } from './PaperCard'

interface ReferenceManagerViewProps {
  onOpenViewer: (paper: ResearchPaper) => void
}

export const ReferenceManagerView: React.FC<ReferenceManagerViewProps> = ({
  onOpenViewer,
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'collections' | 'recent'>('bookmarks')
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(referenceManager.getBookmarks())
  const collections = referenceManager.getCollections()
  const recentIds = referenceManager.getRecentlyViewed()

  const bookmarkedPapers = bookmarkedIds
    .map((id) => researchRegistry.getPaper(id))
    .filter((p): p is ResearchPaper => p !== undefined)

  const recentPapers = recentIds
    .map((id) => researchRegistry.getPaper(id))
    .filter((p): p is ResearchPaper => p !== undefined)

  const handleBookmarkToggle = (paperId: string) => {
    referenceManager.toggleBookmark(paperId)
    setBookmarkedIds(referenceManager.getBookmarks())
  }

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <GlassCard className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'bookmarks'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" /> Bookmarked ({bookmarkedPapers.length})
          </button>

          <button
            onClick={() => setActiveTab('collections')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'collections'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5" /> Collections ({collections.length})
          </button>

          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'recent'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Recently Viewed ({recentPapers.length})
          </button>
        </div>
      </GlassCard>

      {/* Bookmarks Grid */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          {bookmarkedPapers.length === 0 ? (
            <GlassCard className="p-12 text-center text-slate-400 space-y-2">
              <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No bookmarked research papers yet.</p>
              <p className="text-xs">Browse the Research Explorer and click the bookmark icon on any paper to save it here.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedPapers.map((paper) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  isBookmarked={true}
                  onBookmarkToggle={handleBookmarkToggle}
                  onOpenViewer={onOpenViewer}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Collections Tab */}
      {activeTab === 'collections' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map((col) => (
              <GlassCard key={col.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-100">{col.name}</h3>
                  <PillBadge color="#a855f7">{`${col.paperIds.length} Papers`}</PillBadge>
                </div>
                <p className="text-xs text-slate-300">{col.description}</p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Updated {new Date(col.updatedAt).toLocaleDateString()}</span>
                  <span className="text-purple-300 font-medium cursor-pointer hover:underline">Manage Collection</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed Tab */}
      {activeTab === 'recent' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPapers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              isBookmarked={bookmarkedIds.includes(paper.id)}
              onBookmarkToggle={handleBookmarkToggle}
              onOpenViewer={onOpenViewer}
            />
          ))}
        </div>
      )}
    </div>
  )
}
