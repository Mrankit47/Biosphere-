'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { IsolatedOrgan, RenderMode } from './BodyModel'

export default function OrganViewer({
  selectedOrgan,
  renderMode,
  gender,
}: {
  selectedOrgan: string
  renderMode: RenderMode
  gender: 'male' | 'female'
}) {
  return (
    <Canvas camera={{ position: [0, 0, 3.8] }}>
      <Suspense fallback={null}>
        <Environment files="/hdr/potsdamer_platz_1k.hdr" />
        <ambientLight intensity={renderMode === 'realistic' ? 0.6 : 0.25} />
        <spotLight
          position={[5, 5, 5]}
          intensity={renderMode === 'realistic' ? 2 : 3}
          color={renderMode === 'realistic' ? '#ffffff' : '#38bdf8'}
        />
        <spotLight position={[-5, -3, -5]} intensity={0.5} color="#e24b4a" />
        <IsolatedOrgan organId={selectedOrgan} mode={renderMode} gender={gender} />
        <OrbitControls enablePan={true} />
      </Suspense>
    </Canvas>
  )
}
