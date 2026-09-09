import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

const WAYPOINTS_D: [number, number, number, number][] = [
  [0,  2,  20,  0 ],
  [3,  0,  18,  0 ],
  [-2, -2, 16, -1],
  [2,  3,  14,  1 ],
  [-3,  0, 17,  0 ],
  [0,  -1, 19, -1],
]
// Mobile: pull back, reduce lateral X so nothing clips on 390px portrait
const WAYPOINTS_M: [number, number, number, number][] = [
  [0,  1.2, 23,  0 ],
  [1.2, 0.2, 21,  0 ],
  [-1, -1.4, 19, -0.6],
  [1,  1.6, 18,  0.6],
  [-1.2, 0.1, 20,  0 ],
  [0, -0.6, 22, -0.6],
]

function getWaypoints(width: number) {
  return width < 768 ? WAYPOINTS_M : WAYPOINTS_D
}

// ── ScrollRig — Drei ScrollControls camera driver ─────────────────────────
export function ScrollRig() {
  const scroll = useScroll()
  const { camera, size } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 2, 20))
  const targetLookY = useRef(0)

  useFrame(() => {
    const WAYPOINTS = getWaypoints(size.width)
    const pct = scroll.offset
    const segCount = WAYPOINTS.length - 1
    const seg = Math.min(pct * segCount, segCount - 0.001)
    const idx = Math.floor(seg)
    const t = seg - idx
    const a = WAYPOINTS[idx]
    const b = WAYPOINTS[Math.min(idx + 1, segCount)]
    targetPos.current.set(
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    )
    targetLookY.current = a[3] + (b[3] - a[3]) * t
    camera.position.lerp(targetPos.current, 0.06)
    camera.lookAt(camera.position.x * 0.1, targetLookY.current, 0)
  })
  return null
}

// ── Fallback: window-scroll rig (fixed-Canvas + DOM sections) ─────────────
export function WindowScrollRig() {
  const { camera, size } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 2, 20))
  const targetLookY = useRef(0)
  useFrame(() => {
    const WAYPOINTS = getWaypoints(size.width)
    const max = document.body.scrollHeight - window.innerHeight
    const pct = max > 0 ? window.scrollY / max : 0
    const segCount = WAYPOINTS.length - 1
    const seg = Math.min(pct * segCount, segCount - 0.001)
    const idx = Math.floor(seg)
    const t = seg - idx
    const a = WAYPOINTS[idx]
    const b = WAYPOINTS[Math.min(idx + 1, segCount)]
    targetPos.current.set(
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    )
    targetLookY.current = a[3] + (b[3] - a[3]) * t
    camera.position.lerp(targetPos.current, 0.05)
    camera.lookAt(camera.position.x * 0.1, targetLookY.current, 0)
  })
  return null
}
