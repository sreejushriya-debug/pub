'use client'

import { motion } from 'framer-motion'
import { Heart, Target, Users, Lightbulb, ArrowRight, CheckCircle, BookOpen, Globe } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import FloatingParticles from '@/components/FloatingParticles'

const founders = [
  {
    name: 'Shriya Sreeju',
    role: 'Co-Founder',
    image: '/founders/shriya.png'
  },
  {
    name: 'Hansika Kantheti',
    role: 'Co-Founder',
    image: '/founders/hansika.png'
  },
  {
    name: 'Tanisha Makam',
    role: 'Co-Founder',
    image: '/founders/tanisha.png'
  }
]

const values = [
  {
    icon: Heart,
    title: 'Accessibility',
    description: 'We believe financial education should be free and accessible to all students, regardless of their background or circumstances.',
    color: 'bg-red-50 text-red-600'
  },
  {
    icon: Target,
    title: 'Empowerment',
    description: 'Our goal is to empower young minds with the knowledge and tools they need to make informed financial decisions.',
    color: 'bg-forest-50 text-forest-600'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We work closely with teachers, parents, and communities to ensure our resources meet real-world needs.',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We continuously develop new and engaging ways to teach financial concepts to young learners.',
    color: 'bg-accent-50 text-accent-600'
  }
]

const problem = [
  'There are no textbooks targeted for elementary schoolers.',
  'Teachers don\'t have access to the resources in one place and have to scour the internet for hours.',
  'Resources that are free are especially rare which makes it hard for teachers and parents alike to want to teach their students.'
]

const solution = [
  'Fun and engaging videos and targeted worksheets for elementary schoolers',
  'Frequent educational seminars and a self-paced course for students.',
  'User-friendly and accessible resource library that is consistently updating.'
]

export default function AboutPage() {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-hero relative overflow-hidden">
        <FloatingParticles count={20} />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="heading-xl text-white mb-6">
              We're so glad you're here!
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              Our names are <span className="font-semibold text-accent-300">Shriya, Hansika, and Tanisha</span>, co-founders of 
              Project Bright Beginnings. We have a passion for all things finance which led us to discover 
              that there was an immense problem with financial education in America. That's how PBB started 
              and the rest is history.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="heading-lg text-gray-900 mb-4">
              Meet the <span className="text-forest-600">Founders</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our team contains three diligent workers who use their different strengths to work together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {founders.map((founder, idx) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="text-center"
                >
                  {/* Founder Photo with matching background */}
                  <div className="relative mx-auto mb-6 w-56 h-56 md:w-64 md:h-64">
                    {/* Background circle to match image backgrounds */}
                    <div className="absolute inset-0 rounded-full bg-[#d4e4d4]" />
                    {/* Green border */}
                    <div className="absolute inset-0 rounded-full border-[6px] border-forest-600" />
                    {/* Image container */}
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={founder.image}
                        alt={founder.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 224px, 256px"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {founder.name}
                  </h3>
                  <p className="text-accent-600 font-medium">
                    {founder.role}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section - Highlighted */}
      <section className="py-20 bg-gradient-to-br from-forest-600 to-forest-700 relative overflow-hidden">
        <FloatingParticles count={15} />
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Globe className="w-16 h-16 text-accent-300 mx-auto mb-6" />
            <h2 className="heading-lg text-white mb-6">
              Our Mission
            </h2>
            <p className="text-2xl text-white/90 leading-relaxed font-medium">
              Our mission is to provide foundational tools that educate students on the 
              importance of financial education and make financial literacy accessible to all.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* The Problem */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 md:p-10 h-full">
                <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">The Problem</span>
                <h2 className="heading-md text-gray-900 mt-2 mb-6">
                  Lack of Resources
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Many students wish that schools in America would teach them about financial topics, 
                  but one of the main reasons that's stopping districts is the lack of resources!
                </p>
                <ul className="space-y-4">
                  {problem.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 text-sm mt-0.5">✕</span>
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* The Solution */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-gradient-to-br from-forest-50 to-sage-50 rounded-3xl p-8 md:p-10 h-full">
                <span className="text-forest-600 font-semibold text-sm uppercase tracking-wider">The Solution</span>
                <h2 className="heading-md text-gray-900 mt-2 mb-6">
                  What We Provide
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  We work with the goal of you getting the resources you need to teach students 
                  the importance of financial education. You'll start seeing results right away!
                </p>
                <ul className="space-y-4">
                  {solution.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Core <span className="text-accent-500">Values</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at Project Bright Beginnings.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  className="card h-full text-center"
                >
                  <div className={`w-14 h-14 rounded-2xl ${value.color} 
                                  flex items-center justify-center mx-auto mb-5`}>
                    <value.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <BookOpen className="w-14 h-14 text-forest-600 mx-auto mb-6" />
            <h2 className="heading-lg text-gray-900 mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join us in our mission to provide financial literacy education to students worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/resources" className="btn-primary gap-2 group">
                <span>Explore Resources</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/contact" className="btn-secondary">
                Get In Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
