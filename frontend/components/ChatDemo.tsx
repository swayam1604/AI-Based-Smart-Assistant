'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Message = {
  role: 'user' | 'bot'
  text: string
  confidence?: number
  category?: string
  streaming?: boolean
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'bot',
    text: "Hello! I'm your AI support assistant. How can I help you today?",
    confidence: 100,
    category: 'Greeting',
  },
]

const DEMO_RESPONSES: Record<string, { text: string; confidence: number; category: string }> = {
  default: {
    text: "I've analyzed your message and classified it as a General inquiry (82% confidence). A support agent will follow up within 2 minutes. Is there anything else I can help with?",
    confidence: 82,
    category: 'General',
  },
  payment: {
    text: "I've detected a Billing issue (96% confidence). I can see this may involve a duplicate charge. I've flagged this as High priority — ticket #8821 created. Our billing team will contact you within 30 minutes, or I can initiate an automatic refund check now.",
    confidence: 96,
    category: 'Billing',
  },
  login: {
    text: "This looks like an Authentication issue (88% confidence). Let me check your account… Your account is active. I've sent a secure password reset link to your registered email. It expires in 15 minutes.",
    confidence: 88,
    category: 'Auth',
  },
  api: {
    text: "Classified as a Technical/API issue (91% confidence). Your API key may have expired or hit rate limits. I've auto-generated a fresh API key — check your developer dashboard. Rate limit details: 1000 req/min on your current plan.",
    confidence: 91,
    category: 'Technical',
  },
}

function getResponse(text: string) {
  const t = text.toLowerCase()
  if (t.includes('pay') || t.includes('charge') || t.includes('bill') || t.includes('refund')) return DEMO_RESPONSES.payment
  if (t.includes('login') || t.includes('password') || t.includes('sign') || t.includes('access')) return DEMO_RESPONSES.login
  if (t.includes('api') || t.includes('key') || t.includes('rate') || t.includes('technical') || t.includes('error')) return DEMO_RESPONSES.api
  return DEMO_RESPONSES.default
}

const SUGGESTIONS = [
  { label: 'Payment failed', icon: '💳' },
  { label: 'Cannot log in', icon: '🔑' },
  { label: 'API key issue', icon: '⚙️' },
  { label: 'Cancel subscription', icon: '📋' },
]

// Confidence color
function confidenceColor(pct: number) {
  if (pct >= 90) return 'from-emerald-500 to-teal-400'
  if (pct >= 80) return 'from-brand-500 to-cyan-400'
  return 'from-amber-500 to-yellow-400'
}

function confidenceLabel(pct: number) {
  if (pct >= 90) return 'text-emerald-600'
  if (pct >= 80) return 'text-brand-600'
  return 'text-amber-600'
}

export default function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [streamText, setStreamText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, streamText])

  async function simulateStream(fullText: string): Promise<void> {
    setStreamText('')
    const words = fullText.split(' ')
    for (let i = 0; i < words.length; i++) {
      await new Promise(r => setTimeout(r, 28 + Math.random() * 20))
      setStreamText(words.slice(0, i + 1).join(' '))
    }
  }

  async function sendMessage(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg || isTyping) return
    setInput('')

    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setIsTyping(true)

    // Real backend attempt
    try {
      const res = await fetch('/api/backend/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      })
      if (res.ok) {
        const data = await res.json()
        await new Promise(r => setTimeout(r, 600))
        setIsTyping(false)
        const responseText = data.response || data.message
        await simulateStream(responseText)
        setStreamText('')
        setMessages(prev => [...prev, {
          role: 'bot',
          text: responseText,
          confidence: data.confidence,
          category: data.category,
        }])
        return
      }
    } catch (_) {}

    // Demo fallback
    await new Promise(r => setTimeout(r, 900 + Math.random() * 500))
    setIsTyping(false)
    const response = getResponse(msg)
    await simulateStream(response.text)
    setStreamText('')
    setMessages(prev => [...prev, { role: 'bot', ...response }])
  }

  return (
    <section id="demo" className="section-padding container-max">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 mb-4">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500" />
          </span>
          <span className="text-[11px] font-semibold text-brand-600 uppercase tracking-widest">Live Demo</span>
        </div>
        <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] text-slate-900 tracking-tight mb-4">
          See the AI in action
        </h2>
        <p className="text-[15px] text-slate-500 font-light max-w-sm mx-auto">
          Type a support query and watch the AI classify, score, and respond in real time.
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        {/* Suggestion chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-5"
        >
          {SUGGESTIONS.map(s => (
            <motion.button
              key={s.label}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => sendMessage(s.label)}
              className="flex items-center gap-1.5 text-[12px] text-slate-600 font-medium bg-white border border-slate-200/80 px-4 py-2 rounded-full hover:border-brand-200 hover:text-brand-600 hover:bg-brand-50/50 transition-all duration-200 shadow-[0_1px_6px_rgba(0,0,0,0.04)]"
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Chat window */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card border border-white rounded-3xl shadow-[0_24px_64px_rgba(99,102,241,0.14),0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden"
        >
          {/* Header bar */}
          <div className="relative bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 px-5 py-4 overflow-hidden">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 shimmer opacity-30" />
            <div className="relative flex items-center gap-3.5">
              {/* AI avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl border border-white/30">
                  🤖
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-brand-600" />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-white tracking-tight">AI Support Agent</div>
                <div className="text-[10px] text-white/70 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Online · Powered by NLTK + scikit-learn
                </div>
              </div>
              <div className="ml-auto flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white/30" />
                <div className="w-2 h-2 rounded-full bg-white/30" />
                <div className="w-2 h-2 rounded-full bg-white/30" />
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-5 flex flex-col gap-4 bg-gradient-to-b from-slate-50/30 to-white/50">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-2xl flex-shrink-0 flex items-center justify-center text-[11px] font-bold shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${
                    msg.role === 'bot'
                      ? 'bg-gradient-to-br from-brand-100 to-cyan-100 text-brand-600'
                      : 'bg-gradient-to-br from-brand-500 to-brand-600 text-white'
                  }`}>
                    {msg.role === 'bot' ? '🤖' : 'U'}
                  </div>

                  <div className="max-w-[80%]">
                    {/* Bubble */}
                    <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${
                      msg.role === 'bot'
                        ? 'bg-white border border-slate-100/80 text-slate-700 rounded-tl-sm'
                        : 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-tr-sm'
                    }`}>
                      {msg.text}
                    </div>

                    {/* Confidence bar */}
                    {msg.role === 'bot' && msg.confidence && msg.category && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2 mt-2 ml-1"
                      >
                        <span className="text-[9px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">{msg.category}</span>
                        <div className="flex-1 h-1 bg-slate-100 rounded-full max-w-[100px] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${msg.confidence}%` }}
                            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                            className={`h-full rounded-full bg-gradient-to-r ${confidenceColor(msg.confidence)}`}
                          />
                        </div>
                        <span className={`text-[9px] font-bold ${confidenceLabel(msg.confidence)}`}>{msg.confidence}%</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-brand-100 to-cyan-100 text-brand-600 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                  <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                    {[0, 0.18, 0.36].map((delay, i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay, ease: 'easeInOut' }}
                        className="w-1.5 h-1.5 rounded-full bg-brand-400 block"
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Streaming response */}
              {streamText && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-brand-100 to-cyan-100 text-brand-600 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                  <div className="max-w-[80%]">
                    <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm text-[13px] text-slate-700 leading-relaxed shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                      {streamText}
                      <span className="inline-block w-0.5 h-3.5 bg-brand-500 ml-0.5 align-middle"
                        style={{ animation: 'blink 1s ease infinite' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="border-t border-slate-100 bg-white/80 px-4 py-3.5 flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                className="w-full bg-slate-50/80 border border-slate-200/80 rounded-2xl px-5 py-3 text-[13px] text-slate-700 outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100/60 transition-all duration-200 placeholder:text-slate-400 pr-12"
                placeholder="Describe your issue…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
              whileTap={{ scale: 0.94 }}
              onClick={() => sendMessage()}
              disabled={isTyping || !input.trim()}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center shadow-[0_4px_14px_rgba(99,102,241,0.35)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8L14 8M14 8L8 2M14 8L8 14" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          </div>
        </motion.div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-[11px] text-slate-400 mt-4"
        >
          Live backend connection · Falls back to demo if offline · Zero data stored
        </motion.p>
      </div>
    </section>
  )
}