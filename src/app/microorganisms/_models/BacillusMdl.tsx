"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function BacillusMdl({ detail }: { detail?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.15;
      group.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group ref={group}>
      {/* Rod Body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.4, 2, 8, 16]} />
        <meshStandardMaterial color="#FADBD8" roughness={0.4} />
      </mesh>
      
      {/* Endospore (Inside the rod) */}
      <mesh position={[0.8, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.6} />
      </mesh>

      {/* Flagella bundle */}
      {Array.from({ length: 12 }).map((_, i) => (
        <group key={i} rotation={[0, 0, (i * Math.PI) / 6]} position={[0, 0, 0]}>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.01, 0.005, 1.2]} />
            <meshStandardMaterial color="#F7DC6F" transparent opacity={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
