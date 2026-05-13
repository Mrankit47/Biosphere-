"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function AdenovirusMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.3;
    groupRef.current.rotation.x = t * 0.2;
  });

  // Icosahedron vertices for spike placement
  const vertices = [
    [0, 1.176, 1.902], [0, 1.176, -1.902], [0, -1.176, 1.902], [0, -1.176, -1.902],
    [1.902, 0, 1.176], [1.902, 0, -1.176], [-1.902, 0, 1.176], [-1.902, 0, -1.176],
    [1.176, 1.902, 0], [1.176, -1.902, 0], [-1.176, 1.902, 0], [-1.176, -1.902, 0]
  ].map(v => v.map(c => c * 0.5));

  return (
    <group ref={groupRef} scale={detail ? 1.5 : 1}>
      {/* Capsid */}
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#5DADE2" roughness={0.3} metalness={0.2} flatShading />
      </mesh>
      
      {/* Spikes at every vertex */}
      {vertices.map((pos, i) => (
        <group key={i} position={pos as [number, number, number]} rotation={[
          Math.atan2(pos[1], pos[2]),
          Math.atan2(pos[0], pos[1]),
          0
        ]}>
          {/* Fiber */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
            <meshStandardMaterial color="#1ABC9C" />
          </mesh>
          {/* Knob at the end */}
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#3498DB" />
          </mesh>
        </group>
      ))}

      {/* Internal DNA core glow */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#3498DB" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
