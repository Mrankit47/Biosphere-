"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RubellaMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.3;
  });

  return (
    <group scale={detail ? 2.5 : 1.5}>
      {/* Enveloped Body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#F1948A" roughness={0.4} />
        
        {/* E1 & E2 Spikes */}
        {[...Array(40)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.sin(i * 1.5) * Math.cos(i * 2) * 1,
              Math.sin(i * 1.5) * Math.sin(i * 2) * 1,
              Math.cos(i * 1.5) * 1
            ]}
          >
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#E74C3C" />
          </mesh>
        ))}
      </mesh>

      {/* Internal Nucleocapsid */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#C0392B" transparent opacity={0.5} />
      </mesh>

      {/* RNA Core */}
      <mesh>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial color="#FAD7A0" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
