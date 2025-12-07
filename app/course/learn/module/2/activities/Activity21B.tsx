'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, Zap } from 'lucide-react'
import { useQuizTracking } from '@/hooks/useQuizTracking'

interface Activity21BProps {
  onComplete: (data: Record<string, unknown>) => void
}

const QUIZ_QUESTIONS = [
  {
    questionKey: 'q1',
    term: 'Budget',
    correct: 'A plan for how you will use your money',
    options: ['A plan for how you will use your money', 'The total amount of money you have', 'Money you give to charity'],
    explanation: 'A budget is a plan for how you\'ll spend and save your money, not the money itself.'
  },
  {
    questionKey: 'q2',
    term: 'Needs',
    correct: 'Things you must have to survive',
    options: ['Things you must have to survive', 'Things you want but don\'t require', 'Extra money after paying bills'],
    explanation: 'Needs are essentials like food, shelter, and clothing. Without them, you couldn\'t survive!'
  },
  {
    questionKey: 'q3',
    term: 'Wants',
    correct: 'Things you would like but don\'t need to survive',
    options: ['Money you earn from a job', 'Things you would like but don\'t need to survive', 'The cost of something'],
    explanation: 'Wants are nice-to-haves like video games or fancy clothes. You can live without them!'
  },
  {
    questionKey: 'q4',
    term: 'Save',
    correct: 'To keep money for later instead of spending it',
    options: ['To spend money on things you want', 'To keep money for later instead of spending it', 'To give money to others'],
    explanation: 'Saving means putting money aside for future use instead of spending it right away.'
  },
  {
    questionKey: 'q5',
    term: 'Income',
    correct: 'Money you receive from work or allowance',
    options: ['Money you owe to someone', 'Money you receive from work or allowance', 'A plan for spending'],
    explanation: 'Income is money coming IN to you - from a job, allowance, or gifts.'
  },
  {
    questionKey: 'q6',
    term: 'Charity',
    correct: 'Giving money or help to people in need',
    options: ['Keeping money for yourself', 'Giving money or help to people in need', 'Borrowing money from a bank'],
    explanation: 'Charity is about helping others by donating money, time, or resources to those who need it.'
  },
]

export default function Activity21B({ onComplete }: Activity21BProps) {
  const { user } = useUser()
  const { recordAnswer, submitResults, isSubmitting } = useQuizTracking('activity-2.1b')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)
  const [missedTerms, setMissedTerms] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)

  const question = QUIZ_QUESTIONS[currentQuestion]
  const isCorrect = selectedAnswer === question.correct

  const handleAnswer = (answer: string) => {
    if (showFeedback) return
    setSelectedAnswer(answer)
    setShowFeedback(true)
    const correct = answer === question.correct
    
    // Track the answer
    recordAnswer(question.questionKey, answer, correct)
    
    if (correct) {
      setScore(prev => prev + 1)
    } else {
      setMissedTerms(prev => [...prev, question.term])
    }
  }

  const handleNext = async () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      // Quiz complete - submit results to API
      await submitResults()
      setIsComplete(true)
    }
  }

  if (isComplete) {
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100)
    return (
      <div className="p-6 md:p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lightning Quiz Complete! ⚡</h2>
          <p className="text-4xl font-bold text-forest-600 mb-2">{score}/{QUIZ_QUESTIONS.length}</p>
          <p className="text-gray-600 mb-6">You got {percentage}% correct!</p>
          
          {percentage === 100 ? (
            <p className="text-green-600 font-medium mb-8">🌟 Perfect score! You really know your saving & spending terms!</p>
          ) : (
            <p className="text-amber-600 font-medium mb-8">Good job! Keep practicing these money terms.</p>
          )}

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ activity_21b_score: score, activity_21b_missed: missedTerms })}
            disabled={isSubmitting}
            className="btn-primary px-8 py-3 disabled:opacity-50">
            {isSubmitting ? 'Saving results...' : 'Continue to Next Activity'} 
            {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-6 h-6 text-accent-500" />
          <h2 className="text-xl font-bold text-gray-900">Activity 2.1B – Lightning Quiz</h2>
        </div>
        <p className="text-gray-600">Quick check! Choose the best definition for each term.</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
          <span>Score: {score}/{currentQuestion + (showFeedback ? 1 : 0)}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div className="h-full bg-accent-500" initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + (showFeedback ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      <div className="bg-forest-50 rounded-xl p-6 mb-6">
        <p className="text-sm text-forest-600 font-medium mb-2">What does this term mean?</p>
        <p className="text-2xl font-bold text-forest-800">{question.term}</p>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === option
          const isCorrectOption = option === question.correct
          
          let bgColor = 'bg-white hover:bg-gray-50 border-gray-200'
          if (showFeedback) {
            if (isCorrectOption) bgColor = 'bg-green-50 border-green-400'
            else if (isSelected && !isCorrectOption) bgColor = 'bg-red-50 border-red-400'
          } else if (isSelected) {
            bgColor = 'bg-forest-50 border-forest-400'
          }

          return (
            <motion.button key={idx} whileHover={!showFeedback ? { scale: 1.01 } : {}} whileTap={!showFeedback ? { scale: 0.99 } : {}}
              onClick={() => handleAnswer(option)} disabled={showFeedback}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${bgColor}`}>
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-600">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{option}</span>
              {showFeedback && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {showFeedback && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-500" />}
            </motion.button>
          )
        })}
      </div>

      {showFeedback && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 mb-6 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
          <div className="flex items-start gap-3">
            <Lightbulb className={`w-5 h-5 mt-0.5 ${isCorrect ? 'text-green-600' : 'text-amber-600'}`} />
            <div>
              <p className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                {isCorrect ? '✓ Correct!' : '✗ Not quite!'}
              </p>
              <p className={isCorrect ? 'text-green-700' : 'text-amber-700'}>{question.explanation}</p>
            </div>
          </div>
        </motion.div>
      )}

      {showFeedback && (
        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleNext} className="btn-primary px-8 py-3">
            {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      )}
    </div>
  )
}

