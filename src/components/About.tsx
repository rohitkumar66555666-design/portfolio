import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, MapPin, Terminal, Code2, Cpu, CheckCircle2 } from 'lucide-react'
import { TiltCard } from './TiltCard'

const HIGHLIGHTS = [
  { value: '4+', label: 'apps shipped', detail: 'Production client deployments' },
  { value: '15+', label: 'modular screens', detail: 'React Native & mobile UX' },
  { value: 'Zero-cloud', label: 'local RAG', detail: 'Private Ollama & ChromaDB' },
  { value: 'LLM systems', label: 'generators built', detail: 'OpenAI, Groq & Claude APIs' },
]

const STACK = [
  'LangChain',
  'React Native',
  'Node.js',
  'OpenAI API',
  'ChromaDB',
  'Supabase',
  'Python',
  'TypeScript',
  'Ollama',
  'Groq API',
]

const SPEC_JSON = `{
  "engineer": "Rohit Kumar",
  "focus": ["AI Systems", "Local RAG", "Mobile Architecture"],
  "inference": {
    "engine": "Ollama / Hermes-3-8B",
    "vector_store": "ChromaDB (Cosine)",
    "egress": "0 bytes (local air-gap)"
  },
  "mobile": {
    "framework": "React Native / Expo",
    "state": "TypeScript / Modular Stores",
    "backend": "Supabase / PostgreSQL"
  },
  "status": "ready_for_contracts"
}`

export const About: React.FC = () => {
  const [viewMode, setViewMode] = useState<'profile' | 'spec'>('profile')

  return (
    <section id="about" className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[var(--color-rule)] overflow-hidden">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mb-12 space-y-2 relative z-10"
      >
        <h2 className="font-display font-semibold text-3xl sm:text-4xl text-[var(--color-ink)] tracking-tight">
          Building production software at the intersection of AI and mobile.
        </h2>
        <p className="text-sm text-[var(--color-muted)] max-w-2xl leading-relaxed">
          Pursuing a B.Sc. in Software Development at TISS while architecting client systems, local RAG agents, and cross-platform mobile apps.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Column: Bio & Interactive Spec Toggle (Cols 1-7) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-6"
        >
          <TiltCard
            tiltMaxAngle={4}
            className="bento-card p-7 space-y-6 bg-[var(--color-paper-2)] border border-[var(--color-rule)] hover:border-[var(--color-rule-2)]"
          >
            {/* Header with Interactive Tabs */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[var(--color-rule)] font-measured text-xs">
              <div className="flex items-center gap-2 p-1 bg-[var(--color-paper-3)] border border-[var(--color-rule)] rounded-full">
                <button
                  onClick={() => setViewMode('profile')}
                  className={`relative isolate px-3 py-1 rounded-full text-xs font-display font-medium transition-colors ${
                    viewMode === 'profile'
                      ? 'text-[var(--color-accent-ink)] font-semibold'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {viewMode === 'profile' && (
                    <motion.div
                      layoutId="active-about-tab"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                      className="absolute inset-0 bg-[var(--color-accent)] rounded-full z-0"
                    />
                  )}
                  <span className="relative z-10">Professional Bio</span>
                </button>
                <button
                  onClick={() => setViewMode('spec')}
                  className={`relative isolate px-3 py-1 rounded-full text-xs font-display font-medium transition-colors ${
                    viewMode === 'spec'
                      ? 'text-[var(--color-accent-ink)] font-semibold'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {viewMode === 'spec' && (
                    <motion.div
                      layoutId="active-about-tab"
                      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                      className="absolute inset-0 bg-[var(--color-accent)] rounded-full z-0"
                    />
                  )}
                  <span className="relative z-10">Technical Spec</span>
                </button>
              </div>
              <span className="chip-cobalt">Appopoleis Studios</span>
            </div>

            {/* Content Switcher */}
            <AnimatePresence mode="wait">
              {viewMode === 'profile' ? (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 text-[var(--color-muted)] text-base leading-relaxed"
                >
                  <p>
                    I am an <strong className="text-[var(--color-ink)] font-semibold">AI Developer Intern</strong> building production applications and LLM systems across mobile, web, and infrastructure.
                  </p>
                  <p>
                    My work concentrates on agentic RAG workflows, React Native mobile apps, and reliable full-stack pipelines that ship directly to real users. Currently stationed at Appopoleis Studios in Mumbai, architecting zero-cloud document intelligence and client-facing interfaces.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="spec"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-xl bg-[var(--color-code-bg)] border border-[var(--color-code-rule)] font-outlier text-xs overflow-x-auto"
                >
                  <pre className="leading-relaxed text-[var(--color-code-ink)]">
                    <code>{SPEC_JSON}</code>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Core Tech Stack Micro-Tags */}
            <div className="pt-4 border-t border-[var(--color-rule)]">
              <div className="text-xs font-measured text-[var(--color-muted)] mb-3">
                core technologies
              </div>
              <div className="flex flex-wrap gap-1.5">
                {STACK.map((tech) => (
                  <span key={tech} className="micro-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </TiltCard>
        </motion.div>

        {/* Right Column: Education & Bento Highlights (Cols 8-12) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Education Panel with 3D Tilt */}
          <TiltCard
            tiltMaxAngle={5}
            className="bento-card p-7 space-y-4 bg-[var(--color-paper-2)] border border-[var(--color-rule)] hover:border-[var(--color-rule-2)]"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-[var(--color-rule)]">
              <div className="flex items-center gap-2">
                <GraduationCap aria-hidden="true" size={17} className="text-[var(--color-ink)]" />
                <span className="text-sm font-semibold text-[var(--color-ink)] font-display">Academic Track</span>
              </div>
              <span className="chip-green">2024 to Present</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-semibold text-lg text-[var(--color-ink)]">
                B.Sc. in Software Development
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                <MapPin aria-hidden="true" size={12} className="text-[var(--color-muted)]" />
                <span>Tata Institute of Social Sciences (TISS)</span>
              </div>
              <p className="text-xs text-[var(--color-muted)] pt-2 leading-relaxed font-sans">
                Vocational degree program covering core software engineering, applied systems architecture, data structures, and production development.
              </p>
            </div>
          </TiltCard>

          {/* Highlights Grid with Staggered Scroll Transitions */}
          <div className="grid grid-cols-2 gap-3.5">
            {HIGHLIGHTS.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 22, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: 0.15 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02 }}
                className="bento-card p-5 space-y-1 bg-[var(--color-paper-2)] border border-[var(--color-rule)] hover:border-[var(--color-rule-2)] transition-colors"
              >
                <div className="font-measured text-2xl font-bold text-[var(--color-accent)]">
                  {item.value}
                </div>
                <div className="text-xs font-semibold text-[var(--color-ink-2)] font-display">
                  {item.label}
                </div>
                <div className="text-[11px] text-[var(--color-muted)] font-sans">
                  {item.detail}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
