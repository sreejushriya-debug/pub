'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, GraduationCap, DollarSign } from 'lucide-react'

interface Activity24AProps {
  onComplete: (data: Record<string, unknown>) => void
}

const OPTIONS = [
  {
    id: 1,
    title: 'Option 1: Scholarship Only',
    scholarship: 2000,
    parents: 1000,
    job: null,
    hourlyRate: 0,
    monthlyIncome: 3000,
    description: '$2,000 scholarship + $1,000 from parents, no job'
  },
  {
    id: 2,
    title: 'Option 2: Part-Time Job ($9/hr)',
    scholarship: 3000,
    parents: 2000,
    job: 'Part-time at $9/hour',
    hourlyRate: 9,
    hoursPerMonth: 40,
    monthlyIncome: 5360,
    description: '$3,000 scholarship + $2,000 from parents + part-time job at $9/hr (40 hrs/month = $360)'
  },
  {
    id: 3,
    title: 'Option 3: Part-Time Job ($10/hr)',
    scholarship: 3000,
    parents: 2000,
    job: 'Part-time at $10/hour',
    hourlyRate: 10,
    hoursPerMonth: 40,
    monthlyIncome: 5400,
    description: '$3,000 scholarship + $2,000 from parents + part-time job at $10/hr (40 hrs/month = $400)'
  },
]

export default function Activity24A({ onComplete }: Activity24AProps) {
  const [selected, setSelected] = useState<number | null>(null)

  const selectedOption = OPTIONS.find(o => o.id === selected)

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <GraduationCap className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 2.4A – Pick Your Income</h2>
        </div>
        <p className="text-gray-600">Imagine you&apos;re a college student. Choose your income scenario!</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Scenario:</strong> You&apos;re starting college and need to plan your monthly budget. 
          Pick one of these three income options to see how much money you&apos;ll have to work with.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {OPTIONS.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelected(option.id)}
            className={`w-full text-left p-5 rounded-2xl border-3 transition-all ${
              selected === option.id
                ? 'border-forest-500 bg-forest-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-forest-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Scholarship: ${option.scholarship.toLocaleString()}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Parents: ${option.parents.toLocaleString()}
                  </span>
                  {option.job && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      Job: ${(option.hourlyRate * (option.hoursPerMonth || 40))}/month
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm text-gray-500">Monthly Total</p>
                <p className="text-2xl font-bold text-forest-600">
                  <DollarSign className="w-5 h-5 inline" />
                  {option.monthlyIncome.toLocaleString()}
                </p>
              </div>
            </div>
            {selected === option.id && (
              <div className="mt-3 pt-3 border-t border-forest-200">
                <p className="text-forest-700 text-sm">✓ Selected! You&apos;ll plan with ${option.monthlyIncome.toLocaleString()}/month</p>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {selected && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800 text-sm">
            <strong>💡 Think about it:</strong> More income means more options, but having a job also takes time away from studying. 
            There are tradeoffs to consider!
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <motion.button
          whileHover={selected ? { scale: 1.02 } : {}}
          whileTap={selected ? { scale: 0.98 } : {}}
          onClick={() => selectedOption && onComplete({ selectedIncome: selectedOption.monthlyIncome, incomeOption: selected })}
          disabled={!selected}
          className={`btn-primary px-8 py-3 ${!selected ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Continue with ${selectedOption?.monthlyIncome.toLocaleString() || '---'}/month <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}

