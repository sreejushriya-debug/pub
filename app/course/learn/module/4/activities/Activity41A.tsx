'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShoppingCart, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const CUPS = [
  { id: 'holder', name: 'Cup with Holder', price: 5 },
  { id: 'straw', name: 'Cup with Straw', price: 10 },
  { id: 'lid', name: 'Cup with Lid', price: 15 },
]

const FRUIT = [
  { id: 'limes', name: 'Limes', price: 22 },
  { id: 'lemons', name: 'Lemons', price: 25 },
  { id: 'oranges', name: 'Oranges', price: 30 },
]

const DISPENSERS = [
  { id: 'pitcher', name: 'Pitcher', price: 15 },
  { id: 'tap', name: 'Dispenser with Tap', price: 20 },
  { id: 'automatic', name: 'Automatic Dispenser', price: 50 },
]

const BUDGET = 100

export default function Activity41A({ onComplete }: Props) {
  const [selectedCups, setSelectedCups] = useState<string[]>([])
  const [selectedFruit, setSelectedFruit] = useState<string[]>([])
  const [selectedDispenser, setSelectedDispenser] = useState<string>('')

  const calculateTotal = () => {
    const cupCost = selectedCups.reduce((sum, id) => sum + CUPS.find(c => c.id === id)!.price, 0)
    const fruitCost = selectedFruit.reduce((sum, id) => sum + FRUIT.find(f => f.id === id)!.price, 0)
    const dispenserCost = selectedDispenser ? DISPENSERS.find(d => d.id === selectedDispenser)!.price : 0
    return cupCost + fruitCost + dispenserCost
  }

  const total = calculateTotal()
  const isOverBudget = total > BUDGET
  const canContinue = selectedCups.length > 0 && selectedFruit.length > 0 && selectedDispenser && !isOverBudget

  const toggleCup = (id: string) => {
    if (selectedCups.includes(id)) {
      setSelectedCups(selectedCups.filter(c => c !== id))
    } else if (selectedCups.length < 2) {
      setSelectedCups([...selectedCups, id])
    }
  }

  const toggleFruit = (id: string) => {
    if (selectedFruit.includes(id)) {
      setSelectedFruit(selectedFruit.filter(f => f !== id))
    } else if (selectedFruit.length < 2) {
      setSelectedFruit([...selectedFruit, id])
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShoppingCart className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 4.1A – Choose Your Supplies</h2>
        </div>
        <p className="text-gray-600">Pick supplies for your juice stand within a $100 budget!</p>
      </div>

      {/* Budget Summary */}
      <div className={`rounded-xl p-4 mb-6 ${isOverBudget ? 'bg-red-50 border border-red-200' : total === BUDGET ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Budget</p>
            <p className="text-2xl font-bold text-forest-600">${BUDGET}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>${total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Remaining</p>
            <p className={`text-2xl font-bold ${BUDGET - total < 0 ? 'text-red-600' : BUDGET - total === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              ${BUDGET - total}
            </p>
          </div>
        </div>
        {isOverBudget && (
          <div className="flex items-center gap-2 mt-3 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">You&apos;re over budget! Remove or change something.</span>
          </div>
        )}
      </div>

      {/* Cups */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">Cups (choose 1-2 types)</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {CUPS.map(cup => {
            const isSelected = selectedCups.includes(cup.id)
            return (
              <motion.button key={cup.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => toggleCup(cup.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected ? 'border-forest-500 bg-forest-50' : 'border-gray-200 hover:border-forest-300'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{cup.name}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-forest-500" />}
                </div>
                <p className="text-sm text-gray-600">${cup.price}/100 cups</p>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Fruit */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">Fruit (choose 1-2 types)</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {FRUIT.map(fruit => {
            const isSelected = selectedFruit.includes(fruit.id)
            return (
              <motion.button key={fruit.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => toggleFruit(fruit.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected ? 'border-forest-500 bg-forest-50' : 'border-gray-200 hover:border-forest-300'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{fruit.name}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-forest-500" />}
                </div>
                <p className="text-sm text-gray-600">${fruit.price}/50 pieces</p>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Dispensers */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Dispenser (choose 1)</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {DISPENSERS.map(disp => {
            const isSelected = selectedDispenser === disp.id
            return (
              <motion.button key={disp.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDispenser(isSelected ? '' : disp.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected ? 'border-forest-500 bg-forest-50' : 'border-gray-200 hover:border-forest-300'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{disp.name}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-forest-500" />}
                </div>
                <p className="text-sm text-gray-600">${disp.price}</p>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={canContinue ? { scale: 1.02 } : {}} whileTap={canContinue ? { scale: 0.98 } : {}}
          onClick={() => onComplete({
            supplies: { cups: selectedCups, fruit: selectedFruit, dispenser: selectedDispenser },
            totalCost: total
          })}
          disabled={!canContinue}
          className={`btn-primary px-8 py-3 ${!canContinue ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {isOverBudget ? 'Reduce spending to continue' : !selectedCups.length || !selectedFruit.length || !selectedDispenser ? 'Select all categories' : 'Continue to Calculate Profit'} 
          <ArrowRight className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
    </div>
  )
}


