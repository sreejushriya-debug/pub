'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CreditCard, CheckCircle2 } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const SCENARIOS = [
  {
    id: 1,
    title: 'Broken Phone',
    description: 'Your phone broke and you need it for school. It costs $200 to fix.',
    recommended: 'Use cash now',
    explanation: 'If you have the money, using cash avoids interest. If not, this is a need, so credit might be okay if you can pay it back quickly.'
  },
  {
    id: 2,
    title: 'Flashy Sneakers',
    description: 'You see cool sneakers you really want. They cost $150.',
    recommended: 'Save first',
    explanation: 'This is a want, not a need. It\'s better to save up first rather than use credit for non-essential items.'
  },
  {
    id: 3,
    title: 'Emergency Vet Bill',
    description: 'Your pet needs emergency surgery. It costs $500.',
    recommended: 'Use cash now',
    explanation: 'This is an emergency and a need. If you have savings, use them. If not, credit might be necessary, but pay it back as soon as possible.'
  },
  {
    id: 4,
    title: 'Used Laptop for Classes',
    description: 'You need a laptop for school. A used one costs $300.',
    recommended: 'Save first',
    explanation: 'This is a need, but not an emergency. Try to save up first. If you must use credit, make sure you can pay it back quickly.'
  },
  {
    id: 5,
    title: 'Concert Tickets',
    description: 'Your favorite band is coming to town. Tickets cost $75.',
    recommended: 'Save first',
    explanation: 'This is a want. Always save for wants rather than using credit, which adds interest and makes things more expensive.'
  },
]

export default function Activity64A({ onComplete }: Props) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [answers, setAnswers] = useState<Record<number, { choice: string; why: string }>>({})
  const [submitted, setSubmitted] = useState(false)

  const scenario = SCENARIOS[currentScenario]
  const scenarioAnswers = answers[scenario.id] || { choice: '', why: '' }

  const handleSubmit = () => {
    if (!scenarioAnswers.choice || !scenarioAnswers.why.trim() || scenarioAnswers.why.trim().length < 10) return
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(prev => prev + 1)
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Great Thinking! 💳</h2>
          <p className="text-gray-600">You made smart financial decisions!</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
          <p className="text-blue-800 text-sm">
            <strong>💡 Key Takeaway:</strong> Use credit wisely - for emergencies and needs when necessary, but always save for wants. 
            Pay off credit quickly to avoid high interest!
          </p>
        </div>

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ scenarios: answers })} className="btn-primary px-8 py-3">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CreditCard className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 6.4A – Save, Spend, or Borrow?</h2>
        </div>
        <p className="text-gray-600">Make smart financial decisions for each scenario</p>
        <div className="mt-2 text-sm text-gray-500">Scenario {currentScenario + 1} of {SCENARIOS.length}</div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{scenario.title}</h3>
        <p className="text-gray-700 mb-6">{scenario.description}</p>

        <div className="mb-6">
          <label className="block font-semibold text-gray-900 mb-3">What would you do?</label>
          <div className="grid sm:grid-cols-2 gap-3">
            {['Save first', 'Use cash now', 'Use credit', 'Don\'t buy it'].map(option => (
              <button key={option} onClick={() => setAnswers({ ...answers, [scenario.id]: { ...scenarioAnswers, choice: option } })}
                className={`p-3 rounded-lg border-2 font-medium transition-all ${
                  scenarioAnswers.choice === option ? 'border-forest-500 bg-forest-50 text-forest-700' : 'border-gray-200 hover:border-forest-300'
                }`}>
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-900 mb-2">Why?</label>
          <textarea value={scenarioAnswers.why} onChange={(e) => setAnswers({ ...answers, [scenario.id]: { ...scenarioAnswers, why: e.target.value } })}
            placeholder="I would choose this because..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
          <p className="text-xs text-gray-400 mt-1">{scenarioAnswers.why.length}/10 characters minimum</p>
        </div>
      </div>

      {scenarioAnswers.choice && scenarioAnswers.why.trim().length >= 10 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 max-w-2xl mx-auto">
          <p className="text-blue-800 text-sm">
            <strong>💡 Tip:</strong> {scenario.explanation}
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!scenarioAnswers.choice || !scenarioAnswers.why.trim() || scenarioAnswers.why.trim().length < 10}
          className={`btn-primary px-8 py-3 ${!scenarioAnswers.choice || !scenarioAnswers.why.trim() || scenarioAnswers.why.trim().length < 10 ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {currentScenario < SCENARIOS.length - 1 ? 'Next Scenario' : 'Submit All'} <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}

