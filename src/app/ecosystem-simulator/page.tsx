'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface BiomeConfig {
  id: string
  name: string
  emoji: string
  producer: { name: string; emoji: string }
  herbivore: { name: string; emoji: string }
  carnivore: { name: string; emoji: string }
  color: string
}

const BIOMES: BiomeConfig[] = [
  {
    id: 'forest',
    name: 'Deciduous Forest',
    emoji: '🌲',
    producer: { name: 'Oak Grass', emoji: '🌿' },
    herbivore: { name: 'Forest Deer', emoji: '🦌' },
    carnivore: { name: 'Timber Wolf', emoji: '🐺' },
    color: '#10b981'
  },
  {
    id: 'reef',
    name: 'Coral Reef',
    emoji: '🪸',
    producer: { name: 'Turf Algae', emoji: '🌱' },
    herbivore: { name: 'Parrotfish', emoji: '🐠' },
    carnivore: { name: 'Reef Shark', emoji: '🦈' },
    color: '#f43f5e'
  },
  {
    id: 'desert',
    name: 'Sonoran Desert',
    emoji: '🏜️',
    producer: { name: 'Saguaro Cactus', emoji: '🌵' },
    herbivore: { name: 'Kangaroo Rat', emoji: '🐭' },
    carnivore: { name: 'Desert Coyote', emoji: '🦊' },
    color: '#f59e0b'
  }
]

export default function EcosystemSimulator() {
  const [mounted, setMounted] = useState(false)
  const [selectedBiomeId, setSelectedBiomeId] = useState('forest')
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Variables states
  const [populations, setPopulations] = useState({ p: 100, h: 40, c: 10 })
  const [rainfall, setRainfall] = useState(50) // 0 to 100
  const [temperature, setTemperature] = useState(20) // -10 to 50
  const [carryingCapacity, setCarryingCapacity] = useState(250) // 50 to 500
  const [humanFootprint, setHumanFootprint] = useState(0) // 0 to 100

  // History tracking for graph
  const [history, setHistory] = useState<{ p: number; h: number; c: number }[]>([])
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Reset parameters
  const resetSimulation = () => {
    setIsPlaying(false)
    const initialPop = { p: 120, h: 45, c: 12 }
    setPopulations(initialPop)
    setHistory([initialPop])
    setRainfall(50)
    setTemperature(20)
    setCarryingCapacity(250)
    setHumanFootprint(0)
  }

  useEffect(() => {
    setMounted(true)
    resetSimulation()
  }, [selectedBiomeId])

  const activeBiome = useMemo(() => {
    return BIOMES.find(b => b.id === selectedBiomeId) || BIOMES[0]
  }, [selectedBiomeId])

  // Multi-tier Lotka-Volterra simulator tick loop
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying) {
      timer = setInterval(() => {
        setPopulations(prev => {
          // Adjust growth coefficients based on abiotic inputs
          const baseRate = 0.08
          const rainFactor = rainfall / 50
          const tempFactor = 1.0 + (temperature < 5 ? (5 - temperature) * 0.05 : 0) + (temperature > 40 ? (temperature - 40) * 0.05 : 0)
          
          // Producer carrying capacity modified by human footprint
          const maxK = Math.max(30, carryingCapacity - humanFootprint * 2.0)
          
          // Coefficients
          const r = baseRate * rainFactor // producer growth rate
          const dh = 0.038 * tempFactor // herbivore natural death rate
          const dc = 0.048 * tempFactor // predator natural death rate

          const a = 0.0016 // grazing rate
          const b = 0.22 // energy conversion to herbivores
          const c = 0.0045 // predation rate
          const e = 0.18 // energy conversion to predators

          // Equations
          const dp = r * prev.p * (1 - prev.p / maxK) - a * prev.p * prev.h
          const dhVal = b * a * prev.p * prev.h - c * prev.h * prev.c - dh * prev.h
          const dcVal = e * c * prev.h * prev.c - dc * prev.c

          const nextP = Math.max(0, prev.p + dp)
          const nextH = Math.max(0, prev.h + dhVal)
          const nextC = Math.max(0, prev.c + dcVal)

          const nextState = {
            p: Math.round(nextP * 100) / 100,
            h: Math.round(nextH * 100) / 100,
            c: Math.round(nextC * 100) / 100
          }

          setHistory(h => {
            const nextHistory = [...h, nextState]
            if (nextHistory.length > 70) nextHistory.shift()
            return nextHistory
          })

          return nextState
        })
      }, 150)
    }
    return () => clearInterval(timer)
  }, [isPlaying, rainfall, temperature, carryingCapacity, humanFootprint])

  // Canvas graph renderer
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || history.length === 0) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    // Draw background grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
    ctx.lineWidth = 1
    for (let i = 1; i < 5; i++) {
      const lineY = (h / 5) * i
      ctx.beginPath()
      ctx.moveTo(0, lineY)
      ctx.lineTo(w, lineY)
      ctx.stroke()
    }

    // Scale axes based on history maximums
    const maxVal = Math.max(
      15,
      ...history.map(pt => Math.max(pt.p, pt.h, pt.c))
    ) * 1.15

    const getX = (index: number) => {
      if (history.length <= 1) return 0
      return (index / (history.length - 1)) * w
    }

    const getY = (val: number) => {
      return h - (val / maxVal) * h
    }

    const drawCurve = (key: 'p' | 'h' | 'c', color: string) => {
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = 2.5
      ctx.lineJoin = 'round'
      
      history.forEach((pt, idx) => {
        const x = getX(idx)
        const y = getY(pt[key])
        if (idx === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
    }

    drawCurve('p', '#10b981') // Producers
    drawCurve('h', '#3b82f6') // Herbivores
    drawCurve('c', '#ef4444') // Carnivores
  }, [history])

  // Disaster button event triggers
  const triggerDrought = () => {
    setRainfall(0)
    setIsPlaying(true)
  }

  const triggerWildfire = () => {
    setPopulations(prev => ({
      ...prev,
      p: Math.max(2, prev.p * 0.15) // destroy 85% of plants
    }))
    setIsPlaying(true)
  }

  const triggerInvasion = () => {
    setHumanFootprint(80) // reduces K drastically
    setIsPlaying(true)
  }

  // Calculate coordinates for visual specimen board
  const particles = useMemo(() => {
    const list = []
    
    // Scale count to avoid UI lag
    const pCount = Math.min(50, Math.floor(populations.p / 3))
    const hCount = Math.min(25, Math.floor(populations.h / 2.5))
    const cCount = Math.min(12, Math.floor(populations.c))

    // Producers
    for (let i = 0; i < pCount; i++) {
      const angle = (i * 2.7) % (2 * Math.PI)
      const r = 8 + (i * 5.1) % 65
      list.push({
        id: `p_${i}`,
        x: 100 + Math.cos(angle) * r,
        y: 100 + Math.sin(angle) * r,
        emoji: activeBiome.producer.emoji
      })
    }

    // Herbivores
    for (let i = 0; i < hCount; i++) {
      const angle = (i * 3.3) % (2 * Math.PI)
      const r = 15 + (i * 7.7) % 60
      list.push({
        id: `h_${i}`,
        x: 100 + Math.cos(angle) * r,
        y: 100 + Math.sin(angle) * r,
        emoji: activeBiome.herbivore.emoji
      })
    }

    // Carnivores
    for (let i = 0; i < cCount; i++) {
      const angle = (i * 1.7) % (2 * Math.PI)
      const r = 25 + (i * 9.3) % 50
      list.push({
        id: `c_${i}`,
        x: 100 + Math.cos(angle) * r,
        y: 100 + Math.sin(angle) * r,
        emoji: activeBiome.carnivore.emoji
      })
    }

    return list
  }, [populations, activeBiome])

  if (!mounted) return null

  return (
    <div className="eco-root">
      <div className="eco-grid-bg" />
      <div className="eco-glow-effect" />

      {/* HEADER */}
      <header className="eco-header">
        <div className="header-left">
          <Link href="/" className="back-btn">
            ← Main Hub
          </Link>
          <div className="divider-line" />
          <div>
            <h1 className="header-title">ECOSYSTEM POPULATION SIMULATOR</h1>
            <p className="header-subtitle">LOTKA-VOLTERRA SPECIES INTERACTION BOARD</p>
          </div>
        </div>
      </header>

      {/* VIEWPORT LAYOUT */}
      <main className="eco-workspace-grid">
        {/* LEFT COLUMN: Controls & Abiotic Variables */}
        <section className="eco-sidebar-left">
          <div className="panel-card glassmorphic biome-selection-card">
            <h3 className="panel-section-title">Select Biome</h3>
            <div className="biome-pills">
              {BIOMES.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBiomeId(b.id)}
                  className={`biome-pill-btn ${selectedBiomeId === b.id ? 'active' : ''}`}
                >
                  {b.emoji} {b.name}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-card glassmorphic variables-card">
            <h3 className="panel-section-title">Abiotic Factor Sliders</h3>
            
            <div className="slider-group">
              <div className="slider-header">
                <span>💧 Rainfall level</span>
                <span className="slider-val">{rainfall}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={rainfall}
                onChange={e => setRainfall(parseInt(e.target.value))}
                className="variables-slider"
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span>🌡️ Average Temperature</span>
                <span className="slider-val">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="-10"
                max="50"
                value={temperature}
                onChange={e => setTemperature(parseInt(e.target.value))}
                className="variables-slider"
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span>🌳 Carrying Capacity (K)</span>
                <span className="slider-val">{carryingCapacity} units</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                value={carryingCapacity}
                onChange={e => setCarryingCapacity(parseInt(e.target.value))}
                className="variables-slider"
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <span>🚜 Human Encroachment</span>
                <span className="slider-val">{humanFootprint}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={humanFootprint}
                onChange={e => setHumanFootprint(parseInt(e.target.value))}
                className="variables-slider"
              />
            </div>
          </div>

          <div className="panel-card glassmorphic disasters-card">
            <h3 className="panel-section-title">Environmental Triggers</h3>
            <div className="disasters-grid">
              <button onClick={triggerDrought} className="disaster-btn drought-btn">
                🏜️ Trigger Drought
              </button>
              <button onClick={triggerWildfire} className="disaster-btn fire-btn">
                🔥 Trigger Wildfire
              </button>
              <button onClick={triggerInvasion} className="disaster-btn invasion-btn">
                🌾 Encroach Habitat
              </button>
            </div>
          </div>
        </section>

        {/* CENTER COLUMN: Real-time Canvas Line Graph & Specimen Grid */}
        <section className="eco-panel-center">
          {/* Specimen Board Visual Canvas */}
          <div className="panel-card glassmorphic specimen-board-card">
            <h3 className="panel-section-title">🟢 Active Biotic Particle Board</h3>
            <div className="specimen-board-viewport">
              <svg className="board-svg" viewBox="0 0 200 200" width="100%" height="100%">
                <circle cx="100" cy="100" r="85" fill="rgba(0,0,0,0.4)" stroke="rgba(57,255,20,0.06)" strokeWidth="1" />
                {particles.map(p => (
                  <text
                    key={p.id}
                    x={p.x}
                    y={p.y}
                    fontSize="9.5"
                    textAnchor="middle"
                    className="wandering-emoji"
                  >
                    {p.emoji}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* Line Chart graph */}
          <div className="panel-card glassmorphic graph-card">
            <div className="graph-header-row">
              <h3 className="panel-section-title">📊 Real-time Trophic Populations</h3>
              <div className="simulation-actions">
                <button onClick={() => setIsPlaying(!isPlaying)} className={`sim-play-btn ${isPlaying ? 'playing' : ''}`}>
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <button onClick={resetSimulation} className="sim-reset-btn">
                  🔄 Reset
                </button>
              </div>
            </div>

            <div className="graph-viewport-wrap">
              <canvas ref={canvasRef} width="600" height="200" className="chart-canvas" />
            </div>

            <div className="graph-legend-bar">
              <span className="legend-chip color-p">🌿 {activeBiome.producer.name}: {populations.p}</span>
              <span className="legend-chip color-h">🦌 {activeBiome.herbivore.name}: {populations.h}</span>
              <span className="legend-chip color-c">🐺 {activeBiome.carnivore.name}: {populations.c}</span>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Educational write-up & mathematical notes */}
        <section className="eco-sidebar-right">
          <div className="panel-card glassmorphic explanations-card">
            <h3 className="panel-section-title">📚 Trophic Dynamics Explanation</h3>
            <div className="explanations-scroller" data-lenis-prevent>
              <div className="scroller-inner">
                <div className="edu-block">
                  <h4>Species Interactions</h4>
                  <p>In this three-tier food chain model, predators hunt herbivores, and herbivores consume producers. Changes in the density of one trophic tier cause cascades throughout the ecosystem.</p>
                </div>

                <div className="edu-block">
                  <h4>Top-Down vs. Bottom-Up</h4>
                  <p><strong>Bottom-Up Regulation</strong> occurs when changes in producers (regulated by rainfall, temperature, and space) limit the growth of herbivores and predators.</p>
                  <p><strong>Top-Down Regulation</strong> is driven by predators keeping the herbivore population in check, preventing overgrazing and conserving plant density.</p>
                </div>

                <div className="edu-block">
                  <h4>Lotka-Volterra Mathematics</h4>
                  <p>The population curves are derived dynamically using differential population equations:</p>
                  <pre className="math-code">
                    {`dP/dt = r*P*(1-P/K) - a*P*H\n`}
                    {`dH/dt = b*a*P*H - c*H*C - d_h*H\n`}
                    {`dC/dt = e*c*H*C - d_c*C`}
                  </pre>
                  <p className="math-desc">Where <strong>K</strong> is carrying capacity, <strong>r</strong> is producer growth, and other constants govern ingestion rates and mortality.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .eco-root {
          background: #020502;
          min-height: calc(100vh - 64px);
          color: #C8F5C8;
          position: relative;
          overflow-x: hidden;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .eco-grid-bg {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(57, 255, 20, 0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(57, 255, 20, 0.012) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
          z-index: 0;
        }

        .eco-glow-effect {
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: min(850px, 90vw);
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(57, 255, 20, 0.04) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .eco-header {
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

        /* WORKSPACE GRID */
        .eco-workspace-grid {
          display: grid;
          grid-template-columns: 330px 1fr 320px;
          gap: 1.25rem;
          padding: 1.25rem 2rem;
          height: calc(100vh - 140px);
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }

        .eco-sidebar-left,
        .eco-panel-center,
        .eco-sidebar-right {
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
          padding: 1.25rem;
        }

        .glassmorphic {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }

        .panel-section-title {
          font-size: 0.68rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0 1rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 8px;
          flex-shrink: 0;
        }

        /* LEFT SIDEBAR: SLIDERS & BIOMES */
        .biome-selection-card {
          margin-bottom: 1rem;
          flex-shrink: 0;
        }

        .biome-pills {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .biome-pill-btn {
          width: 100%;
          text-align: left;
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(255,255,255,0.04);
          color: rgba(200, 245, 200, 0.6);
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
        }

        .biome-pill-btn:hover {
          color: #fff;
          background: rgba(57, 255, 20, 0.05);
          border-color: rgba(57, 255, 20, 0.15);
        }

        .biome-pill-btn.active {
          color: #39FF14;
          background: rgba(57, 255, 20, 0.08);
          border-color: rgba(57, 255, 20, 0.3);
          box-shadow: 0 0 10px rgba(57, 255, 20, 0.15);
        }

        .variables-card {
          flex: 1;
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .slider-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .slider-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: rgba(200, 245, 200, 0.75);
          font-weight: 600;
        }

        .slider-val {
          font-family: monospace;
          color: #39FF14;
        }

        .variables-slider {
          -webkit-appearance: none;
          height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.08);
          outline: none;
          cursor: pointer;
        }

        .variables-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #39FF14;
          box-shadow: 0 0 6px rgba(57, 255, 20, 0.4);
        }

        .disasters-card {
          flex-shrink: 0;
        }

        .disasters-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .disaster-btn {
          width: 100%;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          border: 1px solid;
          background: transparent;
          transition: all 0.2s;
        }

        .drought-btn {
          border-color: rgba(245, 158, 11, 0.25);
          color: #f59e0b;
        }

        .drought-btn:hover {
          background: rgba(245, 158, 11, 0.08);
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.15);
        }

        .fire-btn {
          border-color: rgba(239, 68, 68, 0.25);
          color: #ef4444;
        }

        .fire-btn:hover {
          background: rgba(239, 68, 68, 0.08);
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.15);
        }

        .invasion-btn {
          border-color: rgba(168, 85, 247, 0.25);
          color: #a855f7;
        }

        .invasion-btn:hover {
          background: rgba(168, 85, 247, 0.08);
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.15);
        }

        /* CENTER COLUMN PANELS */
        .specimen-board-card {
          flex: 1.2;
          margin-bottom: 1rem;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .specimen-board-viewport {
          flex: 1;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.03);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 0;
          overflow: hidden;
          position: relative;
        }

        .board-svg {
          display: block;
        }

        .wandering-emoji {
          animation: wiggle 3s infinite ease-in-out alternate;
        }

        @keyframes wiggle {
          0% { transform: translate(0px, 0px) rotate(0deg); }
          100% { transform: translate(3px, -2px) rotate(4deg); }
        }

        .graph-card {
          flex: 1;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .graph-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }

        .simulation-actions {
          display: flex;
          gap: 8px;
        }

        .sim-play-btn {
          padding: 6px 14px;
          border-radius: 8px;
          background: rgba(57, 255, 20, 0.08);
          border: 1px solid rgba(57, 255, 20, 0.25);
          color: #39FF14;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sim-play-btn:hover {
          background: rgba(57, 255, 20, 0.15);
          box-shadow: 0 0 10px rgba(57, 255, 20, 0.25);
        }

        .sim-play-btn.playing {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.25);
          color: #ef4444;
        }

        .sim-play-btn.playing:hover {
          background: rgba(239, 68, 68, 0.15);
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.25);
        }

        .sim-reset-btn {
          padding: 6px 12px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          color: rgba(200, 245, 200, 0.5);
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sim-reset-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
        }

        .graph-viewport-wrap {
          flex: 1;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          margin-bottom: 8px;
          overflow: hidden;
          min-height: 0;
          position: relative;
        }

        .chart-canvas {
          display: block;
          width: 100%;
          height: 100%;
        }

        .graph-legend-bar {
          display: flex;
          gap: 14px;
          flex-shrink: 0;
        }

        .legend-chip {
          font-size: 0.7rem;
          font-weight: 700;
          font-family: monospace;
        }

        .color-p { color: #10b981; }
        .color-h { color: #3b82f6; }
        .color-c { color: #ef4444; }

        /* RIGHT COLUMN: EDUCATIONAL INFOPACK */
        .explanations-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          min-height: 0;
        }

        .explanations-scroller {
          flex: 1;
          overflow-y: auto;
          min-height: 0;
          padding-right: 2px;
        }

        .explanations-scroller::-webkit-scrollbar {
          width: 4px;
        }

        .explanations-scroller::-webkit-scrollbar-thumb {
          background: rgba(57, 255, 20, 0.15);
          border-radius: 2px;
        }

        .edu-block {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          padding-bottom: 12px;
        }

        .edu-block h4 {
          font-size: 0.85rem;
          font-weight: 750;
          color: #fff;
          margin: 0;
        }

        .edu-block p {
          margin: 0;
          font-size: 0.75rem;
          line-height: 1.5;
          color: rgba(200, 245, 200, 0.5);
        }

        .math-code {
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 8px;
          padding: 10px;
          font-size: 0.65rem;
          color: #00d4aa;
          font-family: monospace;
          margin: 4px 0;
          overflow-x: auto;
        }

        .math-desc {
          font-size: 0.68rem !important;
          color: rgba(200, 245, 200, 0.35) !important;
        }

        /* LOADING ASSIST */
        .sim-loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: #020502;
        }

        .pulse-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #39FF14;
          box-shadow: 0 0 15px #39FF14;
          animation: pulse-dot-key 1.5s infinite ease-in-out;
        }

        @keyframes pulse-dot-key {
          0%, 100% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1.0; }
        }

        .loading-text {
          color: rgba(200,245,200,0.5);
          font-size: 0.9rem;
          margin-top: 12px;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .eco-workspace-grid {
            grid-template-columns: 300px 1fr;
            grid-template-rows: auto auto;
            height: auto;
            overflow-y: auto;
          }
          .eco-sidebar-right {
            grid-column: 1 / -1;
            height: auto;
          }
        }

        @media (max-width: 768px) {
          .eco-workspace-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto auto;
            padding: 1rem;
            gap: 1rem;
          }
          .eco-sidebar-left {
            height: auto;
          }
          .specimen-board-card {
            height: 300px;
          }
          .graph-card {
            height: 320px;
          }
          .eco-header {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
