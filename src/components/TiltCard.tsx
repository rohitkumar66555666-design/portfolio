import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  tiltMaxAngle?: number
  enableGlow?: boolean
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  tiltMaxAngle = 7,
  enableGlow = true,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [canHover, setCanHover] = useState(true)

  // Motion values for smooth 60fps springs
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for buttery 3D tilt
  const springConfig = { damping: 22, stiffness: 280, mass: 0.6 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  const rotateX = useTransform(springY, [-0.5, 0.5], [tiltMaxAngle, -tiltMaxAngle])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-tiltMaxAngle, tiltMaxAngle])

  // Pixel coordinates for radial cursor spotlight
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(hover: none)')
      setCanHover(!media.matches)
      const listener = (e: MediaQueryListEvent) => setCanHover(!e.matches)
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Normalized values between -0.5 and 0.5
    mouseX.set(x / rect.width - 0.5)
    mouseY.set(y / rect.height - 0.5)

    if (enableGlow) {
      setGlowPos({ x, y })
    }
  }

  const handleMouseEnter = () => {
    if (canHover) setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
        rotateX: canHover ? rotateX : 0,
        rotateY: canHover ? rotateY : 0,
      }}
      className={`relative overflow-hidden backdrop-blur-md transition-[border-color,box-shadow] duration-200 ${className}`}
      {...(props as any)}
    >
      {/* Subtle border glow spotlight following cursor */}
      {enableGlow && canHover && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(350px circle at ${glowPos.x}px ${glowPos.y}px, rgba(245, 166, 35, 0.08), transparent 80%)`,
          }}
        />
      )}

      {/* Subtle card highlight ring on hover */}
      {enableGlow && canHover && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300 border border-[var(--color-rule-2)]/40"
          style={{
            opacity: isHovered ? 1 : 0,
          }}
        />
      )}

      {children}
    </motion.div>
  )
}

