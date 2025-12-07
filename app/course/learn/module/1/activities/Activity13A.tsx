'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, Coins } from 'lucide-react'

interface Activity13AProps {
  onComplete: (data: Record<string, unknown>) => void
}

const COINS = [
  { 
    id: 'penny', 
    name: 'Penny', 
    value: 1, 
    color: 'bg-amber-600',
    description: 'The smallest coin, copper/bronze colored, worth 1 cent'
  },
  { 
    id: 'nickel', 
    name: 'Nickel', 
    value: 5, 
    color: 'bg-gray-400',
    description: 'Larger than a penny, silver colored, worth 5 cents'
  },
  { 
    id: 'dime', 
    name: 'Dime', 
    value: 10, 
    color: 'bg-gray-300',
    description: 'The smallest silver coin, worth 10 cents'
  },
  { 
    id: 'quarter', 
    name: 'Quarter', 
    value: 25, 
    color: 'bg-gray-400',
    description: 'The largest common coin, silver with ridged edge, worth 25 cents'
  },
]

export default function Activity13A({ onComplete }: Activity13AProps) {
  // Shuffle coins for display
  const [shuffledCoins] = useState(() => [...COINS].sort(() => Math.random() - 0.5))
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const handleSelect = (coinId: string, value: string) => {
    setAnswers({ ...answers, [coinId]: value })
    setChecked(false)
  }

  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    setChecked(true)
  }

  const allCorrect = shuffledCoins.every(coin => answers[coin.id] === coin.name)

  const getResult = (coin: typeof COINS[0]) => {
    if (!checked) return null
    return answers[coin.id] === coin.name ? 'correct' : 'incorrect'
  }

  return (
    <div className="p-8">
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
            <strong>Tip:</strong> Remember, a dime is the smallest silver coin but worth more than a nickel!
          </p>
        </div>
      </div>

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
              {/* Coin Visual */}
              <div className="flex justify-center mb-4">
                <div className={`relative ${
                  coin.id === 'penny' ? 'w-16 h-16' :
                  coin.id === 'nickel' ? 'w-20 h-20' :
                  coin.id === 'dime' ? 'w-14 h-14' :
                  'w-24 h-24'
                } rounded-full ${coin.color} shadow-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{coin.value}¢</span>
                </div>
              </div>

              {/* Selection */}
              <div className="space-y-2">
                {['Penny', 'Nickel', 'Dime', 'Quarter'].map(name => {
                  const isSelected = answers[coin.id] === name
                  const isCorrectAnswer = name === coin.name
                  
                  let btnClass = 'border-gray-200 hover:border-gray-300'
                  if (checked) {
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
                      disabled={checked && allCorrect}
                      className={`w-full py-2 px-4 rounded-lg border-2 transition-all flex items-center justify-between ${btnClass}`}
                    >
                      <span className={isSelected ? 'font-medium' : ''}>{name}</span>
                      {checked && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {checked && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Feedback for incorrect */}
              {result === 'incorrect' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 mt-3"
                >
                  {coin.description}
                </motion.p>
              )}
            </div>
          )
        })}
      </div>

      {/* Results */}
      {checked && allCorrect && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800">
            <strong>🎉 Perfect!</strong> You identified all the coins correctly!
          </p>
        </div>
      )}

      {checked && !allCorrect && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800">
            <strong>Almost!</strong> Check the hints under the incorrect coins and try again.
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        {!(allCorrect && checked) && (
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
        
        {allCorrect && checked && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ activity_13a_attempts: attempts })}
            className="btn-primary px-8 py-3"
          >
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

