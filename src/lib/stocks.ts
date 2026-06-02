export interface StockMeta {
  symbol: string
  name: string
  sector: Sector
}

export type Sector =
  | 'Tech'
  | 'Finance'
  | 'Healthcare'
  | 'Energy'
  | 'Consumer'
  | 'Crypto'
  | 'ETF'

export const SECTOR_COLORS: Record<Sector, string> = {
  Tech:       '#7c3aed',
  Finance:    '#2563eb',
  Healthcare: '#059669',
  Energy:     '#d97706',
  Consumer:   '#db2777',
  Crypto:     '#e040fb',
  ETF:        '#0891b2',
}

export const ALL_STOCKS: StockMeta[] = [
  // Tech
  { symbol: 'AAPL',  name: 'Apple Inc.',           sector: 'Tech' },
  { symbol: 'MSFT',  name: 'Microsoft Corp.',       sector: 'Tech' },
  { symbol: 'NVDA',  name: 'NVIDIA Corp.',          sector: 'Tech' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.',         sector: 'Tech' },
  { symbol: 'AMZN',  name: 'Amazon.com Inc.',       sector: 'Tech' },
  { symbol: 'META',  name: 'Meta Platforms',        sector: 'Tech' },
  { symbol: 'TSLA',  name: 'Tesla Inc.',            sector: 'Tech' },
  { symbol: 'AMD',   name: 'Advanced Micro Devices',sector: 'Tech' },
  { symbol: 'INTC',  name: 'Intel Corp.',           sector: 'Tech' },
  { symbol: 'ORCL',  name: 'Oracle Corp.',          sector: 'Tech' },
  { symbol: 'ADBE',  name: 'Adobe Inc.',            sector: 'Tech' },
  { symbol: 'CRM',   name: 'Salesforce Inc.',       sector: 'Tech' },
  { symbol: 'UBER',  name: 'Uber Technologies',     sector: 'Tech' },
  { symbol: 'SHOP',  name: 'Shopify Inc.',          sector: 'Tech' },
  { symbol: 'PLTR',  name: 'Palantir Technologies', sector: 'Tech' },
  { symbol: 'SNOW',  name: 'Snowflake Inc.',        sector: 'Tech' },
  { symbol: 'NET',   name: 'Cloudflare Inc.',       sector: 'Tech' },

  // Finance
  { symbol: 'JPM',   name: 'JPMorgan Chase',        sector: 'Finance' },
  { symbol: 'BAC',   name: 'Bank of America',       sector: 'Finance' },
  { symbol: 'GS',    name: 'Goldman Sachs',         sector: 'Finance' },
  { symbol: 'V',     name: 'Visa Inc.',             sector: 'Finance' },
  { symbol: 'MA',    name: 'Mastercard Inc.',       sector: 'Finance' },
  { symbol: 'AXP',   name: 'American Express',      sector: 'Finance' },
  { symbol: 'BLK',   name: 'BlackRock Inc.',        sector: 'Finance' },
  { symbol: 'C',     name: 'Citigroup Inc.',        sector: 'Finance' },

  // Healthcare
  { symbol: 'JNJ',   name: 'Johnson & Johnson',     sector: 'Healthcare' },
  { symbol: 'PFE',   name: 'Pfizer Inc.',           sector: 'Healthcare' },
  { symbol: 'MRNA',  name: 'Moderna Inc.',          sector: 'Healthcare' },
  { symbol: 'UNH',   name: 'UnitedHealth Group',    sector: 'Healthcare' },
  { symbol: 'ABBV',  name: 'AbbVie Inc.',           sector: 'Healthcare' },
  { symbol: 'LLY',   name: 'Eli Lilly & Co.',       sector: 'Healthcare' },
  { symbol: 'MRK',   name: 'Merck & Co.',           sector: 'Healthcare' },

  // Energy
  { symbol: 'XOM',   name: 'Exxon Mobil',          sector: 'Energy' },
  { symbol: 'CVX',   name: 'Chevron Corp.',         sector: 'Energy' },
  { symbol: 'COP',   name: 'ConocoPhillips',        sector: 'Energy' },
  { symbol: 'NEE',   name: 'NextEra Energy',        sector: 'Energy' },

  // Consumer
  { symbol: 'WMT',   name: 'Walmart Inc.',          sector: 'Consumer' },
  { symbol: 'TGT',   name: 'Target Corp.',          sector: 'Consumer' },
  { symbol: 'COST',  name: 'Costco Wholesale',      sector: 'Consumer' },
  { symbol: 'MCD',   name: "McDonald's Corp.",      sector: 'Consumer' },
  { symbol: 'SBUX',  name: 'Starbucks Corp.',       sector: 'Consumer' },
  { symbol: 'NKE',   name: 'Nike Inc.',             sector: 'Consumer' },
  { symbol: 'DIS',   name: 'Walt Disney Co.',       sector: 'Consumer' },
  { symbol: 'NFLX',  name: 'Netflix Inc.',          sector: 'Consumer' },

  // Crypto-adjacent
  { symbol: 'COIN',  name: 'Coinbase Global',       sector: 'Crypto' },
  { symbol: 'MSTR',  name: 'MicroStrategy Inc.',    sector: 'Crypto' },
  { symbol: 'MARA',  name: 'MARA Holdings',         sector: 'Crypto' },
  { symbol: 'RIOT',  name: 'Riot Platforms',        sector: 'Crypto' },

  // ETFs
  { symbol: 'SPY',   name: 'S&P 500 ETF',          sector: 'ETF' },
  { symbol: 'QQQ',   name: 'Nasdaq 100 ETF',        sector: 'ETF' },
  { symbol: 'IWM',   name: 'Russell 2000 ETF',      sector: 'ETF' },
  { symbol: 'GLD',   name: 'Gold ETF',              sector: 'ETF' },
]

export const ALL_SYMBOLS = ALL_STOCKS.map((s) => s.symbol)

export const STOCK_MAP = Object.fromEntries(
  ALL_STOCKS.map((s) => [s.symbol, s])
) as Record<string, StockMeta>

export const SECTORS = ['All', 'Tech', 'Finance', 'Healthcare', 'Energy', 'Consumer', 'Crypto', 'ETF'] as const
