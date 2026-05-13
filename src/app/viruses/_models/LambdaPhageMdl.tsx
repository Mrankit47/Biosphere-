"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function LambdaPhageMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const tailRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.2;
    
    // Flexible tail waving
    tailRef.current.children.forEach((segment, i) => {
      segment.rotation.z = Math.sin(t * 2 + i * 0.5) * 0.1;
      segment.rotation.x = Math.cos(t * 1.5 + i * 0.5) * 0.1;
    });
  });

  return (
    <group ref={groupRef} scale={detail ? 1.5 : 1}>
      {/* Icosahedral Head */}
      <mesh position={[0, 1.2, 0]}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color="#A9DFBF" roughness={0.3} metalness={0.2} flatShading />
      </mesh>

      {/* Long Non-contractile Tail */}
      <group ref={tailRef} position={[0, 0.6, 0]}>
        {[...Array(10)].map((_, i) => (
          <group key={i} position={[0, -i * 0.2, 0]}>
            <mesh>
              <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
              <meshStandardMaterial color="#27AE60" />
            </mesh>
            {/* Connector rings */}
            <mesh position={[0, -0.1, 0]} rotation={[Math.PI/2, 0, 0]}>
              <torusGeometry args={[0.05, 0.01, 8, 16]} />
              <meshBasicMaterial color="#1D8348" />
            </mesh>
          </group>
        ))}
        
        {/* Tail tip (J protein) */}
        <mesh position={[0, -2.1, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.08, 0.2, 8]} />
          <meshStandardMaterial color="#1D8348" />
        </mesh>
      </group>

      {/* Internal DNA glow */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#39FF14" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
