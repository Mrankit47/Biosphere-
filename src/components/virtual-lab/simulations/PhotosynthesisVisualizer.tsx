"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ── 3D Bubbles Component ──────────────────────────────────────────
interface Bubble {
  id: number;
  pos: [number, number, number];
  speed: number;
  scale: number;
}

function BubbleParticles({ rate, speedMultiplier }: { rate: number; speedMultiplier: number }) {
  const pointsRef = useRef<THREE.Group>(null);
  
  const count = Math.min(25, Math.max(0, Math.ceil(rate / 4)));
  
  // Create stable properties for each bubble
  const bubbles: Bubble[] = useMemo(() => {
    const list: Bubble[] = [];
    for (let i = 0; i < 30; i++) {
      list.push({
        id: i,
        pos: [
          (Math.random() - 0.5) * 0.4, // x offset near stem
          -0.8 + Math.random() * 1.5,   // y staggered start
          (Math.random() - 0.5) * 0.4  // z offset
        ],
        speed: 0.02 + Math.random() * 0.03,
        scale: 0.015 + Math.random() * 0.02
      });
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current || rate === 0) return;
    
    const children = pointsRef.current.children;
    for (let i = 0; i < children.length; i++) {
      const mesh = children[i] as THREE.Mesh;
      if (!mesh) continue;
      
      const bInfo = bubbles[i];
      if (!bInfo) continue;
      
      // Move bubbles upwards
      mesh.position.y += bInfo.speed * speedMultiplier * (delta * 60);
      
      // Reset bubble when it reaches the top water surface
      if (mesh.position.y > 0.6) {
        mesh.position.y = -0.8;
        mesh.position.x = (Math.random() - 0.5) * 0.3;
        mesh.position.z = (Math.random() - 0.5) * 0.3;
      }
    }
  });

  if (rate === 0) return null;

  return (
    <group ref={pointsRef}>
      {bubbles.slice(0, count).map((b) => (
        <mesh key={b.id} position={b.pos}>
          <sphereGeometry args={[b.scale, 8, 8]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            opacity={0.8}
            transparent
            roughness={0.1}
            ior={1.1}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Elodea Weed Model ─────────────────────────────────────────────
function ElodeaWeed() {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Central Stem */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.03, 0.035, 1.6, 12]} />
        <meshStandardMaterial color="#10b981" roughness={0.7} />
      </mesh>
      
      {/* Rotated Leaf Clusters along stem */}
      {[-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6].map((y, idx) => (
        <group key={idx} position={[0, y, 0]} rotation={[0, (idx * Math.PI) / 3, 0]}>
          {[0, 1, 2, 3, 4].map((leafIdx) => {
            const rotZ = 0.5 + Math.random() * 0.3;
            const rotY = (leafIdx * Math.PI * 2) / 5;
            return (
              <mesh
                key={leafIdx}
                rotation={[0, rotY, rotZ]}
                position={[0.05 * Math.sin(rotY), 0, 0.05 * Math.cos(rotY)]}
              >
                <coneGeometry args={[0.05, 0.3, 4]} />
                <meshStandardMaterial color="#047857" roughness={0.6} side={THREE.DoubleSide} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

// ── Beaker & Environment ──────────────────────────────────────────
function BeakerScene({
  distance,
  wavelength,
  rate
}: {
  distance: number;
  wavelength: string;
  rate: number;
}) {
  // Map wavelength string to hexadecimal color for lighting
  const beamColor = useMemo(() => {
    switch (wavelength) {
      case "blue":
        return "#3b82f6";
      case "red":
        return "#ef4444";
      case "green":
        return "#10b981";
      default:
        return "#ffffff";
    }
  }, [wavelength]);

  // Bubble speed multiplier factor
  const speedMult = useMemo(() => {
    if (rate === 0) return 0;
    return Math.max(0.5, rate / 30);
  }, [rate]);

  // Lamp position moves along X axis based on distance input
  const lampX = useMemo(() => {
    // scale distance (5cm - 50cm) to coordinate space (-3 to +3)
    return -2.5 + ((distance - 5) / 45) * 4.5;
  }, [distance]);

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.6} castShadow />
      
      {/* Light Source Lamp (Fixture + Spotlight beam) */}
      <group position={[lampX, 0.6, 0]}>
        {/* Lamp casing */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.25, 0.4, 16]} />
          <meshStandardMaterial color="#374151" roughness={0.5} metalness={0.8} />
        </mesh>
        
        {/* Glowing bulb */}
        <mesh position={[0.2, 0, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color={beamColor} />
        </mesh>
        
        {/* Spotlight pointed towards the beaker at center [0,0,0] */}
        <spotLight
          color={beamColor}
          intensity={rate > 0 ? 3.0 : 1.2}
          distance={8}
          angle={0.45}
          penumbra={0.5}
          position={[0.2, 0, 0]}
          target={new THREE.Object3D()} // points to origin by default
          castShadow
        />

        {/* Light Beam Visual helper cones */}
        <mesh position={[1.0, -0.2, 0]} rotation={[0, 0, -Math.PI / 6]}>
          <coneGeometry args={[0.5, 2.0, 16, 1, true]} />
          <meshBasicMaterial
            color={beamColor}
            transparent
            opacity={Math.max(0.02, (50 - distance) / 180)}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Laboratory Beaker */}
      <group position={[0, 0, 0]}>
        {/* Beaker Glass Wall */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.7, 0.7, 1.7, 32, 1, true]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            opacity={0.25}
            transparent
            roughness={0.1}
            ior={1.4}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Beaker Glass Base */}
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.03, 32]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            opacity={0.3}
            transparent
            roughness={0.15}
          />
        </mesh>

        {/* Water Volume (Liquid column) */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.68, 0.68, 1.4, 32]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transmission={0.8}
            opacity={0.15}
            transparent
            roughness={0.2}
            ior={1.33}
          />
        </mesh>

        {/* Plant Sprig */}
        <ElodeaWeed />

        {/* Oxygen Bubble Particles */}
        <BubbleParticles rate={rate} speedMultiplier={speedMult} />
      </group>

      {/* Lab Desk Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#0a140a" roughness={0.8} metalness={0.2} />
      </mesh>
    </>
  );
}

// ── Main Photosynthesis Visualizer Container ──────────────────────
export default function PhotosynthesisVisualizer({
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
        Initializing 3D Environment...
      </div>
    );
  }

  const distance = inputs.distance ?? 35;
  const wavelength = inputs.wavelength ?? "white";
  const rate = outputs.rate ?? 0;

  return (
    <div className="relative w-full h-[320px] rounded-lg overflow-hidden border border-[var(--ds-glass-border)] bg-[#050a05]">
      <Canvas shadows camera={{ position: [0, 1.2, 2.5], fov: 50 }}>
        <BeakerScene distance={distance} wavelength={wavelength} rate={rate} />
        <OrbitControls
          enableZoom={true}
          maxDistance={4.5}
          minDistance={1.5}
          maxPolarAngle={Math.PI / 2 - 0.05} // prevent going below table
        />
      </Canvas>
      
      {/* 3D control overlay tip */}
      <div className="absolute bottom-2 left-2 pointer-events-none text-[10px] text-[var(--ds-fg-muted)] bg-black/60 px-2 py-1 rounded">
        🖱️ Click & Drag to Orbit | Scroll to Zoom
      </div>
      {rate > 0 && (
        <div className="absolute top-2 right-2 bg-[var(--ds-accent-faint)] border border-[var(--ds-accent-muted)] px-2 py-0.5 rounded text-[10px] text-[var(--ds-accent)] font-bold animate-pulse">
          OXYGEN RELEASE ACTIVE: {rate} bpm
        </div>
      )}
    </div>
  );
}
