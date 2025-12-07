'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Store, Sparkles } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const BUSINESS_TYPES = [
  { id: 'lemonade', name: 'Lemonade Stand', emoji: '🍋' },
  { id: 'slime', name: 'Slime Shop', emoji: '🫧' },
  { id: 'bracelets', name: 'Custom Bracelets', emoji: '📿' },
  { id: 'snack', name: 'Snack Booth', emoji: '🍿' },
  { id: 'custom', name: 'My Own Idea', emoji: '💡' },
]

export default function Activity63A({ onComplete }: Props) {
  const [selectedType, setSelectedType] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [productName, setProductName] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    if (!selectedType) newErrors.type = 'Select a business type'
    if (!businessName.trim()) newErrors.businessName = 'Enter a business name'
    if (!productName.trim()) newErrors.productName = 'Enter a product name'
    if (!targetAudience.trim()) newErrors.targetAudience = 'Enter a target audience'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    onComplete({ businessData: { type: selectedType, name: businessName, product: productName, audience: targetAudience } })
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Store className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 6.3A – Choose a Business</h2>
        </div>
        <p className="text-gray-600">Pick your pop-up business idea!</p>
      </div>

      <div className="mb-6">
        <label className="block font-semibold text-gray-900 mb-3">Choose a business type:</label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BUSINESS_TYPES.map(type => (
            <motion.button key={type.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setSelectedType(type.id); setErrors({ ...errors, type: '' }) }}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                selectedType === type.id ? 'border-forest-500 bg-forest-50' : 'border-gray-200 hover:border-forest-300'
              }`}>
              <div className="text-4xl mb-2">{type.emoji}</div>
              <div className="font-medium text-gray-900">{type.name}</div>
            </motion.button>
          ))}
        </div>
        {errors.type && <p className="text-sm text-red-500 mt-2">{errors.type}</p>}
      </div>

      {selectedType && (
        <div className="space-y-4 mb-8 max-w-2xl mx-auto">
          <div>
            <label className="block font-semibold text-gray-900 mb-2">Business Name:</label>
            <input type="text" value={businessName} onChange={(e) => { setBusinessName(e.target.value); setErrors({ ...errors, businessName: '' }) }}
              placeholder="e.g., Sunny&apos;s Lemonade"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.businessName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.businessName && <p className="text-sm text-red-500 mt-1">{errors.businessName}</p>}
          </div>

          <div>
            <label className="block font-semibold text-gray-900 mb-2">Product Name:</label>
            <input type="text" value={productName} onChange={(e) => { setProductName(e.target.value); setErrors({ ...errors, productName: '' }) }}
              placeholder="e.g., Fresh Lemonade"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.productName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.productName && <p className="text-sm text-red-500 mt-1">{errors.productName}</p>}
          </div>

          <div>
            <label className="block font-semibold text-gray-900 mb-2">Target Audience:</label>
            <input type="text" value={targetAudience} onChange={(e) => { setTargetAudience(e.target.value); setErrors({ ...errors, targetAudience: '' }) }}
              placeholder="e.g., Kids, Adults, Everyone"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.targetAudience ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.targetAudience && <p className="text-sm text-red-500 mt-1">{errors.targetAudience}</p>}
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSubmit} className="btn-primary px-8 py-3">
          Continue to Set Costs <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}

