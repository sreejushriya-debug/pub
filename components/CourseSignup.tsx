'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, BookOpen, Gamepad2, Award, Sparkles } from 'lucide-react'

const features = [
  { icon: BookOpen, text: 'Interactive lessons on budgeting, saving, and investing' },
  { icon: Gamepad2, text: 'Fun games and activities to reinforce learning' },
  { icon: Award, text: 'Self-paced curriculum designed for all skill levels' },
]

export default function CourseSignup() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [agreeToEmails, setAgreeToEmails] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && agreeToEmails) {
      // Here you would integrate with your email service
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        setEmail('')
        setAgreeToEmails(false)
      }, 3000)
    }
  }

  return (
    <section className="section-padding bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full 
                     border border-forest-700/30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full 
                     border border-sage-500/20"
        />
        <div className="absolute top-1/4 left-[10%] w-4 h-4 rounded-full bg-warm-400/60 blur-sm" />
        <div className="absolute top-1/3 right-[20%] w-3 h-3 rounded-full bg-sage-400/60 blur-sm" />
        <div className="absolute bottom-1/4 left-[30%] w-5 h-5 rounded-full bg-forest-400/60 blur-sm" />
      </div>

      <div className="container-custom relative">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                              bg-forest-700/50 text-sage-300 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>100% Free Course</span>
              </div>
              
              <h2 className="heading-lg text-white mb-6">
                Sign up for our free{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-300 to-sage-400">
                  financial course!
                </span>
              </h2>
              
              <p className="text-lg text-forest-200 mb-8 leading-relaxed">
                If you're looking to gain a solid understanding of personal finance, this is the course 
                for you! This self-paced course is designed to help elementary schoolers master the 
                basics of budgeting, saving, and investing.
              </p>

              <ul className="space-y-4">
                {features.map((feature, idx) => (
                  <motion.li
                    key={feature.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-forest-700/50 flex items-center 
                                    justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-sage-400" />
                    </div>
                    <span className="text-forest-100 pt-2">{feature.text}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Signup Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-forest-100 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 
                                 text-white placeholder-forest-300 focus:outline-none 
                                 focus:border-sage-400 focus:ring-2 focus:ring-sage-400/20
                                 transition-all"
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
                      <div className={`w-5 h-5 rounded border-2 transition-colors
                        ${agreeToEmails 
                          ? 'bg-sage-500 border-sage-500' 
                          : 'border-forest-400 group-hover:border-forest-300'}`}>
                        {agreeToEmails && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-forest-200">
                      Yes, I agree to receive emails from you
                    </span>
                  </label>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!agreeToEmails || !email}
                    className="w-full py-4 px-8 rounded-xl font-semibold text-forest-900 
                               bg-gradient-to-r from-sage-300 to-sage-400 
                               hover:from-sage-200 hover:to-sage-300
                               disabled:opacity-50 disabled:cursor-not-allowed
                               shadow-lg shadow-sage-500/20 hover:shadow-xl
                               transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>You're signed up!</span>
                      </>
                    ) : (
                      <>
                        <span>Sign up!</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

