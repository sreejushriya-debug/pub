'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Briefcase, PenLine } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

export default function Activity63D({ onComplete }: Props) {
  const [answers, setAnswers] = useState({ investor: '', changes: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    if (!answers.investor.trim() || answers.investor.trim().length < 20) newErrors.investor = 'Write at least 2 sentences (20+ characters)'
    if (!answers.changes.trim() || answers.changes.trim().length < 20) newErrors.changes = 'Write at least 2 sentences (20+ characters)'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Great Pitch! 💼</h2>
          <p className="text-gray-600">You thought like a business owner!</p>
        </div>

        <div className="bg-forest-50 rounded-xl p-6 border border-forest-200 mb-8 max-w-2xl mx-auto space-y-4">
          <div>
            <p className="font-semibold text-forest-800 mb-1">Would an investor think this is a good idea?</p>
            <p className="text-gray-800 italic">&ldquo;{answers.investor}&rdquo;</p>
          </div>
          <div>
            <p className="font-semibold text-forest-800 mb-1">What could you change to make profit bigger?</p>
            <p className="text-gray-800 italic">&ldquo;{answers.changes}&rdquo;</p>
          </div>
        </div>

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ investor_pitch: answers })} className="btn-primary px-8 py-3">
            Continue to Credit Scenarios <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Briefcase className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 6.3D – Investor Pitch Reflection</h2>
        </div>
        <p className="text-gray-600">Think like an investor about your business</p>
      </div>

      <div className="space-y-6 mb-8 max-w-2xl mx-auto">
        <div>
          <label className="block font-semibold text-gray-900 mb-2">Would an investor think this business is a good idea? Why?</label>
          <textarea value={answers.investor} onChange={(e) => { setAnswers({ ...answers, investor: e.target.value }); setErrors({ ...errors, investor: '' }) }}
            placeholder="An investor would think..."
            className={`w-full px-4 py-3 border-2 rounded-xl h-32 resize-none focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.investor ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          />
          {errors.investor && <p className="text-sm text-red-500 mt-1">{errors.investor}</p>}
          <p className="text-xs text-gray-400 mt-1">{answers.investor.length}/20 characters minimum</p>
        </div>

        <div>
          <label className="block font-semibold text-gray-900 mb-2">What could you change to make your profit bigger?</label>
          <textarea value={answers.changes} onChange={(e) => { setAnswers({ ...answers, changes: e.target.value }); setErrors({ ...errors, changes: '' }) }}
            placeholder="I could..."
            className={`w-full px-4 py-3 border-2 rounded-xl h-32 resize-none focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.changes ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          />
          {errors.changes && <p className="text-sm text-red-500 mt-1">{errors.changes}</p>}
          <p className="text-xs text-gray-400 mt-1">{answers.changes.length}/20 characters minimum</p>
        </div>
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSubmit} className="btn-primary px-8 py-3">
          Submit Reflection
        </motion.button>
      </div>
    </div>
  )
}

