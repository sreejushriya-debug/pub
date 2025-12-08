import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function GET() {
  const results: Record<string, unknown> = {}
  
  // Check all environment variables that might be related
  const possibleKeys = [
    'OPENAI_API_KEY',
    'OPENAI_KEY', 
    'OPEN_AI_API_KEY',
    'OPEN_AI_KEY'
  ]
  
  results.checkedVariables = {}
  
  for (const keyName of possibleKeys) {
    const value = process.env[keyName]
    if (value) {
      (results.checkedVariables as Record<string, string>)[keyName] = `EXISTS (${value.length} chars, starts with: ${value.substring(0, 10)}...)`
    } else {
      (results.checkedVariables as Record<string, string>)[keyName] = 'NOT SET'
    }
  }
  
  // Check specifically OPENAI_API_KEY
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    results.status = 'ERROR'
    results.error = 'OPENAI_API_KEY environment variable is not set'
    results.suggestion = 'Make sure the variable name is exactly OPENAI_API_KEY in Vercel'
    return NextResponse.json(results)
  }
  
  results.apiKeyFound = true
  results.apiKeyLength = apiKey.length
  results.apiKeyPrefix = apiKey.substring(0, 15) + '...'
  
  // Validate key format
  if (!apiKey.startsWith('sk-')) {
    results.status = 'WARNING'
    results.warning = 'API key does not start with sk- which is unusual'
  }
  
  // Try to call OpenAI
  try {
    const openai = new OpenAI({ apiKey })
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say exactly: "OpenAI is working!"' }],
      max_tokens: 20,
    })
    
    results.status = 'SUCCESS'
    results.openaiResponse = completion.choices[0]?.message?.content
    results.model = completion.model
    
  } catch (error: unknown) {
    results.status = 'OPENAI_ERROR'
    if (error instanceof Error) {
      results.errorMessage = error.message
      results.errorName = error.name
      
      // Check for specific error types
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        results.diagnosis = 'API key is invalid or expired. Please generate a new one at platform.openai.com'
      } else if (error.message.includes('429')) {
        results.diagnosis = 'Rate limited or quota exceeded. Check your OpenAI billing at platform.openai.com'
      } else if (error.message.includes('insufficient_quota')) {
        results.diagnosis = 'Your OpenAI account has no credits. Add payment method at platform.openai.com/account/billing'
      }
    } else {
      results.errorMessage = String(error)
    }
  }
  
  return NextResponse.json(results, { 
    status: results.status === 'SUCCESS' ? 200 : 500 
  })
}
