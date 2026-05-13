"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DaphniaMdl({ detail = false }: { detail?: boolean }) {
  const heartRef = useRef<THREE.Mesh>(null!);
  const antennaeRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Rapid heart beat
    heartRef.current.scale.setScalar(1 + Math.sin(t * 15) * 0.2);
    // Antennae rowing
    antennaeRef.current.rotation.x = Math.sin(t * 3) * 0.5;
  });

  return (
    <group scale={detail ? 1.5 : 1}>
      {/* Transparent Carapace (Shell) */}
      <mesh rotation={[0, 0, -Math.PI/4]}>
        <sphereGeometry args={[1, 32, 32, 0, Math.PI * 1.5]} />
        <meshStandardMaterial color="#FDFEFE" transparent opacity={0.3} roughness={0} />
      </mesh>

      {/* Internal Organs (Gut) */}
      <mesh position={[-0.2, -0.2, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.1, 0.1, 1.2, 8]} />
        <meshStandardMaterial color="#D4AC0D" />
      </mesh>

      {/* Pulsing Heart (High up) */}
      <mesh ref={heartRef} position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.5} />
      </mesh>

      {/* Large Compound Eye (Black spot) */}
      <mesh position={[0.6, 0.6, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#17202A" />
      </mesh>

      {/* Large Swimming Antennae (The "Oars") */}
      <group ref={antennaeRef} position={[0.4, 0.4, 0]}>
        {[[-0.2, 0, 0.3], [-0.2, 0, -0.3]].map((pos, i) => (
          <group key={i} position={pos as [number, number, number]} rotation={[0, 0, -0.5]}>
            <mesh rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.02, 0.05, 1.2, 8]} />
              <meshStandardMaterial color="#EBEDEF" />
            </mesh>
            {/* Setae (Hairs on antennae) */}
            {[...Array(5)].map((_, j) => (
              <mesh key={j} position={[j * 0.2 - 0.5, 0.1, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 0.3, 4]} />
                <meshBasicMaterial color="#BDC3C7" />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Abdominal Claws (Tail) */}
      <mesh position={[-0.8, -0.8, 0]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.1, 0.4, 8]} />
        <meshStandardMaterial color="#BDC3C7" />
      </mesh>
    </group>
  );
}
