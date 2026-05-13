"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RotiferMdl({ detail = false }: { detail?: boolean }) {
  const coronaRef = useRef<THREE.Group>(null!);
  const mastaxRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    coronaRef.current.rotation.y = t * 5; // Rapid ciliary rotation
    mastaxRef.current.scale.setScalar(1 + Math.sin(t * 10) * 0.1); // Chewing motion
  });

  return (
    <group position={[0, -0.5, 0]} scale={detail ? 1.5 : 1}>
      {/* Body (Lorica/Cuticle) */}
      <mesh>
        <capsuleGeometry args={[0.5, 1, 8, 16]} />
        <meshStandardMaterial color="#FAD7A0" transparent opacity={0.6} />
      </mesh>

      {/* Corona (Wheel Organ) */}
      <group ref={coronaRef} position={[0, 1, 0]}>
        {[0, 1].map((j) => (
          <group key={j} rotation={[0, j * Math.PI, 0]}>
            {[...Array(12)].map((_, i) => (
              <mesh key={i} position={[Math.cos(i * 0.5) * 0.4, 0.2, Math.sin(i * 0.5) * 0.4]}>
                <boxGeometry args={[0.02, 0.2, 0.02]} />
                <meshStandardMaterial color="#FDEBD0" />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Internal Mastax (The "Jaws") */}
      <mesh ref={mastaxRef} position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#E59866" roughness={0} metalness={0.5} />
      </mesh>

      {/* Intestine/Stomach (Internal) */}
      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#DC7633" transparent opacity={0.4} />
      </mesh>

      {/* Telescopic Foot and Toes */}
      <group position={[0, -1, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.1, 0.2, 0.4, 8]} />
          <meshStandardMaterial color="#FAD7A0" />
        </mesh>
        {/* Toes */}
        <mesh position={[-0.1, -0.5, 0]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.05, 0.01, 0.3, 8]} />
          <meshStandardMaterial color="#D35400" />
        </mesh>
        <mesh position={[0.1, -0.5, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.05, 0.01, 0.3, 8]} />
          <meshStandardMaterial color="#D35400" />
        </mesh>
      </group>

      {/* Eyespot */}
      <mesh position={[0, 0.8, 0.4]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#C0392B" />
      </mesh>
    </group>
  );
}
