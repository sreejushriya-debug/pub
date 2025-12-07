'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, FileText, RotateCcw, X } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const CHECK_PARTS = [
  { id: 'name', label: 'Your Name & Address', x: 5, y: 5, w: 30, h: 15 },
  { id: 'date', label: 'Date', x: 70, y: 5, w: 25, h: 10 },
  { id: 'number', label: 'Check Number', x: 85, y: 0, w: 15, h: 8 },
  { id: 'payee', label: 'Pay to the Order of (Payee)', x: 5, y: 25, w: 60, h: 12 },
  { id: 'amount_num', label: 'Amount (Numbers)', x: 70, y: 25, w: 25, h: 12 },
  { id: 'amount_words', label: 'Amount (Words)', x: 5, y: 42, w: 90, h: 12 },
  { id: 'memo', label: 'Memo', x: 5, y: 75, w: 35, h: 12 },
  { id: 'signature', label: 'Signature', x: 55, y: 75, w: 40, h: 12 },
  { id: 'routing', label: 'Routing Number', x: 5, y: 90, w: 25, h: 8 },
  { id: 'account', label: 'Account Number', x: 35, y: 90, w: 25, h: 8 },
]

export default function Activity35A({ onComplete }: Props) {
  const [placements, setPlacements] = useState<Record<string, string>>({})
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)

  const allCorrect = CHECK_PARTS.every(part => placements[part.id] === part.label)
  const placedLabels = Object.values(placements)

  const handleSpotClick = (partId: string) => {
    if (checked && allCorrect) return
    
    // If clicking on a placed label, remove it
    if (placements[partId] && !selectedLabel) {
      const newPlacements = { ...placements }
      delete newPlacements[partId]
      setPlacements(newPlacements)
      setChecked(false)
      return
    }
    
    // If a label is selected, place it
    if (selectedLabel) {
      setPlacements({ ...placements, [partId]: selectedLabel })
      setSelectedLabel(null)
      setChecked(false)
    }
  }

  const handleTryAgain = () => {
    // Remove only incorrect placements
    const correct: Record<string, string> = {}
    Object.entries(placements).forEach(([partId, label]) => {
      const part = CHECK_PARTS.find(p => p.id === partId)
      if (part && label === part.label) {
        correct[partId] = label
      }
    })
    setPlacements(correct)
    setChecked(false)
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FileText className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 3.5A – Label the Parts of a Check</h2>
        </div>
        <p className="text-gray-600">Click a label, then click where it belongs on the check</p>
      </div>

      {/* Labels to place */}
      <div className="bg-gray-100 rounded-xl p-4 mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Click a label to place it (or click placed labels on the check to remove them):</p>
        <div className="flex flex-wrap gap-2">
          {CHECK_PARTS.map(part => {
            const isPlaced = placedLabels.includes(part.label)
            const isSelected = selectedLabel === part.label
            return (
              <button key={part.label} onClick={() => !checked || !allCorrect ? setSelectedLabel(isSelected ? null : part.label) : undefined}
                disabled={checked && allCorrect}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isPlaced ? 'bg-gray-300 text-gray-500 line-through' :
                  isSelected ? 'bg-forest-500 text-white shadow-lg' :
                  'bg-white border border-gray-300 hover:border-forest-400'
                }`}>
                {part.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Check visual */}
      <div className="mb-6 overflow-auto max-h-[500px] border-2 border-gray-200 rounded-xl">
        <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-gray-300 rounded-xl p-4 relative min-w-[600px] min-h-[300px]" style={{ aspectRatio: '2.5/1' }}>
          {/* Check background design */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 text-6xl">🏦</div>
          </div>
          
          {CHECK_PARTS.map(part => {
            const placed = placements[part.id]
            const isCorrect = checked && placed === part.label
            const isWrong = checked && placed && placed !== part.label
            
            return (
              <motion.div
                key={part.id}
                onClick={() => handleSpotClick(part.id)}
                whileHover={(selectedLabel && !placed) || (placed && !checked) ? { scale: 1.05 } : {}}
                className={`absolute border-2 border-dashed rounded-lg flex items-center justify-center text-xs p-1 transition-all ${
                  isCorrect ? 'border-green-500 bg-green-100 cursor-default' :
                  isWrong ? 'border-red-500 bg-red-100 cursor-pointer hover:bg-red-200' :
                  placed ? 'border-forest-500 bg-forest-50 cursor-pointer hover:bg-forest-100' :
                  selectedLabel ? 'border-forest-400 bg-forest-50/50 hover:bg-forest-100 cursor-pointer' : 'border-gray-400 bg-white/50 cursor-pointer'
                }`}
                style={{ left: `${part.x}%`, top: `${part.y}%`, width: `${part.w}%`, height: `${part.h}%` }}
                title={placed && !checked ? 'Click to remove' : placed && isWrong ? 'Click to remove and try again' : selectedLabel ? 'Click to place label' : 'Click to place a label here'}
              >
                {placed && (
                  <span className={`text-center font-medium flex items-center gap-1 ${isCorrect ? 'text-green-700' : isWrong ? 'text-red-700' : 'text-forest-700'}`}>
                    {placed}
                    {isCorrect && <CheckCircle2 className="w-3 h-3" />}
                    {isWrong && <X className="w-3 h-3" />}
                    {!checked && <X className="w-3 h-3 opacity-50" />}
                  </span>
                )}
                {!placed && <span className="text-gray-400">?</span>}
              </motion.div>
            )
          })}
        </div>
      </div>

      {checked && allCorrect && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800"><strong>🎉 Perfect!</strong> You labeled all the parts of the check correctly!</p>
        </div>
      )}

      {checked && !allCorrect && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800 mb-2"><strong>Almost!</strong> Some labels are in the wrong place. Look at the red ones.</p>
          <p className="text-amber-700 text-sm">💡 Click on any label on the check to remove it, then place it in the correct spot!</p>
        </div>
      )}

      <div className="flex justify-center gap-4">
        {!(allCorrect && checked) && (
          <>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setChecked(true)} disabled={Object.keys(placements).length < CHECK_PARTS.length}
              className={`btn-primary px-6 py-3 ${Object.keys(placements).length < CHECK_PARTS.length ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {Object.keys(placements).length < CHECK_PARTS.length ? `Label ${CHECK_PARTS.length - Object.keys(placements).length} more` : 'Check Answers'}
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
            Continue to Write a Check <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

