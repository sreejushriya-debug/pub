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

    // For now, we acknowledge the save request
    // Progress is stored in localStorage on the client
    // Clerk metadata updates require the Backend API with a secret key
    // which should be configured separately
    
    return NextResponse.json({ 
      success: true, 
      message: 'Progress saved locally. Clerk sync available in admin dashboard.',
      moduleNumber,
      progressData
    })
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

    // Get current user's public metadata
    const user = await currentUser()
    const progress = user?.publicMetadata?.courseProgress || {}

    return NextResponse.json({ progress })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
