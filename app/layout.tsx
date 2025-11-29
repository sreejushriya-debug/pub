import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Project Bright Beginnings | Financial Literacy for All',
  description: 'Our mission is to provide foundational tools that educate students on the importance of financial education and make financial literacy accessible to all.',
  keywords: ['financial literacy', 'education', 'students', 'finance', 'budgeting', 'saving', 'investing'],
  authors: [{ name: 'Project Bright Beginnings' }],
  openGraph: {
    title: 'Project Bright Beginnings',
    description: 'Making financial education accessible to all',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-sans">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
