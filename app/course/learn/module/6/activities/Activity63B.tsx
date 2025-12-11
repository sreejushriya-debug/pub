'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calculator, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react'

interface Props {
  businessData: { name: string; product: string; audience: string }
  onComplete: (data: Record<string, unknown>) => void
}

interface Cost {
  id: number
  name: string
  amount: number
}

export default function Activity63B({ businessData, onComplete }: Props) {
  const [costs, setCosts] = useState<Cost[]>([
    { id: 1, name: '', amount: 0 }
  ])
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const [nextId, setNextId] = useState(2)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateCost = (id: number, field: keyof Cost, value: string | number) => {
    setCosts(costs.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const addCost = () => {
    setCosts([...costs, { id: nextId, name: '', amount: 0 }])
    setNextId(prev => prev + 1)
  }

  const removeCost = (id: number) => {
    if (costs.length > 1) {
      setCosts(costs.filter(c => c.id !== id))
    }
  }

  const totalExpenses = costs.reduce((sum, c) => sum + c.amount, 0)
  const revenue = price * quantity
  const profit = revenue - totalExpenses
  const isLoss = profit < 0

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}
    if (costs.some(c => !c.name || c.amount <= 0)) newErrors.costs = 'Fill in all cost names and amounts'
    if (price <= 0) newErrors.price = 'Enter a price greater than $0'
    if (quantity <= 0) newErrors.quantity = 'Enter a quantity greater than 0'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    onComplete({ costs, price, quantity, revenue, profit, totalExpenses })
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calculator className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 6.3B – Set Costs and Prices</h2>
        </div>
        <p className="text-gray-600">Plan your business finances for {businessData.name || 'your business'}</p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Business Costs</h3>
          <div className="space-y-3 mb-3">
            {costs.map(cost => (
              <div key={cost.id} className="flex gap-3 items-center">
                <input type="text" placeholder="Cost name (e.g., Materials)" value={cost.name}
                  onChange={(e) => updateCost(cost.id, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
                <div className="flex items-center gap-1 w-32">
                  <span className="text-gray-500">$</span>
                  <input type="number" step="0.01" placeholder="0.00" value={cost.amount || ''}
                    onChange={(e) => updateCost(cost.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
                {costs.length > 1 && (
                  <button onClick={() => removeCost(cost.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addCost} className="btn-outline px-4 py-2 flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Cost
          </button>
          {errors.costs && <p className="text-sm text-red-500 mt-2">{errors.costs}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-900 mb-2">Selling Price per Unit:</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="number" step="0.01" value={price || ''} onChange={(e) => { setPrice(parseFloat(e.target.value) || 0); setErrors({ ...errors, price: '' }) }}
                className={`flex-1 px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.price ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              />
            </div>
            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block font-semibold text-gray-900 mb-2">Expected Number Sold:</label>
            <input type="number" value={quantity || ''} onChange={(e) => { setQuantity(parseInt(e.target.value) || 0); setErrors({ ...errors, quantity: '' }) }}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${errors.quantity ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity}</p>}
          </div>
        </div>

        {price > 0 && quantity > 0 && totalExpenses > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              {isLoss ? <TrendingDown className="w-5 h-5 text-red-600" /> : <TrendingUp className="w-5 h-5 text-green-600" />}
              Financial Summary:
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Total Expenses:</span>
                <span className="font-bold text-red-600">${totalExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Total Revenue:</span>
                <span className="font-bold text-green-600">${revenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-300">
                <span className="font-semibold text-gray-900">Profit/Loss:</span>
                <span className={`font-bold text-lg ${isLoss ? 'text-red-600' : 'text-green-600'}`}>
                  {isLoss ? '-' : '+'}${Math.abs(profit).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSubmit} className="btn-primary px-8 py-3">
          Continue to Cost Types <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}


