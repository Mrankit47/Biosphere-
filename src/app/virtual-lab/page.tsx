'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BackLink } from '@/components/ds'
import { BioIcon } from '@/components/ui/navigation/BioIcon'

// Define TS Interfaces
interface QuizQuestion {
  q: string
  options: string[]
  ans: number // 0-indexed answer index
  explanation: string
}

interface Step {
  title: string
  instruction: string
  check: (inputs: Record<string, any>) => boolean
  successMsg: string
}

interface LabExperiment {
  id: string
  name: string
  icon: string
  desc: string
  category: string
  steps: Step[]
  quiz: QuizQuestion[]
}

const EXPERIMENTS: LabExperiment[] = [
  {
    id: 'photosynthesis',
    name: 'Photosynthesis Limiting Factors',
    icon: 'photosynthesis',
    desc: 'Measure oxygen gas bubbles released by Elodea weed to investigate how light intensity, wavelength, and carbon dioxide limit cellular chloroplast productivity.',
    category: 'Plant Physiology',
    steps: [
      {
        title: 'Provide Carbon Source',
        instruction: 'Add Sodium Bicarbonate (NaHCO3) to the beaker to supply dissolved carbon dioxide. Set NaHCO3 concentration to 3 drops.',
        check: (inputs) => inputs.drops === 3,
        successMsg: 'Carbon dioxide supplied successfully! The chloroplasts now have carbon input.'
      },
      {
        title: 'Position Light Source',
        instruction: 'Move the light source close to the plant to maximize photon absorption. Adjust Light Distance to 10 cm or closer.',
        check: (inputs) => inputs.distance <= 10,
        successMsg: 'Light intensity increased. High photon count will power Photolysis.'
      },
      {
        title: 'Apply Active Absorption Filter',
        instruction: 'Chlorophyll primarily absorbs red and blue light, reflecting green. Select the Blue Light wavelength filter.',
        check: (inputs) => inputs.wavelength === 'blue',
        successMsg: 'Blue filter applied. Chlorophyll pigments are now absorbing energy at peak wavelengths.'
      },
      {
        title: 'Run Photosynthesis Log',
        instruction: 'Click the "Measure Photo-Rate" button to run a count of oxygen bubbles released over a simulated 60-second trial.',
        check: (inputs) => inputs.reactionRun === true,
        successMsg: 'Trial logged successfully! You can analyze how limiting factors affect bubble production.'
      }
    ],
    quiz: [
      {
        q: 'Why does applying a green light filter result in almost zero oxygen bubble production?',
        options: [
          'Green light is too high in energy and damages the plant.',
          'Chlorophyll pigments reflect green light rather than absorbing it.',
          'Green light freezes the stomata of the leaves.',
          'Water blocks green light from passing through.'
        ],
        ans: 1,
        explanation: 'Chlorophyll reflects green light, which is why most leaves appear green. Because it reflects rather than absorbs this wavelength, light reactions cannot be powered.'
      },
      {
        q: 'What is the role of adding Sodium Bicarbonate (NaHCO3) in this experiment?',
        options: [
          'It changes the water temperature.',
          'It dissolves oxygen into the beaker.',
          'It provides carbon dioxide as a substrate for the Calvin Cycle.',
          'It acts as a chemical catalyst to split water.'
        ],
        ans: 2,
        explanation: 'Sodium Bicarbonate dissolves to release CO2. Carbon dioxide is a required input for the Calvin Cycle (light-independent reactions) to assemble glucose.'
      },
      {
        q: 'Which process directly produces the oxygen gas bubbles observed floating from the Elodea plant?',
        options: [
          'The splitting of water molecules (photolysis) in Light Reactions.',
          'The breakdown of glucose in Cellular Respiration.',
          'The fixing of carbon dioxide in the Calvin Cycle.',
          'The evaporation of sap due to heat.'
        ],
        ans: 0,
        explanation: 'During the light-dependent reactions, light energy absorbed by Photosystem II splits water (H2O) into hydrogen ions, electrons, and oxygen gas (O2) as a metabolic byproduct.'
      }
    ]
  },
  {
    id: 'enzyme',
    name: 'Enzyme Catalysis (Catalase)',
    icon: 'virtual-lab',
    desc: 'Investigate how temperature and pH affect the speed at which Catalase enzyme breaks down toxic Hydrogen Peroxide into water and oxygen gas.',
    category: 'Biochemistry',
    steps: [
      {
        title: 'Set Optimum pH Level',
        instruction: 'Catalase operates optimally in neutral conditions. Set pH to 7.',
        check: (inputs) => inputs.ph === 7,
        successMsg: 'pH set to neutral (7). Active site amino acid sidegroups are stable.'
      },
      {
        title: 'Set Physiological Temperature',
        instruction: 'Enzymes function fastest at body temperature. Set Temperature to 37°C.',
        check: (inputs) => inputs.temp === 37,
        successMsg: 'Temperature set to 37°C. Substrates have high kinetic collision rate.'
      },
      {
        title: 'Load Enzyme Volume',
        instruction: 'Increase Catalase enzyme concentration to 80% to ensure abundant active sites.',
        check: (inputs) => inputs.enzyme >= 80,
        successMsg: 'Enzyme volume loaded. Ready to bind H2O2 molecules.'
      },
      {
        title: 'Execute Catalysis Reaction',
        instruction: 'Click the "Run Catalysis" button to combine reactants and measure the froth volume in the graduated test tube.',
        check: (inputs) => inputs.reactionRun === true,
        successMsg: 'Reaction run logged! You measured the maximum catalytic foam height.'
      }
    ],
    quiz: [
      {
        q: 'What molecular change happens to Catalase when heated to 80°C?',
        options: [
          'It expands in size to fit more hydrogen peroxide.',
          'It is converted into a lipid molecule.',
          'It denatures; its tertiary structure unfolds, losing its active site shape.',
          'It freezes into a crystal grid.'
        ],
        ans: 2,
        explanation: 'High thermal energy breaks the weak hydrogen and ionic bonds holding the enzyme\'s tertiary structure together. The enzyme denatures and the active site can no longer bind the substrate.'
      },
      {
        q: 'Why does the reaction foam and bubble when Catalase is active?',
        options: [
          'Carbon dioxide gas is released by the yeast cells.',
          'Oxygen gas bubbles are produced as hydrogen peroxide is broken down.',
          'Hydrogen peroxide evaporates rapidly.',
          'Water is boiling due to the heat generated.'
        ],
        ans: 1,
        explanation: 'Catalase breaks down Hydrogen Peroxide (2H2O2) into Water (2H2O) and Oxygen gas (O2). The escaping oxygen gas produces a thick foam in the presence of liquid.'
      },
      {
        q: 'What would happen to the reaction if you added more Hydrogen Peroxide when the reaction is at saturation?',
        options: [
          'The reaction rate would increase exponentially.',
          'The reaction would immediately stop.',
          'The rate would stay the same because all enzyme active sites are occupied.',
          'The Catalase would begin to dissolve.'
        ],
        ans: 2,
        explanation: 'Once all enzyme active sites are fully occupied (substrate saturation), adding more substrate cannot increase the reaction rate unless more enzyme is supplied.'
      }
    ]
  }
]

export default function VirtualLab() {
  const [mounted, setMounted] = useState(false)
  const [activeLabId, setActiveLabId] = useState<string | null>(null)
  
  // Simulation Input Variables
  const [inputs, setInputs] = useState<Record<string, any>>({
    drops: 0,
    distance: 35,
    wavelength: 'white',
    ph: 7,
    temp: 20,
    enzyme: 40,
    reactionRun: false
  })

  // Simulation Running State
  const [isSimulating, setIsSimulating] = useState(false)
  const [reactionLog, setReactionLog] = useState<{ rate: number; status: string } | null>(null)
  const [progress, setProgress] = useState<string[]>([])
  
  // Quiz State
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [quizFinished, setQuizFinished] = useState(false)
  const [quizScore, setQuizScore] = useState(0)

  // Initialize
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('biosphere_completed_labs')
    if (saved) setProgress(JSON.parse(saved))
  }, [])

  const activeLab = useMemo(() => {
    return EXPERIMENTS.find(e => e.id === activeLabId) || null
  }, [activeLabId])

  // Reset Variables on Switch
  const selectLab = (id: string) => {
    setActiveLabId(id)
    setInputs({
      drops: 0,
      distance: 35,
      wavelength: 'white',
      ph: 7,
      temp: 20,
      enzyme: 40,
      reactionRun: false
    })
    setReactionLog(null)
    setShowQuiz(false)
    setCurrentQ(0)
    setAnswers({})
    setQuizFinished(false)
    setQuizScore(0)
  }

  // Calculate Photosynthesis Rate
  const photosynthesisResult = useMemo(() => {
    if (activeLabId !== 'photosynthesis') return { rate: 0, bubbleSpeed: 0 }
    
    // Light intensity: inverse relation with distance
    const intensity = Math.max(0, (50 - inputs.distance) / 50)
    
    // Carbon source drops factor
    let co2 = 0.1
    if (inputs.drops === 1) co2 = 0.4
    if (inputs.drops === 2) co2 = 0.75
    if (inputs.drops >= 3) co2 = 1.0

    // Light wavelength absorption factor
    let wavelengthMultiplier = 0.95 // White light
    if (inputs.wavelength === 'blue') wavelengthMultiplier = 1.0
    if (inputs.wavelength === 'red') wavelengthMultiplier = 0.85
    if (inputs.wavelength === 'green') wavelengthMultiplier = 0.1 // Green is reflected

    const rate = Math.round(intensity * co2 * wavelengthMultiplier * 120) // Max 120 bubbles/min
    const speed = rate === 0 ? 0 : Math.max(0.4, 6 - (rate / 20)) // Smaller number = faster animation cycle
    
    return { rate, bubbleSpeed: speed }
  }, [inputs.distance, inputs.drops, inputs.wavelength, activeLabId])

  // Calculate Enzyme Froth Height and Status
  const enzymeResult = useMemo(() => {
    if (activeLabId !== 'enzyme') return { rate: 0, status: 'Stable', frothHeight: 0 }

    // Temperature kinetics and denaturation
    let tempFactor = 0
    let status = 'Stable'

    if (inputs.temp >= 60) {
      tempFactor = 0
      status = 'DENATURED (Excess heat ruptured hydrogen bonds)'
    } else if (inputs.temp >= 45) {
      tempFactor = 0.3
      status = 'Partial Denaturation active'
    } else if (inputs.temp >= 35 && inputs.temp <= 40) {
      tempFactor = 1.0 // Physiological optimum
      status = 'Optimum Enzymatic Speed'
    } else {
      tempFactor = inputs.temp / 35 // Low energy kinetic limits
      status = 'Low Kinetic Collisions'
    }

    // pH level factor (denatures at pH <= 3 or pH >= 11)
    let phFactor = 0
    if (inputs.ph <= 3 || inputs.ph >= 12) {
      phFactor = 0
      status = `DENATURED (pH ${inputs.ph} warped active-site charge)`
    } else {
      phFactor = Math.max(0, 1.0 - Math.abs(inputs.ph - 7) / 4.5)
    }

    const enzymeMultiplier = inputs.enzyme / 100
    const rate = tempFactor * phFactor * enzymeMultiplier
    const height = Math.round(rate * 160) // Max 160px foam height

    return { rate: Math.round(rate * 100), status, frothHeight: height }
  }, [inputs.ph, inputs.temp, inputs.enzyme, activeLabId])

  // Process checklist verification
  const checklistStatus = useMemo(() => {
    if (!activeLab) return []
    return activeLab.steps.map(step => step.check(inputs))
  }, [activeLab, inputs])

  // Check if all steps completed
  const allStepsCompleted = useMemo(() => {
    if (checklistStatus.length === 0) return false
    return checklistStatus.every(s => s === true)
  }, [checklistStatus])

  // Run simulation trigger
  const runSimulation = () => {
    if (!activeLab) return
    setIsSimulating(true)
    setReactionLog(null)
    setInputs(prev => ({ ...prev, reactionRun: false }))

    setTimeout(() => {
      setIsSimulating(false)
      setInputs(prev => ({ ...prev, reactionRun: true }))
      if (activeLab.id === 'photosynthesis') {
        setReactionLog({
          rate: photosynthesisResult.rate,
          status: photosynthesisResult.rate === 0 ? 'Light threshold limiting' : 'Photosynthesis Active'
        })
      } else {
        setReactionLog({
          rate: enzymeResult.rate,
          status: enzymeResult.status
        })
      }
    }, 2000)
  }

  // Handle Quiz selection
  const handleAnswerSelect = (optIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentQ]: optIdx }))
  }

  const submitQuiz = () => {
    if (!activeLab) return
    let score = 0
    activeLab.quiz.forEach((q, idx) => {
      if (answers[idx] === q.ans) score++
    })
    setQuizScore(score)
    setQuizFinished(true)

    // Earn certification if score is 3/3
    if (score === 3) {
      setProgress(prev => {
        const next = prev.includes(activeLab.id) ? prev : [...prev, activeLab.id]
        localStorage.setItem('biosphere_completed_labs', JSON.stringify(next))
        return next
      })
    }
  }

  if (activeLabId && !activeLab) {
    return (
      <div className="lab-root">
        <div className="lab-selection-container text-center">
          <p>Lab module not found.</p>
          <button onClick={() => setActiveLabId(null)} className="start-lab-btn">
            Return to Selection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="lab-root">
      <div className="lab-grid-bg" />
      <div className="lab-glow-effect" />

      {/* HEADER SECTION */}
      <header className="lab-header">
        <div className="header-left">
          <BackLink href="/" label="Home" />
          <div>
            <h1 className="header-title">VIRTUAL BIOLOGY LAB</h1>
            <p className="header-subtitle">INTERACTIVE EXPERIMENT SIMULATOR</p>
          </div>
        </div>
      </header>

      {!activeLabId ? (
        /* LANDING PAGE / LAB SELECTION */
        <main className="lab-selection-container">
          <div className="selection-header">
            <h2>SELECT EXPERIMENT MODULE</h2>
            <p>Conduct chemical and physiological investigations inside a controlled environment.</p>
          </div>

          <div className="lab-cards-grid">
            {EXPERIMENTS.map(lab => {
              const isDone = progress.includes(lab.id)
              return (
                <div key={lab.id} className="lab-select-card glassmorphic">
                  <div className="card-top">
                    <span className="card-icon text-[#39FF14] inline-flex items-center justify-center">
                      <BioIcon name={lab.icon} size={28} />
                    </span>
                    {isDone && <span className="completed-badge">✓ CERTIFIED</span>}
                  </div>
                  <h3 className="card-title">{lab.name}</h3>
                  <span className="card-category">{lab.category}</span>
                  <p className="card-desc">{lab.desc}</p>
                  <button onClick={() => selectLab(lab.id)} className="start-lab-btn">
                    Launch Simulator →
                  </button>
                </div>
              )
            })}
          </div>
        </main>
      ) : (
        /* LAB RUNNER WORKSPACE */
        <main className="lab-workspace-layout">
          {/* LEFT: Checklist & Controls */}
          <section className="lab-panel-left">
            <button onClick={() => setActiveLabId(null)} className="exit-lab-btn">
              ← Exit Lab
            </button>

            {/* Checklist guidance */}
            <div className="panel-card glassmorphic checklist-card">
              <h3 className="panel-section-title">📝 STEP-BY-STEP GUIDANCE</h3>
              <div className="steps-list">
                {activeLab!.steps.map((step, idx) => {
                  const isDone = checklistStatus[idx]
                  const isCurrent = idx === 0 || checklistStatus[idx - 1]
                  return (
                    <div
                      key={idx}
                      className={`step-item ${isDone ? 'checked' : ''} ${isCurrent && !isDone ? 'active-step' : ''}`}
                    >
                      <div className="step-checkbox">
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <div className="step-content">
                        <span className="step-item-title">{step.title}</span>
                        <p className="step-item-instruction">{step.instruction}</p>
                        {isDone && <p className="step-success-msg">✓ {step.successMsg}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Interactive variables control */}
            <div className="panel-card glassmorphic controls-card">
              <h3 className="panel-section-title">🎛️ SIMULATOR ADJUSTMENTS</h3>
              
              {activeLabId === 'photosynthesis' ? (
                <div className="controls-group">
                  {/* NaHCO3 Drops Counter */}
                  <div className="control-row">
                    <div className="control-label-wrap">
                      <span className="control-label">Sodium Bicarbonate:</span>
                      <span className="control-val">{inputs.drops} drops</span>
                    </div>
                    <div className="counter-buttons-wrap">
                      <button
                        onClick={() => setInputs(p => ({ ...p, drops: Math.max(0, p.drops - 1) }))}
                        className="counter-btn"
                        disabled={inputs.drops === 0}
                      >
                        -
                      </button>
                      <button
                        onClick={() => setInputs(p => ({ ...p, drops: Math.min(5, p.drops + 1) }))}
                        className="counter-btn"
                        disabled={inputs.drops === 5}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Light Distance Slider */}
                  <div className="control-row">
                    <div className="control-label-wrap">
                      <span className="control-label">Light Distance:</span>
                      <span className="control-val">{inputs.distance} cm</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={inputs.distance}
                      onChange={e => setInputs(p => ({ ...p, distance: parseInt(e.target.value) }))}
                      className="lab-slider"
                    />
                  </div>

                  {/* Light Filter Wavelength */}
                  <div className="control-row">
                    <div className="control-label-wrap">
                      <span className="control-label">Light Filter Filter:</span>
                      <span className="control-val">{inputs.wavelength.toUpperCase()}</span>
                    </div>
                    <select
                      value={inputs.wavelength}
                      onChange={e => setInputs(p => ({ ...p, wavelength: e.target.value }))}
                      className="lab-select"
                    >
                      <option value="white">White Light (Full Spectrum)</option>
                      <option value="blue">Blue Filter (450nm)</option>
                      <option value="red">Red Filter (660nm)</option>
                      <option value="green">Green Filter (530nm)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="controls-group">
                  {/* pH Slider */}
                  <div className="control-row">
                    <div className="control-label-wrap">
                      <span className="control-label">Solution pH Level:</span>
                      <span className="control-val">pH {inputs.ph}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="14"
                      value={inputs.ph}
                      onChange={e => setInputs(p => ({ ...p, ph: parseInt(e.target.value) }))}
                      className="lab-slider"
                    />
                  </div>

                  {/* Temperature Slider */}
                  <div className="control-row">
                    <div className="control-label-wrap">
                      <span className="control-label">Reaction Temperature:</span>
                      <span className="control-val">{inputs.temp} °C</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={inputs.temp}
                      onChange={e => setInputs(p => ({ ...p, temp: parseInt(e.target.value) }))}
                      className="lab-slider"
                    />
                  </div>

                  {/* Enzyme Concentration Slider */}
                  <div className="control-row">
                    <div className="control-label-wrap">
                      <span className="control-label">Catalase Enzyme Concentration:</span>
                      <span className="control-val">{inputs.enzyme} %</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={inputs.enzyme}
                      onChange={e => setInputs(p => ({ ...p, enzyme: parseInt(e.target.value) }))}
                      className="lab-slider"
                    />
                  </div>
                </div>
              )}

              {/* Action runner button */}
              <button
                onClick={runSimulation}
                className="run-reaction-btn"
                disabled={isSimulating}
              >
                {isSimulating ? 'SIMULATING EXPERIMENT...' : activeLabId === 'photosynthesis' ? 'Measure Photo-Rate ⏳' : 'Run Catalysis 🧪'}
              </button>
            </div>
          </section>

          {/* CENTER: Animation Simulation View */}
          <section className="lab-panel-center">
            <div className="panel-card glassmorphic simulation-container">
              <h3 className="panel-section-title">🖥️ LIVE MOLECULAR SIMULATION</h3>

              {activeLabId === 'photosynthesis' ? (
                /* Photosynthesis SVG Animation */
                <div className="simulation-canvas-wrap">
                  {/* Light Source Beam */}
                  <div
                    className="light-beam-layer"
                    style={{
                      opacity: Math.max(0.1, (50 - inputs.distance) / 50),
                      background: `linear-gradient(90deg, transparent, ${
                        inputs.wavelength === 'blue'
                          ? 'rgba(37, 99, 235, 0.25)'
                          : inputs.wavelength === 'red'
                          ? 'rgba(239, 68, 68, 0.25)'
                          : inputs.wavelength === 'green'
                          ? 'rgba(16, 185, 129, 0.25)'
                          : 'rgba(255, 255, 255, 0.25)'
                      } 50%, transparent)`,
                      width: '100%',
                      height: '80px',
                      position: 'absolute',
                      top: '20px',
                      left: 0,
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Laboratory Beaker */}
                  <svg className="beaker-svg" viewBox="0 0 200 240" width="180" height="220">
                    {/* Beaker Outline */}
                    <path d="M40 20 L40 220 A10 10 0 0 0 50 230 L150 230 A10 10 0 0 0 160 220 L160 20" fill="none" stroke="#fff" strokeWidth="2.5" />
                    {/* Water Level */}
                    <rect x="42.5" y="60" width="115" height="168" fill="rgba(56, 189, 248, 0.12)" />
                    {/* Water Surface */}
                    <ellipse cx="100" cy="60" rx="57.5" ry="5" fill="rgba(56, 189, 248, 0.25)" />
                    
                    {/* Elodea Weed Stem */}
                    <path d="M100 230 Q95 150 100 70" fill="none" stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" />
                    {/* Leaves */}
                    <path d="M100 200 Q120 195 125 190 Q110 195 100 200" fill="#047857" stroke="#10b981" />
                    <path d="M100 200 Q80 195 75 190 Q90 195 100 200" fill="#047857" stroke="#10b981" />
                    
                    <path d="M98 160 Q118 150 128 145 Q108 155 98 160" fill="#047857" stroke="#10b981" />
                    <path d="M98 160 Q78 150 68 145 Q88 155 98 160" fill="#047857" stroke="#10b981" />
                    
                    <path d="M100 120 Q120 110 125 100 Q110 115 100 120" fill="#047857" stroke="#10b981" />
                    <path d="M100 120 Q80 110 75 100 Q90 115 100 120" fill="#047857" stroke="#10b981" />

                    <path d="M100 85 Q115 75 120 68 Q108 80 100 85" fill="#047857" stroke="#10b981" />
                    <path d="M100 85 Q85 75 80 68 Q92 80 100 85" fill="#047857" stroke="#10b981" />

                    {/* Oxygen Bubbles floating up */}
                    {photosynthesisResult.rate > 0 && !isSimulating && (
                      <g className="oxygen-bubbles-group">
                        <ellipse cx="102" cy="180" rx="3" ry="3" fill="rgba(255,255,255,0.7)" className="bubble bubble-1" style={{ '--speed': `${photosynthesisResult.bubbleSpeed}s` } as React.CSSProperties} />
                        <ellipse cx="98" cy="140" rx="2.5" ry="2.5" fill="rgba(255,255,255,0.7)" className="bubble bubble-2" style={{ '--speed': `${photosynthesisResult.bubbleSpeed * 1.2}s` } as React.CSSProperties} />
                        <ellipse cx="101" cy="100" rx="3.5" ry="3.5" fill="rgba(255,255,255,0.7)" className="bubble bubble-3" style={{ '--speed': `${photosynthesisResult.bubbleSpeed * 0.8}s` } as React.CSSProperties} />
                      </g>
                    )}
                  </svg>

                  {/* Light Source Lamp */}
                  <div
                    className="lamp-fixture"
                    style={{
                      transform: `translateX(${(inputs.distance - 25) * 2.5}px)`,
                      transition: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'
                    }}
                  >
                    💡 Light Lamp ({inputs.distance}cm)
                  </div>
                </div>
              ) : (
                /* Enzyme Catalysis SVG Animation */
                <div className="simulation-canvas-wrap">
                  <div className="test-tube-panel">
                    <svg className="test-tube-svg" viewBox="0 0 100 240" width="100" height="240">
                      {/* Test Tube Body */}
                      <path d="M35 15 L35 195 A15 15 0 0 0 65 195 L65 15" fill="none" stroke="#fff" strokeWidth="2.5" />
                      
                      {/* Base Hydrogen Peroxide (H2O2) reactant */}
                      <rect x="36.5" y="145" width="27.5" height="52" fill="rgba(168, 85, 247, 0.15)" />
                      {/* Substrate Surface */}
                      <ellipse cx="50" cy="145" rx="13.7" ry="2" fill="rgba(168, 85, 247, 0.3)" />

                      {/* Foam / Froth Rising (Active reaction) */}
                      {inputs.reactionRun && !isSimulating && enzymeResult.frothHeight > 0 && (
                        <g>
                          <rect
                            x="36.5"
                            y={145 - enzymeResult.frothHeight}
                            width="27.5"
                            height={enzymeResult.frothHeight}
                            fill="rgba(255,255,255,0.22)"
                            className="foam-rect"
                            style={{
                              transformOrigin: 'bottom',
                              animation: 'foam-grow 1.8s ease-out forwards'
                            }}
                          />
                          {/* Bubbles inside reaction */}
                          <circle cx="42" cy="160" r="1.5" fill="rgba(255,255,255,0.8)" className="catalysis-bubble" />
                          <circle cx="58" cy="130" r="2" fill="rgba(255,255,255,0.8)" className="catalysis-bubble" />
                          <circle cx="48" cy="100" r="1.2" fill="rgba(255,255,255,0.8)" className="catalysis-bubble" />
                          <circle cx="52" cy="80" r="2.2" fill="rgba(255,255,255,0.8)" className="catalysis-bubble" />
                        </g>
                      )}
                    </svg>
                  </div>
                </div>
              )}

              {/* Reaction log console output */}
              <div className="reaction-console glassmorphic">
                <span className="console-label">DIAGNOSTIC LOGGER SCAN:</span>
                {isSimulating ? (
                  <p className="console-text animate-pulse">Running chemical collision simulation... counting product yield.</p>
                ) : reactionLog ? (
                  <div className="log-output-grid">
                    <div className="log-col">
                      <span className="log-label">Relative Rate:</span>
                      <span className="log-val text-neon-green">{reactionLog.rate} {activeLabId === 'photosynthesis' ? 'bubbles/min' : '% of max activity'}</span>
                    </div>
                    <div className="log-col">
                      <span className="log-label">Active Site Status:</span>
                      <span className="log-val text-neon-blue">{reactionLog.status}</span>
                    </div>
                  </div>
                ) : (
                  <p className="console-text">System loaded. Ready for trial execution.</p>
                )}
              </div>
            </div>
          </section>

          {/* RIGHT: Quiz trigger / Unlock Panel */}
          <section className="lab-panel-right">
            {!showQuiz ? (
              <div className="panel-card glassmorphic quiz-unlock-card">
                <h3 className="panel-section-title">🎓 CERTIFICATION STATUS</h3>
                {allStepsCompleted && inputs.reactionRun ? (
                  <div className="quiz-unlock-unlocked text-center">
                    <span className="unlock-emoji">🔓</span>
                    <h4>LAB CHECKS COMPLETE</h4>
                    <p>You successfully demonstrated how inputs govern the physiological rate in this virtual module.</p>
                    <button onClick={() => setShowQuiz(true)} className="launch-quiz-btn">
                      Take Post-Lab Quiz
                    </button>
                  </div>
                ) : (
                  <div className="quiz-unlock-locked text-center">
                    <span className="unlock-emoji">🔒</span>
                    <h4>QUIZ IS LOCKED</h4>
                    <p>Complete all 4 items on the step-by-step guidance list to unlock the lab certificate quiz.</p>
                  </div>
                )}
              </div>
            ) : (
              /* ACTIVE POST-LAB QUIZ */
              <div className="panel-card glassmorphic quiz-active-card">
                <h3 className="panel-section-title">🧠 POST-LAB EVALUATION</h3>
                
                {!quizFinished ? (
                  <div className="quiz-progress-wrap">
                    <span className="quiz-q-indicator">Question {currentQ + 1} of 3</span>
                    <h4 className="quiz-question-title">{activeLab!.quiz[currentQ].q}</h4>
                    
                    <div className="quiz-options-list">
                      {activeLab!.quiz[currentQ].options.map((opt, idx) => {
                        const isSelected = answers[currentQ] === idx
                        return (
                          <button
                            key={idx}
                            onClick={() => handleAnswerSelect(idx)}
                            className={`quiz-option-row ${isSelected ? 'selected' : ''}`}
                          >
                            <span className="option-indicator">{String.fromCharCode(65 + idx)}</span>
                            <span className="option-text">{opt}</span>
                          </button>
                        )
                      })}
                    </div>

                    <div className="quiz-nav-row">
                      {currentQ > 0 && (
                        <button onClick={() => setCurrentQ(q => q - 1)} className="quiz-nav-btn">
                          Previous
                        </button>
                      )}
                      
                      {currentQ < 2 ? (
                        <button
                          onClick={() => setCurrentQ(q => q + 1)}
                          disabled={answers[currentQ] === undefined}
                          className="quiz-nav-btn"
                        >
                          Next Question
                        </button>
                      ) : (
                        <button
                          onClick={submitQuiz}
                          disabled={answers[currentQ] === undefined}
                          className="quiz-submit-btn"
                        >
                          Submit Quiz
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* QUIZ COMPLETED REPORT */
                  <div className="quiz-report-wrap text-center">
                    <span className="report-badge">{quizScore === 3 ? '🎉 CERTIFICATE EARNED' : '❌ RETRY LAB'}</span>
                    <h4 className="report-title">Score: {quizScore} / 3</h4>
                    <p className="report-desc">
                      {quizScore === 3
                        ? 'Congratulations! You proved 100% molecular proficiency in this simulation topic. The certificate badge has been saved.'
                        : 'You scored below the passing mark. Review the explanations below and restart the trial to pass.'}
                    </p>

                    <div className="quiz-explanations-list">
                      {activeLab!.quiz.map((q, idx) => (
                        <div key={idx} className="explanation-card">
                          <span className="exp-question-title">Q{idx + 1}: {q.q}</span>
                          <span className={`exp-status ${answers[idx] === q.ans ? 'correct' : 'incorrect'}`}>
                            {answers[idx] === q.ans ? 'Correct' : 'Incorrect'}
                          </span>
                          <p className="exp-explanation-text">Explanation: {q.explanation}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => selectLab(activeLab!.id)}
                      className="quiz-retry-btn"
                    >
                      {quizScore === 3 ? 'Rerun Simulation' : 'Retry Quiz'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      )}

      <style jsx global>{`
        .lab-root {
          background: var(--ds-bg-primary);
          min-height: calc(100vh - 64px);
          color: var(--ds-fg);
          position: relative;
          overflow-x: hidden;
          box-sizing: border-box;
          font-family: inherit;
        }

        .lab-grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(57, 255, 20, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57, 255, 20, 0.015) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
          z-index: 0;
        }

        .lab-glow-effect {
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

        .lab-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 2rem 0.5rem;
          border-bottom: 1px solid var(--ds-border-muted);
          position: relative;
          z-index: 2;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-btn {
          color: var(--ds-accent);
          text-decoration: none;
          font-size: 0.82rem;
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

        .divider-line {
          width: 1px;
          height: 32px;
          background: var(--ds-border-muted);
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
          color: var(--ds-accent);
          margin: 0;
          letter-spacing: 0.25em;
          font-weight: 700;
        }

        /* LANDING PAGE */
        .lab-selection-container {
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
          color: var(--ds-fg-muted);
          font-size: 0.9rem;
        }

        .lab-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .lab-select-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: all 0.25s ease;
          border-color: var(--ds-border-muted);
        }

        .lab-select-card:hover {
          border-color: var(--ds-accent);
          transform: translateY(-2px);
          box-shadow: var(--ds-glow-sm);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          width: 100%;
          align-items: center;
          margin-bottom: 1rem;
        }

        .card-icon {
          font-size: 2rem;
        }

        .completed-badge {
          background: var(--ds-accent-faint);
          border: 1px solid var(--ds-border-accent);
          color: var(--ds-accent);
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
          margin: 0 0 4px 0;
        }

        .card-category {
          font-size: 0.6rem;
          text-transform: uppercase;
          color: var(--ds-accent);
          font-weight: 700;
          letter-spacing: 0.1em;
          margin-bottom: 12px;
        }

        .card-desc {
          font-size: 0.78rem;
          line-height: 1.5;
          color: var(--ds-fg-muted);
          margin-bottom: 1.5rem;
          flex: 1;
        }

        .start-lab-btn {
          background: var(--ds-accent-faint);
          border: 1px solid var(--ds-border-accent);
          color: var(--ds-accent);
          font-size: 0.78rem;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .start-lab-btn:hover {
          background: var(--ds-accent-subtle);
          box-shadow: var(--ds-glow-sm);
        }

        /* LAB WORKSPACE LAYOUT */
        .lab-workspace-layout {
          display: grid;
          grid-template-columns: 360px 1fr 340px;
          gap: 1.25rem;
          padding: 1.25rem 2rem;
          height: calc(100vh - 140px);
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }

        .lab-panel-left,
        .lab-panel-center,
        .lab-panel-right {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
        }

        .panel-card {
          border-radius: 16px;
          border: 1px solid var(--ds-border-muted);
          background: var(--ds-surface-overlay);
          backdrop-filter: blur(12px);
          box-sizing: border-box;
        }

        .glassmorphic {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }

        .panel-section-title {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.1em;
          margin: 0 0 14px 0;
          text-transform: uppercase;
        }

        .exit-lab-btn {
          align-self: flex-start;
          color: var(--ds-fg-subtle);
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 0;
          margin-bottom: 8px;
          transition: color 0.2s;
        }

        .exit-lab-btn:hover {
          color: var(--ds-accent);
        }

        .checklist-card {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
          margin-bottom: 1rem;
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .step-item {
          display: flex;
          gap: 12px;
          opacity: 0.4;
          transition: all 0.3s;
        }

        .step-item.checked {
          opacity: 1;
        }

        .step-item.active-step {
          opacity: 1;
        }

        .step-checkbox {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1px solid var(--ds-border-muted);
          background: var(--ds-surface-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
          flex-shrink: 0;
        }

        .step-item.checked .step-checkbox {
          border-color: var(--ds-border-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
        }

        .step-item.active-step .step-checkbox {
          border-color: var(--ds-accent);
          background: var(--ds-accent-faint);
          color: var(--ds-accent);
          box-shadow: var(--ds-glow-sm);
        }

        .step-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .step-item-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #fff;
        }

        .step-item-instruction {
          margin: 0;
          font-size: 0.72rem;
          color: var(--ds-fg-muted);
          line-height: 1.4;
        }

        .step-success-msg {
          margin: 2px 0 0 0;
          font-size: 0.65rem;
          color: var(--ds-accent);
          font-weight: 600;
        }

        /* CONTROLS CARD */
        .controls-card {
          padding: 1.25rem;
          flex-shrink: 0;
        }

        .controls-group {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 1.25rem;
        }

        .control-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .control-label-wrap {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          font-weight: 700;
        }

        .control-label {
          color: var(--ds-fg-subtle);
        }

        .control-val {
          color: #fff;
        }

        .counter-buttons-wrap {
          display: flex;
          gap: 8px;
        }

        .counter-btn {
          flex: 1;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          color: #fff;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 4px 0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .counter-btn:hover:not(:disabled) {
          background: var(--ds-accent-faint);
          border-color: var(--ds-border-accent);
        }

        .counter-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .lab-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: var(--ds-surface-subtle);
          outline: none;
        }

        .lab-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--ds-accent);
          cursor: pointer;
          box-shadow: var(--ds-glow-sm);
          transition: transform 0.2s;
        }

        .lab-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }

        .lab-select {
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          border-radius: 8px;
          color: #fff;
          font-size: 0.75rem;
          padding: 6px 10px;
          outline: none;
          cursor: pointer;
        }

        .run-reaction-btn {
          width: 100%;
          background: var(--ds-accent-faint);
          border: 1px solid var(--ds-border-accent);
          color: var(--ds-accent);
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.04em;
          padding: 10px 0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .run-reaction-btn:hover:not(:disabled) {
          background: var(--ds-accent-subtle);
          box-shadow: var(--ds-glow-sm);
        }

        .run-reaction-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* CENTER SIMULATION */
        .simulation-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1.25rem;
          min-height: 0;
        }

        .simulation-canvas-wrap {
          flex: 1;
          background: var(--ds-surface-raised);
          border-radius: 12px;
          border: 1px solid var(--ds-border-muted);
          margin-bottom: 1rem;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .beaker-svg, .test-tube-svg {
          filter: drop-shadow(0 0 15px rgba(255,255,255,0.05));
        }

        .lamp-fixture {
          margin-top: 16px;
          font-size: 0.65rem;
          font-family: monospace;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          color: #fff;
          padding: 4px 10px;
          border-radius: 4px;
        }

        /* Oxygen Bubbles animations */
        .bubble {
          opacity: 0;
          transform: translateY(0);
          animation: floatUp var(--speed) linear infinite;
        }

        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(0) translateX(0); }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(-110px) translateX(var(--drift, 4px)); }
        }

        .bubble-1 { --drift: 6px; animation-delay: 0s; }
        .bubble-2 { --drift: -5px; animation-delay: 0.4s; }
        .bubble-3 { --drift: 3px; animation-delay: 0.9s; }

        /* Catalysis Foam rise physics */
        @keyframes foam-grow {
          0% { transform: scaleY(0); }
          100% { transform: scaleY(1); }
        }

        .catalysis-bubble {
          animation: catalysis-bubble-float 1.2s ease-in-out infinite;
        }

        @keyframes catalysis-bubble-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-15px) scale(1.1); opacity: 0.8; }
        }

        .reaction-console {
          padding: 0.85rem 1.25rem;
          flex-shrink: 0;
          background: var(--ds-surface-subtle);
          border-color: var(--ds-border-muted);
        }

        .console-label {
          font-family: monospace;
          font-size: 0.58rem;
          color: var(--ds-fg-subtle);
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 4px;
        }

        .console-text {
          font-family: monospace;
          font-size: 0.72rem;
          color: rgba(200, 245, 200, 0.6);
          margin: 0;
        }

        .log-output-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 12px;
        }

        .log-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .log-label {
          font-size: 0.58rem;
          color: var(--ds-fg-subtle);
          text-transform: uppercase;
        }

        .log-val {
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .text-neon-green { color: var(--ds-accent); text-shadow: var(--ds-glow-sm); }
        .text-neon-blue { color: var(--ds-accent-muted); text-shadow: var(--ds-glow-sm); }

        /* RIGHT PANEL: QUIZ / CERTIFICATION */
        .quiz-unlock-card,
        .quiz-active-card {
          flex: 1;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .quiz-unlock-locked,
        .quiz-unlock-unlocked {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          gap: 10px;
        }

        .unlock-emoji {
          font-size: 2.5rem;
        }

        .quiz-unlock-locked h4,
        .quiz-unlock-unlocked h4 {
          font-size: 0.88rem;
          font-weight: 800;
          color: #fff;
          margin: 0;
          text-transform: uppercase;
        }

        .quiz-unlock-locked p,
        .quiz-unlock-unlocked p {
          font-size: 0.72rem;
          line-height: 1.5;
          color: var(--ds-fg-subtle);
          margin: 0;
          text-align: center;
        }

        .launch-quiz-btn {
          background: var(--ds-accent-faint);
          border: 1px solid var(--ds-border-accent);
          color: var(--ds-accent);
          font-weight: 700;
          font-size: 0.8rem;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: var(--ds-glow-sm);
        }

        .launch-quiz-btn:hover {
          background: var(--ds-accent-subtle);
          box-shadow: var(--ds-glow-sm);
        }

        /* ACTIVE QUIZ WIDGET */
        .quiz-progress-wrap {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .quiz-q-indicator {
          font-size: 0.58rem;
          font-weight: 700;
          color: var(--ds-accent);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .quiz-question-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.4;
          margin: 0 0 1rem 0;
        }

        .quiz-options-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 1.5rem;
          flex: 1;
        }

        .quiz-option-row {
          width: 100%;
          text-align: left;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s;
        }

        .quiz-option-row:hover {
          background: var(--ds-accent-faint);
          border-color: var(--ds-accent-muted);
        }

        .quiz-option-row.selected {
          background: var(--ds-accent-subtle);
          border-color: var(--ds-accent);
        }

        .option-indicator {
          width: 20px;
          height: 20px;
          border-radius: 4px;
          background: var(--ds-surface-raised);
          border: 1px solid var(--ds-border-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--ds-fg-subtle);
        }

        .quiz-option-row.selected .option-indicator {
          background: var(--ds-accent-faint);
          border-color: var(--ds-accent);
          color: var(--ds-accent);
        }

        .option-text {
          font-size: 0.72rem;
          line-height: 1.4;
          color: var(--ds-fg-muted);
        }

        .quiz-nav-row {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        .quiz-nav-btn {
          flex: 1;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          color: #fff;
          font-size: 0.72rem;
          padding: 8px 0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quiz-nav-btn:hover:not(:disabled) {
          background: var(--ds-accent-faint);
        }

        .quiz-submit-btn {
          flex: 1.5;
          background: var(--ds-accent-faint);
          border: 1px solid var(--ds-border-accent);
          color: var(--ds-accent);
          font-weight: 700;
          font-size: 0.72rem;
          padding: 8px 0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quiz-submit-btn:hover {
          background: var(--ds-accent-subtle);
          box-shadow: var(--ds-glow-sm);
        }

        /* REPORT SCREEN */
        .quiz-report-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .report-badge {
          font-size: 0.58rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.1em;
          border: 1px solid var(--ds-border-muted);
          background: var(--ds-surface-subtle);
        }

        .report-title {
          font-size: 1.25rem;
          font-weight: 900;
          color: #fff;
          margin: 0;
        }

        .report-desc {
          font-size: 0.72rem;
          line-height: 1.5;
          color: var(--ds-fg-subtle);
          margin: 0;
        }

        .quiz-explanations-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          max-height: 240px;
          overflow-y: auto;
          text-align: left;
        }

        .explanation-card {
          padding: 10px 12px;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .exp-question-title {
          font-size: 0.72rem;
          font-weight: 700;
          color: #fff;
        }

        .exp-status {
          font-size: 0.52rem;
          text-transform: uppercase;
          font-weight: 800;
          align-self: flex-start;
          padding: 1px 4px;
          border-radius: 3px;
        }

        .exp-status.correct { color: var(--ds-accent); background: var(--ds-accent-faint); }
        .exp-status.incorrect { color: #ef4444; background: rgba(239, 68, 68, 0.05); }

        .exp-explanation-text {
          margin: 4px 0 0 0;
          font-size: 0.65rem;
          color: var(--ds-fg-subtle);
          line-height: 1.4;
        }

        .quiz-retry-btn {
          width: 100%;
          background: var(--ds-surface-subtle);
          border: 1px solid var(--ds-border-muted);
          color: #fff;
          font-weight: 700;
          font-size: 0.75rem;
          padding: 8px 0;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quiz-retry-btn:hover {
          background: var(--ds-accent-faint);
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 1100px) {
          .lab-workspace-layout {
            grid-template-columns: 320px 1fr;
            grid-template-rows: auto 1fr;
          }
          .lab-panel-right {
            grid-column: 1 / -1;
            height: auto;
          }
        }

        @media (max-width: 768px) {
          .lab-workspace-layout {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
            padding: 1rem;
            gap: 1rem;
            height: auto;
          }
          .lab-panel-left {
            height: auto;
          }
          .lab-panel-center {
            height: 400px;
          }
          .lab-panel-right {
            height: auto;
          }
          .lab-cards-grid {
            grid-template-columns: 1fr;
          }
          .lab-header {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
