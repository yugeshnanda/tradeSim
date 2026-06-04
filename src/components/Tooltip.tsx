/* Tooltip — plain-English financial term explainer */
import { useState, useRef } from 'react'
import { HelpCircle } from 'lucide-react'

interface Props {
  term: string
  explanation: string
}

export default function Tooltip({ term, explanation }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  return (
    <span
      ref={ref}
      className="tooltip-wrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((o) => !o)}
      aria-label={`What is ${term}?`}
    >
      <HelpCircle size={12} className="tooltip-icon" />
      {open && (
        <span className="tooltip-bubble" role="tooltip">
          <strong>{term}</strong><br />
          {explanation}
        </span>
      )}
    </span>
  )
}

/** Canonical definitions used across the app */
export const DEFINITIONS: Record<string, string> = {
  'P&L':        'Profit & Loss — how much money you\'ve made or lost on a position.',
  'Market Cap': 'The total value of a company. Calculated by: share price × total shares. Apple = ~$3 Trillion.',
  'Volume':     'How many shares were traded today. High volume = lots of interest.',
  'P/E Ratio':  'Price-to-Earnings. How much investors pay per $1 of profit. Lower can mean cheaper.',
  'Portfolio':  'All the stocks you currently own, plus your cash.',
  'Return %':   'Your gain or loss expressed as a percentage of what you originally invested.',
  'Cash Balance':'The virtual money you have available to buy more stocks.',
  'Avg Cost':   'The average price you paid per share across all your purchases of that stock.',
}
