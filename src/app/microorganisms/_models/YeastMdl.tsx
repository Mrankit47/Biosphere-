"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function YeastMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.2;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <group ref={groupRef} scale={detail ? 2 : 1.2}>
      {/* Parent Cell */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#F5CBA7" roughness={0.7} />
      </mesh>

      {/* Budding Daughter Cell */}
      <mesh position={[0.5, 0.4, 0]} scale={0.5}>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshStandardMaterial color="#F5CBA7" />
      </mesh>
      
      {/* Neck (Connecting budding cell) */}
      <mesh position={[0.3, 0.25, 0]} rotation={[0, 0, Math.PI/4]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 8]} />
        <meshStandardMaterial color="#F5CBA7" />
      </mesh>

      {/* Bud Scars (Small craters) */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[
          Math.cos(i * 2) * 0.55,
          Math.sin(i * 2) * 0.55,
          0.2
        ]} rotation={[0, i, 0]}>
          <torusGeometry args={[0.08, 0.02, 8, 16]} />
          <meshStandardMaterial color="#DC7633" transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Large Central Vacuole (Internal) */}
      <mesh position={[-0.1, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#D5D8DC" transparent opacity={0.4} />
      </mesh>

      {/* Floating particles (Nutrients) */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[
          Math.sin(i) * 1.5,
          Math.cos(i * 2) * 1.5,
          Math.sin(i * 3) * 1.5
        ]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#EB984E" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}
