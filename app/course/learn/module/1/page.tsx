'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Play,
  Lightbulb, Trophy, RotateCcw, ChevronRight
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

const STEP_TITLES: Record<Step, string> = {
  'kwl-pre': 'KWL Chart - Before You Start',
  'video-1.1': 'Video: Important Financial Terms',
  'activity-1.1a': 'Activity: Term Matching',
  'activity-1.1b': 'Activity: Lightning Quiz',
  'video-1.3': 'Video: Making Change',
  'activity-1.2a': 'Activity: Fill in the Blank',
  'activity-1.2b': 'Activity: Create Your Own Sentence',
  'activity-1.3a': 'Activity: Coin Identification',
  'activity-1.3b': 'Activity: Count the Coins',
  'kwl-post': 'KWL Chart - Reflection',
  'complete': 'Module Complete!'
}

export default function Module1Interactive() {
  const { user } = useUser()
  const [currentStep, setCurrentStep] = useState<Step>('kwl-pre')
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set())
  const [moduleData, setModuleData] = useState<Record<string, unknown>>({})

  // Load progress from localStorage
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`module1_progress_${user.id}`)
      if (saved) {
        const data = JSON.parse(saved)
        setCurrentStep(data.currentStep || 'kwl-pre')
        setCompletedSteps(new Set(data.completedSteps || []))
        setModuleData(data.moduleData || {})
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
    
    if (user?.id) {
      localStorage.setItem(`module1_progress_${user.id}`, JSON.stringify({
        currentStep: step,
        completedSteps: Array.from(newCompleted),
        moduleData: newModuleData
      }))
    }
  }

  const handleStepComplete = (data?: Record<string, unknown>) => {
    const currentIndex = STEPS.indexOf(currentStep)
    saveProgress(currentStep, data)
    
    if (currentIndex < STEPS.length - 1) {
      const nextStep = STEPS[currentIndex + 1]
      setCurrentStep(nextStep)
      
      if (user?.id) {
        const newCompletedArray = Array.from(completedSteps)
        newCompletedArray.push(currentStep)
        localStorage.setItem(`module1_progress_${user.id}`, JSON.stringify({
          currentStep: nextStep,
          completedSteps: newCompletedArray,
          moduleData: { ...moduleData, ...data }
        }))
      }
    }
  }

  const progressPercent = (STEPS.indexOf(currentStep) / (STEPS.length - 1)) * 100

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
            className="text-center py-12"
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
            <div className="flex justify-center gap-4">
              <Link href="/course/learn" className="btn-outline">
                Back to Dashboard
              </Link>
              <Link href="/course/learn/module/2" className="btn-primary">
                Start Module 2 <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-forest-50 via-white to-sage-50">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/course/learn" 
            className="inline-flex items-center gap-2 text-forest-600 hover:text-forest-700 font-medium mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Course
          </Link>
          
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

        {/* Step Indicator */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Current Activity</p>
          <p className="font-semibold text-gray-900">{STEP_TITLES[currentStep]}</p>
        </div>

        {/* Main Content Area */}
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
  )
}

