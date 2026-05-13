"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function VaricellaMdl({ detail }: { detail?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.1;
      group.current.rotation.z = Math.sin(t * 0.2) * 0.1;
    }
  });

  return (
    <group ref={group}>
      {/* Outer Envelope */}
      <mesh>
        <icosahedronGeometry args={[1.5, 4]} />
        <meshStandardMaterial color="#F1948A" transparent opacity={0.4} roughness={0.6} />
      </mesh>
      
      {/* Tegument Layer */}
      <mesh>
        <icosahedronGeometry args={[1.2, 3]} />
        <meshStandardMaterial color="#C0392B" transparent opacity={0.6} wireframe />
      </mesh>

      {/* Capsid */}
      <mesh>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshStandardMaterial color="#8E44AD" emissive="#8E44AD" emissiveIntensity={0.5} />
      </mesh>

      {/* Surface Spikes */}
      {Array.from({ length: 40 }).map((_, i) => (
        <mesh key={i} position={[
          Math.sin(i * 1.5) * Math.cos(i) * 1.5,
          Math.sin(i * 1.5) * Math.sin(i) * 1.5,
          Math.cos(i * 1.5) * 1.5
        ]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#E74C3C" />
        </mesh>
      ))}
    </group>
  );
}
