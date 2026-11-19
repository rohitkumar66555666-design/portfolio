import React from 'react'
import { Github, Linkedin, Twitter, Mail, Phone, ArrowUp, Terminal } from 'lucide-react'

const IgIcon = ({ size = 14 }: { size?: number }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
)

const NAV_LINKS = [
  { label: 'home', id: 'home' },
  { label: 'about', id: 'about' },
  { label: 'projects', id: 'projects' },
  { label: 'skills', id: 'skills' },
  { label: 'experience', id: 'timeline' },
  { label: 'contact', id: 'contact' },
]

const SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/rohitkumar66555666-design', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/rohit-kumar-a2979839b', icon: Linkedin },
  { label: 'Twitter', href: 'https://x.com/RohitBawa26', icon: Twitter },
  { label: 'Instagram', href: 'https://instagram.com/rohitbawahightech', icon: IgIcon },
  { label: 'Email', href: 'mailto:rohitkumar66555666@gmail.com', icon: Mail },
]

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-[var(--color-rule)] bg-[var(--color-paper-2)] text-[var(--color-muted)]">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start justify-between">
          {/* Mast Brand (Cols 1-5) */}
          <div className="md:col-span-5 space-y-2">
            <div className="space-y-0.5">
              <span className="font-display font-semibold text-xl text-[var(--color-ink)] block">
                Rohit Kumar
              </span>
              <p className="text-xs text-[var(--color-accent)] font-semibold font-measured">
                AI Developer, Mobile & Full Stack Engineer
              </p>
            </div>
            <p className="text-xs text-[var(--color-muted)] max-w-sm leading-relaxed font-sans">
              Specialized in private RAG architectures, local LLM applications, and multi-screen React Native products.
            </p>
            <div className="flex flex-wrap gap-3 pt-0.5 font-measured text-xs">
              <a
                href="mailto:rohitkumar66555666@gmail.com"
                className="text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] font-medium"
              >
                rohitkumar66555666@gmail.com
              </a>
              <a
                href="tel:+916299798907"
                className="text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] font-medium"
              >
                +91 6299798907
              </a>
            </div>
          </div>

          {/* Quick Nav Links (Cols 6-8) */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-xs font-semibold text-[var(--color-ink)] font-display">
              Navigation
            </div>
            <div className="flex flex-col space-y-1 text-xs">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-left text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social Channels (Cols 9-12) */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-xs font-semibold text-[var(--color-ink)] font-display">
              Verified Networks
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SOCIAL.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="py-1.5 px-2.5 rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper-3)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] transition-colors flex items-center gap-1.5 text-xs font-medium"
                  >
                    <Icon aria-hidden="true" size={13} />
                    <span>{s.label}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-4 border-t border-[var(--color-rule)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-measured">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)] animate-pulse" />
            <span className="text-[var(--color-muted)]">
              2026 Rohit Kumar · Engineered with React 18, TypeScript, Tailwind & Framer Motion
            </span>
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Back to top of page"
            className="flex items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp aria-hidden="true" size={13} />
          </button>
        </div>
      </div>
    </footer>
  )
}
