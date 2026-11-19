import React, { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Briefcase, Code2, GraduationCap, CheckCircle2, ShieldCheck, Terminal } from 'lucide-react'
import { TiltCard } from './TiltCard'

const EVENTS = [
  {
    period: 'Sep 2024 to Present',
    role: 'AI Developer Intern',
    company: 'Appopoleis Studios',
    location: 'Mumbai, India',
    tag: 'Current Role',
    Icon: Briefcase,
    achievements: [
      'Built 10+ screen photo-sharing mobile application with real-time feeds and Cloudinary delivery',
      'Developed Mawqif, a 15+ screen prayer location application with real-time GPS and Google Maps integration',
      'Shipped client production applications from initial architecture to live deployment',
      'Architected zero-cloud RAG pipeline utilizing LangChain, Hermes 3, ChromaDB and local Ollama inference',
      'Integrated OpenAI, Groq, and Claude APIs across multiple production client tools',
    ],
  },
  {
    period: 'Feb 2024 to Apr 2024',
    role: 'Software Developer Intern',
    company: 'Integrate 360',
    location: 'Mumbai, India',
    tag: 'Completed',
    Icon: Code2,
    achievements: [
      'Developed responsive web interfaces using React, modern JavaScript, and CSS architecture',
      'Modularized software components to elevate code reuse across the team codebase',
      'Collaborated closely with senior engineers to deliver client-facing UI features on schedule',
      'Optimized page load speeds through component-level code splitting and asset reduction',
    ],
  },
  {
    period: '2024 to Present',
    role: 'B.Sc. in Software Development',
    company: 'Tata Institute of Social Sciences (TISS)',
    location: 'Mumbai, India (Pursuing)',
    tag: 'Academic Track',
    Icon: GraduationCap,
    achievements: [
      'Pursuing software engineering curriculum with specialization in applied AI and full-stack systems',
      'Engineered hands-on projects spanning mobile apps, AI pipelines, and database architecture',
      'Formed solid foundation in data structures, relational schemas, and distributed system principles',
    ],
  },
]

export const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 65%', 'end 75%'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  })

  // Height scale for the dynamic laser beam
  const laserHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%'])

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="relative py-28 px-6 max-w-7xl mx-auto border-t border-[var(--color-rule)] overflow-hidden"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mb-12 space-y-2 relative z-10"
      >
        <h2 className="font-display font-semibold text-3xl sm:text-4xl text-[var(--color-ink)] tracking-tight">
          Work Experience &amp; Education
        </h2>
        <p className="text-sm text-[var(--color-muted)] max-w-xl leading-relaxed">
          Commercial software engineering roles, mobile development, and academic foundation at TISS.
        </p>
      </motion.div>

      {/* Audit Trail Spine Container */}
      <div className="relative pl-6 sm:pl-10 space-y-12 ml-3 sm:ml-6 relative z-10">
        {/* Static Background Etched Line */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-3 bottom-3 w-[2px] bg-[var(--color-rule)] rounded-full"
        />

        {/* Dynamic Scroll-Linked Laser Trace Line */}
        <motion.div
          aria-hidden="true"
          className="absolute left-0 top-3 w-[2px] bg-[var(--color-accent)] origin-top rounded-full"
          style={{ height: laserHeight }}
        >
          {/* Laser Photon Head Packet */}
          <div className="absolute -bottom-1 -left-[3px] w-2 h-2 rounded-full bg-[var(--color-green)] animate-pulse" />
        </motion.div>

        {EVENTS.map((event, idx) => {
          const Icon = event.Icon
          return (
            <motion.div
              key={event.role + event.period}
              initial={{ opacity: 0, x: -28, scale: 0.98 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.65, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              {/* Spine Node Marker with Clean Status Indicator */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 350, damping: 20, delay: idx * 0.1 }}
                className="absolute -left-[32px] sm:-left-[49px] top-4 w-5 h-5 rounded-full bg-[var(--color-paper)] border-2 border-[var(--color-rule-2)] flex items-center justify-center group-hover:scale-110 transition-transform"
              >
                <div className="w-2 h-2 rounded-full bg-[var(--color-green)]" />
              </motion.div>

              {/* Event Panel with 3D Tilt */}
              <TiltCard
                tiltMaxAngle={4}
                className="bento-card p-7 sm:p-8 space-y-5 bg-[var(--color-paper-2)] border border-[var(--color-rule)] hover:border-[var(--color-rule-2)]"
              >
                {/* Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[var(--color-rule)] font-measured text-xs">
                  <div className="flex items-center gap-2">
                    <Icon aria-hidden="true" size={15} className="text-[var(--color-accent)]" />
                    <span className="text-[var(--color-ink)] font-semibold">{event.period}</span>
                    <span className="text-[var(--color-muted)]">({event.location})</span>
                  </div>
                  <span className="chip-green text-[10px] py-0.5 px-2 font-semibold">
                    {event.tag}
                  </span>
                </div>

                {/* Role & Company Header */}
                <div>
                  <h3 className="font-display font-semibold text-2xl text-[var(--color-ink)]">
                    {event.role}
                  </h3>
                  <div className="text-sm font-semibold text-[var(--color-accent)] font-display pt-0.5">
                    {event.company}
                  </div>
                </div>

                {/* Bullet Achievements Staggered */}
                <ul className="space-y-2.5 text-sm text-[var(--color-muted)] font-sans">
                  {event.achievements.map((item, aIdx) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: 0.15 + aIdx * 0.05 }}
                      className="flex items-start gap-2.5"
                    >
                      <CheckCircle2 aria-hidden="true" size={14} className="text-[var(--color-green)] mt-1 flex-shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </TiltCard>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
