"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function InfluenzaMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  const spikes = useMemo(() => {
    const pts: { pos: THREE.Vector3; dir: THREE.Vector3; isNA: boolean }[] = [];
    const count = detail ? 55 : 28;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.7;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pts.push({ pos: new THREE.Vector3(x, y, z), dir: new THREE.Vector3(x, y, z).normalize(), isNA: i % 4 === 0 });
    }
    return pts;
  }, [detail]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.13;
    groupRef.current.rotation.x = Math.sin(t * 0.09) * 0.12;
  });

  return (
    <group ref={groupRef}>
      {/* Inner matrix */}
      <mesh>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial color="#1a4a7a" emissive="#378ADD" emissiveIntensity={0.1} roughness={0.6} />
      </mesh>
      {/* Lipid envelope */}
      <mesh>
        <sphereGeometry args={[0.68, 28, 28]} />
        <meshStandardMaterial color="#378ADD" transparent opacity={0.25} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Wireframe */}
      <mesh>
        <sphereGeometry args={[0.7, 14, 14]} />
        <meshBasicMaterial color="#378ADD" wireframe transparent opacity={0.06} />
      </mesh>

      {/* HA and NA spikes */}
      {spikes.map((sp, i) => {
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), sp.dir);
        const spikeColor = sp.isNA ? "#E74C3C" : "#3498DB";
        return (
          <group key={i}>
            <mesh position={sp.dir.clone().multiplyScalar(0.7 + 0.1).toArray() as [number,number,number]} quaternion={q}>
              <cylinderGeometry args={[0.01, 0.015, 0.2, 5]} />
              <meshStandardMaterial color={spikeColor} emissive={spikeColor} emissiveIntensity={0.3} />
            </mesh>
            {sp.isNA ? (
              <mesh position={sp.dir.clone().multiplyScalar(0.7 + 0.22).toArray() as [number,number,number]} quaternion={q}>
                <boxGeometry args={[0.05, 0.03, 0.05]} />
                <meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.5} />
              </mesh>
            ) : (
              <mesh position={sp.dir.clone().multiplyScalar(0.7 + 0.23).toArray() as [number,number,number]}>
                <coneGeometry args={[0.025, 0.05, 6]} />
                <meshStandardMaterial color="#3498DB" emissive="#3498DB" emissiveIntensity={0.5} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* 8 RNA segments inside */}
      {detail && Array.from({ length: 8 }).map((_, seg) => {
        const pts: THREE.Vector3[] = [];
        const aOff = (seg / 8) * Math.PI * 2;
        for (let i = 0; i <= 20; i++) {
          const t = (i / 20) * Math.PI * 2;
          const r = 0.1 + seg * 0.03;
          pts.push(new THREE.Vector3(Math.sin(t + aOff) * r, (i / 20 - 0.5) * 0.4, Math.cos(t + aOff) * r));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        return (
          <mesh key={seg}>
            <tubeGeometry args={[curve, 20, 0.006, 5, false]} />
            <meshStandardMaterial color="#9B59B6" emissive="#9B59B6" emissiveIntensity={0.5} />
          </mesh>
        );
      })}

      {/* M2 ion channels */}
      {detail && Array.from({ length: 8 }).map((_, i) => {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / 8);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i * 3;
        const r = 0.69;
        return (
          <mesh key={`m2-${i}`} position={[r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)]}>
            <cylinderGeometry args={[0.02, 0.02, 0.04, 6]} />
            <meshStandardMaterial color="#1ABC9C" emissive="#1ABC9C" emissiveIntensity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}
