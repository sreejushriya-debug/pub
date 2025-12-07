'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Play,
  Lightbulb, Trophy, RotateCcw, ChevronRight, ChevronDown, ChevronUp,
  Circle, Lock, Menu, X
} from 'lucide-react'

// Import activity components
import KWLPreActivity from './activities/KWLPre'
import KWLPostActivity from './activities/KWLPost'
import Activity11A from './activities/Activity11A'
import Activity11B from './activities/Activity11B'
import Activity12A from './activities/Activity12A'
import Activity12B from './activities/Activity12B'
import Activity13A from './activities/Activity13A'
import Activity13B from './activities/Activity13B'
import VideoLesson from './activities/VideoLesson'

type Step = 
  | 'kwl-pre'
  | 'video-1.1'
  | 'activity-1.1a'
  | 'activity-1.1b'
  | 'video-1.3'
  | 'activity-1.2a'
  | 'activity-1.2b'
  | 'activity-1.3a'
  | 'activity-1.3b'
  | 'kwl-post'
  | 'complete'

const STEPS: Step[] = [
  'kwl-pre',
  'video-1.1',
  'activity-1.1a',
  'activity-1.1b',
  'video-1.3',
  'activity-1.2a',
  'activity-1.2b',
  'activity-1.3a',
  'activity-1.3b',
  'kwl-post',
  'complete'
]

const STEP_INFO: Record<Step, { title: string; type: 'kwl' | 'video' | 'activity' | 'complete' }> = {
  'kwl-pre': { title: 'KWL Chart - Before You Start', type: 'kwl' },
  'video-1.1': { title: 'Video: Important Financial Terms', type: 'video' },
  'activity-1.1a': { title: 'Term Matching', type: 'activity' },
  'activity-1.1b': { title: 'Lightning Quiz', type: 'activity' },
  'video-1.3': { title: 'Video: Making Change', type: 'video' },
  'activity-1.2a': { title: 'Fill in the Blank', type: 'activity' },
  'activity-1.2b': { title: 'Create Your Own Sentence', type: 'activity' },
  'activity-1.3a': { title: 'Coin Identification', type: 'activity' },
  'activity-1.3b': { title: 'Count the Coins', type: 'activity' },
  'kwl-post': { title: 'KWL Chart - Reflection', type: 'kwl' },
  'complete': { title: 'Module Complete!', type: 'complete' }
}

export default function Module1Interactive() {
  const { user } = useUser()
  const [currentStep, setCurrentStep] = useState<Step>('kwl-pre')
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set())
  const [moduleData, setModuleData] = useState<Record<string, unknown>>({})
  const [showNav, setShowNav] = useState(false)
  const [highestReached, setHighestReached] = useState<number>(0)

  // Load progress from localStorage
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`module1_progress_${user.id}`)
      if (saved) {
        const data = JSON.parse(saved)
        setCurrentStep(data.currentStep || 'kwl-pre')
        setCompletedSteps(new Set(data.completedSteps || []))
        setModuleData(data.moduleData || {})
        setHighestReached(data.highestReached || 0)
      }
    }
  }, [user?.id])

  // Save progress to localStorage
  const saveProgress = (step: Step, data?: Record<string, unknown>) => {
    const newCompleted = new Set(completedSteps)
    newCompleted.add(step)
    setCompletedSteps(newCompleted)
    
    const newModuleData = { ...moduleData, ...data }
    setModuleData(newModuleData)
    
    const stepIndex = STEPS.indexOf(step)
    const newHighest = Math.max(highestReached, stepIndex)
    setHighestReached(newHighest)
    
    if (user?.id) {
      localStorage.setItem(`module1_progress_${user.id}`, JSON.stringify({
        currentStep: step,
        completedSteps: Array.from(newCompleted),
        moduleData: newModuleData,
        highestReached: newHighest
      }))
    }
  }

  const handleStepComplete = (data?: Record<string, unknown>) => {
    const currentIndex = STEPS.indexOf(currentStep)
    saveProgress(currentStep, data)
    
    if (currentIndex < STEPS.length - 1) {
      const nextStep = STEPS[currentIndex + 1]
      setCurrentStep(nextStep)
      
      const newHighest = Math.max(highestReached, currentIndex + 1)
      setHighestReached(newHighest)
      
      if (user?.id) {
        const newCompletedArray = Array.from(completedSteps)
        newCompletedArray.push(currentStep)
        localStorage.setItem(`module1_progress_${user.id}`, JSON.stringify({
          currentStep: nextStep,
          completedSteps: newCompletedArray,
          moduleData: { ...moduleData, ...data },
          highestReached: newHighest
        }))
      }
    }
  }

  const canAccessStep = (step: Step): boolean => {
    const stepIndex = STEPS.indexOf(step)
    // Can access if already completed or if it's the next step after completed ones
    return stepIndex <= highestReached || completedSteps.has(step)
  }

  const goToStep = (step: Step) => {
    if (canAccessStep(step)) {
      setCurrentStep(step)
      setShowNav(false)
    }
  }

  const progressPercent = (STEPS.indexOf(currentStep) / (STEPS.length - 1)) * 100

  const getStepIcon = (step: Step, index: number) => {
    const isCompleted = completedSteps.has(step)
    const isCurrent = currentStep === step
    const canAccess = canAccessStep(step)
    
    if (isCompleted) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />
    }
    if (isCurrent) {
      return <div className="w-5 h-5 rounded-full bg-forest-500 animate-pulse" />
    }
    if (!canAccess) {
      return <Lock className="w-4 h-4 text-gray-300" />
    }
    return <Circle className="w-5 h-5 text-gray-300" />
  }

  const renderCurrentActivity = () => {
    switch (currentStep) {
      case 'kwl-pre':
        return <KWLPreActivity onComplete={handleStepComplete} />
      case 'video-1.1':
        return <VideoLesson 
          videoId="h2g8iOKdtnc" 
          title="Important Financial Terms"
          onComplete={handleStepComplete}
        />
      case 'activity-1.1a':
        return <Activity11A onComplete={handleStepComplete} />
      case 'activity-1.1b':
        return <Activity11B onComplete={handleStepComplete} />
      case 'video-1.3':
        return <VideoLesson 
          videoId="8pEPhilfwLU" 
          title="Making Change"
          onComplete={handleStepComplete}
        />
      case 'activity-1.2a':
        return <Activity12A onComplete={handleStepComplete} />
      case 'activity-1.2b':
        return <Activity12B 
          missedWords={moduleData.missedWords as string[] || []}
          onComplete={handleStepComplete}
        />
      case 'activity-1.3a':
        return <Activity13A onComplete={handleStepComplete} />
      case 'activity-1.3b':
        return <Activity13B onComplete={handleStepComplete} />
      case 'kwl-post':
        return <KWLPostActivity 
          preKnow={moduleData.kwl_pre_know as string || ''}
          preWant={moduleData.kwl_pre_want as string || ''}
          onComplete={handleStepComplete}
        />
      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 px-6"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🎉 Congratulations!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              You have completed Module 1: Financial Basics!
            </p>
            <div className="flex flex-col gap-3 max-w-md mx-auto">
              <Link href="/course/learn/module/2" className="btn-primary w-full justify-center">
                Start Module 2 <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setCurrentStep('kwl-pre')
                    setShowNav(true)
                  }}
                  className="btn-outline flex-1 justify-center"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> Practice
                </button>
                <Link href="/course/learn" className="btn-outline flex-1 justify-center">
                  Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-forest-50 via-white to-sage-50">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/course/learn" 
              className="inline-flex items-center gap-2 text-forest-600 hover:text-forest-700 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Course
            </Link>
            
            {/* Mobile Nav Toggle */}
            <button
              onClick={() => setShowNav(!showNav)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700"
            >
              {showNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              Activities
            </button>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Module 1: Financial Basics
            </h1>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercent)}% Complete
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-forest-500 to-forest-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* Activities Sidebar - Desktop */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-28">
              <h3 className="font-semibold text-gray-900 mb-4">Activities</h3>
              <div className="space-y-1">
                {STEPS.filter(s => s !== 'complete').map((step, index) => {
                  const info = STEP_INFO[step]
                  const isCurrent = currentStep === step
                  const canAccess = canAccessStep(step)
                  
                  return (
                    <button
                      key={step}
                      onClick={() => goToStep(step)}
                      disabled={!canAccess}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                        isCurrent 
                          ? 'bg-forest-100 text-forest-800' 
                          : canAccess
                          ? 'hover:bg-gray-100 text-gray-700'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {getStepIcon(step, index)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${isCurrent ? 'font-medium' : ''}`}>
                          {info.title}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">{info.type}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Mobile Nav Dropdown */}
          <AnimatePresence>
            {showNav && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="lg:hidden fixed inset-x-4 top-36 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 max-h-[60vh] overflow-y-auto"
              >
                <h3 className="font-semibold text-gray-900 mb-4">Activities</h3>
                <div className="space-y-1">
                  {STEPS.filter(s => s !== 'complete').map((step, index) => {
                    const info = STEP_INFO[step]
                    const isCurrent = currentStep === step
                    const canAccess = canAccessStep(step)
                    
                    return (
                      <button
                        key={step}
                        onClick={() => goToStep(step)}
                        disabled={!canAccess}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                          isCurrent 
                            ? 'bg-forest-100 text-forest-800' 
                            : canAccess
                            ? 'hover:bg-gray-100 text-gray-700'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {getStepIcon(step, index)}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${isCurrent ? 'font-medium' : ''}`}>
                            {info.title}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">{info.type}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Click outside to close mobile nav */}
          {showNav && (
            <div 
              className="lg:hidden fixed inset-0 z-40" 
              onClick={() => setShowNav(false)}
            />
          )}

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Current Activity Label */}
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Current Activity</p>
                  <p className="font-semibold text-gray-900">{STEP_INFO[currentStep].title}</p>
                </div>
                {completedSteps.has(currentStep) && currentStep !== 'complete' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>
            </div>

            {/* Activity Content */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCurrentActivity()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
