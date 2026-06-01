import { useEffect, useState } from 'react'
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface LeaderboardRow {
  user_id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
  portfolio_value: number
  cash_balance: number
  total_return_pct: number
  rank: number
}

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

const MEDAL = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { user } = useAuth()
  const [rows, setRows] = useState<LeaderboardRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('leaderboard')
      .select('*')
      .order('rank', { ascending: true })
      .limit(50)
      .then(({ data }) => {
        setRows((data as LeaderboardRow[]) ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>

  return (
    <div className="leaderboard-page">
      <div className="page-header">
        <Trophy size={28} className="page-icon" />
        <h1 className="page-title">Leaderboard</h1>
      </div>
      <p className="page-sub">Top 50 traders ranked by portfolio return from a $100,000 starting balance.</p>

      {rows.length === 0 ? (
        <div className="empty-state">
          <p>No traders yet. Be the first to sign up and make a trade!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Trader</th>
                <th>Portfolio Value</th>
                <th>Return</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isMe = user?.id === row.user_id
                const isUp = row.total_return_pct >= 0
                return (
                  <tr key={row.user_id} className={isMe ? 'row-highlight' : ''}>
                    <td className="rank-cell">
                      {row.rank <= 3 ? MEDAL[row.rank - 1] : `#${row.rank}`}
                    </td>
                    <td className="trader-cell">
                      {row.avatar_url && (
                        <img src={row.avatar_url} alt="" className="avatar-img avatar-sm" />
                      )}
                      <span>{row.display_name ?? row.username ?? 'Anonymous'}</span>
                      {isMe && <span className="you-badge">You</span>}
                    </td>
                    <td>{formatUsd(row.portfolio_value)}</td>
                    <td className={isUp ? 'up-text' : 'down-text'}>
                      {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {isUp ? '+' : ''}{row.total_return_pct?.toFixed(2)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
