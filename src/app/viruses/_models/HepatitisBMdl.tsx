"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function HepatitisBMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  const surfaceAntigens = useMemo(() => {
    const pts: { pos: THREE.Vector3; dir: THREE.Vector3 }[] = [];
    const count = detail ? 50 : 25;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.6;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pts.push({ pos: new THREE.Vector3(x, y, z), dir: new THREE.Vector3(x, y, z).normalize() });
    }
    return pts;
  }, [detail]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.13;
    groupRef.current.rotation.z = Math.sin(t * 0.08) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {/* Core (icosahedral capsid) */}
      <mesh>
        <icosahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial color="#0e5e43" emissive="#1D9E75" emissiveIntensity={0.2} roughness={0.5} />
      </mesh>
      {/* Lipid envelope */}
      <mesh>
        <sphereGeometry args={[0.55, 28, 28]} />
        <meshStandardMaterial color="#1D9E75" transparent opacity={0.2} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Wireframe */}
      <mesh>
        <sphereGeometry args={[0.6, 14, 14]} />
        <meshBasicMaterial color="#1D9E75" wireframe transparent opacity={0.06} />
      </mesh>

      {/* HBsAg surface antigen spikes */}
      {surfaceAntigens.map((sp, i) => {
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), sp.dir);
        return (
          <group key={i}>
            <mesh position={sp.pos.clone().add(sp.dir.clone().multiplyScalar(0.06)).toArray() as [number,number,number]} quaternion={q}>
              <cylinderGeometry args={[0.01, 0.013, 0.12, 5]} />
              <meshStandardMaterial color="#1D9E75" emissive="#1D9E75" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={sp.pos.clone().add(sp.dir.clone().multiplyScalar(0.15)).toArray() as [number,number,number]}>
              <sphereGeometry args={[0.025, 6, 6]} />
              <meshStandardMaterial color="#27AE60" emissive="#27AE60" emissiveIntensity={0.5} />
            </mesh>
          </group>
        );
      })}

      {/* rcDNA inside core */}
      {detail && (() => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 40; i++) {
          const t = (i / 40) * Math.PI * 2;
          const r = 0.15;
          pts.push(new THREE.Vector3(Math.sin(t) * r, Math.cos(t) * r, Math.sin(t * 3) * 0.05));
        }
        const curve = new THREE.CatmullRomCurve3(pts, true);
        return (
          <mesh>
            <tubeGeometry args={[curve, 40, 0.01, 5, false]} />
            <meshStandardMaterial color="#9B59B6" emissive="#9B59B6" emissiveIntensity={0.5} />
          </mesh>
        );
      })()}

      {/* Polymerase/RT dot */}
      {detail && (
        <mesh position={[0.08, 0.05, 0]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#3498DB" emissive="#3498DB" emissiveIntensity={0.6} />
        </mesh>
      )}

      {/* HBeAg particles (secreted) */}
      {detail && Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={`hbe-${i}`} position={[Math.cos(angle) * 0.85, Math.sin(angle) * 0.85, 0]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.4} transparent opacity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}
