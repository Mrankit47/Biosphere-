"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { BackLink } from "@/components/ds";
import { BioIcon } from "@/components/ui/navigation/BioIcon";
import { EXPERIMENTS } from "@/data/experiments";
import LabWorkspace from "@/components/virtual-lab/LabWorkspace";

const LAB_METADATA: Record<
  string,
  { icon: string; category: string; desc: string }
> = {
  photosynthesis: {
    icon: "photosynthesis",
    category: "Plant Physiology",
    desc: "Measure oxygen gas bubbles released by Elodea weed to investigate how light intensity, wavelength, and carbon dioxide limit cellular chloroplast productivity."
  },
  catalase: {
    icon: "virtual-lab",
    category: "Biochemistry",
    desc: "Investigate how temperature and pH affect the speed at which Catalase enzyme breaks down toxic Hydrogen Peroxide into water and oxygen gas."
  },
  osmosis: {
    icon: "dna-genetics",
    category: "Cell Membrane Transport",
    desc: "Investigate passive transport and osmosis across a semi-permeable cell membrane under varying solute concentrations, temperature, and channel density."
  },
  microscope: {
    icon: "cell-explorer",
    category: "Cytology & Histology",
    desc: "Master light compound microscope adjustments (coarse focus, fine focus) to examine stained plant onion cells, cheek cells, and leaf stomata."
  }
};

export default function VirtualLab() {
  const [mounted, setMounted] = useState(false);
  const [activeLabId, setActiveLabId] = useState<string | null>(null);
  const [progress, setProgress] = useState<string[]>([]);

  // Initialize
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("biosphere_completed_labs");
      if (saved) setProgress(JSON.parse(saved));
    }
  }, [activeLabId]);

  const activeLab = useMemo(() => {
    return EXPERIMENTS.find((e) => e.id === activeLabId) || null;
  }, [activeLabId]);

  if (!mounted) return null;

  return (
    <div className="lab-root min-h-[calc(100vh-64px)] relative bg-[#050A05] text-[#C8F5C8] font-sans">
      <div className="lab-grid-bg absolute inset-0 pointer-events-none" />
      <div className="lab-glow-effect absolute pointer-events-none" />

      {!activeLabId ? (
        /* LANDING PAGE / LAB SELECTION */
        <div className="relative z-10">
          {/* HEADER SECTION */}
          <header className="lab-header flex items-center justify-between px-8 py-5 border-b border-[var(--ds-border-muted)] bg-black/20 backdrop-blur-md">
            <div className="header-left flex items-center gap-4">
              <BackLink href="/" label="Home" />
              <div>
                <h1 className="header-title text-base font-black text-white uppercase tracking-wider">
                  VIRTUAL BIOLOGY LAB
                </h1>
                <p className="header-subtitle text-[9px] text-[var(--ds-accent)] font-bold tracking-widest uppercase mt-0.5">
                  DATA-DRIVEN EXPERIMENT SIMULATOR
                </p>
              </div>
            </div>
          </header>

          <main className="lab-selection-container max-w-4xl mx-auto py-12 px-6">
            <div className="selection-header text-center mb-10">
              <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2">
                SELECT EXPERIMENT MODULE
              </h2>
              <p className="text-xs text-[var(--ds-fg-muted)]">
                Conduct biological and physical chemical investigations inside a controlled environment.
              </p>
            </div>

            <div className="lab-cards-grid grid grid-cols-1 md:grid-cols-2 gap-6">
              {EXPERIMENTS.map((lab) => {
                const meta = LAB_METADATA[lab.id] || {
                  icon: "virtual-lab",
                  category: "Biology",
                  desc: "Interactive laboratory procedure."
                };
                const isDone = progress.includes(lab.id);
                return (
                  <div
                    key={lab.id}
                    className="lab-select-card glassmorphic p-6 flex flex-col justify-between items-start border border-[var(--ds-border-muted)] rounded-2xl hover:border-[var(--ds-accent-muted)] hover:shadow-[var(--ds-glow-sm)] transition-all duration-300"
                  >
                    <div className="w-full">
                      <div className="card-top flex justify-between items-center w-full mb-4">
                        <span className="card-icon text-[#39FF14] inline-flex items-center justify-center p-2 rounded-xl bg-white/2">
                          <BioIcon name={meta.icon} size={26} />
                        </span>
                        {isDone && (
                          <span className="completed-badge bg-[var(--ds-accent-faint)] border border-[var(--ds-accent-muted)] text-[9px] font-black text-[var(--ds-accent)] px-2 py-0.5 rounded uppercase tracking-wider">
                            ✓ CERTIFIED
                          </span>
                        )}
                      </div>
                      <h3 className="card-title text-sm font-black text-white uppercase tracking-wider">
                        {lab.name}
                      </h3>
                      <span className="card-category text-[9px] font-bold text-[var(--ds-accent)] uppercase tracking-wider mt-1 block">
                        {meta.category}
                      </span>
                      <p className="card-desc text-xs text-[var(--ds-fg-muted)] mt-2 leading-relaxed">
                        {meta.desc}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveLabId(lab.id)}
                      className="start-lab-btn mt-6 w-full text-center bg-white/5 border border-[var(--ds-border-muted)] hover:bg-[var(--ds-accent-faint)] hover:border-[var(--ds-accent-muted)] hover:text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-200"
                    >
                      Launch Simulator →
                    </button>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      ) : (
        /* CORE REUSABLE LABORATORY WORKSPACE */
        <LabWorkspace activeLab={activeLab!} onExit={() => setActiveLabId(null)} />
      )}

      <style jsx global>{`
        .lab-grid-bg {
          inset: 0;
          background-image: 
            linear-gradient(rgba(57, 255, 20, 0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57, 255, 20, 0.012) 1px, transparent 1px);
          background-size: 32px 32px;
          z-index: 0;
        }

        .lab-glow-effect {
          top: -150px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(57, 255, 20, 0.03) 0%, transparent 70%);
          z-index: 0;
        }

        /* Legacy backlink buttons preserve styling */
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
      `}</style>
    </div>
  );
}
