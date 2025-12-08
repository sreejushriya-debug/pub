import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GameState } from '@/lib/moneyAdventure/types'

interface SummaryRequest {
  gameState: GameState
  userName: string
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: SummaryRequest = await request.json()
    const { gameState, userName } = body

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // Analyze the game data
    const wiseChoices = gameState.history.filter(h => {
      return (h.effects.savings && h.effects.savings > 0) || 
             (h.effects.debt === undefined || h.effects.debt === 0)
    }).length

    const riskyChoices = gameState.history.filter(h => {
      return (h.effects.debt && h.effects.debt > 0) || 
             (h.effects.wellbeing && h.effects.wellbeing < 0)
    }).length

    // Count challenges from history
    const challengesCorrect = gameState.history.filter(h => 
      h.challenge?.isCorrect
    ).length

    const challengesTotal = gameState.history.filter(h => 
      h.challenge
    ).length

    // Get missed concepts from challenges
    const missedConcepts = gameState.history
      .filter(h => h.challenge && !h.challenge.isCorrect)
      .flatMap(h => h.challenge?.conceptTags || [])
    
    const uniqueMissedConcepts = Array.from(new Set(missedConcepts))

    const systemPrompt = `You are Bright, a friendly AI money tutor. Write a short, encouraging end-of-game summary for a student who just finished Money Adventure.

RULES:
- Write for 3rd-5th graders
- Be encouraging and specific
- Point out 2-3 things they did well
- Mention 1-2 areas to practice (if any)
- Keep it to 3-4 short paragraphs
- Use emojis sparingly

Respond with JSON:
{
  "summary": "The full summary text...",
  "strengths": ["strength 1", "strength 2"],
  "areasToImprove": ["area 1"],
  "nextSteps": ["suggestion 1", "suggestion 2"]
}`

    const userPrompt = `Student: ${userName}

FINAL STATS:
- Cash: $${gameState.cash}
- Savings: $${gameState.savings}
- Debt: $${gameState.debt}
- Wellbeing: ${gameState.wellbeing}/100
- Scenes played: ${gameState.history.length}
- Goal: ${gameState.bigGoal?.name || 'Unknown'} ($${gameState.bigGoal?.cost || 0})
- Bought Goal: ${gameState.boughtGoal ? 'Yes' : 'No'}

CHOICES:
- Wise/balanced choices: ~${wiseChoices}
- Risky choices: ~${riskyChoices}

TRAIT SCORES:
- Saver Score: ${gameState.saverScore}
- Risk Score: ${gameState.riskScore}
- Planner Score: ${gameState.plannerScore}

CHALLENGES:
- Got ${challengesCorrect}/${challengesTotal} correct
- Missed concepts: ${uniqueMissedConcepts.length > 0 ? uniqueMissedConcepts.join(', ') : 'None!'}

Write an encouraging, personalized summary!`

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
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!openaiResponse.ok) {
      return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
    }

    const openaiData = await openaiResponse.json()
    const responseText = openaiData.choices[0]?.message?.content || '{}'
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return NextResponse.json({
          ...parsed,
          stats: {
            wiseChoices,
            riskyChoices,
            challengesCorrect,
            challengesTotal,
            missedConcepts: uniqueMissedConcepts
          }
        })
      }
    } catch {
      // Fallback
    }

    return NextResponse.json({
      summary: `Great job completing Money Adventure, ${userName}! You finished with $${gameState.savings} in savings. Keep practicing your money skills!`,
      strengths: ['Completed the adventure'],
      areasToImprove: [],
      nextSteps: ['Play again to try different choices'],
      stats: { wiseChoices, riskyChoices, challengesCorrect, challengesTotal, missedConcepts: uniqueMissedConcepts }
    })
  } catch (error) {
    console.error('Error in adventure summary:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
