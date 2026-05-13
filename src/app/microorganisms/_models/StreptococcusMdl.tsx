"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function StreptococcusMdl({ detail }: { detail?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.1;
      // Wavy motion for the chain
      group.current.children.forEach((child, i) => {
        child.position.x = Math.sin(t + i * 0.8) * 0.2;
      });
    }
  });

  return (
    <group ref={group}>
      {/* Chain of round cocci */}
      {Array.from({ length: 8 }).map((_, i) => (
        <group key={i} position={[0, (i - 3.5) * 0.7, 0]}>
          <mesh>
            <sphereGeometry args={[0.35, 16, 16]} />
            <meshStandardMaterial color="#D7BDE2" roughness={0.5} />
          </mesh>
          {/* M Protein spikes */}
          {Array.from({ length: 12 }).map((__, j) => (
            <mesh key={j} position={[
              Math.sin(j) * 0.35,
              Math.cos(j) * 0.35,
              Math.sin(j * 2) * 0.1
            ]}>
              <boxGeometry args={[0.02, 0.02, 0.15]} />
              <meshStandardMaterial color="#8E44AD" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
