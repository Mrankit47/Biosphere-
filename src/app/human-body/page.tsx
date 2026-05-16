'use client'
import { useState, useRef, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import Link from 'next/link'
import { HumanBodySilhouette, Skeleton, Organs, VascularSystem, MuscleFibers, IsolatedOrgan } from './_components/BodyModel'

/* ══════════════════════════════════════════════════════════════
   ORGAN DATA
   ══════════════════════════════════════════════════════════════ */
const ORGAN_INFO: Record<string, { name: string; emoji: string; color: string; description: string; funFact: string; stats: {label:string;value:string}[] }> = {
  brain: { name: 'Brain', emoji: '🧠', color: '#E879F9', description: 'The control center of the nervous system. Contains ~86 billion neurons that process information, control movement, regulate emotions, and enable thought.', funFact: 'Your brain generates 12-25 watts of electricity — enough to power a low-wattage LED bulb!', stats: [{ label: 'Neurons', value: '86 Billion' }, { label: 'Weight', value: '1.4 kg' }, { label: 'Speed', value: '268 mph' }] },
  heart: { name: 'Heart', emoji: '❤️', color: '#EF4444', description: 'A powerful muscular pump that circulates blood through 60,000 miles of blood vessels, delivering oxygen and nutrients to every cell in your body.', funFact: 'Your heart beats about 100,000 times per day — that\'s 2.5 billion beats in an average lifetime!', stats: [{ label: 'Beats/Day', value: '100,000' }, { label: 'Blood/Day', value: '7,500 L' }, { label: 'Chambers', value: '4' }] },
  lungs: { name: 'Lungs', emoji: '🫁', color: '#F472B6', description: 'Two spongy organs that exchange oxygen and carbon dioxide with every breath. The respiratory system is essential for cellular metabolism.', funFact: 'Spread flat, your lungs would cover an entire tennis court — about 70 square meters!', stats: [{ label: 'Breaths/Day', value: '23,000' }, { label: 'Air/Day', value: '11,000 L' }, { label: 'Alveoli', value: '480M' }] },
  liver: { name: 'Liver', emoji: '🟤', color: '#92400E', description: 'The body\'s chemical factory performing over 500 vital functions including detoxification, protein synthesis, and bile production.', funFact: 'The liver can completely regenerate — it can regrow from just 25% of its tissue!', stats: [{ label: 'Functions', value: '500+' }, { label: 'Weight', value: '1.5 kg' }, { label: 'Blood', value: '1.5 L/m' }] },
  stomach: { name: 'Stomach', emoji: '🟢', color: '#DC2626', description: 'A muscular organ that receives food and secretes hydrochloric acid strong enough to dissolve metal.', funFact: 'Your stomach gets a completely new lining every 3-4 days to prevent self-digestion!', stats: [{ label: 'Capacity', value: '1.5 L' }, { label: 'Acid pH', value: '1.5-3.5' }, { label: 'Renewal', value: '3 days' }] },
  intestines: { name: 'Intestines', emoji: '🌀', color: '#F59E0B', description: 'A 30-foot digestive tract that absorbs nutrients and water. Houses 100 trillion beneficial bacteria.', funFact: 'The small intestine has a surface area of 250 square meters — the size of a tennis court!', stats: [{ label: 'Length', value: '25 ft' }, { label: 'Bacteria', value: '100T' }, { label: 'Area', value: '250 m²' }] },
  kidneys: { name: 'Kidneys', emoji: '🫘', color: '#B91C1C', description: 'Twin bean-shaped organs that filter blood, remove waste, and balance fluids. Each contains 1 million nephrons.', funFact: 'Your kidneys filter about 180 liters of blood every day — enough to fill a bathtub!', stats: [{ label: 'Filter/Day', value: '180 L' }, { label: 'Nephrons', value: '2M' }, { label: 'Weight', value: '150g ea' }] },
  bladder: { name: 'Bladder', emoji: '💧', color: '#FCD34D', description: 'A hollow muscular organ that collects and stores urine from the kidneys until it is eliminated.', funFact: 'The bladder can stretch to hold up to 600ml of urine comfortably!', stats: [{ label: 'Capacity', value: '500 ml' }, { label: 'Signal', value: 'at 25%' }, { label: 'Weight', value: '50g' }] },
}

/* ══════════════════════════════════════════════════════════════
   SCENE
   ══════════════════════════════════════════════════════════════ */
function BodyScene({ selectedOrgan, setSelectedOrgan, activeSystem, setActiveSystem }: { selectedOrgan: string | null; setSelectedOrgan: (s: string | null) => void; activeSystem: string | null; setActiveSystem: (s: string | null) => void }) {
  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.3} />
      <spotLight position={[8, 12, 8]} angle={0.2} penumbra={1} intensity={2} castShadow color="#ffffff" />
      <spotLight position={[-6, 8, -6]} angle={0.3} penumbra={1} intensity={0.8} color="#E24B4A" />
      <pointLight position={[0, 15, 5]} intensity={0.4} color="#39FF14" />

      <HumanBodySilhouette opacity={activeSystem ? 0.08 : 0.18} />
      <Skeleton />
      <MuscleFibers />
      <Organs selected={selectedOrgan} onSelect={setSelectedOrgan} />
      <VascularSystem activeSystem={activeSystem} onSelect={setActiveSystem} />

      <ContactShadows position={[0, -5, 0]} opacity={0.3} scale={20} blur={2} far={10} />
      <OrbitControls enablePan={false} minDistance={6} maxDistance={30} target={[0, 3, 0]} />
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════ */
export default function HumanBodyPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null)
  const [activeSystem, setActiveSystem] = useState<string | null>(null)
  const [detailModal, setDetailModal] = useState(false)

  const info = selectedOrgan ? ORGAN_INFO[selectedOrgan] : null

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#030303', color: '#fff', position: 'relative', overflow: 'hidden' }}>

      {/* Subtle grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '30px 30px', pointerEvents: 'none', zIndex: 1 }} />

      {/* Top Nav */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ color: 'rgba(200,245,200,0.7)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '100px', fontSize: '0.8rem', backdropFilter: 'blur(8px)' }}>← Back</Link>
          <h1 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '0.15em', fontWeight: 800, color: '#EF4444' }}>ANATOMY EXPLORER</h1>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>INTERACTIVE 3D</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[{ key: 'artery', label: 'Arteries', color: '#EF4444' }, { key: 'vein', label: 'Veins', color: '#3B82F6' }, { key: 'nerve', label: 'Nerves', color: '#FACC15' }].map(s => (
            <button key={s.key} onClick={() => setActiveSystem(activeSystem === s.key ? null : s.key)} style={{ padding: '6px 16px', borderRadius: '100px', border: `1px solid ${activeSystem === s.key ? s.color : 'rgba(255,255,255,0.15)'}`, background: activeSystem === s.key ? `${s.color}20` : 'rgba(0,0,0,0.4)', color: activeSystem === s.key ? s.color : 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.3s' }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: s.color, marginRight: 6, boxShadow: activeSystem === s.key ? `0 0 8px ${s.color}` : 'none' }} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas */}
      {mounted && (
        <Canvas shadows gl={{ antialias: true, alpha: true }} onPointerMissed={() => { setSelectedOrgan(null); setActiveSystem(null) }}>
          <Suspense fallback={null}>
            <BodyScene selectedOrgan={selectedOrgan} setSelectedOrgan={setSelectedOrgan} activeSystem={activeSystem} setActiveSystem={setActiveSystem} />
          </Suspense>
        </Canvas>
      )}

      {/* Organ Info Panel */}
      {info && (
        <div style={{ position: 'absolute', top: '15%', right: '1.5rem', width: '360px', background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(24px)', border: `1px solid ${info.color}30`, borderRadius: '20px', padding: '2rem', boxShadow: `0 0 60px ${info.color}15, inset 0 0 30px rgba(0,0,0,0.5)`, zIndex: 60, maxHeight: '75vh', overflowY: 'auto' }}
          onWheel={e => e.stopPropagation()} onPointerDown={e => e.stopPropagation()}
        >
          {/* Close */}
          <button onClick={() => setSelectedOrgan(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1rem', cursor: 'pointer' }}>✕</button>

          {/* Emoji + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.2rem' }}>
            <div style={{ width: 50, height: 50, borderRadius: '14px', background: `${info.color}15`, border: `1px solid ${info.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>{info.emoji}</div>
            <div>
              <div style={{ fontSize: '0.6rem', color: info.color, letterSpacing: '0.15em', marginBottom: 2 }}>SPECIMEN</div>
              <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900 }}>{info.name}</h2>
            </div>
          </div>

          {/* Description */}
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', marginBottom: 6 }}>FUNCTION</div>
            <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)' }}>{info.description}</p>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '1rem' }}>
            {info.stats.map(s => (
              <div key={s.label} style={{ padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>{s.label}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: info.color, marginTop: 2 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Fun Fact */}
          <div style={{ padding: '14px', borderRadius: '12px', background: `${info.color}08`, border: `1px solid ${info.color}15`, display: 'flex', gap: '10px', marginBottom: '1.2rem' }}>
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>💡</span>
            <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>{info.funFact}</p>
          </div>

          {/* Detail button */}
          <button onClick={() => setDetailModal(true)} style={{ width: '100%', padding: '14px', borderRadius: '100px', border: 'none', background: info.color, color: '#000', fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', boxShadow: `0 8px 30px ${info.color}40`, transition: 'all 0.3s' }}>
            🔬 ISOLATE 3D SPECIMEN
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal && info && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)', zIndex: 200, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: info.color, letterSpacing: '0.2em' }}>DETAILED VIEW</div>
              <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900 }}>{info.name}</h2>
            </div>
            <button onClick={() => setDetailModal(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '100px', cursor: 'pointer', fontSize: '0.8rem' }}>✕ CLOSE</button>
          </div>
          <div style={{ flex: 1 }}>
            {mounted && (
              <Canvas camera={{ position: [0, 0, 4] }}>
                <Suspense fallback={null}>
                  <Environment preset="city" />
                  <ambientLight intensity={0.5} />
                  <spotLight position={[5, 5, 5]} intensity={1.5} />
                  <spotLight position={[-5, -3, -5]} intensity={0.5} color="#E24B4A" />
                  <IsolatedOrgan organId={selectedOrgan!} />
                  <OrbitControls enablePan={false} />
                </Suspense>
              </Canvas>
            )}
          </div>
          <div style={{ padding: '2rem 3rem', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', maxWidth: 700 }}>{info.description}</p>
            <div style={{ display: 'flex', gap: '3rem', marginTop: '1rem' }}>
              {info.stats.map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{s.label}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: info.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom hint */}
      {!selectedOrgan && !activeSystem && (
        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', letterSpacing: '0.15em', pointerEvents: 'none', zIndex: 5, animation: 'pulse 2s ease-in-out infinite' }}>
          CLICK ORGANS · TOGGLE SYSTEMS · DRAG TO ROTATE
        </div>
      )}

      {/* System Legend */}
      {activeSystem && (
        <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', zIndex: 50, padding: '1rem 1.5rem', borderRadius: '14px', background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginBottom: 8 }}>ACTIVE SYSTEM</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: activeSystem === 'artery' ? '#EF4444' : activeSystem === 'vein' ? '#3B82F6' : '#FACC15' }}>
            {activeSystem === 'artery' ? '❤️ Arterial System (Red)' : activeSystem === 'vein' ? '💙 Venous System (Blue)' : '⚡ Nervous System (Yellow)'}
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
            {activeSystem === 'artery' ? 'Carries oxygenated blood FROM the heart to all organs and tissues.' : activeSystem === 'vein' ? 'Returns deoxygenated blood TO the heart for re-oxygenation.' : 'Transmits electrical signals between the brain and every part of the body.'}
          </p>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100% { opacity:0.3 } 50% { opacity:0.8 } }
        body { margin:0; cursor: crosshair; }
        @media (max-width: 768px) {
          div[style*="right: 1.5rem"] { right: 0.5rem !important; width: 90vw !important; top: auto !important; bottom: 0 !important; max-height: 50vh !important; border-radius: 20px 20px 0 0 !important; }
        }
      `}</style>
    </div>
  )
}