'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useDigitalHumanEngine, BODY_SYSTEMS_META } from './DigitalHumanContext'
import { HUMAN_ANATOMY_OBJECTS } from '@/knowledge/objects/humanAnatomy'

export function OrganExplorer() {
  const { state, setSelectedOrganId, setSearchQuery } = useDigitalHumanEngine()
  const { selectedOrganId, searchQuery } = state

  const filteredOrgans = useMemo(() => {
    if (!searchQuery.trim()) return HUMAN_ANATOMY_OBJECTS
    const q = searchQuery.toLowerCase()
    return HUMAN_ANATOMY_OBJECTS.filter(
      (obj) =>
        obj.name.toLowerCase().includes(q) ||
        (obj.scientificName && obj.scientificName.toLowerCase().includes(q)) ||
        obj.subcategory.toLowerCase().includes(q) ||
        obj.description.toLowerCase().includes(q)
    )
  }, [searchQuery])

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl text-white w-full max-w-sm">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <span>🔍</span> Organ Explorer
        </h3>
        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
          {filteredOrgans.length} Specs
        </span>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search organs, systems, tissues..."
          className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Organ Cards List */}
      <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredOrgans.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs italic">
            No anatomical structures found matching &quot;{searchQuery}&quot;.
          </div>
        ) : (
          filteredOrgans.map((organ) => {
            const isSelected = selectedOrganId === organ.id
            return (
              <motion.button
                key={organ.id}
                whileHover={{ x: 2 }}
                onClick={() => setSelectedOrganId(organ.id)}
                className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between border ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-200 shadow-md'
                    : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    <span style={{ color: organ.accentColor }}>●</span>
                    <span>{organ.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 italic">
                    {organ.scientificName || organ.subcategory}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                    {organ.difficulty}
                  </span>
                </div>
              </motion.button>
            )
          })
        )}
      </div>
    </div>
  )
}
