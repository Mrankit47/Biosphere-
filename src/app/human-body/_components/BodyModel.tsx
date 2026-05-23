'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

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
  mode: RenderMode
) {
  return useMemo(() => {
    if (mode === 'xray') {
      const xrayColor = new THREE.Color('#38bdf8') // Light blue cyan
      return new THREE.MeshStandardMaterial({
        color: xrayColor,
        emissive: xrayColor,
        emissiveIntensity: isSel ? 2.5 : 0.4,
        transparent: true,
        opacity: isSel ? 0.75 : 0.18,
        roughness: 0.1,
        metalness: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    } else if (mode === 'hologram') {
      const holoColor = new THREE.Color('#10b981') // Emerald green
      return new THREE.MeshStandardMaterial({
        color: holoColor,
        emissive: holoColor,
        emissiveIntensity: isSel ? 3.0 : 0.6,
        transparent: true,
        opacity: isSel ? 0.8 : 0.15,
        wireframe: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    } else {
      // Hyper-Realistic Medical Mode (Highly Glossy, Wet Specular Look)
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.12, // LOW roughness for wet specular highlights
        metalness: 0.18, // Subtle metalness for premium environment reflections
        transparent: opacity < 1,
        opacity: isSel ? 1.0 : opacity,
        emissive: isSel ? new THREE.Color(color).multiplyScalar(0.35) : new THREE.Color('#000000'),
        emissiveIntensity: isSel ? 0.8 : 0,
        side: THREE.DoubleSide,
      })
    }
  }, [color, roughness, metalness, opacity, isSel, mode])
}

/* ══════════════════════════════════════════════════════════════
   ▸ HUMAN BODY SILHOUETTE & SKIN
   ══════════════════════════════════════════════════════════════ */
export function HumanBodySilhouette({
  opacity = 0.18,
  mode = 'realistic',
}: {
  opacity?: number
  mode?: RenderMode
}) {
  const skinMat = useAnatomyMaterial('#f5c2a2', 0.8, 0.05, opacity, false, mode)

  // Hologram scanlines
  const scanlines = useMemo(() => {
    const lines = []
    for (let i = 0; i < 40; i++) {
      lines.push(8.5 - i * 0.35)
    }
    return lines
  }, [])

  return (
    <group>
      {/* Outer Skin Silhouette Mesh */}
      <group>
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
        {/* Torso & Abdomen */}
        <mesh position={[0, 5.5, 0]} scale={[1.35, 1.25, 0.75]} material={skinMat}>
          <capsuleGeometry args={[1, 0.5, 16, 32]} />
        </mesh>
        <mesh position={[0, 3.2, 0.05]} scale={[1.15, 1.85, 0.7]} material={skinMat}>
          <capsuleGeometry args={[1, 0.5, 16, 32]} />
        </mesh>
        <mesh position={[0, 1.2, 0]} scale={[1.25, 0.65, 0.65]} material={skinMat}>
          <sphereGeometry args={[1, 32, 16]} />
        </mesh>

        {/* Arms */}
        <mesh position={[-1.75, 5.2, 0]} rotation={[0, 0, 0.15]} material={skinMat}>
          <capsuleGeometry args={[0.22, 1.8, 12, 24]} />
        </mesh>
        <mesh position={[-1.85, 3.2, 0.1]} rotation={[0, 0, 0.06]} material={skinMat}>
          <capsuleGeometry args={[0.17, 1.6, 12, 24]} />
        </mesh>
        <mesh position={[-1.9, 2.0, 0.15]} scale={[0.5, 0.7, 0.3]} material={skinMat}>
          <sphereGeometry args={[0.3, 16, 16]} />
        </mesh>

        <mesh position={[1.75, 5.2, 0]} rotation={[0, 0, -0.15]} material={skinMat}>
          <capsuleGeometry args={[0.22, 1.8, 12, 24]} />
        </mesh>
        <mesh position={[1.85, 3.2, 0.1]} rotation={[0, 0, -0.06]} material={skinMat}>
          <capsuleGeometry args={[0.17, 1.6, 12, 24]} />
        </mesh>
        <mesh position={[1.9, 2.0, 0.15]} scale={[0.5, 0.7, 0.3]} material={skinMat}>
          <sphereGeometry args={[0.3, 16, 16]} />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.52, -0.2, 0]} material={skinMat}>
          <capsuleGeometry args={[0.28, 2.2, 12, 24]} />
        </mesh>
        <mesh position={[-0.52, -2.8, 0]} material={skinMat}>
          <capsuleGeometry args={[0.2, 2.2, 12, 24]} />
        </mesh>
        <mesh position={[-0.52, -4.2, 0.25]} scale={[0.5, 0.3, 0.8]} material={skinMat}>
          <sphereGeometry args={[0.4, 16, 16]} />
        </mesh>

        <mesh position={[0.52, -0.2, 0]} material={skinMat}>
          <capsuleGeometry args={[0.28, 2.2, 12, 24]} />
        </mesh>
        <mesh position={[0.52, -2.8, 0]} material={skinMat}>
          <capsuleGeometry args={[0.2, 2.2, 12, 24]} />
        </mesh>
        <mesh position={[0.52, -4.2, 0.25]} scale={[0.5, 0.3, 0.8]} material={skinMat}>
          <sphereGeometry args={[0.4, 16, 16]} />
        </mesh>
      </group>

      {/* Hologram Scanlines Overlay */}
      {mode === 'hologram' && (
        <group>
          {scanlines.map((y, idx) => (
            <mesh key={`scan-${idx}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[1.35 - Math.abs(y - 3.5) * 0.09, 0.005, 4, 32]} />
              <meshBasicMaterial color="#10b981" transparent opacity={0.12} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ SKELETON (BEIGE TEXTURED ORGANIC BONES)
   ══════════════════════════════════════════════════════════════ */
export function Skeleton({ mode = 'realistic' }: { mode?: RenderMode }) {
  const boneMat = useAnatomyMaterial('#f3ede2', 0.4, 0.04, 0.5, false, mode)
  const skullMat = useAnatomyMaterial('#f4eee3', 0.45, 0.03, 0.55, false, mode)

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
    <group>
      {/* ── SKULL ── */}
      <group position={[0, 8.2, 0]}>
        {/* Cranium Dome */}
        <mesh position={[0, 0.05, -0.05]} material={skullMat}>
          <sphereGeometry args={[0.72, 32, 32]} />
        </mesh>
        {/* Facial structure */}
        <mesh position={[0, -0.3, 0.22]} scale={[0.55, 0.42, 0.4]} material={skullMat}>
          <sphereGeometry args={[0.9, 16, 16]} />
        </mesh>
        {/* Cheekbones */}
        <mesh position={[-0.38, -0.28, 0.28]} scale={[0.12, 0.12, 0.15]} material={skullMat}>
          <sphereGeometry args={[1, 12, 12]} />
        </mesh>
        <mesh position={[0.38, -0.28, 0.28]} scale={[0.12, 0.12, 0.15]} material={skullMat}>
          <sphereGeometry args={[1, 12, 12]} />
        </mesh>
        {/* Jaw Joint & Mandible */}
        <mesh position={[0, -0.58, 0.18]} scale={[0.5, 0.28, 0.45]} material={skullMat}>
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      </group>

      {/* ── SPINE ── */}
      {Array.from({ length: 24 }).map((_, i) => {
        const y = 7.3 - i * 0.28
        return (
          <group key={`vertebra-${i}`} position={[0, y, -0.32]}>
            {/* Vertebral body */}
            <mesh material={boneMat}>
              <cylinderGeometry args={[0.14, 0.15, 0.12, 12]} />
            </mesh>
            {/* Lateral processes */}
            <mesh position={[-0.15, 0, -0.05]} scale={[0.2, 0.05, 0.05]} material={boneMat}>
              <boxGeometry args={[1, 1, 1]} />
            </mesh>
            <mesh position={[0.15, 0, -0.05]} scale={[0.2, 0.05, 0.05]} material={boneMat}>
              <boxGeometry args={[1, 1, 1]} />
            </mesh>
            {/* Spinous process (extends backward) */}
            <mesh position={[0, 0, -0.15]} scale={[0.06, 0.08, 0.25]} material={boneMat}>
              <boxGeometry args={[1, 1, 1]} />
            </mesh>
          </group>
        )
      })}

      {/* ── CLAVICLES ── */}
      <mesh position={[-0.52, 6.45, 0.25]} rotation={[0.08, 0.2, 0.15]} material={boneMat}>
        <cylinderGeometry args={[0.035, 0.035, 0.95, 12]} />
      </mesh>
      <mesh position={[0.52, 6.45, 0.25]} rotation={[0.08, -0.2, -0.15]} material={boneMat}>
        <cylinderGeometry args={[0.035, 0.035, 0.95, 12]} />
      </mesh>

      {/* ── STERNUM ── */}
      <mesh position={[0, 5.3, 0.45]} scale={[0.09, 0.85, 0.04]} material={boneMat}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      {/* ── RIBCAGE ── */}
      {ribs.map((rib, i) => (
        <group key={`ribpair-${i}`} position={[0, rib.y, 0]}>
          {/* Left Rib */}
          <mesh rotation={[0.1, -0.15, -0.08]} scale={rib.scale as [number, number, number]}>
            <torusGeometry args={[rib.w, 0.026, 8, 36, Math.PI * 0.98]} />
            <meshStandardMaterial color="#eedcbe" transparent={mode !== 'realistic'} opacity={mode === 'realistic' ? 0.38 : 0.15} roughness={0.5} />
          </mesh>
          {/* Right Rib */}
          <mesh rotation={[0.1, Math.PI + 0.15, 0.08]} scale={rib.scale as [number, number, number]}>
            <torusGeometry args={[rib.w, 0.026, 8, 36, Math.PI * 0.98]} />
            <meshStandardMaterial color="#eedcbe" transparent={mode !== 'realistic'} opacity={mode === 'realistic' ? 0.38 : 0.15} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* ── PELVIS ── */}
      <group position={[0, 0.95, 0.05]}>
        <mesh position={[0, 0.08, -0.25]} scale={[0.3, 0.28, 0.15]} material={boneMat}>
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
        <mesh position={[-0.45, 0.22, -0.05]} rotation={[0.15, 0.45, 0.45]} scale={[0.55, 0.75, 0.1]} material={boneMat}>
          <sphereGeometry args={[0.5, 16, 16]} />
        </mesh>
        <mesh position={[0.45, 0.22, -0.05]} rotation={[0.15, -0.45, -0.45]} scale={[0.55, 0.75, 0.1]} material={boneMat}>
          <sphereGeometry args={[0.5, 16, 16]} />
        </mesh>
        <mesh rotation={[Math.PI / 2 + 0.2, 0, 0]} material={boneMat}>
          <torusGeometry args={[0.55, 0.065, 12, 32]} />
        </mesh>
      </group>

      {/* ── LIMB BONES ── */}
      <mesh position={[-0.52, -0.2, 0]} rotation={[0, 0, 0.05]} material={boneMat}>
        <cylinderGeometry args={[0.07, 0.08, 1.45, 12]} />
      </mesh>
      <mesh position={[0.52, -0.2, 0]} rotation={[0, 0, -0.05]} material={boneMat}>
        <cylinderGeometry args={[0.07, 0.08, 1.45, 12]} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ BRAIN MODEL
   ══════════════════════════════════════════════════════════════ */
function BrainModel({ isSel, mode }: { isSel: boolean; mode: RenderMode }) {
  const cortexMat = useAnatomyMaterial('#f6b1b1', 0.1, 0.2, 0.98, isSel, mode)
  const cerebellumMat = useAnatomyMaterial('#df7d7d', 0.12, 0.18, 0.98, isSel, mode)
  const brainstemMat = useAnatomyMaterial('#edd3cc', 0.15, 0.15, 0.98, isSel, mode)

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
            <meshStandardMaterial color={idx < 3 ? '#f28e8e' : '#e67c7c'} roughness={0.08} metalness={0.2} />
          </mesh>
        ))}

      <group position={[0, -0.28, -0.32]} scale={[0.62, 0.36, 0.44]}>
        <mesh material={cerebellumMat}>
          <sphereGeometry args={[0.45, 24, 24]} />
        </mesh>
        {mode !== 'hologram' &&
          Array.from({ length: 6 }).map((_, i) => (
            <mesh key={`cereb-ring-${i}`} position={[0, 0.15 - i * 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.38 - Math.abs(i - 2.5) * 0.04, 0.02, 6, 16]} />
              <meshStandardMaterial color="#c06060" roughness={0.15} metalness={0.1} />
            </mesh>
          ))}
      </group>

      <mesh position={[0, -0.5, -0.15]} rotation={[0.2, 0, 0]} material={brainstemMat}>
        <cylinderGeometry args={[0.075, 0.09, 0.52, 16]} />
      </mesh>

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
   ▸ HEART MODEL (RICH MYOCARDIUM WITH REALISTIC FAT PAD & VESSELS)
   ══════════════════════════════════════════════════════════════ */
function HeartModel({ isSel, mode }: { isSel: boolean; mode: RenderMode }) {
  // Rich blood-red myocardium material matching the heart image
  const muscleMat = useAnatomyMaterial('#8a0606', 0.1, 0.25, 1.0, isSel, mode)
  const aortaMat = useAnatomyMaterial('#d01a1a', 0.12, 0.2, 1.0, isSel, mode)
  const veinMat = useAnatomyMaterial('#354674', 0.15, 0.15, 1.0, isSel, mode) // Grey-blue venous tone matching heart image

  // Branching coronary vessel networks wrapping dynamically around ventricle walls (Second Image)
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
    // Secondary branches
    const pts3 = [
      new THREE.Vector3(-0.11, 0.04, 0.22),
      new THREE.Vector3(-0.02, -0.06, 0.23),
      new THREE.Vector3(0.04, -0.14, 0.18),
    ]
    list.push(new THREE.CatmullRomCurve3(pts1))
    list.push(new THREE.CatmullRomCurve3(pts2))
    list.push(new THREE.CatmullRomCurve3(pts3))
    return list
  }, [])

  return (
    <group rotation={[0, -0.15, 0.25]} scale={1.05}>
      {/* Myocardium main muscular mass (ventricles) */}
      <mesh position={[-0.08, -0.08, 0.02]} scale={[0.88, 1.12, 0.88]} material={muscleMat}>
        <sphereGeometry args={[0.26, 24, 24]} />
      </mesh>
      {/* Right Ventricle */}
      <mesh position={[0.1, -0.03, 0.06]} scale={[0.72, 0.96, 0.74]} material={muscleMat}>
        <sphereGeometry args={[0.24, 24, 24]} />
      </mesh>

      {/* ── CORONARY FAT PAD (Upper anterior cream fatty overlay) ── */}
      {mode === 'realistic' && (
        <mesh position={[0.01, 0.1, 0.15]} scale={[0.62, 0.44, 0.44]} rotation={[0.2, 0, -0.1]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          {/* Fleshy fat pad color matching the heart image */}
          <meshStandardMaterial color="#ecd6be" roughness={0.25} metalness={0.05} transparent opacity={0.7} />
        </mesh>
      )}

      {/* Left Atrium */}
      <mesh position={[-0.08, 0.22, -0.05]} scale={[0.65, 0.55, 0.65]} material={muscleMat}>
        <sphereGeometry args={[0.2, 16, 16]} />
      </mesh>
      {/* Right Atrium */}
      <mesh position={[0.1, 0.22, 0.04]} scale={[0.6, 0.52, 0.6]} material={muscleMat}>
        <sphereGeometry args={[0.19, 16, 16]} />
      </mesh>

      {/* AORTA ARCH (Thick Shiny Red Curved Tube) */}
      <mesh position={[0.01, 0.35, -0.06]} rotation={[Math.PI / 2, 0, 0.2]}>
        <torusGeometry args={[0.12, 0.048, 12, 32, Math.PI * 0.98]} />
        <meshStandardMaterial color="#cc1b1b" roughness={0.08} metalness={0.25} />
      </mesh>
      {/* Aorta branches */}
      <mesh position={[0.08, 0.46, -0.05]} rotation={[-0.1, 0, -0.1]}>
        <cylinderGeometry args={[0.016, 0.016, 0.18, 8]} />
        <meshStandardMaterial color="#cc1b1b" roughness={0.1} />
      </mesh>
      <mesh position={[0.0, 0.48, -0.03]} rotation={[-0.1, 0, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.18, 8]} />
        <meshStandardMaterial color="#cc1b1b" roughness={0.1} />
      </mesh>
      <mesh position={[-0.07, 0.46, -0.03]} rotation={[-0.1, 0, 0.1]}>
        <cylinderGeometry args={[0.014, 0.014, 0.18, 8]} />
        <meshStandardMaterial color="#cc1b1b" roughness={0.1} />
      </mesh>

      {/* SUPERIOR VENA CAVA (Venous blue-grey cylinder) */}
      <mesh position={[0.16, 0.36, 0.02]} material={veinMat}>
        <cylinderGeometry args={[0.036, 0.036, 0.3, 10]} />
      </mesh>

      {/* PULMONARY ARTERY TRUNK */}
      <mesh position={[-0.04, 0.33, 0.09]} rotation={[0.2, 0, -0.42]}>
        <cylinderGeometry args={[0.032, 0.032, 0.22, 10]} />
        <meshStandardMaterial color="#942a40" roughness={0.15} />
      </mesh>

      {/* Coronary Vessels branches on myocardium (Deep dark purple/black veins) */}
      {mode !== 'hologram' &&
        coronaryArteries.map((curve, idx) => (
          <mesh key={`coronary-${idx}`}>
            <tubeGeometry args={[curve, 20, 0.014, 6, false]} />
            <meshStandardMaterial color={idx === 0 ? '#de1111' : '#14254c'} roughness={0.1} metalness={0.15} />
          </mesh>
        ))}
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ LUNGS MODEL (MAROON LOBES WITH ANTERIOR BRONCHIAL BRANCHES)
   ══════════════════════════════════════════════════════════════ */
function LungsModel({ isSel, mode }: { isSel: boolean; mode: RenderMode }) {
  // Rich maroon-red color matching the lung image
  const lobeMat = useAnatomyMaterial('#a32525', 0.12, 0.15, 0.98, isSel, mode)
  const tracheaMat = useAnatomyMaterial('#eed8d2', 0.15, 0.1, 0.98, isSel, mode)

  // Surface bronchial branches (beige pipelines) running over front of lobes (First Image)
  const surfaceBronchialCurves = useMemo(() => {
    const list = []
    // Left lung surface branches
    list.push(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.05, 0.35, 0.08),
        new THREE.Vector3(-0.2, 0.22, 0.22),
        new THREE.Vector3(-0.38, 0.14, 0.24),
        new THREE.Vector3(-0.5, 0.02, 0.18),
      ])
    )
    list.push(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.2, 0.22, 0.22),
        new THREE.Vector3(-0.16, 0.08, 0.26),
        new THREE.Vector3(-0.22, -0.06, 0.22),
      ])
    )
    // Right lung surface branches
    list.push(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.05, 0.35, 0.08),
        new THREE.Vector3(0.22, 0.24, 0.22),
        new THREE.Vector3(0.42, 0.18, 0.24),
        new THREE.Vector3(0.55, 0.08, 0.16),
      ])
    )
    list.push(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.22, 0.24, 0.22),
        new THREE.Vector3(0.18, 0.08, 0.26),
        new THREE.Vector3(0.26, -0.08, 0.24),
      ])
    )
    return list
  }, [])

  return (
    <group scale={1.05}>
      {/* ── RIGHT LUNG (3 rich maroon-red lobes) ── */}
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

      {/* ── LEFT LUNG (2 lobes, smaller with notch) ── */}
      <group position={[-0.54, -0.05, 0.02]} rotation={[0, 0.15, 0.05]}>
        <mesh position={[0.05, 0.24, -0.02]} scale={[0.68, 0.62, 0.5]} material={lobeMat}>
          <sphereGeometry args={[0.48, 20, 20]} />
        </mesh>
        <mesh position={[0.04, -0.24, -0.02]} scale={[0.68, 0.55, 0.48]} material={lobeMat}>
          <sphereGeometry args={[0.48, 20, 20]} />
        </mesh>
        {mode === 'realistic' && (
          <mesh position={[0.22, -0.12, 0.18]} scale={[0.28, 0.28, 0.28]}>
            <sphereGeometry args={[0.3, 12, 12]} />
            <meshBasicMaterial color="#020402" />
          </mesh>
        )}
      </group>

      {/* ── TRACHEA (Segmented Carthage Rings cylinder) ── */}
      <mesh position={[0, 0.66, -0.05]} material={tracheaMat}>
        <cylinderGeometry args={[0.075, 0.075, 0.58, 16]} />
      </mesh>
      {/*stacked cartilage rings*/}
      {mode !== 'hologram' &&
        Array.from({ length: 11 }).map((_, i) => (
          <mesh key={`trach-ring-${i}`} position={[0, 0.92 - i * 0.052, -0.05]}>
            <torusGeometry args={[0.078, 0.012, 8, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.12} metalness={0.1} />
          </mesh>
        ))}

      {/* ── BRONCHIAL SURFACE NETWORKS (Cream branches over lobes - First Image) ── */}
      {mode !== 'hologram' &&
        surfaceBronchialCurves.map((curve, idx) => (
          <mesh key={`surf-bronch-${idx}`}>
            <tubeGeometry args={[curve, 24, 0.016 - (idx % 2) * 0.004, 6, false]} />
            <meshStandardMaterial color="#f4ebd0" roughness={0.25} metalness={0.05} />
          </mesh>
        ))}
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ LIVER MODEL (GLOSSY WEDGE LOBES WITH VASCULAR BRANCHES)
   ══════════════════════════════════════════════════════════════ */
function LiverModel({ isSel, mode }: { isSel: boolean; mode: RenderMode }) {
  // Deep mahogany reddish-brown liver color
  const liverMat = useAnatomyMaterial('#7a251b', 0.1, 0.2, 0.98, isSel, mode)
  const gallMat = useAnatomyMaterial('#2d5e1c', 0.15, 0.1, 0.98, isSel, mode)

  // Hepatic portal veins branching over liver surface (Third Image)
  const portalVeins = useMemo(() => {
    const list = []
    const pts1 = [
      new THREE.Vector3(0.04, 0, 0.36),
      new THREE.Vector3(0.18, 0.08, 0.38),
      new THREE.Vector3(0.32, 0.04, 0.32),
    ]
    const pts2 = [
      new THREE.Vector3(0.04, 0, 0.36),
      new THREE.Vector3(-0.12, 0.04, 0.34),
      new THREE.Vector3(-0.25, 0.06, 0.24),
    ]
    list.push(new THREE.CatmullRomCurve3(pts1))
    list.push(new THREE.CatmullRomCurve3(pts2))
    return list
  }, [])

  return (
    <group scale={1.05}>
      {/* Right Lobe */}
      <mesh position={[0.14, 0, 0.02]} scale={[1.25, 0.56, 0.74]} material={liverMat}>
        <sphereGeometry args={[0.48, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
      </mesh>
      {/* Left Lobe */}
      <mesh position={[-0.34, 0.05, 0.02]} scale={[0.62, 0.44, 0.55]} material={liverMat}>
        <sphereGeometry args={[0.38, 20, 20]} />
      </mesh>

      {/* Capillaries branching over anterior lobes (Third Image) */}
      {mode !== 'hologram' &&
        portalVeins.map((curve, idx) => (
          <mesh key={`hep-vein-${idx}`}>
            <tubeGeometry args={[curve, 16, 0.012, 6, false]} />
            <meshStandardMaterial color={idx === 0 ? '#386ef0' : '#d09520'} roughness={0.12} />
          </mesh>
        ))}

      {/* Gallbladder */}
      <group position={[0.18, -0.22, 0.22]} rotation={[-0.4, 0, 0.2]}>
        <mesh scale={[0.7, 1.25, 0.7]} material={gallMat}>
          <sphereGeometry args={[0.1, 16, 16]} />
        </mesh>
        <mesh position={[-0.04, 0.12, -0.04]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.012, 0.012, 0.1, 6]} />
          <meshStandardMaterial color="#2d5e1c" roughness={0.1} />
        </mesh>
      </group>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ STOMACH MODEL
   ══════════════════════════════════════════════════════════════ */
function StomachModel({ isSel, mode }: { isSel: boolean; mode: RenderMode }) {
  const stomachMat = useAnatomyMaterial('#d07361', 0.1, 0.2, 0.98, isSel, mode)
  const esophMat = useAnatomyMaterial('#cca094', 0.15, 0.15, 0.98, isSel, mode)

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
      <mesh position={[0.22, -0.32, 0.04]} rotation={[0, 0, -0.75]} scale={[0.32, 0.52, 0.32]} material={stomachMat}>
        <capsuleGeometry args={[0.09, 0.28, 8, 12]} />
      </mesh>

      {mode !== 'hologram' && (
        <group>
          <mesh position={[-0.08, -0.04, 0.24]} rotation={[0.2, 0.1, 0.5]} scale={[0.22, 0.015, 0.01]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#af5c4b" roughness={0.12} />
          </mesh>
          <mesh position={[0.08, -0.14, 0.24]} rotation={[0.2, -0.1, 0.3]} scale={[0.18, 0.015, 0.01]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#af5c4b" roughness={0.12} />
          </mesh>
        </group>
      )}
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ INTESTINES MODEL (SHINY SHADY COILS & HAUSTRA COLON SEGMENTS)
   ══════════════════════════════════════════════════════════════ */
function IntestinesModel({ isSel, mode }: { isSel: boolean; mode: RenderMode }) {
  // Highly specular, wet color tones matching the digestive system images
  const smallMat = useAnatomyMaterial('#c58878', 0.08, 0.25, 0.98, isSel, mode)
  const largeMat = useAnatomyMaterial('#b86a5a', 0.1, 0.22, 0.98, isSel, mode)

  // Continuous small gut coils curves
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

  // Large intestine - segmented haustra chained pouches
  const haustraPositions = useMemo(() => {
    return [
      { pos: [0.5, -0.3, 0.12], rot: [0, 0, 0] },
      { pos: [0.5, -0.15, 0.14], rot: [0, 0, 0] },
      { pos: [0.5, 0, 0.13], rot: [0, 0, 0] },
      { pos: [0.5, 0.15, 0.11], rot: [0, 0, 0] },
      { pos: [0.55, 0.3, 0.08], rot: [0, 0, 0.2] },
      { pos: [0.42, 0.44, 0.12], rot: [0, 0, Math.PI / 2] },
      { pos: [0.26, 0.48, 0.16], rot: [0, 0, Math.PI / 2] },
      { pos: [0.08, 0.5, 0.18], rot: [0, 0, Math.PI / 2] },
      { pos: [-0.1, 0.48, 0.18], rot: [0, 0, Math.PI / 2] },
      { pos: [-0.28, 0.46, 0.16], rot: [0, 0, Math.PI / 2] },
      { pos: [-0.44, 0.42, 0.1], rot: [0, 0, Math.PI / 2] },
      { pos: [-0.54, 0.28, 0.06], rot: [0, 0, -0.25] },
      { pos: [-0.52, 0.12, 0.1], rot: [0, 0, 0] },
      { pos: [-0.52, -0.04, 0.12], rot: [0, 0, 0] },
      { pos: [-0.52, -0.2, 0.14], rot: [0, 0, 0] },
      { pos: [-0.48, -0.34, 0.11], rot: [0, 0, 0.4] },
      { pos: [-0.34, -0.45, 0.08], rot: [0, 0, 0.8] },
      { pos: [-0.16, -0.5, 0.05], rot: [0, 0, Math.PI / 2] },
      { pos: [0, -0.55, 0.02], rot: [0, 0, 0] },
    ]
  }, [])

  return (
    <group scale={1.05}>
      {/* ── SMALL INTESTINE (Tightly coiled glossy tubes) ── */}
      {smallIntestineCoils.map((curve, idx) => (
        <mesh key={`small-gut-${idx}`}>
          <tubeGeometry args={[curve, 48, 0.065, 8, false]} />
          <meshStandardMaterial color="#c58372" roughness={0.08} metalness={0.22} transparent={mode !== 'realistic'} opacity={mode === 'realistic' ? 1.0 : 0.2} />
        </mesh>
      ))}

      {/* ── LARGE INTESTINE (Haustra segmented colon loops) ── */}
      <group>
        {haustraPositions.map((item, idx) => (
          <mesh
            key={`haustra-${idx}`}
            position={item.pos as [number, number, number]}
            rotation={item.rot as [number, number, number]}
            scale={[1.1, 0.72, 1.1]}
            material={largeMat}
          >
            <sphereGeometry args={[0.088, 16, 12]} />
          </mesh>
        ))}

        {/* Cecum & Appendix */}
        <group position={[0.5, -0.45, 0.1]}>
          <mesh material={largeMat}>
            <sphereGeometry args={[0.09, 12, 12]} />
          </mesh>
          <mesh position={[0.02, -0.09, -0.02]} rotation={[0.4, 0, -0.2]}>
            <cylinderGeometry args={[0.012, 0.008, 0.16, 6]} />
            <meshStandardMaterial color="#a56050" roughness={0.12} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ KIDNEYS MODEL
   ══════════════════════════════════════════════════════════════ */
function KidneyModel({ isSel, mode, side }: { isSel: boolean; mode: RenderMode; side: 'left' | 'right' }) {
  const kidneyMat = useAnatomyMaterial('#681212', 0.12, 0.2, 0.98, isSel, mode)
  const ureterMat = useAnatomyMaterial('#dfbc5c', 0.15, 0.1, 0.95, isSel, mode)
  const flip = side === 'left' ? -1 : 1

  const ureterCurve = useMemo(() => {
    const pts = [
      new THREE.Vector3(-0.06 * flip, -0.02, 0.05),
      new THREE.Vector3(-0.14 * flip, -0.7, 0.12),
      new THREE.Vector3(-0.35 * flip, -1.65, 0.32),
      new THREE.Vector3(-0.08 * flip, -2.05, 0.48),
    ]
    return new THREE.CatmullRomCurve3(pts)
  }, [flip])

  return (
    <group scale={[flip, 1, 1]}>
      <mesh scale={[0.55, 0.88, 0.46]} material={kidneyMat}>
        <sphereGeometry args={[0.28, 24, 24]} />
      </mesh>

      {mode === 'realistic' && (
        <mesh position={[-0.08, 0, 0.08]} scale={[0.18, 0.42, 0.18]}>
          <sphereGeometry args={[0.2, 12, 12]} />
          <meshBasicMaterial color="#020402" />
        </mesh>
      )}

      <mesh>
        <tubeGeometry args={[ureterCurve, 20, 0.016, 6, false]} />
        <meshStandardMaterial color="#d9b64c" roughness={0.15} />
      </mesh>

      <mesh position={[-0.14, 0.04, 0.08]} rotation={[0, 0, Math.PI / 2]} scale={[0.5, 1, 0.5]}>
        <cylinderGeometry args={[0.024, 0.024, 0.22, 6]} />
        <meshStandardMaterial color="#de2727" roughness={0.12} />
      </mesh>
      <mesh position={[-0.12, -0.06, 0.08]} rotation={[0, 0, Math.PI / 2]} scale={[0.5, 1, 0.5]}>
        <cylinderGeometry args={[0.026, 0.026, 0.22, 6]} />
        <meshStandardMaterial color="#2d59de" roughness={0.12} />
      </mesh>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ BLADDER MODEL
   ══════════════════════════════════════════════════════════════ */
function BladderModel({ isSel, mode }: { isSel: boolean; mode: RenderMode }) {
  const bladderMat = useAnatomyMaterial('#d7b14d', 0.12, 0.18, 0.98, isSel, mode)

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
   ▸ ORGANS CONTAINER
   ══════════════════════════════════════════════════════════════ */
export function Organs({
  selected,
  onSelect,
  mode = 'realistic',
}: {
  selected: string | null
  onSelect: (id: string) => void
  mode?: RenderMode
}) {
  const click = (id: string) => (e: any) => {
    e.stopPropagation()
    onSelect(id)
  }

  return (
    <group>
      <group position={[0, 8.16, 0.1]} onClick={click('brain')}>
        <BrainModel isSel={selected === 'brain'} mode={mode} />
      </group>
      <group position={[0.13, 5.06, 0.48]} onClick={click('heart')}>
        <HeartModel isSel={selected === 'heart'} mode={mode} />
      </group>
      <group position={[0, 5.24, 0.14]} onClick={click('lungs')}>
        <LungsModel isSel={selected === 'lungs'} mode={mode} />
      </group>
      <group position={[0.48, 4.02, 0.38]} onClick={click('liver')}>
        <LiverModel isSel={selected === 'liver'} mode={mode} />
      </group>
      <group position={[-0.42, 3.65, 0.46]} onClick={click('stomach')}>
        <StomachModel isSel={selected === 'stomach'} mode={mode} />
      </group>
      <group position={[0, 2.22, 0.38]} onClick={click('intestines')}>
        <IntestinesModel isSel={selected === 'intestines'} mode={mode} />
      </group>
      <group position={[-0.58, 3.32, -0.22]} onClick={click('kidneys')}>
        <KidneyModel isSel={selected === 'kidneys'} mode={mode} side="left" />
      </group>
      <group position={[0.58, 3.32, -0.22]} onClick={click('kidneys')}>
        <KidneyModel isSel={selected === 'kidneys'} mode={mode} side="right" />
      </group>
      <group position={[0, 1.25, 0.48]} onClick={click('bladder')}>
        <BladderModel isSel={selected === 'bladder'} mode={mode} />
      </group>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ ISOLATED ORGAN
   ══════════════════════════════════════════════════════════════ */
export function IsolatedOrgan({ organId, mode = 'realistic' }: { organId: string; mode?: RenderMode }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.32
    }
  })

  return (
    <group ref={ref} scale={2.4}>
      {organId === 'brain' && <BrainModel isSel={true} mode={mode} />}
      {organId === 'heart' && <HeartModel isSel={true} mode={mode} />}
      {organId === 'lungs' && <LungsModel isSel={true} mode={mode} />}
      {organId === 'liver' && <LiverModel isSel={true} mode={mode} />}
      {organId === 'stomach' && <StomachModel isSel={true} mode={mode} />}
      {organId === 'intestines' && <IntestinesModel isSel={true} mode={mode} />}
      {organId === 'kidneys' && (
        <group>
          <group position={[-0.32, 0, 0]}>
            <KidneyModel isSel={true} mode={mode} side="left" />
          </group>
          <group position={[0.32, 0, 0]}>
            <KidneyModel isSel={true} mode={mode} side="right" />
          </group>
        </group>
      )}
      {organId === 'bladder' && <BladderModel isSel={true} mode={mode} />}
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ DENSE BRANCHING VASCULAR & NERVOUS SYSTEMS
   ══════════════════════════════════════════════════════════════ */
export function VascularSystem({
  activeSystem,
  onSelect,
  mode = 'realistic',
  showVascular = true,
  showNervous = true,
}: {
  activeSystem: string | null
  onSelect: (s: string) => void
  mode?: RenderMode
  showVascular?: boolean
  showNervous?: boolean
}) {
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
    add([0.13, 5.06, 0.48], [0, 2.22, 0.38], 'artery', [0.05, 3.4, 0.42])
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
    <group>
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
              opacity={dimmed ? 0.06 : isActive ? 1.0 : 0.55}
              depthWrite={!dimmed}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ LAYERED MUSCLE FIBERS
   ══════════════════════════════════════════════════════════════ */
export function MuscleFibers({ mode = 'realistic' }: { mode?: RenderMode }) {
  const fibers = useMemo(() => {
    const list = []
    for (let i = 0; i < 24; i++) {
      list.push({
        pos: [(Math.random() - 0.5) * 1.6, 5.5 + (Math.random() - 0.5) * 1.2, 0.45 + Math.random() * 0.18],
        rot: [0, 0, (Math.random() - 0.5) * 0.65],
        len: 0.35 + Math.random() * 0.55,
      })
    }
    for (let i = 0; i < 18; i++) {
      list.push({
        pos: [(Math.random() - 0.5) * 0.9, 3.2 + (Math.random() - 0.5) * 1.4, 0.42 + Math.random() * 0.12],
        rot: [0, 0, (Math.random() - 0.5) * 0.2],
        len: 0.25 + Math.random() * 0.45,
      })
    }
    for (let i = 0; i < 12; i++) {
      list.push({
        pos: [-1.65 + (Math.random() - 0.5) * 0.25, 4.8 + (Math.random() - 0.5) * 0.8, 0.2 + Math.random() * 0.1],
        rot: [0, 0, 0.12 + (Math.random() - 0.5) * 0.15],
        len: 0.3 + Math.random() * 0.4,
      })
      list.push({
        pos: [1.65 + (Math.random() - 0.5) * 0.25, 4.8 + (Math.random() - 0.5) * 0.8, 0.2 + Math.random() * 0.1],
        rot: [0, 0, -0.12 + (Math.random() - 0.5) * 0.15],
        len: 0.3 + Math.random() * 0.4,
      })
    }
    return list
  }, [])

  return (
    <group>
      {fibers.map((f, i) => (
        <mesh key={`fiber-${i}`} position={f.pos as [number, number, number]} rotation={f.rot as [number, number, number]}>
          <cylinderGeometry args={[0.012, 0.012, f.len, 4]} />
          <meshStandardMaterial
            color={mode === 'realistic' ? '#a64230' : mode === 'xray' ? '#38bdf8' : '#10b981'}
            transparent
            opacity={mode === 'realistic' ? 0.35 : 0.08}
            wireframe={mode === 'hologram'}
          />
        </mesh>
      ))}
    </group>
  )
}
