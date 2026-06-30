"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════
   PROCEDURAL CREATURE — Generates visually distinct 3D creatures
   based on bodyType and bodyParams. Parametric approach so each
   of the 100 species looks unique without 100 separate files.
   ═══════════════════════════════════════════════════════════════ */

interface BodyParams {
  primaryColor: string;
  secondaryColor: string;
  bodyScale: [number, number, number];
  limbCount: number;
  hasHorns: boolean;
  hasWings: boolean;
  hasTail: boolean;
  hasFins: boolean;
  hasShell: boolean;
  specialFeature: string;
}

interface Props {
  bodyType: string;
  bodyParams: BodyParams;
  detail?: boolean;
}

/* ── Quadruped Body ─────────────────────────────────────────── */
function QuadrupedBody({ params, detail }: { params: BodyParams; detail?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const bodyRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.12;
      // Breathing
      const breathe = 1 + Math.sin(t * 1.8) * 0.015;
      bodyRef.current.scale.set(breathe, breathe, breathe);
    }
  });

  const [bx, by, bz] = params.bodyScale;
  const legSpacing = bx * 0.35;
  const legHeight = by * 0.5;

  return (
    <group ref={group}>
      {/* Main body */}
      <mesh ref={bodyRef}>
        <capsuleGeometry args={[by * 0.45, bx * 0.6, 12, 16]} />
        <meshStandardMaterial color={params.primaryColor} roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Head */}
      <mesh position={[bx * 0.55, by * 0.15, 0]}>
        <sphereGeometry args={[by * 0.35, 16, 16]} />
        <meshStandardMaterial color={params.primaryColor} roughness={0.45} />
      </mesh>

      {/* Eyes */}
      <mesh position={[bx * 0.7, by * 0.25, bz * 0.2]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#111" emissive="#39FF14" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[bx * 0.7, by * 0.25, -bz * 0.2]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#111" emissive="#39FF14" emissiveIntensity={0.5} />
      </mesh>

      {/* Legs */}
      {[1, -1].map(side => (
        [1, -1].map(fb => (
          <mesh key={`leg-${side}-${fb}`} position={[fb * legSpacing, -legHeight, side * bz * 0.35]}>
            <capsuleGeometry args={[bz * 0.12, legHeight * 0.9, 6, 8]} />
            <meshStandardMaterial color={params.secondaryColor} roughness={0.6} />
          </mesh>
        ))
      ))}

      {/* Horns */}
      {params.hasHorns && (
        <>
          <mesh position={[bx * 0.6, by * 0.5, bz * 0.15]} rotation={[0, 0, 0.4]}>
            <coneGeometry args={[0.04, by * 0.5, 8]} />
            <meshStandardMaterial color={params.secondaryColor} roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[bx * 0.6, by * 0.5, -bz * 0.15]} rotation={[0, 0, 0.4]}>
            <coneGeometry args={[0.04, by * 0.5, 8]} />
            <meshStandardMaterial color={params.secondaryColor} roughness={0.3} metalness={0.2} />
          </mesh>
        </>
      )}

      {/* Tail */}
      {params.hasTail && (
        <mesh position={[-bx * 0.55, by * 0.1, 0]} rotation={[0, 0, -0.5]}>
          <capsuleGeometry args={[0.03, bx * 0.4, 6, 8]} />
          <meshStandardMaterial color={params.secondaryColor} roughness={0.5} />
        </mesh>
      )}

      {/* Shell */}
      {params.hasShell && (
        <mesh position={[0, by * 0.3, 0]}>
          <sphereGeometry args={[by * 0.5, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color={params.secondaryColor} roughness={0.3} metalness={0.15} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Wireframe overlay */}
      <mesh>
        <capsuleGeometry args={[by * 0.47, bx * 0.62, 8, 12]} />
        <meshBasicMaterial color={params.primaryColor} wireframe transparent opacity={0.06} />
      </mesh>

      {/* Particles */}
      {detail && <CreatureParticles color={params.primaryColor} radius={bx * 0.8} />}
    </group>
  );
}

/* ── Avian Body ─────────────────────────────────────────────── */
function AvianBody({ params, detail }: { params: BodyParams; detail?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const wingLRef = useRef<THREE.Mesh>(null!);
  const wingRRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.15;
      group.current.position.y = Math.sin(t * 0.8) * 0.06;
    }
    if (params.hasWings && wingLRef.current && wingRRef.current) {
      const flap = Math.sin(t * 2.5) * 0.3;
      wingLRef.current.rotation.z = 0.3 + flap;
      wingRRef.current.rotation.z = -(0.3 + flap);
    }
  });

  const [bx, by, bz] = params.bodyScale;

  return (
    <group ref={group}>
      {/* Body */}
      <mesh rotation={[0, 0, Math.PI * 0.05]}>
        <sphereGeometry args={[by * 0.5, 16, 16]} />
        <meshStandardMaterial color={params.primaryColor} roughness={0.5} />
      </mesh>

      {/* Head */}
      <mesh position={[bx * 0.3, by * 0.35, 0]}>
        <sphereGeometry args={[by * 0.28, 14, 14]} />
        <meshStandardMaterial color={params.primaryColor} roughness={0.45} />
      </mesh>

      {/* Beak */}
      <mesh position={[bx * 0.55, by * 0.3, 0]} rotation={[0, 0, -0.3]}>
        <coneGeometry args={[0.05, bx * 0.25, 6]} />
        <meshStandardMaterial color={params.secondaryColor} roughness={0.3} />
      </mesh>

      {/* Eyes */}
      <mesh position={[bx * 0.4, by * 0.42, bz * 0.15]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#111" emissive="#39FF14" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[bx * 0.4, by * 0.42, -bz * 0.15]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color="#111" emissive="#39FF14" emissiveIntensity={0.5} />
      </mesh>

      {/* Wings */}
      {params.hasWings && (
        <>
          <mesh ref={wingLRef} position={[0, by * 0.15, bz * 0.45]} rotation={[0, 0, 0.3]}>
            <planeGeometry args={[bx * 0.6, by * 0.3]} />
            <meshStandardMaterial color={params.secondaryColor} side={THREE.DoubleSide} transparent opacity={0.7} roughness={0.5} />
          </mesh>
          <mesh ref={wingRRef} position={[0, by * 0.15, -bz * 0.45]} rotation={[0, 0, -0.3]}>
            <planeGeometry args={[bx * 0.6, by * 0.3]} />
            <meshStandardMaterial color={params.secondaryColor} side={THREE.DoubleSide} transparent opacity={0.7} roughness={0.5} />
          </mesh>
        </>
      )}

      {/* Legs */}
      {[1, -1].map(side => (
        <mesh key={`leg-${side}`} position={[0, -by * 0.45, side * bz * 0.15]}>
          <cylinderGeometry args={[0.015, 0.02, by * 0.5, 6]} />
          <meshStandardMaterial color={params.secondaryColor} roughness={0.5} />
        </mesh>
      ))}

      {/* Tail feathers */}
      {params.hasTail && (
        <mesh position={[-bx * 0.4, -by * 0.1, 0]} rotation={[0, 0, -0.6]}>
          <planeGeometry args={[bx * 0.3, by * 0.2]} />
          <meshStandardMaterial color={params.secondaryColor} side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Wireframe */}
      <mesh>
        <sphereGeometry args={[by * 0.52, 8, 8]} />
        <meshBasicMaterial color={params.primaryColor} wireframe transparent opacity={0.05} />
      </mesh>

      {detail && <CreatureParticles color={params.primaryColor} radius={bx * 0.7} />}
    </group>
  );
}

/* ── Aquatic Body ───────────────────────────────────────────── */
function AquaticBody({ params, detail }: { params: BodyParams; detail?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const bodyRef = useRef<THREE.Mesh>(null!);
  const tailRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.1;
      group.current.position.y = Math.sin(t * 0.6) * 0.08;
      group.current.position.x = Math.sin(t * 0.3) * 0.05;
    }
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * 3) * 0.25;
    }
  });

  const [bx, by, bz] = params.bodyScale;

  return (
    <group ref={group}>
      {/* Streamlined body */}
      <mesh ref={bodyRef} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[by * 0.4, bx * 0.7, 12, 16]} />
        <meshStandardMaterial color={params.primaryColor} roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Belly (lighter) */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -by * 0.05, 0]}>
        <capsuleGeometry args={[by * 0.35, bx * 0.65, 8, 12]} />
        <meshStandardMaterial color={params.secondaryColor} transparent opacity={0.3} roughness={0.4} />
      </mesh>

      {/* Eyes */}
      <mesh position={[bx * 0.35, by * 0.15, bz * 0.25]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#111" emissive="#39FF14" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[bx * 0.35, by * 0.15, -bz * 0.25]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#111" emissive="#39FF14" emissiveIntensity={0.5} />
      </mesh>

      {/* Tail fin */}
      {params.hasTail && (
        <mesh ref={tailRef} position={[-bx * 0.55, 0, 0]}>
          <planeGeometry args={[bx * 0.25, by * 0.5]} />
          <meshStandardMaterial color={params.secondaryColor} side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Dorsal fin */}
      {params.hasFins && (
        <mesh position={[0, by * 0.35, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[bx * 0.25, by * 0.2]} />
          <meshStandardMaterial color={params.secondaryColor} side={THREE.DoubleSide} transparent opacity={0.5} />
        </mesh>
      )}

      {/* Pectoral fins */}
      {params.hasFins && (
        <>
          <mesh position={[bx * 0.1, -by * 0.1, bz * 0.3]} rotation={[0.5, 0, 0.3]}>
            <planeGeometry args={[bx * 0.15, by * 0.15]} />
            <meshStandardMaterial color={params.secondaryColor} side={THREE.DoubleSide} transparent opacity={0.5} />
          </mesh>
          <mesh position={[bx * 0.1, -by * 0.1, -bz * 0.3]} rotation={[-0.5, 0, -0.3]}>
            <planeGeometry args={[bx * 0.15, by * 0.15]} />
            <meshStandardMaterial color={params.secondaryColor} side={THREE.DoubleSide} transparent opacity={0.5} />
          </mesh>
        </>
      )}

      {/* Shell (turtles) */}
      {params.hasShell && (
        <mesh position={[0, by * 0.15, 0]}>
          <sphereGeometry args={[by * 0.45, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color={params.secondaryColor} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Horn/Tusk (narwhal) */}
      {params.hasHorns && (
        <mesh position={[bx * 0.6, by * 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.03, bx * 0.6, 8]} />
          <meshStandardMaterial color="#E0E0E0" roughness={0.2} metalness={0.3} />
        </mesh>
      )}

      {/* Wireframe */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[by * 0.42, bx * 0.72, 6, 10]} />
        <meshBasicMaterial color={params.primaryColor} wireframe transparent opacity={0.05} />
      </mesh>

      {detail && <CreatureParticles color={params.primaryColor} radius={bx * 0.6} />}
    </group>
  );
}

/* ── Serpentine Body ─────────────────────────────────────────── */
function SerpentineBody({ params, detail }: { params: BodyParams; detail?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const segs = 8;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.1;
      group.current.children.forEach((child, i) => {
        if (i < segs) {
          child.position.y = Math.sin(t * 1.5 + i * 0.8) * 0.04;
          child.position.z = Math.sin(t * 1.2 + i * 0.6) * 0.06;
        }
      });
    }
  });

  const [bx, by] = params.bodyScale;
  const segLen = bx / segs;

  return (
    <group ref={group}>
      {Array.from({ length: segs }, (_, i) => {
        const scale = 1 - (i / segs) * 0.4;
        return (
          <mesh key={i} position={[(i - segs / 2) * segLen * 0.8, 0, 0]}>
            <capsuleGeometry args={[by * 0.3 * scale, segLen * 0.6, 8, 10]} />
            <meshStandardMaterial color={i === 0 ? params.primaryColor : params.secondaryColor} roughness={0.45} metalness={0.1} />
          </mesh>
        );
      })}

      {/* Head (larger first segment) */}
      <mesh position={[-segs / 2 * segLen * 0.8 - segLen * 0.3, 0, 0]}>
        <sphereGeometry args={[by * 0.35, 12, 12]} />
        <meshStandardMaterial color={params.primaryColor} roughness={0.4} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-segs / 2 * segLen * 0.8 - segLen * 0.5, by * 0.2, by * 0.2]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#111" emissive="#39FF14" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-segs / 2 * segLen * 0.8 - segLen * 0.5, by * 0.2, -by * 0.2]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#111" emissive="#39FF14" emissiveIntensity={0.5} />
      </mesh>

      {/* Legs if any (crocodilians) */}
      {params.limbCount >= 4 && (
        [1, -1].map(side => (
          [1, -1].map(fb => (
            <mesh key={`leg-${side}-${fb}`} position={[fb * bx * 0.2, -by * 0.25, side * by * 0.35]}>
              <capsuleGeometry args={[0.04, by * 0.25, 4, 6]} />
              <meshStandardMaterial color={params.secondaryColor} roughness={0.6} />
            </mesh>
          ))
        ))
      )}

      {detail && <CreatureParticles color={params.primaryColor} radius={bx * 0.5} />}
    </group>
  );
}

/* ── Amphibian Body ─────────────────────────────────────────── */
function AmphibianBody({ params, detail }: { params: BodyParams; detail?: boolean }) {
  const group = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.12;
      group.current.position.y = Math.sin(t * 0.7) * 0.04;
    }
  });

  const [bx, by, bz] = params.bodyScale;

  return (
    <group ref={group}>
      {/* Body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[by * 0.6, bx * 0.5, 12, 16]} />
        <meshStandardMaterial color={params.primaryColor} roughness={0.6} transparent opacity={0.85} />
      </mesh>

      {/* Head (wider for frogs) */}
      <mesh position={[bx * 0.4, by * 0.1, 0]}>
        <sphereGeometry args={[by * 0.5, 14, 14]} />
        <meshStandardMaterial color={params.primaryColor} roughness={0.5} />
      </mesh>

      {/* Eyes (bulgy for frogs) */}
      <mesh position={[bx * 0.5, by * 0.45, bz * 0.3]}>
        <sphereGeometry args={[by * 0.15, 12, 12]} />
        <meshStandardMaterial color="#111" emissive="#39FF14" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[bx * 0.5, by * 0.45, -bz * 0.3]}>
        <sphereGeometry args={[by * 0.15, 12, 12]} />
        <meshStandardMaterial color="#111" emissive="#39FF14" emissiveIntensity={0.6} />
      </mesh>

      {/* Limbs */}
      {params.limbCount >= 4 && (
        <>
          {/* Front legs */}
          <mesh position={[bx * 0.2, -by * 0.4, bz * 0.45]} rotation={[0.3, 0, 0.2]}>
            <capsuleGeometry args={[bz * 0.12, by * 0.4, 6, 8]} />
            <meshStandardMaterial color={params.secondaryColor} roughness={0.6} />
          </mesh>
          <mesh position={[bx * 0.2, -by * 0.4, -bz * 0.45]} rotation={[-0.3, 0, -0.2]}>
            <capsuleGeometry args={[bz * 0.12, by * 0.4, 6, 8]} />
            <meshStandardMaterial color={params.secondaryColor} roughness={0.6} />
          </mesh>
          {/* Back legs (larger for frogs) */}
          <mesh position={[-bx * 0.2, -by * 0.35, bz * 0.5]} rotation={[0.4, 0, 0.5]}>
            <capsuleGeometry args={[bz * 0.15, by * 0.55, 6, 8]} />
            <meshStandardMaterial color={params.secondaryColor} roughness={0.6} />
          </mesh>
          <mesh position={[-bx * 0.2, -by * 0.35, -bz * 0.5]} rotation={[-0.4, 0, -0.5]}>
            <capsuleGeometry args={[bz * 0.15, by * 0.55, 6, 8]} />
            <meshStandardMaterial color={params.secondaryColor} roughness={0.6} />
          </mesh>
        </>
      )}

      {/* Tail (for salamanders/axolotl) */}
      {params.hasTail && (
        <mesh position={[-bx * 0.5, 0, 0]} rotation={[0, 0, 0.1]}>
          <capsuleGeometry args={[by * 0.15, bx * 0.35, 6, 8]} />
          <meshStandardMaterial color={params.secondaryColor} transparent opacity={0.6} roughness={0.5} />
        </mesh>
      )}

      {/* External gills (axolotl, olm) */}
      {params.specialFeature === "external-gills" && (
        [1, -1, 0].map((z, i) => (
          <group key={`gill-${i}`}>
            <mesh position={[bx * 0.35, by * 0.35, z * bz * 0.4]} rotation={[z * 0.5, 0, 0.8]}>
              <cylinderGeometry args={[0.01, 0.005, by * 0.35, 4]} />
              <meshStandardMaterial color="#FF4081" transparent opacity={0.7} />
            </mesh>
            {[1, 2, 3].map(j => (
              <mesh key={j} position={[bx * 0.35 + j * 0.04, by * 0.35 + j * 0.05, z * bz * 0.4 + j * 0.02]} rotation={[z * 0.6, 0, 0.9 + j * 0.15]}>
                <cylinderGeometry args={[0.005, 0.002, by * 0.15, 3]} />
                <meshStandardMaterial color="#FF80AB" transparent opacity={0.5} />
              </mesh>
            ))}
          </group>
        ))
      )}

      {/* Wireframe */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[by * 0.62, bx * 0.52, 6, 10]} />
        <meshBasicMaterial color={params.primaryColor} wireframe transparent opacity={0.05} />
      </mesh>

      {detail && <CreatureParticles color={params.primaryColor} radius={bx * 0.5} />}
    </group>
  );
}

/* ── Insectoid Body ─────────────────────────────────────────── */
function InsectoidBody({ params, detail }: { params: BodyParams; detail?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const wingLRef = useRef<THREE.Mesh>(null!);
  const wingRRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.15;
      group.current.position.y = Math.sin(t * 0.8) * 0.04;
    }
    if (params.hasWings && wingLRef.current && wingRRef.current) {
      const flap = Math.sin(t * 8) * 0.4;
      wingLRef.current.rotation.z = 0.2 + flap;
      wingRRef.current.rotation.z = -(0.2 + flap);
    }
  });

  const [bx, by, bz] = params.bodyScale;

  return (
    <group ref={group}>
      {/* Head */}
      <mesh position={[bx * 0.4, 0, 0]}>
        <sphereGeometry args={[by * 0.6, 12, 12]} />
        <meshStandardMaterial color={params.primaryColor} roughness={0.4} />
      </mesh>

      {/* Thorax */}
      <mesh>
        <sphereGeometry args={[by * 0.7, 12, 12]} />
        <meshStandardMaterial color={params.primaryColor} roughness={0.45} />
      </mesh>

      {/* Abdomen */}
      <mesh position={[-bx * 0.4, 0, 0]}>
        <sphereGeometry args={[by * 0.8, 12, 12]} />
        <meshStandardMaterial color={params.secondaryColor} roughness={0.5} />
      </mesh>

      {/* Eyes (compound) */}
      <mesh position={[bx * 0.55, by * 0.15, bz * 0.3]}>
        <sphereGeometry args={[by * 0.25, 10, 10]} />
        <meshStandardMaterial color="#111" emissive="#39FF14" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[bx * 0.55, by * 0.15, -bz * 0.3]}>
        <sphereGeometry args={[by * 0.25, 10, 10]} />
        <meshStandardMaterial color="#111" emissive="#39FF14" emissiveIntensity={0.5} />
      </mesh>

      {/* Antennae */}
      <mesh position={[bx * 0.6, by * 0.3, bz * 0.15]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.008, 0.005, bx * 0.4, 4]} />
        <meshStandardMaterial color={params.primaryColor} />
      </mesh>
      <mesh position={[bx * 0.6, by * 0.3, -bz * 0.15]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.008, 0.005, bx * 0.4, 4]} />
        <meshStandardMaterial color={params.primaryColor} />
      </mesh>

      {/* Legs (6) */}
      {[0, 1, 2].map(i => (
        [1, -1].map(side => (
          <mesh key={`leg-${i}-${side}`} position={[(i - 1) * bx * 0.2, -by * 0.4, side * bz * 0.6]} rotation={[side * 0.4, 0, side * 0.6]}>
            <cylinderGeometry args={[0.012, 0.008, by * 0.6, 4]} />
            <meshStandardMaterial color={params.secondaryColor} roughness={0.5} />
          </mesh>
        ))
      ))}

      {/* Wings */}
      {params.hasWings && (
        <>
          <mesh ref={wingLRef} position={[0, by * 0.3, bz * 0.5]} rotation={[0, 0, 0.2]}>
            <planeGeometry args={[bx * 0.7, by * 0.8]} />
            <meshStandardMaterial color={params.primaryColor} side={THREE.DoubleSide} transparent opacity={0.35} roughness={0.3} />
          </mesh>
          <mesh ref={wingRRef} position={[0, by * 0.3, -bz * 0.5]} rotation={[0, 0, -0.2]}>
            <planeGeometry args={[bx * 0.7, by * 0.8]} />
            <meshStandardMaterial color={params.primaryColor} side={THREE.DoubleSide} transparent opacity={0.35} roughness={0.3} />
          </mesh>
        </>
      )}

      {/* Horn (beetles) */}
      {params.hasHorns && (
        <mesh position={[bx * 0.55, by * 0.4, 0]} rotation={[0, 0, 0.5]}>
          <coneGeometry args={[0.03, by * 0.8, 6]} />
          <meshStandardMaterial color={params.secondaryColor} roughness={0.3} metalness={0.2} />
        </mesh>
      )}

      {/* Shell (beetles) */}
      {params.hasShell && (
        <mesh position={[-bx * 0.15, by * 0.15, 0]}>
          <sphereGeometry args={[by * 0.75, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color={params.secondaryColor} roughness={0.25} metalness={0.15} side={THREE.DoubleSide} />
        </mesh>
      )}

      {detail && <CreatureParticles color={params.primaryColor} radius={bx * 0.5} />}
    </group>
  );
}

/* ── Radial Body (jellyfish, octopus, sea stars, crabs) ──── */
function RadialBody({ params, detail }: { params: BodyParams; detail?: boolean }) {
  const group = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.1;
      group.current.position.y = Math.sin(t * 0.5) * 0.06;
    }
  });

  const [bx, by, bz] = params.bodyScale;
  const armCount = Math.min(params.limbCount || 5, 24);

  return (
    <group ref={group}>
      {/* Central body */}
      <mesh>
        {params.hasShell ? (
          <torusGeometry args={[bx * 0.3, by * 0.5, 12, 16]} />
        ) : (
          <sphereGeometry args={[by * 0.6, 14, 14]} />
        )}
        <meshStandardMaterial color={params.primaryColor} roughness={0.45} transparent opacity={0.8} />
      </mesh>

      {/* Arms/tentacles */}
      {armCount > 0 && Array.from({ length: Math.min(armCount, 12) }, (_, i) => {
        const angle = (i / Math.min(armCount, 12)) * Math.PI * 2;
        const ax = Math.cos(angle) * bx * 0.4;
        const az = Math.sin(angle) * bz * 0.4;
        return (
          <mesh key={i} position={[ax, -by * 0.3, az]} rotation={[Math.sin(angle) * 0.5, 0, Math.cos(angle) * 0.5]}>
            <capsuleGeometry args={[0.02, bx * 0.3, 4, 6]} />
            <meshStandardMaterial color={params.secondaryColor} transparent opacity={0.5} roughness={0.6} />
          </mesh>
        );
      })}

      {/* Shell overlay */}
      {params.hasShell && (
        <mesh position={[0, by * 0.1, 0]}>
          <sphereGeometry args={[bx * 0.35, 10, 10, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color={params.secondaryColor} roughness={0.3} side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Wing appendages (sea angels) */}
      {params.hasWings && (
        <>
          <mesh position={[0, by * 0.1, bz * 0.4]} rotation={[0, 0, 0.4]}>
            <planeGeometry args={[bx * 0.3, by * 0.4]} />
            <meshStandardMaterial color={params.primaryColor} side={THREE.DoubleSide} transparent opacity={0.4} />
          </mesh>
          <mesh position={[0, by * 0.1, -bz * 0.4]} rotation={[0, 0, -0.4]}>
            <planeGeometry args={[bx * 0.3, by * 0.4]} />
            <meshStandardMaterial color={params.primaryColor} side={THREE.DoubleSide} transparent opacity={0.4} />
          </mesh>
        </>
      )}

      {/* Wireframe */}
      <mesh>
        <sphereGeometry args={[by * 0.62, 6, 8]} />
        <meshBasicMaterial color={params.primaryColor} wireframe transparent opacity={0.05} />
      </mesh>

      {detail && <CreatureParticles color={params.primaryColor} radius={bx * 0.5} />}
    </group>
  );
}

/* ── Plant Body ─────────────────────────────────────────────── */
function PlantBody({ params, detail }: { params: BodyParams; detail?: boolean }) {
  const group = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.08;
    }
  });

  const [bx, by, bz] = params.bodyScale;

  return (
    <group ref={group}>
      {/* Trunk/Stem */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[bx * 0.12, bx * 0.18, by * 0.8, 8]} />
        <meshStandardMaterial color={params.secondaryColor} roughness={0.7} />
      </mesh>

      {/* Canopy/Flower */}
      <mesh position={[0, by * 0.5, 0]}>
        <sphereGeometry args={[bx * 0.4, 12, 12]} />
        <meshStandardMaterial color={params.primaryColor} roughness={0.5} transparent opacity={0.7} />
      </mesh>

      {/* Secondary canopy layer */}
      <mesh position={[0, by * 0.45, 0]}>
        <sphereGeometry args={[bx * 0.35, 8, 8]} />
        <meshStandardMaterial color={params.secondaryColor} transparent opacity={0.3} />
      </mesh>

      {/* Branches */}
      {[0, 1, 2, 3].map(i => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * bx * 0.2, by * 0.25, Math.sin(angle) * bz * 0.2]} rotation={[Math.sin(angle) * 0.6, 0, Math.cos(angle) * 0.6]}>
            <cylinderGeometry args={[0.02, 0.04, by * 0.35, 4]} />
            <meshStandardMaterial color={params.secondaryColor} roughness={0.6} />
          </mesh>
        );
      })}

      {/* Leaves / Petals */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const angle = (i / 6) * Math.PI * 2;
        const r = bx * 0.35;
        return (
          <mesh key={`leaf-${i}`} position={[Math.cos(angle) * r, by * 0.55, Math.sin(angle) * r]} rotation={[0, angle, 0.3]}>
            <planeGeometry args={[bx * 0.15, by * 0.12]} />
            <meshStandardMaterial color={params.primaryColor} side={THREE.DoubleSide} transparent opacity={0.5} />
          </mesh>
        );
      })}

      {/* Base/Roots */}
      {[0, 1, 2].map(i => {
        const angle = (i / 3) * Math.PI * 2;
        return (
          <mesh key={`root-${i}`} position={[Math.cos(angle) * bx * 0.12, -by * 0.4, Math.sin(angle) * bz * 0.12]} rotation={[Math.sin(angle) * 0.4, 0, Math.cos(angle) * 0.3]}>
            <cylinderGeometry args={[0.03, 0.01, by * 0.25, 4]} />
            <meshStandardMaterial color={params.secondaryColor} roughness={0.7} />
          </mesh>
        );
      })}

      {/* Wireframe */}
      <mesh position={[0, by * 0.5, 0]}>
        <sphereGeometry args={[bx * 0.42, 6, 8]} />
        <meshBasicMaterial color={params.primaryColor} wireframe transparent opacity={0.05} />
      </mesh>

      {detail && <CreatureParticles color={params.primaryColor} radius={bx * 0.5} />}
    </group>
  );
}

/* ── Ambient creature particles ─────────────────────────────── */
function CreatureParticles({ color, radius }: { color: string; radius: number }) {
  const ref = useRef<THREE.Points>(null!);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.8 + Math.random() * 0.6);
      pts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pts[i * 3 + 2] = r * Math.cos(phi);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return g;
  }, [radius]);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.05;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={color} size={0.015} transparent opacity={0.35} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT — Routes to the correct body type
   ═══════════════════════════════════════════════════════════════ */
export default function ProceduralCreature({ bodyType, bodyParams, detail = false }: Props) {
  switch (bodyType) {
    case "quadruped":
      return <QuadrupedBody params={bodyParams} detail={detail} />;
    case "avian":
      return <AvianBody params={bodyParams} detail={detail} />;
    case "aquatic":
      return <AquaticBody params={bodyParams} detail={detail} />;
    case "serpentine":
      return <SerpentineBody params={bodyParams} detail={detail} />;
    case "amphibian":
      return <AmphibianBody params={bodyParams} detail={detail} />;
    case "insectoid":
      return <InsectoidBody params={bodyParams} detail={detail} />;
    case "radial":
      return <RadialBody params={bodyParams} detail={detail} />;
    case "plant":
      return <PlantBody params={bodyParams} detail={detail} />;
    default:
      return <QuadrupedBody params={bodyParams} detail={detail} />;
  }
}
