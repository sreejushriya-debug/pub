import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

export interface QuestionAttempt {
  questionKey: string
  attempts: number
  submittedAnswer: string
  isCorrect: boolean
}

export function useQuizTracking(activityKey: string) {
  const { user } = useUser()
  const [questionAttempts, setQuestionAttempts] = useState<Record<string, number>>({})
  const [questionResults, setQuestionResults] = useState<QuestionAttempt[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const recordAnswer = (questionKey: string, submittedAnswer: string, isCorrect: boolean) => {
    // Increment attempts for this question
    const newAttempts = (questionAttempts[questionKey] || 0) + 1
    setQuestionAttempts(prev => ({
      ...prev,
      [questionKey]: newAttempts
    }))

    // Store result for this question
    setQuestionResults(prev => {
      // Remove any existing result for this question (in case they retry)
      const filtered = prev.filter(r => r.questionKey !== questionKey)
      return [...filtered, {
        questionKey,
        attempts: newAttempts,
        submittedAnswer,
        isCorrect,
      }]
    })
  }

  const submitResults = async () => {
    if (!user?.id) {
      console.warn('User not authenticated, skipping API submission')
      return { success: false, error: 'Not authenticated' }
    }

    if (questionResults.length === 0) {
      console.warn('No results to submit')
      return { success: false, error: 'No results' }
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityKey,
          answers: questionResults,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit quiz results')
      }

      const data = await response.json()
      console.log('Quiz results submitted:', data)
      return { success: true, data }
    } catch (error) {
      console.error('Error submitting quiz results:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAttempts = (questionKey: string) => questionAttempts[questionKey] || 0

  return {
    recordAnswer,
    submitResults,
    getAttempts,
    isSubmitting,
    questionResults,
  }
}

