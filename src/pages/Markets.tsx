import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, TrendingDown, Flame, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import TradeModal from '../components/TradeModal'

export interface Quote {
  symbol: string
  name: string
  price: number
  change: number
  changePct: number
  volume: number
}

const DEFAULT_SYMBOLS = [
  'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN',
  'META', 'TSLA', 'AMD', 'NFLX', 'COIN',
]

// Avatar color palette — deterministic per symbol
const AVATAR_COLORS = [
  '#e040fb', '#7c3aed', '#2563eb', '#059669',
  '#d97706', '#dc2626', '#0891b2', '#65a30d',
]
function avatarColor(symbol: string) {
  const idx = symbol.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

function formatPct(n: number) {
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

function formatVol(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

async function fetchQuotes(symbols: string[]): Promise<Quote[]> {
  const key = import.meta.env.VITE_FINNHUB_API_KEY as string | undefined

  if (!key) {
    return symbols.map((s) => {
      const seed = s.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      const price = 50 + (seed % 450) + Math.random() * 15
      const changePct = (Math.random() - 0.46) * 6
      return {
        symbol: s,
        name: s,
        price,
        change: price * changePct / 100,
        changePct,
        volume: Math.floor(10_000 + Math.random() * 40_000_000),
      }
    })
  }

  // Finnhub free tier: one request per symbol
  const results = await Promise.all(
    symbols.map(async (s) => {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${s}&token=${key}`
      )
      if (!res.ok) throw new Error(`Finnhub error ${res.status}`)
      const d = await res.json() as { c: number; d: number; dp: number; v?: number }
      return {
        symbol: s,
        name: s,
        price: d.c,
        change: d.d,
        changePct: d.dp,
        volume: d.v ?? 0,
      }
    })
  )
  return results
}


type FilterTab = 'trending' | 'new' | 'hot'

export default function Markets() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('trending')
  const [selected, setSelected] = useState<Quote | null>(null)
  const [portfolioId, setPortfolioId] = useState<string | null>(null)

  const loadQuotes = useCallback(async () => {
    try {
      const data = await fetchQuotes(DEFAULT_SYMBOLS)
      setQuotes(data)
    } catch {
      // keep stale
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQuotes()
    const interval = setInterval(loadQuotes, 15_000)
    return () => clearInterval(interval)
  }, [loadQuotes])

  useEffect(() => {
    if (!user) return
    supabase.from('portfolios').select('id').eq('user_id', user.id).single()
      .then(({ data }) => setPortfolioId((data as { id: string } | null)?.id ?? null))
  }, [user])

  function handleTradeClick(q: Quote) {
    if (!user) { navigate('/auth'); return }
    setSelected(q)
  }

  const sorted = [...quotes].sort((a, b) => {
    if (activeTab === 'hot') return Math.abs(b.changePct) - Math.abs(a.changePct)
    if (activeTab === 'new') return b.volume - a.volume
    return b.changePct - a.changePct // trending = biggest gainers first
  })

  const filtered = search
    ? sorted.filter((q) => q.symbol.toLowerCase().includes(search.toLowerCase()))
    : sorted

  return (
    <div className="markets-page">
      <div className="markets-header">
        <h1 className="page-title">Discover Stocks</h1>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="filter-tabs">
            <button
              type="button"
              className={`filter-tab ${activeTab === 'trending' ? 'active' : ''}`}
              onClick={() => setActiveTab('trending')}
            >
              <TrendingUp size={13} /> Trending
            </button>
            <button
              type="button"
              className={`filter-tab ${activeTab === 'new' ? 'active' : ''}`}
              onClick={() => setActiveTab('new')}
            >
              <Clock size={13} /> Volume
            </button>
            <button
              type="button"
              className={`filter-tab ${activeTab === 'hot' ? 'active' : ''}`}
              onClick={() => setActiveTab('hot')}
            >
              <Flame size={13} /> Hot
            </button>
          </div>
          <div className="search-shell">
            <Search className="search-icon" size={14} aria-hidden />
            <input
              type="search"
              className="search-input"
              placeholder="Search symbol…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : (
        <div className="stock-grid">
          {filtered.map((q) => {
            const isUp = q.changePct >= 0
            return (
              <article key={q.symbol} className="stock-card" onClick={() => handleTradeClick(q)}>
                <div className="stock-card-head">
                  <div
                    className="stock-avatar"
                    style={{ background: avatarColor(q.symbol) }}
                    aria-hidden
                  >
                    {q.symbol[0]}
                  </div>
                  <div className="stock-info">
                    <p className="stock-symbol">{q.symbol}</p>
                    <p className="stock-name">{q.name}</p>
                  </div>
                </div>

                <div className="stock-metrics">
                  <div>
                    <p className="metric-label">Price</p>
                    <p className="stock-price">{formatUsd(q.price)}</p>
                  </div>
                  <div>
                    <p className="metric-label">24H</p>
                    <p className={`stock-chip ${isUp ? 'stock-chip-up' : 'stock-chip-down'}`}>
                      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {formatPct(q.changePct)}
                    </p>
                  </div>
                </div>

                <div className="stock-footer">
                  <span className="stock-vol">Vol: {formatVol(q.volume)}</span>
                  <button
                    type="button"
                    className="btn-pill btn-buy"
                    style={{ padding: '0.4rem 1rem', fontSize: '0.8125rem' }}
                    onClick={(e) => { e.stopPropagation(); handleTradeClick(q) }}
                  >
                    Trade
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {selected && portfolioId && (
        <TradeModal
          quote={selected}
          portfolioId={portfolioId}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
