"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function StentorMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ciliaRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Rhythmic contraction/stretching
    const s = 1 + Math.sin(t * 1.5) * 0.1;
    meshRef.current.scale.y = s;
    meshRef.current.scale.x = 1 / Math.sqrt(s);
    meshRef.current.scale.z = 1 / Math.sqrt(s);

    // Cilia rotation
    ciliaRef.current.rotation.y = t * 4;
  });

  return (
    <group position={[0, -0.5, 0]} scale={detail ? 1.5 : 1}>
      {/* Trumpet Body */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.8, 0.1, 2, 32, 1, true]} />
        <meshStandardMaterial color="#3498DB" transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>

      {/* Top Cap (The "Mouth") */}
      <mesh position={[0, 1, 0]}>
        <ringGeometry args={[0, 0.8, 32]} rotation={[-Math.PI/2, 0, 0]} />
        <meshStandardMaterial color="#2980B9" transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Ciliary Vortex (Particles on top) */}
      <group ref={ciliaRef} position={[0, 1.05, 0]}>
        {[...Array(20)].map((_, i) => (
          <mesh key={i} position={[Math.cos(i * 0.4) * 0.7, 0, Math.sin(i * 0.4) * 0.7]}>
            <boxGeometry args={[0.02, 0.1, 0.02]} />
            <meshStandardMaterial color="#85C1E9" />
          </mesh>
        ))}
      </group>

      {/* Internal Beads (Macronucleus) */}
      <group position={[0, 0.2, 0]}>
        {[-0.6, -0.3, 0, 0.3, 0.6].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#6C3483" />
          </mesh>
        ))}
      </group>

      {/* Holdfast (The base) */}
      <mesh position={[0, -1, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#1F618D" />
      </mesh>
    </group>
  );
}
