"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function HIVMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  const gpSpikes = useMemo(() => {
    const pts: { pos: THREE.Vector3; dir: THREE.Vector3 }[] = [];
    const count = detail ? 50 : 24;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.75;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pts.push({ pos: new THREE.Vector3(x, y, z), dir: new THREE.Vector3(x, y, z).normalize() });
    }
    return pts;
  }, [detail]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.12;
    groupRef.current.rotation.z = Math.sin(t * 0.1) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Matrix shell */}
      <mesh>
        <sphereGeometry args={[0.65, 28, 28]} />
        <meshStandardMaterial color="#6C3483" transparent opacity={0.25} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Lipid envelope */}
      <mesh>
        <sphereGeometry args={[0.73, 28, 28]} />
        <meshStandardMaterial color="#9B59B6" transparent opacity={0.2} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Wireframe */}
      <mesh>
        <sphereGeometry args={[0.75, 14, 14]} />
        <meshBasicMaterial color="#9B59B6" wireframe transparent opacity={0.06} />
      </mesh>

      {/* Cone-shaped capsid (p24) */}
      <mesh position={[0, -0.05, 0]} rotation={[0.1, 0, 0.05]}>
        <coneGeometry args={[0.28, 0.55, 8]} />
        <meshStandardMaterial color="#8E44AD" emissive="#8E44AD" emissiveIntensity={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.32, 0]} rotation={[Math.PI, 0, 0.05]}>
        <coneGeometry args={[0.15, 0.2, 8]} />
        <meshStandardMaterial color="#8E44AD" emissive="#8E44AD" emissiveIntensity={0.3} roughness={0.5} />
      </mesh>

      {/* gp120/gp41 spike proteins */}
      {gpSpikes.map((sp, i) => {
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), sp.dir);
        return (
          <group key={i}>
            {/* gp41 stalk */}
            <mesh position={sp.dir.clone().multiplyScalar(0.75 + 0.08).toArray() as [number,number,number]} quaternion={q}>
              <cylinderGeometry args={[0.01, 0.015, 0.16, 5]} />
              <meshStandardMaterial color="#C0392B" emissive="#C0392B" emissiveIntensity={0.3} />
            </mesh>
            {/* gp120 mushroom head */}
            <mesh position={sp.dir.clone().multiplyScalar(0.75 + 0.2).toArray() as [number,number,number]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.5} />
            </mesh>
          </group>
        );
      })}

      {/* RNA strands inside capsid */}
      {detail && [0, 1].map(strand => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 30; i++) {
          const t = (i / 30) * Math.PI * 4;
          const r = 0.08 + strand * 0.04;
          pts.push(new THREE.Vector3(Math.sin(t + strand * 1.5) * r, (i / 30 - 0.5) * 0.4 - 0.05, Math.cos(t + strand * 1.5) * r));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        return (
          <mesh key={strand}>
            <tubeGeometry args={[curve, 30, 0.008, 5, false]} />
            <meshStandardMaterial color="#2ECC71" emissive="#2ECC71" emissiveIntensity={0.5} />
          </mesh>
        );
      })}

      {/* Reverse transcriptase dots */}
      {detail && Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`rt-${i}`} position={[Math.sin(i * 1.1) * 0.12, (i / 6 - 0.5) * 0.3, Math.cos(i * 1.1) * 0.12]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#3498DB" emissive="#3498DB" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}
