import React, { useState, useEffect, useRef } from 'react'
import { Navbar }       from './components/Navbar'
import { Hero }         from './components/Hero'
import { About }        from './components/About'
import { Projects }     from './components/Projects'
import { Skills }       from './components/Skills'
import { Timeline }     from './components/Timeline'
import { Contact }      from './components/Contact'
import { Footer }       from './components/Footer'
import { Canvas3D }     from './components/Canvas3D'
import { Preloader }    from './components/Preloader'
import { CustomCursor } from './components/CustomCursor'
import { TimelineHUD }  from './components/TimelineHUD'
import { playRipple, resumeAudio } from './utils/audio'

const SECTION_PORTS = [
  { id: 'home',     color: '#06b6d4' },
  { id: 'about',    color: '#a855f7' },
  { id: 'projects', color: '#ec4899' },
  { id: 'skills',   color: '#00ff88' },
  { id: 'timeline', color: '#06b6d4' },
  { id: 'contact',  color: '#a855f7' },
] as const

export const App: React.FC = () => {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const resume = () => resumeAudio()
    window.addEventListener('pointerdown', resume, { once: true })
    window.addEventListener('keydown', resume, { once: true })
    return () => {
      window.removeEventListener('pointerdown', resume)
      window.removeEventListener('keydown', resume)
    }
  }, [])

  useEffect(() => {
    const throttled: Record<string, number> = {}
    const onScroll = () => {
      const scrollY = window.scrollY
      const max = document.body.scrollHeight - window.innerHeight
      if (max <= 0) return
      const pct = scrollY / max
      const activeIndex = SECTION_PORTS.findIndex(s => {
        const el = document.getElementById(s.id)
        return el && scrollY >= (el.offsetTop - 140)
      })
      const key = `sec${activeIndex}`
      const last = throttled[key]
      if (last && performance.now() - last < 320) return
      throttled[key] = performance.now()
      playRipple(0.18 + pct * 0.5)
    }
    let ticking = false
    const onScrollThrottled = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          onScroll()
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScrollThrottled, { passive: true })
    return () => window.removeEventListener('scroll', onScrollThrottled)
  }, [])

  return (
    <>
      <CustomCursor />
      <TimelineHUD />

      {!done && (
        <Preloader onComplete={() => setDone(true)} />
      )}

      <div
        className="relative bg-[#020408] text-[#e8edf5] overflow-x-hidden noise"
        style={{ opacity: done ? 1 : 0, transition: 'opacity 0.5s ease 0.2s', touchAction: 'pan-y', overscrollBehaviorY: 'auto' as any }}
      >
        <Canvas3D />
        <div
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0, zIndex: -5,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse 130% 90% at 50% 50%, rgba(2,4,8,0.3) 0%, rgba(2,4,8,0.65) 100%)',
          }}
        />
        <div className="scan-line" />
        <Navbar />

        <main className="relative z-10" style={{ touchAction: 'pan-y' }}>
          <section id="home" style={{ touchAction: 'pan-y' }}>    <Hero />     </section>
          <section id="about" style={{ touchAction: 'pan-y' }}>   <About />    </section>
          <section id="projects" style={{ touchAction: 'pan-y' }}><Projects /> </section>
          <section id="skills" style={{ touchAction: 'pan-y' }}>  <Skills />   </section>
          <section id="timeline" style={{ touchAction: 'pan-y' }}><Timeline /> </section>
          <section id="contact" style={{ touchAction: 'pan-y' }}> <Contact />  </section>
        </main>

        <div className="pb-14" style={{ touchAction: 'pan-y' }}><Footer /></div>
      </div>
    </>
  )
}

export default App
