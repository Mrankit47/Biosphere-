'use client'
import { useState, useRef, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import Link from 'next/link'
import {
  HumanBodySilhouette,
  Skeleton,
  Organs,
  VascularSystem,
  MuscleFibers,
  IsolatedOrgan,
  RenderMode
} from './_components/BodyModel'

/* ══════════════════════════════════════════════════════════════
   ▸ DETAILED ANATOMICAL DIAGNOSTIC DATA
   ══════════════════════════════════════════════════════════════ */
const ORGAN_INFO: Record<
  string,
  {
    name: string
    emoji: string
    color: string
    description: string
    funFact: string
    stats: { label: string; value: string; pct: number }[]
  }
> = {
  brain: {
    name: 'Brain',
    emoji: '🧠',
    color: '#E879F9',
    description:
      'The control center of the nervous system. Contains ~86 billion neurons that process sensory data, coordinate muscle movements, store memories, and enable complex conscious thought.',
    funFact: 'Your brain generates about 20 watts of electricity — enough to power a low-wattage LED bulb!',
    stats: [
      { label: 'Neural Speed', value: '268 mph', pct: 92 },
      { label: 'Energy Usage', value: '20% total', pct: 85 },
      { label: 'Neurons Count', value: '86B', pct: 98 },
    ],
  },
  heart: {
    name: 'Heart',
    emoji: '❤️',
    color: '#EF4444',
    description:
      'A powerful muscular pump that circulates blood through 60,000 miles of blood vessels, delivering oxygen, hormones, and nutrients to every living cell in your body.',
    funFact: 'Your heart beats about 100,000 times per day — that\'s 2.5 billion beats in an average lifetime!',
    stats: [
      { label: 'Pulse Rate', value: '72 BPM', pct: 72 },
      { label: 'Stroke Output', value: '70 mL', pct: 68 },
      { label: 'Circulation time', value: '45s', pct: 90 },
    ],
  },
  lungs: {
    name: 'Lungs',
    emoji: '🫄',
    color: '#F472B6',
    description:
      'Spongy breathing organs that filter oxygen into your bloodstream while extracting waste carbon dioxide with every breath. Crucial for life and cellular metabolism.',
    funFact: 'Spread flat, the total surface area of your lungs would cover an entire tennis court — about 70 square meters!',
    stats: [
      { label: 'Breathing Rate', value: '16/min', pct: 65 },
      { label: 'Lung Capacity', value: '6.0 Liters', pct: 80 },
      { label: 'Alveoli Count', value: '480 Million', pct: 95 },
    ],
  },
  liver: {
    name: 'Liver',
    emoji: '🟤',
    color: '#D97706',
    description:
      'The body\'s primary biochemical factory. Performs over 500 vital functions including detoxification of blood, synthesis of crucial proteins, and production of digestive bile.',
    funFact: 'The liver is the only organ that can completely regenerate itself — it can regrow back to full size from just 25% of its tissue!',
    stats: [
      { label: 'Filters/Min', value: '1.4 Liters', pct: 88 },
      { label: 'Chemical Jobs', value: '500+', pct: 99 },
      { label: 'Regen Factor', value: 'High', pct: 94 },
    ],
  },
  stomach: {
    name: 'Stomach',
    emoji: '🟢',
    color: '#10B981',
    description:
      'A muscular digestive reservoir that secrets strong hydrochloric acid (pH 1.5 - 3.5) and protease enzymes to chemically break down ingested food.',
    funFact: 'To prevent digesting itself, your stomach secretes a thick mucus barrier and regenerates a brand new lining every 3 days!',
    stats: [
      { label: 'Stomach pH', value: '1.8 pH', pct: 94 },
      { label: 'Capacity', value: '1.5 Liters', pct: 70 },
      { label: 'Lining Renewal', value: '3 Days', pct: 90 },
    ],
  },
  intestines: {
    name: 'Intestines',
    emoji: '🌀',
    color: '#3B82F6',
    description:
      'Consists of a 20-foot small intestine for nutrient absorption and a 5-foot large colon for water absorption. Houses over 100 trillion microbial symbionts.',
    funFact: 'Your gut microbiome contains more bacterial cells than there are human cells in your entire body!',
    stats: [
      { label: 'Total Length', value: '25 feet', pct: 82 },
      { label: 'Microbiome', value: '100 Trillion', pct: 99 },
      { label: 'Absorption Area', value: '250 m²', pct: 96 },
    ],
  },
  kidneys: {
    name: 'Kidneys',
    emoji: '🫘',
    color: '#8B5CF6',
    description:
      'Twin bean-shaped filtration units that clean your entire blood supply 40 times a day. Regulates blood pressure, fluid balance, and filters nitrogenous wastes.',
    funFact: 'Your kidneys filter roughly 180 liters of fluid per day, reclaiming 99% of it and excreting the rest as waste.',
    stats: [
      { label: 'Filtration Rate', value: '125 mL/min', pct: 86 },
      { label: 'Nephrons Count', value: '2.0 Million', pct: 94 },
      { label: 'Fluid filtered', value: '180 L/day', pct: 90 },
    ],
  },
  bladder: {
    name: 'Bladder',
    emoji: '💧',
    color: '#FBBF24',
    description:
      'A hollow, distensible muscular sac located in the pelvic basin. Collects and stores urine filtered by the kidneys prior to elimination.',
    funFact: 'The bladder contains sensory stretch receptors that trigger the urge to urinate once it is only 25% full!',
    stats: [
      { label: 'Max Capacity', value: '600 mL', pct: 75 },
      { label: 'Trigger Volume', value: '150 mL', pct: 60 },
      { label: 'Detrusor Tone', value: 'Healthy', pct: 85 },
    ],
  },
}

/* ══════════════════════════════════════════════════════════════
   ▸ 3D SCENE
   ══════════════════════════════════════════════════════════════ */
function BodyScene({
  selectedOrgan,
  setSelectedOrgan,
  activeSystem,
  setActiveSystem,
  renderMode,
  visibleSystems,
}: {
  selectedOrgan: string | null
  setSelectedOrgan: (s: string | null) => void
  activeSystem: string | null
  setActiveSystem: (s: string | null) => void
  renderMode: RenderMode
  visibleSystems: Record<string, boolean>
}) {
  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={renderMode === 'realistic' ? 0.35 : 0.15} />
      <spotLight
        position={[8, 12, 8]}
        angle={0.25}
        penumbra={1}
        intensity={renderMode === 'realistic' ? 2 : 3}
        castShadow
        color={renderMode === 'realistic' ? '#ffffff' : '#38bdf8'}
      />
      <spotLight
        position={[-6, 8, -6]}
        angle={0.3}
        penumbra={1}
        intensity={renderMode === 'realistic' ? 0.8 : 1.5}
        color={renderMode === 'realistic' ? '#e24b4a' : '#10b981'}
      />
      <pointLight position={[0, 15, 5]} intensity={0.5} color={renderMode === 'realistic' ? '#39ff14' : '#06b6d4'} />

      {/* Human Silhouette skin */}
      {visibleSystems.silhouette && (
        <HumanBodySilhouette opacity={activeSystem ? 0.05 : 0.14} mode={renderMode} />
      )}

      {/* Skeleton Bones */}
      {visibleSystems.skeleton && <Skeleton mode={renderMode} />}

      {/* Muscle Fibers */}
      {visibleSystems.muscles && <MuscleFibers mode={renderMode} />}

      {/* Organs layer */}
      {visibleSystems.organs && <Organs selected={selectedOrgan} onSelect={setSelectedOrgan} mode={renderMode} />}

      {/* Arteries, Veins, and Nerves tree */}
      <VascularSystem
        activeSystem={activeSystem}
        onSelect={setActiveSystem}
        mode={renderMode}
        showVascular={visibleSystems.vascular}
        showNervous={visibleSystems.nervous}
      />

      <ContactShadows position={[0, -5, 0]} opacity={0.35} scale={18} blur={2.5} far={10} />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={22} target={[0, 2.8, 0]} />
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ PAGE COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function HumanBodyPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null)
  const [activeSystem, setActiveSystem] = useState<string | null>(null)
  const [detailModal, setDetailModal] = useState(false)
  const [renderMode, setRenderMode] = useState<RenderMode>('realistic')

  // Systems visibility checklist
  const [visibleSystems, setVisibleSystems] = useState<Record<string, boolean>>({
    silhouette: true,
    skeleton: true,
    muscles: false, // Turned off by default to highlight skeletal/organs better, but toggleable!
    organs: true,
    vascular: true,
    nervous: true,
  })

  const info = selectedOrgan ? ORGAN_INFO[selectedOrgan] : null

  const toggleSystem = (key: string) => {
    setVisibleSystems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="anatomy-root">
      {/* Dynamic Background Matrix Effect */}
      <div className="anatomy-grid-bg" />
      <div className="anatomy-glow-effect" />

      {/* TOP HEADER NAVIGATION */}
      <header className="anatomy-header">
        <div className="header-left">
          <Link href="/" className="back-btn">
            ← Main Hub
          </Link>
          <div className="divider-line" />
          <div>
            <h1 className="header-title">3D ANATOMY ENGINE</h1>
            <p className="header-subtitle">INTERACTIVE MEDICAL VISUALIZER</p>
          </div>
        </div>

        {/* Dynamic Scan Mode Indicator */}
        <div className="header-center">
          <div className="scan-pill">
            <span className="scan-indicator-dot animate-pulse" />
            MODE: <span className="scan-indicator-text">{renderMode.toUpperCase()} SCAN</span>
          </div>
        </div>

        {/* Branch Network Highlights */}
        <div className="header-right">
          {['artery', 'vein', 'nerve'].map(key => {
            const label = key === 'artery' ? 'Arteries' : key === 'vein' ? 'Veins' : 'Nerves'
            const color = key === 'artery' ? '#EF4444' : key === 'vein' ? '#3B82F6' : '#FACC15'
            const isCurrent = activeSystem === key
            return (
              <button
                key={key}
                onClick={() => setActiveSystem(isCurrent ? null : key)}
                className={`network-toggle-btn ${isCurrent ? 'active' : ''}`}
                style={{ '--system-color': color } as React.CSSProperties}
              >
                <span className="network-btn-dot" />
                {label}
              </button>
            )
          })}
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="anatomy-main-layout">
        {/* LEFT COLUMN: VISIBILITY SYSTEMS CONTROL */}
        <section className="anatomy-sidebar-left">
          <div className="panel-card glassmorphic">
            <div className="panel-header">
              <span className="panel-icon">🎛️</span>
              <h3 className="panel-title">VISIBILITY CONTROLS</h3>
            </div>
            <p className="panel-desc">Toggle layers to isolate anatomical systems dynamically.</p>

            <div className="systems-checklist">
              {[
                { key: 'silhouette', label: 'Epidermal Skin', icon: '👤', desc: 'Outer body boundary' },
                { key: 'skeleton', label: 'Skeletal Bones', icon: '🦴', desc: 'Ribcage, spine, and pelvis' },
                { key: 'muscles', label: 'Muscular Fibers', icon: '💪', desc: 'Torso myofibrils' },
                { key: 'organs', label: 'Visceral Organs', icon: '🫀', desc: 'Main metabolic bodies' },
                { key: 'vascular', label: 'Vascular Network', icon: '🩸', desc: 'Arteries & Veins circulation' },
                { key: 'nervous', label: 'Nervous Tree', icon: '⚡', desc: 'Spinal cord & nerve fibers' },
              ].map(sys => {
                const active = visibleSystems[sys.key]
                return (
                  <button
                    key={sys.key}
                    onClick={() => toggleSystem(sys.key)}
                    className={`system-check-row ${active ? 'active' : ''}`}
                  >
                    <div className="checkbox-indicator">
                      {active && <span className="checkbox-inner-dot" />}
                    </div>
                    <span className="system-row-icon">{sys.icon}</span>
                    <div className="system-row-details">
                      <span className="system-row-label">{sys.label}</span>
                      <span className="system-row-desc">{sys.desc}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* RENDER MODES CONTROL BAR */}
          <div className="panel-card glassmorphic render-modes-card">
            <div className="panel-header">
              <span className="panel-icon">🎨</span>
              <h3 className="panel-title">VISUALIZATION MODE</h3>
            </div>
            <div className="render-mode-group">
              {[
                { mode: 'realistic', label: 'Clinical Real', icon: '🩺', desc: 'Natural organic colors' },
                { mode: 'xray', label: 'X-Ray Scan', icon: '🩻', desc: 'Fluorescent CT structures' },
                { mode: 'hologram', label: 'Holograph', icon: '💻', desc: 'Green scanning grid' },
              ].map(item => (
                <button
                  key={item.mode}
                  onClick={() => setRenderMode(item.mode as RenderMode)}
                  className={`render-mode-btn ${renderMode === item.mode ? 'active' : ''}`}
                >
                  <span className="render-mode-icon">{item.icon}</span>
                  <div className="render-mode-details">
                    <span className="render-mode-label">{item.label}</span>
                    <span className="render-mode-desc">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* MIDDLE COLUMN: THREE.JS 3D CANVAS */}
        <section className="anatomy-canvas-container" aria-label="3D Anatomical Scene">
          {mounted && (
            <Canvas
              shadows
              gl={{ antialias: true, alpha: true }}
              onPointerMissed={() => {
                setSelectedOrgan(null)
                setActiveSystem(null)
              }}
            >
              <Suspense fallback={null}>
                <BodyScene
                  selectedOrgan={selectedOrgan}
                  setSelectedOrgan={setSelectedOrgan}
                  activeSystem={activeSystem}
                  setActiveSystem={setActiveSystem}
                  renderMode={renderMode}
                  visibleSystems={visibleSystems}
                />
              </Suspense>
            </Canvas>
          )}

          {/* Canvas Help Overlay */}
          {!selectedOrgan && !activeSystem && (
            <div className="canvas-overlay-hint">
              <span className="mouse-icon">🖱️</span>
              <p>DRAG MOUSE TO ROTATE · SCROLL TO ZOOM · CLICK ANY ORGAN OR SYSTEM TO INSPECT</p>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: DIAGNOSTIC INFO PANEL */}
        <section className="anatomy-sidebar-right">
          {info ? (
            <div
              className="panel-card glassmorphic diagnostic-info-panel active"
              style={{ '--organ-color': info.color } as React.CSSProperties}
            >
              {/* Close Button */}
              <button onClick={() => setSelectedOrgan(null)} className="panel-close-btn">
                ✕
              </button>

              <div className="diagnostic-header">
                <span className="diagnostic-badge">SPECIMEN INSPECTOR</span>
                <div className="title-row">
                  <div className="organ-avatar">
                    <span className="organ-avatar-emoji">{info.emoji}</span>
                  </div>
                  <div>
                    <h2 className="organ-name">{info.name}</h2>
                    <span className="organ-coord">SECTOR: VISCERA_SEC_{info.name.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="diagnostic-section">
                <h4 className="section-title">FUNCTIONAL DESCRIPTION</h4>
                <p className="organ-desc-text">{info.description}</p>
              </div>

              {/* Diagnostic Progress Stats */}
              <div className="diagnostic-section">
                <h4 className="section-title">DIAGNOSTIC TELEMETRY</h4>
                <div className="telemetry-grid">
                  {info.stats.map(s => (
                    <div key={s.label} className="telemetry-bar-row">
                      <div className="telemetry-label-row">
                        <span className="telemetry-stat-label">{s.label}</span>
                        <span className="telemetry-stat-value">{s.value}</span>
                      </div>
                      <div className="telemetry-track">
                        <div className="telemetry-fill" style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fun Clinical Fact Box */}
              <div className="fact-box">
                <span className="fact-icon">💡</span>
                <div>
                  <h5 className="fact-title">DID YOU KNOW?</h5>
                  <p className="fact-text">{info.funFact}</p>
                </div>
              </div>

              {/* Isolate Button */}
              <button onClick={() => setDetailModal(true)} className="isolate-btn">
                🔬 ISOLATE SPECIMEN IN 3D
              </button>
            </div>
          ) : (
            <div className="panel-card glassmorphic diagnostic-info-panel idle">
              <div className="idle-indicator">
                <span className="pulse-radar" />
                <span className="idle-icon">🫀</span>
                <h4>DIAGNOSTIC STANDBY</h4>
                <p>Click on any internal organ in the 3D model to capture telemetry and isolate the specimen.</p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ISOLATED DETAILED 3D SPECIMEN MODAL */}
      {detailModal && info && (
        <div className="specimen-modal-overlay">
          <div className="specimen-modal-card glassmorphic">
            <header className="modal-header">
              <div>
                <span className="modal-badge">3D SPECIMEN ISOLATION</span>
                <h2 className="modal-title">
                  {info.emoji} {info.name.toUpperCase()} MODEL
                </h2>
              </div>
              <button onClick={() => setDetailModal(false)} className="modal-close-btn">
                ✕ CLOSE
              </button>
            </header>

            <div className="modal-body">
              {/* Isolated 3D Canvas */}
              <div className="modal-canvas-wrap">
                {mounted && (
                  <Canvas camera={{ position: [0, 0, 3.8] }}>
                    <Suspense fallback={null}>
                      <Environment preset="city" />
                      <ambientLight intensity={renderMode === 'realistic' ? 0.6 : 0.25} />
                      <spotLight
                        position={[5, 5, 5]}
                        intensity={renderMode === 'realistic' ? 2 : 3}
                        color={renderMode === 'realistic' ? '#ffffff' : '#38bdf8'}
                      />
                      <spotLight position={[-5, -3, -5]} intensity={0.5} color="#e24b4a" />
                      <IsolatedOrgan organId={selectedOrgan!} mode={renderMode} />
                      <OrbitControls enablePan={false} />
                    </Suspense>
                  </Canvas>
                )}
                <div className="modal-rotate-overlay">DRAG SPECIMEN TO ROTATE IN 360°</div>
              </div>

              {/* Specifications Details */}
              <div className="modal-info-panel">
                <h4 className="modal-panel-heading">ANATOMICAL SPECIFICATIONS</h4>
                <p className="modal-organ-desc">{info.description}</p>

                <div className="modal-stats-grid">
                  {info.stats.map(s => (
                    <div key={s.label} className="modal-stat-card">
                      <span className="stat-card-label">{s.label}</span>
                      <span className="stat-card-value" style={{ color: info.color }}>
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="modal-fact-box" style={{ borderColor: `${info.color}35` }}>
                  <span className="fact-box-icon">💡</span>
                  <p className="fact-box-text">{info.funFact}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE NETWORK LEGEND */}
      {activeSystem && (
        <div
          className="system-legend-card glassmorphic"
          style={{
            borderColor:
              activeSystem === 'artery' ? '#EF444450' : activeSystem === 'vein' ? '#3B82F650' : '#FACC1550',
          }}
        >
          <div className="legend-header">
            <span
              className="legend-badge-dot"
              style={{
                background:
                  activeSystem === 'artery' ? '#EF4444' : activeSystem === 'vein' ? '#3B82F6' : '#FACC15',
                boxShadow: `0 0 10px ${
                  activeSystem === 'artery' ? '#EF4444' : activeSystem === 'vein' ? '#3B82F6' : '#FACC15'
                }`,
              }}
            />
            <h4
              className="legend-title"
              style={{
                color:
                  activeSystem === 'artery' ? '#EF4444' : activeSystem === 'vein' ? '#3B82F6' : '#FACC15',
              }}
            >
              {activeSystem === 'artery'
                ? 'Arterial System Network'
                : activeSystem === 'vein'
                ? 'Venous System Network'
                : 'Nervous System Network'}
            </h4>
          </div>
          <p className="legend-desc">
            {activeSystem === 'artery'
              ? 'Oxygenated Arterial pathways that transport oxygen-rich blood away from the cardiac ventricles to metabolizing visceral tissues and limbs.'
              : activeSystem === 'vein'
              ? 'Venous channels that return deoxygenated blood from capillary beds back to the heart chambers for pulmonary re-oxygenation.'
              : 'Dense neural branching fibers that conduct rapid electrical neural impulses between the cerebral spinal cord and the distal extremities.'}
          </p>
        </div>
      )}

      {/* EXCLUSIVE SCALED CSS */}
      <style>{`
        .anatomy-root {
          width: 100vw;
          height: 100vh;
          background: #020402;
          color: #f1f5f1;
          position: relative;
          overflow: hidden;
          font-family: system-ui, -apple-system, sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* Ambient glowing matrix backgrounds */
        .anatomy-grid-bg {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(56, 189, 248, 0.035) 1px, transparent 0);
          background-size: 26px 26px;
          pointer-events: none;
          z-index: 1;
        }
        .anatomy-glow-effect {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.02) 0%, transparent 70%);
          top: 20%;
          left: 30%;
          pointer-events: none;
          z-index: 1;
        }

        /* ── HEADER NAV ── */
        .anatomy-header {
          position: relative;
          z-index: 100;
          padding: 1.25rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(to bottom, rgba(2, 4, 2, 0.95), rgba(2, 4, 2, 0));
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .back-btn {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.02);
          transition: all 0.25s ease;
        }
        .back-btn:hover {
          color: #fff;
          border-color: rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.05);
        }
        .divider-line {
          width: 1px;
          height: 30px;
          background: rgba(255, 255, 255, 0.1);
        }
        .header-title {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 900;
          letter-spacing: 0.15em;
          background: linear-gradient(90deg, #f8fafc, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .header-subtitle {
          margin: 0;
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.2em;
          font-weight: 700;
        }
        .header-center {
          display: flex;
          align-items: center;
        }
        .scan-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 999px;
          border: 1px solid rgba(56, 189, 248, 0.15);
          background: rgba(56, 189, 248, 0.05);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #38bdf8;
        }
        .scan-indicator-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #38bdf8;
          box-shadow: 0 0 8px #38bdf8;
        }
        .header-right {
          display: flex;
          gap: 8px;
        }

        /* Glowing Networks Toggle Buttons */
        .network-toggle-btn {
          padding: 6px 14px;
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.4);
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
        }
        .network-toggle-btn:hover {
          color: #fff;
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.05);
        }
        .network-btn-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--system-color);
          margin-right: 6px;
          transition: transform 0.2s;
        }
        .network-toggle-btn.active {
          border-color: var(--system-color);
          background: color-mix(in srgb, var(--system-color) 16%, transparent);
          color: var(--system-color);
          box-shadow: 0 0 15px color-mix(in srgb, var(--system-color) 25%, transparent);
        }
        .network-toggle-btn.active .network-btn-dot {
          transform: scale(1.4);
          box-shadow: 0 0 8px var(--system-color);
        }

        /* ── MAIN LAYOUT ── */
        .anatomy-main-layout {
          flex: 1;
          display: grid;
          grid-template-columns: 310px 1fr 340px;
          position: relative;
          z-index: 10;
          padding: 1.5rem;
          gap: 1.5rem;
          overflow: hidden;
        }

        /* ── GLASSMORPHIC PANELS ── */
        .glassmorphic {
          background: rgba(5, 10, 5, 0.75);
          backdrop-filter: blur(24px) saturate(120%);
          border: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
        }
        .panel-card {
          border-radius: 20px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }
        .panel-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 0.5rem;
        }
        .panel-icon {
          font-size: 1.15rem;
        }
        .panel-title {
          margin: 0;
          font-size: 0.88rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #f1f5f1;
        }
        .panel-desc {
          margin: 0 0 1.25rem 0;
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.4;
        }

        /* ── SIDEBAR LEFT: SYSTEMS ── */
        .anatomy-sidebar-left {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .anatomy-sidebar-left::-webkit-scrollbar {
          display: none;
        }

        .systems-checklist {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .system-check-row {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
        }
        .system-check-row:hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.12);
        }
        .checkbox-indicator {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .checkbox-inner-dot {
          width: 8px;
          height: 8px;
          border-radius: 2px;
          background: #38bdf8;
          box-shadow: 0 0 6px #38bdf8;
        }
        .system-row-icon {
          font-size: 1.1rem;
          margin-right: 12px;
        }
        .system-row-details {
          display: flex;
          flex-direction: column;
        }
        .system-row-label {
          font-size: 0.8rem;
          font-weight: 750;
          color: rgba(255, 255, 255, 0.7);
          transition: color 0.2s;
        }
        .system-row-desc {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.35);
          margin-top: 1px;
        }

        .system-check-row.active {
          border-color: rgba(56, 189, 248, 0.35);
          background: rgba(56, 189, 248, 0.04);
        }
        .system-check-row.active .checkbox-indicator {
          border-color: #38bdf8;
        }
        .system-check-row.active .system-row-label {
          color: #fff;
        }

        /* Render modes panel */
        .render-modes-card {
          margin-top: auto;
        }
        .render-mode-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .render-mode-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          background: rgba(255, 255, 255, 0.01);
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: all 0.25s;
          text-align: left;
        }
        .render-mode-btn:hover {
          background: rgba(255, 255, 255, 0.04);
        }
        .render-mode-icon {
          font-size: 1.15rem;
        }
        .render-mode-details {
          display: flex;
          flex-direction: column;
        }
        .render-mode-label {
          font-size: 0.78rem;
          font-weight: 800;
        }
        .render-mode-desc {
          font-size: 0.58rem;
          color: rgba(255, 255, 255, 0.35);
          margin-top: 1px;
        }
        .render-mode-btn.active {
          border-color: #38bdf8;
          background: rgba(56, 189, 248, 0.08);
          color: #fff;
          box-shadow: 0 0 15px rgba(56, 189, 248, 0.08);
        }

        /* ── MIDDLE: 3D CANVAS ── */
        .anatomy-canvas-container {
          position: relative;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: radial-gradient(circle at center, #050a05, #000200);
          overflow: hidden;
          box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.8);
        }
        .canvas-overlay-hint {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          pointer-events: none;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .mouse-icon {
          font-size: 1rem;
          animation: pulse 2.5s infinite ease-in-out;
        }

        /* ── RIGHT COLUMN: INFO PANEL ── */
        .anatomy-sidebar-right {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          scrollbar-width: none;
        }
        .anatomy-sidebar-right::-webkit-scrollbar {
          display: none;
        }

        .diagnostic-info-panel {
          height: 100%;
          min-height: 520px;
          border-radius: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Panel close */
        .panel-close-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.9rem;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
        }
        .panel-close-btn:hover {
          color: #fff;
        }

        /* Idle State Panel */
        .diagnostic-info-panel.idle {
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 3rem 2rem;
        }
        .idle-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .pulse-radar {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: radar-ping 3s infinite linear;
          pointer-events: none;
        }
        .idle-icon {
          font-size: 3rem;
          color: rgba(255, 255, 255, 0.12);
          margin-bottom: 1.5rem;
          z-index: 2;
        }
        .idle-indicator h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.88rem;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.7);
        }
        .idle-indicator p {
          margin: 0;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.35);
          line-height: 1.6;
          max-width: 220px;
        }

        /* Active State Panel */
        .diagnostic-info-panel.active {
          border-color: color-mix(in srgb, var(--organ-color) 25%, transparent);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), inset 0 0 20px color-mix(in srgb, var(--organ-color) 4%, transparent);
          padding: 1.75rem;
        }

        .diagnostic-badge {
          display: inline-block;
          font-size: 0.58rem;
          color: var(--organ-color);
          font-weight: 900;
          letter-spacing: 0.2em;
          margin-bottom: 6px;
        }
        .title-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .organ-avatar {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: color-mix(in srgb, var(--organ-color) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--organ-color) 30%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        .organ-avatar-emoji {
          font-size: 1.7rem;
        }
        .organ-name {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 900;
          color: #fff;
        }
        .organ-coord {
          font-size: 0.52rem;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.08em;
          display: block;
          margin-top: 1px;
        }

        .diagnostic-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .section-title {
          margin: 0;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.12em;
          font-weight: 800;
        }
        .organ-desc-text {
          margin: 0;
          font-size: 0.78rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.72);
        }

        /* Telemetry grid */
        .telemetry-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .telemetry-bar-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .telemetry-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
        }
        .telemetry-stat-label {
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
        }
        .telemetry-stat-value {
          color: var(--organ-color);
          font-weight: 750;
        }
        .telemetry-track {
          width: 100%;
          height: 6px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.04);
          overflow: hidden;
        }
        .telemetry-fill {
          height: 100%;
          border-radius: 100px;
          background: var(--organ-color);
          box-shadow: 0 0 6px var(--organ-color);
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Fun clinical fact box */
        .fact-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          padding: 12px;
          border-radius: 14px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .fact-icon {
          font-size: 1.15rem;
          flex-shrink: 0;
        }
        .fact-title {
          margin: 0 0 2px 0;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.08em;
          font-weight: 800;
        }
        .fact-text {
          margin: 0;
          font-size: 0.72rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
        }

        /* Isolate action button */
        .isolate-btn {
          width: 100%;
          padding: 12px;
          border-radius: 100px;
          border: none;
          background: var(--organ-color);
          color: #020402;
          font-weight: 850;
          font-size: 0.75rem;
          cursor: pointer;
          box-shadow: 0 6px 20px color-mix(in srgb, var(--organ-color) 35%, transparent);
          transition: all 0.25s ease;
          letter-spacing: 0.05em;
          margin-top: auto;
        }
        .isolate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px color-mix(in srgb, var(--organ-color) 45%, transparent);
          filter: brightness(1.15);
        }

        /* ── SPECIMEN ISOLATION FULLSCREEN MODAL ── */
        .specimen-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(1, 2, 1, 0.98);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          backdrop-filter: blur(12px);
        }
        .specimen-modal-card {
          width: 100%;
          max-width: 1050px;
          height: 100%;
          max-height: 640px;
          border-radius: 28px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .modal-header {
          padding: 1.75rem 2.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-badge {
          font-size: 0.6rem;
          color: #38bdf8;
          font-weight: 900;
          letter-spacing: 0.25em;
        }
        .modal-title {
          margin: 4px 0 0 0;
          font-size: 1.65rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          color: #fff;
        }
        .modal-close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 8px 18px;
          border-radius: 100px;
          cursor: pointer;
          font-size: 0.72rem;
          font-weight: 750;
          transition: all 0.2s;
        }
        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.25);
        }

        .modal-body {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 380px;
          overflow: hidden;
        }
        .modal-canvas-wrap {
          background: radial-gradient(circle at center, #050d0a, #010402);
          position: relative;
        }
        .modal-rotate-overlay {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.58rem;
          color: rgba(255, 255, 255, 0.3);
          font-weight: 800;
          letter-spacing: 0.15em;
          pointer-events: none;
        }

        .modal-info-panel {
          padding: 2.25rem;
          border-left: 1px solid rgba(255, 255, 255, 0.06);
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .modal-panel-heading {
          margin: 0;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.35);
          letter-spacing: 0.12em;
          font-weight: 800;
        }
        .modal-organ-desc {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.75);
        }

        .modal-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .modal-stat-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-card-label {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.35);
          text-transform: uppercase;
        }
        .stat-card-value {
          font-size: 1.25rem;
          font-weight: 900;
        }

        .modal-fact-box {
          border: 1px solid;
          background: rgba(255, 255, 255, 0.01);
          padding: 14px;
          border-radius: 16px;
          display: flex;
          gap: 12px;
        }
        .fact-box-icon {
          font-size: 1.25rem;
        }
        .fact-box-text {
          margin: 0;
          font-size: 0.78rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
        }

        /* ── SYSTEM NETWORK LEGEND ── */
        .system-legend-card {
          position: absolute;
          bottom: 2rem;
          left: 2rem;
          z-index: 100;
          max-width: 320px;
          padding: 1.25rem;
          border-radius: 16px;
          border: 1px solid;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .legend-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .legend-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .legend-title {
          margin: 0;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .legend-desc {
          margin: 0;
          font-size: 0.7rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.5);
        }

        /* ── ANIMATIONS ── */
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes radar-ping {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .animate-pulse {
          animation: pulse 2s infinite ease-in-out;
        }

        /* ── RESPONSIVE DESIGN ── */
        @media (max-width: 1100px) {
          .anatomy-main-layout {
            grid-template-columns: 280px 1fr;
            grid-template-rows: auto 1fr;
          }
          .anatomy-sidebar-right {
            grid-column: 1 / -1;
            height: auto;
          }
          .diagnostic-info-panel {
            min-height: auto;
          }
        }
        @media (max-width: 768px) {
          .anatomy-main-layout {
            grid-template-columns: 1fr;
            grid-template-rows: auto 400px auto;
            padding: 0.75rem;
            gap: 0.75rem;
          }
          .anatomy-sidebar-left {
            grid-row: 2;
          }
          .anatomy-canvas-container {
            grid-row: 1;
            height: 380px;
          }
          .anatomy-sidebar-right {
            grid-row: 3;
          }
          .anatomy-header {
            flex-direction: column;
            gap: 12px;
            padding: 1rem;
          }
          .header-left {
            width: 100%;
            justify-content: space-between;
          }
          .header-right {
            width: 100%;
            justify-content: space-between;
          }
          .specimen-modal-overlay {
            padding: 1rem;
          }
          .modal-body {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr auto;
          }
          .modal-info-panel {
            border-left: none;
            border-top: 1px solid rgba(255,255,255,0.06);
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  )
}