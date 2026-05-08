"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function AnimalCellMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  /* Mitochondria positions */
  const mitoPos = useMemo(() => [
    { pos: [0.3, 0.4, 0.2], rot: [0.4, 0.2, -0.3] },
    { pos: [-0.4, -0.3, 0.3], rot: [-0.2, 0.5, 0.4] },
    { pos: [0.2, -0.5, -0.2], rot: [0.1, -0.6, 0.2] },
    { pos: [-0.3, 0.2, -0.4], rot: [0.5, -0.1, -0.5] },
  ] as { pos: [number, number, number]; rot: [number, number, number] }[], []);

  /* Lysosome positions */
  const lysoPos = useMemo(() => [
    [0.5, -0.1, 0.3], [-0.2, 0.5, 0.1], [0.1, -0.2, 0.5], [-0.5, -0.2, -0.2],
  ] as [number, number, number][], []);

  /* Ribosomes (free in cytoplasm) */
  const ribosomes = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 60; i++) {
      const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), r = Math.random() * 0.7;
      pts.push([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph)]);
    }
    return pts;
  }, []);

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Cell Membrane (cutaway) */}
      <mesh>
        <sphereGeometry args={[0.9, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.8]} />
        <meshStandardMaterial color="#E74C3C" transparent opacity={0.25} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.92, 24, 24]} />
        <meshBasicMaterial color="#E74C3C" wireframe transparent opacity={0.06} />
      </mesh>

      {/* Nucleus */}
      <group position={[0, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#2980B9" emissive="#2980B9" emissiveIntensity={0.3} roughness={0.3} />
        </mesh>
        {/* Nucleolus */}
        <mesh position={[0.05, 0.05, 0.05]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#8E44AD" emissive="#8E44AD" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Endoplasmic Reticulum (wrapping around nucleus) */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.35, 0.08, 16, 40]} />
        <meshStandardMaterial color="#9B59B6" emissive="#9B59B6" emissiveIntensity={0.2} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.06, 16, 40]} />
        <meshStandardMaterial color="#9B59B6" emissive="#9B59B6" emissiveIntensity={0.2} roughness={0.4} />
      </mesh>

      {/* Golgi Apparatus */}
      <group position={[-0.4, 0.1, 0]} rotation={[0, 0, -0.3]}>
        {[0, 1, 2, 3].map(i => (
          <mesh key={`golgi-${i}`} position={[i * 0.06, 0, 0]}>
            <capsuleGeometry args={[0.04, 0.2 - i * 0.04, 8, 16]} />
            <meshStandardMaterial color="#F39C12" emissive="#F39C12" emissiveIntensity={0.3} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Mitochondria */}
      {mitoPos.map((m, i) => (
        <mesh key={`mito-${i}`} position={m.pos} rotation={m.rot}>
          <capsuleGeometry args={[0.06, 0.15, 12, 16]} />
          <meshStandardMaterial color="#1D9E75" emissive="#1D9E75" emissiveIntensity={0.4} roughness={0.4} />
        </mesh>
      ))}

      {/* Lysosomes */}
      {lysoPos.map((pos, i) => (
        <mesh key={`lyso-${i}`} position={pos}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#E67E22" emissive="#E67E22" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Centrioles */}
      <group position={[0.2, 0.3, 0.1]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
          <meshStandardMaterial color="#1ABC9C" emissive="#1ABC9C" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.1, 8]} />
          <meshStandardMaterial color="#1ABC9C" emissive="#1ABC9C" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* Ribosomes */}
      {detail && ribosomes.map((pos, i) => (
        <mesh key={`rib-${i}`} position={pos}>
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshStandardMaterial color="#BDC3C7" emissive="#BDC3C7" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* Cytoplasm */}
      {(() => {
        const geo = new THREE.BufferGeometry();
        const pts = new Float32Array(250 * 3);
        for (let i = 0; i < 250; i++) {
          const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1), r = Math.random() * 0.85;
          pts[i * 3] = r * Math.sin(ph) * Math.cos(th); pts[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th); pts[i * 3 + 2] = r * Math.cos(ph);
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
        return <points geometry={geo}><pointsMaterial color="#FADBD8" size={0.015} transparent opacity={0.25} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
      })()}
    </group>
  );
}
