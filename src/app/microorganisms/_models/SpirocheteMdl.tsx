"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SpirocheteMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 10; // Corkscrew rotation
    meshRef.current.position.x = Math.sin(t) * 0.5; // Moving forward/sideways
  });

  const points = [];
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 12;
    const y = (i / 100) * 4 - 2;
    points.push(new THREE.Vector3(Math.cos(angle) * 0.2, y, Math.sin(angle) * 0.2));
  }
  const curve = new THREE.CatmullRomCurve3(points);

  return (
    <group scale={detail ? 1.5 : 1}>
      {/* Helical Body */}
      <mesh ref={meshRef}>
        <tubeGeometry args={[curve, 100, 0.08, 8, false]} />
        <meshStandardMaterial color="#F1948A" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Internal Endoflagella (Filaments) */}
      <mesh rotation={[0, 0.5, 0]}>
        <tubeGeometry args={[curve, 100, 0.02, 8, false]} />
        <meshBasicMaterial color="#E74C3C" transparent opacity={0.5} />
      </mesh>

      {/* Surface glow */}
      <points>
        <tubeGeometry args={[curve, 100, 0.09, 8, false]} />
        <pointsMaterial color="#C0392B" size={0.03} transparent opacity={0.4} />
      </points>
    </group>
  );
}
