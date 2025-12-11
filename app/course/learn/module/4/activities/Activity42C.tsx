'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Target, Megaphone, DollarSign, TrendingUp } from 'lucide-react'

interface Props {
  businessName: string
  materials: { name: string; price: number; quantity: number }[]
  onComplete: (data: Record<string, unknown>) => void
}

export default function Activity42C({ businessName, materials, onComplete }: Props) {
  const [targetAudience, setTargetAudience] = useState('')
  const [advertising, setAdvertising] = useState('')
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [moneyUse, setMoneyUse] = useState('')
  const [moneyUseExplanation, setMoneyUseExplanation] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalMaterialsCost = materials.reduce((sum, m) => sum + (m.price * m.quantity), 0)
  const estimatedRevenue = price * quantity
  const estimatedProfit = estimatedRevenue - totalMaterialsCost

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    if (!targetAudience) newErrors.targetAudience = 'Select a target audience'
    if (!advertising.trim() || advertising.trim().length < 10) newErrors.advertising = 'Describe your advertising plan (10+ characters)'
    if (price <= 0) newErrors.price = 'Enter a price greater than $0'
    if (quantity <= 0) newErrors.quantity = 'Enter a quantity greater than 0'
    if (!moneyUse) newErrors.moneyUse = 'Select what you&apos;ll do with the money'
    if (moneyUse && !moneyUseExplanation.trim()) newErrors.moneyUseExplanation = 'Explain your choice'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    onComplete({
      targetAudience, advertising, price, quantity, moneyUse, moneyUseExplanation,
      estimatedRevenue, estimatedProfit
    })
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Activity 4.2C – Complete Your Business Plan</h2>
        <p className="text-gray-600">Finalize the details for {businessName || 'your business'}</p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Target className="w-5 h-5 text-forest-600" />
            Who is your target audience?
          </label>
          <div className="flex flex-wrap gap-3">
            {['Kids', 'Adults', 'Everyone'].map(option => (
              <button key={option} onClick={() => { setTargetAudience(option); setErrors({ ...errors, targetAudience: '' }) }}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                  targetAudience === option ? 'border-forest-500 bg-forest-50 text-forest-700' : 'border-gray-200 hover:border-forest-300'
                }`}>
                {option}
              </button>
            ))}
          </div>
          {errors.targetAudience && <p className="text-sm text-red-500 mt-1">{errors.targetAudience}</p>}
        </div>

        <div>
          <label className="block font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-forest-600" />
            How will you advertise your business?
          </label>
          <textarea value={advertising} onChange={(e) => { setAdvertising(e.target.value); setErrors({ ...errors, advertising: '' }) }}
            placeholder="I will advertise by..."
            className={`w-full px-4 py-3 border-2 rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.advertising ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
          />
          {errors.advertising && <p className="text-sm text-red-500 mt-1">{errors.advertising}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-forest-600" />
              How much will you charge per product?
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="number" step="0.01" value={price || ''} onChange={(e) => { setPrice(parseFloat(e.target.value) || 0); setErrors({ ...errors, price: '' }) }}
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.price ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
            </div>
            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block font-semibold text-gray-900 mb-2">About how many items do you think you can sell?</label>
            <input type="number" value={quantity || ''} onChange={(e) => { setQuantity(parseInt(e.target.value) || 0); setErrors({ ...errors, quantity: '' }) }}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.quantity ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
          </div>
        </div>

        {/* Auto-calculated estimates */}
        {price > 0 && quantity > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Estimated Results</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Estimated Revenue:</span>
                <span className="font-bold text-blue-900">${estimatedRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Materials Cost:</span>
                <span className="font-bold text-blue-900">${totalMaterialsCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-300">
                <span className="font-semibold text-blue-900">Estimated Profit:</span>
                <span className={`font-bold text-lg ${estimatedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${estimatedProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-forest-600" />
            What will you do with the money you earn?
          </label>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            {['Reinvest in business', 'Save', 'Donate', 'Spend'].map(option => (
              <button key={option} onClick={() => { setMoneyUse(option); setErrors({ ...errors, moneyUse: '' }) }}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all text-left ${
                  moneyUse === option ? 'border-forest-500 bg-forest-50 text-forest-700' : 'border-gray-200 hover:border-forest-300'
                }`}>
                {option}
              </button>
            ))}
          </div>
          {errors.moneyUse && <p className="text-sm text-red-500 mb-2">{errors.moneyUse}</p>}
          {moneyUse && (
            <textarea value={moneyUseExplanation} onChange={(e) => { setMoneyUseExplanation(e.target.value); setErrors({ ...errors, moneyUseExplanation: '' }) }}
              placeholder={`Explain why you chose "${moneyUse}"...`}
              className={`w-full px-4 py-3 border-2 rounded-xl h-20 resize-none focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.moneyUseExplanation ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
          )}
          {errors.moneyUseExplanation && <p className="text-sm text-red-500 mt-1">{errors.moneyUseExplanation}</p>}
        </div>
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit}
          className="btn-primary px-8 py-3">
          Complete Business Plan <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}


