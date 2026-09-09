import React from 'react'
import { motion } from 'framer-motion'
import { Cpu, Smartphone, Cloud, Zap, GraduationCap, MapPin, Terminal } from 'lucide-react'

const HIGHLIGHTS = [
  { icon: Smartphone, value: '4+', label: 'Apps Shipped', color: '#06b6d4' },
  { icon: Zap, value: '10+', label: 'Screen Mobile Apps', color: '#a855f7' },
  { icon: Cloud, value: 'Zero-Cloud', label: 'RAG Workflows', color: '#00ff88' },
  { icon: Cpu, value: 'AI Reels', label: 'Generator Built', color: '#ec4899' },
]

const STACK = ['LangChain','React Native','Node.js','OpenAI','ChromaDB','Supabase','Python','TypeScript','Ollama','Groq API']

const HUD_LINE = ({ label, value, color = '#06b6d4' }: { label: string; value: string; color?: string }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-[#1a2030]">
    <span className="text-xs font-mono text-[#5a6478]">{label}</span>
    <span className="text-xs font-mono font-bold" style={{ color }}>{value}</span>
  </div>
)

export const About: React.FC = () => (
  <section className="py-32 px-6 max-w-7xl mx-auto">
    {/* Header */}
    <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <span className="section-label">WHO I AM</span>
      <h2 className="text-4xl md:text-6xl font-black mt-3 text-[#e8edf5]">
        About{' '}
        <span style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Me</span>
      </h2>
    </motion.div>

    <div className="grid lg:grid-cols-2 gap-14 items-start">
      {/* ── Left column ── */}
      <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>

        {/* Summary card */}
        <div className="glass rounded-2xl overflow-hidden mb-5" style={{ boxShadow: '0 0 40px rgba(6,182,212,0.06)' }}>
          <div className="h-px shimmer-border" />
          <div className="p-7">
            {/* HUD header */}
            <div className="flex items-center gap-2 mb-5">
              <Terminal size={13} className="text-[#06b6d4]" />
              <span className="font-mono text-xs text-[#5a6478]">profile.json</span>
              <div className="ml-auto flex gap-1.5">
                {['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
              </div>
            </div>

            <p className="text-[#8892a4] text-base leading-relaxed mb-4">
              I'm an <span className="text-[#06b6d4] font-semibold">AI Developer Intern</span> building production-ready apps and{' '}
              <span className="text-[#a855f7] font-semibold">LLM-powered systems</span> across mobile, web, and AI.
              Specialising in agentic RAG workflows, React Native apps, and full-stack pipelines that ship to real users.
            </p>
            <p className="text-[#8892a4] text-base leading-relaxed">
              Currently at <span className="text-[#e8edf5] font-semibold">Appopoleis Studios, Mumbai</span> —
              shipping client products with zero-cloud RAG, local LLMs, and polished mobile UX.
            </p>

            {/* Tech chips */}
            <div className="flex flex-wrap gap-2 mt-6">
              {STACK.map((t, i) => (
                <motion.span
                  key={t}
                  className="text-xs px-3 py-1 rounded-full glass text-[#06b6d4] border border-[#06b6d4]/15"
                  initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.1, boxShadow: '0 0 12px rgba(6,182,212,0.4)' }}
                >{t}</motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Education card */}
        <motion.div
          className="glass rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
          whileHover={{ boxShadow: '0 0 40px rgba(6,182,212,0.18)' }}
        >
          {/* neon top bar */}
          <div className="h-0.5" style={{ background: 'linear-gradient(90deg,#06b6d4,#a855f7,#ec4899)' }} />
          <div className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,rgba(6,182,212,0.2),rgba(168,85,247,0.15))', boxShadow: '0 0 16px rgba(6,182,212,0.25)' }}>
              <GraduationCap size={22} className="text-[#06b6d4]" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-mono uppercase tracking-widest mb-1.5"
                style={{ background: 'linear-gradient(90deg,#06b6d4,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Education
              </p>
              <h3 className="text-[#e8edf5] font-black text-base leading-tight mb-1">B.Sc. in Software Development</h3>
              <p className="text-[#5a6478] text-sm flex items-center gap-1.5 mb-3">
                <MapPin size={11} className="text-[#06b6d4] flex-shrink-0" />
                Tata Institute of Social Sciences (TISS)
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full" style={{ background: 'rgba(6,182,212,0.12)', color: '#06b6d4' }}>
                  📅 2024 – Present
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'rgba(168,85,247,0.12)', color: '#a855f7' }}>
                  3rd Year · Pursuing
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-[#00ff88]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />Active
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Right column ── */}
      <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>

        {/* HUD stats panel */}
        <div className="glass rounded-2xl overflow-hidden mb-5">
          <div className="h-px shimmer-border" />
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
              <span className="font-mono text-xs text-[#5a6478] uppercase tracking-widest">Developer Stats</span>
            </div>
            <HUD_LINE label="STATUS" value="AVAILABLE FOR HIRE" color="#00ff88" />
            <HUD_LINE label="LOCATION" value="Maharashtra, India" />
            <HUD_LINE label="EXPERIENCE" value="AI Dev Intern · Appopoleis" color="#a855f7" />
            <HUD_LINE label="FOCUS" value="AI · Mobile · Full Stack" color="#ec4899" />
          </div>
        </div>

        {/* Highlight tiles */}
        <p className="text-[#5a6478] text-xs font-mono uppercase tracking-widest mb-4">Key Highlights</p>
        <div className="grid grid-cols-2 gap-3">
          {HIGHLIGHTS.map((h, i) => {
            const { icon: Icon } = h
            return (
              <motion.div
                key={h.label}
                className="glass rounded-2xl p-5 relative overflow-hidden group"
                initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.3 }}
                whileHover={{ scale: 1.04, boxShadow: `0 0 30px ${h.color}22` }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: h.color + '1a' }}>
                  <Icon size={16} style={{ color: h.color }} />
                </div>
                <div className="text-2xl font-black mb-0.5" style={{ color: h.color }}>{h.value}</div>
                <div className="text-[#5a6478] text-xs leading-snug">{h.label}</div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                  style={{ background: `radial-gradient(circle at 30% 30%,${h.color}0a,transparent 70%)` }} />
              </motion.div>
            )
          })}
        </div>

        {/* Active status */}
        <motion.div
          className="mt-4 glass rounded-2xl p-4 flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.6 }}
        >
          <div className="relative flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-[#00ff88]" />
            <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#00ff88] blur-sm animate-pulse" />
          </div>
          <div>
            <p className="text-[#e8edf5] text-sm font-semibold">Currently Active</p>
            <p className="text-[#5a6478] text-xs font-mono">AI Developer Intern · Appopoleis Studios, Mumbai</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
)
