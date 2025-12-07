'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, Eye, RotateCcw } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const EXPENSE_TYPES = [
  {
    id: 'fixed',
    name: 'Fixed',
    definition: 'Item whose cost is the exact same each month, such as rent',
    example: 'Rent, car payment'
  },
  {
    id: 'discretionary',
    name: 'Discretionary',
    definition: 'Item that is not essential and you choose when to spend on it',
    example: 'Entertainment, hobbies'
  },
  {
    id: 'periodic',
    name: 'Periodic',
    definition: 'Item that occurs regularly but not every month',
    example: 'Insurance, annual fees'
  },
  {
    id: 'variable',
    name: 'Variable',
    definition: 'Item whose cost changes from month to month',
    example: 'Groceries, utilities'
  },
]

const DEFINITIONS = [
  'Item whose cost is the exact same each month, such as rent',
  'Item that is not essential and you choose when to spend on it',
  'Item that occurs regularly but not every month',
  'Item whose cost changes from month to month',
]

export default function Activity46A({ onComplete }: Props) {
  const [matches, setMatches] = useState<Record<string, string>>({})
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
    EXPENSE_TYPES.forEach(type => {
      correct[type.id] = type.definition
    })
    setMatches(correct)
    setChecked(true)
  }

  const handleTryAgain = () => {
    const correct: Record<string, string> = {}
    EXPENSE_TYPES.forEach(type => {
      if (matches[type.id] === type.definition) {
        correct[type.id] = type.definition
      }
    })
    setMatches(correct)
    setChecked(false)
  }

  const allCorrect = EXPENSE_TYPES.every(type => matches[type.id] === type.definition)
  const allMatched = EXPENSE_TYPES.every(type => matches[type.id])

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Activity 4.6A – Match Expense Definitions</h2>
        <p className="text-gray-600">Match each expense type to its definition</p>
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

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Expense Types</h3>
          <div className="space-y-3">
            {EXPENSE_TYPES.map(type => {
              const selectedDef = matches[type.id]
              const isCorrect = checked && selectedDef === type.definition
              const isWrong = checked && selectedDef && selectedDef !== type.definition
              return (
                <div key={type.id} className={`p-4 rounded-xl border-2 transition-all ${
                  isCorrect ? 'border-green-400 bg-green-50' :
                  isWrong ? 'border-red-400 bg-red-50' :
                  selectedDef ? 'border-forest-400 bg-forest-50' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{type.name}</span>
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {isWrong && <XCircle className="w-5 h-5 text-red-500" />}
                  </div>
                  {selectedDef && (
                    <p className="text-sm text-gray-700 mt-2">{selectedDef}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Definitions (click to match)</h3>
          <div className="space-y-3">
            {DEFINITIONS.map((def, idx) => {
              const isUsed = Object.values(matches).includes(def)
              const matchedType = EXPENSE_TYPES.find(type => matches[type.id] === def)
              const isCorrect = matchedType && def === matchedType.definition
              return (
                <button key={idx} onClick={() => {
                  if (revealed) return
                  const currentType = Object.keys(matches).find(key => matches[key] === def)
                  if (currentType) {
                    const newMatches = { ...matches }
                    delete newMatches[currentType]
                    setMatches(newMatches)
                  }
                }}
                  disabled={revealed}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    isCorrect && checked ? 'border-green-400 bg-green-50' :
                    isUsed && checked ? 'border-red-400 bg-red-50' :
                    isUsed ? 'border-forest-400 bg-forest-50' : 'border-gray-200 bg-white hover:border-forest-300'
                  }`}>
                  <p className="text-sm text-gray-700">{def}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {checked && allCorrect && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Perfect!</strong> You matched all the definitions correctly!</p>
        </div>
      )}

      {revealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800"><strong>📚 Learning moment!</strong> Review the matches above. Each expense type has a specific meaning!</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!((allCorrect && checked) || revealed) && (
          <>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheck}
              disabled={!allMatched}
              className={`btn-primary px-6 py-3 ${!allMatched ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
            onClick={() => onComplete({ activity_46a_attempts: attempts, activity_46a_revealed: revealed })}
            className="btn-primary px-8 py-3">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

