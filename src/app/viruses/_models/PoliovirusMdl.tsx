"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function PoliovirusMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.4;
    meshRef.current.rotation.x = t * 0.2;
  });

  return (
    <group scale={detail ? 3 : 2}>
      {/* Tough Icosahedral Shell */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color="#AED6F1" 
          roughness={0.2} 
          metalness={0.3} 
          flatShading 
        />
        
        {/* Surface wireframe (Proteins VP1-VP4) */}
        <mesh>
          <icosahedronGeometry args={[1.02, 1]} />
          <meshBasicMaterial color="#2E86C1" wireframe transparent opacity={0.3} />
        </mesh>
      </mesh>

      {/* Internal RNA Core (Glowing) */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#9B59B6" transparent opacity={0.4} />
      </mesh>

      {/* Floating protective particles (History reference) */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[
          Math.sin(i * 1.5) * 1.5,
          Math.cos(i * 2) * 1.5,
          Math.sin(i * 3) * 1.5
        ]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#3498DB" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}
