import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, BookOpen, ChevronRight, Flame, Star, Target, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useProgress } from '../context/ProgressContext'
import { supabase } from '../lib/supabase'
import { MISSIONS, getTodaysChallenges } from '../lib/gamification'
import { LESSONS } from '../lib/lessons'

const STARTING_BALANCE = 100_000

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export default function Dashboard() {
  const { user, profile } = useAuth()
  const progress = useProgress()
  const [portfolio, setPortfolio] = useState<{ cash_balance: number } | null>(null)
  const [positionsValue, setPositionsValue] = useState(0)
  const [recentTrades, setRecentTrades] = useState<{ symbol: string; side: string; total: number; executed_at: string }[]>([])

  const todaysChallenges = getTodaysChallenges()

  useEffect(() => {
    if (!user) return
    async function load() {
      const { data: port } = await supabase.from('portfolios').select('id,cash_balance').eq('user_id', user!.id).single()
      if (!port) return
      setPortfolio(port as { cash_balance: number; id: string })

      const { data: pos } = await supabase.from('positions').select('shares,avg_cost').eq('portfolio_id', (port as { id: string }).id)
      const val = (pos ?? []).reduce((s: number, p: { shares: number; avg_cost: number }) => s + p.shares * p.avg_cost, 0)
      setPositionsValue(val)

      const { data: trades } = await supabase.from('trades').select('symbol,side,total,executed_at')
        .eq('portfolio_id', (port as { id: string }).id).order('executed_at', { ascending: false }).limit(5)
      setRecentTrades(trades ?? [])
    }
    load()
  }, [user])

  const totalValue = (portfolio?.cash_balance ?? STARTING_BALANCE) + positionsValue
  const totalReturn = totalValue - STARTING_BALANCE
  const returnPct = (totalReturn / STARTING_BALANCE) * 100
  const isUp = totalReturn >= 0

  const { levelInfo, xp, streakCount, completedLessonIds, completedMissionIds, todaysChallengeIds } = progress

  // Next lesson not yet completed
  const nextLesson = LESSONS.find((l) => !completedLessonIds.has(l.id))

  // Active missions (not completed, unlocked for current level)
  const activeMissions = MISSIONS.filter(
    (m) => !completedMissionIds.has(m.id) && m.unlockLevel <= levelInfo.level
  ).slice(0, 3)

  return (
    <div className="hub-page">
      {/* ── Header greeting ── */}
      <div className="hub-greeting">
        <div>
          <h1 className="hub-title">
            Hey {profile?.display_name?.split(' ')[0] ?? 'Trader'} 👋
          </h1>
          <p className="hub-subtitle">Here's your progress today.</p>
        </div>
        <Link to="/markets" className="btn-pill btn-primary">
          <TrendingUp size={15} /> Trade Now
        </Link>
      </div>

      {/* ── Level + XP bar ── */}
      <div className="xp-card">
        <div className="xp-card-left">
          <span className="level-emoji">{levelInfo.emoji}</span>
          <div>
            <div className="level-title">Level {levelInfo.level} · {levelInfo.title}</div>
            <div className="xp-bar-wrap">
              <div className="xp-bar">
                <div className="xp-bar-fill" style={{ width: `${levelInfo.progressPct}%`, background: levelInfo.color }} />
              </div>
              <span className="xp-label">{levelInfo.xpIntoLevel} / {levelInfo.xpNeeded} XP</span>
            </div>
          </div>
        </div>
        <div className="xp-card-right">
          <div className="xp-stat">
            <Star size={14} />
            <span>{xp} XP total</span>
          </div>
          <div className="xp-stat streak">
            <Flame size={14} />
            <span>{streakCount} day streak</span>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="hub-stats">
        <div className="hub-stat-card">
          <p className="hub-stat-label">Portfolio Value</p>
          <p className="hub-stat-value">{formatUsd(totalValue)}</p>
          <p className={`hub-stat-change ${isUp ? 'up' : 'down'}`}>
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isUp ? '+' : ''}{returnPct.toFixed(2)}%
          </p>
        </div>
        <div className="hub-stat-card">
          <p className="hub-stat-label">Cash Available</p>
          <p className="hub-stat-value">{formatUsd(portfolio?.cash_balance ?? STARTING_BALANCE)}</p>
        </div>
        <div className="hub-stat-card">
          <p className="hub-stat-label">Lessons Done</p>
          <p className="hub-stat-value">{completedLessonIds.size} <span style={{ fontSize: '1rem', color: 'var(--ink-muted)' }}>/ {LESSONS.length}</span></p>
        </div>
        <div className="hub-stat-card">
          <p className="hub-stat-label">Trades Made</p>
          <p className="hub-stat-value">{progress.totalTrades}</p>
        </div>
      </div>

      <div className="hub-grid">
        {/* ── Daily Challenges ── */}
        <section className="hub-section">
          <div className="hub-section-head">
            <h2 className="hub-section-title">
              <Flame size={16} className="section-icon-fire" /> Daily Challenges
            </h2>
            <span className="hub-section-badge">{todaysChallengeIds.size}/{todaysChallenges.length} done</span>
          </div>
          <div className="challenges-list">
            {todaysChallenges.map((c) => {
              const done = todaysChallengeIds.has(c.id)
              return (
                <div key={c.id} className={`challenge-row ${done ? 'challenge-done' : ''}`}>
                  <span className="challenge-emoji">{c.emoji}</span>
                  <div className="challenge-info">
                    <p className="challenge-title">{c.title}</p>
                    <p className="challenge-desc">{c.description}</p>
                  </div>
                  <div className="challenge-right">
                    {done
                      ? <CheckCircle size={18} className="challenge-check" />
                      : <span className="challenge-xp">+{c.xpReward} XP</span>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Active Missions ── */}
        <section className="hub-section">
          <div className="hub-section-head">
            <h2 className="hub-section-title">
              <Target size={16} /> Missions
            </h2>
            <span className="hub-section-badge">{completedMissionIds.size} completed</span>
          </div>
          {activeMissions.length === 0 ? (
            <p className="hub-empty">All missions complete! 🎉 Check back for more.</p>
          ) : (
            <div className="missions-list">
              {activeMissions.map((m) => (
                <div key={m.id} className="mission-row">
                  <span className="mission-emoji">{m.emoji}</span>
                  <div className="mission-info">
                    <p className="mission-title">{m.title}</p>
                    <p className="mission-desc">{m.hint}</p>
                  </div>
                  <span className="mission-xp">+{m.xpReward} XP</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Next lesson ── */}
        <section className="hub-section">
          <div className="hub-section-head">
            <h2 className="hub-section-title">
              <BookOpen size={16} /> Continue Learning
            </h2>
          </div>
          {nextLesson ? (
            <Link to="/learn" className="next-lesson-card">
              <span className="next-lesson-emoji">{nextLesson.emoji}</span>
              <div>
                <p className="next-lesson-title">{nextLesson.title}</p>
                <p className="next-lesson-meta">{nextLesson.readMins} min · {nextLesson.difficulty} · +50 XP</p>
              </div>
              <ChevronRight size={18} className="next-lesson-arrow" />
            </Link>
          ) : (
            <div className="hub-empty-card">
              <p>🎓 All lessons complete! You're a pro.</p>
              <Link to="/markets" className="btn-pill btn-primary" style={{ marginTop: '0.75rem' }}>Start Trading</Link>
            </div>
          )}

          {/* Lesson progress */}
          <div className="lesson-progress-bar-wrap">
            <div className="lesson-progress-bar">
              <div
                className="lesson-progress-fill"
                style={{ width: `${(completedLessonIds.size / LESSONS.length) * 100}%` }}
              />
            </div>
            <span className="lesson-progress-label">{completedLessonIds.size}/{LESSONS.length} lessons</span>
          </div>
        </section>

        {/* ── Recent trades ── */}
        <section className="hub-section">
          <div className="hub-section-head">
            <h2 className="hub-section-title">Recent Trades</h2>
            <Link to="/dashboard/portfolio" className="hub-section-link">View all</Link>
          </div>
          {recentTrades.length === 0 ? (
            <div className="hub-empty">
              <p>No trades yet.</p>
              <Link to="/markets" className="btn-pill btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                Make Your First Trade
              </Link>
            </div>
          ) : (
            <div className="recent-trades-list">
              {recentTrades.map((t, i) => (
                <div key={i} className="recent-trade-row">
                  <span className={`side-chip side-${t.side}`}>{t.side.toUpperCase()}</span>
                  <span className="rt-symbol">{t.symbol}</span>
                  <span className="rt-amount">{formatUsd(Math.abs(t.total))}</span>
                  <span className="rt-date">{new Date(t.executed_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
