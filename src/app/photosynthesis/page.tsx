"use client";

import React, { useState } from 'react';

export default function PhotosynthesisRealisticPage() {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden rounded-xl bg-black font-sans shadow-2xl mt-4">
      
      {/* Background Realistic Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] ease-in-out scale-105"
        style={{ backgroundImage: `url('/assets/photosynthesis-bg.png')` }}
      />

      {/* Dark Gradient Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Main Container constrained to prevent overlap with app sidebars */}
      <div className="relative w-full max-w-7xl h-full mx-auto pointer-events-none">

        {/* Main Title Area */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-auto text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] tracking-tight">
            PHOTOSYNTHESIS
          </h1>
          <p className="text-white mt-2 text-sm md:text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium">
            Nature's process of converting light energy into chemical energy
          </p>
        </div>

        {/* SUNLIGHT ENERGY */}
        <div 
          className="absolute top-[20%] left-[5%] md:left-[15%] group pointer-events-auto cursor-pointer"
          onMouseEnter={() => setActivePanel('sunlight')}
          onMouseLeave={() => setActivePanel(null)}
        >
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-yellow-500/20 backdrop-blur-md border-2 border-yellow-400 flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.5)]">
              <span className="text-2xl md:text-3xl">☀️</span>
            </div>
            <span className="mt-2 text-yellow-300 font-bold uppercase tracking-wider text-xs md:text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,1)] bg-black/30 px-2 py-1 rounded">Sunlight Energy</span>
          </div>
          {activePanel === 'sunlight' && (
            <div className="absolute top-0 left-20 md:left-24 w-48 p-3 md:p-4 bg-black/80 backdrop-blur-xl border border-yellow-500/30 rounded-xl text-white/90 text-xs shadow-2xl z-30">
              Photons from sunlight are captured by chlorophyll molecules in the leaves, providing the energy needed to drive the entire process.
            </div>
          )}
        </div>

        {/* CARBON DIOXIDE */}
        <div 
          className="absolute top-[45%] left-[2%] md:left-[10%] group pointer-events-auto cursor-pointer"
          onMouseEnter={() => setActivePanel('co2')}
          onMouseLeave={() => setActivePanel(null)}
        >
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-800/60 backdrop-blur-md border-2 border-slate-400 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)]">
              <div className="flex gap-1">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-500" />
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-slate-900 -ml-2 z-10" />
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-500 -ml-2" />
              </div>
            </div>
            <span className="mt-2 text-slate-200 font-bold uppercase tracking-wider text-xs md:text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,1)] text-center bg-black/30 px-2 py-1 rounded">Carbon Dioxide<br/><span className="text-[10px] text-slate-400">(CO₂)</span></span>
          </div>
        </div>

        {/* WATER */}
        <div 
          className="absolute bottom-[20%] left-[8%] md:left-[18%] group pointer-events-auto cursor-pointer"
          onMouseEnter={() => setActivePanel('water')}
          onMouseLeave={() => setActivePanel(null)}
        >
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-500/40 backdrop-blur-md border-2 border-blue-400 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <span className="text-2xl md:text-3xl">💧</span>
            </div>
            <span className="mt-2 text-blue-300 font-bold uppercase tracking-wider text-xs md:text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,1)] text-center bg-black/30 px-2 py-1 rounded">Water<br/><span className="text-[10px] text-blue-400">(H₂O)</span></span>
          </div>
        </div>

        {/* OXYGEN */}
        <div 
          className="absolute top-[25%] right-[5%] md:right-[20%] group pointer-events-auto cursor-pointer"
          onMouseEnter={() => setActivePanel('oxygen')}
          onMouseLeave={() => setActivePanel(null)}
        >
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-500/40 backdrop-blur-md border-2 border-red-400 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)]">
              <div className="flex gap-1">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500" />
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500 -ml-2" />
              </div>
            </div>
            <span className="mt-2 text-red-300 font-bold uppercase tracking-wider text-xs md:text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,1)] text-center bg-black/30 px-2 py-1 rounded">Oxygen<br/><span className="text-[10px] text-red-200">(O₂)</span></span>
          </div>
        </div>

        {/* GLUCOSE */}
        <div 
          className="absolute bottom-[35%] right-[2%] md:right-[15%] group pointer-events-auto cursor-pointer"
          onMouseEnter={() => setActivePanel('glucose')}
          onMouseLeave={() => setActivePanel(null)}
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-900/80 backdrop-blur-md border-2 border-green-400 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)] rotate-45 rounded-lg">
              <div className="-rotate-45 text-green-300 font-bold text-[8px] md:text-[10px] leading-tight text-center">
                HO—<span className="text-white">C</span>—OH<br/>
                HO—<span className="text-white">C</span>—OH
              </div>
            </div>
            <span className="mt-3 text-green-300 font-bold uppercase tracking-wider text-xs md:text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,1)] text-center bg-black/30 px-2 py-1 rounded">Glucose<br/><span className="text-[10px] text-green-200">(C₆H₁₂O₆)</span></span>
          </div>
        </div>

        {/* RIGHT SIDE PANELS */}
        <div className="absolute right-0 md:right-4 bottom-4 w-72 md:w-80 flex flex-col gap-3 pointer-events-auto z-20">
          
          {/* Equation Panel */}
          <div className="bg-[#0f1f16]/95 backdrop-blur-xl border border-green-500/40 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <div className="bg-green-900/90 px-3 py-1.5 md:px-4 md:py-2 border-b border-green-500/40">
              <h3 className="text-green-100 font-bold text-center text-xs md:text-sm tracking-widest">OVERALL EQUATION</h3>
            </div>
            <div className="p-3 md:p-4 flex flex-col items-center justify-center font-mono text-center gap-2">
              <div className="flex items-center gap-2 text-base md:text-lg text-white font-bold drop-shadow-md">
                <span className="text-slate-200">6CO₂</span> 
                <span className="text-slate-400 text-sm">+</span> 
                <span className="text-blue-300">6H₂O</span>
                <div className="flex flex-col items-center mx-1 md:mx-2">
                  <span className="text-[8px] md:text-[10px] text-yellow-400 uppercase tracking-widest">Light</span>
                  <span className="text-green-400 font-black">→</span>
                </div>
                <span className="text-green-400">C₆H₁₂O₆</span>
                <span className="text-slate-400 text-sm">+</span> 
                <span className="text-red-400">6O₂</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM LEFT PANELS */}
        <div className="absolute bottom-4 left-0 md:left-4 pointer-events-auto z-20">
          {/* Chloroplast Structure Panel */}
          <div className="bg-[#0f1f16]/95 backdrop-blur-xl border border-green-500/40 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] w-64 md:w-72">
            <div className="bg-green-900/90 px-3 py-1.5 md:px-4 md:py-2 border-b border-green-500/40">
              <h3 className="text-green-100 font-bold text-center text-xs md:text-sm tracking-widest">CHLOROPLAST</h3>
            </div>
            <div className="p-3 md:p-4 flex items-center gap-4">
              {/* Abstract Chloroplast */}
              <div className="w-20 h-14 md:w-24 md:h-16 bg-green-500/30 rounded-full border-[3px] border-green-600 flex items-center justify-center overflow-hidden relative shadow-inner">
                 <div className="absolute inset-1.5 border border-green-400/60 rounded-full"></div>
                 {/* Thylakoid stacks (Grana) */}
                 <div className="flex gap-1.5 z-10">
                    <div className="w-2.5 h-6 bg-green-400 rounded-sm shadow-md flex flex-col justify-between p-[1px]"><div className="w-full h-1 bg-green-800 rounded-[1px]"></div><div className="w-full h-1 bg-green-800 rounded-[1px]"></div><div className="w-full h-1 bg-green-800 rounded-[1px]"></div></div>
                    <div className="w-2.5 h-5 bg-green-400 rounded-sm shadow-md flex flex-col justify-between p-[1px]"><div className="w-full h-1 bg-green-800 rounded-[1px]"></div><div className="w-full h-1 bg-green-800 rounded-[1px]"></div></div>
                 </div>
              </div>
              {/* Labels */}
              <div className="flex flex-col gap-1 text-[9px] md:text-[10px] text-slate-200 font-semibold drop-shadow-md">
                <div className="flex items-center gap-1.5"><div className="w-3 h-[2px] bg-slate-400 rounded"></div> Outer Mem.</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-[2px] bg-green-400 rounded"></div> Thylakoid</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-[2px] bg-green-800 rounded"></div> Stroma</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
