"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function MethanogenMdl({ detail }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.1;
      // Pulsing irregular shape
      const pos = meshRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        const d = Math.sin(t * 2 + x * 2 + y * 2) * 0.05;
        pos.setXYZ(i, x * (1 + d), y * (1 + d), z * (1 + d));
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Irregular coccus/methanogen shape */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 3]} />
        <meshStandardMaterial color="#EB984E" roughness={0.7} metalness={0.2} emissive="#A04000" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Surface enzymes / S-layer look */}
      <mesh>
        <icosahedronGeometry args={[1.22, 1]} />
        <meshBasicMaterial color="#DC7633" wireframe transparent opacity={0.2} />
      </mesh>

      {/* Flagellar bundle at one end */}
      <group position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[Math.sin(i) * 0.1, 0.4, Math.cos(i) * 0.1]}>
            <cylinderGeometry args={[0.02, 0.01, 1.5]} />
            <meshStandardMaterial color="#FAD7A0" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
