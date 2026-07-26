'use client';

import React, { useState } from 'react';
import { MicroscopeSlide, MicroscopeState, CellStructure } from '@/microscope-engine/types';
import { Bot, Sparkles, MessageSquare, HelpCircle, CheckCircle, Lightbulb, ChevronRight, Zap } from 'lucide-react';

interface MicroscopeAISidebarProps {
  slide: MicroscopeSlide;
  state: MicroscopeState;
  selectedStructure: CellStructure | null;
}

export const MicroscopeAISidebar: React.FC<MicroscopeAISidebarProps> = ({
  slide,
  state,
  selectedStructure
}) => {
  const [userQuery, setUserQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: `Hello! I am your AI Microscopy Mentor. I'm currently analyzing **${slide.title}** at **${state.objective}** objective magnification.`
    }
  ]);

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const newMessages = [...chatMessages, { role: 'user' as const, text: userQuery }];
    setChatMessages(newMessages);

    // AI Mentor Response generation based on microscope state
    setTimeout(() => {
      let aiResponse = `Observing ${slide.title} under ${state.objective} objective lens. `;

      if (selectedStructure) {
        aiResponse += `You are currently focusing on the **${selectedStructure.name}** (${selectedStructure.scientificTerm}). ${selectedStructure.description} Its primary function is ${selectedStructure.function}.`;
      } else {
        aiResponse += `Key features to observe in this specimen include: ${slide.histologyDetails.keyIdentificationFeatures.slice(0, 2).join('; ')}. Try increasing fine focus or switching to 40x for higher resolution.`;
      }

      setChatMessages((prev) => [...prev, { role: 'ai', text: aiResponse }]);
    }, 600);

    setUserQuery('');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col h-full min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              AI Microscopy Mentor
              <Sparkles className="w-3 h-3 text-amber-400" />
            </h3>
            <span className="text-[10px] text-slate-400">Real-Time Slide Intelligence</span>
          </div>
        </div>
      </div>

      {/* Live Context Telemetry Card */}
      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 mb-4 text-xs font-mono">
        <span className="text-[10px] text-slate-500 block uppercase font-bold mb-1.5 flex items-center gap-1">
          <Zap className="w-3 h-3 text-emerald-400" />
          Active Specimen Context
        </span>
        <div className="space-y-1 text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-500">Slide:</span>
            <span className="text-emerald-300 font-bold truncate max-w-[150px]">{slide.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Objective:</span>
            <span className="text-amber-400">{state.objective}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Selected:</span>
            <span className="text-slate-200">{selectedStructure ? selectedStructure.name : 'Entire Field'}</span>
          </div>
        </div>
      </div>

      {/* Structure Deep-Dive Explanation Box */}
      {selectedStructure ? (
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 mb-4 text-xs">
          <h4 className="font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-emerald-400" />
            {selectedStructure.name} ({selectedStructure.scientificTerm})
          </h4>
          <p className="text-slate-300 leading-relaxed mb-2">{selectedStructure.description}</p>
          <div className="text-[11px] text-emerald-400/90 font-mono bg-emerald-950/60 p-2 rounded-lg border border-emerald-500/20">
            <strong>Function:</strong> {selectedStructure.function}
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 mb-4 text-xs text-slate-400">
          <p className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            Guided Observation Prompt
          </p>
          <p>
            Click any cellular structure in the slide viewer to inspect its organelle function and histology notes.
          </p>
        </div>
      )}

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 text-xs scrollbar-thin">
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl ${
              msg.role === 'ai'
                ? 'bg-slate-950 border border-slate-800 text-slate-200'
                : 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-200 ml-6'
            }`}
          >
            <p className="leading-relaxed">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Query Input */}
      <form onSubmit={handleSendQuery} className="relative">
        <input
          type="text"
          placeholder="Ask AI Mentor about this slide..."
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 p-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
