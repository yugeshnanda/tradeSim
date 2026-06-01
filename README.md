# TradeSim — Paper Trading Platform

A beginner-friendly paper trading platform where users practice buying and selling stocks with $100,000 in virtual cash. No real money, no risk.

**Live:** https://trade-sim-blond.vercel.app

---

## Features

- **Paper Trading** — Simulate buy/sell orders at real market prices with instant fills
- **Live Quotes** — Real-time stock prices via Finnhub API (AAPL, TSLA, NVDA, GOOGL, AMZN, META, AMD, NFLX, COIN, MSFT)
- **Portfolio Dashboard** — Track cash balance, open positions, P&L, and trade history
- **Leaderboard** — Compete with other users ranked by portfolio return
- **Auth** — Email/password and Google OAuth via Supabase
- **Pricing** — Free tier + Pro subscription ($9/month via Stripe — coming soon)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Routing | React Router v7 |
| Auth & Database | Supabase (Postgres + RLS) |
| Market Data | Finnhub API |
| Payments | Stripe (coming soon) |
| Hosting | Vercel |

---

## Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.example` to `.env.local` and fill in your keys:
```bash
cp .env.example .env.local
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_FINNHUB_API_KEY=your-finnhub-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-key
```

### 3. Set up the database
Run the SQL in `src/lib/supabase-schema.sql` in your Supabase SQL Editor.

### 4. Start the dev server
```bash
npm run dev
```

Open http://localhost:5173

---

## Database Schema

- `profiles` — User profile extending Supabase auth (username, display name, tier)
- `portfolios` — One per user, tracks cash balance (starts at $100,000)
- `positions` — Open stock positions per portfolio (symbol, shares, avg cost)
- `trades` — Full trade history (buy/sell, price, shares, timestamp)
- `leaderboard` — View ranking all users by total portfolio return %

All tables use Row Level Security — users can only access their own data.

---

## Deployment

Deployed on Vercel. Every push to `main` triggers an automatic redeploy.

Environment variables must be set in the Vercel dashboard (never commit `.env.local`).

---

## Roadmap

- [ ] Stripe Pro subscription integration
- [ ] Real-time price updates via WebSocket
- [ ] Options and crypto simulation (Pro tier)
- [ ] Advanced portfolio analytics (Pro tier)
- [ ] Custom watchlists
- [ ] Mobile responsive improvements
