"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ── Foam Bubbles Component ────────────────────────────────────────
interface BubbleParticle {
  id: number;
  pos: [number, number, number];
  speed: number;
  scale: number;
}

function FoamBubbles({ active, height }: { active: boolean; height: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const bubbles: BubbleParticle[] = useMemo(() => {
    const list: BubbleParticle[] = [];
    for (let i = 0; i < 40; i++) {
      list.push({
        id: i,
        pos: [
          (Math.random() - 0.5) * 0.28,
          -0.5,
          (Math.random() - 0.5) * 0.28
        ],
        speed: 0.005 + Math.random() * 0.012,
        scale: 0.008 + Math.random() * 0.015
      });
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !active || height <= 0) return;

    const children = groupRef.current.children;
    // Maximum height boundary is capped by the current froth height
    const topLimit = -0.5 + height;

    for (let i = 0; i < children.length; i++) {
      const mesh = children[i] as THREE.Mesh;
      if (!mesh) continue;

      const b = bubbles[i];
      if (!b) continue;

      mesh.position.y += b.speed * (delta * 60);

      // Reset when reaching top of foam column
      if (mesh.position.y > topLimit) {
        mesh.position.y = -0.5;
        mesh.position.x = (Math.random() - 0.5) * 0.25;
        mesh.position.z = (Math.random() - 0.5) * 0.25;
      }
    }
  });

  if (!active || height <= 0) return null;

  return (
    <group ref={groupRef}>
      {bubbles.slice(0, Math.ceil(height * 20)).map((b) => (
        <mesh key={b.id} position={b.pos}>
          <sphereGeometry args={[b.scale, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.1}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── 3D Test Tube & Reaction Scene ─────────────────────────────────
function CylinderReaction({
  ph,
  temp,
  rate,
  frothHeight
}: {
  ph: number;
  temp: number;
  rate: number;
  frothHeight: number;
}) {
  const foamRef = useRef<THREE.Mesh>(null);
  const currentHeightRef = useRef(0);

  // Convert froth height (max 160) to coordinate space scale (0 to 1.3)
  const targetScaleHeight = useMemo(() => {
    return (frothHeight / 160) * 1.3;
  }, [frothHeight]);

  useFrame((state, delta) => {
    // Smoothly animate the foam height scaling
    const diff = targetScaleHeight - currentHeightRef.current;
    currentHeightRef.current += diff * 0.04 * (delta * 60);

    if (foamRef.current) {
      // Set mesh scale height
      foamRef.current.scale.y = Math.max(0.001, currentHeightRef.current);
      // Adjust position so it expands upward from liquid surface
      foamRef.current.position.y = -0.5 + currentHeightRef.current / 2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 8, 3]} intensity={0.7} />
      <pointLight position={[-3, 2, -2]} intensity={0.3} color="#a855f7" />

      {/* Lab tube stand / rack */}
      <group position={[0, -0.9, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 0.1, 1.5]} />
          <meshStandardMaterial color="#1f2937" roughness={0.9} />
        </mesh>
        <mesh position={[0.5, 0.8, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.6]} />
          <meshStandardMaterial color="#4b5563" metalness={0.8} />
        </mesh>
        <mesh position={[-0.5, 0.8, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.6]} />
          <meshStandardMaterial color="#4b5563" metalness={0.8} />
        </mesh>
        {/* Support rings */}
        <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.42, 0.02, 8, 24]} />
          <meshStandardMaterial color="#4b5563" metalness={0.8} />
        </mesh>
      </group>

      {/* Graduated Cylinder Assembly */}
      <group position={[0, 0, 0]}>
        {/* Transparent Glass Tube */}
        <mesh>
          <cylinderGeometry args={[0.35, 0.35, 2.0, 32, 1, true]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            opacity={0.2}
            transparent
            roughness={0.1}
            ior={1.45}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Rounded Bottom Base of Test Tube */}
        <mesh position={[0, -1.0, 0]}>
          <sphereGeometry args={[0.35, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            opacity={0.2}
            transparent
            roughness={0.1}
            ior={1.45}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Graduated Ring Markers on Tube */}
        {[-0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.351, 0.004, 6, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
          </mesh>
        ))}

        {/* Hydrogen Peroxide Liquid base (Substrate) */}
        <mesh position={[0, -0.75, 0]}>
          <cylinderGeometry args={[0.33, 0.33, 0.5, 32]} />
          <meshPhysicalMaterial
            color="#d8b4fe" // Light purple
            transmission={0.7}
            opacity={0.3}
            transparent
            roughness={0.2}
            ior={1.35}
          />
        </mesh>

        {/* Rising Froth / Foam Mesh (Controlled dynamically) */}
        <mesh ref={foamRef} position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.33, 0.33, 1.0, 32]} />
          <meshStandardMaterial
            color="#f3f4f6" // White foam
            roughness={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Bubble particles inside the reaction froth */}
        <FoamBubbles active={rate > 0} height={currentHeightRef.current} />
      </group>
    </>
  );
}

// ── Main Catalase Visualizer Container ────────────────────────────
export default function CatalaseVisualizer({
  inputs,
  outputs
}: {
  inputs: Record<string, any>;
  outputs: Record<string, any>;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-[#050A05] text-[#39FF14] text-xs">
        Initializing 3D Biochem Environment...
      </div>
    );
  }

  const ph = inputs.ph ?? 7;
  const temp = inputs.temp ?? 20;
  const rate = outputs.rate ?? 0;
  const frothHeight = outputs.frothHeight ?? 0;

  return (
    <div className="relative w-full h-[320px] rounded-lg overflow-hidden border border-[var(--ds-glass-border)] bg-[#050a05]">
      <Canvas shadows camera={{ position: [0, 0.3, 2.0], fof: 50 } as any}>
        <CylinderReaction ph={ph} temp={temp} rate={rate} frothHeight={frothHeight} />
        <OrbitControls
          enableZoom={true}
          maxDistance={3.5}
          minDistance={1.2}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />
      </Canvas>

      {/* 3D control overlay tip */}
      <div className="absolute bottom-2 left-2 pointer-events-none text-[10px] text-[var(--ds-fg-muted)] bg-black/60 px-2 py-1 rounded">
        🖱️ Click & Drag to Orbit | Scroll to Zoom
      </div>

      {/* Live reaction readout */}
      {rate > 0 && (
        <div className="absolute top-2 right-2 bg-purple-950/80 border border-purple-500/50 px-2 py-0.5 rounded text-[10px] text-purple-300 font-bold animate-pulse">
          CATALYSIS VELOCITY: {rate}%
        </div>
      )}
    </div>
  );
}
