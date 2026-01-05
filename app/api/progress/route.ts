import { auth, currentUser } from '@clerk/nextjs/server'
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
    const user = await currentUser()
    const currentProgress = (user?.publicMetadata?.courseProgress as Record<string, unknown>) || {}

    // Update the specific module's progress
    const updatedProgress = {
      ...currentProgress,
      [`module${moduleNumber}`]: {
        ...progressData,
        lastUpdated: new Date().toISOString()
      }
    }

    // Use Clerk Backend API to update user metadata
    const clerkSecretKey = process.env.CLERK_SECRET_KEY
    if (clerkSecretKey) {
      try {
        const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${clerkSecretKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            public_metadata: {
              ...user?.publicMetadata,
              courseProgress: updatedProgress
            }
          })
        })
        
        if (!response.ok) {
          console.error('Clerk API error:', await response.text())
        }
      } catch (clerkError) {
        console.error('Failed to sync to Clerk:', clerkError)
        // Continue anyway - progress is saved locally
      }
    }

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

    const user = await currentUser()
    const progress = user?.publicMetadata?.courseProgress || {}

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
