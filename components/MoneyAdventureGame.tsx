'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Coins, PiggyBank, TrendingDown, Heart, X, ArrowRight,
  CheckCircle2, XCircle, Sparkles, Loader2, HelpCircle, Target,
  User, Palette, Trophy, ChevronRight
} from 'lucide-react'
import { 
  GameState, ChoiceEffects, SceneChoice,
  getWellbeingEmoji, getWellbeingColor, getTraitLevel,
  AVATARS, BIG_GOALS, ThemeType, BigGoal, Avatar,
  getProgressPercentage, determineEndingType, ENDING_INFO,
  saveGameState
} from '@/lib/moneyAdventure/types'
import { getScene, getChapterTitle } from '@/lib/moneyAdventure/scenes'
import { Scene, SceneChallenge } from '@/lib/moneyAdventure/types'
import { updateConceptScores } from '@/lib/conceptProgress'

interface MoneyAdventureGameProps {
  gameState: GameState
  userName: string
  onUpdate: (state: GameState) => void
  onExit: () => void
}

type GamePhase = 'story' | 'outcome' | 'challenge' | 'challenge-feedback' | 'open-ended' | 'turn-end' | 'ending'

const THEMES: ThemeType[] = ['Sports', 'Art', 'Music', 'Games', 'Animals']
const THEME_EMOJIS: Record<ThemeType, string> = {
  Sports: '⚽', Art: '🎨', Music: '🎵', Games: '🎮', Animals: '🐾'
}

export default function MoneyAdventureGame({ 
  gameState, 
  userName,
  onUpdate, 
  onExit 
}: MoneyAdventureGameProps) {
  // Character creation state
  const [creationStep, setCreationStep] = useState<'avatar' | 'theme' | 'goal'>('avatar')
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<ThemeType | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<BigGoal | null>(null)

  // Game state
  const [currentScene, setCurrentScene] = useState<Scene | null>(null)
  const [phase, setPhase] = useState<GamePhase>('story')
  const [selectedChoice, setSelectedChoice] = useState<SceneChoice | null>(null)
  const [challengeAnswer, setChallengeAnswer] = useState('')
  const [challengeResult, setChallengeResult] = useState<{ correct: boolean; feedback?: string } | null>(null)
  const [openEndedAnswer, setOpenEndedAnswer] = useState('')
  const [openEndedFeedback, setOpenEndedFeedback] = useState<{ status: string; feedback: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showEnding, setShowEnding] = useState(false)
  const [epilogue, setEpilogue] = useState<string | null>(null)

  // Load current scene
  useEffect(() => {
    if (gameState.stage === 'playing') {
      const scene = getScene(gameState.chapter, gameState.scene)
      setCurrentScene(scene || null)
    }
  }, [gameState.chapter, gameState.scene, gameState.stage])

  // Check for game end
  useEffect(() => {
    if (gameState.stage === 'ended') {
      setShowEnding(true)
      loadEpilogue()
    }
  }, [gameState.stage])

  const loadEpilogue = async () => {
    try {
      const response = await fetch('/api/adventure/epilogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameState, userName })
      })
      if (response.ok) {
        const data = await response.json()
        setEpilogue(data.epilogue)
      }
    } catch (error) {
      console.error('Failed to load epilogue:', error)
    }
  }

  // Character creation handlers
  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar)
    setCreationStep('theme')
  }

  const handleThemeSelect = (theme: ThemeType) => {
    setSelectedTheme(theme)
    setCreationStep('goal')
  }

  const handleGoalSelect = (goal: BigGoal) => {
    setSelectedGoal(goal)
    // Start the game
    const newState: GameState = {
      ...gameState,
      avatarId: selectedAvatar!.id,
      theme: selectedTheme!,
      bigGoal: goal,
      stage: 'playing',
      chapter: 1,
      scene: 1,
      cash: 20,
      savings: 0,
      debt: 0,
      wellbeing: 70,
    }
    onUpdate(newState)
  }

  // Apply choice effects to game state
  const applyEffects = (effects: ChoiceEffects): GameState => {
    return {
      ...gameState,
      cash: Math.max(0, gameState.cash + (effects.cash || 0)),
      savings: Math.max(0, gameState.savings + (effects.savings || 0)),
      debt: Math.max(0, gameState.debt + (effects.debt || 0)),
      wellbeing: Math.min(100, Math.max(0, gameState.wellbeing + (effects.wellbeing || 0))),
      saverScore: gameState.saverScore + (effects.saverScore || 0),
      riskScore: gameState.riskScore + (effects.riskScore || 0),
      plannerScore: gameState.plannerScore + (effects.plannerScore || 0),
      totalEarned: gameState.totalEarned + (effects.totalEarned || 0),
      totalSpentNeeds: gameState.totalSpentNeeds + (effects.totalSpentNeeds || 0),
      totalSpentWants: gameState.totalSpentWants + (effects.totalSpentWants || 0),
      totalSaved: gameState.totalSaved + (effects.totalSaved || 0),
    }
  }

  const handleChoiceSelect = (choice: SceneChoice) => {
    // Check if choice is disabled
    if (choice.disabledReason) {
      const reason = choice.disabledReason(gameState)
      if (reason) return
    }

    setSelectedChoice(choice)
    const newState = applyEffects(choice.effects)
    
    // Handle business flag for scene 3.2
    if (choice.id === 'start-business') {
      newState.hasBusiness = true
      // Add profit after business
      newState.cash += 40
    }
    if (choice.id === 'keep-small' || choice.id === 'go-all-in' || choice.id === 'shutdown') {
      newState.businessChoice = choice.id as 'keep_small' | 'go_all_in' | 'shutdown'
    }
    
    // Track if they bought the goal
    if (choice.id === 'buy-keep-cushion' || choice.id === 'buy-no-cushion' || choice.id === 'borrow-rest') {
      newState.boughtGoal = true
    }
    
    onUpdate(newState)
    setPhase('outcome')
  }

  const handleProceedFromOutcome = () => {
    if (currentScene?.challenge) {
      setPhase('challenge')
      setChallengeAnswer('')
    } else if (currentScene?.openEndedPrompt) {
      setPhase('open-ended')
      setOpenEndedAnswer('')
    } else {
      setPhase('turn-end')
    }
  }

  const handleChallengeSubmit = async () => {
    if (!currentScene?.challenge || !challengeAnswer.trim()) return
    
    const challenge = currentScene.challenge
    const correctAnswer = typeof challenge.correctAnswer === 'function' 
      ? challenge.correctAnswer(gameState) 
      : challenge.correctAnswer
    
    const isCorrect = challenge.type === 'open_ended' 
      ? true // Will be evaluated by AI
      : challengeAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()
    
    if (challenge.type === 'open_ended') {
      setIsLoading(true)
      try {
        const response = await fetch('/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questions: [{
              id: challenge.id,
              prompt: typeof challenge.questionText === 'function' ? challenge.questionText(gameState) : challenge.questionText,
              studentAnswer: challengeAnswer,
              conceptTags: challenge.conceptTags,
              questionType: 'concept_check',
              rubric: challenge.rubric
            }],
            attemptNumber: 1
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          const evaluation = data.evaluations[0]
          setChallengeResult({
            correct: evaluation.status === 'good_enough',
            feedback: evaluation.feedback
          })
          
          if (evaluation.status === 'good_enough' && challenge.bonusReward) {
            const newState = { ...gameState, cash: gameState.cash + challenge.bonusReward }
            onUpdate(newState)
          }
        }
      } catch (error) {
        console.error('Challenge evaluation error:', error)
        setChallengeResult({ correct: true, feedback: 'Great thinking!' })
      }
      setIsLoading(false)
    } else {
      if (isCorrect && challenge.bonusReward) {
        const newState = { ...gameState, cash: gameState.cash + challenge.bonusReward }
        onUpdate(newState)
      }
      
      setChallengeResult({
        correct: isCorrect,
        feedback: isCorrect 
          ? `Correct! ${challenge.bonusReward ? `+$${challenge.bonusReward} bonus!` : ''}`
          : `The correct answer was: ${correctAnswer}`
      })
    }
    
    // Log to concept progress
    updateConceptScores(gameState.visibleUserId, challenge.conceptTags.map(tag => ({
      concept: tag,
      correct: isCorrect
    })))
    
    setPhase('challenge-feedback')
  }

  const handleOpenEndedSubmit = async () => {
    if (!currentScene?.openEndedPrompt || !openEndedAnswer.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: [{
            id: `${currentScene.id}-open`,
            prompt: currentScene.openEndedPrompt.prompt,
            studentAnswer: openEndedAnswer,
            conceptTags: currentScene.conceptTags,
            questionType: 'reflection',
            rubric: currentScene.openEndedPrompt.rubric
          }],
          attemptNumber: 1
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setOpenEndedFeedback(data.evaluations[0])
      }
    } catch (error) {
      console.error('Open-ended evaluation error:', error)
      setOpenEndedFeedback({ status: 'good_enough', feedback: 'Thanks for sharing your thoughts!' })
    }
    setIsLoading(false)
  }

  const handleNextScene = () => {
    if (!currentScene) return
    
    // Determine next scene
    let nextLocation: { chapter: number; scene: number } | 'end' = { 
      chapter: gameState.chapter, 
      scene: gameState.scene + 1 
    }
    
    if (currentScene.nextScene) {
      nextLocation = currentScene.nextScene(gameState, selectedChoice?.id || '')
    }
    
    if (nextLocation === 'end') {
      const endingType = determineEndingType(gameState)
      const newState: GameState = {
        ...gameState,
        stage: 'ended',
        endedAt: new Date(),
        endingType
      }
      onUpdate(newState)
      return
    }
    
    // Update to next scene
    const newState: GameState = {
      ...gameState,
      chapter: nextLocation.chapter,
      scene: nextLocation.scene
    }
    onUpdate(newState)
    
    // Reset phase
    setSelectedChoice(null)
    setChallengeAnswer('')
    setChallengeResult(null)
    setOpenEndedAnswer('')
    setOpenEndedFeedback(null)
    setPhase('story')
  }

  // CHARACTER CREATION SCREEN
  if (gameState.stage === 'character_creation') {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="container-custom max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Character</h1>
              <div className="flex justify-center gap-2">
                {['avatar', 'theme', 'goal'].map((step, i) => (
                  <div key={step} className={`w-3 h-3 rounded-full ${
                    creationStep === step ? 'bg-orange-500' : 
                    i < ['avatar', 'theme', 'goal'].indexOf(creationStep) ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {creationStep === 'avatar' && (
                <motion.div key="avatar" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" /> Choose Your Avatar
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    {AVATARS.map(avatar => (
                      <motion.button
                        key={avatar.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAvatarSelect(avatar)}
                        className="p-6 bg-gray-50 hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-400 rounded-xl text-center transition-all"
                      >
                        <span className="text-4xl mb-2 block">{avatar.emoji}</span>
                        <span className="font-medium text-gray-700">{avatar.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {creationStep === 'theme' && (
                <motion.div key="theme" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5" /> What Do You Love?
                  </h2>
                  <p className="text-gray-600 mb-4">This will customize your adventure!</p>
                  <div className="grid grid-cols-2 gap-4">
                    {THEMES.map(theme => (
                      <motion.button
                        key={theme}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleThemeSelect(theme)}
                        className="p-5 bg-gray-50 hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-400 rounded-xl text-left transition-all"
                      >
                        <span className="text-3xl mb-2 block">{THEME_EMOJIS[theme]}</span>
                        <span className="font-semibold text-gray-800">{theme}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {creationStep === 'goal' && (
                <motion.div key="goal" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" /> Choose Your Big Goal
                  </h2>
                  <p className="text-gray-600 mb-4">What will you save for?</p>
                  <div className="space-y-3">
                    {BIG_GOALS.map(goal => (
                      <motion.button
                        key={goal.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleGoalSelect(goal)}
                        className="w-full p-4 bg-gray-50 hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-400 rounded-xl flex items-center justify-between transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{goal.icon}</span>
                          <span className="font-semibold text-gray-800">{goal.name}</span>
                        </div>
                        <span className="text-orange-600 font-bold">${goal.cost}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    )
  }

  // ENDING SCREEN
  if (showEnding && gameState.endingType) {
    const ending = ENDING_INFO[gameState.endingType]
    
    return (
      <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="container-custom max-w-3xl">
          {/* Badge & Title */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-8">
            <div className="text-8xl mb-4">{ending.badge}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{ending.title}</h1>
            <p className="text-gray-600">{ending.description}</p>
          </motion.div>

          {/* Final Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="font-bold text-gray-900 mb-4">Final Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <Coins className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-green-600">${gameState.cash}</p>
                <p className="text-xs text-gray-500">Cash</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <PiggyBank className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-blue-600">${gameState.savings}</p>
                <p className="text-xs text-gray-500">Savings</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-xl">
                <TrendingDown className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-red-600">${gameState.debt}</p>
                <p className="text-xs text-gray-500">Debt</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-xl">
                <Target className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                <p className="text-xl font-bold">{gameState.boughtGoal ? '✅' : '❌'}</p>
                <p className="text-xs text-gray-500">Got Goal?</p>
              </div>
            </div>
          </motion.div>

          {/* AI Epilogue */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h2 className="font-bold text-gray-900">Bright's Personal Message</h2>
            </div>
            {epilogue ? (
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{epilogue}</p>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Writing your personalized message...</span>
              </div>
            )}
          </motion.div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExit}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700"
            >
              Play Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExit}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
            >
              Back to Course
            </motion.button>
          </div>
        </div>
      </div>
    )
  }

  // MAIN GAME SCREEN
  if (!currentScene) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    )
  }

  const progress = getProgressPercentage(gameState.chapter, gameState.scene)
  const storyText = currentScene.getStory(gameState)
  const choices = typeof currentScene.choices === 'function' 
    ? currentScene.choices(gameState) 
    : currentScene.choices

  return (
    <div className="min-h-screen pt-16 pb-8 bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="container-custom max-w-6xl">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Chapter {gameState.chapter}: {getChapterTitle(gameState.chapter)}</p>
            <h2 className="font-bold text-gray-900">{currentScene.title}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-sm text-gray-500">{progress}%</span>
            <button onClick={onExit} className="p-2 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          {/* Left Panel - Player Stats */}
          <div className="lg:col-span-1 space-y-4">
            {/* Avatar & Name */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
                  {AVATARS.find(a => a.id === gameState.avatarId)?.emoji || '⭐'}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{userName}</p>
                  <p className="text-sm text-gray-500">{gameState.theme} Fan</p>
                </div>
              </div>
              
              {/* Money Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Coins className="w-4 h-4 text-green-600" /> Cash
                  </span>
                  <span className="font-bold text-green-600">${gameState.cash}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <PiggyBank className="w-4 h-4 text-blue-600" /> Savings
                  </span>
                  <span className="font-bold text-blue-600">${gameState.savings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <TrendingDown className="w-4 h-4 text-red-600" /> Debt
                  </span>
                  <span className="font-bold text-red-600">${gameState.debt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Heart className="w-4 h-4 text-yellow-600" /> Wellbeing
                  </span>
                  <span className={`font-bold ${getWellbeingColor(gameState.wellbeing)}`}>
                    {getWellbeingEmoji(gameState.wellbeing)}
                  </span>
                </div>
              </div>
            </div>

            {/* Goal Tracker */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="font-semibold text-gray-800">Goal Tracker</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {gameState.bigGoal.icon} {gameState.bigGoal.name}
              </p>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-1">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all"
                  style={{ width: `${Math.min(100, (gameState.savings / gameState.bigGoal.cost) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 text-right">
                ${gameState.savings} / ${gameState.bigGoal.cost}
              </p>
            </div>

            {/* Traits */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="font-semibold text-gray-800 mb-3">Your Traits</p>
              <div className="space-y-2">
                {[
                  { name: 'Saver', score: gameState.saverScore, color: 'blue' },
                  { name: 'Risk Taker', score: gameState.riskScore, color: 'red' },
                  { name: 'Planner', score: gameState.plannerScore, color: 'green' },
                ].map(trait => (
                  <div key={trait.name} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-20">{trait.name}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-${trait.color}-500 transition-all`}
                        style={{ 
                          width: `${Math.min(100, Math.max(0, (trait.score + 5) * 10))}%`,
                          backgroundColor: trait.color === 'blue' ? '#3b82f6' : trait.color === 'red' ? '#ef4444' : '#22c55e'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - Story */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* STORY PHASE */}
              {phase === 'story' && (
                <motion.div key="story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4">
                    <h3 className="text-white font-bold text-lg">{currentScene.title}</h3>
                  </div>
                  <div className="p-6">
                    <div className="prose prose-gray max-w-none mb-6">
                      {storyText.split('\n').map((para, i) => (
                        <p key={i} className="text-gray-700 mb-3">{para}</p>
                      ))}
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-3">What do you do?</h4>
                    <div className="space-y-2">
                      {choices.map(choice => {
                        const label = typeof choice.label === 'function' ? choice.label(gameState) : choice.label
                        const disabledReason = choice.disabledReason?.(gameState)
                        
                        return (
                          <motion.button
                            key={choice.id}
                            whileHover={!disabledReason ? { scale: 1.01 } : {}}
                            whileTap={!disabledReason ? { scale: 0.99 } : {}}
                            onClick={() => !disabledReason && handleChoiceSelect(choice)}
                            disabled={!!disabledReason}
                            className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                              disabledReason 
                                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                : 'border-gray-200 hover:border-orange-400 hover:bg-orange-50'
                            }`}
                          >
                            <span className="font-medium">{label}</span>
                            {disabledReason && (
                              <span className="block text-sm text-red-400 mt-1">{disabledReason}</span>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* OUTCOME PHASE */}
              {phase === 'outcome' && selectedChoice && (
                <motion.div key="outcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Your Choice:</h3>
                  <div className="bg-orange-50 rounded-xl p-4 mb-4">
                    <p className="text-orange-800 font-medium">
                      {typeof selectedChoice.label === 'function' ? selectedChoice.label(gameState) : selectedChoice.label}
                    </p>
                  </div>
                  <p className="text-gray-700 mb-6">
                    {typeof selectedChoice.outcomeText === 'function' ? selectedChoice.outcomeText(gameState) : selectedChoice.outcomeText}
                  </p>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProceedFromOutcome}
                    className="w-full py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 flex items-center justify-center gap-2"
                  >
                    {currentScene?.challenge ? (
                      <><Sparkles className="w-5 h-5" /> Bonus Challenge!</>
                    ) : (
                      <>Continue <ChevronRight className="w-5 h-5" /></>
                    )}
                  </motion.button>
                </motion.div>
              )}

              {/* CHALLENGE PHASE */}
              {phase === 'challenge' && currentScene?.challenge && (
                <motion.div key="challenge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                    <h3 className="font-bold text-gray-900">Bonus Challenge!</h3>
                    {currentScene.challenge.bonusReward && (
                      <span className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        +${currentScene.challenge.bonusReward} if correct
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 text-lg mb-6">
                    {typeof currentScene.challenge.questionText === 'function' 
                      ? currentScene.challenge.questionText(gameState) 
                      : currentScene.challenge.questionText}
                  </p>
                  
                  {currentScene.challenge.type === 'mcq' && currentScene.challenge.options && (
                    <div className="space-y-2 mb-6">
                      {currentScene.challenge.options.map(option => (
                        <button
                          key={option}
                          onClick={() => setChallengeAnswer(option)}
                          className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                            challengeAnswer === option
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {(currentScene.challenge.type === 'numeric' || currentScene.challenge.type === 'open_ended') && (
                    <div className="mb-6">
                      {currentScene.challenge.type === 'numeric' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">$</span>
                          <input
                            type="number"
                            value={challengeAnswer}
                            onChange={(e) => setChallengeAnswer(e.target.value)}
                            placeholder="Enter your answer"
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <textarea
                          value={challengeAnswer}
                          onChange={(e) => setChallengeAnswer(e.target.value)}
                          placeholder="Type your answer..."
                          rows={3}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none"
                        />
                      )}
                    </div>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleChallengeSubmit}
                    disabled={!challengeAnswer.trim() || isLoading}
                    className="w-full py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Answer'}
                  </motion.button>
                </motion.div>
              )}

              {/* CHALLENGE FEEDBACK */}
              {phase === 'challenge-feedback' && challengeResult && (
                <motion.div key="challenge-feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="text-center mb-6">
                    {challengeResult.correct ? (
                      <>
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-3" />
                        <h3 className="text-2xl font-bold text-green-700">Correct! 🎉</h3>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-16 h-16 text-amber-500 mx-auto mb-3" />
                        <h3 className="text-2xl font-bold text-amber-700">Not quite!</h3>
                      </>
                    )}
                    <p className="text-gray-600 mt-2">{challengeResult.feedback}</p>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => currentScene?.openEndedPrompt ? setPhase('open-ended') : setPhase('turn-end')}
                    className="w-full py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700"
                  >
                    Continue
                  </motion.button>
                </motion.div>
              )}

              {/* OPEN-ENDED PHASE */}
              {phase === 'open-ended' && currentScene?.openEndedPrompt && (
                <motion.div key="open-ended" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="w-6 h-6 text-orange-500" />
                    <h3 className="font-bold text-gray-900">Reflection Time</h3>
                  </div>
                  
                  <p className="text-gray-700 text-lg mb-4">{currentScene.openEndedPrompt.prompt}</p>
                  
                  <textarea
                    value={openEndedAnswer}
                    onChange={(e) => setOpenEndedAnswer(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={4}
                    disabled={!!openEndedFeedback}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none mb-4"
                  />
                  
                  {openEndedFeedback && (
                    <div className={`p-4 rounded-xl mb-4 ${
                      openEndedFeedback.status === 'good_enough' ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
                    }`}>
                      <p className={openEndedFeedback.status === 'good_enough' ? 'text-green-700' : 'text-amber-700'}>
                        {openEndedFeedback.feedback}
                      </p>
                    </div>
                  )}
                  
                  {!openEndedFeedback ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleOpenEndedSubmit}
                      disabled={openEndedAnswer.length < 10 || isLoading}
                      className="w-full py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Reflection'}
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPhase('turn-end')}
                      className="w-full py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700"
                    >
                      Continue
                    </motion.button>
                  )}
                </motion.div>
              )}

              {/* TURN END */}
              {phase === 'turn-end' && (
                <motion.div key="turn-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl shadow-sm p-6 text-center">
                  <Trophy className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Scene Complete!</h3>
                  <p className="text-gray-600 mb-6">Ready for what's next?</p>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextScene}
                    className="px-8 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 flex items-center justify-center gap-2 mx-auto"
                  >
                    Next Scene <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
