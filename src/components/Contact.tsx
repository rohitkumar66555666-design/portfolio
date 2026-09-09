import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, Linkedin, Twitter, Send, Check, MapPin } from 'lucide-react'

const IgIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
)

type Status = 'idle' | 'loading' | 'success' | 'error'

const QUICK_LINKS = [
  { label: 'Email', value: 'rohitkumar66555666@gmail.com', href: 'mailto:rohitkumar66555666@gmail.com', color: '#06b6d4', ig: false },
  { label: 'Call / WhatsApp', value: '+91 6299798907', href: 'tel:+916299798907', color: '#00ff88', ig: false },
  { label: 'LinkedIn', value: 'rohit-kumar-a2979839b', href: 'https://linkedin.com/in/rohit-kumar-a2979839b', color: '#0a66c2', ig: false },
  { label: 'Twitter / X', value: '@RohitBawa26', href: 'https://x.com/RohitBawa26', color: '#1da1f2', ig: false },
  { label: 'Instagram', value: '@rohitbawahightech', href: 'https://instagram.com/rohitbawahightech', color: '#ec4899', ig: true },
]

const LINK_ICONS: Record<string, React.ReactNode> = {
  'Email': <Mail size={15}/>,
  'Call / WhatsApp': <Phone size={15}/>,
  'LinkedIn': <Linkedin size={15}/>,
  'Twitter / X': <Twitter size={15}/>,
  'Instagram': <IgIcon size={15}/>,
}

export const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [focused, setFocused] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { setStatus('error'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setStatus('error'); return }
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    }, 1500)
  }

  const fieldCls = (n: string) =>
    `w-full bg-[#0d1117] border rounded-xl px-4 py-3.5 text-[#e8edf5] placeholder-[#5a6478] outline-none transition-all duration-300 text-sm ${
      focused === n
        ? 'border-[#06b6d4] shadow-[0_0_20px_rgba(6,182,212,0.2)]'
        : 'border-[#1a2030]'
    }`

  return (
    <section className="py-32 px-6 max-w-5xl mx-auto">
      <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <span className="section-label">GET IN TOUCH</span>
        <h2 className="text-4xl md:text-6xl font-black mt-3 text-[#e8edf5]">
          Let's{' '}
          <span style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Connect</span>
        </h2>
        <p className="text-[#5a6478] mt-4 flex items-center justify-center gap-1.5 text-sm font-mono">
          <MapPin size={12}/>Maharashtra, India · Available for remote worldwide
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Links */}
        <motion.div className="lg:col-span-2 space-y-3" initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="text-[#5a6478] text-sm leading-relaxed mb-6">
            Have a project in mind or want to collaborate? Reach out — I respond within 24 hours.
          </p>

          {QUICK_LINKS.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-4 glass px-5 py-3.5 rounded-2xl group"
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.2 }}
              whileHover={{ x: 5, boxShadow: s.ig ? '0 0 20px rgba(236,72,153,0.6)' : `0 0 20px ${s.color}25` }}
            >
              <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: s.color + '1a', color: s.color }}>
                {LINK_ICONS[s.label]}
              </span>
              <div className="min-w-0">
                <p className="text-[#5a6478] text-xs group-hover:text-[#e8edf5] transition-colors font-medium">{s.label}</p>
                <p className="text-xs truncate font-mono" style={{ color: s.color }}>{s.value}</p>
              </div>
              <span className="ml-auto text-[#1a2030] group-hover:text-[#06b6d4] transition-colors text-sm flex-shrink-0">→</span>
            </motion.a>
          ))}
        </motion.div>

        {/* Form */}
        <motion.div className="lg:col-span-3" initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div key="success"
                className="glass rounded-3xl p-12 flex flex-col items-center justify-center text-center min-h-[420px]"
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}>
                <motion.div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                  style={{ background: 'rgba(6,182,212,0.12)' }}
                  animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <Check size={38} className="text-[#06b6d4]" />
                </motion.div>
                <h3 className="text-2xl font-black text-[#e8edf5] mb-2">Message Sent!</h3>
                <p className="text-[#5a6478] text-sm">
                  I'll reply within 24 hours at<br/>
                  <span className="text-[#06b6d4] font-mono">rohitkumar66555666@gmail.com</span>
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={onSubmit}
                className="glass rounded-3xl overflow-hidden"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="h-px shimmer-border" />
                <div className="p-8 space-y-5">
                  {[
                    { id: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe' },
                    { id: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                  ].map(f => (
                    <div key={f.id}>
                      <label className="block text-xs text-[#5a6478] mb-2 font-mono uppercase tracking-widest">{f.label}</label>
                      <input type={f.type} name={f.id} value={form[f.id as keyof typeof form]}
                        onChange={onChange} onFocus={() => setFocused(f.id)} onBlur={() => setFocused(null)}
                        placeholder={f.placeholder} className={fieldCls(f.id)} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-[#5a6478] mb-2 font-mono uppercase tracking-widest">Message</label>
                    <textarea name="message" value={form.message} onChange={onChange}
                      onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                      placeholder="Tell me about your project or idea..." rows={5}
                      className={fieldCls('message') + ' resize-none'} />
                  </div>

                  {status === 'error' && (
                    <motion.p className="text-[#ff6b6b] text-sm font-mono"
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                      Please fill all fields with a valid email.
                    </motion.p>
                  )}

                  <motion.button type="submit" disabled={status === 'loading'}
                    className="w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2 text-[#020408]"
                    style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)' }}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(6,182,212,0.45)' }}
                    whileTap={{ scale: 0.98 }}>
                    {status === 'loading' ? (
                      <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-[#020408] border-t-transparent rounded-full" />
                    ) : (
                      <><Send size={15}/>Send Message</>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
