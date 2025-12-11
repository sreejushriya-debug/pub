'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, PenLine } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

export default function Activity62C({ onComplete }: Props) {
  const [answers, setAnswers] = useState({ need: '', want: '', why: '', remove: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    if (!answers.need.trim() || answers.need.trim().length < 3) newErrors.need = 'Name a need you bought'
    if (!answers.want.trim() || answers.want.trim().length < 3) newErrors.want = 'Name a want you chose'
    if (!answers.why.trim() || answers.why.trim().length < 10) newErrors.why = 'Explain why (10+ characters)'
    if (!answers.remove.trim() || answers.remove.trim().length < 3) newErrors.remove = 'What would you remove?'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PenLine className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Great Reflection! ✍️</h2>
          <p className="text-gray-600">You thought carefully about your shopping decisions!</p>
        </div>

        <div className="bg-forest-50 rounded-xl p-6 border border-forest-200 mb-8 max-w-2xl mx-auto space-y-4">
          <div>
            <p className="font-semibold text-forest-800 mb-1">Need you bought:</p>
            <p className="text-gray-800">{answers.need}</p>
          </div>
          <div>
            <p className="font-semibold text-forest-800 mb-1">Want you chose:</p>
            <p className="text-gray-800">{answers.want}</p>
          </div>
          <div>
            <p className="font-semibold text-forest-800 mb-1">Why:</p>
            <p className="text-gray-800 italic">&ldquo;{answers.why}&rdquo;</p>
          </div>
          <div>
            <p className="font-semibold text-forest-800 mb-1">If you had $10 less:</p>
            <p className="text-gray-800">{answers.remove}</p>
          </div>
        </div>

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ reflection: answers })} className="btn-primary px-8 py-3">
            Continue to Business Simulation <ArrowRight className="w-5 h-5 ml-2" />
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
          <h2 className="text-xl font-bold text-gray-900">Activity 6.2C – Shopping Reflection</h2>
        </div>
        <p className="text-gray-600">Reflect on your shopping decisions</p>
      </div>

      <div className="space-y-6 mb-8 max-w-2xl mx-auto">
        <div>
          <label className="block font-semibold text-gray-900 mb-2">Name one Need you bought:</label>
          <input type="text" value={answers.need} onChange={(e) => { setAnswers({ ...answers, need: e.target.value }); setErrors({ ...errors, need: '' }) }}
            placeholder="e.g., Notebook"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.need ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          />
          {errors.need && <p className="text-sm text-red-500 mt-1">{errors.need}</p>}
        </div>

        <div>
          <label className="block font-semibold text-gray-900 mb-2">Name one Want you chose and why:</label>
          <input type="text" value={answers.want} onChange={(e) => { setAnswers({ ...answers, want: e.target.value }); setErrors({ ...errors, want: '' }) }}
            placeholder="e.g., Video Game"
            className={`w-full px-4 py-3 border-2 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.want ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          />
          {errors.want && <p className="text-sm text-red-500 mt-1">{errors.want}</p>}
          <textarea value={answers.why} onChange={(e) => { setAnswers({ ...answers, why: e.target.value }); setErrors({ ...errors, why: '' }) }}
            placeholder="I chose this because..."
            className={`w-full px-4 py-3 border-2 rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.why ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          />
          {errors.why && <p className="text-sm text-red-500 mt-1">{errors.why}</p>}
        </div>

        <div>
          <label className="block font-semibold text-gray-900 mb-2">If you had $10 less, what would you remove?</label>
          <input type="text" value={answers.remove} onChange={(e) => { setAnswers({ ...answers, remove: e.target.value }); setErrors({ ...errors, remove: '' }) }}
            placeholder="e.g., I would remove the candy"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.remove ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          />
          {errors.remove && <p className="text-sm text-red-500 mt-1">{errors.remove}</p>}
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


