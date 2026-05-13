"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function HPVMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.25;
    meshRef.current.rotation.z = t * 0.15;
  });

  return (
    <group ref={meshRef} scale={detail ? 2.5 : 1.5}>
      {/* Main Capsid Shell */}
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#D2B4DE" roughness={0.6} flatShading />
      </mesh>
      
      {/* Capsomers (Bumps) - HPV has 72 capsomers */}
      {[...Array(40)].map((_, i) => (
        <group key={i} rotation={[i * Math.PI/10, i * Math.PI/5, 0]}>
          <mesh position={[0, 0.95, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color="#7D3C98" />
          </mesh>
        </group>
      ))}

      {/* Internal Circular DNA (Ring) */}
      <mesh rotation={[Math.PI/4, 0, 0]}>
        <torusGeometry args={[0.5, 0.05, 16, 100]} />
        <meshStandardMaterial color="#5DADE2" emissive="#5DADE2" emissiveIntensity={0.5} />
      </mesh>
      
      {/* L2 proteins (subtle internal bits) */}
      {[...Array(12)].map((_, i) => (
        <mesh key={i} position={[
          Math.sin(i) * 0.3,
          Math.cos(i) * 0.3,
          Math.sin(i * 2) * 0.3
        ]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#7D3C98" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}
