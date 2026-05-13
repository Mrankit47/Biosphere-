"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RadiolariaMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.15;
    meshRef.current.rotation.x = t * 0.1;
  });

  return (
    <group ref={meshRef} scale={detail ? 1.5 : 1}>
      {/* Central Capsule */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#5DADE2" transparent opacity={0.6} />
      </mesh>

      {/* Siliceous Skeleton (Outer frame) */}
      <mesh>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial color="#FFFFFF" wireframe roughness={0} metalness={0.5} />
      </mesh>
      
      {/* Radial Spines */}
      {[...Array(20)].map((_, i) => (
        <group key={i} rotation={[i * Math.PI/5, i * Math.PI/10, 0]}>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.01, 0.03, 2, 8]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0} metalness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Inner glowing core */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#3498DB" />
      </mesh>

      {/* Axopodia (Needle projections) */}
      <points>
        <sphereGeometry args={[1.5, 32, 32]} />
        <pointsMaterial color="#AED6F1" size={0.02} transparent opacity={0.4} />
      </points>
    </group>
  );
}
