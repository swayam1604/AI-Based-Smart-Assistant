'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils/cn'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Demo', href: '#demo' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Reviews', href: '#testimonials' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      // Active section tracking
      const sections = links.map(l => l.href.slice(1))
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id); break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-white/75 backdrop-blur-2xl border-b border-slate-200/60 shadow-[0_1px_40px_rgba(99,102,241,0.08)]'
            : 'bg-transparent'
        )}
      >
        <div className="container-max flex items-center justify-between h-[68px]">

          {/* ── Logo ── */}
          <motion.a
            href="#hero"
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-[11px] bg-gradient-to-br from-brand-400 to-cyan-400 opacity-0 group-hover:opacity-40 blur-[8px] transition-opacity duration-300" />
              <div className="relative w-9 h-9 rounded-[11px] bg-gradient-to-br from-brand-500 via-brand-500 to-cyan-400 flex items-center justify-center shadow-[0_4px_16px_rgba(99,102,241,0.35)]">
                <span className="text-white font-bold text-[15px]" style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic' }}>A</span>
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[14px] font-semibold text-slate-900 tracking-tight">AI Smart</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Assistant</span>
            </div>
          </motion.a>

          {/* ── Desktop Links ── */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = activeSection === link.href.slice(1)
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 group',
                    isActive ? 'text-brand-600' : 'text-slate-500 hover:text-slate-900'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-brand-50 rounded-lg"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                  {!isActive && (
                    <span className="absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-brand-500 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  )}
                </a>
              )
            })}
          </div>

          {/* ── CTA ── */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#demo"
              className="text-[13px] text-slate-500 font-medium hover:text-slate-900 transition-colors px-3 py-2"
            >
              Sign in
            </a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03, boxShadow: '0 0 28px rgba(99,102,241,0.4)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="relative bg-gradient-to-r from-brand-500 to-brand-600 text-white text-[13px] font-semibold px-5 py-2.5 rounded-[10px] shadow-[0_4px_16px_rgba(99,102,241,0.3)] overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <span className="relative">Get Started →</span>
            </motion.a>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2.5 rounded-lg hover:bg-slate-100/60 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <motion.span
              animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }}
              transition={{ duration: 0.25 }}
              className="w-[18px] h-[1.5px] bg-slate-700 block origin-center"
            />
            <motion.span
              animate={{ opacity: mobileOpen ? 0 : 1, scaleX: mobileOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="w-[18px] h-[1.5px] bg-slate-700 block"
            />
            <motion.span
              animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }}
              transition={{ duration: 0.25 }}
              className="w-[18px] h-[1.5px] bg-slate-700 block origin-center"
            />
          </button>
        </div>
      </motion.nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[68px] left-4 right-4 z-40 bg-white/92 backdrop-blur-2xl border border-slate-200/60 shadow-[0_8px_40px_rgba(0,0,0,0.12)] rounded-2xl px-4 py-5 flex flex-col gap-1 md:hidden"
          >
            {links.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setMobileOpen(false)}
                className="text-[14px] text-slate-700 font-medium py-2.5 px-3 rounded-xl hover:bg-slate-50 hover:text-brand-600 transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
            <div className="h-px bg-slate-100 my-1" />
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="bg-gradient-to-r from-brand-500 to-brand-600 text-white text-[14px] font-semibold px-4 py-3 rounded-[10px] text-center shadow-[0_4px_16px_rgba(99,102,241,0.3)]"
            >
              Get Started →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}