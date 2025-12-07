'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CreditCard, CheckCircle2, Lightbulb } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const SITUATIONS = [
  {
    id: 1,
    title: 'Buying Groceries',
    description: 'You have $100 in your checking account. Groceries cost $45.',
    correct: 'Debit',
    explanation: 'You have enough money in your account. Debit is safer for everyday purchases - it uses your own money and you can\'t overspend.'
  },
  {
    id: 2,
    title: 'Renting a Hotel Room',
    description: 'The hotel requires a credit card for the reservation, even though you\'ll pay with cash.',
    correct: 'Credit',
    explanation: 'Some places require a credit card for reservations or holds, even if you pay with cash. This is a common use case for credit cards.'
  },
  {
    id: 3,
    title: 'Impulse Online Shopping',
    description: 'It\'s 2 a.m. and you see something you want online. You have money in your account.',
    correct: 'Neither / Wait / Save',
    explanation: 'Impulse buying late at night is risky. It\'s better to wait, think about it, and decide if you really need it. This helps avoid unnecessary spending.'
  },
  {
    id: 4,
    title: 'Emergency Expense Before Payday',
    description: 'Your car broke down and you need $300 to fix it. Payday is in 3 days, but you only have $50 right now.',
    correct: 'Credit',
    explanation: 'This is an emergency need. Credit can help in emergencies, but make sure to pay it back as soon as you get paid to avoid high interest.'
  },
]

export default function Activity64B({ onComplete }: Props) {
  const [currentSituation, setCurrentSituation] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const situation = SITUATIONS[currentSituation]
  const userAnswer = answers[situation.id]
  const isCorrect = checked && userAnswer === situation.correct

  const handleCheck = () => {
    setChecked(true)
  }

  const handleContinue = () => {
    if (currentSituation < SITUATIONS.length - 1) {
      setCurrentSituation(prev => prev + 1)
      setChecked(false)
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Great Job! 💳</h2>
          <p className="text-gray-600">You understand when to use debit vs credit!</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
          <p className="text-blue-800 text-sm">
            <strong>💡 Remember:</strong> Debit uses your own money and is safer for everyday purchases. 
            Credit can help build history and is needed for some reservations, but be careful - interest adds up if you don\'t pay it back quickly!
          </p>
        </div>

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ card_choices: answers })} className="btn-primary px-8 py-3">
            Continue to Final Quiz <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CreditCard className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 6.4B – Which Card Should They Use?</h2>
        </div>
        <p className="text-gray-600">Choose the right payment method for each situation</p>
        <div className="mt-2 text-sm text-gray-500">Situation {currentSituation + 1} of {SITUATIONS.length}</div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{situation.title}</h3>
        <p className="text-gray-700 mb-6">{situation.description}</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Debit Card</h4>
            <p className="text-sm text-blue-800">Money comes straight from your bank account</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Credit Card</h4>
            <p className="text-sm text-purple-800">Borrowing with interest if not paid back</p>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-gray-900 mb-3">What should they use?</label>
          <div className="flex flex-wrap gap-3">
            {['Debit', 'Credit', 'Neither / Wait / Save'].map(option => (
              <button key={option} onClick={() => { setAnswers({ ...answers, [situation.id]: option }); setChecked(false) }}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                  userAnswer === option
                    ? isCorrect ? 'border-green-400 bg-green-50 text-green-700' :
                      checked ? 'border-red-400 bg-red-50 text-red-700' :
                      'border-forest-400 bg-forest-50 text-forest-700'
                    : 'border-gray-200 hover:border-forest-300'
                }`}>
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {checked && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-blue-800 font-semibold mb-1">
                {isCorrect ? '✓ Correct!' : 'Not quite'}
              </p>
              <p className="text-blue-800 text-sm">{situation.explanation}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex justify-center gap-4">
        {!checked && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheck}
            disabled={!userAnswer}
            className={`btn-primary px-6 py-3 ${!userAnswer ? 'opacity-50 cursor-not-allowed' : ''}`}>
            Check Answer
          </motion.button>
        )}
        {checked && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleContinue} className="btn-primary px-8 py-3">
            {currentSituation < SITUATIONS.length - 1 ? 'Next Situation' : 'Continue'} <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

