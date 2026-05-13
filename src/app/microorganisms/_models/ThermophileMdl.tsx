"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ThermophileMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const flagellaRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Intense heat pulsing
    meshRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.05);
    flagellaRef.current.rotation.y = t * 10;
  });

  return (
    <group scale={detail ? 2.5 : 1.5}>
      {/* Irregular Lobed Body */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color="#E67E22" 
          emissive="#C0392B" 
          emissiveIntensity={0.5} 
          roughness={0.8} 
          flatShading 
        />
      </mesh>

      {/* Flagella Bundle (Archaella) */}
      <group ref={flagellaRef} position={[0, -0.8, 0]}>
        {[...Array(8)].map((_, i) => (
          <mesh key={i} rotation={[0, (i * Math.PI * 2) / 8, 0]}>
            <mesh position={[0.2, -0.5, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 1, 8]} rotation={[0.2, 0, 0]} />
              <meshBasicMaterial color="#D35400" transparent opacity={0.6} />
            </mesh>
          </mesh>
        ))}
      </group>

      {/* Heat Distortion/Particles */}
      <points>
        <sphereGeometry args={[1.5, 32, 32]} />
        <pointsMaterial color="#F39C12" size={0.03} transparent opacity={0.2} />
      </points>

      {/* Internal "Boiling" Core */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#FF4500" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
