'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, Eye, RotateCcw } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const SCENARIOS = [
  {
    id: 1,
    text: 'A cotton candy machine is upgraded to make candy faster and cheaper.',
    good: 'Available',
    production: 'Decrease',
    product: 'Decrease',
    explanation: 'When production gets easier and cheaper, the product becomes more available and costs less!'
  },
  {
    id: 2,
    text: 'An earthquake damages a mining site where metal is extracted.',
    good: 'Scarce',
    production: 'Increase',
    product: 'Increase',
    explanation: 'When it\'s harder to get materials, production costs go up and the product becomes scarce and more expensive.'
  },
  {
    id: 3,
    text: 'Chickens become unhealthy, so fewer eggs are produced.',
    good: 'Scarce',
    production: 'Increase',
    product: 'Increase',
    explanation: 'Fewer eggs means scarcity. It costs more to produce (sick chickens), so prices go up.'
  },
  {
    id: 4,
    text: 'A company finds cheaper ink to make pens.',
    good: 'Available',
    production: 'Decrease',
    product: 'Decrease',
    explanation: 'Cheaper materials mean lower production costs, so pens become more available and cheaper!'
  },
]

export default function Activity43A({ onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, { good: string; production: string; product: string }>>({})
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    setChecked(true)
  }

  const handleReveal = () => {
    setRevealed(true)
    const correct: Record<number, { good: string; production: string; product: string }> = {}
    SCENARIOS.forEach(s => {
      correct[s.id] = { good: s.good, production: s.production, product: s.product }
    })
    setAnswers(correct)
    setChecked(true)
  }

  const handleTryAgain = () => {
    const correct: Record<number, { good: string; production: string; product: string }> = {}
    SCENARIOS.forEach(s => {
      const current = answers[s.id]
      if (current?.good === s.good && current?.production === s.production && current?.product === s.product) {
        correct[s.id] = current
      }
    })
    setAnswers(correct)
    setChecked(false)
  }

  const allCorrect = SCENARIOS.every(s => {
    const ans = answers[s.id]
    return ans?.good === s.good && ans?.production === s.production && ans?.product === s.product
  })

  const allAnswered = SCENARIOS.every(s => answers[s.id]?.good && answers[s.id]?.production && answers[s.id]?.product)

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Activity 4.3A – Scarcity & Cost Impacts</h2>
        <p className="text-gray-600">Classify how each scenario affects availability and costs</p>
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

      <div className="space-y-6 mb-8">
        {SCENARIOS.map(scenario => {
          const ans = answers[scenario.id] || { good: '', production: '', product: '' }
          const goodCorrect = checked && ans.good === scenario.good
          const goodWrong = checked && ans.good && ans.good !== scenario.good
          const prodCorrect = checked && ans.production === scenario.production
          const prodWrong = checked && ans.production && ans.production !== scenario.production
          const prodCostCorrect = checked && ans.product === scenario.product
          const prodCostWrong = checked && ans.product && ans.product !== scenario.product

          return (
            <div key={scenario.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="font-medium text-gray-900 mb-4">{scenario.text}</p>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Impact on Good:</label>
                  <select value={ans.good} onChange={(e) => setAnswers({ ...answers, [scenario.id]: { ...ans, good: e.target.value } })}
                    disabled={revealed}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                      goodCorrect ? 'border-green-400 bg-green-50' : goodWrong ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}>
                    <option value="">Select...</option>
                    <option value="Available">Available</option>
                    <option value="Scarce">Scarce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost of Production:</label>
                  <select value={ans.production} onChange={(e) => setAnswers({ ...answers, [scenario.id]: { ...ans, production: e.target.value } })}
                    disabled={revealed}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                      prodCorrect ? 'border-green-400 bg-green-50' : prodWrong ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}>
                    <option value="">Select...</option>
                    <option value="Increase">Increase</option>
                    <option value="Decrease">Decrease</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost of Product:</label>
                  <select value={ans.product} onChange={(e) => setAnswers({ ...answers, [scenario.id]: { ...ans, product: e.target.value } })}
                    disabled={revealed}
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                      prodCostCorrect ? 'border-green-400 bg-green-50' : prodCostWrong ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}>
                    <option value="">Select...</option>
                    <option value="Increase">Increase</option>
                    <option value="Decrease">Decrease</option>
                  </select>
                </div>
              </div>

              {(revealed || (checked && (!goodCorrect || !prodCorrect || !prodCostCorrect))) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm"><strong>Explanation:</strong> {scenario.explanation}</p>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      {checked && allCorrect && !revealed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Perfect!</strong> You correctly classified all the impacts!</p>
        </div>
      )}

      {revealed && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800"><strong>📚 Learning moment!</strong> Review the explanations above. Remember: scarcity usually means higher costs!</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!((allCorrect && checked) || revealed) && (
          <>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheck}
              disabled={!allAnswered}
              className={`btn-primary px-6 py-3 ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
            onClick={() => onComplete({ activity_43a_attempts: attempts, activity_43a_revealed: revealed })}
            className="btn-primary px-8 py-3">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

