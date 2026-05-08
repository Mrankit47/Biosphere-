"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function AmoebaMdl({ detail = false }: { detail?: boolean }) {
  const bodyRef = useRef<THREE.Mesh>(null!);
  const origPos = useRef<Float32Array | null>(null);
  const groupRef = useRef<THREE.Group>(null!);

  /* Pseudopod tips — animated extensions */
  const pseudoTips = useMemo(() => [
    { pos: [1.1, 0.3, 0.2] as [number, number, number], scale: 0.18 },
    { pos: [-0.5, 0.7, 0.5] as [number, number, number], scale: 0.14 },
    { pos: [0.3, -0.8, -0.4] as [number, number, number], scale: 0.16 },
    { pos: [-0.9, -0.2, -0.5] as [number, number, number], scale: 0.13 },
    { pos: [0.7, 0.5, -0.6] as [number, number, number], scale: 0.15 },
  ], []);

  /* Food vacuole positions */
  const foodVac = useMemo(() => [
    [0.3, 0.2, 0.1], [-0.2, -0.3, 0.2], [0.1, 0.4, -0.3], [-0.4, 0.1, -0.1],
  ] as [number, number, number][], []);

  /* Cytoplasm particles */
  const cytoGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pts = new Float32Array(250 * 3);
    for (let i = 0; i < 250; i++) {
      const theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1), r = Math.random() * 0.65;
      pts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pts[i * 3 + 2] = r * Math.cos(phi);
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.08;

    /* Deform body (amoeboid motion) */
    const geo = bodyRef.current.geometry;
    const pos = geo.attributes.position;
    if (!origPos.current) origPos.current = new Float32Array(pos.array as Float32Array);
    const orig = origPos.current;
    for (let i = 0; i < pos.count; i++) {
      const ox = orig[i * 3], oy = orig[i * 3 + 1], oz = orig[i * 3 + 2];
      const d = Math.sin(t * 0.6 + ox * 3) * 0.1 + Math.cos(t * 0.5 + oy * 4) * 0.08 + Math.sin(t * 0.9 + oz * 2.5) * 0.07;
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
      (pos.array as Float32Array)[i * 3] = ox + (ox / len) * d;
      (pos.array as Float32Array)[i * 3 + 1] = oy + (oy / len) * d;
      (pos.array as Float32Array)[i * 3 + 2] = oz + (oz / len) * d;
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();

    /* Animate pseudopod tips */
    const pGroup = groupRef.current.children;
    pseudoTips.forEach((tip, i) => {
      const child = pGroup[3 + i]; // after body, ectoplasm wireframe, nucleus
      if (child) {
        child.position.x = tip.pos[0] + Math.sin(t * 0.4 + i * 1.5) * 0.15;
        child.position.y = tip.pos[1] + Math.cos(t * 0.35 + i * 1.2) * 0.1;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Body (ectoplasm + endoplasm) */}
      <mesh ref={bodyRef}>
        <icosahedronGeometry args={[0.85, 4]} />
        <meshStandardMaterial color="#39FF14" transparent opacity={0.28} roughness={0.4} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>

      {/* Ectoplasm wireframe */}
      <mesh>
        <icosahedronGeometry args={[0.87, 3]} />
        <meshBasicMaterial color="#39FF14" wireframe transparent opacity={0.06} />
      </mesh>

      {/* Nucleus */}
      <mesh position={[0.1, 0.05, 0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color="#6C3483" emissive="#6C3483" emissiveIntensity={0.6} roughness={0.4} />
      </mesh>

      {/* Pseudopods */}
      {pseudoTips.map((tip, i) => (
        <mesh key={`pseudo-${i}`} position={tip.pos}>
          <sphereGeometry args={[tip.scale, 12, 12]} />
          <meshStandardMaterial color="#2ECC71" emissive="#27AE60" emissiveIntensity={0.3} transparent opacity={0.5} roughness={0.5} />
        </mesh>
      ))}

      {/* Contractile Vacuole */}
      <mesh position={[-0.3, 0.25, 0.2]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#3498DB" emissive="#3498DB" emissiveIntensity={0.7} transparent opacity={0.6} roughness={0.3} />
      </mesh>

      {/* Food Vacuoles */}
      {detail && foodVac.map((pos, i) => (
        <mesh key={`fv-${i}`} position={pos}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#E67E22" emissive="#E67E22" emissiveIntensity={0.5} roughness={0.4} />
        </mesh>
      ))}

      {/* Cytoplasm particles */}
      <points geometry={cytoGeo}>
        <pointsMaterial color="#A9DFBF" size={0.018} transparent opacity={0.4} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}
