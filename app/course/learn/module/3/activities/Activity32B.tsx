'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, Layers, Eye } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const CATEGORIES = {
  'Card/Bank Actions': ['transaction', 'transfer', 'withdrawal', 'borrow', 'deposit'],
  'Money Types/Flows': ['money', 'funds', 'revenue', 'loan', 'credit', 'debt'],
  'Interest & Growth': ['simple interest', 'compound interest', 'principle'],
  'Institutions': ['bank', 'equity'],
}

const ALL_TERMS = Object.values(CATEGORIES).flat()

export default function Activity32B({ onComplete }: Props) {
  const [placements, setPlacements] = useState<Record<string, string>>({})
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const getCorrectCategory = (term: string) => {
    for (const [cat, terms] of Object.entries(CATEGORIES)) {
      if (terms.includes(term)) return cat
    }
    return null
  }

  const handleCategoryClick = (category: string) => {
    if (!selectedTerm || revealed) return
    setPlacements({ ...placements, [selectedTerm]: category })
    setSelectedTerm(null)
    setChecked(false)
  }

  const handleCheck = () => { setAttempts(prev => prev + 1); setChecked(true) }

  const handleReveal = () => {
    setRevealed(true)
    const correct: Record<string, string> = {}
    ALL_TERMS.forEach(term => { correct[term] = getCorrectCategory(term) || '' })
    setPlacements(correct)
    setChecked(true)
  }

  const allCorrect = ALL_TERMS.every(term => placements[term] === getCorrectCategory(term))
  const placedTerms = Object.keys(placements)

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Layers className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 3.2B – Categorize Banking Terms</h2>
        </div>
        <p className="text-gray-600">Sort each term into the correct category</p>
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

      {/* Terms to place */}
      <div className="bg-gray-100 rounded-xl p-4 mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Click a term, then click a category:</p>
        <div className="flex flex-wrap gap-2">
          {ALL_TERMS.map(term => {
            const isPlaced = placedTerms.includes(term)
            const isSelected = selectedTerm === term
            return (
              <button key={term} onClick={() => !revealed && setSelectedTerm(isSelected ? null : term)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isPlaced ? 'bg-gray-300 text-gray-500 line-through' :
                  isSelected ? 'bg-forest-500 text-white shadow-lg scale-105' :
                  'bg-white border border-gray-300 text-gray-700 hover:border-forest-400'
                }`}>
                {term}
              </button>
            )
          })}
        </div>
      </div>

      {/* Categories */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {Object.keys(CATEGORIES).map(category => {
          const termsInCategory = Object.entries(placements).filter(([_, cat]) => cat === category).map(([term]) => term)
          return (
            <motion.div key={category} whileHover={selectedTerm ? { scale: 1.02 } : {}}
              onClick={() => handleCategoryClick(category)}
              className={`p-4 rounded-xl border-2 min-h-[120px] transition-all ${
                selectedTerm ? 'cursor-pointer border-forest-400 bg-forest-50' : 'border-gray-200 bg-white'
              }`}>
              <h3 className="font-semibold text-gray-900 mb-3">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {termsInCategory.map(term => {
                  const isCorrect = checked && getCorrectCategory(term) === category
                  const isWrong = checked && getCorrectCategory(term) !== category
                  return (
                    <span key={term} className={`px-2 py-1 rounded text-sm font-medium flex items-center gap-1 ${
                      isCorrect ? 'bg-green-100 text-green-700' : isWrong ? 'bg-red-100 text-red-700' : 'bg-forest-100 text-forest-700'
                    }`}>
                      {term}
                      {isCorrect && <CheckCircle2 className="w-3 h-3" />}
                      {isWrong && <XCircle className="w-3 h-3" />}
                    </span>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>

      {checked && !allCorrect && !revealed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800"><strong>Almost!</strong> Some terms are in the wrong category. Look at the red ones and try again.</p>
        </div>
      )}

      {((allCorrect && checked) || revealed) && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Great job!</strong> You categorized all the banking terms correctly!</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!((allCorrect && checked) || revealed) && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheck}
            disabled={placedTerms.length < ALL_TERMS.length}
            className={`btn-primary px-6 py-3 ${placedTerms.length < ALL_TERMS.length ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {placedTerms.length < ALL_TERMS.length ? `Place ${ALL_TERMS.length - placedTerms.length} more` : 'Check Answers'}
          </motion.button>
        )}
        {((allCorrect && checked) || revealed) && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ activity_32b_attempts: attempts })} className="btn-primary px-8 py-3">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

