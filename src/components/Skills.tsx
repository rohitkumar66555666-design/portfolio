import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { playHover, playClick } from '../utils/audio'

const SKILL_DATA = {
  'AI & LLM': {
    color: '#06b6d4',
    icon: '🤖',
    skills: [
      { name: 'LangChain / RAG Systems', level: 88 },
      { name: 'OpenAI / Groq / Claude API', level: 85 },
      { name: 'Ollama / Local LLMs', level: 82 },
      { name: 'Agentic Workflows', level: 78 },
    ],
    badges: ['LangChain','RAG Systems','OpenAI API','Groq API','Claude API','Ollama','ChromaDB','Agentic AI'],
  },
  'Frontend & Mobile': {
    color: '#a855f7',
    icon: '📱',
    skills: [
      { name: 'React Native / Expo', level: 87 },
      { name: 'React / TypeScript', level: 84 },
      { name: 'JavaScript', level: 90 },
      { name: 'HTML5 / CSS3 / Tailwind', level: 92 },
    ],
    badges: ['React Native','React','TypeScript','JavaScript','HTML5','CSS3','Tailwind CSS','Expo'],
  },
  'Backend & DB': {
    color: '#00ff88',
    icon: '⚙️',
    skills: [
      { name: 'Node.js / Express', level: 82 },
      { name: 'Python / FastAPI', level: 78 },
      { name: 'PostgreSQL / Supabase', level: 80 },
      { name: 'Firebase / REST APIs', level: 76 },
    ],
    badges: ['Node.js','Express','Python','SQL','PostgreSQL','Supabase','Firebase','REST APIs','Google Maps API'],
  },
  'Dev Tools': {
    color: '#ec4899',
    icon: '🛠️',
    skills: [
      { name: 'Git / GitHub', level: 88 },
      { name: 'VS Code', level: 95 },
      { name: 'Cloudinary / Media', level: 74 },
      { name: 'Deployment / CI-CD', level: 68 },
    ],
    badges: ['Git','GitHub','VS Code','Cloudinary','Expo EAS','Vercel','Postman'],
  },
}

type Category = keyof typeof SKILL_DATA

// ── Progress bar ──────────────────────────────────────────────────────────
const SkillBar: React.FC<{ name: string; level: number; color: string; index: number }> = ({
  name, level, color, index,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.09 }}
  >
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-[#e8edf5] text-sm font-medium">{name}</span>
      <span className="text-xs font-black font-mono" style={{ color, textShadow: `0 0 8px ${color}` }}>
        {level}%
      </span>
    </div>
    <div className="h-2 rounded-full bg-[#0d1117] overflow-hidden relative">
      <div className="absolute inset-0 rounded-full" style={{ background: `${color}10` }} />
      <motion.div
        className="h-full rounded-full relative overflow-hidden"
        style={{ background: `linear-gradient(90deg,${color},${color}88)` }}
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        viewport={{ once: false }}
        transition={{ duration: 1.3, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="absolute inset-0 w-1/3 bg-white/30 skew-x-12"
          animate={{ x: ['-100%', '400%'] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 + 1.2 }}
        />
      </motion.div>
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}, 0 0 16px ${color}` }}
        initial={{ left: '0%' }}
        whileInView={{ left: `calc(${level}% - 6px)` }}
        viewport={{ once: false }}
        transition={{ duration: 1.3, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  </motion.div>
)

// ── Interactive 3D Tech Core ──────────────────────────────────────────────
function TechCoreScene() {
  const groupRef = useRef<THREE.Group>(null!)
  const coreRef = useRef<THREE.Mesh>(null!)
  const nodeRefs = useRef<THREE.Mesh[]>([])
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const { camera } = useThree()

  // Track mouse on canvas for core rotation (normalize to -1..1 via drei mouse)
  const mouseVec = useThree().mouse as unknown as { x: number; y: number }
  const rotX  = useSpring(useTransform(useMotionValue(mouseVec.x * 2 - 1), [-1, 1], [0.4, -0.4]), { stiffness: 280, damping: 28 })
  const rotY  = useSpring(useTransform(useMotionValue(mouseVec.y * 2 - 1), [-1, 1], [-0.5, 0.5]), { stiffness: 280, damping: 28 })

  useFrame((s) => {
    if (!groupRef.current) return
    const t = s.clock.elapsedTime

    // Base breathing rotation
    groupRef.current.rotation.y = rotY.get() + Math.sin(t * 0.2) * 0.05
    groupRef.current.rotation.x = rotX.get() + Math.sin(t * 0.18 + 1) * 0.04

    // Core pulse
    if (coreRef.current) {
      const sc = 1 + Math.sin(t * 1.4) * 0.04
      coreRef.current.scale.setScalar(sc)
    }

    // Orbiting nodes
    const orbitRadius = 4.1
    const angularSpeed = 0.35
    nodeRefs.current.forEach((node, i) => {
      if (!node) return
      const offset = (i / nodeRefs.current.length) * Math.PI * 2
      const angle = t * angularSpeed + offset
      const yOff = Math.sin(t * 0.7 + i) * 0.5
      node.position.set(
        Math.cos(angle) * orbitRadius,
        yOff,
        Math.sin(angle) * orbitRadius,
      )
      node.lookAt(camera.position)
    })
  })

  // Active data is derived from the category, but TechCoreScene is
  // rendered inside the panel for the currently active category. We
  // bail out with a fallback when active is not in scope.
  const activeCategory = (SKILL_DATA as any)['AI & LLM']
  const badges: string[] = activeCategory.badges
  const color: string = activeCategory.color

  return (
    <group ref={groupRef} position={[0, 0, -8]}>
      {/* Core wireframe icosahedron */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color={"#06b6d4"} wireframe transparent opacity={0.55} />
      </mesh>
      {/* Inner core glow sphere */}
      <mesh scale={1.15}>
        <sphereGeometry args={[1.5, 24, 24]} />
        <meshBasicMaterial color={"#06b6d4"} transparent opacity={0.08} />
      </mesh>

      {/* Orbiting tech stack nodes */}
      {badges.map((label: string, i: number) => {
        const isActive = hoveredNode === i
        const localScale = isActive ? 1.45 : 1
        return (
          <mesh
            key={label}
            ref={el => { if (el) nodeRefs.current[i] = el }}
            scale={localScale}
            onPointerEnter={() => { setHoveredNode(i); playHover() }}
            onPointerLeave={() => setHoveredNode(null)}
          >
            <octahedronGeometry args={[0.32, 0]} />
            <meshBasicMaterial color={color} transparent opacity={isActive ? 1 : 0.85} />
          </mesh>
        )
      })}
    </group>
  )
}

// ── Floating badge (expands through 3D node hover via scale) ──────────────
const Badge: React.FC<{ label: string; color: string; index: number; activeNode: number | null; onClick?: () => void }> = ({ label, color, index, activeNode, onClick }) => {
  const expanded = activeNode === index
  return (
    <motion.button
      type="button"
      className="px-3 py-1.5 rounded-full text-xs font-mono font-medium glass whitespace-nowrap"
      style={{
        color,
        border: `1px solid ${color}44`,
        transform: expanded ? 'scale(1.25)' : 'scale(1)',
        opacity: expanded ? 1 : 0.85,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.055, type: 'spring', stiffness: 320, damping: 22 }}
      whileHover={{ scale: 1.18, boxShadow: `0 0 20px ${color}66`, y: -4 }}
      whileTap={{ scale: 0.92 }}
      onClick={() => { if (onClick) onClick() }}
    >
      <motion.span
        className="block"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.8 + index * 0.25, repeat: Infinity, ease: 'easeInOut' }}
        style={{ color }}
      >
        {label}
      </motion.span>
    </motion.button>
  )
}


// ── Tilt card ─────────────────────────────────────────────────────────────
const TiltCard: React.FC<{
  category: Category
  data: (typeof SKILL_DATA)[Category]
  isActive: boolean
  onClick: () => void
}> = ({ category, data, isActive, onClick }) => {
  const [hovered, setHovered] = useState(false)
  const [glare, setGlare] = useState({ x: 0.5, y: 0.5 })
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotX  = useSpring(useTransform(rawY, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 22 })
  const rotY  = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 22 })
  const scale = useSpring(hovered ? 1.03 : 1, { stiffness: 220, damping: 20 })

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    rawX.set((e.clientX - r.left) / r.width  - 0.5)
    rawY.set((e.clientY - r.top)  / r.height - 0.5)
    setGlare({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
  }, [rawX, rawY])

  const onEnter = useCallback(() => {
    setHovered(true)
    playHover()
  }, [])

  const onLeave = useCallback(() => {
    rawX.set(0); rawY.set(0)
    setGlare({ x: 0.5, y: 0.5 })
    setHovered(false)
  }, [rawX, rawY])

  return (
    <motion.div
      className="relative cursor-pointer"
      style={{ perspective: 900 }}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={() => { playClick(); onClick() }}
    >
      <motion.div
        className="rounded-2xl overflow-hidden relative"
        style={{
          rotateX: rotX, rotateY: rotY, scale,
          transformStyle: 'preserve-3d',
          background: 'rgba(13,17,23,0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isActive ? `1px solid ${data.color}66` : '1px solid rgba(255,255,255,0.07)',
          boxShadow: isActive || hovered
            ? `0 0 30px ${data.color}40, 0 16px 50px rgba(0,0,0,0.5)`
            : '0 4px 24px rgba(0,0,0,0.4)',
          transition: 'border 0.3s, box-shadow 0.3s',
        }}
      >
        <div className="h-px shimmer-border" />
        {isActive && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: `linear-gradient(90deg,transparent,${data.color},transparent)` }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4 }}
          />
        )}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${glare.x * 100}% ${glare.y * 100}%,${data.color}15 0%,transparent 60%)`,
            opacity: hovered ? 1 : 0, transition: 'opacity 0.2s',
          }}
        />
        <div className="p-5 pb-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: data.color + '18', border: `1px solid ${data.color}33` }}>
            {data.icon}
          </div>
          <div>
            <h3 className="text-[#e8edf5] font-black text-base leading-tight">{category}</h3>
            <p className="text-xs font-mono" style={{ color: data.color + 'aa' }}>
              {data.skills.length} skills · {data.badges.length} tools
            </p>
          </div>
          {isActive && (
            <motion.div
              className="ml-auto w-2 h-2 rounded-full"
              style={{ background: data.color, boxShadow: `0 0 8px ${data.color}` }}
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
          )}
        </div>
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {data.badges.slice(0, 4).map(b => (
            <span key={b} className="text-xs glass px-2 py-0.5 rounded-full" style={{ color: data.color + 'cc' }}>{b}</span>
          ))}
          {data.badges.length > 4 && <span className="text-xs text-[#5a6478]">+{data.badges.length - 4}</span>}
        </div>
        {category === 'Dev Tools' && (
          <div className="px-5 pb-4">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wide"
              style={{
                background: 'rgba(0,255,136,0.10)',
                border: '1px solid rgba(0,255,136,0.32)',
                color: '#00ff88',
                boxShadow: '0 0 10px rgba(0,255,136,0.18)',
              }}
            >
              <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00ff88]" />
              </span>
              RENDER 100%
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

// ── Skills section ────────────────────────────────────────────────────────
export const Skills: React.FC = () => {
  const [active, setActive] = useState<Category>('AI & LLM')
  const data = SKILL_DATA[active]
  const [activeNode, setActiveNode] = useState<number | null>(null)

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <motion.div className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <span className="section-label">WHAT I KNOW</span>
        <h2 className="text-4xl md:text-6xl font-black mt-3 text-[#e8edf5]">
          My{' '}
          <span style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Skills
          </span>
        </h2>
        <p className="text-[#5a6478] mt-3 text-sm font-mono">Click any category card to explore</p>
      </motion.div>

      {/* Category cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {(Object.keys(SKILL_DATA) as Category[]).map((cat, i) => (
          <motion.div key={cat} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <TiltCard category={cat} data={SKILL_DATA[cat]} isActive={active === cat} onClick={() => setActive(cat)} />
          </motion.div>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.38, ease: 'easeOut' }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(13,17,23,0.7)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${data.color}33`,
            boxShadow: `0 0 40px ${data.color}15`,
          }}
        >
          <div className="h-0.5" style={{ background: `linear-gradient(90deg,${data.color},#a855f7,transparent)` }} />
          <div className="p-7 grid lg:grid-cols-2 gap-10">
            {/* Progress bars */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">{data.icon}</span>
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[#5a6478]">Effects &amp; Plugins Panel</p>
                  <p className="text-[9px] font-mono text-[#2a3040] tracking-widest">CONTROL SURFACE</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: data.color }} />
                  <span className="text-xs font-mono" style={{ color: data.color }}>ACTIVE</span>
                </div>
              </div>
              <div className="space-y-6">
                {data.skills.map((s, i) => (
                  <SkillBar key={s.name} name={s.name} level={s.level} color={data.color} index={i} />
                ))}
              </div>
              {/* Stats strip */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { label: 'Skills', value: data.skills.length + '+' },
                  { label: 'Tools',  value: data.badges.length + '+' },
                  { label: 'Avg',    value: Math.round(data.skills.reduce((a, s) => a + s.level, 0) / data.skills.length) + '%' },
                ].map(st => (
                  <div key={st.label} className="glass rounded-xl p-3 text-center">
                    <p className="text-xl font-black" style={{ color: data.color }}>{st.value}</p>
                    <p className="text-xs text-[#5a6478] font-mono mt-0.5">{st.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badges + interactive 3D core */}
            <div className="relative">
              <p className="text-xs font-mono uppercase tracking-widest text-[#5a6478] mb-5">Technologies &amp; Tools</p>
              <div className="flex flex-wrap gap-3" style={{ transformStyle: 'preserve-3d', perspective: 600 }}>
                {data.badges.map((badge, i) => (
                  <Badge key={badge} label={badge} color={data.color} index={i} activeNode={activeNode} onClick={() => playClick()} />
                ))}
                {active === 'Dev Tools' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: data.badges.length * 0.055 + 0.12, type: 'spring', stiffness: 320, damping: 22 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold whitespace-nowrap"
                    style={{
                      background: 'rgba(0,255,136,0.10)',
                      border: '1px solid rgba(0,255,136,0.35)',
                      color: '#00ff88',
                      boxShadow: '0 0 14px rgba(0,255,136,0.22), 0 0 32px rgba(0,255,136,0.08)',
                    }}
                  >
                    <span className="relative flex h-2 w-2 flex-shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]" />
                    </span>
                    <span className="tracking-wide">SYSTEM READY</span>
                    <span className="opacity-40">·</span>
                    <span>RENDER 100%</span>
                  </motion.div>
                )}
              </div>

              {/* 3D canvas for tech core — only rendered when this panel is visible */}
              <div className="mt-8 h-[220px] rounded-xl overflow-hidden border border-white/5">
                <Canvas
                  camera={{ position: [0, 0, 10], fov: 45 }}
                  gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                  dpr={[1, 1.4]}
                  style={{ background: 'transparent', width: '100%', height: '100%' }}
                >
                  <Suspense fallback={null}>
                    <TechCoreScene />
                  </Suspense>
                </Canvas>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
