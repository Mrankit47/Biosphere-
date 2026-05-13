"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function MarburgMdl({ detail = false }: { detail?: boolean }) {
  const meshRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.1;
  });

  // Create a filamentous path (Shepherd's crook)
  const points = [];
  for (let i = 0; i <= 50; i++) {
    const angle = (i / 50) * Math.PI;
    const x = i < 40 ? 0 : Math.sin((i - 40) * 0.5) * 0.5;
    const y = (i / 50) * 4 - 2;
    const z = i < 40 ? 0 : Math.cos((i - 40) * 0.5) * 0.5 - 0.5;
    points.push(new THREE.Vector3(x, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(points);

  return (
    <group ref={meshRef} scale={detail ? 1.5 : 1}>
      {/* Filamentous Envelope */}
      <mesh>
        <tubeGeometry args={[curve, 64, 0.15, 8, false]} />
        <meshStandardMaterial color="#17202A" roughness={0.3} metalness={0.8} />
      </mesh>
      
      {/* Glycoprotein Spikes along the filament */}
      {[...Array(40)].map((_, i) => {
        const p = curve.getPoint(i / 40);
        return (
          <mesh key={i} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#E74C3C" />
          </mesh>
        );
      })}

      {/* Internal Nucleoprotein core glow */}
      <mesh>
        <tubeGeometry args={[curve, 64, 0.08, 8, false]} />
        <meshBasicMaterial color="#C0392B" transparent opacity={0.4} />
      </mesh>

      {/* Surface highlights */}
      <points>
        <tubeGeometry args={[curve, 64, 0.16, 8, false]} />
        <pointsMaterial color="#E74C3C" size={0.02} transparent opacity={0.3} />
      </points>
    </group>
  );
}
