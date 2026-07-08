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
    <div className="relative w-full h-[calc(100vh-64px)] bg-[#050A05] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 1.5, 6], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }} style={{ background: "#050A05" }}>
          <ERScene />
        </Canvas>
      </div>
      <BackLink href="/cell-explorer" label="Cell Explorer" />
      <PageHeader title="Endoplasmic Reticulum" subtitle="Transport Highway of the Cell" accentColor="#CE93D8" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 p-[10px_20px] rounded-2xl bg-black/70 border border-[rgba(57,255,20,0.1)] backdrop-blur-md whitespace-nowrap">
        {[
          { color: "#9B59B6", label: "Rough ER" },
          { color: "#CE93D8", label: "Smooth ER" },
          { color: "#FFFFFF", label: "Ribosomes" },
          { color: "#E1BEE7", label: "Lumen" },
          { color: "#FFB74D", label: "Vesicles" },
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
