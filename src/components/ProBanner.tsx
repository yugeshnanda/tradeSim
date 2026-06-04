/* ProBanner — upgrade CTA shown at the bottom of Dashboard/Portfolio */
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export default function ProBanner() {
  function handleClick() {
    // Track interest — replace with analytics event later
    console.log('[TradeSim] Pro upgrade banner clicked')
  }

  return (
    <div className="pro-banner">
      <div className="pro-banner-left">
        <Zap size={18} className="pro-banner-icon" />
        <div>
          <p className="pro-banner-title">Upgrade to TradeSim Pro</p>
          <p className="pro-banner-sub">
            Unlock AI stock analysis, unlimited watchlists, and advanced charts.
          </p>
        </div>
      </div>
      <Link
        to="/pricing"
        className="btn-pill btn-glow-primary pro-banner-btn"
        onClick={handleClick}
      >
        Upgrade to Pro → $7/mo
      </Link>
    </div>
  )
}
