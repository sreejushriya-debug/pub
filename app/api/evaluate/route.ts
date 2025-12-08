import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import OpenAI from 'openai'

interface EvaluateRequest {
  questions: {
    id: string
    prompt: string
    studentAnswer: string
    conceptTags: string[]
    questionType: 'concept_check' | 'reflection'
    rubric?: string
  }[]
  attemptNumber: number
}

interface EvaluationResult {
  questionId: string
  status: 'good_enough' | 'needs_revision'
  feedback: string
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Please sign in to continue' },
        { status: 401 }
      )
    }

    const body: EvaluateRequest = await request.json()
    const { questions, attemptNumber } = body

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions to evaluate' },
        { status: 400 }
      )
    }

    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY environment variable is not set')
      // Return success anyway so students aren't blocked
      return NextResponse.json({
        evaluations: questions.map(q => ({
          questionId: q.id,
          status: 'good_enough' as const,
          feedback: 'Great job! Your answer has been accepted.'
        })),
        allAccepted: true
      })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const systemPrompt = `You are Bright, a friendly AI tutor for kids in grades 3-5. Evaluate open-ended answers about financial literacy.

Decide for each answer:
- "good_enough" → Accept it, give brief praise
- "needs_revision" → Ask them to try again with a gentle suggestion

For CONCEPT-CHECK questions: Accept if they show basic understanding of the concept.
For REFLECTION questions: Accept if they wrote at least 1-2 thoughtful sentences.

${attemptNumber >= 2 ? 'IMPORTANT: This is attempt #' + attemptNumber + '. Be lenient - accept answers that show effort.' : ''}

Respond with ONLY a JSON array:
[{"questionId": "id", "status": "good_enough", "feedback": "Nice work!"}]`

    const userPrompt = questions.map((q, i) => 
      `Question ${i + 1} (ID: ${q.id}, Type: ${q.questionType}):
Prompt: "${q.prompt}"
${q.rubric ? `Expected: ${q.rubric}` : ''}
Student Answer: "${q.studentAnswer}"`
    ).join('\n\n')

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 800,
      })

      const responseText = completion.choices[0]?.message?.content || '[]'
      
      let evaluations: EvaluationResult[] = []
      try {
        const jsonMatch = responseText.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          evaluations = JSON.parse(jsonMatch[0])
        }
      } catch {
        console.error('Failed to parse AI response:', responseText)
      }

      // If parsing failed or no evaluations, accept all
      if (evaluations.length === 0) {
        evaluations = questions.map(q => ({
          questionId: q.id,
          status: 'good_enough' as const,
          feedback: 'Good effort! Your answer has been accepted.'
        }))
      }

      return NextResponse.json({
        evaluations,
        allAccepted: evaluations.every(e => e.status === 'good_enough')
      })

    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError)
      // Don't block students - accept answers if AI fails
      return NextResponse.json({
        evaluations: questions.map(q => ({
          questionId: q.id,
          status: 'good_enough' as const,
          feedback: 'Your answer has been accepted!'
        })),
        allAccepted: true
      })
    }

  } catch (error) {
    console.error('Error in evaluate route:', error)
    // Fallback - accept all answers so students aren't stuck
    return NextResponse.json({
      evaluations: [],
      allAccepted: true,
      error: 'Evaluation temporarily unavailable'
    })
  }
}
