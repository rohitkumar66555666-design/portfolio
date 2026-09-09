import React, { useEffect, useRef } from 'react'
import { Stage as DreiStage } from '@react-three/drei'

type StageProps = {
  children: React.ReactNode
  cameraPosition: [number, number, number]
  fov?: number
  near?: number
  far?: number
  dpr?: [number, number]
  glPowerPreference?: 'high-performance' | 'default'
}

export const Stage: React.FC<StageProps> = ({
  children,
  cameraPosition,
  fov = 60,
  near = 0.1,
  far = 150,
  dpr = [1, 1.5],
  glPowerPreference = 'high-performance',
}) => {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return
    rootRef.current.classList.add('r3f-stage')
  }, [])

  return (
    <div ref={rootRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <DreiStage
        adjustCamera={false}
        shadows={false}
      >
        {children}
      </DreiStage>
    </div>
  )
}
