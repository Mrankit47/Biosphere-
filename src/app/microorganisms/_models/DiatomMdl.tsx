"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DiatomMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.x = t * 0.1;
    innerRef.current.rotation.y = -t * 0.4;
    meshRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.02);
  });

  return (
    <group scale={detail ? 2 : 1.2}>
      {/* Outer Silica Shell (Glassy) */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshPhysicalMaterial 
          color="#EBF5FB" 
          transparent 
          opacity={0.4} 
          transmission={0.8}
          thickness={0.5}
          roughness={0}
          metalness={0.1}
          wireframe={false}
        />
      </mesh>
      
      {/* Wireframe edges (Silica patterns) */}
      <mesh rotation={meshRef.current?.rotation}>
        <icosahedronGeometry args={[1.01, 1]} />
        <meshBasicMaterial color="#5DADE2" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Inner Chloroplasts and Organelles */}
      <group ref={innerRef}>
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[Math.sin(i) * 0.4, Math.cos(i) * 0.4, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#D4AC0D" emissive="#D4AC0D" emissiveIntensity={0.2} />
          </mesh>
        ))}
        {/* Central Nucleus */}
        <mesh>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshStandardMaterial color="#2E86C1" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Spines (Typical for some diatoms) */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} rotation={[i * Math.PI/3, i * Math.PI/6, 0]} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 2.5, 8]} />
          <meshBasicMaterial color="#5DADE2" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}
