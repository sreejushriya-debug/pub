'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Home, Gamepad2, PiggyBank, AlertTriangle } from 'lucide-react'

interface Activity24BProps {
  income: number
  onComplete: (data: Record<string, unknown>) => void
}

const PLANS = {
  needs: {
    title: 'Needs (Food, Dorm, Furniture)',
    icon: Home,
    options: [
      { name: 'Basic', cost: 300, description: 'Shared dorm, meal plan, minimal furniture' },
      { name: 'Intermediate', cost: 500, description: 'Standard dorm, better meal plan, basic furniture' },
      { name: 'Premium', cost: 900, description: 'Single room, premium meal plan, nice furniture' },
    ]
  },
  wants: {
    title: 'Wants (Entertainment & Hobbies)',
    icon: Gamepad2,
    options: [
      { name: 'Basic', cost: 100, description: 'Occasional movie, basic streaming' },
      { name: 'Intermediate', cost: 200, description: 'Regular outings, multiple subscriptions' },
      { name: 'Premium', cost: 400, description: 'Frequent entertainment, all subscriptions' },
    ]
  },
  savings: {
    title: 'Savings (Car & Emergency Fund)',
    icon: PiggyBank,
    options: [
      { name: 'Basic', cost: 50, description: 'Minimal savings each month' },
      { name: 'Intermediate', cost: 100, description: 'Steady savings progress' },
      { name: 'Premium', cost: 200, description: 'Aggressive savings plan' },
    ]
  },
}

export default function Activity24B({ income, onComplete }: Activity24BProps) {
  const [selections, setSelections] = useState<Record<string, number>>({})
  
  const totalSpending = Object.values(selections).reduce((sum, cost) => sum + cost, 0)
  const remaining = income - totalSpending
  const isOverBudget = remaining < 0
  const allSelected = Object.keys(selections).length === 3

  const handleSelect = (category: string, cost: number) => {
    setSelections({ ...selections, [category]: cost })
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Activity 2.4B – Choose Your Plans</h2>
        <p className="text-gray-600">Select a Basic, Intermediate, or Premium plan for each category</p>
      </div>

      {/* Budget Summary */}
      <div className={`rounded-xl p-4 mb-6 ${isOverBudget ? 'bg-red-50 border border-red-200' : 'bg-forest-50 border border-forest-200'}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">Your Monthly Income</p>
            <p className="text-xl font-bold text-forest-600">${income.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Spending</p>
            <p className={`text-xl font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>${totalSpending}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Remaining</p>
            <p className={`text-xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>${remaining}</p>
          </div>
        </div>
        {isOverBudget && (
          <div className="flex items-center gap-2 mt-3 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">Over budget! Try choosing lower-cost plans.</span>
          </div>
        )}
      </div>

      {/* Plan Selection */}
      <div className="space-y-6 mb-8">
        {Object.entries(PLANS).map(([key, category]) => {
          const Icon = category.icon
          return (
            <div key={key} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-forest-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-forest-600" />
                </div>
                <h3 className="font-bold text-gray-900">{category.title}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {category.options.map((option) => (
                  <motion.button
                    key={option.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(key, option.cost)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selections[key] === option.cost
                        ? 'border-forest-500 bg-forest-50'
                        : 'border-gray-200 hover:border-forest-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{option.name}</span>
                      <span className="font-bold text-forest-600">${option.cost}</span>
                    </div>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center">
        <motion.button
          whileHover={allSelected && !isOverBudget ? { scale: 1.02 } : {}}
          whileTap={allSelected && !isOverBudget ? { scale: 0.98 } : {}}
          onClick={() => onComplete({
            needsPlan: selections.needs,
            wantsPlan: selections.wants,
            savingsPlan: selections.savings,
          })}
          disabled={!allSelected || isOverBudget}
          className={`btn-primary px-8 py-3 ${!allSelected || isOverBudget ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isOverBudget ? 'Reduce spending to continue' : !allSelected ? 'Select all three plans' : 'Calculate My Budget'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}


