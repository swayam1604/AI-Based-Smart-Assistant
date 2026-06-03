'use client'
import { motion } from 'framer-motion'

const footerLinks = {
  Product: ['Features', 'Demo', 'Analytics', 'Pricing'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Security'],
}

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white/70 backdrop-blur-xl">
      <div className="container-max py-14">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-[11px] bg-gradient-to-br from-brand-500 to-cyan-400 flex items-center justify-center shadow-[0_4px_12px_rgba(99,102,241,0.3)]">
                <span className="text-white font-bold text-[14px]" style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic' }}>A</span>
              </div>
              <div>
                <div className="text-[14px] font-semibold text-slate-900 tracking-tight leading-none">AI Smart Assistant</div>
                <div className="text-[10px] text-slate-400 tracking-wider uppercase mt-0.5">Intelligent Support</div>
              </div>
            </div>
            <p className="text-[12.5px] text-slate-500 leading-relaxed max-w-[200px]">
              AI-powered customer support for modern teams. Built with Python, NLTK, and Next.js.
            </p>
            {/* Social icons */}
            <div className="flex gap-2 mt-5">
              {['𝕏', '🐙', '💼'].map((icon, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-600 flex items-center justify-center text-[13px] text-slate-500 transition-colors"
                >
                  {icon}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <div className="text-[11px] font-semibold text-slate-900 uppercase tracking-widest mb-4">{heading}</div>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      className="text-[12.5px] text-slate-500 hover:text-brand-600 transition-colors font-medium"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-7 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11.5px] text-slate-400">
            © {new Date().getFullYear()} AI Smart Assistant. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11.5px] text-slate-400">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}