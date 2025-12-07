'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, Shuffle, CreditCard, Building2, Percent, FileWarning, Banknote, Eye } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const WORDS = [
  { scrambled: 'tderic', answer: 'credit', icon: CreditCard, hint: 'This lets you borrow money to buy things now and pay later.', definition: 'The ability to borrow money with the promise to pay it back later.' },
  { scrambled: 'edpitso', answer: 'deposit', icon: Building2, hint: 'This is when you put money INTO your bank account.', definition: 'Money placed into a bank account for safekeeping.' },
  { scrambled: 'tneriste', answer: 'interest', icon: Percent, hint: 'This is extra money you pay when borrowing, or earn when saving.', definition: 'Money paid for the use of borrowed money, or earned on savings.' },
  { scrambled: 'tebd', answer: 'debt', icon: FileWarning, hint: 'This is money you owe to someone else.', definition: 'Money that is owed and must be paid back.' },
  { scrambled: 'nloa', answer: 'loan', icon: Banknote, hint: 'This is money you borrow that must be repaid over time.', definition: 'Money borrowed that must be paid back, usually with interest.' },
]

export default function Activity31A({ onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const handleCheck = () => { setAttempts(prev => prev + 1); setChecked(true) }
  
  const handleReveal = () => {
    setRevealed(true)
    const correct: Record<string, string> = {}
    WORDS.forEach(w => { correct[w.scrambled] = w.answer })
    setAnswers(correct)
    setChecked(true)
  }

  const allCorrect = WORDS.every(w => answers[w.scrambled]?.toLowerCase().trim() === w.answer)

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shuffle className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 3.1A – Word Scramble</h2>
        </div>
        <p className="text-gray-600">Unscramble each word to reveal important banking terms!</p>
      </div>

      {attempts > 0 && !allCorrect && !revealed && (
        <div className="bg-gray-100 rounded-lg p-3 mb-6 flex items-center justify-between">
          <span className="text-sm text-gray-600">Attempts: {attempts}/3</span>
          {attempts >= 3 && (
            <button onClick={handleReveal} className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-medium">
              <Eye className="w-4 h-4" /> Reveal Answers
            </button>
          )}
        </div>
      )}

      <div className="space-y-4 mb-8">
        {WORDS.map((word) => {
          const Icon = word.icon
          const isCorrect = checked && answers[word.scrambled]?.toLowerCase().trim() === word.answer
          const isWrong = checked && answers[word.scrambled] && answers[word.scrambled]?.toLowerCase().trim() !== word.answer
          
          return (
            <div key={word.scrambled} className={`p-5 rounded-xl border-2 transition-all ${isCorrect ? 'border-green-400 bg-green-50' : isWrong ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCorrect ? 'bg-green-500' : 'bg-forest-500'}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-mono font-bold text-gray-400 tracking-widest mb-2">{word.scrambled.toUpperCase()}</p>
                  <input
                    type="text"
                    value={answers[word.scrambled] || ''}
                    onChange={(e) => { setAnswers({ ...answers, [word.scrambled]: e.target.value }); setChecked(false) }}
                    placeholder="Type the word..."
                    disabled={revealed}
                    className={`w-full px-4 py-2 border-2 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                      isCorrect ? 'border-green-400 bg-green-100 text-green-800' : isWrong ? 'border-red-400 bg-red-100' : 'border-gray-300'
                    }`}
                  />
                </div>
                {isCorrect && <CheckCircle2 className="w-8 h-8 text-green-500" />}
                {isWrong && !revealed && <XCircle className="w-8 h-8 text-red-500" />}
              </div>
              
              {isCorrect && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-green-100 rounded-lg">
                  <p className="text-green-800 text-sm"><strong>✓ {word.answer.charAt(0).toUpperCase() + word.answer.slice(1)}:</strong> {word.definition}</p>
                </motion.div>
              )}
              {isWrong && !revealed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-amber-50 rounded-lg">
                  <p className="text-amber-800 text-sm"><strong>Hint:</strong> {word.hint}</p>
                </motion.div>
              )}
              {revealed && !isCorrect && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm"><strong>{word.answer.charAt(0).toUpperCase() + word.answer.slice(1)}:</strong> {word.definition}</p>
                </motion.div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex justify-center gap-4">
        {!((allCorrect && checked) || revealed) && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheck}
            disabled={Object.keys(answers).length < WORDS.length}
            className={`btn-primary px-6 py-3 ${Object.keys(answers).length < WORDS.length ? 'opacity-50 cursor-not-allowed' : ''}`}>
            Check Answers
          </motion.button>
        )}
        {((allCorrect && checked) || revealed) && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ activity_31a_attempts: attempts, activity_31a_revealed: revealed })}
            className="btn-primary px-8 py-3">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

