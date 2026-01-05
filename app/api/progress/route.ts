import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { moduleNumber, progressData } = body

    if (!moduleNumber || !progressData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get current user metadata
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const currentProgress = (user.publicMetadata?.courseProgress as Record<string, unknown>) || {}

    // Update the specific module's progress
    const updatedProgress = {
      ...currentProgress,
      [`module${moduleNumber}`]: {
        ...progressData,
        lastUpdated: new Date().toISOString()
      }
    }

    // Save to Clerk metadata
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        courseProgress: updatedProgress
      }
    })

    return NextResponse.json({ success: true, progress: updatedProgress })
  } catch (error) {
    console.error('Error saving progress:', error)
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const progress = user.publicMetadata?.courseProgress || {}

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

