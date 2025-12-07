'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, CheckCircle2, XCircle } from 'lucide-react'
import { useQuizTracking } from '@/hooks/useQuizTracking'

interface Props { onComplete: (data: Record<string, unknown>) => void }

// Stock prices over 10 days matching the worksheet
const STOCK_DATA = [
  { day: 1, price: 5 }, { day: 2, price: 7 }, { day: 3, price: 6 },
  { day: 4, price: 8 }, { day: 5, price: 11 }, { day: 6, price: 9 },
  { day: 7, price: 7 }, { day: 8, price: 4 }, { day: 9, price: 2 },
  { day: 10, price: 6 },
]

const QUESTIONS = [
  { id: 1, questionKey: 'q1', question: 'What does this graph show?', options: ['Temperature over time', 'Stock price over 10 days', 'Number of students'], answer: 'Stock price over 10 days' },
  { id: 2, questionKey: 'q2', question: 'What is the highest price?', options: ['$9', '$11', '$7'], answer: '$11' },
  { id: 3, questionKey: 'q3', question: 'What is the lowest price?', options: ['$2', '$4', '$5'], answer: '$2' },
  { id: 4, questionKey: 'q4', question: 'On which day was the price highest?', options: ['Day 5', 'Day 4', 'Day 6'], answer: 'Day 5' },
  { id: 5, questionKey: 'q5', question: 'Did the price go UP or DOWN from Day 5 to Day 6?', options: ['Up', 'Down', 'Stayed same'], answer: 'Down' },
  { id: 6, questionKey: 'q6', question: 'What was the price on Day 1?', options: ['$5', '$7', '$6'], answer: '$5' },
  { id: 7, questionKey: 'q7', question: 'What was the price on Day 10?', options: ['$4', '$6', '$2'], answer: '$6' },
  { id: 8, questionKey: 'q8', question: 'Overall, is this stock doing well?', options: ['Yes, it ended higher than it started', 'No, it\'s very unpredictable', 'It stayed exactly the same'], answer: 'Yes, it ended higher than it started' },
]

export default function Activity34A({ onComplete }: Props) {
  const { recordAnswer, submitResults, isSubmitting } = useQuizTracking('activity-3.4a')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [score, setScore] = useState(0)

  const question = QUESTIONS[currentQ]
  const isCorrect = answers[question.id] === question.answer
  const isComplete = currentQ >= QUESTIONS.length - 1 && showFeedback

  const handleAnswer = (answer: string) => {
    if (showFeedback) return
    setAnswers({ ...answers, [question.id]: answer })
    setShowFeedback(true)
    const correct = answer === question.answer
    recordAnswer(question.questionKey, answer, correct)
    if (correct) setScore(prev => prev + 1)
  }

  const handleNext = async () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1)
      setShowFeedback(false)
    } else {
      await submitResults()
    }
  }

  // SVG chart dimensions
  const width = 500, height = 200, padding = 40
  const maxPrice = 12, minPrice = 0
  const xScale = (day: number) => padding + ((day - 1) / 9) * (width - 2 * padding)
  const yScale = (price: number) => height - padding - ((price - minPrice) / (maxPrice - minPrice)) * (height - 2 * padding)

  if (isComplete) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-forest-400 to-forest-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Stock Chart Complete! 📈</h2>
          <p className="text-4xl font-bold text-forest-600 mb-2">{score}/{QUESTIONS.length}</p>
          <p className="text-gray-600 mb-8">You can read stock charts!</p>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ activity_34a_score: score })}
            disabled={isSubmitting}
            className="btn-primary px-8 py-3 disabled:opacity-50">
            {isSubmitting ? 'Saving results...' : 'Continue'} 
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
          <TrendingUp className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 3.4A – Read the Stock Chart</h2>
        </div>
        <p className="text-gray-600">Answer questions about this stock&apos;s performance</p>
      </div>

      {/* Stock Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-lg mx-auto">
          {/* Grid lines */}
          {[0, 2, 4, 6, 8, 10, 12].map(price => (
            <g key={price}>
              <line x1={padding} y1={yScale(price)} x2={width - padding} y2={yScale(price)} stroke="#e5e7eb" strokeDasharray="4" />
              <text x={padding - 10} y={yScale(price) + 4} textAnchor="end" className="text-xs fill-gray-500">${price}</text>
            </g>
          ))}
          {/* X-axis labels */}
          {STOCK_DATA.map(d => (
            <text key={d.day} x={xScale(d.day)} y={height - 10} textAnchor="middle" className="text-xs fill-gray-500">Day {d.day}</text>
          ))}
          {/* Line */}
          <path
            d={STOCK_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.day)} ${yScale(d.price)}`).join(' ')}
            fill="none" stroke="#059669" strokeWidth="3" strokeLinejoin="round"
          />
          {/* Points */}
          {STOCK_DATA.map(d => (
            <circle key={d.day} cx={xScale(d.day)} cy={yScale(d.price)} r="6" fill="#059669" stroke="white" strokeWidth="2" />
          ))}
        </svg>
      </div>

      {/* Progress */}
      <div className="mb-4 text-sm text-gray-500 text-center">Question {currentQ + 1} of {QUESTIONS.length}</div>

      {/* Question */}
      <div className="bg-forest-50 rounded-xl p-5 mb-6">
        <p className="font-semibold text-forest-800 text-lg">{question.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option) => {
          const isSelected = answers[question.id] === option
          const isCorrectOption = option === question.answer
          let bgColor = 'bg-white hover:bg-gray-50 border-gray-200'
          if (showFeedback) {
            if (isCorrectOption) bgColor = 'bg-green-50 border-green-400'
            else if (isSelected) bgColor = 'bg-red-50 border-red-400'
          } else if (isSelected) {
            bgColor = 'bg-forest-50 border-forest-400'
          }
          return (
            <motion.button key={option} whileHover={!showFeedback ? { scale: 1.01 } : {}}
              onClick={() => handleAnswer(option)} disabled={showFeedback}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${bgColor}`}>
              <span>{option}</span>
              {showFeedback && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {showFeedback && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-500" />}
            </motion.button>
          )
        })}
      </div>

      {showFeedback && (
        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleNext}
            className="btn-primary px-8 py-3">
            {currentQ < QUESTIONS.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      )}
    </div>
  )
}

