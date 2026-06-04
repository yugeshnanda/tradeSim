/* ShareTrade — shows after a successful trade execution */
import { Link2, Check } from 'lucide-react'
import { useState } from 'react'

interface Props {
  symbol: string
  shares: number
  side: 'buy' | 'sell'
  price: number
}

export default function ShareTrade({ symbol, shares, side, price }: Props) {
  const [copied, setCopied] = useState(false)

  const verb = side === 'buy' ? 'bought' : 'sold'
  const tweetText = encodeURIComponent(
    `Just ${verb} ${shares} share${shares !== 1 ? 's' : ''} of $${symbol} at $${price.toFixed(2)} on TradeSim — practising investing risk free! 📈\n\nhttps://trade-sim-blond.vercel.app #investing #stocks #TradeSim`
  )
  const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`

  async function copyLink() {
    await navigator.clipboard.writeText('https://trade-sim-blond.vercel.app')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="share-trade">
      <p className="share-label">Share your trade</p>
      <div className="share-buttons">
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill share-btn share-twitter"
        >
          𝕏 Twitter / X
        </a>
        <button type="button" className="btn-pill share-btn share-copy" onClick={copyLink}>
          {copied ? <Check size={14} /> : <Link2 size={14} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  )
}
