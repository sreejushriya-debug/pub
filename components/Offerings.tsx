'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Library, GraduationCap, ArrowRight, Sparkles } from 'lucide-react'

const offerings = [
  {
    icon: GraduationCap,
    title: 'Financial Foundations Course',
    description: 'Get your students on the path to financial literacy with our free virtual Financial Foundations course! Designed for elementary and middle schoolers, this interactive and engaging program teaches key financial concepts in a fun and accessible way.',
    link: '/course',
    linkText: 'Start Learning',
    gradient: 'from-forest-600 to-forest-500',
    bgGradient: 'from-forest-50 to-sage-50'
  },
  {
    icon: Library,
    title: 'Resources for Teachers',
    description: 'Elevate your students\' financial literacy with our comprehensive library of resources! Designed specifically for teachers, this library provides tools and materials to easily integrate financial literacy into your curriculum.',
    link: '/resources',
    linkText: 'Explore Resources',
    gradient: 'from-warm-700 to-warm-600',
    bgGradient: 'from-warm-50 to-orange-50'
  },
  {
    icon: BookOpen,
    title: 'Finance BootCamp',
    description: 'Designed for elementary schoolers, this program teaches key financial literacy skills through hands-on activities and real-world scenarios, giving children the foundation they need to make smart money decisions for a bright financial future.',
    link: '/bootcamp',
    linkText: 'Join BootCamp',
    gradient: 'from-sage-600 to-sage-500',
    bgGradient: 'from-sage-50 to-green-50'
  }
]

export default function Offerings() {
  return (
    <section className="section-padding bg-cream relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      
      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 
                          text-forest-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>What We Offer</span>
          </div>
          <h2 className="heading-lg text-forest-900 mb-4">
            Everyone deserves access to <br className="hidden md:block" />
            <span className="text-gradient">financial education</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Here are the steps we're taking to make that dream a reality.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {offerings.map((offering, idx) => (
            <motion.div
              key={offering.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group relative h-full"
              >
                {/* Card glow effect on hover */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${offering.gradient} 
                                rounded-[28px] opacity-0 group-hover:opacity-20 blur-xl 
                                transition-opacity duration-500`} />
                
                <div className={`relative card h-full bg-gradient-to-br ${offering.bgGradient} 
                                border-0 group-hover:shadow-2xl transition-all duration-500`}>
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${offering.gradient} 
                                  flex items-center justify-center mb-6 shadow-lg
                                  group-hover:scale-110 transition-transform duration-300`}>
                    <offering.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="heading-md text-forest-900 mb-4 group-hover:text-forest-800">
                    {offering.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    {offering.description}
                  </p>
                  
                  {/* Link */}
                  <Link 
                    href={offering.link}
                    className="inline-flex items-center gap-2 text-forest-700 font-semibold
                               group-hover:gap-3 transition-all duration-300"
                  >
                    <span>{offering.linkText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

