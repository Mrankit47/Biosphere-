"use client";
import { useRef, Suspense, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Link from "next/link";
import { RARE_SPECIES, CATEGORIES, STATUS_LABELS } from "./_data/species";
import dynamic from "next/dynamic";
import { PageHeader, BackLink, GlowButton, GlassCard, GalleryGrid, GlassInput } from "@/components/ds";

const ProceduralCreature = dynamic(() => import("./_models/ProceduralCreature"), { ssr: false });

/* ══════════════════════════════════════════════════════════════
   HERO PARTICLES
   ══════════════════════════════════════════════════════════════ */
const P_COUNT = 1800;
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

/* ── Floating wireframe spheres ──────────────────────────────── */
function HeroOrbs() {
  const group = useRef<THREE.Group>(null!);
  const orbs = useMemo(() => Array.from({ length: 8 }, () => ({
    pos: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10] as [number, number, number],
    radius: 0.4 + Math.random() * 1.2,
    speed: 0.06 + Math.random() * 0.12,
    phase: Math.random() * Math.PI * 2,
  })), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const o = orbs[i];
      child.position.x = o.pos[0] + Math.sin(t * o.speed + o.phase) * 1.2;
      child.position.y = o.pos[1] + Math.cos(t * o.speed * 0.7 + o.phase) * 0.9;
      child.rotation.x = t * o.speed * 0.3;
      child.rotation.y = t * o.speed * 0.2;
    });
  });

  return (
    <group ref={group}>
      {orbs.map((o, i) => (
        <mesh key={i} position={o.pos}>
          <icosahedronGeometry args={[o.radius, 1]} />
          <meshBasicMaterial color="#39FF14" wireframe transparent opacity={0.05 + Math.random() * 0.03} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

function HeroScene() {
  return (
    <>
      <color attach="background" args={["#050A05"]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#39FF14" />
      <pointLight position={[-4, -3, 3]} intensity={0.3} color="#FFB74D" />
      <HeroParticles />
      <HeroOrbs />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   LAZY CANVAS CARD (IntersectionObserver)
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

function LazySpeciesCanvas({ species }: { species: typeof RARE_SPECIES[0] }) {
  const [ref, inView] = useInView("150px");
  return (
    <div ref={ref} className="w-full h-[220px] relative bg-[rgba(5,10,5,0.5)] md:h-[180px]">
      {inView ? (
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-[2rem]" style={{ color: species.color }}>{species.emoji}</div>}>
          {typeof window !== "undefined" && (
            <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3.2], fov: 42 }} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }} style={{ background: "transparent" }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[3, 4, 5]} intensity={1.0} />
              <Suspense fallback={null}>
                <ProceduralCreature bodyType={species.bodyType} bodyParams={species.bodyParams} speciesId={species.id} emoji={species.emoji} />
              </Suspense>
            </Canvas>
          )}
        </Suspense>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[2rem]" style={{ color: species.color }}>{species.emoji}</div>
      )}
    </div>
  );
}

const statusClassMap: Record<string, string> = {
  CR: "bg-[rgba(229,57,53,0.15)] border border-[rgba(229,57,53,0.3)] text-[#E53935]",
  EN: "bg-[rgba(255,152,0,0.15)] border border-[rgba(255,152,0,0.3)] text-[#FF9800]",
  VU: "bg-[rgba(253,216,53,0.15)] border border-[rgba(253,216,53,0.3)] text-[#FDD835]",
  NT: "bg-[rgba(66,165,245,0.15)] border border-[rgba(66,165,245,0.3)] text-[#42A5F5]",
};

const statusColorMap: Record<string, string> = {
  CR: "#E53935",
  EN: "#FF9800",
  VU: "#FDD835",
  NT: "#42A5F5",
};

/* ══════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════ */
export default function RareSpeciesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = RARE_SPECIES;
    if (category !== "All") result = result.filter(s => s.category === category);
    if (statusFilter) result = result.filter(s => s.conservationStatus === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.scientificName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [category, statusFilter, search]);

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
          <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black tracking-[0.12em] text-white m-0 drop-shadow-[0_0_60px_rgba(57,255,20,0.2)]">
            RARE SPECIES
          </h1>
          <p className="text-[clamp(0.85rem,2vw,1.2rem)] text-[var(--ds-accent-muted)] tracking-[0.18em] uppercase m-0">
            100 Endangered Creatures in Interactive 3D
          </p>
          <div className="mt-4 pointer-events-auto">
            <GlowButton href="#gallery">
              Explore Collection ↓
            </GlowButton>
          </div>
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────────────────────── */}
      <section id="gallery" className="relative p-[80px_24px_100px] max-w-[1400px] mx-auto md:p-[48px_16px_60px]">
        <div className="text-center mb-[48px]">
          <p className="text-[0.7rem] tracking-[0.25em] uppercase text-[var(--ds-accent-muted)] mb-2">
            Interactive 3D Collection
          </p>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-white m-0 tracking-[0.04em]">
            Explore Endangered Species
          </h2>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-5">
          <GlassInput
            type="text"
            className="w-[min(420px,90vw)]"
            placeholder="Search species by name, scientific name, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<span>🔍</span>}
          />
        </div>

        {/* Category filters */}
        <div className="flex justify-center gap-2 flex-wrap mb-5 px-4">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`
                px-4 py-1.5 rounded-full border text-[0.78rem] font-semibold cursor-none backdrop-blur-md transition-all duration-200 font-[inherit]
                ${category === c
                  ? "border-[rgba(57,255,20,0.5)] bg-[rgba(57,255,20,0.12)] text-[#39FF14]"
                  : "border-[rgba(255,255,255,0.08)] bg-[rgba(5,10,5,0.6)] text-[var(--ds-fg-muted)] hover:text-white hover:border-[rgba(57,255,20,0.25)]"
                }
              `}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Status filters */}
        <div className="flex justify-center gap-2 flex-wrap mb-8 px-4">
          {Object.entries(STATUS_LABELS).map(([key, val]) => (
            <button
              key={key}
              className="px-3.5 py-1 rounded-full border bg-[rgba(5,10,5,0.5)] text-[0.7rem] font-semibold cursor-none transition-all duration-200 font-[inherit] letter-spacing-[0.05em]"
              style={{
                borderColor: statusFilter === key ? val.color : "rgba(255,255,255,0.06)",
                background: statusFilter === key ? `${val.color}20` : undefined,
                color: statusFilter === key ? val.color : "rgba(200,245,200,0.4)",
              }}
              onClick={() => setStatusFilter(statusFilter === key ? null : key)}
            >
              {key} — {val.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="text-center mb-6 text-[var(--ds-fg-subtle)] text-[0.75rem] tracking-wider">
          {filtered.length} species found
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-[60px] text-[var(--ds-fg-subtle)]">
            <span className="text-[3rem] block mb-2">🔍</span>
            <p className="text-[0.9rem] m-0">No species match your search. Try different filters.</p>
          </div>
        ) : (
          <GalleryGrid minItemWidth="300px" gap="24px" className="max-w-[1400px] w-full md:grid-cols-1">
            {filtered.map((species) => (
              <GlassCard
                key={species.id}
                href={`/rare-species/${species.id}`}
                className="group/card overflow-hidden bg-[rgba(10,20,10,0.6)] border-[rgba(57,255,20,0.08)] hover:border-[rgba(57,255,20,0.2)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(57,255,20,0.06)]"
              >
                <LazySpeciesCanvas species={species} />
                <div className="p-5 flex flex-col gap-1 relative">
                  <p className="text-[0.6rem] tracking-[0.15em] uppercase text-[var(--ds-fg-subtle)] m-0">{species.category}</p>
                  <h3 className="text-[1.15rem] font-bold m-0 tracking-wide" style={{ color: species.color }}>{species.emoji} {species.name}</h3>
                  <p className="text-[0.75rem] font-style-italic text-[var(--ds-fg-subtle)] italic m-0">{species.scientificName}</p>
                  <p className="text-[0.78rem] text-[var(--ds-fg-muted)] leading-relaxed m-0 line-clamp-2 mt-1">{species.description}</p>
                  <div className="flex gap-1.5 flex-wrap mt-2.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.6rem] font-bold tracking-wider ${statusClassMap[species.conservationStatus]}`}>
                      {species.conservationStatus}
                    </span>
                    <span className="px-2 py-0.5 rounded-md border text-[0.65rem] font-semibold" style={{ background: `${species.color}12`, borderColor: `${species.color}25`, color: `${species.color}CC` }}>
                      Pop: {species.population}
                    </span>
                    <span className="px-2 py-0.5 rounded-md border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[0.65rem] text-[var(--ds-fg-subtle)]">
                      {species.size}
                    </span>
                  </div>
                  <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full border border-[rgba(57,255,20,0.15)] text-[rgba(57,255,20,0.5)] flex items-center justify-center transition-all duration-300 group-hover/card:border-[rgba(57,255,20,0.4)] group-hover/card:text-[#39FF14] group-hover/card:bg-[rgba(57,255,20,0.08)]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                </div>
              </GlassCard>
            ))}
          </GalleryGrid>
        )}
      </section>

      {/* ── BOTTOM STATS ────────────────────────────────────── */}
      <section className="py-[60px] px-6 text-center border-t border-[rgba(57,255,20,0.06)]">
        <div className="flex justify-center gap-[48px] flex-wrap">
          {[
            { val: "100", label: "Rare Species" },
            { val: "9", label: "Categories" },
            { val: "360°", label: "3D Models" },
            { val: "4", label: "Conservation Levels" },
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
