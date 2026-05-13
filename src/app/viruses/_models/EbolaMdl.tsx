"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function EbolaMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 80; i++) {
      const t = i / 80;
      const x = Math.sin(t * Math.PI * 3) * 0.2 * Math.sin(t * Math.PI);
      const y = (t - 0.5) * 3.5;
      const z = Math.cos(t * Math.PI * 3) * 0.2 * Math.sin(t * Math.PI);
      pts.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  const gpSpikes = useMemo(() => {
    const pts: { pos: [number,number,number]; q: THREE.Quaternion }[] = [];
    const count = detail ? 80 : 40;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const pt = curve.getPoint(t);
      const tan = curve.getTangent(t);
      const angle = (i * 2.618) + t * 20;
      const perp = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
        .cross(tan).normalize();
      const offset = perp.multiplyScalar(0.18);
      pts.push({
        pos: [pt.x + offset.x, pt.y + offset.y, pt.z + offset.z],
        q: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), perp.clone().normalize()),
      });
    }
    return pts;
  }, [curve, detail]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.1;
    groupRef.current.rotation.x = Math.sin(t * 0.15) * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* Main filament body */}
      <mesh>
        <tubeGeometry args={[curve, 100, 0.15, 16, false]} />
        <meshStandardMaterial color="#EF9F27" emissive="#EF9F27" emissiveIntensity={0.15} roughness={0.5} />
      </mesh>
      {/* Outer envelope */}
      <mesh>
        <tubeGeometry args={[curve, 80, 0.17, 12, false]} />
        <meshStandardMaterial color="#F5B041" transparent opacity={0.15} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Wireframe */}
      <mesh>
        <tubeGeometry args={[curve, 40, 0.18, 8, false]} />
        <meshBasicMaterial color="#EF9F27" wireframe transparent opacity={0.05} />
      </mesh>

      {/* GP spikes */}
      {gpSpikes.map((sp, i) => (
        <mesh key={i} position={sp.pos}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#E67E22" emissive="#E67E22" emissiveIntensity={0.4} />
        </mesh>
      ))}

      {/* Internal nucleocapsid (helical RNA) */}
      {detail && (() => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 120; i++) {
          const t = i / 120;
          const pt = curve.getPoint(t);
          const ang = t * Math.PI * 20;
          pts.push(new THREE.Vector3(pt.x + Math.sin(ang) * 0.06, pt.y, pt.z + Math.cos(ang) * 0.06));
        }
        const rCurve = new THREE.CatmullRomCurve3(pts);
        return (
          <mesh>
            <tubeGeometry args={[rCurve, 100, 0.01, 5, false]} />
            <meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.5} />
          </mesh>
        );
      })()}

      {/* VP40 matrix dots */}
      {detail && Array.from({ length: 30 }).map((_, i) => {
        const t = (i + 0.5) / 30;
        const pt = curve.getPoint(t);
        const ang = i * 1.2;
        return (
          <mesh key={`vp-${i}`} position={[pt.x + Math.sin(ang) * 0.14, pt.y, pt.z + Math.cos(ang) * 0.14]}>
            <sphereGeometry args={[0.015, 5, 5]} />
            <meshStandardMaterial color="#D4AC0D" emissive="#D4AC0D" emissiveIntensity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}
