"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SpirogyraMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const spiralRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (spiralRef.current) {
      spiralRef.current.rotation.y = t * 0.5;
    }
    groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.1;
  });

  // Create a spiral path for the chloroplast
  const points = [];
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 8;
    const y = (i / 100) * 4 - 2;
    points.push(new THREE.Vector3(Math.cos(angle) * 0.3, y, Math.sin(angle) * 0.3));
  }
  const curve = new THREE.CatmullRomCurve3(points);

  return (
    <group ref={groupRef} scale={detail ? 1.5 : 1}>
      {/* Transparent Cell Wall (The Filament) */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 4, 16]} />
        <meshStandardMaterial color="#A9DFBF" transparent opacity={0.3} roughness={0} />
      </mesh>
      
      {/* Cell Septa (Dividers) */}
      {[-1, 0, 1].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.49, 0.49, 0.05, 16]} />
          <meshStandardMaterial color="#229954" transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Spiral Chloroplast */}
      <mesh ref={spiralRef}>
        <tubeGeometry args={[curve, 100, 0.08, 8, false]} />
        <meshStandardMaterial color="#39FF14" emissive="#39FF14" emissiveIntensity={0.5} />
      </mesh>

      {/* Nuclei (suspended in center) */}
      {[-1.5, -0.5, 0.5, 1.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#6C3483" />
        </mesh>
      ))}

      {/* Pyrenoids (dots on spiral) */}
      <points>
        <tubeGeometry args={[curve, 100, 0.09, 8, false]} />
        <pointsMaterial color="#1D8348" size={0.05} />
      </points>
    </group>
  );
}
