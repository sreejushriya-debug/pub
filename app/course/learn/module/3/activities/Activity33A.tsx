'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, CreditCard } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const TERMS = [
  { term: 'Credit', definition: 'The ability to borrow money with a promise to pay it back later' },
  { term: 'Borrower', definition: 'A person who receives money and must pay it back' },
  { term: 'Lender', definition: 'A person or institution that gives money to be paid back' },
  { term: 'Interest', definition: 'Extra money paid for the use of borrowed money' },
]

export default function Activity33A({ onComplete }: Props) {
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  const handleTermClick = (term: string) => {
    if (checked && allCorrect) return
    setSelectedTerm(selectedTerm === term ? null : term)
  }

  const handleDefinitionClick = (definition: string) => {
    if (!selectedTerm || (checked && allCorrect)) return
    const newMatches = { ...matches }
    Object.keys(newMatches).forEach(key => { if (newMatches[key] === selectedTerm) delete newMatches[key] })
    newMatches[definition] = selectedTerm
    setMatches(newMatches)
    setSelectedTerm(null)
    setChecked(false)
  }

  const allCorrect = TERMS.every(({ term, definition }) => matches[definition] === term)
  const matchedTerms = Object.values(matches)

  const [shuffledDefs] = useState(() => [...TERMS].sort(() => Math.random() - 0.5).map(t => t.definition))

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CreditCard className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 3.3A – Credit Terms Matching</h2>
        </div>
        <p className="text-gray-600">Match each credit term to its definition</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Terms</h3>
          <div className="space-y-2">
            {TERMS.map(({ term }) => {
              const isMatched = matchedTerms.includes(term)
              const isSelected = selectedTerm === term
              return (
                <motion.button key={term} onClick={() => handleTermClick(term)} whileHover={{ scale: 1.02 }}
                  className={`w-full text-left p-4 rounded-xl font-medium transition-all ${
                    isSelected ? 'bg-forest-500 text-white shadow-lg' :
                    isMatched ? 'bg-gray-200 text-gray-500' :
                    'bg-forest-100 text-forest-800 border-2 border-forest-300 hover:border-forest-400'
                  }`}>
                  {term}
                </motion.button>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Definitions</h3>
          <div className="space-y-2">
            {shuffledDefs.map((definition) => {
              const matchedTerm = matches[definition]
              const correctTerm = TERMS.find(t => t.definition === definition)?.term
              const isCorrect = checked && matchedTerm === correctTerm
              const isWrong = checked && matchedTerm && matchedTerm !== correctTerm
              return (
                <motion.button key={definition} onClick={() => handleDefinitionClick(definition)}
                  whileHover={selectedTerm ? { scale: 1.01 } : {}}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    isCorrect ? 'border-green-400 bg-green-50' :
                    isWrong ? 'border-red-400 bg-red-50' :
                    selectedTerm && !matchedTerm ? 'border-forest-400 bg-forest-50 cursor-pointer' :
                    matchedTerm ? 'border-accent-300 bg-accent-50' : 'border-gray-200'
                  }`}>
                  <p className="text-sm text-gray-700">{definition}</p>
                  {matchedTerm && (
                    <div className={`flex items-center gap-2 mt-2 text-sm font-medium ${
                      isCorrect ? 'text-green-700' : isWrong ? 'text-red-700' : 'text-accent-700'
                    }`}>
                      {isCorrect && <CheckCircle2 className="w-4 h-4" />}
                      {isWrong && <XCircle className="w-4 h-4" />}
                      {matchedTerm}
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {checked && allCorrect && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Perfect!</strong> You matched all the credit terms correctly!</p>
        </div>
      )}

      <div className="flex justify-center">
        {!(allCorrect && checked) && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setChecked(true)} disabled={Object.keys(matches).length < 4}
            className={`btn-primary px-6 py-3 ${Object.keys(matches).length < 4 ? 'opacity-50 cursor-not-allowed' : ''}`}>
            Check Answers
          </motion.button>
        )}
        {allCorrect && checked && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({})} className="btn-primary px-8 py-3">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

