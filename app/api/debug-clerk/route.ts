import { NextResponse } from 'next/server'

export async function GET() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'NOT SET'
  const secretKeyExists = !!process.env.CLERK_SECRET_KEY
  
  // Only show first 15 chars for security
  const keyPreview = publishableKey.substring(0, 15) + '...'
  
  // Determine mode
  const isProduction = publishableKey.startsWith('pk_live_')
  const isDevelopment = publishableKey.startsWith('pk_test_')
  
  return NextResponse.json({
    keyPreview,
    secretKeyExists,
    mode: isProduction ? 'PRODUCTION ✅' : isDevelopment ? 'DEVELOPMENT ⚠️' : 'UNKNOWN ❌',
    issue: isDevelopment 
      ? 'You need to update NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in Vercel with your pk_live_ key from Clerk Production'
      : isProduction 
        ? 'Keys look correct! Try clearing browser cache or hard refresh.'
        : 'Key format not recognized',
    instructions: [
      '1. Go to Clerk Dashboard → Production → API Keys',
      '2. Copy the Publishable key (starts with pk_live_)',
      '3. Copy the Secret key (starts with sk_live_)',
      '4. Go to Vercel → Settings → Environment Variables',
      '5. Update NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY with pk_live_ key',
      '6. Update CLERK_SECRET_KEY with sk_live_ key',
      '7. Redeploy the site',
    ]
  })
}

