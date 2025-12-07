'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, HelpCircle } from 'lucide-react'

interface Activity23CProps {
  onComplete: (data: Record<string, unknown>) => void
}

const QUESTIONS = [
  {
    id: 'realistic',
    question: 'Is your budget realistic? Why or why not?',
    hint: 'Think about: Can you actually stick to these amounts? Are there expenses you forgot?'
  },
  {
    id: 'priority',
    question: 'Which category did you give the most money to? Does that match your real priorities?',
    hint: 'Consider what matters most to you and if your budget reflects that.'
  },
  {
    id: 'cut',
    question: 'If you had to cut 10% from your budget, where would you cut and why?',
    hint: 'Think about wants vs needs. What could you live without?'
  },
]

export default function Activity23C({ onComplete }: Activity23CProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    QUESTIONS.forEach(q => {
      if (!answers[q.id] || answers[q.id].trim().length < 20) {
        newErrors[q.id] = 'Please write at least 1-2 sentences'
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Great Reflection! 🎯</h2>
          <p className="text-gray-600">You&apos;ve thought carefully about your budget choices.</p>
        </div>

        <div className="space-y-4 mb-8">
          {QUESTIONS.map(q => (
            <div key={q.id} className="bg-forest-50 rounded-xl p-4 border border-forest-200">
              <p className="font-semibold text-forest-800 mb-2">{q.question}</p>
              <p className="text-gray-700 italic">&ldquo;{answers[q.id]}&rdquo;</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ budget_reflection: answers })}
            className="btn-primary px-8 py-3">
            Continue to Budget Simulation <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <HelpCircle className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 2.3C – Evaluate Your Budget</h2>
        </div>
        <p className="text-gray-600">Reflect on the budget you created</p>
      </div>

      <div className="space-y-6 mb-8">
        {QUESTIONS.map(q => (
          <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block font-semibold text-gray-900 mb-2">{q.question}</label>
            <p className="text-sm text-gray-500 mb-3">{q.hint}</p>
            <textarea
              value={answers[q.id] || ''}
              onChange={(e) => { setAnswers({ ...answers, [q.id]: e.target.value }); setErrors({ ...errors, [q.id]: '' }) }}
              placeholder="Your answer..."
              className={`w-full p-4 border-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-forest-500 h-24 ${
                errors[q.id] ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors[q.id] && <p className="text-sm text-red-500 mt-1">{errors[q.id]}</p>}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSubmit} className="btn-primary px-8 py-3">
          Submit Reflection <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}

