"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function HerpesMdl({ detail = false }: { detail?: boolean }) {
  const capsidRef = useRef<THREE.Mesh>(null!);
  const envelopeRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    capsidRef.current.rotation.y = t * 0.2;
    envelopeRef.current.rotation.y = t * 0.1;
    envelopeRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.05);
  });

  return (
    <group scale={detail ? 1.5 : 1}>
      {/* Central Icosahedral Capsid */}
      <mesh ref={capsidRef}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color="#E74C3C" roughness={0.3} metalness={0.2} flatShading />
      </mesh>

      {/* Tegument (Cloud of proteins around capsid) */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#C0392B" transparent opacity={0.3} />
      </mesh>

      {/* Outer Envelope */}
      <mesh ref={envelopeRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#F5B041" transparent opacity={0.4} roughness={0.1} />
        
        {/* Glycoprotein Spikes */}
        {[...Array(30)].map((_, i) => (
          <mesh 
            key={i} 
            position={[
              Math.sin(i * 2) * Math.cos(i * 3) * 1.2,
              Math.sin(i * 2) * Math.sin(i * 3) * 1.2,
              Math.cos(i * 2) * 1.2
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#922B21" />
          </mesh>
        ))}
      </mesh>

      {/* Latency glow (Spiritual/Symbolic) */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#E74C3C" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
