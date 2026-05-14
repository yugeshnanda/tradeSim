import './App.css'

const STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 228.42, changePct: 1.24 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 341.05, changePct: -0.62 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 139.88, changePct: 2.81 },
] as const

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function formatPct(n: number) {
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

export default function App() {
  return (
    <div className="trade-sim" id="top">
      <header className="nav">
        <a href="#top" className="nav-brand" aria-label="TradeSim home">
          <span className="nav-logo" aria-hidden />
          <span className="nav-wordmark">TradeSim</span>
        </a>

        <div className="nav-search">
          <label htmlFor="nav-search" className="sr-only">
            Search markets
          </label>
          <div className="search-shell">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              />
            </svg>
            <input
              id="nav-search"
              type="search"
              className="search-input"
              placeholder="Search symbols, companies…"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="nav-actions">
          <button type="button" className="btn-pill btn-signin">
            Sign In
          </button>
        </div>
      </header>

      <main className="main">
        <section className="hero" aria-labelledby="hero-heading">
          <p className="hero-eyebrow">Paper trading · simulated fills</p>
          <h1 id="hero-heading" className="hero-title">
            <span className="hero-line">Practice Trading.</span>
            <span className="hero-line hero-line-accent">Zero Risk.</span>
          </h1>
          <p className="hero-sub">
            Build strategies with live-style quotes and instant feedback — no bank
            connection, no capital on the line. Your sandbox for the real market.
          </p>
          <div className="hero-cta">
            <button type="button" className="btn-pill btn-glow-primary">
              Start Trading
            </button>
            <a href="#markets" className="btn-pill btn-glow-secondary">
              View Markets
            </a>
          </div>
        </section>

        <section id="markets" className="markets" aria-labelledby="markets-heading">
          <div className="markets-head">
            <h2 id="markets-heading" className="markets-title">
              Watchlist
            </h2>
            <p className="markets-sub">Tap Buy to simulate an order at the quoted price.</p>
          </div>

          <div className="stock-grid">
            {STOCKS.map((s) => (
              <article key={s.symbol} className="stock-card">
                <header className="stock-card-head">
                  <div>
                    <h3 className="stock-symbol">{s.symbol}</h3>
                    <p className="stock-name">{s.name}</p>
                  </div>
                  <span
                    className={
                      s.changePct >= 0 ? 'stock-chip stock-chip-up' : 'stock-chip stock-chip-down'
                    }
                  >
                    {formatPct(s.changePct)}
                  </span>
                </header>
                <p className="stock-price">{formatUsd(s.price)}</p>
                <button
                  type="button"
                  className="btn-pill btn-buy"
                  onClick={() => {
                    console.info(`[TradeSim] Buy ${s.symbol} @ ${s.price}`)
                  }}
                >
                  Buy
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
