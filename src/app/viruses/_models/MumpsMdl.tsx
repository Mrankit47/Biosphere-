"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function MumpsMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Subtle shape breathing
    meshRef.current.scale.set(
      1 + Math.sin(t) * 0.05,
      1 + Math.cos(t * 1.2) * 0.05,
      1 + Math.sin(t * 0.8) * 0.05
    );
    meshRef.current.rotation.y = t * 0.2;
  });

  return (
    <group scale={detail ? 2.5 : 1.5}>
      {/* Pleomorphic Envelope (Irregular sphere) */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#F5B041" roughness={0.6} />
        
        {/* Surface Proteins (HN and F) */}
        {[...Array(30)].map((_, i) => (
          <group key={i} rotation={[Math.random() * 6, Math.random() * 6, 0]}>
            <mesh position={[0, 1, 0]}>
              <cylinderGeometry args={[0.02, 0.05, 0.15, 8]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#D35400" : "#E67E22"} />
            </mesh>
          </group>
        ))}
      </mesh>

      {/* Internal Helical RNP (Ribonucleoprotein) */}
      <mesh rotation={[Math.PI/4, 0, 0]}>
        <torusGeometry args={[0.5, 0.1, 16, 50]} />
        <meshStandardMaterial color="#9B59B6" transparent opacity={0.4} wireframe />
      </mesh>
      
      {/* Nucleus-like core */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#D68910" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
