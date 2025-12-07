'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, PenLine } from 'lucide-react'

interface Activity22BProps {
  scenarios: Record<string, string>
  onComplete: (data: Record<string, unknown>) => void
}

const SCENARIOS_FOR_WRITING = [
  { id: 'hannah', name: 'Hannah', text: 'Hannah has $15 saved up and wants to buy a notebook that costs $20. Her birthday is next week.' },
  { id: 'nishi', name: 'Nishi', text: 'Nishi has $100 saved and found shoes she wanted on sale for $75 (usually $100).' },
  { id: 'jameson', name: 'Jameson', text: 'Jameson needs new shoes for school - his have holes. He has $50 and found shoes for $40.' },
]

export default function Activity22B({ scenarios, onComplete }: Activity22BProps) {
  const [justifications, setJustifications] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    SCENARIOS_FOR_WRITING.forEach(s => {
      if (!justifications[s.id] || justifications[s.id].trim().length < 20) {
        newErrors[s.id] = 'Please write at least 1-2 sentences (20+ characters)'
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
          <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PenLine className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Great Explanations! ✍️</h2>
          <p className="text-gray-600">You explained your reasoning really well!</p>
        </div>

        <div className="space-y-4 mb-8">
          {SCENARIOS_FOR_WRITING.map(s => (
            <div key={s.id} className="bg-forest-50 rounded-xl p-4 border border-forest-200">
              <p className="font-semibold text-forest-700 mb-2">{s.name}&apos;s scenario:</p>
              <p className="text-gray-700 italic">&ldquo;{justifications[s.id]}&rdquo;</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ activity_22b_justifications: justifications })}
            className="btn-primary px-8 py-3">
            Continue to Budget Building <ArrowRight className="w-5 h-5 ml-2" />
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
          <h2 className="text-xl font-bold text-gray-900">Activity 2.2B – Explain Your Thinking</h2>
        </div>
        <p className="text-gray-600">Write 1-2 sentences explaining why saving or spending is the better choice.</p>
      </div>

      <div className="space-y-6 mb-8">
        {SCENARIOS_FOR_WRITING.map(s => (
          <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-forest-500 rounded-full flex items-center justify-center text-white font-bold">
                {s.name.charAt(0)}
              </div>
              <h3 className="font-semibold text-gray-900">{s.name}</h3>
              {scenarios[s.id] && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  scenarios[s.id] === 'save' ? 'bg-forest-100 text-forest-700' : 'bg-accent-100 text-accent-700'
                }`}>
                  You chose: {scenarios[s.id].toUpperCase()}
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-3">{s.text}</p>
            <textarea
              value={justifications[s.id] || ''}
              onChange={(e) => { setJustifications({ ...justifications, [s.id]: e.target.value }); setErrors({ ...errors, [s.id]: '' }) }}
              placeholder={`Why is ${scenarios[s.id] || 'saving/spending'} the better choice for ${s.name}?`}
              className={`w-full p-4 border-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-forest-500 h-24 ${
                errors[s.id] ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors[s.id] && <p className="text-sm text-red-500 mt-1">{errors[s.id]}</p>}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} className="btn-primary px-8 py-3">
          Submit My Explanations <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}

