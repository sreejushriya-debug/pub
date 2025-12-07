'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Store, Calculator, CheckCircle2, Trophy } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const STORES = [
  { id: 'A', name: 'Store A', price: 50, discount: 30, tax: 0.0625 },
  { id: 'B', name: 'Store B', price: 45, discount: 10, tax: 0.0625 },
  { id: 'C', name: 'Store C', price: 40, discount: 0, tax: 0.0625 },
]

export default function Activity54B({ onComplete }: Props) {
  const [finalPrices, setFinalPrices] = useState<Record<string, string>>({})
  const [selectedStore, setSelectedStore] = useState('')
  const [explanation, setExplanation] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const calculateFinalPrice = (store: typeof STORES[0]) => {
    const afterDiscount = store.price * (1 - store.discount / 100)
    const taxAmount = afterDiscount * store.tax
    return (afterDiscount + taxAmount).toFixed(2)
  }

  const storePrices = STORES.map(s => ({ ...s, final: parseFloat(calculateFinalPrice(s)) }))
  const bestStore = storePrices.reduce((best, current) => current.final < best.final ? current : best)
  const isCorrect = selectedStore === bestStore.id

  const handleSubmit = () => {
    if (!selectedStore) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {isCorrect ? <Trophy className="w-8 h-8 text-white" /> : <Store className="w-8 h-8 text-white" />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isCorrect ? '🎉 Great Choice!' : 'Almost There!'}
          </h2>
          <p className="text-gray-600">
            {isCorrect ? `You chose ${bestStore.name}, which is the best deal!` : `The best deal is actually ${bestStore.name} at $${bestStore.final.toFixed(2)}`}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {storePrices.map(store => {
            const isBest = store.id === bestStore.id
            const isUserChoice = store.id === selectedStore
            const isWrong = isUserChoice && !isBest
            
            return (
              <div key={store.id} className={`p-4 rounded-xl border-2 ${
                isBest ? 'border-green-400 bg-green-50' :
                isWrong ? 'border-red-400 bg-red-50' :
                'border-gray-200 bg-white'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{store.name}</h3>
                    <p className="text-sm text-gray-600">Original: ${store.price} | Discount: {store.discount}%</p>
                    {isUserChoice && !isBest && <p className="text-xs text-red-600 mt-1">Your choice (not the best deal)</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-forest-600">${store.final.toFixed(2)}</p>
                    {isBest && <p className="text-xs text-green-600">Best Deal! ✓</p>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {explanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-blue-800"><strong>Your explanation:</strong> {explanation}</p>
          </div>
        )}

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ activity_54b_choice: selectedStore, activity_54b_correct: isCorrect, explanation })}
            className="btn-primary px-8 py-3">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Store className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 5.4B – Choose the Best Deal</h2>
        </div>
        <p className="text-gray-600">Compare three stores and find the best price</p>
      </div>

      <div className="space-y-4 mb-6">
        {STORES.map(store => {
          const afterDiscount = store.price * (1 - store.discount / 100)
          const taxAmount = afterDiscount * store.tax
          const finalPrice = (afterDiscount + taxAmount).toFixed(2)
          const userPrice = finalPrices[store.id] || ''
          const isCalculated = userPrice === finalPrice

          return (
            <div key={store.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{store.name}</h3>
                {isCalculated && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Original Price:</p>
                  <p className="text-xl font-semibold">${store.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Discount:</p>
                  <p className="text-xl font-semibold text-red-600">{store.discount}% OFF</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Calculate Final Price (after discount + tax):</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">$</span>
                  <input type="text" value={userPrice} onChange={(e) => setFinalPrices({ ...finalPrices, [store.id]: e.target.value })}
                    placeholder="0.00"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                  <button onClick={() => setFinalPrices({ ...finalPrices, [store.id]: finalPrice })}
                    className="px-3 py-2 bg-forest-500 text-white rounded-lg hover:bg-forest-600 text-sm flex items-center gap-1">
                    <Calculator className="w-4 h-4" /> Calculate
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <label className="block font-semibold text-gray-900 mb-3">Which store would you choose?</label>
        <div className="grid md:grid-cols-3 gap-3 mb-4">
          {STORES.map(store => (
            <button key={store.id} onClick={() => setSelectedStore(store.id)}
              className={`p-4 rounded-xl border-2 font-medium transition-all ${
                selectedStore === store.id ? 'border-forest-500 bg-forest-50 text-forest-700' : 'border-gray-200 hover:border-forest-300'
              }`}>
              {store.name}
            </button>
          ))}
        </div>
        <div>
          <label className="block font-semibold text-gray-900 mb-2">Why? (optional):</label>
          <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)}
            placeholder="I chose this store because..."
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSubmit} disabled={!selectedStore}
          className={`btn-primary px-8 py-3 ${!selectedStore ? 'opacity-50 cursor-not-allowed' : ''}`}>
          Submit My Choice
        </motion.button>
      </div>
    </div>
  )
}

