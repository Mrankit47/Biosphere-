"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WestNileMdl({ detail }: { detail?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.15;
    }
  });

  return (
    <group ref={group}>
      {/* Smooth Envelope */}
      <mesh>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshStandardMaterial color="#82E0AA" roughness={0.4} metalness={0.1} transparent opacity={0.7} />
      </mesh>
      
      {/* Inner Capsid */}
      <mesh>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial color="#229954" emissive="#229954" emissiveIntensity={0.4} />
      </mesh>

      {/* Subtle E-protein texture (random small bumps) */}
      {Array.from({ length: 60 }).map((_, i) => (
        <mesh key={i} position={[
          Math.sin(i * 2) * Math.cos(i) * 1.3,
          Math.sin(i * 2) * Math.sin(i) * 1.3,
          Math.cos(i * 2) * 1.3
        ]}>
          <boxGeometry args={[0.05, 0.05, 0.1]} />
          <meshStandardMaterial color="#27AE60" />
        </mesh>
      ))}
    </group>
  );
}
