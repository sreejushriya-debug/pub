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
import Activity61A from './activities/Activity61A'
import Activity61B from './activities/Activity61B'
import Activity62A from './activities/Activity62A'
import Activity62B from './activities/Activity62B'
import Activity62C from './activities/Activity62C'
import Activity63A from './activities/Activity63A'
import Activity63B from './activities/Activity63B'
import Activity63C from './activities/Activity63C'
import Activity63D from './activities/Activity63D'
import Activity64A from './activities/Activity64A'
import Activity64B from './activities/Activity64B'
import Activity65A from './activities/Activity65A'
import Activity65B from './activities/Activity65B'

type Step = 
  | 'kwl-pre'
  | 'activity-6.1a'
  | 'activity-6.1b'
  | 'activity-6.2a'
  | 'activity-6.2b'
  | 'activity-6.2c'
  | 'activity-6.3a'
  | 'activity-6.3b'
  | 'activity-6.3c'
  | 'activity-6.3d'
  | 'activity-6.4a'
  | 'activity-6.4b'
  | 'activity-6.5a'
  | 'activity-6.5b'
  | 'kwl-post'
  | 'complete'

const STEPS: Step[] = [
  'kwl-pre', 'activity-6.1a', 'activity-6.1b',
  'activity-6.2a', 'activity-6.2b', 'activity-6.2c',
  'activity-6.3a', 'activity-6.3b', 'activity-6.3c', 'activity-6.3d',
  'activity-6.4a', 'activity-6.4b',
  'activity-6.5a', 'activity-6.5b',
  'kwl-post', 'complete'
]

const STEP_INFO: Record<Step, { title: string; type: 'kwl' | 'activity' | 'complete' }> = {
  'kwl-pre': { title: 'KWL Chart - Before You Start', type: 'kwl' },
  'activity-6.1a': { title: 'Timed Matching Rounds', type: 'activity' },
  'activity-6.1b': { title: 'Category Sort', type: 'activity' },
  'activity-6.2a': { title: 'Build Your Shopping List', type: 'activity' },
  'activity-6.2b': { title: 'Apply Tax + Discounts', type: 'activity' },
  'activity-6.2c': { title: 'Shopping Reflection', type: 'activity' },
  'activity-6.3a': { title: 'Choose a Business', type: 'activity' },
  'activity-6.3b': { title: 'Set Costs and Prices', type: 'activity' },
  'activity-6.3c': { title: 'Tag Each Cost Type', type: 'activity' },
  'activity-6.3d': { title: 'Investor Pitch Reflection', type: 'activity' },
  'activity-6.4a': { title: 'Save, Spend, or Borrow?', type: 'activity' },
  'activity-6.4b': { title: 'Which Card Should They Use?', type: 'activity' },
  'activity-6.5a': { title: 'Final Challenge Quiz', type: 'activity' },
  'activity-6.5b': { title: 'Money Master Certificate', type: 'activity' },
  'kwl-post': { title: 'KWL Chart - Reflection', type: 'kwl' },
  'complete': { title: 'Course Complete!', type: 'complete' }
}

export default function Module6Interactive() {
  const { user } = useUser()
  const [currentStep, setCurrentStep] = useState<Step>('kwl-pre')
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set())
  const [moduleData, setModuleData] = useState<Record<string, unknown>>({})
  const [showNav, setShowNav] = useState(false)
  const [highestReached, setHighestReached] = useState<number>(0)

  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`module6_progress_${user.id}`)
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
      localStorage.setItem(`module6_progress_${user.id}`, JSON.stringify({
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
        localStorage.setItem(`module6_progress_${user.id}`, JSON.stringify({
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
      case 'activity-6.1a': return <Activity61A onComplete={handleStepComplete} />
      case 'activity-6.1b': return <Activity61B onComplete={handleStepComplete} />
      case 'activity-6.2a': return <Activity62A onComplete={handleStepComplete} />
      case 'activity-6.2b': return <Activity62B shoppingList={moduleData.shoppingList as { name: string; price: number; isNeed: boolean; discount?: number }[] || []} onComplete={handleStepComplete} />
      case 'activity-6.2c': return <Activity62C onComplete={handleStepComplete} />
      case 'activity-6.3a': return <Activity63A onComplete={handleStepComplete} />
      case 'activity-6.3b': return <Activity63B businessData={moduleData.businessData as { name: string; product: string; audience: string } || { name: '', product: '', audience: '' }} onComplete={handleStepComplete} />
      case 'activity-6.3c': return <Activity63C costs={moduleData.costs as { name: string; amount: number; type?: string }[] || []} onComplete={handleStepComplete} />
      case 'activity-6.3d': return <Activity63D onComplete={handleStepComplete} />
      case 'activity-6.4a': return <Activity64A onComplete={handleStepComplete} />
      case 'activity-6.4b': return <Activity64B onComplete={handleStepComplete} />
      case 'activity-6.5a': return <Activity65A onComplete={handleStepComplete} />
      case 'activity-6.5b': return <Activity65B quizScore={moduleData.quizScore as { correct: number; total: number } || { correct: 0, total: 0 }} onComplete={handleStepComplete} />
      case 'kwl-post': return <KWLPostActivity preKnow={moduleData.kwl_pre_know as string || ''} preWant={moduleData.kwl_pre_want as string || ''} onComplete={handleStepComplete} />
      case 'complete':
        return (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 px-6">
            <div className="w-24 h-24 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">🎉 Congratulations!</h2>
            <p className="text-lg text-gray-600 mb-8">You have completed the entire Financial Foundations course!</p>
            <div className="flex flex-col gap-3 max-w-md mx-auto">
              <Link href="/course/learn" className="inline-flex items-center justify-center px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-full transition-all">
                Back to Dashboard
              </Link>
              <button onClick={() => { setCurrentStep('kwl-pre'); setShowNav(true) }}
                className="inline-flex items-center justify-center px-4 py-2 border-2 border-gray-300 hover:border-forest-500 text-gray-700 hover:text-forest-600 font-medium rounded-full transition-all">
                <RotateCcw className="w-4 h-4 mr-2" /> Review Course
              </button>
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
            <h1 className="text-2xl font-bold text-gray-900">Module 6: Summary & Review</h1>
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

