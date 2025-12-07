'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, RotateCcw, CheckCircle2, XCircle, Lightbulb } from 'lucide-react'

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
  const [draggedTerm, setDraggedTerm] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [missedTerms, setMissedTerms] = useState<string[]>([])
  
  // Shuffle definitions on mount
  const [shuffledDefinitions] = useState(() => 
    [...TERMS].sort(() => Math.random() - 0.5).map(t => t.definition)
  )

  const handleDragStart = (term: string) => {
    setDraggedTerm(term)
  }

  const handleDrop = (definition: string) => {
    if (draggedTerm) {
      // Remove term from any previous match
      const newMatches = { ...matches }
      Object.keys(newMatches).forEach(key => {
        if (newMatches[key] === draggedTerm) {
          delete newMatches[key]
        }
      })
      newMatches[definition] = draggedTerm
      setMatches(newMatches)
      setDraggedTerm(null)
      setChecked(false)
    }
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
    const incorrect: Record<string, string> = {}
    TERMS.forEach(({ term, definition }) => {
      if (matches[definition] === term) {
        incorrect[definition] = term
      }
    })
    setMatches(incorrect)
    setChecked(false)
  }

  const allCorrect = TERMS.every(({ term, definition }) => matches[definition] === term)
  const matchedTerms = Object.values(matches)

  const getResultForDef = (definition: string): 'correct' | 'incorrect' | null => {
    if (!checked) return null
    const correctTerm = TERMS.find(t => t.definition === definition)?.term
    return matches[definition] === correctTerm ? 'correct' : 'incorrect'
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Activity 1.1A – Drag & Drop Term Matching
        </h2>
        <p className="text-gray-600">
          Drag each term to its matching definition
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
          <p className="text-blue-800 text-sm">
            <strong>How to play:</strong> Click and hold a term card, then drag it to the definition box you think matches. 
            When all terms are placed, click &ldquo;Check Answers&rdquo; to see how you did!
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Terms Column */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Terms</h3>
          <div className="space-y-2">
            {TERMS.map(({ term }) => {
              const isMatched = matchedTerms.includes(term)
              return (
                <motion.div
                  key={term}
                  draggable={!isMatched || !checked || !allCorrect}
                  onDragStart={() => handleDragStart(term)}
                  onDragEnd={() => setDraggedTerm(null)}
                  whileHover={{ scale: isMatched && checked && allCorrect ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 rounded-lg font-medium cursor-grab active:cursor-grabbing transition-all ${
                    isMatched 
                      ? 'bg-gray-200 text-gray-400' 
                      : 'bg-forest-100 text-forest-800 border-2 border-forest-300 hover:border-forest-400'
                  } ${draggedTerm === term ? 'opacity-50' : ''}`}
                >
                  {term.charAt(0).toUpperCase() + term.slice(1)}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Definitions Column */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Definitions</h3>
          <div className="space-y-2">
            {shuffledDefinitions.map((definition) => {
              const matchedTerm = matches[definition]
              const result = getResultForDef(definition)
              
              return (
                <div
                  key={definition}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(definition)}
                  className={`p-3 rounded-lg border-2 transition-all min-h-[60px] ${
                    result === 'correct' 
                      ? 'border-green-400 bg-green-50' 
                      : result === 'incorrect'
                      ? 'border-red-400 bg-red-50'
                      : matchedTerm
                      ? 'border-accent-300 bg-accent-50'
                      : 'border-dashed border-gray-300 bg-gray-50'
                  }`}
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
                </div>
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

        <div className="flex justify-center gap-4">
          {!allCorrect && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheck}
                disabled={Object.keys(matches).length < TERMS.length}
                className={`btn-primary px-6 py-3 ${
                  Object.keys(matches).length < TERMS.length ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Check Answers
              </motion.button>
              {checked && (
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

