'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CreditCard, Ban, Loader2, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react'

interface Props { onComplete: (data: Record<string, unknown>) => void }

const SCENARIOS = [
  { 
    id: 1, 
    text: 'Your car breaks down and you need it to get to work. The repair costs $500 and you only have $100 saved.', 
    recommended: 'use',
    rubric: 'Recognizes this is a NEED (getting to work) and understands using credit for emergencies can make sense'
  },
  { 
    id: 2, 
    text: 'Your favorite band is having a concert and tickets are $150. You don\'t have the money right now but really want to go.', 
    recommended: 'dont',
    rubric: 'Recognizes this is a WANT, not a need, and understands saving up is better than using credit for wants'
  },
  { 
    id: 3, 
    text: 'You need a laptop for school starting next week. It costs $600 and you have $200 saved.', 
    recommended: 'use',
    rubric: 'Recognizes this is a NEED (for school) and time-sensitive, making credit reasonable'
  },
  { 
    id: 4, 
    text: 'A new video game just came out for $70. All your friends are playing it.', 
    recommended: 'dont',
    rubric: 'Recognizes this is a WANT and peer pressure isn\'t a good reason to use credit'
  },
]

interface FeedbackState {
  status: 'pending' | 'evaluating' | 'good_enough' | 'needs_revision'
  feedback: string
}

export default function Activity33C({ onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<number, { choice: string; reason: string }>>({})
  const [feedbackStates, setFeedbackStates] = useState<Record<number, FeedbackState>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChoice = (id: number, choice: 'use' | 'dont') => {
    setAnswers({ ...answers, [id]: { ...answers[id], choice } })
    // Reset feedback when choice changes
    setFeedbackStates({ ...feedbackStates, [id]: { status: 'pending', feedback: '' } })
  }

  const handleReason = (id: number, reason: string) => {
    setAnswers({ ...answers, [id]: { ...answers[id], reason } })
    // Reset feedback when editing
    if (feedbackStates[id]?.status === 'needs_revision') {
      setFeedbackStates({ ...feedbackStates, [id]: { status: 'pending', feedback: '' } })
    }
  }

  const allAnswered = SCENARIOS.every(s => answers[s.id]?.choice && answers[s.id]?.reason?.length > 10)
  const allAccepted = SCENARIOS.every(s => feedbackStates[s.id]?.status === 'good_enough')
  const needsRevision = SCENARIOS.some(s => feedbackStates[s.id]?.status === 'needs_revision')

  const submitForFeedback = async () => {
    setIsSubmitting(true)
    
    // Mark all as evaluating
    const newStates: Record<number, FeedbackState> = {}
    SCENARIOS.forEach(s => {
      if (feedbackStates[s.id]?.status !== 'good_enough') {
        newStates[s.id] = { status: 'evaluating', feedback: '' }
      } else {
        newStates[s.id] = feedbackStates[s.id]
      }
    })
    setFeedbackStates(newStates)

    try {
      // Only evaluate those not already accepted
      const toEvaluate = SCENARIOS.filter(s => feedbackStates[s.id]?.status !== 'good_enough')
      
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: toEvaluate.map(s => ({
            id: String(s.id),
            prompt: `Scenario: ${s.text}\nThe student chose: ${answers[s.id]?.choice === 'use' ? 'Use Credit' : 'Don\'t Use Credit'}\nExplain why this is a good or bad choice.`,
            studentAnswer: answers[s.id]?.reason || '',
            conceptTags: ['credit_decisions', 'needs_vs_wants'],
            questionType: 'concept_check',
            rubric: s.rubric
          })),
          attemptNumber: 1
        })
      })

      if (!response.ok) throw new Error('Failed to get feedback')

      const data = await response.json()
      
      const updatedStates = { ...feedbackStates }
      data.evaluations.forEach((e: { questionId: string; status: 'good_enough' | 'needs_revision'; feedback: string }) => {
        updatedStates[parseInt(e.questionId)] = {
          status: e.status,
          feedback: e.feedback
        }
      })
      setFeedbackStates(updatedStates)

    } catch (error) {
      console.error('Evaluation error:', error)
      // Reset to pending on error
      const resetStates: Record<number, FeedbackState> = {}
      SCENARIOS.forEach(s => {
        resetStates[s.id] = { status: 'pending', feedback: '' }
      })
      setFeedbackStates(resetStates)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="p-6 md:p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Great Thinking! 🤔</h2>
          <p className="text-gray-600">You thought carefully about when to use credit.</p>
        </div>

        <div className="space-y-4 mb-8">
          {SCENARIOS.map(s => {
            const answer = answers[s.id]
            const matchesRecommended = answer?.choice === s.recommended
            return (
              <div key={s.id} className={`p-4 rounded-xl border-2 ${matchesRecommended ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
                <p className="text-gray-700 text-sm mb-2">{s.text}</p>
                <p className={`font-medium ${matchesRecommended ? 'text-green-700' : 'text-amber-700'}`}>
                  Your choice: {answer?.choice === 'use' ? '✓ Use Credit' : '✗ Don\'t Use Credit'}
                </p>
                <p className="text-gray-600 text-sm mt-1 italic">&ldquo;{answer?.reason}&rdquo;</p>
              </div>
            )
          })}
        </div>

        <div className="flex justify-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => onComplete({ credit_scenarios: answers })} className="btn-primary px-8 py-3">
            Continue to Investing <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Activity 3.3C – Would You Use Credit?</h2>
        <p className="text-gray-600">Decide if you would use credit in each situation and explain why. Bright will check your reasoning!</p>
      </div>

      <div className="space-y-6 mb-8">
        {SCENARIOS.map(s => {
          const feedback = feedbackStates[s.id]
          return (
            <div key={s.id} className={`bg-white border-2 rounded-xl p-5 transition-all ${
              feedback?.status === 'good_enough' ? 'border-green-300 bg-green-50/50' :
              feedback?.status === 'needs_revision' ? 'border-amber-300 bg-amber-50/50' :
              'border-gray-200'
            }`}>
              <p className="text-gray-800 mb-4">{s.text}</p>
              
              <div className="flex gap-3 mb-4">
                <button onClick={() => handleChoice(s.id, 'use')}
                  disabled={feedback?.status === 'good_enough'}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                    answers[s.id]?.choice === 'use' ? 'border-forest-500 bg-forest-50 text-forest-700' : 'border-gray-200 hover:border-forest-300'
                  } ${feedback?.status === 'good_enough' ? 'opacity-60' : ''}`}>
                  <CreditCard className="w-5 h-5" /> Use Credit
                </button>
                <button onClick={() => handleChoice(s.id, 'dont')}
                  disabled={feedback?.status === 'good_enough'}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                    answers[s.id]?.choice === 'dont' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-red-300'
                  } ${feedback?.status === 'good_enough' ? 'opacity-60' : ''}`}>
                  <Ban className="w-5 h-5" /> Don&apos;t Use Credit
                </button>
              </div>

              {answers[s.id]?.choice && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Explain your reasoning:</label>
                  <textarea
                    value={answers[s.id]?.reason || ''}
                    onChange={(e) => handleReason(s.id, e.target.value)}
                    disabled={feedback?.status === 'good_enough'}
                    placeholder="I think this because..."
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500 h-20 resize-none ${
                      feedback?.status === 'good_enough' ? 'bg-green-50 border-green-200' : 'border-gray-200'
                    }`}
                  />
                </motion.div>
              )}

              {/* Feedback display */}
              <AnimatePresence>
                {feedback?.status === 'evaluating' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex items-center gap-2 text-forest-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Bright is reading your answer...</span>
                  </motion.div>
                )}

                {feedback?.status === 'good_enough' && feedback.feedback && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-green-100 rounded-lg border border-green-200">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800 text-sm mb-1">✅ Bright thinks this looks good!</p>
                        <p className="text-green-700 text-sm">{feedback.feedback}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {feedback?.status === 'needs_revision' && feedback.feedback && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-amber-100 rounded-lg border border-amber-200">
                    <div className="flex items-start gap-2">
                      <RefreshCw className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800 text-sm mb-1">🔁 Let&apos;s improve this a bit</p>
                        <p className="text-amber-700 text-sm">{feedback.feedback}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center gap-3">
        {!allAccepted && (
          <motion.button
            whileHover={allAnswered ? { scale: 1.02 } : {}}
            whileTap={allAnswered ? { scale: 0.98 } : {}}
            onClick={submitForFeedback}
            disabled={!allAnswered || isSubmitting}
            className="flex items-center gap-2 btn-primary px-8 py-3"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Getting Feedback...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> {needsRevision ? 'Resubmit' : 'Submit for Feedback'}</>
            )}
          </motion.button>
        )}

        {allAccepted && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSubmitted(true)}
            className="flex items-center gap-2 btn-accent px-8 py-3"
          >
            <CheckCircle2 className="w-5 h-5" /> Continue
          </motion.button>
        )}
      </div>
    </div>
  )
}
