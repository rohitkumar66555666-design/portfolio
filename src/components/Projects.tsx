import React, { useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Github, ExternalLink, X, Brain, Zap, MapPin, Camera, ChevronRight } from 'lucide-react'

const PROJECTS = [
  {
    id: 1,
    title: 'Hermes 3 — Intelligent RAG Agent',
    subtitle: 'Zero-cloud local document intelligence',
    description: 'Intelligent local RAG pipeline using LangChain, Hermes 3 LLM, ChromaDB, BAAI/bge-small embeddings, Ollama, and Streamlit. Fully private, zero-cloud document QA system.',
    tags: ['AI Systems'],
    tech: ['LangChain', 'Hermes 3 LLM', 'ChromaDB', 'Ollama', 'BAAI Embeddings', 'Streamlit', 'Python'],
    features: ['Local LLM inference via Ollama — no cloud dependency','ChromaDB vector store with BAAI/bge-small embeddings','Multi-document RAG with citation-aware retrieval','Streamlit UI for drag-and-drop document ingestion','Sub-second query latency on consumer hardware'],
    githubLink: '#', demoLink: '#', color: '#06b6d4', Icon: Brain,
    image: 'https://placehold.co/700x400/020408/06b6d4?text=Hermes+3+RAG',
    gradient: 'from-[#06b6d4]/20 via-transparent to-transparent',
  },
  {
    id: 2,
    title: 'AI Reels Idea Generator SaaS',
    subtitle: 'Viral content automation platform',
    description: 'Creator dashboard automating script, hook, and hashtag generation with prompt-driven tone switching.',
    tags: ['AI Systems', 'SaaS'],
    tech: ['React', 'OpenAI API', 'Groq API', 'Node.js', 'Tailwind CSS'],
    features: ['GPT-4 powered hook + script generation in <3s','Tone switching: Educational, Funny, Viral, Motivational','Auto hashtag & caption generation per niche','Batch generation mode for content calendars','Export to clipboard, Notion, or Google Docs'],
    githubLink: 'https://github.com/rohitkumar66555666-design/viral-reel-generator-ai', demoLink: '#', color: '#a855f7', Icon: Zap,
    image: 'https://placehold.co/700x400/020408/a855f7?text=AI+Reels+Generator',
    gradient: 'from-[#a855f7]/20 via-transparent to-transparent',
  },
  {
    id: 3,
    title: 'Mawqif — Prayer Location Finder',
    subtitle: '15+ screen Muslim traveller app',
    description: '15+ screen prayer location app for Muslim travellers with GPS navigation, nearby mosque discovery, Supabase backend, PostgreSQL, and Google Maps API.',
    tags: ['Mobile Apps'],
    tech: ['React Native', 'Expo', 'Supabase', 'PostgreSQL', 'Google Maps API', 'TypeScript'],
    features: ['GPS-based real-time mosque & prayer space finder','15+ screens with smooth stack navigation','Supabase + PostgreSQL for location data backend','Google Maps API with custom markers & directions','Prayer time calculation by geolocation'],
    githubLink: 'https://github.com/rohitkumar66555666-design/Mawqif-Rohit', demoLink: '#', color: '#00ff88', Icon: MapPin,
    image: 'https://placehold.co/700x400/020408/00ff88?text=Mawqif+App',
    gradient: 'from-[#00ff88]/15 via-transparent to-transparent',
  },
  {
    id: 4,
    title: 'Photo Sharing Mobile App',
    subtitle: '10+ screen real-time social app',
    description: '10+ screen mobile app with real-time feeds, social following, Cloudinary media delivery, and smooth React Native UX.',
    tags: ['Mobile Apps'],
    tech: ['React Native', 'TypeScript', 'Node.js', 'Cloudinary', 'Express', 'MongoDB'],
    features: ['Real-time photo feed with infinite scroll','Follow/unfollow system with activity notifications','Cloudinary CDN for optimised image delivery','Full Node.js + Express REST API backend','MongoDB with optimised aggregation pipelines'],
    githubLink: 'https://github.com/rohitkumar66555666-design/Photosharing-App', demoLink: '#', color: '#ec4899', Icon: Camera,
    image: 'https://placehold.co/700x400/020408/ec4899?text=Photo+Sharing+App',
    gradient: 'from-[#ec4899]/15 via-transparent to-transparent',
  },
]
const CATEGORIES = ['All','AI Systems','Mobile Apps','SaaS']
type Project = typeof PROJECTS[0]

// ── Floating 3D Project Card — hover-lift physics + dynamic lighting + glassmorphism ──
const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => {
  const { Icon } = project
  const cardRef = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const [hovered, setHovered] = useState(false)
  const [glare, setGlare] = useState({ x: 50, y: 50 })

  // 3D tilt physics — mouse position → rotateX/Y with spring
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 260, damping: 22 })
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 260, damping: 22 })
  const zTitle = useSpring(hovered ? 28 : 0, { stiffness: 300, damping: 20 })
  // useTransform for translateZ string
  const tTitle = useTransform(zTitle, v => `translateZ(${v}px)`)
  const zBadge = useSpring(hovered ? 18 : 0, { stiffness: 300, damping: 20 })
  const tBadge = useTransform(zBadge, v => `translateZ(${v}px)`)

  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width - 0.5
    const ny = (e.clientY - r.top) / r.height - 0.5
    mx.set(nx); my.set(ny)
    setGlare({ x: ((e.clientX - r.left)/r.width)*100, y: ((e.clientY - r.top)/r.height)*100 })
  }
  const onLeave = () => { mx.set(0); my.set(0); setHovered(false) }

  return (
    <motion.div
      ref={cardRef}
      className="relative cursor-pointer"
      style={{ perspective: 1200 }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          rotateX: rotX, rotateY: rotY,
          transformStyle: 'preserve-3d',
          background: 'rgba(13,17,23,0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${hovered ? project.color + '55' : 'rgba(255,255,255,0.08)'}`,
          boxShadow: hovered ? `0 0 32px ${project.color}35, 0 16px 48px rgba(0,0,0,0.55)` : '0 8px 32px rgba(0,0,0,0.4)',
        }}
        whileHover={{ scale: 1.015 }}
        transition={{ type:'spring', stiffness:300, damping:20 }}
      >
        {/* Glass highlight top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
        {/* Dynamic lighting — radial glare follows cursor */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-200"
            style={{ background: `radial-gradient(400px circle at ${glare.x}% ${glare.y}%, ${project.color}18, transparent 55%)`, opacity: 1 }}
          />
        )}

        {/* Preview — floating, canvas texture vibe */}
        <motion.div className="relative overflow-hidden h-48" style={{ transform: 'translateZ(0)' }}>
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" style={{ transform: hovered ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.7s ease' }} />
          <div className={`absolute inset-0 bg-gradient-to-t ${project.gradient} to-[#020408]/40`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent" />

          {/* Floating icon badge */}
          <motion.div className="absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: project.color + '22', border: `1px solid ${project.color}44`, transform: 'translateZ(20px)' }}>
            <Icon size={16} style={{ color: project.color }} />
          </motion.div>
          <div className="absolute top-3 right-3 w-2 h-2 rounded-full animate-pulse" style={{ background: project.color, boxShadow: `0 0 8px ${project.color}` }} />

          {/* Hover light sweep */}
          {hovered && <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `linear-gradient(110deg, transparent 30%, ${project.color}55 50%, transparent 70%)`, animation: 'shimmer 1.2s ease' }} />}
        </motion.div>

        {/* Content — glassmorphism overlay, floating layers */}
        <div className="p-5 relative">
          <motion.div style={{ transform: tBadge }} className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.map(t => (
              <span key={t} className="text-[11px] px-2.5 py-1 rounded-full font-semibold tracking-wide" style={{ background: project.color + '18', color: project.color, border: `1px solid ${project.color}22` }}>{t}</span>
            ))}
          </motion.div>

          <motion.div style={{ transform: tTitle }}>
            <h3 className="text-[15px] font-black text-[#e8edf5] leading-snug">{project.title}</h3>
            <p className="text-xs font-mono mt-1" style={{ color: project.color + 'cc' }}>{project.subtitle}</p>
            <p className="text-[#8892a4] text-sm mt-2 line-clamp-2 leading-relaxed">{project.description}</p>
          </motion.div>

          <motion.div className="flex flex-wrap gap-1.5 mt-4" style={{ transform: tBadge }}>
            {project.tech.slice(0,4).map(t => <span key={t} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[#8892a4] backdrop-blur">{t}</span>)}
            {project.tech.length>4 && <span className="text-xs text-[#5a6478] py-1">+{project.tech.length-4}</span>}
          </motion.div>

          <div className="flex items-center gap-3 mt-4">
            {project.githubLink !== '#' && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} className="flex items-center gap-1.5 text-xs glass px-3 py-1.5 rounded-full border border-white/10 text-[#5a6478] hover:text-[#e8edf5] backdrop-blur-xl bg-white/5">
                <Github size={12} />Code
              </a>
            )}
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold font-mono" style={{ color: project.color }}>
              View <ChevronRight size={12} />
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const HoloModal: React.FC<{ project: Project; onClose: () => void }> = ({ project, onClose }) => {
  const { Icon } = project
  React.useEffect(()=>{ const prev=document.body.style.overflow; document.body.style.overflow='hidden'; return()=>{document.body.style.overflow=prev} },[])
  React.useEffect(()=>{ const k=(e:KeyboardEvent)=> e.key==='Escape'&&onClose(); window.addEventListener('keydown',k); return()=>window.removeEventListener('keydown',k)},[onClose])
  const modal = (
    <motion.div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-slate-900/90 shadow-2xl backdrop-blur-xl border border-white/10" style={{ borderColor: project.color+'44', boxShadow:`0 0 80px ${project.color}25` }} initial={{scale:0.92,y:20,opacity:0}} animate={{scale:1,y:0,opacity:1}} exit={{scale:0.95,opacity:0}} transition={{type:'spring',stiffness:300,damping:26}} onClick={e=>e.stopPropagation()}>
        <div className="relative h-52 overflow-hidden">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] to-transparent" />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 backdrop-blur border border-white/15 text-white" aria-label="Close"><X size={14} /></button>
          <div className="absolute bottom-4 left-5 w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-xl bg-white/10 border border-white/15" style={{ borderColor: project.color+'55' }}><Icon size={20} style={{color:project.color}} /></div>
        </div>
        <div className="p-7">
          <div className="flex flex-wrap gap-1.5 mb-3">{project.tags.map(t=><span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{background:project.color+'18',color:project.color}}>{t}</span>)}</div>
          <h2 className="text-2xl font-black text-[#e8edf5]">{project.title}</h2>
          <p className="text-sm font-mono mt-1" style={{color:project.color+'cc'}}>{project.subtitle}</p>
          <p className="text-[#8892a4] text-sm leading-relaxed mt-3">{project.description}</p>
          <div className="mt-6"><p className="text-xs font-mono uppercase tracking-widest text-[#5a6478] mb-3">Tech Stack</p><div className="flex flex-wrap gap-2">{project.tech.map(t=><span key={t} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#8892a4]">{t}</span>)}</div></div>
          <div className="flex gap-3 mt-7">
            {project.githubLink!=='#' && <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 rounded-full font-bold glass backdrop-blur-xl bg-white/5 border border-white/10 text-[#e8edf5] flex items-center justify-center gap-2 text-sm"><Github size={14}/>Source</a>}
            {project.demoLink!=='#' && <a href={project.demoLink} className="flex-1 py-3 rounded-full font-bold text-[#020408] flex items-center justify-center gap-2 text-sm" style={{background:`linear-gradient(135deg,${project.color},${project.color}aa)`}}><ExternalLink size={14}/>Live Demo</a>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
  return ReactDOM.createPortal(modal, document.body)
}

export const Projects: React.FC = () => {
  const [filter,setFilter]=useState('All')
  const [selected,setSelected]=useState<Project|null>(null)
  const filtered = filter==='All' ? PROJECTS : PROJECTS.filter(p=>p.tags.includes(filter))
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <motion.div className="text-center mb-14" initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
        <span className="section-label tracking-widest text-xs font-mono text-[#5a6478]">WHAT I'VE BUILT</span>
        <h2 className="text-4xl md:text-6xl font-black mt-3 text-[#e8edf5]">Featured <span style={{background:'linear-gradient(135deg,#06b6d4,#a855f7)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Projects</span></h2>
        <p className="text-[#5a6478] text-sm mt-3 max-w-2xl mx-auto">Hover-lift 3D screens • dynamic lighting • glassmorphism — each card is a floating device.</p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {CATEGORIES.map(cat=>(
          <button key={cat} onClick={()=>setFilter(cat)} className={`px-6 py-2 rounded-full text-sm font-mono font-medium transition-all border ${filter===cat ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-[#020408] border-transparent shadow-lg shadow-cyan-500/20' : 'glass bg-white/5 backdrop-blur-xl border-white/10 text-[#5a6478] hover:text-[#e8edf5] hover:border-white/15'}`}>{cat}</button>
        ))}
      </div>

      <motion.div layout className="grid md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map(p=>(
            <motion.div key={p.id} layout initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.96}} transition={{duration:0.35}}>
              <ProjectCard project={p} onClick={()=>setSelected(p)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>{selected && <HoloModal project={selected} onClose={()=>setSelected(null)} />}</AnimatePresence>
    </section>
  )
}
