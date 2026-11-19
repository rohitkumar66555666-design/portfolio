import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { Linkedin, Twitter, Github, Menu, X, Terminal, ArrowUpRight } from 'lucide-react'

const IgIcon = ({ size = 14 }: { size?: number }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
)

const LINKS = [
  { label: 'home', href: '#home' },
  { label: 'about', href: '#about' },
  { label: 'projects', href: '#projects' },
  { label: 'skills', href: '#skills' },
  { label: 'experience', href: '#timeline' },
  { label: 'contact', href: '#contact' },
]

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/rohitkumar66555666-design', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/rohit-kumar-a2979839b', icon: Linkedin },
  { label: 'Twitter', href: 'https://x.com/RohitBawa26', icon: Twitter },
  { label: 'Instagram', href: 'https://instagram.com/rohitbawahightech', icon: IgIcon },
]

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')
  const [open, setOpen] = useState(false)
  const isClickScrollingRef = useRef(false)
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)

      // When the user clicked a nav link, preserve the clicked highlight
      // until smooth scrolling finishes (prevents intermediate tab flickering)
      if (isClickScrollingRef.current) return

      // 1. If at top of page, activate home
      if (window.scrollY < 120) {
        setActive('home')
        return
      }

      // 2. If scrolled near the bottom of page, activate contact
      const scrollPosition = window.scrollY + window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      if (scrollPosition >= documentHeight - 120) {
        setActive('contact')
        return
      }

      // 3. Otherwise detect section occupying the focal area (upper 45% of viewport)
      const ids = LINKS.map((l) => l.href.slice(1))
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom > 80) {
            setActive(id)
            break
          }
        }
      }
    }

    // Unlock immediately if the user manually interrupts smooth scrolling with mouse wheel or touch
    const onUserManualScroll = () => {
      if (isClickScrollingRef.current) {
        isClickScrollingRef.current = false
        if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onUserManualScroll, { passive: true })
    window.addEventListener('touchmove', onUserManualScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onUserManualScroll)
      window.removeEventListener('touchmove', onUserManualScroll)
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
    }
  }, [])

  const scrollTo = (href: string) => {
    const id = href.slice(1)
    setActive(id)
    setOpen(false)

    // Lock scroll-spy updates so the active spring pill glides cleanly to the target
    isClickScrollingRef.current = true
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false
    }, 950)

    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-3 sm:pt-4 pointer-events-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Developer Wordmark Badge */}
        <button
          onClick={() => scrollTo('#home')}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--color-paper-2)]/90 backdrop-blur-md border border-[var(--color-rule)] hover:border-[var(--color-rule-2)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] transition-colors group"
        >
          <div className="w-5 h-5 rounded-full bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)]">
            <Terminal size={11} />
          </div>
          <div className="flex items-center gap-1.5 font-outlier text-xs">
            <span className="text-[var(--color-ink)] font-semibold group-hover:text-[var(--color-ink-2)] transition-colors">
              Bawa.dev
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)] animate-pulse" />
          </div>
        </button>

        {/* Desktop Nav Island with Smooth Animated Pill */}
        <LayoutGroup id="nav-island">
          <nav className="hidden md:flex items-center gap-1 p-1 bg-[var(--color-paper-2)]/90 backdrop-blur-md border border-[var(--color-rule)] rounded-full shadow-lg shadow-black/40">
            {LINKS.map((link) => {
              const isActive = active === link.href.slice(1)
              return (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => scrollTo(link.href)}
                  className={`relative px-3.5 py-1.5 text-xs font-display font-medium rounded-full transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] ${
                    isActive
                      ? 'text-[var(--color-accent-ink)] font-semibold'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-pill"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                        mass: 0.5,
                      }}
                      className="absolute inset-0 bg-[var(--color-accent)] rounded-full z-0 shadow-sm"
                    />
                  )}
                  <span className="relative z-10 transition-colors duration-150">{link.label}</span>
                </button>
              )
            })}
          </nav>
        </LayoutGroup>

        {/* Right Action: Quick Direct Contacts & Socials */}
        <div className="hidden md:flex items-center gap-2">
          {SOCIALS.slice(0, 2).map((s) => {
            const Icon = s.icon
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 rounded-full border border-[var(--color-rule)] bg-[var(--color-paper-2)]/90 backdrop-blur-md flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-rule-2)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] transition-colors"
              >
                <Icon aria-hidden="true" size={13} />
              </a>
            )
          })}
          <button
            onClick={() => scrollTo('#contact')}
            className="btn-cobalt-primary text-xs px-3.5 py-1.5 h-8 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] inline-flex items-center gap-1"
          >
            <span>Get in touch</span>
            <ArrowUpRight size={12} />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          className="md:hidden p-2 rounded-full bg-[var(--color-paper-2)]/90 border border-[var(--color-rule)] text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden max-w-6xl mx-auto mt-2 rounded-2xl bg-[var(--color-paper-2)]/95 backdrop-blur-xl border border-[var(--color-rule)] pointer-events-auto"
          >
            <div className="px-6 py-5 space-y-2">
              {LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left py-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
                >
                  {link.label}
                </button>
              ))}
              <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-rule)]">
                {SOCIALS.map((s) => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="w-8 h-8 rounded-full border border-[var(--color-rule)] bg-[var(--color-paper-3)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] transition-colors"
                    >
                      <Icon aria-hidden="true" size={13} />
                    </a>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
