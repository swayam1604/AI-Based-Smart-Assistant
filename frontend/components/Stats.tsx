'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  {
    value: 50000,
    suffix: '+',
    prefix: '',
    label: 'Tickets Resolved',
    sublabel: 'and counting',
    icon: '🎫',
    color: 'from-brand-500 to-indigo-400',
    glow: 'rgba(99,102,241,0.15)',
    bg: 'from-brand-50 to-indigo-50',
  },
  {
    value: 94,
    suffix: '%',
    prefix: '',
    label: 'AI Accuracy',
    sublabel: 'classification rate',
    icon: '🎯',
    color: 'from-emerald-500 to-teal-400',
    glow: 'rgba(16,185,129,0.15)',
    bg: 'from-emerald-50 to-teal-50',
  },
  {
    value: 2,
    suffix: ' min',
    prefix: '<',
    label: 'Avg Response Time',
    sublabel: 'down from 18 min',
    icon: '⚡',
    color: 'from-cyan-500 to-sky-400',
    glow: 'rgba(56,189,248,0.15)',
    bg: 'from-cyan-50 to-sky-50',
  },
  {
    value: 200,
    suffix: '+',
    prefix: '',
    label: 'Businesses Trust Us',
    sublabel: 'worldwide',
    icon: '🌍',
    color: 'from-violet-500 to-purple-400',
    glow: 'rgba(168,85,247,0.15)',
    bg: 'from-violet-50 to-purple-50',
  },
]

function Counter({ value, suffix, prefix }: { value: number; suffix: string; prefix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 2000
    const step = value / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, value])

  return (
    <span ref={ref}>
      {prefix}{value >= 1000 ? count.toLocaleString() : count}{suffix}
    </span>
  )
}

export default function Stats() {
  const headerRef = useRef(null)
  const inView = useInView(headerRef, { once: true })

  return (
    <section id="analytics" className="section-padding container-max">
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
          <span className="text-[11px] font-semibold text-brand-600 uppercase tracking-widest">By the numbers</span>
        </div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] text-slate-900 tracking-tight mb-3">
          Trusted at scale
        </h2>
        <p className="text-[15px] text-slate-500 font-light max-w-sm mx-auto">
          Real impact, measured in the metrics that matter most.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group relative glass-card border border-white rounded-2xl p-6 text-center overflow-hidden"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl pointer-events-none"
              style={{ background: `radial-gradient(200px circle at 50% 50%, ${s.glow}, transparent 70%)` }}
            />

            {/* Icon */}
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.bg} flex items-center justify-center text-2xl mx-auto mb-4 border border-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] group-hover:scale-110 transition-transform duration-300`}>
              {s.icon}
            </div>

            {/* Number */}
            <div className={`font-serif text-[2.2rem] md:text-[2.6rem] font-semibold tracking-tight leading-none mb-1 bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}>
              <Counter value={s.value} suffix={s.suffix} prefix={s.prefix} />
            </div>

            {/* Label */}
            <div className="text-[13px] font-semibold text-slate-700 mt-2 mb-0.5 relative z-10">{s.label}</div>
            <div className="text-[11px] text-slate-400 font-medium relative z-10">{s.sublabel}</div>

            {/* Bottom accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${s.color} opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}