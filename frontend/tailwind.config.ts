import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE',
          400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA',
        },
        cyan: { 400: '#38BDF8', 500: '#06B6D4' },
        violet: { 400: '#C084FC', 500: '#A855F7' },
      },
      animation: {
        'blob-float': 'blobFloat 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'slide-up': 'slideUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'typing-dot': 'typingDot 1.2s ease infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        blobFloat: {
          '0%,100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.04)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        typingDot: {
          '0%,60%,100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-5px)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        glow: '0 0 40px rgba(99,102,241,0.25)',
        'glow-lg': '0 0 80px rgba(99,102,241,0.3)',
        glass: '0 8px 32px rgba(99,102,241,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        'glass-lg': '0 20px 60px rgba(99,102,241,0.15), 0 4px 16px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config