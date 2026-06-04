/* Sparkline — lightweight SVG mini-chart, no external deps */

interface Props {
  /** 7 data points, values in any range */
  data: number[]
  width?: number
  height?: number
  positive?: boolean
}

export default function Sparkline({ data, width = 80, height = 32, positive }: Props) {
  if (data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const polyline = pts.join(' ')

  const first = pts[0].split(',')
  const last  = pts[pts.length - 1].split(',')
  const color = positive !== false ? '#00e676' : '#ff1744'
  const fillColor = positive !== false ? 'rgba(0,230,118,0.10)' : 'rgba(255,23,68,0.10)'

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      {/* Filled area */}
      <path d={`M ${first[0]},${height} L ${pts.join(' L ')} L ${last[0]},${height} Z`}
        fill={fillColor} />
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Generate deterministic fake 7-point sparkline data from a stock symbol seed */
export function seedSparkline(symbol: string, positive: boolean): number[] {
  const seed = symbol.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const base = 100
  const pts: number[] = [base]
  for (let i = 1; i < 7; i++) {
    const noise = ((seed * (i + 1) * 1234567) % 100) / 100 - 0.5
    const trend = positive ? 0.8 : -0.8
    pts.push(pts[i - 1] + trend + noise * 4)
  }
  return pts
}
