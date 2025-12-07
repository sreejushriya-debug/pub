'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calculator, Car, TrendingUp } from 'lucide-react'

interface Activity24CProps {
  income: number
  needsPlan: number
  wantsPlan: number
  savingsPlan: number
  onComplete: (data: Record<string, unknown>) => void
}

export default function Activity24C({ income, needsPlan, wantsPlan, savingsPlan, onComplete }: Activity24CProps) {
  const [carCost, setCarCost] = useState(3000)
  
  const totalSpending = needsPlan + wantsPlan + savingsPlan
  const leftover = income - totalSpending
  const totalMonthlySavings = savingsPlan + (leftover > 0 ? leftover : 0)
  const monthsToSaveCar = totalMonthlySavings > 0 ? Math.ceil(carCost / totalMonthlySavings) : Infinity

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calculator className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 2.4C – Your Budget Summary</h2>
        </div>
        <p className="text-gray-600">See how your choices add up!</p>
      </div>

      {/* Budget Breakdown */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6">
        <div className="bg-forest-500 text-white p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Monthly Income</span>
            <span className="text-2xl font-bold">${income.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-700">Needs (Food, Dorm, Furniture)</span>
            <span className="font-bold text-red-600">- ${needsPlan}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-700">Wants (Entertainment)</span>
            <span className="font-bold text-red-600">- ${wantsPlan}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-700">Savings (Planned)</span>
            <span className="font-bold text-green-600">→ ${savingsPlan}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-dashed">
            <span className="text-gray-700">Total Spending</span>
            <span className="font-bold">${totalSpending}</span>
          </div>
          <div className="flex items-center justify-between py-2 bg-green-50 -mx-4 px-4 rounded-lg">
            <span className="font-semibold text-green-800">Money Left Over</span>
            <span className="text-xl font-bold text-green-600">${leftover}</span>
          </div>
        </div>
      </div>

      {/* Car Savings Calculator */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Car className="w-6 h-6 text-blue-600" />
          <h3 className="font-bold text-gray-900">Car Savings Goal</h3>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">How much does the car cost?</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">$</span>
            <input
              type="number"
              value={carCost}
              onChange={(e) => setCarCost(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-32 px-4 py-2 border-2 border-gray-300 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">With ${totalMonthlySavings}/month in total savings...</p>
              <p className="text-2xl font-bold text-purple-700">
                {monthsToSaveCar === Infinity 
                  ? "You won't save anything!" 
                  : `${monthsToSaveCar} months to buy the car`}
              </p>
              {monthsToSaveCar !== Infinity && (
                <p className="text-sm text-gray-500">That&apos;s about {(monthsToSaveCar / 12).toFixed(1)} years</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-amber-800 text-sm">
          <strong>💡 Food for thought:</strong> 
          {leftover > 100 
            ? " You have good leftover money! Consider adding more to savings." 
            : leftover > 0 
            ? " You're living within your means, but there's not much buffer for emergencies."
            : " You're spending everything you make. Consider reducing wants to save more."}
        </p>
      </div>

      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onComplete({ monthsToSaveCar, totalMonthlySavings, leftover })}
          className="btn-primary px-8 py-3"
        >
          Continue to Reflection <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}

