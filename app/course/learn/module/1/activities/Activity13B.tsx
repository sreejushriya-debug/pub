'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, Calculator, RotateCcw } from 'lucide-react'

interface Activity13BProps {
  onComplete: (data: Record<string, unknown>) => void
}

interface CoinPile {
  id: number
  quarters: number
  dimes: number
  nickels: number
  pennies: number
  total: number
}

const generatePiles = (): CoinPile[] => {
  const piles: CoinPile[] = [
    { id: 1, quarters: 0, dimes: 1, nickels: 1, pennies: 2, total: 17 },
    { id: 2, quarters: 1, dimes: 2, nickels: 0, pennies: 1, total: 46 },
    { id: 3, quarters: 1, dimes: 1, nickels: 0, pennies: 0, total: 35 },
    { id: 4, quarters: 2, dimes: 1, nickels: 0, pennies: 0, total: 60 },
    { id: 5, quarters: 0, dimes: 3, nickels: 2, pennies: 3, total: 43 },
    { id: 6, quarters: 3, dimes: 0, nickels: 1, pennies: 2, total: 82 },
  ]
  return piles.slice(0, 5).sort(() => Math.random() - 0.5)
}

const CoinDisplay = ({ type, count }: { type: string; count: number }) => {
  if (count === 0) return null
  
  const coinStyles: Record<string, { size: string; color: string; value: string }> = {
    quarter: { size: 'w-10 h-10', color: 'bg-gray-400', value: '25¢' },
    dime: { size: 'w-6 h-6', color: 'bg-gray-300', value: '10¢' },
    nickel: { size: 'w-8 h-8', color: 'bg-gray-400', value: '5¢' },
    penny: { size: 'w-7 h-7', color: 'bg-amber-600', value: '1¢' },
  }
  
  const style = coinStyles[type]
  
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className={`${style.size} rounded-full ${style.color} shadow-md flex items-center justify-center`}
          style={{ marginLeft: i > 0 ? '-8px' : '0' }}
        >
          <span className="text-white text-xs font-bold">{style.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function Activity13B({ onComplete }: Activity13BProps) {
  const [piles, setPiles] = useState<CoinPile[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [showHint, setShowHint] = useState<number | null>(null)

  useEffect(() => {
    setPiles(generatePiles())
  }, [])

  const handleChange = (pileId: number, value: string) => {
    setAnswers({ ...answers, [pileId]: value })
    setChecked(false)
  }

  const normalizeAnswer = (input: string): number | null => {
    // Accept formats: 17, 17¢, $0.17, 0.17
    const cleaned = input.replace(/[¢$\s]/g, '')
    const num = parseFloat(cleaned)
    if (isNaN(num)) return null
    // If they entered 0.17, convert to 17
    if (num < 1) return Math.round(num * 100)
    return Math.round(num)
  }

  const handleCheck = () => {
    setChecked(true)
    let correct = 0
    piles.forEach(pile => {
      const answer = normalizeAnswer(answers[pile.id] || '')
      if (answer === pile.total) correct++
    })
    setCorrectCount(correct)
  }

  const allCorrect = correctCount === piles.length && checked

  const getResult = (pile: CoinPile): 'correct' | 'incorrect' | null => {
    if (!checked) return null
    const answer = normalizeAnswer(answers[pile.id] || '')
    return answer === pile.total ? 'correct' : 'incorrect'
  }

  const getHintText = (pile: CoinPile) => {
    const parts = []
    if (pile.quarters) parts.push(`${pile.quarters} quarter${pile.quarters > 1 ? 's' : ''} (${pile.quarters * 25}¢)`)
    if (pile.dimes) parts.push(`${pile.dimes} dime${pile.dimes > 1 ? 's' : ''} (${pile.dimes * 10}¢)`)
    if (pile.nickels) parts.push(`${pile.nickels} nickel${pile.nickels > 1 ? 's' : ''} (${pile.nickels * 5}¢)`)
    if (pile.pennies) parts.push(`${pile.pennies} penn${pile.pennies > 1 ? 'ies' : 'y'} (${pile.pennies}¢)`)
    return `Count: ${parts.join(' + ')} = ${pile.total}¢`
  }

  if (piles.length === 0) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calculator className="w-6 h-6 text-accent-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Activity 1.3B – Count the Coins
          </h2>
        </div>
        <p className="text-gray-600">
          Add up the coins in each pile and enter the total in cents
        </p>
      </div>

      {/* Tip */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
          <p className="text-blue-800 text-sm">
            <strong>Tip:</strong> Start by counting the biggest coins first (quarters = 25¢, dimes = 10¢, nickels = 5¢, pennies = 1¢)
          </p>
        </div>
      </div>

      {/* Coin Piles */}
      <div className="space-y-6 mb-8">
        {piles.map((pile, index) => {
          const result = getResult(pile)
          
          return (
            <div 
              key={pile.id}
              className={`p-6 rounded-xl border-2 transition-all ${
                result === 'correct' 
                  ? 'border-green-400 bg-green-50' 
                  : result === 'incorrect'
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="font-semibold text-gray-700 shrink-0">
                  Pile {index + 1}:
                </span>
                
                {/* Coins Display */}
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  <CoinDisplay type="quarter" count={pile.quarters} />
                  <CoinDisplay type="dime" count={pile.dimes} />
                  <CoinDisplay type="nickel" count={pile.nickels} />
                  <CoinDisplay type="penny" count={pile.pennies} />
                </div>
                
                {/* Answer Input */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">=</span>
                  <input
                    type="text"
                    value={answers[pile.id] || ''}
                    onChange={(e) => handleChange(pile.id, e.target.value)}
                    placeholder="?"
                    className={`w-20 px-3 py-2 border-2 rounded-lg text-center font-bold focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                      result === 'correct'
                        ? 'border-green-400 bg-green-100 text-green-800'
                        : result === 'incorrect'
                        ? 'border-red-400 bg-red-100 text-red-800'
                        : 'border-gray-300'
                    }`}
                  />
                  <span className="text-gray-600">¢</span>
                  
                  {result === 'correct' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                  {result === 'incorrect' && (
                    <button 
                      onClick={() => setShowHint(showHint === pile.id ? null : pile.id)}
                      className="text-amber-600 hover:text-amber-700"
                    >
                      <Lightbulb className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Hint */}
              {showHint === pile.id && result === 'incorrect' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <p className="text-amber-800 text-sm">{getHintText(pile)}</p>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      {/* Results */}
      {checked && allCorrect && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800">
            <strong>🎉 Excellent!</strong> You counted all the coins correctly!
          </p>
        </div>
      )}

      {checked && !allCorrect && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800">
            <strong>You got {correctCount}/{piles.length} correct!</strong> Click the lightbulb 💡 for hints on the ones you missed.
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        {!allCorrect && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheck}
            disabled={Object.keys(answers).length < piles.length}
            className={`btn-primary px-6 py-3 ${
              Object.keys(answers).length < piles.length ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Check Answers
          </motion.button>
        )}
        
        {allCorrect && checked && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ activity_13b_correct: correctCount })}
            className="btn-primary px-8 py-3"
          >
            Continue to Reflection <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

