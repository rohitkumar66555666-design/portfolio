import { useState, useEffect } from 'react'

export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint)
    // set immediately in case of orientation change before listener
    onResize()
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [breakpoint])

  return isMobile
}

export function useIsLowEnd(): boolean {
  const [lowEnd, setLowEnd] = useState(false)
  useEffect(() => {
    const nav = navigator as any
    const concurrency = nav.hardwareConcurrency ?? 8
    const memory = nav.deviceMemory ?? 8
    // heuristic: low cores OR maxTouchPoints + small screen = mobile low-end
    const isLow = concurrency <= 4 || memory <= 4
    setLowEnd(isLow)
  }, [])
  return lowEnd
}
