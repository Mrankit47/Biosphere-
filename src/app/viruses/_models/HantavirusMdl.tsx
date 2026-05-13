"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function HantavirusMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.z = t * 0.1;
  });

  return (
    <group ref={meshRef} scale={detail ? 2.5 : 1.5}>
      {/* Enveloped Body */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#212F3D" roughness={0.4} />
      </mesh>
      
      {/* Grid-like spikes (Square/Ordered arrangement) */}
      {[...Array(64)].map((_, i) => (
        <group key={i} rotation={[Math.floor(i/8) * (Math.PI/4), (i%8) * (Math.PI/4), 0]}>
          <mesh position={[0, 1.02, 0]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshStandardMaterial color="#5D6D7E" />
          </mesh>
        </group>
      ))}

      {/* Internal Circular RNA Segments (3 segments) */}
      <group>
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[0.5, 0.05, 8, 32]} />
          <meshBasicMaterial color="#E74C3C" transparent opacity={0.4} />
        </mesh>
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.3, 0.05, 8, 32]} />
          <meshBasicMaterial color="#E74C3C" transparent opacity={0.4} />
        </mesh>
        <mesh rotation={[0, Math.PI/2, 0]}>
          <torusGeometry args={[0.15, 0.05, 8, 32]} />
          <meshBasicMaterial color="#E74C3C" transparent opacity={0.4} />
        </mesh>
      </group>
    </group>
  );
}
