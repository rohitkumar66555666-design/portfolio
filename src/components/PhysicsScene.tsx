import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import { Physics, RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { useIsMobile, useIsLowEnd } from '../hooks/useIsMobile'

type IconDef = { label: string; color: string; pos: [number, number, number] }

const ICONS: IconDef[] = [
  { label: 'React', color: '#61DAFB', pos: [-2.6, 1.2, 0] },
  { label: 'JS', color: '#F7DF1E', pos: [-0.9, 2.0, 0.2] },
  { label: 'Python', color: '#3776AB', pos: [0.9, 1.6, -0.2] },
  { label: 'TW', color: '#06B6D4', pos: [2.4, 0.8, 0.3] },
]

function DraggableIcon({ label, color, pos, mobile }: IconDef & { mobile: boolean }) {
  const bodyRef = useRef<RapierRigidBody>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef(new THREE.Vector3())
  const scale = mobile ? 0.62 : 1

  // click impulse
  const handleClick = () => {
    if (!bodyRef.current || dragging) return
    bodyRef.current.applyImpulse(
      { x: (Math.random() - 0.5) * (mobile ? 1.5 : 3), y: Math.random() * (mobile ? 2 : 4) + 1, z: (Math.random() - 0.5) * 2 },
      true
    )
    bodyRef.current.applyTorqueImpulse({ x: Math.random() * 0.6, y: Math.random() * 0.6, z: Math.random() * 0.6 }, true)
  }

  // pointer drag — kinematic follow then throw on release
  const onPointerDown = (e: any) => {
    e.stopPropagation()
    if (mobile) return // disable drag on mobile to preserve scroll; tap still throws via click
    setDragging(true)
    const body = bodyRef.current
    if (!body) return
    const p = body.translation()
    dragOffset.current.set(e.point.x - p.x, e.point.y - p.y, 0)
    // freeze rotation while dragging
    e.target.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: any) => {
    if (!dragging || !bodyRef.current || mobile) return
    bodyRef.current.setTranslation({ x: e.point.x - dragOffset.current.x, y: e.point.y - dragOffset.current.y, z: 0 }, true)
    bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
  }
  const onPointerUp = (e: any) => {
    if (!dragging || mobile) return
    setDragging(false)
    if (!bodyRef.current) return
    // throw from mouse velocity
    const vx = (e.movementX ?? 0) * 0.05
    const vy = -(e.movementY ?? 0) * 0.05
    bodyRef.current.setLinvel({ x: vx * 8, y: vy * 8, z: 0 }, true)
    e.target.releasePointerCapture?.(e.pointerId)
  }

  return (
    <RigidBody
      ref={bodyRef}
      position={pos}
      colliders={false}
      mass={mobile ? 0.35 : 0.6}
      linearDamping={0.25}
      angularDamping={0.3}
      restitution={0.7}
      friction={0.4}
    >
      <BallCollider args={[0.62 * scale]} />
      <Float speed={dragging ? 0 : 1} rotationIntensity={dragging ? 0 : 0.2} floatIntensity={dragging ? 0 : 0.4}>
        <mesh
          ref={meshRef}
          scale={scale}
          onClick={handleClick}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          // touch-action pan-y lets vertical scroll win on mobile
          onPointerEnter={() => { if (!mobile) document.body.style.cursor = 'grab' }}
          onPointerLeave={() => { if (!mobile) document.body.style.cursor = 'auto' }}
        >
          <boxGeometry args={[0.95, 0.95, 0.18]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.3} />
          {/* label */}
          <Text
            position={[0, 0, 0.11]}
            fontSize={0.22}
            color="#020408"
            anchorX="center"
            anchorY="middle"
            fontWeight={700}
          >
            {label}
          </Text>
        </mesh>
      </Float>
    </RigidBody>
  )
}

// ── Bounding walls — keep icons in view (tighter on mobile) ──────────────
function Bounds({ mobile }: { mobile: boolean }) {
  const w = mobile ? 3.6 : 5.2
  const h = mobile ? 3.2 : 4.5
  return (
    <>
      {/* floor / ceiling */}
      <RigidBody type="fixed" position={[0, -h, 0]}><CuboidCollider args={[w, 0.15, 2]} /></RigidBody>
      <RigidBody type="fixed" position={[0, h, 0]}><CuboidCollider args={[w, 0.15, 2]} /></RigidBody>
      {/* left / right */}
      <RigidBody type="fixed" position={[-w, 0, 0]}><CuboidCollider args={[0.15, h, 2]} /></RigidBody>
      <RigidBody type="fixed" position={[w, 0, 0]}><CuboidCollider args={[0.15, h, 2]} /></RigidBody>
      {/* back — prevent escaping behind camera */}
      <RigidBody type="fixed" position={[0, 0, -1.5]}><CuboidCollider args={[w, h, 0.1]} /></RigidBody>
      <RigidBody type="fixed" position={[0, 0, 1.8]}><CuboidCollider args={[w, h, 0.1]} /></RigidBody>
    </>
  )
}

export function PhysicsScene() {
  const isMobile = useIsMobile()
  const isLowEnd = useIsLowEnd()

  // Low-end: simplified low-poly static fallback — no physics step
  if (isLowEnd && isMobile) {
    return (
      <group>
        {ICONS.slice(0, 3).map((ic) => (
          <mesh key={ic.label} position={ic.pos as any} scale={0.62}>
            <boxGeometry args={[0.95, 0.95, 0.18]} />
            <meshBasicMaterial color={ic.color} transparent opacity={0.85} />
          </mesh>
        ))}
      </group>
    )
  }

  const visibleIcons = isMobile ? ICONS.slice(0, 3) : ICONS // reduce bodies on mobile

  return (
    <Physics gravity={[0, isMobile ? -0.8 : -1.2, 0]} timeStep={1 / 60}>
      <Bounds mobile={isMobile} />
      {visibleIcons.map((ic) => (
        <DraggableIcon key={ic.label} {...ic} mobile={isMobile} />
      ))}
    </Physics>
  )
}
