'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, CheckCircle2, Trophy, RotateCcw, ChevronRight,
  Circle, Lock, Menu, X
} from 'lucide-react'

// Import activity components
import KWLPreActivity from './activities/KWLPre'
import KWLPostActivity from './activities/KWLPost'
import VideoLesson from './activities/VideoLesson'
import Activity21A from './activities/Activity21A'
import Activity21B from './activities/Activity21B'
import Activity22A from './activities/Activity22A'
import Activity22B from './activities/Activity22B'
import Activity23A from './activities/Activity23A'
import Activity23B from './activities/Activity23B'
import Activity23C from './activities/Activity23C'
import Activity24A from './activities/Activity24A'
import Activity24B from './activities/Activity24B'
import Activity24C from './activities/Activity24C'
import Activity24D from './activities/Activity24D'

type Step = 
  | 'kwl-pre'
  | 'video-2.1'
  | 'activity-2.1a'
  | 'activity-2.1b'
  | 'activity-2.2a'
  | 'activity-2.2b'
  | 'activity-2.3a'
  | 'activity-2.3b'
  | 'activity-2.3c'
  | 'activity-2.4a'
  | 'activity-2.4b'
  | 'activity-2.4c'
  | 'activity-2.4d'
  | 'kwl-post'
  | 'complete'

const STEPS: Step[] = [
  'kwl-pre',
  'video-2.1',
  'activity-2.1a',
  'activity-2.1b',
  'activity-2.2a',
  'activity-2.2b',
  'activity-2.3a',
  'activity-2.3b',
  'activity-2.3c',
  'activity-2.4a',
  'activity-2.4b',
  'activity-2.4c',
  'activity-2.4d',
  'kwl-post',
  'complete'
]

const STEP_INFO: Record<Step, { title: string; type: 'kwl' | 'video' | 'activity' | 'complete' }> = {
  'kwl-pre': { title: 'KWL Chart - Before You Start', type: 'kwl' },
  'video-2.1': { title: 'Video: Spending & Saving Vocab', type: 'video' },
  'activity-2.1a': { title: 'Term Matching', type: 'activity' },
  'activity-2.1b': { title: 'Lightning Quiz', type: 'activity' },
  'activity-2.2a': { title: 'Save or Spend?', type: 'activity' },
  'activity-2.2b': { title: 'Written Justifications', type: 'activity' },
  'activity-2.3a': { title: 'Build Your Budget', type: 'activity' },
  'activity-2.3b': { title: 'Budget Pie Chart', type: 'activity' },
  'activity-2.3c': { title: 'Evaluate Your Budget', type: 'activity' },
  'activity-2.4a': { title: 'Pick Your Income', type: 'activity' },
  'activity-2.4b': { title: 'Choose Your Plans', type: 'activity' },
  'activity-2.4c': { title: 'Calculate Your Budget', type: 'activity' },
  'activity-2.4d': { title: 'Budget Reflection', type: 'activity' },
  'kwl-post': { title: 'KWL Chart - Reflection', type: 'kwl' },
  'complete': { title: 'Module Complete!', type: 'complete' }
}

export default function Module2Interactive() {
  const { user } = useUser()
  const [currentStep, setCurrentStep] = useState<Step>('kwl-pre')
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set())
  const [moduleData, setModuleData] = useState<Record<string, unknown>>({})
  const [showNav, setShowNav] = useState(false)
  const [highestReached, setHighestReached] = useState<number>(0)

  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`module2_progress_${user.id}`)
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
      localStorage.setItem(`module2_progress_${user.id}`, JSON.stringify({
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
        localStorage.setItem(`module2_progress_${user.id}`, JSON.stringify({
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
    return stepIndex <= highestReached || completedSteps.has(step)
  }

  const goToStep = (step: Step) => {
    if (canAccessStep(step)) {
      setCurrentStep(step)
      setShowNav(false)
    }
  }

  const progressPercent = (STEPS.indexOf(currentStep) / (STEPS.length - 1)) * 100

  const getStepIcon = (step: Step) => {
    const isCompleted = completedSteps.has(step)
    const isCurrent = currentStep === step
    const canAccess = canAccessStep(step)
    
    if (isCompleted) return <CheckCircle2 className="w-5 h-5 text-green-500" />
    if (isCurrent) return <div className="w-5 h-5 rounded-full bg-forest-500 animate-pulse" />
    if (!canAccess) return <Lock className="w-4 h-4 text-gray-300" />
    return <Circle className="w-5 h-5 text-gray-300" />
  }

  const renderCurrentActivity = () => {
    switch (currentStep) {
      case 'kwl-pre':
        return <KWLPreActivity onComplete={handleStepComplete} />
      case 'video-2.1':
        return <VideoLesson videoId="hSc_nJ4DF50" title="Spending & Saving Vocabulary" onComplete={handleStepComplete} />
      case 'activity-2.1a':
        return <Activity21A onComplete={handleStepComplete} />
      case 'activity-2.1b':
        return <Activity21B onComplete={handleStepComplete} />
      case 'activity-2.2a':
        return <Activity22A onComplete={handleStepComplete} />
      case 'activity-2.2b':
        return <Activity22B scenarios={moduleData.scenarios as Record<string, string> || {}} onComplete={handleStepComplete} />
      case 'activity-2.3a':
        return <Activity23A onComplete={handleStepComplete} />
      case 'activity-2.3b':
        return <Activity23B budgetData={moduleData.budgetData as { income: number; categories: { name: string; amount: number }[] } || { income: 100, categories: [] }} onComplete={handleStepComplete} />
      case 'activity-2.3c':
        return <Activity23C onComplete={handleStepComplete} />
      case 'activity-2.4a':
        return <Activity24A onComplete={handleStepComplete} />
      case 'activity-2.4b':
        return <Activity24B income={moduleData.selectedIncome as number || 3000} onComplete={handleStepComplete} />
      case 'activity-2.4c':
        return <Activity24C 
          income={moduleData.selectedIncome as number || 3000}
          needsPlan={moduleData.needsPlan as number || 500}
          wantsPlan={moduleData.wantsPlan as number || 200}
          savingsPlan={moduleData.savingsPlan as number || 100}
          onComplete={handleStepComplete} 
        />
      case 'activity-2.4d':
        return <Activity24D onComplete={handleStepComplete} />
      case 'kwl-post':
        return <KWLPostActivity 
          preKnow={moduleData.kwl_pre_know as string || ''}
          preWant={moduleData.kwl_pre_want as string || ''}
          onComplete={handleStepComplete}
        />
      case 'complete':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 px-6">
            <div className="w-24 h-24 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🎉 Congratulations!</h2>
            <p className="text-lg text-gray-600 mb-8">You have completed Module 2: Saving and Spending!</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => setShowNav(true)} className="btn-outline">
                <RotateCcw className="w-4 h-4 mr-2" /> Practice Activities
              </button>
              <Link href="/course/learn" className="btn-outline">Back to Dashboard</Link>
              <Link href="/course/learn/module/3" className="btn-primary">
                Start Module 3 <ChevronRight className="w-5 h-5" />
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
            <h1 className="text-2xl font-bold text-gray-900">Module 2: Saving and Spending</h1>
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
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                        isCurrent ? 'bg-forest-100 text-forest-800' : canAccess ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-400 cursor-not-allowed'
                      }`}>
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
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                          isCurrent ? 'bg-forest-100 text-forest-800' : canAccess ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-400 cursor-not-allowed'
                        }`}>
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

