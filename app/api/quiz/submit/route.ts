import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

interface QuestionAnswer {
  questionKey: string // e.g., "q1", "q2"
  submittedAnswer: string
  attempts: number
  isCorrect: boolean
}

interface SubmitRequest {
  activityKey: string // e.g., "activity-1.1b"
  answers: QuestionAnswer[]
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: SubmitRequest = await request.json()
    const { activityKey, answers } = body

    if (!activityKey || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Invalid request: activityKey and answers array required' },
        { status: 400 }
      )
    }

    // Fetch all questions for this activity to get their IDs
    const questions = await prisma.quizQuestion.findMany({
      where: {
        activityKey,
      },
    })

    // Create a map of questionKey -> questionId
    const questionMap = new Map(
      questions.map(q => [q.questionKey, q.id])
    )

    // Ensure user exists (create if doesn't exist)
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
      },
    })

    // Process each answer and create/update UserQuestionResult
    const results = []
    for (const answer of answers) {
      const questionId = questionMap.get(answer.questionKey)
      
      if (!questionId) {
        console.warn(`Question not found for key: ${answer.questionKey} in activity: ${activityKey}`)
        continue
      }

      // Create a new result record for this attempt
      const result = await prisma.userQuestionResult.create({
        data: {
          userId,
          questionId,
          isCorrect: answer.isCorrect,
          attempts: answer.attempts,
          submittedAnswer: answer.submittedAnswer,
        },
      })

      results.push({
        questionKey: answer.questionKey,
        questionId: result.questionId,
        isCorrect: result.isCorrect,
        attempts: result.attempts,
      })
    }

    // Return grading results to frontend
    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: answers.length,
        correct: answers.filter(a => a.isCorrect).length,
        incorrect: answers.filter(a => !a.isCorrect).length,
      },
    })
  } catch (error) {
    console.error('Error submitting quiz results:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

