export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          tier: 'free' | 'pro'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          tier?: 'free' | 'pro'
          created_at?: string
          updated_at?: string
        }
        Update: {
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          tier?: 'free' | 'pro'
          updated_at?: string
        }
      }
      portfolios: {
        Row: {
          id: string
          user_id: string
          cash_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cash_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          cash_balance?: number
          updated_at?: string
        }
      }
      positions: {
        Row: {
          id: string
          portfolio_id: string
          symbol: string
          shares: number
          avg_cost: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          symbol: string
          shares: number
          avg_cost: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          shares?: number
          avg_cost?: number
          updated_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          portfolio_id: string
          symbol: string
          side: 'buy' | 'sell'
          shares: number
          price: number
          total: number
          executed_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          symbol: string
          side: 'buy' | 'sell'
          shares: number
          price: number
          total: number
          executed_at?: string
        }
        Update: never
      }
    }
    Views: {
      leaderboard: {
        Row: {
          user_id: string
          display_name: string | null
          username: string | null
          avatar_url: string | null
          portfolio_value: number
          cash_balance: number
          total_return_pct: number
          rank: number
        }
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
