import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Shield, Trophy, Zap, Wallet, BarChart2 } from 'lucide-react'

/* ── Animated portfolio counter in hero ── */
function AnimatedCounter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [value, setValue] = useState(target * 0.92)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    let current = target * 0.92
    function tick() {
      current += (target - current) * 0.015 + Math.random() * 0.8
      if (current >= target) { setValue(target); return }
      setValue(current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target])

  return (
    <span className="hero-counter">
      {prefix}
      {value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      {suffix}
    </span>
  )
}

/* ── How it works steps ── */
const HOW_STEPS = [
  { icon: Wallet,    step: '01', title: 'Get $10,000 virtual cash', body: 'No real money, no bank connection. Just a sandbox to learn.' },
  { icon: BarChart2, step: '02', title: 'Buy and sell real stocks', body: 'Prices pulled from real markets. Trade Apple, NVDA, Tesla — any ticker.' },
  { icon: Trophy,    step: '03', title: 'Track your performance', body: 'See your P&L, climb the leaderboard, and replay every trade you\'ve made.' },
]

/* ── Social proof stats ── */
const STATS = [
  { value: '10,000+', label: 'Trades simulated' },
  { value: 'Real',    label: 'Market prices' },
  { value: '$0',      label: 'Risk, forever' },
]

const FEATURES = [
  { icon: TrendingUp, title: 'Live-Style Quotes',  body: 'Trade with real market data. Every price reflects actual market conditions.' },
  { icon: Shield,     title: 'Zero Risk',           body: 'Start with virtual cash. No real money, no stress — just learning.' },
  { icon: Trophy,     title: 'Compete & Learn',     body: 'Climb the leaderboard and benchmark your strategy against other traders.' },
  { icon: Zap,        title: 'Instant Fills',       body: 'Simulated order execution at quoted price. Practice at real market speed.' },
]

export default function Landing() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="hero" aria-labelledby="hero-heading">
        {/* Live-looking portfolio counter */}
        <div className="hero-counter-wrap" aria-hidden>
          <span className="hero-counter-label">Your portfolio</span>
          <AnimatedCounter target={10_847.32} prefix="$" />
          <span className="hero-counter-change">↑ +8.47% all time</span>
        </div>

        <h1 id="hero-heading" className="hero-title">
          <span className="hero-line">Practice Trading.</span>
          <span className="hero-line hero-line-accent">Zero Risk.</span>
        </h1>
        <p className="hero-sub">
          Build real investing skills with live market prices — no bank
          account, no capital on the line. Your personal sandbox for the stock market.
        </p>

        {/* Social proof stats */}
        <div className="hero-stats">
          {STATS.map((s) => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="hero-cta">
          <Link to="/auth?mode=signup" className="btn-pill btn-glow-primary">
            Start with $10,000 →
          </Link>
          <Link to="/markets" className="btn-pill btn-outline">
            <TrendingUp size={16} />
            Explore Markets
          </Link>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-it-works" aria-labelledby="hiw-heading">
        <h2 id="hiw-heading" className="section-title">How it works</h2>
        <div className="hiw-steps">
          {HOW_STEPS.map((s) => (
            <div key={s.step} className="hiw-step">
              <div className="hiw-step-num">{s.step}</div>
              <div className="hiw-step-icon-wrap">
                <s.icon size={22} aria-hidden />
              </div>
              <h3 className="hiw-step-title">{s.title}</h3>
              <p className="hiw-step-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="features" aria-labelledby="features-heading">
        <h2 id="features-heading" className="section-title">
          Everything you need to trade smarter
        </h2>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <article key={f.title} className="feature-card">
              <f.icon className="feature-icon" size={24} aria-hidden />
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-body">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── CTA band ── */}
      <section className="cta-band" aria-labelledby="cta-band-heading">
        <h2 id="cta-band-heading" className="cta-band-title">
          Ready to build your strategy?
        </h2>
        <p className="cta-band-sub">Join thousands of traders practising risk-free with $10,000 virtual cash.</p>
        <Link to="/auth?mode=signup" className="btn-pill btn-glow-primary">
          Create Free Account
        </Link>
      </section>
    </>
  )
}
