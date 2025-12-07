'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ClipboardCheck, CheckCircle2, XCircle } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const QUESTIONS = [
  { id: 1, type: 'vocab', question: 'What is the extra money you pay when borrowing?', correct: 'interest', options: ['interest', 'principal', 'debt', 'loan'] },
  { id: 2, type: 'vocab', question: 'Money you make after subtracting expenses from revenue is called?', correct: 'profit', options: ['profit', 'revenue', 'expenses', 'income'] },
  { id: 3, type: 'vocab', question: 'Things a business owns that have value are called?', correct: 'assets', options: ['assets', 'liability', 'equity', 'debt'] },
  { id: 4, type: 'coin', question: 'If you have 3 quarters, 2 dimes, and 1 nickel, how much money do you have?', correct: '1.00', options: ['0.90', '0.95', '1.00', '1.05'] },
  { id: 5, type: 'coin', question: 'How many pennies equal one dollar?', correct: '100', options: ['10', '50', '100', '200'] },
  { id: 6, type: 'budget', question: 'You have $100. You spend $35 on needs and $20 on wants. How much is left?', correct: '45', options: ['35', '40', '45', '55'] },
  { id: 7, type: 'budget', question: 'A budget is a plan for how you\'ll:', correct: 'spend and save your money', options: ['spend all your money', 'spend and save your money', 'only save money', 'ignore money'] },
  { id: 8, type: 'business', question: 'If revenue is $500 and expenses are $300, what is the profit?', correct: '200', options: ['100', '200', '300', '800'] },
  { id: 9, type: 'business', question: 'If you spent $50 and earned $80, did you make a profit or loss?', correct: 'profit', options: ['profit', 'loss', 'neither', 'both'] },
  { id: 10, type: 'credit', question: 'Which uses your own money from your bank account?', correct: 'debit', options: ['debit', 'credit', 'both', 'neither'] },
  { id: 11, type: 'credit', question: 'Credit cards charge interest if you:', correct: 'don\'t pay back the full amount', options: ['pay on time', 'don\'t pay back the full amount', 'use them once', 'never use them'] },
  { id: 12, type: 'tax', question: 'An item costs $20. Tax is 6.25%. What is the tax amount?', correct: '1.25', options: ['1.00', '1.25', '1.50', '2.00'] },
  { id: 13, type: 'tax', question: 'An item is $40 with 20% off. What is the sale price?', correct: '32', options: ['30', '32', '35', '38'] },
  { id: 14, type: 'expense', question: 'Which expense type stays the same each month?', correct: 'Fixed', options: ['Fixed', 'Variable', 'Periodic', 'Discretionary'] },
  { id: 15, type: 'expense', question: 'Groceries are an example of which expense type?', correct: 'Variable', options: ['Fixed', 'Variable', 'Periodic', 'Discretionary'] },
]

const PASS_THRESHOLD = 0.70 // 70%

export default function Activity65A({ onComplete }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState(false)
  const [finished, setFinished] = useState(false)

  const question = QUESTIONS[currentQuestion]
  const userAnswer = answers[question.id]
  const isCorrect = checked && userAnswer === question.correct

  const handleAnswer = (answer: string) => {
    if (checked) return
    setAnswers({ ...answers, [question.id]: answer })
  }

  const handleCheck = () => {
    setChecked(true)
  }

  const handleContinue = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setChecked(false)
    } else {
      setFinished(true)
    }
  }

  if (finished) {
    const correct = QUESTIONS.filter(q => answers[q.id] === q.correct).length
    const total = QUESTIONS.length
    const score = correct / total
    const passed = score >= PASS_THRESHOLD

    const missedTopics = QUESTIONS.filter(q => answers[q.id] !== q.correct).map(q => q.type)
    const topicCounts: Record<string, number> = {}
    missedTopics.forEach(topic => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1
    })
    const topMissedTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([topic]) => topic)

    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 bg-gradient-to-br ${passed ? 'from-green-400 to-green-600' : 'from-amber-400 to-amber-600'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
            <ClipboardCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {passed ? '🎉 Congratulations!' : 'Great Effort!'}
          </h2>
          <p className="text-lg text-forest-600 font-semibold mb-2">You scored {correct}/{total} ({Math.round(score * 100)}%)</p>
          {passed ? (
            <p className="text-gray-600">You passed! You&apos;re ready for your certificate!</p>
          ) : (
            <p className="text-gray-600">You scored {Math.round(score * 100)}%. Review these topics and try again!</p>
          )}
        </div>

        {!passed && topMissedTopics.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-amber-900 mb-3">Topics to Review:</h3>
            <ul className="space-y-2">
              {topMissedTopics.map(topic => (
                <li key={topic} className="text-amber-800 capitalize">• {topic.replace('_', ' ')}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ quizScore: { correct, total }, passed })}
            className="btn-primary px-8 py-3">
            {passed ? 'View Certificate' : 'Continue Anyway'} <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ClipboardCheck className="w-6 h-6 text-forest-600" />
          <h2 className="text-xl font-bold text-gray-900">Activity 6.5A – Final Challenge Quiz</h2>
        </div>
        <p className="text-gray-600">Test your knowledge across all modules!</p>
        <div className="mt-2 text-sm text-gray-500">Question {currentQuestion + 1} of {QUESTIONS.length}</div>
        <div className="mt-2">
          <div className="h-2 bg-gray-200 rounded-full max-w-md mx-auto">
            <div className="h-full bg-forest-500 rounded-full" style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-6 max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = userAnswer === option
            return (
              <motion.button key={option} whileHover={!checked ? { scale: 1.02 } : {}} whileTap={!checked ? { scale: 0.98 } : {}}
                onClick={() => handleAnswer(option)}
                disabled={checked}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? isCorrect ? 'border-green-400 bg-green-50 text-green-700' :
                      checked ? 'border-red-400 bg-red-50 text-red-700' :
                      'border-forest-400 bg-forest-50 text-forest-700'
                    : checked && option === question.correct ? 'border-green-400 bg-green-50 text-green-700' :
                      'border-gray-200 hover:border-forest-300'
                } ${checked ? 'cursor-default' : 'cursor-pointer'}`}>
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isSelected && isCorrect && <CheckCircle2 className="w-5 h-5" />}
                  {isSelected && !isCorrect && checked && <XCircle className="w-5 h-5" />}
                  {checked && option === question.correct && !isSelected && <span className="text-xs text-green-600">✓ Correct</span>}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

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
            {currentQuestion < QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

