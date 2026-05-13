"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DengueMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  /* Dengue is unusually smooth — E proteins lie flat creating tiled surface */
  const tiles = useMemo(() => {
    const pts: { pos: THREE.Vector3; q: THREE.Quaternion }[] = [];
    const count = detail ? 90 : 45;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.68;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      const dir = new THREE.Vector3(x, y, z).normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
      pts.push({ pos: new THREE.Vector3(x, y, z), q });
    }
    return pts;
  }, [detail]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.15;
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Inner capsid */}
      <mesh>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color="#7D5A00" emissive="#F39C12" emissiveIntensity={0.1} roughness={0.6} />
      </mesh>
      {/* Smooth envelope */}
      <mesh>
        <sphereGeometry args={[0.66, 32, 32]} />
        <meshStandardMaterial color="#F39C12" transparent opacity={0.3} roughness={0.25} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* Wireframe */}
      <mesh>
        <sphereGeometry args={[0.68, 14, 14]} />
        <meshBasicMaterial color="#F39C12" wireframe transparent opacity={0.06} />
      </mesh>

      {/* E protein tiles — flat hexagonal-ish on surface */}
      {tiles.map((t, i) => (
        <mesh key={i} position={t.pos.toArray() as [number,number,number]} quaternion={t.q}>
          <circleGeometry args={[0.045, 6]} />
          <meshStandardMaterial color="#E67E22" emissive="#E67E22" emissiveIntensity={0.25} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* RNA inside */}
      {detail && (() => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 50; i++) {
          const t = (i / 50) * Math.PI * 5;
          pts.push(new THREE.Vector3(Math.sin(t) * 0.18, (i / 50 - 0.5) * 0.7, Math.cos(t) * 0.18));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        return (
          <mesh>
            <tubeGeometry args={[curve, 40, 0.01, 5, false]} />
            <meshStandardMaterial color="#9B59B6" emissive="#9B59B6" emissiveIntensity={0.5} />
          </mesh>
        );
      })()}

      {/* Capsid dimers */}
      {detail && Array.from({ length: 15 }).map((_, i) => {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / 15);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i * 2;
        const r = 0.52;
        return (
          <mesh key={`cd-${i}`} position={[r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)]}>
            <sphereGeometry args={[0.025, 5, 5]} />
            <meshStandardMaterial color="#D4AC0D" emissive="#D4AC0D" emissiveIntensity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}
