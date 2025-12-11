'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Tag, CheckCircle2, XCircle, Eye, RotateCcw } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const ITEMS = [
  { id: 1, name: 'Backpack', price: 40, discount: 25, correct: 30, options: [35, 30, 20] },
  { id: 2, name: 'Shoes', price: 60, discount: 20, correct: 48, options: [50, 48, 40] },
  { id: 3, name: 'Jacket', price: 80, discount: 15, correct: 68, options: [70, 68, 65] },
]

export default function Activity53B({ onComplete }: Props) {
  const [currentItem, setCurrentItem] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const item = ITEMS[currentItem]
  const userAnswer = answers[item.id]
  const isCorrect = checked && userAnswer === item.correct
  const isWrong = checked && userAnswer !== undefined && userAnswer !== item.correct

  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    setChecked(true)
  }

  const handleReveal = () => {
    setRevealed(true)
    const newAnswers: Record<number, number> = {}
    ITEMS.forEach(i => { newAnswers[i.id] = i.correct })
    setAnswers(newAnswers)
    setChecked(true)
  }

  const handleTryAgain = () => {
    if (answers[item.id] === item.correct) {
      // Keep correct answer
    } else {
      const newAnswers = { ...answers }
      delete newAnswers[item.id]
      setAnswers(newAnswers)
    }
    setChecked(false)
  }

  const discountAmount = item.price * (item.discount / 100)
  const explanation = `${item.discount}% of ${item.price} is ${discountAmount.toFixed(0)}. ${item.price} - ${discountAmount.toFixed(0)} = ${item.correct}, so the new price is $${item.correct}.`

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Tag className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 5.3B – Match the Correct Tag</h2>
        </div>
        <p className="text-gray-600">Choose the correct sale price tag</p>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h3>
          <div className="text-3xl text-gray-700 mb-4">Original: ${item.price}</div>
          <div className="bg-red-500 text-white rounded-xl p-4 inline-block">
            <div className="text-2xl font-bold">{item.discount}% OFF</div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-gray-900 text-center mb-4">Which sale tag is correct?</p>
          {item.options.map((option, idx) => {
            const isSelected = userAnswer === option
            const isThisCorrect = option === item.correct
            return (
              <motion.button key={idx} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => !revealed && setAnswers({ ...answers, [item.id]: option })}
                disabled={revealed}
                className={`w-full p-4 rounded-xl border-2 text-center transition-all ${
                  isSelected
                    ? isCorrect ? 'border-green-400 bg-green-50' :
                      isWrong ? 'border-red-400 bg-red-50' :
                      'border-forest-400 bg-forest-50'
                    : 'border-gray-200 hover:border-forest-300'
                }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">Now ${option}</span>
                  {isSelected && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {isSelected && isWrong && <XCircle className="w-5 h-5 text-red-500" />}
                  {revealed && isThisCorrect && !isSelected && <span className="text-xs text-green-600">✓ Correct</span>}
                </div>
              </motion.button>
            )
          })}
        </div>

        {(revealed || (checked && isCorrect)) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm"><strong>Explanation:</strong> {explanation}</p>
          </motion.div>
        )}
      </div>

      {checked && isCorrect && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Correct!</strong> You chose the right sale price!</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!((isCorrect && checked) || revealed) && (
          <>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheck}
              disabled={userAnswer === undefined}
              className={`btn-primary px-6 py-3 ${userAnswer === undefined ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
                onClick={() => onComplete({ activity_53b_attempts: attempts, activity_53b_revealed: revealed })}
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


