'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  GraduationCap, BookOpen, Gamepad2, CheckCircle2, 
  ArrowRight, Clock, Users, Star, ChevronDown, ChevronUp,
  FileText, Video, Trophy
} from 'lucide-react'
import FloatingParticles from '@/components/FloatingParticles'

const courseModules = [
  {
    id: 1,
    title: 'Financial Basics',
    description: 'Learn about different types of currency, important financial terms, and how to make change.',
    duration: '30 min',
    lessons: 4
  },
  {
    id: 2,
    title: 'Saving and Spending',
    description: 'Understand healthy saving and spending habits, and learn how to create and follow a budget.',
    duration: '35 min',
    lessons: 5
  },
  {
    id: 3,
    title: 'All Things Banking',
    description: 'Explore credit vs debit, investing basics, stock trends, and how to write a check.',
    duration: '40 min',
    lessons: 6
  },
  {
    id: 4,
    title: 'Business',
    description: 'Learn about revenue, expenses, profit, and the basics of starting your own business.',
    duration: '35 min',
    lessons: 7
  },
  {
    id: 5,
    title: 'Taxes',
    description: 'Understand what taxes are and learn how to calculate them.',
    duration: '25 min',
    lessons: 3
  },
  {
    id: 6,
    title: 'Summary & Review',
    description: 'Review everything you\'ve learned and apply your new financial literacy skills.',
    duration: '20 min',
    lessons: 2
  }
]

const features = [
  { 
    icon: Video, 
    title: 'Engaging Videos', 
    description: 'Watch fun, educational videos that explain financial concepts in easy-to-understand ways' 
  },
  { 
    icon: FileText, 
    title: 'Interactive Worksheets', 
    description: 'Practice what you learn with hands-on worksheets and activities' 
  },
  { 
    icon: Gamepad2, 
    title: 'Fun Quizzes', 
    description: 'Test your knowledge with interactive quizzes after each module' 
  },
  { 
    icon: Trophy, 
    title: 'Track Progress', 
    description: 'See how much you\'ve learned with KWL charts that track your journey' 
  }
]

export default function CoursePage() {
  const [email, setEmail] = useState('')
  const [agreeToEmails, setAgreeToEmails] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [expandedModule, setExpandedModule] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && agreeToEmails) {
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setEmail('')
        setAgreeToEmails(false)
      }, 3000)
    }
  }

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero relative overflow-hidden">
        <FloatingParticles count={20} />
        
        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm
                              text-white text-sm font-medium mb-6 border border-white/30">
                <GraduationCap className="w-4 h-4" />
                <span>100% Free Course</span>
              </div>
              
              <h1 className="heading-xl text-white mb-6">
                Financial Foundations Course
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed mb-8">
                Get your students on the path to financial literacy with our free virtual course! 
                Designed for elementary and middle schoolers, this interactive and engaging program 
                teaches key financial concepts in a fun and accessible way.
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-white/90">
                  <Clock className="w-5 h-5" />
                  <span>Self-paced</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <BookOpen className="w-5 h-5" />
                  <span>6 Modules</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Users className="w-5 h-5" />
                  <span>Ages 6-14</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent-300 fill-current" />
                ))}
                <span className="text-white/90 ml-2">Loved by 3,100+ students</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Start Learning Today
                </h3>
                <p className="text-gray-600 mb-6">
                  Sign up to get free access to all course materials.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="course-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="course-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 
                                 focus:outline-none focus:border-forest-400 focus:ring-2 
                                 focus:ring-forest-100 transition-all"
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={agreeToEmails}
                        onChange={(e) => setAgreeToEmails(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center
                        ${agreeToEmails 
                          ? 'bg-forest-600 border-forest-600' 
                          : 'border-gray-300 group-hover:border-gray-400'}`}>
                        {agreeToEmails && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">
                      Yes, I agree to receive emails from you
                    </span>
                  </label>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!agreeToEmails || !email}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>You're signed up!</span>
                      </>
                    ) : (
                      <>
                        <span>Sign up for free!</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="heading-lg text-gray-900 mb-4">
              What's <span className="text-forest-600">Included</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for an engaging financial literacy education experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  className="card text-center h-full"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-600 
                                  flex items-center justify-center mx-auto mb-5 shadow-lg shadow-forest-200">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-20 bg-gradient-section">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="heading-lg text-gray-900 mb-4">
              Course <span className="text-accent-500">Curriculum</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A comprehensive journey through the fundamentals of personal finance.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {courseModules.map((module, idx) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                  className="w-full flex items-center justify-between p-6 text-left 
                             hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center 
                                    justify-center text-forest-700 font-bold">
                      {module.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {module.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {module.duration}
                        </span>
                        <span>{module.lessons} lessons</span>
                      </div>
                    </div>
                  </div>
                  {expandedModule === module.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {expandedModule === module.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-gray-600 ml-16">
                      {module.description}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-forest-600 to-forest-800 relative overflow-hidden">
        <FloatingParticles count={15} />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <GraduationCap className="w-16 h-16 text-accent-300 mx-auto mb-6" />
            <h2 className="heading-lg text-white mb-6">
              Ready to Start Your Financial Journey?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of students who are building their financial literacy 
              skills with our free course.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-primary bg-white text-forest-700 hover:bg-gray-100 gap-2"
            >
              <span>Enroll Now - It's Free!</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
