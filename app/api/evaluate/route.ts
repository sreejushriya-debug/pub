import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

interface EvaluateRequest {
  questions: {
    id: string
    prompt: string
    studentAnswer: string
    conceptTags: string[]
    questionType: 'concept_check' | 'reflection'
    rubric?: string // What a good answer should include
  }[]
  attemptNumber: number // How many times they've tried
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
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: EvaluateRequest = await request.json()
    const { questions, attemptNumber } = body

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Build the evaluation prompt
    const systemPrompt = `You are Bright, a friendly AI tutor for kids in grades 3-5. You are evaluating open-ended answers about financial literacy.

YOUR JOB:
Evaluate each answer and decide:
- "good_enough" → Accept it, give specific praise
- "needs_revision" → Ask them to try again with a gentle, concrete suggestion

EVALUATION RULES:

**For CONCEPT-CHECK questions** (there is a correct-ish idea):
Examples: "Use 'interest' in a sentence", "Give an example of a fixed expense", "Explain why saving is better"

Mark as GOOD ENOUGH if:
- The answer shows they understand the concept (even if not perfect prose)
- The vocabulary is used correctly in context
- No major misconceptions
- More than just 1-2 random words

Mark as NEEDS REVISION if:
- Shows wrong idea about the concept
- Vocabulary used incorrectly
- Off-topic or copied from the question
- Too vague to tell if they understand
- Empty, "idk", or similar non-answers

**For REFLECTION questions** (no single right answer, must be thoughtful):
Examples: "Is your budget realistic?", "Why did you choose this plan?", "What was hardest?"

Mark as GOOD ENOUGH if:
- Mentions specific details (categories, numbers, tradeoffs)
- Shows some reasoning ("I picked this because...")
- Has at least 1-2 sentences of actual thought

Mark as NEEDS REVISION only if:
- Extremely short/one word
- Just repeats the question
- Says "idk", "because I wanted to", or clearly no effort
- Completely unrelated to the activity

ATTEMPT NUMBER: ${attemptNumber}
${attemptNumber >= 2 ? '**IMPORTANT: This is attempt #' + attemptNumber + '. Be MORE lenient - if the answer shows basic understanding and genuine effort, accept it even if imperfect.**' : ''}

FEEDBACK STYLE:

If GOOD ENOUGH:
- Start with specific praise about what they did right
- Point out the concept they demonstrated
- Optional: tiny stretch suggestion (but they still pass!)
- Keep it 1-2 sentences, warm and encouraging

If NEEDS REVISION:
- NEVER say "wrong" or "incorrect"
- Structure your feedback as:
  1. Gentle observation: "Your answer doesn't quite show..."
  2. Mini reminder of the concept (1 sentence)
  3. Clear, specific request: "Try writing 1-2 sentences that..."
- Keep it kid-friendly, 2-3 sentences max
- After reading your feedback, they should know EXACTLY what to do

GUARDRAILS:
- Write at 3rd-5th grade reading level
- If they write something off-topic (jokes, random stuff), redirect gently
- NEVER write the answer for them - coach, don't replace
- Be encouraging even when asking for revision

Respond with a JSON array of evaluations, one for each question.`

    const userPrompt = `Evaluate these ${questions.length} open-ended answer(s):

${questions.map((q, i) => `
---
QUESTION ${i + 1}:
ID: ${q.id}
Type: ${q.questionType}
Concept(s): ${q.conceptTags.join(', ')}
Prompt: "${q.prompt}"
${q.rubric ? `What a good answer includes: ${q.rubric}` : ''}
Student's Answer: "${q.studentAnswer}"
---
`).join('\n')}

Respond with ONLY a JSON array like:
[
  {
    "questionId": "q1",
    "status": "good_enough",
    "feedback": "Nice work! You correctly explained that interest is..."
  },
  {
    "questionId": "q2", 
    "status": "needs_revision",
    "feedback": "Your answer is a good start, but..."
  }
]`

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
        temperature: 0.3, // Lower for more consistent evaluation
        max_tokens: 1000,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text()
      console.error('OpenAI API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to get evaluation from AI' },
        { status: 500 }
      )
    }

    const openaiData = await openaiResponse.json()
    const responseText = openaiData.choices[0]?.message?.content || '[]'
    
    // Parse the JSON response
    let evaluations: EvaluationResult[] = []
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        evaluations = JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.error('Failed to parse evaluation response:', parseError, responseText)
      // Fallback: accept all answers on parse error (don't block students)
      evaluations = questions.map(q => ({
        questionId: q.id,
        status: 'good_enough' as const,
        feedback: 'Thanks for your answer! Keep up the great work.'
      }))
    }

    return NextResponse.json({
      evaluations,
      allAccepted: evaluations.every(e => e.status === 'good_enough')
    })
  } catch (error) {
    console.error('Error in evaluate route:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

