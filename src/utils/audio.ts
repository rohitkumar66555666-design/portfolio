// ── Audio stub — baseline (no synth) ────────────────────────────────────────
let muted = false

export function playHover(): void {}
export function playClick(): void {}
export function playRipple(_intensity = 1): void {}

export function toggleMute(): boolean {
  muted = !muted
  return muted
}

export function isMuted(): boolean {
  return muted
}

export function resumeAudio(): void {}
