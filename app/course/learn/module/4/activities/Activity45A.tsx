'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calculator, CheckCircle2, XCircle, Eye, RotateCcw } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const PROBLEMS = [
  {
    id: 'sanjali',
    name: 'Sanjali',
    story: 'Sanjali makes bracelets. She spent $25 on strings, $20 on beads, and $65 on a stand. She sold 85 bracelets for $3 each.',
    expenses: { strings: 25, beads: 20, stand: 65 },
    quantity: 85,
    price: 3,
    correctExpenses: 110,
    correctRevenue: 255,
    correctProfit: 145,
    isLoss: false
  },
  {
    id: 'dakota',
    name: 'Dakota',
    story: 'Dakota bakes cookies. She spent $15 on flour, $8 on sugar, $12 on chocolate chips, and $95 on a mixer. She sold 50 cookies for $2.00 each.',
    expenses: { flour: 15, sugar: 8, chocolate: 12, mixer: 95 },
    quantity: 50,
    price: 2.00,
    correctExpenses: 130,
    correctRevenue: 100,
    correctProfit: -30,
    isLoss: true
  },
  {
    id: 'raquelle',
    name: 'Raquelle',
    story: 'Raquelle makes stuffed animals. She spent $45 on fabric, $30 on stuffing, $25 on thread, and $15 on buttons. She sold 60 stuffed animals for $16.50 each.',
    expenses: { fabric: 45, stuffing: 30, thread: 25, buttons: 15 },
    quantity: 60,
    price: 16.50,
    correctExpenses: 115,
    correctRevenue: 990,
    correctProfit: 875,
    isLoss: false
  },
]

export default function Activity45A({ onComplete }: Props) {
  const [currentProblem, setCurrentProblem] = useState(0)
  const [answers, setAnswers] = useState<Record<string, { expenses: string; revenue: string; profit: string; loss: string }>>({})
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const problem = PROBLEMS[currentProblem]
  const problemAnswers = answers[problem.id] || { expenses: '', revenue: '', profit: '', loss: '' }
  const correct = {
    expenses: problem.correctExpenses.toString(),
    revenue: problem.correctRevenue.toString(),
    profit: problem.correctProfit.toString(),
    loss: problem.isLoss ? 'Yes' : 'No'
  }

  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    setChecked(true)
  }

  const handleReveal = () => {
    setRevealed(true)
    const newAnswers = { ...answers }
    PROBLEMS.forEach(p => {
      newAnswers[p.id] = {
        expenses: p.correctExpenses.toString(),
        revenue: p.correctRevenue.toString(),
        profit: p.correctProfit.toString(),
        loss: p.isLoss ? 'Yes' : 'No'
      }
    })
    setAnswers(newAnswers)
    setChecked(true)
  }

  const handleTryAgain = () => {
    const newAnswers = { ...answers }
    const p = PROBLEMS[currentProblem]
    const current = newAnswers[p.id]
    if (current) {
      if (current.expenses === correct.expenses) delete current.expenses
      if (current.revenue === correct.revenue) delete current.revenue
      if (current.profit === correct.profit) delete current.profit
      if (current.loss === correct.loss) delete current.loss
    }
    setAnswers(newAnswers)
    setChecked(false)
  }

  const isCorrect = (field: string) => {
    if (!checked || revealed) return null
    return problemAnswers[field as keyof typeof problemAnswers]?.toString().trim() === correct[field as keyof typeof correct]
  }

  const allCorrectForProblem = Object.keys(correct).every(key => 
    problemAnswers[key as keyof typeof problemAnswers]?.toString().trim() === correct[key as keyof typeof correct]
  )

  const allAnswered = problemAnswers.expenses && problemAnswers.revenue && problemAnswers.profit && problemAnswers.loss

  const totalExpenses = Object.values(problem.expenses).reduce((sum, val) => sum + val, 0)

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calculator className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 4.5A – Profit Word Problems</h2>
        </div>
        <p className="text-gray-600">Solve step-by-step: expenses, revenue, and profit</p>
        <div className="mt-2 text-sm text-gray-500">Problem {currentProblem + 1} of {PROBLEMS.length}</div>
      </div>

      {attempts > 0 && !allCorrectForProblem && !revealed && (
        <div className="bg-gray-100 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">Attempts: {attempts}/3</span>
          {attempts >= 3 && (
            <button onClick={handleReveal} className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium">
              <Eye className="w-4 h-4" /> Reveal All Answers
            </button>
          )}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">{problem.name}&apos;s Story</h3>
        <p className="text-gray-700 mb-4">{problem.story}</p>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Expenses Breakdown:</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            {Object.entries(problem.expenses).map(([item, cost]) => (
              <li key={item} className="flex justify-between">
                <span className="capitalize">{item}:</span>
                <span className="font-medium">${cost}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-900 mb-2">1. Total Expenses:</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={problemAnswers.expenses} onChange={(e) => setAnswers({ ...answers, [problem.id]: { ...problemAnswers, expenses: e.target.value } })}
                disabled={revealed}
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  isCorrect('expenses') === true ? 'border-green-400 bg-green-50' :
                  isCorrect('expenses') === false ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {isCorrect('expenses') === true && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {isCorrect('expenses') === false && <XCircle className="w-5 h-5 text-red-500" />}
            </div>
            {isCorrect('expenses') === false && !revealed && (
              <p className="text-sm text-amber-600 mt-1">💡 Add all the expense amounts together: {Object.values(problem.expenses).join(' + ')} = ?</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-900 mb-2">2. Revenue (quantity × price):</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={problemAnswers.revenue} onChange={(e) => setAnswers({ ...answers, [problem.id]: { ...problemAnswers, revenue: e.target.value } })}
                disabled={revealed}
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  isCorrect('revenue') === true ? 'border-green-400 bg-green-50' :
                  isCorrect('revenue') === false ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {isCorrect('revenue') === true && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {isCorrect('revenue') === false && <XCircle className="w-5 h-5 text-red-500" />}
            </div>
            {isCorrect('revenue') === false && !revealed && (
              <p className="text-sm text-amber-600 mt-1">💡 Revenue = {problem.quantity} × ${problem.price} = ?</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-900 mb-2">3. Profit or Loss:</label>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-500">$</span>
              <input type="text" value={problemAnswers.profit} onChange={(e) => setAnswers({ ...answers, [problem.id]: { ...problemAnswers, profit: e.target.value } })}
                disabled={revealed}
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  isCorrect('profit') === true ? 'border-green-400 bg-green-50' :
                  isCorrect('profit') === false ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              {isCorrect('profit') === true && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {isCorrect('profit') === false && <XCircle className="w-5 h-5 text-red-500" />}
            </div>
            {isCorrect('profit') === false && !revealed && (
              <p className="text-sm text-amber-600 mt-1">💡 Profit = Revenue - Expenses</p>
            )}
            <div className="flex gap-2 mt-2">
              {['Yes', 'No'].map(option => (
                <button key={option} onClick={() => !revealed && setAnswers({ ...answers, [problem.id]: { ...problemAnswers, loss: option } })}
                  disabled={revealed}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                    problemAnswers.loss === option
                      ? isCorrect('loss') === true ? 'border-green-400 bg-green-50 text-green-700' :
                        isCorrect('loss') === false ? 'border-red-400 bg-red-50 text-red-700' :
                        'border-forest-400 bg-forest-50 text-forest-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  {option === 'Yes' ? 'Loss' : 'Profit'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {checked && allCorrectForProblem && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Correct!</strong> You solved {problem.name}&apos;s problem correctly!</p>
        </div>
      )}

      {revealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800"><strong>📚 Learning moment!</strong> Review the correct answers above. Remember: Revenue - Expenses = Profit!</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!((allCorrectForProblem && checked) || revealed) && (
          <>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheck}
              disabled={!allAnswered}
              className={`btn-primary px-6 py-3 ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}>
              Check Answers
            </motion.button>
            {checked && !allCorrectForProblem && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleTryAgain} className="btn-outline px-6 py-3 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Try Again
              </motion.button>
            )}
          </>
        )}
        {((allCorrectForProblem && checked) || revealed) && (
          <>
            {currentProblem < PROBLEMS.length - 1 ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => { setCurrentProblem(prev => prev + 1); setChecked(false); setAttempts(0) }}
                className="btn-primary px-8 py-3">
                Next Problem <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => onComplete({ activity_45a_attempts: attempts, activity_45a_revealed: revealed })}
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

