"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function NorovirusMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.3;
    meshRef.current.rotation.x = t * 0.1;
  });

  return (
    <group ref={meshRef} scale={detail ? 2.5 : 1.5}>
      {/* Capsid Body */}
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#2ECC71" roughness={0.5} flatShading />
      </mesh>
      
      {/* Cup-shaped depressions (represented by inverted spheres or rings) */}
      {[...Array(20)].map((_, i) => (
        <group key={i} rotation={[i * Math.PI/5, i * Math.PI/10, 0]}>
          <mesh position={[0, 0.95, 0]}>
            <torusGeometry args={[0.2, 0.05, 8, 32]} rotation={[Math.PI/2, 0, 0]} />
            <meshStandardMaterial color="#1D8348" />
          </mesh>
        </group>
      ))}

      {/* Internal RNA genome glow */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#27AE60" transparent opacity={0.3} />
      </mesh>
      
      {/* Dense core */}
      <mesh>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshStandardMaterial color="#3498DB" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
