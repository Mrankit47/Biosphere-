"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function VorticellaMdl({ detail = false }: { detail?: boolean }) {
  const stalkRef = useRef<THREE.Group>(null!);
  const bellRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Snap contraction every 4 seconds
    const cycle = t % 4;
    const isContracting = cycle > 3.5;
    const s = isContracting ? 0.3 : 1;
    
    bellRef.current.position.y = isContracting ? -1 : 1.5;
    stalkRef.current.scale.y = isContracting ? 0.2 : 1;
    
    bellRef.current.rotation.y = t * 2;
  });

  return (
    <group position={[0, -1, 0]} scale={detail ? 1.5 : 1}>
      {/* Contractile Stalk */}
      <group ref={stalkRef}>
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
          <meshStandardMaterial color="#3498DB" />
        </mesh>
      </group>

      {/* Bell Body (Zooid) */}
      <group ref={bellRef} position={[0, 1.5, 0]}>
        <mesh rotation={[Math.PI, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.1, 0.6, 32, 1, true]} />
          <meshStandardMaterial color="#85C1E9" transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
        {/* Ciliary Wreath */}
        {[...Array(16)].map((_, i) => (
          <mesh key={i} position={[Math.cos(i * 0.4) * 0.4, 0.3, Math.sin(i * 0.4) * 0.4]}>
            <boxGeometry args={[0.01, 0.1, 0.01]} />
            <meshStandardMaterial color="#3498DB" />
          </mesh>
        ))}
        {/* Internal Organelles */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#2E86C1" />
        </mesh>
      </group>

      {/* Base attachment */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#2E86C1" />
      </mesh>
    </group>
  );
}
