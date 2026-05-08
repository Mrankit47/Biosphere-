"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function BacteriaMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const flagRef = useRef<THREE.Group>(null!);

  /* Flagellum curve */
  const flagCurve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      pts.push(new THREE.Vector3(Math.sin(t * Math.PI * 4) * 0.15 * (1 + t), -0.7 - t * 2.0, Math.cos(t * Math.PI * 4) * 0.15 * (1 + t)));
    }
    return new THREE.CatmullRomCurve3(pts, false);
  }, []);

  /* Pili */
  const pili = useMemo(() => {
    const p: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    for (let i = 0; i < 40; i++) {
      const phi = Math.acos(2 * (i / 39) - 1) * 0.8 + 0.2;
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 0.38;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = (Math.random() - 0.5) * 1.2;
      const z = r * Math.sin(phi) * Math.sin(theta);
      p.push({ pos: [x, y, z], rot: [Math.atan2(z, x), 0, Math.atan2(Math.sqrt(x * x + z * z), 0.5)] });
    }
    return p;
  }, []);

  /* Nucleoid (tangled DNA) */
  const nucleoidCurve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 80; i++) {
      const t = (i / 80) * Math.PI * 6;
      pts.push(new THREE.Vector3(Math.sin(t * 1.5) * 0.15, (i / 80 - 0.5) * 0.8, Math.cos(t * 1.2) * 0.15));
    }
    return new THREE.CatmullRomCurve3(pts, false);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.1;
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
    if (flagRef.current) {
      flagRef.current.rotation.y = t * 5; // fast spinning flagellum motor
    }
  });

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0.2]}>
      {/* Capsule (outermost layer) */}
      <mesh>
        <capsuleGeometry args={[0.4, 1.2, 24, 32]} />
        <meshStandardMaterial color="#F5CBA7" transparent opacity={0.15} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Cell Wall */}
      <mesh>
        <capsuleGeometry args={[0.35, 1.1, 24, 32]} />
        <meshStandardMaterial color="#F39C12" transparent opacity={0.25} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <capsuleGeometry args={[0.36, 1.12, 12, 16]} />
        <meshBasicMaterial color="#F39C12" wireframe transparent opacity={0.08} />
      </mesh>

      {/* Cell Membrane */}
      <mesh>
        <capsuleGeometry args={[0.3, 1.0, 24, 32]} />
        <meshStandardMaterial color="#E67E22" emissive="#E67E22" emissiveIntensity={0.2} roughness={0.6} />
      </mesh>

      {/* Nucleoid */}
      <mesh>
        <tubeGeometry args={[nucleoidCurve, 100, 0.012, 6, false]} />
        <meshStandardMaterial color="#8E44AD" emissive="#8E44AD" emissiveIntensity={0.6} />
      </mesh>

      {/* Plasmid */}
      <mesh position={[0.15, 0.3, 0.1]} rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[0.08, 0.015, 8, 16]} />
        <meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.7} />
      </mesh>

      {/* Ribosomes */}
      {detail && (() => {
        const ribs: [number, number, number][] = [];
        for (let i = 0; i < 60; i++) {
          ribs.push([(Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.9, (Math.random() - 0.5) * 0.4]);
        }
        return ribs.map((pos, i) => (
          <mesh key={`rib-${i}`} position={pos}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshStandardMaterial color="#BDC3C7" emissive="#BDC3C7" emissiveIntensity={0.4} />
          </mesh>
        ));
      })()}

      {/* Flagellum */}
      <group ref={flagRef}>
        <mesh>
          <tubeGeometry args={[flagCurve, 40, 0.015, 6, false]} />
          <meshStandardMaterial color="#F7DC6F" emissive="#F7DC6F" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* Pili */}
      {detail && pili.map((p, i) => (
        <mesh key={`pili-${i}`} position={p.pos} rotation={p.rot}>
          <cylinderGeometry args={[0.003, 0.003, 0.2, 4]} />
          <meshStandardMaterial color="#F5CBA7" emissive="#F5CBA7" emissiveIntensity={0.3} transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Cytoplasm particles */}
      {(() => {
        const geo = new THREE.BufferGeometry();
        const pts = new Float32Array(150 * 3);
        for (let i = 0; i < 150; i++) {
          pts[i * 3] = (Math.random() - 0.5) * 0.45;
          pts[i * 3 + 1] = (Math.random() - 0.5) * 1.1;
          pts[i * 3 + 2] = (Math.random() - 0.5) * 0.45;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
        return <points geometry={geo}><pointsMaterial color="#F8C471" size={0.012} transparent opacity={0.4} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
      })()}
    </group>
  );
}
