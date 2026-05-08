"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ParameciumMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const bodyRef = useRef<THREE.Mesh>(null!);
  const origPos = useRef<Float32Array | null>(null);

  /* Cilia positions around the body */
  const cilia = useMemo(() => {
    const pts: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    for (let i = 0; i < 60; i++) {
      const theta = (i / 60) * Math.PI * 2;
      const y = (Math.random() - 0.5) * 1.6;
      const r = 0.35 + Math.abs(y) * 0.05;
      pts.push({
        pos: [Math.cos(theta) * r, y, Math.sin(theta) * r],
        rot: [Math.sin(theta) * 0.5, 0, -Math.cos(theta) * 0.5],
      });
    }
    return pts;
  }, []);

  /* Food vacuole positions */
  const foodVac = useMemo(() => [
    [0.08, 0.3, 0.1], [-0.05, -0.2, 0.08], [0.1, -0.5, -0.05], [-0.08, 0.5, -0.08],
  ] as [number, number, number][], []);

  /* Trichocyst positions */
  const tricho = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 16; i++) {
      const theta = (i / 16) * Math.PI * 2;
      const y = (Math.random() - 0.5) * 1.2;
      pts.push([Math.cos(theta) * 0.28, y, Math.sin(theta) * 0.28]);
    }
    return pts;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.1;
    /* Gentle body undulation */
    const geo = bodyRef.current.geometry;
    const pos = geo.attributes.position;
    if (!origPos.current) origPos.current = new Float32Array(pos.array as Float32Array);
    const orig = origPos.current;
    for (let i = 0; i < pos.count; i++) {
      const oy = orig[i * 3 + 1];
      const wave = Math.sin(t * 1.2 + oy * 3) * 0.015;
      (pos.array as Float32Array)[i * 3] = orig[i * 3] + wave;
    }
    pos.needsUpdate = true;
  });

  return (
    <group ref={groupRef} rotation={[0, 0, 0.2]}>
      {/* Slipper-shaped body */}
      <mesh ref={bodyRef}>
        <capsuleGeometry args={[0.32, 1.3, 24, 32]} />
        <meshStandardMaterial color="#85C1E9" emissive="#3498DB" emissiveIntensity={0.2} transparent opacity={0.55} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh><capsuleGeometry args={[0.34, 1.32, 12, 16]} /><meshBasicMaterial color="#3498DB" wireframe transparent opacity={0.05} /></mesh>

      {/* Cilia */}
      {cilia.map((c, i) => (
        <mesh key={`cil-${i}`} position={c.pos} rotation={c.rot}>
          <cylinderGeometry args={[0.003, 0.002, 0.1, 4]} />
          <meshStandardMaterial color="#85C1E9" emissive="#85C1E9" emissiveIntensity={0.5} transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Oral Groove (funnel) */}
      <mesh position={[0.15, 0.2, 0.15]} rotation={[0, 0, -0.5]}>
        <coneGeometry args={[0.08, 0.25, 12, 1, true]} />
        <meshStandardMaterial color="#F39C12" emissive="#F39C12" emissiveIntensity={0.4} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Macronucleus */}
      <mesh position={[0, 0.05, 0]}>
        <capsuleGeometry args={[0.1, 0.2, 12, 16]} />
        <meshStandardMaterial color="#8E44AD" emissive="#8E44AD" emissiveIntensity={0.5} roughness={0.4} />
      </mesh>

      {/* Micronucleus */}
      <mesh position={[0.08, 0.1, 0.05]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#6C3483" emissive="#6C3483" emissiveIntensity={0.6} />
      </mesh>

      {/* Contractile Vacuoles (star-shaped — represented as spheres with glow) */}
      {[[0, 0.55, 0], [0, -0.55, 0]].map((pos, i) => (
        <mesh key={`cv-${i}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#3498DB" emissive="#3498DB" emissiveIntensity={0.8} transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Trichocysts */}
      {detail && tricho.map((pos, i) => (
        <mesh key={`tr-${i}`} position={pos}>
          <cylinderGeometry args={[0.005, 0.005, 0.06, 4]} />
          <meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Food Vacuoles */}
      {detail && foodVac.map((pos, i) => (
        <mesh key={`fv-${i}`} position={pos}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#E67E22" emissive="#E67E22" emissiveIntensity={0.4} transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Cytoplasm particles */}
      {(() => {
        const geo = new THREE.BufferGeometry();
        const pts = new Float32Array(180 * 3);
        for (let i = 0; i < 180; i++) {
          pts[i * 3] = (Math.random() - 0.5) * 0.5;
          pts[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
          pts[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
        return <points geometry={geo}><pointsMaterial color="#AED6F1" size={0.012} transparent opacity={0.3} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
      })()}
    </group>
  );
}
