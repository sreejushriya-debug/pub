'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Trophy, Coins, PiggyBank, TrendingDown, Heart,
  RotateCcw, ArrowRight, Sparkles, Target, Loader2, BookOpen
} from 'lucide-react'
import { GameState, getWellbeingEmoji } from '@/lib/moneyAdventure/types'

interface MoneyAdventureSummaryProps {
  gameState: GameState
  userName: string
  onPlayAgain: () => void
  onExit: () => void
}

interface SummaryData {
  summary: string
  strengths: string[]
  areasToImprove: string[]
  nextSteps: string[]
  stats: {
    wiseChoices: number
    riskyChoices: number
    bonusQuestionsCorrect: number
    bonusQuestionsTotal: number
    missedConcepts: string[]
  }
}

export default function MoneyAdventureSummary({
  gameState,
  userName,
  onPlayAgain,
  onExit
}: MoneyAdventureSummaryProps) {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSummary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadSummary = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/adventure/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameState, userName })
      })
      
      if (response.ok) {
        const data = await response.json()
        setSummaryData(data)
      }
    } catch (error) {
      console.error('Failed to load summary:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate badge
  const getBadge = () => {
    const savings = gameState.savings
    const debt = gameState.debt
    const wellbeing = gameState.wellbeing
    
    if (savings >= 100 && debt === 0 && wellbeing >= 70) {
      return { name: '🏆 Money Master', color: 'from-yellow-400 to-amber-500' }
    } else if (savings >= 50 && debt <= 10) {
      return { name: '⭐ Smart Saver', color: 'from-blue-400 to-blue-600' }
    } else if (wellbeing >= 80) {
      return { name: '😊 Balanced Life', color: 'from-green-400 to-green-600' }
    } else if (debt === 0) {
      return { name: '✓ Debt Free', color: 'from-purple-400 to-purple-600' }
    } else {
      return { name: '🎮 Adventure Complete', color: 'from-gray-400 to-gray-600' }
    }
  }

  const badge = getBadge()

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container-custom max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Adventure Complete! 🎉
          </h1>
          <p className="text-gray-600">Great job, {userName}!</p>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`bg-gradient-to-r ${badge.color} rounded-2xl p-4 text-white text-center mb-6`}
        >
          <p className="text-2xl font-bold">{badge.name}</p>
        </motion.div>

        {/* Final Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
        >
          <h2 className="font-bold text-gray-900 mb-4">Final Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <Coins className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">${gameState.cash}</p>
              <p className="text-sm text-gray-500">Cash</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <PiggyBank className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">${gameState.savings}</p>
              <p className="text-sm text-gray-500">Savings</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <TrendingDown className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">${gameState.debt}</p>
              <p className="text-sm text-gray-500">Debt</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <Heart className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{getWellbeingEmoji(gameState.wellbeing)}</p>
              <p className="text-sm text-gray-500">Wellbeing</p>
            </div>
          </div>
        </motion.div>

        {/* AI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="font-bold text-gray-900">Bright&apos;s Summary</h2>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-500">Analyzing your adventure...</span>
            </div>
          ) : summaryData ? (
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {summaryData.summary}
              </p>
              
              {summaryData.strengths.length > 0 && (
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-semibold text-green-800 mb-2">🌟 Your Strengths:</h3>
                  <ul className="space-y-1">
                    {summaryData.strengths.map((s, i) => (
                      <li key={i} className="text-green-700 text-sm">• {s}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {summaryData.areasToImprove.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-4">
                  <h3 className="font-semibold text-amber-800 mb-2">📚 Keep Practicing:</h3>
                  <ul className="space-y-1">
                    {summaryData.areasToImprove.map((a, i) => (
                      <li key={i} className="text-amber-700 text-sm">• {a}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {summaryData.nextSteps.length > 0 && (
                <div className="bg-purple-50 rounded-xl p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">🎯 Next Steps:</h3>
                  <ul className="space-y-1">
                    {summaryData.nextSteps.map((n, i) => (
                      <li key={i} className="text-purple-700 text-sm">• {n}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bonus Question Stats */}
              {summaryData.stats && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">📊 Bonus Challenges:</h3>
                  <p className="text-gray-700">
                    You got <strong>{summaryData.stats.bonusQuestionsCorrect}</strong> out of{' '}
                    <strong>{summaryData.stats.bonusQuestionsTotal}</strong> bonus questions correct!
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">
              Great job completing Money Adventure! You finished with ${gameState.savings} in savings.
            </p>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          {/* Practice weak concepts */}
          {summaryData?.stats?.missedConcepts && summaryData.stats.missedConcepts.length > 0 && (
            <Link
              href="/course/learn/practice"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-forest-600 to-forest-700 text-white rounded-xl font-semibold hover:from-forest-700 hover:to-forest-800 transition-all"
            >
              <Target className="w-5 h-5" />
              Practice with Bright
            </Link>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </motion.button>
          
          <div className="flex gap-3">
            <Link
              href="/course/learn"
              className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Back to Course
            </Link>
            <Link
              href="/course/learn/practice"
              className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              View Progress
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

