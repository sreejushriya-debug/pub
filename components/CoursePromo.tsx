'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Play, ArrowRight, Gamepad2, BarChart3, 
  MessageCircle, Zap, BookOpen, Award, Brain, Star
} from 'lucide-react'

const features = [
  {
    icon: Gamepad2,
    title: 'Interactive Activities',
    description: '45+ hands-on exercises'
  },
  {
    icon: Brain,
    title: 'AI Tutor',
    description: 'Personalized help anytime'
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'See strengths & gaps'
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    description: 'Learn from mistakes'
  }
]

export default function CoursePromo() {
  return (
    <section className="py-20 bg-gradient-to-br from-forest-700 via-forest-600 to-forest-700 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent-400 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Video */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/30 
                          border-4 border-white/20 bg-gray-900">
              {/* Browser Frame */}
              <div className="bg-gray-800 px-4 py-2.5 flex items-center gap-2 border-b border-gray-700">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <span className="text-gray-400 text-xs ml-2">Course Demo</span>
              </div>
              
              <video
                className="w-full aspect-video object-cover"
                controls
                poster="/home.png"
                preload="metadata"
              >
                <source src="/VIDEO WEBSITE (1).mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-3 -right-3 bg-white rounded-xl shadow-lg px-4 py-2 
                        flex items-center gap-2 border border-gray-100"
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-accent-500 fill-current" />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700">310+ students</span>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 
                          text-white text-sm font-medium mb-4 border border-white/20">
              <Play className="w-4 h-4 text-accent-300" />
              <span>Free Online Course</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
              Financial Foundations:{' '}
              <span className="text-accent-300">The Fun Way to Learn</span>
            </h2>

            <p className="text-lg text-white/80 mb-8">
              Our self-paced course makes money concepts click through interactive activities, 
              AI tutoring, and instant feedback. Perfect for ages 8-14.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 
                           border border-white/10 backdrop-blur-sm"
                >
                  <feature.icon className="w-5 h-5 text-accent-300 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white text-sm">{feature.title}</div>
                    <div className="text-white/60 text-xs">{feature.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats Line */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-white/70 text-sm">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> 6 modules
              </span>
              <span className="flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4" /> 45+ activities
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Certificate
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-accent-500 hover:bg-accent-600 
                           text-white rounded-xl font-bold shadow-lg shadow-accent-500/30 
                           transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Start Free Course
                </motion.button>
              </Link>
              <Link href="/course">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 
                           text-white rounded-xl font-semibold border border-white/20
                           transition-all flex items-center justify-center gap-2"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

