'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Play, RotateCcw, Coins, PiggyBank, 
  TrendingUp, Heart, Sparkles, Trophy
} from 'lucide-react'
import { 
  GameState, loadGameState, clearGameState, createNewGameState, saveGameState,
  getWellbeingEmoji
} from '@/lib/moneyAdventure/types'
import MoneyAdventureGame from '@/components/MoneyAdventureGame'

export default function MoneyAdventurePage() {
  const { user, isLoaded } = useUser()
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (user?.id) {
      const saved = loadGameState(user.id)
      setGameState(saved)
      setLoaded(true)
    }
  }, [user?.id])

  const startNewGame = () => {
    if (!user?.id) return
    const newState = createNewGameState(user.id)
    newState.stage = 'playing'
    newState.turnNumber = 1
    saveGameState(user.id, newState)
    setGameState(newState)
    setIsPlaying(true)
  }

  const continueGame = () => {
    setIsPlaying(true)
  }

  const resetGame = () => {
    if (!user?.id) return
    clearGameState(user.id)
    setGameState(null)
  }

  const handleGameUpdate = (newState: GameState) => {
    if (!user?.id) return
    saveGameState(user.id, newState)
    setGameState(newState)
  }

  const handleGameEnd = () => {
    setIsPlaying(false)
  }

  if (!isLoaded || !loaded) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="animate-pulse text-orange-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container-custom max-w-4xl text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in to play Money Adventure</h1>
          <Link href="/sign-in" className="btn-primary">Sign In</Link>
        </div>
      </div>
    )
  }

  // Show the game if playing
  if (isPlaying && gameState) {
    return (
      <MoneyAdventureGame
        gameState={gameState}
        userName={user.firstName || 'Student'}
        onUpdate={handleGameUpdate}
        onExit={handleGameEnd}
      />
    )
  }

  // Home screen
  const hasExistingGame = gameState && gameState.stage === 'playing' && gameState.turnNumber > 0

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/course/learn" 
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Course
          </Link>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-accent-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Coins className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Money Adventure</h1>
                <p className="text-white/80">A Life Simulation Game</p>
              </div>
            </div>
            
            <p className="text-lg text-white/90 mb-6 max-w-2xl">
              Make money choices, survive surprises, and see how your decisions affect your 
              cash, savings, and happiness! Play through life scenarios and learn smart money habits.
            </p>

            <div className="flex flex-wrap gap-4">
              {hasExistingGame ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={continueGame}
                    className="flex items-center gap-2 bg-white text-orange-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Continue Adventure
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      resetGame()
                      startNewGame()
                    }}
                    className="flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/30 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Start New Adventure
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startNewGame}
                  className="flex items-center gap-2 bg-white text-orange-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
                >
                  <Sparkles className="w-6 h-6" />
                  Start Money Adventure
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Current Game Status (if exists) */}
        {hasExistingGame && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
          >
            <h3 className="font-bold text-gray-900 mb-4">Your Current Adventure</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Turn</p>
                <p className="text-xl font-bold text-orange-600">
                  {gameState.turnNumber} / {gameState.maxTurns}
                </p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <p className="text-sm text-gray-500">Cash</p>
                <p className="text-xl font-bold text-green-600">${gameState.cashBalance}</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-500">Savings</p>
                <p className="text-xl font-bold text-blue-600">${gameState.savingsBalance}</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-xl">
                <p className="text-sm text-gray-500">Debt</p>
                <p className="text-xl font-bold text-red-600">${gameState.debtBalance}</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-xl">
                <p className="text-sm text-gray-500">Wellbeing</p>
                <p className="text-xl font-bold">
                  {getWellbeingEmoji(gameState.wellbeingScore)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">How Money Adventure Works</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
<div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
              <Coins className="w-8 h-8 text-orange-600" />
            </div>
              <h4 className="font-bold text-gray-900 mb-2">Face Life Events</h4>
              <p className="text-gray-600 text-sm">
                Each turn, you&apos;ll see a money scenario - from birthday gifts to emergencies to sales!
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-pink-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Make Choices</h4>
              <p className="text-gray-600 text-sm">
                Save, spend, or borrow? Your choices affect your cash, savings, debt, and happiness!
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Earn Bonuses</h4>
              <p className="text-gray-600 text-sm">
                Answer money questions correctly to earn extra cash! Bright helps if you get stuck.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats You Track */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-4 gap-4"
        >
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="w-6 h-6 text-green-600" />
              <h4 className="font-bold text-green-800">Cash</h4>
            </div>
            <p className="text-green-700 text-sm">Money available to spend right now</p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <PiggyBank className="w-6 h-6 text-blue-600" />
              <h4 className="font-bold text-blue-800">Savings</h4>
            </div>
            <p className="text-blue-700 text-sm">Money set aside for the future</p>
          </div>
          
          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6 text-red-600 rotate-180" />
              <h4 className="font-bold text-red-800">Debt</h4>
            </div>
            <p className="text-red-700 text-sm">Money you owe and must pay back</p>
          </div>
          
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-6 h-6 text-yellow-600" />
              <h4 className="font-bold text-yellow-800">Wellbeing</h4>
            </div>
            <p className="text-yellow-700 text-sm">How happy and stress-free you are</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

