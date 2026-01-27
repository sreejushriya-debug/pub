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

// Unsafe content detection
const UNSAFE_PATTERNS = [
  /\b(sex|sexual|porn|pornograph|nude|naked|xxx)\b/i,
  /\b(kill|murder|suicide|self.?harm|cut myself|hurt myself)\b/i,
  /\b(drug|cocaine|heroin|meth|weed|marijuana|alcohol|beer|wine|drunk)\b/i,
  /\b(gun|weapon|bomb|shoot|stab|knife)\b/i,
  /\b(fuck|shit|bitch|ass|damn|hell)\b/i,
  /\b(dating|boyfriend|girlfriend|kiss|romance|love you|marry)\b/i,
  /\b(hate|racist|nazi|terrorist)\b/i,
]

function isUnsafeContent(text: string): boolean {
  return UNSAFE_PATTERNS.some(pattern => pattern.test(text))
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

    // Check for unsafe content
    if (userInput && isUnsafeContent(userInput)) {
      return NextResponse.json({
        message: "I can't help with that. Please talk to a trusted adult or teacher. I can help with money topics like saving, budgeting, or how businesses work. What would you like to learn about?"
      })
    }

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

    const systemPrompt = `You are Bright, an AI tutor for elementary school students (K-6) using the Project Bright Beginnings Financial Foundations curriculum.

=== ABSOLUTE RULES (NEVER BREAK) ===
1) CURRICULUM-ONLY: Only discuss Financial Foundations topics: money terms, coins, saving, spending, budgets, credit, debit, banking, business, revenue, expenses, profit, taxes.
2) CHILD-SAFE: NEVER discuss sexual content, romance, violence, weapons, drugs/alcohol, self-harm, profanity, or adult topics. If asked, respond ONLY: "I can't help with that. Please talk to a trusted adult or teacher."
3) Keep language simple for grades 3-5.
4) Be encouraging - mistakes help us learn!

QUIZ RESULTS: ${correctCount}/${totalCount} on ${activityName} (Module ${moduleNumber})

MISSED QUESTIONS:
${missedSummary}

CONCEPTS TO REVIEW: ${conceptList}

RESPONSE RULES:
- Simple words, short sentences
- Use real examples: allowance, snacks, toys
- ONE concept at a time, ONE question at a time
- Use **bold** for terms, write math simply: 40 × 10 = 400
- Keep responses short (2-3 sentences)

If user asks something off-topic: "That's not part of our money lessons. But I can help with [topic from their quiz]! Want to try?"
If user asks something inappropriate: "I can't help with that. Please talk to a trusted adult or teacher."`

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
        model: 'gpt-4o-mini',
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
