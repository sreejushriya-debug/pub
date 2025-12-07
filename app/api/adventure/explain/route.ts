import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

interface ExplainRequest {
  questionText: string
  userAnswer: string
  correctAnswer: string
  conceptTags: string[]
  storyContext: string
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: ExplainRequest = await request.json()
    const { questionText, userAnswer, correctAnswer, conceptTags, storyContext } = body

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    const systemPrompt = `You are Bright, a friendly AI money tutor for kids in grades 3-5. A student just got a question wrong in the Money Adventure game.

YOUR JOB:
1. Explain WHY their answer was wrong in 1-2 simple sentences
2. Explain the correct concept clearly with a real-life example
3. Create ONE follow-up practice question to help them learn

RULES:
- Write at 3rd-5th grade reading level
- Use everyday money examples (allowance, snacks, toys, school supplies)
- Be encouraging, never scold
- Keep explanations SHORT (2-3 sentences max)
- Follow-up question should be simpler than the original

Respond with JSON:
{
  "explanation": "Your explanation here...",
  "followUpQuestion": "A simpler practice question?",
  "followUpAnswer": "the correct answer"
}`

    const userPrompt = `Story context: "${storyContext}"

Question: ${questionText}
Student answered: "${userAnswer}"
Correct answer: "${correctAnswer}"
Concepts: ${conceptTags.join(', ')}

Help this student understand!`

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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })

    if (!openaiResponse.ok) {
      return NextResponse.json({ error: 'Failed to get explanation' }, { status: 500 })
    }

    const openaiData = await openaiResponse.json()
    const responseText = openaiData.choices[0]?.message?.content || '{}'
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return NextResponse.json(parsed)
      }
    } catch {
      // Fallback
    }

    return NextResponse.json({
      explanation: `The correct answer was "${correctAnswer}". Keep practicing!`,
      followUpQuestion: null,
      followUpAnswer: null
    })
  } catch (error) {
    console.error('Error in adventure explain:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

