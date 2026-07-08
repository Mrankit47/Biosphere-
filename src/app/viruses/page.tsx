"use client";
import { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Link from "next/link";
import { VIRUSES } from "./_data/viruses";
import dynamic from "next/dynamic";
import { PageHeader, BackLink, GlowButton, GlassCard, GalleryGrid } from "@/components/ds";

/* ── DYNAMICALLY IMPORT VIRUS MODELS ── */
const CoronavirusMdl = dynamic(() => import("./_models/CoronavirusMdl"), { ssr: false });
const HIVMdl = dynamic(() => import("./_models/HIVMdl"), { ssr: false });
const InfluenzaMdl = dynamic(() => import("./_models/InfluenzaMdl"), { ssr: false });
const EbolaMdl = dynamic(() => import("./_models/EbolaMdl"), { ssr: false });
const RabiesMdl = dynamic(() => import("./_models/RabiesMdl"), { ssr: false });
const BacteriophageMdl = dynamic(() => import("./_models/BacteriophageMdl"), { ssr: false });
const DengueMdl = dynamic(() => import("./_models/DengueMdl"), { ssr: false });
const HepatitisBMdl = dynamic(() => import("./_models/HepatitisBMdl"), { ssr: false });
const MeaslesMdl = dynamic(() => import("./_models/MeaslesMdl"), { ssr: false });
const TMVMdl = dynamic(() => import("./_models/TMVMdl"), { ssr: false });
const AdenovirusMdl = dynamic(() => import("./_models/AdenovirusMdl"), { ssr: false });
const ZikaMdl = dynamic(() => import("./_models/ZikaMdl"), { ssr: false });
const SmallpoxMdl = dynamic(() => import("./_models/SmallpoxMdl"), { ssr: false });
const HerpesMdl = dynamic(() => import("./_models/HerpesMdl"), { ssr: false });
const RotavirusMdl = dynamic(() => import("./_models/RotavirusMdl"), { ssr: false });
const MarburgMdl = dynamic(() => import("./_models/MarburgMdl"), { ssr: false });
const NorovirusMdl = dynamic(() => import("./_models/NorovirusMdl"), { ssr: false });
const HPVMdl = dynamic(() => import("./_models/HPVMdl"), { ssr: false });
const PoliovirusMdl = dynamic(() => import("./_models/PoliovirusMdl"), { ssr: false });
const MimivirusMdl = dynamic(() => import("./_models/MimivirusMdl"), { ssr: false });
const LambdaPhageMdl = dynamic(() => import("./_models/LambdaPhageMdl"), { ssr: false });
const RubellaMdl = dynamic(() => import("./_models/RubellaMdl"), { ssr: false });
const MumpsMdl = dynamic(() => import("./_models/MumpsMdl"), { ssr: false });
const HCVMdl = dynamic(() => import("./_models/HCVMdl"), { ssr: false });
const LassaMdl = dynamic(() => import("./_models/LassaMdl"), { ssr: false });
const HantavirusMdl = dynamic(() => import("./_models/HantavirusMdl"), { ssr: false });
const NipahMdl = dynamic(() => import("./_models/NipahMdl"), { ssr: false });
const RiftValleyMdl = dynamic(() => import("./_models/RiftValleyMdl"), { ssr: false });
const ChikungunyaMdl = dynamic(() => import("./_models/ChikungunyaMdl"), { ssr: false });
const JapaneseEncephalitisMdl = dynamic(() => import("./_models/JapaneseEncephalitisMdl"), { ssr: false });
const VaricellaMdl = dynamic(() => import("./_models/VaricellaMdl"), { ssr: false });
const RhinovirusMdl = dynamic(() => import("./_models/RhinovirusMdl"), { ssr: false });
const WestNileMdl = dynamic(() => import("./_models/WestNileMdl"), { ssr: false });
const MERSMdl = dynamic(() => import("./_models/MERSMdl"), { ssr: false });

const MODEL_MAP: Record<string, React.ComponentType<{ detail?: boolean }>> = {
  "sars-cov-2": CoronavirusMdl,
  hiv: HIVMdl,
  influenza: InfluenzaMdl,
  ebola: EbolaMdl,
  rabies: RabiesMdl,
  bacteriophage: BacteriophageMdl,
  dengue: DengueMdl,
  "hepatitis-b": HepatitisBMdl,
  measles: MeaslesMdl,
  tmv: TMVMdl,
  adenovirus: AdenovirusMdl,
  zika: ZikaMdl,
  smallpox: SmallpoxMdl,
  herpes: HerpesMdl,
  rotavirus: RotavirusMdl,
  marburg: MarburgMdl,
  norovirus: NorovirusMdl,
  hpv: HPVMdl,
  poliovirus: PoliovirusMdl,
  mimivirus: MimivirusMdl,
  "lambda-phage": LambdaPhageMdl,
  rubella: RubellaMdl,
  mumps: MumpsMdl,
  "hepatitis-c": HCVMdl,
  lassa: LassaMdl,
  hanta: HantavirusMdl,
  nipah: NipahMdl,
  "rift-valley": RiftValleyMdl,
  chikungunya: ChikungunyaMdl,
  "japanese-encephalitis": JapaneseEncephalitisMdl,
  varicella: VaricellaMdl,
  rhinovirus: RhinovirusMdl,
  "west-nile": WestNileMdl,
  mers: MERSMdl,
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
      <pointsMaterial color="#E24B4A" size={0.035} sizeAttenuation transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO VIRUS BLOB (pulsing spiky sphere)
   ══════════════════════════════════════════════════════════════ */
function HeroBlob() {
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
      <meshStandardMaterial color="#E24B4A" transparent opacity={0.1} roughness={0.4} metalness={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}

function HeroScene() {
  return (
    <>
      <color attach="background" args={["#050A05"]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#E24B4A" />
      <pointLight position={[-4, -3, 3]} intensity={0.4} color="#9B59B6" />
      <HeroParticles />
      <HeroBlob />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   MINI 3D CARD (sphere preview)
   ══════════════════════════════════════════════════════════════ */
function MiniVirus({ color, accentColor }: { color: string; accentColor: string }) {
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
        <icosahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial color={color} emissive={accentColor} emissiveIntensity={0.3} transparent opacity={0.6} roughness={0.4} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.92, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.08} />
      </mesh>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   ACTUAL CARD VIRUS RENDERER WITH PERFORMANCE SWITCH
   ══════════════════════════════════════════════════════════════ */
function CardVirus({ v }: { v: any }) {
  const ModelComponent = MODEL_MAP[v.id];
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.22;
      const p = 0.96 + Math.sin(clock.getElapsedTime() * 1.5) * 0.025;
      groupRef.current.scale.setScalar(p);
    }
  });

  let scale = 0.85;
  if (v.id === "ebola") scale = 0.45;
  else if (v.id === "bacteriophage" || v.id === "lambda-phage") scale = 0.7;
  else if (v.id === "tmv") scale = 0.65;

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight position={[2, 2, 2]} intensity={1.0} color="#ffffff" />
      <pointLight position={[-2, -2, 2]} intensity={0.5} color={v.color} />
      <group ref={groupRef}>
        {ModelComponent ? (
          <Suspense fallback={null}>
            <group scale={scale}>
              <ModelComponent detail={false} />
            </group>
          </Suspense>
        ) : (
          <MiniVirus color={v.color} accentColor={v.accentColor} />
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

function LazyVirusCanvas({ v }: { v: any }) {
  const [ref, inView] = useInView("150px");
  return (
    <div ref={ref} className="w-full h-[180px] relative bg-[rgba(5,10,5,0.5)]">
      {inView ? (
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-[2rem]" style={{ color: v.color }}>{v.emoji}</div>}>
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3], fov: 45 }} gl={{ antialias: false, alpha: true }} style={{ background: "transparent" }}>
            <CardVirus v={v} />
          </Canvas>
        </Suspense>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[2rem]" style={{ color: v.color }}>{v.emoji}</div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════ */
export default function VirusesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="bg-[#050A05] min-h-screen text-[var(--ds-fg)]">
      <BackLink href="/" label="Home" />
      
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative w-full h-[80vh] min-h-[500px] overflow-hidden" aria-label="Hero">
        <div className="absolute inset-0 z-0">
          {mounted && (
            <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
              <HeroScene />
            </Canvas>
          )}
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-[rgba(5,10,5,0.3)] to-[#050A05] pointer-events-none" />
        <div className="relative z-[2] flex flex-col items-center justify-center h-full text-center px-6 gap-4">
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-black text-white tracking-[0.2em] m-0 drop-shadow-[0_0_60px_rgba(226,75,74,0.3)]">
            VIRUSES
          </h1>
          <p className="text-[clamp(0.75rem,2vw,1rem)] text-[var(--ds-fg-muted)] tracking-[0.15em] uppercase m-0 max-w-[500px]">
            A Comprehensive 3D Encyclopedia of the World&apos;s Most Impactful Viruses
          </p>
          <div className="mt-2">
            <GlowButton accentColor="#E24B4A" href="#gallery">
              Explore Viruses ↓
            </GlowButton>
          </div>
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────────────────────── */}
      <section id="gallery" className="p-[60px_clamp(20px,5vw,60px)_40px]">
        <div className="text-center mb-10">
          <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[rgba(226,75,74,0.6)] mb-1.5">
            Interactive 3D Collection
          </p>
          <h2 className="text-2xl font-bold text-[#E24B4A] m-0 tracking-[0.04em] drop-shadow-[0_0_20px_rgba(226,75,74,0.2)]">
            Choose a Virus
          </h2>
        </div>

        <GalleryGrid minItemWidth="280px" gap="20px" className="max-w-[1200px] w-full">
          {VIRUSES.map((v) => (
            <GlassCard
              key={v.id}
              href={`/viruses/${v.id}`}
              className="group/card overflow-hidden bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] hover:border-[rgba(226,75,74,0.2)] hover:bg-[rgba(226,75,74,0.04)] hover:shadow-[0_12px_40px_rgba(226,75,74,0.1)] transition-all duration-350"
            >
              <LazyVirusCanvas v={v} />
              <div className="p-[16px_18px_20px] flex flex-col gap-1 relative">
                <p className="text-[0.6rem] font-semibold tracking-[0.12em] uppercase text-[var(--ds-fg-subtle)] m-0">
                  {v.type}
                </p>
                <h3 className="text-[1.1rem] font-bold m-0 tracking-wide" style={{ color: v.color }}>
                  {v.emoji} {v.name}
                </h3>
                <p className="text-[0.7rem] text-[var(--ds-fg-subtle)] italic m-0">
                  {v.scientificName}
                </p>
                <p className="text-[0.78rem] text-[var(--ds-fg-muted)] leading-relaxed m-0 mt-1.5 line-clamp-2">
                  {v.description}
                </p>
                <div className="flex gap-3 mt-3 flex-wrap">
                  <span className="text-[0.6rem] px-2 py-0.5 rounded-[20px] bg-[rgba(226,75,74,0.08)] border border-[rgba(226,75,74,0.15)] text-[var(--ds-fg-muted)] font-medium">
                    📅 {v.discoveredYear}
                  </span>
                  <span className="text-[0.6rem] px-2 py-0.5 rounded-[20px] bg-[rgba(226,75,74,0.08)] border border-[rgba(226,75,74,0.15)] text-[var(--ds-fg-muted)] font-medium">
                    ☠️ {v.mortality}
                  </span>
                </div>
                <div className="absolute right-4 bottom-[18px] text-[var(--ds-fg-subtle)] group-hover/card:text-[rgba(226,75,74,0.7)] group-hover/card:translate-x-1 transition-all duration-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </div>
            </GlassCard>
          ))}
        </GalleryGrid>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="py-[60px] px-6 text-center border-t border-[rgba(226,75,74,0.06)]">
        <div className="flex justify-center gap-[48px] flex-wrap">
          {[
            { val: "25+", label: "3D Viruses" },
            { val: "100+", label: "Structural Parts" },
            { val: "360°", label: "Full Rotation" },
            { val: "∞", label: "Zoom Levels" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-[2rem] font-extrabold text-[#E24B4A] tracking-wider">{s.val}</div>
              <div className="text-[0.7rem] text-[var(--ds-fg-subtle)] tracking-[0.12em] uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SIZE VISUALIZATION ─────────────────────────────── */}
      <section className="p-[40px_clamp(16px,4vw,60px)_60px] border-t border-[rgba(226,75,74,0.06)]">
        <h2 className="text-center text-[#E24B4A] text-[1.4rem] font-bold mb-2 tracking-[0.04em]">How Small Are Viruses?</h2>
        <p className="text-center text-[var(--ds-fg-subtle)] text-[0.8rem] mb-8 max-w-[500px] mx-auto">
          Viruses are far smaller than cells or bacteria. Here&apos;s a proportional size comparison.
        </p>
        <div className="flex items-end justify-center gap-[clamp(20px,4vw,48px)] flex-wrap">
          {[
            { label: "Human Cell", size: "10 μm", w: 120, color: "#378ADD" },
            { label: "Bacterium", size: "1 μm", w: 50, color: "#39FF14" },
            { label: "Virus", size: "100 nm", w: 14, color: "#E24B4A" },
            { label: "Protein", size: "5 nm", w: 4, color: "#F59E0B" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="rounded-full border-2 flex items-center justify-center transition-all duration-300" style={{ width: item.w, height: item.w, borderColor: item.color, background: `${item.color}15`, boxShadow: `0 0 20px ${item.color}20` }}>
                {item.w >= 14 && <span className="font-bold" style={{ fontSize: item.w > 40 ? "0.6rem" : "0.4rem", color: item.color }}>{item.size}</span>}
              </div>
              <span className="text-[0.75rem] font-semibold" style={{ color: item.color }}>{item.label}</span>
              <span className="text-[0.65rem] text-[var(--ds-fg-subtle)]">{item.size}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-[var(--ds-fg-subtle)] text-[0.72rem] mt-6 italic">
          ~100 viruses fit across one bacterium • ~10,000 viruses fit across one human cell
        </p>
      </section>

      {/* ── VIRUS vs BACTERIA ──────────────────────────────── */}
      <section className="p-[40px_clamp(16px,4vw,60px)_60px] border-t border-[rgba(226,75,74,0.06)]">
        <h2 className="text-center text-[#E24B4A] text-[1.4rem] font-bold mb-8">Virus vs Bacteria</h2>
        <div className="max-w-[700px] mx-auto rounded-2xl overflow-hidden border border-[rgba(226,75,74,0.1)]">
          {[
            { feature: "Living?", virus: "No — not alive", bacteria: "Yes — living cells" },
            { feature: "Size", virus: "20-300 nm", bacteria: "0.2-10 μm" },
            { feature: "Reproduction", virus: "Needs a host cell", bacteria: "Independent (binary fission)" },
            { feature: "Cell Wall", virus: "None (protein coat)", bacteria: "Peptidoglycan" },
            { feature: "Nucleus", virus: "None", bacteria: "None (prokaryotic)" },
            { feature: "Genome", virus: "DNA or RNA", bacteria: "DNA only" },
            { feature: "Treatment", virus: "Antivirals", bacteria: "Antibiotics" },
            { feature: "Examples", virus: "COVID, HIV, Flu", bacteria: "E. coli, Strep" },
          ].map((row, i) => (
            <div key={i} className={`grid grid-columns-3 grid-flow-col auto-cols-fr ${i < 7 ? "border-b border-[rgba(255,255,255,0.04)]" : ""} ${i % 2 === 0 ? "bg-[rgba(255,255,255,0.02)]" : "bg-transparent"}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div className="p-3 text-[0.8rem] text-[var(--ds-fg-muted)] font-semibold">{row.feature}</div>
              <div className="p-3 text-[0.78rem] text-[#E24B4A] border-l border-[rgba(255,255,255,0.04)]">{row.virus}</div>
              <div className="p-3 text-[0.78rem] text-[#39FF14] border-l border-[rgba(255,255,255,0.04)]">{row.bacteria}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VACCINE & ANTIVIRAL ────────────────────────────── */}
      <section className="p-[40px_clamp(16px,4vw,60px)_60px] border-t border-[rgba(226,75,74,0.06)]">
        <h2 className="text-center text-[#E24B4A] text-[1.4rem] font-bold mb-8">How We Fight Viruses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[900px] mx-auto">
          {[
            { title: "mRNA Vaccines", emoji: "💉", color: "#39FF14", desc: "Deliver genetic instructions for spike protein. Your cells make the protein, immune system learns to fight it. Used for COVID-19 (Pfizer, Moderna)." },
            { title: "Weakened Virus", emoji: "🦠", color: "#378ADD", desc: "Contains weakened/killed virus. Trains immune memory without causing disease. Used for flu, measles, polio. Annual reformulation needed for flu." },
            { title: "Antiviral Drugs", emoji: "💊", color: "#9B59B6", desc: "Block viral replication inside cells. Examples: Tamiflu (flu), Paxlovid (COVID), ART (HIV). Different from antibiotics — don't work on bacteria." },
            { title: "Immune Response", emoji: "🛡️", color: "#F59E0B", desc: "White blood cells (T-cells, B-cells) detect and destroy infected cells. Memory cells provide long-term immunity. Antibodies neutralize free virus." },
          ].map((card, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[rgba(255,255,255,0.02)] border" style={{ borderColor: `${card.color}20` }}>
              <div className="text-[1.5rem] mb-2">{card.emoji}</div>
              <h3 className="text-base font-bold mb-2" style={{ color: card.color }}>{card.title}</h3>
              <p className="text-[0.82rem] text-[var(--ds-fg-muted)] leading-relaxed m-0">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PANDEMIC TIMELINE ─────────────────────────────── */}
      <section className="p-[40px_clamp(16px,4vw,60px)_80px] border-t border-[rgba(226,75,74,0.06)]">
        <h2 className="text-center text-[#E24B4A] text-[1.4rem] font-bold mb-8">Famous Pandemics Timeline</h2>
        <div className="max-w-[700px] mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-[2px] bg-[rgba(226,75,74,0.15)] rounded-[1px]" />
          {[
            { year: "1346", name: "Black Death", deaths: "75-200 million", pathogen: "Yersinia pestis (bacterium)", color: "#4B5563" },
            { year: "1918", name: "Spanish Flu", deaths: "50-100 million", pathogen: "H1N1 Influenza", color: "#378ADD" },
            { year: "1957", name: "Asian Flu", deaths: "1-2 million", pathogen: "H2N2 Influenza", color: "#5DADE2" },
            { year: "1981", name: "HIV/AIDS", deaths: "40+ million", pathogen: "HIV Retrovirus", color: "#9B59B6" },
            { year: "2003", name: "SARS", deaths: "774", pathogen: "SARS-CoV", color: "#EF9F27" },
            { year: "2009", name: "Swine Flu", deaths: "~284,000", pathogen: "H1N1 Influenza", color: "#1D9E75" },
            { year: "2014", name: "Ebola", deaths: "11,325", pathogen: "Zaire Ebolavirus", color: "#E67E22" },
            { year: "2020", name: "COVID-19", deaths: "7+ million", pathogen: "SARS-CoV-2", color: "#E24B4A" },
          ].map((event, i) => (
            <div key={i} className="flex gap-5 mb-6 relative">
              {/* Dot */}
              <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5 ml-[14px] z-10" style={{ background: event.color, border: `2px solid ${event.color}`, boxShadow: `0 0 8px ${event.color}40` }} />
              <div className="flex-1">
                <div className="flex items-baseline gap-2.5 mb-1">
                  <span className="text-[1.1rem] font-bold font-mono" style={{ color: event.color }}>{event.year}</span>
                  <span className="text-[0.95rem] font-bold text-[rgba(200,245,200,0.85)]">{event.name}</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <span className="text-[0.72rem] px-2.5 py-0.5 rounded-md border text-medium" style={{ background: `${event.color}12`, borderColor: `${event.color}25`, color: event.color }}>☠️ {event.deaths}</span>
                  <span className="text-[0.72rem] text-[var(--ds-fg-subtle)] italic self-center">{event.pathogen}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
