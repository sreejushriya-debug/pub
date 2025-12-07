'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, RotateCcw, CheckCircle2, XCircle, Lightbulb, MousePointer2 } from 'lucide-react'

interface Activity11AProps {
  onComplete: (data: Record<string, unknown>) => void
}

const TERMS = [
  { term: 'inflation', definition: 'A general increase in prices and fall in the purchasing value of money' },
  { term: 'credit', definition: 'The ability to borrow money with the promise to pay it back later' },
  { term: 'debt', definition: 'Money that is owed or due to someone else' },
  { term: 'revenue', definition: 'Income generated from normal business operations' },
  { term: 'profit', definition: 'Financial gain; money left over after expenses are paid' },
  { term: 'stock', definition: 'A share of ownership in a company' },
  { term: 'interest', definition: 'Money paid regularly for the use of borrowed money' },
  { term: 'income', definition: 'Money received, especially on a regular basis, for work or investments' },
]

export default function Activity11A({ onComplete }: Activity11AProps) {
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [missedTerms, setMissedTerms] = useState<string[]>([])
  
  // Shuffle definitions on mount
  const [shuffledDefinitions] = useState(() => 
    [...TERMS].sort(() => Math.random() - 0.5).map(t => t.definition)
  )

  const handleTermClick = (term: string) => {
    // If already matched and correct, don't allow changes
    if (checked && allCorrect) return
    
    // If clicking same term, deselect
    if (selectedTerm === term) {
      setSelectedTerm(null)
      return
    }
    
    setSelectedTerm(term)
  }

  const handleDefinitionClick = (definition: string) => {
    if (!selectedTerm) return
    if (checked && allCorrect) return
    
    // Remove term from any previous match
    const newMatches = { ...matches }
    Object.keys(newMatches).forEach(key => {
      if (newMatches[key] === selectedTerm) {
        delete newMatches[key]
      }
    })
    newMatches[definition] = selectedTerm
    setMatches(newMatches)
    setSelectedTerm(null)
    setChecked(false)
  }

  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    setChecked(true)
    
    const missed: string[] = []
    TERMS.forEach(({ term, definition }) => {
      if (matches[definition] !== term) {
        missed.push(term)
      }
    })
    setMissedTerms(prev => {
      const combined = new Set([...prev, ...missed])
      return Array.from(combined)
    })
  }

  const handleReset = () => {
    // Keep only correct matches
    const correct: Record<string, string> = {}
    TERMS.forEach(({ term, definition }) => {
      if (matches[definition] === term) {
        correct[definition] = term
      }
    })
    setMatches(correct)
    setChecked(false)
    setSelectedTerm(null)
  }

  const allCorrect = TERMS.every(({ term, definition }) => matches[definition] === term)
  const matchedTerms = Object.values(matches)
  const matchCount = Object.keys(matches).length
  const remainingCount = TERMS.length - matchCount

  const getResultForDef = (definition: string): 'correct' | 'incorrect' | null => {
    if (!checked) return null
    const correctTerm = TERMS.find(t => t.definition === definition)?.term
    return matches[definition] === correctTerm ? 'correct' : 'incorrect'
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Activity 1.1A – Term Matching
        </h2>
        <p className="text-gray-600">
          Match each term to its definition
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <div className="flex items-start gap-3">
          <MousePointer2 className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-blue-800 text-sm">
            <strong>How to play:</strong> Click a term on the left, then click the definition on the right that matches it. 
            Match all 8 terms, then click &quot;Check Answers&quot;!
          </p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="bg-gray-100 rounded-lg p-3 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{matchCount} of {TERMS.length} matched</span>
        </div>
        <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-forest-500"
            initial={{ width: 0 }}
            animate={{ width: `${(matchCount / TERMS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Terms Column */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Terms (click one)</h3>
          <div className="space-y-2">
            {TERMS.map(({ term }) => {
              const isMatched = matchedTerms.includes(term)
              const isSelected = selectedTerm === term
              return (
                <motion.button
                  key={term}
                  onClick={() => handleTermClick(term)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-3 rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'bg-forest-500 text-white border-2 border-forest-600 shadow-lg'
                      : isMatched 
                      ? 'bg-gray-200 text-gray-500 border-2 border-gray-300' 
                      : 'bg-forest-100 text-forest-800 border-2 border-forest-300 hover:border-forest-400 hover:bg-forest-200'
                  }`}
                >
                  {term.charAt(0).toUpperCase() + term.slice(1)}
                  {isMatched && !isSelected && <span className="float-right">✓</span>}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Definitions Column */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Definitions (click to match)</h3>
          <div className="space-y-2">
            {shuffledDefinitions.map((definition) => {
              const matchedTerm = matches[definition]
              const result = getResultForDef(definition)
              
              return (
                <motion.button
                  key={definition}
                  onClick={() => handleDefinitionClick(definition)}
                  whileHover={selectedTerm ? { scale: 1.01 } : {}}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all min-h-[70px] ${
                    result === 'correct' 
                      ? 'border-green-400 bg-green-50' 
                      : result === 'incorrect'
                      ? 'border-red-400 bg-red-50'
                      : selectedTerm && !matchedTerm
                      ? 'border-forest-400 bg-forest-50 cursor-pointer hover:border-forest-500'
                      : matchedTerm
                      ? 'border-accent-300 bg-accent-50'
                      : 'border-gray-300 bg-gray-50'
                  } ${selectedTerm && !matchedTerm ? 'ring-2 ring-forest-300' : ''}`}
                >
                  <p className="text-sm text-gray-700 mb-2">{definition}</p>
                  {matchedTerm && (
                    <div className={`flex items-center gap-2 text-sm font-medium ${
                      result === 'correct' ? 'text-green-700' : result === 'incorrect' ? 'text-red-700' : 'text-accent-700'
                    }`}>
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

      {/* Results & Buttons */}
      <div className="mt-8">
        {checked && !allCorrect && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-amber-800">
              <strong>Almost there!</strong> Some matches aren&apos;t quite right. 
              The incorrect ones have been highlighted in red. Try again!
            </p>
          </div>
        )}

        {allCorrect && checked && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-800">
              <strong>🎉 Perfect!</strong> You matched all the terms correctly!
              {attempts > 1 && ` It took you ${attempts} attempt${attempts > 1 ? 's' : ''}.`}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {!(allCorrect && checked) && (
            <>
              <motion.button
                whileHover={remainingCount === 0 ? { scale: 1.02 } : {}}
                whileTap={remainingCount === 0 ? { scale: 0.98 } : {}}
                onClick={handleCheck}
                disabled={remainingCount > 0}
                className={`btn-primary px-6 py-3 ${
                  remainingCount > 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {remainingCount > 0 
                  ? `Match ${remainingCount} more term${remainingCount > 1 ? 's' : ''} first` 
                  : 'Check Answers'}
              </motion.button>
              {checked && !allCorrect && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="btn-outline px-6 py-3"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Try Again
                </motion.button>
              )}
            </>
          )}
          
          {allCorrect && checked && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onComplete({ 
                activity_11a_attempts: attempts,
                activity_11a_missed: missedTerms
              })}
              className="btn-primary px-8 py-3"
            >
              Continue <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
