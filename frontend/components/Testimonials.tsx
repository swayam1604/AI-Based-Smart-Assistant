'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Head of Support',
    company: 'Acme Corp',
    avatar: 'PS',
    color: 'from-brand-400 to-brand-600',
    glow: 'rgba(99,102,241,0.15)',
    stars: 5,
    highlight: 'response time from 18 minutes to under 2',
    text: 'AI Smart Assistant cut our response time from 18 minutes to under 2. The NLP classification is eerily accurate — our team was skeptical at first, now they can\'t imagine working without it.',
  },
  {
    name: 'Marcus Chen',
    role: 'CTO',
    company: 'NovaTech',
    avatar: 'MC',
    color: 'from-cyan-400 to-cyan-600',
    glow: 'rgba(56,189,248,0.15)',
    stars: 5,
    highlight: 'integrated in a single afternoon',
    text: 'We integrated this on top of our existing Python stack in a single afternoon. The scikit-learn backbone means the model genuinely improves with every resolved ticket.',
  },
  {
    name: 'Aisha Patel',
    role: 'Founder',
    company: 'Vertex AI',
    avatar: 'AP',
    color: 'from-violet-400 to-violet-600',
    glow: 'rgba(168,85,247,0.15)',
    stars: 5,
    highlight: 'real-time confidence scores, category breakdowns',
    text: 'The admin dashboard is beautifully designed and surprisingly deep. We get real-time confidence scores, category breakdowns, and trend analytics all in one view.',
  },
  {
    name: 'Tom Brennan',
    role: 'VP Customer Success',
    company: 'Stratum',
    avatar: 'TB',
    color: 'from-emerald-400 to-emerald-600',
    glow: 'rgba(16,185,129,0.15)',
    stars: 5,
    highlight: 'CSAT jumped 34 points after deployment',
    text: 'Our CSAT jumped 34 points after deployment. Customers love the instant AI responses, and agents love only handling the complex stuff. Win-win.',
  },
]

export default function Testimonials() {
  const headerRef = useRef(null)
  const inView = useInView(headerRef, { once: true })

  return (
    <section id="testimonials" className="section-padding container-max">
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-[11px] font-semibold text-brand-600 uppercase tracking-widest">Reviews</span>
        </div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] text-slate-900 tracking-tight mb-4">
          What teams are saying
        </h2>
        <p className="text-[15px] text-slate-500 font-light max-w-sm mx-auto">
          Trusted by support teams at companies big and small.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5, transition: { duration: 0.22 } }}
            className="group relative glass-card border border-white rounded-3xl p-7 overflow-hidden"
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.03)' }}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-3xl pointer-events-none"
              style={{ background: `radial-gradient(280px circle at 20% 20%, ${t.glow}, transparent 65%)` }}
            />

            {/* Quote mark */}
            <div
              className="absolute top-5 right-6 text-[72px] leading-none font-serif opacity-5 pointer-events-none select-none"
              style={{ color: '#6366F1' }}
            >
              "
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-4 relative z-10">
              {Array.from({ length: t.stars }).map((_, j) => (
                <motion.span
                  key={j}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 + j * 0.05, type: 'spring', bounce: 0.5 }}
                  className="text-amber-400 text-[14px]"
                >
                  ★
                </motion.span>
              ))}
            </div>

            {/* Text */}
            <p className="text-[13.5px] text-slate-600 leading-relaxed mb-6 relative z-10">
              "{t.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 relative z-10">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-[12px] font-bold shadow-[0_4px_12px_rgba(0,0,0,0.15)]`}>
                {t.avatar}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-slate-900">{t.name}</div>
                <div className="text-[11px] text-slate-400">{t.role} · {t.company}</div>
              </div>
            </div>

            {/* Bottom accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${t.color} opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}