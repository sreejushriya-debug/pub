'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import BrightCompanion from './BrightCompanion'

interface ActivityContext {
  moduleNumber: number
  activityKey: string
  activityName: string
  conceptTags: string[]
  // Optional: recent activity results for more targeted help
  recentAttempt?: {
    questionText?: string
    userAnswer?: string
    correctAnswer?: string
    wasCorrect?: boolean
  }
}

interface AskBrightProps {
  context: ActivityContext
}

export default function AskBright({ context }: AskBrightProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-forest-600 to-forest-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 group"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
              Ask Bright
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Companion Chat */}
      <BrightCompanion
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        context={context}
      />
    </>
  )
}

