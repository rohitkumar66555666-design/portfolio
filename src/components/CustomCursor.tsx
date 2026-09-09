import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export const CustomCursor: React.FC = () => {
  const mx = useMotionValue(-200)
  const my = useMotionValue(-200)

  // Ring: spring-lagged for trailing feel
  const rx = useSpring(mx, { stiffness: 160, damping: 20, mass: 0.5 })
  const ry = useSpring(my, { stiffness: 160, damping: 20, mass: 0.5 })

  // Dot: tighter spring — nearly instant
  const dx = useSpring(mx, { stiffness: 900, damping: 35 })
  const dy = useSpring(my, { stiffness: 900, damping: 35 })

  const [hover,   setHover]   = useState(false)
  const [click,   setClick]   = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Force cursor:none everywhere
    const style = document.createElement('style')
    style.id = '__ccursor'
    style.textContent = `html,body,*.r3f-no-cursor,canvas.r3f-no-cursor{cursor:none!important}`
    document.head.appendChild(style)

    const onMove = (e: MouseEvent) => {
      if (!visible) setVisible(true)
      mx.set(e.clientX)
      my.set(e.clientY)

      const el = e.target as HTMLElement
      const isHover =
        ['BUTTON','A','INPUT','TEXTAREA','SELECT','LABEL'].includes(el.tagName) ||
        !!el.closest('button') ||
        !!el.closest('a') ||
        !!el.closest('[role="button"]')
      setHover(isHover)
    }

    const onDown  = () => setClick(true)
    const onUp    = () => setClick(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    document.addEventListener('mousemove',  onMove,  { passive: true })
    document.addEventListener('mousedown',  onDown)
    document.addEventListener('mouseup',    onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mousedown',  onDown)
      document.removeEventListener('mouseup',    onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.getElementById('__ccursor')?.remove()
    }
  }, [mx, my, visible])

  const ringSize  = click ? 18 : hover ? 54 : 34
  const ringColor = hover ? 'rgba(168,85,247,0.9)' : 'rgba(6,182,212,0.85)'
  const ringGlow  = hover
    ? '0 0 22px rgba(168,85,247,0.55), 0 0 44px rgba(168,85,247,0.2)'
    : '0 0 16px rgba(6,182,212,0.5),  0 0 32px rgba(6,182,212,0.2)'
  const dotColor  = hover ? '#a855f7' : '#06b6d4'
  const dotGlow   = hover ? '0 0 12px #a855f7' : '0 0 12px #06b6d4'
  const dotScale  = click ? 0.4 : hover ? 0 : 1   // dot disappears on hover to show ring clearly

  return (
    <>
      {/* Outer ring — spring lagged */}
      <motion.div
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          x:             rx,
          y:             ry,
          translateX:    '-50%',
          translateY:    '-50%',
          pointerEvents: 'none',
          zIndex:        999998,
          borderRadius:  '50%',
          background:    'rgba(6,182,212,0.04)',
          willChange:    'transform',
        }}
        animate={{
          width:       ringSize,
          height:      ringSize,
          border:      `2px solid ${ringColor}`,
          boxShadow:   ringGlow,
          opacity:     visible ? 1 : 0,
          scale:       click ? 0.85 : 1,
        }}
        transition={{
          width:     { duration: 0.2, ease: 'easeOut' },
          height:    { duration: 0.2, ease: 'easeOut' },
          border:    { duration: 0.2 },
          boxShadow: { duration: 0.2 },
          opacity:   { duration: 0.15 },
          scale:     { type: 'spring', stiffness: 400, damping: 20 },
        }}
      />

      {/* Inner dot — tight spring */}
      <motion.div
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          x:             dx,
          y:             dy,
          translateX:    '-50%',
          translateY:    '-50%',
          width:         8,
          height:        8,
          borderRadius:  '50%',
          pointerEvents: 'none',
          zIndex:        999999,
          willChange:    'transform',
        }}
        animate={{
          background: dotColor,
          boxShadow:  dotGlow,
          scale:      dotScale,
          opacity:    visible ? 1 : 0,
        }}
        transition={{
          background: { duration: 0.15 },
          boxShadow:  { duration: 0.15 },
          scale:      { type: 'spring', stiffness: 500, damping: 25 },
          opacity:    { duration: 0.15 },
        }}
      />
    </>
  )
}
