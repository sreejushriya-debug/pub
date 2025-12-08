// Money Adventure - RPG Game Types

export type ThemeType = 'Sports' | 'Art' | 'Music' | 'Games' | 'Animals'

export interface BigGoal {
  id: string
  name: string
  cost: number
  icon: string
}

export const BIG_GOALS: BigGoal[] = [
  { id: 'bike', name: 'New Bike', cost: 200, icon: '🚲' },
  { id: 'tablet', name: 'Tablet or Laptop', cost: 250, icon: '💻' },
  { id: 'camp', name: 'Summer Camp / Trip', cost: 300, icon: '🏕️' },
  { id: 'business', name: 'Mini Business Starter Kit', cost: 150, icon: '💼' },
]

export interface Avatar {
  id: string
  name: string
  emoji: string
}

export const AVATARS: Avatar[] = [
  { id: 'avatar1', name: 'Star', emoji: '⭐' },
  { id: 'avatar2', name: 'Rocket', emoji: '🚀' },
  { id: 'avatar3', name: 'Rainbow', emoji: '🌈' },
  { id: 'avatar4', name: 'Lightning', emoji: '⚡' },
  { id: 'avatar5', name: 'Fire', emoji: '🔥' },
  { id: 'avatar6', name: 'Heart', emoji: '💖' },
]

export interface GameState {
visibleUserId: string
  playerName: string
  avatarId: string
  theme: ThemeType
  bigGoal: BigGoal
  
  // Progress
  chapter: number // 1-4
  scene: number // within chapter
  stage: 'character_creation' | 'playing' | 'ended'
  
  // Money
  cash: number
  savings: number
  debt: number
  
  // Wellbeing (0-100)
  wellbeing: number
  
  // Hidden traits (affect story and ending)
  saverScore: number
  riskScore: number
  plannerScore: number
  
  // Business flag
  hasBusiness: boolean
  businessChoice?: 'keep_small' | 'go_all_in' | 'shutdown'
  
  // History
  history: TurnHistory[]
  totalEarned: number
  totalSpentNeeds: number
  totalSpentWants: number
  totalSaved: number
  totalBorrowed: number
  
  // Timestamps
  startedAt: Date
  endedAt?: Date
  
  // Ending
  endingType?: EndingType
  boughtGoal?: boolean
}

export type EndingType = 
  | 'super_saver'
  | 'balanced_planner'
  | 'almost_there'
  | 'borrow_now_pay_later'
  | 'risky_spender'

export interface TurnHistory {
  chapter: number
  scene: number
  sceneId: string
  choiceId: string
  choiceLabel: string
  effects: ChoiceEffects
  challenge?: ChallengeResult
  timestamp: Date
}

export interface ChallengeResult {
  questionId: string
  questionText: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  conceptTags: string[]
  aiExplanation?: string
}

export interface ChoiceEffects {
  cash?: number
  savings?: number
  debt?: number
  wellbeing?: number
  saverScore?: number
  riskScore?: number
  plannerScore?: number
  totalEarned?: number
  totalSpentNeeds?: number
  totalSpentWants?: number
}

export interface Scene {
  id: string
  chapter: number
  sceneNumber: number
  title: string
  conceptTags: string[]
  getStory: (state: GameState) => string
  choices: SceneChoice[]
  challenge?: SceneChallenge
  openEndedPrompt?: {
    prompt: string
    rubric: string
  }
  nextScene?: (state: GameState, choiceId: string) => { chapter: number; scene: number } | 'end'
}

export interface SceneChoice {
  id: string
  label: string
  getLabel?: (state: GameState) => string
  effects: ChoiceEffects
  requiresCash?: number
  requiresSavings?: number
  disabledReason?: (state: GameState) => string | null
  outcomeText: string | ((state: GameState) => string)
}

export interface SceneChallenge {
  id: string
  type: 'numeric' | 'mcq' | 'open_ended'
  questionText: string | ((state: GameState) => string)
  options?: string[]
  correctAnswer: string | ((state: GameState) => string)
  conceptTags: string[]
  bonusReward?: number
  rubric?: string // For open-ended
}

// Wellbeing helpers
export function getWellbeingEmoji(score: number): string {
  if (score >= 70) return '😄'
  if (score >= 40) return '😐'
  return '😰'
}

export function getWellbeingLabel(score: number): string {
  if (score >= 70) return 'Happy'
  if (score >= 40) return 'Neutral'
  return 'Stressed'
}

export function getWellbeingColor(score: number): string {
  if (score >= 70) return 'text-green-600'
  if (score >= 40) return 'text-yellow-600'
  return 'text-red-600'
}

// Trait level helpers
export function getTraitLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 8) return 'high'
  if (score >= 4) return 'medium'
  return 'low'
}

// Theme-specific item names
export function getThemeItem(theme: ThemeType, itemType: 'snack_item' | 'want_item' | 'business'): string {
  const items: Record<ThemeType, Record<string, string>> = {
    Sports: { snack_item: 'Limited-edition team bracelet', want_item: 'Basketball shoes', business: 'Sports equipment cleaning' },
    Art: { snack_item: 'Sparkly gel pens', want_item: 'Professional art kit', business: 'Art commissions' },
    Music: { snack_item: 'Band sticker pack', want_item: 'Concert tickets', business: 'Music lessons' },
    Games: { snack_item: 'Game character keychain', want_item: 'New video game', business: 'Selling in-game items' },
    Animals: { snack_item: 'Cute animal plush keychain', want_item: 'Pet accessories', business: 'Pet-sitting service' },
  }
  return items[theme][itemType]
}

// Default starting state
export function createNewGameState(visibleUserId: string, playerName: string): GameState {
  return {
visibleUserId,
    playerName,
    avatarId: '',
    theme: 'Games',
    bigGoal: BIG_GOALS[0],
    chapter: 1,
    scene: 1,
    stage: 'character_creation',
    cash: 20,
    savings: 0,
    debt: 0,
    wellbeing: 70,
    saverScore: 0,
    riskScore: 0,
    plannerScore: 0,
    hasBusiness: false,
    history: [],
    totalEarned: 0,
    totalSpentNeeds: 0,
    totalSpentWants: 0,
    totalSaved: 0,
    totalBorrowed: 0,
    startedAt: new Date(),
  }
}

// LocalStorage helpers
const STORAGE_KEY = 'money_adventure_rpg_'

export function saveGameState(visibleUserId: string, state: GameState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY + visibleUserId, JSON.stringify(state))
}

export function loadGameState(visibleUserId: string): GameState | null {
  if (typeof window === 'undefined') return null
  const saved = localStorage.getItem(STORAGE_KEY + visibleUserId)
  if (!saved) return null
  try {
    const state = JSON.parse(saved)
    state.startedAt = new Date(state.startedAt)
    if (state.endedAt) state.endedAt = new Date(state.endedAt)
    return state
  } catch {
    return null
  }
}

export function clearGameState(visibleUserId: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY + visibleUserId)
}

// Calculate progress percentage
export function getProgressPercentage(chapter: number, scene: number): number {
  const totalScenes = 16 // 4 chapters × ~4 scenes each
  const completedScenes = ((chapter - 1) * 4) + (scene - 1)
  return Math.round((completedScenes / totalScenes) * 100)
}

// Determine ending type
export function determineEndingType(state: GameState): EndingType {
  const totalMoney = state.cash + state.savings
  const goalMet = totalMoney >= state.bigGoal.cost
  const hasDebt = state.debt > 0
  const hasLeftover = totalMoney >= state.bigGoal.cost + 20
  const goodSaver = state.saverScore >= 6
  const highRisk = state.riskScore >= 6
  
  if (state.boughtGoal && !hasDebt && hasLeftover && goodSaver) {
    return 'super_saver'
  }
  if (state.boughtGoal && state.debt <= 10 && state.saverScore >= 3) {
    return 'balanced_planner'
  }
  if (!state.boughtGoal && !hasDebt && state.savings >= state.bigGoal.cost * 0.5) {
    return 'almost_there'
  }
  if (state.boughtGoal && hasDebt) {
    return 'borrow_now_pay_later'
  }
  return 'risky_spender'
}

export const ENDING_INFO: Record<EndingType, { title: string; badge: string; description: string }> = {
  super_saver: {
    title: 'Super Saver',
    badge: '🏆',
    description: 'You reached your goal AND kept money for emergencies! You made smart choices, resisted temptations, and planned ahead. Your future self is so proud!'
  },
  balanced_planner: {
    title: 'Balanced Planner',
    badge: '⭐',
    description: 'You got your goal and stayed mostly on track. You knew when to have fun and when to save. That balance will help you throughout life!'
  },
  almost_there: {
    title: 'Almost There',
    badge: '🎯',
    description: 'You didn\'t quite reach your goal this time, but you learned a lot! You avoided debt and built good habits. With a little more time, you\'ll make it!'
  },
  borrow_now_pay_later: {
    title: 'Borrow Now, Pay Later',
    badge: '💳',
    description: 'You got your goal, but now you have debt to pay off. Borrowing can help in emergencies, but remember: interest means you pay back MORE than you borrowed.'
  },
  risky_spender: {
    title: 'Risky Spender',
    badge: '🎲',
    description: 'You had lots of fun along the way, but your goal is still out of reach. Next time, try saving more of your money before spending on wants!'
  }
}
