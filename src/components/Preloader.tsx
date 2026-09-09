import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import * as THREE from 'three'

// ── Loading bar tied to useProgress ──────────────────────────────────────
function ProgressBar({ onComplete }: { onComplete: () => void }) {
  const { progress, active } = useProgress()
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (progress >= 100 && !active && !done) {
      setDone(true)
      const t = setTimeout(onComplete, 500)
      return () => clearTimeout(t)
    }
  }, [progress, active, done, onComplete])

  return (
    <div className="w-64 md:w-80">
      <div className="h-1 rounded-full bg-[#1a2030] overflow-hidden relative mb-2">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: 'linear-gradient(90deg,#06b6d4,#a855f7,#ec4899)', boxShadow: '0 0 10px rgba(6,182,212,0.6)' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2 }}
        >
          <motion.div className="absolute inset-0 w-1/3 bg-white/30 skew-x-12" animate={{ x: ['-100%', '400%'] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }} />
        </motion.div>
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#06b6d4]"
          style={{ left: `calc(${progress}% - 5px)`, boxShadow: '0 0 10px #06b6d4' }}
          animate={{ left: `calc(${progress}% - 5px)` }}
          transition={{ duration: 0.2 }}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-mono text-[#5a6478] tracking-widest">
          {active ? 'LOADING ASSETS' : progress >= 100 ? 'READY' : 'INITIALIZING'}
        </span>
        <span className="text-xs font-black font-mono" style={{ color: progress >= 100 ? '#00ff88' : '#06b6d4', textShadow: progress >= 100 ? '0 0 10px rgba(0,255,136,0.7)' : '0 0 10px rgba(6,182,212,0.7)' }}>
          {progress.toFixed(0)}%
        </span>
      </div>
    </div>
  )
}

// ── Wireframe Tech Core — lightweight fallback when no assets loading ────
function TechCoreFallback() {
  const ref = React.useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.4
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.15
    }
  })
  return (
    <group>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} color="#06b6d4" intensity={1.2} />
      <pointLight position={[-4, -2, 3]} color="#a855f7" intensity={0.8} />
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.35} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.65, 24, 24]} />
        <meshStandardMaterial color="#020408" emissive="#06b6d4" emissiveIntensity={0.6} transparent opacity={0.95} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2, 0.015, 8, 100]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.22} />
      </mesh>
    </group>
  )
}

// ── Preloader — Suspense-aware with useProgress + fallback timer ─────────
export const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false)
  const [forceProgress, setForceProgress] = useState(0)

  const handleComplete = () => {
    setFadeOut(true)
    setTimeout(onComplete, 600)
  }

  // Force progress fallback if no Drei assets are suspending (pure DOM site)
  useEffect(() => {
    let p = 0
    const id = setInterval(() => {
      p += Math.random() * 14 + 6
      if (p >= 100) {
        p = 100
        clearInterval(id)
        setTimeout(handleComplete, 400)
      }
      setForceProgress(p)
    }, 110)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#020408' }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-[120px] bg-cyan-500/8 pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full blur-[100px] bg-purple-500/8 pointer-events-none" />

      <div className="relative w-72 h-72">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }} dpr={[1, 1.5]}>
          <TechCoreFallback />
        </Canvas>
      </div>

      <motion.div className="text-center mt-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <p className="text-2xl font-black tracking-tight mb-1" style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 16px rgba(6,182,212,0.5))' }}>
          Bawa.dev
        </p>
        <p className="text-[10px] font-mono text-[#5a6478] tracking-widest uppercase mb-4">AI Developer · Full Stack · Mobile</p>

        {/* useProgress bar — also shows forceProgress if no async assets */}
        <React.Suspense fallback={<div className="w-64 h-1 bg-[#1a2030] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${forceProgress}%` }} /></div>}>
          <ProgressBar onComplete={handleComplete} />
        </React.Suspense>
        {/* Fallback numeric for non-suspending sites */}
        <p className="text-[10px] font-mono text-[#5a6478] mt-2 md:hidden">{Math.round(forceProgress)}% — fallback</p>
      </motion.div>

      <motion.div className="absolute left-0 right-0 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg,transparent,rgba(6,182,212,0.3),transparent)' }} animate={{ y: ['0vh', '100vh'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} />
      {(['top-4 left-4 border-t border-l','top-4 right-4 border-t border-r','bottom-16 left-4 border-b border-l','bottom-16 right-4 border-b border-r']).map((cls,i)=>(
        <motion.div key={i} className={`absolute ${cls} w-7 h-7 border-[#06b6d4]/35 pointer-events-none`} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.08}} />
      ))}
    </motion.div>
  )
}
