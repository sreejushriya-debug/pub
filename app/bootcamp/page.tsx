'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Rocket, Calendar, Users, CheckCircle2, ArrowRight, 
  Lightbulb, Target, Coins, PiggyBank, Calculator, Star
} from 'lucide-react'
import FadeIn from '@/components/FadeIn'

const bootcampHighlights = [
  {
    icon: Lightbulb,
    title: 'Hands-On Learning',
    description: 'Interactive activities that make financial concepts tangible and fun.'
  },
  {
    icon: Target,
    title: 'Real-World Scenarios',
    description: 'Practice making financial decisions with realistic situations.'
  },
  {
    icon: Coins,
    title: 'Money Management',
    description: 'Learn the fundamentals of earning, saving, and spending wisely.'
  },
  {
    icon: PiggyBank,
    title: 'Savings Challenges',
    description: 'Participate in fun challenges to build healthy savings habits.'
  }
]

const curriculum = [
  { week: 1, title: 'Money Basics', description: 'Understanding different types of currency and their values' },
  { week: 2, title: 'Earning & Income', description: 'Exploring ways to earn money and the value of work' },
  { week: 3, title: 'Smart Saving', description: 'Building savings habits and setting financial goals' },
  { week: 4, title: 'Wise Spending', description: 'Making smart choices about how to spend money' },
  { week: 5, title: 'Budgeting Basics', description: 'Creating and following a simple budget' },
  { week: 6, title: 'Financial Goals', description: 'Setting and achieving short and long-term goals' }
]

export default function BootcampPage() {
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    childName: '',
    childAge: '',
    agreeToEmails: false
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.email && formData.parentName && formData.agreeToEmails) {
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          parentName: '',
          email: '',
          childName: '',
          childAge: '',
          agreeToEmails: false
        })
      }, 3000)
    }
  }

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-warm-50 via-cream to-sage-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        
        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warm-100 
                              text-warm-700 text-sm font-medium mb-6">
                <Rocket className="w-4 h-4" />
                <span>For Elementary Schoolers</span>
              </div>
              
              <h1 className="heading-xl text-forest-900 mb-6">
                Finance{' '}
                <span className="text-gradient-warm">BootCamp</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Designed for elementary schoolers, this program teaches key financial literacy 
                skills through hands-on activities and real-world scenarios, giving children 
                the foundation they need to make smart money decisions for a bright financial future.
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-warm-600" />
                  <span className="text-gray-600">6-Week Program</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-warm-600" />
                  <span className="text-gray-600">Ages 5-10</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-warm-600" />
                  <span className="text-gray-600">Hands-On Activities</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-warm-500 fill-current" />
                ))}
                <span className="text-gray-600 ml-2">Loved by parents and kids alike!</span>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.2}>
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <h3 className="text-2xl font-display font-bold text-forest-800 mb-2">
                  Register for BootCamp
                </h3>
                <p className="text-gray-600 mb-6">
                  Sign up your child for our next Finance BootCamp session.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="parent-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Parent/Guardian Name
                    </label>
                    <input
                      type="text"
                      id="parent-name"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      placeholder="Your name"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 
                                 focus:outline-none focus:border-warm-400 focus:ring-2 
                                 focus:ring-warm-100 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="bootcamp-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="bootcamp-email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Your email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 
                                 focus:outline-none focus:border-warm-400 focus:ring-2 
                                 focus:ring-warm-100 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="child-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Child's Name
                      </label>
                      <input
                        type="text"
                        id="child-name"
                        value={formData.childName}
                        onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                        placeholder="Child's name"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 
                                   focus:outline-none focus:border-warm-400 focus:ring-2 
                                   focus:ring-warm-100 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="child-age" className="block text-sm font-medium text-gray-700 mb-2">
                        Child's Age
                      </label>
                      <select
                        id="child-age"
                        value={formData.childAge}
                        onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 
                                   focus:outline-none focus:border-warm-400 focus:ring-2 
                                   focus:ring-warm-100 transition-all"
                      >
                        <option value="">Select age</option>
                        {[5, 6, 7, 8, 9, 10].map(age => (
                          <option key={age} value={age}>{age} years</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input
                        type="checkbox"
                        checked={formData.agreeToEmails}
                        onChange={(e) => setFormData({ ...formData, agreeToEmails: e.target.checked })}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center
                        ${formData.agreeToEmails 
                          ? 'bg-warm-600 border-warm-600' 
                          : 'border-gray-300 group-hover:border-gray-400'}`}>
                        {formData.agreeToEmails && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">
                      Yes, I agree to receive emails about the BootCamp program
                    </span>
                  </label>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!formData.agreeToEmails || !formData.email || !formData.parentName}
                    className="w-full btn-warm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Registration Complete!</span>
                      </>
                    ) : (
                      <>
                        <span>Register Now</span>
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

      {/* Highlights Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <FadeIn className="text-center mb-16">
            <h2 className="heading-lg text-forest-900 mb-4">
              Why <span className="text-gradient-warm">BootCamp?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our BootCamp is designed to make financial learning engaging and memorable.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bootcampHighlights.map((highlight, idx) => (
              <FadeIn key={highlight.title} delay={idx * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="card text-center h-full"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-warm-600 to-warm-500 
                                  flex items-center justify-center mx-auto mb-6 shadow-lg shadow-warm-200">
                    <highlight.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-forest-800 mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {highlight.description}
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
              6-Week <span className="text-gradient">Curriculum</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A structured program that builds financial knowledge week by week.
            </p>
          </FadeIn>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {curriculum.map((week, idx) => (
              <FadeIn key={week.week} delay={idx * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex gap-4"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-warm-100 to-warm-200 
                                  flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-warm-700">{week.week}</span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-forest-800 mb-1">
                      {week.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {week.description}
                    </p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-warm-700 to-warm-800">
        <div className="container-custom">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <Rocket className="w-16 h-16 text-warm-200 mx-auto mb-6" />
            <h2 className="heading-lg text-white mb-6">
              Give Your Child a Head Start
            </h2>
            <p className="text-xl text-warm-100 mb-8">
              Early financial education sets the foundation for a lifetime of smart 
              money decisions. Register today!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-primary bg-white text-warm-800 hover:bg-gray-100 gap-2"
            >
              <span>Register for BootCamp</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

