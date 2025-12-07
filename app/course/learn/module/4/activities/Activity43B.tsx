'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, PenLine } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

export default function Activity43B({ onComplete }: Props) {
  const [scenario, setScenario] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (scenario.trim().length < 30) {
      setError('Please write 2-3 sentences explaining your scenario (30+ characters)')
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PenLine className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Great Example! ✍️</h2>
          <p className="text-gray-600">You created your own scarcity scenario!</p>
        </div>

        <div className="bg-forest-50 rounded-xl p-4 border border-forest-200 mb-8">
          <p className="text-gray-800 italic">&ldquo;{scenario}&rdquo;</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>💡 Key concept:</strong> When something becomes scarce (harder to get), production costs usually increase, 
            and the product price goes up. When something becomes more available (easier to make), costs and prices usually decrease!
          </p>
        </div>

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ scarcity_scenario: scenario })} className="btn-primary px-8 py-3">
            Continue to Business Vocabulary <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <PenLine className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 4.3B – Create Your Own Scarcity Scenario</h2>
        </div>
        <p className="text-gray-600">Write your own example of something becoming more scarce or more available</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Example:</strong> &quot;A drought makes it harder to grow wheat. This increases the cost of making bread, 
          so bread becomes more scarce and expensive.&quot;
        </p>
      </div>

      <div className="mb-6">
        <label className="block font-semibold text-gray-900 mb-2">
          Write your own example (2-3 sentences):
        </label>
        <textarea value={scenario} onChange={(e) => { setScenario(e.target.value); setError('') }}
          placeholder="Example: A new technology makes it easier to produce..."
          className={`w-full p-4 border-2 rounded-xl h-32 resize-none focus:outline-none focus:ring-2 focus:ring-forest-500 ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        <p className="text-xs text-gray-400 mt-1">{scenario.length}/30 characters minimum</p>
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSubmit} className="btn-primary px-8 py-3">
          Submit My Scenario
        </motion.button>
      </div>
    </div>
  )
}

