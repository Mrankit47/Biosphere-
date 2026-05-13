"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function MERSMdl({ detail }: { detail?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.1;
      group.current.position.y = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group ref={group}>
      {/* Body */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#F5CBA7" roughness={0.6} />
      </mesh>
      
      {/* Club-shaped spikes */}
      {Array.from({ length: 30 }).map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 30);
        const theta = Math.sqrt(30 * Math.PI) * phi;
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.sin(phi) * Math.sin(theta);
        const z = Math.cos(phi);
        
        return (
          <group key={i} position={[x * 1.2, y * 1.2, z * 1.2]} rotation={[phi, theta, 0]}>
            {/* Spike stalk */}
            <mesh position={[0, 0, 0.1]}>
              <cylinderGeometry args={[0.03, 0.03, 0.3]} />
              <meshStandardMaterial color="#E67E22" />
            </mesh>
            {/* Spike head (club) */}
            <mesh position={[0, 0, 0.25]}>
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial color="#BA4A00" emissive="#BA4A00" emissiveIntensity={0.3} />
            </mesh>
          </group>
        );
      })}

      {/* Internal Core */}
      <mesh>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color="#9B59B6" transparent opacity={0.3} wireframe />
      </mesh>
    </group>
  );
}
