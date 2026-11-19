import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export const AmbientBackground: React.FC = () => {
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  // Mouse tracking for subtle ambient spotlight
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)

  const springConfig = { damping: 30, stiffness: 200, mass: 0.8 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(motionQuery.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    motionQuery.addEventListener('change', handleMotionChange)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      motionQuery.removeEventListener('change', handleMotionChange)
    }
  }, [mouseX, mouseY])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden bg-[var(--color-paper)] pointer-events-none select-none"
    >
      {/* 1. Strict Dot-Matrix Grid Overlay (as per DESIGN.md guardrails) */}
      <div className="absolute inset-0 bg-dot-matrix opacity-40 pointer-events-none" />

      {/* 2. Soft Edge Vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, transparent 35%, var(--color-paper) 95%)',
        }}
      />

      {/* 3. Mouse-Tracking Radial Spotlight (Subtle, luxurious studio ambient glow) */}
      {!isReducedMotion && (
        <motion.div
          className="absolute -top-[250px] -left-[250px] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            x: smoothX,
            y: smoothY,
            background: 'radial-gradient(circle, rgba(245, 166, 35, 0.045) 0%, transparent 65%)',
          }}
        />
      )}
    </div>
  )
}
