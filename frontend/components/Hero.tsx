'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const metrics = [
  { label: 'Tickets', value: '1,284', delta: '↑ 12%', color: 'text-brand-500' },
  { label: 'Resolved', value: '1,091', delta: '85% rate', color: 'text-emerald-500' },
  { label: 'AI Conf.', value: '94%', delta: '↑ avg', color: 'text-violet-500' },
  { label: 'Response', value: '<2m', delta: '↓ 89%', color: 'text-cyan-500' },
]

const tickets = [
  { icon: '🔴', title: 'Payment gateway timeout', sub: 'Billing · 3 min ago', chip: 'High', chipClass: 'bg-red-50 text-red-500 border border-red-100' },
  { icon: '🟡', title: 'Cannot reset password', sub: 'Auth · 9 min ago', chip: 'Med', chipClass: 'bg-amber-50 text-amber-600 border border-amber-100' },
  { icon: '🤖', title: 'API rate limit question', sub: 'Tech · 14 min ago', chip: 'AI ✓', chipClass: 'bg-brand-50 text-brand-600 border border-brand-100' },
]

const confidences = [
  { label: 'Billing', pct: 96, color: 'from-brand-500 to-cyan-400' },
  { label: 'Technical', pct: 91, color: 'from-cyan-500 to-violet-400' },
  { label: 'Account', pct: 88, color: 'from-violet-500 to-pink-400' },
]

// Animated headline words
const words = ['intelligently', 'automated.']

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  useEffect(() => { setMounted(true) }, [])

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }
  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section id="hero" ref={sectionRef} className="relative pt-36 pb-20 overflow-hidden">
      <div className="container-max">

        {/* ── Text block ── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ y, opacity }}
          className="text-center mb-16 relative z-10"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 mb-7">
            <div className="relative flex items-center gap-2 glass border border-brand-200/50 rounded-full px-5 py-2 shadow-[0_2px_16px_rgba(99,102,241,0.12)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
              </span>
              <span className="text-[11px] font-semibold text-brand-600 tracking-widest uppercase">Now powered by NLP + scikit-learn</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-serif text-[clamp(2.8rem,7vw,5.5rem)] leading-[1.05] tracking-tight text-slate-900 mb-6 max-w-3xl mx-auto"
          >
            Customer support,{' '}
            <br className="hidden sm:block" />
            <span
              className="relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #38BDF8 45%, #A855F7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              intelligently automated.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp}
            className="text-[16px] md:text-[17px] text-slate-500 font-light leading-relaxed max-w-xl mx-auto mb-10 tracking-[-0.01em]"
          >
            AI-powered ticket classification, smart responses, and real-time analytics —
            all in one elegant platform built for modern support teams.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 flex-wrap">
            <motion.a
              href="#demo"
              whileHover={{ scale: 1.04, boxShadow: '0 0 48px rgba(99,102,241,0.45)' }}
              whileTap={{ scale: 0.97 }}
              className="relative bg-gradient-to-r from-brand-500 to-brand-600 text-white text-[14px] font-semibold px-8 py-3.5 rounded-[12px] shadow-[0_8px_28px_rgba(99,102,241,0.38)] overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              Start Free Trial →
            </motion.a>
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.9)' }}
              whileTap={{ scale: 0.98 }}
              className="glass-dark text-slate-700 text-[14px] font-medium px-8 py-3.5 rounded-[12px] border border-slate-200/60 hover:border-brand-200/60 transition-all duration-200"
            >
              ▶ Watch Demo
            </motion.a>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 mt-8 flex-wrap">
            {['No credit card required', '14-day free trial', '94% AI accuracy'].map((badge) => (
              <div key={badge} className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-[12px] text-slate-500 font-medium">{badge}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Dashboard mockup ── */}
        <motion.div
          initial={{ opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Background glow */}
          <div className="absolute inset-x-8 -top-12 h-40 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(99,102,241,0.18), rgba(56,189,248,0.12) 40%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Floating stat cards — left */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, -1, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden lg:block absolute -left-14 top-12 z-20"
          >
            <div className="glass-card rounded-2xl p-4 shadow-[0_12px_40px_rgba(99,102,241,0.18)] w-52">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <span className="text-sm">⚡</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-600">AI Response</span>
              </div>
              <div className="text-2xl font-semibold text-slate-900 mb-1">&lt;2 min</div>
              <div className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                <span>↓ 89% faster</span>
                <div className="flex-1 h-1 bg-emerald-100 rounded-full ml-1">
                  <div className="h-full w-[89%] bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating confidence card — right */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 1, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="hidden lg:block absolute -right-12 top-8 z-20"
          >
            <div className="glass-card rounded-2xl p-4 shadow-[0_12px_40px_rgba(168,85,247,0.18)] w-48">
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">AI Confidence</div>
              <div className="text-3xl font-semibold text-slate-900 mb-3">94%</div>
              <div className="space-y-1.5">
                {confidences.map(c => (
                  <div key={c.label} className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400 w-12">{c.label}</span>
                    <div className="flex-1 h-1 bg-slate-100 rounded-full">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${c.pct}%` }}
                        transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r ${c.color}`}
                      />
                    </div>
                    <span className="text-[9px] font-semibold text-slate-500">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* AI pulse badge — bottom right */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
            className="hidden lg:flex absolute -right-4 bottom-10 z-20 items-center gap-2.5 glass-card rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(99,102,241,0.2)]"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-cyan-400 flex items-center justify-center text-sm">🤖</div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-700">AI Agent</div>
              <div className="text-[9px] text-emerald-500 font-medium">● Processing ticket…</div>
            </div>
          </motion.div>

          {/* Main dashboard card */}
          <div className="glass-card border border-white rounded-3xl shadow-[0_32px_80px_rgba(99,102,241,0.15),0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Mac window bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100/80 bg-white/40">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-1.5 bg-slate-100/60 rounded-full px-4 py-1">
                  <span className="text-[10px] text-slate-400">🔒</span>
                  <span className="text-[10px] text-slate-400 font-medium">app.aismartassistant.ai — Dashboard</span>
                </div>
              </div>
            </div>

            <div className="p-5">
              {/* Metric row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {metrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-white/90 border border-slate-100 rounded-2xl p-3.5 hover:border-brand-200/50 hover:shadow-[0_4px_20px_rgba(99,102,241,0.1)] transition-all duration-200 group"
                  >
                    <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">{m.label}</div>
                    <div className="text-[22px] font-semibold text-slate-900 tracking-tight leading-none mb-1">{m.value}</div>
                    <div className={`text-[10px] font-semibold ${m.color}`}>{m.delta}</div>
                  </motion.div>
                ))}
              </div>

              {/* Body */}
              <div className="grid md:grid-cols-[1.5fr_1fr] gap-3">
                {/* Tickets list */}
                <div className="bg-white/80 border border-slate-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-slate-700">Live Ticket Queue</span>
                    <span className="text-[9px] bg-brand-50 text-brand-500 font-semibold px-2 py-0.5 rounded-full border border-brand-100">3 active</span>
                  </div>
                  {tickets.map((t, i) => (
                    <motion.div
                      key={t.title}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.75 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-none group/row hover:bg-slate-50/50 rounded-xl px-1 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-xs flex-shrink-0">{t.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium text-slate-800 truncate">{t.title}</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">{t.sub}</div>
                      </div>
                      <span className={`text-[9px] font-semibold px-2 py-1 rounded-full flex-shrink-0 ${t.chipClass}`}>{t.chip}</span>
                    </motion.div>
                  ))}
                </div>

                {/* AI Confidence bars */}
                <div className="bg-white/80 border border-slate-100 rounded-2xl p-4">
                  <div className="text-[11px] font-semibold text-slate-700 mb-4">AI Confidence by Category</div>
                  <div className="space-y-3">
                    {[
                      { label: 'Billing', pct: 96, color: 'from-brand-500 to-brand-400' },
                      { label: 'Technical', pct: 91, color: 'from-cyan-500 to-cyan-400' },
                      { label: 'Account', pct: 88, color: 'from-violet-500 to-violet-400' },
                      { label: 'General', pct: 82, color: 'from-emerald-500 to-emerald-400' },
                      { label: 'Product', pct: 79, color: 'from-amber-500 to-amber-400' },
                    ].map((c, i) => (
                      <div key={c.label} className="flex items-center gap-2.5">
                        <span className="text-[9px] text-slate-500 w-14 flex-shrink-0 font-medium">{c.label}</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${c.pct}%` }}
                            transition={{ duration: 1.1, delay: 0.8 + i * 0.1, ease: 'easeOut' }}
                            className={`h-full rounded-full bg-gradient-to-r ${c.color}`}
                          />
                        </div>
                        <span className="text-[9px] font-semibold text-slate-600 w-7 text-right">{c.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom glow */}
          <div className="absolute inset-x-20 -bottom-8 h-16 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12), transparent 70%)',
              filter: 'blur(16px)',
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}