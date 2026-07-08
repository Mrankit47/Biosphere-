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

/* ── Large Subunit (60S) ─────────────────────────────────────── */
function LargeSubunit() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.getElapsedTime() * 0.08; });
  return (
    <mesh ref={ref} position={[0, 0.35, 0]}>
      <sphereGeometry args={[1.1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
      <meshStandardMaterial color="#E0E0E0" emissive="#BDBDBD" emissiveIntensity={0.2} roughness={0.5} metalness={0.05} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ── Small Subunit (40S) ─────────────────────────────────────── */
function SmallSubunit() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.getElapsedTime() * 0.08; });
  return (
    <mesh ref={ref} position={[0, -0.25, 0]} rotation={[Math.PI, 0, 0]}>
      <sphereGeometry args={[0.85, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
      <meshStandardMaterial color="#B0B0B0" emissive="#9E9E9E" emissiveIntensity={0.2} roughness={0.5} metalness={0.05} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ── mRNA Channel (tube threading through gap) ───────────────── */
function MRNAChannel() {
  const ref = useRef<THREE.Mesh>(null!);
  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 30; i++) {
      const t = (i / 30) * Math.PI * 2;
      pts.push(new THREE.Vector3(-2.0 + (i / 30) * 4.0, 0.05 + Math.sin(t) * 0.08, Math.cos(t * 0.5) * 0.15));
    }
    return new THREE.CatmullRomCurve3(pts, false);
  }, []);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.getElapsedTime() * 0.08; });
  return (
    <mesh ref={ref}>
      <tubeGeometry args={[curve, 40, 0.04, 8, false]} />
      <meshStandardMaterial color="#FF9500" emissive="#FF9500" emissiveIntensity={0.7} roughness={0.3} />
    </mesh>
  );
}

/* ── tRNA Binding Sites (A, P, E) ────────────────────────────── */
function TRNASites() {
  const groupRef = useRef<THREE.Group>(null!);
  const sites = useMemo(() => [
    { pos: [0.5, 0.15, 0.6] as [number, number, number], label: "A-Site", color: "#4CAF50" },
    { pos: [0, 0.15, 0.7] as [number, number, number], label: "P-Site", color: "#66BB6A" },
    { pos: [-0.5, 0.15, 0.6] as [number, number, number], label: "E-Site", color: "#81C784" },
  ], []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => { child.position.y = sites[i].pos[1] + Math.sin(t * 0.5 + i) * 0.03; });
  });
  return (
    <group ref={groupRef}>
      {sites.map((s, i) => (
        <group key={i} position={s.pos}>
          <mesh><boxGeometry args={[0.2, 0.35, 0.12]} /><meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.5} roughness={0.4} transparent opacity={0.8} /></mesh>
          {/* tRNA L-shape */}
          <mesh position={[0, 0.25, 0]} rotation={[0, 0, i * 0.3]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0.08, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.16, 8]} />
            <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ── Polypeptide Chain (growing protein) ─────────────────────── */
function PolypeptideChain() {
  const ref = useRef<THREE.Mesh>(null!);
  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 25; i++) {
      const t = (i / 25) * Math.PI * 2;
      pts.push(new THREE.Vector3(0.2 + Math.sin(t * 1.5) * 0.15, 0.8 + (i / 25) * 1.5, Math.cos(t * 1.2) * 0.2));
    }
    return new THREE.CatmullRomCurve3(pts, false);
  }, []);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.getElapsedTime() * 0.08; });
  return (
    <mesh ref={ref}>
      <tubeGeometry args={[curve, 30, 0.035, 8, false]} />
      <meshStandardMaterial color="#FF6B6B" emissive="#FF6B6B" emissiveIntensity={0.5} roughness={0.4} />
    </mesh>
  );
}

/* ── Tunnel/Exit Channel ─────────────────────────────────────── */
function ExitTunnel() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.getElapsedTime() * 0.08; });
  return (
    <mesh ref={ref} position={[0.15, 0.7, 0]}>
      <cylinderGeometry args={[0.08, 0.06, 0.5, 12]} />
      <meshStandardMaterial color="#FFAB91" emissive="#FFAB91" emissiveIntensity={0.3} transparent opacity={0.5} roughness={0.4} />
    </mesh>
  );
}

/* ── Scene ────────────────────────────────────────────────────── */
function RibosomeScene() {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { groupRef.current.rotation.y = clock.getElapsedTime() * 0.06; });
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, -2, 3]} intensity={0.5} color="#E0E0E0" />
      <pointLight position={[0, 0, 0]} intensity={0.3} color="#4CAF50" />
      <group ref={groupRef}>
        <LargeSubunit /><SmallSubunit /><MRNAChannel /><TRNASites /><PolypeptideChain /><ExitTunnel />
      </group>
      <FloatingLabel position={[2.2, 1.2, 0]} title="Large Subunit (60S)" description="Catalyzes peptide bond formation between amino acids" color="#E0E0E0" dotOffset={[-1.0, -0.4, 0]} />
      <FloatingLabel position={[-2.2, -0.8, 0.5]} title="Small Subunit (40S)" description="Reads mRNA codons and matches with tRNA anticodons" color="#B0B0B0" dotOffset={[1.2, 0.3, -0.2]} />
      <FloatingLabel position={[-2.5, 0.8, -0.5]} title="mRNA Channel" description="Messenger RNA threaded between subunits being decoded" color="#FF9500" dotOffset={[1.5, -0.5, 0.3]} />
      <FloatingLabel position={[2.0, -0.5, 1.0]} title="tRNA Binding Sites" description="A-site (accept), P-site (hold), E-site (exit)" color="#4CAF50" dotOffset={[-1.0, 0.4, -0.3]} />
      <FloatingLabel position={[2.5, 1.8, 0.5]} title="Polypeptide Chain" description="Growing amino acid chain — the protein being built" color="#FF6B6B" dotOffset={[-1.5, -0.5, -0.3]} />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={10} enableDamping dampingFactor={0.05} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function RibosomePage() {
  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-[#050A05] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }} style={{ background: "#050A05" }}>
          <RibosomeScene />
        </Canvas>
      </div>
      <BackLink href="/cell-explorer" label="Cell Explorer" />
      <PageHeader title="Ribosome" subtitle="Protein Factory of the Cell" accentColor="#E0E0E0" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 p-[10px_20px] rounded-2xl bg-black/70 border border-[rgba(57,255,20,0.1)] backdrop-blur-md whitespace-nowrap">
        {[
          { color: "#E0E0E0", label: "60S Subunit" },
          { color: "#B0B0B0", label: "40S Subunit" },
          { color: "#FF9500", label: "mRNA" },
          { color: "#4CAF50", label: "tRNA Sites" },
          { color: "#FF6B6B", label: "Polypeptide" },
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
