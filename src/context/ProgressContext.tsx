import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getLevelInfo, XP_REWARDS, MISSIONS, getTodaysChallenges } from '../lib/gamification'
import { useAuth } from './AuthContext'

interface ProgressState {
  xp: number
  level: number
  streakCount: number
  lastActiveDate: string | null
  totalLessonsCompleted: number
  totalTrades: number
  completedLessonIds: Set<string>
  completedMissionIds: Set<string>
  todaysChallengeIds: Set<string>   // completed today
  loading: boolean
}

interface ProgressContextValue extends ProgressState {
  levelInfo: ReturnType<typeof getLevelInfo>
  awardXP: (amount: number, reason?: string) => Promise<void>
  completeLesson: (lessonId: string, quizScore: number, totalQuestions: number) => Promise<number>
  recordTrade: () => Promise<void>
  completeDailyChallenge: (challengeId: string) => Promise<void>
  refreshProgress: () => Promise<void>
  todaysChallenges: ReturnType<typeof getTodaysChallenges>
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

const STARTING_XP = 0

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [state, setState] = useState<ProgressState>({
    xp: STARTING_XP,
    level: 1,
    streakCount: 0,
    lastActiveDate: null,
    totalLessonsCompleted: 0,
    totalTrades: 0,
    completedLessonIds: new Set(),
    completedMissionIds: new Set(),
    todaysChallengeIds: new Set(),
    loading: true,
  })

  const todaysChallenges = getTodaysChallenges()

  const refreshProgress = useCallback(async () => {
    if (!user) { setState(s => ({ ...s, loading: false })); return }

    // Load or create user_progress
    let { data: prog } = await supabase
      .from('user_progress').select('*').eq('user_id', user.id).single()

    if (!prog) {
      await supabase.from('user_progress').insert({
        user_id: user.id, xp: 0, level: 1, streak_count: 0,
      })
      const { data } = await supabase.from('user_progress').select('*').eq('user_id', user.id).single()
      prog = data
    }

    // Load completed lessons
    const { data: lessonData } = await supabase
      .from('lesson_completions').select('lesson_id').eq('user_id', user.id)

    // Load completed missions
    const { data: missionData } = await supabase
      .from('user_missions').select('mission_id').eq('user_id', user.id).eq('completed', true)

    // Load today's completed challenges
    const today = new Date().toISOString().split('T')[0]
    const { data: challengeData } = await supabase
      .from('daily_challenge_logs').select('challenge_id').eq('user_id', user.id).eq('completed_date', today)

    const completedLessonIds = new Set((lessonData ?? []).map((r: { lesson_id: string }) => r.lesson_id))
    const completedMissionIds = new Set((missionData ?? []).map((r: { mission_id: string }) => r.mission_id))
    const todaysChallengeIds = new Set((challengeData ?? []).map((r: { challenge_id: string }) => r.challenge_id))

    if (prog) {
      setState({
        xp: prog.xp ?? 0,
        level: prog.level ?? 1,
        streakCount: prog.streak_count ?? 0,
        lastActiveDate: prog.last_active_date,
        totalLessonsCompleted: prog.total_lessons_completed ?? 0,
        totalTrades: prog.total_trades ?? 0,
        completedLessonIds,
        completedMissionIds,
        todaysChallengeIds,
        loading: false,
      })

      // Update streak & daily login XP
      await checkAndUpdateStreak(user.id, prog.last_active_date, prog.streak_count ?? 0, prog.xp ?? 0)
    } else {
      setState(s => ({ ...s, loading: false }))
    }
  }, [user])

  async function checkAndUpdateStreak(userId: string, lastActive: string | null, streak: number, currentXp: number) {
    const today = new Date().toISOString().split('T')[0]
    if (lastActive === today) return // already updated today

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yStr = yesterday.toISOString().split('T')[0]

    const newStreak = lastActive === yStr ? streak + 1 : 1
    const bonusXP = XP_REWARDS.dailyLogin + (newStreak > 1 ? XP_REWARDS.maintainStreak : 0)
    const newXp = currentXp + bonusXP
    const newLevel = getLevelInfo(newXp).level

    await supabase.from('user_progress').update({
      streak_count: newStreak,
      last_active_date: today,
      xp: newXp,
      level: newLevel,
      updated_at: new Date().toISOString(),
    }).eq('user_id', userId)

    setState(s => ({
      ...s,
      streakCount: newStreak,
      lastActiveDate: today,
      xp: newXp,
      level: newLevel,
    }))
  }

  useEffect(() => {
    refreshProgress()
  }, [refreshProgress])

  async function awardXP(amount: number) {
    if (!user) return
    const newXp = state.xp + amount
    const newLevel = getLevelInfo(newXp).level
    await supabase.from('user_progress').update({
      xp: newXp, level: newLevel, updated_at: new Date().toISOString(),
    }).eq('user_id', user.id)
    setState(s => ({ ...s, xp: newXp, level: newLevel }))
  }

  async function completeLesson(lessonId: string, quizScore: number, totalQuestions: number): Promise<number> {
    if (!user) return 0
    if (state.completedLessonIds.has(lessonId)) return 0 // already done

    const pct = totalQuestions > 0 ? (quizScore / totalQuestions) * 100 : 0
    let xpEarned = XP_REWARDS.completeLesson
    if (pct === 100) xpEarned += XP_REWARDS.perfectQuiz
    else if (pct >= 66) xpEarned += XP_REWARDS.goodQuiz

    // Record lesson completion
    await supabase.from('lesson_completions').upsert({
      user_id: user.id, lesson_id: lessonId, quiz_score: quizScore, xp_earned: xpEarned,
    }, { onConflict: 'user_id,lesson_id' })

    const newTotal = state.totalLessonsCompleted + 1
    const newXp = state.xp + xpEarned
    const newLevel = getLevelInfo(newXp).level

    await supabase.from('user_progress').update({
      xp: newXp, level: newLevel,
      total_lessons_completed: newTotal,
      updated_at: new Date().toISOString(),
    }).eq('user_id', user.id)

    setState(s => ({
      ...s,
      xp: newXp,
      level: newLevel,
      totalLessonsCompleted: newTotal,
      completedLessonIds: new Set([...s.completedLessonIds, lessonId]),
    }))

    // Check mission progress
    await checkMissions(user.id, newTotal, state.totalTrades)

    // Award daily challenge if applicable
    await completeDailyChallenge('daily-lesson')
    await completeDailyChallenge('daily-quiz')

    return xpEarned
  }

  async function recordTrade() {
    if (!user) return
    const newTotal = state.totalTrades + 1
    const newXp = state.xp + XP_REWARDS.makeTrade
    const newLevel = getLevelInfo(newXp).level

    await supabase.from('user_progress').update({
      xp: newXp, level: newLevel,
      total_trades: newTotal,
      updated_at: new Date().toISOString(),
    }).eq('user_id', user.id)

    setState(s => ({ ...s, xp: newXp, level: newLevel, totalTrades: newTotal }))
    await checkMissions(user.id, state.totalLessonsCompleted, newTotal)
    await completeDailyChallenge('daily-trade')
  }

  async function checkMissions(userId: string, lessons: number, trades: number) {
    for (const mission of MISSIONS) {
      let progress = 0
      if (mission.id === 'first-lesson')  progress = Math.min(1, lessons)
      if (mission.id === 'first-trade')   progress = Math.min(1, trades)
      if (mission.id === 'five-lessons')  progress = Math.min(5, lessons)
      if (mission.id === 'ten-trades')    progress = Math.min(10, trades)
      if (mission.id === 'all-lessons')   progress = Math.min(7, lessons)
      if (mission.id === 'three-streak')  progress = Math.min(3, state.streakCount)
      if (progress === 0) continue

      const completed = progress >= mission.target
      const wasCompleted = state.completedMissionIds.has(mission.id)

      await supabase.from('user_missions').upsert({
        user_id: userId,
        mission_id: mission.id,
        progress,
        completed,
        completed_at: completed && !wasCompleted ? new Date().toISOString() : null,
      }, { onConflict: 'user_id,mission_id' })

      if (completed && !wasCompleted) {
        const newXp = state.xp + mission.xpReward
        await supabase.from('user_progress').update({ xp: newXp, level: getLevelInfo(newXp).level }).eq('user_id', userId)
        setState(s => ({
          ...s,
          xp: newXp,
          level: getLevelInfo(newXp).level,
          completedMissionIds: new Set([...s.completedMissionIds, mission.id]),
        }))
      }
    }
  }

  async function completeDailyChallenge(challengeId: string) {
    if (!user) return
    if (state.todaysChallengeIds.has(challengeId)) return
    const isToday = todaysChallenges.some((c) => c.id === challengeId)
    if (!isToday) return

    const challenge = todaysChallenges.find((c) => c.id === challengeId)
    if (!challenge) return

    const today = new Date().toISOString().split('T')[0]
    const { error } = await supabase.from('daily_challenge_logs').upsert({
      user_id: user.id,
      challenge_id: challengeId,
      completed_date: today,
      xp_earned: challenge.xpReward,
    }, { onConflict: 'user_id,challenge_id,completed_date' })

    if (!error) {
      const newXp = state.xp + challenge.xpReward
      await supabase.from('user_progress').update({ xp: newXp, level: getLevelInfo(newXp).level }).eq('user_id', user.id)
      setState(s => ({
        ...s,
        xp: newXp,
        level: getLevelInfo(newXp).level,
        todaysChallengeIds: new Set([...s.todaysChallengeIds, challengeId]),
      }))
    }
  }

  const levelInfo = getLevelInfo(state.xp)

  return (
    <ProgressContext.Provider value={{
      ...state,
      levelInfo,
      awardXP,
      completeLesson,
      recordTrade,
      completeDailyChallenge,
      refreshProgress,
      todaysChallenges,
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
