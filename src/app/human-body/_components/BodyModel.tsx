'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* Full human body silhouette - head, neck, shoulders, torso, arms, hands, legs, feet */
export function HumanBodySilhouette({ opacity = 0.18 }: { opacity?: number }) {
  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d4a07a', transparent: true, opacity, roughness: 0.6, metalness: 0.05, side: THREE.DoubleSide }), [opacity])
  const muscleMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c4836e', transparent: true, opacity: opacity + 0.08, roughness: 0.5 }), [opacity])

  return (
    <group>
      {/* HEAD */}
      <mesh position={[0, 8.2, 0]} material={skinMat}>
        <sphereGeometry args={[0.85, 32, 32]} />
      </mesh>
      {/* Jaw */}
      <mesh position={[0, 7.5, 0.15]} scale={[0.7, 0.4, 0.55]} material={skinMat}>
        <sphereGeometry args={[1, 16, 16]} />
      </mesh>

      {/* NECK */}
      <mesh position={[0, 7.0, 0]} material={muscleMat}>
        <cylinderGeometry args={[0.35, 0.4, 0.8, 16]} />
      </mesh>

      {/* SHOULDERS */}
      <mesh position={[-1.2, 6.5, 0]} rotation={[0, 0, 0.4]} material={muscleMat}>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
      </mesh>
      <mesh position={[1.2, 6.5, 0]} rotation={[0, 0, -0.4]} material={muscleMat}>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
      </mesh>

      {/* TORSO - Upper chest */}
      <mesh position={[0, 5.5, 0]} scale={[1.35, 1.2, 0.7]} material={muscleMat}>
        <capsuleGeometry args={[1, 0.5, 8, 16]} />
      </mesh>
      {/* TORSO - Abdomen */}
      <mesh position={[0, 3.2, 0.05]} scale={[1.1, 1.8, 0.65]} material={muscleMat}>
        <capsuleGeometry args={[1, 0.5, 8, 16]} />
      </mesh>
      {/* Pelvis */}
      <mesh position={[0, 1.2, 0]} scale={[1.2, 0.6, 0.6]} material={muscleMat}>
        <sphereGeometry args={[1, 16, 16]} />
      </mesh>

      {/* LEFT ARM */}
      <mesh position={[-1.7, 5.2, 0]} rotation={[0, 0, 0.12]} material={muscleMat}>
        <capsuleGeometry args={[0.22, 1.8, 8, 12]} />
      </mesh>
      {/* Left forearm */}
      <mesh position={[-1.8, 3.2, 0.1]} rotation={[0, 0, 0.05]} material={skinMat}>
        <capsuleGeometry args={[0.17, 1.6, 8, 12]} />
      </mesh>
      {/* Left hand */}
      <mesh position={[-1.85, 2.0, 0.15]} scale={[0.5, 0.7, 0.3]} material={skinMat}>
        <sphereGeometry args={[0.3, 12, 12]} />
      </mesh>

      {/* RIGHT ARM */}
      <mesh position={[1.7, 5.2, 0]} rotation={[0, 0, -0.12]} material={muscleMat}>
        <capsuleGeometry args={[0.22, 1.8, 8, 12]} />
      </mesh>
      <mesh position={[1.8, 3.2, 0.1]} rotation={[0, 0, -0.05]} material={skinMat}>
        <capsuleGeometry args={[0.17, 1.6, 8, 12]} />
      </mesh>
      <mesh position={[1.85, 2.0, 0.15]} scale={[0.5, 0.7, 0.3]} material={skinMat}>
        <sphereGeometry args={[0.3, 12, 12]} />
      </mesh>

      {/* LEFT LEG */}
      <mesh position={[-0.5, -0.2, 0]} material={muscleMat}>
        <capsuleGeometry args={[0.28, 2.2, 8, 12]} />
      </mesh>
      <mesh position={[-0.5, -2.8, 0]} material={skinMat}>
        <capsuleGeometry args={[0.2, 2.2, 8, 12]} />
      </mesh>
      <mesh position={[-0.5, -4.2, 0.25]} scale={[0.5, 0.3, 0.8]} material={skinMat}>
        <sphereGeometry args={[0.4, 12, 12]} />
      </mesh>

      {/* RIGHT LEG */}
      <mesh position={[0.5, -0.2, 0]} material={muscleMat}>
        <capsuleGeometry args={[0.28, 2.2, 8, 12]} />
      </mesh>
      <mesh position={[0.5, -2.8, 0]} material={skinMat}>
        <capsuleGeometry args={[0.2, 2.2, 8, 12]} />
      </mesh>
      <mesh position={[0.5, -4.2, 0.25]} scale={[0.5, 0.3, 0.8]} material={skinMat}>
        <sphereGeometry args={[0.4, 12, 12]} />
      </mesh>
    </group>
  )
}

/* Ribcage + Spine + Pelvis Bones */
export function Skeleton() {
  const boneMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#F5F0E8', transparent: true, opacity: 0.35, roughness: 0.4 }), [])

  const ribs = useMemo(() => {
    const r: { y: number; w: number }[] = []
    for (let i = 0; i < 12; i++) {
      r.push({ y: 6.2 - i * 0.3, w: 0.7 + Math.min(i, 6) * 0.12 - Math.max(0, i - 8) * 0.15 })
    }
    return r
  }, [])

  return (
    <group>
      {/* Spine vertebrae */}
      {Array.from({ length: 24 }).map((_, i) => (
        <mesh key={`vert-${i}`} position={[0, 7.8 - i * 0.45, -0.4]} material={boneMat}>
          <boxGeometry args={[0.18, 0.15, 0.2]} />
        </mesh>
      ))}

      {/* Ribs */}
      {ribs.map((rib, i) => (
        <group key={`rib-${i}`}>
          <mesh position={[0, rib.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[rib.w, 0.04, 6, 24, Math.PI]} />
            <meshStandardMaterial color="#F5F0E8" transparent opacity={0.25} />
          </mesh>
        </group>
      ))}

      {/* Pelvis */}
      <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2 + 0.3, 0, 0]} material={boneMat}>
        <torusGeometry args={[0.8, 0.08, 8, 24, Math.PI]} />
      </mesh>
      {/* Hip bones */}
      <mesh position={[-0.6, 0.8, 0.1]} rotation={[0.2, 0.3, 0.5]} scale={[0.7, 1, 0.3]} material={boneMat}>
        <sphereGeometry args={[0.5, 12, 12]} />
      </mesh>
      <mesh position={[0.6, 0.8, 0.1]} rotation={[0.2, -0.3, -0.5]} scale={[0.7, 1, 0.3]} material={boneMat}>
        <sphereGeometry args={[0.5, 12, 12]} />
      </mesh>
    </group>
  )
}

/* ═══════════ REALISTIC ORGAN MODELS ═══════════ */

function OrganMat({ color, isSel }: { color: string, isSel: boolean }) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={0.4}
      metalness={0.05}
      emissive={isSel ? color : '#000'}
      emissiveIntensity={isSel ? 0.6 : 0}
      transparent opacity={isSel ? 1 : 0.88}
    />
  )
}

/* BRAIN — two hemispheres with cerebellum and brainstem */
function BrainModel({ isSel }: { isSel: boolean }) {
  return (
    <group>
      {/* Left hemisphere */}
      <mesh position={[-0.22, 0, 0]} scale={[0.9, 0.75, 1]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <OrganMat color="#D4A0A0" isSel={isSel} />
      </mesh>
      {/* Right hemisphere */}
      <mesh position={[0.22, 0, 0]} scale={[0.9, 0.75, 1]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <OrganMat color="#CFA0A0" isSel={isSel} />
      </mesh>
      {/* Fissure (central groove) */}
      <mesh position={[0, 0.05, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.02, 0.6, 0.8]} />
        <meshStandardMaterial color="#8B6060" />
      </mesh>
      {/* Sulci/gyri wireframe overlay */}
      <mesh position={[-0.22, 0, 0]} scale={[0.92, 0.77, 1.02]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial color="#7A4040" wireframe transparent opacity={0.25} />
      </mesh>
      <mesh position={[0.22, 0, 0]} scale={[0.92, 0.77, 1.02]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial color="#7A4040" wireframe transparent opacity={0.25} />
      </mesh>
      {/* Cerebellum */}
      <mesh position={[0, -0.3, -0.35]} scale={[0.7, 0.4, 0.45]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <OrganMat color="#B89090" isSel={isSel} />
      </mesh>
      {/* Brainstem */}
      <mesh position={[0, -0.55, -0.15]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.5, 12]} />
        <OrganMat color="#A08080" isSel={isSel} />
      </mesh>
    </group>
  )
}

/* HEART — anatomical shape with chambers, aorta, vena cava */
function HeartModel({ isSel }: { isSel: boolean }) {
  return (
    <group rotation={[0, 0, 0.15]}>
      {/* Left ventricle (larger, forms the apex) */}
      <mesh position={[-0.08, -0.08, 0]} scale={[0.9, 1.1, 0.8]}>
        <sphereGeometry args={[0.28, 24, 24]} />
        <OrganMat color="#8B0000" isSel={isSel} />
      </mesh>
      {/* Right ventricle */}
      <mesh position={[0.12, -0.02, 0.08]} scale={[0.7, 0.9, 0.7]}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <OrganMat color="#A01010" isSel={isSel} />
      </mesh>
      {/* Left atrium */}
      <mesh position={[-0.1, 0.22, -0.05]} scale={[0.7, 0.5, 0.6]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <OrganMat color="#7A0808" isSel={isSel} />
      </mesh>
      {/* Right atrium */}
      <mesh position={[0.12, 0.22, 0.05]} scale={[0.6, 0.5, 0.55]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <OrganMat color="#900A0A" isSel={isSel} />
      </mesh>
      {/* Aorta arch */}
      <mesh position={[0, 0.38, -0.05]} rotation={[Math.PI/2, 0, 0.3]}>
        <torusGeometry args={[0.12, 0.05, 12, 24, Math.PI]} />
        <OrganMat color="#CC2020" isSel={isSel} />
      </mesh>
      {/* Superior Vena Cava */}
      <mesh position={[0.18, 0.35, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
        <meshStandardMaterial color="#3B60C0" />
      </mesh>
      {/* Pulmonary Arteries */}
      <mesh position={[-0.05, 0.35, 0.08]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
        <meshStandardMaterial color="#CC3030" />
      </mesh>
    </group>
  )
}

/* LUNGS — left (2 lobes) and right (3 lobes) with bronchi */
function LungsModel({ isSel }: { isSel: boolean }) {
  return (
    <group>
      {/* RIGHT LUNG — 3 lobes */}
      <group position={[0.55, 0, 0]}>
        <mesh position={[0, 0.25, 0]} scale={[0.75, 0.5, 0.5]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <OrganMat color="#E8A0A0" isSel={isSel} />
        </mesh>
        <mesh position={[0, -0.1, 0]} scale={[0.8, 0.45, 0.5]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <OrganMat color="#DDA0A0" isSel={isSel} />
        </mesh>
        <mesh position={[0, -0.4, 0]} scale={[0.7, 0.35, 0.45]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <OrganMat color="#D09595" isSel={isSel} />
        </mesh>
      </group>
      {/* LEFT LUNG — 2 lobes (slightly smaller) */}
      <group position={[-0.55, 0, 0]}>
        <mesh position={[0, 0.15, 0]} scale={[0.7, 0.55, 0.5]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <OrganMat color="#E8A0A0" isSel={isSel} />
        </mesh>
        <mesh position={[0, -0.3, 0]} scale={[0.7, 0.5, 0.45]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <OrganMat color="#DDA0A0" isSel={isSel} />
        </mesh>
        {/* Cardiac notch (indent for heart) */}
        <mesh position={[0.25, -0.15, 0.15]} scale={[0.3, 0.3, 0.3]}>
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshStandardMaterial color="#030303" />
        </mesh>
      </group>
      {/* Trachea */}
      <mesh position={[0, 0.65, -0.05]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 12]} />
        <meshStandardMaterial color="#E0C8C0" roughness={0.5} />
      </mesh>
      {/* Bronchi split */}
      <mesh position={[-0.15, 0.35, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#E0C8C0" roughness={0.5} />
      </mesh>
      <mesh position={[0.15, 0.35, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#E0C8C0" roughness={0.5} />
      </mesh>
    </group>
  )
}

/* LIVER — large wedge shape with two lobes */
function LiverModel({ isSel }: { isSel: boolean }) {
  return (
    <group>
      {/* Right lobe (larger) */}
      <mesh position={[0.1, 0, 0]} scale={[1.2, 0.5, 0.7]}>
        <sphereGeometry args={[0.5, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <OrganMat color="#6B2020" isSel={isSel} />
      </mesh>
      {/* Left lobe (smaller) */}
      <mesh position={[-0.35, 0.05, 0]} scale={[0.6, 0.4, 0.5]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <OrganMat color="#5B1818" isSel={isSel} />
      </mesh>
      {/* Gallbladder */}
      <mesh position={[0.2, -0.2, 0.25]} scale={[0.25, 0.5, 0.25]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#4A8030" roughness={0.4} />
      </mesh>
    </group>
  )
}

/* STOMACH — J-shaped bag */
function StomachModel({ isSel }: { isSel: boolean }) {
  return (
    <group rotation={[0, 0, -0.2]}>
      {/* Fundus (top bulge) */}
      <mesh position={[0, 0.2, 0]} scale={[0.6, 0.5, 0.5]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <OrganMat color="#C88070" isSel={isSel} />
      </mesh>
      {/* Body (main bag) */}
      <mesh position={[0, -0.1, 0]} scale={[0.5, 0.7, 0.45]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <OrganMat color="#C07060" isSel={isSel} />
      </mesh>
      {/* Pylorus (exit curve) */}
      <mesh position={[0.2, -0.35, 0]} rotation={[0, 0, -0.8]} scale={[0.3, 0.5, 0.3]}>
        <capsuleGeometry args={[0.1, 0.3, 8, 12]} />
        <OrganMat color="#B06858" isSel={isSel} />
      </mesh>
      {/* Esophagus (entry) */}
      <mesh position={[-0.05, 0.45, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.25, 8]} />
        <meshStandardMaterial color="#D0A090" roughness={0.5} />
      </mesh>
    </group>
  )
}

/* INTESTINES — small (coiled) + large (frame) */
function IntestinesModel({ isSel }: { isSel: boolean }) {
  return (
    <group>
      {/* Small intestine (coiled mass) */}
      <mesh position={[0, 0, 0]} scale={[0.7, 0.5, 0.4]}>
        <torusKnotGeometry args={[0.45, 0.1, 128, 12, 3, 7]} />
        <OrganMat color="#D4A090" isSel={isSel} />
      </mesh>
      {/* Ascending colon (right side) */}
      <mesh position={[0.55, 0.1, 0]}>
        <capsuleGeometry args={[0.1, 0.7, 8, 12]} />
        <OrganMat color="#D09080" isSel={isSel} />
      </mesh>
      {/* Transverse colon (top) */}
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.1, 0.9, 8, 12]} />
        <OrganMat color="#D09080" isSel={isSel} />
      </mesh>
      {/* Descending colon (left side) */}
      <mesh position={[-0.55, 0.1, 0]}>
        <capsuleGeometry args={[0.1, 0.7, 8, 12]} />
        <OrganMat color="#D09080" isSel={isSel} />
      </mesh>
      {/* Sigmoid colon (S-curve at bottom) */}
      <mesh position={[-0.3, -0.35, 0.05]} rotation={[0, 0, 0.5]}>
        <torusGeometry args={[0.15, 0.07, 8, 16, Math.PI]} />
        <OrganMat color="#C88878" isSel={isSel} />
      </mesh>
    </group>
  )
}

/* KIDNEYS — bean shapes */
function KidneyModel({ isSel, side }: { isSel: boolean, side: 'left' | 'right' }) {
  const flip = side === 'left' ? -1 : 1
  return (
    <group scale={[flip, 1, 1]}>
      {/* Main body */}
      <mesh scale={[0.5, 0.8, 0.4]}>
        <sphereGeometry args={[0.3, 24, 24]} />
        <OrganMat color="#8B3030" isSel={isSel} />
      </mesh>
      {/* Hilum (concave indent) */}
      <mesh position={[-0.08, 0, 0.08]} scale={[0.2, 0.4, 0.2]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#030303" />
      </mesh>
      {/* Renal artery stub */}
      <mesh position={[-0.1, 0, 0.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 6]} />
        <meshStandardMaterial color="#EF4444" />
      </mesh>
    </group>
  )
}

/* BLADDER — pear/balloon shape */
function BladderModel({ isSel }: { isSel: boolean }) {
  return (
    <group>
      <mesh scale={[0.8, 0.9, 0.7]}>
        <sphereGeometry args={[0.25, 24, 24]} />
        <OrganMat color="#E8C870" isSel={isSel} />
      </mesh>
      {/* Urethra */}
      <mesh position={[0, -0.25, 0.05]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 6]} />
        <meshStandardMaterial color="#D4B860" roughness={0.5} />
      </mesh>
      {/* Ureters */}
      <mesh position={[-0.1, 0.2, -0.05]} rotation={[0.2, 0, 0.3]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
        <meshStandardMaterial color="#D4B060" roughness={0.5} />
      </mesh>
      <mesh position={[0.1, 0.2, -0.05]} rotation={[0.2, 0, -0.3]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
        <meshStandardMaterial color="#D4B060" roughness={0.5} />
      </mesh>
    </group>
  )
}

/* ═══════════ ORGANS CONTAINER ═══════════ */
export function Organs({ selected, onSelect }: { selected: string | null, onSelect: (id: string) => void }) {
  const click = (id: string) => (e: any) => { e.stopPropagation(); onSelect(id) }
  return (
    <group>
      <group position={[0, 8.2, 0.1]} onClick={click('brain')}><BrainModel isSel={selected === 'brain'} /></group>
      <group position={[0.15, 5.0, 0.5]} onClick={click('heart')}><HeartModel isSel={selected === 'heart'} /></group>
      <group position={[0, 5.3, 0.15]} onClick={click('lungs')}><LungsModel isSel={selected === 'lungs'} /></group>
      <group position={[0.5, 4.0, 0.4]} onClick={click('liver')}><LiverModel isSel={selected === 'liver'} /></group>
      <group position={[-0.4, 3.6, 0.5]} onClick={click('stomach')}><StomachModel isSel={selected === 'stomach'} /></group>
      <group position={[0, 2.2, 0.4]} onClick={click('intestines')}><IntestinesModel isSel={selected === 'intestines'} /></group>
      <group position={[-0.6, 3.3, -0.2]} onClick={click('kidneys')}><KidneyModel isSel={selected === 'kidneys'} side="left" /></group>
      <group position={[0.6, 3.3, -0.2]} onClick={click('kidneys')}><KidneyModel isSel={selected === 'kidneys'} side="right" /></group>
      <group position={[0, 1.2, 0.5]} onClick={click('bladder')}><BladderModel isSel={selected === 'bladder'} /></group>
    </group>
  )
}

/* ═══════════ ISOLATED ORGAN (for detail modal — shows ONLY the selected organ) ═══════════ */
export function IsolatedOrgan({ organId }: { organId: string }) {
  const ref = useRef<THREE.Group>(null!)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.3
  })
  return (
    <group ref={ref} scale={2.5}>
      {organId === 'brain' && <BrainModel isSel={true} />}
      {organId === 'heart' && <HeartModel isSel={true} />}
      {organId === 'lungs' && <LungsModel isSel={true} />}
      {organId === 'liver' && <LiverModel isSel={true} />}
      {organId === 'stomach' && <StomachModel isSel={true} />}
      {organId === 'intestines' && <IntestinesModel isSel={true} />}
      {organId === 'kidneys' && <group><group position={[-0.4,0,0]}><KidneyModel isSel={true} side="left" /></group><group position={[0.4,0,0]}><KidneyModel isSel={true} side="right" /></group></group>}
      {organId === 'bladder' && <BladderModel isSel={true} />}
    </group>
  )
}

/* Vascular system - dense network */
export function VascularSystem({ activeSystem, onSelect }: { activeSystem: string | null, onSelect: (s: string) => void }) {
  const tubes = useMemo(() => {
    const t: { pts: THREE.Vector3[], type: string }[] = []
    const add = (s: number[], e: number[], type: string, mid?: number[]) => {
      const points = mid 
        ? [new THREE.Vector3(s[0],s[1],s[2]), new THREE.Vector3(mid[0],mid[1],mid[2]), new THREE.Vector3(e[0],e[1],e[2])]
        : [new THREE.Vector3(s[0],s[1],s[2]), new THREE.Vector3((s[0]+e[0])/2,(s[1]+e[1])/2,(s[2]+e[2])/2+0.3), new THREE.Vector3(e[0],e[1],e[2])]
      t.push({ pts: points, type })
    }

    // ARTERIES (red) - from heart outward
    add([0.15,5,0.5],[0,8,0.1],'artery',[0.1,6.5,0.4]) // carotid
    add([0.15,5,0.5],[0.5,4,0.4],'artery') // hepatic
    add([0.15,5,0.5],[0.6,3.3,-0.2],'artery') // renal R
    add([0.15,5,0.5],[-0.6,3.3,-0.2],'artery',[-0.3,4,-0.1]) // renal L
    add([0.15,5,0.5],[0,2.2,0.4],'artery',[0.1,3.5,0.5]) // mesenteric
    add([0.15,5,0.5],[-0.55,5.3,0.15],'artery') // pulmonary L
    add([0.15,5,0.5],[0.55,5.3,0.15],'artery') // pulmonary R
    add([0,3,0],[-0.5,-2,0],'artery',[- 0.4,1,0.2]) // femoral L
    add([0,3,0],[0.5,-2,0],'artery',[0.4,1,0.2]) // femoral R
    add([0.15,5,0.5],[-1.7,5.2,0],'artery',[-0.8,5.5,0.3]) // brachial L
    add([0.15,5,0.5],[1.7,5.2,0],'artery',[0.8,5.5,0.3]) // brachial R
    add([-1.7,5.2,0],[-1.8,3.2,0.1],'artery') // radial L
    add([1.7,5.2,0],[1.8,3.2,0.1],'artery') // radial R
    add([-0.5,-2,0],[-0.5,-4,0],'artery') // tibial L
    add([0.5,-2,0],[0.5,-4,0],'artery') // tibial R

    // VEINS (blue) - to heart
    add([0,8,0.2],[0.1,5.1,0.5],'vein',[0.2,6.5,0.5]) // jugular
    add([0.5,4.1,0.5],[0.1,5.1,0.5],'vein') // hepatic v
    add([0.6,3.4,-0.1],[0.1,5.1,0.5],'vein',[0.4,4.2,0.2]) // renal v R
    add([-0.6,3.4,-0.1],[0.1,5.1,0.5],'vein',[-0.2,4.2,0.2]) // renal v L
    add([-1.8,3.2,0.1],[-1.7,5.2,0],'vein') // cephalic L
    add([1.8,3.2,0.1],[1.7,5.2,0],'vein') // cephalic R
    add([-1.7,5.2,0],[0.1,5.1,0.5],'vein',[-0.7,5.6,0.4]) // subclavian L
    add([1.7,5.2,0],[0.1,5.1,0.5],'vein',[0.7,5.6,0.4]) // subclavian R
    add([-0.5,-4,0],[-0.5,-2,0],'vein') // saphenous L
    add([0.5,-4,0],[0.5,-2,0],'vein') // saphenous R
    add([-0.5,-2,0],[0,3,0],'vein',[-0.3,1,0.1]) // iliac L
    add([0.5,-2,0],[0,3,0],'vein',[0.3,1,0.1]) // iliac R

    // NERVES (yellow) - from brain/spine
    add([0,8,0],[0,7,-0.4],'nerve') // brainstem
    for(let i=0;i<14;i++) {
      const y = 6.5 - i * 0.5
      const side = i % 2 === 0 ? -1 : 1
      const reach = i < 4 ? 1.5 : i < 8 ? 1.2 : 0.8
      add([0,y,-0.4],[side*reach,y-0.5,0.2],'nerve',[side*0.4,y-0.2,-0.1])
    }
    // sciatic nerves
    add([0,1,-0.4],[-0.5,-2,-0.1],'nerve',[-0.3,0,-0.3])
    add([0,1,-0.4],[0.5,-2,-0.1],'nerve',[0.3,0,-0.3])
    add([-0.5,-2,-0.1],[-0.5,-4,-0.1],'nerve')
    add([0.5,-2,-0.1],[0.5,-4,-0.1],'nerve')

    return t
  }, [])

  return (
    <group>
      {tubes.map((tube, i) => {
        const curve = new THREE.CatmullRomCurve3(tube.pts)
        const color = tube.type === 'artery' ? '#EF4444' : tube.type === 'vein' ? '#3B82F6' : '#FACC15'
        const isActive = activeSystem === tube.type
        const dimmed = activeSystem && !isActive

        return (
          <mesh key={i} onClick={(e) => { e.stopPropagation(); onSelect(tube.type) }}>
            <tubeGeometry args={[curve, 16, isActive ? 0.05 : 0.025, 6, false]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isActive ? 2 : 0.3}
              transparent
              opacity={dimmed ? 0.08 : isActive ? 1 : 0.6}
            />
          </mesh>
        )
      })}
    </group>
  )
}

/* Muscle fibers on torso surface */
export function MuscleFibers() {
  const fibers = useMemo(() => {
    const f: { pos: [number,number,number], rot: [number,number,number], len: number }[] = []
    // Chest muscles
    for (let i = 0; i < 20; i++) {
      f.push({
        pos: [(Math.random()-0.5)*1.5, 5.5 + (Math.random()-0.5)*1.5, 0.5 + Math.random()*0.2],
        rot: [0, 0, (Math.random()-0.5)*0.8],
        len: 0.3 + Math.random() * 0.5
      })
    }
    // Abdominal
    for (let i = 0; i < 15; i++) {
      f.push({
        pos: [(Math.random()-0.5)*0.8, 3 + (Math.random()-0.5)*1.5, 0.5 + Math.random()*0.1],
        rot: [0, 0, (Math.random()-0.5)*0.3],
        len: 0.2 + Math.random() * 0.4
      })
    }
    return f
  }, [])

  return (
    <group>
      {fibers.map((f, i) => (
        <mesh key={i} position={f.pos} rotation={f.rot}>
          <cylinderGeometry args={[0.015, 0.015, f.len, 4]} />
          <meshStandardMaterial color="#B87060" transparent opacity={0.25} />
        </mesh>
      ))}
    </group>
  )
}
