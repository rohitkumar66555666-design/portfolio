import React from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { AmbientBackground } from './components/AmbientBackground'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { Timeline } from './components/Timeline'
import { Contact } from './components/Contact'
import { AIAgent } from './components/AIAgent'

export const App: React.FC = () => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div className="min-h-screen text-[var(--color-ink)] font-body relative selection:bg-[var(--color-accent)] selection:text-[var(--color-accent-ink)]">
      {/* Precision Scroll Telemetry Bar */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[var(--color-accent)] origin-left z-[9999] pointer-events-none"
        style={{ scaleX }}
      />

      {/* Bespoke Dot-Matrix Grid & Telemetry HUD */}
      <AmbientBackground />

      {/* Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Timeline />
        <Contact />
      </main>

      {/* Floating AI Career Assistant */}
      <AIAgent />
    </div>
  )
}

export default App
