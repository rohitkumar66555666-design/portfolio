import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame, Canvas as FiberCanvas } from '@react-three/fiber'
import { Float, useTexture, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { useIsMobile } from '../hooks/useIsMobile'

type Props = {
  image: string
  color: string
  title: string
}

// ── Floating 3D Project Screen — hover-lift physics + dynamic lighting ────
export function Project3DCard({ image, color }: Props) {
  const groupRef = useRef<THREE.Group>(null!)
  const lightRef = useRef<THREE.PointLight>(null!)
  const [hovered, setHovered] = useState(false)
  const isMobile = useIsMobile()

  const texture = useTexture(image) as THREE.Texture
  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
  }

  // fit portrait: scale chassis down on mobile
  const chassisScale = isMobile ? 0.78 : 1

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = Math.sin(t * 0.7) * (isMobile ? 0.04 : 0.08)
    const targetZ = hovered && !isMobile ? 0.55 : 0
    const targetRotY = hovered && !isMobile ? state.pointer.x * 0.35 : 0
    const targetRotX = hovered && !isMobile ? -state.pointer.y * 0.2 : 0
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.09)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.09)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.09)
    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, hovered ? 2.2 : 0.4, 0.1)
    }
  })

  return (
    <Float speed={hovered && !isMobile ? 2 : isMobile ? 0.6 : 1.1} rotationIntensity={isMobile ? 0.02 : hovered ? 0.15 : 0.04} floatIntensity={isMobile ? 0.22 : 0.5}>
      <group
        ref={groupRef}
        scale={chassisScale}
        onPointerOver={() => !isMobile && setHovered(true)}
        onPointerOut={() => !isMobile && setHovered(false)}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.45, 1.55, 0.09]} />
          <meshPhysicalMaterial
            color="#0d1117"
            roughness={0.35}
            metalness={0.6}
            transmission={0.15}
            thickness={0.3}
            transparent
            opacity={0.92}
          />
        </mesh>
        <mesh position={[0, 0.05, 0.06]}>
          <planeGeometry args={[2.3, 1.32]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.58, 0.06]}>
          <planeGeometry args={[2.3, 0.12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered && !isMobile ? 0.7 : 0.25} />
        </mesh>
        <pointLight ref={lightRef} position={[0, 0, 1.2]} color={color} intensity={0.4} distance={5} decay={2} />
        {!isMobile && <pointLight position={[-1.2, 0.6, 0.8]} color="#a855f7" intensity={0.5} distance={4} />}
        {!isMobile && <Environment preset="city" />}
      </group>
    </Float>
  )
}

// ── Hybrid card wrapper — per-card isolated Canvas ────────────────────────
export function Project3DFrame({ image, color, title }: Props) {
  const isMobile = useIsMobile()
  return (
    <div
      className="w-full h-[280px] rounded-2xl overflow-hidden relative glass border border-white/10"
      style={{ touchAction: 'pan-y' }}
    >
      <div className="absolute inset-0" style={{ touchAction: 'pan-y' }}>
        <FiberCanvas
          camera={{ position: [0, 0, isMobile ? 3.6 : 3.2], fov: isMobile ? 52 : 45 }}
          dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5) as any}
          performance={{ min: 0.5 }}
          gl={{ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' as const, stencil: false }}
          style={{ background: 'transparent', touchAction: 'pan-y' } as any}
          // allow page scroll to pass through on touch — do not capture vertical drags
          onCreated={({ gl }) => {
            const canvas = gl.domElement as HTMLCanvasElement
            canvas.style.touchAction = 'pan-y'
          }}
        >
          <ambientLight intensity={0.6} />
          <Project3DCard image={image} color={color} title={title} />
        </FiberCanvas>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 glass backdrop-blur-xl bg-[#020408]/60 border-t border-white/10 pointer-events-none">
        <p className="text-sm font-black text-[#e8edf5]">{title}</p>
      </div>
    </div>
  )
}
