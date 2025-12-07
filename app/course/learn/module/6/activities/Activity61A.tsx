'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, CheckCircle2, XCircle, Play, Trophy } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const QUESTIONS = [
  { id: 1, definition: 'Money you owe that you haven\'t paid back yet', correct: 'debt', options: ['revenue', 'debt', 'budget', 'equity'] },
  { id: 2, definition: 'Money you earn from selling products or services', correct: 'revenue', options: ['revenue', 'profit', 'expenses', 'income'] },
  { id: 3, definition: 'A plan for how you\'ll spend and save your money', correct: 'budget', options: ['budget', 'savings', 'expenses', 'income'] },
  { id: 4, definition: 'Money you make after subtracting expenses from revenue', correct: 'profit', options: ['profit', 'revenue', 'expenses', 'income'] },
  { id: 5, definition: 'Money you set aside for future use', correct: 'savings', options: ['savings', 'expenses', 'debt', 'revenue'] },
  { id: 6, definition: 'Things a business owns that have value', correct: 'assets', options: ['assets', 'liability', 'equity', 'debt'] },
  { id: 7, definition: 'Things a business owes to others', correct: 'liability', options: ['liability', 'assets', 'equity', 'revenue'] },
  { id: 8, definition: 'The extra money you pay when borrowing', correct: 'interest', options: ['interest', 'principal', 'debt', 'loan'] },
  { id: 9, definition: 'The original amount of money borrowed', correct: 'principal', options: ['principal', 'interest', 'debt', 'loan'] },
  { id: 10, definition: 'A tax added to the price of goods you buy', correct: 'sales tax', options: ['sales tax', 'income tax', 'discount', 'profit'] },
  { id: 11, definition: 'A reduction in the original price', correct: 'discount', options: ['discount', 'tax', 'profit', 'revenue'] },
  { id: 12, definition: 'Money you receive regularly, like from a job', correct: 'income', options: ['income', 'expenses', 'savings', 'debt'] },
]

export default function Activity61A({ onComplete }: Props) {
  const [started, setStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<Set<number>>(new Set())
  const [missedWords, setMissedWords] = useState<string[]>([])
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (started && timeLeft > 0 && !finished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !finished) {
      setFinished(true)
    }
  }, [started, timeLeft, finished])

  const handleAnswer = (answer: string) => {
    if (finished || answered.has(QUESTIONS[currentQuestion].id)) return
    
    const question = QUESTIONS[currentQuestion]
    const isCorrect = answer === question.correct
    setAnswered(new Set([...Array.from(answered), question.id]))
    
    if (isCorrect) {
      setScore(score + 1)
    } else {
      setMissedWords([...missedWords, question.correct])
    }
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // Loop back to start if time remains
        setCurrentQuestion(0)
      }
    }, 1000)
  }

  const handleFinishEarly = () => {
    setFinished(true)
  }

  const handleStart = () => {
    setStarted(true)
    setTimeLeft(60)
    setCurrentQuestion(0)
    setScore(0)
    setAnswered(new Set())
    setMissedWords([])
    setFinished(false)
  }

  if (!started) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-forest-400 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Activity 6.1A – Timed Matching Rounds</h2>
          <p className="text-gray-600">Match definitions to terms in 60 seconds!</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
          <h3 className="font-semibold text-blue-900 mb-3">How to Play:</h3>
          <ul className="text-blue-800 text-sm space-y-2 list-disc list-inside">
            <li>You have 60 seconds to answer as many questions as possible</li>
            <li>Read the definition and click the correct term</li>
            <li>Score +1 for each correct answer</li>
            <li>Try to get as many correct as you can!</li>
          </ul>
        </div>

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleStart} className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
            <Play className="w-5 h-5" /> Start Round
          </motion.button>
        </div>
      </div>
    )
  }

  if (finished) {
    const totalAnswered = answered.size
    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Round Complete! 🎉</h2>
          <p className="text-lg text-forest-600 font-semibold mb-2">You got {score}/{totalAnswered} correct!</p>
          <p className="text-gray-600">Great job practicing your financial vocabulary!</p>
        </div>

        {missedWords.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-amber-900 mb-3">Words to Review:</h3>
            <div className="flex flex-wrap gap-2">
              {missedWords.map((word, idx) => (
                <span key={idx} className="px-3 py-1 bg-white border border-amber-300 rounded-lg text-amber-800 text-sm">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ score, total: totalAnswered, missedWords })}
            className="btn-primary px-8 py-4">
            Continue <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  const question = QUESTIONS[currentQuestion]
  const isAnswered = answered.has(question.id)

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Timed Matching Round</h2>
        </div>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold text-lg">
            {timeLeft}s
          </div>
          <div className="bg-forest-100 text-forest-700 px-4 py-2 rounded-lg font-bold">
            Score: {score}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xl font-semibold text-gray-900 mb-4">{question.definition}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {question.options.map((option) => {
            const wasSelected = isAnswered && option === question.correct
            const wasWrong = isAnswered && option !== question.correct
            return (
              <motion.button key={option} whileHover={!isAnswered ? { scale: 1.02 } : {}} whileTap={!isAnswered ? { scale: 0.98 } : {}}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={`p-4 rounded-xl border-2 font-medium transition-all ${
                  wasSelected ? 'border-green-400 bg-green-50 text-green-700' :
                  wasWrong ? 'border-red-400 bg-red-50 text-red-700' :
                  'border-gray-200 hover:border-forest-300'
                } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}>
                {option}
                {wasSelected && <CheckCircle2 className="w-5 h-5 inline ml-2" />}
                {wasWrong && <XCircle className="w-5 h-5 inline ml-2" />}
              </motion.button>
            )
          })}
        </div>

        {isAnswered && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">Moving to next question...</p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleFinishEarly}
          className="btn-outline px-6 py-3">
          Finish Round Early
        </motion.button>
      </div>
    </div>
  )
}

