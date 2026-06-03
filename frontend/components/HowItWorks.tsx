'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  {
    num: '01',
    icon: '📥',
    title: 'Ticket Submitted',
    desc: 'A customer submits a support request via chat, email, or web form. It lands instantly in your live queue.',
    color: 'from-brand-500 to-brand-400',
    glow: 'rgba(99,102,241,0.15)',
    bg: 'from-brand-50 to-indigo-50',
    border: 'border-brand-100',
  },
  {
    num: '02',
    icon: '🧠',
    title: 'AI Classifies',
    desc: 'NLTK + scikit-learn analyzes the text, detects intent, classifies the category, and scores confidence in milliseconds.',
    color: 'from-cyan-500 to-cyan-400',
    glow: 'rgba(56,189,248,0.15)',
    bg: 'from-cyan-50 to-sky-50',
    border: 'border-cyan-100',
  },
  {
    num: '03',
    icon: '✍️',
    title: 'Response Generated',
    desc: 'The AI drafts a smart, context-aware reply. Agents review, edit if needed, and send in one click.',
    color: 'from-violet-500 to-violet-400',
    glow: 'rgba(168,85,247,0.15)',
    bg: 'from-violet-50 to-purple-50',
    border: 'border-violet-100',
  },
  {
    num: '04',
    icon: '✅',
    title: 'Resolved & Logged',
    desc: 'The ticket is marked resolved, stored in SQLite, and fed back to continuously improve the model.',
    color: 'from-emerald-500 to-teal-400',
    glow: 'rgba(16,185,129,0.15)',
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-100',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="how-it-works" className="section-padding container-max">
      {/* Header */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
          <span className="text-[11px] font-semibold text-brand-600 uppercase tracking-widest">Process</span>
        </div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] text-slate-900 tracking-tight mb-4">
          How it works
        </h2>
        <p className="text-[15px] text-slate-500 font-light max-w-md mx-auto">
          From raw support request to resolved ticket — four elegant steps powered by AI.
        </p>
      </motion.div>

      {/* Desktop timeline */}
      <div className="hidden md:block relative">
        {/* Connector line */}
        <div className="absolute top-11 left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-px">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            className="h-full origin-left"
            style={{
              background: 'linear-gradient(to right, rgba(99,102,241,0.3), rgba(56,189,248,0.3), rgba(168,85,247,0.3), rgba(16,185,129,0.3))',
            }}
          />
        </div>

        <div className="grid grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.13, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex flex-col items-center text-center group"
            >
              {/* Circle */}
              <div className="relative mb-6">
                <div className={`w-[88px] h-[88px] rounded-full bg-gradient-to-br ${step.bg} border-4 border-white shadow-[0_8px_24px_rgba(0,0,0,0.07)] flex items-center justify-center text-3xl z-10 group-hover:scale-105 transition-transform duration-300`}>
                  {step.icon}
                </div>
                {/* Step badge */}
                <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.15)] z-20`}>
                  <span className="text-white text-[10px] font-bold">{i + 1}</span>
                </div>
                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${step.glow}, transparent 70%)`, filter: 'blur(8px)' }}
                />
              </div>
              <h3 className="text-[14px] font-semibold text-slate-900 mb-2 tracking-tight">{step.title}</h3>
              <p className="text-[12px] text-slate-500 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-4 glass-card border border-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.bg} flex items-center justify-center text-2xl flex-shrink-0 border border-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]`}>
              {step.icon}
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 mb-0.5 tracking-wider">{step.num}</div>
              <div className="text-[13.5px] font-semibold text-slate-900 mb-1 tracking-tight">{step.title}</div>
              <div className="text-[12px] text-slate-500 leading-relaxed">{step.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}