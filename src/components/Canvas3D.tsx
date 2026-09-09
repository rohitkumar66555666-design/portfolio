import React, { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { HeroGlassSphere, ParticleField, LowPolyFallback } from './Hero3D'
import { WindowScrollRig } from './ScrollRig'
import { PhysicsScene } from './PhysicsScene'
import { useIsMobile, useIsLowEnd } from '../hooks/useIsMobile'

// ── Shared global input state ────────────────────────────────────────────
export const input = {
  mouse: { x: 0, y: 0, vx: 0, vy: 0 },
  scroll: { y: 0, pct: 0 },
}

// ── Adaptive camera — FOV/position scales on <768 (useThree + resize) ───
function AdaptiveCamera() {
  const { camera, size } = useThree()
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    const isMobile = size.width < 768
    cam.fov = isMobile ? 72 : 60
    cam.position.set(0, isMobile ? 1 : 2, isMobile ? 23 : 20)
    cam.updateProjectionMatrix()
  }, [camera, size.width])

  // also react to window resize/orientation for DPR + camera sync
  useEffect(() => {
    const onResize = () => {
      const cam = camera as THREE.PerspectiveCamera
      const mob = window.innerWidth < 768
      cam.fov = mob ? 72 : 60
      cam.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [camera])
  return null
}

// ── Master Scene — responsive hero + particles + conditional postproc ────
function Scene() {
  const { size } = useThree()
  const isMobile = size.width < 768
  const isLowEnd = useIsLowEnd()
  const useFallback = isMobile && isLowEnd

  // particle counts: desktop ~5700 total -> mobile ~1500-2050 (spec: 5000→1500)
  const pf1 = isMobile ? 900 : 2800
  const pf2 = isMobile ? 350 : 1400
  const lp1 = isMobile ? 500 : 1800
  const lp2 = isMobile ? 300 : 1100

  return (
    <>
      <AdaptiveCamera />
      <WindowScrollRig />

      {useFallback ? (
        <LowPolyFallback />
      ) : (
        <>
          <HeroGlassSphere mobile={isMobile} />
          {/* Interactive physics icons — drag/throw (auto-disabled on mobile to keep scroll) */}
          <Suspense fallback={null}>
            <PhysicsScene />
          </Suspense>
          <ParticleField count={pf1} color="#06b6d4" mobile={isMobile} />
          <ParticleField count={pf2} color="#a855f7" mobile={isMobile} />
          <LiquidParticles color="#06b6d4" count={lp1} baseOpacity={0.35} scrollFactor={7} orbitSpeed={0.9} mobile={isMobile} />
          <LiquidParticles color="#a855f7" count={lp2} baseOpacity={0.25} scrollFactor={5} orbitSpeed={-0.7} mobile={isMobile} />
        </>
      )}

      <IcoWire mobile={isMobile} lowEnd={useFallback} />
      <TorusKnotWire mobile={isMobile} lowEnd={useFallback} />
      {/* lighter helpers on mobile */}
      {!isMobile && <CyberGrid />}
      {isMobile ? <CyberGridMobile /> : null}
      <LightLeaks mobile={isMobile} />
      <CursorLights mobile={isMobile} />

      {/* reflections off on low-end mobile for perf */}
      {!useFallback && <Environment preset="city" />}

      {/* ── Performance: disable heavy Bloom/SSAO on mobile (<768) to lock 60 FPS ── */}
      {!isMobile ? (
        <EffectComposer multisampling={0} enabled>
          <Bloom luminanceThreshold={0.22} luminanceSmoothing={0.5} intensity={0.85} mipmapBlur />
          <ChromaticAberration offset={new THREE.Vector2(0.0018, 0.0018)} radialModulation modulationOffset={0.35} />
          <Noise opacity={0.032} />
          <Vignette eskil={false} offset={0.35} darkness={0.55} />
        </EffectComposer>
      ) : (
        // mobile: lightweight only — no Bloom/Chromatic (heavy). Keep subtle Vignette+Noise if not lowEnd
        !useFallback && (
          <EffectComposer multisampling={0} enabled>
            <Noise opacity={0.018} />
            <Vignette eskil={false} offset={0.4} darkness={0.42} />
          </EffectComposer>
        )
      )}
    </>
  )
}

// ── Liquid particle layer — auto-scales with mobile flag ─────────────────
function LiquidParticles({
  color, count, baseOpacity, scrollFactor, orbitSpeed, mobile,
}: {
  color: string; count: number; baseOpacity: number; scrollFactor: number; orbitSpeed: number; mobile?: boolean
}) {
  const ref = useRef<THREE.Points>(null!)
  const matRef = useRef<LiquidShaderMaterial>(null!)
  const { positions, vortex } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vd = new Float32Array(count)
    // tighter spread on mobile portrait so particles stay on screen
    const sx = mobile ? 28 : 80
    const sy = mobile ? 26 : 80
    const sz = mobile ? 10 : 30
    for (let i = 0; i < count; i++) {
      pos[i*3] = (Math.random()-0.5)*sx
      pos[i*3+1] = (Math.random()-0.5)*sy
      pos[i*3+2] = (Math.random()-0.5)*sz
      vd[i] = Math.random()
    }
    return { positions: pos, vortex: vd }
  }, [count, mobile])

  useFrame((s) => {
    if (!ref.current || !matRef.current) return
    const speed = Math.sqrt(input.mouse.vx**2 + input.mouse.vy**2)
    // pause drift when lowEnd or tab hidden — handled outside
    matRef.current.uniforms.uTime.value = s.clock.elapsedTime
    matRef.current.uniforms.uMouse.value.set(input.mouse.x, input.mouse.y)
    matRef.current.uniforms.uVelocity.value = speed
    matRef.current.uniforms.uScroll.value = input.scroll.pct
    ref.current.rotation.y = s.clock.elapsedTime*0.005*orbitSpeed + input.mouse.x*0.03
    ref.current.rotation.x = s.clock.elapsedTime*0.003*orbitSpeed + input.mouse.y*0.015
    ref.current.position.z = input.scroll.pct * -scrollFactor
  })

  const mat = useMemo(() => new LiquidShaderMaterial({ color, baseOpacity }), [color, baseOpacity])
  useEffect(() => () => { mat.dispose() }, [mat])

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} usage={THREE.DynamicDrawUsage} />
        <bufferAttribute attach="attributes-customPosition" count={count} array={positions} itemSize={3} usage={THREE.DynamicDrawUsage} />
        <bufferAttribute attach="attributes-customVortex" count={count} array={vortex} itemSize={1} />
      </bufferGeometry>
      <primitive object={mat} attach="material" />
    </points>
  )
}

const liquidVertexShader = `
  attribute vec3 customPosition;
  attribute float customVortex;
  uniform float uTime; uniform vec2 uMouse; uniform float uVelocity; uniform float uScroll;
  varying float vVortex;
  void main(){
    float ripple = sin(customPosition.x*0.4+uTime*1.1)*cos(customPosition.y*0.5+uTime*0.8)*sin(customPosition.z*0.3+uTime*0.6);
    float swirl = sin(customPosition.x*0.2+uTime*0.7+customPosition.y*0.2)+cos(customPosition.y*0.2-uTime*0.6+customPosition.z*0.2);
    float velRipple = uVelocity*(sin(uTime*4.0+customPosition.x)*0.5+0.5);
    vec3 pos = customPosition;
    pos.x += ripple*0.5*(0.4+velRipple*2.0);
    pos.y += swirl*0.4*(0.4+velRipple*2.0);
    pos.z += ripple*0.3+velRipple*1.2 - uVelocity*4.0 + uScroll*-10.0;
    vVortex = velRipple;
    vec4 mv = modelViewMatrix * vec4(pos,1.0);
    gl_Position = projectionMatrix * mv;
  }
`
const liquidFragmentShader = `
  uniform vec3 uColor; uniform float uOpacity; uniform float uVelocity; varying float vVortex;
  void main(){
    float blur = 1.0 - clamp(uVelocity*0.7,0.0,0.35);
    float intensity = 0.45 + vVortex*0.45;
    float alpha = uOpacity*intensity*blur;
    gl_FragColor = vec4(uColor, alpha);
  }
`
class LiquidShaderMaterial extends THREE.ShaderMaterial {
  constructor(params: { color: string; baseOpacity: number }){
    super({
      transparent:true, depthWrite:false,
      uniforms:{
        uTime:{value:0}, uMouse:{value:new THREE.Vector2(0,0)}, uVelocity:{value:0}, uScroll:{value:0},
        uColor:{value:new THREE.Color(params.color)}, uOpacity:{value:params.baseOpacity},
      },
      vertexShader: liquidVertexShader, fragmentShader: liquidFragmentShader,
    })
  }
}

function IcoWire({ mobile, lowEnd }: { mobile: boolean; lowEnd: boolean }){
  const ref=useRef<THREE.Mesh>(null!)
  useFrame((s)=>{ if(!ref.current) return; ref.current.rotation.x=s.clock.elapsedTime*0.06+input.mouse.y*0.1; ref.current.rotation.y=s.clock.elapsedTime*0.04+input.mouse.x*0.12; ref.current.position.z=-14+input.scroll.pct*-4 })
  // low-poly detail 0 on lowEnd, 1 on mobile, 2 desktop; smaller + closer on mobile so not clipped
  const detail = lowEnd ? 0 : mobile ? 1 : 1
  const scale = mobile ? 0.68 : 1
  const pos: [number, number, number] = mobile ? [3.2, 2.2, -12] : [7, 3, -14]
  return <mesh ref={ref} position={pos} scale={scale}><icosahedronGeometry args={[2.5, detail]} /><meshBasicMaterial color="#06b6d4" wireframe transparent opacity={mobile ? 0.05 : 0.08} /></mesh>
}
function TorusKnotWire({ mobile, lowEnd }: { mobile: boolean; lowEnd: boolean }){
  const ref=useRef<THREE.Mesh>(null!)
  useFrame((s)=>{ if(!ref.current) return; ref.current.rotation.x=s.clock.elapsedTime*0.05-input.mouse.y*0.07; ref.current.rotation.y=s.clock.elapsedTime*0.08+input.mouse.x*0.08; ref.current.position.z=-16+input.scroll.pct*-3 })
  if (lowEnd) return null
  const tubular = mobile ? 8 : 12
  const pos: [number, number, number] = mobile ? [-3, -2.5, -12] : [-8, -4, -16]
  const scale = mobile ? 0.62 : 1
  return <mesh ref={ref} position={pos} scale={scale}><torusKnotGeometry args={[1.5,0.4, mobile?40:80, tubular]} /><meshBasicMaterial color="#a855f7" wireframe transparent opacity={mobile?0.04:0.07} /></mesh>
}
function CyberGrid(){
  const ref=useRef<THREE.GridHelper>(null!)
  useFrame(()=>{ if(!ref.current) return; ref.current.position.z=(performance.now()*0.0006)%5; ref.current.rotation.x=-0.42+input.mouse.y*0.03 })
  return <gridHelper ref={ref} args={[70,45,'#06b6d4','#0a1520']} position={[0,-10,-5]} />
}
function CyberGridMobile(){
  const ref=useRef<THREE.GridHelper>(null!)
  useFrame(()=>{ if(!ref.current) return; ref.current.position.z=(performance.now()*0.0004)%4 })
  return <gridHelper ref={ref} args={[32,18,'#06b6d4','#0a1520']} position={[0,-9,-5]} />
}
function CursorLights({ mobile }: { mobile: boolean }){
  const c=useRef<THREE.PointLight>(null!), p=useRef<THREE.PointLight>(null!)
  useFrame((s)=>{ const t=s.clock.elapsedTime; if(c.current){ c.current.position.x+=(input.mouse.x*(mobile?6:12)-c.current.position.x)*0.05; c.current.position.y+=(-input.mouse.y*(mobile?4:8)-c.current.position.y)*0.05; c.current.intensity= (mobile?0.55:0.9)+Math.sin(t*0.7)*0.15 } if(p.current){ p.current.position.x+=(-input.mouse.x*(mobile?3:6)-p.current.position.x)*0.04; p.current.intensity=(mobile?0.35:0.6)+Math.sin(t*0.5+1.5)*0.12 } })
  return <><ambientLight intensity={mobile?0.2:0.15} /><pointLight ref={c} color="#06b6d4" intensity={mobile?0.55:0.9} distance={mobile?26:40} position={[0,4,5]} /><pointLight ref={p} color="#a855f7" intensity={mobile?0.35:0.6} distance={mobile?22:35} position={[0,-4,5]} /></>
}
function LightLeaks({ mobile }: { mobile: boolean }){
  const a=useRef<THREE.Mesh>(null!), b=useRef<THREE.Mesh>(null!)
  useFrame((s)=>{ const t=s.clock.elapsedTime; if(a.current){ a.current.position.x=Math.sin(t*0.18)*(mobile?10:25); (a.current.material as THREE.MeshBasicMaterial).opacity=(mobile?0.03:0.06)+Math.sin(t*0.4)*0.02 } if(b.current){ b.current.position.x=Math.cos(t*0.14)*(mobile?9:20); (b.current.material as THREE.MeshBasicMaterial).opacity=(mobile?0.025:0.05)+Math.sin(t*0.35+2)*0.015 } })
  if(mobile) return <mesh ref={a} position={[-4,3,-8]}><sphereGeometry args={[4,8,8]} /><meshBasicMaterial color="#06b6d4" transparent opacity={0.03} side={THREE.BackSide} /></mesh>
  return <><mesh ref={a} position={[-10,5,-8]}><sphereGeometry args={[8,8,8]} /><meshBasicMaterial color="#06b6d4" transparent opacity={0.06} side={THREE.BackSide} /></mesh><mesh ref={b} position={[12,-4,-10]}><sphereGeometry args={[7,8,8]} /><meshBasicMaterial color="#ec4899" transparent opacity={0.05} side={THREE.BackSide} /></mesh></>
}

// ── Canvas3D export ───────────────────────────────────────────────────────
export const Canvas3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // required spec: dpr capped to 1.5, performance min 0.5
  const dpr: [number, number] = [1, 1.5]

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.classList.add('r3f-no-cursor')
    let prevX=0, prevY=0
    let decay: ReturnType<typeof setInterval>
    const onMove=(e:MouseEvent)=>{ const nx=(e.clientX/window.innerWidth)*2-1, ny=(e.clientY/window.innerHeight)*2-1; input.mouse.vx=nx-prevX; input.mouse.vy=ny-prevY; prevX=nx; prevY=ny; input.mouse.x=nx; input.mouse.y=ny }
    const onTouchMove=(e:TouchEvent)=>{ // subtle attractor on touch — no preventDefault so scroll not blocked
      if(!e.touches[0]) return
      const t=e.touches[0]; const nx=(t.clientX/window.innerWidth)*2-1, ny=(t.clientY/window.innerHeight)*2-1
      input.mouse.x = nx; input.mouse.y = ny
    }
    const onScroll=()=>{ const max=document.body.scrollHeight-window.innerHeight; input.scroll.pct=max>0?window.scrollY/max:0 }
    window.addEventListener('mousemove', onMove, { passive:true })
    window.addEventListener('touchmove', onTouchMove, { passive:true })
    window.addEventListener('scroll', onScroll, { passive:true })
    decay=setInterval(()=>{ input.mouse.vx*=0.85; input.mouse.vy*=0.85 },16)
    return ()=>{ window.removeEventListener('mousemove', onMove); window.removeEventListener('touchmove', onTouchMove); window.removeEventListener('scroll', onScroll); clearInterval(decay) }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position:'fixed', inset:0, zIndex:-10,
        pointerEvents:'none',
        touchAction:'pan-y',
      } as React.CSSProperties}
    >
      <Canvas
        camera={{ position:[0,2,20], fov:60, near:0.1, far:150 }}
        gl={{ antialias:false, alpha:true, powerPreference:'high-performance', stencil:false, depth:true }}
        dpr={dpr}
        frameloop="always"
        performance={{ min:0.5 }}
        onCreated={({ gl }) => {
          // ensure canvas itself does not capture vertical scroll
          gl.domElement.style.touchAction = 'pan-y'
        }}
        style={{ background:'transparent', width:'100%', height:'100%', touchAction:'pan-y', pointerEvents:'none' } as any}
        // critical: Canvas must not block scroll; parent already pan-y + pointerEvents none
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0,2,20]} fov={60} near={0.1} far={150} />
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
