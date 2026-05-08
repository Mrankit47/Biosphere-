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

/* ── Cisterna Disc ───────────────────────────────────────────── */
function CisternaDisc({ position, radius, color, emissive, opacity = 0.8 }: {
  position: [number, number, number]; radius: number; color: string; emissive: string; opacity?: number;
}) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[radius, radius, 0.08, 32]} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.4} roughness={0.5} transparent opacity={opacity} />
    </mesh>
  );
}

/* ── Cis Face (receiving side) ───────────────────────────────── */
function CisFace() {
  return (
    <group>
      <CisternaDisc position={[0, -0.6, 0]} radius={1.3} color="#8BC34A" emissive="#689F38" />
      {/* Slightly convex shape */}
      <mesh position={[0, -0.6, 0]}>
        <sphereGeometry args={[1.3, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.15]} />
        <meshStandardMaterial color="#8BC34A" emissive="#689F38" emissiveIntensity={0.3} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ── Medial Cisternae (middle processing layers) ─────────────── */
function MedialCisternae() {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.2) * 0.02; });
  return (
    <group ref={groupRef}>
      {[0, 0.25, 0.5].map((yOff, i) => (
        <CisternaDisc key={i} position={[0, -0.2 + yOff, 0]} radius={1.2 - i * 0.05} color="#D4A017" emissive="#B8860B" />
      ))}
    </group>
  );
}

/* ── Trans Face (shipping side) ──────────────────────────────── */
function TransFace() {
  return (
    <group>
      <CisternaDisc position={[0, 0.7, 0]} radius={1.05} color="#FF9800" emissive="#E65100" />
      {/* Slightly concave shape */}
      <mesh position={[0, 0.75, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[1.05, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.12]} />
        <meshStandardMaterial color="#FF9800" emissive="#E65100" emissiveIntensity={0.3} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ── Transport Vesicles (from ER to cis) ─────────────────────── */
function TransportVesicles() {
  const groupRef = useRef<THREE.Group>(null!);
  const positions = useMemo(() => [
    [-1.0, -1.0, 0.3], [-0.5, -1.2, -0.4], [0.3, -1.1, 0.5], [0.8, -0.9, -0.2],
  ] as [number, number, number][], []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      child.position.y = positions[i][1] + Math.sin(t * 0.6 + i * 1.5) * 0.12;
    });
  });
  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#66BB6A" emissive="#66BB6A" emissiveIntensity={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Secretory Vesicles (budding from trans) ─────────────────── */
function SecretoryVesicles() {
  const groupRef = useRef<THREE.Group>(null!);
  const positions = useMemo(() => [
    [0.8, 1.0, 0.3], [-0.6, 1.1, -0.3], [0.2, 1.2, 0.5], [-0.3, 0.95, -0.5], [0.9, 1.15, -0.1],
  ] as [number, number, number][], []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      child.position.y = positions[i][1] + Math.sin(t * 0.4 + i * 1.2) * 0.1;
      child.position.x = positions[i][0] + Math.sin(t * 0.3 + i) * 0.05;
    });
  });
  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#EF5350" emissive="#EF5350" emissiveIntensity={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Lumen Glow (internal fill) ──────────────────────────────── */
function LumenGlow() {
  const pointsRef = useRef<THREE.Points>(null!);
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pts = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      pts[i * 3] = (Math.random() - 0.5) * 2.2;
      pts[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return geo;
  }, []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < 150; i++) arr[i * 3 + 1] += Math.sin(t * 0.3 + i) * 0.0004;
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial color="#FFF176" size={0.02} transparent opacity={0.4} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ── Scene ────────────────────────────────────────────────────── */
function GolgiScene() {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { groupRef.current.rotation.y = clock.getElapsedTime() * 0.06; });
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, -2, 3]} intensity={0.5} color="#D4A017" />
      <pointLight position={[0, 0, 0]} intensity={0.3} color="#FF9800" />
      <group ref={groupRef} rotation={[0.15, 0, 0]}>
        <CisFace /><MedialCisternae /><TransFace /><TransportVesicles /><SecretoryVesicles /><LumenGlow />
      </group>
      <FloatingLabel position={[-2.3, -0.8, 0.5]} title="Cis Face (Receiving)" description="Convex side — receives vesicles from the ER" color="#8BC34A" dotOffset={[1.2, 0.2, -0.3]} />
      <FloatingLabel position={[2.3, 0.3, 0]} title="Medial Cisternae" description="Middle layers — glycosylation & processing zone" color="#D4A017" dotOffset={[-1.2, -0.1, 0]} />
      <FloatingLabel position={[-2.3, 1.0, -0.5]} title="Trans Face (Shipping)" description="Concave side — sorts & ships finished cargo" color="#FF9800" dotOffset={[1.2, -0.3, 0.3]} />
      <FloatingLabel position={[2.0, -1.2, 0.5]} title="Transport Vesicles" description="Carry cargo from ER to cis face" color="#66BB6A" dotOffset={[-1.5, 0.5, -0.3]} />
      <FloatingLabel position={[2.3, 1.5, 0.3]} title="Secretory Vesicles" description="Bud off from trans face to cell destinations" color="#EF5350" dotOffset={[-1.2, -0.3, 0]} />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={10} enableDamping dampingFactor={0.05} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function GolgiPage() {
  return (
    <div style={S.root}>
      <div style={S.canvasWrap}>
        <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }} style={{ background: "#050A05" }}>
          <GolgiScene />
        </Canvas>
      </div>
      <Link href="/cell-explorer" style={S.backLink}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
        <span>Cell Explorer</span>
      </Link>
      <div style={S.header}>
        <span style={{ fontSize: "1.6rem", marginBottom: "2px" }}>📦</span>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#FFD700", letterSpacing: "0.08em", margin: 0, textShadow: "0 0 20px rgba(255,215,0,0.3)" }}>Golgi Body</h1>
        <p style={{ fontSize: "0.7rem", color: "rgba(200,245,200,0.5)", margin: 0, letterSpacing: "0.15em", textTransform: "uppercase" as const }}>Post Office of the Cell</p>
      </div>
      <div style={S.infoBar}>
        {[
          { color: "#8BC34A", label: "Cis Face" },
          { color: "#D4A017", label: "Cisternae" },
          { color: "#FF9800", label: "Trans Face" },
          { color: "#66BB6A", label: "Transport" },
          { color: "#EF5350", label: "Secretory" },
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
