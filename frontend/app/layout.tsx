import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Smart Assistant — Intelligent Customer Support',
  description: 'AI-powered ticket classification, smart responses, and real-time analytics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* ─── Loading Screen ─── */}
        <div id="loading-screen">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px' }}>
            {/* Logo mark */}
            <div style={{ position: 'relative', width: 64, height: 64 }}>
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #6366F1, #38BDF8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 48px rgba(99,102,241,0.35)',
              }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 26, fontFamily: 'var(--font-instrument-serif, serif)', fontStyle: 'italic' }}>A</span>
              </div>
              {/* Pulse rings */}
              <div style={{
                position: 'absolute', inset: -8,
                borderRadius: '26px',
                border: '1.5px solid rgba(99,102,241,0.2)',
                animation: 'loadPulse 2s ease-in-out infinite',
              }} />
              <div style={{
                position: 'absolute', inset: -16,
                borderRadius: '34px',
                border: '1px solid rgba(99,102,241,0.1)',
                animation: 'loadPulse 2s ease-in-out infinite 0.4s',
              }} />
            </div>

            {/* Brand name */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: 'var(--font-dm-sans, sans-serif)',
                fontSize: 15,
                fontWeight: 600,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                marginBottom: 4,
              }}>AI Smart Assistant</div>
              <div style={{
                fontSize: 11,
                color: '#94A3B8',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-dm-sans, sans-serif)',
              }}>Initializing intelligence…</div>
            </div>

            {/* Progress bar */}
            <div style={{
              width: 200,
              height: 2,
              background: 'rgba(99,102,241,0.1)',
              borderRadius: 2,
              overflow: 'hidden',
            }}>
              <div id="load-bar" style={{
                height: '100%',
                width: '0%',
                background: 'linear-gradient(90deg, #6366F1, #38BDF8, #A855F7)',
                borderRadius: 2,
                transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
              }} />
            </div>
          </div>
        </div>

        {/* ─── Scroll & Cursor Chrome ─── */}
        <div id="scroll-progress" />
        <div id="cursor" />
        <div id="cursor-ring" />

        {children}

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes loadPulse {
            0%,100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 0.2; transform: scale(1.06); }
          }
        `}} />

        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            // ── Loading screen ──────────────────────────────────────
            var screen = document.getElementById('loading-screen');
            var bar = document.getElementById('load-bar');
            var pct = 0;

            var steps = [
              { target: 35, delay: 80 },
              { target: 65, delay: 180 },
              { target: 85, delay: 100 },
              { target: 100, delay: 120 },
            ];

            function runStep(i) {
              if (i >= steps.length) {
                setTimeout(function() {
                  screen.style.opacity = '0';
                  screen.style.transform = 'scale(1.02)';
                  screen.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                  setTimeout(function() { screen.style.display = 'none'; }, 650);
                }, 200);
                return;
              }
              var s = steps[i];
              setTimeout(function() {
                pct = s.target;
                bar.style.width = pct + '%';
                runStep(i + 1);
              }, s.delay);
            }
            runStep(0);

            // ── Custom cursor ────────────────────────────────────────
            var cursor = document.getElementById('cursor');
            var ring = document.getElementById('cursor-ring');
            var mx = 0, my = 0, rx = 0, ry = 0;

            document.addEventListener('mousemove', function(e) {
              mx = e.clientX; my = e.clientY;
              cursor.style.left = mx + 'px';
              cursor.style.top  = my + 'px';
            });

            (function animRing() {
              rx += (mx - rx) * 0.11;
              ry += (my - ry) * 0.11;
              ring.style.left = rx + 'px';
              ring.style.top  = ry + 'px';
              requestAnimationFrame(animRing);
            })();

            document.addEventListener('mouseover', function(e) {
              var el = e.target && e.target.closest('a,button,[role="button"]');
              if (el) {
                ring.style.transform = 'translate(-50%,-50%) scale(1.7)';
                ring.style.borderColor = 'rgba(99,102,241,0.6)';
                cursor.style.transform = 'translate(-50%,-50%) scale(0.5)';
              }
            });
            document.addEventListener('mouseout', function(e) {
              var el = e.target && e.target.closest('a,button,[role="button"]');
              if (el) {
                ring.style.transform = 'translate(-50%,-50%) scale(1)';
                ring.style.borderColor = 'rgba(99,102,241,0.45)';
                cursor.style.transform = 'translate(-50%,-50%) scale(1)';
              }
            });

            // ── Scroll progress ──────────────────────────────────────
            var bar2 = document.getElementById('scroll-progress');
            window.addEventListener('scroll', function() {
              var pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
              bar2.style.width = pct + '%';
            }, { passive: true });

            // ── Section reveals ──────────────────────────────────────
            var obs = new IntersectionObserver(function(entries) {
              entries.forEach(function(e) {
                if (e.isIntersecting) e.target.classList.add('visible');
              });
            }, { threshold: 0.08 });
            document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
          })();
        `}} />
      </body>
    </html>
  )
}