'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Tag, CheckCircle2, XCircle, Eye, RotateCcw } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const SCENARIOS = [
  { id: 1, original: 20, discount: 10, discountAmount: 2, salePrice: 18 },
  { id: 2, original: 50, discount: 25, discountAmount: 12.50, salePrice: 37.50 },
  { id: 3, original: 80, discount: 50, discountAmount: 40, salePrice: 40 },
  { id: 4, original: 30, discount: 15, discountAmount: 4.50, salePrice: 25.50 },
  { id: 5, original: 100, discount: 20, discountAmount: 20, salePrice: 80 },
]

export default function Activity53A({ onComplete }: Props) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [answers, setAnswers] = useState<Record<number, { discount: string; salePrice: string }>>({})
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const scenario = SCENARIOS[currentScenario]
  const scenarioAnswers = answers[scenario.id] || { discount: '', salePrice: '' }
  const correctDiscount = scenario.discountAmount.toFixed(2)
  const correctSalePrice = scenario.salePrice.toFixed(2)

  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    setChecked(true)
  }

  const handleReveal = () => {
    setRevealed(true)
    const newAnswers: Record<number, { discount: string; salePrice: string }> = {}
    SCENARIOS.forEach(s => {
      newAnswers[s.id] = {
        discount: s.discountAmount.toFixed(2),
        salePrice: s.salePrice.toFixed(2)
      }
    })
    setAnswers(newAnswers)
    setChecked(true)
  }

  const handleTryAgain = () => {
    const newAnswers = { ...answers }
    const current = newAnswers[scenario.id]
    if (current) {
      if (current.discount === correctDiscount) {
        // Keep discount
      } else {
        newAnswers[scenario.id] = { ...current, discount: '' }
      }
      if (current.salePrice === correctSalePrice) {
        // Keep salePrice
      } else {
        newAnswers[scenario.id] = { ...newAnswers[scenario.id], salePrice: '' }
      }
    }
    setAnswers(newAnswers)
    setChecked(false)
  }

  const isDiscountCorrect = checked && scenarioAnswers.discount === correctDiscount
  const isDiscountWrong = checked && scenarioAnswers.discount && scenarioAnswers.discount !== correctDiscount
  const isSalePriceCorrect = checked && scenarioAnswers.salePrice === correctSalePrice
  const isSalePriceWrong = checked && scenarioAnswers.salePrice && scenarioAnswers.salePrice !== correctSalePrice

  const allCorrect = isDiscountCorrect && isSalePriceCorrect
  const allAnswered = scenarioAnswers.discount && scenarioAnswers.salePrice

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Tag className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 5.3A – Sale Sign Calculator</h2>
        </div>
        <p className="text-gray-600">Calculate discount amounts and sale prices</p>
        <div className="mt-2 text-sm text-gray-500">Scenario {currentScenario + 1} of {SCENARIOS.length}</div>
      </div>

      {attempts > 0 && !allCorrect && !revealed && (
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
          <div className="bg-red-500 text-white rounded-xl p-6 mb-4">
            <div className="text-4xl font-bold mb-2">SALE</div>
            <div className="text-2xl">{scenario.discount}% OFF</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">Original Price: ${scenario.original.toFixed(2)}</div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-900 mb-2">Discount Amount (how many dollars taken off):</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={scenarioAnswers.discount} onChange={(e) => setAnswers({ ...answers, [scenario.id]: { ...scenarioAnswers, discount: e.target.value } })}
                disabled={revealed}
                placeholder="0.00"
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  isDiscountCorrect ? 'border-green-400 bg-green-50' :
                  isDiscountWrong ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {isDiscountCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {isDiscountWrong && <XCircle className="w-5 h-5 text-red-500" />}
            </div>
            {isDiscountWrong && !revealed && (
              <p className="text-sm text-amber-600 mt-2">💡 {scenario.discount}% of ${scenario.original} = ${scenario.original} × {scenario.discount / 100} = ${correctDiscount}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-gray-900 mb-2">Sale Price (original - discount):</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={scenarioAnswers.salePrice} onChange={(e) => setAnswers({ ...answers, [scenario.id]: { ...scenarioAnswers, salePrice: e.target.value } })}
                disabled={revealed}
                placeholder="0.00"
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  isSalePriceCorrect ? 'border-green-400 bg-green-50' :
                  isSalePriceWrong ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {isSalePriceCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {isSalePriceWrong && <XCircle className="w-5 h-5 text-red-500" />}
            </div>
            {isSalePriceWrong && !revealed && (
              <p className="text-sm text-amber-600 mt-2">💡 Subtract the discount from the original price: ${scenario.original} - ${correctDiscount} = ${correctSalePrice}</p>
            )}
          </div>
        </div>
      </div>

      {checked && allCorrect && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Perfect!</strong> You calculated the discount and sale price correctly!</p>
        </div>
      )}

      {revealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800"><strong>📚 Learning moment!</strong> Review the correct answers above. Remember: Discount = Original × (Percent ÷ 100), Sale Price = Original - Discount!</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!((allCorrect && checked) || revealed) && (
          <>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheck}
              disabled={!allAnswered}
              className={`btn-primary px-6 py-3 ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}>
              Check Answers
            </motion.button>
            {checked && !allCorrect && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleTryAgain} className="btn-outline px-6 py-3 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Try Again
              </motion.button>
            )}
          </>
        )}
        {((allCorrect && checked) || revealed) && (
          <>
            {currentScenario < SCENARIOS.length - 1 ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { setCurrentScenario(prev => prev + 1); setChecked(false); setAttempts(0) }}
                className="btn-primary px-8 py-3">
                Next Scenario <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => onComplete({ activity_53a_attempts: attempts, activity_53a_revealed: revealed })}
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


