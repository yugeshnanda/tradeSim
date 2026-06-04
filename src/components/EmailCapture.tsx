/* EmailCapture — shown after 30 s on first visit, stores email in localStorage */
import { useState, useEffect } from 'react'
import { X, TrendingUp } from 'lucide-react'

const STORAGE_KEY = 'tradesim_email_captured'
const DELAY_MS = 30_000

export default function EmailCapture() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Only show once, and only if not already captured
    if (localStorage.getItem(STORAGE_KEY)) return
    const t = setTimeout(() => setShow(true), DELAY_MS)
    return () => clearTimeout(t)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    // Store locally — swap for Supabase/Resend call when ready
    const existing = JSON.parse(localStorage.getItem('tradesim_emails') ?? '[]') as string[]
    localStorage.setItem('tradesim_emails', JSON.stringify([...existing, email]))
    localStorage.setItem(STORAGE_KEY, '1')
    console.log('[TradeSim] Email captured:', email)
    setSubmitted(true)
    setTimeout(() => setShow(false), 2000)
  }

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="email-capture-overlay" role="dialog" aria-modal aria-labelledby="ec-title">
      <div className="email-capture-card">
        <button className="modal-close" onClick={dismiss} aria-label="Close">
          <X size={18} />
        </button>

        <div className="ec-icon"><TrendingUp size={22} /></div>

        {submitted ? (
          <div className="ec-success">
            <p className="ec-title">You're in! 🎉</p>
            <p className="ec-sub">Weekly market insights coming your way.</p>
          </div>
        ) : (
          <>
            <h2 id="ec-title" className="ec-title">Learn to invest, free</h2>
            <p className="ec-sub">
              Join 500+ beginner investors practising on TradeSim.<br />
              Get weekly market insights — no spam, ever.
            </p>
            <form onSubmit={handleSubmit} className="ec-form">
              <input
                type="email"
                className="ec-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <button type="submit" className="btn-pill btn-glow-primary btn-full">
                Join Free →
              </button>
            </form>
            <p className="ec-disclaimer">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </div>
  )
}
