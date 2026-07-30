'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FlaskConical,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import { Experiment, ResearchPaper } from '@/research-objects/types'
import { experimentDesignService, ValidationFeedback } from '@/experiment-designer/experimentDesignService'
import { GlassCard, GlowButton } from '@/components/ds'

export const ExperimentDesigner: React.FC = () => {
  const templates = experimentDesignService.getAllTemplateExperiments()
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || '')

  const activeTemplate = experimentDesignService.getExperimentById(selectedTemplateId) || templates[0]

  // Form State
  const [hypothesis, setHypothesis] = useState(
    'If sgRNA length is reduced from 20 to 18 nucleotides, then off-target Cas9 cuts will drop while on-target cuts remain high.'
  )
  const [independentVar, setIndependentVar] = useState('sgRNA target spacer length (nucleotides)')
  const [dependentVar, setDependentVar] = useState('Off-target cleavage mutation frequency (%)')
  const [positiveControl, setPositiveControl] = useState('Wild-type 20nt sgRNA (100% baseline target cut)')
  const [negativeControl, setNegativeControl] = useState('Scrambled non-targeting sgRNA (0% target cut)')
  const [predictedOutcome, setPredictedOutcome] = useState('Off-target cuts decrease by over 80% with 18nt sgRNA.')

  const [feedback, setFeedback] = useState<ValidationFeedback | null>(null)

  const handleValidate = () => {
    if (!activeTemplate) return
    const res = experimentDesignService.evaluateExperimentDesign(
      activeTemplate.id,
      hypothesis,
      independentVar,
      dependentVar,
      { positive: positiveControl, negative: negativeControl }
    )
    setFeedback(res)
  }

  return (
    <div className="space-y-6">
      {/* Studio Header & Template Selector */}
      <GlassCard className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <FlaskConical className="w-4 h-4 text-cyan-400" />
          <span>Experiment Design Studio</span>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="experiment-template-select" className="text-xs text-slate-400 font-medium">Select Research Template:</label>
          <select
            id="experiment-template-select"
            value={selectedTemplateId}
            onChange={(e) => {
              setSelectedTemplateId(e.target.value)
              setFeedback(null)
            }}
            className="bg-slate-900 text-xs text-slate-200 border border-slate-700/80 rounded-lg p-2 outline-none max-w-xs truncate"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.difficulty})
              </option>
            ))}
          </select>
        </div>
      </GlassCard>

      {/* Main Studio Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Experiment Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Hypothesis Formulation */}
          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              Step 1: Formulate Scientific Hypothesis
            </div>
            <p className="text-xs text-slate-400">
              State a clear, testable "If... then..." statement establishing expected causal mechanics.
            </p>
            <textarea
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              rows={3}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 outline-none focus:border-cyan-500 font-sans"
              placeholder="If [independent variable changes], then [dependent variable outcome] because..."
            />
          </GlassCard>

          {/* Step 2: Define Variables & Controls */}
          <GlassCard className="p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
              Step 2: Define Variables & Experimental Controls
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Independent Variable (Manipulated)</label>
                <input
                  type="text"
                  value={independentVar}
                  onChange={(e) => setIndependentVar(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-100 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Dependent Variable (Measured)</label>
                <input
                  type="text"
                  value={dependentVar}
                  onChange={(e) => setDependentVar(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-100 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Positive Control</label>
                <input
                  type="text"
                  value={positiveControl}
                  onChange={(e) => setPositiveControl(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Negative Control</label>
                <input
                  type="text"
                  value={negativeControl}
                  onChange={(e) => setNegativeControl(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg p-2 text-xs text-slate-100 outline-none"
                />
              </div>
            </div>
          </GlassCard>

          {/* Step 3: Predict Outcomes */}
          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              Step 3: Quantitative Outcome Prediction
            </div>
            <input
              type="text"
              value={predictedOutcome}
              onChange={(e) => setPredictedOutcome(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg p-3 text-xs text-slate-100 outline-none"
              placeholder="Predict expected numerical shifts or outcomes..."
            />

            <div className="pt-2 flex justify-end">
              <GlowButton onClick={handleValidate} accentColor="#06b6d4" className="py-2 px-5 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Validate & Compare with Published Studies
              </GlowButton>
            </div>
          </GlassCard>
        </div>

        {/* Right: Validation Feedback & Published Study Match */}
        <div className="space-y-6">
          <GlassCard className="p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" /> Benchmark Study Comparison
            </h4>

            {activeTemplate?.objective && (
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] text-slate-400 font-mono uppercase">Template Objective</span>
                <p className="text-slate-200">{activeTemplate.objective}</p>
              </div>
            )}

            {/* Live Feedback Card */}
            {feedback ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Design Score</span>
                  <span className="font-mono text-cyan-400 font-bold text-base">{feedback.score}/100</span>
                </div>

                {feedback.suggestions.length > 0 ? (
                  <div className="space-y-1 text-xs text-amber-300">
                    {feedback.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle className="w-4 h-4" /> Excellent scientific experiment design!
                  </div>
                )}

                {feedback.matchedPaper && (
                  <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 space-y-1.5 mt-3">
                    <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                      Matched Benchmark Paper
                    </span>
                    <h5 className="text-xs font-semibold text-slate-100">{feedback.matchedPaper.title}</h5>
                    <p className="text-[11px] text-slate-300 line-clamp-2">{feedback.matchedPaper.abstract}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">
                Complete your variables and hypothesis above, then click "Validate" to compare against real peer-reviewed papers.
              </p>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
