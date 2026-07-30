'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  X,
  Send,
  BookOpen,
  HelpCircle,
  BrainCircuit,
  Lightbulb,
  Layers,
  CheckCircle,
} from 'lucide-react'
import { ResearchPaper } from '@/research-objects/types'
import { recommendationService } from '@/research-engine/recommendationService'

interface AIResearchSidebarProps {
  paper: ResearchPaper | null
  isOpen: boolean
  onClose: () => void
}

export const AIResearchSidebar: React.FC<AIResearchSidebarProps> = ({
  paper,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: paper
        ? `Hello! I am your AI Scientific Research Mentor. Ask me anything about "${paper.title}", its experimental methodologies, or how to simplify its findings!`
        : 'Hello! I am your AI Scientific Research Mentor. Select a paper or ask any biological research question to begin!',
    },
  ])

  const [inputQuery, setInputQuery] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleQuickAction = (action: string) => {
    if (!paper) return

    let aiResponse = ''
    if (action === 'simplify') {
      aiResponse = `💡 **Simplified Explanation:**\n${paper.simplifiedExplanation}\n\nKey Takeaway: ${paper.abstract.slice(0, 140)}...`
    } else if (action === 'methodology') {
      aiResponse = `🧪 **Methodology Breakdown:**\n${paper.scientificExplanation}\n\nExperimental controls and high-precision assays were leveraged to confirm statistical validity.`
    } else if (action === 'questions') {
      aiResponse = `❓ **Discussion Questions:**\n1. How could off-target cleavage or side effects be reduced in clinical trials?\n2. What ethical considerations apply when editing mammalian genomes?\n3. How do these findings compare with earlier 1950s-1980s genetic discoveries?`
    } else if (action === 'future') {
      const recs = recommendationService.getRelatedPapers(paper.id, 2)
      aiResponse = `📚 **Suggested Future Reading:**\n${recs.map((r) => `- **${r.title}** (${r.year})`).join('\n')}`
    }

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: `Action: ${action.toUpperCase()}` },
      { role: 'ai', text: aiResponse },
    ])
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputQuery.trim()) return

    const userText = inputQuery
    setInputQuery('')
    setMessages((prev) => [...prev, { role: 'user', text: userText }])
    setLoading(true)

    setTimeout(() => {
      let aiResponse = `Great question regarding biological research! `
      if (paper) {
        aiResponse += `In the context of "${paper.title}", the empirical evidence indicates that ${paper.simplifiedExplanation}`
      } else {
        aiResponse += `Scientific research relies on rigorous hypothesis testing, quantitative controls, and peer-reviewed replication.`
      }

      setMessages((prev) => [...prev, { role: 'ai', text: aiResponse }])
      setLoading(false)
    }, 600)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900/95 border-l border-purple-500/40 shadow-2xl backdrop-blur-md flex flex-col text-slate-100">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">AI Research Mentor</h3>
              <p className="text-[10px] text-purple-300">Biosphere Intelligence Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper context badge if active */}
        {paper && (
          <div className="px-4 py-2 bg-purple-950/30 border-b border-purple-800/40 text-xs text-purple-200 truncate">
            Active Context: <strong className="text-purple-300">{paper.title}</strong>
          </div>
        )}

        {/* Quick Action Prompts */}
        {paper && (
          <div className="p-3 bg-slate-950/40 border-b border-slate-800 flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => handleQuickAction('simplify')}
              className="px-2.5 py-1 rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 hover:bg-cyan-900/60 transition-colors flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3" /> Simplify
            </button>
            <button
              onClick={() => handleQuickAction('methodology')}
              className="px-2.5 py-1 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800/50 hover:bg-purple-900/60 transition-colors flex items-center gap-1"
            >
              <BrainCircuit className="w-3 h-3" /> Methodology
            </button>
            <button
              onClick={() => handleQuickAction('questions')}
              className="px-2.5 py-1 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/50 hover:bg-amber-900/60 transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" /> Questions
            </button>
            <button
              onClick={() => handleQuickAction('future')}
              className="px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/60 transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3" /> Reading
            </button>
          </div>
        )}

        {/* Chat History */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl leading-relaxed ${
                m.role === 'ai'
                  ? 'bg-slate-800/80 border border-purple-500/30 text-slate-200 self-start'
                  : 'bg-purple-600/30 border border-purple-500/50 text-purple-100 self-end ml-6'
              }`}
            >
              <div className="font-semibold text-[10px] text-slate-400 mb-1 uppercase tracking-wider">
                {m.role === 'ai' ? '🤖 AI Mentor' : '👤 You'}
              </div>
              <div className="whitespace-pre-wrap font-sans">{m.text}</div>
            </div>
          ))}

          {loading && (
            <div className="p-3 rounded-xl bg-slate-800/50 text-xs text-purple-300 animate-pulse">
              Synthesizing scientific literature...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AI Research Mentor..."
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </AnimatePresence>
  )
}
