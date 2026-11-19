import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Mail, Phone, ArrowRight, CheckCircle2, Sparkles, ShieldCheck, Activity, Cpu, Terminal, Layers } from 'lucide-react'
import { TiltCard } from './TiltCard'
import { MagneticButton } from './MagneticButton'

const ROLES = [
  'AI Systems Developer',
  'Local RAG & LLM Architect',
  'Mobile App Engineer',
  'Full Stack Systems Developer',
]

const KEY_HIGHLIGHTS = [
  {
    title: 'Hermes 3 Local RAG Agent',
    desc: 'Fully private document QA system running on local Ollama VRAM and ChromaDB with zero cloud egress.',
    tag: 'AI Systems',
  },
  {
    title: 'Mawqif Prayer Navigation App',
    desc: '15+ modular screens built with React Native, Supabase PostgreSQL backend, and real-time GPS tracking.',
    tag: 'Mobile UX',
  },
  {
    title: 'AI Reels Idea Generator SaaS',
    desc: 'Automated script, hook, and hashtag generation platform powered by OpenAI and sub-3s Groq APIs.',
    tag: 'SaaS Tool',
  },
  {
    title: 'Photo Sharing Mobile App',
    desc: 'Real-time social feeds with infinite scroll, user follow system, and Cloudinary media optimization.',
    tag: 'Mobile App',
  },
]

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // Smooth scroll-driven parallax for the portrait and floating elements
  const portraitParallax = useTransform(heroScrollProgress, [0, 1], [0, 48])
  const circleParallax = useTransform(heroScrollProgress, [0, 1], [1, 1.2])
  const badgeParallax1 = useTransform(heroScrollProgress, [0, 1], [0, -32])
  const badgeParallax2 = useTransform(heroScrollProgress, [0, 1], [0, 36])

  const [roleIdx, setRoleIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Interactive Workbench Tabs: 'overview' | 'architecture' | 'highlights'
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'highlights'>('overview')

  // Live Terminal Typewriter
  useEffect(() => {
    const full = ROLES[roleIdx]
    let t: ReturnType<typeof setTimeout>
    if (!deleting && displayed.length < full.length) {
      t = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 55)
    } else if (!deleting && displayed.length === full.length) {
      t = setTimeout(() => setDeleting(true), 2400)
    } else if (deleting && displayed.length > 0) {
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 25)
    } else {
      setDeleting(false)
      setRoleIdx((i) => (i + 1) % ROLES.length)
    }
    return () => clearTimeout(t)
  }, [displayed, deleting, roleIdx])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" ref={heroRef} className="relative min-h-[85dvh] flex items-center pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column (Columns 1-7): Identity, Narrative & Interactive Workbench */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-6"
        >
          {/* Engineering Status Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip-green inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)] animate-pulse" />
              <span>Available for remote engineering</span>
            </span>
            <span className="chip-neutral">
              Maharashtra, India
            </span>
            <span className="chip-cobalt">
              AI Systems & Mobile Apps
            </span>
          </div>

          {/* Headline: Prominent Name & Kinetic Terminal Ticker */}
          <div className="space-y-3">
            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-[var(--color-ink)]">
              <span>Rohit </span>
              <span className="text-[var(--color-accent)]">Kumar</span>
            </h1>

            {/* Fast-typing Terminal Subtitle */}
            <div className="flex items-center gap-3 pt-1">
              <div className="bg-[var(--color-paper-2)] border border-[var(--color-rule)] px-3.5 py-1.5 rounded-[var(--radius-pill)] inline-flex items-center gap-2 font-outlier text-sm sm:text-base text-[var(--color-ink)] font-semibold">
                <span className="text-xs text-[var(--color-green)] font-bold">&gt;</span>
                <span className="text-[var(--color-ink)]">{displayed}</span>
                <span className="motion-safe:animate-pulse text-[var(--color-accent)] font-bold">_</span>
              </div>
            </div>
          </div>

          {/* Lede Narrative (crisp, professional, sloplint compliant) */}
          <p className="text-[var(--color-muted)] text-base sm:text-lg max-w-xl leading-relaxed font-sans">
            Building private zero-cloud RAG pipelines and responsive production mobile apps.
          </p>

          {/* Magnetic CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <MagneticButton
              onClick={() => scrollTo('projects')}
              className="btn-cobalt-primary focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
            >
              <span>View Selected Projects</span>
              <ArrowRight aria-hidden="true" size={15} />
            </MagneticButton>
            <MagneticButton
              onClick={() => scrollTo('contact')}
              className="btn-cobalt-secondary focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
            >
              <span>Get in Touch</span>
            </MagneticButton>
          </div>

          {/* Quick Communication Endpoints */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-[var(--color-rule)]">
            <a
              href="mailto:rohitkumar66555666@gmail.com"
              className="chip-neutral hover:border-[var(--color-accent)] hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] transition-colors"
            >
              <Mail aria-hidden="true" size={12} className="text-[var(--color-accent)]" />
              <span>rohitkumar66555666@gmail.com</span>
            </a>
            <a
              href="tel:+916299798907"
              className="chip-neutral hover:border-[var(--color-accent)] hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] transition-colors"
            >
              <Phone aria-hidden="true" size={12} className="text-[var(--color-accent)]" />
              <span>+91 6299798907</span>
            </a>
          </div>

          {/* Interactive Workbench */}
          <div className="pt-2">
            <TiltCard
              tiltMaxAngle={4}
              className="bento-card p-5 space-y-4 bg-[var(--color-paper-2)] border border-[var(--color-rule)]"
            >
              {/* Top Interactive Tabs Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-rule)]">
                <div className="flex items-center gap-1.5 p-1 bg-[var(--color-paper-3)] border border-[var(--color-rule)] rounded-[var(--radius-pill)]">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-1 rounded-[var(--radius-pill)] text-xs font-display font-medium transition-colors ${activeTab === 'overview'
                      ? 'bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                      }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('architecture')}
                    className={`px-3 py-1 rounded-[var(--radius-pill)] text-xs font-display font-medium transition-colors ${activeTab === 'architecture'
                      ? 'bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                      }`}
                  >
                    Architecture
                  </button>
                  <button
                    onClick={() => setActiveTab('highlights')}
                    className={`px-3 py-1 rounded-[var(--radius-pill)] text-xs font-display font-medium transition-colors ${activeTab === 'highlights'
                      ? 'bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                      }`}
                  >
                    Highlights
                  </button>
                </div>

                <span className="chip-green text-[11px] py-0.5 px-2">
                  active
                </span>
              </div>

              {/* Tab 1: System Runtime Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="space-y-2 font-measured text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-[var(--color-rule)]/60">
                      <span className="text-[var(--color-muted)] font-sans">Developer</span>
                      <span className="text-[var(--color-ink)] font-semibold">Rohit Kumar</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-[var(--color-rule)]/60">
                      <span className="text-[var(--color-muted)] font-sans">Current Role</span>
                      <span className="text-[var(--color-accent)] font-medium">AI Developer Intern</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-[var(--color-rule)]/60">
                      <span className="text-[var(--color-muted)] font-sans">Engineering Studio</span>
                      <span className="text-[var(--color-ink)]">Appopoleis Studios, Mumbai</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-[var(--color-rule)]/60">
                      <span className="text-[var(--color-muted)] font-sans">Academic Track</span>
                      <span className="text-[var(--color-ink)]">B.Sc. Software Development (TISS)</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-[var(--color-rule)]/60">
                      <span className="text-[var(--color-muted)] font-sans">Core Specialization</span>
                      <span className="text-[var(--color-accent)]">Local RAG · React Native Mobile</span>
                    </div>
                  </div>

                  {/* Grounded Production Benchmarks */}
                  <div className="bento-inset p-3 space-y-2 bg-[var(--color-paper-3)] border border-[var(--color-rule)]">
                    <div className="flex items-center justify-between text-xs text-[var(--color-muted)] font-measured">
                      <span className="font-sans font-medium text-[var(--color-ink)]">Production Track Record</span>
                      <span className="text-[var(--color-accent)] font-semibold">Active Developer</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-measured">
                      <div className="p-2.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)]">
                        <div className="text-[var(--color-muted)] font-sans text-[11px]">Production apps</div>
                        <div className="text-base text-[var(--color-accent)] font-semibold mt-0.5">4+ Shipped</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-rule)]">
                        <div className="text-[var(--color-muted)] font-sans text-[11px]">Modular screens</div>
                        <div className="text-base text-[var(--color-accent)] font-semibold mt-0.5">15+ Built</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Core Stack Architecture Flow */}
              {activeTab === 'architecture' && (
                <div className="space-y-3 text-xs">
                  <div className="text-xs text-[var(--color-muted)] font-sans">
                    Zero-cloud local inference pipeline architecture:
                  </div>

                  <div className="space-y-2 font-measured">
                    {[
                      { step: '01', title: 'Intake & Chunking', desc: 'Drag-and-drop document ingestion with token boundaries', tech: 'LangChain' },
                      { step: '02', title: 'Dense Embeddings', desc: 'BAAI/bge-small local vector generation in 384 dimensions', tech: 'PyTorch' },
                      { step: '03', title: 'Vector Retrieval', desc: 'ChromaDB persistent similarity lookup (< 2ms cosine)', tech: 'ChromaDB' },
                      { step: '04', title: 'Local Inference', desc: 'Hermes 3 8B zero-cloud VRAM execution via Ollama', tech: 'Ollama' },
                    ].map((pipe) => (
                      <div
                        key={pipe.step}
                        className="p-2 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-[var(--color-paper-2)] border border-[var(--color-rule)] flex items-center justify-center text-[10px] text-[var(--color-accent)] font-bold">
                            {pipe.step}
                          </span>
                          <div>
                            <div className="font-sans font-semibold text-[var(--color-ink)]">{pipe.title}</div>
                            <div className="text-[11px] text-[var(--color-muted)]">{pipe.desc}</div>
                          </div>
                        </div>
                        <span className="micro-tag text-[10px] whitespace-nowrap">{pipe.tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Key Production Highlights */}
              {activeTab === 'highlights' && (
                <div className="space-y-2.5 font-sans">
                  {KEY_HIGHLIGHTS.map((h) => (
                    <div
                      key={h.title}
                      className="p-2.5 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-[var(--color-ink)] flex items-center gap-2">
                          <span>{h.title}</span>
                          <span className="text-[10px] font-mono text-[var(--color-accent)] bg-[var(--color-accent-wash)] px-1.5 py-0.5 rounded">
                            {h.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--color-muted)] pt-0.5 leading-relaxed">
                          {h.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom active status */}
              <div className="flex items-center justify-between pt-1 text-xs text-[var(--color-muted)] font-measured border-t border-[var(--color-rule)]/70">
                <div className="flex items-center gap-1.5 text-[var(--color-ink)]">
                  <CheckCircle2 aria-hidden="true" size={13} className="text-[var(--color-green)]" />
                  <span>Available for software engineering & AI contracts</span>
                </div>
                <span className="text-[var(--color-accent)] font-semibold">2026</span>
              </div>
            </TiltCard>
          </div>
        </motion.div>

        {/* Right Column (Columns 8-12): Bespoke Executive Portrait Bento Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 sticky top-28"
        >
          <TiltCard
            tiltMaxAngle={6}
            className="bento-card relative overflow-hidden p-6 bg-[var(--color-paper-2)] border border-[var(--color-rule)] flex flex-col justify-between min-h-[500px]"
          >
            {/* Corner Target Hairline Crosshairs */}
            <span className="absolute top-2.5 left-2.5 text-[var(--color-rule-2)] font-mono text-[10px] select-none pointer-events-none">+</span>
            <span className="absolute top-2.5 right-2.5 text-[var(--color-rule-2)] font-mono text-[10px] select-none pointer-events-none">+</span>
            <span className="absolute bottom-2.5 left-2.5 text-[var(--color-rule-2)] font-mono text-[10px] select-none pointer-events-none">+</span>
            <span className="absolute bottom-2.5 right-2.5 text-[var(--color-rule-2)] font-mono text-[10px] select-none pointer-events-none">+</span>

            {/* Top Architecture Header */}
            <div className="flex items-center justify-between z-20 pb-3 border-b border-[var(--color-rule)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-green)] animate-pulse" />
                <span className="font-outlier text-[11px] text-[var(--color-ink)] font-semibold">
                  Local AI & Mobile Architecture
                </span>
              </div>
              <span className="chip-cobalt text-[10px] py-0.5 px-2 font-mono flex items-center gap-1">
                <Layers size={11} className="text-[var(--color-accent)]" />
                <span>Core Stack</span>
              </span>
            </div>

            {/* Center Stage: Interactive Systems Architecture Core */}
            <div className="relative my-auto flex items-center justify-center py-6 overflow-hidden min-h-[340px]">
              {/* Concentric Ambient Studio Glow */}
              <div
                aria-hidden="true"
                className="absolute w-72 h-72 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(245, 166, 35, 0.12) 0%, rgba(204, 255, 0, 0.02) 50%, transparent 70%)',
                }}
              />

              {/* Concentric subtle hairline circles with scroll expansion */}
              <motion.div
                style={{ scale: circleParallax }}
                aria-hidden="true"
                className="absolute w-64 h-64 rounded-full border border-[var(--color-rule)]/50 pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute w-80 h-80 rounded-full border border-[var(--color-rule)]/25 pointer-events-none"
              />

              {/* Central Microprocessor Core & Bus Schematic */}
              <motion.div
                style={{ y: portraitParallax }}
                className="relative z-10 w-full max-w-[320px] aspect-square flex items-center justify-center select-none"
              >
                {/* SVG Circuit Matrix & Satellite Buses */}
                <svg
                  aria-hidden="true"
                  className="w-full h-full"
                  viewBox="0 0 320 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Concentric Coordinate Rings */}
                  <circle cx="160" cy="160" r="140" stroke="var(--color-rule)" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />
                  <circle cx="160" cy="160" r="105" stroke="var(--color-rule)" strokeWidth="1" opacity="0.7" />
                  <circle cx="160" cy="160" r="74" stroke="var(--color-accent)" strokeWidth="1" opacity="0.25" />

                  {/* Orthogonal Circuit Bus Traces */}
                  <line x1="160" y1="36" x2="160" y2="105" stroke="var(--color-rule-2)" strokeWidth="1.5" />
                  <line x1="160" y1="215" x2="160" y2="284" stroke="var(--color-rule-2)" strokeWidth="1.5" />
                  <line x1="36" y1="160" x2="105" y2="160" stroke="var(--color-rule-2)" strokeWidth="1.5" />
                  <line x1="215" y1="160" x2="284" y2="160" stroke="var(--color-rule-2)" strokeWidth="1.5" />

                  {/* Diagonal Hairline Grid */}
                  <line x1="85" y1="85" x2="115" y2="115" stroke="var(--color-rule)" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
                  <line x1="235" y1="85" x2="205" y2="115" stroke="var(--color-rule)" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
                  <line x1="85" y1="235" x2="115" y2="205" stroke="var(--color-rule)" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
                  <line x1="235" y1="235" x2="205" y2="205" stroke="var(--color-rule)" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />

                  {/* Animated Traveling Packet 1: Vertical down into Core */}
                  <motion.circle
                    cx="160"
                    r="3.5"
                    fill="var(--color-accent)"
                    animate={{ cy: [36, 105] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                  />
                  {/* Animated Traveling Packet 2: Horizontal from Left into Core */}
                  <motion.circle
                    cy="160"
                    r="3.5"
                    fill="var(--color-green)"
                    animate={{ cx: [36, 105] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 0.8 }}
                  />
                  {/* Animated Traveling Packet 3: From Core out to Right */}
                  <motion.circle
                    cy="160"
                    r="3.5"
                    fill="var(--color-accent)"
                    animate={{ cx: [215, 284] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', delay: 0.4 }}
                  />
                  {/* Animated Traveling Packet 4: From Core down to Mobile UX */}
                  <motion.circle
                    cx="160"
                    r="3.5"
                    fill="var(--color-green)"
                    animate={{ cy: [215, 284] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'linear', delay: 1.2 }}
                  />

                  {/* Satellite 1: Top (LangChain) */}
                  <rect x="105" y="14" width="110" height="24" rx="4" fill="var(--color-paper-3)" stroke="var(--color-rule)" strokeWidth="1" />
                  <text x="160" y="30" textAnchor="middle" fill="var(--color-ink)" fontSize="9" fontFamily="sans-serif" fontWeight="600">
                    LangChain · RAG
                  </text>

                  {/* Satellite 2: Right (ChromaDB) */}
                  <rect x="220" y="148" width="95" height="24" rx="4" fill="var(--color-paper-3)" stroke="var(--color-rule)" strokeWidth="1" />
                  <text x="267" y="164" textAnchor="middle" fill="var(--color-ink)" fontSize="9" fontFamily="sans-serif" fontWeight="600">
                    ChromaDB
                  </text>

                  {/* Satellite 3: Bottom (React Native) */}
                  <rect x="100" y="282" width="120" height="24" rx="4" fill="var(--color-paper-3)" stroke="var(--color-rule)" strokeWidth="1" />
                  <text x="160" y="298" textAnchor="middle" fill="var(--color-ink)" fontSize="9" fontFamily="sans-serif" fontWeight="600">
                    React Native · Mobile
                  </text>

                  {/* Satellite 4: Left (Ollama) */}
                  <rect x="5" y="148" width="95" height="24" rx="4" fill="var(--color-paper-3)" stroke="var(--color-rule)" strokeWidth="1" />
                  <text x="52" y="164" textAnchor="middle" fill="var(--color-ink)" fontSize="9" fontFamily="sans-serif" fontWeight="600">
                    Ollama Runtime
                  </text>
                </svg>

                {/* Central High-Performance Microprocessor Core */}
                <div className="absolute inset-0 m-auto w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-[var(--color-paper-2)] border border-[var(--color-accent)] p-3 flex flex-col items-center justify-center text-center shadow-lg">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)] animate-pulse" />
                    <span className="text-[10px] font-mono text-[var(--color-green)] font-semibold">
                      VRAM active
                    </span>
                  </div>
                  <Cpu size={22} className="text-[var(--color-accent)] mb-1" />
                  <div className="font-outlier font-bold text-xs text-[var(--color-ink)] tracking-tight">
                    Hermes 3 (8B)
                  </div>
                  <div className="text-[9px] font-measured text-[var(--color-muted)] mt-0.5">
                    Local Inference Engine
                  </div>
                </div>
              </motion.div>

              {/* Floating Grounded Badges */}
              <motion.div
                style={{ y: badgeParallax1 }}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                whileHover={{ scale: 1.08 }}
                className="absolute top-4 left-1 z-20 bg-[var(--color-paper-3)]/95 backdrop-blur-md border border-[var(--color-rule)] px-3 py-1.5 rounded-[var(--radius-pill)] flex items-center gap-1.5 cursor-default transition-colors hover:border-[var(--color-rule-2)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)]" />
                <span className="text-[11px] font-outlier text-[var(--color-ink)] font-semibold">Zero Cloud Egress</span>
              </motion.div>

              <motion.div
                style={{ y: badgeParallax2 }}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                whileHover={{ scale: 1.08 }}
                className="absolute bottom-6 right-1 z-20 bg-[var(--color-paper-3)]/95 backdrop-blur-md border border-[var(--color-rule)] px-3 py-1.5 rounded-[var(--radius-pill)] flex items-center gap-1.5 cursor-default transition-colors hover:border-[var(--color-rule-2)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)]" />
                <span className="text-[11px] font-outlier text-[var(--color-ink)] font-semibold">Cross-Platform UX</span>
              </motion.div>
            </div>

            {/* Bottom Card Footer */}
            <div className="z-20 pt-3 border-t border-[var(--color-rule)] flex items-center justify-between text-xs font-measured">
              <div>
                <div className="font-sans font-semibold text-[var(--color-ink)] flex items-center gap-1.5">
                  <span>Rohit Kumar</span>
                  <CheckCircle2 size={13} className="text-[var(--color-accent)]" />
                </div>
                <div className="text-[11px] text-[var(--color-muted)] font-sans">
                  AI Developer & Mobile Systems Architect
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-[var(--color-green)] font-mono font-medium">
                  Appopoleis Studios
                </div>
                <div className="text-[10px] text-[var(--color-muted)] font-mono">
                  TISS · Mumbai, India
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  )
}
