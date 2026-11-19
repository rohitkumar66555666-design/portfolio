import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User } from 'lucide-react'

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
    keywords: ['who', 'about', 'rohit', 'yourself', 'bio', 'intro', 'background', 'bawa', 'kumar'],
    answer:
      "🤖 Rohit Kumar(Bawa) is a Full Stack, Mobile & AI Developer who ships production-grade, user-obsessed products.\n\nHe's pursuing a B.Sc. in Software Development at Tata Institute of Social Sciences (TISS) and already builds real AI tools and client apps — from zero-cloud RAG agents to React Native products with thousands of screens' worth of production logic.\n\nThis portfolio? Built with React, Three.js and a lot of ☕.",
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
      'kaam', 'kaha kaam', 'job history', 'work history', 'kis company',
    ],
    answer:
      "💼 Rohit's Professional Experience & Career Track:\n\n1. 🤖 AI Developer Intern — Appopoleis Studios (Mumbai) [Sep 2024 – Present]\n   • Specialization: Zero-cloud RAG pipelines, local LLM backends & private vector architectures.\n   • Mobile Engineering: Built client-facing React Native applications with real-time sync.\n   • Production Impact: Direct contributor to 3–5 commercial client deployments.\n\n2. 💻 Software Developer Intern — Integrate 360 (Mumbai) [Feb 2024 – Apr 2024]\n   • Frontend Engineering: Built responsive web interfaces with React, modern JavaScript & CSS.\n   • Code Architecture: Modularized component libraries to boost reusability and optimize load speed.\n\n3. 🎓 Academic Background — Tata Institute of Social Sciences (TISS) [2024 – Present]\n   • Pursuing B.Sc. in Software Development with specialization in full-stack & applied AI systems.\n\nWant to discuss engineering roles? Reach out via the Contact section or email!",
  },
  {
    topic: 'Projects',
    keywords: [
      'project', 'projects', 'built', 'reels', 'hermes', 'rag', 'zero-cloud', 'zero cloud',
      'mawqif', 'photo sharing', 'streamlit', 'generator', 'showcase', 'demo', 'case study', 'portfolio',
      'kya banaya', 'konsa app', 'apps', 'github repo', 'repositories',
    ],
    answer:
      "🚀 Rohit's Highlighted Engineering Projects:\n\n1. 🧠 Hermes 3: Intelligent Local RAG Agent (Flagship)\n   • Stack: LangChain, Hermes-3-8B LLM (Ollama), ChromaDB, BAAI/bge-small embeddings, Streamlit.\n   • Architecture: 100% private offline document QA, zero cloud egress, sub-second cosine lookup.\n\n2. 🎬 AI Reels Idea Generator SaaS\n   • Stack: React, OpenAI GPT-4, Groq sub-3s API, Node.js, Tailwind CSS.\n   • Architecture: Automated viral hook, script & hashtag generator with dynamic tone switching.\n\n3. 📍 Mawqif: Smart Prayer Location Mobile App\n   • Stack: React Native, Expo, Supabase, PostgreSQL, Google Maps API, TypeScript.\n   • Architecture: 15+ modular screens, real-time GPS navigation (< 1.2m delta), nearby mosque locator.\n\n4. 📸 Real-Time Photo Sharing Mobile Application\n   • Stack: React Native, TypeScript, Node.js, Express, Cloudinary CDN, MongoDB.\n   • Architecture: 10+ screens, infinite scroll feeds, social follow/unfollow system, fast aggregation queries.\n\nCheck the Projects section on this page to inspect live architecture specs!",
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

const KB_EXPERIENCE_AND_PROJECTS = `🎯 Executive Overview: Rohit's Work Experience & Projects

💼 Professional Work Experience:
1. 🤖 AI Developer Intern — Appopoleis Studios (Sep 2024 – Present)
   • Built offline RAG pipelines & private vector retrieval systems.
   • Shipped 2 major mobile apps (Mawqif 15+ screens & Photo Sharing 10+ screens).
   • Contributed to 3–5 commercial client deployments.
2. 💻 Software Developer Intern — Integrate 360 (Feb 2024 – Apr 2024)
   • Engineered responsive React web frontends and modular UI components.
3. 🎓 Academic Background — Tata Institute of Social Sciences (TISS)
   • B.Sc. in Software Development (2024 – Present).

🚀 Core Engineering Projects:
1. 🧠 Hermes 3 Local RAG Agent:
   • 100% private offline document QA using LangChain, Ollama (Hermes-3-8B) & ChromaDB.
2. 🎬 AI Reels Idea Generator SaaS:
   • Sub-3s viral hook, script & hashtag generation via Groq API & GPT-4.
3. 📍 Mawqif Mosque & Prayer Finder:
   • 15+ screen React Native mobile app with real-time GPS navigation & Supabase backend.
4. 📸 Real-Time Photo Sharing App:
   • 10+ screen React Native mobile application with Cloudinary media CDN & MongoDB.

You can inspect the Projects and Timeline sections on this page for live architecture diagrams and repos!`

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

/* Simulated "thinking" delay before any AI reply is revealed (ms) */
const TYPING_DELAY_MS = 800

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

  // Check for combined query (e.g. "experience n project", "experience and project", "kaam aur project")
  // Regex includes 'ecperien' to catch common user typo 'ecperience'
  const hasExperience = /(experien|ecperien|work|job|intern|career|kaam|company|kaha)/.test(normalized)
  const hasProjects = /(project|proj|projt|built|banaya|kya banaya|apps|app|software|saas)/.test(normalized)

  if (hasExperience && hasProjects) {
    return KB_EXPERIENCE_AND_PROJECTS
  }

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
  <div className="w-7 h-7 rounded bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-ink)] flex-shrink-0">
    <Bot size={15} aria-hidden="true" />
  </div>
)

const AvatarUser = () => (
  <div className="w-7 h-7 rounded bg-[var(--color-paper-3)] border border-[var(--color-rule)] flex items-center justify-center text-[var(--color-muted)] flex-shrink-0">
    <User size={15} aria-hidden="true" />
  </div>
)

export const AIAgent = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ id: 1, from: 'ai', text: WELCOME }])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const idRef = useRef(1)
  const messagesRef = useRef(messages)
  const mountedRef = useRef(true)
  const scrollRef = useRef(null)
  const timerRef = useRef(null)

  messagesRef.current = messages

  /* auto-scroll to latest message */
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isTyping, open])

  /* Escape closes the chat */
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  /* guard async state updates after unmount + clear pending reply timer */
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      clearTimeout(timerRef.current)
    }
  }, [])

  const send = useCallback(
    async (rawText) => {
      const text = (rawText || '').trim()
      if (!text || isTyping) return

      idRef.current += 1
      const userMsg = { id: idRef.current, from: 'user', text }
      const history = [...messagesRef.current, userMsg]
      setMessages(history)
      setInput('')

      // 1) Mark the AI as typing immediately
      setIsTyping(true)

      // 2) Resolve the reply (live LLM → local KB fallback) and hold it
      //    behind a fixed 5s setTimeout so the typing simulation feels real.
      //    The reply is revealed only once BOTH have completed.
      const fetchPromise = fetchLLMReply(history.slice(-12))
      const delayPromise = new Promise((resolve) => {
        timerRef.current = setTimeout(resolve, TYPING_DELAY_MS)
      })
      const [llmReply] = await Promise.all([fetchPromise, delayPromise])

      if (!mountedRef.current) return

      // 3) Append the AI response and stop the typing indicator
      idRef.current += 1
      setMessages((prev) => [
        ...prev,
        { id: idRef.current, from: 'ai', text: llmReply || getResponse(text) },
      ])
      setIsTyping(false)
    },
    [isTyping]
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
            className="fixed bottom-6 right-6 z-[999] btn-cobalt-primary shadow-lg shadow-black/40 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] motion-safe:active:scale-95"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Bot size={16} aria-hidden="true" />
            <span className="whitespace-nowrap font-medium">Ask AI Assistant</span>
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
            className="fixed bottom-6 right-6 z-[999] w-[min(92vw,380px)] h-[min(68vh,520px)] flex flex-col bento-card bg-[var(--color-paper-2)] overflow-hidden border border-[var(--color-rule-2)]"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--color-rule)] bg-[var(--color-paper-2)] flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-[var(--color-paper-3)] border border-[var(--color-rule-2)] flex items-center justify-center text-[var(--color-ink)] flex-shrink-0">
                <Bot size={16} aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--color-ink)] leading-tight">Rohit&apos;s AI Representative</p>
                <div className="flex items-center gap-1.5 mt-0.5 font-measured text-[11px] text-[var(--color-green)] font-medium">
                  <span>verified telemetry</span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="w-7 h-7 rounded flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-paper-3)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] motion-safe:active:scale-95 transition-colors"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--color-paper)]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2 ${m.from === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {m.from === 'ai' ? <AvatarAI /> : <AvatarUser />}
                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line rounded-xl ${m.from === 'user'
                      ? 'bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-medium'
                      : 'bg-[var(--color-paper-3)] text-[var(--color-ink)] border border-[var(--color-rule)]'
                      }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div
                  key="typing"
                  className="flex gap-2"
                >
                  <AvatarAI />
                  <div className="bg-[var(--color-paper-3)] border border-[var(--color-rule)] rounded-xl px-3 py-2 text-xs font-measured text-[var(--color-muted)]">
                    processing query response…
                  </div>
                </div>
              )}
            </div>

            {/* Quick replies + Input */}
            <div className="p-3.5 border-t border-[var(--color-rule)] bg-[var(--color-paper-2)] flex-shrink-0 space-y-2.5">
              <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q.label}
                    onClick={() => send(q.query)}
                    className="chip-neutral hover:border-[var(--color-accent)] hover:text-[var(--color-ink)] transition-colors whitespace-nowrap flex-shrink-0 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] motion-safe:active:scale-95 disabled:opacity-50"
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
                  placeholder="Ask about skills, projects, background..."
                  aria-label="Message Rohit's AI assistant"
                  className="flex-1 min-w-0 bg-[var(--color-paper-3)] border border-[var(--color-rule)] rounded-[var(--radius-pill)] px-3.5 py-2 text-xs text-[var(--color-ink)] placeholder-[var(--color-muted)]/60 outline-none focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus:border-[var(--color-rule-2)] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  aria-label="Send message"
                  className="w-9 h-9 rounded-full bg-[var(--color-accent)] text-[var(--color-accent-ink)] flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] motion-safe:active:scale-95 transition-opacity"
                >
                  <Send size={14} aria-hidden="true" />
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
