'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CreditCard, Ban } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const SCENARIOS = [
  { id: 1, text: 'Your car breaks down and you need it to get to work. The repair costs $500 and you only have $100 saved.', recommended: 'use' },
  { id: 2, text: 'Your favorite band is having a concert and tickets are $150. You don\'t have the money right now but really want to go.', recommended: 'dont' },
  { id: 3, text: 'You need a laptop for school starting next week. It costs $600 and you have $200 saved.', recommended: 'use' },
  { id: 4, text: 'A new video game just came out for $70. All your friends are playing it.', recommended: 'dont' },
]

export default function Activity33C({ onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, { choice: string; reason: string }>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleChoice = (id: number, choice: 'use' | 'dont') => {
    setAnswers({ ...answers, [id]: { ...answers[id], choice } })
  }

  const handleReason = (id: number, reason: string) => {
    setAnswers({ ...answers, [id]: { ...answers[id], reason } })
  }

  const allAnswered = SCENARIOS.every(s => answers[s.id]?.choice && answers[s.id]?.reason?.length > 10)

  if (submitted) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Great Thinking! 🤔</h2>
          <p className="text-gray-600">You thought carefully about when to use credit.</p>
        </div>

        <div className="space-y-4 mb-8">
          {SCENARIOS.map(s => {
            const answer = answers[s.id]
            const matchesRecommended = answer?.choice === s.recommended
            return (
              <div key={s.id} className={`p-4 rounded-xl border-2 ${matchesRecommended ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
                <p className="text-gray-700 text-sm mb-2">{s.text}</p>
                <p className={`font-medium ${matchesRecommended ? 'text-green-700' : 'text-amber-700'}`}>
                  Your choice: {answer?.choice === 'use' ? '✓ Use Credit' : '✗ Don\'t Use Credit'}
                </p>
                <p className="text-gray-600 text-sm mt-1 italic">&ldquo;{answer?.reason}&rdquo;</p>
                {!matchesRecommended && (
                  <p className="text-amber-600 text-sm mt-2">
                    💡 Tip: Think about needs vs wants. {s.recommended === 'use' ? 'This seems like a need worth using credit for.' : 'This is more of a want - better to save up!'}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ credit_scenarios: answers })} className="btn-primary px-8 py-3">
            Continue to Investing <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Activity 3.3C – Would You Use Credit?</h2>
        <p className="text-gray-600">Decide if you would use credit in each situation and explain why</p>
      </div>

      <div className="space-y-6 mb-8">
        {SCENARIOS.map(s => (
          <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-gray-800 mb-4">{s.text}</p>
            
            <div className="flex gap-3 mb-4">
              <button onClick={() => handleChoice(s.id, 'use')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                  answers[s.id]?.choice === 'use' ? 'border-forest-500 bg-forest-50 text-forest-700' : 'border-gray-200 hover:border-forest-300'
                }`}>
                <CreditCard className="w-5 h-5" /> Use Credit
              </button>
              <button onClick={() => handleChoice(s.id, 'dont')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                  answers[s.id]?.choice === 'dont' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-red-300'
                }`}>
                <Ban className="w-5 h-5" /> Don&apos;t Use Credit
              </button>
            </div>

            {answers[s.id]?.choice && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Explain your reasoning:</label>
                <textarea
                  value={answers[s.id]?.reason || ''}
                  onChange={(e) => handleReason(s.id, e.target.value)}
                  placeholder="I think this because..."
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 h-20 resize-none"
                />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={allAnswered ? { scale: 1.02 } : {}} whileTap={allAnswered ? { scale: 0.98 } : {}}
          onClick={() => setSubmitted(true)} disabled={!allAnswered}
          className={`btn-primary px-8 py-3 ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}>
          Submit My Answers
        </motion.button>
      </div>
    </div>
  )
}

