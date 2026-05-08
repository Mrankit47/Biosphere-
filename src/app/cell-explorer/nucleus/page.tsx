"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";

/* ── Floating Label ──────────────────────────────────────────── */
function FloatingLabel({ position, title, description, color, dotOffset }: {
  position: [number, number, number]; title: string; description: string; color: string; dotOffset?: [number, number, number];
}) {
  return (
    <group position={position}>
      {dotOffset && (<mesh position={dotOffset}><sphereGeometry args={[0.04, 8, 8]} /><meshBasicMaterial color={color} /></mesh>)}
      <Html center distanceFactor={6} style={{ pointerEvents: "none", userSelect: "none" }}>
        <div style={{ background: "rgba(5,10,5,0.85)", backdropFilter: "blur(12px)", border: `1px solid ${color}40`, borderRadius: "12px", padding: "12px 16px", minWidth: "160px", maxWidth: "210px", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color, letterSpacing: "0.06em", marginBottom: "4px", textShadow: `0 0 10px ${color}60` }}>{title}</div>
          <div style={{ fontSize: "0.65rem", color: "rgba(200,245,200,0.7)", lineHeight: 1.5 }}>{description}</div>
        </div>
      </Html>
    </group>
  );
}

/* ── Nuclear Envelope ────────────────────────────────────────── */
function NuclearEnvelope() {
  const outerRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => { outerRef.current.rotation.y = clock.getElapsedTime() * 0.04; });
  return (
    <>
      <mesh ref={outerRef}><sphereGeometry args={[1.8, 48, 48]} /><meshStandardMaterial color="#378ADD" transparent opacity={0.12} roughness={0.3} side={THREE.DoubleSide} /></mesh>
      <mesh><sphereGeometry args={[1.82, 24, 24]} /><meshBasicMaterial color="#5AAFFF" wireframe transparent opacity={0.06} /></mesh>
      <mesh><sphereGeometry args={[1.7, 48, 48]} /><meshStandardMaterial color="#2B6CB0" transparent opacity={0.08} roughness={0.4} side={THREE.DoubleSide} /></mesh>
    </>
  );
}

/* ── Nuclear Pores ───────────────────────────────────────────── */
function NuclearPores() {
  const groupRef = useRef<THREE.Group>(null!);
  const positions = useMemo(() => {
    const pts: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    for (let i = 0; i < 18; i++) {
      const phi = Math.acos(2 * (i / 17) - 1);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.76;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pts.push({ pos: [x, y, z], rot: [Math.atan2(Math.sqrt(x * x + z * z), y), Math.atan2(x, z), 0] });
    }
    return pts;
  }, []);
  useFrame(({ clock }) => { groupRef.current.rotation.y = clock.getElapsedTime() * 0.03; });
  return (
    <group ref={groupRef}>
      {positions.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={p.rot}>
          <torusGeometry args={[0.08, 0.025, 8, 16]} />
          <meshStandardMaterial color="#5AAFFF" emissive="#5AAFFF" emissiveIntensity={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Nucleolus ───────────────────────────────────────────────── */
function Nucleolus() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => { const t = clock.getElapsedTime(); ref.current.position.y = 0.2 + Math.sin(t * 0.3) * 0.05; ref.current.rotation.y = t * 0.2; });
  return (
    <mesh ref={ref} position={[0.3, 0.2, 0]}>
      <sphereGeometry args={[0.45, 32, 32]} />
      <meshStandardMaterial color="#FF6B8A" emissive="#FF6B8A" emissiveIntensity={0.5} roughness={0.4} />
    </mesh>
  );
}

/* ── Chromatin ───────────────────────────────────────────────── */
function Chromatin() {
  const groupRef = useRef<THREE.Group>(null!);
  const curves = useMemo(() => {
    const all: THREE.CatmullRomCurve3[] = [];
    for (let s = 0; s < 6; s++) {
      const points: THREE.Vector3[] = [];
      const ox = (Math.random() - 0.5) * 1.2, oy = (Math.random() - 0.5) * 1.2, oz = (Math.random() - 0.5) * 1.2;
      for (let i = 0; i <= 40; i++) {
        const t = (i / 40) * Math.PI * 3;
        const r = 0.3 + Math.sin(t * 2 + s) * 0.2;
        points.push(new THREE.Vector3(ox + r * Math.cos(t + s * 1.2), oy + Math.sin(t * 1.5 + s * 0.8) * 0.4, oz + r * Math.sin(t + s * 0.9)));
      }
      all.push(new THREE.CatmullRomCurve3(points, false));
    }
    return all;
  }, []);
  useFrame(({ clock }) => { groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.08) * 0.1; });
  return (
    <group ref={groupRef}>
      {curves.map((curve, i) => (
        <mesh key={i}><tubeGeometry args={[curve, 60, 0.02, 6, false]} /><meshStandardMaterial color={i % 2 === 0 ? "#A855F7" : "#7C3AED"} emissive={i % 2 === 0 ? "#A855F7" : "#7C3AED"} emissiveIntensity={0.4} roughness={0.5} /></mesh>
      ))}
    </group>
  );
}

/* ── Nuclear Lamina ──────────────────────────────────────────── */
function NuclearLamina() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.getElapsedTime() * 0.02; });
  return (<mesh ref={ref}><sphereGeometry args={[1.65, 16, 16]} /><meshBasicMaterial color="#60A5FA" wireframe transparent opacity={0.1} /></mesh>);
}

/* ── Nucleoplasm Particles ───────────────────────────────────── */
function Nucleoplasm() {
  const pointsRef = useRef<THREE.Points>(null!);
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pts = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      const theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1), r = Math.random() * 1.5;
      pts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pts[i * 3 + 2] = r * Math.cos(phi);
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return geo;
  }, []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < 300; i++) arr[i * 3 + 1] += Math.sin(t * 0.2 + i * 0.5) * 0.0003;
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });
  return (<points ref={pointsRef} geometry={geometry}><pointsMaterial color="#93C5FD" size={0.025} transparent opacity={0.45} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} /></points>);
}

/* ── Scene ────────────────────────────────────────────────────── */
function NucleusScene() {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { groupRef.current.rotation.y = clock.getElapsedTime() * 0.05; });
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, -2, 3]} intensity={0.5} color="#378ADD" />
      <pointLight position={[0, 0, 0]} intensity={0.3} color="#5AAFFF" />
      <group ref={groupRef}>
        <NuclearEnvelope /><NuclearPores /><NuclearLamina /><Chromatin /><Nucleolus /><Nucleoplasm />
      </group>
      <FloatingLabel position={[2.5, 1.0, 0]} title="Nuclear Envelope" description="Double membrane boundary — outer layer connects to ER" color="#378ADD" dotOffset={[-0.8, -0.3, 0]} />
      <FloatingLabel position={[-2.5, 0.5, 0.5]} title="Nuclear Pores" description="Gateway complexes for RNA & protein transport" color="#5AAFFF" dotOffset={[1.0, -0.1, -0.2]} />
      <FloatingLabel position={[1.8, -1.2, 0.5]} title="Nucleolus" description="Dense body — produces ribosomal RNA (rRNA)" color="#FF6B8A" dotOffset={[-1.0, 1.0, -0.3]} />
      <FloatingLabel position={[-2.2, -1.0, -0.5]} title="Chromatin" description="DNA wound around histone proteins" color="#A855F7" dotOffset={[1.2, 0.6, 0.3]} />
      <FloatingLabel position={[2.5, -0.5, -0.8]} title="Nuclear Lamina" description="Lamin protein mesh — structural support" color="#60A5FA" dotOffset={[-1.0, 0.2, 0.5]} />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={10} enableDamping dampingFactor={0.05} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function NucleusPage() {
  return (
    <div style={S.root}>
      <div style={S.canvasWrap}>
        <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }} style={{ background: "#050A05" }}>
          <NucleusScene />
        </Canvas>
      </div>
      <Link href="/cell-explorer" style={S.backLink}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
        <span>Cell Explorer</span>
      </Link>
      <div style={S.header}>
        <span style={{ fontSize: "1.6rem", marginBottom: "2px" }}>🧠</span>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#5AAFFF", letterSpacing: "0.08em", margin: 0, textShadow: "0 0 20px rgba(90,175,255,0.3)" }}>Nucleus</h1>
        <p style={{ fontSize: "0.7rem", color: "rgba(200,245,200,0.5)", margin: 0, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>Control Center of the Cell</p>
      </div>
      <div style={S.infoBar}>
        {[
          { color: "#378ADD", label: "Envelope" },
          { color: "#5AAFFF", label: "Pores" },
          { color: "#FF6B8A", label: "Nucleolus" },
          { color: "#A855F7", label: "Chromatin" },
          { color: "#60A5FA", label: "Lamina" },
        ].map((item, i, arr) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "rgba(200,245,200,0.75)", fontWeight: 500 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color, display: "inline-block", flexShrink: 0 }} />
              {item.label}
            </span>
            {i < arr.length - 1 && <span style={{ width: 1, height: 14, background: "rgba(57,255,20,0.15)", marginLeft: 6 }} />}
          </span>
        ))}
      </div>
      <div style={S.hint}>Drag to rotate · Scroll to zoom</div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  root: { position: "relative", width: "100%", height: "calc(100vh - 64px)", background: "#050A05", overflow: "hidden" },
  canvasWrap: { position: "absolute", inset: 0, zIndex: 0 },
  backLink: { position: "absolute", top: "20px", left: "24px", zIndex: 10, display: "flex", alignItems: "center", gap: "8px", color: "rgba(200,245,200,0.7)", fontSize: "0.85rem", textDecoration: "none", cursor: "none", padding: "8px 14px", borderRadius: "10px", background: "rgba(5,10,5,0.5)", border: "1px solid rgba(57,255,20,0.1)", backdropFilter: "blur(8px)", transition: "all 0.25s ease" },
  header: { position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 10, textAlign: "center", pointerEvents: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" },
  infoBar: { position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", alignItems: "center", gap: "12px", padding: "10px 20px", borderRadius: "14px", background: "rgba(5,10,5,0.7)", border: "1px solid rgba(57,255,20,0.1)", backdropFilter: "blur(12px)", whiteSpace: "nowrap" },
  hint: { position: "absolute", bottom: "80px", left: "50%", transform: "translateX(-50%)", zIndex: 10, color: "rgba(57,255,20,0.35)", fontSize: "0.72rem", letterSpacing: "0.1em", pointerEvents: "none" },
};
