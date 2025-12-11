'use client'

import { motion } from 'framer-motion'
import { ArrowRight, PieChart } from 'lucide-react'

interface Activity23BProps {
  budgetData: {
    income: number
    categories: { name: string; amount: number }[]
  }
  onComplete: (data: Record<string, unknown>) => void
}

const COLORS = [
  '#059669', '#0891b2', '#7c3aed', '#db2777', '#ea580c', 
  '#84cc16', '#f59e0b', '#6366f1', '#14b8a6', '#f43f5e'
]

export default function Activity23B({ budgetData, onComplete }: Activity23BProps) {
  const { income, categories } = budgetData
  const total = categories.reduce((sum, cat) => sum + cat.amount, 0)
  
  // Calculate percentages and angles for pie chart
  let currentAngle = 0
  const slices = categories.filter(c => c.amount > 0).map((cat, idx) => {
    const percentage = (cat.amount / total) * 100
    const angle = (percentage / 100) * 360
    const slice = {
      name: cat.name,
      amount: cat.amount,
      percentage: Math.round(percentage),
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: COLORS[idx % COLORS.length]
    }
    currentAngle += angle
    return slice
  })

  // Create SVG pie chart path
  const createPieSlice = (startAngle: number, endAngle: number, color: string) => {
    const radius = 100
    const cx = 120
    const cy = 120
    
    const startRad = (startAngle - 90) * Math.PI / 180
    const endRad = (endAngle - 90) * Math.PI / 180
    
    const x1 = cx + radius * Math.cos(startRad)
    const y1 = cy + radius * Math.sin(startRad)
    const x2 = cx + radius * Math.cos(endRad)
    const y2 = cy + radius * Math.sin(endRad)
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
  }

  const savingsCategory = categories.find(c => c.name.toLowerCase() === 'savings')
  const savingsPercent = savingsCategory ? Math.round((savingsCategory.amount / income) * 100) : 0

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <PieChart className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 2.3B – Your Budget Pie Chart</h2>
        </div>
        <p className="text-gray-600">See how your money is divided across categories</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart */}
        <div className="flex justify-center">
          <svg width="240" height="240" viewBox="0 0 240 240">
            {slices.map((slice, idx) => (
              <motion.path
                key={idx}
                d={createPieSlice(slice.startAngle, slice.endAngle, slice.color)}
                fill={slice.color}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
            <circle cx="120" cy="120" r="40" fill="white" />
            <text x="120" y="115" textAnchor="middle" className="text-sm font-bold fill-gray-900">Total</text>
            <text x="120" y="135" textAnchor="middle" className="text-lg font-bold fill-forest-600">${total}</text>
          </svg>
        </div>

        {/* Legend */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Budget Breakdown</h3>
          <div className="space-y-3">
            {slices.map((slice, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: slice.color }} />
                  <span className="font-medium">{slice.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">${slice.amount}</span>
                  <span className="text-gray-500 ml-2">({slice.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis */}
      <div className={`rounded-xl p-5 mb-6 ${savingsPercent >= 10 ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
        <h3 className="font-semibold mb-2 ${savingsPercent >= 10 ? 'text-green-800' : 'text-amber-800'}">
          {savingsPercent >= 20 ? '🌟 Excellent Savings!' : savingsPercent >= 10 ? '👍 Good Savings!' : '⚠️ Consider Saving More'}
        </h3>
        <p className={savingsPercent >= 10 ? 'text-green-700' : 'text-amber-700'}>
          You&apos;re saving <strong>{savingsPercent}%</strong> of your income.
          {savingsPercent >= 20 && ' That\'s amazing! You\'re building great financial habits.'}
          {savingsPercent >= 10 && savingsPercent < 20 && ' That\'s a solid start! Try to work up to 20% over time.'}
          {savingsPercent < 10 && ' Financial experts recommend saving at least 10-20% of your income.'}
        </p>
      </div>

      {/* Unallocated */}
      {income - total > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800">
            <strong>Note:</strong> You have ${income - total} unallocated. Consider adding it to savings!
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => onComplete({})} className="btn-primary px-8 py-3">
          Continue to Evaluation <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}


