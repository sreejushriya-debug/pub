'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, Coins, Eye } from 'lucide-react'
import Image from 'next/image'

interface Activity13AProps {
  onComplete: (data: Record<string, unknown>) => void
}

const COINS = [
  { 
    id: 'penny', 
    name: 'Penny', 
    value: 1, 
    image: '/coins/penny.png',
    description: 'The penny shows Abraham Lincoln. It\'s copper/bronze colored and worth 1 cent. It\'s the only U.S. coin where the person faces right!'
  },
  { 
    id: 'nickel', 
    name: 'Nickel', 
    value: 5, 
    image: '/coins/nickel.png',
    description: 'The nickel shows Thomas Jefferson. It\'s silver colored, larger than a penny, and worth 5 cents.'
  },
  { 
    id: 'dime', 
    name: 'Dime', 
    value: 10, 
    image: '/coins/dime.png',
    description: 'The dime shows Franklin D. Roosevelt. It\'s the smallest U.S. coin but worth 10 cents - more than the bigger nickel!'
  },
  { 
    id: 'quarter', 
    name: 'Quarter', 
    value: 25, 
    image: '/coins/quarter.png',
    description: 'The quarter shows George Washington. It\'s the largest common coin and worth 25 cents (a quarter of a dollar).'
  },
]

export default function Activity13A({ onComplete }: Activity13AProps) {
  // Shuffle coins for display
  const [shuffledCoins] = useState(() => [...COINS].sort(() => Math.random() - 0.5))
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const handleSelect = (coinId: string, value: string) => {
    if (revealed) return
    setAnswers({ ...answers, [coinId]: value })
    setChecked(false)
  }

  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    setChecked(true)
  }

  const handleReveal = () => {
    setRevealed(true)
    // Set all correct answers
    const correctAnswers: Record<string, string> = {}
    COINS.forEach(coin => {
      correctAnswers[coin.id] = coin.name
    })
    setAnswers(correctAnswers)
    setChecked(true)
  }

  const allCorrect = shuffledCoins.every(coin => answers[coin.id] === coin.name)

  const getResult = (coin: typeof COINS[0]) => {
    if (!checked) return null
    return answers[coin.id] === coin.name ? 'correct' : 'incorrect'
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Coins className="w-6 h-6 text-accent-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Activity 1.3A – Coin Identification
          </h2>
        </div>
        <p className="text-gray-600">
          Identify each coin by selecting the correct name
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
          <p className="text-blue-800 text-sm">
            <strong>Tip:</strong> Look at the size and color of each coin. The dime is the smallest but worth more than the bigger nickel!
          </p>
        </div>
      </div>

      {/* Attempts indicator */}
      {attempts > 0 && !allCorrect && !revealed && (
        <div className="bg-gray-100 rounded-lg p-3 mb-6 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Attempts: {attempts}/3
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

      {/* Coins Grid */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {shuffledCoins.map((coin) => {
          const result = getResult(coin)
          
          return (
            <div 
              key={coin.id}
              className={`p-6 rounded-xl border-2 transition-all ${
                result === 'correct' 
                  ? 'border-green-400 bg-green-50' 
                  : result === 'incorrect'
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* Coin Image */}
              <div className="flex justify-center mb-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={coin.image}
                    alt="Coin"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Selection */}
              <div className="space-y-2">
                {['Penny', 'Nickel', 'Dime', 'Quarter'].map(name => {
                  const isSelected = answers[coin.id] === name
                  const isCorrectAnswer = name === coin.name
                  
                  let btnClass = 'border-gray-200 hover:border-gray-300'
                  if (checked || revealed) {
                    if (isCorrectAnswer) {
                      btnClass = 'border-green-400 bg-green-100'
                    } else if (isSelected && !isCorrectAnswer) {
                      btnClass = 'border-red-400 bg-red-100'
                    }
                  } else if (isSelected) {
                    btnClass = 'border-forest-400 bg-forest-50'
                  }

                  return (
                    <button
                      key={name}
                      onClick={() => handleSelect(coin.id, name)}
                      disabled={(checked && allCorrect) || revealed}
                      className={`w-full py-2 px-4 rounded-lg border-2 transition-all flex items-center justify-between ${btnClass} ${revealed ? 'cursor-default' : ''}`}
                    >
                      <span className={isSelected ? 'font-medium' : ''}>{name}</span>
                      {(checked || revealed) && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {checked && isSelected && !isCorrectAnswer && !revealed && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Explanation when revealed or correct */}
              {(revealed || (result === 'correct' && checked)) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <p className="text-blue-800 text-sm">{coin.description}</p>
                </motion.div>
              )}

              {/* Hint for incorrect (not revealed) */}
              {result === 'incorrect' && !revealed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 mt-3"
                >
                  Not quite! Try again or check the tip above.
                </motion.p>
              )}
            </div>
          )
        })}
      </div>

      {/* Results */}
      {checked && allCorrect && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800">
            <strong>🎉 Perfect!</strong> You identified all the coins correctly!
          </p>
        </div>
      )}

      {revealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800">
            <strong>📚 Learning moment!</strong> Take a look at each coin and read the explanations. 
            These are the four most common U.S. coins you&apos;ll use every day!
          </p>
        </div>
      )}

      {checked && !allCorrect && !revealed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800">
            <strong>Almost!</strong> Check the hints and try again.
            {attempts >= 3 && " Or click 'Reveal Answers' above to see the correct answers with explanations."}
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
            disabled={Object.keys(answers).length < 4}
            className={`btn-primary px-6 py-3 ${
              Object.keys(answers).length < 4 ? 'opacity-50 cursor-not-allowed' : ''
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
              activity_13a_attempts: attempts,
              activity_13a_revealed: revealed
            })}
            className="btn-primary px-8 py-3"
          >
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}
