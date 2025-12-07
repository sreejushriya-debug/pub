'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  BookOpen, Play, CheckCircle2, Lock, LogOut, User, 
  GraduationCap, Trophy, Clock, ChevronRight 
} from 'lucide-react'
import FloatingParticles from '@/components/FloatingParticles'

interface UserData {
  email: string
  full_name?: string
}

const courseModules = [
  {
    id: 1,
    title: 'Financial Basics',
    description: 'Learn about different types of currency, important financial terms, and how to make change.',
    lessons: [
      { id: '1.1', title: 'Important Financial Terms', type: 'video' },
      { id: '1.2', title: 'Matching Terms', type: 'worksheet' },
      { id: '1.3', title: 'Making Change', type: 'video' },
    ],
    duration: '30 min',
  },
  {
    id: 2,
    title: 'Saving and Spending',
    description: 'Understand healthy saving and spending habits, and learn how to create and follow a budget.',
    lessons: [
      { id: '2.1', title: 'Healthy Saving and Spending Habits', type: 'video' },
      { id: '2.2', title: 'Spending Simulations', type: 'worksheet' },
      { id: '2.3', title: 'Creating a Budget', type: 'worksheet' },
    ],
    duration: '35 min',
  },
  {
    id: 3,
    title: 'All Things Banking',
    description: 'Explore credit vs debit, investing basics, stock trends, and how to write a check.',
    lessons: [
      { id: '3.1', title: 'Credit and Debit', type: 'video' },
      { id: '3.4', title: 'Investing', type: 'video' },
      { id: '3.5', title: 'Deposits', type: 'video' },
    ],
    duration: '40 min',
  },
  {
    id: 4,
    title: 'Business',
    description: 'Learn about revenue, expenses, profit, and the basics of starting your own business.',
    lessons: [
      { id: '4.1', title: 'Creating Your Own Business', type: 'video' },
      { id: '4.2', title: 'Business Scenarios', type: 'worksheet' },
      { id: '4.5', title: 'Revenue, Expenses, and Profit', type: 'worksheet' },
    ],
    duration: '35 min',
  },
  {
    id: 5,
    title: 'Taxes',
    description: 'Understand what taxes are and learn how to calculate them.',
    lessons: [
      { id: '5.1', title: 'Taxes', type: 'video' },
      { id: '5.2', title: 'What are Taxes?', type: 'worksheet' },
      { id: '5.3', title: 'Calculating Taxes', type: 'worksheet' },
    ],
    duration: '25 min',
  },
  {
    id: 6,
    title: 'Summary & Review',
    description: 'Review everything you have learned and apply your new financial literacy skills.',
    lessons: [
      { id: '6.1', title: 'Review Packet', type: 'worksheet' },
    ],
    duration: '20 min',
  },
]

function CourseDashboardContent() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      if (!supabase) return
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser({
          email: user.email || '',
          full_name: user.user_metadata?.full_name,
        })
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-forest-50 via-white to-sage-50">
      <FloatingParticles count={15} />
      
      <div className="container-custom relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-gray-600">Continue your financial literacy journey</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 
                         text-gray-600 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </motion.div>
        </div>

        {/* Progress Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-forest-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">6</p>
                <p className="text-sm text-gray-500">Modules Available</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">~3 hours</p>
                <p className="text-sm text-gray-500">Total Course Time</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Certificate</p>
                <p className="text-sm text-gray-500">Upon Completion</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Course Modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Modules</h2>
          
          <div className="space-y-4">
            {courseModules.map((module, idx) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
              >
                <Link href={`/course/learn/module/${module.id}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                                  hover:shadow-md hover:border-forest-200 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 
                                        flex items-center justify-center text-white font-bold text-xl
                                        group-hover:scale-105 transition-transform">
                          {module.id}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-forest-600 transition-colors">
                            {module.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Play className="w-3 h-3" /> {module.lessons.filter(l => l.type === 'video').length} videos
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <BookOpen className="w-3 h-3" /> {module.lessons.filter(l => l.type === 'worksheet').length} worksheets
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" /> {module.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-forest-500 
                                               group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Back to Resources */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link 
            href="/resources" 
            className="text-forest-600 hover:text-forest-700 font-medium inline-flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            View Full Resource Library
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function CourseDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-600"></div></div>}>
      <CourseDashboardContent />
    </Suspense>
  )
}

