'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Receipt, CheckCircle2, XCircle, Eye, RotateCcw, Calculator } from 'lucide-react'

interface Props {
  cart: { name: string; price: number; quantity: number; emoji?: string }[]
  onComplete: (data: Record<string, unknown>) => void
}

const TAX_RATE = 0.0625

export default function Activity52B({ cart, onComplete }: Props) {
  const [answers, setAnswers] = useState({ subtotal: '', tax: '', total: '' })
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const subtotalBeforeTax = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const taxAmount = subtotalBeforeTax * TAX_RATE
  const grandTotal = subtotalBeforeTax + taxAmount

  const correctAnswers = {
    subtotal: subtotalBeforeTax.toFixed(2),
    tax: taxAmount.toFixed(2),
    total: grandTotal.toFixed(2)
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
    if (newAnswers.subtotal === correctAnswers.subtotal) newAnswers.subtotal = ''
    if (newAnswers.tax === correctAnswers.tax) newAnswers.tax = ''
    if (newAnswers.total === correctAnswers.total) newAnswers.total = ''
    setAnswers(newAnswers)
    setChecked(false)
  }

  const allCorrect = Object.entries(correctAnswers).every(([key, val]) => answers[key as keyof typeof answers] === val)
  const allAnswered = answers.subtotal && answers.tax && answers.total

  const getResult = (key: string) => {
    if (!checked || revealed) return null
    return answers[key as keyof typeof answers] === correctAnswers[key as keyof typeof correctAnswers] ? 'correct' : 'incorrect'
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Receipt className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 5.2B – Auto-Tax Receipt</h2>
        </div>
        <p className="text-gray-600">Fill in the missing parts of your receipt</p>
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

      <div className="bg-white border-2 border-gray-300 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">RECEIPT</h3>
          <p className="text-sm text-gray-500">Thank you for shopping!</p>
        </div>

        <div className="space-y-3 mb-6">
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between border-b border-gray-200 pb-2">
              <div className="flex items-center gap-2">
                {item.emoji && <span className="text-xl">{item.emoji}</span>}
                <span className="text-gray-900">{item.name} × {item.quantity}</span>
              </div>
              <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3 border-t-2 border-gray-300 pt-4">
          <div className="flex justify-between">
            <span className="text-gray-700">Subtotal before tax:</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={answers.subtotal} onChange={(e) => setAnswers({ ...answers, subtotal: e.target.value })}
                disabled={revealed}
                className={`w-24 px-2 py-1 border-2 rounded text-right focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  getResult('subtotal') === 'correct' ? 'border-green-400 bg-green-50' :
                  getResult('subtotal') === 'incorrect' ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {getResult('subtotal') === 'correct' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              {getResult('subtotal') === 'incorrect' && <XCircle className="w-4 h-4 text-red-500" />}
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-700">Sales Tax (6.25%):</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={answers.tax} onChange={(e) => setAnswers({ ...answers, tax: e.target.value })}
                disabled={revealed}
                className={`w-24 px-2 py-1 border-2 rounded text-right focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  getResult('tax') === 'correct' ? 'border-green-400 bg-green-50' :
                  getResult('tax') === 'incorrect' ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {getResult('tax') === 'correct' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              {getResult('tax') === 'incorrect' && <XCircle className="w-4 h-4 text-red-500" />}
            </div>
          </div>

          <div className="flex justify-between font-bold text-lg border-t-2 border-gray-300 pt-3">
            <span className="text-gray-900">Grand Total:</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={answers.total} onChange={(e) => setAnswers({ ...answers, total: e.target.value })}
                disabled={revealed}
                className={`w-24 px-2 py-1 border-2 rounded text-right focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  getResult('total') === 'correct' ? 'border-green-400 bg-green-50' :
                  getResult('total') === 'incorrect' ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {getResult('total') === 'correct' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
              {getResult('total') === 'incorrect' && <XCircle className="w-4 h-4 text-red-500" />}
            </div>
          </div>
        </div>
      </div>

      {getResult('tax') === 'incorrect' && !revealed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800 text-sm">💡 Remember: tax = subtotal × 0.0625 in Texas</p>
        </div>
      )}

      {checked && allCorrect && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Perfect!</strong> You filled in the receipt correctly!</p>
        </div>
      )}

      {revealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800"><strong>📚 Learning moment!</strong> Review the correct answers above. Remember: Tax = Subtotal × 0.0625, Total = Subtotal + Tax!</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!((allCorrect && checked) || revealed) && (
          <>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheck}
              disabled={!allAnswered}
              className={`btn-primary px-6 py-3 ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}>
              Check Receipt
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
            onClick={() => onComplete({ activity_52b_attempts: attempts, activity_52b_revealed: revealed })}
            className="btn-primary px-8 py-3">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

