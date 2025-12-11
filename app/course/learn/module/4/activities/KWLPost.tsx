'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'

interface Props { preKnow: string; preWant: string; onComplete: (data: Record<string, unknown>) => void }

export default function KWLPostActivity({ preKnow, preWant, onComplete }: Props) {
  const [learned, setLearned] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (learned.trim().length < 40) { setError('Please write at least 2 sentences (40+ characters)'); return }
    onComplete({ kwl_post_learned: learned })
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Module 4 KWL – Reflection</h2>
        <p className="text-gray-600">Great job! Now reflect on what you learned about business.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block font-semibold text-gray-900 mb-2">K – What I <span className="text-forest-600">Knew</span></label>
          <div className="w-full h-40 p-4 border-2 border-forest-200 rounded-xl bg-forest-50 overflow-y-auto">
            <p className="text-forest-800">{preKnow || 'No response recorded'}</p>
          </div>
        </div>
        <div>
          <label className="block font-semibold text-gray-900 mb-2">W – What I <span className="text-accent-600">Wanted</span> to Know</label>
          <div className="w-full h-40 p-4 border-2 border-accent-200 rounded-xl bg-accent-50 overflow-y-auto">
            <p className="text-accent-800">{preWant || 'No response recorded'}</p>
          </div>
        </div>
        <div>
          <label className="block font-semibold text-gray-900 mb-2">L – What I <span className="text-sage-600">Learned</span></label>
          <textarea value={learned} onChange={(e) => { setLearned(e.target.value); setError('') }} placeholder="I learned that..."
            className={`w-full h-32 p-4 border-2 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-sage-500 ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
      </div>

      <div className="bg-gradient-to-r from-forest-50 to-accent-50 rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">🌟 Reflection Tips</h3>
        <ul className="text-gray-700 space-y-1 text-sm">
          <li>• What&apos;s the difference between revenue and profit?</li>
          <li>• How do you calculate if a business is successful?</li>
          <li>• What are fixed vs variable expenses?</li>
        </ul>
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} className="btn-primary text-lg px-8 py-4">
          Complete Module 4 🎉 <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}


