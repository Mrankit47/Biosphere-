"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SlimeMoldMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.children.forEach((child, i) => {
      if (child.type === "Mesh") {
        const s = 1 + Math.sin(t * 2 + i) * 0.05;
        child.scale.set(s, s, s);
      }
    });
  });

  return (
    <group ref={meshRef} scale={detail ? 2 : 1.2}>
      {/* Central Hub */}
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#F4D03F" emissive="#F4D03F" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Branching Veins */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const length = 1.5 + Math.random() * 0.5;
        return (
          <group key={i} rotation={[0, 0, angle]}>
            <mesh position={[length / 2, 0, 0]} rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.05, 0.1, length, 8]} />
              <meshStandardMaterial color="#D4AC0D" />
            </mesh>
            {/* Smaller sub-branches */}
            <mesh position={[length, 0, 0]} rotation={[0, 0, 0.5 + Math.PI/2]}>
              <cylinderGeometry args={[0.02, 0.05, 0.8, 8]} />
              <meshStandardMaterial color="#B7950B" />
            </mesh>
          </group>
        );
      })}

      {/* Surface Slime (Transparent blobs) */}
      {[...Array(20)].map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 0.2
          ]}
        >
          <sphereGeometry args={[0.05 + Math.random() * 0.1, 8, 8]} />
          <meshStandardMaterial color="#F1C40F" transparent opacity={0.3} />
        </mesh>
      ))}

      {/* Internal cytoplasmic streaming (Points) */}
      <points>
        <sphereGeometry args={[2, 16, 16]} />
        <pointsMaterial color="#F4D03F" size={0.03} transparent opacity={0.5} />
      </points>
    </group>
  );
}
