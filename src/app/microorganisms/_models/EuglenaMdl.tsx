"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function EuglenaMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const bodyRef = useRef<THREE.Mesh>(null!);
  const origPos = useRef<Float32Array | null>(null);

  /* Flagellum curve */
  const flagCurve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 25; i++) {
      const t = i / 25;
      pts.push(new THREE.Vector3(Math.sin(t * Math.PI * 3) * 0.08, 0.7 + t * 1.2, Math.cos(t * Math.PI * 3) * 0.08));
    }
    return new THREE.CatmullRomCurve3(pts, false);
  }, []);

  /* Chloroplast positions */
  const chloro = useMemo(() => [
    [0.12, 0.2, 0.08], [-0.1, -0.1, 0.12], [0.08, -0.3, -0.08], [-0.12, 0.35, -0.06], [0.05, 0.0, -0.12],
  ] as [number, number, number][], []);

  /* Pellicle stripes */
  const pellicleStripes = useMemo(() => {
    const curves: THREE.CatmullRomCurve3[] = [];
    for (let s = 0; s < 8; s++) {
      const pts: THREE.Vector3[] = [];
      const theta = (s / 8) * Math.PI * 2;
      for (let i = 0; i <= 20; i++) {
        const y = -0.6 + (i / 20) * 1.2;
        const r = 0.22 + Math.cos((i / 20) * Math.PI) * 0.03;
        pts.push(new THREE.Vector3(Math.cos(theta + y * 1.5) * r, y, Math.sin(theta + y * 1.5) * r));
      }
      curves.push(new THREE.CatmullRomCurve3(pts, false));
    }
    return curves;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.12;
    /* Body wriggle (euglenoid motion) */
    const geo = bodyRef.current.geometry;
    const pos = geo.attributes.position;
    if (!origPos.current) origPos.current = new Float32Array(pos.array as Float32Array);
    const orig = origPos.current;
    for (let i = 0; i < pos.count; i++) {
      const oy = orig[i * 3 + 1];
      const wave = Math.sin(t * 1.5 + oy * 4) * 0.02;
      (pos.array as Float32Array)[i * 3] = orig[i * 3] + wave;
      (pos.array as Float32Array)[i * 3 + 2] = orig[i * 3 + 2] + wave * 0.5;
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <group ref={groupRef}>
      {/* Elongated body */}
      <mesh ref={bodyRef}>
        <capsuleGeometry args={[0.22, 0.9, 24, 32]} />
        <meshStandardMaterial color="#27AE60" emissive="#1ABC9C" emissiveIntensity={0.2} transparent opacity={0.5} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh><capsuleGeometry args={[0.24, 0.92, 12, 16]} /><meshBasicMaterial color="#27AE60" wireframe transparent opacity={0.05} /></mesh>

      {/* Pellicle stripes */}
      {detail && pellicleStripes.map((curve, i) => (
        <mesh key={`pel-${i}`}>
          <tubeGeometry args={[curve, 20, 0.004, 4, false]} />
          <meshStandardMaterial color="#1ABC9C" emissive="#1ABC9C" emissiveIntensity={0.3} transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Flagellum */}
      <mesh>
        <tubeGeometry args={[flagCurve, 30, 0.012, 6, false]} />
        <meshStandardMaterial color="#F7DC6F" emissive="#F7DC6F" emissiveIntensity={0.6} roughness={0.3} />
      </mesh>

      {/* Eyespot (Stigma) */}
      <mesh position={[0.12, 0.55, 0.08]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial color="#E74C3C" emissive="#E74C3C" emissiveIntensity={0.9} />
      </mesh>

      {/* Chloroplasts */}
      {chloro.map((pos, i) => (
        <mesh key={`chl-${i}`} position={pos} rotation={[Math.random(), Math.random(), 0]}>
          <capsuleGeometry args={[0.04, 0.06, 8, 12]} />
          <meshStandardMaterial color="#2ECC71" emissive="#2ECC71" emissiveIntensity={0.4} roughness={0.4} />
        </mesh>
      ))}

      {/* Paramylon Granules */}
      {detail && [[0.08, -0.15, 0.05], [-0.06, 0.1, -0.08], [0.03, -0.35, 0.08]].map((pos, i) => (
        <mesh key={`pg-${i}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#F0E68C" emissive="#F0E68C" emissiveIntensity={0.4} />
        </mesh>
      ))}

      {/* Nucleus */}
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#8E44AD" emissive="#8E44AD" emissiveIntensity={0.5} roughness={0.4} />
      </mesh>

      {/* Contractile Vacuole */}
      <mesh position={[0.1, 0.5, -0.05]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshStandardMaterial color="#3498DB" emissive="#3498DB" emissiveIntensity={0.7} transparent opacity={0.6} />
      </mesh>

      {/* Cytoplasm particles */}
      {(() => {
        const geo = new THREE.BufferGeometry();
        const pts = new Float32Array(120 * 3);
        for (let i = 0; i < 120; i++) {
          pts[i * 3] = (Math.random() - 0.5) * 0.35;
          pts[i * 3 + 1] = (Math.random() - 0.5) * 1.0;
          pts[i * 3 + 2] = (Math.random() - 0.5) * 0.35;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
        return <points geometry={geo}><pointsMaterial color="#ABEBC6" size={0.012} transparent opacity={0.3} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
      })()}
    </group>
  );
}
