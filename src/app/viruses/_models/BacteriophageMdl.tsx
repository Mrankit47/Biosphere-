"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function BacteriophageMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.12;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {/* ── Icosahedral Head ──────────────────── */}
      <mesh position={[0, 0.9, 0]}>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#1a5a1a" emissive="#39FF14" emissiveIntensity={0.15} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <icosahedronGeometry args={[0.57, 0]} />
        <meshBasicMaterial color="#39FF14" wireframe transparent opacity={0.15} />
      </mesh>

      {/* DNA inside head */}
      {detail && (() => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 40; i++) {
          const t = (i / 40) * Math.PI * 6;
          pts.push(new THREE.Vector3(Math.sin(t) * 0.15, 0.9 + (i / 40 - 0.5) * 0.6, Math.cos(t) * 0.15));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        return (
          <mesh>
            <tubeGeometry args={[curve, 40, 0.012, 5, false]} />
            <meshStandardMaterial color="#9B59B6" emissive="#9B59B6" emissiveIntensity={0.5} />
          </mesh>
        );
      })()}

      {/* ── Collar ────────────────────────────── */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 0.08, 6]} />
        <meshStandardMaterial color="#2ECC71" emissive="#2ECC71" emissiveIntensity={0.2} />
      </mesh>

      {/* ── Tail Tube (contractile sheath) ─── */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.85, 8]} />
        <meshStandardMaterial color="#2ECC71" emissive="#2ECC71" emissiveIntensity={0.15} roughness={0.5} />
      </mesh>
      {/* Sheath rings */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`ring-${i}`} position={[0, 0.2 - i * 0.12, 0]}>
          <torusGeometry args={[0.1, 0.015, 8, 12]} />
          <meshStandardMaterial color="#27AE60" emissive="#27AE60" emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* ── Baseplate ─────────────────────────── */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.22, 0.18, 0.08, 6]} />
        <meshStandardMaterial color="#1ABC9C" emissive="#1ABC9C" emissiveIntensity={0.2} />
      </mesh>

      {/* ── Tail Fibers (6 legs) ──────────────── */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x1 = Math.cos(angle) * 0.2;
        const z1 = Math.sin(angle) * 0.2;
        const x2 = Math.cos(angle) * 0.65;
        const z2 = Math.sin(angle) * 0.65;
        const pts = [
          new THREE.Vector3(x1, -0.6, z1),
          new THREE.Vector3(x2 * 0.5, -0.8, z2 * 0.5),
          new THREE.Vector3(x2, -1.1, z2),
          new THREE.Vector3(x2 * 0.8, -1.25, z2 * 0.8),
        ];
        const curve = new THREE.CatmullRomCurve3(pts);
        return (
          <mesh key={`leg-${i}`}>
            <tubeGeometry args={[curve, 20, 0.012, 5, false]} />
            <meshStandardMaterial color="#F7DC6F" emissive="#F7DC6F" emissiveIntensity={0.3} />
          </mesh>
        );
      })}

      {/* ── Tail Pins ─────────────────────────── */}
      {detail && Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
        return (
          <mesh key={`pin-${i}`} position={[Math.cos(angle) * 0.15, -0.68, Math.sin(angle) * 0.15]}
            rotation={[0.3, angle, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.15, 4]} />
            <meshStandardMaterial color="#27AE60" emissive="#27AE60" emissiveIntensity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}
