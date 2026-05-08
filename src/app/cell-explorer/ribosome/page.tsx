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
    <div style={S.root}>
      <div style={S.canvasWrap}>
        <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }} style={{ background: "#050A05" }}>
          <RibosomeScene />
        </Canvas>
      </div>
      <Link href="/cell-explorer" style={S.backLink}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
        <span>Cell Explorer</span>
      </Link>
      <div style={S.header}>
        <span style={{ fontSize: "1.6rem", marginBottom: "2px" }}>🔩</span>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#E0E0E0", letterSpacing: "0.08em", margin: 0, textShadow: "0 0 20px rgba(224,224,224,0.3)" }}>Ribosome</h1>
        <p style={{ fontSize: "0.7rem", color: "rgba(200,245,200,0.5)", margin: 0, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>Protein Factory of the Cell</p>
      </div>
      <div style={S.infoBar}>
        {[
          { color: "#E0E0E0", label: "60S Subunit" },
          { color: "#B0B0B0", label: "40S Subunit" },
          { color: "#FF9500", label: "mRNA" },
          { color: "#4CAF50", label: "tRNA Sites" },
          { color: "#FF6B6B", label: "Polypeptide" },
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
