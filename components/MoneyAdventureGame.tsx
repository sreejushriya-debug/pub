'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Coins, PiggyBank, TrendingDown, Heart, X, ArrowRight,
  CheckCircle2, XCircle, Sparkles, Loader2, HelpCircle
} from 'lucide-react'
import { 
  GameState, TurnHistory, ChoiceEffects, StoryCard, Choice,
  getWellbeingEmoji, getWellbeingColor
} from '@/lib/moneyAdventure/types'
import { getGameStoryCards } from '@/lib/moneyAdventure/storyCards'
import { updateConceptScores } from '@/lib/conceptProgress'
import MoneyAdventureSummary from './MoneyAdventureSummary'

interface MoneyAdventureGameProps {
  gameState: GameState
  userName: string
  onUpdate: (state: GameState) => void
  onExit: () => void
}

type GamePhase = 'story' | 'outcome' | 'bonus' | 'bonus-feedback' | 'followup' | 'turn-end'

export default function MoneyAdventureGame({ 
  gameState, 
  userName,
  onUpdate, 
  onExit 
}: MoneyAdventureGameProps) {
  const [storyCards, setStoryCards] = useState<StoryCard[]>([])
  const [currentCard, setCurrentCard] = useState<StoryCard | null>(null)
  const [phase, setPhase] = useState<GamePhase>('story')
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null)
  const [bonusAnswer, setBonusAnswer] = useState('')
  const [bonusResult, setBonusResult] = useState<{ correct: boolean; feedback?: string } | null>(null)
  const [followUpQuestion, setFollowUpQuestion] = useState<{ q: string; a: string } | null>(null)
  const [followUpAnswer, setFollowUpAnswer] = useState('')
  const [followUpResult, setFollowUpResult] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showEndScreen, setShowEndScreen] = useState(false)

  // Initialize story cards
  useEffect(() => {
    const cards = getGameStoryCards(gameState.maxTurns)
    setStoryCards(cards)
    if (cards.length > 0 && gameState.turnNumber > 0) {
      const cardIndex = (gameState.turnNumber - 1) % cards.length
      setCurrentCard(cards[cardIndex])
    }
  }, [gameState.maxTurns, gameState.turnNumber])

  // Check if game ended
  useEffect(() => {
    if (gameState.turnNumber > gameState.maxTurns) {
      setShowEndScreen(true)
    }
  }, [gameState.turnNumber, gameState.maxTurns])

  const applyEffects = (effects: ChoiceEffects): GameState => {
    return {
      ...gameState,
      cashBalance: Math.max(0, gameState.cashBalance + (effects.cash || 0)),
      savingsBalance: Math.max(0, gameState.savingsBalance + (effects.savings || 0)),
      debtBalance: Math.max(0, gameState.debtBalance + (effects.debt || 0)),
      wellbeingScore: Math.min(100, Math.max(0, gameState.wellbeingScore + (effects.wellbeing || 0)))
    }
  }

  const handleChoiceSelect = (choice: Choice) => {
    setSelectedChoice(choice)
    
    // Apply effects
    const newState = applyEffects(choice.effects)
    onUpdate(newState)
    
    setPhase('outcome')
  }

  const handleProceedToBonus = () => {
    setPhase('bonus')
    setBonusAnswer('')
  }

  const handleBonusSubmit = async () => {
    if (!currentCard || !bonusAnswer.trim()) return
    
    const bq = currentCard.bonusQuestion
    const isCorrect = bonusAnswer.trim().toLowerCase() === bq.correctAnswer.toLowerCase()
    
    setIsLoading(true)
    
    if (isCorrect) {
      // Award bonus
      const newState = {
        ...gameState,
        cashBalance: gameState.cashBalance + bq.bonusReward
      }
      onUpdate(newState)
      setBonusResult({ correct: true })
      setPhase('bonus-feedback')
      
      // Log to concept progress
      updateConceptScores(gameState.odUserId, bq.conceptTags.map(tag => ({
        concept: tag,
        correct: true
      })))
    } else {
      // Get AI explanation
      try {
        const response = await fetch('/api/adventure/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionText: bq.questionText,
            userAnswer: bonusAnswer,
            correctAnswer: bq.correctAnswer,
            conceptTags: bq.conceptTags,
            storyContext: currentCard.description
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          setBonusResult({ correct: false, feedback: data.explanation })
          if (data.followUpQuestion) {
            setFollowUpQuestion({
              q: data.followUpQuestion,
              a: data.followUpAnswer
            })
          }
        } else {
          setBonusResult({ 
            correct: false, 
            feedback: `The correct answer was "${bq.correctAnswer}". Keep practicing!` 
          })
        }
      } catch {
        setBonusResult({ 
          correct: false, 
          feedback: `The correct answer was "${bq.correctAnswer}". Keep practicing!` 
        })
      }
      
      // Log incorrect to concept progress
      updateConceptScores(gameState.odUserId, bq.conceptTags.map(tag => ({
        concept: tag,
        correct: false
      })))
      
      setPhase('bonus-feedback')
    }
    
    setIsLoading(false)
  }

  const handleFollowUpSubmit = () => {
    if (!followUpQuestion || !followUpAnswer.trim()) return
    
    const isCorrect = followUpAnswer.trim().toLowerCase() === followUpQuestion.a.toLowerCase()
    setFollowUpResult(isCorrect)
    
    if (isCorrect && currentCard) {
      // Award small consolation bonus
      const newState = {
        ...gameState,
        savingsBalance: gameState.savingsBalance + 2
      }
      onUpdate(newState)
      
      // Log follow-up success
      updateConceptScores(gameState.odUserId, currentCard.bonusQuestion.conceptTags.map(tag => ({
        concept: tag,
        correct: true
      })))
    }
    
    setPhase('turn-end')
  }

  const handleNextTurn = () => {
    if (!currentCard || !selectedChoice) return
    
    // Record turn history
    const turnHistory: TurnHistory = {
      turnNumber: gameState.turnNumber,
      storyCardId: currentCard.id,
      choiceId: selectedChoice.id,
      choiceLabel: selectedChoice.label,
      effects: selectedChoice.effects,
      bonusQuestion: currentCard.bonusQuestion ? {
        questionId: currentCard.bonusQuestion.id,
        questionText: currentCard.bonusQuestion.questionText,
        userAnswer: bonusAnswer,
        correctAnswer: currentCard.bonusQuestion.correctAnswer,
        isCorrect: bonusResult?.correct || false,
        conceptTags: currentCard.bonusQuestion.conceptTags,
        followUpCorrect: followUpResult || undefined
      } : undefined,
      timestamp: new Date()
    }
    
    const newState: GameState = {
      ...gameState,
      turnNumber: gameState.turnNumber + 1,
      history: [...gameState.history, turnHistory]
    }
    
    // Check if game is over
    if (newState.turnNumber > newState.maxTurns) {
      newState.stage = 'ended'
      newState.endedAt = new Date()
    }
    
    onUpdate(newState)
    
    // Reset for next turn
    setSelectedChoice(null)
    setBonusAnswer('')
    setBonusResult(null)
    setFollowUpQuestion(null)
    setFollowUpAnswer('')
    setFollowUpResult(null)
    setPhase('story')
    
    // Get next card
    if (newState.turnNumber <= newState.maxTurns) {
      const nextCardIndex = (newState.turnNumber - 1) % storyCards.length
      setCurrentCard(storyCards[nextCardIndex])
    }
  }

  const skipFollowUp = () => {
    setPhase('turn-end')
  }

  // Show end screen
  if (showEndScreen || gameState.stage === 'ended') {
    return (
      <MoneyAdventureSummary
        gameState={gameState}
        userName={userName}
        onPlayAgain={() => {
          setShowEndScreen(false)
          onExit()
        }}
        onExit={onExit}
      />
    )
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container-custom max-w-4xl">
        {/* Header with Exit */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            Turn {gameState.turnNumber} of {gameState.maxTurns}
          </div>
          <button onClick={onExit} className="text-gray-400 hover:text-gray-600 p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Panel */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Coins className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-500">Cash</span>
              </div>
              <p className="text-xl font-bold text-green-600">${gameState.cashBalance}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <PiggyBank className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-500">Savings</span>
              </div>
              <p className="text-xl font-bold text-blue-600">${gameState.savingsBalance}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <span className="text-xs text-gray-500">Debt</span>
              </div>
              <p className="text-xl font-bold text-red-600">${gameState.debtBalance}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Heart className="w-4 h-4 text-yellow-600" />
                <span className="text-xs text-gray-500">Wellbeing</span>
              </div>
              <p className={`text-xl font-bold ${getWellbeingColor(gameState.wellbeingScore)}`}>
                {getWellbeingEmoji(gameState.wellbeingScore)}
              </p>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <AnimatePresence mode="wait">
          {/* STORY PHASE */}
          {phase === 'story' && (
            <motion.div
              key="story"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
                <h2 className="text-2xl font-bold">{currentCard.title}</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  {currentCard.description}
                </p>
                
                <h3 className="font-semibold text-gray-900 mb-4">What do you do?</h3>
                <div className="space-y-3">
                  {currentCard.choices.map((choice) => (
                    <motion.button
                      key={choice.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleChoiceSelect(choice)}
                      className="w-full p-4 text-left bg-gray-50 hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-300 rounded-xl transition-all"
                    >
                      <span className="font-medium text-gray-900">{choice.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* OUTCOME PHASE */}
          {phase === 'outcome' && selectedChoice && (
            <motion.div
              key="outcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Choice:</h2>
              <div className="bg-purple-50 rounded-xl p-4 mb-6">
                <p className="text-purple-800 font-medium">{selectedChoice.label}</p>
              </div>
              
              <p className="text-gray-700 text-lg mb-6">{selectedChoice.outcomeText}</p>
              
              {/* Effects Summary */}
              <div className="flex flex-wrap gap-3 mb-6">
                {selectedChoice.effects.cash !== undefined && selectedChoice.effects.cash !== 0 && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedChoice.effects.cash > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    Cash {selectedChoice.effects.cash > 0 ? '+' : ''}{selectedChoice.effects.cash}
                  </span>
                )}
                {selectedChoice.effects.savings !== undefined && selectedChoice.effects.savings !== 0 && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedChoice.effects.savings > 0 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                  }`}>
                    Savings {selectedChoice.effects.savings > 0 ? '+' : ''}{selectedChoice.effects.savings}
                  </span>
                )}
                {selectedChoice.effects.debt !== undefined && selectedChoice.effects.debt !== 0 && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                    Debt +{selectedChoice.effects.debt}
                  </span>
                )}
                {selectedChoice.effects.wellbeing !== undefined && selectedChoice.effects.wellbeing !== 0 && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedChoice.effects.wellbeing > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    Wellbeing {selectedChoice.effects.wellbeing > 0 ? '+' : ''}{selectedChoice.effects.wellbeing}
                  </span>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedToBonus}
                className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Bonus Challenge!
              </motion.button>
            </motion.div>
          )}

          {/* BONUS QUESTION PHASE */}
          {phase === 'bonus' && currentCard && (
            <motion.div
              key="bonus"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900">Bonus Challenge!</h2>
                <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  +${currentCard.bonusQuestion.bonusReward} if correct
                </span>
              </div>
              
              <p className="text-gray-700 text-lg mb-6">{currentCard.bonusQuestion.questionText}</p>
              
              {currentCard.bonusQuestion.answerType === 'mcq' && currentCard.bonusQuestion.options && (
                <div className="space-y-3 mb-6">
                  {currentCard.bonusQuestion.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => setBonusAnswer(option)}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                        bonusAnswer === option
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              
              {currentCard.bonusQuestion.answerType === 'numeric' && (
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      value={bonusAnswer}
                      onChange={(e) => setBonusAnswer(e.target.value)}
                      placeholder="Enter your answer"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBonusSubmit}
                disabled={!bonusAnswer.trim() || isLoading}
                className="w-full py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Answer'}
              </motion.button>
            </motion.div>
          )}

          {/* BONUS FEEDBACK PHASE */}
          {phase === 'bonus-feedback' && bonusResult && (
            <motion.div
              key="bonus-feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              {bonusResult.correct ? (
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-700 mb-2">Correct! 🎉</h2>
                  <p className="text-gray-600">
                    You earned +${currentCard?.bonusQuestion.bonusReward} bonus cash!
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-6 h-6 text-amber-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Not quite!</h2>
                  </div>
                  
                  <div className="bg-amber-50 rounded-xl p-4 mb-4">
                    <p className="text-amber-800">{bonusResult.feedback}</p>
                  </div>
                  
                  {followUpQuestion && (
                    <div className="bg-purple-50 rounded-xl p-4">
                      <p className="font-medium text-purple-800 mb-3">
                        <Sparkles className="w-4 h-4 inline mr-1" />
                        Try this follow-up for a +$2 bonus:
                      </p>
                      <p className="text-gray-700 mb-3">{followUpQuestion.q}</p>
                      <input
                        type="text"
                        value={followUpAnswer}
                        onChange={(e) => setFollowUpAnswer(e.target.value)}
                        placeholder="Your answer..."
                        className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none mb-3"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleFollowUpSubmit}
                          disabled={!followUpAnswer.trim()}
                          className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
                        >
                          Submit
                        </button>
                        <button
                          onClick={skipFollowUp}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                          Skip
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {(bonusResult.correct || !followUpQuestion) && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPhase('turn-end')}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                  Continue
                </motion.button>
              )}
            </motion.div>
          )}

          {/* TURN END PHASE */}
          {phase === 'turn-end' && (
            <motion.div
              key="turn-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center"
            >
              {followUpResult !== null && (
                <div className="mb-6">
                  {followUpResult ? (
                    <div className="bg-green-50 rounded-xl p-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-green-700 font-medium">Nice! You got the follow-up right and earned +$2 savings!</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-600">The correct answer was: <strong>{followUpQuestion?.a}</strong></p>
                      <p className="text-gray-500 text-sm mt-1">Keep practicing!</p>
                    </div>
                  )}
                </div>
              )}
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Turn {gameState.turnNumber} Complete!
              </h2>
              <p className="text-gray-600 mb-6">
                {gameState.turnNumber >= gameState.maxTurns 
                  ? "That was the last turn! Let's see your final results..."
                  : `${gameState.maxTurns - gameState.turnNumber} turns remaining`}
              </p>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNextTurn}
                className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                {gameState.turnNumber >= gameState.maxTurns ? 'See Results' : 'Next Turn'}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

