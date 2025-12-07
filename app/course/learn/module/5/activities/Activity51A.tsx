'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calculator, CheckCircle2, XCircle, Eye, RotateCcw, Lightbulb } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const ITEMS = [
  { id: 'teddy', name: 'Teddy Bear', price: 16.00, tax: 1.00, emoji: '🧸' },
  { id: 'basketball', name: 'Basketball', price: 15.00, tax: 0.94, emoji: '🏀' },
  { id: 'cotton', name: 'Cotton Candy', price: 5.00, tax: 0.31, emoji: '🍭' },
  { id: 'soda', name: 'Soda', price: 2.00, tax: 0.13, emoji: '🥤' },
  { id: 'chips', name: 'Chips', price: 3.00, tax: 0.19, emoji: '🍟' },
]

const TAX_RATE = 0.0625 // 6.25%

export default function Activity51A({ onComplete }: Props) {
  const [currentItem, setCurrentItem] = useState(0)
  const [answers, setAnswers] = useState<Record<string, { price: string; multiplication: string; tax: string }>>({})
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const item = ITEMS[currentItem]
  const itemAnswers = answers[item.id] || { price: '', multiplication: '', tax: '' }
  const correctMultiplication = (item.price * TAX_RATE).toFixed(4)
  const correctTax = item.tax.toFixed(2)

  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    setChecked(true)
  }

  const handleReveal = () => {
    setRevealed(true)
    const newAnswers: Record<string, { price: string; multiplication: string; tax: string }> = {}
    ITEMS.forEach(i => {
      newAnswers[i.id] = {
        price: i.price.toFixed(2),
        multiplication: (i.price * TAX_RATE).toFixed(4),
        tax: i.tax.toFixed(2)
      }
    })
    setAnswers(newAnswers)
    setChecked(true)
  }

  const handleTryAgain = () => {
    const newAnswers = { ...answers }
    const current = newAnswers[item.id]
    if (current) {
      // Keep only correct answers
      if (current.price === item.price.toFixed(2)) {
        // Keep price
      } else {
        newAnswers[item.id] = { ...current, price: '' }
      }
      if (current.multiplication === correctMultiplication) {
        // Keep multiplication
      } else {
        newAnswers[item.id] = { ...newAnswers[item.id], multiplication: '' }
      }
      if (current.tax === correctTax) {
        // Keep tax
      } else {
        newAnswers[item.id] = { ...newAnswers[item.id], tax: '' }
      }
    }
    setAnswers(newAnswers)
    setChecked(false)
  }

  const isPriceCorrect = checked && itemAnswers.price === item.price.toFixed(2)
  const isPriceWrong = checked && itemAnswers.price && itemAnswers.price !== item.price.toFixed(2)
  const isMultCorrect = checked && itemAnswers.multiplication === correctMultiplication
  const isMultWrong = checked && itemAnswers.multiplication && itemAnswers.multiplication !== correctMultiplication
  const isTaxCorrect = checked && itemAnswers.tax === correctTax
  const isTaxWrong = checked && itemAnswers.tax && itemAnswers.tax !== correctTax

  const allStepsCorrect = isPriceCorrect && isMultCorrect && isTaxCorrect
  const allStepsAnswered = itemAnswers.price && itemAnswers.multiplication && itemAnswers.tax

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calculator className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 5.1A – Guided Tax Calculator</h2>
        </div>
        <p className="text-gray-600">Calculate sales tax step-by-step for each item</p>
        <div className="mt-2 text-sm text-gray-500">Item {currentItem + 1} of {ITEMS.length}</div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Texas Sales Tax Rate:</strong> 6.25% = 0.0625
        </p>
      </div>

      {attempts > 0 && !allStepsCorrect && !revealed && (
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

        <div className="space-y-6">
          <div>
            <label className="block font-semibold text-gray-900 mb-2">Step 1: Type the price of the item</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={itemAnswers.price} onChange={(e) => setAnswers({ ...answers, [item.id]: { ...itemAnswers, price: e.target.value } })}
                disabled={revealed}
                placeholder="0.00"
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  isPriceCorrect ? 'border-green-400 bg-green-50' :
                  isPriceWrong ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {isPriceCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {isPriceWrong && <XCircle className="w-5 h-5 text-red-500" />}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Step 2: Multiply by the tax rate: 6.25% → 0.0625
            </label>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2">
              <p className="text-amber-800 text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <strong>Hint:</strong> Write 6.25% as 0.0625 (move the decimal point two places to the left)
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-2">Price × 0.0625 = ?</p>
            <input type="text" value={itemAnswers.multiplication} onChange={(e) => setAnswers({ ...answers, [item.id]: { ...itemAnswers, multiplication: e.target.value } })}
              disabled={revealed}
              placeholder="0.0000"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                isMultCorrect ? 'border-green-400 bg-green-50' :
                isMultWrong ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {isMultCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 mt-2" />}
            {isMultWrong && !revealed && (
              <p className="text-sm text-amber-600 mt-2">💡 {item.price.toFixed(2)} × 0.0625 = {correctMultiplication}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Step 3: Round to two decimal places to get the tax amount
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={itemAnswers.tax} onChange={(e) => setAnswers({ ...answers, [item.id]: { ...itemAnswers, tax: e.target.value } })}
                disabled={revealed}
                placeholder="0.00"
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  isTaxCorrect ? 'border-green-400 bg-green-50' :
                  isTaxWrong ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {isTaxCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {isTaxWrong && <XCircle className="w-5 h-5 text-red-500" />}
            </div>
            {isMultCorrect && isTaxWrong && !revealed && (
              <p className="text-sm text-amber-600 mt-2">💡 Great multiplication! Now remember we round to two decimal places because dollars and cents only have two decimal places.</p>
            )}
            {isTaxWrong && !revealed && !isMultCorrect && (
              <p className="text-sm text-amber-600 mt-2">💡 Round {correctMultiplication} to two decimal places: ${correctTax}</p>
            )}
          </div>
        </div>
      </div>

      {checked && allStepsCorrect && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Perfect!</strong> You calculated the tax correctly for {item.name}!</p>
        </div>
      )}

      {revealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800"><strong>📚 Learning moment!</strong> Review the correct answers above. Remember: Tax = Price × 0.0625, then round to 2 decimals!</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!((allStepsCorrect && checked) || revealed) && (
          <>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheck}
              disabled={!allStepsAnswered}
              className={`btn-primary px-6 py-3 ${!allStepsAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}>
              Check Answers
            </motion.button>
            {checked && !allStepsCorrect && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleTryAgain} className="btn-outline px-6 py-3 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Try Again
              </motion.button>
            )}
          </>
        )}
        {((allStepsCorrect && checked) || revealed) && (
          <>
            {currentItem < ITEMS.length - 1 ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { setCurrentItem(prev => prev + 1); setChecked(false); setAttempts(0) }}
                className="btn-primary px-8 py-3">
                Next Item <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => onComplete({ taxData: answers, activity_51a_attempts: attempts, activity_51a_revealed: revealed })}
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

