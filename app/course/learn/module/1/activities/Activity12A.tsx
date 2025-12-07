'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, RotateCcw } from 'lucide-react'

interface Activity12AProps {
  onComplete: (data: Record<string, unknown>) => void
}

const WORD_BANK = [
  'debt', 'budget', 'credit', 'loan', 'account', 'savings', 
  'expenses', 'pension', 'insurance', 'stock market', 'business', 
  'interest', 'investments', 'salary'
]

const SENTENCES = [
  { id: 1, text: "When David lost his job, he couldn't pay his bills and fell into ___.", answer: 'debt', hint: "This word means money you owe and haven't paid back yet." },
  { id: 2, text: "To keep track of her money, Sarah created a monthly ___ that showed her income and spending.", answer: 'budget', hint: "This is a plan for how to spend and save your money." },
  { id: 3, text: "Since Maria had good ___, the bank trusted her to pay back the money she borrowed.", answer: 'credit', hint: "This is your reputation for paying back money you borrow." },
  { id: 4, text: "Tom borrowed money from the bank. He will pay back this ___ with interest over 5 years.", answer: 'loan', hint: "This is money borrowed that must be paid back." },
  { id: 5, text: "Emma opened a bank ___ so she had a safe place to keep her money.", answer: 'account', hint: "This is where you keep your money at a bank." },
  { id: 6, text: "Jake put part of his allowance into ___ every week to buy a bike later.", answer: 'savings', hint: "This is money you set aside for future use." },
  { id: 7, text: "After adding up all her ___, Lisa realized she spent too much on snacks.", answer: 'expenses', hint: "This word means the money you spend." },
  { id: 8, text: "Grandpa gets money from his ___ every month since he retired from work.", answer: 'pension', hint: "This is retirement money for people who stopped working." },
  { id: 9, text: "Dad pays for ___ so the family is protected if something bad happens to the car or house.", answer: 'insurance', hint: "This protects you financially if something goes wrong." },
  { id: 10, text: "Many people buy and sell shares of companies on the ___.", answer: 'stock market', hint: "This is where people trade ownership pieces of companies." },
  { id: 11, text: "Mrs. Chen runs her own ___ selling homemade cookies.", answer: 'business', hint: "This is an organization that makes or sells things." },
  { id: 12, text: "When you save money in a bank, you earn ___ on your balance.", answer: 'interest', hint: "This is extra money the bank pays you for keeping money there." },
]

export default function Activity12A({ onComplete }: Activity12AProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState(false)
  const [showHint, setShowHint] = useState<number | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [missedWords, setMissedWords] = useState<string[]>([])

  const handleChange = (id: number, value: string) => {
    setAnswers({ ...answers, [id]: value })
    setChecked(false)
  }

  const handleCheck = () => {
    setAttempts(prev => prev + 1)
    setChecked(true)
    
    const missed: string[] = []
    SENTENCES.forEach(s => {
      if (answers[s.id]?.toLowerCase() !== s.answer.toLowerCase()) {
        missed.push(s.answer)
      }
    })
    setMissedWords(prev => {
      const combined = new Set([...prev, ...missed])
      return Array.from(combined)
    })
  }

  const allCorrect = SENTENCES.every(s => 
    answers[s.id]?.toLowerCase() === s.answer.toLowerCase()
  )

  const getResult = (sentence: typeof SENTENCES[0]) => {
    if (!checked) return null
    return answers[sentence.id]?.toLowerCase() === sentence.answer.toLowerCase() ? 'correct' : 'incorrect'
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Activity 1.2A – Fill in the Blank
        </h2>
        <p className="text-gray-600">
          Choose the correct word from the word bank for each sentence
        </p>
      </div>

      {/* Word Bank */}
      <div className="bg-forest-50 rounded-xl p-4 mb-6">
        <p className="font-semibold text-forest-800 mb-3">Word Bank:</p>
        <div className="flex flex-wrap gap-2">
          {WORD_BANK.map(word => {
            const isUsed = Object.values(answers).some(a => a?.toLowerCase() === word.toLowerCase())
            return (
              <span 
                key={word}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  isUsed 
                    ? 'bg-gray-200 text-gray-400 line-through' 
                    : 'bg-white text-forest-700 border border-forest-300'
                }`}
              >
                {word}
              </span>
            )
          })}
        </div>
      </div>

      {/* Sentences */}
      <div className="space-y-4 mb-6">
        {SENTENCES.map((sentence) => {
          const result = getResult(sentence)
          const parts = sentence.text.split('___')
          
          return (
            <div 
              key={sentence.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                result === 'correct' 
                  ? 'border-green-300 bg-green-50' 
                  : result === 'incorrect'
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-gray-700">{parts[0]}</span>
                <select
                  value={answers[sentence.id] || ''}
                  onChange={(e) => handleChange(sentence.id, e.target.value)}
                  className={`px-3 py-1 rounded-lg border-2 font-medium focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                    result === 'correct'
                      ? 'border-green-400 bg-green-100 text-green-800'
                      : result === 'incorrect'
                      ? 'border-red-400 bg-red-100 text-red-800'
                      : 'border-forest-300 bg-forest-50 text-forest-800'
                  }`}
                >
                  <option value="">Select...</option>
                  {WORD_BANK.map(word => (
                    <option key={word} value={word}>{word}</option>
                  ))}
                </select>
                <span className="text-gray-700">{parts[1]}</span>
                
                {result === 'correct' && <CheckCircle2 className="w-5 h-5 text-green-500 ml-2" />}
                {result === 'incorrect' && (
                  <button 
                    onClick={() => setShowHint(showHint === sentence.id ? null : sentence.id)}
                    className="ml-2 text-amber-600 hover:text-amber-700"
                  >
                    <Lightbulb className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {/* Hint */}
              {showHint === sentence.id && result === 'incorrect' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <p className="text-amber-800 text-sm">
                    <strong>Hint:</strong> {sentence.hint}
                  </p>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      {/* Results */}
      {checked && !allCorrect && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800">
            <strong>Keep trying!</strong> Click the lightbulb 💡 next to incorrect answers for hints.
          </p>
        </div>
      )}

      {allCorrect && checked && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-800">
            <strong>🎉 Excellent!</strong> You filled in all the blanks correctly!
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        {!(allCorrect && checked) && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheck}
            disabled={Object.keys(answers).length < SENTENCES.length}
            className={`btn-primary px-6 py-3 ${
              Object.keys(answers).length < SENTENCES.length ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Check Answers
          </motion.button>
        )}
        
        {allCorrect && checked && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({
              activity_12a_attempts: attempts,
              missedWords: missedWords
            })}
            className="btn-primary px-8 py-3"
          >
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

