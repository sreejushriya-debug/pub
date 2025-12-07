import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

interface MissedQuestion {
  questionId: string
  questionText: string
  correctAnswer: string
  userAnswer: string
  term?: string
  conceptTags?: string[]
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  action: 'start' | 'chat'
  moduleNumber: number
  activityKey: string
  activityName: string
  missedQuestions: MissedQuestion[]
  correctCount: number
  totalCount: number
  messages: ChatMessage[]
  userInput?: string
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

    const body: ChatRequest = await request.json()
    const { 
      action, 
      moduleNumber, 
      activityKey, 
      activityName,
      missedQuestions, 
      correctCount, 
      totalCount,
      messages,
      userInput 
    } = body

    // Call OpenAI API
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Build the system prompt with full context
    const missedSummary = missedQuestions.map((q, i) => {
      const tags = q.conceptTags?.length ? ` [Concepts: ${q.conceptTags.join(', ')}]` : ''
      return `${i + 1}. Term: "${q.term || 'Unknown'}"
   Question: "${q.questionText}"
   Their answer: "${q.userAnswer}"
   Correct answer: "${q.correctAnswer}"${tags}`
    }).join('\n\n')

    const conceptList = Array.from(new Set(missedQuestions.flatMap(q => q.conceptTags || [q.term || 'unknown']))).join(', ')

    const systemPrompt = `You are Bright, a friendly, encouraging AI tutor for kids in grades 3-5. You help students learn about money through the "Project Bright Beginnings" financial literacy course.

CURRENT CONTEXT:
- Student just took: ${activityName} (Module ${moduleNumber}, ${activityKey})
- Score: ${correctCount}/${totalCount} correct
- They missed ${missedQuestions.length} question(s)

QUESTIONS THEY GOT WRONG:
${missedSummary}

CONCEPTS TO FOCUS ON: ${conceptList}

YOUR PERSONALITY & RULES:
1. Talk like you're explaining to a 3rd-5th grader - simple words, short sentences
2. Use real-life money examples: allowance, snacks, school supplies, toys, video games
3. Be super encouraging! Mistakes are normal and good for learning
4. Never scold or make them feel bad
5. Stay on topic: saving, spending, budgets, credit/debit, business basics, tax, discounts
6. If they ask about something outside the course, gently redirect

HOW TO HELP WITH EACH CONCEPT:
1. Name the concept in simple terms
2. Explain why their specific answer was wrong (gently!)
3. Give a short, focused explanation (1-2 paragraphs max)
4. Provide ONE worked example with step-by-step walkthrough
5. Ask them ONE practice question to check understanding
6. Wait for their answer, then give feedback
7. Offer to do more practice or move to the next concept

CONVERSATION STYLE:
- Work on ONE concept at a time
- Ask one question, wait for answer, then respond
- Always offer choices: "Want another practice question on this, or should we try something else?"
- Use emoji sparingly but warmly 😊
- Break up long explanations into short paragraphs

FORMATTING RULES (IMPORTANT):
- Use **text** for bold (important terms or emphasis)
- For math, write it simply like: 40 × 0.10 = 4 (use × for multiply, ÷ for divide)
- Do NOT use LaTeX or special math notation like \\[ or \\( or \\times
- Write numbers and equations in plain text that kids can read easily
- Example: "40 × 0.10 = 4" NOT "\\[ 40 \\times 0.10 = 4 \\]"

If they ask "why was question X wrong?", refer back to the specific question they missed.
If they ask a general concept question, give a focused answer related to what we teach.
If they seem frustrated, be extra encouraging and offer simpler examples.`

    // Build the messages array for OpenAI
    const openaiMessages: { role: 'system' | 'user' | 'assistant', content: string }[] = [
      { role: 'system', content: systemPrompt }
    ]

    if (action === 'start') {
      // First message - tutor introduces itself based on the quiz results
      const startPrompt = `The student just finished the quiz. Start the conversation by:
1. Greeting them warmly
2. Acknowledging what they got right (${correctCount}/${totalCount})
3. Mentioning the concepts they struggled with (without listing all the questions)
4. Asking which concept they'd like to work on first

Keep it short and friendly! Just 2-3 sentences for the greeting, then offer the choice of concepts.`
      
      openaiMessages.push({ role: 'user', content: startPrompt })
    } else {
      // Continuing conversation - include history
      for (const msg of messages) {
        openaiMessages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })
      }
      
      // Add the new user message if provided
      if (userInput) {
        openaiMessages.push({ role: 'user', content: userInput })
      }
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 600,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text()
      console.error('OpenAI API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to get response from AI' },
        { status: 500 }
      )
    }

    const openaiData = await openaiResponse.json()
    const assistantMessage = openaiData.choices[0]?.message?.content || "I'm having trouble thinking right now. Can you try again?"

    return NextResponse.json({
      message: assistantMessage,
    })
  } catch (error) {
    console.error('Error in tutor chat route:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

