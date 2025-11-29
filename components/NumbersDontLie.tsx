'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'

const outcomes = [
  {
    value: 100,
    suffix: '%',
    description: 'of students felt more financially confident after our lesson'
  },
  {
    value: 89,
    suffix: '%',
    description: 'improvement between before and after our lesson'
  },
  {
    value: 95,
    suffix: '%',
    description: 'of teachers were satisfied with our library of resources'
  }
]

export default function NumbersDontLie() {
  return (
    <section className="py-20 bg-gradient-section">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-lg text-gray-900 mb-2">
            Numbers Don't Lie
          </h2>
          <div className="w-16 h-1 bg-accent-500 mx-auto mb-4 rounded-full" />
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Our programs deliver measurable results that make a real difference
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          {outcomes.map((outcome, idx) => (
            <motion.div
              key={outcome.description}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="card-hover h-full text-center bg-white group"
              >
                <div className="text-5xl md:text-6xl font-bold text-forest-500 mb-4 card-number 
                                transition-colors duration-300">
                  <AnimatedCounter 
                    value={outcome.value} 
                    suffix={outcome.suffix}
                    duration={2000}
                  />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed card-text transition-colors duration-300">
                  {outcome.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Link 
            href="/impact" 
            className="btn-primary gap-2 group"
          >
            <span>Check Out Our Impact</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

