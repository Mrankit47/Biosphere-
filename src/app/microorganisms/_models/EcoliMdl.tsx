"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function EcoliMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const flagRef = useRef<THREE.Group>(null!);

  /* Flagella curves */
  const flagCurves = useMemo(() => {
    const curves: THREE.CatmullRomCurve3[] = [];
    for (let f = 0; f < 4; f++) {
      const pts: THREE.Vector3[] = [];
      const aOff = (f / 4) * Math.PI * 2;
      for (let i = 0; i <= 25; i++) {
        const t = (i / 25);
        const x = Math.sin(t * Math.PI * 3 + aOff) * 0.12 * (1 + t);
        const y = -0.85 - t * 1.8;
        const z = Math.cos(t * Math.PI * 3 + aOff) * 0.12 * (1 + t);
        pts.push(new THREE.Vector3(x, y, z));
      }
      curves.push(new THREE.CatmullRomCurve3(pts, false));
    }
    return curves;
  }, []);

  /* Pili positions */
  const pili = useMemo(() => {
    const p: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    for (let i = 0; i < 24; i++) {
      const phi = Math.acos(2 * (i / 23) - 1) * 0.7 + 0.3;
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.32;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = (Math.random() - 0.5) * 1.0;
      const z = r * Math.sin(phi) * Math.sin(theta);
      p.push({ pos: [x, y, z], rot: [Math.atan2(z, x), 0, Math.atan2(Math.sqrt(x * x + z * z), 0.5)] });
    }
    return p;
  }, []);

  /* Ribosome positions */
  const ribosomes = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 40; i++) {
      pts.push([(Math.random() - 0.5) * 0.45, (Math.random() - 0.5) * 1.0, (Math.random() - 0.5) * 0.45]);
    }
    return pts;
  }, []);

  /* Nucleoid curve */
  const nucleoidCurve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 50; i++) {
      const t = (i / 50) * Math.PI * 4;
      pts.push(new THREE.Vector3(Math.sin(t) * 0.12, (i / 50 - 0.5) * 0.6, Math.cos(t) * 0.12));
    }
    return new THREE.CatmullRomCurve3(pts, false);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
    groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.08;
    /* Animate flagella wave */
    if (flagRef.current) {
      flagRef.current.children.forEach((child, i) => {
        child.rotation.y = Math.sin(t * 3 + i * 0.8) * 0.15;
      });
    }
  });

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0.1]}>
      {/* Cell envelope (outer) */}
      <mesh>
        <capsuleGeometry args={[0.35, 1.0, 24, 32]} />
        <meshStandardMaterial color="#F5B041" transparent opacity={0.2} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Cell body */}
      <mesh>
        <capsuleGeometry args={[0.3, 0.95, 24, 32]} />
        <meshStandardMaterial color="#EF9F27" emissive="#EF9F27" emissiveIntensity={0.2} roughness={0.5} />
      </mesh>

      {/* Wireframe */}
      <mesh>
        <capsuleGeometry args={[0.36, 1.02, 12, 16]} />
        <meshBasicMaterial color="#EF9F27" wireframe transparent opacity={0.04} />
      </mesh>

      {/* Nucleoid DNA */}
      <mesh>
        <tubeGeometry args={[nucleoidCurve, 60, 0.015, 6, false]} />
        <meshStandardMaterial color="#8E44AD" emissive="#8E44AD" emissiveIntensity={0.6} roughness={0.4} />
      </mesh>

      {/* Plasmid */}
      <mesh position={[0.15, -0.15, 0.12]} rotation={[0.5, 0.3, 0]}>
        <torusGeometry args={[0.06, 0.012, 8, 16]} />
        <meshStandardMaterial color="#FF6B6B" emissive="#FF6B6B" emissiveIntensity={0.7} />
      </mesh>

      {/* Ribosomes */}
      {detail && ribosomes.map((pos, i) => (
        <mesh key={`rib-${i}`} position={pos}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial color="#D5D8DC" emissive="#D5D8DC" emissiveIntensity={0.4} />
        </mesh>
      ))}

      {/* Cytoplasm particles */}
      {(() => {
        const geo = new THREE.BufferGeometry();
        const pts = new Float32Array(120 * 3);
        for (let i = 0; i < 120; i++) {
          pts[i * 3] = (Math.random() - 0.5) * 0.5;
          pts[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
          pts[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
        return <points geometry={geo}><pointsMaterial color="#FAD7A0" size={0.012} transparent opacity={0.35} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
      })()}

      {/* Flagella */}
      <group ref={flagRef}>
        {flagCurves.map((curve, i) => (
          <mesh key={`flag-${i}`}>
            <tubeGeometry args={[curve, 30, 0.01, 6, false]} />
            <meshStandardMaterial color="#F0E68C" emissive="#F0E68C" emissiveIntensity={0.4} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Pili */}
      {detail && pili.map((p, i) => (
        <mesh key={`pili-${i}`} position={p.pos} rotation={p.rot}>
          <cylinderGeometry args={[0.004, 0.004, 0.15, 4]} />
          <meshStandardMaterial color="#E8DAEF" emissive="#E8DAEF" emissiveIntensity={0.3} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}
