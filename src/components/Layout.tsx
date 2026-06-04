import { Link, useNavigate } from 'react-router-dom'
import { Search, TrendingUp, Trophy, LogOut, User, BookOpen } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../context/ProgressContext'
import TickerBar from './TickerBar'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile, signOut } = useAuth()
  const { streakCount, levelInfo, loading: progressLoading } = useProgress()
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
          <Link to="/learn" className="nav-link">
            <BookOpen size={14} />
            Learn
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.trim()
                  if (val) navigate(`/markets?q=${encodeURIComponent(val)}`)
                }
              }}
            />
          </div>
        </div>

        <div className="nav-actions">
          {user && !progressLoading && (
            <div className="nav-progress-chips">
              <span className="nav-chip nav-streak" title="Daily streak">
                🔥 {streakCount}
              </span>
              <span className="nav-chip nav-level" style={{ color: levelInfo.color }} title={`Level ${levelInfo.level}`}>
                {levelInfo.emoji} {levelInfo.title}
              </span>
            </div>
          )}
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

      <footer className="footer footer-full">
        <div className="footer-brand">
          <span className="nav-logo" aria-hidden style={{ width: 24, height: 24, fontSize: '0.7rem' }} />
          <div>
            <p className="footer-name">TradeSim</p>
            <p className="footer-tagline">Learn to invest. Risk free.</p>
          </div>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link to="/markets">Markets</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/learn">Learn</Link>
          <Link to="/pricing">Pricing</Link>
        </nav>
        <div className="footer-right">
          <a
            href="https://github.com/yugeshnanda/tradeSim"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-gh"
            aria-label="GitHub"
          >
            ⚡ Built by Yugesh Nandakumar
          </a>
          <p className="footer-disclaimer">
            Not financial advice. For educational purposes only.
          </p>
        </div>
      </footer>

      <TickerBar />
    </div>
  )
}
