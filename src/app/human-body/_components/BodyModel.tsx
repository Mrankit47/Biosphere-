'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'

export type RenderMode = 'realistic' | 'xray' | 'hologram'

/* ══════════════════════════════════════════════════════════════
   ▸ UNIFIED ANATOMY MATERIAL HOOK (GIVES ULTRA GLOSSY WET LOOK)
   ══════════════════════════════════════════════════════════════ */
function useAnatomyMaterial(
  color: string,
  roughness: number,
  metalness: number,
  opacity: number,
  isSel: boolean,
  mode: RenderMode,
  clippingPlanes?: THREE.Plane[]
) {
  return useMemo(() => {
    const planes = clippingPlanes || []
    if (mode === 'xray') {
      const xrayColor = new THREE.Color('#38bdf8') // Light blue cyan
      return new THREE.MeshStandardMaterial({
        color: xrayColor,
        emissive: xrayColor,
        emissiveIntensity: isSel ? 2.5 : 0.4,
        transparent: true,
        opacity: isSel ? 0.75 : 0.18 * opacity,
        roughness: 0.1,
        metalness: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        clippingPlanes: planes,
      })
    } else if (mode === 'hologram') {
      const holoColor = new THREE.Color('#10b981') // Emerald green
      return new THREE.MeshStandardMaterial({
        color: holoColor,
        emissive: holoColor,
        emissiveIntensity: isSel ? 3.0 : 0.6,
        transparent: true,
        opacity: isSel ? 0.8 : 0.15 * opacity,
        wireframe: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        clippingPlanes: planes,
      })
    } else {
      // Hyper-Realistic Medical Mode (Highly Glossy, Wet Specular Look)
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness: roughness * 0.7, // Low roughness for wet look
        metalness: metalness,
        transparent: opacity < 1,
        opacity: isSel ? 1.0 : opacity,
        emissive: isSel ? new THREE.Color(color).multiplyScalar(0.45) : new THREE.Color('#000000'),
        emissiveIntensity: isSel ? 1.0 : 0,
        side: THREE.DoubleSide,
        clearcoat: 0.8, // Ultra glossy coating
        clearcoatRoughness: 0.1,
        clippingPlanes: planes,
      })
    }
  }, [color, roughness, metalness, opacity, isSel, mode, clippingPlanes])
}

/* ══════════════════════════════════════════════════════════════
   ▸ UTILITY: RADIAL EXPLODE DISPLACEMENT
   ══════════════════════════════════════════════════════════════ */
function getExplodeOffset(explode: number, direction: [number, number, number]): [number, number, number] {
  return [
    direction[0] * explode,
    direction[1] * explode,
    direction[2] * explode,
  ]
}

/* ══════════════════════════════════════════════════════════════
   ▸ INTEGRUMENTEARY SYSTEM: SKIN SILHOUETTE
   ══════════════════════════════════════════════════════════════ */
export function HumanBodySilhouette({
  opacity = 0.15,
  mode = 'realistic',
  gender = 'male',
  explode = 0,
  clippingPlanes,
}: {
  opacity?: number
  mode?: RenderMode
  gender?: 'male' | 'female'
  explode?: number
  clippingPlanes?: THREE.Plane[]
}) {
  const skinMat = useAnatomyMaterial('#f5c2a2', 0.5, 0.05, opacity, false, mode, clippingPlanes)
  const offset = getExplodeOffset(explode, [0, 0, -1.2]) // Explode backwards

  // Gender adjustments
  const pelvisWidth = gender === 'female' ? 1.45 : 1.25
  const hipWidth = gender === 'female' ? 1.4 : 1.2
  const shoulderWidth = gender === 'female' ? 1.25 : 1.42

  return (
    <group position={offset}>
      {/* Head */}
      <mesh position={[0, 8.2, 0]} material={skinMat}>
        <sphereGeometry args={[0.85, 32, 32]} />
      </mesh>
      <mesh position={[0, 7.5, 0.18]} scale={[0.7, 0.45, 0.6]} material={skinMat}>
        <sphereGeometry args={[1, 16, 16]} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 7.0, -0.05]} material={skinMat}>
        <cylinderGeometry args={[0.35, 0.4, 0.8, 16]} />
      </mesh>
      {/* Torso & Chest */}
      <mesh position={[0, 5.5, 0]} scale={[1.35 * shoulderWidth, 1.25, 0.75]} material={skinMat}>
        <capsuleGeometry args={[1, 0.5, 16, 32]} />
      </mesh>
      {/* Female Breasts / Male Chest Pecs */}
      {gender === 'female' ? (
        <group>
          <mesh position={[-0.45, 5.4, 0.75]} rotation={[0.2, 0.1, 0]} material={skinMat}>
            <sphereGeometry args={[0.38, 32, 32]} />
          </mesh>
          <mesh position={[0.45, 5.4, 0.75]} rotation={[0.2, -0.1, 0]} material={skinMat}>
            <sphereGeometry args={[0.38, 32, 32]} />
          </mesh>
        </group>
      ) : null}
      {/* Abdomen & Hips */}
      <mesh position={[0, 3.2, 0.05]} scale={[1.15 * pelvisWidth, 1.85, 0.7]} material={skinMat}>
        <capsuleGeometry args={[1, 0.5, 16, 32]} />
      </mesh>
      <mesh position={[0, 1.2, 0]} scale={[1.25 * hipWidth, 0.65, 0.65]} material={skinMat}>
        <sphereGeometry args={[1, 32, 16]} />
      </mesh>

      {/* Arms */}
      <mesh position={[-1.75 * shoulderWidth, 5.2, 0]} rotation={[0, 0, 0.15]} material={skinMat}>
        <capsuleGeometry args={[0.22, 1.8, 12, 24]} />
      </mesh>
      <mesh position={[-1.85 * shoulderWidth, 3.2, 0.1]} rotation={[0, 0, 0.06]} material={skinMat}>
        <capsuleGeometry args={[0.17, 1.6, 12, 24]} />
      </mesh>
      {/* Detailed Hand area */}
      <mesh position={[-1.9 * shoulderWidth, 2.0, 0.15]} scale={[0.5, 0.7, 0.3]} material={skinMat}>
        <sphereGeometry args={[0.3, 16, 16]} />
      </mesh>

      <mesh position={[1.75 * shoulderWidth, 5.2, 0]} rotation={[0, 0, -0.15]} material={skinMat}>
        <capsuleGeometry args={[0.22, 1.8, 12, 24]} />
      </mesh>
      <mesh position={[1.85 * shoulderWidth, 3.2, 0.1]} rotation={[0, 0, -0.06]} material={skinMat}>
        <capsuleGeometry args={[0.17, 1.6, 12, 24]} />
      </mesh>
      <mesh position={[1.9 * shoulderWidth, 2.0, 0.15]} scale={[0.5, 0.7, 0.3]} material={skinMat}>
        <sphereGeometry args={[0.3, 16, 16]} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.52 * pelvisWidth, -0.2, 0]} material={skinMat}>
        <capsuleGeometry args={[0.28, 2.2, 12, 24]} />
      </mesh>
      <mesh position={[-0.52 * pelvisWidth, -2.8, 0]} material={skinMat}>
        <capsuleGeometry args={[0.2, 2.2, 12, 24]} />
      </mesh>
      <mesh position={[-0.52 * pelvisWidth, -4.2, 0.25]} scale={[0.5, 0.3, 0.8]} material={skinMat}>
        <sphereGeometry args={[0.4, 16, 16]} />
      </mesh>

      <mesh position={[0.52 * pelvisWidth, -0.2, 0]} material={skinMat}>
        <capsuleGeometry args={[0.28, 2.2, 12, 24]} />
      </mesh>
      <mesh position={[0.52 * pelvisWidth, -2.8, 0]} material={skinMat}>
        <capsuleGeometry args={[0.2, 2.2, 12, 24]} />
      </mesh>
      <mesh position={[0.52 * pelvisWidth, -4.2, 0.25]} scale={[0.5, 0.3, 0.8]} material={skinMat}>
        <sphereGeometry args={[0.4, 16, 16]} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ SKELETAL SYSTEM (DETAILED BONES, HANDS, FEET & LIGAMENTS)
   ══════════════════════════════════════════════════════════════ */
export function Skeleton({
  mode = 'realistic',
  gender = 'male',
  explode = 0,
  clippingPlanes,
  opacity = 1.0,
}: {
  mode?: RenderMode
  gender?: 'male' | 'female'
  explode?: number
  clippingPlanes?: THREE.Plane[]
  opacity?: number
}) {
  const boneMat = useAnatomyMaterial('#f3ede2', 0.5, 0.05, opacity, false, mode, clippingPlanes)
  const skullMat = useAnatomyMaterial('#f4eee3', 0.55, 0.04, opacity, false, mode, clippingPlanes)
  const ligamentMat = useAnatomyMaterial('#e2e8f0', 0.6, 0.02, 0.8 * opacity, false, mode, clippingPlanes)

  const offset = getExplodeOffset(explode, [0, 0, -0.4]) // Explode backward slightly less than skin

  const pelvisWidth = gender === 'female' ? 1.45 : 1.25
  const shoulderWidth = gender === 'female' ? 1.25 : 1.42

  const ribs = useMemo(() => {
    const list = []
    for (let i = 0; i < 12; i++) {
      list.push({
        y: 6.3 - i * 0.26,
        w: 0.72 + Math.min(i, 6) * 0.09 - Math.max(0, i - 7) * 0.12,
        scale: [1, 0.8 + Math.min(i, 6) * 0.08, 0.65],
      })
    }
    return list
  }, [])

  return (
    <group position={offset}>
      {/* ── SKULL ── */}
      <group position={[0, 8.2, 0]}>
        <mesh position={[0, 0.05, -0.05]} material={skullMat}>
          <sphereGeometry args={[0.72, 32, 32]} />
        </mesh>
        <mesh position={[0, -0.3, 0.22]} scale={[0.55, 0.42, 0.4]} material={skullMat}>
          <sphereGeometry args={[0.9, 16, 16]} />
        </mesh>
        {/* Jaw */}
        <mesh position={[0, -0.58, 0.18]} scale={[0.5, 0.28, 0.45]} material={skullMat}>
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
        {/* Eye Sockets */}
        <mesh position={[-0.24, -0.15, 0.56]} scale={[0.15, 0.15, 0.05]} material={skullMat}>
          <sphereGeometry args={[1, 12, 12]} />
        </mesh>
        <mesh position={[0.24, -0.15, 0.56]} scale={[0.15, 0.15, 0.05]} material={skullMat}>
          <sphereGeometry args={[1, 12, 12]} />
        </mesh>
      </group>

      {/* ── SPINE ── */}
      {Array.from({ length: 24 }).map((_, i) => (
        <group key={`vertebra-${i}`} position={[0, 7.3 - i * 0.28, -0.32]}>
          <mesh material={boneMat}>
            <cylinderGeometry args={[0.14, 0.15, 0.12, 12]} />
          </mesh>
          <mesh position={[-0.15, 0, -0.05]} scale={[0.2, 0.05, 0.05]} material={boneMat}>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
          <mesh position={[0.15, 0, -0.05]} scale={[0.2, 0.05, 0.05]} material={boneMat}>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
        </group>
      ))}

      {/* ── CLAVICLES & STERNUM ── */}
      <mesh position={[-0.52 * shoulderWidth, 6.45, 0.25]} rotation={[0.08, 0.2, 0.15]} material={boneMat}>
        <cylinderGeometry args={[0.035, 0.035, 0.95, 12]} />
      </mesh>
      <mesh position={[0.52 * shoulderWidth, 6.45, 0.25]} rotation={[0.08, -0.2, -0.15]} material={boneMat}>
        <cylinderGeometry args={[0.035, 0.035, 0.95, 12]} />
      </mesh>
      <mesh position={[0, 5.3, 0.45]} scale={[0.09, 0.85, 0.04]} material={boneMat}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      {/* ── RIBCAGE ── */}
      {ribs.map((rib, i) => (
        <group key={`ribpair-${i}`} position={[0, rib.y, 0]}>
          <mesh rotation={[0.1, -0.15, -0.08]} scale={rib.scale as [number, number, number]} material={boneMat}>
            <torusGeometry args={[rib.w, 0.026, 8, 36, Math.PI * 0.98]} />
          </mesh>
          <mesh rotation={[0.1, Math.PI + 0.15, 0.08]} scale={rib.scale as [number, number, number]} material={boneMat}>
            <torusGeometry args={[rib.w, 0.026, 8, 36, Math.PI * 0.98]} />
          </mesh>
        </group>
      ))}

      {/* ── PELVIS (Male vs Female pelvic structure) ── */}
      <group position={[0, 0.95, 0.05]}>
        <mesh position={[0, 0.08, -0.25]} scale={[0.3 * pelvisWidth, 0.28, 0.15]} material={boneMat}>
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
        {/* Iliac Crest wings */}
        <mesh position={[-0.45 * pelvisWidth, 0.22, -0.05]} rotation={[0.15, 0.45, 0.45]} scale={[0.55 * pelvisWidth, 0.75, 0.1]} material={boneMat}>
          <sphereGeometry args={[0.5, 16, 16]} />
        </mesh>
        <mesh position={[0.45 * pelvisWidth, 0.22, -0.05]} rotation={[0.15, -0.45, -0.45]} scale={[0.55 * pelvisWidth, 0.75, 0.1]} material={boneMat}>
          <sphereGeometry args={[0.5, 16, 16]} />
        </mesh>
        {/* Pubic Arch (Wider for female) */}
        <mesh rotation={[Math.PI / 2 + 0.2, 0, 0]} scale={[pelvisWidth, 1.0, 1.0]} material={boneMat}>
          <torusGeometry args={[0.55, 0.065, 12, 32]} />
        </mesh>
      </group>

      {/* ── LIMB BONES ── */}
      {/* Arms */}
      <group>
        <mesh position={[-1.75 * shoulderWidth, 5.2, 0]} rotation={[0, 0, 0.15]} material={boneMat}>
          <cylinderGeometry args={[0.05, 0.05, 1.5, 12]} />
        </mesh>
        <mesh position={[-1.85 * shoulderWidth, 3.2, 0.1]} rotation={[0, 0, 0.06]} material={boneMat}>
          <cylinderGeometry args={[0.04, 0.04, 1.4, 12]} />
        </mesh>
        {/* Hand Anatomy carpal/phalanges cluster */}
        <group position={[-1.9 * shoulderWidth, 2.0, 0.15]} rotation={[0.2, 0, 0.2]}>
          <mesh material={boneMat} scale={[0.14, 0.12, 0.08]}><boxGeometry args={[1, 1, 1]} /></mesh>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={`l-finger-${i}`} position={[-0.08 + i * 0.04, -0.15, 0]} material={boneMat}>
              <cylinderGeometry args={[0.01, 0.008, 0.18, 4]} />
            </mesh>
          ))}
        </group>

        <mesh position={[1.75 * shoulderWidth, 5.2, 0]} rotation={[0, 0, -0.15]} material={boneMat}>
          <cylinderGeometry args={[0.05, 0.05, 1.5, 12]} />
        </mesh>
        <mesh position={[1.85 * shoulderWidth, 3.2, 0.1]} rotation={[0, 0, -0.06]} material={boneMat}>
          <cylinderGeometry args={[0.04, 0.04, 1.4, 12]} />
        </mesh>
        {/* Hand Anatomy */}
        <group position={[1.9 * shoulderWidth, 2.0, 0.15]} rotation={[0.2, 0, -0.2]}>
          <mesh material={boneMat} scale={[0.14, 0.12, 0.08]}><boxGeometry args={[1, 1, 1]} /></mesh>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={`r-finger-${i}`} position={[-0.08 + i * 0.04, -0.15, 0]} material={boneMat}>
              <cylinderGeometry args={[0.01, 0.008, 0.18, 4]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Legs */}
      <group>
        <mesh position={[-0.52 * pelvisWidth, -0.2, 0]} rotation={[0, 0, 0.05]} material={boneMat}>
          <cylinderGeometry args={[0.08, 0.09, 2.0, 12]} />
        </mesh>
        <mesh position={[-0.52 * pelvisWidth, -2.8, 0]} rotation={[0, 0, 0.02]} material={boneMat}>
          <cylinderGeometry args={[0.06, 0.06, 2.0, 12]} />
        </mesh>
        {/* Foot Anatomy tarsal/metatarsal bones cluster */}
        <group position={[-0.52 * pelvisWidth, -4.2, 0.25]} rotation={[0, 0.2, 0]}>
          <mesh material={boneMat} scale={[0.18, 0.08, 0.35]}><boxGeometry args={[1, 1, 1]} /></mesh>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={`l-toe-${i}`} position={[-0.08 + i * 0.04, 0, 0.22]} rotation={[0.1, 0, 0]} material={boneMat}>
              <cylinderGeometry args={[0.012, 0.01, 0.12, 4]} />
            </mesh>
          ))}
        </group>

        <mesh position={[0.52 * pelvisWidth, -0.2, 0]} rotation={[0, 0, -0.05]} material={boneMat}>
          <cylinderGeometry args={[0.08, 0.09, 2.0, 12]} />
        </mesh>
        <mesh position={[0.52 * pelvisWidth, -2.8, 0]} rotation={[0, 0, -0.02]} material={boneMat}>
          <cylinderGeometry args={[0.06, 0.06, 2.0, 12]} />
        </mesh>
        {/* Foot Anatomy */}
        <group position={[0.52 * pelvisWidth, -4.2, 0.25]} rotation={[0, -0.2, 0]}>
          <mesh material={boneMat} scale={[0.18, 0.08, 0.35]}><boxGeometry args={[1, 1, 1]} /></mesh>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh key={`r-toe-${i}`} position={[-0.08 + i * 0.04, 0, 0.22]} rotation={[0.1, 0, 0]} material={boneMat}>
              <cylinderGeometry args={[0.012, 0.01, 0.12, 4]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ── LIGAMENTS (Connective tissue loops connecting joints) ── */}
      <group>
        {/* Shoulder joints */}
        <mesh position={[-1.42 * shoulderWidth, 6.0, 0.12]} rotation={[0, 0, 0.6]} material={ligamentMat}>
          <torusGeometry args={[0.12, 0.03, 6, 16]} />
        </mesh>
        <mesh position={[1.42 * shoulderWidth, 6.0, 0.12]} rotation={[0, 0, -0.6]} material={ligamentMat}>
          <torusGeometry args={[0.12, 0.03, 6, 16]} />
        </mesh>
        {/* Knee joints */}
        <mesh position={[-0.52 * pelvisWidth, -1.5, 0.05]} rotation={[0.2, 0, 0]} material={ligamentMat}>
          <torusGeometry args={[0.16, 0.035, 6, 16]} />
        </mesh>
        <mesh position={[0.52 * pelvisWidth, -1.5, 0.05]} rotation={[0.2, 0, 0]} material={ligamentMat}>
          <torusGeometry args={[0.16, 0.035, 6, 16]} />
        </mesh>
      </group>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ MUSCULAR SYSTEM (FIBERS, PEAS, ABDOMINALS & TENDONS)
   ══════════════════════════════════════════════════════════════ */
export function MuscleFibers({
  mode = 'realistic',
  gender = 'male',
  explode = 0,
  clippingPlanes,
  opacity = 1.0,
}: {
  mode?: RenderMode
  gender?: 'male' | 'female'
  explode?: number
  clippingPlanes?: THREE.Plane[]
  opacity?: number
}) {
  const muscleMat = useAnatomyMaterial('#a64230', 0.45, 0.12, 0.8 * opacity, false, mode, clippingPlanes)
  const tendonMat = useAnatomyMaterial('#eef2f6', 0.55, 0.05, 0.9 * opacity, false, mode, clippingPlanes)

  const offset = getExplodeOffset(explode, [0, 0, 0.4]) // Explode forward

  const pelvisWidth = gender === 'female' ? 1.45 : 1.25
  const shoulderWidth = gender === 'female' ? 1.25 : 1.42

  return (
    <group position={offset}>
      {/* Pectorals / Chest Muscles */}
      <group position={[0, 5.75, 0.35]}>
        <mesh position={[-0.4 * shoulderWidth, 0, 0]} rotation={[0, 0.15, -0.1]} scale={[0.5 * shoulderWidth, 0.28, 0.08]} material={muscleMat}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
        <mesh position={[0.4 * shoulderWidth, 0, 0]} rotation={[0, -0.15, 0.1]} scale={[0.5 * shoulderWidth, 0.28, 0.08]} material={muscleMat}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
      </group>

      {/* Rectus Abdominis (Six Pack!) */}
      <group position={[0, 4.2, 0.4]}>
        {Array.from({ length: 6 }).map((_, idx) => {
          const row = Math.floor(idx / 2)
          const col = idx % 2 === 0 ? -1 : 1
          const py = 0.45 - row * 0.32
          const px = col * 0.16 * pelvisWidth
          return (
            <group key={`muscle-pack-${idx}`} position={[px, py, 0]}>
              <mesh scale={[0.13, 0.13, 0.04]} material={muscleMat}>
                <sphereGeometry args={[1, 12, 12]} />
              </mesh>
              {/* White fibrous boundaries (tendinous intersections) */}
              <mesh position={[0, 0, 0.03]} scale={[0.14, 0.02, 0.005]} material={tendonMat}>
                <boxGeometry args={[1, 1, 1]} />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* Biceps (Arm Muscles) */}
      <group>
        <mesh position={[-1.7 * shoulderWidth, 5.2, 0.25]} rotation={[0.1, 0, 0.1]} scale={[0.18, 0.65, 0.18]} material={muscleMat}>
          <capsuleGeometry args={[1, 0.5, 8, 16]} />
        </mesh>
        <mesh position={[-1.75 * shoulderWidth, 5.85, 0.2]} scale={[0.08, 0.15, 0.08]} material={tendonMat}>
          <cylinderGeometry args={[1, 1, 1, 8]} />
        </mesh>
        <mesh position={[-1.68 * shoulderWidth, 4.5, 0.2]} scale={[0.08, 0.15, 0.08]} material={tendonMat}>
          <cylinderGeometry args={[1, 1, 1, 8]} />
        </mesh>

        <mesh position={[1.7 * shoulderWidth, 5.2, 0.25]} rotation={[0.1, 0, -0.1]} scale={[0.18, 0.65, 0.18]} material={muscleMat}>
          <capsuleGeometry args={[1, 0.5, 8, 16]} />
        </mesh>
        <mesh position={[1.75 * shoulderWidth, 5.85, 0.2]} scale={[0.08, 0.15, 0.08]} material={tendonMat}>
          <cylinderGeometry args={[1, 1, 1, 8]} />
        </mesh>
        <mesh position={[1.68 * shoulderWidth, 4.5, 0.2]} scale={[0.08, 0.15, 0.08]} material={tendonMat}>
          <cylinderGeometry args={[1, 1, 1, 8]} />
        </mesh>
      </group>

      {/* Quadriceps (Thigh Muscles) */}
      <group>
        <mesh position={[-0.52 * pelvisWidth, -0.2, 0.35]} scale={[0.26, 0.82, 0.26]} material={muscleMat}>
          <capsuleGeometry args={[1, 0.5, 8, 16]} />
        </mesh>
        <mesh position={[-0.52 * pelvisWidth, -0.9, 0.22]} scale={[0.12, 0.2, 0.12]} material={tendonMat}>
          <cylinderGeometry args={[1, 1, 1, 8]} />
        </mesh>

        <mesh position={[0.52 * pelvisWidth, -0.2, 0.35]} scale={[0.26, 0.82, 0.26]} material={muscleMat}>
          <capsuleGeometry args={[1, 0.5, 8, 16]} />
        </mesh>
        <mesh position={[0.52 * pelvisWidth, -0.9, 0.22]} scale={[0.12, 0.2, 0.12]} material={tendonMat}>
          <cylinderGeometry args={[1, 1, 1, 8]} />
        </mesh>
      </group>

      {/* Gluteus Maximus */}
      <group position={[0, 0.8, -0.32]}>
        <mesh position={[-0.32 * pelvisWidth, 0, 0]} scale={[0.34, 0.38, 0.26]} material={muscleMat}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
        <mesh position={[0.32 * pelvisWidth, 0, 0]} scale={[0.34, 0.38, 0.26]} material={muscleMat}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
      </group>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ BRAIN MODEL (Hemispheres, Cerebellum, Brainstem, Cranial Nerves)
   ══════════════════════════════════════════════════════════════ */
function BrainModel({ isSel, mode, clippingPlanes }: { isSel: boolean; mode: RenderMode; clippingPlanes?: THREE.Plane[] }) {
  const cortexMat = useAnatomyMaterial('#f6b1b1', 0.1, 0.2, 0.98, isSel, mode, clippingPlanes)
  const cerebellumMat = useAnatomyMaterial('#df7d7d', 0.12, 0.18, 0.98, isSel, mode, clippingPlanes)
  const brainstemMat = useAnatomyMaterial('#edd3cc', 0.15, 0.15, 0.98, isSel, mode, clippingPlanes)

  const gyriCurves = useMemo(() => {
    const list: THREE.Vector3[][] = []
    const createWindingCurve = (centerX: number, centerY: number, centerZ: number, seed: number) => {
      const pts = []
      const steps = 14
      const radius = 0.36
      for (let i = 0; i <= steps; i++) {
        const phi = (i / steps) * Math.PI
        const theta = (i / steps) * Math.PI * 4.5 + seed
        pts.push(
          new THREE.Vector3(
            centerX + Math.sin(phi) * Math.cos(theta) * radius * 0.9,
            centerY + Math.cos(phi) * radius * 0.8,
            centerZ + Math.sin(phi) * Math.sin(theta) * radius * 1.1
          )
        )
      }
      return pts
    }

    list.push(createWindingCurve(-0.2, 0.1, 0, 0))
    list.push(createWindingCurve(-0.25, 0.05, 0.1, 1.2))
    list.push(createWindingCurve(-0.18, -0.05, -0.15, 2.5))
    list.push(createWindingCurve(0.2, 0.1, 0, Math.PI))
    list.push(createWindingCurve(0.25, 0.05, 0.1, Math.PI + 1.2))
    list.push(createWindingCurve(0.18, -0.05, -0.15, Math.PI + 2.5))

    return list.map(pts => new THREE.CatmullRomCurve3(pts))
  }, [])

  return (
    <group scale={1.05}>
      {/* Cerebral Hemispheres */}
      <mesh position={[-0.2, 0.02, 0]} scale={[0.85, 0.72, 1.05]} material={cortexMat}>
        <sphereGeometry args={[0.45, 24, 24]} />
      </mesh>
      <mesh position={[0.2, 0.02, 0]} scale={[0.85, 0.72, 1.05]} material={cortexMat}>
        <sphereGeometry args={[0.45, 24, 24]} />
      </mesh>

      {mode !== 'hologram' &&
        gyriCurves.map((curve, idx) => (
          <mesh key={`gyrus-${idx}`}>
            <tubeGeometry args={[curve, 32, 0.045, 8, false]} />
            <meshStandardMaterial color={idx < 3 ? '#f28e8e' : '#e67c7c'} roughness={0.08} metalness={0.2} clippingPlanes={clippingPlanes} />
          </mesh>
        ))}

      <group position={[0, -0.28, -0.32]} scale={[0.62, 0.36, 0.44]}>
        <mesh material={cerebellumMat}>
          <sphereGeometry args={[0.45, 24, 24]} />
        </mesh>
      </group>

      <mesh position={[0, -0.5, -0.15]} rotation={[0.2, 0, 0]} material={brainstemMat}>
        <cylinderGeometry args={[0.075, 0.09, 0.52, 16]} />
      </mesh>

      {/* Cranial nerves originating from brainstem */}
      <group position={[0, -0.25, 0.22]}>
        <mesh rotation={[0, 0.4, 0.2]} material={brainstemMat}>
          <cylinderGeometry args={[0.02, 0.02, 0.26, 8]} />
        </mesh>
        <mesh rotation={[0, -0.4, -0.2]} material={brainstemMat}>
          <cylinderGeometry args={[0.02, 0.02, 0.26, 8]} />
        </mesh>
      </group>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ HEART MODEL (Ventricles, Fat Pad, Aorta, Vena Cava)
   ══════════════════════════════════════════════════════════════ */
function HeartModel({ isSel, mode, clippingPlanes }: { isSel: boolean; mode: RenderMode; clippingPlanes?: THREE.Plane[] }) {
  const muscleMat = useAnatomyMaterial('#8a0606', 0.1, 0.25, 1.0, isSel, mode, clippingPlanes)
  const veinMat = useAnatomyMaterial('#354674', 0.15, 0.15, 1.0, isSel, mode, clippingPlanes)

  const coronaryArteries = useMemo(() => {
    const list = []
    const pts1 = [
      new THREE.Vector3(-0.06, 0.15, 0.18),
      new THREE.Vector3(-0.11, 0.04, 0.22),
      new THREE.Vector3(-0.14, -0.08, 0.16),
      new THREE.Vector3(-0.08, -0.21, 0.06),
    ]
    const pts2 = [
      new THREE.Vector3(0.08, 0.12, 0.18),
      new THREE.Vector3(0.14, -0.02, 0.2),
      new THREE.Vector3(0.11, -0.15, 0.14),
    ]
    list.push(new THREE.CatmullRomCurve3(pts1))
    list.push(new THREE.CatmullRomCurve3(pts2))
    return list
  }, [])

  return (
    <group rotation={[0, -0.15, 0.25]} scale={1.05}>
      <mesh position={[-0.08, -0.08, 0.02]} scale={[0.88, 1.12, 0.88]} material={muscleMat}>
        <sphereGeometry args={[0.26, 24, 24]} />
      </mesh>
      <mesh position={[0.1, -0.03, 0.06]} scale={[0.72, 0.96, 0.74]} material={muscleMat}>
        <sphereGeometry args={[0.24, 24, 24]} />
      </mesh>

      {/* Coronary Fat Pad */}
      {mode === 'realistic' && (
        <mesh position={[0.01, 0.1, 0.15]} scale={[0.62, 0.44, 0.44]} rotation={[0.2, 0, -0.1]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#ecd6be" roughness={0.25} metalness={0.05} transparent opacity={0.7} clippingPlanes={clippingPlanes} />
        </mesh>
      )}

      {/* Aorta Arch */}
      <mesh position={[0.01, 0.35, -0.06]} rotation={[Math.PI / 2, 0, 0.2]}>
        <torusGeometry args={[0.12, 0.048, 12, 32, Math.PI * 0.98]} />
        <meshStandardMaterial color="#cc1b1b" roughness={0.08} metalness={0.25} clippingPlanes={clippingPlanes} />
      </mesh>

      {/* Superior Vena Cava */}
      <mesh position={[0.16, 0.36, 0.02]} material={veinMat}>
        <cylinderGeometry args={[0.036, 0.036, 0.3, 10]} />
      </mesh>

      {/* Coronary Vessels */}
      {mode !== 'hologram' &&
        coronaryArteries.map((curve, idx) => (
          <mesh key={`coronary-${idx}`}>
            <tubeGeometry args={[curve, 20, 0.014, 6, false]} />
            <meshStandardMaterial color={idx === 0 ? '#de1111' : '#14254c'} roughness={0.1} metalness={0.15} clippingPlanes={clippingPlanes} />
          </mesh>
        ))}
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ LUNGS MODEL (Respiratory lobes & cartilage Trachea rings)
   ══════════════════════════════════════════════════════════════ */
function LungsModel({ isSel, mode, clippingPlanes }: { isSel: boolean; mode: RenderMode; clippingPlanes?: THREE.Plane[] }) {
  const lobeMat = useAnatomyMaterial('#a32525', 0.12, 0.15, 0.98, isSel, mode, clippingPlanes)
  const tracheaMat = useAnatomyMaterial('#eed8d2', 0.15, 0.1, 0.98, isSel, mode, clippingPlanes)

  return (
    <group scale={1.05}>
      {/* Right Lung (3 lobes) */}
      <group position={[0.54, -0.05, 0.02]} rotation={[0, -0.15, -0.05]}>
        <mesh position={[-0.05, 0.3, -0.02]} scale={[0.72, 0.56, 0.52]} material={lobeMat}>
          <sphereGeometry args={[0.48, 20, 20]} />
        </mesh>
        <mesh position={[0, 0.02, 0]} scale={[0.76, 0.52, 0.54]} material={lobeMat}>
          <sphereGeometry args={[0.48, 20, 20]} />
        </mesh>
        <mesh position={[-0.04, -0.28, -0.02]} scale={[0.72, 0.42, 0.5]} material={lobeMat}>
          <sphereGeometry args={[0.48, 20, 20]} />
        </mesh>
      </group>

      {/* Left Lung (2 lobes, smaller with cardiac notch) */}
      <group position={[-0.54, -0.05, 0.02]} rotation={[0, 0.15, 0.05]}>
        <mesh position={[0.05, 0.24, -0.02]} scale={[0.68, 0.62, 0.5]} material={lobeMat}>
          <sphereGeometry args={[0.48, 20, 20]} />
        </mesh>
        <mesh position={[0.04, -0.24, -0.02]} scale={[0.68, 0.55, 0.48]} material={lobeMat}>
          <sphereGeometry args={[0.48, 20, 20]} />
        </mesh>
      </group>

      {/* Trachea */}
      <mesh position={[0, 0.66, -0.05]} material={tracheaMat}>
        <cylinderGeometry args={[0.075, 0.075, 0.58, 16]} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ LIVER MODEL
   ══════════════════════════════════════════════════════════════ */
function LiverModel({ isSel, mode, clippingPlanes }: { isSel: boolean; mode: RenderMode; clippingPlanes?: THREE.Plane[] }) {
  const liverMat = useAnatomyMaterial('#7a251b', 0.1, 0.2, 0.98, isSel, mode, clippingPlanes)
  const gallMat = useAnatomyMaterial('#2d5e1c', 0.15, 0.1, 0.98, isSel, mode, clippingPlanes)

  return (
    <group scale={1.05}>
      <mesh position={[0.14, 0, 0.02]} scale={[1.25, 0.56, 0.74]} material={liverMat}>
        <sphereGeometry args={[0.48, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
      </mesh>
      <mesh position={[-0.34, 0.05, 0.02]} scale={[0.62, 0.44, 0.55]} material={liverMat}>
        <sphereGeometry args={[0.38, 20, 20]} />
      </mesh>
      {/* Gallbladder */}
      <mesh position={[0.18, -0.22, 0.22]} scale={[0.07, 0.12, 0.07]} material={gallMat}>
        <sphereGeometry args={[1, 16, 16]} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ STOMACH MODEL
   ══════════════════════════════════════════════════════════════ */
function StomachModel({ isSel, mode, clippingPlanes }: { isSel: boolean; mode: RenderMode; clippingPlanes?: THREE.Plane[] }) {
  const stomachMat = useAnatomyMaterial('#d07361', 0.1, 0.2, 0.98, isSel, mode, clippingPlanes)
  const esophMat = useAnatomyMaterial('#cca094', 0.15, 0.15, 0.98, isSel, mode, clippingPlanes)

  return (
    <group rotation={[0, -0.1, -0.15]} scale={1.05}>
      <mesh position={[-0.05, 0.5, 0.02]} material={esophMat}>
        <cylinderGeometry args={[0.052, 0.052, 0.28, 10]} />
      </mesh>
      <mesh position={[0, 0.22, 0]} scale={[0.62, 0.52, 0.52]} material={stomachMat}>
        <sphereGeometry args={[0.34, 20, 20]} />
      </mesh>
      <mesh position={[0.01, -0.08, 0.01]} scale={[0.52, 0.72, 0.48]} material={stomachMat}>
        <sphereGeometry args={[0.38, 20, 20]} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ INTESTINES MODEL (Coils & Haustra segments)
   ══════════════════════════════════════════════════════════════ */
function IntestinesModel({ isSel, mode, clippingPlanes }: { isSel: boolean; mode: RenderMode; clippingPlanes?: THREE.Plane[] }) {
  const smallMat = useAnatomyMaterial('#c58878', 0.08, 0.25, 0.98, isSel, mode, clippingPlanes)
  const largeMat = useAnatomyMaterial('#b86a5a', 0.1, 0.22, 0.98, isSel, mode, clippingPlanes)

  const smallIntestineCoils = useMemo(() => {
    const list = []
    const generateWindingGut = (offsetY: number, seed: number) => {
      const pts = []
      const density = 20
      const radiusX = 0.34
      const radiusZ = 0.24
      for (let i = 0; i <= density; i++) {
        const phi = (i / density) * Math.PI * 2
        const theta = (i / density) * Math.PI * 8 + seed
        pts.push(
          new THREE.Vector3(
            Math.sin(phi) * radiusX + Math.cos(theta) * 0.08,
            offsetY + Math.sin(theta) * 0.06 + (i / density - 0.5) * 0.24,
            Math.cos(phi) * radiusZ + Math.sin(theta) * 0.08
          )
        )
      }
      return new THREE.CatmullRomCurve3(pts)
    }
    list.push(generateWindingGut(0.12, 0))
    list.push(generateWindingGut(-0.1, 2.5))
    list.push(generateWindingGut(-0.3, 5.0))
    return list
  }, [])

  const haustraPositions = useMemo(() => {
    return [
      { pos: [0.5, -0.3, 0.12] },
      { pos: [0.5, -0.15, 0.14] },
      { pos: [0.5, 0, 0.13] },
      { pos: [0.5, 0.15, 0.11] },
      { pos: [0.55, 0.3, 0.08] },
      { pos: [0.42, 0.44, 0.12] },
      { pos: [0.26, 0.48, 0.16] },
      { pos: [0.08, 0.5, 0.18] },
      { pos: [-0.1, 0.48, 0.18] },
      { pos: [-0.28, 0.46, 0.16] },
      { pos: [-0.44, 0.42, 0.1] },
      { pos: [-0.54, 0.28, 0.06] },
      { pos: [-0.52, 0.12, 0.1] },
      { pos: [-0.52, -0.04, 0.12] },
      { pos: [-0.52, -0.2, 0.14] },
      { pos: [-0.48, -0.34, 0.11] },
      { pos: [-0.34, -0.45, 0.08] },
      { pos: [-0.16, -0.5, 0.05] },
      { pos: [0, -0.55, 0.02] },
    ]
  }, [])

  return (
    <group scale={1.05}>
      {smallIntestineCoils.map((curve, idx) => (
        <mesh key={`small-gut-${idx}`}>
          <tubeGeometry args={[curve, 48, 0.065, 8, false]} />
          <meshStandardMaterial color="#c58372" roughness={0.08} metalness={0.22} transparent={mode !== 'realistic'} opacity={mode === 'realistic' ? 1.0 : 0.2} clippingPlanes={clippingPlanes} />
        </mesh>
      ))}

      <group>
        {haustraPositions.map((item, idx) => (
          <mesh key={`haustra-${idx}`} position={item.pos as [number, number, number]} scale={[1.1, 0.72, 1.1]} material={largeMat}>
            <sphereGeometry args={[0.088, 16, 12]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ KIDNEYS MODEL
   ══════════════════════════════════════════════════════════════ */
function KidneyModel({ isSel, mode, side, clippingPlanes }: { isSel: boolean; mode: RenderMode; side: 'left' | 'right'; clippingPlanes?: THREE.Plane[] }) {
  const kidneyMat = useAnatomyMaterial('#681212', 0.12, 0.2, 0.98, isSel, mode, clippingPlanes)
  const flip = side === 'left' ? -1 : 1

  return (
    <group scale={[flip, 1, 1]}>
      <mesh scale={[0.55, 0.88, 0.46]} material={kidneyMat}>
        <sphereGeometry args={[0.28, 24, 24]} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ BLADDER MODEL
   ══════════════════════════════════════════════════════════════ */
function BladderModel({ isSel, mode, clippingPlanes }: { isSel: boolean; mode: RenderMode; clippingPlanes?: THREE.Plane[] }) {
  const bladderMat = useAnatomyMaterial('#d7b14d', 0.12, 0.18, 0.98, isSel, mode, clippingPlanes)

  return (
    <group scale={1.05}>
      <mesh scale={[0.78, 0.88, 0.68]} material={bladderMat}>
        <sphereGeometry args={[0.23, 24, 24]} />
      </mesh>
      <mesh position={[0, -0.24, 0.05]} material={bladderMat}>
        <cylinderGeometry args={[0.026, 0.026, 0.16, 8]} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ EYE ANATOMY
   ══════════════════════════════════════════════════════════════ */
export function EyeAnatomy({ isSel, mode, clippingPlanes }: { isSel: boolean; mode: RenderMode; clippingPlanes?: THREE.Plane[] }) {
  const scleraMat = useAnatomyMaterial('#ffffff', 0.1, 0.05, 1.0, isSel, mode, clippingPlanes)
  const irisMat = useAnatomyMaterial('#2563eb', 0.12, 0.1, 1.0, isSel, mode, clippingPlanes)
  const pupilMat = useAnatomyMaterial('#000000', 0.05, 0.0, 1.0, isSel, mode, clippingPlanes)
  const opticMat = useAnatomyMaterial('#d9b64c', 0.3, 0.05, 1.0, isSel, mode, clippingPlanes)

  return (
    <group scale={0.4}>
      {/* Sclera Eyeball */}
      <mesh material={scleraMat}>
        <sphereGeometry args={[0.4, 24, 24]} />
      </mesh>
      {/* Iris */}
      <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]} material={irisMat}>
        <cylinderGeometry args={[0.16, 0.16, 0.04, 16]} />
      </mesh>
      {/* Pupil */}
      <mesh position={[0, 0, 0.325]} rotation={[Math.PI / 2, 0, 0]} material={pupilMat}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
      </mesh>
      {/* Optic Nerve */}
      <mesh position={[0, 0, -0.32]} rotation={[0.2, 0, 0]} material={opticMat}>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ EAR ANATOMY
   ══════════════════════════════════════════════════════════════ */
export function EarAnatomy({ isSel, mode, clippingPlanes }: { isSel: boolean; mode: RenderMode; clippingPlanes?: THREE.Plane[] }) {
  const boneMat = useAnatomyMaterial('#eedcbe', 0.45, 0.04, 1.0, isSel, mode, clippingPlanes)
  const tympanicMat = useAnatomyMaterial('#cca094', 0.2, 0.02, 0.8, isSel, mode, clippingPlanes)

  return (
    <group scale={0.25} rotation={[0, Math.PI / 2, 0]}>
      {/* Auditory Canal */}
      <mesh position={[0, 0.3, 0]} material={tympanicMat}>
        <cylinderGeometry args={[0.1, 0.14, 0.6, 12]} />
      </mesh>
      {/* Eardrum membrane */}
      <mesh position={[0, 0, 0]} rotation={[0.4, 0, 0.2]} material={tympanicMat}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 12]} />
      </mesh>
      {/* Ossicles bone shapes (Malleus, Incus, Stapes) represented by small cylinders */}
      <mesh position={[0.08, -0.1, 0.05]} rotation={[0.2, 0.4, 0]} material={boneMat}>
        <cylinderGeometry args={[0.02, 0.015, 0.25, 6]} />
      </mesh>
      <mesh position={[0.14, -0.22, 0.02]} rotation={[-0.4, 0, 0.3]} material={boneMat}>
        <cylinderGeometry args={[0.02, 0.02, 0.2, 6]} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ ENDOCRINE SYSTEM (Thyroid, Pituitary, Adrenal glands)
   ══════════════════════════════════════════════════════════════ */
export function EndocrineSystem({
  mode = 'realistic',
  explode = 0,
  clippingPlanes,
  opacity = 1.0,
  selected,
  onSelect,
}: {
  mode?: RenderMode
  explode?: number
  clippingPlanes?: THREE.Plane[]
  opacity?: number
  selected: string | null
  onSelect: (id: string) => void
}) {
  const isThyroidSel = selected === 'thyroid'
  const isAdrenalSel = selected === 'adrenal'
  const isPituitarySel = selected === 'pituitary'

  const thyroidMat = useAnatomyMaterial('#df4d7d', 0.22, 0.08, opacity, isThyroidSel, mode, clippingPlanes)
  const adrenalMat = useAnatomyMaterial('#e0a93b', 0.3, 0.05, opacity, isAdrenalSel, mode, clippingPlanes)
  const pituitaryMat = useAnatomyMaterial('#fac03d', 0.25, 0.05, opacity, isPituitarySel, mode, clippingPlanes)

  const offset = getExplodeOffset(explode, [0.4, 0, 0.8]) // Explode forward and right

  const click = (id: string) => (e: any) => {
    e.stopPropagation()
    onSelect(id)
  }

  return (
    <group position={offset}>
      {/* Pituitary gland (in brain cranium base) */}
      <mesh position={[0, 7.82, 0.12]} material={pituitaryMat} onClick={click('pituitary')}>
        <sphereGeometry args={[0.065, 12, 12]} />
      </mesh>

      {/* Thyroid gland (wrapped around neck trachea) */}
      <group position={[0, 6.72, 0.38]} onClick={click('thyroid')}>
        <mesh position={[-0.07, 0, 0]} scale={[0.06, 0.12, 0.05]} material={thyroidMat}>
          <sphereGeometry args={[1, 12, 12]} />
        </mesh>
        <mesh position={[0.07, 0, 0]} scale={[0.06, 0.12, 0.05]} material={thyroidMat}>
          <sphereGeometry args={[1, 12, 12]} />
        </mesh>
        <mesh scale={[0.1, 0.03, 0.02]} material={thyroidMat}>
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      </group>

      {/* Adrenal Glands (On top of kidneys caps) */}
      <group onClick={click('adrenal')}>
        <mesh position={[-0.58, 3.48, -0.16]} rotation={[0.1, 0, -0.2]} scale={[0.12, 0.065, 0.1]} material={adrenalMat}>
          <sphereGeometry args={[1, 12, 12]} />
        </mesh>
        <mesh position={[0.58, 3.48, -0.16]} rotation={[0.1, 0, 0.2]} scale={[0.12, 0.065, 0.1]} material={adrenalMat}>
          <sphereGeometry args={[1, 12, 12]} />
        </mesh>
      </group>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ LYMPHATIC SYSTEM (Spleen, Lymph Nodes & Drainage Channels)
   ══════════════════════════════════════════════════════════════ */
export function LymphaticSystem({
  mode = 'realistic',
  explode = 0,
  clippingPlanes,
  opacity = 1.0,
  selected,
  onSelect,
}: {
  mode?: RenderMode
  explode?: number
  clippingPlanes?: THREE.Plane[]
  opacity?: number
  selected: string | null
  onSelect: (id: string) => void
}) {
  const isSpleenSel = selected === 'spleen'
  const nodeMat = useAnatomyMaterial('#10b981', 0.25, 0.04, opacity, false, mode, clippingPlanes)
  const spleenMat = useAnatomyMaterial('#581c87', 0.18, 0.08, opacity, isSpleenSel, mode, clippingPlanes)

  const offset = getExplodeOffset(explode, [-0.5, 0, 0.5]) // Explode forward and left

  const lymphPaths = useMemo(() => {
    const list = []
    list.push([new THREE.Vector3(-0.25, 6.9, 0.2), new THREE.Vector3(-0.1, 6.5, 0.3)])
    list.push([new THREE.Vector3(0.25, 6.9, 0.2), new THREE.Vector3(0.1, 6.5, 0.3)])
    list.push([new THREE.Vector3(-0.72, 6.0, 0.2), new THREE.Vector3(-0.35, 5.2, 0.3)])
    list.push([new THREE.Vector3(0.72, 6.0, 0.2), new THREE.Vector3(0.35, 5.2, 0.3)])
    list.push([new THREE.Vector3(-0.38, 1.2, 0.3), new THREE.Vector3(-0.48, 0.2, 0.25)])
    list.push([new THREE.Vector3(0.38, 1.2, 0.3), new THREE.Vector3(0.48, 0.2, 0.25)])
    return list.map(pts => new THREE.CatmullRomCurve3(pts))
  }, [])

  return (
    <group position={offset}>
      {/* Spleen */}
      <mesh position={[-0.56, 3.82, -0.06]} scale={[0.18, 0.24, 0.12]} material={spleenMat} onClick={(e) => { e.stopPropagation(); onSelect('spleen'); }}>
        <sphereGeometry args={[1, 16, 16]} />
      </mesh>

      {/* Lymph Nodes */}
      <group>
        <mesh position={[-0.24, 6.8, 0.25]} scale={[0.038, 0.038, 0.038]} material={nodeMat}><sphereGeometry /></mesh>
        <mesh position={[-0.2, 6.6, 0.28]} scale={[0.038, 0.038, 0.038]} material={nodeMat}><sphereGeometry /></mesh>
        <mesh position={[0.24, 6.8, 0.25]} scale={[0.038, 0.038, 0.038]} material={nodeMat}><sphereGeometry /></mesh>
        <mesh position={[0.2, 6.6, 0.28]} scale={[0.038, 0.038, 0.038]} material={nodeMat}><sphereGeometry /></mesh>

        <mesh position={[-0.8, 5.8, 0.24]} scale={[0.045, 0.045, 0.045]} material={nodeMat}><sphereGeometry /></mesh>
        <mesh position={[-0.85, 5.6, 0.2]} scale={[0.045, 0.045, 0.045]} material={nodeMat}><sphereGeometry /></mesh>
        <mesh position={[0.8, 5.8, 0.24]} scale={[0.045, 0.045, 0.045]} material={nodeMat}><sphereGeometry /></mesh>
        <mesh position={[0.85, 5.6, 0.2]} scale={[0.045, 0.045, 0.045]} material={nodeMat}><sphereGeometry /></mesh>

        <mesh position={[-0.38, 1.25, 0.35]} scale={[0.05, 0.05, 0.05]} material={nodeMat}><sphereGeometry /></mesh>
        <mesh position={[-0.45, 1.05, 0.3]} scale={[0.05, 0.05, 0.05]} material={nodeMat}><sphereGeometry /></mesh>
        <mesh position={[0.38, 1.25, 0.35]} scale={[0.05, 0.05, 0.05]} material={nodeMat}><sphereGeometry /></mesh>
        <mesh position={[0.45, 1.05, 0.3]} scale={[0.05, 0.05, 0.05]} material={nodeMat}><sphereGeometry /></mesh>
      </group>

      {/* Lymphatic Vessels */}
      {lymphPaths.map((curve, idx) => (
        <mesh key={`lymph-vessel-${idx}`}>
          <tubeGeometry args={[curve, 10, 0.008, 4, false]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.6 * opacity} clippingPlanes={clippingPlanes} />
        </mesh>
      ))}
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ REPRODUCTIVE SYSTEM (Switchable Male vs Female pelvic organs)
   ══════════════════════════════════════════════════════════════ */
export function ReproductiveSystem({
  gender = 'male',
  mode = 'realistic',
  explode = 0,
  clippingPlanes,
  opacity = 1.0,
  selected,
  onSelect,
}: {
  gender?: 'male' | 'female'
  mode?: RenderMode
  explode?: number
  clippingPlanes?: THREE.Plane[]
  opacity?: number
  selected: string | null
  onSelect: (id: string) => void
}) {
  const isRepSel = selected === 'reproductive'
  const repMat = useAnatomyMaterial(gender === 'female' ? '#df7da8' : '#ccd3ee', 0.2, 0.12, opacity, isRepSel, mode, clippingPlanes)

  const offset = getExplodeOffset(explode, [0, -0.6, 0.9]) // Explode forward and downwards

  const click = (e: any) => {
    e.stopPropagation()
    onSelect('reproductive')
  }

  return (
    <group position={offset} onClick={click}>
      {gender === 'female' ? (
        <group position={[0, 0.9, 0.38]}>
          {/* Uterus Body */}
          <mesh scale={[0.7, 0.85, 0.52]} material={repMat}>
            <sphereGeometry args={[0.22, 20, 20]} />
          </mesh>
          {/* Fallopian tubes */}
          <mesh position={[-0.26, 0.14, 0]} rotation={[0, 0.2, -0.2]} material={repMat}>
            <cylinderGeometry args={[0.016, 0.016, 0.36, 8]} />
          </mesh>
          <mesh position={[0.26, 0.14, 0]} rotation={[0, -0.2, 0.2]} material={repMat}>
            <cylinderGeometry args={[0.016, 0.016, 0.36, 8]} />
          </mesh>
          {/* Ovaries */}
          <mesh position={[-0.42, 0.06, -0.05]} scale={[0.07, 0.05, 0.05]} material={repMat}>
            <sphereGeometry />
          </mesh>
          <mesh position={[0.42, 0.06, -0.05]} scale={[0.07, 0.05, 0.05]} material={repMat}>
            <sphereGeometry />
          </mesh>
        </group>
      ) : (
        <group position={[0, 0.85, 0.44]}>
          {/* Prostate */}
          <mesh scale={[0.6, 0.6, 0.6]} material={repMat}>
            <sphereGeometry args={[0.15, 16, 16]} />
          </mesh>
          {/* Testes */}
          <mesh position={[-0.09, -0.32, 0.1]} scale={[0.08, 0.12, 0.08]} material={repMat}>
            <sphereGeometry />
          </mesh>
          <mesh position={[0.09, -0.32, 0.1]} scale={[0.08, 0.12, 0.08]} material={repMat}>
            <sphereGeometry />
          </mesh>
        </group>
      )}
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ ORGANS LAYER (VISCERAL MAIN BODIES & ACCORDION LABELS)
   ══════════════════════════════════════════════════════════════ */
export function Organs({
  selected,
  onSelect,
  mode = 'realistic',
  gender = 'male',
  explode = 0,
  clippingPlanes,
  visibleSystems,
  opacityOverrides,
}: {
  selected: string | null
  onSelect: (id: string | null) => void
  mode?: RenderMode
  gender?: 'male' | 'female'
  explode?: number
  clippingPlanes?: THREE.Plane[]
  visibleSystems: Record<string, boolean>
  opacityOverrides: Record<string, number>
}) {
  const click = (id: string) => (e: any) => {
    e.stopPropagation()
    onSelect(selected === id ? null : id)
  }

  // Radial Explode vector offsets for each organ
  const getOffset = (id: string) => {
    const defaultOffset = [0, 0, 0]
    if (explode === 0) return defaultOffset

    const directions: Record<string, [number, number, number]> = {
      brain: [0, 1.4, 0],       // Upwards
      heart: [0.12, 0.2, 0.85], // Forward & Right
      lungs: [-0.08, 0, 0.72],  // Forward
      liver: [0.65, -0.15, 0.45], // Right-Forward
      stomach: [-0.62, -0.22, 0.55], // Left-Forward
      intestines: [0, -0.48, 0.88], // Down-Forward
      kidneys: [0, -0.15, -0.55], // Backward
      bladder: [0, -0.65, 0.72], // Down-Forward
      eyes: [0, 0.8, 0.95],     // Up-Forward
      ears: [0.95, 0.8, 0],     // Outwards lateral
    }

    const dir = directions[id] || defaultOffset
    return getExplodeOffset(explode, dir)
  }

  const getSystemOpacity = (systemKey: string) => {
    return opacityOverrides[systemKey] !== undefined ? opacityOverrides[systemKey] : 1.0
  }

  return (
    <group>
      {/* BRAIN */}
      {visibleSystems.brain && (
        <group position={getOffset('brain')} onClick={click('brain')}>
          <BrainModel isSel={selected === 'brain'} mode={mode} clippingPlanes={clippingPlanes} />
          {/* Organ Label */}
          {selected === 'brain' && (
            <Html distanceFactor={7} position={[0, 0.6, 0]}>
              <div className="medical-label">🧠 Brain (Cerebrum)</div>
            </Html>
          )}
        </group>
      )}

      {/* EYES */}
      {visibleSystems.eyes && (
        <group>
          <group position={addVectors(getOffset('eyes'), [-0.24, 8.05, 0.52])} onClick={click('eyes')}>
            <EyeAnatomy isSel={selected === 'eyes'} mode={mode} clippingPlanes={clippingPlanes} />
          </group>
          <group position={addVectors(getOffset('eyes'), [0.24, 8.05, 0.52])} onClick={click('eyes')}>
            <EyeAnatomy isSel={selected === 'eyes'} mode={mode} clippingPlanes={clippingPlanes} />
            {selected === 'eyes' && (
              <Html distanceFactor={6} position={[0, 0.4, 0]}>
                <div className="medical-label">👁️ Eye & Optic Tract</div>
              </Html>
            )}
          </group>
        </group>
      )}

      {/* EARS */}
      {visibleSystems.ears && (
        <group>
          <group position={addVectors(getOffset('ears'), [-0.85, 8.08, 0])} onClick={click('ears')}>
            <EarAnatomy isSel={selected === 'ears'} mode={mode} clippingPlanes={clippingPlanes} />
          </group>
          <group position={addVectors(getOffset('ears'), [0.85, 8.08, 0])} onClick={click('ears')}>
            <EarAnatomy isSel={selected === 'ears'} mode={mode} clippingPlanes={clippingPlanes} />
            {selected === 'ears' && (
              <Html distanceFactor={6} position={[0, 0.5, 0]}>
                <div className="medical-label">👂 Inner Ear (Ossicles)</div>
              </Html>
            )}
          </group>
        </group>
      )}

      {/* HEART */}
      {visibleSystems.heart && (
        <group position={addVectors(getOffset('heart'), [0.13, 5.06, 0.48])} onClick={click('heart')}>
          <HeartModel isSel={selected === 'heart'} mode={mode} clippingPlanes={clippingPlanes} />
          {selected === 'heart' && (
            <Html distanceFactor={6} position={[0, 0.45, 0]}>
              <div className="medical-label">❤️ Cardiac Muscle</div>
            </Html>
          )}
        </group>
      )}

      {/* LUNGS / Respiratory system */}
      {visibleSystems.respiratory && (
        <group position={addVectors(getOffset('lungs'), [0, 5.24, 0.14])} onClick={click('lungs')}>
          <LungsModel isSel={selected === 'lungs'} mode={mode} clippingPlanes={clippingPlanes} />
          {selected === 'lungs' && (
            <Html distanceFactor={6.5} position={[0, 0.65, 0]}>
              <div className="medical-label">🫁 Pulmonary Lobes</div>
            </Html>
          )}
        </group>
      )}

      {/* LIVER */}
      {visibleSystems.digestive && (
        <group position={addVectors(getOffset('liver'), [0.48, 4.02, 0.38])} onClick={click('liver')}>
          <LiverModel isSel={selected === 'liver'} mode={mode} clippingPlanes={clippingPlanes} />
          {selected === 'liver' && (
            <Html distanceFactor={6} position={[0, 0.45, 0]}>
              <div className="medical-label">🟤 Hepatic Lobe</div>
            </Html>
          )}
        </group>
      )}

      {/* STOMACH */}
      {visibleSystems.digestive && (
        <group position={addVectors(getOffset('stomach'), [-0.42, 3.65, 0.46])} onClick={click('stomach')}>
          <StomachModel isSel={selected === 'stomach'} mode={mode} clippingPlanes={clippingPlanes} />
          {selected === 'stomach' && (
            <Html distanceFactor={6} position={[0, 0.42, 0]}>
              <div className="medical-label">🟢 Gastric Reservoir</div>
            </Html>
          )}
        </group>
      )}

      {/* INTESTINES */}
      {visibleSystems.digestive && (
        <group position={addVectors(getOffset('intestines'), [0, 2.22, 0.38])} onClick={click('intestines')}>
          <IntestinesModel isSel={selected === 'intestines'} mode={mode} clippingPlanes={clippingPlanes} />
          {selected === 'intestines' && (
            <Html distanceFactor={6.8} position={[0, 0.6, 0]}>
              <div className="medical-label">🌀 Gastrointestinal Tract</div>
            </Html>
          )}
        </group>
      )}

      {/* KIDNEYS / Urinary system */}
      {visibleSystems.urinary && (
        <group>
          <group position={addVectors(getOffset('kidneys'), [-0.58, 3.32, -0.22])} onClick={click('kidneys')}>
            <KidneyModel isSel={selected === 'kidneys'} mode={mode} side="left" clippingPlanes={clippingPlanes} />
          </group>
          <group position={addVectors(getOffset('kidneys'), [0.58, 3.32, -0.22])} onClick={click('kidneys')}>
            <KidneyModel isSel={selected === 'kidneys'} mode={mode} side="right" clippingPlanes={clippingPlanes} />
            {selected === 'kidneys' && (
              <Html distanceFactor={6.2} position={[0, 0.5, 0]}>
                <div className="medical-label">🫘 Renal Filtering nodes</div>
              </Html>
            )}
          </group>
        </group>
      )}

      {/* BLADDER */}
      {visibleSystems.urinary && (
        <group position={addVectors(getOffset('bladder'), [0, 1.25, 0.48])} onClick={click('bladder')}>
          <BladderModel isSel={selected === 'bladder'} mode={mode} clippingPlanes={clippingPlanes} />
          {selected === 'bladder' && (
            <Html distanceFactor={5.5} position={[0, 0.3, 0]}>
              <div className="medical-label">💧 Urinary Bladder</div>
            </Html>
          )}
        </group>
      )}    </group>
  )
}

function addVectors(v1: [number, number, number], v2: [number, number, number]): [number, number, number] {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]]
}

/* ══════════════════════════════════════════════════════════════
   ▸ ISOLATED ORGAN (FOR DIAGNOSTIC ZOOM-IN VIEW)
   ══════════════════════════════════════════════════════════════ */
export function IsolatedOrgan({
  organId,
  mode = 'realistic',
  gender = 'male',
  clippingPlanes,
}: {
  organId: string
  mode?: RenderMode
  gender?: 'male' | 'female'
  clippingPlanes?: THREE.Plane[]
}) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.32
    }
  })

  return (
    <group ref={ref} scale={2.4}>
      {organId === 'brain' && <BrainModel isSel={true} mode={mode} clippingPlanes={clippingPlanes} />}
      {organId === 'heart' && <HeartModel isSel={true} mode={mode} clippingPlanes={clippingPlanes} />}
      {organId === 'lungs' && <LungsModel isSel={true} mode={mode} clippingPlanes={clippingPlanes} />}
      {organId === 'liver' && <LiverModel isSel={true} mode={mode} clippingPlanes={clippingPlanes} />}
      {organId === 'stomach' && <StomachModel isSel={true} mode={mode} clippingPlanes={clippingPlanes} />}
      {organId === 'intestines' && <IntestinesModel isSel={true} mode={mode} clippingPlanes={clippingPlanes} />}
      {organId === 'kidneys' && (
        <group>
          <group position={[-0.32, 0, 0]}>
            <KidneyModel isSel={true} mode={mode} side="left" clippingPlanes={clippingPlanes} />
          </group>
          <group position={[0.32, 0, 0]}>
            <KidneyModel isSel={true} mode={mode} side="right" clippingPlanes={clippingPlanes} />
          </group>
        </group>
      )}
      {organId === 'bladder' && <BladderModel isSel={true} mode={mode} clippingPlanes={clippingPlanes} />}
      {organId === 'eyes' && <EyeAnatomy isSel={true} mode={mode} clippingPlanes={clippingPlanes} />}
      {organId === 'ears' && <EarAnatomy isSel={true} mode={mode} clippingPlanes={clippingPlanes} />}
      {organId === 'endocrine' && (
        <EndocrineSystem selected="thyroid" onSelect={() => {}} mode={mode} clippingPlanes={clippingPlanes} />
      )}
      {organId === 'lymphatic' && (
        <LymphaticSystem selected="spleen" onSelect={() => {}} mode={mode} clippingPlanes={clippingPlanes} />
      )}
      {organId === 'reproductive' && (
        <ReproductiveSystem gender={gender} mode={mode} clippingPlanes={clippingPlanes} selected="reproductive" onSelect={() => {}} />
      )}
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ VASCULAR (ARTERIES & VEINS) & NERVOUS NETWORK TREES
   ══════════════════════════════════════════════════════════════ */
export function VascularSystem({
  activeSystem,
  onSelect,
  mode = 'realistic',
  showVascular = true,
  showNervous = true,
  explode = 0,
  clippingPlanes,
  opacityOverrides,
}: {
  activeSystem: string | null
  onSelect: (s: string) => void
  mode?: RenderMode
  showVascular?: boolean
  showNervous?: boolean
  explode?: number
  clippingPlanes?: THREE.Plane[]
  opacityOverrides: Record<string, number>
}) {
  const offset = getExplodeOffset(explode, [0, 0, 0.25]) // Explode forward slightly

  const tubes = useMemo(() => {
    const list: { pts: THREE.Vector3[]; type: string }[] = []
    const add = (s: number[], e: number[], type: string, mid?: number[]) => {
      const points = mid
        ? [new THREE.Vector3(s[0], s[1], s[2]), new THREE.Vector3(mid[0], mid[1], mid[2]), new THREE.Vector3(e[0], e[1], e[2])]
        : [new THREE.Vector3(s[0], s[1], s[2]), new THREE.Vector3((s[0] + e[0]) / 2, (s[1] + e[1]) / 2, (s[2] + e[2]) / 2 + 0.15), new THREE.Vector3(e[0], e[1], e[2])]
      list.push({ pts: points, type })
    }

    add([0.13, 5.06, 0.48], [0, 8.16, 0.1], 'artery', [0.08, 6.6, 0.35])
    add([0.13, 5.06, 0.48], [0.48, 4.02, 0.38], 'artery')
    add([0.13, 5.06, 0.48], [0.58, 3.32, -0.22], 'artery')
    add([0.13, 5.06, 0.48], [-0.58, 3.32, -0.22], 'artery', [-0.25, 4.1, -0.1])
    add([0.13, 5.06, 0.48], [0.02, 2.22, 0.38], 'artery', [0.05, 3.4, 0.42])
    add([0.13, 5.06, 0.48], [-0.54, 5.24, 0.14], 'artery')
    add([0.13, 5.06, 0.48], [0.54, 5.24, 0.14], 'artery')
    add([0.02, 3.0, -0.1], [-0.52, -0.2, 0], 'artery', [-0.38, 1.2, 0.15])
    add([0.02, 3.0, -0.1], [0.52, -0.2, 0], 'artery', [0.38, 1.2, 0.15])
    add([-0.52, -0.2, 0], [-0.52, -2.8, 0], 'artery')
    add([0.52, -0.2, 0], [0.52, -2.8, 0], 'artery')
    add([-0.52, -2.8, 0], [-0.52, -4.2, 0.2], 'artery')
    add([0.52, -2.8, 0], [0.52, -4.2, 0.2], 'artery')
    add([0.13, 5.06, 0.48], [-1.75, 5.2, 0], 'artery', [-0.75, 5.4, 0.22])
    add([0.13, 5.06, 0.48], [1.75, 5.2, 0], 'artery', [0.75, 5.4, 0.22])
    add([-1.75, 5.2, 0], [-1.85, 3.2, 0.1], 'artery')
    add([1.75, 5.2, 0], [1.85, 3.2, 0.1], 'artery')

    add([0, 8.16, 0.18], [0.15, 5.12, 0.46], 'vein', [0.15, 6.6, 0.42])
    add([0.48, 4.1, 0.42], [0.15, 5.12, 0.46], 'vein')
    add([0.58, 3.38, -0.16], [0.15, 5.12, 0.46], 'vein', [0.38, 4.1, 0.18])
    add([-0.58, 3.38, -0.16], [0.15, 5.12, 0.46], 'vein', [-0.18, 4.1, 0.18])
    add([-1.85, 3.2, 0.1], [-1.75, 5.2, 0], 'vein')
    add([1.85, 3.2, 0.1], [1.75, 5.2, 0], 'vein')
    add([-1.75, 5.2, 0], [0.15, 5.12, 0.46], 'vein', [-0.68, 5.5, 0.35])
    add([1.75, 5.2, 0], [0.15, 5.12, 0.46], 'vein', [0.68, 5.5, 0.35])
    add([-0.52, -4.2, 0.22], [-0.52, -2.8, 0], 'vein')
    add([0.52, -4.2, 0.22], [0.52, -2.8, 0], 'vein')
    add([-0.52, -2.8, 0], [-0.52, -0.2, 0], 'vein')
    add([0.52, -2.8, 0], [0.52, -0.2, 0], 'vein')
    add([-0.52, -0.2, 0], [0.02, 3.0, -0.05], 'vein', [-0.28, 1.2, 0.12])
    add([0.52, -0.2, 0], [0.02, 3.0, -0.05], 'vein', [0.28, 1.2, 0.12])

    add([0, 8.16, -0.05], [0, 7.3, -0.32], 'nerve')
    for (let i = 0; i < 18; i++) {
      const y = 7.1 - i * 0.32
      const side = i % 2 === 0 ? -1 : 1
      const reach = i < 4 ? 1.62 : i < 10 ? 1.34 : 0.95
      add([0, y, -0.32], [side * reach, y - 0.45, 0.2], 'nerve', [side * 0.4, y - 0.15, -0.15])
    }
    add([0, 0.95, -0.25], [-0.52, -0.2, -0.05], 'nerve', [-0.28, 0.15, -0.2])
    add([0, 0.95, -0.25], [0.52, -0.2, -0.05], 'nerve', [0.28, 0.15, -0.2])
    add([-0.52, -0.2, -0.05], [-0.52, -2.8, -0.05], 'nerve')
    add([0.52, -0.2, -0.05], [0.52, -2.8, -0.05], 'nerve')
    add([-0.52, -2.8, -0.05], [-0.52, -4.2, 0.18], 'nerve')
    add([0.52, -2.8, -0.05], [0.52, -4.2, 0.18], 'nerve')

    return list
  }, [])

  return (
    <group position={offset}>
      {tubes.map((tube, i) => {
        const curve = new THREE.CatmullRomCurve3(tube.pts)
        const isActive = activeSystem === tube.type
        const dimmed = activeSystem && !isActive

        const systemColors: Record<string, string> = {
          artery: '#EF4444',
          vein: '#3B82F6',
          nerve: '#FACC15',
        }

        const color = systemColors[tube.type] || '#FFFFFF'
        const rawRadius = tube.type === 'nerve' ? 0.015 : 0.024
        const radius = isActive ? rawRadius * 2.0 : rawRadius

        const isVasc = tube.type === 'artery' || tube.type === 'vein'
        const isNerv = tube.type === 'nerve'
        if (isVasc && !showVascular) return null
        if (isNerv && !showNervous) return null

        const systemKey = isNerv ? 'nervous' : tube.type === 'artery' ? 'arteries' : 'veins'
        const opacityOverride = opacityOverrides[systemKey] !== undefined ? opacityOverrides[systemKey] : 1.0

        return (
          <mesh
            key={`tube-${i}`}
            onClick={e => {
              e.stopPropagation()
              onSelect(tube.type)
            }}
          >
            <tubeGeometry args={[curve, 16, radius, 6, false]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isActive ? 2.5 : 0.25}
              transparent
              opacity={dimmed ? 0.06 : (isActive ? 1.0 : 0.55) * opacityOverride}
              depthWrite={!dimmed}
              clippingPlanes={clippingPlanes}
            />
          </mesh>
        )
      })}
    </group>
  )
}
