'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, RotateCw, ThumbsUp, ThumbsDown } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const FLASHCARDS = [
  { term: 'Credit', definition: 'The ability to borrow money with the promise to pay it back later. Credit cards let you buy things now and pay the bill later.' },
  { term: 'Deposit', definition: 'Money placed into a bank account. When you put cash or a check into your account, that\'s a deposit.' },
  { term: 'Interest', definition: 'Extra money paid for borrowing, or earned for saving. Banks pay you interest on savings, and charge interest on loans.' },
  { term: 'Debt', definition: 'Money that is owed to someone else. If you borrow money, you\'re in debt until you pay it back.' },
  { term: 'Loan', definition: 'Money borrowed that must be repaid over time, usually with interest. People get loans for cars, houses, and college.' },
]

export default function Activity31B({ onComplete }: Props) {
  const [currentCard, setCurrentCard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [confidence, setConfidence] = useState<Record<number, boolean>>({})
  const [complete, setComplete] = useState(false)

  const handleConfidence = (confident: boolean) => {
    setConfidence({ ...confidence, [currentCard]: confident })
    if (currentCard < FLASHCARDS.length - 1) {
      setCurrentCard(prev => prev + 1)
      setIsFlipped(false)
    } else {
      setComplete(true)
    }
  }

  const notConfident = Object.entries(confidence).filter(([_, v]) => !v).map(([k]) => FLASHCARDS[parseInt(k)].term)

  if (complete) {
    const confidentCount = Object.values(confidence).filter(v => v).length
    return (
      <div className="p-6 md:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Flashcards Complete! 📚</h2>
          <p className="text-4xl font-bold text-forest-600 mb-2">{confidentCount}/{FLASHCARDS.length}</p>
          <p className="text-gray-600 mb-6">terms you feel confident about</p>
          
          {notConfident.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-amber-800 font-medium mb-2">Terms to review later:</p>
              <p className="text-amber-700">{notConfident.join(', ')}</p>
            </div>
          )}

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ activity_31b_confident: confidentCount, activity_31b_notConfident: notConfident })}
            className="btn-primary px-8 py-3">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  const card = FLASHCARDS[currentCard]

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Activity 3.1B – Flashcard Definitions</h2>
        <p className="text-gray-600">Flip each card to see the definition, then rate your confidence</p>
      </div>

      <div className="mb-4 text-center text-sm text-gray-500">Card {currentCard + 1} of {FLASHCARDS.length}</div>

      <div className="flex justify-center mb-8">
        <motion.div
          className="w-full max-w-md h-64 cursor-pointer perspective-1000"
          onClick={() => setIsFlipped(!isFlipped)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="relative w-full h-full"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div className={`absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center backface-hidden ${isFlipped ? 'opacity-0' : ''}`}
              style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', backfaceVisibility: 'hidden' }}>
              <p className="text-white text-3xl font-bold">{card.term}</p>
              <p className="text-white/70 text-sm mt-4 flex items-center gap-2">
                <RotateCw className="w-4 h-4" /> Click to flip
              </p>
            </div>
            
            {/* Back */}
            <div className={`absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center bg-white border-2 border-forest-200 ${!isFlipped ? 'opacity-0' : ''}`}
              style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
              <p className="text-gray-800 text-center leading-relaxed">{card.definition}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {isFlipped && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-gray-700 font-medium mb-4">Do you feel confident you know this term?</p>
          <div className="flex justify-center gap-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleConfidence(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl">
              <ThumbsUp className="w-5 h-5" /> Yes, I got it!
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleConfidence(false)}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl">
              <ThumbsDown className="w-5 h-5" /> Need more practice
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

