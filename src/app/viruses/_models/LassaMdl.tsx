"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function LassaMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const sandRef = useRef<THREE.Points>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.2;
    sandRef.current.rotation.y = -t * 0.4;
    meshRef.current.scale.set(
      1 + Math.sin(t * 0.5) * 0.03,
      1 + Math.cos(t * 0.7) * 0.03,
      1 + Math.sin(t * 1.1) * 0.03
    );
  });

  return (
    <group scale={detail ? 2.5 : 1.5}>
      {/* Pleomorphic Envelope */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#566573" transparent opacity={0.7} roughness={0.8} />
        
        {/* Club-shaped Spikes */}
        {[...Array(24)].map((_, i) => (
          <group key={i} rotation={[Math.random() * 6, Math.random() * 6, 0]}>
            <mesh position={[0, 1, 0]}>
              <cylinderGeometry args={[0.06, 0.02, 0.2, 8]} />
              <meshStandardMaterial color="#D5DBDB" />
            </mesh>
          </group>
        ))}
      </mesh>

      {/* "Sandy" Internal Ribosomes (The distinctive feature) */}
      <points ref={sandRef}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <pointsMaterial color="#BDC3C7" size={0.04} transparent opacity={0.6} />
      </points>

      {/* Internal RNA segments (Circular L and S) */}
      <group rotation={[Math.PI/4, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.4, 0.03, 8, 32]} />
          <meshBasicMaterial color="#9B59B6" transparent opacity={0.5} />
        </mesh>
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.2, 0.03, 8, 32]} />
          <meshBasicMaterial color="#9B59B6" transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  );
}
