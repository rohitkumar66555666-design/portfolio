import React from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Twitter, Mail, Phone } from 'lucide-react'

const IgIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
)

const NAV_LINKS = ['Home','About','Projects','Skills','Timeline','Contact']

const SOCIAL = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/rohit-kumar-a2979839b', icon: <Linkedin size={14}/>, color: '#0a66c2' },
  { label: 'Twitter / X', href: 'https://x.com/RohitBawa26', icon: <Twitter size={14}/>, color: '#1da1f2' },
  { label: 'Instagram', href: 'https://instagram.com/rohitbawahightech', icon: <IgIcon size={14}/>, color: '#ec4899', isIg: true },
  { label: 'GitHub', href: 'https://github.com/rohitkumar66555666-design', icon: <Github size={14}/>, color: '#e8edf5' },
  { label: 'Email', href: 'mailto:rohitkumar66555666@gmail.com', icon: <Mail size={14}/>, color: '#06b6d4' },
]

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="border-t border-[#1a2030] bg-[#020408]">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">

          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-xl font-black" style={{
              background: 'linear-gradient(135deg,#06b6d4,#a855f7,#ec4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Rohit Kumar (Bawa)</p>
            <p className="text-[#5a6478] text-sm mt-1 font-mono">AI Developer · Mobile & Full Stack Engineer</p>
            <div className="flex flex-wrap gap-4 mt-3">
              <a href="mailto:rohitkumar66555666@gmail.com"
                className="inline-flex items-center gap-1.5 text-xs text-[#5a6478] hover:text-[#06b6d4] transition-colors font-mono">
                <Mail size={10}/>rohitkumar66555666@gmail.com
              </a>
              <a href="tel:+916299798907"
                className="inline-flex items-center gap-1.5 text-xs text-[#5a6478] hover:text-[#06b6d4] transition-colors font-mono">
                <Phone size={10}/>+91 6299798907
              </a>
            </div>
          </motion.div>

          {/* Nav links */}
          <motion.div className="flex flex-wrap gap-x-6 gap-y-2"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}>
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => scrollTo(l)}
                className="text-[#5a6478] hover:text-[#06b6d4] text-sm transition-colors font-mono">{l}</button>
            ))}
          </motion.div>

          {/* Social icons */}
          <motion.div className="flex gap-3"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}>
            {SOCIAL.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-[#5a6478] transition-colors"
                whileHover={{
                  scale: 1.15, y: -4,
                  color: s.color,
                  boxShadow: (s as any).isIg
                    ? '0 0 20px rgba(236,72,153,0.6)'
                    : `0 0 16px ${s.color}55`,
                }}
                whileTap={{ scale: 0.9 }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
              >
                {s.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="mt-10 pt-6 border-t border-[#1a2030] text-center text-[#5a6478] text-xs font-mono"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          © 2026 Rohit Kumar (Bawa) · Maharashtra, India · Built with React, Three.js, Framer Motion & Tailwind CSS
        </motion.div>
      </div>
    </footer>
  )
}
