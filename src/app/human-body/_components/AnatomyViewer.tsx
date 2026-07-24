'use client'

import { useEffect, useRef, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import {
  HumanBodySilhouette,
  Skeleton,
  Organs,
  VascularSystem,
  MuscleFibers,
  EndocrineSystem,
  LymphaticSystem,
  ReproductiveSystem,
  RenderMode
} from './BodyModel'
import { ExperienceCameraManager, Hotspot } from "@/components/3d"
import { PhysiologyOverlays3D } from '@/components/digital-human/PhysiologyOverlays3D'
import { MeasurementTool3D } from '@/components/digital-human/MeasurementTool3D'

// Helper to add vectors for positioning
const addVectors = (v1: [number, number, number], v2: [number, number, number]): [number, number, number] => {
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]]
}

/* ══════════════════════════════════════════════════════════════
   ▸ R3F CAMERA & ORBITCONTROLS MANAGER (GSAP LERP ZOOMING)
   ══════════════════════════════════════════════════════════════ */
function CameraManager({ selectedOrgan }: { selectedOrgan: string | null }) {
  const { camera, controls } = useThree()

  useEffect(() => {
    if (!controls) return

    let targetY = 2.8
    let targetZ = 0
    let targetX = 0
    let camDistance = 8.5

    if (selectedOrgan) {
      const coordinates: Record<string, [number, number, number, number]> = {
        brain: [0, 8.16, 0.1, 3.8],
        eyes: [0, 8.05, 0.52, 2.0],
        ears: [0.85, 8.08, 0, 1.8],
        heart: [0.13, 5.06, 0.48, 3.0],
        lungs: [0, 5.24, 0.14, 4.0],
        liver: [0.48, 4.02, 0.38, 3.2],
        stomach: [-0.42, 3.65, 0.46, 3.2],
        intestines: [0, 2.22, 0.38, 4.2],
        kidneys: [0, 3.32, -0.22, 3.2],
        bladder: [0, 1.25, 0.48, 2.8],
        thyroid: [0, 6.72, 0.38, 2.0],
        adrenal: [0, 3.48, -0.16, 2.5],
        pituitary: [0, 7.82, 0.12, 1.5],
        spleen: [-0.56, 3.82, -0.06, 2.5],
        reproductive: [0, 0.85, 0.44, 3.0],
      }

      const coords = coordinates[selectedOrgan]
      if (coords) {
        targetX = coords[0]
        targetY = coords[1]
        targetZ = coords[2]
        camDistance = coords[3]
      }
    }

    gsap.to((controls as any).target, {
      x: targetX,
      y: targetY,
      z: targetZ,
      duration: 1.2,
      ease: 'power3.out',
      onUpdate: () => {
        ;(controls as any).update()
      },
    })

    gsap.to(camera.position, {
      x: targetX,
      y: targetY + 0.3,
      z: targetZ + camDistance,
      duration: 1.2,
      ease: 'power3.out',
      onUpdate: () => {
        camera.lookAt(targetX, targetY, targetZ)
      },
    })
  }, [selectedOrgan, camera, controls])

  return null
}

/* ══════════════════════════════════════════════════════════════
   ▸ 3D SCENE
   ══════════════════════════════════════════════════════════════ */
function BodyScene({
  selectedOrgan,
  setSelectedOrgan,
  activeSystem,
  setActiveSystem,
  renderMode,
  visibleSystems,
  gender,
  explode,
  clipPlane,
  opacityOverrides,
}: {
  selectedOrgan: string | null
  setSelectedOrgan: (s: string | null) => void
  activeSystem: string | null
  setActiveSystem: (s: string | null) => void
  renderMode: RenderMode
  visibleSystems: Record<string, boolean>
  gender: 'male' | 'female'
  explode: number
  clipPlane: THREE.Plane[]
  opacityOverrides: Record<string, number>
}) {
  return (
    <>
      <Environment files="/hdr/potsdamer_platz_1k.hdr" />
      <ambientLight intensity={renderMode === 'realistic' ? 0.35 : 0.15} />
      <spotLight
        position={[8, 12, 8]}
        angle={0.25}
        penumbra={1}
        intensity={renderMode === 'realistic' ? 2 : 3}
        castShadow
        color={renderMode === 'realistic' ? '#ffffff' : '#38bdf8'}
      />
      <spotLight
        position={[-6, 8, -6]}
        angle={0.3}
        penumbra={1}
        intensity={renderMode === 'realistic' ? 0.8 : 1.5}
        color={renderMode === 'realistic' ? '#e24b4a' : '#10b981'}
      />
      <pointLight position={[0, 15, 5]} intensity={0.5} color={renderMode === 'realistic' ? '#39ff14' : '#06b6d4'} />

      {/* Camera Coordinator */}
      <CameraManager selectedOrgan={selectedOrgan} />

      {/* Human Silhouette skin (Integumentary) */}
      {visibleSystems.skin && (
        <HumanBodySilhouette
          opacity={visibleSystems.skin ? opacityOverrides.skin : 0.0}
          mode={renderMode}
          gender={gender}
          explode={explode}
          clippingPlanes={clipPlane}
        />
      )}

      {/* Skeleton Bones (Skeletal) */}
      {visibleSystems.skeleton && (
        <Skeleton
          mode={renderMode}
          gender={gender}
          explode={explode}
          clippingPlanes={clipPlane}
          opacity={opacityOverrides.skeleton}
        />
      )}

      {/* Muscle Fibers (Muscular / Connective Tendons) */}
      {visibleSystems.muscles && (
        <MuscleFibers
          mode={renderMode}
          gender={gender}
          explode={explode}
          clippingPlanes={clipPlane}
          opacity={opacityOverrides.muscles}
        />
      )}

      {/* Organs layer (Visceral organs, Eyes, Ears) */}
      <Organs
        selected={selectedOrgan}
        onSelect={setSelectedOrgan}
        mode={renderMode}
        gender={gender}
        explode={explode}
        clippingPlanes={clipPlane}
        visibleSystems={visibleSystems}
        opacityOverrides={opacityOverrides}
      />

      {/* Vascular & Nervous Trees (Arteries, Veins, Nerves) */}
      <VascularSystem
        activeSystem={activeSystem}
        onSelect={setActiveSystem}
        mode={renderMode}
        showVascular={visibleSystems.vascular}
        showNervous={visibleSystems.nervous}
        explode={explode}
        clippingPlanes={clipPlane}
        opacityOverrides={opacityOverrides}
      />

      {/* Endocrine System Glands */}
      {visibleSystems.endocrine && (
        <EndocrineSystem
          selected={selectedOrgan}
          onSelect={setSelectedOrgan}
          mode={renderMode}
          explode={explode}
          clippingPlanes={clipPlane}
          opacity={opacityOverrides.endocrine}
        />
      )}

      {/* Lymphatic System Nodes & Channels */}
      {visibleSystems.lymphatic && (
        <LymphaticSystem
          selected={selectedOrgan}
          onSelect={setSelectedOrgan}
          mode={renderMode}
          explode={explode}
          clippingPlanes={clipPlane}
          opacity={opacityOverrides.lymphatic}
        />
      )}

      {/* Reproductive Glands */}
      {visibleSystems.reproductive && (
        <ReproductiveSystem
          gender={gender}
          mode={renderMode}
          explode={explode}
          clippingPlanes={clipPlane}
          opacity={opacityOverrides.reproductive}
          selected={selectedOrgan}
          onSelect={setSelectedOrgan}
        />
      )}

      {/* Dynamic 3D Physiology Overlays & Measurements */}
      <PhysiologyOverlays3D />
      <MeasurementTool3D />

      <ContactShadows position={[0, -5, 0]} opacity={0.35} scale={18} blur={2.5} far={10} />
      <OrbitControls enablePan={true} minDistance={2} maxDistance={22} target={[0, 2.8, 0]} />
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ UNIFIED VIEWER EXPORT
   ══════════════════════════════════════════════════════════════ */
export default function AnatomyViewer({
  selectedOrgan,
  setSelectedOrgan,
  activeSystem,
  setActiveSystem,
  renderMode,
  visibleSystems,
  gender,
  explode,
  clipPlane,
  opacityOverrides,
}: {
  selectedOrgan: string | null
  setSelectedOrgan: (s: string | null) => void
  activeSystem: string | null
  setActiveSystem: (s: string | null) => void
  renderMode: RenderMode
  visibleSystems: Record<string, boolean>
  gender: 'male' | 'female'
  explode: number
  clipPlane: THREE.Plane[]
  opacityOverrides: Record<string, number>
}) {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true, localClippingEnabled: true }}
      onPointerMissed={() => {
        setSelectedOrgan(null)
        setActiveSystem(null)
      }}
    >
      <Suspense fallback={null}>
        <BodyScene
          selectedOrgan={selectedOrgan}
          setSelectedOrgan={setSelectedOrgan}
          activeSystem={activeSystem}
          setActiveSystem={setActiveSystem}
          renderMode={renderMode}
          visibleSystems={visibleSystems}
          gender={gender}
          explode={explode}
          clipPlane={clipPlane}
          opacityOverrides={opacityOverrides}
        />
        <ExperienceCameraManager />
        <Hotspot position={[0, 8.16, 0.1]} targetObjectId="brain" />
        <Hotspot position={[0, 8.05, 0.52]} targetObjectId="eyes" />
        <Hotspot position={[0.85, 8.08, 0]} targetObjectId="ears" />
        <Hotspot position={[0.13, 5.06, 0.48]} targetObjectId="heart" />
        <Hotspot position={[0, 5.24, 0.14]} targetObjectId="lungs" />
        <Hotspot position={[0.48, 4.02, 0.38]} targetObjectId="liver" />
        <Hotspot position={[-0.42, 3.65, 0.46]} targetObjectId="stomach" />
        <Hotspot position={[0, 2.22, 0.38]} targetObjectId="intestines" />
        <Hotspot position={[0, 3.32, -0.22]} targetObjectId="kidneys" />
        <Hotspot position={[0, 1.25, 0.48]} targetObjectId="bladder" />
        <Hotspot position={[0, 6.72, 0.38]} targetObjectId="thyroid" />
        <Hotspot position={[0, 7.82, 0.12]} targetObjectId="pituitary" />
        <Hotspot position={[-0.56, 3.82, -0.06]} targetObjectId="spleen" />
        <Hotspot position={[0, 0.85, 0.44]} targetObjectId="reproductive" />
      </Suspense>
    </Canvas>
  )
}
