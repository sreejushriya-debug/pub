'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, PenLine } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const EXPENSE_TYPES = [
  { id: 'fixed', label: 'Fixed Expense', description: 'Same cost each month' },
  { id: 'discretionary', label: 'Discretionary Expense', description: 'Not essential, you choose when to spend' },
  { id: 'periodic', label: 'Periodic Expense', description: 'Occurs regularly but not every month' },
  { id: 'variable', label: 'Variable Expense', description: 'Cost changes from month to month' },
]

export default function Activity46C({ onComplete }: Props) {
  const [examples, setExamples] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    EXPENSE_TYPES.forEach(type => {
      if (!examples[type.id] || examples[type.id].trim().length < 5) {
        newErrors[type.id] = 'Please write an example (5+ characters)'
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Great Examples! ✍️</h2>
          <p className="text-gray-600">You created examples for all expense types!</p>
        </div>

        <div className="space-y-4 mb-8">
          {EXPENSE_TYPES.map(type => (
            <div key={type.id} className="bg-forest-50 rounded-xl p-4 border border-forest-200">
              <p className="font-semibold text-forest-800 mb-1">{type.label}:</p>
              <p className="text-gray-800">{examples[type.id]}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>💡 Key takeaway:</strong> Understanding expense types helps you budget better! 
            Fixed expenses are predictable, variable expenses need flexibility, periodic expenses need planning, 
            and discretionary expenses are where you can save money if needed.
          </p>
        </div>

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ expense_examples: examples })} className="btn-primary px-8 py-3">
            Complete Module 4! 🎉 <ArrowRight className="w-5 h-5 ml-2" />
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
          <h2 className="text-xl font-bold text-gray-900">Activity 4.6C – Write Your Own Examples</h2>
        </div>
        <p className="text-gray-600">Create examples for each expense type</p>
      </div>

      <div className="space-y-6 mb-8">
        {EXPENSE_TYPES.map(type => (
          <div key={type.id}>
            <label className="block font-semibold text-gray-900 mb-2">
              Write your own example of a {type.label.toLowerCase()}:
            </label>
            <p className="text-sm text-gray-500 mb-2">{type.description}</p>
            <input type="text" value={examples[type.id] || ''}
              onChange={(e) => {
                setExamples({ ...examples, [type.id]: e.target.value })
                setErrors({ ...errors, [type.id]: '' })
              }}
              placeholder={`e.g., ${type.id === 'fixed' ? 'Rent' : type.id === 'discretionary' ? 'Movie tickets' : type.id === 'periodic' ? 'Car insurance' : 'Groceries'}`}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                errors[type.id] ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors[type.id] && <p className="text-sm text-red-500 mt-1">{errors[type.id]}</p>}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSubmit} className="btn-primary px-8 py-3">
          Submit My Examples
        </motion.button>
      </div>
    </div>
  )
}

