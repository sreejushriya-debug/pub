import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import OpenAI from 'openai'

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
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Please sign in to chat with Bright' },
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

    // Fallback if no API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set')
      return NextResponse.json({
        message: action === 'start'
          ? `Hi! 👋 I'm Bright! You got ${correctCount}/${totalCount} correct on ${activityName}. I'm here to help you understand the tricky ones. What would you like to work on?`
          : "I'm having a little trouble right now. Try asking your question again!"
      })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const missedSummary = missedQuestions.map((q, i) => {
      return `${i + 1}. "${q.term || 'Question'}": They said "${q.userAnswer}", correct was "${q.correctAnswer}"`
    }).join('\n')

    const conceptList = Array.from(new Set(missedQuestions.flatMap(q => q.conceptTags || [q.term || 'unknown']))).join(', ')

    const systemPrompt = `You are Bright, a friendly AI tutor for kids in grades 3-5.

QUIZ RESULTS: ${correctCount}/${totalCount} on ${activityName} (Module ${moduleNumber})

MISSED QUESTIONS:
${missedSummary}

CONCEPTS: ${conceptList}

RULES:
- Simple words, short sentences (3rd-5th grade level)
- Use real examples: allowance, snacks, toys
- Be encouraging - mistakes help us learn!
- ONE concept at a time, ONE question at a time
- Use **bold** for terms, write math simply: 40 × 10 = 400

Keep responses short (2-3 sentences). Be warm and helpful! 😊`

    const openaiMessages: { role: 'system' | 'user' | 'assistant', content: string }[] = [
      { role: 'system', content: systemPrompt }
    ]

    if (action === 'start') {
      openaiMessages.push({ 
        role: 'user', 
        content: `Greet the student (2 sentences), mention their score, and ask which concept they want help with.` 
      })
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
        max_tokens: 500,
      })

      const assistantMessage = completion.choices[0]?.message?.content || 
        "I'm having trouble thinking right now. Can you try again?"

      return NextResponse.json({ message: assistantMessage })

    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError)
      return NextResponse.json({
        message: "Hmm, I had a little hiccup! 🤔 Can you try asking that question again?"
      })
    }

  } catch (error) {
    console.error('Error in tutor chat route:', error)
    return NextResponse.json({
      message: "Oops! Something went wrong. Try asking your question again!"
    })
  }
}
