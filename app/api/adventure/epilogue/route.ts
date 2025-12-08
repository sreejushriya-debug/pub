import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import OpenAI from 'openai'
import { GameState, ENDING_INFO } from '@/lib/moneyAdventure/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { gameState, userName } = await request.json() as { gameState: GameState; userName: string }

    const ending = ENDING_INFO[gameState.endingType || 'balanced_planner']
    
    const systemPrompt = `You are Bright, a friendly AI tutor for kids ages 8-12. 
You just watched a student play through a money adventure game.

Write a personalized epilogue message for them. Use simple, encouraging language.

Structure:
1. Congratulate them on completing the adventure (1 sentence)
2. What they did well based on their choices (2-3 sentences, be specific)
3. What was challenging for them (1-2 sentences, gentle and encouraging)
4. One concrete suggestion for next time OR for their real life (1-2 sentences)

Keep it SHORT (4-6 sentences total). Use their name. Be warm and encouraging!`

    const userPrompt = `Student: ${userName}
Goal: ${gameState.bigGoal.name} ($${gameState.bigGoal.cost})
Final Stats:
- Cash: $${gameState.cash}
- Savings: $${gameState.savings}  
- Debt: $${gameState.debt}
- Wellbeing: ${gameState.wellbeing}/100
- Bought Goal: ${gameState.boughtGoal ? 'Yes' : 'No'}

Trait Scores:
- Saver Score: ${gameState.saverScore}
- Risk Score: ${gameState.riskScore}
- Planner Score: ${gameState.plannerScore}

Ending Type: ${gameState.endingType} - "${ending.title}"
Ending Description: ${ending.description}

Total Money Summary:
- Earned: ~$${gameState.totalEarned + 100}
- Spent on Needs: ~$${gameState.totalSpentNeeds + 50}
- Spent on Wants: ~$${gameState.totalSpentWants}
- Saved: ~$${gameState.totalSaved}
- Borrowed: $${gameState.totalBorrowed}

Write a personalized epilogue for this student.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 300
    })

    const epilogue = completion.choices[0]?.message?.content || 
      `Great job completing Money Adventure, ${userName}! You learned a lot about saving, spending, and making smart money choices. Keep practicing these skills in real life!`

    return NextResponse.json({ epilogue })
  } catch (error) {
    console.error('Epilogue generation error:', error)
    return NextResponse.json({ 
      epilogue: 'Congratulations on completing Money Adventure! You made it through all the challenges and learned valuable money lessons along the way. Keep up the great work!'
    })
  }
}

