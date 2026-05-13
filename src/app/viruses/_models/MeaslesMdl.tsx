"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function MeaslesMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const origRef = useRef<Float32Array | null>(null);

  const spikes = useMemo(() => {
    const pts: { pos: THREE.Vector3; dir: THREE.Vector3; isF: boolean }[] = [];
    const count = detail ? 55 : 28;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.7;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pts.push({ pos: new THREE.Vector3(x, y, z), dir: new THREE.Vector3(x, y, z).normalize(), isF: i % 3 === 0 });
    }
    return pts;
  }, [detail]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.12;
    /* Pleomorphic pulsing */
    const mesh = groupRef.current.children[0] as THREE.Mesh;
    if (mesh?.geometry) {
      const pos = mesh.geometry.attributes.position;
      if (!origRef.current) origRef.current = new Float32Array(pos.array as Float32Array);
      const o = origRef.current;
      for (let i = 0; i < pos.count; i++) {
        const ox = o[i * 3], oy = o[i * 3 + 1], oz = o[i * 3 + 2];
        const d = Math.sin(t * 0.5 + ox * 3) * 0.03 + Math.cos(t * 0.4 + oy * 4) * 0.02;
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
        (pos.array as Float32Array)[i * 3] = ox + (ox / len) * d;
        (pos.array as Float32Array)[i * 3 + 1] = oy + (oy / len) * d;
        (pos.array as Float32Array)[i * 3 + 2] = oz + (oz / len) * d;
      }
      pos.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
    }
  });

  return (
    <group ref={groupRef}>
      {/* Pleomorphic body */}
      <mesh>
        <icosahedronGeometry args={[0.6, 4]} />
        <meshStandardMaterial color="#8B1A1A" emissive="#E74C3C" emissiveIntensity={0.12} roughness={0.5} />
      </mesh>
      {/* Envelope */}
      <mesh>
        <sphereGeometry args={[0.7, 24, 24]} />
        <meshStandardMaterial color="#E74C3C" transparent opacity={0.18} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      {/* Wireframe */}
      <mesh>
        <sphereGeometry args={[0.72, 12, 12]} />
        <meshBasicMaterial color="#E74C3C" wireframe transparent opacity={0.06} />
      </mesh>

      {/* H and F protein spikes */}
      {spikes.map((sp, i) => {
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), sp.dir);
        return (
          <group key={i}>
            <mesh position={sp.dir.clone().multiplyScalar(0.7 + 0.08).toArray() as [number,number,number]} quaternion={q}>
              <cylinderGeometry args={[0.01, 0.014, 0.16, 5]} />
              <meshStandardMaterial color={sp.isF ? "#C0392B" : "#E74C3C"} emissive={sp.isF ? "#C0392B" : "#E74C3C"} emissiveIntensity={0.3} />
            </mesh>
            <mesh position={sp.dir.clone().multiplyScalar(0.7 + 0.2).toArray() as [number,number,number]}>
              <sphereGeometry args={[sp.isF ? 0.03 : 0.025, 6, 6]} />
              <meshStandardMaterial color={sp.isF ? "#F5B041" : "#E74C3C"} emissive={sp.isF ? "#F5B041" : "#E74C3C"} emissiveIntensity={0.5} />
            </mesh>
          </group>
        );
      })}

      {/* Helical RNA inside */}
      {detail && (() => {
        const pts: THREE.Vector3[] = [];
        for (let i = 0; i <= 60; i++) {
          const t = (i / 60) * Math.PI * 6;
          pts.push(new THREE.Vector3(Math.sin(t) * 0.2, (i / 60 - 0.5) * 0.8, Math.cos(t) * 0.2));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        return (
          <mesh>
            <tubeGeometry args={[curve, 50, 0.01, 5, false]} />
            <meshStandardMaterial color="#3498DB" emissive="#3498DB" emissiveIntensity={0.5} />
          </mesh>
        );
      })()}

      {/* M protein lining */}
      {detail && Array.from({ length: 20 }).map((_, i) => {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / 20);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const r = 0.62;
        return (
          <mesh key={`m-${i}`} position={[r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)]}>
            <sphereGeometry args={[0.015, 5, 5]} />
            <meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}
