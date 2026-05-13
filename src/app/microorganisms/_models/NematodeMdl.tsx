"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function NematodeMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.children.forEach((child, i) => {
      // Sinusoidal movement
      child.position.x = Math.sin(t * 3 + i * 0.4) * 0.3;
      child.rotation.z = Math.cos(t * 3 + i * 0.4) * 0.2;
    });
  });

  return (
    <group ref={meshRef} scale={detail ? 1.5 : 1}>
      {/* Segmented body for animation */}
      {[-2, -1.6, -1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2, 1.6, 2].map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          {/* Transparent Cuticle */}
          <mesh>
            <sphereGeometry args={[0.2 - Math.abs(y/12), 16, 16]} />
            <meshStandardMaterial color="#FDFEFE" transparent opacity={0.3} roughness={0} />
          </mesh>
          
          {/* Internal Organs (Glowy core) */}
          <mesh>
            <sphereGeometry args={[0.1 - Math.abs(y/20), 8, 8]} />
            <meshStandardMaterial color="#BDC3C7" transparent opacity={0.5} />
          </mesh>

          {/* Pharynx (Near the head at y=2) */}
          {y > 1.5 && (
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.05, 0.08, 0.3, 8]} />
              <meshStandardMaterial color="#BDC3C7" />
            </mesh>
          )}
        </group>
      ))}

      <points>
        <cylinderGeometry args={[0.2, 0.2, 4, 16]} />
        <pointsMaterial color="#ECF0F1" size={0.01} transparent opacity={0.3} />
      </points>
    </group>
  );
}
