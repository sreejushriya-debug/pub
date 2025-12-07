'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, XCircle, Award, MessageCircle } from 'lucide-react'
import TutorChat from './TutorChat'
import { updateConceptScores } from '@/lib/conceptProgress'

// Question types
interface BaseQuestion {
  id: string
  questionText: string
  conceptTags: string[]
  explanation: string
}

interface MCQQuestion extends BaseQuestion {
  type: 'mcq'
  options: string[]
  correctAnswer: string
}

interface NumericQuestion extends BaseQuestion {
  type: 'numeric'
  correctAnswer: number
  unit?: string
  tolerance?: number // For approximate answers
}

interface SelectAllQuestion extends BaseQuestion {
  type: 'select_all'
  options: string[]
  correctAnswers: string[]
}

interface ImageQuestion extends BaseQuestion {
  type: 'image_mcq'
  imageUrl?: string
  imageDescription?: string // For accessibility / coin descriptions
  options: string[]
  correctAnswer: string
}

export type QuizQuestion = MCQQuestion | NumericQuestion | SelectAllQuestion | ImageQuestion

interface ModuleQuizProps {
  moduleNumber: number
  quizTitle: string
  quizDescription: string
  questions: QuizQuestion[]
  onComplete: (data: {
    score: number
    total: number
    missedQuestions: string[]
  }) => void
}

interface QuestionResult {
  questionId: string
  userAnswer: string | number | string[]
  isCorrect: boolean
}

export default function ModuleQuiz({
  moduleNumber,
  quizTitle,
  quizDescription,
  questions,
  onComplete,
}: ModuleQuizProps) {
  const { user } = useUser()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number | string[]>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [results, setResults] = useState<QuestionResult[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const question = questions[currentQuestion]

  const checkAnswer = (userAnswer: string | number | string[]): boolean => {
    switch (question.type) {
      case 'mcq':
      case 'image_mcq':
        return userAnswer === question.correctAnswer
      case 'numeric':
        const numAnswer = typeof userAnswer === 'number' ? userAnswer : parseFloat(String(userAnswer))
        const tolerance = question.tolerance || 0.01
        return Math.abs(numAnswer - question.correctAnswer) <= tolerance
      case 'select_all':
        const selected = userAnswer as string[]
        const correct = question.correctAnswers
        return selected.length === correct.length && 
               selected.every(a => correct.includes(a)) &&
               correct.every(a => selected.includes(a))
      default:
        return false
    }
  }

  const handleAnswer = (answer: string | number | string[]) => {
    setAnswers(prev => ({ ...prev, [question.id]: answer }))
  }

  const handleSubmitAnswer = () => {
    const userAnswer = answers[question.id]
    if (userAnswer === undefined) return

    const isCorrect = checkAnswer(userAnswer)
    
    setResults(prev => [
      ...prev.filter(r => r.questionId !== question.id),
      { questionId: question.id, userAnswer, isCorrect }
    ])
    
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setShowFeedback(false)
    } else {
      // Quiz complete - save concept-level results
      if (user?.id) {
        const conceptResults = results.flatMap(r => {
          const q = questions.find(q => q.id === r.questionId)
          if (!q) return []
          return q.conceptTags.map(concept => ({
            concept,
            correct: r.isCorrect
          }))
        })
        updateConceptScores(user.id, conceptResults)
      }
      setIsComplete(true)
    }
  }

  const getScore = () => results.filter(r => r.isCorrect).length
  
  const getMissedQuestions = () => {
    return results
      .filter(r => !r.isCorrect)
      .map(r => {
        const q = questions.find(q => q.id === r.questionId)!
        let correctAnswerText = ''
        
        if (q.type === 'mcq' || q.type === 'image_mcq') {
          correctAnswerText = q.correctAnswer
        } else if (q.type === 'numeric') {
          correctAnswerText = `${q.correctAnswer}${q.unit ? ' ' + q.unit : ''}`
        } else if (q.type === 'select_all') {
          correctAnswerText = q.correctAnswers.join(', ')
        }
        
        return {
          questionId: q.id,
          questionText: q.questionText,
          userAnswer: String(r.userAnswer),
          correctAnswer: correctAnswerText,
          term: q.conceptTags[0] || '',
          conceptTags: q.conceptTags,
        }
      })
  }

  // Render question based on type
  const renderQuestion = () => {
    const currentAnswer = answers[question.id]

    switch (question.type) {
      case 'mcq':
      case 'image_mcq':
        return (
          <div className="space-y-3">
            {question.type === 'image_mcq' && question.imageDescription && (
              <div className="bg-forest-50 rounded-xl p-4 mb-4 text-center">
                <p className="text-forest-700 font-medium">{question.imageDescription}</p>
              </div>
            )}
            {question.options.map((option, idx) => {
              const isSelected = currentAnswer === option
              const isCorrectOption = option === question.correctAnswer
              
              let bgColor = 'bg-white hover:bg-gray-50 border-gray-200'
              if (showFeedback) {
                if (isCorrectOption) {
                  bgColor = 'bg-green-50 border-green-400'
                } else if (isSelected && !isCorrectOption) {
                  bgColor = 'bg-red-50 border-red-400'
                }
              } else if (isSelected) {
                bgColor = 'bg-forest-50 border-forest-400'
              }

              return (
                <motion.button
                  key={idx}
                  whileHover={!showFeedback ? { scale: 1.01 } : {}}
                  whileTap={!showFeedback ? { scale: 0.99 } : {}}
                  onClick={() => !showFeedback && handleAnswer(option)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${bgColor}`}
                >
                  <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-600">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showFeedback && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  {showFeedback && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </motion.button>
              )
            })}
          </div>
        )

      case 'numeric':
        const numericResult = results.find(r => r.questionId === question.id)
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.01"
                value={currentAnswer !== undefined ? String(currentAnswer) : ''}
                onChange={(e) => !showFeedback && handleAnswer(parseFloat(e.target.value) || 0)}
                disabled={showFeedback}
                placeholder="Type your answer..."
                className={`flex-1 px-4 py-3 border-2 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-forest-500 ${
                  showFeedback
                    ? numericResult?.isCorrect
                      ? 'border-green-400 bg-green-50'
                      : 'border-red-400 bg-red-50'
                    : 'border-gray-300'
                }`}
              />
              {question.unit && (
                <span className="text-gray-600 font-medium">{question.unit}</span>
              )}
            </div>
            {showFeedback && !numericResult?.isCorrect && (
              <p className="text-red-600">
                Correct answer: <span className="font-bold">{question.correctAnswer}{question.unit ? ' ' + question.unit : ''}</span>
              </p>
            )}
          </div>
        )

      case 'select_all':
        const selectedOptions = (currentAnswer as string[]) || []
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-2">Select all that apply:</p>
            {question.options.map((option, idx) => {
              const isSelected = selectedOptions.includes(option)
              const isCorrectOption = question.correctAnswers.includes(option)
              
              let bgColor = 'bg-white hover:bg-gray-50 border-gray-200'
              if (showFeedback) {
                if (isCorrectOption && isSelected) {
                  bgColor = 'bg-green-50 border-green-400'
                } else if (isCorrectOption && !isSelected) {
                  bgColor = 'bg-amber-50 border-amber-400' // Should have selected
                } else if (!isCorrectOption && isSelected) {
                  bgColor = 'bg-red-50 border-red-400' // Shouldn't have selected
                }
              } else if (isSelected) {
                bgColor = 'bg-forest-50 border-forest-400'
              }

              return (
                <motion.button
                  key={idx}
                  whileHover={!showFeedback ? { scale: 1.01 } : {}}
                  whileTap={!showFeedback ? { scale: 0.99 } : {}}
                  onClick={() => {
                    if (showFeedback) return
                    const newSelected = isSelected
                      ? selectedOptions.filter(o => o !== option)
                      : [...selectedOptions, option]
                    handleAnswer(newSelected)
                  }}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${bgColor}`}
                >
                  <span className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    isSelected ? 'bg-forest-500 border-forest-500 text-white' : 'border-gray-300'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-4 h-4" />}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showFeedback && isCorrectOption && (
                    <span className="text-xs text-green-600 font-medium">✓ Correct choice</span>
                  )}
                </motion.button>
              )
            })}
          </div>
        )
    }
  }

  // Results screen
  if (isComplete) {
    const score = getScore()
    const total = questions.length
    const percentage = Math.round((score / total) * 100)
    const missedQuestions = getMissedQuestions()
    const passed = percentage >= 70

    return (
      <div className="p-8">
        <div className="text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            passed ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-amber-400 to-amber-600'
          }`}>
            <Award className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {quizTitle} Complete!
          </h2>
          
          <p className="text-5xl font-bold text-forest-600 mb-2">
            {score}/{total}
          </p>
          
          <p className="text-gray-600 mb-4">
            You got {percentage}% correct!
          </p>
          
          {passed ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 max-w-md mx-auto">
              <p className="text-green-700 font-medium">
                🎉 Great job! You passed the Module {moduleNumber} quiz!
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 max-w-md mx-auto">
              <p className="text-amber-700 font-medium">
                Keep practicing! You need 70% to pass. Use the tutor to review what you missed.
              </p>
            </div>
          )}

          {/* Tutor Chat Button */}
          {missedQuestions.length > 0 && (
            <div className="mb-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsChatOpen(true)}
                className="bg-gradient-to-r from-forest-600 to-forest-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-3 mx-auto"
              >
                <MessageCircle className="w-6 h-6" />
                <div className="text-left">
                  <div>Chat with Bright Tutor</div>
                  <div className="text-sm font-normal text-white/80">
                    Get help with {missedQuestions.length} question{missedQuestions.length > 1 ? 's' : ''} you missed
                  </div>
                </div>
              </motion.button>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({
              score,
              total,
              missedQuestions: missedQuestions.map(q => q.questionId)
            })}
            className="btn-primary px-8 py-3"
          >
            {passed ? 'Complete Module' : 'Continue Anyway'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>

        {/* Tutor Chat */}
        <TutorChat
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          moduleNumber={moduleNumber}
          activityKey={`module-${moduleNumber}-quiz`}
          activityName={quizTitle}
          missedQuestions={missedQuestions}
          correctCount={score}
          totalCount={total}
        />
      </div>
    )
  }

  // Quiz in progress
  const currentResult = results.find(r => r.questionId === question.id)
  const hasAnswered = answers[question.id] !== undefined
  const canSubmit = hasAnswered && !showFeedback

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{quizTitle}</h2>
        <p className="text-gray-600 text-sm">{quizDescription}</p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>Score: {getScore()}/{results.length}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-forest-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + (showFeedback ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-2 mb-4">
          <span className="bg-forest-100 text-forest-700 px-2 py-1 rounded-lg text-sm font-medium">
            Q{currentQuestion + 1}
          </span>
          <span className="text-xs text-gray-400 mt-1">
            {question.conceptTags.join(' • ')}
          </span>
        </div>
        
        <p className="text-lg text-gray-800 mb-6">{question.questionText}</p>
        
        {renderQuestion()}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 mb-6 ${
            currentResult?.isCorrect
              ? 'bg-green-50 border border-green-200'
              : 'bg-amber-50 border border-amber-200'
          }`}
        >
          <p className={`font-semibold mb-1 ${
            currentResult?.isCorrect ? 'text-green-800' : 'text-amber-800'
          }`}>
            {currentResult?.isCorrect ? '✓ Correct!' : '✗ Not quite!'}
          </p>
          <p className={currentResult?.isCorrect ? 'text-green-700' : 'text-amber-700'}>
            {question.explanation}
          </p>
        </motion.div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        {!showFeedback ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmitAnswer}
            disabled={!canSubmit}
            className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Check Answer
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="btn-primary px-8 py-3"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

