'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Rocket, Calendar, Users, CheckCircle2, ArrowRight, 
  Lightbulb, Target, PiggyBank, Monitor, Wifi, Star
} from 'lucide-react'
import FloatingParticles from '@/components/FloatingParticles'

const bootcampHighlights = [
  {
    icon: Monitor,
    title: '100% Virtual',
    description: 'Join from anywhere! Our BootCamp is completely online, making it accessible to students everywhere.'
  },
  {
    icon: Lightbulb,
    title: 'Hands-On Learning',
    description: 'Interactive virtual activities that make financial concepts tangible and fun.'
  },
  {
    icon: Target,
    title: 'Real-World Scenarios',
    description: 'Practice making financial decisions with realistic online simulations.'
  },
  {
    icon: PiggyBank,
    title: 'Savings Challenges',
    description: 'Participate in fun virtual challenges to build healthy savings habits.'
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
      <section className="py-24 bg-gradient-hero relative overflow-hidden">
        <FloatingParticles count={20} />
        
        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Virtual Badge - Prominent */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500
                                text-white text-sm font-bold">
                  <Wifi className="w-4 h-4" />
                  <span>100% VIRTUAL</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm
                                text-white text-sm font-medium border border-white/30">
                  <Rocket className="w-4 h-4" />
                  <span>For Elementary Schoolers</span>
                </div>
              </div>
              
              <h1 className="heading-xl text-white mb-6">
                Virtual Finance BootCamp
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed mb-6">
                <strong>Join from anywhere!</strong> Our completely <strong>virtual</strong> BootCamp is designed 
                for elementary schoolers, teaching key financial literacy skills through online hands-on 
                activities and real-world scenarios.
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-8 border border-white/20">
                <div className="flex items-center gap-3">
                  <Monitor className="w-8 h-8 text-accent-300" />
                  <div>
                    <p className="text-white font-semibold">Online Learning Experience</p>
                    <p className="text-white/70 text-sm">No travel required - learn from the comfort of home!</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-white/90">
                  <Calendar className="w-5 h-5" />
                  <span>6-Week Program</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Users className="w-5 h-5" />
                  <span>Ages 5-10</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Wifi className="w-5 h-5" />
                  <span>Live Online Sessions</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-accent-300 fill-current" />
                ))}
                <span className="text-white/90 ml-2">Loved by parents and kids alike!</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Wifi className="w-5 h-5 text-accent-500" />
                  <span className="text-accent-600 font-semibold text-sm">Virtual Program</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Register for Virtual BootCamp
                </h3>
                <p className="text-gray-600 mb-6">
                  Sign up your child for our next online Finance BootCamp session.
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
                                 focus:outline-none focus:border-forest-400 focus:ring-2 
                                 focus:ring-forest-100 transition-all"
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
                                 focus:outline-none focus:border-forest-400 focus:ring-2 
                                 focus:ring-forest-100 transition-all"
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
                                   focus:outline-none focus:border-forest-400 focus:ring-2 
                                   focus:ring-forest-100 transition-all"
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
                                   focus:outline-none focus:border-forest-400 focus:ring-2 
                                   focus:ring-forest-100 transition-all"
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
                          ? 'bg-forest-600 border-forest-600' 
                          : 'border-gray-300 group-hover:border-gray-400'}`}>
                        {formData.agreeToEmails && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">
                      Yes, I agree to receive emails about the Virtual BootCamp program
                    </span>
                  </label>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!formData.agreeToEmails || !formData.email || !formData.parentName}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
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
              Why <span className="text-accent-500">Virtual BootCamp?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our online BootCamp is designed to make financial learning engaging, accessible, and memorable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bootcampHighlights.map((highlight, idx) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  className="card text-center h-full"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 
                                  flex items-center justify-center mx-auto mb-5 shadow-lg shadow-accent-200">
                    <highlight.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {highlight.description}
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
              6-Week <span className="text-forest-600">Virtual Curriculum</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A structured online program that builds financial knowledge week by week.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {curriculum.map((week, idx) => (
              <motion.div
                key={week.week}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex gap-4"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-forest-100 to-forest-200 
                                  flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-forest-700">{week.week}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      {week.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {week.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-accent-500 to-accent-600 relative overflow-hidden">
        <FloatingParticles count={15} />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Monitor className="w-16 h-16 text-white/90 mx-auto mb-6" />
            <h2 className="heading-lg text-white mb-6">
              Give Your Child a Head Start - From Home!
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Our virtual program means no commute, flexible scheduling, and quality financial education 
              from the comfort of your home. Register today!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-primary bg-white text-accent-700 hover:bg-gray-100 gap-2"
            >
              <span>Register for Virtual BootCamp</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
