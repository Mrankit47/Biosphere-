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

/* ── Phospholipid Bilayer ────────────────────────────────────── */
function PhospholipidBilayer() {
  const groupRef = useRef<THREE.Group>(null!);
  // Generate two rows of phospholipid molecules
  const molecules = useMemo(() => {
    const pts: { x: number; z: number }[] = [];
    for (let ix = -8; ix <= 8; ix++) {
      for (let iz = -4; iz <= 4; iz++) {
        pts.push({ x: ix * 0.28, z: iz * 0.28 });
      }
    }
    return pts;
  }, []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.3 + i * 0.1) * 0.02;
    });
  });
  return (
    <group ref={groupRef}>
      {molecules.map((m, i) => (
        <group key={i} position={[m.x, 0, m.z]}>
          {/* Upper layer - hydrophilic head */}
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={0.3} />
          </mesh>
          {/* Upper layer - hydrophobic tails */}
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.2, 4]} />
            <meshStandardMaterial color="#2D8A0F" transparent opacity={0.6} />
          </mesh>
          {/* Lower layer - hydrophobic tails */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.2, 4]} />
            <meshStandardMaterial color="#2D8A0F" transparent opacity={0.6} />
          </mesh>
          {/* Lower layer - hydrophilic head */}
          <mesh position={[0, -0.25, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Integral Protein (spans bilayer) ────────────────────────── */
function IntegralProteins() {
  const groupRef = useRef<THREE.Group>(null!);
  const positions = useMemo(() => [
    [-1.2, 0, 0.5], [0.8, 0, -0.6], [-0.3, 0, -0.9],
  ] as [number, number, number][], []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => { child.rotation.y = Math.sin(t * 0.15 + i) * 0.1; });
  });
  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <capsuleGeometry args={[0.15, 0.5, 8, 16]} />
            <meshStandardMaterial color="#FF6B6B" emissive="#FF6B6B" emissiveIntensity={0.4} roughness={0.4} />
          </mesh>
          {/* Exposed outer region */}
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#EF5350" emissive="#EF5350" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, -0.35, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#EF5350" emissive="#EF5350" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Channel Proteins (tunnels) ──────────────────────────────── */
function ChannelProteins() {
  const groupRef = useRef<THREE.Group>(null!);
  const positions = useMemo(() => [
    [1.5, 0, 0.2], [-0.8, 0, 0.9],
  ] as [number, number, number][], []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => { child.rotation.y = t * 0.1 + i; });
  });
  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          {/* Outer cylinder */}
          <mesh>
            <cylinderGeometry args={[0.14, 0.14, 0.6, 16, 1, true]} />
            <meshStandardMaterial color="#42A5F5" emissive="#42A5F5" emissiveIntensity={0.5} roughness={0.3} side={THREE.DoubleSide} transparent opacity={0.7} />
          </mesh>
          {/* Inner glow */}
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 0.55, 12]} />
            <meshStandardMaterial color="#90CAF9" emissive="#64B5F6" emissiveIntensity={0.6} transparent opacity={0.3} />
          </mesh>
          {/* Top ring */}
          <mesh position={[0, 0.3, 0]}>
            <torusGeometry args={[0.14, 0.03, 8, 16]} />
            <meshStandardMaterial color="#42A5F5" emissive="#42A5F5" emissiveIntensity={0.4} />
          </mesh>
          {/* Bottom ring */}
          <mesh position={[0, -0.3, 0]}>
            <torusGeometry args={[0.14, 0.03, 8, 16]} />
            <meshStandardMaterial color="#42A5F5" emissive="#42A5F5" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Cholesterol (wedge shapes in bilayer) ────────────────────── */
function Cholesterol() {
  const positions = useMemo(() => [
    [0.5, 0.05, 0.3], [-1.5, -0.05, -0.3], [1.8, 0.03, -0.8], [-0.6, -0.04, 0.7], [2.0, 0.02, 0.6],
  ] as [number, number, number][], []);
  return (
    <group>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, i * 1.2, 0]}>
          <coneGeometry args={[0.07, 0.3, 6]} />
          <meshStandardMaterial color="#FFA726" emissive="#FFA726" emissiveIntensity={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Peripheral Proteins ─────────────────────────────────────── */
function PeripheralProteins() {
  const positions = useMemo(() => [
    { pos: [0.3, 0.35, -0.5] as [number, number, number], side: "top" },
    { pos: [-1.0, -0.35, 0.2] as [number, number, number], side: "bottom" },
    { pos: [1.2, 0.35, 0.7] as [number, number, number], side: "top" },
  ], []);
  return (
    <group>
      {positions.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <dodecahedronGeometry args={[0.1, 0]} />
          <meshStandardMaterial color="#AB47BC" emissive="#AB47BC" emissiveIntensity={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Glycocalyx (sugar chains on surface) ────────────────────── */
function Glycocalyx() {
  const groupRef = useRef<THREE.Group>(null!);
  const chains = useMemo(() => {
    const all: { base: [number, number, number]; segments: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const x = (Math.random() - 0.5) * 3.5;
      const z = (Math.random() - 0.5) * 2.0;
      all.push({ base: [x, 0.35, z], segments: 3 + Math.floor(Math.random() * 3) });
    }
    return all;
  }, []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      child.rotation.z = Math.sin(t * 0.4 + i) * 0.1;
      child.rotation.x = Math.cos(t * 0.3 + i * 0.5) * 0.08;
    });
  });
  return (
    <group ref={groupRef}>
      {chains.map((chain, ci) => (
        <group key={ci} position={chain.base}>
          {Array.from({ length: chain.segments }).map((_, si) => (
            <group key={si}>
              <mesh position={[0, si * 0.12, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.1, 4]} />
                <meshStandardMaterial color="#66BB6A" emissive="#66BB6A" emissiveIntensity={0.3} />
              </mesh>
              <mesh position={[si % 2 === 0 ? 0.04 : -0.04, si * 0.12 + 0.05, 0]}>
                <sphereGeometry args={[0.025, 6, 6]} />
                <meshStandardMaterial color="#A5D6A7" emissive="#66BB6A" emissiveIntensity={0.5} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ── Scene ────────────────────────────────────────────────────── */
function MembraneScene() {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { groupRef.current.rotation.y = clock.getElapsedTime() * 0.04; });
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, -2, 3]} intensity={0.5} color="#39FF14" />
      <pointLight position={[0, 2, 0]} intensity={0.4} color="#42A5F5" />
      <group ref={groupRef}>
        <PhospholipidBilayer /><IntegralProteins /><ChannelProteins /><Cholesterol /><PeripheralProteins /><Glycocalyx />
      </group>
      <FloatingLabel position={[-2.8, 0.8, 0]} title="Phospholipid Bilayer" description="Two layers — hydrophilic heads out, hydrophobic tails inside" color="#39FF14" dotOffset={[1.0, -0.5, 0]} />
      <FloatingLabel position={[2.8, 0.5, 0.5]} title="Integral Proteins" description="Span entire membrane — transport molecules across" color="#FF6B6B" dotOffset={[-1.5, -0.3, -0.3]} />
      <FloatingLabel position={[-2.8, -0.5, -0.5]} title="Channel Proteins" description="Hydrophilic tunnels for specific ions & molecules" color="#42A5F5" dotOffset={[1.5, 0.3, 0.3]} />
      <FloatingLabel position={[2.8, -0.5, -0.5]} title="Cholesterol" description="Regulates membrane fluidity — temperature buffer" color="#FFA726" dotOffset={[-1.5, 0.3, 0.3]} />
      <FloatingLabel position={[-2.8, -1.2, 0.5]} title="Peripheral Proteins" description="Sit on membrane surface — signaling & support" color="#AB47BC" dotOffset={[1.5, 0.8, -0.3]} />
      <FloatingLabel position={[0, 2.0, 0]} title="Glycocalyx" description="Sugar chains — cell recognition & immune protection" color="#66BB6A" dotOffset={[0, -0.8, 0]} />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={10} enableDamping dampingFactor={0.05} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function MembranePage() {
  return (
    <div style={S.root}>
      <div style={S.canvasWrap}>
        <Canvas camera={{ position: [0, 2.0, 5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }} style={{ background: "#050A05" }}>
          <MembraneScene />
        </Canvas>
      </div>
      <Link href="/cell-explorer" style={S.backLink}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
        <span>Cell Explorer</span>
      </Link>
      <div style={S.header}>
        <span style={{ fontSize: "1.6rem", marginBottom: "2px" }}>🛡️</span>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#39FF14", letterSpacing: "0.08em", margin: 0, textShadow: "0 0 20px rgba(57,255,20,0.3)" }}>Cell Membrane</h1>
        <p style={{ fontSize: "0.7rem", color: "rgba(200,245,200,0.5)", margin: 0, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>Gatekeeper of the Cell</p>
      </div>
      <div style={S.infoBar}>
        {[
          { color: "#39FF14", label: "Bilayer" },
          { color: "#FF6B6B", label: "Integral" },
          { color: "#42A5F5", label: "Channel" },
          { color: "#FFA726", label: "Cholesterol" },
          { color: "#AB47BC", label: "Peripheral" },
          { color: "#66BB6A", label: "Glycocalyx" },
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
