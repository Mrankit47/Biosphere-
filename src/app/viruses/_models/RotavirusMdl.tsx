"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RotavirusMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.z = t * 0.1;
  });

  return (
    <group ref={meshRef} scale={detail ? 1.5 : 1}>
      {/* Outer Layer (VP7) */}
      <mesh>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial color="#5D6D7E" transparent opacity={0.6} roughness={0.4} />
      </mesh>
      
      {/* Middle Layer (VP6) */}
      <mesh>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial color="#85929E" wireframe />
      </mesh>

      {/* Inner Core (VP2) */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color="#2E4053" />
      </mesh>

      {/* VP4 Spikes (The "Wheel Spokes") */}
      {[...Array(12)].map((_, i) => (
        <group key={i} rotation={[i * Math.PI/3, i * Math.PI/6, 0]}>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.05, 0.1, 0.4, 8]} />
            <meshStandardMaterial color="#34495E" />
          </mesh>
          <mesh position={[0, 1.3, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#34495E" />
          </mesh>
        </group>
      ))}

      {/* Internal RNA Segments (Glow) */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#9B59B6" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
