import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import OpenAI from 'openai'

interface PracticeRequest {
  action: 'start' | 'respond'
  topics: string[]
  messages: { role: 'user' | 'assistant'; content: string }[]
  userInput?: string
  waitingForAnswer?: boolean
  currentQuestionData?: { concept: string; correctAnswer: string }
  stats?: {
    questionsAttempted: number
    questionsCorrect: number
    conceptsWorked: string[]
  }
}

const CONCEPT_DISPLAY_NAMES: Record<string, string> = {
  needs_vs_wants: 'Needs vs Wants',
  basic_vocab: 'Financial Vocabulary',
  coins: 'Coins & Counting Money',
  income: 'Income',
  debt: 'Debt',
  interest: 'Interest',
  saving_vs_spending: 'Saving vs Spending',
  budgeting: 'Budgeting',
  pie_charts: 'Budget Pie Charts',
  goals: 'Financial Goals',
  credit_vs_debit: 'Credit vs Debit',
  credit_terms: 'Credit Terms',
  stock_trend: 'Stock Trends',
  check_basics: 'Check Writing',
  profit_loss: 'Profit & Loss',
  revenue: 'Revenue',
  expenses: 'Expenses',
  scarcity: 'Scarcity & Supply',
  expense_types: 'Types of Expenses',
  sales_tax: 'Sales Tax',
  discounts: 'Discounts',
  tax_plus_discount: 'Tax + Discount Combined',
  comparison_shopping: 'Comparison Shopping',
}

const CONCEPT_QUESTIONS: Record<string, string[]> = {
  needs_vs_wants: [
    'Which of these is a NEED: a new toy, food, or a video game?',
    'Is a bicycle a need or a want?',
  ],
  coins: [
    'How much is a quarter worth in cents?',
    'If you have 3 dimes, how many cents do you have?',
  ],
  saving_vs_spending: [
    'Sarah wants to buy a $20 book but only has $15. Should she save or spend?',
  ],
  budgeting: [
    'What is a budget?',
    'If you have $50 and spend $30 on groceries, how much is left?',
  ],
  interest: [
    'If you borrow $100 with 10% interest, how much extra do you owe?',
  ],
  profit_loss: [
    'You spend $5 on supplies and sell your product for $12. What is your profit?',
  ],
  sales_tax: [
    'An item costs $10 and tax is 10%. What is the total price?',
  ],
  discounts: [
    'A shirt costs $40 and is 25% off. How much do you save?',
  ],
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Please sign in to practice' },
        { status: 401 }
      )
    }

    const body: PracticeRequest = await request.json()
    const { action, topics, messages, userInput, waitingForAnswer, currentQuestionData, stats } = body

    const topicNames = topics.map(t => CONCEPT_DISPLAY_NAMES[t] || t).join(', ')

    // Fallback if no API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set')
      return NextResponse.json({
        message: action === 'start'
          ? `Hi! 👋 I'm Bright! Let's practice ${topicNames}! Here's a warm-up question: What's the difference between a need and a want?`
          : "I'm having a little trouble right now. Try asking your question again!",
        isQuestion: action === 'start',
        questionData: action === 'start' ? { concept: topics[0] || 'needs_vs_wants', correctAnswer: 'need is required, want is desired' } : null,
        wasCorrect: false,
        sessionComplete: false,
      })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const sampleQuestions = topics.flatMap(t => CONCEPT_QUESTIONS[t] || []).slice(0, 4)

    const systemPrompt = `You are Bright, a friendly AI money tutor for kids in grades 3-5.

TOPICS: ${topicNames}

RULES:
- ONE question at a time, wait for answer
- Simple words, short sentences
- If correct: "Great job! ✓" then brief explanation
- If wrong: "Not quite! Let me explain..." then explanation
- After 5-8 questions, wrap up the session

SAMPLE QUESTIONS:
${sampleQuestions.join('\n')}

When asking a question, add this marker at the end:
[QUESTION: concept_key | correct_answer]

Example: [QUESTION: coins | 75]

If NOT asking a question, don't include the marker.`

    const openaiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt }
    ]

    if (action === 'start') {
      openaiMessages.push({ 
        role: 'user', 
        content: `Start a practice session for ${topicNames}. Welcome briefly, then ask an easy first question with the [QUESTION: concept | answer] marker.` 
      })
    } else {
      for (const msg of messages) {
        openaiMessages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })
      }

      let context = ''
      if (waitingForAnswer && currentQuestionData) {
        context = `Student answered: "${userInput}". Correct answer was: "${currentQuestionData.correctAnswer}". 
Check if correct, give feedback, then ask next question. Stats: ${stats?.questionsCorrect || 0}/${stats?.questionsAttempted || 0} correct.
${(stats?.questionsAttempted || 0) >= 6 ? 'Consider wrapping up.' : ''}`
      } else {
        context = `Student said: "${userInput}". Respond and continue practice.`
      }
      openaiMessages.push({ role: 'user', content: context })
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 500,
      })

      let assistantMessage = completion.choices[0]?.message?.content || 
        "I'm having trouble thinking right now. Can you try again?"

      // Parse question marker
      let isQuestion = false
      let questionData: { concept: string; correctAnswer: string } | null = null
      let wasCorrect = false

      const questionMatch = assistantMessage.match(/\[QUESTION:\s*([^\|]+)\s*\|\s*([^\]]+)\]/)
      if (questionMatch) {
        isQuestion = true
        questionData = {
          concept: questionMatch[1].trim(),
          correctAnswer: questionMatch[2].trim()
        }
        assistantMessage = assistantMessage.replace(/\[QUESTION:[^\]]+\]/, '').trim()
      }

      // Check if answer was correct
      if (waitingForAnswer && currentQuestionData && userInput) {
        const userAnswer = userInput.toLowerCase().trim()
        const correctAnswer = currentQuestionData.correctAnswer.toLowerCase().trim()
        wasCorrect = userAnswer === correctAnswer ||
                     userAnswer.includes(correctAnswer) ||
                     correctAnswer.includes(userAnswer) ||
                     userAnswer.replace(/[$,]/g, '') === correctAnswer.replace(/[$,]/g, '')
      }

      const sessionComplete = assistantMessage.toLowerCase().includes('great job today') ||
                             assistantMessage.toLowerCase().includes('finished practicing') ||
                             (userInput?.toLowerCase().includes('end session'))

      return NextResponse.json({
        message: assistantMessage,
        isQuestion,
        questionData,
        wasCorrect,
        sessionComplete,
      })

    } catch (openaiError: unknown) {
      const errorMessage = openaiError instanceof Error ? openaiError.message : String(openaiError)
      console.error('OpenAI API error:', errorMessage, openaiError)
      return NextResponse.json({
        message: `Hmm, I had a little hiccup! (${errorMessage}) 🤔 Can you try again?`,
        isQuestion: false,
        questionData: null,
        wasCorrect: false,
        sessionComplete: false,
      })
    }

  } catch (error) {
    console.error('Error in practice session route:', error)
    return NextResponse.json({
      message: "Oops! Something went wrong. Try again!",
      isQuestion: false,
      questionData: null,
      wasCorrect: false,
      sessionComplete: false,
    })
  }
}
