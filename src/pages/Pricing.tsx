import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Check, Zap, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const FREE_FEATURES = [
  '$100,000 virtual cash to start',
  '52 stocks across 7 sectors',
  'Buy & sell simulation',
  'Trade history & portfolio tracking',
  'Leaderboard access',
  '7 beginner lessons with quizzes',
  'XP, levels & daily challenges',
]

const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited real-time quotes',
  'Advanced portfolio analytics',
  'Options & crypto simulation',
  'Exclusive Pro missions & XP boosts',
  'Early access to new features',
  'Priority support',
]

export default function Pricing() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [params] = useSearchParams()
  const cancelled = params.get('cancelled') === 'true'

  const isPro = profile?.tier === 'pro'

  async function handleUpgrade() {
    if (!user) {
      window.location.href = '/auth?mode=signup&next=pricing'
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create checkout')
      if (data.url) window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1 className="page-title">Simple Pricing</h1>
        <p className="page-sub">Start free. Upgrade when you're ready to go deeper.</p>
      </div>

      {cancelled && (
        <div className="pricing-notice">
          <AlertCircle size={16} />
          No worries — you weren't charged. Come back when you're ready.
        </div>
      )}

      {isPro && (
        <div className="pricing-notice pricing-notice-pro">
          <Zap size={16} />
          You're already on Pro — enjoy all the features!
        </div>
      )}

      <div className="pricing-grid">
        {/* Free */}
        <div className="pricing-card">
          <div className="pricing-tier">Free</div>
          <div className="pricing-price">
            <span className="price-amount">$0</span>
            <span className="price-period">/ forever</span>
          </div>
          <ul className="pricing-features">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="pricing-feature">
                <Check size={15} className="feature-check" />
                {f}
              </li>
            ))}
          </ul>
          {user ? (
            <Link to="/dashboard" className="btn-pill btn-outline btn-full">
              Your Dashboard
            </Link>
          ) : (
            <Link to="/auth?mode=signup" className="btn-pill btn-outline btn-full">
              Get Started Free
            </Link>
          )}
        </div>

        {/* Pro */}
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
                <Check size={15} className="feature-check feature-check-pro" />
                {f}
              </li>
            ))}
          </ul>

          {isPro ? (
            <button className="btn-pill btn-primary btn-full" disabled>
              ✓ You're on Pro
            </button>
          ) : (
            <button
              className="btn-pill btn-primary btn-full"
              onClick={handleUpgrade}
              disabled={loading}
            >
              {loading ? 'Redirecting to checkout…' : '🚀 Start 7-Day Free Trial'}
            </button>
          )}

          {error && <p className="form-error" style={{ marginTop: '0.5rem' }}>{error}</p>}
          <p className="pricing-fine">7-day free trial · Cancel anytime · Secured by Stripe</p>
        </div>
      </div>

      <p className="pricing-disclaimer">
        TradeSim is a paper trading platform for educational purposes only. No real money is involved in the simulation.
      </p>
    </div>
  )
}
