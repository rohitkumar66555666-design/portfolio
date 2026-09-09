import React, { useEffect, useRef } from 'react'

export const CursorTracker: React.FC = () => {
  const ringRef  = useRef<HTMLDivElement>(null)
  const dotRef   = useRef<HTMLDivElement>(null)
  const pos      = useRef({ x: -200, y: -200 })
  const target   = useRef({ x: -200, y: -200 })
  const isHover  = useRef(false)
  const isClick  = useRef(false)
  const raf      = useRef(0)
  const visible  = useRef(false)

  useEffect(() => {
    // Force cursor:none on the entire document — overrides everything
    const style = document.createElement('style')
    style.id = 'cursor-none-global'
    style.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `
    document.head.appendChild(style)

    const show = () => {
      if (!visible.current) {
        visible.current = true
        if (ringRef.current) ringRef.current.style.opacity = '1'
        if (dotRef.current)  dotRef.current.style.opacity  = '1'
      }
    }

    const getSize = () => isHover.current ? 44 : isClick.current ? 18 : 30

    const updateStyles = () => {
      if (!ringRef.current || !dotRef.current) return
      const size = getSize()
      ringRef.current.style.width       = `${size}px`
      ringRef.current.style.height      = `${size}px`
      ringRef.current.style.borderColor = isHover.current
        ? 'rgba(168,85,247,0.9)' : 'rgba(6,182,212,0.85)'
      ringRef.current.style.boxShadow   = isHover.current
        ? '0 0 18px rgba(168,85,247,0.6)' : '0 0 14px rgba(6,182,212,0.55)'
      dotRef.current.style.background  = isHover.current ? '#a855f7' : '#06b6d4'
      dotRef.current.style.boxShadow   = isHover.current
        ? '0 0 12px #a855f7' : '0 0 12px #06b6d4'
      dotRef.current.style.transform   = `translate(${target.current.x - 3.5}px, ${target.current.y - 3.5}px)`
    }

    // Use document-level listener — works across ALL sections & iframes
    const onMove = (e: MouseEvent) => {
      show()
      target.current.x = e.clientX
      target.current.y = e.clientY

      // instant dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 3.5}px, ${e.clientY - 3.5}px)`
      }

      // hover detection
      const el = e.target as HTMLElement
      const hover = el.tagName === 'BUTTON' || el.tagName === 'A'
        || !!el.closest('button') || !!el.closest('a')
        || el.getAttribute('role') === 'button'
        || !!el.closest('[role="button"]')
      if (hover !== isHover.current) {
        isHover.current = hover
        updateStyles()
      }
    }

    const onDown = () => { isClick.current = true;  updateStyles() }
    const onUp   = () => { isClick.current = false; updateStyles() }

    // Hide cursor when it leaves the window
    const onLeave = () => {
      if (ringRef.current) ringRef.current.style.opacity = '0'
      if (dotRef.current)  dotRef.current.style.opacity  = '0'
      visible.current = false
    }
    const onEnter = () => {
      if (ringRef.current) ringRef.current.style.opacity = '1'
      if (dotRef.current)  dotRef.current.style.opacity  = '1'
      visible.current = true
    }

    // RAF lerp — pure DOM, zero React re-renders
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const loop = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.14)
      pos.current.y = lerp(pos.current.y, target.current.y, 0.14)
      if (ringRef.current) {
        const s = getSize()
        ringRef.current.style.transform =
          `translate(${pos.current.x - s / 2}px, ${pos.current.y - s / 2}px)`
      }
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)

    // Attach to document, not window — captures events inside canvases & all elements
    document.addEventListener('mousemove',   onMove,  { passive: true })
    document.addEventListener('mousedown',   onDown)
    document.addEventListener('mouseup',     onUp)
    document.addEventListener('mouseleave',  onLeave)
    document.addEventListener('mouseenter',  onEnter)

    return () => {
      cancelAnimationFrame(raf.current)
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mousedown',  onDown)
      document.removeEventListener('mouseup',    onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.getElementById('cursor-none-global')?.remove()
    }
  }, [])

  return (
    <>
      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 30,
          height: 30,
          borderRadius: '50%',
          border: '2px solid rgba(6,182,212,0.85)',
          boxShadow: '0 0 14px rgba(6,182,212,0.55)',
          pointerEvents: 'none',
          zIndex: 999999,
          opacity: 0,
          willChange: 'transform',
          transition: 'width 0.18s ease, height 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, opacity 0.2s ease',
        }}
      />

      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: '#06b6d4',
          boxShadow: '0 0 12px #06b6d4',
          pointerEvents: 'none',
          zIndex: 1000000,
          opacity: 0,
          willChange: 'transform',
          transition: 'background 0.18s ease, box-shadow 0.18s ease, opacity 0.2s ease',
        }}
      />
    </>
  )
}
