"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function PenicilliumMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.1;
    groupRef.current.children.forEach((child, i) => {
      if (child.name === "branch") {
        child.rotation.z = Math.sin(t * 0.5 + i) * 0.05;
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]} scale={detail ? 1.5 : 1}>
      {/* Main Stalk (Conidiophore) */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 1.6, 8]} />
        <meshStandardMaterial color="#27AE60" />
      </mesh>

      {/* Primary Branches (Metulae) */}
      {[[-0.2, 1.6, 0], [0, 1.7, 0], [0.2, 1.6, 0]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]} name="branch" rotation={[0, 0, (i - 1) * 0.3]}>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 0.4, 8]} />
            <meshStandardMaterial color="#52BE80" />
          </mesh>
          
          {/* Phialides (Bottle-shaped) */}
          {[-0.1, 0, 0.1].map((rx, j) => (
            <group key={j} position={[rx, 0.4, 0]} rotation={[0, 0, rx * 2]}>
              <mesh>
                <capsuleGeometry args={[0.03, 0.15, 4, 8]} />
                <meshStandardMaterial color="#A9DFBF" />
              </mesh>
              
              {/* Chains of Conidia (Spores) */}
              {[0.2, 0.35, 0.5, 0.65].map((y, k) => (
                <mesh key={k} position={[0, y, 0]}>
                  <sphereGeometry args={[0.06, 8, 8]} />
                  <meshStandardMaterial color="#1D8348" />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      ))}

      {/* Base Mycelium (Thread-like) */}
      {[...Array(12)].map((_, i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 12, 0]} position={[0, 0, 0]}>
          <mesh rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.01, 0.01, 2, 8]} />
            <meshBasicMaterial color="#D1F2EB" transparent opacity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
