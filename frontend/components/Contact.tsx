'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [focused, setFocused] = useState<string | null>(null)
  const headerRef = useRef(null)
  const inView = useInView(headerRef, { once: true })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setSent(true)
  }

  const inputClass = (field: string) =>
    `w-full bg-white/80 border rounded-xl px-4 py-3 text-[13.5px] text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-300 ${
      focused === field
        ? 'border-brand-300 ring-2 ring-brand-100/70 bg-white shadow-[0_0_0_3px_rgba(99,102,241,0.06)]'
        : 'border-slate-200 hover:border-slate-300'
    }`

  return (
    <section id="contact" className="section-padding container-max">
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
          <span className="text-[11px] font-semibold text-brand-600 uppercase tracking-widest">Contact</span>
        </div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] text-slate-900 tracking-tight mb-4">
          Get in touch
        </h2>
        <p className="text-[15px] text-slate-500 font-light max-w-sm mx-auto">
          Ready to transform your support team? We'd love to hear from you.
        </p>
      </motion.div>

      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card border border-white rounded-3xl p-12 text-center shadow-[0_24px_64px_rgba(99,102,241,0.12)]"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-3xl mx-auto mb-5 shadow-[0_8px_24px_rgba(16,185,129,0.3)]"
              >
                ✓
              </motion.div>
              <h3 className="font-serif text-2xl text-slate-900 mb-2 tracking-tight">Message sent!</h3>
              <p className="text-[13px] text-slate-500">We'll get back to you within one business day.</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }}
                className="mt-6 text-[12px] text-brand-500 font-medium hover:text-brand-700 transition-colors"
              >
                Send another message →
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card border border-white rounded-3xl p-8 shadow-[0_24px_64px_rgba(99,102,241,0.1)]"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11.5px] font-semibold text-slate-600 mb-2 tracking-wide">Full name</label>
                    <input
                      type="text"
                      placeholder="Jane Smith"
                      required
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                      className={inputClass('name')}
                    />
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-semibold text-slate-600 mb-2 tracking-wide">Email address</label>
                    <input
                      type="email"
                      placeholder="jane@company.com"
                      required
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                      className={inputClass('email')}
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[11.5px] font-semibold text-slate-600 mb-2 tracking-wide">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your support team and goals…"
                    required
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    className={`${inputClass('message')} resize-none`}
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 36px rgba(99,102,241,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative bg-gradient-to-r from-brand-500 to-brand-600 text-white text-[14px] font-semibold py-3.5 rounded-[12px] shadow-[0_8px_24px_rgba(99,102,241,0.32)] disabled:opacity-60 overflow-hidden group transition-shadow duration-200"
                >
                  {/* Shimmer sweep */}
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block"
                        />
                        Sending…
                      </>
                    ) : (
                      <>Send Message →</>
                    )}
                  </span>
                </motion.button>

                {/* Trust note */}
                <p className="text-center text-[11px] text-slate-400">
                  🔒 Your data is safe with us · We respond within 24 hours
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}