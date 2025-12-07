// Money Adventure - Game Types

export interface GameState {
  odUserId: string
  stage: 'intro' | 'playing' | 'ended'
  turnNumber: number
  maxTurns: number
  cashBalance: number
  savingsBalance: number
  debtBalance: number
  wellbeingScore: number // 0-100
  history: TurnHistory[]
  startedAt: Date
  endedAt?: Date
}

export interface TurnHistory {
  turnNumber: number
  storyCardId: string
  choiceId: string
  choiceLabel: string
  effects: ChoiceEffects
  bonusQuestion?: BonusQuestionResult
  timestamp: Date
}

export interface BonusQuestionResult {
  questionId: string
  questionText: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  conceptTags: string[]
  followUpCorrect?: boolean
}

export interface StoryCard {
  id: string
  title: string
  description: string
  conceptTags: string[]
  choices: Choice[]
  bonusQuestion: BonusQuestion
  category: 'income' | 'expense' | 'emergency' | 'opportunity' | 'lifestyle'
}

export interface Choice {
  id: string
  label: string
  effects: ChoiceEffects
  wisdomTag: 'wise' | 'neutral' | 'risky'
  outcomeText: string
}

export interface ChoiceEffects {
  cash?: number
  savings?: number
  debt?: number
  wellbeing?: number
}

export interface BonusQuestion {
  id: string
  questionText: string
  answerType: 'mcq' | 'numeric'
  options?: string[]
  correctAnswer: string
  conceptTags: string[]
  bonusReward: number
}

// Wellbeing helpers
export function getWellbeingEmoji(score: number): string {
  if (score >= 80) return '😄'
  if (score >= 60) return '🙂'
  if (score >= 40) return '😐'
  if (score >= 20) return '😟'
  return '😰'
}

export function getWellbeingLabel(score: number): string {
  if (score >= 80) return 'Great!'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Okay'
  if (score >= 20) return 'Stressed'
  return 'Struggling'
}

export function getWellbeingColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-lime-600'
  if (score >= 40) return 'text-yellow-600'
  if (score >= 20) return 'text-orange-600'
  return 'text-red-600'
}

// Default starting state
export function createNewGameState(userId: string): GameState {
  return {
    odUserId: userId,
    stage: 'intro',
    turnNumber: 0,
    maxTurns: 12,
    cashBalance: 50,
    savingsBalance: 25,
    debtBalance: 0,
    wellbeingScore: 75,
    history: [],
    startedAt: new Date(),
  }
}

// LocalStorage helpers
const STORAGE_KEY = 'money_adventure_'

export function saveGameState(userId: string, state: GameState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY + userId, JSON.stringify(state))
}

export function loadGameState(userId: string): GameState | null {
  if (typeof window === 'undefined') return null
  const saved = localStorage.getItem(STORAGE_KEY + userId)
  if (!saved) return null
  try {
    const state = JSON.parse(saved)
    state.startedAt = new Date(state.startedAt)
    if (state.endedAt) state.endedAt = new Date(state.endedAt)
    state.history = state.history.map((h: TurnHistory) => ({
      ...h,
      timestamp: new Date(h.timestamp)
    }))
    return state
  } catch {
    return null
  }
}

export function clearGameState(userId: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY + userId)
}

