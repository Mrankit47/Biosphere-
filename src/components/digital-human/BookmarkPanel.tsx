'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDigitalHumanEngine } from './DigitalHumanContext'

export function BookmarkPanel() {
  const { state, addBookmark, removeBookmark } = useDigitalHumanEngine()
  const { bookmarks } = state
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addBookmark(title.trim(), notes.trim())
    setTitle('')
    setNotes('')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-xl border border-slate-800 rounded-2xl text-xs font-semibold text-cyan-300 flex items-center gap-2 shadow-xl transition"
      >
        <span>🔖</span> Bookmarks ({bookmarks.length})
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 bottom-12 z-50 w-80 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-4 shadow-2xl text-white"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <span>🔖</span> Saved Anatomical Views
              </h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* Save New Bookmark Form */}
            <form onSubmit={handleSave} className="space-y-2 mb-4 bg-slate-800/40 p-2.5 rounded-2xl border border-slate-800">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Bookmark title (e.g. Cardiac X-Ray)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                + Save Current View
              </button>
            </form>

            {/* Bookmarks List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {bookmarks.length === 0 ? (
                <div className="text-center py-4 text-slate-500 text-xs italic">
                  No saved bookmarks yet. Save your favorite camera angles & active overlays!
                </div>
              ) : (
                bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-semibold text-cyan-300">{bm.title}</div>
                      {bm.notes && <div className="text-[10px] text-slate-400">{bm.notes}</div>}
                      <div className="text-[9px] font-mono text-slate-500 mt-1">
                        {new Date(bm.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <button
                      onClick={() => removeBookmark(bm.id)}
                      className="text-rose-400 hover:text-rose-300 text-xs p-1"
                      title="Delete bookmark"
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
