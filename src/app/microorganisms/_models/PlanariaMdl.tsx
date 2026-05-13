"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function PlanariaMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Gliding wave movement
    meshRef.current.children.forEach((segment, i) => {
      segment.position.y = Math.sin(t * 2 - i * 0.4) * 0.05;
      segment.rotation.z = Math.cos(t * 2 - i * 0.4) * 0.1;
    });
  });

  return (
    <group ref={meshRef} scale={detail ? 2 : 1.2}>
      {/* Arrow-shaped Head */}
      <group position={[0, 1, 0]}>
        <mesh>
          <coneGeometry args={[0.5, 0.6, 3]} rotation={[0, Math.PI, 0]} />
          <meshStandardMaterial color="#8D6E63" />
        </mesh>
        {/* Cross-eyed Eyespots */}
        <mesh position={[-0.1, 0, 0.2]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="white" />
          <mesh position={[0, 0, 0.04]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="black" />
          </mesh>
        </mesh>
        <mesh position={[0.1, 0, 0.2]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="white" />
          <mesh position={[0, 0, 0.04]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="black" />
          </mesh>
        </mesh>
      </group>

      {/* Flattened Body Segments */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[0.8 - Math.abs(y)*0.4, 0.4, 0.1]} />
          <meshStandardMaterial color="#A1887F" />
        </mesh>
      ))}

      {/* Internal Pharynx (Central) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#5D4037" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
