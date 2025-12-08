import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import OpenAI from 'openai'

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
        { error: 'Please sign in to chat with Bright' },
        { status: 401 }
      )
    }

    const body: CompanionRequest = await request.json()
    const { action, mode, context, messages, userInput } = body

    // Fallback responses if API key is missing
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set')
      const fallbackMessage = action === 'start'
        ? mode === 'activity'
          ? `Hi there! 👋 I'm Bright, your money tutor! I see you're working on ${context.activityName}. I'm here to help you learn about ${context.conceptTags.join(', ')}. What would you like help with?`
          : "Hi! 👋 I'm Bright, your friendly money tutor! I can help you learn about saving, spending, budgets, and more. What's your question?"
        : "I'm having a little trouble right now, but I'm still here to help! Try asking your question a different way, or you can move on to the next activity."
      
      return NextResponse.json({ message: fallbackMessage })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const conceptList = context.conceptTags.join(', ')
    
    const systemPrompt = `You are Bright, a friendly AI money tutor for kids in grades 3-5.

CONTEXT: Module ${context.moduleNumber} - ${context.activityName}
Key concepts: ${conceptList}

PERSONALITY:
- Warm, encouraging, patient - like a friendly older sibling
- Use simple words and short sentences
- Give real-life examples: allowance, snacks, toys, school supplies
- Use emoji sparingly 😊
- Never scold - mistakes are how we learn!

MODE: ${mode.toUpperCase()}
${mode === 'activity' 
  ? `Help with the current activity. Focus on ${conceptList}. Give ONE explanation with a real example, then ask ONE practice question.`
  : `Answer general money questions. Topics: saving, spending, budgets, credit, debit, business, tax, discounts.`
}

Keep responses short (2-3 sentences). Ask one question at a time.`

    const openaiMessages: { role: 'system' | 'user' | 'assistant', content: string }[] = [
      { role: 'system', content: systemPrompt }
    ]

    if (action === 'start') {
      const startPrompt = mode === 'activity'
        ? `Greet the student (1-2 sentences). They're working on "${context.activityName}". Ask what they need help with.`
        : `Greet the student (1-2 sentences). They want to ask a general money question. Invite them to ask.`
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

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 400,
      })

      const assistantMessage = completion.choices[0]?.message?.content || 
        "I'm having trouble thinking right now. Can you try asking again?"

      return NextResponse.json({ message: assistantMessage })

    } catch (openaiError: unknown) {
      const errorMessage = openaiError instanceof Error ? openaiError.message : String(openaiError)
      console.error('OpenAI API error:', errorMessage, openaiError)
      // Return friendly fallback with error info
      return NextResponse.json({
        message: action === 'start'
          ? `Hi! 👋 I'm Bright! I'm here to help you with ${context.activityName}. (Note: ${errorMessage})`
          : `Hmm, I had a little hiccup! (${errorMessage}) 🤔 Can you try asking that question again?`
      })
    }

  } catch (error) {
    console.error('Error in companion route:', error)
    return NextResponse.json({
      message: "Oops! Something went wrong. Try asking your question again!"
    })
  }
}
