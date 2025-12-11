'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, TrendingDown, Activity } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const CHARTS = [
  { id: 1, data: [2, 3, 4, 5, 7, 8, 9], answer: 'up', label: 'Overall Up' },
  { id: 2, data: [9, 8, 7, 5, 4, 3, 2], answer: 'down', label: 'Overall Down' },
  { id: 3, data: [5, 7, 4, 8, 3, 6, 5], answer: 'mixed', label: 'Mixed/Volatile' },
  { id: 4, data: [4, 6, 5, 7, 6, 8, 7], answer: 'up', label: 'Overall Up' },
]

const OPTIONS = [
  { value: 'up', label: 'Overall Up', icon: TrendingUp, color: 'green' },
  { value: 'down', label: 'Overall Down', icon: TrendingDown, color: 'red' },
  { value: 'mixed', label: 'Mixed/Volatile', icon: Activity, color: 'amber' },
]

export default function Activity34B({ onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState(false)

  const allCorrect = CHARTS.every(c => answers[c.id] === c.answer)
  const allAnswered = Object.keys(answers).length === CHARTS.length

  const MiniChart = ({ data }: { data: number[] }) => {
    const width = 120, height = 60
    const max = Math.max(...data), min = Math.min(...data)
    const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / (max - min || 1)) * height}`).join(' ')
    return (
      <svg width={width} height={height} className="mx-auto">
        <polyline points={points} fill="none" stroke="#059669" strokeWidth="2" />
      </svg>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Activity 3.4B – Identify Trend Types</h2>
        <p className="text-gray-600">Look at each mini chart and identify the overall trend</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {CHARTS.map(chart => {
          const isCorrect = checked && answers[chart.id] === chart.answer
          const isWrong = checked && answers[chart.id] && answers[chart.id] !== chart.answer
          return (
            <div key={chart.id} className={`p-5 rounded-xl border-2 ${
              isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
            }`}>
              <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                <MiniChart data={chart.data} />
              </div>
              <div className="flex gap-2">
                {OPTIONS.map(opt => {
                  const Icon = opt.icon
                  const isSelected = answers[chart.id] === opt.value
                  return (
                    <button key={opt.value} onClick={() => !checked && setAnswers({ ...answers, [chart.id]: opt.value })}
                      className={`flex-1 p-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all ${
                        isSelected ? `bg-${opt.color}-100 border-2 border-${opt.color}-400 text-${opt.color}-700` :
                        'bg-gray-100 border-2 border-transparent hover:border-gray-300'
                      }`}>
                      <Icon className="w-4 h-4" />
                      {opt.label}
                    </button>
                  )
                })}
              </div>
              {isWrong && (
                <p className="text-sm text-amber-600 mt-2">The correct answer is: {chart.label}</p>
              )}
            </div>
          )
        })}
      </div>

      {checked && allCorrect && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Excellent!</strong> You correctly identified all the trends!</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>💡 Remember:</strong> Stocks can go up overall but still have down days. What matters is the general direction over time.
        </p>
      </div>

      <div className="flex justify-center">
        {!(allCorrect && checked) && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setChecked(true)} disabled={!allAnswered}
            className={`btn-primary px-6 py-3 ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}>
            Check Answers
          </motion.button>
        )}
        {allCorrect && checked && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({})} className="btn-primary px-8 py-3">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}


