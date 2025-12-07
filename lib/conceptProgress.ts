// Concept Progress Tracking System
// Tracks student performance on different financial literacy concepts

export interface ConceptScore {
  concept: string
  correct: number
  total: number
  lastPracticed: Date | null
  strength: 'strong' | 'okay' | 'struggling' | 'not_started'
}

export interface ConceptProgressData {
  userId: string
  concepts: Record<string, ConceptScore>
  lastUpdated: Date
  practiceHistory: PracticeSession[]
}

export interface PracticeSession {
  id: string
  date: Date
  conceptsWorked: string[]
  questionsAttempted: number
  questionsCorrect: number
  duration: number // in seconds
}

// All concepts in the course
export const ALL_CONCEPTS = [
  // Module 1
  { id: 'needs_vs_wants', name: 'Needs vs Wants', module: 1 },
  { id: 'basic_vocab', name: 'Financial Vocabulary', module: 1 },
  { id: 'coins', name: 'Coins & Counting Money', module: 1 },
  { id: 'income', name: 'Income', module: 1 },
  { id: 'debt', name: 'Debt', module: 1 },
  { id: 'interest', name: 'Interest', module: 1 },
  
  // Module 2
  { id: 'saving_vs_spending', name: 'Saving vs Spending', module: 2 },
  { id: 'budgeting', name: 'Budgeting', module: 2 },
  { id: 'pie_charts', name: 'Budget Pie Charts', module: 2 },
  { id: 'goals', name: 'Financial Goals', module: 2 },
  
  // Module 3
  { id: 'credit_vs_debit', name: 'Credit vs Debit', module: 3 },
  { id: 'credit_terms', name: 'Credit Terms', module: 3 },
  { id: 'stock_trend', name: 'Stock Trends', module: 3 },
  { id: 'check_basics', name: 'Check Writing', module: 3 },
  
  // Module 4
  { id: 'profit_loss', name: 'Profit & Loss', module: 4 },
  { id: 'revenue', name: 'Revenue', module: 4 },
  { id: 'expenses', name: 'Expenses', module: 4 },
  { id: 'scarcity', name: 'Scarcity & Supply', module: 4 },
  { id: 'expense_types', name: 'Types of Expenses', module: 4 },
  
  // Module 5
  { id: 'sales_tax', name: 'Sales Tax', module: 5 },
  { id: 'discounts', name: 'Discounts', module: 5 },
  { id: 'tax_plus_discount', name: 'Tax + Discount Combined', module: 5 },
  { id: 'comparison_shopping', name: 'Comparison Shopping', module: 5 },
]

export const CONCEPT_DISPLAY_NAMES: Record<string, string> = {
  needs_vs_wants: 'Needs vs Wants',
  basic_vocab: 'Financial Vocabulary',
  coins: 'Coins & Counting Money',
  income: 'Income',
  debt: 'Debt',
  interest: 'Interest',
  saving_vs_spending: 'Saving vs Spending',
  budgeting: 'Budgeting',
  pie_charts: 'Budget Pie Charts',
  goals: 'Financial Goals',
  credit_vs_debit: 'Credit vs Debit',
  credit_terms: 'Credit Terms',
  stock_trend: 'Stock Trends',
  check_basics: 'Check Writing',
  profit_loss: 'Profit & Loss',
  revenue: 'Revenue',
  expenses: 'Expenses',
  scarcity: 'Scarcity & Supply',
  expense_types: 'Types of Expenses',
  sales_tax: 'Sales Tax',
  discounts: 'Discounts',
  tax_plus_discount: 'Tax + Discount Combined',
  comparison_shopping: 'Comparison Shopping',
}

// Calculate strength based on correct/total ratio
export function calculateStrength(correct: number, total: number): 'strong' | 'okay' | 'struggling' | 'not_started' {
  if (total === 0) return 'not_started'
  const ratio = correct / total
  if (ratio >= 0.8) return 'strong'
  if (ratio >= 0.5) return 'okay'
  return 'struggling'
}

// Get progress from localStorage
export function getConceptProgress(userId: string): ConceptProgressData {
  if (typeof window === 'undefined') {
    return createEmptyProgress(userId)
  }
  
  const key = `concept_progress_${userId}`
  const saved = localStorage.getItem(key)
  
  if (saved) {
    try {
      const data = JSON.parse(saved)
      // Convert date strings back to Date objects
      data.lastUpdated = new Date(data.lastUpdated)
      data.practiceHistory = data.practiceHistory.map((s: PracticeSession) => ({
        ...s,
        date: new Date(s.date)
      }))
      Object.keys(data.concepts).forEach(key => {
        if (data.concepts[key].lastPracticed) {
          data.concepts[key].lastPracticed = new Date(data.concepts[key].lastPracticed)
        }
      })
      return data
    } catch (e) {
      console.error('Failed to parse concept progress:', e)
    }
  }
  
  return createEmptyProgress(userId)
}

// Create empty progress data
function createEmptyProgress(userId: string): ConceptProgressData {
  const concepts: Record<string, ConceptScore> = {}
  
  ALL_CONCEPTS.forEach(c => {
    concepts[c.id] = {
      concept: c.id,
      correct: 0,
      total: 0,
      lastPracticed: null,
      strength: 'not_started'
    }
  })
  
  return {
    userId,
    concepts,
    lastUpdated: new Date(),
    practiceHistory: []
  }
}

// Save progress to localStorage
export function saveConceptProgress(data: ConceptProgressData): void {
  if (typeof window === 'undefined') return
  
  const key = `concept_progress_${data.userId}`
  data.lastUpdated = new Date()
  localStorage.setItem(key, JSON.stringify(data))
}

// Update concept scores after a quiz or activity
export function updateConceptScores(
  userId: string,
  results: { concept: string; correct: boolean }[]
): ConceptProgressData {
  const progress = getConceptProgress(userId)
  
  results.forEach(result => {
    // Normalize concept name (handle variations)
    const conceptKey = normalizeConceptKey(result.concept)
    
    if (!progress.concepts[conceptKey]) {
      progress.concepts[conceptKey] = {
        concept: conceptKey,
        correct: 0,
        total: 0,
        lastPracticed: null,
        strength: 'not_started'
      }
    }
    
    progress.concepts[conceptKey].total += 1
    if (result.correct) {
      progress.concepts[conceptKey].correct += 1
    }
    progress.concepts[conceptKey].lastPracticed = new Date()
    progress.concepts[conceptKey].strength = calculateStrength(
      progress.concepts[conceptKey].correct,
      progress.concepts[conceptKey].total
    )
  })
  
  saveConceptProgress(progress)
  return progress
}

// Normalize concept keys (handle variations like 'basic_vocab' vs 'basicVocab')
function normalizeConceptKey(key: string): string {
  const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, '_')
  
  // Map common variations
  const mappings: Record<string, string> = {
    'needs_vs_wants': 'needs_vs_wants',
    'needsvswants': 'needs_vs_wants',
    'saving_vs_spending': 'saving_vs_spending',
    'savingvsspending': 'saving_vs_spending',
    'credit_vs_debit': 'credit_vs_debit',
    'creditvsdebit': 'credit_vs_debit',
    'profit_loss': 'profit_loss',
    'profitloss': 'profit_loss',
    'tax_plus_discount': 'tax_plus_discount',
    'taxplusdiscount': 'tax_plus_discount',
  }
  
  return mappings[normalized] || normalized
}

// Add a practice session to history
export function addPracticeSession(
  userId: string,
  session: Omit<PracticeSession, 'id'>
): ConceptProgressData {
  const progress = getConceptProgress(userId)
  
  progress.practiceHistory.push({
    ...session,
    id: `practice_${Date.now()}`
  })
  
  // Keep only last 50 sessions
  if (progress.practiceHistory.length > 50) {
    progress.practiceHistory = progress.practiceHistory.slice(-50)
  }
  
  saveConceptProgress(progress)
  return progress
}

// Get concepts that need work (struggling or okay)
export function getWeakConcepts(userId: string): ConceptScore[] {
  const progress = getConceptProgress(userId)
  
  return Object.values(progress.concepts)
    .filter(c => c.strength === 'struggling' || c.strength === 'okay')
    .sort((a, b) => {
      // Sort by strength (struggling first) then by ratio
      if (a.strength === 'struggling' && b.strength !== 'struggling') return -1
      if (b.strength === 'struggling' && a.strength !== 'struggling') return 1
      
      const ratioA = a.total > 0 ? a.correct / a.total : 0
      const ratioB = b.total > 0 ? b.correct / b.total : 0
      return ratioA - ratioB
    })
}

// Get concepts that are strong
export function getStrongConcepts(userId: string): ConceptScore[] {
  const progress = getConceptProgress(userId)
  
  return Object.values(progress.concepts)
    .filter(c => c.strength === 'strong')
}

// Get summary stats
export function getProgressSummary(userId: string): {
  totalConcepts: number
  strong: number
  okay: number
  struggling: number
  notStarted: number
  overallScore: number
} {
  const progress = getConceptProgress(userId)
  const concepts = Object.values(progress.concepts)
  
  const strong = concepts.filter(c => c.strength === 'strong').length
  const okay = concepts.filter(c => c.strength === 'okay').length
  const struggling = concepts.filter(c => c.strength === 'struggling').length
  const notStarted = concepts.filter(c => c.strength === 'not_started').length
  
  const totalCorrect = concepts.reduce((sum, c) => sum + c.correct, 0)
  const totalAttempts = concepts.reduce((sum, c) => sum + c.total, 0)
  const overallScore = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
  
  return {
    totalConcepts: concepts.length,
    strong,
    okay,
    struggling,
    notStarted,
    overallScore
  }
}

