"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function HydraMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const tentaclesRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Body swaying
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
    
    // Tentacle movement (grasping)
    tentaclesRef.current.children.forEach((tentacle, i) => {
      const angle = (i / 6) * Math.PI * 2;
      tentacle.rotation.z = Math.sin(t * 1.5 + i) * 0.5;
    });
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]} scale={detail ? 1.5 : 1}>
      {/* Tubular Body (Column) */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 1.6, 16]} />
        <meshStandardMaterial color="#A9DFBF" transparent opacity={0.8} />
      </mesh>

      {/* Tentacles (6 tentacles) */}
      <group ref={tentaclesRef} position={[0, 1.6, 0]}>
        {[...Array(6)].map((_, i) => (
          <group key={i} rotation={[0, (i * Math.PI * 2) / 6, 0]}>
            <mesh position={[0, 0.4, 0]} rotation={[0.3, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.05, 1, 8]} />
              <meshStandardMaterial color="#52BE80" />
            </mesh>
            {/* Stingers (Nematocysts) - represented as particles */}
            <points position={[0, 0.8, 0]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <pointsMaterial color="#16A085" size={0.05} />
            </points>
          </group>
        ))}
      </group>

      {/* Basal Disc (Attachment) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial color="#1E8449" />
      </mesh>

      {/* Internal Gastrovascular Cavity (Glow) */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.4, 8]} />
        <meshBasicMaterial color="#39FF14" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
