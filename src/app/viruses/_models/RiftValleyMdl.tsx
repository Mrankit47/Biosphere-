"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RiftValleyMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.2;
  });

  return (
    <group ref={meshRef} scale={detail ? 2.5 : 1.5}>
      {/* Icosahedral Envelope */}
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#922B21" roughness={0.5} flatShading />
      </mesh>
      
      {/* Dense Fringe of Spikes */}
      {[...Array(60)].map((_, i) => (
        <group key={i} rotation={[Math.random() * 6, Math.random() * 6, 0]}>
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#E67E22" />
          </mesh>
        </group>
      ))}

      {/* Internal RNA Segments */}
      <group scale={0.5}>
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#F4D03F" transparent opacity={0.3} />
        </mesh>
      </group>
    </group>
  );
}
