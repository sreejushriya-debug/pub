'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const QUESTIONS = [
  { id: 'profit', question: 'If you bought this stock on Day 1 ($5) and sold on Day 10 ($6), would you make money or lose money?', placeholder: 'I would...' },
  { id: 'feeling', question: 'How would it feel to watch this stock go down some days and up others?', placeholder: 'I think I would feel...' },
  { id: 'advice', question: 'Would you recommend buying this stock to a friend? Why or why not?', placeholder: 'I would/wouldn\'t recommend it because...' },
]

export default function Activity34C({ onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = QUESTIONS.every(q => answers[q.id]?.trim().length > 15)

  if (submitted) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Great Reflection! 📊</h2>
          <p className="text-gray-600">You&apos;re thinking like an investor!</p>
        </div>

        <div className="space-y-4 mb-8">
          {QUESTIONS.map(q => (
            <div key={q.id} className="bg-forest-50 rounded-xl p-4 border border-forest-200">
              <p className="font-semibold text-forest-800 mb-2">{q.question}</p>
              <p className="text-gray-700 italic">&ldquo;{answers[q.id]}&rdquo;</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>📚 Key takeaway:</strong> Even though this stock ended higher than it started (+$1 profit!), 
            watching it go up and down can be stressful. That&apos;s why investing is for money you don&apos;t need right away!
          </p>
        </div>

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ investment_reflection: answers })} className="btn-primary px-8 py-3">
            Continue to Checks & Deposits <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Activity 3.4C – Investment Reflection</h2>
        <p className="text-gray-600">Think about what it would be like to own this stock</p>
      </div>

      {/* Mini chart reminder */}
      <div className="bg-gray-100 rounded-xl p-4 mb-6 text-center">
        <p className="text-sm text-gray-600 mb-2">Remember the stock:</p>
        <p className="font-mono text-lg">Day 1: $5 → Day 10: $6 (with ups and downs in between)</p>
      </div>

      <div className="space-y-6 mb-8">
        {QUESTIONS.map(q => (
          <div key={q.id}>
            <label className="block font-semibold text-gray-900 mb-2">{q.question}</label>
            <textarea
              value={answers[q.id] || ''}
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
              placeholder={q.placeholder}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 h-24 resize-none"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={allAnswered ? { scale: 1.02 } : {}} whileTap={allAnswered ? { scale: 0.98 } : {}}
          onClick={() => setSubmitted(true)} disabled={!allAnswered}
          className={`btn-primary px-8 py-3 ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}>
          Submit Reflection
        </motion.button>
      </div>
    </div>
  )
}

