import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { input } from './Canvas3D'

// ── Floating Glass Wireframe Sphere — mouse-follow tilt physics ────────────
export function HeroGlassSphere({ mobile = false }: { mobile?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const innerRef = useRef<THREE.Mesh>(null!)
  const target = useRef({ x: 0, y: 0 })

  // responsive scale: fit portrait — no clipping on <768
  const s = mobile ? 0.72 : 1
  const coreSize = mobile ? 0.42 : 0.62
  const wireSize = mobile ? 1.05 : 1.45
  const ringRadius = mobile ? 1.42 : 2.05

  useFrame((state) => {
    const t = state.clock.elapsedTime
    target.current.x += (input.mouse.x * 0.4 - target.current.x) * 0.06
    target.current.y += (input.mouse.y * 0.3 - target.current.y) * 0.06

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.18 + target.current.x * 0.6
      meshRef.current.rotation.x = t * 0.12 + target.current.y * 0.4
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.2
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.25
      const pulse = 1 + Math.sin(t * 0.6) * 0.04
      innerRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.7} floatingRange={[0, 0.3]}>
      {/* Outer glass wireframe — low-poly on mobile (detail 1 vs 2) */}
      <mesh ref={meshRef} position={[0, mobile ? 0.05 : 0.2, 0]} scale={s}>
        <icosahedronGeometry args={[wireSize, mobile ? 1 : 2]} />
        <meshPhysicalMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={0.18}
          roughness={0.05}
          metalness={0.15}
          transmission={0.95}
          thickness={0.4}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Inner emissive core */}
      <mesh ref={innerRef} position={[0, mobile ? 0.05 : 0.2, 0]} scale={s}>
        <sphereGeometry args={[coreSize, mobile ? 20 : 32, mobile ? 20 : 32]} />
        <meshStandardMaterial
          color="#020408"
          emissive="#06b6d4"
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>
      {/* Orbit ring — lighter on mobile */}
      <mesh rotation={[Math.PI / 2.4, 0, 0]} position={[0, mobile ? 0.05 : 0.2, 0]} scale={s}>
        <torusGeometry args={[ringRadius, 0.015, mobile ? 6 : 8, mobile ? 64 : 120]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={mobile ? 0.16 : 0.22} />
      </mesh>
    </Float>
  )
}

// ── Particle Field — Points + Float + noise movement ───────────────────────
export function ParticleField({
  count = 3000,
  color = '#06b6d4',
  mobile = false,
}: {
  count?: number
  color?: string
  mobile?: boolean
}) {
  const ref = useRef<THREE.Points>(null!)
  // on mobile parent already passes reduced count; clamp spread for portrait
  const spreadX = mobile ? 14 : 22
  const spreadY = mobile ? 12 : 18
  const spreadZ = mobile ? 8 : 12

  const positions = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = THREE.MathUtils.randFloatSpread(spreadX)
      p[i * 3 + 1] = THREE.MathUtils.randFloatSpread(spreadY)
      p[i * 3 + 2] = THREE.MathUtils.randFloatSpread(spreadZ) - 2
    }
    return p
  }, [count, spreadX, spreadY, spreadZ])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    // slower rotation on mobile for perf + less motion sickness
    ref.current.rotation.y = t * (mobile ? 0.008 : 0.015)
    ref.current.rotation.x = Math.sin(t * 0.08) * (mobile ? 0.03 : 0.06)
  })

  return (
    <Float speed={mobile ? 0.5 : 0.8} rotationIntensity={mobile ? 0.08 : 0.15} floatIntensity={mobile ? 0.25 : 0.4}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          color={color}
          size={mobile ? 0.018 : 0.022}
          sizeAttenuation
          transparent
          opacity={mobile ? 0.32 : 0.45}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </Float>
  )
}

// ── Low-poly fallback mesh for lower-end mobile (static, no Float) ───────
export function LowPolyFallback() {
  return (
    <group>
      <mesh position={[0, 0.05, -2]} scale={0.72}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.12} />
      </mesh>
      <mesh position={[0, 0.05, -2]}>
        <sphereGeometry args={[0.42, 16, 16]} />
        <meshBasicMaterial color="#020408" transparent opacity={0.9} />
      </mesh>
    </group>
  )
}
