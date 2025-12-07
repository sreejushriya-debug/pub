'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, Eye, RotateCcw } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const EXPENSES = [
  { id: 'grocery', name: 'Grocery trip', correct: 'V', explanation: 'Grocery costs change based on what you buy and how much.' },
  { id: 'electricity', name: 'Electricity bill', correct: 'V', explanation: 'Electricity usage varies month to month.' },
  { id: 'hawaii', name: 'Trip to Hawai\'i', correct: 'V', explanation: 'A vacation is a variable expense - the cost depends on when and how you travel.' },
  { id: 'hospital', name: 'Emergency hospital visit', correct: 'V', explanation: 'Emergency medical costs are unpredictable and vary.' },
  { id: 'physical', name: 'Yearly physical', correct: 'P', explanation: 'A yearly checkup occurs regularly but not every month.' },
  { id: 'ipad', name: 'Latest iPad', correct: 'D', explanation: 'An iPad is not essential - it\'s a discretionary purchase.' },
  { id: 'credit', name: 'Credit card payment', correct: 'V', explanation: 'Credit card payments vary based on how much you spent that month.' },
  { id: 'amusement', name: 'Amusement park ticket', correct: 'D', explanation: 'Entertainment like amusement parks is discretionary.' },
  { id: 'insurance', name: 'Auto insurance', correct: 'P', explanation: 'Insurance is paid periodically (monthly, quarterly, or yearly).' },
  { id: 'phone', name: 'Cell phone bill', correct: 'F', explanation: 'Cell phone bills are usually the same amount each month.' },
]

export default function Activity46B({ onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    setChecked(true)
  }

  const handleReveal = () => {
    setRevealed(true)
    const correct: Record<string, string> = {}
    EXPENSES.forEach(exp => {
      correct[exp.id] = exp.correct
    })
    setAnswers(correct)
    setChecked(true)
  }

  const handleTryAgain = () => {
    const correct: Record<string, string> = {}
    EXPENSES.forEach(exp => {
      if (answers[exp.id] === exp.correct) {
        correct[exp.id] = exp.correct
      }
    })
    setAnswers(correct)
    setChecked(false)
  }

  const allCorrect = EXPENSES.every(exp => answers[exp.id] === exp.correct)
  const allAnswered = EXPENSES.every(exp => answers[exp.id])

  const getResult = (expenseId: string) => {
    if (!checked || revealed) return null
    const expense = EXPENSES.find(e => e.id === expenseId)
    return answers[expenseId] === expense?.correct ? 'correct' : 'incorrect'
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Activity 4.6B – Classify Each Expense</h2>
        <p className="text-gray-600">Classify each expense as Fixed (F), Discretionary (D), Periodic (P), or Variable (V)</p>
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

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {EXPENSES.map(expense => {
          const result = getResult(expense.id)
          return (
            <div key={expense.id} className={`p-4 rounded-xl border-2 transition-all ${
              result === 'correct' ? 'border-green-400 bg-green-50' :
              result === 'incorrect' ? 'border-red-400 bg-red-50' :
              answers[expense.id] ? 'border-forest-400 bg-forest-50' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900">{expense.name}</span>
                {result === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {result === 'incorrect' && <XCircle className="w-5 h-5 text-red-500" />}
              </div>
              <div className="flex gap-2">
                {['F', 'D', 'P', 'V'].map(option => (
                  <button key={option} onClick={() => !revealed && setAnswers({ ...answers, [expense.id]: option })}
                    disabled={revealed}
                    className={`px-3 py-1.5 rounded-lg border-2 font-medium text-sm transition-all ${
                      answers[expense.id] === option
                        ? result === 'correct' ? 'border-green-500 bg-green-100 text-green-700' :
                          result === 'incorrect' ? 'border-red-500 bg-red-100 text-red-700' :
                          'border-forest-500 bg-forest-100 text-forest-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    {option}
                  </button>
                ))}
              </div>
              {(revealed || (checked && result === 'incorrect')) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-xs"><strong>Correct:</strong> {expense.correct} - {expense.explanation}</p>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      {checked && allCorrect && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Perfect!</strong> You classified all expenses correctly!</p>
        </div>
      )}

      {revealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800"><strong>📚 Learning moment!</strong> Review the correct classifications above. Remember: Fixed = same each month, Variable = changes, Periodic = regular but not monthly, Discretionary = not essential!</p>
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
            onClick={() => onComplete({ activity_46b_attempts: attempts, activity_46b_revealed: revealed })}
            className="btn-primary px-8 py-3">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

