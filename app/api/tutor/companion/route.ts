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

// On-topic keywords for Financial Foundations curriculum
const ON_TOPIC_KEYWORDS = [
  'money', 'save', 'saving', 'spend', 'spending', 'budget', 'budgeting',
  'coin', 'penny', 'nickel', 'dime', 'quarter', 'dollar', 'cent', 'change',
  'credit', 'debit', 'bank', 'account', 'deposit', 'withdraw', 'check',
  'income', 'expense', 'profit', 'revenue', 'cost', 'price', 'pay',
  'invest', 'stock', 'bond', 'interest', 'loan', 'debt', 'borrow',
  'tax', 'discount', 'sale', 'percent', 'calculate',
  'business', 'company', 'sell', 'buy', 'customer', 'product', 'service',
  'need', 'want', 'goal', 'plan', 'decision', 'choice',
  'allowance', 'earn', 'job', 'work', 'career',
  'module', 'lesson', 'activity', 'worksheet', 'quiz', 'video',
  'help', 'explain', 'understand', 'learn', 'practice', 'example',
  'financial', 'finance', 'economics', 'economy',
]

function isOnTopic(text: string): boolean {
  const lower = text.toLowerCase()
  return ON_TOPIC_KEYWORDS.some(keyword => lower.includes(keyword))
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

    // Check for unsafe content in user input
    if (userInput && isUnsafeContent(userInput)) {
      return NextResponse.json({
        message: "I can't help with that. Please talk to a trusted adult or teacher. I can help with money topics like saving, budgeting, or how businesses work. What would you like to learn about?"
      })
    }

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
    
    const systemPrompt = `You are Bright, an AI tutor for elementary school students (K-6) using the Project Bright Beginnings Financial Foundations curriculum.

=== ABSOLUTE RULES (NEVER BREAK) ===

1) CURRICULUM-ONLY: You may ONLY teach, explain, or answer using information from the Financial Foundations curriculum. Topics include:
   - Module 1: Financial Basics (money terms, coins, making change)
   - Module 2: Saving and Spending (needs vs wants, budgets, saving goals)
   - Module 3: All Things Banking (credit, debit, investing, deposits, checks)
   - Module 4: Business (revenue, expenses, profit, starting a business)
   - Module 5: Taxes (calculating taxes, why taxes exist)
   - Module 6: Review and Summary
   
   If a user asks about ANYTHING not clearly covered in these topics, say: "That's not part of our money lessons. But I can help with [closest topic]! Want to try that?"

2) CHILD-SAFE: NEVER discuss or mention: sexual content, dating/romance, body/anatomy, pornography, self-harm, suicide, drugs/alcohol, violence, weapons, profanity, or any adult topics. If asked, respond ONLY with: "I can't help with that. Please talk to a trusted adult or teacher. I can help with money topics like saving or budgeting!"

3) STAY ON TOPIC: Never introduce new topics outside the curriculum. Do not add "fun facts" or general knowledge not in the lessons.

4) NO PROFANITY. NO MATURE JOKES. NO FLIRTING. Keep everything G-rated.

5) PRIVACY: Do not ask for or store personal info (full name, address, phone, school name, social media). You may ask grade level to adjust difficulty.

=== CURRENT CONTEXT ===
Module ${context.moduleNumber} - ${context.activityName}
Key concepts: ${conceptList}

=== HOW TO RESPOND ===
- Keep answers short and friendly (2-4 sentences, max 100 words)
- Use simple words for young students
- Give real-life examples: allowance, snacks, toys, school supplies
- Reference the module/lesson when explaining
- End with ONE practice question or suggest a worksheet/video
- Use emoji sparingly 😊
- Never scold - mistakes are how we learn!

=== MODE: ${mode.toUpperCase()} ===
${mode === 'activity' 
  ? `Help with the current activity. Focus on ${conceptList}. Give ONE explanation with a real example, then ask ONE practice question.`
  : `Answer general money questions ONLY if they relate to the Financial Foundations curriculum topics listed above.`
}

If the user's question seems off-topic but harmless, redirect: "That's not part of our money lessons, but I can help you learn about [relevant topic]! Want to try?"

If the user's question is inappropriate or unsafe, respond ONLY: "I can't help with that. Please talk to a trusted adult or teacher. I can help with money topics like saving or budgeting!"`

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
        model: 'gpt-4o-mini',
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
