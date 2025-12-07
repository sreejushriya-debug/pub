'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calculator, CheckCircle2, XCircle, Eye, RotateCcw, Lightbulb } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const SCENARIOS = [
  { id: 1, item: 'Backpack', price: 40, discount: 20, taxRate: 0.0625 },
  { id: 2, item: 'Shoes', price: 60, discount: 15, taxRate: 0.0625 },
  { id: 3, item: 'Laptop', price: 500, discount: 10, taxRate: 0.0625 },
]

export default function Activity54A({ onComplete }: Props) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [answers, setAnswers] = useState<Record<number, { discount: string; afterDiscount: string; tax: string; total: string }>>({})
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const scenario = SCENARIOS[currentScenario]
  const scenarioAnswers = answers[scenario.id] || { discount: '', afterDiscount: '', tax: '', total: '' }
  const discountAmount = scenario.price * (scenario.discount / 100)
  const priceAfterDiscount = scenario.price - discountAmount
  const taxAmount = priceAfterDiscount * scenario.taxRate
  const finalTotal = priceAfterDiscount + taxAmount

  const correctAnswers = {
    discount: discountAmount.toFixed(2),
    afterDiscount: priceAfterDiscount.toFixed(2),
    tax: taxAmount.toFixed(2),
    total: finalTotal.toFixed(2)
  }

  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    setChecked(true)
  }

  const handleReveal = () => {
    setRevealed(true)
    const newAnswers: Record<number, { discount: string; afterDiscount: string; tax: string; total: string }> = {}
    SCENARIOS.forEach(s => {
      const disc = s.price * (s.discount / 100)
      const after = s.price - disc
      const tax = after * s.taxRate
      newAnswers[s.id] = {
        discount: disc.toFixed(2),
        afterDiscount: after.toFixed(2),
        tax: tax.toFixed(2),
        total: (after + tax).toFixed(2)
      }
    })
    setAnswers(newAnswers)
    setChecked(true)
  }

  const handleTryAgain = () => {
    const newAnswers = { ...answers }
    const current = newAnswers[scenario.id]
    if (current) {
      Object.keys(correctAnswers).forEach(key => {
        if (current[key as keyof typeof current] === correctAnswers[key as keyof typeof correctAnswers]) {
          // Keep correct
        } else {
          newAnswers[scenario.id] = { ...newAnswers[scenario.id], [key]: '' }
        }
      })
    }
    setAnswers(newAnswers)
    setChecked(false)
  }

  const allCorrect = Object.keys(correctAnswers).every(key => 
    scenarioAnswers[key as keyof typeof scenarioAnswers] === correctAnswers[key as keyof typeof correctAnswers]
  )
  const allAnswered = Object.values(scenarioAnswers).every(v => v)

  const getResult = (key: string) => {
    if (!checked || revealed) return null
    return scenarioAnswers[key as keyof typeof scenarioAnswers] === correctAnswers[key as keyof typeof correctAnswers] ? 'correct' : 'incorrect'
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calculator className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 5.4A – Final Price Calculator</h2>
        </div>
        <p className="text-gray-600">Calculate discount first, then tax on the discounted price</p>
        <div className="mt-2 text-sm text-gray-500">Scenario {currentScenario + 1} of {SCENARIOS.length}</div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-blue-800 text-sm flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          <strong>Important:</strong> Calculate discount first, then tax on the new price, not the original!
        </p>
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
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          A {scenario.item} costs ${scenario.price} and is {scenario.discount}% off. Texas tax is 6.25%. What is your final price?
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-900 mb-2">Step 1: Discount Amount</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={scenarioAnswers.discount} onChange={(e) => setAnswers({ ...answers, [scenario.id]: { ...scenarioAnswers, discount: e.target.value } })}
                disabled={revealed}
                placeholder="0.00"
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  getResult('discount') === 'correct' ? 'border-green-400 bg-green-50' :
                  getResult('discount') === 'incorrect' ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {getResult('discount') === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {getResult('discount') === 'incorrect' && <XCircle className="w-5 h-5 text-red-500" />}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-900 mb-2">Step 2: Price After Discount</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={scenarioAnswers.afterDiscount} onChange={(e) => setAnswers({ ...answers, [scenario.id]: { ...scenarioAnswers, afterDiscount: e.target.value } })}
                disabled={revealed}
                placeholder="0.00"
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  getResult('afterDiscount') === 'correct' ? 'border-green-400 bg-green-50' :
                  getResult('afterDiscount') === 'incorrect' ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {getResult('afterDiscount') === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {getResult('afterDiscount') === 'incorrect' && <XCircle className="w-5 h-5 text-red-500" />}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-900 mb-2">Step 3: Tax on Discounted Price</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={scenarioAnswers.tax} onChange={(e) => setAnswers({ ...answers, [scenario.id]: { ...scenarioAnswers, tax: e.target.value } })}
                disabled={revealed}
                placeholder="0.00"
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  getResult('tax') === 'correct' ? 'border-green-400 bg-green-50' :
                  getResult('tax') === 'incorrect' ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {getResult('tax') === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {getResult('tax') === 'incorrect' && <XCircle className="w-5 h-5 text-red-500" />}
            </div>
            {getResult('tax') === 'incorrect' && !revealed && (
              <p className="text-sm text-amber-600 mt-2">💡 Tax = Price After Discount × 0.0625</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-gray-900 mb-2">Step 4: Final Total</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={scenarioAnswers.total} onChange={(e) => setAnswers({ ...answers, [scenario.id]: { ...scenarioAnswers, total: e.target.value } })}
                disabled={revealed}
                placeholder="0.00"
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  getResult('total') === 'correct' ? 'border-green-400 bg-green-50' :
                  getResult('total') === 'incorrect' ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {getResult('total') === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {getResult('total') === 'incorrect' && <XCircle className="w-5 h-5 text-red-500" />}
            </div>
          </div>
        </div>
      </div>

      {checked && allCorrect && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Perfect!</strong> You calculated the final price correctly!</p>
        </div>
      )}

      {revealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800"><strong>📚 Learning moment!</strong> Always calculate discount first, then tax on the discounted price!</p>
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
                onClick={() => onComplete({ activity_54a_attempts: attempts, activity_54a_revealed: revealed })}
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

