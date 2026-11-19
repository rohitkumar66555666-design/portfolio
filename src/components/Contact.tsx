import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, Linkedin, Twitter, Send, Check, MapPin, ArrowUpRight, Copy, CheckCheck } from 'lucide-react'
import { TiltCard } from './TiltCard'
import { MagneticButton } from './MagneticButton'

const IgIcon = ({ size = 15 }: { size?: number }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
)

type Status = 'idle' | 'loading' | 'success' | 'error'

const QUICK_LINKS = [
  {
    label: 'Email',
    value: 'rohitkumar66555666@gmail.com',
    href: 'mailto:rohitkumar66555666@gmail.com',
    icon: Mail,
    canCopy: true,
  },
  {
    label: 'Call or WhatsApp',
    value: '+91 6299798907',
    href: 'tel:+916299798907',
    icon: Phone,
    canCopy: true,
  },
  {
    label: 'LinkedIn',
    value: 'rohit-kumar-a2979839b',
    href: 'https://linkedin.com/in/rohit-kumar-a2979839b',
    icon: Linkedin,
    canCopy: false,
  },
  {
    label: 'Twitter',
    value: '@RohitBawa26',
    href: 'https://x.com/RohitBawa26',
    icon: Twitter,
    canCopy: false,
  },
  {
    label: 'Instagram',
    value: '@rohitbawahightech',
    href: 'https://instagram.com/rohitbawahightech',
    icon: IgIcon,
    canCopy: false,
  },
]

export const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = (e: React.MouseEvent, val: string, label: string) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(val)
    setCopiedKey(label)
    setTimeout(() => setCopiedKey(null), 2500)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setStatus('error')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('error')
      return
    }
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    }, 1200)
  }

  return (
    <section id="contact" className="relative pt-16 sm:pt-20 pb-4 sm:pb-6 px-6 max-w-7xl mx-auto border-t border-[var(--color-rule)] overflow-hidden scroll-mt-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mb-6 space-y-1.5 relative z-10"
      >
        <h2 className="font-display font-semibold text-3xl sm:text-4xl text-[var(--color-ink)] tracking-tight">
          Let&rsquo;s discuss a project or opportunity.
        </h2>
        <p className="text-xs font-measured text-[var(--color-muted)] flex items-center gap-1.5 pt-0.5">
          <MapPin aria-hidden="true" size={13} className="text-[var(--color-muted)]" />
          <span>Maharashtra, India · Available for remote contracts &amp; full-time roles worldwide</span>
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column: Direct Communication Channels (Cols 1-5) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 space-y-2"
        >
          <div className="text-xs font-measured text-[var(--color-muted)] mb-1.5">
            Direct Channels
          </div>
          {QUICK_LINKS.map((item, idx) => {
            const Icon = item.icon
            const isCopied = copiedKey === item.label
            return (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="bento-card py-2.5 px-4 flex items-center justify-between group bg-[var(--color-paper-2)] border border-[var(--color-rule)] hover:border-[var(--color-rule-2)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-accent)] group-hover:scale-105 transition-transform flex-shrink-0">
                    <Icon aria-hidden="true" size={14} />
                  </div>
                  <div className="min-w-0 truncate">
                    <div className="text-[11px] text-[var(--color-muted)] font-sans">
                      {item.label}
                    </div>
                    <div className="text-xs font-measured font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-ink-2)] transition-colors truncate">
                      {item.value}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  {item.canCopy && (
                    <button
                      type="button"
                      onClick={(e) => handleCopy(e, item.value, item.label)}
                      title="Copy to clipboard"
                      className="p-1 rounded-md border border-[var(--color-rule)] bg-[var(--color-paper-3)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-rule-2)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
                    >
                      {isCopied ? (
                        <CheckCheck size={12} className="text-[var(--color-green)]" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  )}
                  <ArrowUpRight aria-hidden="true" size={14} className="text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
                </div>
              </motion.a>
            )
          })}
        </motion.div>

        {/* Right Column: Transmission Form (Cols 6-12) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="lg:col-span-7"
        >
          <TiltCard
            tiltMaxAngle={4}
            className="bento-card p-5 sm:p-6 space-y-4 bg-[var(--color-paper-2)] border border-[var(--color-rule)] hover:border-[var(--color-rule-2)]"
          >
            <form onSubmit={onSubmit} className="space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-[var(--color-rule)] font-measured text-xs text-[var(--color-muted)]">
                <span>Send a message</span>
                <span className="chip-green font-medium">Usually replies within 24h</span>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="name-input" className="block text-xs font-semibold text-[var(--color-ink)] mb-1 font-sans">
                    Your full name or organization
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="e.g. Rohan Mehta, Engineering Manager"
                    className="w-full bg-[var(--color-paper-3)] border border-[var(--color-rule)] rounded-[var(--radius-pill)] px-3.5 py-2 text-xs sm:text-sm text-[var(--color-ink)] placeholder-[var(--color-muted)]/60 outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus:border-[var(--color-rule-2)] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email-input" className="block text-xs font-semibold text-[var(--color-ink)] mb-1 font-sans">
                    Direct contact email
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="rohan@company.com"
                    className="w-full bg-[var(--color-paper-3)] border border-[var(--color-rule)] rounded-[var(--radius-pill)] px-3.5 py-2 text-xs sm:text-sm text-[var(--color-ink)] placeholder-[var(--color-muted)]/60 outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus:border-[var(--color-rule-2)] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="message-input" className="block text-xs font-semibold text-[var(--color-ink)] mb-1 font-sans">
                    Project or opportunity brief
                  </label>
                  <textarea
                    id="message-input"
                    name="message"
                    rows={3}
                    value={form.message}
                    onChange={onChange}
                    placeholder="Tell me about your project, team, or opportunity..."
                    className="w-full bg-[var(--color-paper-3)] border border-[var(--color-rule)] rounded-[var(--radius-card)] p-3 text-xs sm:text-sm text-[var(--color-ink)] placeholder-[var(--color-muted)]/60 outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus:border-[var(--color-rule-2)] transition-colors resize-y"
                  />
                </div>
              </div>

              {/* Status alerts */}
              {status === 'error' && (
                <div className="p-3.5 rounded-xl bg-[var(--color-paper-3)] border border-[var(--color-error)] text-xs text-[var(--color-error)] font-medium">
                  Please complete all required fields with a valid email address.
                </div>
              )}
              {status === 'success' && (
                <div className="p-3.5 rounded-xl bg-[var(--color-green-soft)] border border-[var(--color-green)] text-xs text-[var(--color-green)] flex items-center gap-2 font-medium">
                  <Check aria-hidden="true" size={15} />
                  <span>Message received! I&rsquo;ll get back to you within 24 hours.</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-[var(--color-rule)]">
                <span className="text-xs font-measured text-[var(--color-muted)]">
                  Direct email to rohitkumar66555666@gmail.com
                </span>
                <MagneticButton
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-cobalt-primary focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] disabled:opacity-50"
                >
                  <Send aria-hidden="true" size={14} />
                  <span>{status === 'loading' ? 'Sending...' : 'Send Message'}</span>
                </MagneticButton>
              </div>
            </form>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  )
}
