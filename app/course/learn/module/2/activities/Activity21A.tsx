'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, MousePointer2, Eye } from 'lucide-react'

interface Activity21AProps {
  onComplete: (data: Record<string, unknown>) => void
}

const TERMS = [
  { term: 'charity', definition: 'Giving money or help to people in need' },
  { term: 'cost', definition: 'The amount of money needed to buy something' },
  { term: 'save', definition: 'To keep money for later instead of spending it now' },
  { term: 'spend', definition: 'To use money to buy things' },
  { term: 'budget', definition: 'A plan for how you will use your money' },
  { term: 'wants', definition: 'Things you would like to have but don\'t need' },
  { term: 'needs', definition: 'Things you must have to survive (food, shelter, clothing)' },
  { term: 'income', definition: 'Money you receive, like from a job or allowance' },
  { term: 'earn', definition: 'To get money by working' },
  { term: 'finance', definition: 'The management of money' },
]

export default function Activity21A({ onComplete }: Activity21AProps) {
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [shuffledDefinitions] = useState(() => [...TERMS].sort(() => Math.random() - 0.5).map(t => t.definition))

  const handleTermClick = (term: string) => {
    if (checked && allCorrect) return
    if (revealed) return
    setSelectedTerm(selectedTerm === term ? null : term)
  }

  const handleDefinitionClick = (definition: string) => {
    if (!selectedTerm || (checked && allCorrect) || revealed) return
    const newMatches = { ...matches }
    Object.keys(newMatches).forEach(key => { if (newMatches[key] === selectedTerm) delete newMatches[key] })
    newMatches[definition] = selectedTerm
    setMatches(newMatches)
    setSelectedTerm(null)
    setChecked(false)
  }

  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    setChecked(true)
  }

  const handleReveal = () => {
    setRevealed(true)
    const correct: Record<string, string> = {}
    TERMS.forEach(t => { correct[t.definition] = t.term })
    setMatches(correct)
    setChecked(true)
  }

  const allCorrect = TERMS.every(({ term, definition }) => matches[definition] === term)
  const matchedTerms = Object.values(matches)
  const matchCount = Object.keys(matches).length

  const getResultForDef = (definition: string): 'correct' | 'incorrect' | null => {
    if (!checked) return null
    const correctTerm = TERMS.find(t => t.definition === definition)?.term
    return matches[definition] === correctTerm ? 'correct' : 'incorrect'
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Activity 2.1A – Term Matching</h2>
        <p className="text-gray-600">Match each spending & saving term to its definition</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <MousePointer2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-blue-800 text-sm"><strong>How to play:</strong> Click a term, then click its matching definition. Match all 10 terms!</p>
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

      <div className="bg-gray-100 rounded-lg p-3 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{matchCount} of {TERMS.length} matched</span>
        </div>
        <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
          <motion.div className="h-full bg-forest-500" initial={{ width: 0 }} animate={{ width: `${(matchCount / TERMS.length) * 100}%` }} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Terms (click one)</h3>
          <div className="space-y-2">
            {TERMS.map(({ term }) => {
              const isMatched = matchedTerms.includes(term)
              const isSelected = selectedTerm === term
              return (
                <motion.button key={term} onClick={() => handleTermClick(term)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-3 rounded-lg font-medium transition-all ${
                    isSelected ? 'bg-forest-500 text-white border-2 border-forest-600 shadow-lg'
                    : isMatched ? 'bg-gray-200 text-gray-500 border-2 border-gray-300'
                    : 'bg-forest-100 text-forest-800 border-2 border-forest-300 hover:border-forest-400 hover:bg-forest-200'
                  }`}>
                  {term.charAt(0).toUpperCase() + term.slice(1)}
                  {isMatched && !isSelected && <span className="float-right">✓</span>}
                </motion.button>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Definitions (click to match)</h3>
          <div className="space-y-2">
            {shuffledDefinitions.map((definition) => {
              const matchedTerm = matches[definition]
              const result = getResultForDef(definition)
              return (
                <motion.button key={definition} onClick={() => handleDefinitionClick(definition)} whileHover={selectedTerm ? { scale: 1.01 } : {}}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all min-h-[60px] ${
                    result === 'correct' ? 'border-green-400 bg-green-50'
                    : result === 'incorrect' ? 'border-red-400 bg-red-50'
                    : selectedTerm && !matchedTerm ? 'border-forest-400 bg-forest-50 cursor-pointer hover:border-forest-500'
                    : matchedTerm ? 'border-accent-300 bg-accent-50'
                    : 'border-gray-300 bg-gray-50'
                  } ${selectedTerm && !matchedTerm ? 'ring-2 ring-forest-300' : ''}`}>
                  <p className="text-sm text-gray-700 mb-2">{definition}</p>
                  {matchedTerm && (
                    <div className={`flex items-center gap-2 text-sm font-medium ${result === 'correct' ? 'text-green-700' : result === 'incorrect' ? 'text-red-700' : 'text-accent-700'}`}>
                      {result === 'correct' && <CheckCircle2 className="w-4 h-4" />}
                      {result === 'incorrect' && <XCircle className="w-4 h-4" />}
                      {matchedTerm.charAt(0).toUpperCase() + matchedTerm.slice(1)}
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {checked && allCorrect && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Perfect!</strong> You matched all the terms correctly!</p>
        </div>
      )}

      {revealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800"><strong>📚 Learning moment!</strong> Review the correct matches above. These are important terms for managing money!</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {!((allCorrect && checked) || revealed) && (
          <motion.button whileHover={matchCount >= TERMS.length ? { scale: 1.02 } : {}} whileTap={matchCount >= TERMS.length ? { scale: 0.98 } : {}}
            onClick={handleCheck} disabled={matchCount < TERMS.length}
            className={`btn-primary px-6 py-3 ${matchCount < TERMS.length ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {matchCount < TERMS.length ? `Match ${TERMS.length - matchCount} more` : 'Check Answers'}
          </motion.button>
        )}
        
        {((allCorrect && checked) || revealed) && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ activity_21a_attempts: attempts, activity_21a_revealed: revealed })}
            className="btn-primary px-8 py-3">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

