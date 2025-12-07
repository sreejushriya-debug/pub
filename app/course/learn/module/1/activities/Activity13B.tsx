'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, Calculator, Eye } from 'lucide-react'
import Image from 'next/image'

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
  ]
  return piles.sort(() => Math.random() - 0.5)
}

const CoinImage = ({ type, count }: { type: string; count: number }) => {
  if (count === 0) return null
  
  const coinImages: Record<string, { src: string; size: number }> = {
    quarter: { src: '/coins/quarter.png', size: 40 },
    dime: { src: '/coins/dime.png', size: 28 },
    nickel: { src: '/coins/nickel.png', size: 36 },
    penny: { src: '/coins/penny.png', size: 32 },
  }
  
  const coin = coinImages[type]
  
  return (
    <div className="flex items-center">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className="relative"
          style={{ 
            width: coin.size, 
            height: coin.size,
            marginLeft: i > 0 ? '-8px' : '0',
            zIndex: count - i
          }}
        >
          <Image
            src={coin.src}
            alt={type}
            fill
            className="object-contain drop-shadow-md"
          />
        </div>
      ))}
    </div>
  )
}

export default function Activity13B({ onComplete }: Activity13BProps) {
  const [piles, setPiles] = useState<CoinPile[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [showHint, setShowHint] = useState<number | null>(null)

  useEffect(() => {
    setPiles(generatePiles())
  }, [])

  const handleChange = (pileId: number, value: string) => {
    if (revealed) return
    setAnswers({ ...answers, [pileId]: value })
    setChecked(false)
  }

  const normalizeAnswer = (input: string): number | null => {
    const cleaned = input.replace(/[¢$\s]/g, '')
    const num = parseFloat(cleaned)
    if (isNaN(num)) return null
    if (num < 1) return Math.round(num * 100)
    return Math.round(num)
  }

  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    setChecked(true)
  }

  const handleReveal = () => {
    setRevealed(true)
    const correctAnswers: Record<number, string> = {}
    piles.forEach(pile => {
      correctAnswers[pile.id] = pile.total.toString()
    })
    setAnswers(correctAnswers)
    setChecked(true)
  }

  const correctCount = piles.filter(pile => {
    const answer = normalizeAnswer(answers[pile.id] || '')
    return answer === pile.total
  }).length

  const allCorrect = correctCount === piles.length && checked

  const getResult = (pile: CoinPile): 'correct' | 'incorrect' | null => {
    if (!checked) return null
    const answer = normalizeAnswer(answers[pile.id] || '')
    return answer === pile.total ? 'correct' : 'incorrect'
  }

  const getExplanation = (pile: CoinPile) => {
    const parts = []
    if (pile.quarters) parts.push(`${pile.quarters} quarter${pile.quarters > 1 ? 's' : ''} × 25¢ = ${pile.quarters * 25}¢`)
    if (pile.dimes) parts.push(`${pile.dimes} dime${pile.dimes > 1 ? 's' : ''} × 10¢ = ${pile.dimes * 10}¢`)
    if (pile.nickels) parts.push(`${pile.nickels} nickel${pile.nickels > 1 ? 's' : ''} × 5¢ = ${pile.nickels * 5}¢`)
    if (pile.pennies) parts.push(`${pile.pennies} penn${pile.pennies > 1 ? 'ies' : 'y'} × 1¢ = ${pile.pennies}¢`)
    return {
      breakdown: parts.join('\n'),
      total: `Total: ${parts.map(p => p.split(' = ')[1]).join(' + ')} = ${pile.total}¢`
    }
  }

  if (piles.length === 0) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="p-6 md:p-8">
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
          <div className="text-blue-800 text-sm">
            <p><strong>Coin Values:</strong></p>
            <p>Quarter = 25¢ | Dime = 10¢ | Nickel = 5¢ | Penny = 1¢</p>
          </div>
        </div>
      </div>

      {/* Attempts indicator */}
      {attempts > 0 && !allCorrect && !revealed && (
        <div className="bg-gray-100 rounded-lg p-3 mb-6 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Attempts: {attempts}/3 | Score: {correctCount}/{piles.length}
          </span>
          {attempts >= 3 && (
            <button
              onClick={handleReveal}
              className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              <Eye className="w-4 h-4" /> Reveal Answers
            </button>
          )}
        </div>
      )}

      {/* Coin Piles */}
      <div className="space-y-6 mb-8">
        {piles.map((pile, index) => {
          const result = getResult(pile)
          const explanation = getExplanation(pile)
          
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
                <div className="flex flex-wrap items-center gap-4 flex-1">
                  <CoinImage type="quarter" count={pile.quarters} />
                  <CoinImage type="dime" count={pile.dimes} />
                  <CoinImage type="nickel" count={pile.nickels} />
                  <CoinImage type="penny" count={pile.pennies} />
                </div>
                
                {/* Answer Input */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">=</span>
                  <input
                    type="text"
                    value={answers[pile.id] || ''}
                    onChange={(e) => handleChange(pile.id, e.target.value)}
                    placeholder="?"
                    disabled={revealed}
                    className={`w-20 px-3 py-2 border-2 rounded-lg text-center font-bold focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                      result === 'correct'
                        ? 'border-green-400 bg-green-100 text-green-800'
                        : result === 'incorrect'
                        ? 'border-red-400 bg-red-100 text-red-800'
                        : 'border-gray-300'
                    } ${revealed ? 'cursor-default' : ''}`}
                  />
                  <span className="text-gray-600">¢</span>
                  
                  {result === 'correct' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                  {result === 'incorrect' && !revealed && (
                    <button 
                      onClick={() => setShowHint(showHint === pile.id ? null : pile.id)}
                      className="text-amber-600 hover:text-amber-700"
                    >
                      <Lightbulb className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Explanation when revealed or showing hint */}
              {(revealed || showHint === pile.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <p className="text-blue-800 text-sm font-medium mb-2">How to count:</p>
                  <pre className="text-blue-700 text-sm whitespace-pre-line">{explanation.breakdown}</pre>
                  <p className="text-blue-800 text-sm font-bold mt-2">{explanation.total}</p>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      {/* Results */}
      {checked && allCorrect && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800">
            <strong>🎉 Excellent!</strong> You counted all the coins correctly!
          </p>
        </div>
      )}

      {revealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800">
            <strong>📚 Learning moment!</strong> Review each pile above to see how the coins add up. 
            Remember: start with the biggest coins (quarters) and work down to the smallest (pennies)!
          </p>
        </div>
      )}

      {checked && !allCorrect && !revealed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800">
            <strong>You got {correctCount}/{piles.length} correct!</strong> Click the 💡 for hints.
            {attempts >= 3 && " Or click 'Reveal Answers' to see the solutions with step-by-step explanations."}
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        {!(allCorrect && checked) && !revealed && (
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
        
        {((allCorrect && checked) || revealed) && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ 
              activity_13b_correct: correctCount,
              activity_13b_attempts: attempts,
              activity_13b_revealed: revealed
            })}
            className="btn-primary px-8 py-3"
          >
            Continue to Reflection <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}
