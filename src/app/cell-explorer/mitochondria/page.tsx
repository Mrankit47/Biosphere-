"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { BackLink, PageHeader } from "@/components/ds";

/* ══════════════════════════════════════════════════════════════
   LABEL COMPONENT (floating HTML in 3D space)
   ══════════════════════════════════════════════════════════════ */

function FloatingLabel({
  position,
  title,
  description,
  color,
  dotOffset,
}: {
  position: [number, number, number];
  title: string;
  description: string;
  color: string;
  dotOffset?: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Connecting dot at the actual part */}
      {dotOffset && (
        <mesh position={dotOffset}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      )}

      <Html
        center
        distanceFactor={6}
        style={{
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div className="bg-black/85 backdrop-blur-md border border-[rgba(255,255,255,0.06)] rounded-xl p-3 max-w-[200px] text-center" style={{ borderColor: `${color}40` }}>
          <div
            className="text-[0.75rem] font-bold tracking-wider mb-1"
            style={{
              color: color,
              textShadow: `0 0 10px ${color}60`,
            }}
          >
            {title}
          </div>
          <div className="text-[0.65rem] text-[var(--ds-fg-muted)] leading-relaxed">
            {description}
          </div>
        </div>
      </Html>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   OUTER MEMBRANE (translucent capsule)
   ══════════════════════════════════════════════════════════════ */

function OuterMembrane() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.15) * 0.03;
  });

  return (
    <mesh ref={ref}>
      <capsuleGeometry args={[1.0, 2.2, 32, 48]} />
      <meshStandardMaterial
        color="#1D9E75"
        transparent
        opacity={0.18}
        roughness={0.3}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════════════════════
   OUTER MEMBRANE WIREFRAME (visible structure)
   ══════════════════════════════════════════════════════════════ */

function OuterMembraneWireframe() {
  return (
    <mesh>
      <capsuleGeometry args={[1.02, 2.22, 16, 24]} />
      <meshBasicMaterial
        color="#39FF14"
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════════════════════
   INNER MEMBRANE / CRISTAE (folded ridges inside)
   ══════════════════════════════════════════════════════════════ */

function Cristae() {
  const groupRef = useRef<THREE.Group>(null!);

  // Create multiple folded cristae curves
  const curves = useMemo(() => {
    const allCurves: THREE.CatmullRomCurve3[] = [];

    // Horizontal folds at different Y positions
    const yPositions = [-0.7, -0.3, 0.1, 0.5, 0.9];

    yPositions.forEach((yBase, idx) => {
      const points: THREE.Vector3[] = [];
      const direction = idx % 2 === 0 ? 1 : -1;

      for (let i = 0; i <= 30; i++) {
        const t = (i / 30) * Math.PI;
        const x = direction * (0.3 + Math.sin(t) * 0.45);
        const y = yBase + Math.sin(t * 2) * 0.08;
        const z = Math.cos(t * 0.5) * 0.3;
        points.push(new THREE.Vector3(x, y, z));
      }
      allCurves.push(new THREE.CatmullRomCurve3(points, false));
    });

    return allCurves;
  }, []);

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {curves.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 40, 0.025, 8, false]} />
          <meshStandardMaterial
            color="#2FFFB0"
            emissive="#1D9E75"
            emissiveIntensity={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Inner membrane shell — slightly smaller capsule */}
      <mesh>
        <capsuleGeometry args={[0.82, 1.8, 32, 48]} />
        <meshStandardMaterial
          color="#1D9E75"
          transparent
          opacity={0.12}
          roughness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   MATRIX (semi-transparent inner fill with particles)
   ══════════════════════════════════════════════════════════════ */

function Matrix() {
  const pointsRef = useRef<THREE.Points>(null!);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pts = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const y = (Math.random() - 0.5) * 2.5;
      const maxR = Math.sqrt(Math.max(0, 0.7 * 0.7 - Math.max(0, Math.abs(y) - 0.9) ** 2));
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * maxR;
      pts[i * 3] = Math.cos(angle) * r;
      pts[i * 3 + 1] = y;
      pts[i * 3 + 2] = Math.sin(angle) * r;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const arr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < 200; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.3 + i) * 0.0005;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#5FFFCC"
        size={0.03}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ══════════════════════════════════════════════════════════════
   MITOCHONDRIAL DNA (small ring)
   ══════════════════════════════════════════════════════════════ */

function MitoDNA() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.getElapsedTime() * 0.3;
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
  });

  return (
    <mesh ref={ref} position={[0, -0.3, 0]}>
      <torusGeometry args={[0.15, 0.02, 12, 32]} />
      <meshStandardMaterial
        color="#FF6B6B"
        emissive="#FF6B6B"
        emissiveIntensity={0.8}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════════════════════
   FULL 3D SCENE
   ══════════════════════════════════════════════════════════════ */

function MitoScene() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.06;
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, -2, 3]} intensity={0.5} color="#39FF14" />
      <pointLight position={[0, 0, 0]} intensity={0.3} color="#2FFFB0" />

      <group ref={groupRef} rotation={[0, 0, Math.PI * 0.08]}>
        <OuterMembrane />
        <OuterMembraneWireframe />
        <Cristae />
        <Matrix />
        <MitoDNA />
      </group>

      {/* ── Floating Labels ────────────────────────────── */}
      <FloatingLabel
        position={[2.0, 0.8, 0]}
        title="Outer Membrane"
        description="Protects the mitochondria"
        color="#39FF14"
        dotOffset={[-0.9, -0.3, 0]}
      />
      <FloatingLabel
        position={[-2.2, 0, 0.5]}
        title="Inner Membrane (Cristae)"
        description="Where ATP is produced"
        color="#2FFFB0"
        dotOffset={[1.1, 0, -0.2]}
      />
      <FloatingLabel
        position={[1.8, -1.0, 0.5]}
        title="Matrix"
        description="Contains mitochondrial DNA"
        color="#5FFFCC"
        dotOffset={[-0.9, 0.5, -0.3]}
      />

      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        enableDamping
        dampingFactor={0.05}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════════════════════════ */

export default function MitochondriaPage() {
  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-[#050A05] overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 1.5, 5], fov: 45 }}
          dpr={[1, 2]}
          gl={{ antialias: true }}
          style={{ background: "#050A05" }}
        >
          <MitoScene />
        </Canvas>
      </div>

      {/* Back Button */}
      <BackLink href="/cell-explorer" label="Cell Explorer" />

      {/* Page Header */}
      <PageHeader title="Mitochondria" subtitle="The Powerhouse of the Cell" accentColor="#2FFFB0" />

      {/* Bottom Info Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 p-[10px_20px] rounded-2xl bg-black/70 border border-[rgba(57,255,20,0.1)] backdrop-blur-md whitespace-nowrap">
        <div className="flex items-center gap-1.5 text-[0.75rem] text-[var(--ds-fg-muted)] font-semibold select-none">
          <span className="w-2 h-2 rounded-full inline-block shrink-0 bg-[#39FF14]" />
          Outer Membrane
        </div>
        <div className="w-[1px] h-3.5 bg-[rgba(57,255,20,0.15)] ml-1.5" />
        <div className="flex items-center gap-1.5 text-[0.75rem] text-[var(--ds-fg-muted)] font-semibold select-none">
          <span className="w-2 h-2 rounded-full inline-block shrink-0 bg-[#2FFFB0]" />
          Cristae
        </div>
        <div className="w-[1px] h-3.5 bg-[rgba(57,255,20,0.15)] ml-1.5" />
        <div className="flex items-center gap-1.5 text-[0.75rem] text-[var(--ds-fg-muted)] font-semibold select-none">
          <span className="w-2 h-2 rounded-full inline-block shrink-0 bg-[#5FFFCC]" />
          Matrix
        </div>
        <div className="w-[1px] h-3.5 bg-[rgba(57,255,20,0.15)] ml-1.5" />
        <div className="flex items-center gap-1.5 text-[0.75rem] text-[var(--ds-fg-muted)] font-semibold select-none">
          <span className="w-2 h-2 rounded-full inline-block shrink-0 bg-[#FF6B6B]" />
          mtDNA
        </div>
      </div>

      {/* Hint */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 text-[var(--ds-accent-muted)] text-[0.72rem] tracking-wider pointer-events-none select-none">
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}
