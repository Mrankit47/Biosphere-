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
  return (
    <div style={{ background: "#050A05", minHeight: "100vh" }}>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="virus-hero">
        <div className="virus-hero-canvas">
          <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
            <HeroScene />
          </Canvas>
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
      <section style={{ padding: "60px 24px 80px", textAlign: "center", borderTop: "1px solid rgba(226,75,74,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
          {[
            { val: "40", label: "3D Viruses" },
            { val: "60+", label: "Structural Parts" },
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
    </div>
  );
}
