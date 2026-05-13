"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RabiesMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  const gSpikes = useMemo(() => {
    const pts: { pos: THREE.Vector3; dir: THREE.Vector3 }[] = [];
    const count = detail ? 50 : 25;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const y = Math.cos(phi);
      if (y < -0.6) continue;
      const r = y > 0.3 ? 0.4 + (0.3 - (y - 0.3)) * 0.3 : 0.55;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const z = r * Math.sin(phi) * Math.sin(theta);
      pts.push({ pos: new THREE.Vector3(x, y * 0.8, z), dir: new THREE.Vector3(x, y * 0.3, z).normalize() });
    }
    return pts;
  }, [detail]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.14;
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Bullet body — capsule with flat bottom */}
      <mesh position={[0, 0.1, 0]}>
        <capsuleGeometry args={[0.45, 0.7, 16, 24]} />
        <meshStandardMaterial color="#8B1A1A" emissive="#E74C3C" emissiveIntensity={0.1} roughness={0.6} />
      </mesh>
      {/* Flat bottom */}
      <mesh position={[0, -0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.45, 24]} />
        <meshStandardMaterial color="#8B1A1A" emissive="#E74C3C" emissiveIntensity={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* Envelope */}
      <mesh position={[0, 0.1, 0]}>
        <capsuleGeometry args={[0.5, 0.75, 12, 18]} />
        <meshStandardMaterial color="#E74C3C" transparent opacity={0.18} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Wireframe */}
      <mesh position={[0, 0.1, 0]}>
        <capsuleGeometry args={[0.52, 0.77, 8, 12]} />
        <meshBasicMaterial color="#E74C3C" wireframe transparent opacity={0.06} />
      </mesh>

      {/* G protein spikes */}
      {gSpikes.map((sp, i) => {
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), sp.dir);
        return (
          <group key={i}>
            <mesh position={sp.pos.clone().add(sp.dir.clone().multiplyScalar(0.08)).toArray() as [number,number,number]} quaternion={q}>
              <cylinderGeometry args={[0.012, 0.015, 0.16, 5]} />
              <meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={sp.pos.clone().add(sp.dir.clone().multiplyScalar(0.2)).toArray() as [number,number,number]}>
              <sphereGeometry args={[0.025, 6, 6]} />
              <meshStandardMaterial color="#F5B041" emissive="#F5B041" emissiveIntensity={0.5} />
            </mesh>
          </group>
        );
      })}

      {/* Internal helical RNA */}
      {detail && (() => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 50; i++) {
          const t = (i / 50) * Math.PI * 8;
          const y = (i / 50 - 0.5) * 0.9 + 0.1;
          pts.push(new THREE.Vector3(Math.sin(t) * 0.15, y, Math.cos(t) * 0.15));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        return (
          <mesh>
            <tubeGeometry args={[curve, 50, 0.01, 5, false]} />
            <meshStandardMaterial color="#2ECC71" emissive="#2ECC71" emissiveIntensity={0.5} />
          </mesh>
        );
      })()}

      {/* N protein dots along helix */}
      {detail && Array.from({ length: 20 }).map((_, i) => {
        const t = (i / 20) * Math.PI * 8;
        const y = (i / 20 - 0.5) * 0.9 + 0.1;
        return (
          <mesh key={`n-${i}`} position={[Math.sin(t) * 0.2, y, Math.cos(t) * 0.2]}>
            <sphereGeometry args={[0.018, 5, 5]} />
            <meshStandardMaterial color="#9B59B6" emissive="#9B59B6" emissiveIntensity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}
