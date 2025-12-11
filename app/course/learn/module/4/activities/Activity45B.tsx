'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Plus, Trash2, Calculator, TrendingUp } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

interface Expense {
  id: number
  name: string
  cost: number
}

export default function Activity45B({ onComplete }: Props) {
  const [product, setProduct] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([{ id: 1, name: '', cost: 0 }])
  const [quantity, setQuantity] = useState(0)
  const [price, setPrice] = useState(0)
  const [nextId, setNextId] = useState(2)
  const [submitted, setSubmitted] = useState(false)

  const updateExpense = (id: number, field: keyof Expense, value: string | number) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const addExpense = () => {
    setExpenses([...expenses, { id: nextId, name: '', cost: 0 }])
    setNextId(prev => prev + 1)
  }

  const removeExpense = (id: number) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter(e => e.id !== id))
    }
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.cost, 0)
  const revenue = price * quantity
  const profit = revenue - totalExpenses
  const isLoss = profit < 0

  const handleSubmit = () => {
    if (!product.trim() || expenses.some(e => !e.name || e.cost <= 0) || quantity <= 0 || price <= 0) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Word Problem! 📊</h2>
          <p className="text-gray-600">Here&apos;s your generated problem:</p>
        </div>

        <div className="bg-forest-50 rounded-xl p-6 border border-forest-200 mb-6">
          <p className="text-gray-800 text-lg mb-4">
            You spent <strong>${totalExpenses.toFixed(2)}</strong>, earned <strong>${revenue.toFixed(2)}</strong>, 
            and made a <strong className={isLoss ? 'text-red-600' : 'text-green-600'}>{isLoss ? 'loss' : 'profit'}</strong> of <strong className={isLoss ? 'text-red-600' : 'text-green-600'}>${Math.abs(profit).toFixed(2)}</strong>.
          </p>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Expenses:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              {expenses.map(e => (
                <li key={e.id} className="flex justify-between">
                  <span>{e.name}:</span>
                  <span className="font-medium">${e.cost.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-2 pt-2 border-t border-gray-300 flex justify-between font-semibold">
              <span>Total Expenses:</span>
              <span>${totalExpenses.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>💡 Try changing the price or quantity</strong> to see how it affects your profit! 
            Experiment with different numbers to understand the relationship.
          </p>
        </div>

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ custom_problem: { product, expenses, quantity, price, revenue, profit } })}
            className="btn-primary px-8 py-3">
            Continue to Expense Types <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calculator className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 4.5B – Build Your Own Word Problem</h2>
        </div>
        <p className="text-gray-600">Create your own profit/loss scenario!</p>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block font-semibold text-gray-900 mb-2">What are you selling?</label>
          <input type="text" value={product} onChange={(e) => setProduct(e.target.value)}
            placeholder="e.g., Handmade bracelets"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-900 mb-2">List your expenses and their costs:</label>
          <div className="space-y-2 mb-2">
            {expenses.map(expense => (
              <div key={expense.id} className="flex gap-2 items-center">
                <input type="text" placeholder="Expense name" value={expense.name}
                  onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
                <div className="flex items-center gap-1 w-32">
                  <span className="text-gray-500">$</span>
                  <input type="number" step="0.01" placeholder="0.00" value={expense.cost || ''}
                    onChange={(e) => updateExpense(expense.id, 'cost', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
                {expenses.length > 1 && (
                  <button onClick={() => removeExpense(expense.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addExpense} className="btn-outline px-4 py-2 flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-900 mb-2">How many items do you sell?</label>
            <input type="number" value={quantity || ''} onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-900 mb-2">How much do you charge per item?</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">$</span>
              <input type="number" step="0.01" value={price || ''} onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>
        </div>

        {price > 0 && quantity > 0 && totalExpenses > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-forest-600" />
              Your Results:
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Revenue:</span>
                <span className="font-bold text-green-600">${revenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Expenses:</span>
                <span className="font-bold text-red-600">${totalExpenses.toFixed(2)}</span>
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
          onClick={handleSubmit}
          disabled={!product.trim() || expenses.some(e => !e.name || e.cost <= 0) || quantity <= 0 || price <= 0}
          className={`btn-primary px-8 py-3 ${!product.trim() || expenses.some(e => !e.name || e.cost <= 0) || quantity <= 0 || price <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
          Generate My Problem
        </motion.button>
      </div>
    </div>
  )
}


