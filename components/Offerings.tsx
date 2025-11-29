'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Library, GraduationCap, ArrowRight } from 'lucide-react'

const offerings = [
  {
    icon: GraduationCap,
    title: 'Financial Foundations Course',
    description: 'Get your students on the path to financial literacy with our free virtual Financial Foundations course! Designed for elementary and middle schoolers, this interactive and engaging program teaches key financial concepts in a fun and accessible way.',
    link: '/course',
    linkText: 'Start Learning',
  },
  {
    icon: Library,
    title: 'Resources for Teachers',
    description: 'Elevate your students\' financial literacy with our comprehensive library of resources! Designed specifically for teachers, this library provides tools and materials to easily integrate financial literacy into your curriculum.',
    link: '/resources',
    linkText: 'Explore Resources',
  },
  {
    icon: BookOpen,
    title: 'Virtual Finance BootCamp',
    description: 'Our virtual BootCamp is designed for elementary schoolers, teaching key financial literacy skills through hands-on activities and real-world scenarios online, giving children the foundation they need to make smart money decisions.',
    link: '/bootcamp',
    linkText: 'Join Virtual BootCamp',
  }
]

export default function Offerings() {
  return (
    <section className="py-20 bg-gradient-section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg text-gray-900 mb-4">
            What We <span className="text-forest-600">Offer</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everyone deserves access to financial education. Here are the steps we're taking to make that dream a reality.
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
                <div className="card h-full bg-white group-hover:shadow-2xl group-hover:shadow-forest-200/50 
                                transition-all duration-500">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-600 
                                  flex items-center justify-center mb-6 shadow-lg shadow-forest-200
                                  group-hover:scale-110 transition-transform duration-300">
                    <offering.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-forest-700 transition-colors">
                    {offering.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {offering.description}
                  </p>
                  
                  {/* Link */}
                  <Link 
                    href={offering.link}
                    className="inline-flex items-center gap-2 text-accent-600 font-semibold
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
