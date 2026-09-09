import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial, Line } from '@react-three/drei'
import * as THREE from 'three'
import { Mail, Phone, ChevronDown } from 'lucide-react'

// ── Particle Sphere ────────────────────────────────────────────────────────
function ParticleSphere() {
  const ref = useRef<THREE.Points>(null!)
  const { mouse } = useThree()

  const positions = useMemo(() => {
    const pos = new Float32Array(4000 * 3)
    for (let i = 0; i < 4000; i++) {
      const r = 2.6
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.04 + mouse.x * 0.4
    ref.current.rotation.x = state.clock.elapsedTime * 0.02 + mouse.y * 0.2
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#06b6d4" size={0.009} sizeAttenuation depthWrite={false} opacity={0.65} />
    </Points>
  )
}

// ── Cybernetic Grid Floor ──────────────────────────────────────────────────
function GridFloor() {
  const ref = useRef<THREE.Group>(null!)
  const { mouse } = useThree()

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = -2.5 + Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    ref.current.rotation.x = -0.5 + mouse.y * 0.06
    ref.current.rotation.z = mouse.x * 0.03
  })

  const gridLines = useMemo(() => {
    const lines: [number, number, number][][] = []
    const size = 12, step = 1.2
    for (let i = -size; i <= size; i += step) {
      lines.push([[-size, 0, i], [size, 0, i]])
      lines.push([[i, 0, -size], [i, 0, size]])
    }
    return lines
  }, [])

  return (
    <group ref={ref}>
      {gridLines.map((pts, idx) => (
        <Line key={idx} points={pts as unknown as THREE.Vector3[]} color="#06b6d4" lineWidth={0.3} transparent opacity={0.12} />
      ))}
    </group>
  )
}

// ── Orbit Rings ────────────────────────────────────────────────────────────
function OrbitRings() {
  const r1 = useRef<THREE.Mesh>(null!)
  const r2 = useRef<THREE.Mesh>(null!)
  const r3 = useRef<THREE.Mesh>(null!)

  useFrame((s) => {
    if (r1.current) { r1.current.rotation.x = s.clock.elapsedTime * 0.22; r1.current.rotation.z = s.clock.elapsedTime * 0.08 }
    if (r2.current) { r2.current.rotation.y = s.clock.elapsedTime * 0.15; r2.current.rotation.z = -s.clock.elapsedTime * 0.12 }
    if (r3.current) { r3.current.rotation.x = -s.clock.elapsedTime * 0.1; r3.current.rotation.y = s.clock.elapsedTime * 0.18 }
  })

  return (
    <>
      <mesh ref={r1}><torusGeometry args={[2.0, 0.005, 2, 120]} /><meshBasicMaterial color="#a855f7" transparent opacity={0.4} /></mesh>
      <mesh ref={r2}><torusGeometry args={[2.6, 0.004, 2, 120]} /><meshBasicMaterial color="#06b6d4" transparent opacity={0.25} /></mesh>
      <mesh ref={r3}><torusGeometry args={[1.5, 0.003, 2, 100]} /><meshBasicMaterial color="#ec4899" transparent opacity={0.3} /></mesh>
    </>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[8, 8, 8]} color="#06b6d4" intensity={1.2} />
      <pointLight position={[-8, -8, -8]} color="#a855f7" intensity={0.6} />
      <pointLight position={[0, 5, 0]} color="#ec4899" intensity={0.3} />
      <ParticleSphere />
      <GridFloor />
      <OrbitRings />
    </>
  )
}

// ── Typing Roles ───────────────────────────────────────────────────────────
const ROLES = ['AI Developer', 'Mobile App Developer', 'Full Stack Developer', 'LLM & RAG Architect']

// ── Hero ───────────────────────────────────────────────────────────────────
export const Hero: React.FC = () => {
  const [roleIdx, setRoleIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [cardHovered, setCardHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const full = ROLES[roleIdx]
    let t: ReturnType<typeof setTimeout>
    if (!deleting && displayed.length < full.length) t = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 72)
    else if (!deleting && displayed.length === full.length) t = setTimeout(() => setDeleting(true), 2400)
    else if (deleting && displayed.length > 0) t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38)
    else { setDeleting(false); setRoleIdx(i => (i + 1) % ROLES.length) }
    return () => clearTimeout(t)
  }, [displayed, deleting, roleIdx])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 25 })
  const rotY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), { stiffness: 200, damping: 25 })
  const glowX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])
  const glowY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleCardMouseLeave = () => { mouseX.set(0); mouseY.set(0) }
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="ambient-orb absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10" />
      <div className="ambient-orb absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10" style={{ animationDelay: '3s' }} />

      {/* Three.js canvas */}
      <div className="absolute inset-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 6], fov: 55 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
          <Suspense fallback={null}><Scene /></Suspense>
        </Canvas>
      </div>

      <div className="absolute inset-0 hud-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_45%,rgba(6,182,212,0.07),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div className="order-2 lg:order-1">
            <motion.div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-7 text-xs font-mono"
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]" />
              </span>
              <span className="text-[#00ff88]">SYSTEM ONLINE</span>
              <span className="text-[#5a6478] mx-1">·</span>
              <span className="text-[#5a6478]">Maharashtra, India</span>
            </motion.div>

            <motion.h1 className="font-black leading-[0.95] mb-3 tracking-tight"
              style={{ fontSize: 'clamp(3rem, 9vw, 6.5rem)' }}
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }}>
              <span className="block text-[#e8edf5]">Rohit</span>
              <span className="block glitch-text" data-text="Kumar" style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(6,182,212,0.5))',
              }}>Kumar</span>
            </motion.h1>

            <motion.div className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              <div className="h-px w-8 bg-gradient-to-r from-[#06b6d4] to-transparent" />
              <span className="font-mono text-sm text-[#5a6478]">aka</span>
              <span className="font-mono text-sm font-bold" style={{
                background: 'linear-gradient(90deg,#06b6d4,#a855f7)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Bawa</span>
              <div className="h-px w-8 bg-gradient-to-l from-[#a855f7] to-transparent" />
            </motion.div>

            <motion.div className="h-9 flex items-center mb-6 font-mono text-lg md:text-xl"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
              <span className="text-[#e8edf5] font-semibold">{displayed}</span>
              <span className="blink text-[#06b6d4] ml-0.5 text-2xl font-light">|</span>
            </motion.div>

            <motion.p className="text-[#5a6478] text-base max-w-lg mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              Building production-grade AI apps, zero-cloud RAG pipelines, and polished mobile
              experiences. Turning complex problems into elegant, deployable code.
            </motion.p>

            <motion.div className="flex flex-wrap gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
              <motion.button onClick={() => scrollTo('projects')}
                className="relative px-8 py-3.5 font-bold rounded-full text-[#020408] overflow-hidden group"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #a855f7)' }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(6,182,212,0.55)' }}
                whileTap={{ scale: 0.95 }}>
                <span className="relative z-10">View My Work</span>
                <motion.div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
              <motion.button onClick={() => scrollTo('contact')}
                className="px-8 py-3.5 font-bold rounded-full text-[#06b6d4]"
                style={{ border: '1px solid rgba(6,182,212,0.35)' }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(6,182,212,0.25)' }}
                whileTap={{ scale: 0.95 }}>
                Hire Me
              </motion.button>
            </motion.div>

            <motion.div className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              {[
                { href: 'mailto:rohitkumar66555666@gmail.com', icon: <Mail size={11}/>, label: 'rohitkumar66555666@gmail.com' },
                { href: 'tel:+916299798907', icon: <Phone size={11}/>, label: '+91 6299798907' },
              ].map(c => (
                <a key={c.label} href={c.href} className="inline-flex items-center gap-1.5 glass px-3 py-1.5 rounded-full text-xs text-[#5a6478] hover:text-[#06b6d4] transition-colors">
                  {c.icon}{c.label}
                </a>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: 3D Card */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <motion.div ref={cardRef} className="relative group/card"
              initial={{ opacity: 0, scale: 0.7, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, type: 'spring', stiffness: 80 }}
              onMouseMove={handleCardMouseMove}
              onMouseEnter={() => setCardHovered(true)}
              onMouseLeave={() => { handleCardMouseLeave(); setCardHovered(false) }}
              style={{ perspective: 1200, transformStyle: 'preserve-3d' }}>

              <div className="absolute -inset-6 rounded-[2rem] blur-3xl bg-gradient-to-br from-[#06b6d4]/30 via-[#a855f7]/20 to-[#ec4899]/25 animate-pulse" />
              <div className="absolute -inset-2 rounded-[1.8rem] blur-lg bg-gradient-to-br from-[#06b6d4]/15 to-[#a855f7]/15" />

              <motion.div
                className="relative w-72 h-[22rem] md:w-80 md:h-96 rounded-[1.5rem] overflow-hidden"
                style={{
                  rotateX: rotX, rotateY: rotY,
                  background: 'rgba(13,17,23,0.8)',
                  backdropFilter: 'blur(24px)',
                  boxShadow: '0 0 50px rgba(6,182,212,0.8), 0 0 100px rgba(168,85,247,0.3), inset 0 0 30px rgba(6,182,212,0.05)',
                  border: '1px solid rgba(6,182,212,0.25)',
                  transformStyle: 'preserve-3d',
                }}>
                <div className="absolute inset-0 rounded-[1.5rem] pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-px shimmer-border" />
                  <div className="absolute bottom-0 left-0 right-0 h-px shimmer-border" style={{ animationDelay: '2s' }} />
                </div>

                {['top-2 left-2 border-t-2 border-l-2','top-2 right-2 border-t-2 border-r-2','bottom-2 left-2 border-b-2 border-l-2','bottom-2 right-2 border-b-2 border-r-2'].map((cls, i) => (
                  <div key={i} className={`absolute ${cls} w-6 h-6 rounded-sm border-[#06b6d4]/70`} />
                ))}

                <motion.div className="absolute w-32 h-32 rounded-full blur-2xl pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3), transparent 70%)', left: glowX, top: glowY, transform: 'translate(-50%,-50%)' }} />

                <img src="/image.png" alt="Rohit Kumar" className="w-full h-full object-cover object-center"
                  onError={e => {
                    const el = e.currentTarget; el.style.display = 'none'
                    const fb = document.createElement('div')
                    fb.className = 'w-full h-full flex items-center justify-center text-8xl bg-[#0d1117]'
                    fb.textContent = '👨‍💻'
                    el.parentElement!.appendChild(fb)
                  }} />

                <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-[#020408]/20 to-transparent" />

                <motion.div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06b6d4]/60 to-transparent"
                  animate={{ y: [0, 384, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />

                {[
                  { label: 'AI Developer',  color: '#06b6d4', top: '14px',  right: '12px', floatY: 6,  delay: 0   },
                  { label: 'RAG Architect', color: '#a855f7', top: '60px',  right: '12px', floatY: 8,  delay: 0.9 },
                  { label: 'Mobile Dev',    color: '#00ff88', top: '106px', right: '12px', floatY: 7,  delay: 1.7 },
                ].map(b => (
                  <motion.div key={b.label} className="absolute glass px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
                    style={{ top: b.top, right: b.right, color: b.color, border: `1px solid ${b.color}44` }}
                    animate={{ y: [0, -b.floatY, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}>
                    {b.label}
                  </motion.div>
                ))}

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="absolute top-[-1rem] left-0 right-0 flex justify-around px-4">
                    {[0,1,2,3,4].map(i => (
                      <motion.div key={i} className="w-2 h-2 rounded-sm rotate-45"
                        style={{ background: i % 2 === 0 ? '#06b6d4' : '#a855f7', boxShadow: `0 0 6px ${i % 2 === 0 ? '#06b6d4' : '#a855f7'}` }}
                        animate={{ scale: [1,1.4,1], opacity: [0.6,1,0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }} />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                    <p className="text-xs font-mono text-[#00ff88]">ACTIVE</p>
                  </div>
                  <p className="text-white font-black text-lg leading-tight">Rohit Kumar</p>
                  <p className="text-xs font-mono text-[#06b6d4]">@bawa · AI Developer</p>
                </div>
              </motion.div>

              {[
                { label: 'LangChain',    color: '#06b6d4', x: -110, y: -60 },
                { label: 'React Native', color: '#a855f7', x:  25,  y: -35 },
                { label: 'Ollama',       color: '#ec4899', x: -110, y:  40 },
                { label: 'Python',       color: '#00ff88', x:  20,  y:  60 },
              ].map((b, i) => (
                <motion.div key={b.label}
                  className="absolute glass px-3 py-1.5 rounded-full text-xs font-mono font-bold whitespace-nowrap top-1/2 left-1/2"
                  style={{ color: b.color, border: `1px solid ${b.color}55` }}
                  variants={{
                    hidden:  { opacity: 0, x: b.x * 0.4, y: b.y * 0.4, scale: 0.5 },
                    visible: { opacity: 1, x: b.x, y: b.y, scale: 1 },
                  }}
                  animate={cardHovered ? 'visible' : 'hidden'}
                  transition={{ duration: 0.4, delay: cardHovered ? i * 0.08 : 0, ease: 'easeOut' }}
                  whileHover={{ scale: 1.15, boxShadow: `0 0 14px ${b.color}66` }}>
                  {b.label}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.button onClick={() => scrollTo('about')}
          className="mt-16 mx-auto flex flex-col items-center gap-2 text-[#5a6478] text-xs font-mono group"
          animate={{ y: [0, 8, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}>
          <span className="group-hover:text-[#06b6d4] transition-colors">SCROLL</span>
          <ChevronDown size={16} className="group-hover:text-[#06b6d4] transition-colors" />
        </motion.button>
      </div>
    </section>
  )
}
