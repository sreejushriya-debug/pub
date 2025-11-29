'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Globe, BookOpen, Award, Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import FadeIn from '@/components/FadeIn'
import AnimatedCounter from '@/components/AnimatedCounter'

const impactStats = [
  {
    value: 13500,
    prefix: '$',
    suffix: '+',
    label: 'Raised',
    description: 'To advance children\'s financial literacy globally',
    icon: TrendingUp,
    color: 'warm'
  },
  {
    value: 29000,
    suffix: '+',
    label: 'Students',
    description: 'Received free financial literacy education',
    icon: Users,
    color: 'forest'
  },
  {
    value: 4,
    label: 'Countries',
    description: 'Reached with our resources and materials',
    icon: Globe,
    color: 'sage'
  },
  {
    value: 140,
    suffix: '+',
    label: 'Resources',
    description: 'Published in our free Resource Library',
    icon: BookOpen,
    color: 'forest'
  }
]

const outcomes = [
  {
    stat: '100%',
    description: 'of students felt more financially confident after our lesson'
  },
  {
    stat: '89%',
    description: 'improvement between before and after our lesson assessments'
  },
  {
    stat: '95%',
    description: 'of teachers were satisfied with our library of resources'
  }
]

const colorClasses = {
  warm: 'bg-warm-100 text-warm-700',
  forest: 'bg-forest-100 text-forest-700',
  sage: 'bg-sage-100 text-sage-700'
}

export default function ImpactPage() {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        
        <div className="container-custom relative">
          <FadeIn className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 
                            text-forest-700 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" />
              <span>Our Impact</span>
            </div>
            
            <h1 className="heading-xl text-forest-900 mb-6">
              Making a Real{' '}
              <span className="text-gradient">Difference</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Since our founding, Project Bright Beginnings has touched the lives of thousands 
              of students worldwide. Here's a look at the impact we've made together.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Stats Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, idx) => (
              <FadeIn key={stat.label} delay={idx * 0.1}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="card text-center h-full"
                >
                  <div className={`w-16 h-16 rounded-2xl ${colorClasses[stat.color as keyof typeof colorClasses]} 
                                  flex items-center justify-center mx-auto mb-6`}>
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-4xl md:text-5xl font-display font-bold text-forest-800 mb-2">
                    <AnimatedCounter 
                      value={stat.value} 
                      prefix={stat.prefix} 
                      suffix={stat.suffix}
                    />
                  </div>
                  <div className="text-lg font-semibold text-forest-700 mb-2">{stat.label}</div>
                  <p className="text-gray-600 text-sm">{stat.description}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="section-padding bg-gradient-to-br from-forest-800 to-forest-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full 
                       border border-forest-700/30"
          />
        </div>

        <div className="container-custom relative">
          <FadeIn className="text-center mb-16">
            <h2 className="heading-lg text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-300 to-sage-400">
                Numbers Don't Lie
              </span>
            </h2>
            <p className="text-xl text-forest-200">
              Our programs consistently deliver measurable results.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {outcomes.map((outcome, idx) => (
              <FadeIn key={outcome.stat} delay={idx * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/10"
                >
                  <div className="text-5xl md:text-6xl font-display font-bold text-white mb-4">
                    {outcome.stat}
                  </div>
                  <p className="text-forest-200">
                    {outcome.description}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <h2 className="heading-lg text-forest-900 mb-6">
                Every Student Has a{' '}
                <span className="text-gradient-warm">Story</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Behind every statistic is a real student whose life has been touched by 
                financial literacy education. From learning to save their first dollar to 
                understanding the power of compound interest, our students are building 
                skills that will last a lifetime.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We've reached students in the United States, India, Mexico, and Canada, 
                delivering our resources through paper workbooks, picture books, and our 
                comprehensive online platform.
              </p>
              <Link href="/about" className="btn-primary gap-2 group">
                <span>Read Our Story</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </FadeIn>

            <FadeIn direction="right" delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="card bg-gradient-to-br from-forest-50 to-sage-50"
                >
                  <Globe className="w-10 h-10 text-forest-600 mb-4" />
                  <h3 className="font-display font-bold text-forest-800 text-lg mb-2">
                    Global Reach
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Resources distributed across 4 countries and counting
                  </p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="card bg-gradient-to-br from-warm-50 to-orange-50"
                >
                  <Award className="w-10 h-10 text-warm-600 mb-4" />
                  <h3 className="font-display font-bold text-forest-800 text-lg mb-2">
                    Proven Results
                  </h3>
                  <p className="text-gray-600 text-sm">
                    89% improvement in student assessments
                  </p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="card bg-gradient-to-br from-warm-50 to-orange-50"
                >
                  <Heart className="w-10 h-10 text-warm-600 mb-4" />
                  <h3 className="font-display font-bold text-forest-800 text-lg mb-2">
                    Community Support
                  </h3>
                  <p className="text-gray-600 text-sm">
                    $13.5k+ raised for financial literacy
                  </p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="card bg-gradient-to-br from-forest-50 to-sage-50"
                >
                  <Users className="w-10 h-10 text-forest-600 mb-4" />
                  <h3 className="font-display font-bold text-forest-800 text-lg mb-2">
                    Teacher Network
                  </h3>
                  <p className="text-gray-600 text-sm">
                    95% teacher satisfaction with our resources
                  </p>
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <h2 className="heading-lg text-forest-900 mb-6">
              Help Us Grow Our Impact
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Your support enables us to reach more students and provide free financial 
              literacy education to children around the world.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://www.paypal.com/donate/?hosted_button_id=YOURDONATIONLINK"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-warm gap-2"
              >
                <Heart className="w-4 h-4" />
                Donate Now
              </a>
              <Link href="/contact" className="btn-secondary">
                Partner With Us
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

