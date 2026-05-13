"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function HCVMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Group>(null!);
  const lipidRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.3;
    lipidRef.current.rotation.z = -t * 0.2;
    lipidRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.03);
  });

  return (
    <group scale={detail ? 2.5 : 1.5}>
      {/* Outer Lipoprotein Association (Fatty layer) */}
      <mesh ref={lipidRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#FAD7A0" transparent opacity={0.3} roughness={0.1} />
      </mesh>

      <group ref={meshRef}>
        {/* Enveloped Body */}
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#85C1E9" roughness={0.4} />
        </mesh>
        
        {/* E1 & E2 Glycoprotein Spikes (Buried/Subtle) */}
        {[...Array(50)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.sin(i * 1.5) * Math.cos(i * 2) * 1,
              Math.sin(i * 1.5) * Math.sin(i * 2) * 1,
              Math.cos(i * 1.5) * 1
            ]}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#2E86C1" />
          </mesh>
        ))}
      </group>

      {/* Internal Core (Capsid) */}
      <mesh>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color="#1B4F72" flatShading />
      </mesh>

      {/* RNA Core */}
      <mesh>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshBasicMaterial color="#9B59B6" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
