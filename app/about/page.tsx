'use client'

import { motion } from 'framer-motion'
import { Heart, Target, Users, Lightbulb, Globe, BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import FadeIn from '@/components/FadeIn'

const values = [
  {
    icon: Heart,
    title: 'Accessibility',
    description: 'We believe financial education should be free and accessible to all students, regardless of their background or circumstances.'
  },
  {
    icon: Target,
    title: 'Empowerment',
    description: 'Our goal is to empower young minds with the knowledge and tools they need to make informed financial decisions.'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We work closely with teachers, parents, and communities to ensure our resources meet real-world needs.'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We continuously develop new and engaging ways to teach financial concepts to young learners.'
  }
]

const milestones = [
  { year: '2020', event: 'Project Bright Beginnings founded with a mission to make financial literacy accessible' },
  { year: '2021', event: 'Launched our first Financial Foundations curriculum for elementary students' },
  { year: '2022', event: 'Expanded to reach 10,000+ students across multiple states' },
  { year: '2023', event: 'Introduced our comprehensive Resource Library for teachers' },
  { year: '2024', event: 'Reached 29,000+ students in 4 countries worldwide' },
]

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        
        <div className="container-custom relative">
          <FadeIn className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 
                          text-forest-700 text-sm font-medium mb-6"
            >
              <Heart className="w-4 h-4" />
              <span>About Us</span>
            </motion.div>
            
            <h1 className="heading-xl text-forest-900 mb-6">
              Making Financial Education{' '}
              <span className="text-gradient">Accessible to All</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Project Bright Beginnings was founded with a simple yet powerful mission: to ensure 
              that every child has access to the financial education they need to build a secure 
              and prosperous future.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-forest-100 to-sage-100 
                                overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                      className="w-[80%] h-[80%] rounded-full border-2 border-dashed border-forest-200"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Globe className="w-32 h-32 text-forest-600" />
                    </div>
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-6"
                >
                  <div className="text-4xl font-display font-bold text-forest-700">4</div>
                  <div className="text-sm text-gray-500">Countries Reached</div>
                </motion.div>
              </div>
            </FadeIn>
            
            <FadeIn direction="right" delay={0.2}>
              <h2 className="heading-lg text-forest-900 mb-6">
                Our <span className="text-gradient-warm">Mission</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Our mission is to provide foundational tools that educate students on the 
                importance of financial education and make financial literacy accessible to all.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We believe that financial literacy is not just a skill—it's a fundamental 
                right that every child deserves. By starting early, we can help shape a 
                generation of financially confident individuals who are equipped to navigate 
                the complexities of the modern economy.
              </p>
              <Link href="/impact" className="btn-primary gap-2 group">
                <span>See Our Impact</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <FadeIn className="text-center mb-16">
            <h2 className="heading-lg text-forest-900 mb-4">
              Our <span className="text-gradient">Core Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at Project Bright Beginnings.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <FadeIn key={value.title} delay={idx * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="card h-full text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-forest-600 to-forest-500 
                                  flex items-center justify-center mx-auto mb-6 shadow-lg shadow-forest-200">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-forest-800 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <FadeIn className="text-center mb-16">
            <h2 className="heading-lg text-forest-900 mb-4">
              Our <span className="text-gradient-warm">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From a simple idea to a global movement for financial literacy.
            </p>
          </FadeIn>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, idx) => (
              <FadeIn key={milestone.year} delay={idx * 0.1}>
                <div className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-forest-600 to-forest-500 
                                    flex items-center justify-center text-white font-display font-bold
                                    shadow-lg shadow-forest-200">
                      {milestone.year}
                    </div>
                    {idx !== milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-forest-200 mt-4" />
                    )}
                  </div>
                  <div className="pt-4 pb-8">
                    <p className="text-lg text-gray-700">{milestone.event}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-forest-800 to-forest-900">
        <div className="container-custom">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <BookOpen className="w-16 h-16 text-sage-400 mx-auto mb-6" />
            <h2 className="heading-lg text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-forest-200 mb-8">
              Join us in our mission to provide financial literacy education to students worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/resources" className="btn-primary bg-white text-forest-800 hover:bg-gray-100">
                Explore Resources
              </Link>
              <Link href="/contact" className="btn-secondary border-white/30 text-white hover:bg-white/10">
                Get In Touch
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

