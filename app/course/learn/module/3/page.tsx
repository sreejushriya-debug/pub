'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, CheckCircle2, Trophy, RotateCcw, ChevronRight,
  Circle, Lock, Menu, X
} from 'lucide-react'

import KWLPreActivity from './activities/KWLPre'
import KWLPostActivity from './activities/KWLPost'
import VideoLesson from './activities/VideoLesson'
import Activity31A from './activities/Activity31A'
import Activity31B from './activities/Activity31B'
import Activity32B from './activities/Activity32B'
import Activity33A from './activities/Activity33A'
import Activity33B from './activities/Activity33B'
import Activity33C from './activities/Activity33C'
import Activity34A from './activities/Activity34A'
import Activity34B from './activities/Activity34B'
import Activity34C from './activities/Activity34C'
import Activity35A from './activities/Activity35A'
import Activity35B from './activities/Activity35B'
import Activity35C from './activities/Activity35C'
import Module3Quiz from './activities/Module3Quiz'

type Step = 
  | 'kwl-pre'
  | 'video-3.1'
  | 'activity-3.1a'
  | 'activity-3.1b'
  | 'activity-3.2b'
  | 'activity-3.3a'
  | 'activity-3.3b'
  | 'activity-3.3c'
  | 'video-3.4'
  | 'activity-3.4a'
  | 'activity-3.4b'
  | 'activity-3.4c'
  | 'video-3.5'
  | 'activity-3.5a'
  | 'activity-3.5b'
  | 'activity-3.5c'
  | 'kwl-post'
  | 'module-quiz'
  | 'complete'

const STEPS: Step[] = [
  'kwl-pre', 'video-3.1', 'activity-3.1a', 'activity-3.1b', 'activity-3.2b',
  'activity-3.3a', 'activity-3.3b', 'activity-3.3c', 'video-3.4',
  'activity-3.4a', 'activity-3.4b', 'activity-3.4c', 'video-3.5',
  'activity-3.5a', 'activity-3.5b', 'activity-3.5c', 'kwl-post', 'module-quiz', 'complete'
]

const STEP_INFO: Record<Step, { title: string; type: 'kwl' | 'video' | 'activity' | 'quiz' | 'complete' }> = {
  'kwl-pre': { title: 'KWL Chart - Before You Start', type: 'kwl' },
  'video-3.1': { title: 'Video: Credit & Debit', type: 'video' },
  'activity-3.1a': { title: 'Word Scramble', type: 'activity' },
  'activity-3.1b': { title: 'Flashcard Definitions', type: 'activity' },
  'activity-3.2b': { title: 'Categorize Banking Terms', type: 'activity' },
  'activity-3.3a': { title: 'Credit Terms Matching', type: 'activity' },
  'activity-3.3b': { title: 'Benefits vs Risks', type: 'activity' },
  'activity-3.3c': { title: 'Would You Use Credit?', type: 'activity' },
  'video-3.4': { title: 'Video: Investing', type: 'video' },
  'activity-3.4a': { title: 'Read the Stock Chart', type: 'activity' },
  'activity-3.4b': { title: 'Identify Trend Types', type: 'activity' },
  'activity-3.4c': { title: 'Investment Reflection', type: 'activity' },
  'video-3.5': { title: 'Video: Deposits & Checks', type: 'video' },
  'activity-3.5a': { title: 'Label Check Parts', type: 'activity' },
  'activity-3.5b': { title: 'Write Check #1 ($325)', type: 'activity' },
  'activity-3.5c': { title: 'Write Check #2 ($16,000)', type: 'activity' },
  'kwl-post': { title: 'KWL Chart - Reflection', type: 'kwl' },
  'module-quiz': { title: '📝 Module 3 Quiz', type: 'quiz' },
  'complete': { title: 'Module Complete!', type: 'complete' }
}

export default function Module3Interactive() {
  const { user } = useUser()
  const [currentStep, setCurrentStep] = useState<Step>('kwl-pre')
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set())
  const [moduleData, setModuleData] = useState<Record<string, unknown>>({})
  const [showNav, setShowNav] = useState(false)
  const [highestReached, setHighestReached] = useState<number>(0)

  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`module3_progress_${user.id}`)
      if (saved) {
        const data = JSON.parse(saved)
        setCurrentStep(data.currentStep || 'kwl-pre')
        setCompletedSteps(new Set(data.completedSteps || []))
        setModuleData(data.moduleData || {})
        setHighestReached(data.highestReached || 0)
      }
    }
  }, [user?.id])

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
      localStorage.setItem(`module3_progress_${user.id}`, JSON.stringify({
        currentStep: step, completedSteps: Array.from(newCompleted), moduleData: newModuleData, highestReached: newHighest
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
        localStorage.setItem(`module3_progress_${user.id}`, JSON.stringify({
          currentStep: nextStep, completedSteps: newCompletedArray, moduleData: { ...moduleData, ...data }, highestReached: newHighest
        }))
      }
    }
  }

  const canAccessStep = (step: Step): boolean => STEPS.indexOf(step) <= highestReached || completedSteps.has(step)
  const goToStep = (step: Step) => { if (canAccessStep(step)) { setCurrentStep(step); setShowNav(false) } }
  const progressPercent = (STEPS.indexOf(currentStep) / (STEPS.length - 1)) * 100

  const getStepIcon = (step: Step) => {
    if (completedSteps.has(step)) return <CheckCircle2 className="w-5 h-5 text-green-500" />
    if (currentStep === step) return <div className="w-5 h-5 rounded-full bg-forest-500 animate-pulse" />
    if (!canAccessStep(step)) return <Lock className="w-4 h-4 text-gray-300" />
    return <Circle className="w-5 h-5 text-gray-300" />
  }

  const renderCurrentActivity = () => {
    switch (currentStep) {
      case 'kwl-pre': return <KWLPreActivity onComplete={handleStepComplete} />
      case 'video-3.1': return <VideoLesson videoId="PxH38Ma6vBQ" title="Credit & Debit" onComplete={handleStepComplete} />
      case 'activity-3.1a': return <Activity31A onComplete={handleStepComplete} />
      case 'activity-3.1b': return <Activity31B onComplete={handleStepComplete} />
      case 'activity-3.2b': return <Activity32B onComplete={handleStepComplete} />
      case 'activity-3.3a': return <Activity33A onComplete={handleStepComplete} />
      case 'activity-3.3b': return <Activity33B onComplete={handleStepComplete} />
      case 'activity-3.3c': return <Activity33C onComplete={handleStepComplete} />
      case 'video-3.4': return <VideoLesson videoId="UGCDt28mSWM" title="Investing" onComplete={handleStepComplete} />
      case 'activity-3.4a': return <Activity34A onComplete={handleStepComplete} />
      case 'activity-3.4b': return <Activity34B onComplete={handleStepComplete} />
      case 'activity-3.4c': return <Activity34C onComplete={handleStepComplete} />
      case 'video-3.5': return <VideoLesson videoId="TAjNGLzHsh8" title="Deposits & Checks" onComplete={handleStepComplete} />
      case 'activity-3.5a': return <Activity35A onComplete={handleStepComplete} />
      case 'activity-3.5b': return <Activity35B onComplete={handleStepComplete} />
      case 'activity-3.5c': return <Activity35C onComplete={handleStepComplete} />
      case 'kwl-post': return <KWLPostActivity preKnow={moduleData.kwl_pre_know as string || ''} preWant={moduleData.kwl_pre_want as string || ''} onComplete={handleStepComplete} />
      case 'module-quiz': return <Module3Quiz onComplete={handleStepComplete} />
      case 'complete':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 px-6">
            <div className="w-24 h-24 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🎉 Congratulations!</h2>
            <p className="text-lg text-gray-600 mb-8">You have completed Module 3: All Things Banking!</p>
            <div className="flex flex-col gap-3 max-w-md mx-auto">
              <Link href="/course/learn/module/4" className="inline-flex items-center justify-center px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-full transition-all">
                Start Module 4 <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
              <div className="flex gap-3">
                <button onClick={() => { setCurrentStep('kwl-pre'); setShowNav(true) }}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border-2 border-gray-300 hover:border-forest-500 text-gray-700 hover:text-forest-600 font-medium rounded-full transition-all">
                  <RotateCcw className="w-4 h-4 mr-2" /> Practice
                </button>
                <Link href="/course/learn" className="flex-1 inline-flex items-center justify-center px-4 py-2 border-2 border-gray-300 hover:border-forest-500 text-gray-700 hover:text-forest-600 font-medium rounded-full transition-all">
                  Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        )
      default: return null
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-forest-50 via-white to-sage-50">
      <div className="container-custom max-w-5xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/course/learn" className="inline-flex items-center gap-2 text-forest-600 hover:text-forest-700 font-medium">
              <ArrowLeft className="w-5 h-5" /> Back to Course
            </Link>
            <button onClick={() => setShowNav(!showNav)} className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700">
              {showNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />} Activities
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Module 3: All Things Banking</h1>
            <span className="text-sm text-gray-500">{Math.round(progressPercent)}% Complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-forest-500 to-forest-600" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>

        <div className="flex gap-6">
          <div className="hidden lg:block w-72 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-28">
              <h3 className="font-semibold text-gray-900 mb-4">Activities</h3>
              <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                {STEPS.filter(s => s !== 'complete').map((step) => {
                  const info = STEP_INFO[step]
                  const isCurrent = currentStep === step
                  const canAccess = canAccessStep(step)
                  return (
                    <button key={step} onClick={() => goToStep(step)} disabled={!canAccess}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${isCurrent ? 'bg-forest-100 text-forest-800' : canAccess ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-400 cursor-not-allowed'}`}>
                      {getStepIcon(step)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${isCurrent ? 'font-medium' : ''}`}>{info.title}</p>
                        <p className="text-xs text-gray-400 capitalize">{info.type}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showNav && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="lg:hidden fixed inset-x-4 top-36 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 max-h-[60vh] overflow-y-auto">
                <h3 className="font-semibold text-gray-900 mb-4">Activities</h3>
                <div className="space-y-1">
                  {STEPS.filter(s => s !== 'complete').map((step) => {
                    const info = STEP_INFO[step]
                    const isCurrent = currentStep === step
                    const canAccess = canAccessStep(step)
                    return (
                      <button key={step} onClick={() => goToStep(step)} disabled={!canAccess}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${isCurrent ? 'bg-forest-100 text-forest-800' : canAccess ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-400 cursor-not-allowed'}`}>
                        {getStepIcon(step)}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${isCurrent ? 'font-medium' : ''}`}>{info.title}</p>
                          <p className="text-xs text-gray-400 capitalize">{info.type}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {showNav && <div className="lg:hidden fixed inset-0 z-40" onClick={() => setShowNav(false)} />}

          <div className="flex-1 min-w-0">
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
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
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

