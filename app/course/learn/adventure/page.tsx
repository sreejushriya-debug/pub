'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { 
  Gamepad2, ArrowLeft, Sparkles, Play, RotateCcw, 
  Coins, PiggyBank, Trophy, Target
} from 'lucide-react'
import Link from 'next/link'
import { 
  GameState, 
  createNewGameState, 
  saveGameState, 
  loadGameState, 
  clearGameState 
} from '@/lib/moneyAdventure/types'
import MoneyAdventureGame from '@/components/MoneyAdventureGame'

export default function AdventurePage() {
  const { user, isLoaded } = useUser()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      const saved = loadGameState(user.id)
      setGameState(saved)
      setLoading(false)
    } else if (isLoaded) {
      setLoading(false)
    }
  }, [isLoaded, user])

  const handleStartNew = () => {
    if (!user) return
    const newState = createNewGameState(user.id, user.firstName || 'Player')
    setGameState(newState)
    saveGameState(user.id, newState)
    setIsPlaying(true)
  }

  const handleContinue = () => {
    setIsPlaying(true)
  }

  const handleGameUpdate = (newState: GameState) => {
    if (!user) return
    setGameState(newState)
    saveGameState(user.id, newState)
  }

  const handleExit = () => {
    setIsPlaying(false)
  }

  const handleRestart = () => {
    if (!user) return
    clearGameState(user.id)
    setGameState(null)
    setIsPlaying(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-pulse text-orange-600">Loading...</div>
      </div>
    )
  }

  // Show game if playing
  if (isPlaying && gameState) {
    return (
      <MoneyAdventureGame
        gameState={gameState}
        userName={user?.firstName || 'Player'}
        onUpdate={handleGameUpdate}
        onExit={handleExit}
      />
    )
  }

  // Home screen
  const hasActiveGame = gameState && gameState.stage !== 'ended'
  const hasCompletedGame = gameState && gameState.stage === 'ended'

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="container-custom max-w-4xl">
        {/* Back link */}
        <Link 
          href="/course/learn" 
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Course
        </Link>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-accent-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white mb-8 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Gamepad2 className="w-10 h-10" />
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Money Adventure</h1>
            <p className="text-lg text-white/90 max-w-xl mb-6">
              Play through a year of money choices! Save for a big goal, handle surprises, 
              start a business, and see how your decisions shape your story.
            </p>
            
            {!hasActiveGame && !hasCompletedGame && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartNew}
                className="flex items-center gap-2 bg-white text-orange-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                <Play className="w-6 h-6" /> Start Your Adventure
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Continue / Restart Panel */}
        {hasActiveGame && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Continue Your Adventure</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                In Progress
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <Target className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                <p className="text-sm font-medium text-gray-900">{gameState?.bigGoal?.name || 'Goal'}</p>
                <p className="text-xs text-gray-500">Your Goal</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <Coins className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-green-600">${gameState?.cash || 0}</p>
                <p className="text-xs text-gray-500">Cash</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <PiggyBank className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-blue-600">${gameState?.savings || 0}</p>
                <p className="text-xs text-gray-500">Savings</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <Trophy className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">Ch {gameState?.chapter || 1}</p>
                <p className="text-xs text-gray-500">Scene {gameState?.scene || 1}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700"
              >
                <Play className="w-5 h-5" /> Continue
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRestart}
                className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
              >
                <RotateCcw className="w-5 h-5" /> Restart
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Completed Game Panel */}
        {hasCompletedGame && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Adventure Complete!</h2>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                Finished
              </span>
            </div>
            
            <p className="text-gray-600 mb-6">
              You completed Money Adventure! Want to try again with different choices?
            </p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartNew}
              className="flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 w-full"
            >
              <Play className="w-5 h-5" /> Play Again
            </motion.button>
          </motion.div>
        )}

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">How It Works</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Choose Your Goal</h3>
                <p className="text-sm text-gray-600">Pick a big goal to save for: a bike, tablet, summer camp, or business kit!</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">💰</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Make Money Choices</h3>
                <p className="text-sm text-gray-600">Earn allowance, face temptations, and decide when to save or spend.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🎲</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Handle Surprises</h3>
                <p className="text-sm text-gray-600">Deal with emergencies, start a business, and manage your budget!</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🏆</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Reach Your Ending</h3>
                <p className="text-sm text-gray-600">See how your choices shaped your story and get personalized tips!</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
