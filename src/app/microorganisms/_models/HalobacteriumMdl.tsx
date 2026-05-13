"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function HalobacteriumMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const flagellaRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.5;
    meshRef.current.position.y = Math.sin(t * 1.2) * 0.05;
    
    // Flagella bundle rotation
    flagellaRef.current.rotation.z = t * 10;
  });

  return (
    <group scale={detail ? 2.5 : 1.5}>
      {/* Rod-shaped Body */}
      <mesh ref={meshRef}>
        <capsuleGeometry args={[0.3, 1, 8, 16]} />
        <meshStandardMaterial 
          color="#FF7F50" 
          emissive="#8E44AD" 
          emissiveIntensity={0.2} 
          roughness={0.6} 
        />
      </mesh>

      {/* Internal Gas Vesicles */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0, (i - 2) * 0.2, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#F5B041" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Flagella Bundle (at one end) */}
      <group ref={flagellaRef} position={[0, -0.6, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
            <mesh position={[0.1, -0.4, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.8, 8]} />
              <meshBasicMaterial color="#FF4500" transparent opacity={0.5} />
            </mesh>
          </mesh>
        ))}
      </group>

      {/* Surface Pigments (Glowy spots) */}
      <points>
        <capsuleGeometry args={[0.31, 1, 8, 16]} />
        <pointsMaterial color="#FF4500" size={0.03} />
      </points>
    </group>
  );
}
