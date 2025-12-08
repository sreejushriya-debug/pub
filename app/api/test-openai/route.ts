import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function GET() {
  const results: Record<string, string> = {}
  
  // Check if API key exists
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    results.apiKeyExists = 'NO - OPENAI_API_KEY is not set!'
    results.apiKeyLength = '0'
  } else {
    results.apiKeyExists = 'YES'
    results.apiKeyLength = String(apiKey.length)
    results.apiKeyStart = apiKey.substring(0, 7) + '...'
  }
  
  // Try to call OpenAI
  if (apiKey) {
    try {
      const openai = new OpenAI({ apiKey })
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say "hello" and nothing else.' }],
        max_tokens: 10,
      })
      
      results.openaiCall = 'SUCCESS'
      results.openaiResponse = completion.choices[0]?.message?.content || 'No response'
    } catch (error) {
      results.openaiCall = 'FAILED'
      results.openaiError = error instanceof Error ? error.message : String(error)
    }
  }
  
  return NextResponse.json(results)
}

