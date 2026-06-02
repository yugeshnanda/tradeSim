// ── XP & Levels ──────────────────────────────────────────────────
export interface Level {
  level: number
  title: string
  emoji: string
  minXp: number
  maxXp: number
  color: string
}

export const LEVELS: Level[] = [
  { level: 1, title: 'Rookie',     emoji: '🌱', minXp: 0,    maxXp: 150,  color: '#6b7280' },
  { level: 2, title: 'Student',    emoji: '📚', minXp: 150,  maxXp: 400,  color: '#3b82f6' },
  { level: 3, title: 'Trader',     emoji: '📈', minXp: 400,  maxXp: 800,  color: '#8b5cf6' },
  { level: 4, title: 'Analyst',    emoji: '🧮', minXp: 800,  maxXp: 1400, color: '#e040fb' },
  { level: 5, title: 'Strategist', emoji: '🎯', minXp: 1400, maxXp: 2200, color: '#f59e0b' },
  { level: 6, title: 'Pro',        emoji: '⚡', minXp: 2200, maxXp: 9999, color: '#00e676' },
]

export function getLevelInfo(xp: number): Level & { progressPct: number; xpIntoLevel: number; xpNeeded: number } {
  const lvl = LEVELS.slice().reverse().find((l) => xp >= l.minXp) ?? LEVELS[0]
  const xpIntoLevel = xp - lvl.minXp
  const xpNeeded = lvl.maxXp - lvl.minXp
  const progressPct = Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100))
  return { ...lvl, progressPct, xpIntoLevel, xpNeeded }
}

// ── XP Rewards ───────────────────────────────────────────────────
export const XP_REWARDS = {
  completeLesson:     50,
  perfectQuiz:        25,  // bonus on top of lesson XP for 100% quiz
  goodQuiz:           10,  // bonus for ≥66%
  makeTrade:          20,
  dailyLogin:         15,
  completeMission:   100,
  dailyChallenge:     75,
  maintainStreak:     10,  // per day on top of login
} as const

// ── Missions ─────────────────────────────────────────────────────
export interface Mission {
  id: string
  title: string
  description: string
  emoji: string
  category: 'learning' | 'trading' | 'portfolio'
  target: number            // progress needed to complete
  xpReward: number
  unlockLevel: number       // level required to see this mission
  hint: string
}

export const MISSIONS: Mission[] = [
  {
    id: 'first-lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    emoji: '🎓',
    category: 'learning',
    target: 1,
    xpReward: 75,
    unlockLevel: 1,
    hint: 'Head to the Learn tab and pick any lesson',
  },
  {
    id: 'first-trade',
    title: 'First Trade',
    description: 'Execute your first paper trade',
    emoji: '💸',
    category: 'trading',
    target: 1,
    xpReward: 75,
    unlockLevel: 1,
    hint: 'Go to Markets and click Trade on any stock',
  },
  {
    id: 'five-lessons',
    title: 'Hit the Books',
    description: 'Complete 5 lessons',
    emoji: '📚',
    category: 'learning',
    target: 5,
    xpReward: 150,
    unlockLevel: 1,
    hint: 'Work through the Learn section steadily',
  },
  {
    id: 'diversify',
    title: 'Don\'t Put All Your Eggs...',
    description: 'Hold stocks in 3 different sectors simultaneously',
    emoji: '🧺',
    category: 'portfolio',
    target: 3,
    xpReward: 200,
    unlockLevel: 2,
    hint: 'Buy stocks from Tech, Finance, Healthcare etc',
  },
  {
    id: 'three-streak',
    title: 'On a Roll',
    description: 'Maintain a 3-day learning streak',
    emoji: '🔥',
    category: 'learning',
    target: 3,
    xpReward: 150,
    unlockLevel: 1,
    hint: 'Visit TradeSim and learn something every day',
  },
  {
    id: 'ten-trades',
    title: 'Active Trader',
    description: 'Execute 10 paper trades total',
    emoji: '⚡',
    category: 'trading',
    target: 10,
    xpReward: 200,
    unlockLevel: 2,
    hint: 'Practice buying and selling different stocks',
  },
  {
    id: 'all-lessons',
    title: 'Graduate',
    description: 'Complete all 7 lessons',
    emoji: '🎯',
    category: 'learning',
    target: 7,
    xpReward: 300,
    unlockLevel: 1,
    hint: 'Finish every lesson in the Learn tab',
  },
  {
    id: 'profit-10',
    title: 'Green Portfolio',
    description: 'Achieve a positive return on your portfolio',
    emoji: '💰',
    category: 'portfolio',
    target: 1,
    xpReward: 150,
    unlockLevel: 2,
    hint: 'Make smart trades and grow your $100k',
  },
]

// ── Daily Challenges ──────────────────────────────────────────────
export interface DailyChallenge {
  id: string
  title: string
  description: string
  emoji: string
  xpReward: number
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  { id: 'daily-lesson',  title: 'Daily Lesson',  description: 'Complete 1 lesson today',         emoji: '📖', xpReward: 75 },
  { id: 'daily-trade',   title: 'Daily Trade',   description: 'Execute 1 paper trade today',      emoji: '💹', xpReward: 50 },
  { id: 'daily-quiz',    title: 'Ace a Quiz',    description: 'Pass a lesson quiz today',          emoji: '✅', xpReward: 60 },
  { id: 'daily-login',   title: 'Show Up',       description: 'Log in and keep your streak alive', emoji: '🔥', xpReward: 15 },
]

// Pick 3 deterministic challenges per day (so all users get same ones)
export function getTodaysChallenges(): DailyChallenge[] {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const shuffled = [...DAILY_CHALLENGES].sort((a, b) => {
    const ha = (seed * a.id.length * 31) % 100
    const hb = (seed * b.id.length * 31) % 100
    return ha - hb
  })
  return shuffled.slice(0, 3)
}
