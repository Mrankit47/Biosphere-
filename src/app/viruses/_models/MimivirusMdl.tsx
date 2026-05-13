"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function MimivirusMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const stargateRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.15;
    
    // Stargate glowing pulse
    const material = stargateRef.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 0.5 + Math.sin(t * 2) * 0.5;
  });

  return (
    <group ref={groupRef} scale={detail ? 1.5 : 1}>
      {/* Massive Icosahedral Capsid */}
      <mesh>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color="#5D4037" roughness={0.9} flatShading />
      </mesh>
      
      {/* Dense Protein Fibrils (Hairs) */}
      {[...Array(100)].map((_, i) => (
        <group key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
          <mesh position={[0, 1.3, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.4, 4]} />
            <meshBasicMaterial color="#8D6E63" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {/* The Stargate (Star-shaped seal) */}
      <mesh ref={stargateRef} position={[0, 1.25, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[0, 0.4, 5]} />
        <meshStandardMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={1} />
      </mesh>

      {/* Internal Large DNA core */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#3E2723" transparent opacity={0.4} />
      </mesh>
      
      {/* Sputnik virophage (Parasitic virus floating nearby) */}
      <mesh position={[1.8, 1, 0]} scale={0.15}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#9B59B6" />
      </mesh>
    </group>
  );
}
