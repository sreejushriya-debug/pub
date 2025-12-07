import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

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

// Sample questions for each concept (the AI will generate variations)
const CONCEPT_QUESTIONS: Record<string, string[]> = {
  needs_vs_wants: [
    'Which of these is a NEED: a new toy, food, or a video game?',
    'Is a bicycle a need or a want?',
    'Your family needs to pay the electric bill. Is electricity a need or want?',
    'You really want a new pair of sneakers, but your current ones still fit. Is this a need or want?',
  ],
  coins: [
    'How much is a quarter worth in cents?',
    'If you have 3 dimes, how many cents do you have?',
    'Which coin is worth more: a nickel or a dime?',
    'You have 2 quarters and 3 pennies. What is the total in cents?',
  ],
  saving_vs_spending: [
    'Sarah wants to buy a $20 book but only has $15. Should she save or spend?',
    'What is one good reason to save money instead of spending it right away?',
    'If you get $10 for your birthday, what is one smart thing you could do with some of it?',
  ],
  budgeting: [
    'What is a budget?',
    'If you have $50 and spend $30 on groceries, how much is left for other things?',
    'Why is it important to track your spending?',
  ],
  credit_vs_debit: [
    'When you use a debit card, where does the money come from?',
    'What happens if you use more credit than you can pay back?',
    'Which card takes money directly from your bank account: credit or debit?',
  ],
  interest: [
    'If you borrow $100 with 10% interest, how much extra do you owe?',
    'Is interest something you pay when you borrow, or when you save?',
    'Why do banks charge interest on loans?',
  ],
  profit_loss: [
    'You spend $5 on supplies and sell your product for $12. What is your profit?',
    'Revenue minus expenses equals what?',
    'If expenses are higher than revenue, do you have profit or loss?',
  ],
  sales_tax: [
    'An item costs $10 and tax is 10%. What is the total price?',
    'Why do stores add sales tax to purchases?',
    'If something costs $25 with 8% tax, about how much tax will you pay?',
  ],
  discounts: [
    'A shirt costs $40 and is 25% off. How much do you save?',
    'What does "50% off" mean?',
    'A $20 toy is on sale for 10% off. What is the sale price?',
  ],
  expense_types: [
    'Is rent a fixed or variable expense?',
    'Name one example of a variable expense.',
    'What is the difference between fixed and variable expenses?',
  ],
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

    const body: PracticeRequest = await request.json()
    const { action, topics, messages, userInput, waitingForAnswer, currentQuestionData, stats } = body

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const topicNames = topics.map(t => CONCEPT_DISPLAY_NAMES[t] || t).join(', ')
    
    // Get sample questions for context
    const sampleQuestions = topics.flatMap(t => CONCEPT_QUESTIONS[t] || []).slice(0, 6)

    const systemPrompt = `You are Bright, a friendly AI money tutor for kids in grades 3-5. You're running a personalized practice session to help a student improve on specific concepts.

TOPICS TO PRACTICE: ${topicNames}

YOUR PERSONALITY:
1. Warm, encouraging, and patient - like a friendly older sibling
2. Use simple words and short sentences
3. Give lots of real-life examples: allowance, snacks, toys, school supplies
4. Use emoji sparingly but warmly 😊
5. Never scold - mistakes are how we learn!
6. Celebrate every correct answer and effort!

PRACTICE SESSION RULES:
1. **One question at a time** - ask ONE question, wait for their answer
2. **Check their answer** - determine if it's correct or close
3. **Give feedback** - if wrong, explain gently with an example, then give them another try or move on
4. **Vary difficulty** - start easy, get slightly harder
5. **Stay on topic** - only ask about: ${topicNames}
6. **Track progress** - after 5-8 questions, consider wrapping up

QUESTION EXAMPLES FOR INSPIRATION:
${sampleQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

RESPONSE FORMAT:
- When asking a question, make it clear and specific
- After they answer, always acknowledge their effort
- If correct: "Great job! ✓" then brief explanation
- If incorrect: "Not quite! Let me explain..." then clear, simple explanation
- Then ask next question OR check if they want to continue

ENDING THE SESSION:
After about 5-8 questions, or if they say "end session" / "I'm done" / "stop":
1. Summarize what they practiced
2. Highlight what they did well
3. Mention anything to keep working on
4. End with encouragement

Important: Always include a clear question that needs an answer when asking practice questions. Make sure to include the correct answer in your reasoning so we can verify.

When you ask a question, at the END of your message, add this exact marker on its own line:
[QUESTION: concept_key | correct_answer]

For example:
[QUESTION: coins | 75]
[QUESTION: needs_vs_wants | need]
[QUESTION: profit_loss | 7]

If you're NOT asking a question (just explaining or wrapping up), don't include this marker.`

    const openaiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt }
    ]

    if (action === 'start') {
      const startPrompt = `Start a practice session for: ${topicNames}. 

Welcome the student warmly (1-2 sentences), then ask your first warm-up question about one of these topics. Make it an easy question to build confidence.

Remember to end with the [QUESTION: concept | answer] marker.`
      
      openaiMessages.push({ role: 'user', content: startPrompt })
    } else {
      // Add conversation history
      for (const msg of messages) {
        openaiMessages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })
      }

      // Context about what's happening
      let context = ''
      
      if (waitingForAnswer && currentQuestionData) {
        context = `The student just answered a question about ${CONCEPT_DISPLAY_NAMES[currentQuestionData.concept] || currentQuestionData.concept}. 
The correct answer was: "${currentQuestionData.correctAnswer}"
The student said: "${userInput}"

Check if their answer is correct (be generous - partial credit for close answers). Then:
- If correct: Celebrate briefly, then ask the next question
- If incorrect: Explain gently, then ask next question

Current stats: ${stats?.questionsCorrect || 0}/${stats?.questionsAttempted || 0} correct so far.
${(stats?.questionsAttempted || 0) >= 6 ? 'Consider wrapping up soon unless they want to continue.' : ''}

Remember the [QUESTION: concept | answer] marker if you ask another question.`
      } else {
        context = `The student said: "${userInput}"

If they're asking for help or to move on, respond appropriately. Otherwise, continue the practice with a new question.

Remember the [QUESTION: concept | answer] marker if you ask a question.`
      }

      openaiMessages.push({ role: 'user', content: context })
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
    let assistantMessage = openaiData.choices[0]?.message?.content || "I'm having trouble thinking right now. Can you try again?"

    // Parse the response for question marker
    let isQuestion = false
    let questionData: { concept: string; correctAnswer: string } | null = null
    let wasCorrect = false

    // Check for question marker
    const questionMatch = assistantMessage.match(/\[QUESTION:\s*([^\|]+)\s*\|\s*([^\]]+)\]/)
    if (questionMatch) {
      isQuestion = true
      questionData = {
        concept: questionMatch[1].trim(),
        correctAnswer: questionMatch[2].trim()
      }
      // Remove the marker from the displayed message
      assistantMessage = assistantMessage.replace(/\[QUESTION:[^\]]+\]/, '').trim()
    }

    // Check if the answer was correct (if we were waiting for one)
    if (waitingForAnswer && currentQuestionData && userInput) {
      const userAnswer = userInput.toLowerCase().trim()
      const correctAnswer = currentQuestionData.correctAnswer.toLowerCase().trim()
      
      // Flexible matching
      wasCorrect = userAnswer === correctAnswer ||
                   userAnswer.includes(correctAnswer) ||
                   correctAnswer.includes(userAnswer) ||
                   // Number matching (allow $ signs, commas, etc.)
                   userAnswer.replace(/[$,]/g, '') === correctAnswer.replace(/[$,]/g, '')
    }

    // Check if session should end
    const sessionComplete = assistantMessage.toLowerCase().includes('great job today') ||
                           assistantMessage.toLowerCase().includes('session complete') ||
                           assistantMessage.toLowerCase().includes('finished practicing') ||
                           (userInput?.toLowerCase().includes('end session')) ||
                           (userInput?.toLowerCase().includes("i'm done"))

    return NextResponse.json({
      message: assistantMessage,
      isQuestion,
      questionData,
      wasCorrect,
      sessionComplete,
    })
  } catch (error) {
    console.error('Error in practice session route:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

