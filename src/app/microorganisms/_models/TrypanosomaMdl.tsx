"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function TrypanosomaMdl({ detail }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const flagRef = useRef<THREE.Group>(null!);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2;
      // Slithering motion
      const pos = meshRef.current.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        const x = pos.getX(i);
        const d = Math.sin(t * 3 + y * 2) * 0.2;
        pos.setX(i, x + d * 0.05);
      }
      pos.needsUpdate = true;
    }
    if (flagRef.current) {
      flagRef.current.rotation.z = Math.sin(t * 10) * 0.5;
    }
  });

  return (
    <group>
      {/* Elongated slithering body */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.15, 0.05, 3, 16, 20]} />
        <meshStandardMaterial color="#E6B0AA" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Undulating membrane (simulated with a thin ribbon) */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0.2, 0, 0]}>
        <planeGeometry args={[3, 0.3, 20, 1]} />
        <meshStandardMaterial color="#CD6155" side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>

      {/* Flagellum */}
      <group ref={flagRef} position={[0, 1.5, 0]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.02, 0.01, 0.8]} />
          <meshStandardMaterial color="#F7DC6F" />
        </mesh>
      </group>

      {/* Kinetoplast */}
      <mesh position={[0, -1.2, 0.1]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#641E16" />
      </mesh>
    </group>
  );
}
