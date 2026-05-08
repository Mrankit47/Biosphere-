"use client";

import { useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

/* ── Data ──────────────────────────────────────────────────── */
interface MicrobeInfo {
  id: string;
  name: string;
  type: string;
  size: string;
  habitat: string;
  funFact: string;
  color: string;
  emoji: string;
}

const MICROBES: MicrobeInfo[] = [
  { id: "volvox", name: "Volvox", type: "Green Algae", size: "0.5mm", habitat: "Fresh water ponds", funFact: "Lives in colonies of up to 50,000 cells!", color: "#1D9E75", emoji: "🟢" },
  { id: "chlorella", name: "Chlorella", type: "Green Algae", size: "2-10 micrometers", habitat: "Fresh/salt water", funFact: "Used as a superfood supplement worldwide", color: "#39FF14", emoji: "🌿" },
  { id: "ecoli", name: "E. coli", type: "Bacteria", size: "2 micrometers", habitat: "Animal intestines", funFact: "Most E.coli strains are harmless and help digestion", color: "#EF9F27", emoji: "🦠" },
  { id: "amoeba", name: "Amoeba", type: "Protozoa", size: "0.1-0.5mm", habitat: "Soil and water", funFact: "Moves by extending pseudopods (false feet)", color: "#9B59B6", emoji: "🫧" },
];

/* ── Volvox ─────────────────────────────────────────────────── */
function Volvox({ active, onHover, onClick }: { active: boolean; onHover: (v: boolean) => void; onClick: () => void }) {
  const groupRef = useRef<THREE.Group>(null!);
  const childPositions = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 32; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 32);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.2;
      pts.push([r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)]);
    }
    return pts;
  }, []);

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.15;
  });

  const s = active ? 1.1 : 1;
  return (
    <group ref={groupRef} position={[-3, 0, 0]} scale={[s, s, s]} onPointerOver={() => onHover(true)} onPointerOut={() => onHover(false)} onClick={onClick}>
      <mesh><sphereGeometry args={[1.2, 24, 24]} /><meshStandardMaterial color="#1D9E75" transparent opacity={0.25} roughness={0.4} /></mesh>
      <mesh><sphereGeometry args={[1.22, 16, 16]} /><meshBasicMaterial color="#39FF14" wireframe transparent opacity={0.06} /></mesh>
      {childPositions.map((p, i) => (
        <mesh key={i} position={p}><sphereGeometry args={[0.08, 8, 8]} /><meshStandardMaterial color={active ? "#5FFF9F" : "#1D9E75"} emissive={active ? "#1D9E75" : "#0A3D2E"} emissiveIntensity={active ? 1.5 : 0.4} /></mesh>
      ))}
      <Text position={[0, 1.8, 0]} fontSize={0.22} color="#1D9E75" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#000000">Volvox</Text>
    </group>
  );
}

/* ── Chlorella ──────────────────────────────────────────────── */
function Chlorella({ active, onHover, onClick }: { active: boolean; onHover: (v: boolean) => void; onClick: () => void }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = 0.95 + Math.sin(t * 2) * 0.05;
    const s = active ? pulse * 1.1 : pulse;
    ref.current.scale.setScalar(s);
    ref.current.rotation.y = t * 0.3;
  });
  return (
    <group position={[2.5, 1.5, 0]} onPointerOver={() => onHover(true)} onPointerOut={() => onHover(false)} onClick={onClick}>
      <mesh ref={ref}><sphereGeometry args={[0.6, 32, 32]} /><meshStandardMaterial color={active ? "#5FFF4F" : "#39FF14"} emissive={active ? "#39FF14" : "#0A3D0A"} emissiveIntensity={active ? 1.5 : 0.4} roughness={0.3} /></mesh>
      <Text position={[0, 1.1, 0]} fontSize={0.2} color="#39FF14" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#000000">Chlorella</Text>
    </group>
  );
}

/* ── E. coli ────────────────────────────────────────────────── */
function Ecoli({ active, onHover, onClick }: { active: boolean; onHover: (v: boolean) => void; onClick: () => void }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.z = t * 0.4;
    ref.current.rotation.x = Math.sin(t * 0.3) * 0.5;
  });
  const s = active ? 1.1 : 1;
  return (
    <group position={[2.5, -1.5, 0]} scale={[s, s, s]} onPointerOver={() => onHover(true)} onPointerOut={() => onHover(false)} onClick={onClick}>
      <group ref={ref}>
        <mesh><capsuleGeometry args={[0.3, 1.2, 16, 24]} /><meshStandardMaterial color={active ? "#FFB84D" : "#EF9F27"} emissive={active ? "#EF9F27" : "#4A3506"} emissiveIntensity={active ? 1.5 : 0.3} roughness={0.5} /></mesh>
        {/* Flagella */}
        {[0, 1, 2].map(i => {
          const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -0.9, 0),
            new THREE.Vector3(0.2 * Math.sin(i * 2), -1.3, 0.2 * Math.cos(i * 2)),
            new THREE.Vector3(-0.15 * Math.sin(i * 2 + 1), -1.7, -0.15 * Math.cos(i * 2 + 1)),
            new THREE.Vector3(0.1 * Math.sin(i * 2 + 2), -2.1, 0.1 * Math.cos(i * 2 + 2)),
          ]);
          return <mesh key={i}><tubeGeometry args={[curve, 20, 0.015, 6, false]} /><meshStandardMaterial color="#EF9F27" emissive="#EF9F27" emissiveIntensity={0.3} /></mesh>;
        })}
      </group>
      <Text position={[0, 1.2, 0]} fontSize={0.2} color="#EF9F27" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#000000">E. coli</Text>
    </group>
  );
}

/* ── Amoeba ─────────────────────────────────────────────────── */
function Amoeba({ active, onHover, onClick }: { active: boolean; onHover: (v: boolean) => void; onClick: () => void }) {
  const ref = useRef<THREE.Mesh>(null!);
  const originalPositions = useRef<Float32Array | null>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const geo = ref.current.geometry;
    const pos = geo.attributes.position;
    if (!originalPositions.current) {
      originalPositions.current = new Float32Array(pos.array as Float32Array);
    }
    const orig = originalPositions.current;
    for (let i = 0; i < pos.count; i++) {
      const ox = orig[i * 3], oy = orig[i * 3 + 1], oz = orig[i * 3 + 2];
      const displacement = Math.sin(t * 0.8 + ox * 3) * 0.08 + Math.cos(t * 0.6 + oy * 4) * 0.06 + Math.sin(t * 1.1 + oz * 2.5) * 0.07;
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
      const nx = ox / len, ny = oy / len, nz = oz / len;
      (pos.array as Float32Array)[i * 3] = ox + nx * displacement;
      (pos.array as Float32Array)[i * 3 + 1] = oy + ny * displacement;
      (pos.array as Float32Array)[i * 3 + 2] = oz + nz * displacement;
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    ref.current.rotation.y = t * 0.15;
  });

  const s = active ? 1.1 : 1;
  return (
    <group position={[-2, 1.5, 0]} scale={[s, s, s]} onPointerOver={() => onHover(true)} onPointerOut={() => onHover(false)} onClick={onClick}>
      <mesh ref={ref}><icosahedronGeometry args={[0.7, 3]} /><meshStandardMaterial color={active ? "#C97FE8" : "#9B59B6"} emissive={active ? "#9B59B6" : "#2D1A3D"} emissiveIntensity={active ? 1.5 : 0.4} transparent opacity={0.75} roughness={0.4} /></mesh>
      {/* Nucleus inside */}
      <mesh position={[0.1, 0, 0]}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial color="#6C3483" emissive="#6C3483" emissiveIntensity={0.5} /></mesh>
      <Text position={[0, 1.3, 0]} fontSize={0.2} color="#9B59B6" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#000000">Amoeba</Text>
    </group>
  );
}

/* ── Scene ──────────────────────────────────────────────────── */
function ZooScene({ activeId, onHover, onClick }: { activeId: string | null; onHover: (id: string | null) => void; onClick: (id: string) => void }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -3, 3]} intensity={0.6} color="#39FF14" />
      <pointLight position={[0, 0, 5]} intensity={0.4} color="#1D9E75" />
      <fog attach="fog" args={["#050A05", 12, 25]} />

      <Volvox active={activeId === "volvox"} onHover={v => onHover(v ? "volvox" : null)} onClick={() => onClick("volvox")} />
      <Chlorella active={activeId === "chlorella"} onHover={v => onHover(v ? "chlorella" : null)} onClick={() => onClick("chlorella")} />
      <Ecoli active={activeId === "ecoli"} onHover={v => onHover(v ? "ecoli" : null)} onClick={() => onClick("ecoli")} />
      <Amoeba active={activeId === "amoeba"} onHover={v => onHover(v ? "amoeba" : null)} onClick={() => onClick("amoeba")} />

      <OrbitControls enablePan={false} minDistance={4} maxDistance={14} enableDamping dampingFactor={0.05} />
    </>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function MicroorganismsPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleClick = useCallback((id: string) => {
    setSelectedId(prev => (prev === id ? null : id));
  }, []);

  const selected = selectedId ? MICROBES.find(m => m.id === selectedId) : null;

  return (
    <div style={S.root}>
      <div style={S.canvasWrap}>
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true }} style={{ background: "#050A05" }}>
          <ZooScene activeId={hoveredId || selectedId} onHover={setHoveredId} onClick={handleClick} />
        </Canvas>
      </div>

      {/* Header */}
      <div style={S.header}>
        <h1 style={S.title}>🦠 Microorganism Zoo</h1>
        <p style={S.subtitle}>Click any organism to learn more</p>
      </div>

      {/* Popup Card */}
      <div style={{ ...S.card, transform: selected ? "translateY(0)" : "translateY(120%)", opacity: selected ? 1 : 0 }}>
        {selected && (
          <>
            <button style={S.cardClose} onClick={() => setSelectedId(null)}>✕</button>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span style={{ fontSize: "1.5rem" }}>{selected.emoji}</span>
              <h2 style={{ ...S.cardName, color: selected.color }}>{selected.name}</h2>
            </div>

            <div style={S.cardGrid}>
              <div style={S.cardStat}><span style={S.cardStatLabel}>Type</span><span style={S.cardStatValue}>{selected.type}</span></div>
              <div style={S.cardStat}><span style={S.cardStatLabel}>Size</span><span style={S.cardStatValue}>{selected.size}</span></div>
              <div style={S.cardStat}><span style={S.cardStatLabel}>Habitat</span><span style={S.cardStatValue}>{selected.habitat}</span></div>
            </div>

            <div style={{ ...S.funFact, borderColor: `${selected.color}30` }}>
              <span>💡</span>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "rgba(200,245,200,0.8)", lineHeight: 1.5 }}>{selected.funFact}</p>
            </div>
          </>
        )}
      </div>

      {/* Bottom legend */}
      <div style={S.legend}>
        {MICROBES.map(m => (
          <button key={m.id} style={{ ...S.legendBtn, borderColor: selectedId === m.id ? m.color : "rgba(255,255,255,0.08)", background: selectedId === m.id ? `${m.color}15` : "rgba(5,10,5,0.6)" }} onClick={() => handleClick(m.id)}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, display: "inline-block", boxShadow: `0 0 6px ${m.color}80`, flexShrink: 0 }} />
            <span style={{ fontSize: "0.72rem", opacity: 0.85 }}>{m.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────── */
const S: Record<string, React.CSSProperties> = {
  root: { position: "relative", width: "100%", height: "calc(100vh - 64px)", background: "#050A05", overflow: "hidden" },
  canvasWrap: { position: "absolute", inset: 0, zIndex: 0 },
  header: { position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 10, textAlign: "center", pointerEvents: "none" },
  title: { fontSize: "1.4rem", fontWeight: 700, color: "#39FF14", letterSpacing: "0.06em", margin: 0, textShadow: "0 0 20px rgba(57,255,20,0.3)" },
  subtitle: { fontSize: "0.75rem", color: "rgba(200,245,200,0.45)", margin: "4px 0 0", letterSpacing: "0.12em", textTransform: "uppercase" as const },

  card: {
    position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 20,
    width: "min(420px, 90vw)", padding: "20px 24px", borderRadius: "16px",
    background: "rgba(5,10,5,0.9)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(57,255,20,0.1)", transition: "transform 0.5s cubic-bezier(0.25,0.8,0.25,1), opacity 0.4s ease",
    boxShadow: "0 -10px 40px rgba(0,0,0,0.4)",
  },
  cardClose: { position: "absolute", top: 12, right: 14, background: "none", border: "none", color: "rgba(200,245,200,0.4)", fontSize: "1rem", cursor: "none", fontFamily: "inherit" },
  cardName: { fontSize: "1.25rem", fontWeight: 700, margin: 0, letterSpacing: "0.03em" },
  cardGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "12px" },
  cardStat: { padding: "8px 10px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: "2px" },
  cardStatLabel: { fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(200,245,200,0.4)" },
  cardStatValue: { fontSize: "0.8rem", color: "rgba(200,245,200,0.85)", fontWeight: 500 },
  funFact: { display: "flex", gap: "10px", alignItems: "flex-start", padding: "10px 14px", borderRadius: "10px", background: "rgba(57,255,20,0.03)", border: "1px solid rgba(57,255,20,0.08)" },

  legend: { position: "absolute", bottom: 24, left: 24, zIndex: 10, display: "flex", flexDirection: "column", gap: 4 },
  legendBtn: { display: "flex", alignItems: "center", gap: 8, padding: "5px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", color: "#C8F5C8", cursor: "none", transition: "all 0.25s ease", backdropFilter: "blur(6px)", fontFamily: "inherit", background: "none" },
};
