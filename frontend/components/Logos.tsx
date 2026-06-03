'use client'
import { motion } from 'framer-motion'

const logos = [
  { name: 'Acme Corp', symbol: '◆', color: 'text-brand-400' },
  { name: 'Vertex AI', symbol: '▲', color: 'text-cyan-500' },
  { name: 'NovaTech', symbol: '●', color: 'text-violet-400' },
  { name: 'Stratum', symbol: '■', color: 'text-emerald-500' },
  { name: 'Quanta', symbol: '◉', color: 'text-amber-500' },
  { name: 'Helios', symbol: '☀', color: 'text-rose-400' },
  { name: 'Prismatic', symbol: '◈', color: 'text-indigo-400' },
  { name: 'Axiom', symbol: '⬡', color: 'text-teal-500' },
]

export default function Logos() {
  const doubled = [...logos, ...logos]

  return (
    <section className="py-14 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <p className="text-[11px] text-slate-400 font-semibold tracking-[0.15em] uppercase">
          Trusted by modern businesses
        </p>
      </motion.div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #F8F9FF, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #F8F9FF, transparent)' }} />

        <div className="flex" style={{ animation: 'marquee 32s linear infinite' }}>
          {doubled.map((logo, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 mx-5 flex-shrink-0 glass-card border border-white rounded-xl px-5 py-3 hover:border-brand-200/50 hover:shadow-[0_4px_16px_rgba(99,102,241,0.08)] transition-all duration-200 cursor-default"
            >
              <span className={`text-[17px] ${logo.color}`}>{logo.symbol}</span>
              <span className="text-[12.5px] font-semibold text-slate-600 whitespace-nowrap">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}