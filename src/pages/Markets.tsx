import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, TrendingDown, Flame, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import TradeModal from '../components/TradeModal'
import { ALL_STOCKS, SECTORS, SECTOR_COLORS, STOCK_MAP, type Sector } from '../lib/stocks'

export interface Quote {
  symbol: string
  name: string
  sector: Sector
  price: number
  change: number
  changePct: number
  volume: number
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

// Fetch quotes using Finnhub — batched in groups to avoid rate limits
async function fetchQuotes(symbols: string[]): Promise<Quote[]> {
  const key = import.meta.env.VITE_FINNHUB_API_KEY as string | undefined

  if (!key) {
    return symbols.map((s) => {
      const meta = STOCK_MAP[s]
      const seed = s.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      const price = 20 + (seed % 480) + Math.random() * 20
      const changePct = (Math.random() - 0.46) * 6
      return {
        symbol: s,
        name: meta?.name ?? s,
        sector: meta?.sector ?? 'Tech',
        price,
        change: price * changePct / 100,
        changePct,
        volume: Math.floor(50_000 + Math.random() * 40_000_000),
      }
    })
  }

  // Stagger requests slightly to avoid rate-limiting on free tier
  const results: Quote[] = []
  for (let i = 0; i < symbols.length; i++) {
    const s = symbols[i]
    const meta = STOCK_MAP[s]
    try {
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${s}&token=${key}`)
      if (!res.ok) throw new Error()
      const d = await res.json() as { c: number; d: number; dp: number }
      results.push({
        symbol: s,
        name: meta?.name ?? s,
        sector: meta?.sector ?? 'Tech',
        price: d.c,
        change: d.d,
        changePct: d.dp,
        volume: 0,
      })
    } catch {
      // Fallback for this symbol if API fails
      const seed = s.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      const price = 20 + (seed % 480)
      results.push({ symbol: s, name: meta?.name ?? s, sector: meta?.sector ?? 'Tech', price, change: 0, changePct: 0, volume: 0 })
    }
    // Small delay between requests to respect Finnhub free tier (60 calls/min)
    if (i < symbols.length - 1) await new Promise(r => setTimeout(r, 80))
  }
  return results
}

type SortTab = 'trending' | 'volume' | 'hot'

export default function Markets() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortTab, setSortTab] = useState<SortTab>('trending')
  const [sectorFilter, setSectorFilter] = useState<typeof SECTORS[number]>('All')
  const [selected, setSelected] = useState<Quote | null>(null)
  const [portfolioId, setPortfolioId] = useState<string | null>(null)

  const symbols = ALL_STOCKS.map((s) => s.symbol)

  const loadQuotes = useCallback(async () => {
    try {
      const data = await fetchQuotes(symbols)
      setQuotes(data)
    } catch {
      // keep stale
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQuotes()
    const interval = setInterval(loadQuotes, 60_000) // 1 min refresh (Finnhub rate limit friendly)
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

  let filtered = [...quotes]

  // Sector filter
  if (sectorFilter !== 'All') {
    filtered = filtered.filter((q) => q.sector === sectorFilter)
  }

  // Search
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter((s) =>
      s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    )
  }

  // Sort
  filtered.sort((a, b) => {
    if (sortTab === 'hot') return Math.abs(b.changePct) - Math.abs(a.changePct)
    if (sortTab === 'volume') return b.volume - a.volume
    return b.changePct - a.changePct
  })

  return (
    <div className="markets-page">
      <div className="markets-header">
        <h1 className="page-title">Discover Stocks</h1>
        <div className="markets-controls">
          <div className="filter-tabs">
            <button type="button" className={`filter-tab ${sortTab === 'trending' ? 'active' : ''}`} onClick={() => setSortTab('trending')}>
              <TrendingUp size={13} /> Trending
            </button>
            <button type="button" className={`filter-tab ${sortTab === 'volume' ? 'active' : ''}`} onClick={() => setSortTab('volume')}>
              <Clock size={13} /> Volume
            </button>
            <button type="button" className={`filter-tab ${sortTab === 'hot' ? 'active' : ''}`} onClick={() => setSortTab('hot')}>
              <Flame size={13} /> Hot
            </button>
          </div>
          <div className="search-shell">
            <Search className="search-icon" size={14} aria-hidden />
            <input
              type="search"
              className="search-input"
              placeholder="Search symbol or company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* Sector pills */}
      <div className="sector-pills">
        {SECTORS.map((s) => {
          const isActive = sectorFilter === s
          const color = s !== 'All' ? SECTOR_COLORS[s as Sector] : undefined
          return (
            <button
              key={s}
              type="button"
              className={`sector-pill ${isActive ? 'active' : ''}`}
              onClick={() => setSectorFilter(s)}
              style={isActive && color ? { background: color + '22', borderColor: color, color } : {}}
            >
              {s}
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : (
        <>
          <p className="results-count">{filtered.length} stocks</p>
          <div className="stock-grid">
            {filtered.map((q) => {
              const isUp = q.changePct >= 0
              const color = SECTOR_COLORS[q.sector]
              return (
                <article key={q.symbol} className="stock-card" onClick={() => handleTradeClick(q)}>
                  <div className="stock-card-head">
                    <div className="stock-avatar" style={{ background: color }} aria-hidden>
                      {q.symbol[0]}
                    </div>
                    <div className="stock-info">
                      <p className="stock-symbol">{q.symbol}</p>
                      <p className="stock-name">{q.name}</p>
                    </div>
                    <span
                      className="sector-tag"
                      style={{ color, background: color + '18', borderColor: color + '40' }}
                    >
                      {q.sector}
                    </span>
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
                    {q.volume > 0 && <span className="stock-vol">Vol: {formatVol(q.volume)}</span>}
                    <button
                      type="button"
                      className="btn-pill btn-buy"
                      style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem', marginLeft: 'auto' }}
                      onClick={(e) => { e.stopPropagation(); handleTradeClick(q) }}
                    >
                      Trade
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </>
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
