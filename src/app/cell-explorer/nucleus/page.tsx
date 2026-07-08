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
    <div className="relative w-full h-[calc(100vh-64px)] bg-[#050A05] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }} style={{ background: "#050A05" }}>
          <NucleusScene />
        </Canvas>
      </div>
      <BackLink href="/cell-explorer" label="Cell Explorer" />
      <PageHeader title="Nucleus" subtitle="Control Center of the Cell" accentColor="#5AAFFF" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 p-[10px_20px] rounded-2xl bg-black/70 border border-[rgba(57,255,20,0.1)] backdrop-blur-md whitespace-nowrap">
        {[
          { color: "#378ADD", label: "Envelope" },
          { color: "#5AAFFF", label: "Pores" },
          { color: "#FF6B8A", label: "Nucleolus" },
          { color: "#A855F7", label: "Chromatin" },
          { color: "#60A5FA", label: "Lamina" },
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
