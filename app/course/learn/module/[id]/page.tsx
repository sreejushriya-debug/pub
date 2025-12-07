'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Play, FileText, Download, CheckCircle2, 
  ChevronRight, ChevronLeft, BookOpen
} from 'lucide-react'
import FloatingParticles from '@/components/FloatingParticles'

// Video URLs
const VIDEO_URLS: Record<string, string> = {
  '1.1': 'https://www.youtube.com/embed/h2g8iOKdtnc',
  '1.3': 'https://www.youtube.com/embed/8pEPhilfwLU',
  '2.1': 'https://www.youtube.com/embed/hSc_nJ4DF50',
  '3.1': 'https://www.youtube.com/embed/PxH38Ma6vBQ',
  '3.4': 'https://www.youtube.com/embed/UGCDt28mSWM',
  '3.5': 'https://www.youtube.com/embed/TAjNGLzHsh8',
  '4.1': 'https://www.youtube.com/embed/_msOo6m5Vl4',
  '5.1': 'https://www.youtube.com/embed/I_0yZqnvmyQ',
}

// Worksheet URLs
const WORKSHEET_URLS: Record<string, string> = {
  '1.1': '/resources/1_1.pdf',
  '1.2': '/resources/1_2.pdf',
  '1.3': '/resources/1_3.pdf',
  '2.1': '/resources/2_1.pdf',
  '2.2': '/resources/2_2.pdf',
  '2.3': '/resources/2_3.pdf',
  '2.4': '/resources/2_4.pdf',
  '3.1': '/resources/3_1.pdf',
  '3.2': '/resources/3_2.pdf',
  '3.3': '/resources/3_3.pdf',
  '3.4': '/resources/3_4.pdf',
  '3.5': '/resources/3_5.pdf',
  '4.1': '/resources/4_1.pdf',
  '4.2': '/resources/4_2.pdf',
  '4.3': '/resources/4_3.pdf',
  '4.4': '/resources/4_4.pdf',
  '4.5': '/resources/4_5.pdf',
  '4.6': '/resources/4_6.pdf',
  '5.1': '/resources/5_1.pdf',
  '5.2': '/resources/5_2.pdf',
  '6.1': '/resources/6_1.pdf',
}

const moduleData: Record<number, {
  title: string
  description: string
  learningTarget: string
  lessons: { id: string; title: string; type: 'video' | 'worksheet' }[]
}> = {
  1: {
    title: 'Financial Basics',
    description: 'Learn about different types of currency, important financial terms, and how to make change.',
    learningTarget: 'I can define basic finance terms and apply them to scenarios and make change.',
    lessons: [
      { id: '1.1', title: 'Important Financial Terms', type: 'video' },
      { id: '1.1', title: 'Matching Terms', type: 'worksheet' },
      { id: '1.2', title: 'Fill in the Blank', type: 'worksheet' },
      { id: '1.3', title: 'Making Change', type: 'video' },
      { id: '1.3', title: 'Identifying Coins + Making Change', type: 'worksheet' },
    ],
  },
  2: {
    title: 'Saving and Spending',
    description: 'Understand healthy saving and spending habits, and learn how to create and follow a budget.',
    learningTarget: 'I can identify and make healthy saving and spending decisions as well as utilize a budget to achieve my financial goals.',
    lessons: [
      { id: '2.1', title: 'Healthy Saving and Spending Habits', type: 'video' },
      { id: '2.1', title: 'Matching Terms', type: 'worksheet' },
      { id: '2.2', title: 'Spending Simulations', type: 'worksheet' },
      { id: '2.3', title: 'Creating a Budget', type: 'worksheet' },
      { id: '2.4', title: 'Budget Simulations', type: 'worksheet' },
    ],
  },
  3: {
    title: 'All Things Banking',
    description: 'Explore credit vs debit, investing basics, stock trends, and how to write a check.',
    learningTarget: 'I can identify the correct stock trends and I understand investments, credit versus debt, as well as deposits.',
    lessons: [
      { id: '3.1', title: 'Credit and Debit', type: 'video' },
      { id: '3.1', title: 'Word Scramble', type: 'worksheet' },
      { id: '3.2', title: 'Word Search', type: 'worksheet' },
      { id: '3.3', title: 'Credit Pros and Cons', type: 'worksheet' },
      { id: '3.4', title: 'Investing', type: 'video' },
      { id: '3.4', title: 'Identifying Stock Trends', type: 'worksheet' },
      { id: '3.5', title: 'Deposits', type: 'video' },
      { id: '3.5', title: 'Writing a Check', type: 'worksheet' },
    ],
  },
  4: {
    title: 'Business',
    description: 'Learn about revenue, expenses, profit, and the basics of starting your own business.',
    learningTarget: 'I can create my own business, identify the characteristics of businesses, calculate the expenses and revenue to find out profit.',
    lessons: [
      { id: '4.1', title: 'Creating Your Own Business', type: 'video' },
      { id: '4.1', title: 'Juice Stand', type: 'worksheet' },
      { id: '4.2', title: 'Business Scenarios', type: 'worksheet' },
      { id: '4.3', title: 'Scarcity + Costs', type: 'worksheet' },
      { id: '4.4', title: 'Business Word Search', type: 'worksheet' },
      { id: '4.5', title: 'Revenue, Expenses, and Profit', type: 'worksheet' },
      { id: '4.6', title: 'Types of Expenses', type: 'worksheet' },
    ],
  },
  5: {
    title: 'Taxes',
    description: 'Understand what taxes are and learn how to calculate them.',
    learningTarget: 'I can explain what taxes are and calculate taxes.',
    lessons: [
      { id: '5.1', title: 'Taxes', type: 'video' },
      { id: '5.2', title: 'What are Taxes?', type: 'worksheet' },
      { id: '5.3', title: 'Calculating Taxes', type: 'worksheet' },
    ],
  },
  6: {
    title: 'Summary & Review',
    description: 'Review everything you have learned and apply your new financial literacy skills.',
    learningTarget: 'I can apply what I have learned throughout all modules.',
    lessons: [
      { id: '6.1', title: 'Review Packet', type: 'worksheet' },
    ],
  },
}

export default function ModulePage() {
  const params = useParams()
  const moduleId = parseInt(params.id as string)
  const currentModule = moduleData[moduleId]
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login?redirect=/course/learn')
      } else {
        setLoading(false)
      }
    }
    checkAuth()
  }, [supabase.auth, router])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-600"></div>
      </div>
    )
  }

  if (!currentModule) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Module not found</h1>
          <Link href="/course/learn" className="btn-primary">
            Back to Course
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-forest-50 via-white to-sage-50">
      <FloatingParticles count={10} />
      
      <div className="container-custom relative">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link 
            href="/course/learn" 
            className="inline-flex items-center gap-2 text-forest-600 hover:text-forest-700 font-medium mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Course Dashboard
          </Link>
        </motion.div>

        {/* Module Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100"
        >
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-600 
                            flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {moduleId}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Module {moduleId}: {currentModule.title}
              </h1>
              <p className="text-gray-600 mb-4">{currentModule.description}</p>
              <div className="bg-forest-50 rounded-xl p-4 border border-forest-100">
                <p className="text-sm font-semibold text-forest-800">
                  🎯 Learning Target: <span className="font-normal">{currentModule.learningTarget}</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lessons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lessons</h2>
          
          <div className="space-y-4">
            {currentModule.lessons.map((lesson, idx) => (
              <motion.div
                key={`${lesson.id}-${lesson.type}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {lesson.type === 'video' ? (
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
                        <Play className="w-5 h-5 text-accent-600" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-accent-600 uppercase">Video</span>
                        <h3 className="font-bold text-gray-900">{lesson.id}: {lesson.title}</h3>
                      </div>
                    </div>
                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                      <iframe 
                        src={VIDEO_URLS[lesson.id]}
                        className="w-full h-full"
                        allowFullScreen
                        title={lesson.title}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-forest-600" />
                        </div>
                        <div>
                          <span className="text-xs font-medium text-forest-600 uppercase">Worksheet</span>
                          <h3 className="font-bold text-gray-900">{lesson.id}: {lesson.title}</h3>
                        </div>
                      </div>
                      <a 
                        href={WORKSHEET_URLS[lesson.id]}
                        download
                        className="flex items-center gap-2 px-4 py-2 bg-forest-50 text-forest-700 
                                   rounded-xl hover:bg-forest-100 transition-colors font-medium text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-between mt-12"
        >
          {moduleId > 1 ? (
            <Link 
              href={`/course/learn/module/${moduleId - 1}`}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm border border-gray-100
                         text-gray-700 hover:border-forest-200 hover:text-forest-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous Module
            </Link>
          ) : (
            <div />
          )}
          
          {moduleId < 6 ? (
            <Link 
              href={`/course/learn/module/${moduleId + 1}`}
              className="flex items-center gap-2 px-6 py-3 bg-forest-600 text-white rounded-xl
                         hover:bg-forest-700 transition-colors font-medium"
            >
              Next Module
              <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link 
              href="/course/learn"
              className="flex items-center gap-2 px-6 py-3 bg-accent-500 text-white rounded-xl
                         hover:bg-accent-600 transition-colors font-medium"
            >
              <CheckCircle2 className="w-5 h-5" />
              Complete Course
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  )
}

