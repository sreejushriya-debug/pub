'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, PiggyBank, ShoppingBag } from 'lucide-react'

interface Activity22AProps {
  onComplete: (data: Record<string, unknown>) => void
}

const SCENARIOS = [
  {
    id: 'hannah',
    name: 'Hannah',
    text: 'Hannah has $15 saved up. She wants to buy a notebook that costs $20. Her birthday is next week and she might get money as a gift.',
    answer: 'save',
    explanation: 'Hannah doesn\'t have enough yet. If she waits until her birthday, she might have enough! Spending now would leave her short.'
  },
  {
    id: 'jorge',
    name: 'Jorge',
    text: 'Jorge wants a new video game that costs $60. He has $45 saved. There\'s a big test next week and he needs to study.',
    answer: 'save',
    explanation: 'Jorge should save more and focus on his test. The game will still be there later, and he\'ll have enough money!'
  },
  {
    id: 'nishi',
    name: 'Nishi',
    text: 'Nishi has been saving for months and now has $100. She found the exact shoes she\'s been wanting on sale for $75 (usually $100).',
    answer: 'spend',
    explanation: 'Nishi has saved up enough and the shoes are on sale! This is a good time to buy something she\'s been planning to get.'
  },
  {
    id: 'marie',
    name: 'Marie',
    text: 'Marie has $30. She sees a cute toy at the store for $25. She was planning to save up for her friend\'s birthday present.',
    answer: 'save',
    explanation: 'Marie should save for her friend\'s gift since that\'s more important than a toy she just saw. The present is a commitment!'
  },
  {
    id: 'jameson',
    name: 'Jameson',
    text: 'Jameson needs new shoes for school - his current ones have holes. He has $50 saved and found decent shoes for $40.',
    answer: 'spend',
    explanation: 'Shoes for school are a NEED, not a want. Jameson should spend on this essential item.'
  },
  {
    id: 'katerina',
    name: 'Katerina',
    text: 'Katerina\'s family is having a garage sale. She found a book she\'s been wanting for only $2. She has $10 in her pocket.',
    answer: 'spend',
    explanation: 'This is a great deal on something Katerina wanted! $2 is a small amount and she has plenty left over.'
  },
]

export default function Activity22A({ onComplete }: Activity22AProps) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)

  const scenario = SCENARIOS[currentScenario]
  const selectedAnswer = answers[scenario.id]
  const isCorrect = selectedAnswer === scenario.answer
  const isComplete = currentScenario >= SCENARIOS.length - 1 && showFeedback

  const handleChoice = (choice: 'save' | 'spend') => {
    if (showFeedback) return
    setAnswers({ ...answers, [scenario.id]: choice })
    setShowFeedback(true)
    if (choice === scenario.answer) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(prev => prev + 1)
      setShowFeedback(false)
    }
  }

  if (isComplete) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-forest-400 to-forest-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <PiggyBank className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Great Job! 💰</h2>
          <p className="text-4xl font-bold text-forest-600 mb-2">{score}/{SCENARIOS.length}</p>
          <p className="text-gray-600 mb-8">You made smart saving and spending decisions!</p>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ activity_22a_score: score, scenarios: answers })}
            className="btn-primary px-8 py-3">
            Continue to Written Justifications <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Activity 2.2A – Save or Spend?</h2>
        <p className="text-gray-600">Read each scenario and decide: should they save or spend?</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Scenario {currentScenario + 1} of {SCENARIOS.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div className="h-full bg-forest-500" animate={{ width: `${((currentScenario + (showFeedback ? 1 : 0)) / SCENARIOS.length) * 100}%` }} />
        </div>
      </div>

      <div className="bg-gradient-to-br from-forest-50 to-sage-50 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-forest-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {scenario.name.charAt(0)}
          </div>
          <h3 className="text-lg font-bold text-gray-900">{scenario.name}&apos;s Situation</h3>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed">{scenario.text}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.button whileHover={!showFeedback ? { scale: 1.02 } : {}} whileTap={!showFeedback ? { scale: 0.98 } : {}}
          onClick={() => handleChoice('save')} disabled={showFeedback}
          className={`p-6 rounded-2xl border-3 transition-all flex flex-col items-center gap-3 ${
            showFeedback && scenario.answer === 'save' ? 'border-green-400 bg-green-50'
            : showFeedback && selectedAnswer === 'save' && scenario.answer !== 'save' ? 'border-red-400 bg-red-50'
            : selectedAnswer === 'save' ? 'border-forest-400 bg-forest-50'
            : 'border-gray-200 bg-white hover:border-forest-300 hover:bg-forest-50'
          }`}>
          <PiggyBank className={`w-12 h-12 ${showFeedback && scenario.answer === 'save' ? 'text-green-500' : 'text-forest-500'}`} />
          <span className="font-bold text-lg">SAVE</span>
          {showFeedback && scenario.answer === 'save' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
          {showFeedback && selectedAnswer === 'save' && scenario.answer !== 'save' && <XCircle className="w-6 h-6 text-red-500" />}
        </motion.button>

        <motion.button whileHover={!showFeedback ? { scale: 1.02 } : {}} whileTap={!showFeedback ? { scale: 0.98 } : {}}
          onClick={() => handleChoice('spend')} disabled={showFeedback}
          className={`p-6 rounded-2xl border-3 transition-all flex flex-col items-center gap-3 ${
            showFeedback && scenario.answer === 'spend' ? 'border-green-400 bg-green-50'
            : showFeedback && selectedAnswer === 'spend' && scenario.answer !== 'spend' ? 'border-red-400 bg-red-50'
            : selectedAnswer === 'spend' ? 'border-accent-400 bg-accent-50'
            : 'border-gray-200 bg-white hover:border-accent-300 hover:bg-accent-50'
          }`}>
          <ShoppingBag className={`w-12 h-12 ${showFeedback && scenario.answer === 'spend' ? 'text-green-500' : 'text-accent-500'}`} />
          <span className="font-bold text-lg">SPEND</span>
          {showFeedback && scenario.answer === 'spend' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
          {showFeedback && selectedAnswer === 'spend' && scenario.answer !== 'spend' && <XCircle className="w-6 h-6 text-red-500" />}
        </motion.button>
      </div>

      {showFeedback && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 mb-6 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
          <div className="flex items-start gap-3">
            <Lightbulb className={`w-5 h-5 mt-0.5 ${isCorrect ? 'text-green-600' : 'text-amber-600'}`} />
            <div>
              <p className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                {isCorrect ? '✓ Good thinking!' : '✗ Not quite!'}
              </p>
              <p className={isCorrect ? 'text-green-700' : 'text-amber-700'}>{scenario.explanation}</p>
            </div>
          </div>
        </motion.div>
      )}

      {showFeedback && currentScenario < SCENARIOS.length - 1 && (
        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleNext} className="btn-primary px-8 py-3">
            Next Scenario <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      )}
    </div>
  )
}


