"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CoronavirusMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  /* Spike positions on sphere surface */
  const spikes = useMemo(() => {
    const pts: { pos: [number, number, number]; dir: THREE.Vector3 }[] = [];
    const count = detail ? 60 : 30;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.72;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      const dir = new THREE.Vector3(x, y, z).normalize();
      pts.push({ pos: [x, y, z], dir });
    }
    return pts;
  }, [detail]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.15;
    groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* Inner core */}
      <mesh>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial color="#8B0000" emissive="#E24B4A" emissiveIntensity={0.15} roughness={0.6} />
      </mesh>

      {/* Lipid envelope */}
      <mesh>
        <sphereGeometry args={[0.7, 28, 28]} />
        <meshStandardMaterial color="#E24B4A" transparent opacity={0.3} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Wireframe */}
      <mesh>
        <sphereGeometry args={[0.72, 16, 16]} />
        <meshBasicMaterial color="#E24B4A" wireframe transparent opacity={0.06} />
      </mesh>

      {/* Spike proteins — the "corona" */}
      {spikes.map((spike, i) => {
        const q = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          spike.dir
        );
        const tipPos = spike.dir.clone().multiplyScalar(0.72 + 0.28);
        return (
          <group key={i}>
            {/* Spike stalk */}
            <mesh
              position={spike.dir.clone().multiplyScalar(0.72 + 0.12).toArray() as [number, number, number]}
              quaternion={q}
            >
              <cylinderGeometry args={[0.015, 0.02, 0.25, 6]} />
              <meshStandardMaterial color="#F5B041" emissive="#F5B041" emissiveIntensity={0.3} />
            </mesh>
            {/* Spike tip (club shape) */}
            <mesh position={tipPos.toArray() as [number, number, number]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.5} />
            </mesh>
          </group>
        );
      })}

      {/* RNA genome (interior helix) */}
      {detail && (() => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 60; i++) {
          const t = (i / 60) * Math.PI * 6;
          pts.push(new THREE.Vector3(Math.sin(t) * 0.2, (i / 60 - 0.5) * 0.8, Math.cos(t) * 0.2));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        return (
          <mesh>
            <tubeGeometry args={[curve, 50, 0.012, 6, false]} />
            <meshStandardMaterial color="#3498DB" emissive="#3498DB" emissiveIntensity={0.5} />
          </mesh>
        );
      })()}

      {/* Nucleocapsid proteins */}
      {detail && Array.from({ length: 20 }).map((_, i) => {
        const a = (i / 20) * Math.PI * 2;
        const y = (i / 20 - 0.5) * 0.6;
        return (
          <mesh key={`nc-${i}`} position={[Math.sin(a) * 0.25, y, Math.cos(a) * 0.25]}>
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshStandardMaterial color="#9B59B6" emissive="#9B59B6" emissiveIntensity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}
