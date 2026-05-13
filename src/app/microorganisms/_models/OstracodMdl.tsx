"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function OstracodMdl({ detail = false }: { detail?: boolean }) {
  const shellRef = useRef<THREE.Group>(null!);
  const legsRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Subtle shell opening/closing
    const open = Math.abs(Math.sin(t * 0.5)) * 0.1;
    shellRef.current.children[0].rotation.z = -open;
    shellRef.current.children[1].rotation.z = open;
    
    // Twitching appendages
    legsRef.current.children.forEach((leg, i) => {
      leg.rotation.x = Math.sin(t * 10 + i) * 0.3;
    });
  });

  return (
    <group scale={detail ? 2 : 1.2}>
      {/* Bivalve Shell (Carapace) */}
      <group ref={shellRef}>
        {/* Left Valve */}
        <mesh position={[-0.05, 0, 0]}>
          <sphereGeometry args={[0.8, 32, 32, 0, Math.PI, 0, Math.PI]} scale={[0.5, 1, 1]} />
          <meshStandardMaterial color="#D4AC0D" roughness={0.8} />
        </mesh>
        {/* Right Valve */}
        <mesh position={[0.05, 0, 0]}>
          <sphereGeometry args={[0.8, 32, 32, Math.PI, Math.PI, 0, Math.PI]} scale={[0.5, 1, 1]} />
          <meshStandardMaterial color="#D4AC0D" roughness={0.8} />
        </mesh>
      </group>

      {/* Internal Body & Legs (Appendages) */}
      <group ref={legsRef} position={[0, -0.4, 0]}>
        {[...Array(4)].map((_, i) => (
          <mesh key={i} position={[0, 0, (i - 1.5) * 0.2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
            <meshStandardMaterial color="#F7DC6F" />
          </mesh>
        ))}
      </group>

      {/* Sensory Hairs (Fuzz) */}
      <points>
        <sphereGeometry args={[0.85, 16, 16]} scale={[0.6, 1, 1]} />
        <pointsMaterial color="#B7950B" size={0.02} transparent opacity={0.4} />
      </points>

      {/* Naupliar Eye (Internal) */}
      <mesh position={[0, 0.4, 0.4]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#C0392B" />
      </mesh>
    </group>
  );
}
