import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Briefcase, Code2, GraduationCap } from 'lucide-react'

const EVENTS = [
  {
    date: 'Sep 2024 – Present',
    role: 'AI Developer Intern',
    company: 'Appopoleis Studios',
    location: 'Mumbai, India',
    type: 'work',
    color: '#06b6d4',
    Icon: Briefcase,
    achievements: [
      'Built 10+ screen photo-sharing mobile app with real-time feeds & Cloudinary delivery',
      'Developed Mawqif — 15+ screen prayer location app with GPS & Google Maps API',
      'Shipped 3–5 client production applications from design to deployment',
      'Architected zero-cloud RAG pipeline using LangChain, Hermes 3, ChromaDB & Ollama',
      'Integrated OpenAI, Groq, and Claude APIs across multiple client AI products',
    ],
  },
  {
    date: 'Feb 2024 – Apr 2024',
    role: 'Software Developer Intern',
    company: 'Integrate 360',
    location: 'Mumbai, India',
    type: 'work',
    color: '#a855f7',
    Icon: Code2,
    achievements: [
      'Developed responsive web applications using React, JavaScript, and HTML/CSS',
      'Optimised modular software components improving team code reuse',
      'Collaborated with senior engineers to deliver client-facing UI features',
      'Improved page load performance through component-level code splitting',
    ],
  },
  {
    date: '2024 – Present',
    role: 'B.Sc. in Software Development',
    company: 'Tata Institute of Social Sciences (TISS)',
    location: 'India · 3rd Year (Pursuing)',
    type: 'education',
    color: '#00ff88',
    Icon: GraduationCap,
    achievements: [
      'Pursuing Software Development with focus on applied AI and full-stack engineering',
      'Built multiple real-world projects spanning mobile, web, and AI during coursework',
      'Developed strong foundation in algorithms, databases, and system design',
    ],
  },
]

export const Timeline: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.15'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="py-32 px-6 max-w-4xl mx-auto" ref={containerRef}>
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="section-label">MY JOURNEY</span>
        <h2 className="text-4xl md:text-6xl font-black mt-3 text-[#e8edf5]">
          Work{' '}
          <span
            style={{
              background: 'linear-gradient(135deg,#06b6d4,#a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Experience
          </span>
        </h2>
      </motion.div>

      <div className="relative pl-8">
        {/* Static track */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-[#1a2030]" />

        {/* Laser line fill */}
        <motion.div
          className="absolute left-5 top-0 w-px origin-top"
          style={{
            height: lineHeight,
            background: 'linear-gradient(180deg,#06b6d4,#a855f7,#00ff88)',
            boxShadow: '0 0 8px rgba(6,182,212,0.6)',
          }}
        />

        <div className="space-y-14">
          {EVENTS.map((event, i) => {
            const { Icon } = event
            return (
              <motion.div
                key={event.date}
                className="relative flex items-start gap-6"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, delay: i * 0.12 }}
              >
                {/* Glowing node */}
                <div className="absolute -left-8 top-4 flex items-center justify-center" style={{ width: '2.5rem' }}>
                  <div className="relative flex items-center justify-center">
                    <motion.div
                      className="absolute rounded-full"
                      style={{ width: 40, height: 40, background: event.color + '22' }}
                      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.5 }}
                    />
                    <motion.div
                      className="relative w-10 h-10 rounded-full border-2 flex items-center justify-center"
                      style={{
                        background: event.color + '18',
                        borderColor: event.color,
                        boxShadow: `0 0 16px ${event.color}55, 0 0 30px ${event.color}22`,
                      }}
                      whileInView={{ scale: [0, 1.2, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.12 + 0.2 }}
                    >
                      <Icon size={15} style={{ color: event.color }} />
                    </motion.div>
                  </div>
                </div>

                {/* Card */}
                <motion.div
                  className="flex-1 glass rounded-2xl overflow-hidden ml-8"
                  whileHover={{ scale: 1.02, boxShadow: `0 0 40px ${event.color}20` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div className="h-0.5" style={{ background: `linear-gradient(90deg,${event.color},transparent)` }} />
                  <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-lg font-black text-[#e8edf5]">{event.role}</h3>
                        <p className="font-semibold text-sm" style={{ color: event.color }}>{event.company}</p>
                        <p className="text-[#5a6478] text-xs mt-0.5 font-mono">{event.location}</p>
                      </div>
                      <div
                        className="text-xs font-mono px-3 py-1 rounded-full flex-shrink-0"
                        style={{ background: event.color + '18', color: event.color }}
                      >
                        {event.date}
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {event.achievements.map((a, j) => (
                        <motion.li
                          key={j}
                          className="flex items-start gap-2.5 text-sm text-[#5a6478]"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.12 + j * 0.07 + 0.3 }}
                        >
                          <span
                            className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: event.color }}
                          />
                          {a}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
