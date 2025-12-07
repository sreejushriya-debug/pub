'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calculator, TrendingUp, TrendingDown, CheckCircle2, XCircle, Lightbulb, Eye } from 'lucide-react'

interface Props {
  supplies: { cups: string[]; fruit: string[]; dispenser: string }
  totalCost: number
  onComplete: (data: Record<string, unknown>) => void
}

export default function Activity41B({ supplies, totalCost, onComplete }: Props) {
  const [price, setPrice] = useState(4.00)
  const [cupsSold, setCupsSold] = useState(100)
  const [answers, setAnswers] = useState({ revenue: '', expenses: '', profit: '', loss: '', challenge: '' })
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const revenue = price * cupsSold
  const expenses = totalCost
  const profit = revenue - expenses
  const isLoss = profit < 0
  // To make $10 more profit: new profit = current profit + 10
  // new profit = new revenue - expenses
  // So: current profit + 10 = new revenue - expenses
  // new revenue = current profit + 10 + expenses = revenue + 10
  // new cups = (revenue + 10) / price
  const challengeAnswer = Math.ceil((revenue + 10) / price)

  const correctAnswers = {
    revenue: revenue.toFixed(2),
    expenses: expenses.toFixed(2),
    profit: profit.toFixed(2),
    loss: isLoss ? 'Yes' : 'No',
    challenge: challengeAnswer.toString()
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

  const allCorrect = Object.entries(correctAnswers).every(([key, val]) => 
    answers[key as keyof typeof answers]?.toString().trim() === val.toString()
  )

  const getResult = (key: string) => {
    if (!checked) return null
    const userAnswer = answers[key as keyof typeof answers]?.toString().trim()
    const correct = correctAnswers[key as keyof typeof correctAnswers]?.toString()
    return userAnswer === correct ? 'correct' : 'incorrect'
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calculator className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 4.1B – Revenue, Expenses & Profit</h2>
        </div>
        <p className="text-gray-600">Calculate your juice stand&apos;s financial results!</p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          How to Complete This Activity:
        </h3>
        <ol className="space-y-2 text-blue-800 text-sm list-decimal list-inside">
          <li><strong>Set your price and sales:</strong> Enter how much you&apos;ll charge per cup and how many cups you sold.</li>
          <li><strong>Review the summary:</strong> The Financial Summary box shows your revenue, expenses, and profit automatically.</li>
          <li><strong>Answer the questions:</strong> Fill in revenue, expenses, profit, and whether you made a loss.</li>
          <li><strong>Solve the challenge:</strong> Calculate how many total cups you&apos;d need to sell to make $10 more profit.</li>
        </ol>
        <div className="mt-4 p-3 bg-white rounded-lg border border-blue-300">
          <p className="text-blue-900 text-sm font-medium mb-1">💡 Key Formulas:</p>
          <ul className="text-blue-800 text-xs space-y-1">
            <li>• <strong>Revenue</strong> = Price per cup × Number of cups sold</li>
            <li>• <strong>Profit</strong> = Revenue - Expenses</li>
            <li>• <strong>For the challenge:</strong> New revenue needed = Current revenue + $10, then divide by price per cup</li>
          </ul>
        </div>
      </div>

      {/* Reminder of expenses */}
      <div className="bg-forest-50 border border-forest-200 rounded-xl p-4 mb-6">
        <p className="text-forest-800"><strong>Your startup expenses:</strong> ${totalCost.toFixed(2)}</p>
        <p className="text-forest-700 text-sm mt-1">This includes your cups, fruit, and dispenser.</p>
      </div>

      {/* Inputs */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price per Cup</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">$</span>
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Cups Sold</label>
          <input type="number" value={cupsSold} onChange={(e) => setCupsSold(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500" />
        </div>
      </div>

      {/* Auto-calculated summary */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Financial Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700">Revenue:</span>
            <span className="font-bold text-green-600">${revenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Expenses:</span>
            <span className="font-bold text-red-600">-${expenses.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-300">
            <span className="font-semibold text-gray-900">Profit/Loss:</span>
            <span className={`font-bold text-lg ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
            </span>
          </div>
        </div>
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

      {/* Questions */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block font-medium text-gray-900 mb-2">
            1. What is your revenue?
            <span className="text-xs text-gray-500 font-normal ml-2">(Total money you made from selling cups)</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">$</span>
            <input type="text" value={answers.revenue} onChange={(e) => setAnswers({ ...answers, revenue: e.target.value })}
              disabled={revealed}
              className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                getResult('revenue') === 'correct' ? 'border-green-400 bg-green-50' :
                getResult('revenue') === 'incorrect' ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {getResult('revenue') === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            {getResult('revenue') === 'incorrect' && <XCircle className="w-5 h-5 text-red-500" />}
          </div>
          {getResult('revenue') === 'incorrect' && !revealed && (
            <p className="text-sm text-amber-600 mt-1">💡 Revenue = price × cups sold</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-gray-900 mb-2">
            2. What are your expenses?
            <span className="text-xs text-gray-500 font-normal ml-2">(Total cost of your supplies from Activity 4.1A)</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">$</span>
            <input type="text" value={answers.expenses} onChange={(e) => setAnswers({ ...answers, expenses: e.target.value })}
              disabled={revealed}
              className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                getResult('expenses') === 'correct' ? 'border-green-400 bg-green-50' :
                getResult('expenses') === 'incorrect' ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {getResult('expenses') === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            {getResult('expenses') === 'incorrect' && <XCircle className="w-5 h-5 text-red-500" />}
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-900 mb-2">
            3. What is your profit?
            <span className="text-xs text-gray-500 font-normal ml-2">(Revenue minus expenses)</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">$</span>
            <input type="text" value={answers.profit} onChange={(e) => setAnswers({ ...answers, profit: e.target.value })}
              disabled={revealed}
              className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                getResult('profit') === 'correct' ? 'border-green-400 bg-green-50' :
                getResult('profit') === 'incorrect' ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {getResult('profit') === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
            {getResult('profit') === 'incorrect' && <XCircle className="w-5 h-5 text-red-500" />}
          </div>
          {getResult('profit') === 'incorrect' && !revealed && (
            <p className="text-sm text-amber-600 mt-1">💡 Profit = Revenue - Expenses</p>
          )}
        </div>

        <div>
          <label className="block font-medium text-gray-900 mb-2">4. Did you make a loss? (Yes/No)</label>
          <div className="flex gap-2">
            {['Yes', 'No'].map(option => (
              <button key={option} onClick={() => !revealed && setAnswers({ ...answers, loss: option })}
                disabled={revealed}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                  answers.loss === option
                    ? getResult('loss') === 'correct' ? 'border-green-400 bg-green-50 text-green-700' :
                      getResult('loss') === 'incorrect' ? 'border-red-400 bg-red-50 text-red-700' :
                      'border-forest-400 bg-forest-50 text-forest-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-900 mb-2">
            5. CHALLENGE: To make $10 more profit, how many total cups would you need to sell?
            <span className="text-xs text-gray-500 font-normal ml-2 block mt-1">(Remember: expenses stay the same, so you need $10 more revenue. Divide the new revenue by price per cup.)</span>
          </label>
          <input type="text" value={answers.challenge} onChange={(e) => setAnswers({ ...answers, challenge: e.target.value })}
            disabled={revealed}
            placeholder="Enter number of cups"
            className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
              getResult('challenge') === 'correct' ? 'border-green-400 bg-green-50' :
              getResult('challenge') === 'incorrect' ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {getResult('challenge') === 'incorrect' && !revealed && (
            <div className="text-sm text-amber-600 mt-2 space-y-1">
              <p className="font-medium">💡 Hint:</p>
              <p>To make $10 more profit, you need $10 more revenue (since expenses stay the same).</p>
              <p>Step 1: Add $10 to your current revenue → ${(revenue + 10).toFixed(2)}</p>
              <p>Step 2: Divide by price per cup → ${(revenue + 10).toFixed(2)} ÷ ${price.toFixed(2)} = {challengeAnswer} cups</p>
            </div>
          )}
        </div>
      </div>

      {checked && allCorrect && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Perfect!</strong> You calculated everything correctly!</p>
        </div>
      )}

      {revealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800"><strong>📚 Learning moment!</strong> Review the correct answers above. Remember: Revenue - Expenses = Profit!</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!((allCorrect && checked) || revealed) && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheck}
            disabled={!answers.revenue || !answers.expenses || !answers.profit || !answers.loss}
            className={`btn-primary px-6 py-3 ${!answers.revenue || !answers.expenses || !answers.profit || !answers.loss ? 'opacity-50 cursor-not-allowed' : ''}`}>
            Check Answers
          </motion.button>
        )}
        {((allCorrect && checked) || revealed) && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ activity_41b_attempts: attempts, activity_41b_revealed: revealed })}
            className="btn-primary px-8 py-3">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

