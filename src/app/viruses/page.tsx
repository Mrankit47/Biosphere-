"use client";
import { useRef, useMemo, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Link from "next/link";
import { VIRUSES } from "./_data/viruses";
import "./_styles/viruses.css";

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
    <div ref={ref} className="virus-card-canvas">
      {inView ? (
        <Suspense fallback={<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: v.color, fontSize: "2rem" }}>{v.emoji}</div>}>
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3], fov: 45 }} gl={{ antialias: false, alpha: true }} style={{ background: "transparent" }}>
            <MiniVirus color={v.color} accentColor={v.accentColor} />
          </Canvas>
        </Suspense>
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: v.color, fontSize: "2rem" }}>{v.emoji}</div>
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
    <div style={{ background: "#050A05", minHeight: "100vh" }}>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="virus-hero">
        <div className="virus-hero-canvas">
          {mounted && (
            <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
              <HeroScene />
            </Canvas>
          )}
        </div>
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(5,10,5,0) 0%, rgba(5,10,5,0.3) 60%, rgba(5,10,5,1) 100%)", pointerEvents: "none" }} />
        <div className="virus-hero-overlay">
          <h1 className="virus-hero-title">VIRUSES</h1>
          <p className="virus-hero-sub">A Comprehensive 3D Encyclopedia of the Worlds Most Impactful Viruses</p>
          <a href="#gallery" className="virus-hero-cta">Explore Viruses ↓</a>
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────────────────────── */}
      <section id="gallery" className="virus-gallery">
        <div className="virus-gallery-header">
          <p className="virus-gallery-label">Interactive 3D Collection</p>
          <h2 className="virus-gallery-title">Choose a Virus</h2>
        </div>
        <div className="virus-gallery-grid">
          {VIRUSES.map((v) => (
            <Link key={v.id} href={`/viruses/${v.id}`} className="virus-card">
              <LazyVirusCanvas v={v} />
              <div className="virus-card-info">
                <p className="virus-card-type">{v.type}</p>
                <h3 className="virus-card-name" style={{ color: v.color }}>{v.emoji} {v.name}</h3>
                <p className="virus-card-sci">{v.scientificName}</p>
                <p className="virus-card-desc">{v.description}</p>
                <div className="virus-card-meta">
                  <span className="virus-card-badge">📅 {v.discoveredYear}</span>
                  <span className="virus-card-badge">☠️ {v.mortality}</span>
                </div>
                <div className="virus-card-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section style={{ padding: "60px 24px 40px", textAlign: "center", borderTop: "1px solid rgba(226,75,74,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
          {[
            { val: "25+", label: "3D Viruses" },
            { val: "100+", label: "Structural Parts" },
            { val: "360°", label: "Full Rotation" },
            { val: "∞", label: "Zoom Levels" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#E24B4A", letterSpacing: "0.05em" }}>{s.val}</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(200,245,200,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SIZE VISUALIZATION ─────────────────────────────── */}
      <section style={{ padding: "40px clamp(16px,4vw,60px) 60px", borderTop: "1px solid rgba(226,75,74,0.06)" }}>
        <h2 style={{ textAlign: "center", color: "#E24B4A", fontSize: "1.4rem", fontWeight: 700, marginBottom: 8, letterSpacing: "0.04em" }}>How Small Are Viruses?</h2>
        <p style={{ textAlign: "center", color: "rgba(200,245,200,0.45)", fontSize: "0.8rem", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>Viruses are far smaller than cells or bacteria. Here&apos;s a proportional size comparison.</p>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "clamp(20px,4vw,48px)", flexWrap: "wrap" }}>
          {[
            { label: "Human Cell", size: "10 μm", w: 120, color: "#378ADD" },
            { label: "Bacterium", size: "1 μm", w: 50, color: "#39FF14" },
            { label: "Virus", size: "100 nm", w: 14, color: "#E24B4A" },
            { label: "Protein", size: "5 nm", w: 4, color: "#F59E0B" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ width: item.w, height: item.w, borderRadius: "50%", border: `2px solid ${item.color}`, background: `${item.color}15`, boxShadow: `0 0 20px ${item.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.w >= 14 && <span style={{ fontSize: item.w > 40 ? "0.6rem" : "0.4rem", color: item.color, fontWeight: 700 }}>{item.size}</span>}
              </div>
              <span style={{ fontSize: "0.75rem", color: item.color, fontWeight: 600 }}>{item.label}</span>
              <span style={{ fontSize: "0.65rem", color: "rgba(200,245,200,0.4)" }}>{item.size}</span>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", color: "rgba(200,245,200,0.35)", fontSize: "0.72rem", marginTop: 20, fontStyle: "italic" }}>~100 viruses fit across one bacterium • ~10,000 viruses fit across one human cell</p>
      </section>

      {/* ── VIRUS vs BACTERIA ──────────────────────────────── */}
      <section style={{ padding: "40px clamp(16px,4vw,60px) 60px", borderTop: "1px solid rgba(226,75,74,0.06)" }}>
        <h2 style={{ textAlign: "center", color: "#E24B4A", fontSize: "1.4rem", fontWeight: 700, marginBottom: 32 }}>Virus vs Bacteria</h2>
        <div style={{ maxWidth: 700, margin: "0 auto", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(226,75,74,0.1)" }}>
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
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: i < 7 ? "1px solid rgba(255,255,255,0.04)" : "none", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
              <div style={{ padding: "12px 16px", fontSize: "0.8rem", color: "rgba(200,245,200,0.7)", fontWeight: 600 }}>{row.feature}</div>
              <div style={{ padding: "12px 16px", fontSize: "0.78rem", color: "#E24B4A", borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{row.virus}</div>
              <div style={{ padding: "12px 16px", fontSize: "0.78rem", color: "#39FF14", borderLeft: "1px solid rgba(255,255,255,0.04)" }}>{row.bacteria}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── VACCINE & ANTIVIRAL ────────────────────────────── */}
      <section style={{ padding: "40px clamp(16px,4vw,60px) 60px", borderTop: "1px solid rgba(226,75,74,0.06)" }}>
        <h2 style={{ textAlign: "center", color: "#E24B4A", fontSize: "1.4rem", fontWeight: 700, marginBottom: 32 }}>How We Fight Viruses</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, maxWidth: 900, margin: "0 auto" }}>
          {[
            { title: "mRNA Vaccines", emoji: "💉", color: "#39FF14", desc: "Deliver genetic instructions for spike protein. Your cells make the protein, immune system learns to fight it. Used for COVID-19 (Pfizer, Moderna)." },
            { title: "Weakened Virus", emoji: "🦠", color: "#378ADD", desc: "Contains weakened/killed virus. Trains immune memory without causing disease. Used for flu, measles, polio. Annual reformulation needed for flu." },
            { title: "Antiviral Drugs", emoji: "💊", color: "#9B59B6", desc: "Block viral replication inside cells. Examples: Tamiflu (flu), Paxlovid (COVID), ART (HIV). Different from antibiotics — don't work on bacteria." },
            { title: "Immune Response", emoji: "🛡️", color: "#F59E0B", desc: "White blood cells (T-cells, B-cells) detect and destroy infected cells. Memory cells provide long-term immunity. Antibodies neutralize free virus." },
          ].map((card, i) => (
            <div key={i} style={{ padding: 24, borderRadius: 16, background: "rgba(255,255,255,0.02)", border: `1px solid ${card.color}20` }}>
              <div style={{ fontSize: "1.5rem", marginBottom: 8 }}>{card.emoji}</div>
              <h3 style={{ color: card.color, fontSize: "1rem", fontWeight: 700, margin: "0 0 8px" }}>{card.title}</h3>
              <p style={{ fontSize: "0.82rem", color: "rgba(200,245,200,0.65)", lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PANDEMIC TIMELINE ─────────────────────────────── */}
      <section style={{ padding: "40px clamp(16px,4vw,60px) 80px", borderTop: "1px solid rgba(226,75,74,0.06)" }}>
        <h2 style={{ textAlign: "center", color: "#E24B4A", fontSize: "1.4rem", fontWeight: 700, marginBottom: 32 }}>Famous Pandemics Timeline</h2>
        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", left: 20, top: 0, bottom: 0, width: 2, background: "rgba(226,75,74,0.15)", borderRadius: 1 }} />
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
            <div key={i} style={{ display: "flex", gap: 20, marginBottom: 24, position: "relative" }}>
              {/* Dot */}
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: event.color, border: `2px solid ${event.color}`, boxShadow: `0 0 8px ${event.color}40`, flexShrink: 0, marginTop: 4, marginLeft: 15, zIndex: 1 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 800, color: event.color, fontFamily: "monospace" }}>{event.year}</span>
                  <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "rgba(200,245,200,0.85)" }}>{event.name}</span>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.72rem", padding: "3px 10px", borderRadius: 6, background: `${event.color}12`, border: `1px solid ${event.color}25`, color: event.color }}>☠️ {event.deaths}</span>
                  <span style={{ fontSize: "0.72rem", color: "rgba(200,245,200,0.45)", fontStyle: "italic" }}>{event.pathogen}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
