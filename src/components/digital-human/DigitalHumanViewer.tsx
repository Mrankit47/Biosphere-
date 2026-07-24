'use client'

import React, { Suspense } from 'react'
import { Canvas, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { useDigitalHumanEngine } from './DigitalHumanContext'
import { PhysiologyOverlays3D } from './PhysiologyOverlays3D'
import { MeasurementTool3D } from './MeasurementTool3D'
import {
  HumanBodySilhouette,
  Skeleton,
  Organs,
  VascularSystem,
  MuscleFibers,
  EndocrineSystem,
  LymphaticSystem,
  ReproductiveSystem,
} from '@/app/human-body/_components/BodyModel'
import { ExperienceCameraManager, Hotspot } from "@/components/3d"

function SceneContent() {
  const {
    state,
    setSelectedOrganId,
    setActiveSystem,
    addMeasurementPoint,
  } = useDigitalHumanEngine()

  const {
    renderMode,
    visibleSystems,
    gender,
    explodeLevel,
    clippingPosition,
    systemOpacity,
    selectedOrganId,
    activeSystem,
    isMeasuring,
  } = state

  // Dynamic Clipping Plane
  const clipPlanes = React.useMemo(() => {
    if (clippingPosition >= 10) return []
    return [new THREE.Plane(new THREE.Vector3(0, -1, 0), clippingPosition)]
  }, [clippingPosition])

  const handleMeshClick = (e: ThreeEvent<PointerEvent>) => {
    if (isMeasuring && e.point) {
      addMeasurementPoint([e.point.x, e.point.y, e.point.z])
    }
  }

  return (
    <group onPointerDown={handleMeshClick}>
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

      {/* Human Silhouette skin (Integumentary) */}
      {visibleSystems.integumentary && (
        <HumanBodySilhouette
          opacity={systemOpacity.integumentary}
          mode={renderMode}
          gender={gender}
          explode={explodeLevel}
          clippingPlanes={clipPlanes}
        />
      )}

      {/* Skeleton Bones (Skeletal) */}
      {visibleSystems.skeletal && (
        <Skeleton
          mode={renderMode}
          gender={gender}
          explode={explodeLevel}
          clippingPlanes={clipPlanes}
          opacity={systemOpacity.skeletal}
        />
      )}

      {/* Muscle Fibers (Muscular) */}
      {visibleSystems.muscular && (
        <MuscleFibers
          mode={renderMode}
          gender={gender}
          explode={explodeLevel}
          clippingPlanes={clipPlanes}
          opacity={systemOpacity.muscular}
        />
      )}

      {/* Organs layer */}
      <Organs
        selected={selectedOrganId}
        onSelect={(id) => setSelectedOrganId(id)}
        mode={renderMode}
        gender={gender}
        explode={explodeLevel}
        clippingPlanes={clipPlanes}
        visibleSystems={{
          skin: visibleSystems.integumentary,
          skeleton: visibleSystems.skeletal,
          muscles: visibleSystems.muscular,
          vascular: visibleSystems.cardiovascular,
          nervous: visibleSystems.nervous,
          endocrine: visibleSystems.endocrine,
          lymphatic: visibleSystems.lymphatic,
          reproductive: visibleSystems.reproductive,
        }}
        opacityOverrides={{
          skin: systemOpacity.integumentary,
          skeleton: systemOpacity.skeletal,
          muscles: systemOpacity.muscular,
          vascular: systemOpacity.cardiovascular,
          nervous: systemOpacity.nervous,
          endocrine: systemOpacity.endocrine,
          lymphatic: systemOpacity.lymphatic,
          reproductive: systemOpacity.reproductive,
        }}
      />

      {/* Vascular & Nervous Trees */}
      <VascularSystem
        activeSystem={activeSystem}
        onSelect={(s) => setActiveSystem(s as any)}
        mode={renderMode}
        showVascular={visibleSystems.cardiovascular}
        showNervous={visibleSystems.nervous}
        explode={explodeLevel}
        clippingPlanes={clipPlanes}
        opacityOverrides={{
          vascular: systemOpacity.cardiovascular,
          nervous: systemOpacity.nervous,
        }}
      />

      {/* Endocrine System Glands */}
      {visibleSystems.endocrine && (
        <EndocrineSystem
          selected={selectedOrganId}
          onSelect={(id) => setSelectedOrganId(id)}
          mode={renderMode}
          explode={explodeLevel}
          clippingPlanes={clipPlanes}
          opacity={systemOpacity.endocrine}
        />
      )}

      {/* Lymphatic System */}
      {visibleSystems.lymphatic && (
        <LymphaticSystem
          selected={selectedOrganId}
          onSelect={(id) => setSelectedOrganId(id)}
          mode={renderMode}
          explode={explodeLevel}
          clippingPlanes={clipPlanes}
          opacity={systemOpacity.lymphatic}
        />
      )}

      {/* Reproductive Glands */}
      {visibleSystems.reproductive && (
        <ReproductiveSystem
          gender={gender}
          mode={renderMode}
          explode={explodeLevel}
          clippingPlanes={clipPlanes}
          opacity={systemOpacity.reproductive}
          selected={selectedOrganId}
          onSelect={(id) => setSelectedOrganId(id)}
        />
      )}

      {/* 3D Physiology Overlays */}
      <PhysiologyOverlays3D />

      {/* 3D Distance Measurement Tool */}
      <MeasurementTool3D />

      {/* Interactive Hotspots */}
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

      <ContactShadows position={[0, -5, 0]} opacity={0.35} scale={18} blur={2.5} far={10} />
      <OrbitControls enablePan={true} minDistance={2} maxDistance={22} target={[0, 2.8, 0]} />
      <ExperienceCameraManager />
    </group>
  )
}

export function DigitalHumanViewer() {
  const { state, setSelectedOrganId, setActiveSystem } = useDigitalHumanEngine()
  const { isMeasuring } = state

  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true, localClippingEnabled: true }}
      onPointerMissed={() => {
        if (!isMeasuring) {
          setSelectedOrganId(null)
          setActiveSystem(null)
        }
      }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}
