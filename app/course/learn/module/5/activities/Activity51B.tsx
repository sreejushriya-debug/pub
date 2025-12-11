'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calculator, CheckCircle2, XCircle, Eye, RotateCcw } from 'lucide-react'

interface Props {
  taxData: Record<string, { price: number; tax: number }>
  onComplete: (data: Record<string, unknown>) => void
}

const ITEMS = [
  { id: 'teddy', name: 'Teddy Bear', price: 16.00, tax: 1.00, emoji: '🧸' },
  { id: 'basketball', name: 'Basketball', price: 15.00, tax: 0.94, emoji: '🏀' },
  { id: 'cotton', name: 'Cotton Candy', price: 5.00, tax: 0.31, emoji: '🍭' },
  { id: 'soda', name: 'Soda', price: 2.00, tax: 0.13, emoji: '🥤' },
  { id: 'chips', name: 'Chips', price: 3.00, tax: 0.19, emoji: '🍟' },
]

export default function Activity51B({ taxData, onComplete }: Props) {
  const [currentItem, setCurrentItem] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const item = ITEMS[currentItem]
  const correctTotal = (item.price + item.tax).toFixed(2)
  const userAnswer = answers[item.id] || ''

  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    setChecked(true)
  }

  const handleReveal = () => {
    setRevealed(true)
    const newAnswers: Record<string, string> = {}
    ITEMS.forEach(i => {
      newAnswers[i.id] = (i.price + i.tax).toFixed(2)
    })
    setAnswers(newAnswers)
    setChecked(true)
  }

  const handleTryAgain = () => {
    const newAnswers = { ...answers }
    if (newAnswers[item.id] === correctTotal) {
      // Keep correct answer
    } else {
      delete newAnswers[item.id]
    }
    setAnswers(newAnswers)
    setChecked(false)
  }

  const isCorrect = checked && userAnswer === correctTotal
  const isWrong = checked && userAnswer && userAnswer !== correctTotal

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calculator className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 5.1B – What&apos;s My Total?</h2>
        </div>
        <p className="text-gray-600">Calculate the total price (item + tax) for each item</p>
        <div className="mt-2 text-sm text-gray-500">Item {currentItem + 1} of {ITEMS.length}</div>
      </div>

      {attempts > 0 && !isCorrect && !revealed && (
        <div className="bg-gray-100 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">Attempts: {attempts}/3</span>
          {attempts >= 3 && (
            <button onClick={handleReveal} className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium">
              <Eye className="w-4 h-4" /> Reveal Answers
            </button>
          )}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{item.emoji}</div>
          <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>
        </div>

        <div className="bg-forest-50 border border-forest-200 rounded-lg p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Item Price:</span>
              <span className="font-semibold text-forest-800">${item.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Sales Tax (6.25%):</span>
              <span className="font-semibold text-forest-800">${item.tax.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-900 mb-2">
            What is the total price (item + tax)?
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">$</span>
            <input type="text" value={userAnswer} onChange={(e) => setAnswers({ ...answers, [item.id]: e.target.value })}
              disabled={revealed}
              placeholder="0.00"
              className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                isCorrect ? 'border-green-400 bg-green-50' :
                isWrong ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            {isWrong && <XCircle className="w-5 h-5 text-red-500" />}
          </div>
          {isWrong && !revealed && (
            <p className="text-sm text-amber-600 mt-2">💡 Total = Price + Tax = ${item.price.toFixed(2)} + ${item.tax.toFixed(2)} = ${correctTotal}</p>
          )}
        </div>
      </div>

      {checked && isCorrect && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Correct!</strong> The total price is ${correctTotal}!</p>
        </div>
      )}

      {revealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800"><strong>📚 Learning moment!</strong> Remember: Total Price = Item Price + Sales Tax!</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!((isCorrect && checked) || revealed) && (
          <>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheck}
              disabled={!userAnswer}
              className={`btn-primary px-6 py-3 ${!userAnswer ? 'opacity-50 cursor-not-allowed' : ''}`}>
              Check Answer
            </motion.button>
            {checked && !isCorrect && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleTryAgain} className="btn-outline px-6 py-3 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Try Again
              </motion.button>
            )}
          </>
        )}
        {((isCorrect && checked) || revealed) && (
          <>
            {currentItem < ITEMS.length - 1 ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { setCurrentItem(prev => prev + 1); setChecked(false); setAttempts(0) }}
                className="btn-primary px-8 py-3">
                Next Item <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => onComplete({ activity_51b_attempts: attempts, activity_51b_revealed: revealed })}
                className="btn-primary px-8 py-3">
                Continue <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            )}
          </>
        )}
      </div>
    </div>
  )
}


