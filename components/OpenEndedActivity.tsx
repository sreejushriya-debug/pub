'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, RefreshCw, Send, Loader2, Sparkles, AlertCircle } from 'lucide-react'

export interface OpenEndedQuestion {
  id: string
  prompt: string
  placeholder?: string
  conceptTags: string[]
  questionType: 'concept_check' | 'reflection'
  rubric?: string // What a good answer should include
  minLength?: number // Minimum character count (default 10)
}

interface QuestionState {
  answer: string
  status: 'pending' | 'evaluating' | 'good_enough' | 'needs_revision'
  feedback: string
  attemptCount: number
}

interface OpenEndedActivityProps {
  title: string
  description?: string
  questions: OpenEndedQuestion[]
  onComplete: (answers: Record<string, string>) => void
}

export default function OpenEndedActivity({
  title,
  description,
  questions,
  onComplete
}: OpenEndedActivityProps) {
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>(() => {
    const initial: Record<string, QuestionState> = {}
    questions.forEach(q => {
      initial[q.id] = {
        answer: '',
        status: 'pending',
        feedback: '',
        attemptCount: 0
      }
    })
    return initial
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allQuestionsAnswered = questions.every(q => {
    const state = questionStates[q.id]
    const minLen = q.minLength || 10
    return state.answer.trim().length >= minLen
  })

  const allAccepted = questions.every(q => questionStates[q.id].status === 'good_enough')
  
  const needsRevision = questions.some(q => questionStates[q.id].status === 'needs_revision')

  const updateAnswer = (questionId: string, answer: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer,
        // Reset status when they start editing after feedback
        status: prev[questionId].status === 'needs_revision' ? 'pending' : prev[questionId].status
      }
    }))
  }

  const submitForFeedback = async () => {
    setIsSubmitting(true)
    setError(null)

    // Only submit questions that haven't been accepted yet
    const questionsToEvaluate = questions.filter(q => 
      questionStates[q.id].status !== 'good_enough'
    )

    // If all questions are already good enough, just complete
    if (questionsToEvaluate.length === 0) {
      handleComplete()
      return
    }

    // Set evaluating status
    const updatedStates = { ...questionStates }
    questionsToEvaluate.forEach(q => {
      updatedStates[q.id] = {
        ...updatedStates[q.id],
        status: 'evaluating'
      }
    })
    setQuestionStates(updatedStates)

    try {
      const maxAttempt = questionsToEvaluate.length > 0
        ? Math.max(...questionsToEvaluate.map(q => questionStates[q.id].attemptCount)) + 1
        : 1

      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: questionsToEvaluate.map(q => ({
            id: q.id,
            prompt: q.prompt,
            studentAnswer: questionStates[q.id].answer,
            conceptTags: q.conceptTags,
            questionType: q.questionType,
            rubric: q.rubric
          })),
          attemptNumber: maxAttempt
        })
      })

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // Response wasn't JSON
        }
        console.error('API error:', errorMessage)
        throw new Error(errorMessage)
      }

      const data = await response.json()

      // Check if evaluations exist and is an array
      if (!data.evaluations || !Array.isArray(data.evaluations)) {
        console.error('Invalid response format:', data)
        throw new Error('Invalid response from server')
      }

      // Update states with evaluations
      const newStates = { ...questionStates }
      data.evaluations.forEach((evaluation: { questionId: string; status: 'good_enough' | 'needs_revision'; feedback: string }) => {
        if (newStates[evaluation.questionId]) {
          newStates[evaluation.questionId] = {
            ...newStates[evaluation.questionId],
            status: evaluation.status,
            feedback: evaluation.feedback,
            attemptCount: newStates[evaluation.questionId].attemptCount + 1
          }
        }
      })
      setQuestionStates(newStates)

    } catch (err) {
      console.error('Evaluation error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(`Something went wrong: ${errorMessage}. Please try again.`)
      
      // Reset to pending status on error
      const resetStates = { ...questionStates }
      questionsToEvaluate.forEach(q => {
        resetStates[q.id] = {
          ...resetStates[q.id],
          status: 'pending'
        }
      })
      setQuestionStates(resetStates)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleComplete = () => {
    const answers: Record<string, string> = {}
    questions.forEach(q => {
      answers[q.id] = questionStates[q.id].answer
    })
    onComplete(answers)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((question, idx) => {
          const state = questionStates[question.id]
          const minLen = question.minLength || 10
          const isLongEnough = state.answer.trim().length >= minLen

          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white rounded-xl border-2 p-5 transition-all ${
                state.status === 'good_enough' 
                  ? 'border-green-300 bg-green-50/50' 
                  : state.status === 'needs_revision'
                    ? 'border-amber-300 bg-amber-50/50'
                    : 'border-gray-200'
              }`}
            >
              {/* Question prompt */}
              <div className="flex items-start gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-forest-100 text-forest-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {idx + 1}
                </span>
                <p className="text-gray-800 font-medium pt-1">{question.prompt}</p>
              </div>

              {/* Answer input */}
              <div className="ml-11">
                <textarea
                  value={state.answer}
                  onChange={(e) => updateAnswer(question.id, e.target.value)}
                  placeholder={question.placeholder || "Type your answer here..."}
                  disabled={state.status === 'good_enough' || state.status === 'evaluating'}
                  className={`w-full px-4 py-3 border rounded-xl resize-none transition-all ${
                    state.status === 'good_enough'
                      ? 'bg-green-50 border-green-200 text-gray-700'
                      : state.status === 'evaluating'
                        ? 'bg-gray-50 border-gray-200'
                        : 'border-gray-300 focus:border-forest-500 focus:ring-2 focus:ring-forest-200'
                  }`}
                  rows={3}
                />

                {/* Character count hint */}
                {state.status !== 'good_enough' && state.answer.length > 0 && state.answer.length < minLen && (
                  <p className="text-xs text-gray-400 mt-1">
                    Write at least {minLen - state.answer.length} more character{minLen - state.answer.length !== 1 ? 's' : ''}
                  </p>
                )}

                {/* Feedback display */}
                <AnimatePresence mode="wait">
                  {state.status === 'evaluating' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 flex items-center gap-2 text-forest-600"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Bright is reading your answer...</span>
                    </motion.div>
                  )}

                  {state.status === 'good_enough' && state.feedback && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-3 bg-green-100 rounded-lg border border-green-200"
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800 text-sm mb-1">
                            ✅ Bright thinks this looks good!
                          </p>
                          <p className="text-green-700 text-sm">{state.feedback}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {state.status === 'needs_revision' && state.feedback && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-3 bg-amber-100 rounded-lg border border-amber-200"
                    >
                      <div className="flex items-start gap-2">
                        <RefreshCw className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-amber-800 text-sm mb-1">
                            🔁 Bright wants you to improve this a little
                          </p>
                          <p className="text-amber-700 text-sm mb-2">{state.feedback}</p>
                          <p className="text-amber-600 text-xs italic">
                            Edit your answer above and submit again!
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
        >
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
        {!allAccepted && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={submitForFeedback}
            disabled={!allQuestionsAnswered || isSubmitting}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-forest-600 text-white rounded-xl font-semibold
                     hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Getting Feedback...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {needsRevision ? 'Resubmit for Feedback' : 'Submit for Feedback'}
              </>
            )}
          </motion.button>
        )}

        {allAccepted && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-accent-500 text-white rounded-xl font-semibold
                     hover:bg-accent-600 transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            Continue
          </motion.button>
        )}
      </div>

      {/* Progress hint */}
      {!allAccepted && !isSubmitting && (
        <p className="text-center text-sm text-gray-500 mt-4">
          {!allQuestionsAnswered 
            ? `Answer all ${questions.length} question${questions.length > 1 ? 's' : ''} to get feedback from Bright`
            : needsRevision
              ? 'Improve the highlighted answers and resubmit'
              : 'Ready! Click "Submit for Feedback" to continue'
          }
        </p>
      )}
    </div>
  )
}

