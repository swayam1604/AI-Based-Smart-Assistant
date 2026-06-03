'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function AuroraBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mouse-reactive radial glow
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      el.style.setProperty('--mouse-x', `${x}%`)
      el.style.setProperty('--mouse-y', `${y}%`)
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  // Lightweight particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let W = 0, H = 0

    const PARTICLES = 38
    const particles = Array.from({ length: PARTICLES }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 1 + Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.00012,
      vy: (Math.random() - 0.5) * 0.00012,
      hue: [240, 200, 280, 220][Math.floor(Math.random() * 4)],
      alpha: 0.12 + Math.random() * 0.18,
    }))

    function resize() {
      W = canvas!.width  = window.innerWidth
      H = canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    function draw() {
      ctx!.clearRect(0, 0, W, H)
      for (const p of particles) {
        p.x = (p.x + p.vx + 1) % 1
        p.y = (p.y + p.vy + 1) % 1
        const px = p.x * W, py = p.y * H
        ctx!.beginPath()
        ctx!.arc(px, py, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `hsla(${p.hue}, 70%, 65%, ${p.alpha})`
        ctx!.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* ── Base gradient ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8F9FF] via-[#EEF2FF] to-[#F0F9FF]" />

      {/* ── Mesh layer ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,102,241,0.09) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 5%, rgba(56,189,248,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 70% 60% at 50% 90%, rgba(168,85,247,0.07) 0%, transparent 60%)
          `,
        }}
      />

      {/* ── Mouse-reactive spotlight ── */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(700px circle at var(--mouse-x, 50%) var(--mouse-y, 30%), rgba(99,102,241,0.1), transparent 65%)',
          opacity: 0.6,
        }}
      />

      {/* ── Primary blob — indigo ── */}
      <motion.div
        animate={{ y: [0, -28, 0], scale: [1, 1.06, 1], x: [0, 8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 -left-40 w-[640px] h-[520px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.22) 0%, rgba(99,102,241,0.05) 60%, transparent 80%)', filter: 'blur(1px)' }}
      />

      {/* ── Secondary blob — cyan ── */}
      <motion.div
        animate={{ y: [0, 24, 0], scale: [1, 1.05, 1], x: [0, -12, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute -top-24 -right-48 w-[560px] h-[480px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(56,189,248,0.2) 0%, rgba(56,189,248,0.04) 60%, transparent 80%)', filter: 'blur(1px)' }}
      />

      {/* ── Tertiary blob — violet ── */}
      <motion.div
        animate={{ y: [0, -18, 0], x: [0, 14, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute bottom-0 left-1/3 w-[500px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.16) 0%, rgba(168,85,247,0.03) 60%, transparent 80%)', filter: 'blur(1px)' }}
      />

      {/* ── Quaternary blob — rose ── */}
      <motion.div
        animate={{ y: [0, 16, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        className="absolute bottom-1/4 -right-24 w-[400px] h-[360px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(236,72,153,0.1) 0%, transparent 70%)', filter: 'blur(1px)' }}
      />

      {/* ── Particle canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.7 }}
      />

      {/* ── Subtle grid overlay ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.7) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          opacity: 0.022,
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* ── Top vignette ── */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#F8F9FF]/60 to-transparent pointer-events-none" />
    </div>
  )
}