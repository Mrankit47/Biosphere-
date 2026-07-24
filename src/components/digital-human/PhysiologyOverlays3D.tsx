'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useDigitalHumanEngine } from './DigitalHumanContext'

/* ══════════════════════════════════════════════════════════════
   ▸ BLOOD FLOW OVERLAY (ARTERIAL & VENOUS PARTICLE SPLINES)
   ══════════════════════════════════════════════════════════════ */
function BloodFlowParticles() {
  const count = 300
  const particles = useRef<THREE.Points>(null!)

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const redColor = new THREE.Color('#ef4444')
    const blueColor = new THREE.Color('#3b82f6')

    for (let i = 0; i < count; i++) {
      const isArterial = i % 2 === 0
      const c = isArterial ? redColor : blueColor

      // Vascular path height simulation
      const y = (Math.random() - 0.5) * 8 + 4
      const radius = isArterial ? 0.3 + Math.random() * 0.4 : 0.4 + Math.random() * 0.5
      const angle = Math.random() * Math.PI * 2

      pos[i * 3] = Math.cos(angle) * radius + (isArterial ? 0.1 : -0.1)
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = Math.sin(angle) * radius + 0.1

      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, col]
  }, [])

  useFrame((_, delta) => {
    if (!particles.current) return
    const posArray = particles.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      const isArterial = i % 2 === 0
      const speed = isArterial ? 1.5 : 1.0
      // Flow upward in arteries, downward in veins
      if (isArterial) {
        posArray[i * 3 + 1] -= delta * speed
        if (posArray[i * 3 + 1] < 0) posArray[i * 3 + 1] = 8.5
      } else {
        posArray[i * 3 + 1] += delta * speed
        if (posArray[i * 3 + 1] > 8.5) posArray[i * 3 + 1] = 0
      }
    }
    particles.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ NEURAL SIGNALS OVERLAY (ACTION POTENTIAL ELECTRICAL PULSES)
   ══════════════════════════════════════════════════════════════ */
function NeuralSignalPulse() {
  const count = 150
  const sparks = useRef<THREE.Points>(null!)

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Along spine and head to extremities
      const y = 8.2 - (i / count) * 8
      pos[i * 3] = (Math.random() - 0.5) * (1.2 - y * 0.1)
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4
    }
    return [pos]
  }, [])

  useFrame(({ clock }) => {
    if (!sparks.current) return
    const t = clock.getElapsedTime() * 4
    const mat = sparks.current.material as THREE.PointsMaterial
    mat.opacity = 0.5 + Math.sin(t * 8) * 0.4
  })

  return (
    <points ref={sparks}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#e879f9"
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ HORMONE & LYMPH FLOW OVERLAYS
   ══════════════════════════════════════════════════════════════ */
function HormoneFlowParticles() {
  const count = 100
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.5
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, i) => {
        const radius = 0.8 + Math.sin(i) * 0.6
        const angle = (i / count) * Math.PI * 2
        const y = 6.5 - (i % 20) * 0.25
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, y, Math.sin(angle) * radius]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#a855f7" transparent opacity={0.8} />
          </mesh>
        )
      })}
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════
   ▸ UNIFIED PHYSIOLOGY OVERLAYS CONTAINER
   ══════════════════════════════════════════════════════════════ */
export function PhysiologyOverlays3D() {
  const { state } = useDigitalHumanEngine()
  const { activeOverlays } = state

  return (
    <group>
      {activeOverlays['blood-flow'] && <BloodFlowParticles />}
      {activeOverlays['neural-signals'] && <NeuralSignalPulse />}
      {activeOverlays['hormone-flow'] && <HormoneFlowParticles />}
    </group>
  )
}
