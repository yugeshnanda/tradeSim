/* TradeHistory — full log of every buy/sell the user has made */
import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface Trade {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  shares: number
  price: number
  total: number
  executed_at: string
}

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(n))
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(new Date(iso))
}

export default function TradeHistory() {
  const { user } = useAuth()
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const { data: port } = await supabase
        .from('portfolios').select('id').eq('user_id', user!.id).single()
      if (!port) { setLoading(false); return }

      const { data } = await supabase
        .from('trades')
        .select('id,symbol,side,shares,price,total,executed_at')
        .eq('portfolio_id', (port as { id: string }).id)
        .order('executed_at', { ascending: false })

      setTrades((data as Trade[]) ?? [])
      setLoading(false)
    }
    load()
  }, [user])

  return (
    <div className="trade-history-page">
      <div className="page-header">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 className="page-title">Trade History</h1>
        <p className="page-sub">{trades.length} trades total</p>
      </div>

      {loading && <div className="loading-screen"><div className="spinner" /></div>}

      {!loading && trades.length === 0 && (
        <div className="empty-state">
          <p>No trades yet.</p>
          <Link to="/markets" className="btn-pill btn-primary" style={{ marginTop: '1rem' }}>
            Make Your First Trade
          </Link>
        </div>
      )}

      {!loading && trades.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Ticker</th>
                <th>Action</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr key={t.id}>
                  <td className="history-date">{formatDate(t.executed_at)}</td>
                  <td className="history-symbol">{t.symbol}</td>
                  <td>
                    <span className={`side-chip side-${t.side}`}>
                      {t.side === 'buy' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {t.side.toUpperCase()}
                    </span>
                  </td>
                  <td>{Number(t.shares).toFixed(4)}</td>
                  <td>{formatUsd(t.price)}</td>
                  <td className={t.side === 'sell' ? 'up-text' : ''}>
                    {t.side === 'sell' ? '+' : '-'}{formatUsd(t.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
