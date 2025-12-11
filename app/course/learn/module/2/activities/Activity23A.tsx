'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Plus, Trash2, DollarSign, AlertTriangle } from 'lucide-react'

interface Activity23AProps {
  onComplete: (data: Record<string, unknown>) => void
}

const DEFAULT_CATEGORIES = [
  { name: 'Food', amount: 0 },
  { name: 'Savings', amount: 0 },
  { name: 'Entertainment', amount: 0 },
  { name: 'Gifts', amount: 0 },
  { name: 'Clothes', amount: 0 },
]

export default function Activity23A({ onComplete }: Activity23AProps) {
  const [income, setIncome] = useState<number>(100)
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [newCategoryName, setNewCategoryName] = useState('')

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.amount, 0)
  const remaining = income - totalAllocated
  const isOverBudget = remaining < 0

  const updateCategory = (index: number, amount: number) => {
    const updated = [...categories]
    updated[index].amount = Math.max(0, amount)
    setCategories(updated)
  }

  const addCategory = () => {
    if (newCategoryName.trim()) {
      setCategories([...categories, { name: newCategoryName.trim(), amount: 0 }])
      setNewCategoryName('')
    }
  }

  const removeCategory = (index: number) => {
    if (categories.length > 3) {
      setCategories(categories.filter((_, i) => i !== index))
    }
  }

  const canContinue = totalAllocated > 0 && !isOverBudget && categories.some(c => c.name.toLowerCase() === 'savings' && c.amount > 0)

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Activity 2.3A – Build Your Budget</h2>
        <p className="text-gray-600">Create a monthly budget by allocating your income to different categories</p>
      </div>

      {/* Income Input */}
      <div className="bg-forest-50 rounded-xl p-5 mb-6">
        <label className="block font-semibold text-forest-800 mb-2">Your Monthly Income</label>
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-forest-600" />
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-32 px-4 py-2 border-2 border-forest-300 rounded-lg font-bold text-xl focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
          <span className="text-forest-700">per month</span>
        </div>
        <p className="text-sm text-forest-600 mt-2">Example: allowance, birthday money, or job earnings</p>
      </div>

      {/* Budget Summary */}
      <div className={`rounded-xl p-4 mb-6 ${isOverBudget ? 'bg-red-50 border border-red-200' : 'bg-gray-100'}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Allocated</p>
            <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>${totalAllocated}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Remaining</p>
            <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : remaining === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              ${remaining}
            </p>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="h-4 bg-gray-300 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${isOverBudget ? 'bg-red-500' : 'bg-forest-500'}`}
                style={{ width: `${Math.min(100, (totalAllocated / income) * 100)}%` }}
              />
            </div>
          </div>
        </div>
        {isOverBudget && (
          <div className="flex items-center gap-2 mt-3 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">You&apos;re spending more than you make! Reduce some categories.</span>
          </div>
        )}
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-semibold text-gray-700">
          <div className="col-span-6">Category</div>
          <div className="col-span-4">Amount</div>
          <div className="col-span-2">%</div>
        </div>
        {categories.map((cat, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b items-center">
            <div className="col-span-6 flex items-center gap-2">
              <span className="font-medium">{cat.name}</span>
              {cat.name.toLowerCase() === 'savings' && <span className="text-xs bg-forest-100 text-forest-700 px-2 py-0.5 rounded">Important!</span>}
            </div>
            <div className="col-span-4 flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input
                type="number"
                value={cat.amount || ''}
                onChange={(e) => updateCategory(index, parseInt(e.target.value) || 0)}
                className="w-20 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                placeholder="0"
              />
            </div>
            <div className="col-span-2 flex items-center justify-between">
              <span className="text-gray-600">{income > 0 ? Math.round((cat.amount / income) * 100) : 0}%</span>
              {categories.length > 3 && (
                <button onClick={() => removeCategory(index)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Category */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Add new category..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
          onKeyPress={(e) => e.key === 'Enter' && addCategory()}
        />
        <button onClick={addCategory} className="btn-outline px-4">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-amber-800 text-sm">
          <strong>💡 Tip:</strong> A good rule of thumb is to save at least 10-20% of your income. 
          Make sure to include a Savings category!
        </p>
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={canContinue ? { scale: 1.02 } : {}} whileTap={canContinue ? { scale: 0.98 } : {}}
          onClick={() => onComplete({ budgetData: { income, categories } })}
          disabled={!canContinue}
          className={`btn-primary px-8 py-3 ${!canContinue ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {!canContinue ? 'Add savings and balance your budget' : 'See Your Budget Chart'} <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}


