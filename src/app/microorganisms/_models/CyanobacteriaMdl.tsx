"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CyanobacteriaMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.05;
  });

  return (
    <group ref={groupRef} scale={detail ? 1.5 : 1}>
      {/* Filament of cells */}
      {[-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2].map((x, i) => {
        const isHeterocyst = i === 4; // Central cell is heterocyst
        return (
          <mesh key={i} position={[x, Math.sin(x * 2) * 0.2, 0]}>
            <sphereGeometry args={[isHeterocyst ? 0.3 : 0.22, 16, 16]} />
            <meshStandardMaterial 
              color={isHeterocyst ? "#F1C40F" : "#1ABC9C"} 
              emissive={isHeterocyst ? "#F1C40F" : "#16A085"}
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}

      {/* Connecting sheath (Transparent tube) */}
      <mesh rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.1, 0.1, 4.2, 8]} />
        <meshStandardMaterial color="#16A085" transparent opacity={0.2} />
      </mesh>

      {/* Internal Thylakoids (Glowy bits inside cells) */}
      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[(i - 5) * 0.45, 0, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#39FF14" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}
