'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface SimStep {
  title: string
  range: [number, number] // timeline range
  summary: string
  description: string
  enzymeFocus: string
}

interface ProcessConfig {
  id: string
  name: string
  desc: string
  category: string
  emoji: string
  steps: SimStep[]
}

const PROCESSES: ProcessConfig[] = [
  {
    id: 'dna_replication',
    name: 'DNA Replication Fork',
    category: 'Molecular Genetics',
    desc: 'Observe the replication fork in action as Helicase unzips the double helix, Primase sets anchors, DNA Polymerase builds strands, and Ligase seals nicks.',
    emoji: '🧬',
    steps: [
      {
        title: 'Helicase Unwinding',
        range: [0, 25],
        summary: 'DNA Helicase unwinds the double helix, separating parent template strands.',
        description: 'The enzyme DNA Helicase breaks the weak hydrogen bonds between complementary nitrogenous bases (A-T and G-C). This unzips the double-stranded DNA molecule, creating a Y-shaped structure known as the Replication Fork. Single-Stranded Binding Proteins (SSBs) stabilize the exposed template strands to prevent re-annealing.',
        enzymeFocus: 'DNA Helicase (Unzipping enzyme)'
      },
      {
        title: 'RNA Primase Priming',
        range: [25, 50],
        summary: 'RNA Primase synthesizes short RNA primers to provide a starting 3\'-OH cap.',
        description: 'DNA Polymerase cannot start synthesis from scratch; it requires an existing nucleotide anchor. The enzyme RNA Primase binds to the template strands and synthesizes a short sequence of complementary RNA nucleotides called an RNA Primer, exposing a free 3\'-OH hydroxyl group.',
        enzymeFocus: 'RNA Primase (Anchor setter)'
      },
      {
        title: 'Polymerase Elongation',
        range: [50, 75],
        summary: 'DNA Polymerase III adds complementary nucleotides continuously and discontinuously.',
        description: 'DNA Polymerase III reads templates in the 3\' to 5\' direction and builds new strands in the 5\' to 3\' direction. The Leading Strand is built continuously towards the fork. The Lagging Strand runs in the opposite direction and must be synthesized discontinuously away from the fork in short segments called Okazaki Fragments.',
        enzymeFocus: 'DNA Polymerase III (Elongator / Builder)'
      },
      {
        title: 'Ligase Ligation',
        range: [75, 100],
        summary: 'RNA primers are replaced, and DNA Ligase seals the backbone.',
        description: 'DNA Polymerase I removes the RNA primers and fills the gaps with DNA nucleotides. Finally, the enzyme DNA Ligase joins the sugar-phosphate backbone together by forming covalent phosphodiester bonds. This permanently links the Okazaki fragments into a unified, continuous double-helix strand.',
        enzymeFocus: 'DNA Ligase (Sealing glue)'
      }
    ]
  },
  {
    id: 'mitosis',
    name: 'Mitosis Phases (Cell Division)',
    category: 'Cellular Biology',
    desc: 'Simulate karyokinesis phases: trace chromatin condensation, equator alignment, spindle contraction, and cleavage furrow cytokinesis.',
    emoji: '🦠',
    steps: [
      {
        title: 'Prophase: Chromosome Condensation',
        range: [0, 25],
        summary: 'Chromatin condenses into visible chromosomes, and the nuclear membrane dissolves.',
        description: 'Inside the nucleus, the loose chromatin fibers tightly coil and condense into distinct, visible X-shaped Chromosomes (sister chromatids). The Nuclear Envelope breaks down, and centrioles migrate to opposite poles, beginning to extend protein microtubule spindle fibers.',
        enzymeFocus: 'Condensin (packaging complexes)'
      },
      {
        title: 'Metaphase: Equator Alignment',
        range: [25, 50],
        summary: 'Chromosomes align along the metaphase plate in the center of the cell.',
        description: 'Spindle fibers attach to the protein kinetochores on the centromeres of each chromosome. The fibers pull and align all chromosomes along the Metaphase Plate (the cell\'s central equator). This alignment ensures that each new daughter cell will receive exactly one copy of each chromosome.',
        enzymeFocus: 'Kinetochore Microtubules (aligning fibers)'
      },
      {
        title: 'Anaphase: Sister Chromatid Separation',
        range: [50, 75],
        summary: 'Sister chromatids are pulled apart by spindle fibers to opposite poles.',
        description: 'The cohesin proteins holding the sister chromatids together are cleaved. The spindle fibers contract and shorten, pulling the individual chromatids (now considered independent chromosomes) towards opposite centriole poles of the dividing cell.',
        enzymeFocus: 'Separase (cohesin-cleaving enzyme)'
      },
      {
        title: 'Telophase & Cytokinesis: Division',
        range: [75, 100],
        summary: 'New nuclear membranes reform, and the cleavage furrow pinches the cell into two.',
        description: 'Chromosomes reach the poles and decondense back into diffuse chromatin. New Nuclear Envelopes reform around each chromosome set. Meanwhile, Cytokinesis occurs: a contractile ring of actin and myosin filaments pinches the cell membrane inwards (forming a cleavage furrow) until it splits into two identical daughter cells.',
        enzymeFocus: 'Actomyosin Contractile Ring'
      }
    ]
  }
]

export default function ProcessSimulations() {
  const [mounted, setMounted] = useState(false)
  const [activeProcessId, setActiveProcessId] = useState<string | null>(null)
  
  // Timeline value (0 to 100)
  const [timeline, setTimeline] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [speed, setSpeed] = useState<number>(1.0) // 0.5, 1.0, 2.0

  // Initialize
  useEffect(() => {
    setMounted(true)
  }, [])

  // Animation ticks logic
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying) {
      timer = setInterval(() => {
        setTimeline(prev => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 100
          }
          return Math.min(100, prev + 0.4 * speed)
        })
      }, 25)
    }
    return () => clearInterval(timer)
  }, [isPlaying, speed])

  const activeProcess = useMemo(() => {
    return PROCESSES.find(p => p.id === activeProcessId) || null
  }, [activeProcessId])

  // Get active step index based on timeline percentage
  const activeStepIdx = useMemo(() => {
    if (!activeProcess) return 0
    const idx = Math.min(3, Math.floor(timeline / 25))
    return idx
  }, [timeline, activeProcess])

  const activeStep = useMemo(() => {
    if (!activeProcess) return null
    return activeProcess.steps[activeStepIdx]
  }, [activeProcess, activeStepIdx])

  const selectProcess = (id: string) => {
    setActiveProcessId(id)
    setTimeline(0)
    setIsPlaying(false)
  }

  // Jump to step boundary
  const jumpToStep = (stepIdx: number) => {
    setTimeline(stepIdx * 25)
  }

  // Helper coordinate functions for DNA Replication SVG
  // Splits DNA double helix using timeline percentage
  const replicationCoords = useMemo(() => {
    // Fork index shifts from X=60 (at timeline 0) to X=170 (at timeline 100)
    const forkX = 60 + (timeline / 100) * 110
    
    // Top strand template path: flat up to forkX, then curves up to y=45
    // Bottom strand template path: flat up to forkX, then curves down to y=155
    return { forkX }
  }, [timeline])

  return (
    <div className="sim-root">
      <div className="sim-grid-bg" />
      <div className="sim-glow-effect" />

      {/* HEADER SECTION */}
      <header className="sim-header">
        <div className="header-left">
          <Link href="/" className="back-btn">
            ← Main Hub
          </Link>
          <div className="divider-line" />
          <div>
            <h1 className="header-title">BIOLOGY PROCESS SIMULATOR</h1>
            <p className="header-subtitle">TIMELINE SCRUBBER & ANIMATION ENGINE</p>
          </div>
        </div>
      </header>

      {!activeProcessId ? (
        /* SELECTION GRID */
        <main className="sim-selection-container">
          <div className="selection-header">
            <h2>SELECT BIOLOGICAL PROCESS</h2>
            <p>Scrub and pause microscopic biochemical and cellular pathways at frame-level resolution.</p>
          </div>

          <div className="sim-cards-grid">
            {PROCESSES.map(p => (
              <div key={p.id} className="sim-select-card glassmorphic">
                <div className="card-top">
                  <span className="card-emoji">{p.emoji}</span>
                  <span className="card-category">{p.category}</span>
                </div>
                <h3 className="card-title">{p.name}</h3>
                <p className="card-desc">{p.desc}</p>
                <button onClick={() => selectProcess(p.id)} className="launch-sim-btn">
                  Open Timeline Sim →
                </button>
              </div>
            ))}
          </div>
        </main>
      ) : (
        /* WORKSPACE */
        <main className="sim-workspace-layout">
          {/* LEFT: Descriptions & Step Indicators */}
          <section className="sim-panel-left">
            <button onClick={() => setActiveProcessId(null)} className="exit-sim-btn">
              ← Exit Simulator
            </button>

            {/* Steps list panel */}
            <div className="panel-card glassmorphic steps-panel-card">
              <h3 className="panel-section-title">Timeline Milestones</h3>
              <div className="steps-bullets-list">
                {activeProcess!.steps.map((step, idx) => {
                  const isActive = idx === activeStepIdx
                  const isCompleted = timeline > step.range[1]
                  return (
                    <button
                      key={idx}
                      onClick={() => jumpToStep(idx)}
                      className={`step-bullet-row ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    >
                      <div className="bullet-indicator">
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <span className="bullet-title">{step.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Detailed description panel */}
            <div className="panel-card glassmorphic description-panel-card">
              <AnimatePresence mode="wait">
                {activeStep && (
                  <motion.div
                    key={activeStepIdx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="step-desc-wrap"
                  >
                    <span className="enzyme-focus-tag">{activeStep.enzymeFocus}</span>
                    <h3 className="active-step-title">{activeStep.title}</h3>
                    <p className="active-step-summary">{activeStep.summary}</p>
                    <div className="divider-sub" />
                    <p className="active-step-long">{activeStep.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* CENTER/RIGHT: Animation Screen and Timeline Bar */}
          <section className="sim-panel-main">
            {/* Visual Screen Card */}
            <div className="panel-card glassmorphic visual-canvas-card">
              <h3 className="panel-section-title">🖥️ Live Animation Canvas</h3>

              <div className="sim-canvas-viewport">
                {activeProcessId === 'dna_replication' ? (
                  /* DNA Replication Animation Fork */
                  <svg className="svg-viewport" viewBox="0 0 200 200" width="100%" height="100%">
                    {/* DNA Helicase Wedge */}
                    {timeline > 0 && (
                      <polygon
                        points={`${replicationCoords.forkX - 10},90 ${replicationCoords.forkX + 8},100 ${replicationCoords.forkX - 10},110`}
                        fill="#ef4444"
                        stroke="#fff"
                        strokeWidth="1"
                        className="helicase-icon"
                      />
                    )}
                    {timeline > 0 && (
                      <text x={replicationCoords.forkX - 12} y="82" fill="#ef4444" fontSize="5" fontFamily="monospace" fontWeight="bold">HELICASE</text>
                    )}

                    {/* DNA Template Strand 1 (Top) */}
                    <path
                      d={`M 10 100 L ${replicationCoords.forkX} 100 Q ${replicationCoords.forkX + 20} 100 190 40`}
                      fill="none"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="2.5"
                    />
                    {/* DNA Template Strand 2 (Bottom) */}
                    <path
                      d={`M 10 100 L ${replicationCoords.forkX} 100 Q ${replicationCoords.forkX + 20} 100 190 160`}
                      fill="none"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="2.5"
                    />

                    {/* Hydrogen Bonds (unzipped as Helicase forkX moves) */}
                    {Array.from({ length: 18 }).map((_, i) => {
                      const x = 15 + i * 9
                      if (x >= replicationCoords.forkX) return null
                      return (
                        <line
                          key={i}
                          x1={x}
                          y1="96"
                          x2={x}
                          y2="104"
                          stroke="rgba(57, 255, 20, 0.4)"
                          strokeWidth="1.5"
                          strokeDasharray="1 1"
                        />
                      )
                    })}

                    {/* RNA Primase Priming (Appears at timeline >= 25) */}
                    {timeline >= 25 && (
                      <g>
                        {/* Leading Primer (top) */}
                        <path d="M 60 100 L 75 100" fill="none" stroke="#10b981" strokeWidth="3" />
                        <circle cx="75" cy="100" r="2" fill="#10b981" />
                        
                        {/* Lagging Primer (bottom) */}
                        {timeline >= 40 && (
                          <>
                            <path d="M 90 102 L 105 108" fill="none" stroke="#10b981" strokeWidth="3" />
                            <circle cx="105" cy="108" r="2" fill="#10b981" />
                          </>
                        )}
                      </g>
                    )}

                    {/* DNA Polymerase III (Elongation at timeline >= 50) */}
                    {timeline >= 50 && (
                      <g>
                        {/* Leading Strand synthesis (top, moving right) */}
                        {(() => {
                          const leadEndX = Math.min(185, 75 + ((timeline - 50) / 50) * 110)
                          return (
                            <>
                              <path
                                d={`M 75 100 L ${Math.min(replicationCoords.forkX, leadEndX)} 100 Q ${replicationCoords.forkX + 20} 100 ${leadEndX} ${100 - ((leadEndX - replicationCoords.forkX) > 0 ? (leadEndX - replicationCoords.forkX) * 0.45 : 0)}`}
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3"
                              />
                              <circle cx={leadEndX} cy={leadEndX > replicationCoords.forkX ? 100 - (leadEndX - replicationCoords.forkX) * 0.45 : 100} r="4" fill="#3b82f6" stroke="#fff" />
                              <text x={leadEndX - 10} y={leadEndX > replicationCoords.forkX ? 88 - (leadEndX - replicationCoords.forkX) * 0.45 : 88} fill="#3b82f6" fontSize="4.5" fontWeight="bold">POLYMERASE III</text>
                            </>
                          )
                        })()}

                        {/* Lagging Strand Okazaki Fragments (bottom, discontinuous) */}
                        {timeline >= 60 && (
                          <path
                            d={`M 105 108 L ${Math.min(replicationCoords.forkX, 105 + ((timeline - 60) / 40) * 60)} ${100 + (Math.min(replicationCoords.forkX, 105 + ((timeline - 60) / 40) * 60) - replicationCoords.forkX > 0 ? (Math.min(replicationCoords.forkX, 105 + ((timeline - 60) / 40) * 60) - replicationCoords.forkX) * 0.45 : 0)}`}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                          />
                        )}
                      </g>
                    )}

                    {/* DNA Ligase (Ligation at timeline >= 75) */}
                    {timeline >= 75 && (
                      <g>
                        <circle cx="110" cy="112" r="5" fill="#f59e0b" stroke="#fff" className="animate-pulse" />
                        <text x="118" y="115" fill="#f59e0b" fontSize="5" fontWeight="bold">LIGASE</text>
                      </g>
                    )}
                  </svg>
                ) : (
                  /* Mitosis Cell Division Animation */
                  <svg className="svg-viewport" viewBox="0 0 200 200" width="100%" height="100%">
                    {/* Centriole Spindle Poles */}
                    {/* Centrioles migrate left and right from center */}
                    {(() => {
                      const centrioleLeftX = 90 - Math.min(25, timeline) * 2.2 // Moves from 90 to 35
                      const centrioleRightX = 110 + Math.min(25, timeline) * 2.2 // Moves from 110 to 165
                      const centrioleY = 100
                      
                      const cellPinch = timeline >= 75 ? (timeline - 75) * 0.8 : 0 // Cleavage pinch depth

                      return (
                        <g>
                          {/* Cell Boundary Outline (pinches during cytokinesis) */}
                          {timeline < 95 ? (
                            <path
                              d={`M 100 ${20 + cellPinch} 
                                  C ${150 + cellPinch / 2} ${20 + cellPinch} 180 60 180 100 
                                  C 180 140 ${150 + cellPinch / 2} ${180 - cellPinch} 100 ${180 - cellPinch} 
                                  C ${50 - cellPinch / 2} ${180 - cellPinch} 20 140 20 100 
                                  C 20 60 ${50 - cellPinch / 2} ${20 + cellPinch} 100 ${20 + cellPinch} Z`}
                              fill="none"
                              stroke="#fff"
                              strokeWidth="2"
                            />
                          ) : (
                            /* Fully divided into two daughter cells */
                            <g>
                              <circle cx="55" cy="100" r="38" fill="none" stroke="#fff" strokeWidth="2" />
                              <circle cx="145" cy="100" r="38" fill="none" stroke="#fff" strokeWidth="2" />
                            </g>
                          )}

                          {/* Centrioles */}
                          {timeline < 95 ? (
                            <>
                              <rect x={centrioleLeftX - 3} y={centrioleY - 6} width="6" height="12" fill="#3b82f6" />
                              <rect x={centrioleRightX - 3} y={centrioleY - 6} width="6" height="12" fill="#3b82f6" />
                            </>
                          ) : (
                            <>
                              <rect x="52" y="94" width="6" height="12" fill="#3b82f6" />
                              <rect x="142" y="94" width="6" height="12" fill="#3b82f6" />
                            </>
                          )}

                          {/* Nuclear Envelope (fades out in Prophase, reforms in Telophase) */}
                          {timeline <= 30 && (
                            <circle
                              cx="100"
                              cy="100"
                              r="35"
                              fill="none"
                              stroke="rgba(255,255,255,0.3)"
                              strokeWidth="1.5"
                              strokeDasharray="3 3"
                              style={{ opacity: 1.0 - timeline / 30 }}
                            />
                          )}
                          {timeline >= 75 && (
                            <g style={{ opacity: (timeline - 75) / 25 }}>
                              <circle cx="55" cy="100" r="20" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="2 2" />
                              <circle cx="145" cy="100" r="20" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="2 2" />
                            </g>
                          )}

                          {/* Spindle Fibers (Metaphase / Anaphase) */}
                          {timeline >= 25 && timeline < 75 && (
                            <g opacity={(timeline - 25) / 10}>
                              {/* Left Spindle fibers to center chromosomes */}
                              <line x1={centrioleLeftX} y1={centrioleY} x2="100" y2="70" stroke="rgba(57, 255, 20, 0.25)" strokeWidth="1" strokeDasharray="1 1" />
                              <line x1={centrioleLeftX} y1={centrioleY} x2="100" y2="90" stroke="rgba(57, 255, 20, 0.25)" strokeWidth="1" strokeDasharray="1 1" />
                              <line x1={centrioleLeftX} y1={centrioleY} x2="100" y2="110" stroke="rgba(57, 255, 20, 0.25)" strokeWidth="1" strokeDasharray="1 1" />
                              <line x1={centrioleLeftX} y1={centrioleY} x2="100" y2="130" stroke="rgba(57, 255, 20, 0.25)" strokeWidth="1" strokeDasharray="1 1" />

                              {/* Right Spindle fibers to center chromosomes */}
                              <line x1={centrioleRightX} y1={centrioleY} x2="100" y2="70" stroke="rgba(57, 255, 20, 0.25)" strokeWidth="1" strokeDasharray="1 1" />
                              <line x1={centrioleRightX} y1={centrioleY} x2="100" y2="90" stroke="rgba(57, 255, 20, 0.25)" strokeWidth="1" strokeDasharray="1 1" />
                              <line x1={centrioleRightX} y1={centrioleY} x2="100" y2="110" stroke="rgba(57, 255, 20, 0.25)" strokeWidth="1" strokeDasharray="1 1" />
                              <line x1={centrioleRightX} y1={centrioleY} x2="100" y2="130" stroke="rgba(57, 255, 20, 0.25)" strokeWidth="1" strokeDasharray="1 1" />
                            </g>
                          )}

                          {/* Chromosomes (Condense, Align, Pull, Decondense) */}
                          {(() => {
                            // Prophase (0-25): loose threads turn into X-shapes
                            // Metaphase (25-50): migrate to line up at X=100
                            // Anaphase (50-75): split and move to X=60 and X=140
                            // Telophase (75-100): decondense back into threads
                            
                            if (timeline <= 25) {
                              // Loose packaging threads
                              return (
                                <g opacity={0.8}>
                                  <path d="M 85 90 Q 100 110 115 90" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                                  <path d="M 90 110 Q 100 80 110 110" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
                                </g>
                              )
                            } else if (timeline <= 50) {
                              // Aligning chromosomes (X shapes) moving towards central Y-axis equator
                              const progressFactor = (timeline - 25) / 25
                              const xPos = 85 + progressFactor * 15 // moves to 100
                              return (
                                <g>
                                  {/* Red Chromosome */}
                                  <path d={`M ${xPos - 4} 80 L ${xPos + 4} 90 M ${xPos - 4} 90 L ${xPos + 4} 80`} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                                  {/* Blue Chromosome */}
                                  <path d={`M ${xPos - 4} 110 L ${xPos + 4} 120 M ${xPos - 4} 120 L ${xPos + 4} 110`} fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
                                </g>
                              )
                            } else if (timeline <= 75) {
                              // Pulled apart sister chromatids (V-shapes pointing away)
                              const progressFactor = (timeline - 50) / 25
                              const leftX = 100 - progressFactor * 45 // moves from 100 to 55
                              const rightX = 100 + progressFactor * 45 // moves from 100 to 145
                              return (
                                <g>
                                  {/* Left Sister Chromatids (V-shape pointing left <) */}
                                  <path d={`M ${leftX + 3} 78 L ${leftX} 83 L ${leftX + 3} 88`} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                                  <path d={`M ${leftX + 3} 112 L ${leftX} 117 L ${leftX + 3} 122`} fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
                                  
                                  {/* Right Sister Chromatids (V-shape pointing right >) */}
                                  <path d={`M ${rightX - 3} 78 L ${rightX} 83 L ${rightX - 3} 88`} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                                  <path d={`M ${rightX - 3} 112 L ${rightX} 117 L ${rightX - 3} 122`} fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
                                </g>
                              )
                            } else {
                              // Telophase decondensation inside reformed nuclei
                              return (
                                <g opacity={0.6}>
                                  {/* Left nucleus threads */}
                                  <path d="M 45 95 Q 55 105 65 95" fill="none" stroke="#f43f5e" strokeWidth="1.2" />
                                  {/* Right nucleus threads */}
                                  <path d="M 135 95 Q 145 105 155 95" fill="none" stroke="#60a5fa" strokeWidth="1.2" />
                                </g>
                              )
                            }
                          })()}
                        </g>
                      )
                    })()}
                  </svg>
                )}
              </div>

              {/* TIMELINE CONTROLS PANEL */}
              <div className="timeline-control-deck glassmorphic">
                <div className="timeline-slider-row">
                  <span className="time-val">0%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={Math.round(timeline)}
                    onChange={e => {
                      setTimeline(parseInt(e.target.value))
                      setIsPlaying(false) // pause on scrub
                    }}
                    className="timeline-scrubber"
                  />
                  <span className="time-val">{Math.round(timeline)}%</span>
                </div>

                <div className="timeline-action-row">
                  {/* Step back */}
                  <button
                    onClick={() => jumpToStep(Math.max(0, activeStepIdx - 1))}
                    className="deck-btn"
                    title="Previous Milestone"
                  >
                    ⏮
                  </button>

                  {/* Play / Pause */}
                  <button
                    onClick={() => {
                      if (timeline >= 100) {
                        setTimeline(0)
                        setIsPlaying(true)
                      } else {
                        setIsPlaying(!isPlaying)
                      }
                    }}
                    className={`deck-btn play-pause-btn ${isPlaying ? 'playing' : ''}`}
                    title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
                  >
                    {isPlaying ? '⏸' : '▶'}
                  </button>

                  {/* Step forward */}
                  <button
                    onClick={() => jumpToStep(Math.min(3, activeStepIdx + 1))}
                    className="deck-btn"
                    title="Next Milestone"
                  >
                    ⏭
                  </button>

                  <div className="vertical-deck-divider" />

                  {/* Play speed multipliers */}
                  <div className="speed-pills-row">
                    {[0.5, 1.0, 2.0].map(s => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        className={`speed-pill ${speed === s ? 'active' : ''}`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      <style jsx global>{`
        .sim-root {
          background: #050A05;
          min-height: calc(100vh - 64px);
          color: #C8F5C8;
          position: relative;
          overflow-x: hidden;
          box-sizing: border-box;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .sim-grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(57, 255, 20, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57, 255, 20, 0.015) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
          z-index: 0;
        }

        .sim-glow-effect {
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: min(800px, 90vw);
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(57, 255, 20, 0.04) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .sim-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 2rem 0.5rem;
          border-bottom: 1px solid rgba(57, 255, 20, 0.05);
          position: relative;
          z-index: 2;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-btn {
          color: #39FF14;
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          padding: 6px 14px;
          border-radius: 8px;
          background: rgba(57, 255, 20, 0.05);
          border: 1px solid rgba(57, 255, 20, 0.15);
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: rgba(57, 255, 20, 0.12);
          box-shadow: 0 0 10px rgba(57, 255, 20, 0.15);
        }

        .divider-line {
          width: 1px;
          height: 32px;
          background: rgba(255, 255, 255, 0.08);
        }

        .header-title {
          font-size: 1.25rem;
          font-weight: 900;
          color: #fff;
          margin: 0;
          letter-spacing: 0.03em;
        }

        .header-subtitle {
          font-size: 0.6rem;
          color: #39FF14;
          margin: 0;
          letter-spacing: 0.25em;
          font-weight: 700;
        }

        /* SELECTION SCREEN */
        .sim-selection-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 3rem 2rem;
          position: relative;
          z-index: 2;
        }

        .selection-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .selection-header h2 {
          font-size: 1.75rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }

        .selection-header p {
          color: rgba(200, 245, 200, 0.5);
          font-size: 0.9rem;
        }

        .sim-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .sim-select-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: all 0.25s ease;
          border-color: rgba(255, 255, 255, 0.05);
        }

        .sim-select-card:hover {
          border-color: rgba(57, 255, 20, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(57, 255, 20, 0.05);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          width: 100%;
          align-items: center;
          margin-bottom: 1rem;
        }

        .card-emoji {
          font-size: 2rem;
        }

        .card-category {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #00D4AA;
          font-size: 0.58rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.1em;
        }

        .card-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #fff;
          margin: 0 0 6px 0;
        }

        .card-desc {
          font-size: 0.78rem;
          line-height: 1.5;
          color: rgba(200, 245, 200, 0.6);
          margin-bottom: 1.5rem;
          flex: 1;
        }

        .launch-sim-btn {
          background: rgba(57, 255, 20, 0.08);
          border: 1px solid rgba(57, 255, 20, 0.25);
          color: #39FF14;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .launch-sim-btn:hover {
          background: rgba(57, 255, 20, 0.15);
          box-shadow: 0 0 12px rgba(57, 255, 20, 0.25);
        }

        /* WORKSPACE */
        .sim-workspace-layout {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 1.25rem;
          padding: 1.25rem 2rem;
          height: calc(100vh - 140px);
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }

        .sim-panel-left,
        .sim-panel-main {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
        }

        .panel-card {
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(10, 20, 10, 0.35);
          backdrop-filter: blur(12px);
          box-sizing: border-box;
        }

        .glassmorphic {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }

        .panel-section-title {
          font-size: 0.62rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.15em;
          margin: 0 0 12px 0;
          text-transform: uppercase;
        }

        .exit-sim-btn {
          align-self: flex-start;
          color: rgba(200, 245, 200, 0.5);
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 0;
          margin-bottom: 8px;
          transition: color 0.2s;
        }

        .exit-sim-btn:hover {
          color: #39FF14;
        }

        .steps-panel-card {
          padding: 1.25rem;
          margin-bottom: 1rem;
          flex-shrink: 0;
        }

        .steps-bullets-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .step-bullet-row {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 4px 0;
          opacity: 0.4;
          transition: all 0.25s;
        }

        .step-bullet-row.active {
          opacity: 1;
        }

        .step-bullet-row.completed {
          opacity: 0.85;
        }

        .bullet-indicator {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.62rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.5);
          transition: all 0.2s;
        }

        .step-bullet-row.active .bullet-indicator {
          border-color: #39FF14;
          background: rgba(57, 255, 20, 0.08);
          color: #39FF14;
          box-shadow: 0 0 8px rgba(57, 255, 20, 0.2);
        }

        .step-bullet-row.completed .bullet-indicator {
          border-color: #00D4AA;
          background: rgba(0, 212, 170, 0.08);
          color: #00D4AA;
        }

        .bullet-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
        }

        .description-panel-card {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .step-desc-wrap {
          display: flex;
          flex-direction: column;
        }

        .enzyme-focus-tag {
          font-size: 0.55rem;
          font-weight: 800;
          color: #00D4AA;
          letter-spacing: 0.1em;
          border: 1px solid rgba(0, 212, 170, 0.2);
          background: rgba(0, 212, 170, 0.05);
          padding: 2px 8px;
          border-radius: 4px;
          align-self: flex-start;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .active-step-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #fff;
          margin: 0 0 6px 0;
        }

        .active-step-summary {
          font-size: 0.78rem;
          line-height: 1.4;
          color: rgba(200, 245, 200, 0.7);
          margin: 0;
        }

        .divider-sub {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 12px 0;
        }

        .active-step-long {
          margin: 0;
          font-size: 0.75rem;
          line-height: 1.6;
          color: rgba(200, 245, 200, 0.5);
        }

        /* VISUAL CANVAS MAIN */
        .visual-canvas-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1.25rem;
          margin-bottom: 1rem;
          min-height: 0;
        }

        .sim-canvas-viewport {
          flex: 1;
          background: rgba(0, 0, 0, 0.45);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.03);
          margin-bottom: 1rem;
          position: relative;
          overflow: hidden;
        }

        .svg-viewport {
          display: block;
        }

        /* TIMELINE DECK */
        .timeline-control-deck {
          padding: 1rem 1.25rem;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: rgba(5, 10, 5, 0.6);
          border-color: rgba(57, 255, 20, 0.05);
        }

        .timeline-slider-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .time-val {
          font-family: monospace;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          width: 32px;
          text-align: center;
        }

        .timeline-scrubber {
          flex: 1;
          -webkit-appearance: none;
          height: 4px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
          cursor: pointer;
        }

        .timeline-scrubber::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #39FF14;
          box-shadow: 0 0 8px rgba(57, 255, 20, 0.5);
          transition: transform 0.15s;
        }

        .timeline-scrubber::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }

        .timeline-action-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .deck-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .deck-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .play-pause-btn {
          border-color: rgba(57, 255, 20, 0.25);
          color: #39FF14;
          background: rgba(57, 255, 20, 0.05);
        }

        .play-pause-btn.playing {
          border-color: rgba(0, 212, 170, 0.25);
          color: #00D4AA;
          background: rgba(0, 212, 170, 0.05);
        }

        .vertical-deck-divider {
          width: 1px;
          height: 24px;
          background: rgba(255, 255, 255, 0.08);
        }

        .speed-pills-row {
          display: flex;
          gap: 6px;
        }

        .speed-pill {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(200, 245, 200, 0.5);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .speed-pill:hover {
          color: #fff;
          background: rgba(255,255,255,0.05);
        }

        .speed-pill.active {
          color: #00D4AA;
          background: rgba(0, 212, 170, 0.08);
          border-color: rgba(0, 212, 170, 0.25);
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 900px) {
          .sim-workspace-layout {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto 380px;
            padding: 1rem;
            gap: 1rem;
            height: auto;
          }
          .sim-panel-left {
            height: auto;
          }
          .description-panel-card {
            height: 240px;
          }
          .sim-panel-main {
            height: 480px;
          }
          .sim-cards-grid {
            grid-template-columns: 1fr;
          }
          .sim-header {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
