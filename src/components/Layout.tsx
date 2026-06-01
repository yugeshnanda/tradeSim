import { Link, useNavigate } from 'react-router-dom'
import { Search, TrendingUp, Trophy, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import TickerBar from './TickerBar'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="layout">
      <header className="nav">
        <Link to="/" className="nav-brand" aria-label="TradeSim home">
          <span className="nav-logo" aria-hidden />
          <span className="nav-wordmark">TradeSim</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <Link to="/markets" className="nav-link">
            <TrendingUp size={14} />
            Markets
          </Link>
          <Link to="/leaderboard" className="nav-link">
            <Trophy size={14} />
            Leaderboard
          </Link>
          {user && (
            <Link to="/dashboard" className="nav-link">
              Portfolio
            </Link>
          )}
        </nav>

        <div className="nav-spacer" />

        <div className="nav-search-wrap">
          <div className="search-shell">
            <Search className="search-icon" size={14} aria-hidden />
            <input
              type="search"
              className="search-input"
              placeholder="Search symbols…"
              autoComplete="off"
              aria-label="Search markets"
            />
          </div>
        </div>

        <div className="nav-actions">
          {user ? (
            <div className="nav-user">
              <Link to="/profile" className="nav-avatar" aria-label="Profile">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="avatar-img" />
                ) : (
                  <User size={16} />
                )}
              </Link>
              <button
                type="button"
                className="btn-icon"
                onClick={handleSignOut}
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <>
              <Link to="/pricing" className="btn-pill btn-outline">
                Pricing
              </Link>
              <Link to="/auth" className="btn-pill btn-primary">
                Sign In
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="main">{children}</main>

      <footer className="footer">
        <p className="footer-text">
          © {new Date().getFullYear()} TradeSim · Paper trading for educational purposes only. Not financial advice.
        </p>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/pricing">Pricing</Link>
          <a href="mailto:support@tradesim.app">Support</a>
        </nav>
      </footer>

      <TickerBar />
    </div>
  )
}
