'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calculator, CheckCircle2, XCircle, Eye, RotateCcw, Tag } from 'lucide-react'

interface Props {
  shoppingList: { name: string; price: number; isNeed: boolean; discount?: number; emoji?: string; quantity: number }[]
  onComplete: (data: Record<string, unknown>) => void
}

const TAX_RATE = 0.0625

export default function Activity62B({ shoppingList, onComplete }: Props) {
  const [discountedPrices, setDiscountedPrices] = useState<Record<string, string>>({})
  const [answers, setAnswers] = useState({ subtotalAfterDiscount: '', tax: '', total: '', underBudget: '' })
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)

  // Apply random discounts to some items
  const itemsWithDiscounts = shoppingList.map(item => ({
    ...item,
    discount: item.discount || (Math.random() > 0.6 ? [10, 15, 20, 25][Math.floor(Math.random() * 4)] : 0)
  }))

  const calculateSubtotalAfterDiscount = () => {
    return itemsWithDiscounts.reduce((sum, item) => {
      const discount = item.discount || 0
      const priceAfterDiscount = item.price * (1 - discount / 100)
      const userPrice = discountedPrices[item.name] ? parseFloat(discountedPrices[item.name]) : priceAfterDiscount
      return sum + (userPrice * item.quantity)
    }, 0)
  }

  const subtotalAfterDiscount = calculateSubtotalAfterDiscount()
  const taxAmount = subtotalAfterDiscount * TAX_RATE
  const finalTotal = subtotalAfterDiscount + taxAmount
  const BUDGET = 50
  const isUnderBudget = finalTotal <= BUDGET

  const correctAnswers = {
    subtotalAfterDiscount: subtotalAfterDiscount.toFixed(2),
    tax: taxAmount.toFixed(2),
    total: finalTotal.toFixed(2),
    underBudget: isUnderBudget ? 'Yes' : 'No'
  }

  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    setChecked(true)
  }

  const handleReveal = () => {
    setRevealed(true)
    setAnswers(correctAnswers)
    setChecked(true)
  }

  const handleTryAgain = () => {
    const newAnswers = { ...answers }
    if (newAnswers.subtotalAfterDiscount === correctAnswers.subtotalAfterDiscount) newAnswers.subtotalAfterDiscount = ''
    if (newAnswers.tax === correctAnswers.tax) newAnswers.tax = ''
    if (newAnswers.total === correctAnswers.total) newAnswers.total = ''
    if (newAnswers.underBudget === correctAnswers.underBudget) newAnswers.underBudget = ''
    setAnswers(newAnswers)
    setChecked(false)
  }

  const allCorrect = Object.entries(correctAnswers).every(([key, val]) => answers[key as keyof typeof answers] === val)
  const allAnswered = answers.subtotalAfterDiscount && answers.tax && answers.total && answers.underBudget

  const getResult = (key: string) => {
    if (!checked || revealed) return null
    return answers[key as keyof typeof answers] === correctAnswers[key as keyof typeof correctAnswers] ? 'correct' : 'incorrect'
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calculator className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 6.2B – Apply Tax + Discounts</h2>
        </div>
        <p className="text-gray-600">Calculate discounted prices, tax, and final total</p>
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

      <div className="space-y-4 mb-6">
        {itemsWithDiscounts.map((item, idx) => {
          const discount = item.discount || 0
          const priceAfterDiscount = item.price * (1 - discount / 100)
          const userPrice = discountedPrices[item.name] ? parseFloat(discountedPrices[item.name]) : priceAfterDiscount
          const isCorrect = checked && Math.abs(userPrice - priceAfterDiscount) < 0.01

          return (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {item.emoji && <span className="text-2xl">{item.emoji}</span>}
                  <div>
                    <div className="font-medium text-gray-900">{item.name} × {item.quantity}</div>
                    <div className="text-sm text-gray-600">Original: ${item.price.toFixed(2)} each</div>
                  </div>
                </div>
                {discount > 0 && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold">
                    {discount}% OFF
                  </div>
                )}
              </div>
              {discount > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price after {discount}% discount:</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <input type="text" value={discountedPrices[item.name] || priceAfterDiscount.toFixed(2)}
                      onChange={(e) => setDiscountedPrices({ ...discountedPrices, [item.name]: e.target.value })}
                      disabled={revealed}
                      className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                        isCorrect ? 'border-green-400 bg-green-50' : 'border-gray-300'
                      }`}
                    />
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  </div>
                  {!isCorrect && checked && !revealed && (
                    <p className="text-sm text-amber-600 mt-2">💡 {discount}% of ${item.price} = ${(item.price * discount / 100).toFixed(2)} off. ${item.price} - ${(item.price * discount / 100).toFixed(2)} = ${priceAfterDiscount.toFixed(2)}</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="bg-white border-2 border-gray-300 rounded-xl p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Calculate Your Final Total</h3>
        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-900 mb-2">Subtotal after discounts:</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={answers.subtotalAfterDiscount} onChange={(e) => setAnswers({ ...answers, subtotalAfterDiscount: e.target.value })}
                disabled={revealed}
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  getResult('subtotalAfterDiscount') === 'correct' ? 'border-green-400 bg-green-50' :
                  getResult('subtotalAfterDiscount') === 'incorrect' ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {getResult('subtotalAfterDiscount') === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {getResult('subtotalAfterDiscount') === 'incorrect' && <XCircle className="w-5 h-5 text-red-500" />}
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-900 mb-2">Sales Tax (6.25%):</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={answers.tax} onChange={(e) => setAnswers({ ...answers, tax: e.target.value })}
                disabled={revealed}
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  getResult('tax') === 'correct' ? 'border-green-400 bg-green-50' :
                  getResult('tax') === 'incorrect' ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {getResult('tax') === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {getResult('tax') === 'incorrect' && <XCircle className="w-5 h-5 text-red-500" />}
            </div>
            {getResult('tax') === 'incorrect' && !revealed && (
              <p className="text-sm text-amber-600 mt-2">💡 Tax = Subtotal × 0.0625</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-900 mb-2">Final Total:</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={answers.total} onChange={(e) => setAnswers({ ...answers, total: e.target.value })}
                disabled={revealed}
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  getResult('total') === 'correct' ? 'border-green-400 bg-green-50' :
                  getResult('total') === 'incorrect' ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {getResult('total') === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {getResult('total') === 'incorrect' && <XCircle className="w-5 h-5 text-red-500" />}
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-900 mb-2">Did you stay under your $50 budget?</label>
            <div className="flex gap-2">
              {['Yes', 'No'].map(option => (
                <button key={option} onClick={() => !revealed && setAnswers({ ...answers, underBudget: option })}
                  disabled={revealed}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    answers.underBudget === option
                      ? getResult('underBudget') === 'correct' ? 'border-green-400 bg-green-50 text-green-700' :
                        getResult('underBudget') === 'incorrect' ? 'border-red-400 bg-red-50 text-red-700' :
                        'border-forest-400 bg-forest-50 text-forest-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {checked && allCorrect && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Perfect!</strong> You calculated everything correctly!</p>
        </div>
      )}

      {revealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800"><strong>📚 Learning moment!</strong> Review the correct answers above. Remember: Discount first, then tax on the discounted price!</p>
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
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ activity_62b_attempts: attempts, activity_62b_revealed: revealed })}
            className="btn-primary px-8 py-3">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}


