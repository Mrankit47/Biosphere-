"use client";
import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Link from "next/link";
import { ORGANISMS } from "./_data/organisms";
import "./_styles/microorganisms.css";

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
   HERO ORGANISM (rotating Amoeba-like blob)
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
      <meshStandardMaterial color="#39FF14" transparent opacity={0.12} roughness={0.4} metalness={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}

function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#39FF14" />
      <pointLight position={[-4, -3, 3]} intensity={0.4} color="#1D9E75" />
      <HeroParticles />
      <HeroBlob />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   MINI 3D CARD ORGANISM (simple sphere preview)
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
   PAGE
   ══════════════════════════════════════════════════════════════ */
export default function MicroorganismsPage() {
  return (
    <div style={{ background: "#050A05", minHeight: "100vh" }}>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="micro-hero">
        <div className="micro-hero-canvas">
          <Canvas camera={{ position: [0, 0, 8], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true }} style={{ background: "transparent" }}>
            <HeroScene />
          </Canvas>
        </div>
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(180deg, rgba(5,10,5,0) 0%, rgba(5,10,5,0.3) 60%, rgba(5,10,5,1) 100%)", pointerEvents: "none" }} />
        <div className="micro-hero-overlay">
          <h1 className="micro-hero-title">MICRO ZOO</h1>
          <p className="micro-hero-sub">A Cinematic Journey Through the Microscopic Universe</p>
          <a href="#gallery" className="micro-hero-cta">Explore Organisms ↓</a>
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────────────────────── */}
      <section id="gallery" className="micro-gallery">
        <div className="micro-gallery-header">
          <p className="micro-gallery-label">Interactive 3D Collection</p>
          <h2 className="micro-gallery-title">Choose an Organism</h2>
        </div>
        <div className="micro-gallery-grid">
          {ORGANISMS.map((org) => (
            <Link key={org.id} href={`/microorganisms/${org.id}`} className="micro-card">
              <div className="micro-card-canvas">
                <Suspense fallback={<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: org.color, fontSize: "2rem" }}>{org.emoji}</div>}>
                  <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3], fov: 45 }} gl={{ antialias: false }} style={{ background: "transparent" }}>
                    <MiniOrg color={org.color} accentColor={org.accentColor} />
                  </Canvas>
                </Suspense>
              </div>
              <div className="micro-card-info">
                <p className="micro-card-type">{org.type}</p>
                <h3 className="micro-card-name" style={{ color: org.color }}>{org.emoji} {org.name}</h3>
                <p className="micro-card-sci">{org.scientificName}</p>
                <p className="micro-card-desc">{org.description}</p>
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
            { val: "10", label: "3D Organisms" },
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
