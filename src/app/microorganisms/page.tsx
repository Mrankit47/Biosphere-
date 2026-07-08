"use client";
import { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Link from "next/link";
import { ORGANISMS } from "./_data/organisms";
import dynamic from "next/dynamic";
import { PageHeader, BackLink, GlowButton, GlassCard, GalleryGrid } from "@/components/ds";

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
      <icosahedronGeometry args={[2.0, 4]} />
      <meshStandardMaterial color="#39FF14" transparent opacity={0.05} roughness={0.5} metalness={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}

function HeroScene() {
  return (
    <>
      <color attach="background" args={["#050A05"]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#39FF14" />
      <pointLight position={[-4, -3, 3]} intensity={0.4} color="#00D4AA" />
      <HeroParticles />
      <HeroAmoeba />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   MINI ORGANISM PREVIEW
   ══════════════════════════════════════════════════════════════ */
function MiniOrganism({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.35;
    ref.current.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.05;
  });
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[2, 2, 2]} intensity={0.8} color={color} />
      <mesh ref={ref}>
        <sphereGeometry args={[0.75, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={0.65} roughness={0.3} metalness={0.1} />
      </mesh>
    </>
  );
}

/* ── ACTUAL CARD ORGANISM RENDERER ── */
function CardOrganism({ org }: { org: any }) {
  const ModelComponent = MODEL_MAP[org.id];
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.25;
      const scaleVal = 0.95 + Math.sin(clock.getElapsedTime() * 1.4) * 0.03;
      groupRef.current.scale.setScalar(scaleVal);
    }
  });

  let scale = 0.9;
  if (org.id === "tardigrade") scale = 0.7;
  else if (org.id === "hydra") scale = 0.55;
  else if (org.id === " volvox") scale = 0.85;

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
          <MiniOrganism color={org.color} />
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
    <div ref={ref} className="w-full h-[220px] relative bg-[rgba(5,10,5,0.5)] md:h-[180px]">
      {inView ? (
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-[2rem]" style={{ color: org.color }}>{org.emoji}</div>}>
          {typeof window !== 'undefined' && (
            <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3], fov: 45 }} gl={{ antialias: false, alpha: true }} style={{ background: "transparent" }}>
              <CardOrganism org={org} />
            </Canvas>
          )}
        </Suspense>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[2rem]" style={{ color: org.color }}>{org.emoji}</div>
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
    <div className="bg-[#050A05] min-h-screen text-[var(--ds-fg)]">
      <BackLink href="/" label="Home" />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative w-full h-[100vh] overflow-hidden flex items-center justify-center" aria-label="Hero">
        <div className="absolute inset-0 z-0">
          {mounted && (
            <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
              <HeroScene />
            </Canvas>
          )}
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-[rgba(5,10,5,0.3)] to-[#050A05] pointer-events-none" />
        <div className="relative z-[2] text-center pointer-events-none flex flex-col items-center gap-4 px-6">
          <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black tracking-[0.15em] text-white m-0 drop-shadow-[0_0_60px_rgba(57,255,20,0.2)]">
            MICRO ZOO
          </h1>
          <p className="text-[clamp(0.85rem,2vw,1.2rem)] text-[var(--ds-accent-muted)] tracking-[0.2em] uppercase m-0">
            A Cinematic Journey Through the Microscopic Universe
          </p>
          <div className="mt-4 pointer-events-auto">
            <GlowButton href="#gallery">
              Explore Organisms ↓
            </GlowButton>
          </div>
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────────────────────── */}
      <section id="gallery" className="relative p-[80px_24px_100px] max-w-[1400px] mx-auto md:p-[48px_16px_60px]">
        <div className="text-center mb-[60px]">
          <p className="text-[0.7rem] tracking-[0.25em] uppercase text-[var(--ds-accent-muted)] mb-2">
            Interactive 3D Collection
          </p>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-white m-0 tracking-[0.04em]">
            Choose an Organism
          </h2>
        </div>

        {/* Filter Bar */}
        <div className="flex justify-center gap-2 flex-wrap mb-8 px-4">
          {FILTER_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`
                px-4 py-1.5 rounded-full border text-[0.78rem] font-semibold cursor-none backdrop-blur-md transition-all duration-200 font-[inherit]
                ${filter === t
                  ? "border-[rgba(57,255,20,0.5)] bg-[rgba(57,255,20,0.12)] text-[#39FF14]"
                  : "border-[rgba(255,255,255,0.08)] bg-[rgba(5,10,5,0.6)] text-[var(--ds-fg-muted)] hover:text-white hover:border-[rgba(57,255,20,0.3)]"
                }
              `}
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`
              px-4 py-1.5 rounded-full border text-[0.78rem] font-semibold cursor-none backdrop-blur-md transition-all duration-200 font-[inherit]
              ${compareMode
                ? "border-[rgba(245,158,11,0.5)] bg-[rgba(245,158,11,0.12)] text-[#F59E0B]"
                : "border-[rgba(255,255,255,0.08)] bg-[rgba(5,10,5,0.6)] text-[var(--ds-fg-muted)] hover:text-white hover:border-[rgba(245,158,11,0.3)]"
              }
            `}
          >
            📏 Compare Sizes
          </button>
        </div>

        {/* Compare View */}
        {compareMode && (
          <div className="max-w-[900px] mx-auto mb-10 p-6 rounded-2xl bg-[rgba(57,255,20,0.04)] border border-[rgba(57,255,20,0.1)]">
            <h3 className="text-[#39FF14] text-[1.1rem] m-0 mb-4 font-bold">Size Comparison</h3>
            <div className="flex items-end gap-4 overflow-x-auto pb-3">
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
                  <div key={o.name} className="flex flex-col items-center gap-1.5 min-w-[60px]">
                    <div className="rounded-full border-2 transition-all duration-300" style={{ width: Math.max(12, h * 0.6), height: h, backgroundColor: `${o.color}30`, borderColor: o.color }} />
                    <span className="text-[0.65rem] font-bold white-space-nowrap" style={{ color: o.color }}>{o.name}</span>
                    <span className="text-[0.6rem] text-[var(--ds-fg-subtle)] font-mono">{o.size} μm</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 h-[2px] bg-[rgba(57,255,20,0.2)] relative">
              <span className="absolute right-0 top-[-16px] text-[0.6rem] text-[var(--ds-fg-subtle)] font-mono">scale bar: 10 μm = ▬</span>
            </div>
          </div>
        )}

        <GalleryGrid minItemWidth="300px" gap="24px" className="max-w-[1400px] w-full md:grid-cols-1">
          {filtered.map((org) => (
            <GlassCard
              key={org.id}
              href={`/microorganisms/${org.id}`}
              className="group/card overflow-hidden bg-[rgba(10,20,10,0.6)] border-[rgba(57,255,20,0.08)] hover:border-[rgba(57,255,20,0.2)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(57,255,20,0.06)]"
            >
              <LazyMicroCanvas org={org} />
              <div className="p-5 flex flex-col gap-1 relative">
                <p className="text-[0.6rem] tracking-[0.15em] uppercase text-[var(--ds-fg-subtle)] m-0">{org.type}</p>
                <h3 className="text-[1.15rem] font-bold m-0 tracking-wide" style={{ color: org.color }}>{org.emoji} {org.name}</h3>
                <p className="text-[0.75rem] font-style-italic text-[var(--ds-fg-subtle)] italic m-0">{org.scientificName}</p>
                <p className="text-[0.78rem] text-[var(--ds-fg-muted)] leading-relaxed m-0 line-clamp-2 mt-1">{org.description}</p>
                <div className="flex gap-1.5 flex-wrap mt-3">
                  <span className="px-2 py-0.5 rounded-md border text-[0.65rem] font-medium" style={{ background: `${org.color}12`, borderColor: `${org.color}25`, color: `${org.color}CC` }}>{org.size}</span>
                  <span className="px-2 py-0.5 rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[0.65rem] text-[var(--ds-fg-muted)]">{org.reproduction}</span>
                </div>
                <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full border border-[rgba(57,255,20,0.15)] text-[rgba(57,255,20,0.5)] flex items-center justify-center transition-all duration-300 group-hover/card:border-[rgba(57,255,20,0.4)] group-hover/card:text-[#39FF14] group-hover/card:bg-[rgba(57,255,20,0.08)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </div>
            </GlassCard>
          ))}
        </GalleryGrid>
      </section>

      {/* ── BOTTOM STATS ────────────────────────────────────── */}
      <section className="py-[60px] px-6 text-center border-t border-[rgba(57,255,20,0.06)]">
        <div className="flex justify-center gap-[48px] flex-wrap">
          {[
            { val: "35", label: "3D Organisms" },
            { val: "70+", label: "Interactive Parts" },
            { val: "360°", label: "Full Rotation" },
            { val: "∞", label: "Zoom Levels" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-[2rem] font-extrabold text-[#39FF14] tracking-wider">{s.val}</div>
              <div className="text-[0.7rem] text-[var(--ds-fg-subtle)] tracking-[0.12em] uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
