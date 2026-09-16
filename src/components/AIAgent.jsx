import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send } from 'lucide-react'

/* ════════════════════════════════════════════════════════════════════
   Local Knowledge Base — offline fallback for Rohit's AI assistant.

   The canonical persona/system prompt lives in src/config/aiProfile.js
   (ROHIT_PROFILE_CONTEXT) and is injected server-side by api/chat.js in
   the real Groq LLM call. This KB mirrors the same resume facts so the
   widget keeps working when the API is unavailable or unconfigured.
   ════════════════════════════════════════════════════════════════════ */

const KB = [
  {
    topic: 'Greeting',
    keywords: ['hi', 'hello', 'hey', 'yo', 'namaste', 'good morning', 'good afternoon', 'good evening'],
    answer:
      "Hey there! 👋 I'm Rohit's AI career representative.\n\nAsk me about his skills, experience, projects, education — or how to hire him!",
  },
  {
    topic: 'About Rohit',
    keywords: ['who', 'about', 'rohit', 'yourself', 'bio', 'intro', 'background', 'bawa', 'kumar ram'],
    answer:
      "🤖 Rohit Kumar Ram is a Full Stack, Mobile & AI Developer who ships production-grade, user-obsessed products.\n\nHe's pursuing a B.Sc. in Software Development at Tata Institute of Social Sciences (TISS) and already builds real AI tools and client apps — from zero-cloud RAG agents to React Native products with thousands of screens' worth of production logic.\n\nThis portfolio? Built with React, Three.js and a lot of ☕.",
  },
  {
    topic: 'Skills & Tech Stack',
    keywords: [
      'skill', 'tech stack', 'stack', 'technolog', 'python', 'react', 'javascript',
      'typescript', 'prompt', 'rag', 'langchain', 'ollama', 'chromadb', 'full stack',
      'full-stack', 'fullstack', 'react native', 'node', 'supabase', 'postgres',
      'firebase', 'framework', 'language', 'tools', 'coding', 'programming', 'develop',
    ],
    answer:
      "🧠 Rohit's technical stack:\n\n• AI & LLM — LangChain, RAG systems, OpenAI / Groq / Claude APIs, Ollama, ChromaDB, agentic workflows\n• Mobile & Frontend — React Native, React, JavaScript, TypeScript, HTML, CSS\n• Backend & Databases — Node.js, Python, SQL, PostgreSQL, Supabase, Firebase, REST APIs\n\nHe specializes in turning ideas into working AI products fast — ask about his projects to see it in action!",
  },
  {
    topic: 'Experience',
    keywords: [
      'experience', 'work', 'job', 'intern', 'internship', 'appopoleis', 'integrate 360',
      'company', 'studio', 'employ', 'career', 'role', 'position', 'professional', 'currently', 'client',
    ],
    answer:
      "💼 Rohit's professional experience:\n\n1. 🤖 AI Developer Intern — Appopoleis Studios (Sep 2024 – Present)\n   • Built a 10+ screen Photo Sharing Mobile App with real-time feeds, auth & Cloudinary media optimization\n   • Built Mawqif — a 15+ screen prayer-location app for Muslim travelers (React Native, TypeScript, Supabase, PostgreSQL, Google Maps API)\n   • Contributed to 3–5 production client web & mobile apps\n\n2. 💻 Software Developer Intern — Integrate 360 (Feb – Apr 2024)\n   • Built responsive web apps with React, JavaScript, HTML & CSS; resolved legacy frontend bugs\n\nHe's eager for the next challenge — reach out via the Contact section or LinkedIn!",
  },
  {
    topic: 'Projects',
    keywords: [
      'project', 'built', 'reels', 'hermes', 'rag', 'zero-cloud', 'zero cloud',
      'mawqif', 'photo sharing', 'streamlit', 'generator', 'showcase', 'demo', 'case study', 'portfolio',
    ],
    answer:
      "🚀 Rohit's highlighted projects:\n\n1. 🧠 Hermes 3 — Intelligent RAG Agent System\n   A local zero-cloud RAG pipeline: Python, LangChain, Ollama, ChromaDB, HuggingFace embeddings & Streamlit. Fully private — no cloud dependency, no data leaks.\n\n2. 🎬 AI Reels Idea Generator\n   A creator-focused SaaS dashboard automating scripts, hooks & hashtags with prompt-driven tone switching.\n\nPlus production client apps like Mawqif (prayer-location app) shipped at Appopoleis Studios. Scroll to the Projects section to explore!",
  },
  {
    topic: 'Education',
    keywords: ['education', 'study', 'tiss', 'college', 'university', 'degree', 'b.sc', 'bsc', 'academ', 'school'],
    answer:
      "🎓 Rohit is pursuing a B.Sc. in Software Development at Tata Institute of Social Sciences (TISS).\n\nHe pairs strong academic foundations with hands-on production experience — shipping real AI tools and mobile apps while studying.",
  },
  {
    topic: 'Contact',
    keywords: [
      'contact', 'email', 'reach', 'linkedin', 'connect', 'phone', 'resume',
      'cv', 'github', 'social', 'hire', 'hiring', 'availability', 'touch', 'x.com', 'twitter',
    ],
    answer:
      "📬 Getting in touch is easy:\n\n• 📧 rohitkumar66555666@gmail.com\n• 💼 LinkedIn: linkedin.com/in/rohit-kumar-a2979839b\n• 🐦 X: x.com/RohitBawa26\n• Or scroll to the Contact section at the bottom of this page.\n\nRohit is always open to interesting AI, mobile & full-stack opportunities. Don't be shy! 🚀",
  },
]

const FALLBACK =
  "Hmm, that one's outside my knowledge base 🤔 — I'm tuned to pitch Rohit's skills, experience, projects and contact info.\n\nTry one of the quick topics below, or ask something like \"What can Rohit build for us?\""

const WELCOME =
  "Hi! 👋 I'm Rohit's AI career representative.\n\nAsk me about his skills, experience, projects — or how to hire him!"

const QUICK_REPLIES = [
  { label: '🧠 Skills', query: "What are Rohit's skills and tech stack?" },
  { label: '💼 Experience', query: "Tell me about Rohit's experience" },
  { label: '🚀 Projects', query: "Show me Rohit's projects" },
  { label: '🎓 Education', query: "Where did Rohit study?" },
  { label: '📬 Contact', query: 'How can I contact Rohit?' },
]

/* ── Fallback parser: keyword scoring with word-boundary safety ────── */

function getResponse(raw) {
  const normalized =
    ' ' +
    raw
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() +
    ' '

  let best = null
  let bestScore = 0
  for (const entry of KB) {
    let score = 0
    for (const kw of entry.keywords) {
      // short keywords ("hi", "rag") need word boundaries so they don't
      // match inside other words ("this", "storage")
      const hit =
        kw.length <= 3
          ? normalized.includes(' ' + kw + ' ')
          : normalized.includes(kw)
      if (hit) score += 1
    }
    if (score > bestScore) {
      bestScore = score
      best = entry
    }
  }
  return best ? best.answer : FALLBACK
}

/* ── LLM call via Vercel serverless proxy (api/chat.js) ──────────────
 * The server injects ROHIT_PROFILE_CONTEXT as the system message, so the
 * client only sends conversation history. If the function is missing
 * (e.g. plain `vite` dev), returns live:false, or errors → the widget
 * gracefully falls back to the local knowledge base above.
 * ──────────────────────────────────────────────────────────────────── */

async function fetchLLMReply(history) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: history.map((m) => ({
          role: m.from === 'user' ? 'user' : 'assistant',
          content: m.text,
        })),
      }),
    })
    if (!res.ok) return null
    const data = await res.json().catch(() => null)
    if (data?.live && typeof data.reply === 'string' && data.reply.trim() !== '') {
      return data.reply
    }
  } catch {
    /* endpoint absent or network error → fall back to KB */
  }
  return null
}

/* ════════════════════════════════════════════════════════════════════
   AIAgent — floating chat widget
   ════════════════════════════════════════════════════════════════════ */

const AvatarAI = () => (
  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-sm flex-shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
    🤖
  </div>
)

const AvatarUser = () => (
  <div className="w-7 h-7 rounded-lg bg-slate-700 border border-slate-600 flex items-center justify-center text-[11px] font-bold text-cyan-300 flex-shrink-0">
    R
  </div>
)

export const AIAgent = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ id: 1, from: 'ai', text: WELCOME }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const idRef = useRef(1)
  const messagesRef = useRef(messages)
  const mountedRef = useRef(true)
  const scrollRef = useRef(null)

  messagesRef.current = messages

  /* auto-scroll to latest message */
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing, open])

  /* Escape closes the chat */
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  /* guard async state updates after unmount */
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const send = useCallback(
    async (rawText) => {
      const text = (rawText || '').trim()
      if (!text || typing) return

      idRef.current += 1
      const userMsg = { id: idRef.current, from: 'user', text }
      const history = [...messagesRef.current, userMsg]
      setMessages(history)
      setInput('')
      setTyping(true)

      // 1) Try the real LLM (Groq via /api/chat, system prompt server-side)
      const llmReply = await fetchLLMReply(history.slice(-12))

      if (!mountedRef.current) return
      if (llmReply) {
        idRef.current += 1
        setMessages((prev) => [...prev, { id: idRef.current, from: 'ai', text: llmReply }])
        setTyping(false)
        return
      }

      // 2) Graceful fallback: local knowledge base with a human-ish pause
      await new Promise((resolve) => setTimeout(resolve, 650 + Math.random() * 550))
      if (!mountedRef.current) return

      idRef.current += 1
      setMessages((prev) => [...prev, { id: idRef.current, from: 'ai', text: getResponse(text) }])
      setTyping(false)
    },
    [typing]
  )

  return (
    <>
      {/* ── Floating Action Button ─────────────────────────────────── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="ai-fab"
            onClick={() => setOpen(true)}
            aria-label="Open Rohit's AI assistant chat"
            className="fixed bottom-16 right-4 sm:right-6 z-[9999] flex items-center gap-2 px-5 py-3.5 rounded-full font-semibold text-sm text-[#020408] bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 transition-colors"
            style={{ boxShadow: '0 0 24px rgba(6,182,212,0.55), 0 0 60px rgba(6,182,212,0.25), 0 8px 24px rgba(0,0,0,0.4)' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border-2 border-cyan-400 pointer-events-none"
              animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
            <span className="text-lg leading-none">🤖</span>
            <span className="whitespace-nowrap">Ask Rohit&apos;s AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Window ────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="ai-chat"
            role="dialog"
            aria-label="Rohit's AI assistant chat"
            className="fixed bottom-[136px] right-4 sm:right-6 z-[9999] w-[min(92vw,380px)] h-[min(68vh,540px)] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(6,182,212,0.18)' }}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/95 flex-shrink-0">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-lg flex-shrink-0 shadow-[0_0_16px_rgba(6,182,212,0.5)]">
                🤖
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">Rohit&apos;s AI Assistant</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">Online · replies instantly</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2 ${m.from === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {m.from === 'ai' ? <AvatarAI /> : <AvatarUser />}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line ${
                      m.from === 'user'
                        ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-2xl rounded-tr-sm shadow-[0_0_18px_rgba(6,182,212,0.35)]'
                        : 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-2xl rounded-tl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <AvatarAI />
                  <div className="bg-slate-800 border border-slate-700/60 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick replies + Input */}
            <div className="p-3 border-t border-slate-800 bg-slate-900/95 flex-shrink-0">
              <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => send(q.query)}
                    className="px-3 py-1.5 text-xs rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  send(input)
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about skills, projects, experience…"
                  aria-label="Message Rohit's AI assistant"
                  className="flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  aria-label="Send message"
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-[#020408] flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:shadow-[0_0_16px_rgba(6,182,212,0.5)] transition-shadow"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIAgent
