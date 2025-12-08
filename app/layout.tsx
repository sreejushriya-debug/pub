import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.projectbrightbeginnings.org'),
  title: {
    default: 'Project Bright Beginnings | Free Financial Literacy Education for Kids',
    template: '%s | Project Bright Beginnings',
  },
  description: 'Free financial literacy curriculum, worksheets, and resources for elementary and middle school students. Teaching kids about budgeting, saving, investing, and money management.',
  keywords: [
    'financial literacy for kids',
    'free finance curriculum',
    'financial education elementary school',
    'money management for kids',
    'financial literacy worksheets',
    'free financial literacy resources',
    'teaching kids about money',
    'elementary school finance',
    'kids budgeting',
    'children financial education',
    'project bright beginnings',
    'financial foundations course',
    'free finance course for kids',
    'financial literacy nonprofit',
    'money skills for children',
    'youth financial literacy',
    'K-12 financial education',
    'personal finance for students',
    'saving and investing for kids',
    'financial literacy Texas',
  ],
  authors: [{ name: 'Project Bright Beginnings' }],
  creator: 'Project Bright Beginnings',
  publisher: 'Project Bright Beginnings',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.projectbrightbeginnings.org',
    siteName: 'Project Bright Beginnings',
    title: 'Project Bright Beginnings | Free Financial Literacy Education for Kids',
    description: 'Free financial literacy curriculum, worksheets, and resources for elementary and middle school students. Teaching kids about budgeting, saving, and investing.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Project Bright Beginnings - Financial Literacy for All',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Project Bright Beginnings | Free Financial Literacy for Kids',
    description: 'Free financial literacy curriculum and resources for elementary and middle school students.',
    images: ['/og-image.png'],
    creator: '@paborightbegin',
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', // Add your Google Search Console verification code
  },
  alternates: {
    canonical: 'https://www.projectbrightbeginnings.org',
  },
  category: 'Education',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: [{ url: '/favicon.ico' }],
  },
}

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Project Bright Beginnings',
  description: 'Free financial literacy education and resources for elementary and middle school students.',
  url: 'https://www.projectbrightbeginnings.org',
  logo: 'https://www.projectbrightbeginnings.org/logo.png',
  email: 'projectbrightbeginnings@gmail.com',
  telephone: '945-216-0206',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '5707 Moriss Road',
    addressLocality: 'Flower Mound',
    addressRegion: 'TX',
    postalCode: '75028',
    addressCountry: 'US',
  },
  sameAs: [
    'https://www.instagram.com/projectbrightbeginnings',
    'https://www.tiktok.com/@projectbrightbeginnings',
  ],
  foundingDate: '2022',
  founders: [
    { '@type': 'Person', name: 'Shriya Sreeju' },
    { '@type': 'Person', name: 'Hansika Kantheti' },
    { '@type': 'Person', name: 'Tanisha Makam' },
  ],
  areaServed: 'Worldwide',
  serviceType: 'Financial Literacy Education',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={poppins.variable}>
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className="font-sans">
          <Navbar />
          <main className="min-h-screen pt-28 md:pt-32">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
