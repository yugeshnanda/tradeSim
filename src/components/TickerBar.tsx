const TICKERS = [
  { symbol: 'AAPL', price: '$228.42', change: '+1.24%', up: true },
  { symbol: 'TSLA', price: '$341.05', change: '-0.62%', up: false },
  { symbol: 'NVDA', price: '$139.88', change: '+2.81%', up: true },
  { symbol: 'MSFT', price: '$415.20', change: '+0.95%', up: true },
  { symbol: 'GOOGL', price: '$178.34', change: '-0.31%', up: false },
  { symbol: 'AMZN', price: '$192.10', change: '+1.55%', up: true },
  { symbol: 'META', price: '$502.88', change: '+3.12%', up: true },
  { symbol: 'AMD', price: '$162.45', change: '-1.08%', up: false },
  { symbol: 'NFLX', price: '$684.20', change: '+0.74%', up: true },
  { symbol: 'COIN', price: '$224.60', change: '+5.33%', up: true },
]

// Duplicate for seamless loop
const ALL = [...TICKERS, ...TICKERS]

export default function TickerBar() {
  return (
    <div className="ticker-bar" aria-hidden>
      <div className="ticker-track">
        {ALL.map((t, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-symbol">{t.symbol}</span>
            <span className="ticker-price">{t.price}</span>
            <span className={t.up ? 'ticker-change-up' : 'ticker-change-down'}>{t.change}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
