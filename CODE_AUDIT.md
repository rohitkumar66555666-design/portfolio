# Portfolio 3D / WebGL / Framer Motion Code Audit

**Project Path:** `C:\Users\ASUS\portfolio-site`  
**Audit Scope:** `App.tsx`, `Canvas3D.tsx`, `Hero.tsx`, `Projects.tsx`, `Skills.tsx`, `Timeline.tsx`, `Preloader.tsx`, `CustomCursor.tsx`

---

## 1. Active 3D WebGL Elements

### Background scene (`Canvas3D.tsx`)
- Full-viewport `<Canvas>` background.
- One unified background scene tied to page scroll.
- Initial camera pose:
  - `position: [0, 2, 20]`
  - `fov: 60`
- WebGL settings:
  - alpha enabled
  - `powerPreference: high-performance`
  - DPR capped at `[1, 1.5]`
  - `frameloop="always"`

#### Scene contents
- **Custom shader particle layers**
  - `LiquidShaderMaterial` (`THREE.ShaderMaterial`)
  - Two liquid particle layers:
    - cyan, 2500 points, scroll factor 8
    - purple, 1500 points, scroll factor 6
  - Custom vertex attributes:
    - `customPosition`
    - `customVortex`
  - Uniforms:
    - `uTime`
    - `uMouse`
    - `uVelocity`
    - `uScroll`
    - `uColor`
    - `uOpacity`
  - Vertex shader features:
    - multi-octave ripple
    - swirl displacement
    - velocity-driven surge
    - scroll-driven forward drift
  - Fragment shader features:
    - velocity-based blur-ish alpha response
    - vortex-driven intensity

- **Standard Three.js meshes**
  - `IcoWire`
    - `IcosahedronGeometry`
    - wireframe material
  - `TorusKnotWire`
    - `TorusKnotGeometry`
    - wireframe material
  - `CyberGrid`
    - `GridHelper`
  - `LightLeaks`
    - two backside `SphereGeometry` soft leaks

- **Lighting**
  - `AmbientLight`
  - 3 `PointLight`s:
    - cyan
    - purple
    - pink
  - Cursor-follow light motion with lerp smoothing

- **Camera control**
  - Custom `ScrollCamera` component
  - Section waypoints:
    - hero
    - about
    - projects
    - skills
    - timeline
    - contact
  - Camera position and look target interpolated between waypoints based on scroll progress

---

### Hero scene (`Hero.tsx`)
- Separate hero canvas layered under DOM content.
- Scene includes:
  - `ParticleSphere`
    - spherical point cloud
    - `Points` + `PointMaterial`
  - `GridFloor`
    - custom line-based grid group
  - `OrbitRings`
    - 3 wireframe torus rings
- Mouse-driven rotation via `useThree().mouse`
- Lighting:
  - 1 `AmbientLight`
  - 3 `PointLight`s

---

### Skills scene (`Skills.tsx`)
- Internal mini canvas for the tech core.
- `TechCoreScene`:
  - floating wireframe core using `IcosahedronGeometry`
  - inner glow sphere using `SphereGeometry`
  - orbiting nodes using `OctahedronGeometry`
- Behavior:
  - core rotates based on mouse
  - nodes orbit
  - nodes face camera
  - nodes expand on hover
  - hover plays audio feedback

---

## 2. Active Framer Motion & CSS Animations

### Framer Motion interactions
- Section header entrances:
  - fade + y-translate on view
- Hero text/typing sequence:
  - staggered text reveal
  - typing/deletion loop for roles
- Card and button interactions:
  - hover scale
  - tap scale
  - glow/shadow changes
- 3D-style tilt transforms:
  - `useMotionValue` + `useTransform` + `useSpring`
  - used in hero card and project cards
- Hover glare follow:
  - dynamic radial gradient position
- Continuous motion loops:
  - scan line
  - floating badges
  - pulsing status/render indicators
  - shimmer border animation
  - HUD timeline marker pulse

### CSS-driven effects
- Custom cursor hidden with `cursor: none`
- Glassmorphism panels
- Gradient text treatments
- Neon glow utility classes
- Scan-line animation
- Noise overlay via `::before`
- Ambient orbs
- Light leak CSS animation class

---

## 3. Current Gaps / Non-3D Components

### Still primarily 2D / Framer Motion / CSS
- `App.tsx`
  - orchestration layer only
  - no native 3D content itself
- `Navbar.tsx`
  - DOM-based glass UI
  - audio + hover motion only
- `Timeline.tsx`
  - DOM timeline with CSS/Framer motion
  - no Three.js content inside the timeline lane
- `Preloader.tsx`
  - 3D scene exists, but only a rotating wireframe core + rings
  - no laptop unfold
  - no device morph sequence
- `CustomCursor.tsx`
  - DOM cursor layer
  - not WebGL
- `Projects.tsx`
  - DOM holographic cards
  - no real per-project 3D model
- `Skills.tsx`
  - small 3D core present
  - overall UI still DOM-based
- `About.tsx`, `Contact.tsx`, `Footer.tsx`
  - DOM-based
  - no WebGL content

### Structural / WebGL gaps
- Two separate three canvases:
  - hero canvas
  - background canvas
- No shared single-scene orchestration across sections beyond the background canvas
- Background scene relies on global mouse/scroll state instead of React-native scroll bindings
- Skills tech core uses fallback indexing for active category instead of clean `active` binding
- No post-processing
- No real liquid surface plane
- No GPU instancing for particles
- No true 3D device/laptop unfold sequence anywhere

### Performance / potential bottlenecks
- Multiple three canvases can increase load on low-end devices
- Custom point attributes are rebuilt on layer mount; buffer reuse could help
- Global state mutations for mouse/scroll are fine at current scale but may become fragile as scene complexity grows
- Fragment shader motion blur is approximated via alpha, not real accumulation
- Hero particle count is moderate and currently safe

### Layout / conflict notes
- Background canvas is placed at `zIndex: -10`
- DOM content is at `z-10`
- Custom cursor forces `cursor: none` globally, which may affect special embedded elements
- Skills mini canvas uses a fixed-height container; tight on very small screens
- Hero layering mixes CSS overlays and a Three canvas; visually heavy but no obvious conflict found

---

## 4. Recommended Next-Level 3D Upgrades

### High-impact upgrades
1. **Unify scene strategy**
   - Move toward one large background scene with section-aware content rather than multiple independent canvases
2. **Add a liquid surface plane**
   - Introduce a shader plane that ripples with mouse velocity and scroll, alongside the existing particle layers
3. **Add post-processing**
   - Subtle bloom, color grading, or film grain for stronger atmospheric depth
4. **Section-driven 3D motifs**
   - Spawn section-specific objects in the background scene as each section comes into view
5. **Project cards → 3D previews**
   - Add small 3D representations per project, such as floating chips, device frames, or kernel-style forms

### Preloader upgrade path
- Replace the current rotating wireframe core with:
  - an unfold-style 3D device/frame, or
  - a morphing tech core that resolves into the portfolio identity
- Link preloader progress to a camera move or mesh transformation instead of only spinner text

### Performance / quality upgrades
- Use GPU instancing for repeated point/particle effects
- Reduce per-frame allocations inside `useFrame`
- Add device-quality tiers for DPR and particle counts
- Add stronger reduced-motion handling for shader-heavy effects

### UX polish upgrades
- Tighten cursor-follow lighting with liquid motion
- Make mute state more visible across the UI
- Add subtle scroll-linked parallax depth behind section content
- Refine camera waypoint timing so transitions feel more cinematic per section

---

## Quick verdict
The portfolio already has a strong WebGL base:
- custom liquid shaders
- scroll-driven camera
- multiple particle/mesh layers
- interactive 3D tech core
- polished Framer Motion interactions

Main opportunities now are:
- unifying the 3D scene architecture
- raising visual fidelity with surface shaders and post-processing
- turning static preloader/2D sections into more distinct 3D moments
- tightening performance and device scaling
