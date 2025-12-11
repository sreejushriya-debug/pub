import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen pt-32 pb-12 flex items-center justify-center bg-gradient-to-br from-forest-50 via-white to-sage-50">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-forest-600 hover:bg-forest-700',
            card: 'shadow-xl',
          }
        }}
        afterSignInUrl="/course/learn"
        signUpUrl="/sign-up"
      />
    </div>
  )
}


