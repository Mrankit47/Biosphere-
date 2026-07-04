"use client";
import { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Link from "next/link";
import { ORGANISMS } from "./_data/organisms";
import "./_styles/microorganisms.css";
import dynamic from "next/dynamic";

/* ── DYNAMICALLY IMPORT ORGANISM MODELS ── */
const AmoebaMdl = dynamic(() => import("./_models/AmoebaMdl"), { ssr: false });
const EcoliMdl = dynamic(() => import("./_models/EcoliMdl"), { ssr: false });
const ChlorellaMdl = dynamic(() => import("./_models/ChlorellaMdl"), { ssr: false });
const VolvoxMdl = dynamic(() => import("./_models/VolvoxMdl"), { ssr: false });
const ParameciumMdl = dynamic(() => import("./_models/ParameciumMdl"), { ssr: false });
const EuglenaMdl = dynamic(() => import("./_models/EuglenaMdl"), { ssr: false });
const DNAHelixMdl = dynamic(() => import("./_models/DNAHelixMdl"), { ssr: false });
const AnimalCellMdl = dynamic(() => import("./_models/AnimalCellMdl"), { ssr: false });
const PlantCellMdl = dynamic(() => import("./_models/PlantCellMdl"), { ssr: false });
const BacteriaMdl = dynamic(() => import("./_models/BacteriaMdl"), { ssr: false });
const TardigradeMdl = dynamic(() => import("./_models/TardigradeMdl"), { ssr: false });
const DiatomMdl = dynamic(() => import("./_models/DiatomMdl"), { ssr: false });
const SpirogyraMdl = dynamic(() => import("./_models/SpirogyraMdl"), { ssr: false });
const StentorMdl = dynamic(() => import("./_models/StentorMdl"), { ssr: false });
const HalobacteriumMdl = dynamic(() => import("./_models/HalobacteriumMdl"), { ssr: false });
const CyanobacteriaMdl = dynamic(() => import("./_models/CyanobacteriaMdl"), { ssr: false });
const YeastMdl = dynamic(() => import("./_models/YeastMdl"), { ssr: false });
const PenicilliumMdl = dynamic(() => import("./_models/PenicilliumMdl"), { ssr: false });
const RadiolariaMdl = dynamic(() => import("./_models/RadiolariaMdl"), { ssr: false });
const DinoflagellateMdl = dynamic(() => import("./_models/DinoflagellateMdl"), { ssr: false });
const SpirocheteMdl = dynamic(() => import("./_models/SpirocheteMdl"), { ssr: false });
const SlimeMoldMdl = dynamic(() => import("./_models/SlimeMoldMdl"), { ssr: false });
const VorticellaMdl = dynamic(() => import("./_models/VorticellaMdl"), { ssr: false });
const RotiferMdl = dynamic(() => import("./_models/RotiferMdl"), { ssr: false });
const NematodeMdl = dynamic(() => import("./_models/NematodeMdl"), { ssr: false });
const HydraMdl = dynamic(() => import("./_models/HydraMdl"), { ssr: false });
const DaphniaMdl = dynamic(() => import("./_models/DaphniaMdl"), { ssr: false });
const PlanariaMdl = dynamic(() => import("./_models/PlanariaMdl"), { ssr: false });
const OstracodMdl = dynamic(() => import("./_models/OstracodMdl"), { ssr: false });
const ThermophileMdl = dynamic(() => import("./_models/ThermophileMdl"), { ssr: false });
const TrypanosomaMdl = dynamic(() => import("./_models/TrypanosomaMdl"), { ssr: false });
const GiardiaMdl = dynamic(() => import("./_models/GiardiaMdl"), { ssr: false });
const StreptococcusMdl = dynamic(() => import("./_models/StreptococcusMdl"), { ssr: false });
const BacillusMdl = dynamic(() => import("./_models/BacillusMdl"), { ssr: false });
const MethanogenMdl = dynamic(() => import("./_models/MethanogenMdl"), { ssr: false });

const MODEL_MAP: Record<string, React.ComponentType<{ detail?: boolean }>> = {
  amoeba: AmoebaMdl,
  ecoli: EcoliMdl,
  chlorella: ChlorellaMdl,
  volvox: VolvoxMdl,
  paramecium: ParameciumMdl,
  euglena: EuglenaMdl,
  "dna-helix": DNAHelixMdl,
  "animal-cell": AnimalCellMdl,
  "plant-cell": PlantCellMdl,
  bacteria: BacteriaMdl,
  tardigrade: TardigradeMdl,
  diatom: DiatomMdl,
  spirogyra: SpirogyraMdl,
  stentor: StentorMdl,
  halobacterium: HalobacteriumMdl,
  cyanobacteria: CyanobacteriaMdl,
  yeast: YeastMdl,
  penicillium: PenicilliumMdl,
  radiolaria: RadiolariaMdl,
  dinoflagellate: DinoflagellateMdl,
  spirochete: SpirocheteMdl,
  "slime-mold": SlimeMoldMdl,
  vorticella: VorticellaMdl,
  rotifer: RotiferMdl,
  nematode: NematodeMdl,
  hydra: HydraMdl,
  daphnia: DaphniaMdl,
  planaria: PlanariaMdl,
  ostracod: OstracodMdl,
  thermophile: ThermophileMdl,
  trypanosoma: TrypanosomaMdl,
  giardia: GiardiaMdl,
  streptococcus: StreptococcusMdl,
  bacillus: BacillusMdl,
  methanogen: MethanogenMdl,
};

/* ══════════════════════════════════════════════════════════════
   HERO PARTICLES
   ══════════════════════════════════════════════════════════════ */
const P_COUNT = 2000;
function HeroParticles() {
  const ref = useRef<THREE.Points>(null!);
  const { geo, offs, base } = useMemo(() => {
    const pos = new Float32Array(P_COUNT * 3);
    const off = new Float32Array(P_COUNT * 4);
    for (let i = 0; i < P_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      off[i * 4] = 0.1 + Math.random() * 0.4;
      off[i * 4 + 1] = 0.08 + Math.random() * 0.3;
      off[i * 4 + 2] = 0.2 + Math.random() * 0.8;
      off[i * 4 + 3] = 0.15 + Math.random() * 0.6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geo: g, offs: off, base: new Float32Array(pos) };
  }, []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < P_COUNT; i++) {
      const i3 = i * 3, i4 = i * 4;
      arr[i3] = base[i3] + Math.sin(t * offs[i4] + i) * offs[i4 + 2];
      arr[i3 + 1] = base[i3 + 1] + Math.cos(t * offs[i4 + 1] + i * 0.5) * offs[i4 + 3];
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#39FF14" size={0.035} sizeAttenuation transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO ORGANISMS — Swimming in the background
   ══════════════════════════════════════════════════════════════ */

/* Amoeba-like blob with vertex displacement */
function HeroAmoeba() {
  const ref = useRef<THREE.Mesh>(null!);
  const orig = useRef<Float32Array | null>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.15;
    ref.current.rotation.x = Math.sin(t * 0.1) * 0.2;
    const geo = ref.current.geometry;
    const pos = geo.attributes.position;
    if (!orig.current) orig.current = new Float32Array(pos.array as Float32Array);
    const o = orig.current;
    for (let i = 0; i < pos.count; i++) {
      const ox = o[i * 3], oy = o[i * 3 + 1], oz = o[i * 3 + 2];
      const d = Math.sin(t * 0.5 + ox * 2.5) * 0.15 + Math.cos(t * 0.4 + oy * 3) * 0.12;
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
      (pos.array as Float32Array)[i * 3] = ox + (ox / len) * d;
      (pos.array as Float32Array)[i * 3 + 1] = oy + (oy / len) * d;
      (pos.array as Float32Array)[i * 3 + 2] = oz + (oz / len) * d;
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[2.2, 5]} />
      <meshStandardMaterial color="#39FF14" transparent opacity={0.12} roughness={0.4} metalness={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* Mini E.coli with rotating flagella */
function HeroEcoli({ position }: { position: [number, number, number] }) {
  const gRef = useRef<THREE.Group>(null!);
  const flagRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    gRef.current.position.x = position[0] + Math.sin(t * 0.3) * 1.5;
    gRef.current.position.y = position[1] + Math.cos(t * 0.25) * 0.8;
    gRef.current.rotation.z = Math.sin(t * 0.4) * 0.3;
    if (flagRef.current) flagRef.current.rotation.x = t * 6;
  });
  return (
    <group ref={gRef}>
      <mesh>
        <capsuleGeometry args={[0.12, 0.35, 8, 12]} />
        <meshStandardMaterial color="#EF9F27" emissive="#EF9F27" emissiveIntensity={0.3} transparent opacity={0.5} />
      </mesh>
      <group ref={flagRef} position={[-0.25, 0, 0]}>
        {[0, 1, 2].map(i => (
          <mesh key={i} rotation={[0, 0, (i - 1) * 0.4]}>
            <cylinderGeometry args={[0.005, 0.005, 0.5, 4]} />
            <meshBasicMaterial color="#F0E68C" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* Mini Volvox sphere */
function HeroVolvox({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.4;
    ref.current.rotation.x = t * 0.15;
    ref.current.position.x = position[0] + Math.sin(t * 0.2) * 0.5;
    ref.current.position.y = position[1] + Math.cos(t * 0.15) * 0.3;
  });
  return (
    <group ref={ref} position={position}>
      <mesh>
        <icosahedronGeometry args={[0.5, 2]} />
        <meshStandardMaterial color="#1D9E75" wireframe transparent opacity={0.2} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.48, 1]} />
        <meshStandardMaterial color="#2ECC71" transparent opacity={0.1} />
      </mesh>
      {/* Daughter colony */}
      <mesh position={[0.1, 0.05, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#27AE60" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function HeroScene() {
  return (
    <>
      <color attach="background" args={["#050A05"]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#39FF14" />
      <pointLight position={[-4, -3, 3]} intensity={0.4} color="#1D9E75" />
      <spotLight position={[0, 8, 0]} angle={0.5} penumbra={1} intensity={0.6} color="#ffffff" />
      <HeroParticles />
      <HeroAmoeba />
      <HeroEcoli position={[3, 1.5, -1]} />
      <HeroEcoli position={[-4, -1, 0.5]} />
      <HeroVolvox position={[-2.5, 2, -2]} />
      <HeroVolvox position={[3, -2, -1.5]} />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   MINI 3D CARD ORGANISM
   ══════════════════════════════════════════════════════════════ */
function MiniOrg({ color, accentColor }: { color: string; accentColor: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.3;
    const p = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.03;
    ref.current.scale.setScalar(p);
  });
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 2, 2]} intensity={0.8} color={color} />
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.9, 3]} />
        <meshStandardMaterial color={color} emissive={accentColor} emissiveIntensity={0.3} transparent opacity={0.6} roughness={0.4} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.92, 2]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.08} />
      </mesh>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   ACTUAL CARD ORGANISM RENDERER WITH PERFORMANCE SWITCH
   ══════════════════════════════════════════════════════════════ */
function CardOrganism({ org }: { org: any }) {
  const ModelComponent = MODEL_MAP[org.id];
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.22;
      const p = 0.96 + Math.sin(clock.getElapsedTime() * 1.5) * 0.025;
      groupRef.current.scale.setScalar(p);
    }
  });

  const scale = org.id === "volvox" ? 0.65 : org.id === "dna-helix" ? 0.45 : 0.85;

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[2, 2, 2]} intensity={1.0} color="#ffffff" />
      <pointLight position={[-2, -2, 2]} intensity={0.5} color={org.color} />
      <group ref={groupRef}>
        {ModelComponent ? (
          <Suspense fallback={null}>
            <group scale={scale}>
              <ModelComponent detail={false} />
            </group>
          </Suspense>
        ) : (
          <MiniOrg color={org.color} accentColor={org.accentColor} />
        )}
      </group>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   LAZY CANVAS CARD
   ══════════════════════════════════════════════════════════════ */
function useInView(rootMargin = "100px") {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin]);
  return [ref, isIntersecting] as const;
}

function LazyMicroCanvas({ org }: { org: any }) {
  const [ref, inView] = useInView("150px");
  return (
    <div ref={ref} className="micro-card-canvas">
      {inView ? (
        <Suspense fallback={<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: org.color, fontSize: "2rem" }}>{org.emoji}</div>}>
          {typeof window !== 'undefined' && (
            <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3], fov: 45 }} gl={{ antialias: false, alpha: true }} style={{ background: "transparent" }}>
              <CardOrganism org={org} />
            </Canvas>
          )}
        </Suspense>
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: org.color, fontSize: "2rem" }}>{org.emoji}</div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FILTER TABS
   ══════════════════════════════════════════════════════════════ */
const FILTER_TYPES = ["All", "Protozoa", "Bacteria", "Green Algae", "Fungi", "Micro-animal", "Ciliate", "Archaea"] as const;

/* ══════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════ */
export default function MicroorganismsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [filter, setFilter] = useState("All");
  const [compareMode, setCompareMode] = useState(false);

  const filtered = filter === "All" ? ORGANISMS : ORGANISMS.filter(o => o.type === filter || o.type.includes(filter));

  return (
    <div style={{ background: "#050A05", minHeight: "100vh" }}>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="micro-hero">
        <div className="micro-hero-canvas">
          {mounted && (
            <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
              <HeroScene />
            </Canvas>
          )}
        </div>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(5,10,5,0) 0%, rgba(5,10,5,0.3) 60%, rgba(5,10,5,1) 100%)", pointerEvents: "none" }} />
        <div className="micro-hero-overlay">
          <h1 className="micro-hero-title">MICRO ZOO</h1>
          <p className="micro-hero-sub">A Cinematic Journey Through the Microscopic Universe</p>
          <a href="#gallery" className="micro-hero-cta">Explore Organisms ↓</a>
        </div>
      </section>

      {/* ── FILTER BAR ──────────────────────────────────────── */}
      <section id="gallery" className="micro-gallery">
        <div className="micro-gallery-header">
          <p className="micro-gallery-label">Interactive 3D Collection</p>
          <h2 className="micro-gallery-title">Choose an Organism</h2>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 32, padding: "0 16px" }}>
          {FILTER_TYPES.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: "6px 16px", borderRadius: 999,
              border: filter === t ? "1px solid rgba(57,255,20,0.5)" : "1px solid rgba(255,255,255,0.08)",
              background: filter === t ? "rgba(57,255,20,0.12)" : "rgba(5,10,5,0.6)",
              color: filter === t ? "#39FF14" : "rgba(200,245,200,0.5)",
              fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
              backdropFilter: "blur(4px)", transition: "all 0.2s", fontFamily: "inherit",
            }}>{t}</button>
          ))}
          <button onClick={() => setCompareMode(!compareMode)} style={{
            padding: "6px 16px", borderRadius: 999,
            border: compareMode ? "1px solid #F59E0B50" : "1px solid rgba(255,255,255,0.08)",
            background: compareMode ? "rgba(245,158,11,0.12)" : "rgba(5,10,5,0.6)",
            color: compareMode ? "#F59E0B" : "rgba(200,245,200,0.5)",
            fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
            backdropFilter: "blur(4px)", transition: "all 0.2s", fontFamily: "inherit",
          }}>📏 Compare Sizes</button>
        </div>

        {/* Compare View */}
        {compareMode && (
          <div style={{ maxWidth: 900, margin: "0 auto 40px", padding: "24px", borderRadius: 16, background: "rgba(57,255,20,0.04)", border: "1px solid rgba(57,255,20,0.1)" }}>
            <h3 style={{ color: "#39FF14", fontSize: "1.1rem", margin: "0 0 16px", fontWeight: 700 }}>Size Comparison</h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, overflowX: "auto", paddingBottom: 12 }}>
              {[
                { name: "E. coli", size: 2, color: "#EF9F27" },
                { name: "Chlorella", size: 6, color: "#2ECC71" },
                { name: "Euglena", size: 45, color: "#27AE60" },
                { name: "Paramecium", size: 200, color: "#3498DB" },
                { name: "Amoeba", size: 300, color: "#39FF14" },
                { name: "Volvox", size: 500, color: "#1D9E75" },
              ].map(o => {
                const h = Math.max(8, (o.size / 500) * 120);
                return (
                  <div key={o.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 60 }}>
                    <div style={{ width: Math.max(12, h * 0.6), height: h, borderRadius: "50%", background: `${o.color}30`, border: `2px solid ${o.color}`, transition: "all 0.3s" }} />
                    <span style={{ fontSize: "0.65rem", color: o.color, fontWeight: 700, whiteSpace: "nowrap" }}>{o.name}</span>
                    <span style={{ fontSize: "0.6rem", color: "rgba(200,245,200,0.4)", fontFamily: "monospace" }}>{o.size} μm</span>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, height: 2, background: "rgba(57,255,20,0.2)", position: "relative" }}>
              <span style={{ position: "absolute", right: 0, top: -16, fontSize: "0.6rem", color: "rgba(200,245,200,0.4)", fontFamily: "monospace" }}>scale bar: 10 μm = ▬</span>
            </div>
          </div>
        )}

        <div className="micro-gallery-grid">
          {filtered.map((org) => (
            <Link key={org.id} href={`/microorganisms/${org.id}`} className="micro-card">
              <LazyMicroCanvas org={org} />
              <div className="micro-card-info">
                <p className="micro-card-type">{org.type}</p>
                <h3 className="micro-card-name" style={{ color: org.color }}>{org.emoji} {org.name}</h3>
                <p className="micro-card-sci">{org.scientificName}</p>
                <p className="micro-card-desc">{org.description}</p>
                {/* Extra info badges */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                  <span style={{ padding: "2px 8px", borderRadius: 6, background: `${org.color}12`, border: `1px solid ${org.color}25`, fontSize: "0.65rem", color: `${org.color}CC` }}>{org.size}</span>
                  <span style={{ padding: "2px 8px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.65rem", color: "rgba(200,245,200,0.5)" }}>{org.reproduction}</span>
                </div>
                <div className="micro-card-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BOTTOM STATS ────────────────────────────────────── */}
      <section style={{ padding: "60px 24px 80px", textAlign: "center", borderTop: "1px solid rgba(57,255,20,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
          {[
            { val: "35", label: "3D Organisms" },
            { val: "70+", label: "Interactive Parts" },
            { val: "360°", label: "Full Rotation" },
            { val: "∞", label: "Zoom Levels" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#39FF14", letterSpacing: "0.05em" }}>{s.val}</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(200,245,200,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
