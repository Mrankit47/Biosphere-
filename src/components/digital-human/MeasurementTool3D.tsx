'use client'

import React, { useMemo } from 'react'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { useDigitalHumanEngine } from './DigitalHumanContext'

export function MeasurementTool3D() {
  const { state } = useDigitalHumanEngine()
  const { measurementPoints } = state

  const pointsVector = useMemo(() => {
    if (measurementPoints.length < 2) return null
    return [
      measurementPoints[0].position,
      measurementPoints[1].position,
    ] as [[number, number, number], [number, number, number]]
  }, [measurementPoints])

  const distanceMm = useMemo(() => {
    if (measurementPoints.length < 2) return 0
    const p1 = new THREE.Vector3(...measurementPoints[0].position)
    const p2 = new THREE.Vector3(...measurementPoints[1].position)
    // 1 scene unit = 100 mm scale factor
    return Math.round(p1.distanceTo(p2) * 100)
  }, [measurementPoints])

  const midpoint = useMemo(() => {
    if (measurementPoints.length < 2) return null
    const p1 = new THREE.Vector3(...measurementPoints[0].position)
    const p2 = new THREE.Vector3(...measurementPoints[1].position)
    return p1.add(p2).multiplyScalar(0.5)
  }, [measurementPoints])

  if (measurementPoints.length === 0) return null

  return (
    <group>
      {measurementPoints.map((pt, idx) => (
        <mesh key={pt.id} position={pt.position}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" />
          <Html position={[0, 0.15, 0]} center>
            <div className="px-2 py-0.5 text-xs font-mono bg-slate-900/90 text-cyan-400 border border-cyan-500/50 rounded shadow-lg">
              P{idx + 1}
            </div>
          </Html>
        </mesh>
      ))}

      {pointsVector && (
        <Line
          points={pointsVector}
          color="#38bdf8"
          lineWidth={3}
        />
      )}

      {midpoint && (
        <Html position={[midpoint.x, midpoint.y + 0.2, midpoint.z]} center>
          <div className="px-2.5 py-1 text-xs font-mono font-bold bg-cyan-950/90 text-cyan-300 border border-cyan-400/80 rounded-md shadow-xl backdrop-blur-md">
            📏 {distanceMm} mm
          </div>
        </Html>
      )}
    </group>
  )
}
