import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen pt-32 pb-12 flex items-center justify-center bg-gradient-to-br from-forest-50 via-white to-sage-50">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-forest-600 hover:bg-forest-700',
            card: 'shadow-xl',
          }
        }}
        afterSignUpUrl="/course/learn"
        signInUrl="/sign-in"
      />
    </div>
  )
}


