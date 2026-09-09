import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Linkedin, Twitter, Github } from 'lucide-react'

const IgIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
)

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Contact', href: '#contact' },
]

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/rohit-kumar-a2979839b', icon: <Linkedin size={13}/>, color: '#0a66c2' },
  { label: 'Twitter', href: 'https://x.com/RohitBawa26', icon: <Twitter size={13}/>, color: '#1da1f2' },
  { label: 'Instagram', href: 'https://instagram.com/rohitbawahightech', icon: <IgIcon size={13}/>, color: '#ec4899', isIg: true },
  { label: 'GitHub', href: 'https://github.com/rohitkumar66555666-design', icon: <Github size={13}/>, color: '#e8edf5' },
]

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const ids = LINKS.map(l => l.href.slice(1))
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(id); break }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => { document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); setOpen(false) }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass shadow-lg' : 'bg-transparent'}`}
      initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.button
          onClick={() => scrollTo('#home')}
          className="flex items-center gap-2 group"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <div className="relative flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#06b6d4]" style={{ boxShadow: '0 0 8px #06b6d4, 0 0 16px rgba(6,182,212,0.5)' }} />
            <motion.div className="absolute inset-0 rounded-full bg-[#06b6d4]" animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
          <span className="font-black text-xl tracking-tight leading-none" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 60%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.4))' }}>
            Bawa
          </span>
          <span className="hidden sm:block text-[10px] font-mono text-[#5a6478] self-end pb-0.5 leading-none">
            .dev
          </span>
        </motion.button>
        <div className="hidden md:flex items-center gap-1">
          {LINKS.map(link => (
            <motion.button key={link.href} onClick={() => scrollTo(link.href)}
              className="relative px-4 py-2 text-sm font-medium transition-colors font-mono"
              style={{ color: active === link.href.slice(1) ? '#06b6d4' : '#5a6478' }}
              whileHover={{ color: '#e8edf5' }}>
              {link.label}
              {active === link.href.slice(1) && (
                <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,#06b6d4,#a855f7)', boxShadow: '0 0 6px rgba(6,182,212,0.6)' }} transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
            </motion.button>
          ))}
          <div className="flex items-center gap-1 ml-3 pl-3 border-l border-[#1a2030]">
            {SOCIALS.map(s => (
              <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                className="w-8 h-8 rounded-lg glass flex items-center justify-center text-[#5a6478] transition-colors"
                whileHover={{ scale: 1.15, color: s.color, boxShadow: (s as unknown as { isIg?: boolean }).isIg ? '0 0 20px rgba(236,72,153,0.6)' : `0 0 14px ${s.color}55` }}
                whileTap={{ scale: 0.9 }}>
                {s.icon}
              </motion.a>
            ))}
          </div>
        </div>
        <motion.button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(!open)} whileTap={{ scale: 0.9 }} aria-label="Toggle menu">
          {[0, 1, 2].map(i => (
            <motion.span key={i} className="block h-0.5 bg-[#e8edf5] rounded" style={{ width: i === 1 ? 20 : 28 }}
              animate={open ? { rotate: i === 0 ? 45 : i === 2 ? -45 : 0, y: i === 0 ? 8 : i === 2 ? -8 : 0, opacity: i === 1 ? 0 : 1 } : { rotate: 0, y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }} />
          ))}
        </motion.button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="md:hidden overflow-hidden glass border-t border-white/5">
            {LINKS.map((link, i) => (
              <motion.button key={link.href} onClick={() => scrollTo(link.href)} className="block w-full text-left px-6 py-4 text-sm font-mono text-[#5a6478] hover:text-[#06b6d4] transition-colors border-b border-white/5" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.06 }}>
                <span className="text-[#06b6d4] mr-2 text-xs">0{i + 1}.</span>{link.label}
              </motion.button>
            ))}
            <div className="flex items-center gap-3 px-6 py-4">
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-8 h-8 glass rounded-lg flex items-center justify-center transition-colors" style={{ color: '#5a6478' }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
