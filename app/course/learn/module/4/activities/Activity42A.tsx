'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Store, Image as ImageIcon } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

export default function Activity42A({ onComplete }: Props) {
  const [businessName, setBusinessName] = useState('')
  const [productName, setProductName] = useState('')
  const [uniqueness, setUniqueness] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    if (!businessName.trim()) newErrors.businessName = 'Enter a business name'
    if (!productName.trim()) newErrors.productName = 'Enter a product name'
    if (!uniqueness.trim() || uniqueness.trim().length < 20) newErrors.uniqueness = 'Explain how your product is unique (20+ characters)'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    onComplete({ businessName, productName, uniqueness })
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Store className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 4.2A – Name & Describe Your Business</h2>
        </div>
        <p className="text-gray-600">Create your own business idea!</p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block font-semibold text-gray-900 mb-2">Business Name</label>
          <input type="text" value={businessName} onChange={(e) => { setBusinessName(e.target.value); setErrors({ ...errors, businessName: '' }) }}
            placeholder="e.g., Sunny&apos;s Smoothie Shop"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.businessName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          />
          {errors.businessName && <p className="text-sm text-red-500 mt-1">{errors.businessName}</p>}
        </div>

        <div>
          <label className="block font-semibold text-gray-900 mb-2">Product Name</label>
          <input type="text" value={productName} onChange={(e) => { setProductName(e.target.value); setErrors({ ...errors, productName: '' }) }}
            placeholder="e.g., Tropical Blast Smoothie"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.productName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          />
          {errors.productName && <p className="text-sm text-red-500 mt-1">{errors.productName}</p>}
        </div>

        <div>
          <label className="block font-semibold text-gray-900 mb-2">How is your product unique and different from similar products?</label>
          <textarea value={uniqueness} onChange={(e) => { setUniqueness(e.target.value); setErrors({ ...errors, uniqueness: '' }) }}
            placeholder="My product is unique because..."
            className={`w-full px-4 py-3 border-2 rounded-xl h-32 resize-none focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.uniqueness ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          />
          {errors.uniqueness && <p className="text-sm text-red-500 mt-1">{errors.uniqueness}</p>}
          <p className="text-xs text-gray-400 mt-1">{uniqueness.length}/20 characters minimum</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>💡 Tip:</strong> Think about what makes your business special. Is it the ingredients? The price? The service? 
          What would make customers choose you over competitors?
        </p>
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit}
          className="btn-primary px-8 py-3">
          Continue to Materials <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}


