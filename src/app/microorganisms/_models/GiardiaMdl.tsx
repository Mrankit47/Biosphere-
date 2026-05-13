"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function GiardiaMdl({ detail }: { detail?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.3) * 0.2;
      group.current.position.y = Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <group ref={group}>
      {/* Heart-shaped body (using a scaled sphere) */}
      <mesh scale={[1.2, 1.5, 0.4]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#F7DC6F" roughness={0.4} />
      </mesh>
      
      {/* Ventral Suction Disc */}
      <mesh position={[0, 0.2, 0.41]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.5, 32]} />
        <meshStandardMaterial color="#B7950B" side={THREE.DoubleSide} />
      </mesh>

      {/* Two Nuclei (The 'Eyes') */}
      <mesh position={[0.25, 0.5, 0.3]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#6C3483" emissive="#6C3483" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.25, 0.5, 0.3]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#6C3483" emissive="#6C3483" emissiveIntensity={0.5} />
      </mesh>

      {/* Flagella (8 total, 4 pairs) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
          <mesh position={[0.8, -0.5, 0]}>
            <cylinderGeometry args={[0.01, 0.005, 1.5]} />
            <meshStandardMaterial color="#D4AC0D" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
