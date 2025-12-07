'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const TERMS = ['equity', 'marketing', 'assets', 'liability', 'revenue', 'profit', 'stock', 'investor', 'corporation', 'expenses']

export default function Activity44C({ onComplete }: Props) {
  const [selectedTerm, setSelectedTerm] = useState('')
  const [explanation, setExplanation] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!selectedTerm) {
      setError('Please select a term')
      return
    }
    if (!explanation.trim() || explanation.trim().length < 20) {
      setError('Please write an explanation with an example (20+ characters)')
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Great Explanation! 📚</h2>
          <p className="text-gray-600">You explained {selectedTerm} really well!</p>
        </div>

        <div className="bg-forest-50 rounded-xl p-4 border border-forest-200 mb-8">
          <p className="font-semibold text-forest-800 mb-2 capitalize">{selectedTerm}:</p>
          <p className="text-gray-800 italic">&ldquo;{explanation}&rdquo;</p>
        </div>

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ term_explanation: { term: selectedTerm, explanation } })}
            className="btn-primary px-8 py-3">
            Continue to Word Problems <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 4.4C – Explain a Business Term</h2>
        </div>
        <p className="text-gray-600">Pick one term and explain it in your own words with an example</p>
      </div>

      <div className="mb-6">
        <label className="block font-semibold text-gray-900 mb-3">Choose a term to explain:</label>
        <div className="flex flex-wrap gap-2">
          {TERMS.map(term => (
            <button key={term} onClick={() => { setSelectedTerm(term); setError('') }}
              className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                selectedTerm === term ? 'border-forest-500 bg-forest-50 text-forest-700' : 'border-gray-200 hover:border-forest-300'
              }`}>
              {term.charAt(0).toUpperCase() + term.slice(1)}
            </button>
          ))}
        </div>
        {error && !selectedTerm && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>

      {selectedTerm && (
        <div className="mb-6">
          <label className="block font-semibold text-gray-900 mb-2">
            Explain &quot;{selectedTerm}&quot; in your own words with an example:
          </label>
          <textarea value={explanation} onChange={(e) => { setExplanation(e.target.value); setError('') }}
            placeholder={`${selectedTerm.charAt(0).toUpperCase() + selectedTerm.slice(1)} is... For example...`}
            className={`w-full p-4 border-2 rounded-xl h-32 resize-none focus:outline-none focus:ring-2 focus:ring-forest-500 ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          />
          {error && selectedTerm && <p className="text-sm text-red-500 mt-1">{error}</p>}
          <p className="text-xs text-gray-400 mt-1">{explanation.length}/20 characters minimum</p>
        </div>
      )}

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSubmit} className="btn-primary px-8 py-3">
          Submit My Explanation
        </motion.button>
      </div>
    </div>
  )
}

