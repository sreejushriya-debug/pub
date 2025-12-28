'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  GraduationCap, BookOpen, Gamepad2, CheckCircle2, 
  ArrowRight, Clock, Users, Star, ChevronDown, ChevronUp,
  Sparkles, MessageCircle, BarChart3, RefreshCw, 
  Play, Award, Zap, Target, Brain, Loader2
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkglegpj'

const courseModules = [
  {
    id: 1,
    title: 'Financial Basics',
    description: 'Learn about different types of currency, important financial terms, and how to make change.',
    activities: 11
  },
  {
    id: 2,
    title: 'Saving and Spending',
    description: 'Understand healthy saving and spending habits, and learn how to create and follow a budget.',
    activities: 9
  },
  {
    id: 3,
    title: 'All Things Banking',
    description: 'Explore credit vs debit, investing basics, stock trends, and how to write a check.',
    activities: 8
  },
  {
    id: 4,
    title: 'Business',
    description: 'Learn about revenue, expenses, profit, and the basics of starting your own business.',
    activities: 10
  },
  {
    id: 5,
    title: 'Taxes',
    description: 'Understand what taxes are and learn how to calculate them.',
    activities: 5
  },
  {
    id: 6,
    title: 'Summary & Review',
    description: 'Review everything you\'ve learned and apply your new financial literacy skills.',
    activities: 6
  }
]

const featureCards = [
  {
    icon: Gamepad2,
    title: 'Interactive Activities',
    description: 'Matching games, timed rounds, fill-in-the-blank, and more!',
    image: '/activity2.png'
  },
  {
    icon: BarChart3,
    title: 'Learning Hub',
    description: 'Track your strengths and identify gaps to focus on.',
    image: '/learning hub.png'
  },
  {
    icon: MessageCircle,
    title: 'Bright Tutor',
    description: 'Get instant help during quizzes and activities.',
    image: '/mini bright.png'
  },
  {
    icon: RefreshCw,
    title: 'Instant Feedback',
    description: 'Resubmit answers and improve with AI guidance.',
    image: '/auto ai grader.png'
  }
]

const howItWorks = [
  {
    step: 1,
    title: 'Start a Module',
    description: 'Begin with a KWL chart to assess what you know and want to learn.',
    image: '/activity1.png'
  },
  {
    step: 2,
    title: 'Practice with Activities',
    description: 'Interactive exercises reinforce concepts through hands-on learning.',
    image: '/activity3.png'
  },
  {
    step: 3,
    title: 'Get Feedback & Fix Gaps',
    description: 'Review your progress and strengthen weak areas with Bright.',
    image: '/learning hub.png'
  }
]

export default function CoursePage() {
  const [email, setEmail] = useState('')
  const [agreeToEmails, setAgreeToEmails] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedModule, setExpandedModule] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !agreeToEmails) return

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'Financial Foundations Course Signup',
          agreedToEmails: agreeToEmails,
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          setIsSubmitted(false)
          setEmail('')
          setAgreeToEmails(false)
        }, 3000)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToCurriculum = () => {
    document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="pt-20">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-forest-700 via-forest-600 to-forest-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-forest-400 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm
                           text-white text-sm font-medium mb-6 border border-white/20"
              >
                <Sparkles className="w-4 h-4 text-accent-300" />
                <span>100% Free • AI-Powered Learning</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                The Fun Way to Learn{' '}
                <span className="text-accent-300">Money Skills</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Interactive activities, personalized AI tutoring, and instant feedback—
                designed for students ages 8-14.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link href="/sign-up">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white 
                             rounded-2xl font-bold text-lg shadow-xl shadow-accent-500/30 
                             transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Start Course Free
                  </motion.button>
                </Link>
                <motion.button
                  onClick={scrollToCurriculum}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white 
                           rounded-2xl font-semibold text-lg backdrop-blur-sm border border-white/20
                           transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  See Curriculum
                </motion.button>
              </div>

              {/* Proof Line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-white/80 text-sm"
              >
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <BookOpen className="w-4 h-4" /> 6 modules
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <Gamepad2 className="w-4 h-4" /> 45+ activities
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <Brain className="w-4 h-4" /> AI tutor
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <Award className="w-4 h-4" /> Certificate
                </span>
              </motion.div>
            </motion.div>

            {/* Right: Video Demo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/30 
                            border-4 border-white/20 bg-gray-900">
                {/* Video Frame Top Bar */}
                <div className="bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-400 text-sm ml-2 font-medium">Course Demo</span>
                </div>
                
                {/* Video */}
                <video
                  className="w-full aspect-video object-cover"
                  controls
                  poster="/home.png"
                  preload="metadata"
                >
                  <source src="/VIDEO WEBSITE (1).mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 
                          flex items-center gap-3 border border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-forest-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">310+</div>
                  <div className="text-sm text-gray-500">Students enrolled</div>
                </div>
              </motion.div>

              {/* Star Rating Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3 
                          flex items-center gap-2 border border-gray-100"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent-500 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">5.0</span>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ===== WHAT YOU GET - FEATURE CARDS ===== */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              What You <span className="text-forest-600">Get</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A complete learning experience with everything students need to master financial literacy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden 
                           shadow-lg shadow-gray-100 h-full"
                >
                  {/* Screenshot Thumbnail */}
                  <div className="relative h-36 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="p-5">
                    <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center mb-3">
                      <feature.icon className="w-5 h-5 text-forest-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              How It <span className="text-accent-500">Works</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A simple 3-step learning flow that makes financial education stick.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative"
              >
                {/* Connector Line */}
                {idx < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/4 right-0 w-full h-0.5 bg-gradient-to-r from-forest-200 to-forest-300 translate-x-1/2 z-0" />
                )}

                <div className="relative z-10 text-center">
                  {/* Step Number */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-forest-500 to-forest-600 
                                flex items-center justify-center mx-auto mb-6 shadow-lg shadow-forest-200
                                text-white font-black text-xl">
                    {step.step}
                  </div>

                  {/* Screenshot */}
                  <div className="relative h-48 mb-6 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover object-top"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURE DEEP DIVE: PRACTICE ===== */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 
                            text-forest-700 text-sm font-semibold mb-4">
                <Gamepad2 className="w-4 h-4" />
                Practice Activities
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                Learning That Feels Like <span className="text-forest-600">Playing</span>
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Term Matching</strong> — Connect vocabulary words to their definitions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Timed Rounds</strong> — Race against the clock to boost retention</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Fill-in-the-Blank</strong> — Apply concepts in real sentences</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                  <Image src="/activity2.png" alt="Term Matching" width={400} height={300} className="w-full" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 mt-8">
                  <Image src="/activity4.png" alt="Timed Rounds" width={400} height={300} className="w-full" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 col-span-2">
                  <Image src="/activity3.png" alt="Fill in Blank" width={800} height={300} className="w-full" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FEATURE DEEP DIVE: LEARNING HUB ===== */}
      <section className="py-20 bg-gradient-to-br from-forest-50 to-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <Image src="/learning hub.png" alt="Learning Hub" width={800} height={500} className="w-full" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-100 
                            text-accent-700 text-sm font-semibold mb-4">
                <BarChart3 className="w-4 h-4" />
                Learning Hub
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                See Exactly Where to <span className="text-accent-500">Improve</span>
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Strength tracking</strong> — Instantly see what you've mastered</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Gap identification</strong> — Know exactly what needs work</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>"Fix My Gaps"</strong> — One-click personalized practice</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FEATURE DEEP DIVE: BRIGHT TUTOR ===== */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 
                            text-forest-700 text-sm font-semibold mb-4">
                <MessageCircle className="w-4 h-4" />
                AI Tutor
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                Meet <span className="text-forest-600">Bright</span>, Your Personal Tutor
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Always available</strong> — Get help anytime during activities</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Context-aware</strong> — Knows exactly what you're working on</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-forest-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Kid-friendly</strong> — Explains concepts at your level</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center gap-6"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 max-w-sm">
                <Image src="/bright chat.png" alt="Bright Tutor" width={400} height={500} className="w-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FEATURE DEEP DIVE: AI FEEDBACK ===== */}
      <section className="py-20 bg-gradient-to-br from-accent-50 to-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <Image src="/auto ai grader.png" alt="AI Feedback" width={800} height={400} className="w-full" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-100 
                            text-accent-700 text-sm font-semibold mb-4">
                <Zap className="w-4 h-4" />
                Instant Feedback
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
                Learn From <span className="text-accent-500">Every Mistake</span>
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Instant evaluation</strong> — AI checks your open-ended answers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Specific guidance</strong> — Know exactly how to improve</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Resubmit & succeed</strong> — Try again with helpful hints</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CURRICULUM PREVIEW ===== */}
      <section id="curriculum" className="py-20 bg-white scroll-mt-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Course <span className="text-forest-600">Curriculum</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              6 comprehensive modules covering all the essentials of personal finance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {courseModules.map((module, idx) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  className="bg-white rounded-2xl border border-gray-100 p-6 h-full 
                           shadow-md hover:border-forest-200 transition-all cursor-pointer"
                  onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 
                                  flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {module.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">
                        {module.title}
                      </h3>
                      <p className="text-sm text-forest-600 font-medium mt-1">
                        {module.activities} activities
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      {expandedModule === module.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {expandedModule === module.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <p className="text-gray-600 text-sm mb-4 border-t border-gray-100 pt-4">
                        {module.description}
                      </p>
                      <Link 
                        href="/sign-up"
                        className="text-sm font-semibold text-forest-600 hover:text-forest-700 
                                 flex items-center gap-1 transition-colors"
                      >
                        Preview module <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CERTIFICATE SECTION ===== */}
      <section className="py-20 bg-gradient-to-br from-forest-600 via-forest-700 to-forest-800 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-accent-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-sm 
                            flex items-center justify-center mx-auto mb-8 border border-white/20">
                <Award className="w-12 h-12 text-accent-300" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-black text-white mb-4"
            >
              Complete the Course, <span className="text-accent-300">Earn Your Certificate</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/80 mb-10 max-w-2xl mx-auto"
            >
              Finish all 6 modules and receive a personalized certificate of completion 
              to celebrate your financial literacy journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white 
                           rounded-2xl font-bold text-lg shadow-xl shadow-accent-500/30 
                           transition-all flex items-center justify-center gap-2"
                >
                  <GraduationCap className="w-5 h-5" />
                  Start the Course Free
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== EMAIL SIGNUP SECTION ===== */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Stay Updated
              </h2>
              <p className="text-gray-600">
                Get notified about new features and course updates.
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
            >
              <div className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 
                           focus:outline-none focus:border-forest-400 focus:ring-2 
                           focus:ring-forest-100 transition-all bg-white"
                />

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={agreeToEmails}
                      onChange={(e) => setAgreeToEmails(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center
                      ${agreeToEmails 
                        ? 'bg-forest-600 border-forest-600' 
                        : 'border-gray-300 group-hover:border-gray-400'}`}>
                      {agreeToEmails && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">
                    Yes, I agree to receive emails about course updates
                  </span>
                </label>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!agreeToEmails || !email || isLoading}
                  className="w-full py-3 bg-forest-600 hover:bg-forest-700 text-white rounded-xl 
                           font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Signed up!</span>
                    </>
                  ) : isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Signing up...</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5" />
                      <span>Subscribe</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  )
}
