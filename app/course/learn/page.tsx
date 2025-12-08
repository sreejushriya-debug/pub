'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  BookOpen, Play, Clock, ChevronRight, Trophy, Gamepad2, Brain, Sparkles, Coins
} from 'lucide-react'

const courseModules = [
  {
    id: 1,
    title: 'Financial Basics',
    description: 'Learn about different types of currency, important financial terms, and how to make change.',
    activities: 10,
    videos: 2,
    duration: '30 min',
  },
  {
    id: 2,
    title: 'Saving and Spending',
    description: 'Understand healthy saving and spending habits, and learn how to create and follow a budget.',
    activities: 8,
    videos: 1,
    duration: '35 min',
  },
  {
    id: 3,
    title: 'All Things Banking',
    description: 'Explore credit vs debit, investing basics, stock trends, and how to write a check.',
    activities: 10,
    videos: 3,
    duration: '40 min',
  },
  {
    id: 4,
    title: 'Business',
    description: 'Learn about revenue, expenses, profit, and the basics of starting your own business.',
    activities: 15,
    videos: 1,
    duration: '45 min',
  },
  {
    id: 5,
    title: 'Taxes',
    description: 'Understand what taxes are and learn how to calculate them, including discounts and finding the best deals.',
    activities: 10,
    videos: 1,
    duration: '40 min',
  },
  {
    id: 6,
    title: 'Summary & Review',
    description: 'Review everything you have learned and apply your new financial literacy skills through simulations, scenarios, and a final quiz.',
    activities: 13,
    videos: 0,
    duration: '60 min',
  },
]

export default function CourseDashboard() {
  const { user } = useUser()

  return (
    <div className="min-h-screen pt-28 pb-12 bg-gradient-to-br from-forest-50 via-white to-sage-50">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName || 'Student'}! 👋
            </h1>
            <p className="text-gray-600">Continue your financial literacy journey</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <UserButton afterSignOutUrl="/" />
              <span className="text-sm text-gray-600">{user?.emailAddresses[0]?.emailAddress}</span>
            </div>
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
                <Gamepad2 className="w-6 h-6 text-accent-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">45+</p>
                <p className="text-sm text-gray-500">Interactive Activities</p>
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

        {/* Practice Hub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mb-12"
        >
          <Link href="/course/learn/practice">
            <div className="bg-gradient-to-r from-forest-600 to-forest-700 rounded-2xl p-6 text-white 
                          hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center 
                                group-hover:scale-110 transition-transform">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold">My Learning Hub</h3>
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                    </div>
                    <p className="text-white/80">
                      Track your progress, see what you&apos;re good at, and practice where you need help with Bright!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white text-forest-700 px-5 py-2.5 rounded-xl 
                              font-semibold group-hover:bg-gray-100 transition-colors">
                  Open Hub
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Money Adventure CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="mb-12"
        >
          <Link href="/course/learn/adventure">
            <div className="bg-gradient-to-r from-accent-500 to-orange-500 rounded-2xl p-6 text-white 
                          hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center 
                                group-hover:scale-110 transition-transform">
                    <Coins className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold">Money Adventure</h3>
                      <span className="px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">GAME</span>
                    </div>
                    <p className="text-white/80">
                      Play through life scenarios, make money choices, and see how decisions affect your finances!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white text-orange-700 px-5 py-2.5 rounded-xl 
                              font-semibold group-hover:bg-gray-100 transition-colors">
                  Play Now
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
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
                              <Play className="w-3 h-3" /> {module.videos} videos
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Gamepad2 className="w-3 h-3" /> {module.activities} activities
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
