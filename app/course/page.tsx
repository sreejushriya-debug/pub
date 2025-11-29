'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  GraduationCap, BookOpen, Gamepad2, Award, CheckCircle2, 
  ArrowRight, Play, Clock, Users, Star, ChevronDown, ChevronUp
} from 'lucide-react'
import FadeIn from '@/components/FadeIn'

const courseModules = [
  {
    id: 1,
    title: 'Introduction to Money',
    description: 'Learn about different types of currency and the history of money.',
    duration: '20 min',
    lessons: 3
  },
  {
    id: 2,
    title: 'Needs vs Wants',
    description: 'Understand the difference between things we need and things we want.',
    duration: '25 min',
    lessons: 4
  },
  {
    id: 3,
    title: 'Saving Basics',
    description: 'Discover why saving money is important and how to start a savings habit.',
    duration: '30 min',
    lessons: 5
  },
  {
    id: 4,
    title: 'Budgeting for Kids',
    description: 'Learn how to plan your spending and create a simple budget.',
    duration: '35 min',
    lessons: 4
  },
  {
    id: 5,
    title: 'Earning Money',
    description: 'Explore different ways to earn money through jobs, chores, and entrepreneurship.',
    duration: '25 min',
    lessons: 4
  },
  {
    id: 6,
    title: 'Smart Spending',
    description: 'Make better decisions about how and when to spend your money.',
    duration: '30 min',
    lessons: 5
  },
  {
    id: 7,
    title: 'Introduction to Investing',
    description: 'Learn the basics of how money can grow over time.',
    duration: '25 min',
    lessons: 3
  },
  {
    id: 8,
    title: 'Financial Goals',
    description: 'Set and work towards your own financial goals.',
    duration: '20 min',
    lessons: 3
  }
]

const features = [
  { icon: Play, title: 'Interactive Lessons', description: 'Engaging video content designed for young learners' },
  { icon: Gamepad2, title: 'Fun Games', description: 'Reinforce learning through play with educational games' },
  { icon: BookOpen, title: 'Worksheets', description: 'Downloadable activities to practice new skills' },
  { icon: Award, title: 'Certificates', description: 'Earn certificates upon completing each module' }
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
      <section className="section-padding bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        
        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 
                              text-forest-700 text-sm font-medium mb-6">
                <GraduationCap className="w-4 h-4" />
                <span>100% Free Course</span>
              </div>
              
              <h1 className="heading-xl text-forest-900 mb-6">
                Financial{' '}
                <span className="text-gradient">Foundations</span>
                <br />Course
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Get your students on the path to financial literacy with our free virtual 
                course! Designed for elementary and middle schoolers, this interactive and 
                engaging program teaches key financial concepts in a fun and accessible way.
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-forest-600" />
                  <span className="text-gray-600">Self-paced</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-forest-600" />
                  <span className="text-gray-600">8 Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-forest-600" />
                  <span className="text-gray-600">Ages 6-12</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-warm-500 fill-current" />
                ))}
                <span className="text-gray-600 ml-2">Loved by 29,000+ students</span>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.2}>
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <h3 className="text-2xl font-display font-bold text-forest-800 mb-2">
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
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <FadeIn className="text-center mb-16">
            <h2 className="heading-lg text-forest-900 mb-4">
              What's <span className="text-gradient">Included</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for an engaging financial literacy education experience.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <FadeIn key={feature.title} delay={idx * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="card text-center h-full"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-600 to-forest-500 
                                  flex items-center justify-center mx-auto mb-6 shadow-lg shadow-forest-200">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-forest-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <FadeIn className="text-center mb-16">
            <h2 className="heading-lg text-forest-900 mb-4">
              Course <span className="text-gradient-warm">Curriculum</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A comprehensive journey through the fundamentals of personal finance.
            </p>
          </FadeIn>

          <div className="max-w-3xl mx-auto space-y-4">
            {courseModules.map((module, idx) => (
              <FadeIn key={module.id} delay={idx * 0.05}>
                <motion.div
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
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
                        <h3 className="font-display font-bold text-forest-800">
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
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-forest-800 to-forest-900">
        <div className="container-custom">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <GraduationCap className="w-16 h-16 text-sage-400 mx-auto mb-6" />
            <h2 className="heading-lg text-white mb-6">
              Ready to Start Your Financial Journey?
            </h2>
            <p className="text-xl text-forest-200 mb-8">
              Join thousands of students who are building their financial literacy 
              skills with our free course.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-primary bg-white text-forest-800 hover:bg-gray-100 gap-2"
            >
              <span>Enroll Now - It's Free!</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

