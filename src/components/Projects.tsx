import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, X, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { TiltCard } from './TiltCard'

const PROJECTS = [
  {
    id: 1,
    title: 'Hermes 3: Intelligent RAG Agent',
    subtitle: 'Zero-cloud local document intelligence',
    description: 'Intelligent local RAG pipeline using LangChain, Hermes 3 LLM, ChromaDB, BAAI/bge-small embeddings, Ollama, and Streamlit. Fully private, zero-cloud document QA system.',
    tags: ['AI Systems'],
    colSpan: 'lg:col-span-7',
    badge: 'Flagship Architecture',
    highlightMetric: 'Sub-second latency',
    architectureFlow: 'Ollama (Hermes 3) ← ChromaDB ← BAAI/bge-small ← LangChain',
    tech: ['LangChain', 'Hermes 3 LLM', 'ChromaDB', 'Ollama', 'BAAI Embeddings', 'Streamlit', 'Python'],
    features: [
      'Local LLM inference via Ollama with no cloud dependency',
      'ChromaDB vector store with BAAI/bge-small embeddings',
      'Multi-document RAG with citation-aware retrieval',
      'Streamlit interface for drag-and-drop document ingestion',
      'Sub-second query latency on consumer hardware',
    ],
    githubLink: 'https://github.com/rohitkumar66555666-design',
    demoLink: '#',
    status: 'Production verified',
  },
  {
    id: 2,
    title: 'AI Reels Idea Generator SaaS',
    subtitle: 'Viral content automation platform',
    description: 'Creator dashboard automating script, hook, and hashtag generation with prompt-driven tone switching and sub-3-second responses.',
    tags: ['AI Systems', 'SaaS'],
    colSpan: 'lg:col-span-5',
    badge: 'Creator Platform',
    highlightMetric: '< 3s generation',
    architectureFlow: 'Creator Studio → GPT-4 + Groq Sub-3s API → Instant Scripts',
    tech: ['React', 'OpenAI API', 'Groq API', 'Node.js', 'Tailwind CSS'],
    features: [
      'GPT-4 and Groq powered script generation in under 3 seconds',
      'Tone switching: Educational, Funny, Viral, Motivational',
      'Automated hashtag and caption generation per creator niche',
      'Batch generation mode designed for content calendars',
      'One-click export to clipboard, Notion, or Google Docs',
    ],
    githubLink: 'https://github.com/rohitkumar66555666-design/viral-reel-generator-ai',
    demoLink: '#',
    status: 'Public repository',
  },
  {
    id: 3,
    title: 'Mawqif: Prayer Location Finder',
    subtitle: '15+ screen Muslim traveller app',
    description: '15+ screen prayer location mobile application for Muslim travellers with real-time GPS navigation, nearby mosque discovery, Supabase backend, PostgreSQL, and Google Maps API.',
    tags: ['Mobile Apps'],
    colSpan: 'lg:col-span-6',
    badge: 'Mobile Systems',
    highlightMetric: '15+ Screens',
    architectureFlow: 'React Native UX → Real-Time GPS (Google Maps) → Supabase DB',
    tech: ['React Native', 'Expo', 'Supabase', 'PostgreSQL', 'Google Maps API', 'TypeScript'],
    features: [
      'GPS-based real-time mosque and prayer space finder',
      '15+ modular screens with smooth stack navigation',
      'Supabase and PostgreSQL for location data backend',
      'Google Maps API with custom markers and directions',
      'Prayer time calculation based on device geolocation',
    ],
    githubLink: 'https://github.com/rohitkumar66555666-design/Mawqif-Rohit',
    demoLink: '#',
    status: 'Mobile release',
  },
  {
    id: 4,
    title: 'Photo Sharing Mobile App',
    subtitle: '10+ screen real-time social app',
    description: '10+ screen mobile application with real-time feeds, social following, Cloudinary media delivery, and smooth React Native user experience.',
    tags: ['Mobile Apps'],
    colSpan: 'lg:col-span-6',
    badge: 'Social Infrastructure',
    highlightMetric: 'Real-time Feed',
    architectureFlow: 'React Native Screens → Cloudinary CDN Media → Express & MongoDB',
    tech: ['React Native', 'TypeScript', 'Node.js', 'Cloudinary', 'Express', 'MongoDB'],
    features: [
      'Real-time photo feed with infinite scroll pagination',
      'Follow and unfollow system with activity notifications',
      'Cloudinary CDN for responsive media optimization',
      'Full Node.js and Express REST API backend services',
      'MongoDB with aggregation pipelines for fast queries',
    ],
    githubLink: 'https://github.com/rohitkumar66555666-design/Photosharing-App',
    demoLink: '#',
    status: 'Mobile release',
  },
]

const CATEGORIES = ['All', 'AI Systems', 'Mobile Apps', 'SaaS']
type Project = (typeof PROJECTS)[0]

export const Projects: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  const filtered = selectedCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.tags.includes(selectedCategory))

  return (
    <section id="projects" className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[var(--color-rule)] overflow-hidden">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10"
      >
        <div className="space-y-2">
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-[var(--color-ink)] tracking-tight">
            Featured Projects & Systems
          </h2>
          <p className="text-sm text-[var(--color-muted)] max-w-xl leading-relaxed">
            Shipped mobile apps, local RAG document systems, and creator automation tools built with React Native, LangChain, and modern APIs.
          </p>
        </div>

        {/* Filter buttons with guaranteed high-contrast solar amber active state */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-[var(--color-paper-2)] border border-[var(--color-rule)] rounded-full">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4 py-1.5 text-xs font-display font-semibold rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] ${isSelected
                    ? 'bg-[var(--color-accent)] text-[var(--color-paper)] shadow-sm'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-3)]'
                  }`}
              >
                <span>{cat}</span>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Asymmetrical Bento Grid with smooth category transition */}
      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {filtered.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{
              duration: 0.6,
              delay: (idx % 2) * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={project.colSpan}
          >
            <TiltCard
              tiltMaxAngle={4}
              className="bento-card h-full p-7 flex flex-col justify-between space-y-6 bg-[var(--color-paper-2)] border border-[var(--color-rule)] hover:border-[var(--color-rule-2)]"
            >
              <div className="space-y-4">
                {/* Top Meta Bar */}
                <div className="flex items-center justify-between font-measured text-xs text-[var(--color-muted)] pb-3 border-b border-[var(--color-rule)]">
                  <div className="flex items-center gap-2">
                    <span className="chip-green text-[10px] py-0.5 px-2 font-semibold">
                      {project.tags[0]}
                    </span>
                    <span className="text-[var(--color-muted)] text-[11px] font-sans">
                      {project.badge}
                    </span>
                  </div>
                  <span className="font-measured text-[var(--color-accent)] text-xs font-semibold">
                    {project.highlightMetric}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="font-display font-semibold text-2xl text-[var(--color-ink)] leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[var(--color-ink-2)] font-medium font-measured pt-1">
                    {project.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-sm text-[var(--color-muted)] leading-relaxed font-sans">
                  {project.description}
                </p>

                {/* Architecture Pipeline Ribbon */}
                <div className="p-2.5 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="text-[var(--color-muted)] flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)] flex-shrink-0" />
                    <span className="truncate">{project.architectureFlow}</span>
                  </span>
                  <span className="text-[var(--color-accent)] font-semibold flex-shrink-0 text-[10px]">
                    {project.highlightMetric}
                  </span>
                </div>

                {/* Micro-Tags for Tech Stack */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tech.map((t) => (
                    <span key={t} className="micro-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-5 border-t border-[var(--color-rule)]">
                <button
                  type="button"
                  onClick={() => setActiveProject(project)}
                  className="text-xs font-semibold text-[var(--color-ink)] hover:text-[var(--color-ink-2)] inline-flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] motion-safe:active:scale-95 disabled:opacity-50 transition-colors"
                >
                  <span className="whitespace-nowrap">View architecture</span>
                  <ArrowUpRight aria-hidden="true" size={14} className="text-[var(--color-accent)]" />
                </button>

                <div className="flex items-center gap-2">
                  {project.githubLink && project.githubLink !== '#' && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`GitHub repository for ${project.title}`}
                      className="p-2 rounded-full border border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-accent)] bg-[var(--color-paper-3)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] transition-colors"
                    >
                      <Github aria-hidden="true" size={15} />
                    </a>
                  )}
                  {project.demoLink && project.demoLink !== '#' && (
                    <a
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Live demo for ${project.title}`}
                      className="p-2 rounded-full border border-[var(--color-rule)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-accent)] bg-[var(--color-paper-3)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] transition-colors"
                    >
                      <ExternalLink aria-hidden="true" size={15} />
                    </a>
                  )}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Architecture Detail Modal with AnimatePresence */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={activeProject.title}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--color-paper)]/95 backdrop-blur-sm"
            onClick={() => setActiveProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              className="bento-card max-w-2xl w-full p-8 space-y-6 max-h-[90dvh] overflow-y-auto bg-[var(--color-paper-2)] border border-[var(--color-rule-2)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[var(--color-rule)]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="chip-green text-xs font-semibold">{activeProject.tags.join(', ')}</span>
                    <span className="font-measured text-xs text-[var(--color-muted)]">
                      {activeProject.status}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-2xl text-[var(--color-ink)]">
                    {activeProject.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  aria-label="Close modal"
                  className="p-1.5 text-[var(--color-muted)] hover:text-[var(--color-ink)] rounded hover:bg-[var(--color-paper-3)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] motion-safe:active:scale-95 transition-colors"
                >
                  <X aria-hidden="true" size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="space-y-5">
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  {activeProject.description}
                </p>

                <div className="bento-inset p-5 space-y-3 bg-[var(--color-paper-3)] border border-[var(--color-rule)]">
                  <div className="text-xs font-semibold text-[var(--color-ink)] font-display">
                    Verified system capabilities
                  </div>
                  <ul className="space-y-2 text-xs text-[var(--color-ink)]">
                    {activeProject.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <CheckCircle2 aria-hidden="true" size={14} className="text-[var(--color-green)] mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-measured text-[var(--color-muted)] mb-2.5">
                    Complete tech stack
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.tech.map((t) => (
                      <span key={t} className="micro-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer Links */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-rule)]">
                {activeProject.githubLink && activeProject.githubLink !== '#' && (
                  <a
                    href={activeProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cobalt-secondary text-xs focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] motion-safe:active:scale-95 disabled:opacity-50 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Github aria-hidden="true" size={14} />
                    <span>GitHub Repository</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  className="btn-cobalt-primary text-xs focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] motion-safe:active:scale-95 disabled:opacity-50 transition-colors"
                >
                  Close Spec
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
