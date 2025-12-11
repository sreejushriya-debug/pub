'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Tag, CheckCircle2, XCircle, Eye, RotateCcw } from 'lucide-react'

interface Props {
  costs: { name: string; amount: number; type?: string }[]
  onComplete: (data: Record<string, unknown>) => void
}

const COST_TYPES = ['Fixed', 'Variable', 'Periodic', 'Discretionary']

// Simple logic for cost type classification
const classifyCost = (costName: string): string => {
  const name = costName.toLowerCase()
  if (name.includes('rent') || name.includes('booth') || name.includes('fee') || name.includes('lease')) return 'Fixed'
  if (name.includes('ingredient') || name.includes('material') || name.includes('supply') || name.includes('per unit')) return 'Variable'
  if (name.includes('license') || name.includes('annual') || name.includes('yearly') || name.includes('insurance')) return 'Periodic'
  return 'Discretionary'
}

export default function Activity63C({ costs, onComplete }: Props) {
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
    costs.forEach(cost => {
      correct[cost.name] = classifyCost(cost.name)
    })
    setAnswers(correct)
    setChecked(true)
  }

  const handleTryAgain = () => {
    const correct: Record<string, string> = {}
    costs.forEach(cost => {
      if (answers[cost.name] === classifyCost(cost.name)) {
        correct[cost.name] = answers[cost.name]
      }
    })
    setAnswers(correct)
    setChecked(false)
  }

  const allCorrect = costs.every(cost => answers[cost.name] === classifyCost(cost.name))
  const allAnswered = costs.every(cost => answers[cost.name])

  const getResult = (costName: string) => {
    if (!checked || revealed) return null
    return answers[costName] === classifyCost(costName) ? 'correct' : 'incorrect'
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Tag className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 6.3C – Tag Each Cost Type</h2>
        </div>
        <p className="text-gray-600">Classify each cost as Fixed, Variable, Periodic, or Discretionary</p>
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

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Remember:</strong> Fixed = same each month, Variable = changes, Periodic = regular but not monthly, Discretionary = not essential
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {costs.map((cost, idx) => {
          const result = getResult(cost.name)
          return (
            <div key={idx} className={`p-5 rounded-xl border-2 ${
              result === 'correct' ? 'border-green-400 bg-green-50' :
              result === 'incorrect' ? 'border-red-400 bg-red-50' :
              answers[cost.name] ? 'border-forest-400 bg-forest-50' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{cost.name}</h3>
                  <p className="text-sm text-gray-600">${cost.amount.toFixed(2)}</p>
                </div>
                {result === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {result === 'incorrect' && <XCircle className="w-5 h-5 text-red-500" />}
              </div>
              <div className="flex gap-2">
                {COST_TYPES.map(type => (
                  <button key={type} onClick={() => !revealed && setAnswers({ ...answers, [cost.name]: type })}
                    disabled={revealed}
                    className={`px-3 py-2 rounded-lg border-2 font-medium text-sm transition-all ${
                      answers[cost.name] === type
                        ? result === 'correct' ? 'border-green-500 bg-green-100 text-green-700' :
                          result === 'incorrect' ? 'border-red-500 bg-red-100 text-red-700' :
                          'border-forest-500 bg-forest-100 text-forest-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {checked && allCorrect && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Perfect!</strong> You classified all costs correctly!</p>
        </div>
      )}

      {revealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800"><strong>📚 Learning moment!</strong> Review the correct classifications above!</p>
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
            onClick={() => onComplete({ activity_63c_attempts: attempts, activity_63c_revealed: revealed })}
            className="btn-primary px-8 py-3">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}


