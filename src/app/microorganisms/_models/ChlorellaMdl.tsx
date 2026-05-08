"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ChlorellaMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);

  /* Starch grain positions */
  const starchPos = useMemo(() => [
    [0.15, 0.1, 0.2], [-0.1, -0.15, 0.18], [0.2, -0.1, -0.1], [-0.15, 0.15, -0.15],
  ] as [number, number, number][], []);

  /* Cytoplasm particles */
  const cytoGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pts = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      const theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1), r = Math.random() * 0.55;
      pts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pts[i * 3 + 2] = r * Math.cos(phi);
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return geo;
  }, []);

  /* Cup-shaped chloroplast curve (cross section) */
  const chloroCurve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) {
      const t = (i / 40) * Math.PI * 1.5 - Math.PI * 0.25;
      const r = 0.45 + Math.sin(t * 0.5) * 0.05;
      pts.push(new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), 0));
    }
    return new THREE.CatmullRomCurve3(pts, false);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.12;
    /* Gentle pulse */
    const pulse = 1 + Math.sin(t * 1.5) * 0.02;
    groupRef.current.scale.setScalar(pulse);
  });

  return (
    <group ref={groupRef}>
      {/* Cell Wall (outer rigid sphere) */}
      <mesh>
        <sphereGeometry args={[0.72, 48, 48]} />
        <meshStandardMaterial color="#1D8348" transparent opacity={0.2} roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.73, 20, 20]} />
        <meshBasicMaterial color="#1D8348" wireframe transparent opacity={0.06} />
      </mesh>

      {/* Cell Membrane (inner) */}
      <mesh>
        <sphereGeometry args={[0.68, 48, 48]} />
        <meshStandardMaterial color="#27AE60" transparent opacity={0.12} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Chloroplast (cup-shaped — represented as a thick half-sphere shell) */}
      <mesh rotation={[0, 0, 0.3]}>
        <sphereGeometry args={[0.55, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
        <meshStandardMaterial color="#2ECC71" emissive="#27AE60" emissiveIntensity={0.35} transparent opacity={0.45} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Chloroplast tube detail */}
      {detail && (
        <mesh>
          <tubeGeometry args={[chloroCurve, 30, 0.03, 8, false]} />
          <meshStandardMaterial color="#2ECC71" emissive="#2ECC71" emissiveIntensity={0.4} roughness={0.4} />
        </mesh>
      )}

      {/* Pyrenoid (dense body inside chloroplast) */}
      <mesh position={[0, -0.15, 0.1]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#8E44AD" emissive="#8E44AD" emissiveIntensity={0.6} roughness={0.4} />
      </mesh>

      {/* Starch Grains */}
      {starchPos.map((pos, i) => (
        <mesh key={`starch-${i}`} position={pos}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#F7DC6F" emissive="#F7DC6F" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Nucleus */}
      <mesh position={[0.15, 0.2, -0.1]}>
        <sphereGeometry args={[0.13, 20, 20]} />
        <meshStandardMaterial color="#2980B9" emissive="#2980B9" emissiveIntensity={0.5} roughness={0.3} />
      </mesh>
      {/* Nucleolus */}
      <mesh position={[0.15, 0.22, -0.08]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#1F618D" emissive="#1F618D" emissiveIntensity={0.6} />
      </mesh>

      {/* Cytoplasm particles */}
      <points geometry={cytoGeo}>
        <pointsMaterial color="#ABEBC6" size={0.015} transparent opacity={0.35} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}
