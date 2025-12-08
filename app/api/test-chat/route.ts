import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import OpenAI from 'openai'

export async function GET(request: NextRequest) {
  const results: Record<string, unknown> = {}
  
  // Step 1: Check auth
  try {
    const { userId } = await auth()
    results.authCheck = userId ? `Authenticated as: ${userId}` : 'NOT AUTHENTICATED'
    results.userId = userId
  } catch (authError) {
    results.authCheck = 'AUTH ERROR'
    results.authError = authError instanceof Error ? authError.message : String(authError)
  }
  
  // Step 2: Check OpenAI
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    results.openaiCheck = 'NO API KEY'
    return NextResponse.json(results)
  }
  
  results.openaiCheck = 'API KEY EXISTS'
  
  // Step 3: Try a simple chat completion
  try {
    const openai = new OpenAI({ apiKey })
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are Bright, a friendly tutor.' },
        { role: 'user', content: 'Say hello in one sentence.' }
      ],
      max_tokens: 50,
    })
    
    results.chatTest = 'SUCCESS'
    results.chatResponse = completion.choices[0]?.message?.content
  } catch (chatError) {
    results.chatTest = 'FAILED'
    results.chatError = chatError instanceof Error ? chatError.message : String(chatError)
  }
  
  return NextResponse.json(results)
}

export async function POST(request: NextRequest) {
  const results: Record<string, unknown> = {}
  
  // Check auth
  try {
    const { userId } = await auth()
    results.userId = userId || 'NOT AUTHENTICATED'
    
    if (!userId) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        results 
      }, { status: 401 })
    }
  } catch (authError) {
    results.authError = authError instanceof Error ? authError.message : String(authError)
    return NextResponse.json({ 
      error: 'Auth check failed',
      results 
    }, { status: 500 })
  }
  
  // Check OpenAI
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ 
      error: 'No API key',
      results 
    }, { status: 500 })
  }
  
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    
    const body = await request.json()
    const userMessage = body.message || 'Hello!'
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are Bright, a friendly money tutor for kids. Keep responses short.' },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 100,
    })
    
    return NextResponse.json({
      success: true,
      message: completion.choices[0]?.message?.content,
      results
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      results
    }, { status: 500 })
  }
}

