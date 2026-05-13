"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function TardigradeMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      // Slow rhythmic movement
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.1;
      groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.05;
      
      // Leg movement
      groupRef.current.children.forEach((child, i) => {
        if (child.name.includes("leg")) {
          child.rotation.x = Math.sin(t * 2 + i) * 0.3;
        }
      });
    }
  });

  return (
    <group ref={groupRef} scale={detail ? 1.5 : 1}>
      {/* Segmented Body */}
      {[0, 0.6, 1.2, 1.8].map((z, i) => (
        <mesh key={i} position={[0, 0, z - 0.9]}>
          <capsuleGeometry args={[0.5, 0.4, 8, 16]} />
          <meshStandardMaterial color="#D2B48C" roughness={0.7} metalness={0.1} />
        </mesh>
      ))}

      {/* Head */}
      <mesh position={[0, 0, -1.2]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#D2B48C" />
      </mesh>
      {/* Mouth (Stylet area) */}
      <mesh position={[0, 0, -1.5]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.1, 0.05, 8, 16]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* 8 Legs */}
      {[
        [-0.4, -0.4, -0.6], [0.4, -0.4, -0.6],
        [-0.5, -0.4, 0], [0.5, -0.4, 0],
        [-0.5, -0.4, 0.6], [0.5, -0.4, 0.6],
        [-0.4, -0.4, 1.2], [0.4, -0.4, 1.2]
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]} name={`leg-${i}`}>
          <mesh position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.15, 0.3, 4, 8]} />
            <meshStandardMaterial color="#DEB887" />
          </mesh>
          {/* Claws */}
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[0.05, 0.1, 0.2]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </group>
      ))}

      {/* Subtle organic texture/spots */}
      <points>
        <sphereGeometry args={[0.6, 16, 16]} />
        <pointsMaterial color="#8B4513" size={0.02} transparent opacity={0.3} />
      </points>
    </group>
  );
}
