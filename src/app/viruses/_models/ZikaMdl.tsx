"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ZikaMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.4;
    meshRef.current.rotation.z = t * 0.2;
  });

  return (
    <group scale={detail ? 2.5 : 1.5}>
      {/* Smooth Envelope */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial 
          color="#F4D03F" 
          roughness={0.4} 
          metalness={0.1} 
        />
        
        {/* Subtle Surface Patterns (E-proteins) */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.01, 32, 32]} />
          <meshStandardMaterial 
            color="#D4AC0D" 
            wireframe 
            transparent 
            opacity={0.2} 
          />
        </mesh>
      </mesh>

      {/* Internal RNA Core */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#E74C3C" transparent opacity={0.3} />
      </mesh>
      
      {/* Floating particles (maturation process) */}
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[
          Math.sin(i * 1.5) * 1.2,
          Math.cos(i * 2) * 1.2,
          Math.sin(i * 3) * 1.2
        ]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#F1C40F" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}
