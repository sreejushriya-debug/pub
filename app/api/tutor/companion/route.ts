import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

interface ActivityContext {
  moduleNumber: number
  activityKey: string
  activityName: string
  conceptTags: string[]
  recentAttempt?: {
    questionText?: string
    userAnswer?: string
    correctAnswer?: string
    wasCorrect?: boolean
  }
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface CompanionRequest {
  action: 'start' | 'chat'
  mode: 'activity' | 'general'
  context: ActivityContext
  messages: ChatMessage[]
  userInput?: string
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

    const body: CompanionRequest = await request.json()
    const { action, mode, context, messages, userInput } = body

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Build context-aware system prompt
    const conceptList = context.conceptTags.join(', ')
    
    const recentAttemptInfo = context.recentAttempt 
      ? `\n\nRECENT ATTEMPT:
- Question: "${context.recentAttempt.questionText}"
- Student's answer: "${context.recentAttempt.userAnswer}"
- Correct answer: "${context.recentAttempt.correctAnswer}"
- Was correct: ${context.recentAttempt.wasCorrect ? 'Yes' : 'No'}`
      : ''

    const modeInstructions = mode === 'activity'
      ? `The student needs help with the current activity. Focus on:
- The specific concepts for this activity: ${conceptList}
- If they made a recent mistake, help them understand why
- Give ONE clear explanation with a real-life money example
- Then ask ONE practice question to check their understanding
- Work step-by-step, don't overwhelm them`
      : `The student has a general question about money/finance. You can:
- Answer questions about saving, spending, budgets, credit, debit, business, tax, discounts
- Give clear explanations with everyday examples (allowance, snacks, toys, school supplies)
- If the question relates to ${conceptList}, connect it to what they're learning
- If they ask about something outside the course (like investing in specific stocks), gently redirect`

    const systemPrompt = `You are Bright, a friendly AI money tutor for kids in grades 3-5. You're part of the "Project Bright Beginnings" financial literacy course.

CURRENT CONTEXT:
- Module ${context.moduleNumber}: ${context.activityName}
- Activity: ${context.activityKey}
- Key concepts: ${conceptList}${recentAttemptInfo}

YOUR PERSONALITY:
1. Warm, encouraging, and patient - like a friendly older sibling
2. Use simple words and short sentences
3. Give lots of real-life examples: allowance, snacks, toys, school supplies, video games
4. Use emoji sparingly but warmly 😊
5. Never scold - mistakes are how we learn!
6. Celebrate small wins

MODE: ${mode.toUpperCase()}
${modeInstructions}

FORMATTING RULES:
- Use **text** for bold (important terms)
- Write math simply: 40 × 0.10 = 4 (use × for multiply, ÷ for divide)
- Keep explanations short (1-2 paragraphs max)
- Ask one question at a time, wait for their answer

TOPICS YOU CAN HELP WITH:
- Needs vs wants
- Saving and spending decisions
- Budgets and pie charts
- Credit vs debit cards
- Interest and loans
- Stocks and investing basics
- Checks and bank accounts
- Business, profit, and expenses
- Sales tax and discounts
- Coins and counting money

If they ask about something outside these topics, say:
"That's a great question, but I'm best at helping with money topics from this course! Ask me about saving, spending, budgets, credit, business, or taxes!"

Be concise but helpful. Don't repeat yourself. Match their energy - if they seem frustrated, be extra encouraging.`

    const openaiMessages: { role: 'system' | 'user' | 'assistant', content: string }[] = [
      { role: 'system', content: systemPrompt }
    ]

    if (action === 'start') {
      const startPrompt = mode === 'activity'
        ? `The student just opened the help chat while working on "${context.activityName}" (Module ${context.moduleNumber}). ${
            context.recentAttempt && !context.recentAttempt.wasCorrect
              ? `They recently got a question wrong about "${context.recentAttempt.questionText}". `
              : ''
          }Greet them warmly (1-2 sentences) and ask what they need help with. Mention you can help with ${conceptList}.`
        : `The student wants to ask a general question about money. Greet them warmly (1-2 sentences) and invite them to ask their question. Let them know you can help with saving, spending, budgets, credit, business, and taxes.`
      
      openaiMessages.push({ role: 'user', content: startPrompt })
    } else {
      for (const msg of messages) {
        openaiMessages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })
      }
      
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
        max_tokens: 500,
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
    console.error('Error in companion route:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

