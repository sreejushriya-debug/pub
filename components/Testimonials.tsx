'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'

const testimonials = [
  {
    quote: "Not only is the website aesthetically pleasing and easy to navigate, but the plethora of resources available also makes this such a valuable tool for teachers, especially first-year educators who may struggle to find effective and affordable tools.",
    author: "Nikki Minich",
    role: "9th grade teacher",
    organization: "Marcus High School",
    type: "teacher"
  },
  {
    quote: "I really like how this website is designed. It helped me understand a lot of financial topics, especially saving and spending!",
    author: "Satvik Sreeju",
    role: "3rd grader",
    organization: "",
    type: "student"
  },
  {
    quote: "The Financial Foundations course made learning about money fun and engaging. My students were excited to participate in every lesson.",
    author: "Sarah Johnson",
    role: "Elementary School Teacher",
    organization: "Flower Mound Elementary",
    type: "teacher"
  },
  {
    quote: "This program gave me the confidence to start saving my allowance. Now I understand why it's important to plan for the future!",
    author: "Emma Rodriguez",
    role: "5th grader",
    organization: "",
    type: "student"
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prev) => (prev + newDirection + testimonials.length) % testimonials.length)
  }

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1)
    }, 6000)
    return () => clearInterval(timer)
  }, [currentIndex])

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  }

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        w-[800px] h-[800px] rounded-full bg-forest-50/50 blur-3xl" />
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
            <span className="text-gradient">Numbers don't lie</span>
          </h2>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-forest-700">100%</div>
              <div className="text-sm text-gray-500">felt more financially confident</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-forest-700">89%</div>
              <div className="text-sm text-gray-500">improvement after our lessons</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-forest-700">95%</div>
              <div className="text-sm text-gray-500">teacher satisfaction rate</div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Category tabs */}
          <div className="flex justify-center gap-4 mb-12">
            <button 
              className="px-6 py-2 rounded-full text-sm font-medium bg-forest-100 text-forest-700"
            >
              We're loved by teachers...
            </button>
            <button 
              className="px-6 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              ...and students!!
            </button>
          </div>

          {/* Testimonial card */}
          <div className="relative min-h-[320px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-0"
              >
                <div className="card bg-gradient-to-br from-forest-50 to-sage-50 border-0 h-full flex flex-col justify-center">
                  {/* Quote icon */}
                  <Quote className="w-12 h-12 text-forest-300 mb-6" />
                  
                  {/* Quote text */}
                  <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-medium">
                    "{testimonials[currentIndex].quote}"
                  </blockquote>
                  
                  {/* Author info */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-forest-600 to-forest-500 
                                    flex items-center justify-center text-white font-bold text-lg">
                      {testimonials[currentIndex].author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-forest-800">
                        {testimonials[currentIndex].author}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonials[currentIndex].role}
                        {testimonials[currentIndex].organization && (
                          <span> • {testimonials[currentIndex].organization}</span>
                        )}
                      </div>
                    </div>
                    <div className="ml-auto flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-warm-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(-1)}
              className="w-12 h-12 rounded-full bg-white border border-gray-200 
                         flex items-center justify-center text-gray-600
                         hover:border-forest-300 hover:text-forest-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1)
                    setCurrentIndex(idx)
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? 'w-8 bg-forest-600' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(1)}
              className="w-12 h-12 rounded-full bg-white border border-gray-200 
                         flex items-center justify-center text-gray-600
                         hover:border-forest-300 hover:text-forest-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}

