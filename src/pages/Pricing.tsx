import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'

const FREE_FEATURES = [
  '$100,000 virtual cash to start',
  '10 stock watchlist',
  'Buy & sell simulation',
  'Trade history',
  'Leaderboard access',
]

const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited watchlist',
  'Real-time quotes (no delay)',
  'Advanced portfolio analytics',
  'Options & crypto simulation',
  'Priority support',
  'Early access to new features',
]

export default function Pricing() {
  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1 className="page-title">Simple Pricing</h1>
        <p className="page-sub">Start free. Upgrade when you're ready to go deeper.</p>
      </div>

      <div className="pricing-grid">
        <div className="pricing-card">
          <div className="pricing-tier">Free</div>
          <div className="pricing-price">
            <span className="price-amount">$0</span>
            <span className="price-period">/ forever</span>
          </div>
          <ul className="pricing-features">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="pricing-feature">
                <Check size={16} className="feature-check" />
                {f}
              </li>
            ))}
          </ul>
          <Link to="/auth?mode=signup" className="btn-pill btn-glow-secondary btn-full">
            Get Started Free
          </Link>
        </div>

        <div className="pricing-card pricing-card-pro">
          <div className="pricing-badge">Most Popular</div>
          <div className="pricing-tier">Pro</div>
          <div className="pricing-price">
            <span className="price-amount">$9</span>
            <span className="price-period">/ month</span>
          </div>
          <ul className="pricing-features">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="pricing-feature">
                <Check size={16} className="feature-check feature-check-pro" />
                {f}
              </li>
            ))}
          </ul>
          <Link to="/auth?mode=signup" className="btn-pill btn-glow-primary btn-full">
            Start Pro Trial
          </Link>
          <p className="pricing-fine">7-day free trial · Cancel anytime</p>
        </div>
      </div>

      <p className="pricing-disclaimer">
        TradeSim is a paper trading platform for educational purposes only. No real money is involved.
      </p>
    </div>
  )
}
