"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DinoflagellateMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Group>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.8; // Spinning motion typical of dinoflagellates
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    
    // Bioluminescent pulsing
    const material = glowRef.current.material as THREE.Material;
    material.opacity = 0.2 + Math.sin(t * 4) * 0.1;
  });

  return (
    <group ref={meshRef} scale={detail ? 2 : 1.2}>
      {/* Armored Body (Theca) */}
      <mesh>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#3498DB" flatShading roughness={0.3} />
      </mesh>
      
      {/* Cingulum (Transverse Groove) */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[1.05, 0.05, 16, 100]} />
        <meshStandardMaterial color="#1ABC9C" />
      </mesh>

      {/* Transverse Flagellum (in the groove) */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[1.06, 0.01, 8, 50, Math.PI * 1.5]} />
        <meshBasicMaterial color="#F7DC6F" />
      </mesh>

      {/* Longitudinal Flagellum (trailing) */}
      <mesh position={[0, -1.2, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1.5, 8]} />
        <meshBasicMaterial color="#F1C40F" />
      </mesh>

      {/* Bioluminescent Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#39FF14" transparent opacity={0.2} />
      </mesh>

      {/* Internal organelles */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#8E44AD" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
