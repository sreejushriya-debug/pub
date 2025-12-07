'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, ThumbsUp, ThumbsDown, RotateCcw, X } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const ITEMS = [
  { text: 'Get something you need immediately', type: 'benefit' },
  { text: 'Build your credit score by paying on time', type: 'benefit' },
  { text: 'Convenient - no need to carry cash', type: 'benefit' },
  { text: 'Can help in emergencies', type: 'benefit' },
  { text: 'Late fees if you miss a payment', type: 'risk' },
  { text: 'You pay more overall because of interest', type: 'risk' },
  { text: 'Easy to overspend and get into debt', type: 'risk' },
  { text: 'Can hurt your credit score if misused', type: 'risk' },
]

export default function Activity33B({ onComplete }: Props) {
  const [placements, setPlacements] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)

  const handlePlace = (text: string, type: 'benefit' | 'risk') => {
    if (checked && allCorrect) return
    setPlacements({ ...placements, [text]: type })
    setChecked(false)
  }

  const handleRemove = (text: string) => {
    if (checked && allCorrect) return
    const newPlacements = { ...placements }
    delete newPlacements[text]
    setPlacements(newPlacements)
    setChecked(false)
  }

  const handleTryAgain = () => {
    // Remove only incorrect placements
    const correct: Record<string, string> = {}
    Object.entries(placements).forEach(([text, type]) => {
      const item = ITEMS.find(i => i.text === text)
      if (item?.type === type) {
        correct[text] = type
      }
    })
    setPlacements(correct)
    setChecked(false)
  }

  const allCorrect = ITEMS.every(item => placements[item.text] === item.type)
  const benefitItems = Object.entries(placements).filter(([_, t]) => t === 'benefit').map(([text]) => text)
  const riskItems = Object.entries(placements).filter(([_, t]) => t === 'risk').map(([text]) => text)
  const unplaced = ITEMS.filter(item => !placements[item.text])

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Activity 3.3B – Benefits vs Risks of Credit</h2>
        <p className="text-gray-600">Sort each statement into Benefits or Risks of using credit</p>
      </div>

      {/* Unplaced items */}
      {unplaced.length > 0 && (
        <div className="bg-gray-100 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Click the thumbs up or down to sort (or click placed items to move them):</p>
          <div className="space-y-2">
            {unplaced.map(item => (
              <div key={item.text} className="flex gap-2">
                <span className="flex-1 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm">{item.text}</span>
                <button onClick={() => handlePlace(item.text, 'benefit')}
                  className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium">
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button onClick={() => handlePlace(item.text, 'risk')}
                  className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium">
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Benefits */}
        <div className={`p-5 rounded-xl border-2 min-h-[200px] ${checked ? 'border-green-300 bg-green-50' : 'border-green-200 bg-green-50/50'}`}>
          <div className="flex items-center gap-2 mb-4">
            <ThumbsUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Benefits of Credit</h3>
          </div>
          <div className="space-y-2">
            {benefitItems.map(text => {
              const item = ITEMS.find(i => i.text === text)
              const isCorrect = item?.type === 'benefit'
              return (
                <button
                  key={text}
                  onClick={() => !checked || !allCorrect ? handleRemove(text) : undefined}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
                    checked ? (isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800') : 'bg-green-100 text-green-700 hover:bg-green-200'
                  } ${checked && allCorrect ? 'cursor-default' : 'cursor-pointer'}`}
                  title={checked && allCorrect ? '' : 'Click to remove and try again'}
                >
                  {checked && (isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />)}
                  {text}
                  {!checked && <X className="w-3 h-3 ml-auto opacity-50" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Risks */}
        <div className={`p-5 rounded-xl border-2 min-h-[200px] ${checked ? 'border-red-300 bg-red-50' : 'border-red-200 bg-red-50/50'}`}>
          <div className="flex items-center gap-2 mb-4">
            <ThumbsDown className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Risks of Credit</h3>
          </div>
          <div className="space-y-2">
            {riskItems.map(text => {
              const item = ITEMS.find(i => i.text === text)
              const isCorrect = item?.type === 'risk'
              return (
                <button
                  key={text}
                  onClick={() => !checked || !allCorrect ? handleRemove(text) : undefined}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
                    checked ? (isCorrect ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800') : 'bg-red-100 text-red-700 hover:bg-red-200'
                  } ${checked && allCorrect ? 'cursor-default' : 'cursor-pointer'}`}
                  title={checked && allCorrect ? '' : 'Click to remove and try again'}
                >
                  {checked && (isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />)}
                  {text}
                  {!checked && <X className="w-3 h-3 ml-auto opacity-50" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {checked && allCorrect && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Perfect!</strong> You correctly sorted all the benefits and risks!</p>
        </div>
      )}

      {checked && !allCorrect && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800 mb-2"><strong>Almost!</strong> Some items are in the wrong column. Look at the red/amber ones.</p>
          <p className="text-amber-700 text-sm">💡 Click on any item in a column to remove it and place it in the correct one!</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!(allCorrect && checked) && (
          <>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setChecked(true)} disabled={unplaced.length > 0}
              className={`btn-primary px-6 py-3 ${unplaced.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {unplaced.length > 0 ? `Sort ${unplaced.length} more` : 'Check Answers'}
            </motion.button>
            {checked && !allCorrect && (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleTryAgain} className="btn-outline px-6 py-3 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Try Again
              </motion.button>
            )}
          </>
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

