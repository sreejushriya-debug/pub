'use client'

import { motion } from 'framer-motion'
import AnimatedCounter from './AnimatedCounter'
import { DollarSign, Users, Globe, FileText } from 'lucide-react'

const stats = [
  {
    value: 11500,
    prefix: '$',
    suffix: '+',
    label: 'Raised to advance children\'s financial literacy globally',
    icon: DollarSign,
  },
  {
    value: 29000,
    suffix: '+',
    label: 'Students received free and comprehensive financial literacy education',
    icon: Users,
  },
  {
    value: 5,
    label: 'Countries reached: India, Tanzania, Uganda, Botswana, and the US',
    icon: Globe,
  },
  {
    value: 140,
    suffix: '+',
    label: 'Pages of free resources published in our Resource Library',
    icon: FileText,
  }
]

export default function Stats() {
  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="card-hover h-full text-center group bg-gray-50/50"
              >
                <div className="w-14 h-14 rounded-2xl bg-forest-600 
                                flex items-center justify-center mx-auto mb-5">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-forest-700 mb-3 card-number 
                                transition-colors duration-300">
                  <AnimatedCounter 
                    value={stat.value} 
                    prefix={stat.prefix} 
                    suffix={stat.suffix}
                    duration={2000}
                  />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed card-text transition-colors duration-300">
                  {stat.label}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
