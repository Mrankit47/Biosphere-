"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function TMVMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  /* Helical coat protein subunits */
  const subunits = useMemo(() => {
    const pts: { pos: [number, number, number]; q: THREE.Quaternion }[] = [];
    const turns = detail ? 30 : 16;
    const perTurn = detail ? 16 : 10;
    for (let t = 0; t < turns; t++) {
      for (let p = 0; p < perTurn; p++) {
        const angle = ((t * perTurn + p) / (turns * perTurn)) * Math.PI * 2 * turns;
        const y = (t / turns - 0.5) * 2.5 + (p / perTurn / turns) * 2.5;
        const r = 0.28;
        pts.push({
          pos: [Math.cos(angle) * r, y, Math.sin(angle) * r],
          q: new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)).normalize()
          ),
        });
      }
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
      {/* Central channel */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 2.6, 12]} />
        <meshStandardMaterial color="#1ABC9C" emissive="#1ABC9C" emissiveIntensity={0.3} transparent opacity={0.4} />
      </mesh>

      {/* RNA helix — embedded in groove */}
      {(() => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 120; i++) {
          const t = (i / 120) * Math.PI * 2 * 20;
          const y = (i / 120 - 0.5) * 2.5;
          pts.push(new THREE.Vector3(Math.cos(t) * 0.15, y, Math.sin(t) * 0.15));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        return (
          <mesh>
            <tubeGeometry args={[curve, 100, 0.015, 5, false]} />
            <meshStandardMaterial color="#9B59B6" emissive="#9B59B6" emissiveIntensity={0.5} />
          </mesh>
        );
      })()}

      {/* Coat protein subunits */}
      {subunits.map((su, i) => (
        <mesh key={i} position={su.pos} quaternion={su.q}>
          <boxGeometry args={[0.06, 0.04, 0.12]} />
          <meshStandardMaterial color="#27AE60" emissive="#27AE60" emissiveIntensity={0.15} roughness={0.5} />
        </mesh>
      ))}

      {/* Outer wireframe cylinder */}
      <mesh>
        <cylinderGeometry args={[0.35, 0.35, 2.6, 12, 8, true]} />
        <meshBasicMaterial color="#27AE60" wireframe transparent opacity={0.06} />
      </mesh>

      {/* End caps */}
      {[1.3, -1.3].map((y, i) => (
        <mesh key={`cap-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.35, 12]} />
          <meshStandardMaterial color="#229954" emissive="#229954" emissiveIntensity={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* 5' cap marker */}
      {detail && (
        <mesh position={[0, 1.38, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.6} />
        </mesh>
      )}

      {/* Assembly origin marker */}
      {detail && (
        <mesh position={[0.2, 0.3, 0]}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial color="#F39C12" emissive="#F39C12" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  );
}
