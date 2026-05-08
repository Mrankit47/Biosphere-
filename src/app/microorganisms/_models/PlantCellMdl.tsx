"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function PlantCellMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  /* Chloroplast positions */
  const chloroPos = useMemo(() => [
    { pos: [0.4, 0.3, 0.2], rot: [0.2, 0.5, 0.1] },
    { pos: [0.3, -0.4, 0.3], rot: [-0.3, -0.2, 0.4] },
    { pos: [-0.4, 0.2, 0.4], rot: [0.5, 0.1, -0.2] },
    { pos: [-0.3, -0.3, -0.3], rot: [-0.1, 0.4, -0.3] },
    { pos: [0.2, 0.4, -0.4], rot: [0.4, -0.5, 0.2] },
  ] as { pos: [number, number, number]; rot: [number, number, number] }[], []);

  /* Mitochondria positions */
  const mitoPos = useMemo(() => [
    { pos: [0.5, 0, -0.2], rot: [0.5, -0.2, 0.3] },
    { pos: [-0.2, -0.5, 0.2], rot: [-0.3, 0.4, -0.1] },
    { pos: [0, 0.5, 0.2], rot: [0.1, -0.6, 0.5] },
  ] as { pos: [number, number, number]; rot: [number, number, number] }[], []);

  /* Plasmodesmata channels */
  const plasmoPos = useMemo(() => [
    [0.85, 0.2, 0], [0.85, -0.2, 0], [-0.85, 0, 0.3], [0, 0.85, 0.2], [0, -0.85, -0.2]
  ] as [number, number, number][], []);

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Cell Wall (box with rounded corners, cutaway) */}
      <mesh>
        <boxGeometry args={[1.7, 1.7, 1.7]} />
        <meshStandardMaterial color="#1D8348" transparent opacity={0.15} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <boxGeometry args={[1.72, 1.72, 1.72]} />
        <meshBasicMaterial color="#1D8348" wireframe transparent opacity={0.1} />
      </mesh>

      {/* Cell Membrane */}
      <mesh>
        <boxGeometry args={[1.65, 1.65, 1.65]} />
        <meshStandardMaterial color="#27AE60" transparent opacity={0.1} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Central Vacuole (very large) */}
      <mesh position={[0, -0.1, -0.1]}>
        <boxGeometry args={[0.9, 1.0, 0.8]} />
        <meshStandardMaterial color="#85C1E9" emissive="#3498DB" emissiveIntensity={0.2} transparent opacity={0.4} roughness={0.2} />
      </mesh>

      {/* Nucleus (pushed to the side by the vacuole) */}
      <group position={[-0.4, 0.4, 0]}>
        <mesh>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial color="#2980B9" emissive="#2980B9" emissiveIntensity={0.3} />
        </mesh>
        {/* Nucleolus */}
        <mesh position={[0.04, 0.04, 0.04]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#8E44AD" emissive="#8E44AD" emissiveIntensity={0.5} />
        </mesh>
        {/* Endoplasmic Reticulum */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.06, 16, 40]} />
          <meshStandardMaterial color="#9B59B6" emissive="#9B59B6" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Chloroplasts */}
      {chloroPos.map((c, i) => (
        <group key={`chlor-${i}`} position={c.pos} rotation={c.rot}>
          <capsuleGeometry args={[0.08, 0.15, 12, 16]} />
          <meshStandardMaterial color="#2ECC71" emissive="#27AE60" emissiveIntensity={0.4} roughness={0.4} />
          {/* Inner stacks (thylakoids) */}
          {detail && [-0.05, 0, 0.05].map((y, j) => (
            <mesh key={`thyl-${j}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.02, 12]} />
              <meshStandardMaterial color="#1E8449" emissive="#1E8449" emissiveIntensity={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Mitochondria */}
      {mitoPos.map((m, i) => (
        <mesh key={`mito-${i}`} position={m.pos} rotation={m.rot}>
          <capsuleGeometry args={[0.05, 0.12, 12, 16]} />
          <meshStandardMaterial color="#1D9E75" emissive="#1D9E75" emissiveIntensity={0.4} />
        </mesh>
      ))}

      {/* Plasmodesmata (channels through the cell wall) */}
      {detail && plasmoPos.map((pos, i) => {
        const isX = Math.abs(pos[0]) > 0.5;
        const isY = Math.abs(pos[1]) > 0.5;
        const rot = isX ? [0, 0, Math.PI / 2] : isY ? [0, 0, 0] : [Math.PI / 2, 0, 0];
        return (
          <mesh key={`pd-${i}`} position={pos as [number, number, number]} rotation={rot as [number, number, number]}>
            <cylinderGeometry args={[0.04, 0.04, 0.1, 16]} />
            <meshStandardMaterial color="#F39C12" emissive="#F39C12" emissiveIntensity={0.4} transparent opacity={0.6} />
          </mesh>
        );
      })}

      {/* Cytoplasm particles */}
      {(() => {
        const geo = new THREE.BufferGeometry();
        const pts = new Float32Array(200 * 3);
        let count = 0;
        while (count < 200) {
          const x = (Math.random() - 0.5) * 1.5;
          const y = (Math.random() - 0.5) * 1.5;
          const z = (Math.random() - 0.5) * 1.5;
          // Avoid vacuole area roughly
          if (x > -0.4 && x < 0.4 && y > -0.5 && y < 0.3 && z > -0.4 && z < 0.4) continue;
          pts[count * 3] = x; pts[count * 3 + 1] = y; pts[count * 3 + 2] = z;
          count++;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
        return <points geometry={geo}><pointsMaterial color="#ABEBC6" size={0.015} transparent opacity={0.3} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
      })()}
    </group>
  );
}
