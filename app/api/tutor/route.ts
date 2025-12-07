import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

interface MissedQuestion {
  questionId: string
  userAnswer: string
  questionText: string
  correctAnswer: string
  term?: string
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

    // Construct the prompt from the data sent by the frontend
    // No database lookup needed!
    const missedQuestionsSummary = missedQuestions.map((q, idx) => {
      return `${idx + 1}) Term: "${q.term || 'Unknown'}"
   Question: "${q.questionText}"
   Student answer: "${q.userAnswer}"
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
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.' },
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
      let errorMessage = 'Failed to get tutor response from AI'
      try {
        const errorJson = JSON.parse(errorData)
        errorMessage = errorJson.error?.message || errorMessage
      } catch {
        // If parsing fails, use the raw error data
        errorMessage = errorData || errorMessage
      }
      return NextResponse.json(
        { error: errorMessage },
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
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
