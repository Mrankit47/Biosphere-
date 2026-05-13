"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ChikungunyaMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.4;
    meshRef.current.rotation.z = t * 0.2;
  });

  return (
    <group scale={detail ? 2.5 : 1.5}>
      {/* Enveloped Body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#AED6F1" roughness={0.3} metalness={0.1} />
        
        {/* Heterodimer Spikes */}
        {[...Array(40)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.sin(i * 1.5) * Math.cos(i * 2) * 1,
              Math.sin(i * 1.5) * Math.sin(i * 2) * 1,
              Math.cos(i * 1.5) * 1
            ]}
          >
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshStandardMaterial color="#2E86C1" />
          </mesh>
        ))}
      </mesh>

      {/* Internal Nucleocapsid */}
      <mesh>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color="#1B4F72" flatShading />
      </mesh>

      {/* Glowing RNA core */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#3498DB" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
