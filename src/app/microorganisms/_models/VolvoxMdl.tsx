"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function VolvoxMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  /* Surface cells distributed on sphere */
  const surfaceCells = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 40; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 40);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 1.2;
      pts.push([r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)]);
    }
    return pts;
  }, []);

  /* Daughter colony positions */
  const daughters = useMemo(() => [
    [0.3, 0.3, 0.1], [-0.25, -0.2, 0.3], [0.1, -0.35, -0.2], [-0.15, 0.25, -0.25],
  ] as [number, number, number][], []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.15;
    groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Colony sphere (extracellular matrix) */}
      <mesh><sphereGeometry args={[1.25, 32, 32]} /><meshStandardMaterial color="#1D9E75" transparent opacity={0.15} roughness={0.3} side={THREE.DoubleSide} /></mesh>
      <mesh><sphereGeometry args={[1.27, 16, 16]} /><meshBasicMaterial color="#39FF14" wireframe transparent opacity={0.05} /></mesh>

      {/* Surface somatic cells */}
      {surfaceCells.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh><sphereGeometry args={[0.06, 8, 8]} /><meshStandardMaterial color="#1D9E75" emissive="#1D9E75" emissiveIntensity={0.6} /></mesh>
          {/* Tiny flagella */}
          {detail && (
            <>
              <mesh position={[0, 0.08, 0.02]} rotation={[0.3, 0, 0]}><cylinderGeometry args={[0.003, 0.003, 0.08, 4]} /><meshStandardMaterial color="#F7DC6F" emissive="#F7DC6F" emissiveIntensity={0.4} /></mesh>
              <mesh position={[0, 0.08, -0.02]} rotation={[-0.3, 0, 0]}><cylinderGeometry args={[0.003, 0.003, 0.06, 4]} /><meshStandardMaterial color="#F7DC6F" emissive="#F7DC6F" emissiveIntensity={0.4} /></mesh>
            </>
          )}
        </group>
      ))}

      {/* Daughter colonies */}
      {daughters.map((pos, i) => (
        <group key={`dc-${i}`} position={pos}>
          <mesh><sphereGeometry args={[0.22, 16, 16]} /><meshStandardMaterial color="#27AE60" transparent opacity={0.25} roughness={0.4} side={THREE.DoubleSide} /></mesh>
          {/* Mini cells on daughter surface */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map(j => {
            const a = (j / 8) * Math.PI * 2;
            return <mesh key={j} position={[Math.cos(a) * 0.2, Math.sin(a) * 0.2, 0]}><sphereGeometry args={[0.03, 6, 6]} /><meshStandardMaterial color="#2ECC71" emissive="#2ECC71" emissiveIntensity={0.5} /></mesh>;
          })}
        </group>
      ))}

      {/* Eyespot on a few cells */}
      {detail && [0, 5, 12, 20].map(i => {
        const p = surfaceCells[i];
        if (!p) return null;
        return <mesh key={`eye-${i}`} position={[p[0] * 0.95, p[1] * 0.95, p[2] * 0.95]}><sphereGeometry args={[0.02, 6, 6]} /><meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.8} /></mesh>;
      })}

      {/* Inner particles */}
      {(() => {
        const geo = new THREE.BufferGeometry();
        const pts = new Float32Array(150 * 3);
        for (let i = 0; i < 150; i++) {
          const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), r = Math.random() * 0.9;
          pts[i * 3] = r * Math.sin(ph) * Math.cos(th); pts[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th); pts[i * 3 + 2] = r * Math.cos(ph);
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
        return <points geometry={geo}><pointsMaterial color="#A9DFBF" size={0.015} transparent opacity={0.3} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
      })()}
    </group>
  );
}
