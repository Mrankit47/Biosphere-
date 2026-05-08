"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/* ── Base pair data ────────────────────────────────────────── */
const BASE_PAIRS = ["AT", "GC", "GC", "AT", "GC", "AT", "AT", "GC", "AT", "GC", "AT", "GC", "GC", "AT", "AT"] as const;
const PAIR_COLORS: Record<string, string> = { AT: "#E24B4A", GC: "#534AB7" };
const PAIR_INFO: Record<string, { full: string; desc: string }> = {
  AT: { full: "Adenine — Thymine", desc: "Connected by 2 hydrogen bonds. Adenine always pairs with Thymine in DNA." },
  GC: { full: "Guanine — Cytosine", desc: "Connected by 3 hydrogen bonds. Stronger bond than A-T pairing." },
};

const POINTS_PER_STRAND = 60;
const RUNGS_EVERY = 4;

/* ── DNA Helix 3D ──────────────────────────────────────────── */
function DnaHelix({ separation, onRungClick }: { separation: number; onRungClick: (i: number) => void }) {
  const groupRef = useRef<THREE.Group>(null!);

  const { strand1, strand2, rungs } = useMemo(() => {
    const s1: THREE.Vector3[] = [], s2: THREE.Vector3[] = [];
    const r: { pos: THREE.Vector3; rot: THREE.Euler; scaleX: number; pairIdx: number; midY: number }[] = [];

    for (let i = 0; i < POINTS_PER_STRAND; i++) {
      const t = (i / POINTS_PER_STRAND) * Math.PI * 6;
      const y = (i - POINTS_PER_STRAND / 2) * 0.3;
      s1.push(new THREE.Vector3(Math.cos(t) * 1.5, y, Math.sin(t) * 1.5));
      s2.push(new THREE.Vector3(Math.cos(t + Math.PI) * 1.5, y, Math.sin(t + Math.PI) * 1.5));

      if (i % RUNGS_EVERY === 0 && i > 0) {
        const a = s1[i], b = s2[i];
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const dir = b.clone().sub(a);
        const len = dir.length();
        const angle = Math.atan2(dir.z, dir.x);
        r.push({ pos: mid, rot: new THREE.Euler(0, -angle, Math.PI / 2), scaleX: len, pairIdx: Math.floor(i / RUNGS_EVERY) % BASE_PAIRS.length, midY: mid.y });
      }
    }
    return { strand1: s1, strand2: s2, rungs: r };
  }, []);

  useFrame(() => { groupRef.current.rotation.y += 0.005; });

  return (
    <group ref={groupRef}>
      {/* Strand 1 — green */}
      {strand1.map((p, i) => (
        <mesh key={`s1-${i}`} position={[p.x + separation, p.y, p.z]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={0.3} />
        </mesh>
      ))}
      {/* Strand backbone 1 */}
      {strand1.slice(0, -1).map((p, i) => {
        const next = strand1[i + 1];
        const mid = p.clone().add(next).multiplyScalar(0.5);
        mid.x += separation;
        const dir = next.clone().sub(p);
        return (
          <mesh key={`b1-${i}`} position={[mid.x, mid.y, mid.z]} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())}>
            <cylinderGeometry args={[0.03, 0.03, dir.length(), 6]} />
            <meshStandardMaterial color="#39FF14" emissive="#1a7a0a" emissiveIntensity={0.2} transparent opacity={0.6} />
          </mesh>
        );
      })}

      {/* Strand 2 — blue */}
      {strand2.map((p, i) => (
        <mesh key={`s2-${i}`} position={[p.x - separation, p.y, p.z]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#378ADD" emissive="#378ADD" emissiveIntensity={0.3} />
        </mesh>
      ))}
      {/* Strand backbone 2 */}
      {strand2.slice(0, -1).map((p, i) => {
        const next = strand2[i + 1];
        const mid = p.clone().add(next).multiplyScalar(0.5);
        mid.x -= separation;
        const dir = next.clone().sub(p);
        return (
          <mesh key={`b2-${i}`} position={[mid.x, mid.y, mid.z]} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())}>
            <cylinderGeometry args={[0.03, 0.03, dir.length(), 6]} />
            <meshStandardMaterial color="#378ADD" emissive="#1a4a7a" emissiveIntensity={0.2} transparent opacity={0.6} />
          </mesh>
        );
      })}

      {/* Rungs */}
      {rungs.map((r, i) => {
        const pair = BASE_PAIRS[r.pairIdx];
        const color = PAIR_COLORS[pair];
        return (
          <mesh key={`r-${i}`} position={r.pos} rotation={r.rot} onClick={() => onRungClick(r.pairIdx)} scale={[separation < 0.3 ? 1 : Math.max(0, 1 - separation * 0.8), 1, 1]}>
            <cylinderGeometry args={[0.04, 0.04, r.scaleX, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ── 3D Scene ──────────────────────────────────────────────── */
function Scene({ separation, onRungClick }: { separation: number; onRungClick: (i: number) => void }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 8, 5]} intensity={1.2} />
      <pointLight position={[-4, -5, 3]} intensity={0.5} color="#39FF14" />
      <DnaHelix separation={separation} onRungClick={onRungClick} />
      <OrbitControls enablePan={false} minDistance={5} maxDistance={20} enableDamping dampingFactor={0.05} />
    </>
  );
}

/* ── Info Cards ────────────────────────────────────────────── */
const CARDS = [
  { title: "Base Pairs", emoji: "🔗", color: "#E24B4A", items: [
    { label: "A — T", color: "#E24B4A", desc: "Adenine pairs with Thymine (2 hydrogen bonds)" },
    { label: "G — C", color: "#534AB7", desc: "Guanine pairs with Cytosine (3 hydrogen bonds)" },
  ], text: "The two strands of DNA are held together by hydrogen bonds between complementary base pairs." },
  { title: "Codons", emoji: "📖", color: "#39FF14", items: [], text: "Every 3 bases form a codon — a molecular instruction that codes for one amino acid. For example, ATG codes for Methionine (the start signal for protein synthesis)." },
  { title: "Genes", emoji: "🧬", color: "#378ADD", items: [], text: "Genes are specific sections of DNA that contain the complete instructions to build a protein. Humans have approximately 20,000-25,000 protein-coding genes." },
];

/* ── Page ───────────────────────────────────────────────────── */
export default function DnaGeneticsPage() {
  const [separation, setSeparation] = useState(0);
  const [selectedPair, setSelectedPair] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-driven unzip
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrollY = el.scrollTop;
      const maxScroll = 400;
      const t = Math.min(scrollY / maxScroll, 1);
      setSeparation(t * 3);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleRungClick = useCallback((i: number) => {
    setSelectedPair(prev => (prev === i ? null : i));
  }, []);

  const pairData = selectedPair !== null ? BASE_PAIRS[selectedPair] : null;

  return (
    <div ref={containerRef} style={S.root}>
      {/* 3D Canvas — sticky hero */}
      <div style={S.canvasSection}>
        <div style={S.canvasWrap}>
          <Canvas camera={{ position: [0, 0, 12], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }} style={{ background: "#050A05" }}>
            <Scene separation={separation} onRungClick={handleRungClick} />
          </Canvas>
        </div>

        {/* Header overlay */}
        <div style={S.header}>
          <h1 style={S.title}>🧬 DNA & Genetics</h1>
          <p style={S.subtitle}>Scroll to unzip the double helix</p>
        </div>

        {/* Scroll indicator */}
        <div style={S.scrollHint}>
          <div style={S.scrollArrow}>↓</div>
          <span>Scroll down</span>
        </div>

        {/* Pair Sidebar */}
        <div style={{ ...S.sidebar, transform: pairData ? "translateX(0)" : "translateX(110%)", opacity: pairData ? 1 : 0 }}>
          {pairData && (
            <>
              <button style={S.sideClose} onClick={() => setSelectedPair(null)}>✕</button>
              <div style={{ ...S.pairDot, background: PAIR_COLORS[pairData], boxShadow: `0 0 16px ${PAIR_COLORS[pairData]}60` }} />
              <h3 style={{ ...S.pairTitle, color: PAIR_COLORS[pairData] }}>{PAIR_INFO[pairData].full}</h3>
              <div style={S.pairDivider} />
              <p style={S.pairDesc}>{PAIR_INFO[pairData].desc}</p>
              <div style={S.pairBadge}>
                <span style={{ fontSize: "0.65rem", textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "rgba(200,245,200,0.4)", fontWeight: 600 }}>Bond Type</span>
                <span style={{ color: "rgba(200,245,200,0.85)", fontSize: "0.85rem" }}>{pairData === "AT" ? "2 Hydrogen Bonds" : "3 Hydrogen Bonds"}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info Cards Section */}
      <div style={S.cardsSection}>
        <h2 style={S.cardsTitle}>Understanding DNA</h2>
        <div style={S.cardsGrid}>
          {CARDS.map((card, i) => (
            <div key={i} style={{ ...S.card, borderColor: `${card.color}25` }}>
              <div style={{ fontSize: "1.6rem", marginBottom: "8px" }}>{card.emoji}</div>
              <h3 style={{ ...S.cardTitle, color: card.color }}>{card.title}</h3>
              {card.items.length > 0 && (
                <div style={{ display: "flex", gap: "12px", margin: "10px 0" }}>
                  {card.items.map((it, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: it.color, display: "inline-block", boxShadow: `0 0 6px ${it.color}80` }} />
                      <span style={{ fontSize: "0.8rem", color: "rgba(200,245,200,0.8)", fontWeight: 600 }}>{it.label}</span>
                    </div>
                  ))}
                </div>
              )}
              <p style={S.cardText}>{card.text}</p>
            </div>
          ))}
        </div>

        {/* Codon table */}
        <div style={S.codonSection}>
          <h3 style={{ color: "#39FF14", fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px" }}>Common Codons</h3>
          <div style={S.codonGrid}>
            {[
              { codon: "ATG", amino: "Methionine (Start)", c: "#39FF14" },
              { codon: "TAA", amino: "Stop Signal", c: "#E24B4A" },
              { codon: "GCT", amino: "Alanine", c: "#534AB7" },
              { codon: "TTC", amino: "Phenylalanine", c: "#378ADD" },
              { codon: "GAA", amino: "Glutamic Acid", c: "#EF9F27" },
              { codon: "AAA", amino: "Lysine", c: "#1D9E75" },
            ].map((c, i) => (
              <div key={i} style={S.codonCard}>
                <span style={{ fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 700, color: c.c, letterSpacing: "0.15em" }}>{c.codon}</span>
                <span style={{ fontSize: "0.72rem", color: "rgba(200,245,200,0.65)" }}>{c.amino}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounceDown { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
      `}</style>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────── */
const S: Record<string, React.CSSProperties> = {
  root: { width: "100%", height: "calc(100vh - 64px)", background: "#050A05", overflowY: "auto", overflowX: "hidden" },

  canvasSection: { position: "sticky", top: 0, width: "100%", height: "calc(100vh - 64px)", minHeight: "500px" },
  canvasWrap: { position: "absolute", inset: 0, zIndex: 0 },

  header: { position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 10, textAlign: "center", pointerEvents: "none" },
  title: { fontSize: "1.4rem", fontWeight: 700, color: "#39FF14", letterSpacing: "0.06em", margin: 0, textShadow: "0 0 20px rgba(57,255,20,0.3)" },
  subtitle: { fontSize: "0.75rem", color: "rgba(200,245,200,0.45)", margin: "4px 0 0", letterSpacing: "0.12em", textTransform: "uppercase" as const },

  scrollHint: { position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: "rgba(57,255,20,0.4)", fontSize: "0.72rem", letterSpacing: "0.1em", pointerEvents: "none" },
  scrollArrow: { fontSize: "1rem", animation: "bounceDown 1.5s ease-in-out infinite" },

  // Sidebar
  sidebar: { position: "absolute", top: 0, right: 0, width: "min(300px, 80vw)", height: "100%", zIndex: 20, background: "rgba(5,10,5,0.9)", backdropFilter: "blur(20px)", borderLeft: "1px solid rgba(57,255,20,0.1)", padding: "48px 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", transition: "transform 0.5s cubic-bezier(0.25,0.8,0.25,1), opacity 0.4s ease" },
  sideClose: { position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "rgba(200,245,200,0.4)", fontSize: "1rem", cursor: "none", fontFamily: "inherit" },
  pairDot: { width: 48, height: 48, borderRadius: "50%" },
  pairTitle: { fontSize: "1.15rem", fontWeight: 700, margin: 0, textAlign: "center" },
  pairDivider: { width: 30, height: 2, background: "rgba(57,255,20,0.15)", borderRadius: 1 },
  pairDesc: { fontSize: "0.85rem", color: "rgba(200,245,200,0.75)", lineHeight: 1.6, textAlign: "center", margin: 0 },
  pairBadge: { width: "100%", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: 2, marginTop: 4 },

  // Info cards
  cardsSection: { position: "relative", zIndex: 5, background: "#050A05", padding: "60px clamp(20px,5vw,60px) 80px", borderTop: "1px solid rgba(57,255,20,0.08)" },
  cardsTitle: { fontSize: "1.5rem", fontWeight: 700, color: "#39FF14", textAlign: "center", marginBottom: 32, letterSpacing: "0.04em", textShadow: "0 0 20px rgba(57,255,20,0.2)" },
  cardsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 1000, margin: "0 auto" },
  card: { padding: "24px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid", display: "flex", flexDirection: "column" },
  cardTitle: { fontSize: "1.1rem", fontWeight: 700, margin: "0 0 6px", letterSpacing: "0.03em" },
  cardText: { fontSize: "0.85rem", color: "rgba(200,245,200,0.7)", lineHeight: 1.65, margin: 0 },

  // Codon table
  codonSection: { maxWidth: 1000, margin: "40px auto 0", padding: "24px", borderRadius: 16, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(57,255,20,0.08)" },
  codonGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 },
  codonCard: { padding: "12px 14px", borderRadius: 10, background: "rgba(5,10,5,0.5)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: 2 },
};
