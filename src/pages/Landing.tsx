import { Link } from 'react-router-dom'
import { TrendingUp, Shield, Trophy, Zap } from 'lucide-react'

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Live-Style Quotes',
    body: 'Trade with real market data. Every price reflects actual market conditions.',
  },
  {
    icon: Shield,
    title: 'Zero Risk',
    body: 'Start with $100,000 in virtual cash. No real money, no stress — just learning.',
  },
  {
    icon: Trophy,
    title: 'Compete & Learn',
    body: 'Climb the leaderboard and benchmark your strategy against other traders.',
  },
  {
    icon: Zap,
    title: 'Instant Fills',
    body: 'Simulated order execution at quoted price. Practice at real market speed.',
  },
]

export default function Landing() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <h1 id="hero-heading" className="hero-title">
          <span className="hero-line">Practice Trading.</span>
          <span className="hero-line hero-line-accent">Zero Risk.</span>
        </h1>
        <p className="hero-sub">
          Build strategies with live-style quotes and instant feedback — no bank
          connection, no capital on the line. Your sandbox for the real market.
        </p>
        <div className="hero-cta">
          <Link to="/auth?mode=signup" className="btn-pill btn-primary">
            Start for Free
          </Link>
          <Link to="/markets" className="btn-pill btn-outline">
            <TrendingUp size={16} />
            Explore Markets
          </Link>
        </div>
      </section>

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

      <section className="cta-band" aria-labelledby="cta-band-heading">
        <h2 id="cta-band-heading" className="cta-band-title">
          Ready to build your strategy?
        </h2>
        <p className="cta-band-sub">Join thousands of traders practising risk-free with $100k virtual cash.</p>
        <Link to="/auth?mode=signup" className="btn-pill btn-primary">
          Create Free Account
        </Link>
      </section>
    </>
  )
}
