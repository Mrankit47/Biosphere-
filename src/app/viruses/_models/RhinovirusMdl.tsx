"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RhinovirusMdl({ detail }: { detail?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.2;
      group.current.scale.setScalar(1 + Math.sin(t * 2) * 0.02);
    }
  });

  return (
    <group ref={group}>
      {/* Small Icosahedral Capsid */}
      <mesh>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color="#D6EAF8" roughness={0.2} metalness={0.1} />
      </mesh>
      
      {/* Wireframe overlay for 'Canyons' look */}
      <mesh>
        <icosahedronGeometry args={[1.21, 2]} />
        <meshBasicMaterial color="#3498DB" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Internal RNA */}
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#9B59B6" emissive="#9B59B6" emissiveIntensity={0.8} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}
