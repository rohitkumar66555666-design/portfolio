import React, { useState, useEffect, useRef } from 'react'

const CHARS = '0123456789ABCDEF!@#$%&*<>[]{}~='

interface ScrambleTextProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div'
  duration?: number
  triggerOnScroll?: boolean
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  className = '',
  as: Component = 'span',
  duration = 600,
  triggerOnScroll = true,
}) => {
  const [displayText, setDisplayText] = useState(text)
  const [hasScrambled, setHasScrambled] = useState(false)
  const elementRef = useRef<HTMLElement | null>(null)

  const scramble = () => {
    let iteration = 0
    const totalFrames = 18
    const intervalTime = duration / totalFrames

    const interval = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' '
            if (index < iteration) {
              return text[index]
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )

      iteration += text.length / totalFrames

      if (iteration >= text.length) {
        clearInterval(interval)
        setDisplayText(text)
      }
    }, intervalTime)
  }

  useEffect(() => {
    if (!triggerOnScroll) {
      scramble()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasScrambled) {
            setHasScrambled(true)
            scramble()
          }
        })
      },
      { threshold: 0.25 }
    )

    const el = elementRef.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [text, triggerOnScroll, hasScrambled])

  return (
    <Component
      ref={elementRef as any}
      className={className}
    >
      {displayText}
    </Component>
  )
}

