'use client'

import { motion } from 'framer-motion'
import AnimatedCounter from './AnimatedCounter'
import { TrendingUp, Users, Globe, FileText } from 'lucide-react'

const stats = [
  {
    value: 13500,
    prefix: '$',
    suffix: '+',
    label: 'Raised to advance children\'s financial literacy globally',
    icon: TrendingUp,
    color: 'warm'
  },
  {
    value: 29000,
    suffix: '+',
    label: 'Students received free and comprehensive financial literacy education',
    icon: Users,
    color: 'forest'
  },
  {
    value: 4,
    label: 'Countries reached with our paper workbooks and picture books',
    icon: Globe,
    color: 'sage'
  },
  {
    value: 140,
    suffix: '+',
    label: 'Pages of free resources published in our Resource Library',
    icon: FileText,
    color: 'forest'
  }
]

const colorClasses = {
  warm: {
    bg: 'bg-warm-100',
    icon: 'text-warm-700',
    number: 'text-warm-800'
  },
  forest: {
    bg: 'bg-forest-100',
    icon: 'text-forest-700',
    number: 'text-forest-800'
  },
  sage: {
    bg: 'bg-sage-100',
    icon: 'text-sage-700',
    number: 'text-sage-800'
  }
}

export default function Stats() {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-forest-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-warm-100/50 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-lg text-forest-900 mb-4">
            By the <span className="text-gradient">Numbers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our impact speaks for itself. Here's what we've achieved together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="card text-center h-full"
              >
                <div className={`w-16 h-16 rounded-2xl ${colorClasses[stat.color as keyof typeof colorClasses].bg} 
                                flex items-center justify-center mx-auto mb-6`}>
                  <stat.icon className={`w-8 h-8 ${colorClasses[stat.color as keyof typeof colorClasses].icon}`} />
                </div>
                <div className={`text-4xl md:text-5xl font-display font-bold mb-4 
                                ${colorClasses[stat.color as keyof typeof colorClasses].number}`}>
                  <AnimatedCounter 
                    value={stat.value} 
                    prefix={stat.prefix} 
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-gray-600 leading-relaxed">{stat.label}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

