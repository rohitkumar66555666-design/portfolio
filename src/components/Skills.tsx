import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Smartphone, Database, Wrench, CheckCircle, Activity, Terminal } from 'lucide-react'
import { TiltCard } from './TiltCard'

const SKILL_DATA = [
  {
    category: 'AI & LLM Architecture',
    slug: 'ai-llm',
    icon: Bot,
    colSpan: 'lg:col-span-7',
    focus: 'Zero-cloud local inference, vector stores and agentic RAG workflows',
    telemetry: 'Vector lookup < 5ms, 100% private VRAM',
    skills: [
      { name: 'LangChain & Agentic RAG', level: 'Production' },
      { name: 'Hermes 3 & Local LLMs', level: 'Production' },
      { name: 'ChromaDB Vector Store', level: 'Production' },
      { name: 'OpenAI, Groq & Claude APIs', level: 'Production' },
      { name: 'Ollama VRAM Deployment', level: 'Production' },
      { name: 'Prompt Engineering & Tools', level: 'Advanced' },
    ],
    badges: [
      'LangChain',
      'Hermes 3 LLM',
      'ChromaDB',
      'Ollama',
      'BAAI Embeddings',
      'Groq API',
      'OpenAI API',
      'Claude API',
      'Vector QA',
      'Streamlit',
      'Private AI',
    ],
  },
  {
    category: 'Frontend & Mobile UX',
    slug: 'frontend-mobile',
    icon: Smartphone,
    colSpan: 'lg:col-span-5',
    focus: 'Production cross-platform mobile apps and responsive web applications',
    telemetry: '60 FPS Native UX, 15+ Modular Screens',
    skills: [
      { name: 'React Native & Expo', level: 'Production' },
      { name: 'React 18 & TypeScript', level: 'Production' },
      { name: 'Tailwind CSS & Token Systems', level: 'Production' },
      { name: 'Stack Navigation & Gestures', level: 'Production' },
    ],
    badges: [
      'React Native',
      'Expo EAS',
      'TypeScript',
      'React 18',
      'Tailwind CSS',
      'Framer Motion',
      'State Machines',
      'Mobile UX',
    ],
  },
  {
    category: 'Backend & Data Infrastructure',
    slug: 'backend-data',
    icon: Database,
    colSpan: 'lg:col-span-6',
    focus: 'RESTful API services, real-time channels and relational schemas',
    telemetry: 'Real-time GPS, Supabase Auth Sockets',
    skills: [
      { name: 'Node.js & Express REST APIs', level: 'Production' },
      { name: 'PostgreSQL & Supabase schemas', level: 'Production' },
      { name: 'Python 3 data pipelines', level: 'Production' },
      { name: 'MongoDB Aggregations', level: 'Intermediate' },
    ],
    badges: [
      'Node.js',
      'Express',
      'Python 3',
      'PostgreSQL',
      'Supabase',
      'Google Maps API',
      'MongoDB',
      'Firebase',
      'REST APIs',
    ],
  },
  {
    category: 'Developer Tooling & DevOps',
    slug: 'tools-devops',
    icon: Wrench,
    colSpan: 'lg:col-span-6',
    focus: 'Version control, asset pipelines, CI/CD and deployment workflows',
    telemetry: 'Cloudinary CDN, Vercel Production',
    skills: [
      { name: 'Git & GitHub version control', level: 'Advanced' },
      { name: 'Cloudinary media pipelines', level: 'Production' },
      { name: 'Vercel deployment workflows', level: 'Advanced' },
      { name: 'VS Code & Linux/WSL dev', level: 'Advanced' },
    ],
    badges: [
      'Git',
      'GitHub',
      'VS Code',
      'Cloudinary CDN',
      'Expo EAS',
      'Vercel',
      'Postman',
      'Linux / WSL',
    ],
  },
]

export const Skills: React.FC = () => {
  const [activeSlug, setActiveSlug] = useState<string>('all')

  const displayedCategories = activeSlug === 'all'
    ? SKILL_DATA
    : SKILL_DATA.filter((s) => s.slug === activeSlug)

  return (
    <section id="skills" className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[var(--color-rule)] overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10"
      >
        <div className="space-y-2">
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-[var(--color-ink)] tracking-tight">
            Skills &amp; Technical Capabilities
          </h2>
          <p className="text-sm text-[var(--color-muted)] max-w-xl leading-relaxed">
            Technologies, libraries, and frameworks used across AI systems, mobile UX, and full-stack engineering.
          </p>
        </div>

        {/* Filter controls with guaranteed high-contrast solar amber active state */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-[var(--color-paper-2)] border border-[var(--color-rule)] rounded-full">
          <button
            type="button"
            onClick={() => setActiveSlug('all')}
            className={`relative px-4 py-1.5 text-xs font-display font-semibold rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] ${
              activeSlug === 'all'
                ? 'bg-[var(--color-accent)] text-[var(--color-paper)] shadow-sm'
                : 'text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-3)]'
            }`}
          >
            <span>All domains</span>
          </button>
          {SKILL_DATA.map((cat) => {
            const isSelected = activeSlug === cat.slug
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveSlug(cat.slug)}
                className={`relative px-4 py-1.5 text-xs font-display font-semibold rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] ${
                  isSelected
                    ? 'bg-[var(--color-accent)] text-[var(--color-paper)] shadow-sm'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-3)]'
                }`}
              >
                <span>{cat.category.split(' ')[0]}</span>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Asymmetrical Bento Grid with smooth category transition */}
      <motion.div
        key={activeSlug}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {displayedCategories.map((group, idx) => {
          const Icon = group.icon
          return (
            <motion.div
              layout
              key={group.slug}
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: (idx % 2) * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={group.colSpan}
            >
              <TiltCard
                tiltMaxAngle={4}
                className="bento-card h-full p-7 space-y-6 flex flex-col justify-between bg-[var(--color-paper-2)] border border-[var(--color-rule)] hover:border-[var(--color-rule-2)]"
              >
                <div className="space-y-5">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[var(--color-rule)]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-accent)]">
                        <Icon aria-hidden="true" size={17} />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-xl text-[var(--color-ink)]">
                          {group.category}
                        </h3>
                        <p className="text-xs text-[var(--color-muted)] font-sans">
                          {group.focus}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* High-Density Capability Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {group.skills.map((skill, sIdx) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -6 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: 0.08 + sIdx * 0.04 }}
                        className="p-2.5 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-between gap-2 transition-colors hover:border-[var(--color-rule-2)]"
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-1">
                          <CheckCircle aria-hidden="true" size={12} className="text-[var(--color-green)] flex-shrink-0" />
                          <span className="font-sans font-medium text-[var(--color-ink)] leading-snug whitespace-normal break-words">{skill.name}</span>
                        </div>
                        <span className="chip-green text-[10px] py-0.5 px-1.5 font-semibold flex-shrink-0">
                          {skill.level}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Information-Dense Micro-Tags */}
                  <div className="pt-2">
                    <div className="text-[11px] font-measured text-[var(--color-muted)] mb-2 flex items-center gap-1.5">
                      <Terminal aria-hidden="true" size={11} className="text-[var(--color-muted)]" />
                      <span>Core libraries & frameworks</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.badges.map((badge) => (
                        <span key={badge} className="micro-tag">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Summary Footer */}
                <div className="pt-3.5 border-t border-[var(--color-rule)] flex items-center justify-between text-xs font-measured text-[var(--color-muted)]">
                  <div className="flex items-center gap-1.5 text-[var(--color-ink-2)]">
                    <Activity aria-hidden="true" size={12} className="text-[var(--color-accent)]" />
                    <span>{group.telemetry}</span>
                  </div>
                  <span className="chip-neutral text-[10px]">Active</span>
                </div>
              </TiltCard>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
