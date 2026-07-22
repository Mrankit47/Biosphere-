"use client";

import { useState, useEffect, useMemo } from "react";
import { BackLink } from "@/components/ds";
import { BioIcon } from "@/components/ui/navigation/BioIcon";
import { SIMULATIONS } from "@/data/simulations";
import SimEngineWorkspace from "@/components/virtual-sim/SimEngineWorkspace";

export default function ProcessSimulations() {
  const [mounted, setMounted] = useState(false);
  const [activeSimId, setActiveSimId] = useState<string | null>(null);
  const [completedSims, setCompletedSims] = useState<string[]>([]);

  // Initialize
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("biosphere_completed_sims");
      if (saved) {
        setCompletedSims(JSON.parse(saved));
      }
    }
  }, [activeSimId]);

  const activeSim = useMemo(() => {
    return SIMULATIONS.find((s) => s.id === activeSimId) || null;
  }, [activeSimId]);

  if (!mounted) return null;

  return (
    <div className="sim-root min-h-[calc(100vh-64px)] relative bg-[#050A05] text-[#C8F5C8] font-sans">
      <div className="sim-grid-bg absolute inset-0 pointer-events-none" />
      <div className="sim-glow-effect absolute pointer-events-none" />

      {!activeSimId ? (
        /* SELECTION LANDING SCREEN */
        <div className="relative z-10">
          {/* HEADER SECTION */}
          <header className="sim-header flex items-center justify-between px-8 py-5 border-b border-[var(--ds-border-muted)] bg-black/20 backdrop-blur-md">
            <div className="header-left flex items-center gap-4">
              <BackLink href="/" label="Home" />
              <div>
                <h1 className="header-title text-base font-black text-white uppercase tracking-wider">
                  BIOLOGY PROCESS SIMULATOR
                </h1>
                <p className="header-subtitle text-[9px] text-[var(--ds-accent)] font-bold tracking-widest uppercase mt-0.5">
                  TIMELINE SCRUBBER & ANIMATION ENGINE
                </p>
              </div>
            </div>
          </header>

          <main className="sim-selection-container max-w-4xl mx-auto py-12 px-6">
            <div className="selection-header text-center mb-10">
              <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                SELECT BIOLOGICAL PROCESS
              </h2>
              <p className="text-xs text-[var(--ds-fg-muted)]">
                Scrub and pause microscopic biochemical and cellular pathways at frame-level resolution.
              </p>
            </div>

            <div className="sim-cards-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              {SIMULATIONS.map((sim) => {
                const isCompleted = completedSims.includes(sim.id);
                return (
                  <div
                    key={sim.id}
                    className="sim-select-card glassmorphic p-6 flex flex-col justify-between items-start border border-[var(--ds-border-muted)] rounded-2xl hover:border-[var(--ds-accent-muted)] hover:shadow-[var(--ds-glow-sm)] transition-all duration-300"
                  >
                    <div className="w-full">
                      <div className="card-top flex justify-between items-center w-full mb-4">
                        <span className="card-emoji text-[#39FF14] inline-flex items-center justify-center p-2 rounded-xl bg-white/2">
                          <BioIcon name={sim.emoji} size={26} />
                        </span>
                        {isCompleted && (
                          <span className="completed-badge bg-[var(--ds-accent-faint)] border border-[var(--ds-accent-muted)] text-[9px] font-black text-[var(--ds-accent)] px-2 py-0.5 rounded uppercase tracking-wider">
                            ✓ CLEARED
                          </span>
                        )}
                      </div>
                      <h3 className="card-title text-sm font-black text-white uppercase tracking-wider">
                        {sim.name}
                      </h3>
                      <span className="card-category text-[9px] font-bold text-[var(--ds-accent)] uppercase tracking-wider mt-1 block">
                        {sim.category}
                      </span>
                      <p className="card-desc text-xs text-[var(--ds-fg-muted)] mt-2 leading-relaxed">
                        Explore objectives and adjust control parameters over the timeline step process.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveSimId(sim.id)}
                      className="launch-sim-btn mt-6 w-full text-center bg-white/5 border border-[var(--ds-border-muted)] hover:bg-[var(--ds-accent-faint)] hover:border-[var(--ds-accent-muted)] hover:text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-200"
                    >
                      Open Timeline Sim →
                    </button>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      ) : (
        /* CORE REUSABLE SIMULATION ENGINE WORKSPACE */
        <SimEngineWorkspace activeSim={activeSim!} onExit={() => setActiveSimId(null)} />
      )}

      <style jsx global>{`
        .sim-grid-bg {
          inset: 0;
          background-image: 
            linear-gradient(rgba(57, 255, 20, 0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57, 255, 20, 0.012) 1px, transparent 1px);
          background-size: 32px 32px;
          z-index: 0;
        }

        .sim-glow-effect {
          top: -150px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(57, 255, 20, 0.03) 0%, transparent 70%);
          z-index: 0;
        }

        .back-btn {
          color: var(--ds-accent);
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 6px 14px;
          border-radius: 8px;
          background: var(--ds-accent-faint);
          border: 1px solid var(--ds-border-accent);
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: rgba(57, 255, 20, 0.12);
          box-shadow: var(--ds-glow-sm);
        }

        /* Reusable slide inputs */
        .lab-slider {
          -webkit-appearance: none;
          height: 4px;
          border-radius: 2px;
          background: var(--ds-surface-subtle);
          outline: none;
        }

        .lab-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--ds-accent);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
