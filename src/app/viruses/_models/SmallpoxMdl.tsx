"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SmallpoxMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.3;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <group scale={detail ? 1.5 : 1}>
      {/* Brick-shaped Envelope */}
      <mesh ref={meshRef}>
        <boxGeometry args={[1.5, 1, 2]} />
        <meshStandardMaterial 
          color="#BA4A00" 
          roughness={0.8} 
          metalness={0.1} 
        />
        
        {/* Surface texture (Pox pattern) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.52, 1.02, 2.02]} />
          <meshStandardMaterial 
            color="#873600" 
            wireframe 
            transparent 
            opacity={0.2} 
          />
        </mesh>
      </mesh>

      {/* Internal Dumbbell Core (Visible through "cutaway" effect or glow) */}
      <group position={[0, 0, 0]} scale={0.6}>
        <mesh position={[0, 0, -0.6]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#D35400" transparent opacity={0.4} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1.2, 16]} />
          <meshBasicMaterial color="#D35400" transparent opacity={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.6]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshBasicMaterial color="#D35400" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Lateral Bodies (Oval structures on sides) */}
      <mesh position={[0.7, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#873600" />
      </mesh>
      <mesh position={[-0.7, 0, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#873600" />
      </mesh>
    </group>
  );
}
