"use client";
import { useRef, Suspense, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Link from "next/link";
import { RARE_SPECIES, CATEGORIES, STATUS_LABELS } from "./_data/species";
import dynamic from "next/dynamic";
import "./_styles/rare-species.css";

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
   MINI 3D CARD PREVIEW
   ══════════════════════════════════════════════════════════════ */
function MiniCreature({ color, accentColor }: { color: string; accentColor: string }) {
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
    <div ref={ref} className="rs-card-canvas">
      {inView ? (
        <Suspense fallback={<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: species.color, fontSize: "2rem" }}>{species.emoji}</div>}>
          {typeof window !== "undefined" && (
            <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3], fov: 45 }} gl={{ antialias: false, alpha: true }} style={{ background: "transparent" }}>
              <MiniCreature color={species.color} accentColor={species.accentColor} />
            </Canvas>
          )}
        </Suspense>
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: species.color, fontSize: "2rem" }}>{species.emoji}</div>
      )}
    </div>
  );
}

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
    <div style={{ background: "#050A05", minHeight: "100vh" }}>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="rs-hero">
        <div className="rs-hero-canvas">
          {mounted && (
            <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
              <HeroScene />
            </Canvas>
          )}
        </div>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(5,10,5,0) 0%, rgba(5,10,5,0.3) 60%, rgba(5,10,5,1) 100%)", pointerEvents: "none" }} />
        <div className="rs-hero-overlay">
          <h1 className="rs-hero-title">RARE SPECIES</h1>
          <p className="rs-hero-sub">100 Endangered Creatures in Interactive 3D</p>
          <a href="#gallery" className="rs-hero-cta">Explore Collection ↓</a>
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────────────────────── */}
      <section id="gallery" className="rs-gallery">
        <div className="rs-gallery-header">
          <p className="rs-gallery-label">Interactive 3D Collection</p>
          <h2 className="rs-gallery-title">Explore Endangered Species</h2>
        </div>

        {/* Search */}
        <div className="rs-search-wrap">
          <input
            type="text"
            className="rs-search"
            placeholder="Search species by name, scientific name, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category filters */}
        <div className="rs-filters">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`rs-filter-btn ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Status filters */}
        <div className="rs-status-filters">
          {Object.entries(STATUS_LABELS).map(([key, val]) => (
            <button
              key={key}
              className={`rs-status-btn rs-status-${key}`}
              style={{
                borderColor: statusFilter === key ? val.color : undefined,
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
        <div style={{ textAlign: "center", marginBottom: 24, color: "rgba(200,245,200,0.4)", fontSize: "0.75rem", letterSpacing: "0.1em" }}>
          {filtered.length} species found
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="rs-no-results">
            <span style={{ fontSize: "3rem" }}>🔍</span>
            <p>No species match your search. Try different filters.</p>
          </div>
        ) : (
          <div className="rs-grid">
            {filtered.map((species) => (
              <Link key={species.id} href={`/rare-species/${species.id}`} className="rs-card">
                <LazySpeciesCanvas species={species} />
                <div className="rs-card-info">
                  <p className="rs-card-type">{species.category}</p>
                  <h3 className="rs-card-name" style={{ color: species.color }}>{species.emoji} {species.name}</h3>
                  <p className="rs-card-sci">{species.scientificName}</p>
                  <p className="rs-card-desc">{species.description}</p>
                  <div className="rs-card-badges">
                    <span className={`rs-status-badge rs-status-${species.conservationStatus}`}>
                      {species.conservationStatus}
                    </span>
                    <span style={{ padding: "2px 8px", borderRadius: 6, background: `${species.color}12`, border: `1px solid ${species.color}25`, fontSize: "0.65rem", color: `${species.color}CC` }}>
                      Pop: {species.population}
                    </span>
                    <span style={{ padding: "2px 8px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.65rem", color: "rgba(200,245,200,0.5)" }}>
                      {species.size}
                    </span>
                  </div>
                  <div className="rs-card-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── BOTTOM STATS ────────────────────────────────────── */}
      <section style={{ padding: "60px 24px 80px", textAlign: "center", borderTop: "1px solid rgba(57,255,20,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
          {[
            { val: "100", label: "Rare Species" },
            { val: "9", label: "Categories" },
            { val: "360°", label: "3D Models" },
            { val: "4", label: "Conservation Levels" },
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
