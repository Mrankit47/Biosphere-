"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { BackLink, PageHeader } from "@/components/ds";

/* ── Floating Label ──────────────────────────────────────────── */
function FloatingLabel({ position, title, description, color, dotOffset }: {
  position: [number, number, number]; title: string; description: string; color: string; dotOffset?: [number, number, number];
}) {
  return (
    <group position={position}>
      {dotOffset && (<mesh position={dotOffset}><sphereGeometry args={[0.04, 8, 8]} /><meshBasicMaterial color={color} /></mesh>)}
      <Html center distanceFactor={6} style={{ pointerEvents: "none", userSelect: "none" }}>
        <div className="bg-black/85 backdrop-blur-md border border-[rgba(255,255,255,0.06)] rounded-xl p-3 max-w-[210px] text-center" style={{ borderColor: `${color}40` }}>
          <div className="text-[0.75rem] font-bold tracking-wider mb-1" style={{ color, textShadow: `0 0 10px ${color}60` }}>{title}</div>
          <div className="text-[0.65rem] text-[var(--ds-fg-muted)] leading-relaxed">{description}</div>
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
    <div className="relative w-full h-[calc(100vh-64px)] bg-[#050A05] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 2.0, 5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }} style={{ background: "#050A05" }}>
          <MembraneScene />
        </Canvas>
      </div>
      <BackLink href="/cell-explorer" label="Cell Explorer" />
      <PageHeader title="Cell Membrane" subtitle="Gatekeeper of the Cell" accentColor="#39FF14" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 p-[10px_20px] rounded-2xl bg-black/70 border border-[rgba(57,255,20,0.1)] backdrop-blur-md whitespace-nowrap">
        {[
          { color: "#39FF14", label: "Bilayer" },
          { color: "#FF6B6B", label: "Integral" },
          { color: "#42A5F5", label: "Channel" },
          { color: "#FFA726", label: "Cholesterol" },
          { color: "#AB47BC", label: "Peripheral" },
          { color: "#66BB6A", label: "Glycocalyx" },
        ].map((item, i, arr) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="flex items-center gap-1.5 text-[0.75rem] text-[var(--ds-fg-muted)] font-semibold select-none">
              <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: item.color }} />
              {item.label}
            </span>
            {i < arr.length - 1 && <span className="w-[1px] h-3.5 bg-[rgba(57,255,20,0.15)] ml-1.5" />}
          </span>
        ))}
      </div>
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 text-[var(--ds-accent-muted)] text-[0.72rem] tracking-wider pointer-events-none select-none">
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}
