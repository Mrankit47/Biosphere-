"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DNAHelixMdl({ detail = false }: { detail?: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const TURNS = 4;
  const STEPS = 120;
  const RADIUS = 0.35;
  const RISE = 0.06;

  /* Two backbone curves */
  const { backbone1, backbone2, basePairs } = useMemo(() => {
    const b1pts: THREE.Vector3[] = [];
    const b2pts: THREE.Vector3[] = [];
    const pairs: { p1: THREE.Vector3; p2: THREE.Vector3; colorA: string; colorB: string }[] = [];
    const colors = [
      { a: "#E74C3C", b: "#3498DB" }, // A-T
      { a: "#3498DB", b: "#E74C3C" }, // T-A
      { a: "#2ECC71", b: "#F1C40F" }, // G-C
      { a: "#F1C40F", b: "#2ECC71" }, // C-G
    ];
    for (let i = 0; i <= STEPS; i++) {
      const t = (i / STEPS) * Math.PI * 2 * TURNS;
      const y = (i - STEPS / 2) * RISE;
      b1pts.push(new THREE.Vector3(Math.cos(t) * RADIUS, y, Math.sin(t) * RADIUS));
      b2pts.push(new THREE.Vector3(Math.cos(t + Math.PI) * RADIUS, y, Math.sin(t + Math.PI) * RADIUS));
      if (i % 4 === 0 && i < STEPS) {
        const c = colors[Math.floor(Math.random() * 4)];
        pairs.push({
          p1: new THREE.Vector3(Math.cos(t) * RADIUS, y, Math.sin(t) * RADIUS),
          p2: new THREE.Vector3(Math.cos(t + Math.PI) * RADIUS, y, Math.sin(t + Math.PI) * RADIUS),
          colorA: c.a,
          colorB: c.b,
        });
      }
    }
    return {
      backbone1: new THREE.CatmullRomCurve3(b1pts, false),
      backbone2: new THREE.CatmullRomCurve3(b2pts, false),
      basePairs: pairs,
    };
  }, []);

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Backbone 1 */}
      <mesh>
        <tubeGeometry args={[backbone1, STEPS, 0.04, 8, false]} />
        <meshStandardMaterial color="#5DADE2" emissive="#5DADE2" emissiveIntensity={0.4} roughness={0.3} />
      </mesh>
      {/* Backbone 2 */}
      <mesh>
        <tubeGeometry args={[backbone2, STEPS, 0.04, 8, false]} />
        <meshStandardMaterial color="#5DADE2" emissive="#5DADE2" emissiveIntensity={0.4} roughness={0.3} />
      </mesh>

      {/* Base pairs (rungs) */}
      {basePairs.map((pair, i) => {
        const mid = pair.p1.clone().lerp(pair.p2, 0.5);
        const dir = pair.p2.clone().sub(pair.p1);
        const len = dir.length();
        const angle = Math.atan2(dir.z, dir.x);

        return (
          <group key={i} position={[mid.x, mid.y, mid.z]}>
            {/* Left half (base A) */}
            <mesh position={[-(len * 0.25) * Math.cos(angle), 0, -(len * 0.25) * Math.sin(angle)]} rotation={[0, angle, 0]}>
              <cylinderGeometry args={[0.025, 0.025, len * 0.45, 6]} />
              <meshStandardMaterial color={pair.colorA} emissive={pair.colorA} emissiveIntensity={0.5} roughness={0.3} />
            </mesh>
            {/* Right half (base B) */}
            <mesh position={[(len * 0.25) * Math.cos(angle), 0, (len * 0.25) * Math.sin(angle)]} rotation={[0, angle, 0]}>
              <cylinderGeometry args={[0.025, 0.025, len * 0.45, 6]} />
              <meshStandardMaterial color={pair.colorB} emissive={pair.colorB} emissiveIntensity={0.5} roughness={0.3} />
            </mesh>
            {/* Hydrogen bond (center dots) */}
            {detail && (
              <mesh>
                <sphereGeometry args={[0.015, 6, 6]} />
                <meshStandardMaterial color="#FF69B4" emissive="#FF69B4" emissiveIntensity={0.8} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Sugar molecules on backbone (detail) */}
      {detail && (() => {
        const sugars: [number, number, number][] = [];
        for (let i = 0; i < STEPS; i += 8) {
          const t = (i / STEPS) * Math.PI * 2 * TURNS;
          const y = (i - STEPS / 2) * RISE;
          sugars.push([Math.cos(t) * RADIUS, y, Math.sin(t) * RADIUS]);
          sugars.push([Math.cos(t + Math.PI) * RADIUS, y, Math.sin(t + Math.PI) * RADIUS]);
        }
        return sugars.map((pos, i) => (
          <mesh key={`sug-${i}`} position={pos}>
            <dodecahedronGeometry args={[0.025, 0]} />
            <meshStandardMaterial color="#AED6F1" emissive="#5DADE2" emissiveIntensity={0.3} />
          </mesh>
        ));
      })()}

      {/* Ambient glow particles */}
      {(() => {
        const geo = new THREE.BufferGeometry();
        const pts = new Float32Array(100 * 3);
        for (let i = 0; i < 100; i++) {
          pts[i * 3] = (Math.random() - 0.5) * 1.5;
          pts[i * 3 + 1] = (Math.random() - 0.5) * 8;
          pts[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
        return <points geometry={geo}><pointsMaterial color="#FF69B4" size={0.015} transparent opacity={0.25} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
      })()}
    </group>
  );
}
