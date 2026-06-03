'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    icon: '🧠',
    title: 'NLP Classification',
    desc: 'NLTK-powered intent detection classifies every ticket in milliseconds with 94%+ accuracy — no manual tagging, ever again.',
    bg: 'from-brand-50 to-indigo-50',
    glow: 'rgba(99,102,241,0.18)',
    accent: 'from-brand-500 to-indigo-400',
    size: 'md:col-span-2 md:row-span-1',
    tag: '94% accuracy',
    tagColor: 'bg-brand-50 text-brand-600 border-brand-100',
  },
  {
    icon: '⚡',
    title: 'Instant AI Responses',
    desc: 'Context-aware draft replies that agents review and send in one click.',
    bg: 'from-cyan-50 to-sky-50',
    glow: 'rgba(56,189,248,0.18)',
    accent: 'from-cyan-500 to-sky-400',
    size: '',
    tag: '<2s draft',
    tagColor: 'bg-cyan-50 text-cyan-600 border-cyan-100',
  },
  {
    icon: '📊',
    title: 'Real-time Analytics',
    desc: 'Live dashboards with confidence scores, resolution rates, and trends.',
    bg: 'from-violet-50 to-purple-50',
    glow: 'rgba(168,85,247,0.18)',
    accent: 'from-violet-500 to-purple-400',
    size: '',
    tag: 'Live data',
    tagColor: 'bg-violet-50 text-violet-600 border-violet-100',
  },
  {
    icon: '💬',
    title: 'Conversational Chatbot',
    desc: 'Instant AI handles Tier-1 queries 24/7, escalating complex issues to human agents seamlessly.',
    bg: 'from-emerald-50 to-teal-50',
    glow: 'rgba(16,185,129,0.18)',
    accent: 'from-emerald-500 to-teal-400',
    size: '',
    tag: '24/7 uptime',
    tagColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    icon: '🔒',
    title: 'Secure Admin Panel',
    desc: 'Role-based access control and SQLite-backed persistent storage built for enterprise.',
    bg: 'from-amber-50 to-yellow-50',
    glow: 'rgba(245,158,11,0.18)',
    accent: 'from-amber-500 to-yellow-400',
    size: '',
    tag: 'RBAC',
    tagColor: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    icon: '🎯',
    title: 'Priority Routing',
    desc: 'Automatically escalate high-priority tickets to senior agents before customers get frustrated.',
    bg: 'from-rose-50 to-pink-50',
    glow: 'rgba(244,63,94,0.18)',
    accent: 'from-rose-500 to-pink-400',
    size: 'md:col-span-2',
    tag: 'Smart escalation',
    tagColor: 'bg-rose-50 text-rose-600 border-rose-100',
  },
]

// Mini animated bar chart for the analytics card
function MiniChart() {
  const heights = [40, 65, 45, 80, 55, 90, 70]
  return (
    <div className="flex items-end gap-1 h-10 mt-3">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 * i, ease: 'easeOut' }}
          className="flex-1 rounded-sm bg-gradient-to-t from-violet-400 to-purple-300 opacity-80"
          style={{ minHeight: 3 }}
        />
      ))}
    </div>
  )
}

// Mini typing effect for chatbot card
function TypingPreview() {
  return (
    <div className="mt-3 flex gap-1.5 items-center">
      <div className="flex gap-1">
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 block"
          />
        ))}
      </div>
      <span className="text-[10px] text-slate-400 font-medium">AI is typing…</span>
    </div>
  )
}

function FeatureCard({ f, i }: { f: typeof features[0]; i: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.25, ease: 'easeOut' } }}
      className={`group relative glass-card border border-white rounded-2xl p-6 overflow-hidden cursor-default ${f.size}`}
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.03)' }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(320px circle at 30% 20%, ${f.glow}, transparent 65%)` }}
      />

      {/* Gradient border on hover */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-white/60 transition-all duration-300 pointer-events-none" />

      {/* Top row */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`w-11 h-11 rounded-[12px] bg-gradient-to-br ${f.bg} flex items-center justify-center text-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-white group-hover:scale-110 transition-transform duration-300`}>
          {f.icon}
        </div>
        <span className={`text-[9px] font-semibold px-2.5 py-1 rounded-full border ${f.tagColor}`}>
          {f.tag}
        </span>
      </div>

      <h3 className="text-[15px] font-semibold text-slate-900 mb-2 relative z-10 tracking-tight">{f.title}</h3>
      <p className="text-[12.5px] text-slate-500 leading-relaxed relative z-10">{f.desc}</p>

      {/* Extra visual for select cards */}
      {f.title === 'Real-time Analytics' && (
        <div className="relative z-10"><MiniChart /></div>
      )}
      {f.title === 'Conversational Chatbot' && (
        <div className="relative z-10"><TypingPreview /></div>
      )}
      {f.title === 'NLP Classification' && (
        <div className="relative z-10 mt-4 flex items-center gap-2">
          {['Billing', 'Auth', 'Technical', 'General'].map((cat, j) => (
            <motion.span
              key={cat}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 + j * 0.08 }}
              className="text-[10px] font-medium bg-white/80 border border-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
            >
              {cat}
            </motion.span>
          ))}
        </div>
      )}

      {/* Accent line at bottom */}
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${f.accent} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />
    </motion.div>
  )
}

export default function Features() {
  const headerRef = useRef(null)
  const inView = useInView(headerRef, { once: true })

  return (
    <section id="features" className="section-padding container-max">
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
          <span className="text-[11px] font-semibold text-brand-600 uppercase tracking-widest">Core Features</span>
        </div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] text-slate-900 tracking-tight mb-4">
          Everything your support team needs
        </h2>
        <p className="text-[15px] text-slate-500 font-light max-w-md mx-auto leading-relaxed">
          Built on Python, NLTK, and scikit-learn — enterprise-grade AI wrapped in a beautifully simple interface.
        </p>
      </motion.div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
        {features.map((f, i) => (
          <FeatureCard key={f.title} f={f} i={i} />
        ))}
      </div>
    </section>
  )
}