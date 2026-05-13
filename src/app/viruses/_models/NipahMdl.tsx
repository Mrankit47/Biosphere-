"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function NipahMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.05);
  });

  return (
    <group scale={detail ? 2.5 : 1.5}>
      {/* Pleomorphic Envelope */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#145A32" roughness={0.6} />
        
        {/* Surface Proteins */}
        {[...Array(30)].map((_, i) => (
          <group key={i} rotation={[Math.random() * 6, Math.random() * 6, 0]}>
            <mesh position={[0, 1, 0]}>
              <cylinderGeometry args={[0.03, 0.06, 0.2, 8]} />
              <meshStandardMaterial color="#1ABC9C" />
            </mesh>
          </group>
        ))}
      </mesh>

      {/* Internal Helical RNP */}
      <mesh rotation={[Math.PI/3, 0, 0]}>
        <torusGeometry args={[0.6, 0.05, 16, 50]} />
        <meshStandardMaterial color="#F4D03F" transparent opacity={0.4} />
      </mesh>
      
      {/* Floating bat-associated particles (Symbolic) */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[
          Math.sin(i * 1.2) * 1.8,
          Math.cos(i * 2) * 1.8,
          Math.sin(i * 3) * 1.8
        ]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#1ABC9C" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}
