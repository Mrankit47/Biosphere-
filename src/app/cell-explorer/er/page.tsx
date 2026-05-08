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

/* ── Rough ER Cisternae (flat sheets with ribosomes) ─────────── */
function RoughER() {
  const groupRef = useRef<THREE.Group>(null!);
  const ribPositions = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 60; i++) {
      const x = (Math.random() - 0.5) * 2.4;
      const sheet = Math.floor(Math.random() * 4);
      const y = -0.6 + sheet * 0.4 + 0.06;
      const z = (Math.random() - 0.5) * 1.6;
      pts.push([x, y, z]);
    }
    return pts;
  }, []);
  useFrame(({ clock }) => { groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.05; });
  return (
    <group ref={groupRef} position={[-0.8, 0, 0]}>
      {/* Flat cisternae sheets */}
      {[0, 0.4, 0.8, 1.2].map((yOff, i) => (
        <mesh key={i} position={[0, -0.6 + yOff, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[2.5, 1.8, 0.06]} />
          <meshStandardMaterial color="#9B59B6" emissive="#7B1FA2" emissiveIntensity={0.3} transparent opacity={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* Ribosomes dotting the surface */}
      {ribPositions.map((pos, i) => (
        <mesh key={`rib-${i}`} position={pos}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Smooth ER Tubules (branching tubes) ─────────────────────── */
function SmoothER() {
  const groupRef = useRef<THREE.Group>(null!);
  const curves = useMemo(() => {
    const all: THREE.CatmullRomCurve3[] = [];
    for (let b = 0; b < 5; b++) {
      const pts: THREE.Vector3[] = [];
      const baseX = 1.0 + Math.random() * 0.5;
      const baseZ = (Math.random() - 0.5) * 1.0;
      for (let i = 0; i <= 20; i++) {
        const t = (i / 20) * Math.PI * 2;
        pts.push(new THREE.Vector3(
          baseX + Math.sin(t + b * 0.8) * 0.4,
          -1.0 + (i / 20) * 2.0,
          baseZ + Math.cos(t * 1.5 + b * 0.5) * 0.3
        ));
      }
      all.push(new THREE.CatmullRomCurve3(pts, false));
    }
    return all;
  }, []);
  useFrame(({ clock }) => { groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.08) * 0.06; });
  return (
    <group ref={groupRef}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 30, 0.05, 8, false]} />
          <meshStandardMaterial color="#CE93D8" emissive="#AB47BC" emissiveIntensity={0.4} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/* ── ER Lumen (glowing interior particles) ───────────────────── */
function ERLumen() {
  const pointsRef = useRef<THREE.Points>(null!);
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pts = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      pts[i * 3] = (Math.random() - 0.5) * 3.5;
      pts[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 2.0;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return geo;
  }, []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < 200; i++) arr[i * 3 + 1] += Math.sin(t * 0.2 + i * 0.3) * 0.0003;
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial color="#E1BEE7" size={0.02} transparent opacity={0.35} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ── Transport Vesicles (budding off) ────────────────────────── */
function ERTransportVesicles() {
  const groupRef = useRef<THREE.Group>(null!);
  const positions = useMemo(() => [
    [0.5, 0.9, 0.8], [-0.3, -0.5, 1.0], [1.2, 0.3, -0.6], [-0.8, 0.7, -0.8], [0.2, -0.8, 0.5],
  ] as [number, number, number][], []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      child.position.y = positions[i][1] + Math.sin(t * 0.5 + i * 1.2) * 0.15;
      child.position.x = positions[i][0] + Math.cos(t * 0.3 + i) * 0.05;
    });
  });
  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#FFB74D" emissive="#FFB74D" emissiveIntensity={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* ── ER Membrane wireframe ───────────────────────────────────── */
function ERMembrane() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.getElapsedTime() * 0.02; });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[4.0, 2.5, 2.5]} />
      <meshBasicMaterial color="#7B1FA2" wireframe transparent opacity={0.05} />
    </mesh>
  );
}

/* ── Scene ────────────────────────────────────────────────────── */
function ERScene() {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { groupRef.current.rotation.y = clock.getElapsedTime() * 0.05; });
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, -2, 3]} intensity={0.5} color="#9B59B6" />
      <pointLight position={[0, 0, 0]} intensity={0.3} color="#CE93D8" />
      <group ref={groupRef}>
        <RoughER /><SmoothER /><ERLumen /><ERTransportVesicles /><ERMembrane />
      </group>
      <FloatingLabel position={[-2.8, 0.5, 0]} title="Rough ER" description="Flattened cisternae studded with ribosomes — protein synthesis" color="#9B59B6" dotOffset={[1.0, -0.2, 0]} />
      <FloatingLabel position={[2.8, 0.5, 0]} title="Smooth ER" description="Tubular network — lipid synthesis & detoxification" color="#CE93D8" dotOffset={[-1.0, -0.2, 0]} />
      <FloatingLabel position={[-2.5, -1.0, 0.5]} title="Ribosomes" description="Dotting rough ER surface — translate mRNA to protein" color="#FFFFFF" dotOffset={[1.5, 0.5, -0.3]} />
      <FloatingLabel position={[2.5, -1.0, -0.5]} title="ER Lumen" description="Interior space for protein folding & quality control" color="#E1BEE7" dotOffset={[-1.5, 0.5, 0.3]} />
      <FloatingLabel position={[0, 1.8, 0.8]} title="Transport Vesicles" description="Bud off carrying proteins to Golgi apparatus" color="#FFB74D" dotOffset={[0, -0.7, -0.4]} />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={10} enableDamping dampingFactor={0.05} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function ERPage() {
  return (
    <div style={S.root}>
      <div style={S.canvasWrap}>
        <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }} style={{ background: "#050A05" }}>
          <ERScene />
        </Canvas>
      </div>
      <Link href="/cell-explorer" style={S.backLink}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
        <span>Cell Explorer</span>
      </Link>
      <div style={S.header}>
        <span style={{ fontSize: "1.6rem", marginBottom: "2px" }}>🛤️</span>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#CE93D8", letterSpacing: "0.08em", margin: 0, textShadow: "0 0 20px rgba(206,147,216,0.3)" }}>Endoplasmic Reticulum</h1>
        <p style={{ fontSize: "0.7rem", color: "rgba(200,245,200,0.5)", margin: 0, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>Transport Highway of the Cell</p>
      </div>
      <div style={S.infoBar}>
        {[
          { color: "#9B59B6", label: "Rough ER" },
          { color: "#CE93D8", label: "Smooth ER" },
          { color: "#FFFFFF", label: "Ribosomes" },
          { color: "#E1BEE7", label: "Lumen" },
          { color: "#FFB74D", label: "Vesicles" },
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
