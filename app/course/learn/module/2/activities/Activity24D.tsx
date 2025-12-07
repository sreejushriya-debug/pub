'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, MessageSquare } from 'lucide-react'

interface Activity24DProps {
  onComplete: (data: Record<string, unknown>) => void
}

const QUESTIONS = [
  {
    id: 'why_plan',
    question: 'Why did you choose your plan? (needs, wants, savings levels)',
    placeholder: 'I chose these plans because...'
  },
  {
    id: 'tough_decision',
    question: 'What budget decision was tough for you to make?',
    placeholder: 'The hardest choice was...'
  },
  {
    id: 'wish',
    question: 'What is one thing you wish you could have, but couldn\'t afford?',
    placeholder: 'I wish I could afford...'
  },
  {
    id: 'change',
    question: 'Is there anything you would change about your plan now that you\'ve seen the numbers?',
    placeholder: 'Looking at my budget, I would change...'
  },
]

export default function Activity24D({ onComplete }: Activity24DProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    QUESTIONS.forEach(q => {
      if (!answers[q.id] || answers[q.id].trim().length < 15) {
        newErrors[q.id] = 'Please write at least a sentence'
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Excellent Reflection! 🎉</h2>
          <p className="text-gray-600">You&apos;ve thought carefully about budgeting and tradeoffs.</p>
        </div>

        <div className="space-y-4 mb-8">
          {QUESTIONS.map(q => (
            <div key={q.id} className="bg-forest-50 rounded-xl p-4 border border-forest-200">
              <p className="font-semibold text-forest-800 mb-2">{q.question}</p>
              <p className="text-gray-700 italic">&ldquo;{answers[q.id]}&rdquo;</p>
            </div>
          ))}
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800">
            <strong>🌟 Great job!</strong> You&apos;ve completed all the budgeting activities in Module 2! 
            You now understand how to make smart choices about saving and spending.
          </p>
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ budget_simulation_reflection: answers })}
            className="btn-primary px-8 py-3"
          >
            Complete KWL Reflection <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MessageSquare className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 2.4D – Budget Reflection</h2>
        </div>
        <p className="text-gray-600">Reflect on your budget simulation experience</p>
      </div>

      <div className="space-y-5 mb-8">
        {QUESTIONS.map(q => (
          <div key={q.id}>
            <label className="block font-semibold text-gray-900 mb-2">{q.question}</label>
            <textarea
              value={answers[q.id] || ''}
              onChange={(e) => { setAnswers({ ...answers, [q.id]: e.target.value }); setErrors({ ...errors, [q.id]: '' }) }}
              placeholder={q.placeholder}
              className={`w-full p-4 border-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-forest-500 h-20 ${
                errors[q.id] ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors[q.id] && <p className="text-sm text-red-500 mt-1">{errors[q.id]}</p>}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="btn-primary px-8 py-3"
        >
          Submit Reflection <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}

