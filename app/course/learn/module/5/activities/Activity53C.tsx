'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Scale, CheckCircle2, XCircle, Eye, RotateCcw } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const DEALS = [
  { id: 1, storeA: { price: 30, discount: 10 }, storeB: { price: 28, discount: 0 }, correct: 'B', explanation: 'Store A: $30 - 10% = $27. Store B: $28. Store B is cheaper.' },
  { id: 2, storeA: { price: 50, discount: 20 }, storeB: { price: 45, discount: 0 }, correct: 'A', explanation: 'Store A: $50 - 20% = $40. Store B: $45. Store A is cheaper.' },
  { id: 3, storeA: { price: 40, discount: 15 }, storeB: { price: 35, discount: 5 }, correct: 'A', explanation: 'Store A: $40 - 15% = $34. Store B: $35 - 5% = $33.25. Store A is cheaper.' },
]

export default function Activity53C({ onComplete }: Props) {
  const [currentDeal, setCurrentDeal] = useState(0)
  const [answers, setAnswers] = useState<Record<number, { choice: string; explanation: string }>>({})
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const deal = DEALS[currentDeal]
  const dealAnswers = answers[deal.id] || { choice: '', explanation: '' }
  const storeAPrice = deal.storeA.price * (1 - deal.storeA.discount / 100)
  const storeBPrice = deal.storeB.price * (1 - deal.storeB.discount / 100)
  const isCorrect = checked && dealAnswers.choice === deal.correct

  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    setChecked(true)
  }

  const handleReveal = () => {
    setRevealed(true)
    const newAnswers: Record<number, { choice: string; explanation: string }> = {}
    DEALS.forEach(d => {
      newAnswers[d.id] = { choice: d.correct, explanation: d.explanation }
    })
    setAnswers(newAnswers)
    setChecked(true)
  }

  const handleTryAgain = () => {
    const newAnswers = { ...answers }
    if (newAnswers[deal.id]?.choice === deal.correct) {
      // Keep correct choice
    } else {
      delete newAnswers[deal.id]
    }
    setAnswers(newAnswers)
    setChecked(false)
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Scale className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 5.3C – Better Deal?</h2>
        </div>
        <p className="text-gray-600">Compare two deals and choose the better one</p>
        <div className="mt-2 text-sm text-gray-500">Deal {currentDeal + 1} of {DEALS.length}</div>
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

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className={`p-6 rounded-xl border-2 ${dealAnswers.choice === 'A' ? 'border-forest-400 bg-forest-50' : 'border-gray-200 bg-white'}`}>
          <h3 className="font-bold text-gray-900 mb-4">Store A</h3>
          <div className="space-y-2">
            <p className="text-gray-700">Price: ${deal.storeA.price}</p>
            {deal.storeA.discount > 0 && (
              <p className="text-red-600 font-semibold">{deal.storeA.discount}% OFF</p>
            )}
            <div className="bg-gray-50 rounded-lg p-3 mt-3">
              <p className="text-sm text-gray-600">Final Price:</p>
              <p className="text-xl font-bold text-forest-600">${storeAPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border-2 ${dealAnswers.choice === 'B' ? 'border-forest-400 bg-forest-50' : 'border-gray-200 bg-white'}`}>
          <h3 className="font-bold text-gray-900 mb-4">Store B</h3>
          <div className="space-y-2">
            <p className="text-gray-700">Price: ${deal.storeB.price}</p>
            {deal.storeB.discount > 0 && (
              <p className="text-red-600 font-semibold">{deal.storeB.discount}% OFF</p>
            )}
            <div className="bg-gray-50 rounded-lg p-3 mt-3">
              <p className="text-sm text-gray-600">Final Price:</p>
              <p className="text-xl font-bold text-forest-600">${storeBPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <label className="block font-semibold text-gray-900 mb-3">Which deal is cheaper overall?</label>
        <div className="flex gap-3 mb-4">
          {['A', 'B'].map(option => (
            <button key={option} onClick={() => !revealed && setAnswers({ ...answers, [deal.id]: { ...dealAnswers, choice: option } })}
              disabled={revealed}
              className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                dealAnswers.choice === option
                  ? isCorrect ? 'border-green-400 bg-green-50 text-green-700' :
                    checked ? 'border-red-400 bg-red-50 text-red-700' :
                    'border-forest-400 bg-forest-50 text-forest-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
              Store {option}
            </button>
          ))}
        </div>

        <div>
          <label className="block font-semibold text-gray-900 mb-2">Explain why (optional):</label>
          <textarea value={dealAnswers.explanation} onChange={(e) => setAnswers({ ...answers, [deal.id]: { ...dealAnswers, explanation: e.target.value } })}
            disabled={revealed}
            placeholder="Store A costs $X after discount, Store B costs $Y..."
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
        </div>
      </div>

      {checked && isCorrect && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Correct!</strong> {deal.explanation}</p>
        </div>
      )}

      {revealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800"><strong>📚 Explanation:</strong> {deal.explanation}</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!((isCorrect && checked) || revealed) && (
          <>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheck}
              disabled={!dealAnswers.choice}
              className={`btn-primary px-6 py-3 ${!dealAnswers.choice ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
            {currentDeal < DEALS.length - 1 ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { setCurrentDeal(prev => prev + 1); setChecked(false); setAttempts(0) }}
                className="btn-primary px-8 py-3">
                Next Deal <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => onComplete({ activity_53c_attempts: attempts, activity_53c_revealed: revealed })}
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


