'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Calculator, CheckCircle2 } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const TAX_RATE = 0.0625

export default function Activity54C({ onComplete }: Props) {
  const [originalPrice, setOriginalPrice] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    const price = parseFloat(originalPrice)
    const discount = parseFloat(discountPercent)

    if (!originalPrice || price <= 0) newErrors.price = 'Enter a valid price greater than $0'
    if (!discountPercent || discount < 0 || discount > 100) newErrors.discount = 'Enter a discount between 0% and 100%'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setSubmitted(true)
  }

  if (submitted) {
    const price = parseFloat(originalPrice)
    const discount = parseFloat(discountPercent)
    const discountAmount = price * (discount / 100)
    const priceAfterDiscount = price - discountAmount
    const taxAmount = priceAfterDiscount * TAX_RATE
    const finalPrice = priceAfterDiscount + taxAmount

    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Sale Item! 🎉</h2>
          <p className="text-gray-600">Here&apos;s your custom sale calculation</p>
        </div>

        <div className="bg-white border-2 border-gray-300 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="bg-red-500 text-white rounded-xl p-6 mb-4">
              <div className="text-4xl font-bold mb-2">SALE</div>
              <div className="text-2xl">{discount}% OFF</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-700">Original Price:</span>
              <span className="font-semibold">${price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-700">Discount ({discount}%):</span>
              <span className="font-semibold text-red-600">-${discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-700">Price After Discount:</span>
              <span className="font-semibold">${priceAfterDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-700">Sales Tax (6.25%):</span>
              <span className="font-semibold">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-bold text-lg text-gray-900">Final Price:</span>
              <span className="font-bold text-2xl text-forest-600">${finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>💡 Key Takeaway:</strong> When shopping, always calculate discount first, then tax on the discounted price to find the true final cost!
          </p>
        </div>

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ custom_sale: { originalPrice: price, discountPercent: discount, finalPrice } })}
            className="btn-primary px-8 py-3">
            Complete Module 5! 🎉 <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 5.4C – Create Your Own Sale</h2>
        </div>
        <p className="text-gray-600">Design your own sale item and calculate the final price</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-900 mb-2">Original Item Price:</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="number" step="0.01" value={originalPrice} onChange={(e) => { setOriginalPrice(e.target.value); setErrors({ ...errors, price: '' }) }}
                placeholder="0.00"
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  errors.price ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block font-semibold text-gray-900 mb-2">Discount Percentage:</label>
            <div className="flex items-center gap-2">
              <input type="number" step="0.1" value={discountPercent} onChange={(e) => { setDiscountPercent(e.target.value); setErrors({ ...errors, discount: '' }) }}
                placeholder="0"
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  errors.discount ? 'border-red-400 bg-red-50' : 'border-gray-300'
                }`}
              />
              <span className="text-gray-500">%</span>
            </div>
            {errors.discount && <p className="text-sm text-red-500 mt-1">{errors.discount}</p>}
          </div>

          {originalPrice && discountPercent && parseFloat(originalPrice) > 0 && parseFloat(discountPercent) >= 0 && parseFloat(discountPercent) <= 100 && (
            <div className="bg-forest-50 border border-forest-200 rounded-lg p-4">
              <p className="text-sm text-forest-700 mb-2">Preview Calculation:</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Discount Amount:</span>
                  <span className="font-semibold">${(parseFloat(originalPrice) * (parseFloat(discountPercent) / 100)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price After Discount:</span>
                  <span className="font-semibold">${(parseFloat(originalPrice) * (1 - parseFloat(discountPercent) / 100)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (6.25%):</span>
                  <span className="font-semibold">${(parseFloat(originalPrice) * (1 - parseFloat(discountPercent) / 100) * TAX_RATE).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-forest-300">
                  <span className="font-semibold">Final Price:</span>
                  <span className="font-bold text-lg text-forest-600">
                    ${(parseFloat(originalPrice) * (1 - parseFloat(discountPercent) / 100) * (1 + TAX_RATE)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSubmit} className="btn-primary px-8 py-3">
          Create My Sale
        </motion.button>
      </div>
    </div>
  )
}

