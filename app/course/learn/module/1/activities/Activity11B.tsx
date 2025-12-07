'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, Zap } from 'lucide-react'

interface Activity11BProps {
  onComplete: (data: Record<string, unknown>) => void
}

const QUIZ_QUESTIONS = [
  {
    term: 'Inflation',
    correct: 'A general increase in prices over time',
    options: [
      'A general increase in prices over time',
      'Money you owe to someone',
      'A share of ownership in a company'
    ],
    explanation: 'Inflation means prices go up over time, so your money buys less than before.'
  },
  {
    term: 'Debt',
    correct: 'Money that is owed to someone else',
    options: [
      'Money you earn from a job',
      'Money that is owed to someone else',
      'Money saved in a bank'
    ],
    explanation: 'Debt is when you owe money to someone – like when you borrow and need to pay it back.'
  },
  {
    term: 'Interest',
    correct: 'Extra money paid for borrowing money',
    options: [
      'The price of a stock',
      'Money from selling things',
      'Extra money paid for borrowing money'
    ],
    explanation: 'Interest is like a fee for borrowing money. Banks pay you interest on savings, and you pay interest on loans.'
  },
  {
    term: 'Profit',
    correct: 'Money left over after paying all expenses',
    options: [
      'Money left over after paying all expenses',
      'The total money a business receives',
      'Money borrowed from a bank'
    ],
    explanation: 'Profit is what remains after you subtract all costs from what you earned. Revenue - Expenses = Profit!'
  },
  {
    term: 'Stock',
    correct: 'A share of ownership in a company',
    options: [
      'Money in your savings account',
      'A share of ownership in a company',
      'A type of loan from a bank'
    ],
    explanation: 'When you buy stock, you own a tiny piece of that company!'
  }
]

export default function Activity11B({ onComplete }: Activity11BProps) {
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
    
    if (answer === question.correct) {
      setScore(prev => prev + 1)
    } else {
      setMissedTerms(prev => [...prev, question.term])
    }
  }

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setIsComplete(true)
    }
  }

  if (isComplete) {
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100)
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Lightning Quiz Complete! ⚡
          </h2>
          <p className="text-4xl font-bold text-forest-600 mb-2">
            {score}/{QUIZ_QUESTIONS.length}
          </p>
          <p className="text-gray-600 mb-6">
            You got {percentage}% correct!
          </p>
          
          {percentage === 100 ? (
            <p className="text-green-600 font-medium mb-8">
              🌟 Perfect score! You really know your financial terms!
            </p>
          ) : percentage >= 60 ? (
            <p className="text-amber-600 font-medium mb-8">
              Good job! Review the terms you missed to strengthen your knowledge.
            </p>
          ) : (
            <p className="text-amber-600 font-medium mb-8">
              Keep practicing! These terms will become easier with time.
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({
              activity_11b_score: score,
              activity_11b_total: QUIZ_QUESTIONS.length,
              activity_11b_missed: missedTerms
            })}
            className="btn-primary px-8 py-3"
          >
            Continue to Next Lesson <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-6 h-6 text-accent-500" />
          <h2 className="text-xl font-bold text-gray-900">
            Activity 1.1B – Lightning Quiz
          </h2>
        </div>
        <p className="text-gray-600">
          Quick check! Choose the best definition for each term.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
          <span>Score: {score}/{currentQuestion + (showFeedback ? 1 : 0)}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + (showFeedback ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-forest-50 rounded-xl p-6 mb-6">
        <p className="text-sm text-forest-600 font-medium mb-2">What does this term mean?</p>
        <p className="text-2xl font-bold text-forest-800">{question.term}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === option
          const isCorrectOption = option === question.correct
          
          let bgColor = 'bg-white hover:bg-gray-50 border-gray-200'
          if (showFeedback) {
            if (isCorrectOption) {
              bgColor = 'bg-green-50 border-green-400'
            } else if (isSelected && !isCorrectOption) {
              bgColor = 'bg-red-50 border-red-400'
            }
          } else if (isSelected) {
            bgColor = 'bg-forest-50 border-forest-400'
          }

          return (
            <motion.button
              key={idx}
              whileHover={!showFeedback ? { scale: 1.01 } : {}}
              whileTap={!showFeedback ? { scale: 0.99 } : {}}
              onClick={() => handleAnswer(option)}
              disabled={showFeedback}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${bgColor}`}
            >
              <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-600">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{option}</span>
              {showFeedback && isCorrectOption && (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
              {showFeedback && isSelected && !isCorrectOption && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 mb-6 ${
            isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <Lightbulb className={`w-5 h-5 mt-0.5 ${isCorrect ? 'text-green-600' : 'text-amber-600'}`} />
            <div>
              <p className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                {isCorrect ? '✓ Correct!' : '✗ Not quite!'}
              </p>
              <p className={isCorrect ? 'text-green-700' : 'text-amber-700'}>
                {question.explanation}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Next Button */}
      {showFeedback && (
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="btn-primary px-8 py-3"
          >
            {currentQuestion < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'} 
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      )}
    </div>
  )
}

