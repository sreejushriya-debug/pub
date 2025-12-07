'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Brain, Target, TrendingUp, Sparkles, 
  CheckCircle2, AlertCircle, HelpCircle, Play, Trophy,
  BarChart3, Clock, Zap
} from 'lucide-react'
import { 
  getConceptProgress, 
  getProgressSummary, 
  getWeakConcepts,
  getStrongConcepts,
  ALL_CONCEPTS,
  CONCEPT_DISPLAY_NAMES,
  ConceptScore
} from '@/lib/conceptProgress'
import PracticeSession from '@/components/PracticeSession'

export default function PracticeHub() {
  const { user, isLoaded } = useUser()
  const [summary, setSummary] = useState<ReturnType<typeof getProgressSummary> | null>(null)
  const [weakConcepts, setWeakConcepts] = useState<ConceptScore[]>([])
  const [strongConcepts, setStrongConcepts] = useState<ConceptScore[]>([])
  const [allConcepts, setAllConcepts] = useState<ConceptScore[]>([])
  const [showPractice, setShowPractice] = useState(false)
  const [practiceTopics, setPracticeTopics] = useState<string[]>([])

  useEffect(() => {
    if (user?.id) {
      loadProgress()
    }
  }, [user?.id])

  const loadProgress = () => {
    if (!user?.id) return
    
    const progress = getConceptProgress(user.id)
    setSummary(getProgressSummary(user.id))
    setWeakConcepts(getWeakConcepts(user.id))
    setStrongConcepts(getStrongConcepts(user.id))
    setAllConcepts(Object.values(progress.concepts))
  }

  const startPractice = (topics?: string[]) => {
    const topicsToUse = topics || weakConcepts.slice(0, 3).map(c => c.concept)
    setPracticeTopics(topicsToUse)
    setShowPractice(true)
  }

  const handlePracticeComplete = () => {
    setShowPractice(false)
    loadProgress() // Refresh data
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-100 text-green-700 border-green-300'
      case 'okay': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'struggling': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-gray-100 text-gray-500 border-gray-300'
    }
  }

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'strong': return <CheckCircle2 className="w-4 h-4" />
      case 'okay': return <AlertCircle className="w-4 h-4" />
      case 'struggling': return <HelpCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getStrengthLabel = (strength: string) => {
    switch (strength) {
      case 'strong': return 'Strong'
      case 'okay': return 'Needs Practice'
      case 'struggling': return 'Struggling'
      default: return 'Not Started'
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-forest-50 via-white to-sage-50 flex items-center justify-center">
        <div className="animate-pulse text-forest-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-forest-50 via-white to-sage-50">
        <div className="container-custom max-w-4xl text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign in to access your practice hub</h1>
          <Link href="/sign-in" className="btn-primary">Sign In</Link>
        </div>
      </div>
    )
  }

  // Practice session view
  if (showPractice) {
    return (
      <PracticeSession 
        userId={user.id}
        topics={practiceTopics}
        onComplete={handlePracticeComplete}
        onExit={() => setShowPractice(false)}
      />
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-forest-50 via-white to-sage-50">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/course/learn" 
            className="inline-flex items-center gap-2 text-forest-600 hover:text-forest-700 font-medium mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Course
          </Link>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-forest-500 to-forest-600 rounded-2xl flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Learning Hub</h1>
              <p className="text-gray-600">Track your progress and practice where you need it most</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Strong</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{summary.strong}</p>
              <p className="text-sm text-gray-500">concepts mastered</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 text-yellow-600 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Okay</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{summary.okay}</p>
              <p className="text-sm text-gray-500">need practice</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 text-red-600 mb-2">
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">Struggling</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{summary.struggling}</p>
              <p className="text-sm text-gray-500">need help</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 text-forest-600 mb-2">
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Overall</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{summary.overallScore}%</p>
              <p className="text-sm text-gray-500">accuracy</p>
            </motion.div>
          </div>
        )}

        {/* Fix My Gaps CTA */}
        {weakConcepts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-forest-600 to-forest-700 rounded-2xl p-6 mb-8 text-white"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Ready to improve?</h2>
                  <p className="text-white/80">
                    Bright has identified {weakConcepts.length} concept{weakConcepts.length > 1 ? 's' : ''} you can work on:{' '}
                    <span className="font-medium">
                      {weakConcepts.slice(0, 3).map(c => CONCEPT_DISPLAY_NAMES[c.concept] || c.concept).join(', ')}
                      {weakConcepts.length > 3 && ` +${weakConcepts.length - 3} more`}
                    </span>
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startPractice()}
                className="bg-white text-forest-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <Zap className="w-5 h-5" />
                Fix My Gaps
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* No data yet */}
        {summary && summary.notStarted === summary.totalConcepts && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center mb-8"
          >
            <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-forest-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Start Learning!</h3>
            <p className="text-gray-600 mb-6">
              Complete some quizzes and activities to see your progress here.
            </p>
            <Link href="/course/learn" className="btn-primary">
              Go to Course <Play className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        )}

        {/* All Concepts Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">All Concepts</h2>
            <p className="text-sm text-gray-500">Click on any concept to practice it specifically</p>
          </div>
          
          <div className="p-6">
            {/* Group by module */}
            {[1, 2, 3, 4, 5].map(moduleNum => {
              const moduleConcepts = ALL_CONCEPTS.filter(c => c.module === moduleNum)
              
              return (
                <div key={moduleNum} className="mb-6 last:mb-0">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Module {moduleNum}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {moduleConcepts.map(concept => {
                      const score = allConcepts.find(c => c.concept === concept.id)
                      const strength = score?.strength || 'not_started'
                      const percentage = score && score.total > 0 
                        ? Math.round((score.correct / score.total) * 100) 
                        : null

                      return (
                        <motion.button
                          key={concept.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => startPractice([concept.id])}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${getStrengthColor(strength)} hover:shadow-md`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{concept.name}</span>
                            {getStrengthIcon(strength)}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="opacity-75">{getStrengthLabel(strength)}</span>
                            {percentage !== null && (
                              <span className="font-semibold">{percentage}%</span>
                            )}
                          </div>
                          {score && score.total > 0 && (
                            <div className="mt-2 h-1.5 bg-black/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-current opacity-50 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Practice Sessions */}
        {/* Could add this later */}
      </div>
    </div>
  )
}

