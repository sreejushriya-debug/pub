'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, Sparkles, BookOpen, Users, Globe } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating shapes */}
        <motion.div
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[10%] w-32 h-32 rounded-full bg-forest-200/30 blur-2xl"
        />
        <motion.div
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-[15%] w-40 h-40 rounded-full bg-warm-200/40 blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            x: [0, 20, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-[20%] w-48 h-48 rounded-full bg-sage-200/30 blur-3xl"
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        
        {/* Floating icons */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-[20%] right-[25%] hidden lg:block"
        >
          <div className="w-16 h-16 rounded-2xl bg-white shadow-xl shadow-forest-100 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-forest-600" />
          </div>
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          className="absolute top-[40%] left-[8%] hidden lg:block"
        >
          <div className="w-14 h-14 rounded-2xl bg-white shadow-xl shadow-warm-100 flex items-center justify-center">
            <Users className="w-7 h-7 text-warm-700" />
          </div>
        </motion.div>
        
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[30%] right-[12%] hidden lg:block"
        >
          <div className="w-12 h-12 rounded-xl bg-white shadow-xl shadow-sage-100 flex items-center justify-center">
            <Globe className="w-6 h-6 text-sage-600" />
          </div>
        </motion.div>
      </div>

      <div className="relative container-custom pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 
                       text-forest-700 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Empowering the next generation through financial literacy</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="heading-xl mb-6"
          >
            <span className="text-forest-900">Building </span>
            <span className="text-gradient">Bright Financial</span>
            <br />
            <span className="text-gradient-warm">Futures</span>
            <span className="text-forest-900"> for All</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto text-balance leading-relaxed"
          >
            Our mission is to provide foundational tools that educate students on the importance 
            of financial education and make financial literacy accessible to all.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/course" className="btn-primary gap-2 group">
              <span>Start Learning Free</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/about" className="btn-secondary gap-2 group">
              <Play className="w-4 h-4" />
              <span>Learn About Us</span>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 pt-10 border-t border-gray-200"
          >
            <p className="text-sm text-gray-500 mb-6">Trusted by educators and students worldwide</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-forest-700">29k+</div>
                <div className="text-sm text-gray-500">Students Reached</div>
              </div>
              <div className="w-px h-12 bg-gray-200 hidden md:block" />
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-forest-700">4</div>
                <div className="text-sm text-gray-500">Countries</div>
              </div>
              <div className="w-px h-12 bg-gray-200 hidden md:block" />
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-warm-700">$13.5k+</div>
                <div className="text-sm text-gray-500">Raised</div>
              </div>
              <div className="w-px h-12 bg-gray-200 hidden md:block" />
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-display font-bold text-forest-700">140+</div>
                <div className="text-sm text-gray-500">Free Resources</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}

