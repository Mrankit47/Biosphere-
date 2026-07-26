'use client';

import React, { useState, useEffect } from 'react';
import { MicroscopeSlide, NotebookEntry, ObjectiveLens } from '@/microscope-engine/types';
import { BookOpen, Camera, Save, Trash2, Clock, Check, Sparkles, FileText } from 'lucide-react';

interface ObservationNotebookProps {
  slide: MicroscopeSlide;
  objective: ObjectiveLens;
  effectiveMagnification: number;
}

export const ObservationNotebook: React.FC<ObservationNotebookProps> = ({
  slide,
  objective,
  effectiveMagnification
}) => {
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [notes, setNotes] = useState('');
  const [conclusions, setConclusions] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load entries from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('biosphere_microscope_notebook');
      if (saved) {
        setEntries(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load notebook entries', e);
    }
  }, []);

  const handleSaveEntry = () => {
    if (!notes.trim() && !conclusions.trim()) return;

    const newEntry: NotebookEntry = {
      id: `entry_${Date.now()}`,
      slideId: slide.id,
      slideTitle: slide.title,
      objective,
      effectiveMagnification,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes,
      findings: slide.histologyDetails.keyIdentificationFeatures.slice(0, 2),
      conclusions
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    try {
      localStorage.setItem('biosphere_microscope_notebook', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save notebook entry', e);
    }

    setNotes('');
    setConclusions('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem('biosphere_microscope_notebook', JSON.stringify(updated));
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              Student Observation Notebook
            </h3>
            <p className="text-xs text-slate-400">Record field notes, structural findings & lab conclusions</p>
          </div>
        </div>

        {savedSuccess && (
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5" /> Entry Saved!
          </span>
        )}
      </div>

      {/* New Observation Entry Form */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-900 pb-2">
          <span>Active Slide: <strong className="text-emerald-400">{slide.title}</strong></span>
          <span>Mag: <strong className="text-amber-400">{effectiveMagnification}x</strong></span>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Field Observations & Organelle Notes
          </label>
          <textarea
            rows={3}
            placeholder="Record cell wall thickness, nuclear morphology, staining intensity..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
            Lab Conclusions & Hypotheses
          </label>
          <textarea
            rows={2}
            placeholder="Write lab conclusions..."
            value={conclusions}
            onChange={(e) => setConclusions(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <button
          onClick={handleSaveEntry}
          className="self-end px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Save className="w-4 h-4" />
          Save to Lab Record
        </button>
      </div>

      {/* Saved Entries Log */}
      <div>
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-emerald-400" />
          Saved Journal Entries ({entries.length})
        </h4>

        {entries.length > 0 ? (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-2 relative group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{entry.slideTitle}</span>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span className="text-amber-400">{entry.effectiveMagnification}x</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {entry.timestamp}
                    </span>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {entry.notes && <p className="text-xs text-slate-300 leading-relaxed">{entry.notes}</p>}
                {entry.conclusions && (
                  <p className="text-xs text-emerald-300/90 font-mono bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/20">
                    <strong>Conclusion:</strong> {entry.conclusions}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
            No observation notes recorded yet. Write your observations above and save to your lab record.
          </div>
        )}
      </div>
    </div>
  );
};
