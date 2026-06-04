import { useState, useEffect } from 'react'
import { X, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useProgress } from '../context/ProgressContext'
import { XP_REWARDS } from '../lib/gamification'
import ShareTrade from './ShareTrade'
import type { Quote } from '../pages/Markets'

interface Props {
  quote: Quote
  portfolioId: string
  onClose: () => void
}

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)
}

export default function TradeModal({ quote, portfolioId, onClose }: Props) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [sharesInput, setSharesInput] = useState('')
  const [cashBalance, setCashBalance] = useState<number>(0)
  const [ownedShares, setOwnedShares] = useState<number>(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { recordTrade } = useProgress()

  const shares = parseFloat(sharesInput) || 0
  const total = shares * quote.price

  useEffect(() => {
    async function loadContext() {
      const { data: port } = await supabase
        .from('portfolios')
        .select('cash_balance')
        .eq('id', portfolioId)
        .single()
      if (port) setCashBalance(port.cash_balance as number)

      const { data: pos } = await supabase
        .from('positions')
        .select('shares')
        .eq('portfolio_id', portfolioId)
        .eq('symbol', quote.symbol)
        .single()
      if (pos) setOwnedShares(pos.shares as number)
    }
    loadContext()
  }, [portfolioId, quote.symbol])

  async function handleTrade() {
    if (shares <= 0) { setError('Enter a valid number of shares'); return }
    if (side === 'buy' && total > cashBalance) { setError('Insufficient cash balance'); return }
    if (side === 'sell' && shares > ownedShares) { setError(`You only own ${ownedShares.toFixed(4)} shares`); return }

    setSubmitting(true)
    setError(null)

    // Execute trade in a transaction-like sequence
    const { error: tradeErr } = await supabase.from('trades').insert({
      portfolio_id: portfolioId,
      symbol: quote.symbol,
      side,
      shares,
      price: quote.price,
      total: side === 'buy' ? total : -total,
    })
    if (tradeErr) { setError(tradeErr.message); setSubmitting(false); return }

    // Update cash
    const newCash = side === 'buy' ? cashBalance - total : cashBalance + total
    await supabase.from('portfolios').update({ cash_balance: newCash }).eq('id', portfolioId)

    // Upsert position
    const newShares = side === 'buy' ? ownedShares + shares : ownedShares - shares
    if (newShares <= 0) {
      await supabase.from('positions').delete().eq('portfolio_id', portfolioId).eq('symbol', quote.symbol)
    } else {
      const newAvgCost = side === 'buy'
        ? (ownedShares * (cashBalance - newCash) / shares + quote.price * shares) / newShares
        : ownedShares > 0 ? (ownedShares * (cashBalance - newCash) / -shares) : quote.price
      await supabase.from('positions').upsert({
        portfolio_id: portfolioId,
        symbol: quote.symbol,
        shares: newShares,
        avg_cost: side === 'buy'
          ? (ownedShares * (ownedShares > 0 ? newAvgCost : quote.price) + shares * quote.price) / newShares
          : newAvgCost,
      }, { onConflict: 'portfolio_id,symbol' })
    }

    setSuccess(true)
    setSubmitting(false)
    await recordTrade()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal aria-labelledby="modal-title" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <h2 id="modal-title" className="modal-title">
          {quote.symbol} · {formatUsd(quote.price)}
        </h2>

        {success ? (
          <div className="trade-success">
            <p className="success-msg">
              Order filled! {side === 'buy' ? 'Bought' : 'Sold'} {shares} share{shares !== 1 ? 's' : ''} of {quote.symbol} at {formatUsd(quote.price)}.
            </p>
            <div className="xp-toast" style={{ margin: '0 auto 1rem' }}>
              <Star size={13} /> +{XP_REWARDS.makeTrade} XP earned
            </div>
            {/* Share buttons — viral loop */}
            <ShareTrade symbol={quote.symbol} shares={shares} side={side} price={quote.price} />
            <button className="btn-pill btn-glow-secondary" onClick={onClose} style={{ marginTop: '0.75rem' }}>Done</button>
          </div>
        ) : (
          <>
            <div className="trade-tabs">
              <button
                type="button"
                className={`trade-tab ${side === 'buy' ? 'active-buy' : ''}`}
                onClick={() => setSide('buy')}
              >
                Buy
              </button>
              <button
                type="button"
                className={`trade-tab ${side === 'sell' ? 'active-sell' : ''}`}
                onClick={() => setSide('sell')}
              >
                Sell
              </button>
            </div>

            <div className="trade-context">
              {side === 'buy' ? (
                <p>Cash available: <strong>{formatUsd(cashBalance)}</strong></p>
              ) : (
                <p>Shares owned: <strong>{ownedShares.toFixed(4)}</strong></p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="shares-input">Shares</label>
              <input
                id="shares-input"
                type="number"
                min="0.0001"
                step="0.0001"
                value={sharesInput}
                onChange={(e) => setSharesInput(e.target.value)}
                placeholder="0"
                autoFocus
              />
            </div>

            {shares > 0 && (
              <p className="trade-total">
                Total: <strong>{formatUsd(total)}</strong>
              </p>
            )}

            {error && <p className="form-error" role="alert">{error}</p>}

            <button
              type="button"
              className={`btn-pill btn-full ${side === 'buy' ? 'btn-glow-primary' : 'btn-sell'}`}
              onClick={handleTrade}
              disabled={submitting}
            >
              {submitting ? 'Processing…' : `${side === 'buy' ? 'Buy' : 'Sell'} ${quote.symbol}`}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
