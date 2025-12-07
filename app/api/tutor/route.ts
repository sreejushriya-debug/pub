import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

interface MissedQuestion {
  questionId: string
  userAnswer: string
}

interface TutorRequest {
  activityKey: string
  missedQuestions: MissedQuestion[]
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

    const body: TutorRequest = await request.json()
    const { activityKey, missedQuestions } = body

    if (!activityKey || !missedQuestions || !Array.isArray(missedQuestions) || missedQuestions.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: activityKey and non-empty missedQuestions array required' },
        { status: 400 }
      )
    }

    // Look up QuizQuestion records from database
    const questionKeys = missedQuestions.map(q => q.questionId)
    const questions = await prisma.quizQuestion.findMany({
      where: {
        activityKey,
        questionKey: {
          in: questionKeys,
        },
      },
    })

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'Questions not found in database' },
        { status: 404 }
      )
    }

    // Create a map for quick lookup
    const questionMap = new Map(questions.map(q => [q.questionKey, q]))
    const userAnswerMap = new Map(missedQuestions.map(q => [q.questionId, q.userAnswer]))

    // Construct the prompt
    const missedQuestionsSummary = questions.map((q, idx) => {
      const userAnswer = userAnswerMap.get(q.questionKey) || 'No answer provided'
      return `${idx + 1}) Concept tags: [${q.conceptTags.join(', ')}]
   Question: "${q.questionText}"
   Student answer: "${userAnswer}"
   Correct answer: "${q.correctAnswer}"`
    }).join('\n\n')

    const systemPrompt = `You are Bright, a friendly kid-focused money tutor. The student is in approximately grades 3–5.`

    const userPrompt = `The student just took the quiz ${activityKey} and missed the following questions:

${missedQuestionsSummary}

Your job:
1. Explain the main ideas they're struggling with in simple language.
2. Give ONE worked example that uses money/allowance/shopping-type scenarios.
3. Then give TWO new practice problems at a similar difficulty, with the correct answers at the end.

Speak directly to the student. Keep it encouraging and friendly.`

    // Call OpenAI API
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text()
      console.error('OpenAI API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to get tutor response from AI' },
        { status: 500 }
      )
    }

    const openaiData = await openaiResponse.json()
    const explanation = openaiData.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response right now.'

    return NextResponse.json({
      explanation,
    })
  } catch (error) {
    console.error('Error in tutor route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

