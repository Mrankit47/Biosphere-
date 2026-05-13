"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function JapaneseEncephalitisMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.3;
  });

  return (
    <group scale={detail ? 2.5 : 1.5}>
      {/* Smooth Envelope */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#8E44AD" roughness={0.4} metalness={0.1} />
        
        {/* Surface grid (E-proteins) */}
        <mesh>
          <sphereGeometry args={[1.01, 32, 32]} />
          <meshStandardMaterial color="#D2B4DE" wireframe transparent opacity={0.2} />
        </mesh>
      </mesh>

      {/* Internal Core */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#4A235A" transparent opacity={0.6} />
      </mesh>

      {/* RNA Core glow */}
      <mesh>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial color="#AF7AC5" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
