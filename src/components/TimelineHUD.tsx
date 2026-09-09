import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  { id: 'home',     label: 'HERO',     color: '#06b6d4' },
  { id: 'about',    label: 'ABOUT',    color: '#a855f7' },
  { id: 'projects', label: 'PROJECTS', color: '#ec4899' },
  { id: 'skills',   label: 'SKILLS',   color: '#00ff88' },
  { id: 'timeline', label: 'CAREER',   color: '#06b6d4' },
  { id: 'contact',  label: 'CONTACT',  color: '#a855f7' },
]

function useTimecode() {
  const [tc, setTc] = useState('00:00:00:00')
  const startRef = useRef(Date.now())
  useEffect(() => {
    const id = setInterval(() => {
      const ms  = Date.now() - startRef.current
      const s   = Math.floor(ms / 1000)
      const fr  = Math.floor((ms % 1000) / (1000 / 60))
      const sec = s % 60
      const min = Math.floor(s / 60) % 60
      const hr  = Math.floor(s / 3600) % 24
      setTc(
        `${String(hr).padStart(2,'0')}:${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}:${String(fr).padStart(2,'0')}`
      )
    }, 1000 / 60)
    return () => clearInterval(id)
  }, [])
  return tc
}

export const TimelineHUD: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home')
  const [scrollPct, setScrollPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY
      const total    = document.body.scrollHeight - window.innerHeight
      setScrollPct(total > 0 ? (scrolled / total) * 100 : 0)

      for (const s of [...SECTIONS].reverse()) {
        const el = document.getElementById(s.id)
        if (el && scrolled >= el.offsetTop - 200) {
          setActiveSection(s.id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const activeColor = SECTIONS.find(s => s.id === activeSection)?.color ?? '#06b6d4'

  return (
    <>
      {/* ── Bottom Timeline HUD bar ── */}
      <div className="hud-timeline-bar">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-4">

          {/* Keyframe track */}
          <div className="flex-1 flex items-center gap-1 overflow-hidden">
            {/* Progress fill bar */}
            <div className="relative flex-1 h-1.5 bg-[#0d1117] rounded-full overflow-hidden mx-1">
              <motion.div
                className="absolute left-0 top-0 bottom-0 rounded-full"
                style={{
                  width: `${scrollPct}%`,
                  background: `linear-gradient(90deg, #06b6d4, ${activeColor})`,
                  boxShadow: `0 0 6px ${activeColor}`,
                  transition: 'width 0.1s linear, background 0.4s ease',
                }}
              />
              {/* Section keyframe markers */}
              {SECTIONS.map((s, i) => {
                const pct = (i / (SECTIONS.length - 1)) * 100
                const isActive = s.id === activeSection
                return (
                  <button
                    key={s.id}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-auto"
                    style={{ left: `${pct}%` }}
                    onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <motion.div
                      className={`kf-marker relative w-2.5 h-2.5 rounded-sm rotate-45 ${isActive ? 'kf-active' : ''}`}
                      style={{
                        background: isActive ? s.color : '#1a2030',
                        border: `1px solid ${isActive ? s.color : '#2a3040'}`,
                        boxShadow: isActive ? `0 0 8px ${s.color}` : 'none',
                        transition: 'background 0.3s, box-shadow 0.3s',
                      }}
                      animate={{ scale: isActive ? [1, 1.3, 1] : 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section labels */}
          <div className="flex-shrink-0 hidden sm:flex items-center gap-1">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[9px] font-mono tracking-widest px-2 py-0.5 rounded pointer-events-auto transition-all duration-200"
                style={{
                  color: activeSection === s.id ? s.color : '#2a3040',
                  background: activeSection === s.id ? s.color + '18' : 'transparent',
                  border: `1px solid ${activeSection === s.id ? s.color + '44' : 'transparent'}`,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          <span className="text-[#1a2030] text-sm">|</span>

          {/* FPS / resolution */}
          <div className="flex-shrink-0 flex items-center gap-2 text-[10px] font-mono">
            <span className="text-[#00ff88]">60 FPS</span>
            <span className="text-[#5a6478]">/</span>
            <span className="text-[#5a6478]">4K WebGL</span>
          </div>
        </div>
      </div>
    </>
  )
}
