import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'

type Portfolio = Database['public']['Tables']['portfolios']['Row']
type Position = Database['public']['Tables']['positions']['Row']
type Trade = Database['public']['Tables']['trades']['Row']

const STARTING_BALANCE = 100_000

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function formatPct(n: number) {
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

export default function Dashboard() {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [positions, setPositions] = useState<Position[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const { data: port } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user!.id)
        .single()
      if (!port) { setLoading(false); return }
      setPortfolio(port)

      const { data: pos } = await supabase
        .from('positions')
        .select('*')
        .eq('portfolio_id', port.id)
        .gt('shares', 0)
      setPositions(pos ?? [])

      const { data: tr } = await supabase
        .from('trades')
        .select('*')
        .eq('portfolio_id', port.id)
        .order('executed_at', { ascending: false })
        .limit(20)
      setTrades(tr ?? [])
      setLoading(false)
    }
    load()
  }, [user])

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /></div>
  }

  if (!portfolio) {
    return (
      <div className="empty-state">
        <p>Portfolio not found. <Link to="/auth">Sign in again</Link></p>
      </div>
    )
  }

  const positionsValue = positions.reduce((sum, p) => sum + p.shares * p.avg_cost, 0)
  const totalValue = portfolio.cash_balance + positionsValue
  const totalReturn = totalValue - STARTING_BALANCE
  const totalReturnPct = (totalReturn / STARTING_BALANCE) * 100
  const isUp = totalReturn >= 0

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="page-title">My Portfolio</h1>
        <Link to="/markets" className="btn-pill btn-glow-primary">
          Trade Now
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><DollarSign size={20} /></div>
          <div className="stat-label">Total Value</div>
          <div className="stat-value">{formatUsd(totalValue)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><DollarSign size={20} /></div>
          <div className="stat-label">Cash Available</div>
          <div className="stat-value">{formatUsd(portfolio.cash_balance)}</div>
        </div>
        <div className={`stat-card ${isUp ? 'stat-card-up' : 'stat-card-down'}`}>
          <div className="stat-icon">
            {isUp ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          </div>
          <div className="stat-label">Total Return</div>
          <div className="stat-value">{formatUsd(totalReturn)}</div>
          <div className="stat-sub">{formatPct(totalReturnPct)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><BarChart2 size={20} /></div>
          <div className="stat-label">Open Positions</div>
          <div className="stat-value">{positions.length}</div>
        </div>
      </div>

      <section className="dashboard-section" aria-labelledby="positions-heading">
        <h2 id="positions-heading" className="section-title-sm">Open Positions</h2>
        {positions.length === 0 ? (
          <div className="empty-state">
            <p>No open positions yet.</p>
            <Link to="/markets" className="btn-pill btn-glow-secondary">Browse Markets</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Shares</th>
                  <th>Avg Cost</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos) => (
                  <tr key={pos.id}>
                    <td className="symbol-cell">{pos.symbol}</td>
                    <td>{pos.shares.toFixed(4)}</td>
                    <td>{formatUsd(pos.avg_cost)}</td>
                    <td>{formatUsd(pos.shares * pos.avg_cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="dashboard-section" aria-labelledby="history-heading">
        <h2 id="history-heading" className="section-title-sm">Recent Trades</h2>
        {trades.length === 0 ? (
          <p className="empty-text">No trades yet.</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Symbol</th>
                  <th>Side</th>
                  <th>Shares</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.executed_at).toLocaleDateString()}</td>
                    <td className="symbol-cell">{t.symbol}</td>
                    <td>
                      <span className={`side-chip side-${t.side}`}>{t.side.toUpperCase()}</span>
                    </td>
                    <td>{Number(t.shares).toFixed(4)}</td>
                    <td>{formatUsd(t.price)}</td>
                    <td>{formatUsd(t.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
