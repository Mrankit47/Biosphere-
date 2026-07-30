'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Compass, Sparkles } from 'lucide-react'

import { BackLink, GlassCard, PillBadge, TabBar, GlowButton } from '@/components/ds'
import { ResearchPaper } from '@/research-objects/types'
import { ResearchExplorer } from '@/components/research/ResearchExplorer'
import { TimelineViewer } from '@/components/research/TimelineViewer'
import { ScientistExplorer } from '@/components/research/ScientistExplorer'
import { ExperimentDesigner } from '@/components/research/ExperimentDesigner'
import { ReferenceManagerView } from '@/components/research/ReferenceManagerView'
import { ResearchViewer } from '@/components/research/ResearchViewer'
import { AIResearchSidebar } from '@/components/research/AIResearchSidebar'

export default function ResearchHubPage() {
  const [activeTab, setActiveTab] = useState<'explorer' | 'timeline' | 'scientists' | 'experiment' | 'references'>('explorer')
  const [viewingPaper, setViewingPaper] = useState<ResearchPaper | null>(null)
  const [aiMentorPaper, setAiMentorPaper] = useState<ResearchPaper | null>(null)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState<boolean>(false)

  const handleOpenAIMentor = (paper: ResearchPaper) => {
    setAiMentorPaper(paper)
    setIsAiSidebarOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Background Gradient & Grid Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <BackLink href="/" label="Biosphere Home" />
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-cyan-200 to-purple-300 bg-clip-text text-transparent">
                  SCIENTIFIC RESEARCH PLATFORM
                </h1>
                <p className="text-xs text-slate-400 font-mono tracking-wider uppercase">
                  Peer-Reviewed Literature • Discovery Timelines • Scientist Directory • Experiment Studio
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <GlowButton
              onClick={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
              accentColor="#a855f7"
              className="py-2 px-4 text-xs flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> AI Research Mentor
            </GlowButton>
          </div>
        </header>

        {/* Platform Navigation Bar */}
        <GlassCard className="p-2">
          <TabBar
            options={[
              { id: 'explorer', label: '🔬 Research Explorer' },
              { id: 'timeline', label: '⏳ Discovery Timeline' },
              { id: 'scientists', label: '🧬 Scientist Directory' },
              { id: 'experiment', label: '🧪 Experiment Studio' },
              { id: 'references', label: '📚 My Library & Citations' },
            ]}
            activeTab={activeTab}
            onChange={(tab) => setActiveTab(tab as any)}
          />
        </GlassCard>

        {/* Main Content Body */}
        <main className="min-h-[600px]">
          {activeTab === 'explorer' && (
            <ResearchExplorer
              onOpenViewer={(paper) => setViewingPaper(paper)}
              onOpenAIMentor={handleOpenAIMentor}
            />
          )}

          {activeTab === 'timeline' && <TimelineViewer />}

          {activeTab === 'scientists' && <ScientistExplorer />}

          {activeTab === 'experiment' && <ExperimentDesigner />}

          {activeTab === 'references' && (
            <ReferenceManagerView onOpenViewer={(paper) => setViewingPaper(paper)} />
          )}
        </main>
      </div>

      {/* Modal Research Paper Viewer */}
      <ResearchViewer
        paper={viewingPaper}
        onClose={() => setViewingPaper(null)}
        onOpenAIMentor={handleOpenAIMentor}
      />

      {/* AI Research Mentor Sidebar */}
      <AIResearchSidebar
        paper={aiMentorPaper}
        isOpen={isAiSidebarOpen}
        onClose={() => setIsAiSidebarOpen(false)}
      />
    </div>
  )
}
