"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  MeshTransmissionMaterial,
  Float,
} from "@react-three/drei";
import * as THREE from "three";
import { BackLink } from "@/components/ds";

/* ── Base pair data ────────────────────────────────────────── */
const BASE_SEQ = [
  "AT","GC","GC","AT","GC","AT","AT","GC","AT","GC",
  "AT","GC","GC","AT","AT","GC","AT","GC","AT","AT","GC","GC","AT",
] as const;
const BASE_PAIRS = BASE_SEQ;
const PAIR_COLORS: Record<string, string> = { AT: "#EF4444", GC: "#8B5CF6" };
const BASE_COLORS = { A: "#EF4444", T: "#F59E0B", G: "#8B5CF6", C: "#3B82F6" };
const PAIR_INFO: Record<string, { full: string; bonds: number; desc: string }> = {
  AT: { full: "Adenine — Thymine", bonds: 2, desc: "Connected by 2 hydrogen bonds. Adenine always pairs with Thymine in DNA." },
  GC: { full: "Guanine — Cytosine", bonds: 3, desc: "Connected by 3 hydrogen bonds. Stronger bond than A-T pairing." },
};
const CODONS: Record<string, string> = { ATG: "Methionine (Start)", TAA: "Stop", TAG: "Stop", TGA: "Stop", GCT: "Alanine", GCA: "Alanine", TTC: "Phenylalanine", TTT: "Phenylalanine", GAA: "Glutamic Acid", GAG: "Glutamic Acid", AAA: "Lysine", AAG: "Lysine", GGT: "Glycine", GGA: "Glycine", CAA: "Glutamine", GTT: "Valine", TCT: "Serine", CCT: "Proline", ACT: "Threonine", TGT: "Cysteine", TAT: "Tyrosine", CAT: "Histidine", AAT: "Asparagine", GAT: "Aspartic Acid", TGG: "Tryptophan" };
const MUTATIONS = ["Substitution", "Insertion", "Deletion"] as const;

const POINTS_PER_STRAND = 200;
const RUNGS_EVERY = 9;
const HELIX_RADIUS = 1.6;
const HELIX_RISE = 0.22;
const HELIX_TURNS = 6;

/* ── Helper: create smooth tube from points ─────────────────── */
function createHelixCurve(offset: number, separation: number) {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < POINTS_PER_STRAND; i++) {
    const t = (i / POINTS_PER_STRAND) * Math.PI * 2 * HELIX_TURNS;
    const y = (i - POINTS_PER_STRAND / 2) * HELIX_RISE;
    const r = HELIX_RADIUS;
    const sepX = offset > 0 ? separation : -separation;
    points.push(new THREE.Vector3(
      Math.cos(t + offset) * r + sepX * Math.cos(t + offset) * 0.3,
      y,
      Math.sin(t + offset) * r + sepX * Math.sin(t + offset) * 0.3,
    ));
  }
  return new THREE.CatmullRomCurve3(points);
}

/* ── Phosphate Sphere (backbone node) ──────────────────────── */
function PhosphateSphere({ position, color, emissive }: { position: THREE.Vector3; color: string; emissive: string }) {
  return (
    <mesh position={position} castShadow>
      <sphereGeometry args={[0.14, 16, 16]} />
      <meshPhysicalMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.15}
        roughness={0.25}
        metalness={0.1}
        clearcoat={0.8}
        clearcoatRoughness={0.15}
      />
    </mesh>
  );
}

/* ── Backbone Tube Strand ──────────────────────────────────── */
function BackboneStrand({ curve, color, emissive }: { curve: THREE.CatmullRomCurve3; color: string; emissive: string }) {
  const tubeGeom = useMemo(() => new THREE.TubeGeometry(curve, 300, 0.08, 12, false), [curve]);
  return (
    <mesh geometry={tubeGeom} castShadow receiveShadow>
      <meshPhysicalMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.12}
        roughness={0.3}
        metalness={0.05}
        clearcoat={0.6}
        clearcoatRoughness={0.2}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

/* ── Nucleotide Base (half of a base pair) ────────────────── */
function NucleotideBase({
  position,
  rotation,
  length,
  color,
  onClick,
}: {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  length: number;
  color: string;
  onClick?: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <cylinderGeometry args={[0.065, 0.065, length, 12]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.6 : 0.2}
        roughness={0.35}
        metalness={0.15}
        clearcoat={0.5}
        clearcoatRoughness={0.3}
      />
    </mesh>
  );
}

/* ── Hydrogen Bond (dashed look between base pairs) ───────── */
function HydrogenBond({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) {
  const mid = start.clone().add(end).multiplyScalar(0.5);
  const dir = end.clone().sub(start);
  const len = dir.length();
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());

  // Create 3 small dashes for hydrogen bond visualization
  const dashes = [];
  const dashCount = 3;
  const dashLen = len / (dashCount * 2 + 1);

  for (let i = 0; i < dashCount; i++) {
    const offset = (i - (dashCount - 1) / 2) * dashLen * 2;
    const pos = mid.clone().add(dir.clone().multiplyScalar(offset));
    dashes.push(
      <mesh key={i} position={pos} quaternion={quat}>
        <cylinderGeometry args={[0.015, 0.015, dashLen, 6]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          emissive="#88CCFF"
          emissiveIntensity={0.3}
          roughness={0.5}
          metalness={0.0}
          transparent
          opacity={0.5}
        />
      </mesh>
    );
  }
  return <>{dashes}</>;
}

/* ── Ambient Particles ─────────────────────────────────────── */
function AmbientParticles({ count = 200 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { positions, speeds } = useMemo(() => {
    const pos: [number, number, number][] = [];
    const spd: number[] = [];
    for (let i = 0; i < count; i++) {
      pos.push([
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
      ]);
      spd.push(0.002 + Math.random() * 0.008);
    }
    return { positions: pos, speeds: spd };
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const [x, y, z] = positions[i];
      dummy.position.set(
        x + Math.sin(t * speeds[i] * 10 + i) * 0.5,
        y + Math.cos(t * speeds[i] * 8 + i * 0.5) * 0.3,
        z + Math.sin(t * speeds[i] * 6 + i * 0.3) * 0.4,
      );
      const scale = 0.02 + Math.sin(t * 2 + i) * 0.01;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#39FF14" transparent opacity={0.25} />
    </instancedMesh>
  );
}

/* ── DNA Helix 3D (Realistic) ──────────────────────────────── */
function DnaHelix({ separation, onRungClick }: { separation: number; onRungClick: (i: number) => void }) {
  const groupRef = useRef<THREE.Group>(null!);

  const helixData = useMemo(() => {
    const s1Points: THREE.Vector3[] = [];
    const s2Points: THREE.Vector3[] = [];
    const rungs: {
      pairIdx: number;
      s1Pos: THREE.Vector3;
      s2Pos: THREE.Vector3;
      midY: number;
    }[] = [];

    for (let i = 0; i < POINTS_PER_STRAND; i++) {
      const t = (i / POINTS_PER_STRAND) * Math.PI * 2 * HELIX_TURNS;
      const y = (i - POINTS_PER_STRAND / 2) * HELIX_RISE;
      const r = HELIX_RADIUS;
      s1Points.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r));
      s2Points.push(new THREE.Vector3(Math.cos(t + Math.PI) * r, y, Math.sin(t + Math.PI) * r));

      if (i % RUNGS_EVERY === 0 && i > 0 && i < POINTS_PER_STRAND - 1) {
        rungs.push({
          pairIdx: Math.floor(i / RUNGS_EVERY) % BASE_PAIRS.length,
          s1Pos: s1Points[i].clone(),
          s2Pos: s2Points[i].clone(),
          midY: y,
        });
      }
    }

    // Phosphate positions (every 5th point along backbone)
    const phosphates1: THREE.Vector3[] = [];
    const phosphates2: THREE.Vector3[] = [];
    for (let i = 0; i < POINTS_PER_STRAND; i += 5) {
      phosphates1.push(s1Points[i].clone());
      phosphates2.push(s2Points[i].clone());
    }

    return { s1Points, s2Points, rungs, phosphates1, phosphates2 };
  }, []);

  // Create curves for tube geometry
  const curve1 = useMemo(() => {
    const pts = helixData.s1Points.map(p => {
      const sep = separation * 0.3;
      return new THREE.Vector3(
        p.x + sep * (p.x / HELIX_RADIUS) * 0.5,
        p.y,
        p.z + sep * (p.z / HELIX_RADIUS) * 0.5
      );
    });
    return new THREE.CatmullRomCurve3(pts);
  }, [helixData.s1Points, separation]);

  const curve2 = useMemo(() => {
    const pts = helixData.s2Points.map(p => {
      const sep = separation * 0.3;
      return new THREE.Vector3(
        p.x - sep * (p.x / HELIX_RADIUS) * 0.5,
        p.y,
        p.z - sep * (p.z / HELIX_RADIUS) * 0.5
      );
    });
    return new THREE.CatmullRomCurve3(pts);
  }, [helixData.s2Points, separation]);

  useFrame((state) => {
    groupRef.current.rotation.y += 0.003;
  });

  return (
    <group ref={groupRef}>
      {/* Strand 1 — smooth tube (green/teal) */}
      <BackboneStrand curve={curve1} color="#00E676" emissive="#00C853" />
      {/* Strand 2 — smooth tube (blue/cyan) */}
      <BackboneStrand curve={curve2} color="#29B6F6" emissive="#0288D1" />

      {/* Phosphate groups on strand 1 */}
      {helixData.phosphates1.map((p, i) => {
        const sep = separation * 0.3;
        const pos = new THREE.Vector3(
          p.x + sep * (p.x / HELIX_RADIUS) * 0.5,
          p.y,
          p.z + sep * (p.z / HELIX_RADIUS) * 0.5
        );
        return (
          <PhosphateSphere
            key={`p1-${i}`}
            position={pos}
            color="#00E676"
            emissive="#00C853"
          />
        );
      })}

      {/* Phosphate groups on strand 2 */}
      {helixData.phosphates2.map((p, i) => {
        const sep = separation * 0.3;
        const pos = new THREE.Vector3(
          p.x - sep * (p.x / HELIX_RADIUS) * 0.5,
          p.y,
          p.z - sep * (p.z / HELIX_RADIUS) * 0.5
        );
        return (
          <PhosphateSphere
            key={`p2-${i}`}
            position={pos}
            color="#29B6F6"
            emissive="#0288D1"
          />
        );
      })}

      {/* Base pair rungs with hydrogen bonds */}
      {helixData.rungs.map((rung, i) => {
        const pair = BASE_PAIRS[rung.pairIdx];
        const bases = pair.split("") as ("A" | "T" | "G" | "C")[];
        const sep = separation * 0.3;

        // Adjust positions for separation
        const s1 = new THREE.Vector3(
          rung.s1Pos.x + sep * (rung.s1Pos.x / HELIX_RADIUS) * 0.5,
          rung.s1Pos.y,
          rung.s1Pos.z + sep * (rung.s1Pos.z / HELIX_RADIUS) * 0.5
        );
        const s2 = new THREE.Vector3(
          rung.s2Pos.x - sep * (rung.s2Pos.x / HELIX_RADIUS) * 0.5,
          rung.s2Pos.y,
          rung.s2Pos.z - sep * (rung.s2Pos.z / HELIX_RADIUS) * 0.5
        );

        const mid = s1.clone().add(s2).multiplyScalar(0.5);
        const dir = s2.clone().sub(s1);
        const fullLen = dir.length();
        const halfLen = fullLen * 0.42; // each base is 42% of rung
        const dirNorm = dir.clone().normalize();

        // Positions for each half of the base pair
        const base1Pos = s1.clone().add(dirNorm.clone().multiplyScalar(halfLen / 2));
        const base2Pos = s2.clone().sub(dirNorm.clone().multiplyScalar(halfLen / 2));

        // Rotation to align cylinder along the rung direction
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dirNorm
        );
        const euler = new THREE.Euler().setFromQuaternion(quat);

        // Hide rungs when too separated
        const rungOpacity = separation < 0.5 ? 1 : Math.max(0, 1 - (separation - 0.5) * 1.5);
        if (rungOpacity <= 0) return null;

        // Hydrogen bond points (between the two bases)
        const bondStart = s1.clone().add(dirNorm.clone().multiplyScalar(halfLen));
        const bondEnd = s2.clone().sub(dirNorm.clone().multiplyScalar(halfLen));
        const bondCount = PAIR_INFO[pair].bonds;

        return (
          <group key={`rung-${i}`}>
            {/* Base 1 (from strand 1 side) */}
            <NucleotideBase
              position={base1Pos}
              rotation={euler}
              length={halfLen}
              color={BASE_COLORS[bases[0]]}
              onClick={() => onRungClick(rung.pairIdx)}
            />
            {/* Nucleotide sphere at strand junction */}
            <mesh position={s1} castShadow>
              <sphereGeometry args={[0.11, 12, 12]} />
              <meshPhysicalMaterial
                color={BASE_COLORS[bases[0]]}
                emissive={BASE_COLORS[bases[0]]}
                emissiveIntensity={0.3}
                roughness={0.3}
                metalness={0.1}
                clearcoat={0.7}
              />
            </mesh>

            {/* Base 2 (from strand 2 side) */}
            <NucleotideBase
              position={base2Pos}
              rotation={euler}
              length={halfLen}
              color={BASE_COLORS[bases[1]]}
              onClick={() => onRungClick(rung.pairIdx)}
            />
            {/* Nucleotide sphere at strand junction */}
            <mesh position={s2} castShadow>
              <sphereGeometry args={[0.11, 12, 12]} />
              <meshPhysicalMaterial
                color={BASE_COLORS[bases[1]]}
                emissive={BASE_COLORS[bases[1]]}
                emissiveIntensity={0.3}
                roughness={0.3}
                metalness={0.1}
                clearcoat={0.7}
              />
            </mesh>

            {/* Hydrogen bonds between bases */}
            {Array.from({ length: bondCount }).map((_, bi) => {
              // Offset bonds perpendicular to the rung direction
              const perpOffset = (bi - (bondCount - 1) / 2) * 0.06;
              const perp = new THREE.Vector3(-dirNorm.z, 0, dirNorm.x).normalize();
              const bStart = bondStart.clone().add(perp.clone().multiplyScalar(perpOffset));
              const bEnd = bondEnd.clone().add(perp.clone().multiplyScalar(perpOffset));
              return <HydrogenBond key={`hb-${i}-${bi}`} start={bStart} end={bEnd} />;
            })}
          </group>
        );
      })}

      {/* Ambient floating particles */}
      <AmbientParticles count={150} />
    </group>
  );
}

/* ── Minor/Major Groove Glow Lines ────────────────────────── */
function GrooveGlow() {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.003;
  });

  return (
    <group ref={ref}>
      {/* Soft glow ring at top and bottom */}
      {[-1, 1].map((sign) => (
        <mesh key={sign} position={[0, sign * (POINTS_PER_STRAND * HELIX_RISE * 0.45), 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[HELIX_RADIUS - 0.3, HELIX_RADIUS + 0.3, 64]} />
          <meshBasicMaterial color="#39FF14" transparent opacity={0.03} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/* ── 3D Scene ──────────────────────────────────────────────── */
function Scene({ separation, onRungClick }: { separation: number; onRungClick: (i: number) => void }) {
  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.25} color="#E0F7FA" />

      {/* Key light — warm white from top-right */}
      <directionalLight
        position={[6, 10, 5]}
        intensity={1.8}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill light — cool blue from left */}
      <directionalLight
        position={[-5, -3, 4]}
        intensity={0.6}
        color="#64B5F6"
      />

      {/* Rim light — green accent from behind */}
      <pointLight position={[0, 5, -8]} intensity={0.8} color="#00E676" distance={25} decay={2} />
      <pointLight position={[0, -5, -6]} intensity={0.4} color="#29B6F6" distance={20} decay={2} />

      {/* Accent spot lights */}
      <spotLight
        position={[3, 8, 6]}
        angle={0.3}
        penumbra={0.8}
        intensity={1.0}
        color="#B2FF59"
        castShadow
      />
      <spotLight
        position={[-4, -6, 5]}
        angle={0.4}
        penumbra={0.9}
        intensity={0.5}
        color="#80D8FF"
      />

      {/* Environment for reflections */}
      <Environment files="/hdr/dikhololo_night_1k.hdr" />

      {/* DNA Model */}
      <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.3}>
        <DnaHelix separation={separation} onRungClick={onRungClick} />
      </Float>

      <GrooveGlow />

      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={22}
        enableDamping
        dampingFactor={0.05}
        autoRotate={false}
      />
    </>
  );
}

/* ── Info Cards ────────────────────────────────────────────── */
const CARDS = [
  { title: "Structure", emoji: "🧬", color: "#39FF14", text: "DNA is a double helix of two antiparallel sugar-phosphate backbones connected by complementary base pairs. It twists once every 10 base pairs (3.4 nm)." },
  { title: "Base Pairing", emoji: "🔗", color: "#EF4444", text: "A-T connected by 2 hydrogen bonds; G-C by 3. Chargaff's rule: A=T and G=C in amount. This complementarity enables faithful replication." },
  { title: "Genes", emoji: "📖", color: "#3B82F6", text: "Segments of DNA coding for proteins. Contain promoters, exons (coding), introns (non-coding), and terminators. Humans have ~20,000 genes." },
  { title: "Replication", emoji: "🔄", color: "#8B5CF6", text: "Semiconservative: each strand serves as template. DNA polymerase adds nucleotides at ~1,000 bases/second with 1 error per billion bases." },
  { title: "Mutations", emoji: "⚡", color: "#F59E0B", text: "Changes in base sequence. Substitution (swap), insertion (add), deletion (remove). Can be silent, missense (wrong amino acid), or nonsense (premature stop)." },
  { title: "Human Genome", emoji: "🌍", color: "#1D9E75", text: "3.2 billion base pairs, ~20,000 protein-coding genes. 99.9% identical between humans. If stretched out, DNA from one cell = 2 meters long." },
];
const DNA_FACTS = [
  "If stretched out, DNA from one cell = 2 meters long",
  "DNA replicates at 1,000 base pairs per second",
  "99.9% of human DNA is identical between people",
  "Humans share 50% DNA with bananas",
  "Your body replaces ~3.8 million cells per second, each copying all DNA",
];

/* ── Page ───────────────────────────────────────────────────── */
export default function DnaGeneticsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [separation, setSeparation] = useState(0);
  const [selectedPair, setSelectedPair] = useState<number | null>(null);
  const [codonMode, setCodonMode] = useState(false);
  const [mutationResult, setMutationResult] = useState<{type:string;pos:number;before:string;after:string;effect:string}|null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const t = Math.min(scrollTop / 400, 1);
      setSeparation(t * 3);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleRungClick = useCallback((i: number) => {
    setSelectedPair(prev => (prev === i ? null : i));
  }, []);

  const simulateMutation = useCallback(() => {
    const type = MUTATIONS[Math.floor(Math.random() * MUTATIONS.length)];
    const pos = Math.floor(Math.random() * BASE_PAIRS.length);
    const before = BASE_PAIRS[pos];
    const after = before === "AT" ? "GC" : "AT";
    const effects = ["Silent — no amino acid change", "Missense — different amino acid produced", "Nonsense — premature stop codon created"];
    setMutationResult({ type, pos, before, after, effect: effects[Math.floor(Math.random() * effects.length)] });
  }, []);

  const pairData = selectedPair !== null ? BASE_PAIRS[selectedPair] : null;

  return (
    <div ref={containerRef} style={S.root}>
      <BackLink href="/" label="Home" />
      {/* 3D Canvas — sticky hero */}
      <div style={S.canvasSection}>
        <div style={S.canvasWrap}>
          {mounted && (
            <Canvas
              camera={{ position: [0, 2, 14], fov: 42 }}
              dpr={[1, 2]}
              gl={{
                antialias: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.1,
              }}
              shadows
              style={{ background: "linear-gradient(180deg, #020808 0%, #050A05 40%, #030606 100%)" }}
            >
              <Scene separation={separation} onRungClick={handleRungClick} />
            </Canvas>
          )}
          {/* Vignette overlay */}
          <div style={S.vignette} />
        </div>

        {/* Header overlay */}
        <div style={S.header}>
          <h1 style={S.title}>🧬 DNA & Genetics</h1>
          <p style={S.subtitle}>Scroll to unzip the double helix</p>
          <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "center" }}>
            <button onClick={() => setCodonMode(!codonMode)} style={{
              padding: "8px 18px",
              borderRadius: 10,
              border: codonMode ? "1px solid rgba(57,255,20,0.4)" : "1px solid rgba(255,255,255,0.08)",
              background: codonMode ? "rgba(57,255,20,0.1)" : "rgba(5,10,5,0.6)",
              color: codonMode ? "#39FF14" : "rgba(200,245,200,0.5)",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              pointerEvents: "auto" as const,
              backdropFilter: "blur(12px)",
              transition: "all 0.3s ease",
            }}>
              {codonMode ? "Hide Codons" : "Highlight Codons"}
            </button>
            <button onClick={simulateMutation} style={{
              padding: "8px 18px",
              borderRadius: 10,
              border: "1px solid rgba(245,158,11,0.25)",
              background: "rgba(245,158,11,0.06)",
              color: "#F59E0B",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              pointerEvents: "auto" as const,
              backdropFilter: "blur(12px)",
              transition: "all 0.3s ease",
            }}>
              ⚡ Simulate Mutation
            </button>
          </div>
        </div>

        {/* Mutation Result */}
        {mutationResult && (
          <div style={{
            position: "absolute", bottom: 80, left: "50%", transform: "translateX(-50%)", zIndex: 15,
            padding: "14px 24px", borderRadius: 14,
            background: "rgba(5,10,5,0.85)", border: "1px solid rgba(245,158,11,0.25)",
            backdropFilter: "blur(16px)", maxWidth: 360, textAlign: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(245,158,11,0.05)",
          }}>
            <div style={{ fontSize: "0.7rem", color: "#F59E0B", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 6 }}>⚡ {mutationResult.type} Mutation</div>
            <div style={{ fontSize: "0.85rem", color: "rgba(200,245,200,0.85)", marginBottom: 6 }}>
              Base pair #{mutationResult.pos + 1}: <span style={{ color: PAIR_COLORS[mutationResult.before], fontWeight: 700 }}>{mutationResult.before}</span> → <span style={{ color: PAIR_COLORS[mutationResult.after], fontWeight: 700 }}>{mutationResult.after}</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(200,245,200,0.55)" }}>{mutationResult.effect}</div>
            <button onClick={() => setMutationResult(null)} style={{ marginTop: 10, padding: "5px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "rgba(200,245,200,0.5)", fontSize: "0.65rem", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s ease" }}>Dismiss</button>
          </div>
        )}

        {/* Scroll indicator */}
        <div style={S.scrollHint}>
          <div style={S.scrollArrow}>↓</div>
          <span>Scroll down</span>
        </div>

        {/* Pair Sidebar */}
        <div style={{ ...S.sidebar, transform: pairData ? "translateX(0)" : "translateX(110%)", opacity: pairData ? 1 : 0 }}>
          {pairData && (
            <>
              <button style={S.sideClose} onClick={() => setSelectedPair(null)}>✕</button>
              <div style={{ ...S.pairDot, background: PAIR_COLORS[pairData], boxShadow: `0 0 24px ${PAIR_COLORS[pairData]}40, 0 0 60px ${PAIR_COLORS[pairData]}15` }} />
              <h3 style={{ ...S.pairTitle, color: PAIR_COLORS[pairData] }}>{PAIR_INFO[pairData].full}</h3>
              <div style={S.pairDivider} />
              <p style={S.pairDesc}>{PAIR_INFO[pairData].desc}</p>
              <div style={S.pairBadge}>
                <span style={{ fontSize: "0.65rem", textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "rgba(200,245,200,0.4)", fontWeight: 600 }}>Bond Type</span>
                <span style={{ color: "rgba(200,245,200,0.85)", fontSize: "0.85rem" }}>{PAIR_INFO[pairData].bonds} Hydrogen Bonds</span>
              </div>
              <div style={S.pairBadge}>
                <span style={{ fontSize: "0.65rem", textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "rgba(200,245,200,0.4)", fontWeight: 600 }}>Position</span>
                <span style={{ color: "rgba(200,245,200,0.85)", fontSize: "0.85rem" }}>Base pair #{(selectedPair||0) + 1} of {BASE_PAIRS.length}</span>
              </div>
              {/* Base colors */}
              <div style={{ display: "flex", gap: 12, width: "100%", justifyContent: "center" }}>
                {pairData.split("").map((b, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: BASE_COLORS[b as keyof typeof BASE_COLORS], display: "inline-block", boxShadow: `0 0 8px ${BASE_COLORS[b as keyof typeof BASE_COLORS]}40` }} />
                    <span style={{ fontSize: "0.8rem", color: "rgba(200,245,200,0.8)", fontWeight: 600 }}>{b === "A" ? "Adenine" : b === "T" ? "Thymine" : b === "G" ? "Guanine" : "Cytosine"}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info Cards Section */}
      <div style={S.cardsSection}>
        <h2 style={S.cardsTitle}>Understanding DNA</h2>
        <div style={S.cardsGrid}>
          {CARDS.map((card, i) => (
            <div key={i} style={{ ...S.card, borderColor: `${card.color}25` }}>
              <div style={{ fontSize: "1.6rem", marginBottom: "8px" }}>{card.emoji}</div>
              <h3 style={{ ...S.cardTitle, color: card.color }}>{card.title}</h3>
              <p style={S.cardText}>{card.text}</p>
            </div>
          ))}
        </div>

        {/* Gene Structure Diagram */}
        <div style={{ maxWidth: 1000, margin: "40px auto 0", padding: "24px", borderRadius: 16, background: "var(--ds-surface-subtle)", border: "1px solid var(--ds-border-muted)" }}>
          <h3 style={{ color: "var(--ds-accent)", fontSize: "1.1rem", fontWeight: 700, marginBottom: 16, margin: "0 0 16px" }}>Gene Structure</h3>
          <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", height: 40 }}>
            {[
              { label: "Promoter", color: "#F59E0B", flex: 1 },
              { label: "Exon 1", color: "var(--ds-accent)", flex: 1.5 },
              { label: "Intron", color: "#4B5563", flex: 2 },
              { label: "Exon 2", color: "var(--ds-accent)", flex: 1.5 },
              { label: "Intron", color: "#4B5563", flex: 1.5 },
              { label: "Exon 3", color: "var(--ds-accent)", flex: 1 },
              { label: "Terminator", color: "#EF4444", flex: 0.8 },
            ].map((seg, i) => (
              <div key={i} style={{ flex: seg.flex, background: `${seg.color}25`, borderRight: "1px solid rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", color: seg.color === "var(--ds-accent)" ? "var(--ds-accent)" : seg.color, fontWeight: 700, letterSpacing: "0.05em" }}>{seg.label}</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
            {[
              { color: "#F59E0B", label: "Promoter — RNA polymerase binding site" },
              { color: "var(--ds-accent)", label: "Exons — Coding regions (become protein)" },
              { color: "#4B5563", label: "Introns — Non-coding (spliced out)" },
              { color: "#EF4444", label: "Terminator — Stop signal" },
            ].map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: l.color, flexShrink: 0 }} />
                <span style={{ fontSize: "0.7rem", color: "var(--ds-fg-subtle)" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Full Codon Table */}
        <div style={S.codonSection}>
          <h3 style={{ color: "var(--ds-accent)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "12px", margin: "0 0 12px" }}>Genetic Code — Codon Table</h3>
          <div style={S.codonGrid}>
            {Object.entries(CODONS).map(([codon, amino], i) => {
              const isStop = amino === "Stop";
              const isStart = codon === "ATG";
              return (
                <div key={i} style={{ ...S.codonCard, borderColor: isStop ? "#EF444425" : isStart ? "var(--ds-border-accent)" : "var(--ds-border-muted)" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "1rem", fontWeight: 700, color: isStop ? "#EF4444" : isStart ? "var(--ds-accent)" : "var(--ds-accent-muted)", letterSpacing: "0.15em" }}>{codon}</span>
                  <span style={{ fontSize: "0.68rem", color: "var(--ds-fg-subtle)" }}>{amino}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Molecular Biology Objects Registry */}
        <div style={{ maxWidth: 1000, margin: "40px auto 0", padding: "24px", borderRadius: 16, background: "rgba(12, 22, 32, 0.85)", border: "1px solid var(--ds-border-muted)" }}>
          <h3 style={{ color: "var(--ds-accent)", fontSize: "1.1rem", fontWeight: 700, margin: "0 0 16px" }}>🧬 Molecular Biology Objects Registry</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {[
              { id: "dna", name: "DNA", icon: "🧬" },
              { id: "rna", name: "RNA", icon: "🧪" },
              { id: "mrna", name: "mRNA", icon: "📜" },
              { id: "trna", name: "tRNA", icon: "🧩" },
              { id: "rrna", name: "rRNA", icon: "⚙️" },
              { id: "gene", name: "Gene (HBB)", icon: "🧬" },
              { id: "chromosome", name: "Chromosome 11", icon: "📍" },
              { id: "protein", name: "Protein (HbB)", icon: "🩸" },
              { id: "enzyme", name: "DNA Polymerase III", icon: "⚙️" },
              { id: "nucleotide", name: "dATP Nucleotide", icon: "🔹" },
              { id: "codon", name: "Codons & Code", icon: "🔢" },
              { id: "genome", name: "Human Genome", icon: "🌐" },
              { id: "mutation", name: "Point Mutation (HbS)", icon: "⚡" }
            ].map((obj) => (
              <Link
                key={obj.id}
                href={`/dna-genetics/${obj.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--ds-border-muted)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  transition: "all 0.2s ease"
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>{obj.icon}</span>
                <span>{obj.name} →</span>
              </Link>
            ))}
          </div>
        </div>

        {/* DNA Facts */}
        <div style={{ maxWidth: 1000, margin: "40px auto 0", padding: "24px", borderRadius: 16, background: "var(--ds-accent-faint)", border: "1px solid var(--ds-border-accent)" }}>
          <h3 style={{ color: "var(--ds-accent)", fontSize: "1.1rem", fontWeight: 700, margin: "0 0 16px" }}>💡 Did You Know?</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DNA_FACTS.map((fact, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px", borderRadius: 8, background: "var(--ds-surface-subtle)" }}>
                <span style={{ color: "var(--ds-accent)", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>•</span>
                <span style={{ fontSize: "0.85rem", color: "var(--ds-fg-muted)", lineHeight: 1.5 }}>{fact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounceDown { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
      `}</style>
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────── */
const S: Record<string, React.CSSProperties> = {
  root: { width: "100%", minHeight: "calc(100vh - 64px)", background: "var(--ds-bg-primary)", overflowX: "hidden" },

  canvasSection: { position: "sticky", top: 0, width: "100%", height: "calc(100vh - 64px)", minHeight: "500px" },
  canvasWrap: { position: "absolute", inset: 0, zIndex: 0 },

  vignette: {
    position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
    background: "radial-gradient(ellipse at center, transparent 40%, var(--ds-bg-primary) 100%)",
  },

  header: { position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 10, textAlign: "center", pointerEvents: "none" },
  title: { fontSize: "1.4rem", fontWeight: 700, color: "var(--ds-accent)", letterSpacing: "0.06em", margin: 0, textShadow: "var(--ds-glow-sm)" },
  subtitle: { fontSize: "0.75rem", color: "var(--ds-fg-muted)", margin: "4px 0 0", letterSpacing: "0.12em", textTransform: "uppercase" as const },

  scrollHint: { position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", color: "var(--ds-accent-muted)", fontSize: "0.72rem", letterSpacing: "0.1em", pointerEvents: "none" },
  scrollArrow: { fontSize: "1rem", animation: "bounceDown 1.5s ease-in-out infinite" },

  // Sidebar
  sidebar: { position: "absolute", top: 0, right: 0, width: "min(300px, 80vw)", height: "100%", zIndex: 20, background: "var(--ds-surface-overlay)", backdropFilter: "blur(20px)", borderLeft: "1px solid var(--ds-border-muted)", padding: "48px 24px", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", transition: "transform 0.5s cubic-bezier(0.25,0.8,0.25,1), opacity 0.4s ease" },
  sideClose: { position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "var(--ds-fg-subtle)", fontSize: "1rem", cursor: "pointer", fontFamily: "inherit" },
  pairDot: { width: 48, height: 48, borderRadius: "50%" },
  pairTitle: { fontSize: "1.15rem", fontWeight: 700, margin: 0, textAlign: "center" },
  pairDivider: { width: 30, height: 2, background: "var(--ds-border-muted)", borderRadius: 1 },
  pairDesc: { fontSize: "0.85rem", color: "var(--ds-fg-muted)", lineHeight: 1.6, textAlign: "center", margin: 0 },
  pairBadge: { width: "100%", padding: "10px 14px", borderRadius: 10, background: "var(--ds-surface-subtle)", border: "1px solid var(--ds-border-muted)", display: "flex", flexDirection: "column", gap: 2, marginTop: 4 },

  // Info cards
  cardsSection: { position: "relative", zIndex: 5, background: "var(--ds-bg-primary)", padding: "60px clamp(20px,5vw,60px) 80px", borderTop: "1px solid var(--ds-border-muted)" },
  cardsTitle: { fontSize: "1.5rem", fontWeight: 700, color: "var(--ds-accent)", textAlign: "center", marginBottom: 32, letterSpacing: "0.04em", textShadow: "var(--ds-glow-sm)" },
  cardsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 1000, margin: "0 auto" },
  card: { padding: "24px", borderRadius: 16, background: "var(--ds-surface-subtle)", border: "1px solid var(--ds-border-muted)", display: "flex", flexDirection: "column" },
  cardTitle: { fontSize: "1.1rem", fontWeight: 700, margin: "0 0 6px", letterSpacing: "0.03em" },
  cardText: { fontSize: "0.85rem", color: "var(--ds-fg-muted)", lineHeight: 1.65, margin: 0 },

  // Codon table
  codonSection: { maxWidth: 1000, margin: "40px auto 0", padding: "24px", borderRadius: 16, background: "var(--ds-surface-subtle)", border: "1px solid var(--ds-border-muted)" },
  codonGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 },
  codonCard: { padding: "12px 14px", borderRadius: 10, background: "var(--ds-surface-raised)", border: "1px solid var(--ds-border-muted)", display: "flex", flexDirection: "column", gap: 2 },
};
